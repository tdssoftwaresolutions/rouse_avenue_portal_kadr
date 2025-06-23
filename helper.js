const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const errorCodes = require('./errorCodes')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

const CaseTypes = Object.freeze({
  IN_PROGRESS: 'in_progress',
  CANCELLED: 'cancelled',
  CLOSED_NO_SUCCESS: 'closed_no_success',
  CLOSED_SUCCESS: 'closed_success',
  ESCALATED: 'escalated',
  FAILED: 'failed',
  NEW: 'new',
  ON_HOLD: 'on_hold',
  PENDING: 'pending'
})

const CaseSubTypes = Object.freeze({
  MEDIATOR_ASSIGNED: 'mediator_assigned',
  MEETING_SCHEDULED: 'meeting_scheduled',
  PENDING_COMPLAINANT_SIGNATURE: 'pending_complainant_signature',
  PENDING_RESPONDENT_SIGNATURE: 'pending_respondent_signature',
  PENDING_MEDIATION_CENTER: 'pending_mc'
})

class Helper {
  static generateRandomPassword (length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      password += chars[randomIndex]
    }

    return password
  }

  static async uploadFile (fileContent, fileName) {
    try {
      const axiosInstance = axios.create({
        timeout: 60000 // 60 seconds
      })
      const response = await axiosInstance.post(`${process.env.KADR_WEBSITE_URL}/services/upload.php`, {
        base64string: fileContent,
        filename: fileName
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.data
    } catch (err) {
      console.error('Upload failed:', err)
      return {
        'status': 'failed',
        'message': '',
        'stored_url': ''
      }
    }
  };

  static async addLanguagesToDatabase (languageKeys, prisma) {
    try {
      // Path to languages.json
      const filePath = path.join(__dirname, 'public', 'languages.json')

      // Read and parse the JSON file
      const languagesJson = JSON.parse(fs.readFileSync(filePath, 'utf8'))

      // Prepare the data for database insertion
      const languagesToInsert = languageKeys.map((key) => {
        if (languagesJson.languages[key]) {
          return {
            id: key,
            language: languagesJson.languages[key]
          }
        } else {
          console.warn(`Language key '${key}' not found in JSON.`)
          return null
        }
      }).filter(Boolean) // Remove nulls for missing keys

      // Insert the data into the database
      await prisma.available_languages.createMany({
        data: languagesToInsert,
        skipDuplicates: true // Prevent errors for existing keys
      })

      console.log('Languages added to database successfully!')
    } catch (error) {
      console.error('Error adding languages to database:', error)
    } finally {
      await prisma.$disconnect()
    }
  };

  static async getMediatorCasesCount (prisma, mediatorId) {
    return prisma.cases.count({
      where: {
        mediator: mediatorId,
        OR: [
          { status: CaseTypes.NEW },
          { status: CaseTypes.IN_PROGRESS }
        ]
      }
    })
  }

  static generateUniqueSignUpLink (userId) {
    const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, { expiresIn: '30d' })
    return `${process.env.BASE_URL}/admin/auth/sign-up?id=${token}`
  }

  static getTodaysEvents (casesWithEvents, personalEvents) {
    const caseEvents = casesWithEvents.flatMap(caseItem => {
      return (caseItem.events)
        .filter(event => {
          return new Date(event.start_datetime).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
        })
        .map(event => ({
          type: 'KADR',
          caseNumber: caseItem?.caseId,
          startDate: event.start_datetime,
          endDate: event.end_datetime,
          firstPartyName: caseItem?.user_cases_first_partyTouser?.name || 'N/A',
          secondPartyName: caseItem?.user_cases_second_partyTouser?.name || 'N/A',
          meetingLink: event.meeting_link
        }))
    })
    const pEvents = personalEvents.filter(event => {
      return new Date(event.start_datetime).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
    })
      .map(event => ({
        type: 'PERSONAL',
        caseNumber: '',
        startDate: event.start_datetime,
        endDate: event.end_datetime,
        firstPartyName: '',
        secondPartyName: '',
        meetingLink: event.meeting_link,
        title: event.title,
        description: event.description
      }))

    return caseEvents.concat(pEvents).sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  }

  static async getTodaysPersonalMeetings (prisma, mediatorId) {
    const today = new Date()
    const startOfToday = new Date(today.setHours(0, 0, 0, 0))
    const endOfToday = new Date(today.setHours(23, 59, 59, 999))
    return prisma.events.findMany({
      where: {
        created_by: mediatorId,
        type: 'PERSONAL',
        start_datetime: {
          gte: startOfToday, // Greater than or equal to the start of today
          lte: endOfToday // Less than or equal to the end of today
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        start_datetime: true,
        end_datetime: true,
        type: true,
        meeting_link: true
      }
    })
  }

  static async getClientNotifications (prisma, clientId) {
    return prisma.notifications.findMany({
      where: {
        user_id: clientId
      },
      orderBy: {
        created_at: 'desc'
      },
      select: {
        title: true,
        description: true,
        created_at: true
      }
    })
  }

  static async getCaseEvents (prisma) {
    return prisma.case_events.findMany({
      orderBy: {
        sequence: 'asc'
      },
      select: {
        id: true,
        status_id: true,
        sub_status_id: true,
        title: true,
        description: true,
        sequence: true
      }
    })
  }

  static mergeCaseHistory (myCases, caseEvents) {
    return myCases.map(caseItem => {
      const caseHistoryMap = new Map(
        caseItem.case_history.map(history => [history.case_event_id, history.created_at])
      )

      // Find the sequence number of the current event
      let currentSequence = null
      caseEvents.forEach(event => {
        if (`${event.status_id}__${event.sub_status_id}` === `${caseItem.case_statuses.id}__${caseItem.case_sub_statuses.id}`) {
          currentSequence = event.sequence - 1
        }
      })
      console.log(caseHistoryMap)
      console.log(caseEvents)
      // Merge caseEvents with caseHistory
      const updatedCaseHistory = caseEvents.map(event => ({
        ...event,
        created_date: caseHistoryMap.get(event.id) || null,
        completed: currentSequence !== null && event.sequence <= currentSequence
      }))

      return { ...caseItem, case_history: updatedCaseHistory }
    })
  }

  static async getClientCases (prisma, clientId, page) {
    const perPage = 10
    // Calculate the number of items to skip
    const skip = (page - 1) * perPage
    return prisma.cases.findMany({
      where: {
        AND: [
          {
            OR: [
              { first_party: clientId },
              { second_party: clientId }
            ]
          },
          {
            OR: [
              { status: CaseTypes.NEW },
              { status: CaseTypes.IN_PROGRESS }
            ]
          }
        ]
      },
      orderBy: {
        created_at: 'desc'
      },
      skip, // Skip items for pagination
      take: perPage, // Limit the number of items per page
      select: {
        id: true,
        description: true,
        category: true,
        case_type: true,
        caseId: true,
        evidence_document_url: true,
        case_statuses: {
          select: {
            id: true,
            name: true
          }
        },
        case_sub_statuses: {
          select: {
            id: true,
            name: true
          }
        },
        user_cases_first_partyTouser: {
          select: {
            id: true,
            preferred_languages: true,
            name: true,
            email: true,
            phone_number: true,
            state: true,
            city: true
          }
        },
        user_cases_mediatorTouser: {
          select: {
            id: true,
            name: true
          }
        },
        user_cases_second_partyTouser: {
          select: {
            id: true,
            preferred_languages: true,
            name: true,
            email: true,
            phone_number: true,
            state: true,
            city: true
          }
        },
        events: {
          orderBy: {
            created_at: 'desc'
          },
          select: {
            id: true,
            title: true,
            description: true,
            start_datetime: true,
            end_datetime: true,
            type: true,
            meeting_link: true
          }
        },
        case_history: {
          orderBy: {
            created_at: 'desc'
          },
          select: {
            id: true,
            case_event_id: true,
            created_at: true
          }
        }
      }
    })
  }

  static getEventsForToday (cases) {
    const today = new Date()
    const startOfToday = new Date(today.setHours(0, 0, 0, 0)) // Start of today
    const endOfToday = new Date(today.setHours(23, 59, 59, 999)) // End of today

    // Iterate over the cases array and filter events scheduled for today
    return cases.flatMap(caseItem => {
      // Filter events that are within today's date range
      const eventsToday = caseItem.events.filter(event => {
        const eventStart = new Date(event.start_datetime)
        const eventEnd = new Date(event.end_datetime)

        // Check if event start or end time is today
        return eventStart >= startOfToday && eventEnd <= endOfToday
      })

      // Return the filtered events along with required case details
      return eventsToday.map(event => ({
        ...event,
        caseId: caseItem.caseId,
        caseType: caseItem.case_type,
        caseFirstPartyName: caseItem.user_cases_first_partyTouser?.name,
        caseSecondPartyName: caseItem.user_cases_second_partyTouser?.name,
        case_id: caseItem.id // case.id if it's different from caseId
      }))
    })
  }

  static async saveBlog (prisma, blogData, authorId, status) {
    await prisma.$transaction(async (prisma) => {
      const blog = await prisma.blogs.upsert({
        where: {
          id: blogData.id || '-1'
        },
        update: {
          title: blogData.title, // Fields to update if the record exists
          content: blogData.content,
          author_id: authorId,
          status
        },
        create: {
          title: blogData.title,
          content: blogData.content,
          author_id: authorId,
          status
        }
      })

      if (blogData.categories && blogData.categories.length > 0) {
        const categoryIdsFromRequest = blogData.categories.map((category) => category.id)

        // Fetch existing categories for this blog
        const existingCategories = await prisma.blog_categories.findMany({
          where: { blog_id: blog.id }
        })
        const existingCategoryIds = existingCategories.map((c) => c.category_id)

        // Add new categories
        for (const categoryId of categoryIdsFromRequest) {
          await prisma.blog_categories.upsert({
            where: {
              blog_id_category_id: {
                blog_id: blog.id,
                category_id: categoryId
              }
            },
            update: {}, // No update needed
            create: {
              blog_id: blog.id,
              category_id: categoryId
            }
          })
        }

        // Remove categories that are no longer in the request
        const categoryIdsToRemove = existingCategoryIds.filter(
          (id) => !categoryIdsFromRequest.includes(id)
        )
        if (categoryIdsToRemove.length > 0) {
          await prisma.blog_categories.deleteMany({
            where: {
              blog_id: blog.id,
              category_id: { in: categoryIdsToRemove }
            }
          })
        }
      }
      if (blogData.tags && blogData.tags.length > 0) {
        const newTags = blogData.tags.filter((tag) => tag.id.startsWith('NEW-'))
        const existingTags = blogData.tags.filter((tag) => !tag.id.startsWith('NEW-'))

        // Create new tags
        const newTagRecords = await Promise.all(
          newTags.map(async (tag) => {
            const existingTag = await prisma.tags.findUnique({
              where: { name: tag.name }
            })
            if (existingTag) {
              // Reuse the existing tag's ID
              return existingTag
            } else {
              // Create a new tag
              return prisma.tags.create({
                data: {
                  name: tag.name
                }
              })
            }
          })
        )

        // Combine new tag IDs with existing ones
        const tagIdsFromRequest = [
          ...newTagRecords.map((tag) => tag.id),
          ...existingTags.map((tag) => tag.id)
        ]

        // Fetch existing tags for this blog
        const existingTagsForBlog = await prisma.blog_tags.findMany({
          where: { blog_id: blog.id }
        })
        const existingTagIds = existingTagsForBlog.map((t) => t.tag_id)

        // Add new tags
        for (const tagId of tagIdsFromRequest) {
          await prisma.blog_tags.upsert({
            where: {
              blog_id_tag_id: {
                blog_id: blog.id,
                tag_id: tagId
              }
            },
            update: {}, // No update needed
            create: {
              blog_id: blog.id,
              tag_id: tagId
            }
          })
        }

        // Remove tags that are no longer in the request
        const tagIdsToRemove = existingTagIds.filter(
          (id) => !tagIdsFromRequest.includes(id)
        )
        if (tagIdsToRemove.length > 0) {
          await prisma.blog_tags.deleteMany({
            where: {
              blog_id: blog.id,
              tag_id: { in: tagIdsToRemove }
            }
          })
        }
      }
    })
  }

  static async getBlogCountPerCategory (prisma) {
    return prisma.categories.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            blog_categories: true
          }
        }
      }
    })
  }

  static async getTop3LatestBlogs (prisma) {
    return prisma.blogs.findMany({
      orderBy: {
        created_at: 'desc'
      },
      take: 3
    })
  }

  static async getBlog (prisma, blogId) {
    return prisma.blogs.findUnique({
      where: {
        id: blogId
      },
      include: {
        user: true,
        blog_categories: {
          include: {
            categories: true // Fetch category details
          }
        },
        blog_tags: {
          include: {
            tags: true // Fetch tag details
          }
        }
      }
    })
  }

  static async getAllBlogs (prisma, page, search, category, author, tag) {
    const perPage = 10
    const skip = (page - 1) * perPage
    const filters = {
      status: 'Published'
    }
    if (search) {
      filters.OR = [
        { content: { contains: search } },
        { title: { contains: search } }
      ]
    }
    if (category) {
      filters.blog_categories = {
        some: {
          category_id: category
        }
      }
    }
    if (author) {
      filters.author_id = author
    }
    if (tag) {
      filters.blog_tags = {
        some: {
          tag_id: tag
        }
      }
    }
    return prisma.blogs.findMany({
      where: filters,
      orderBy: {
        created_at: 'desc' // Sort by created_at in descending order
      },
      skip, // Skip records for pagination
      take: perPage, // Limit the number of records per page
      include: {
        user: true,
        blog_categories: {
          include: {
            categories: true // Fetch category details
          }
        },
        blog_tags: {
          include: {
            tags: true // Fetch tag details
          }
        }
      }
    })
  }

  static async getMyBlogs (prisma, authorId, page) {
    const perPage = 10
    const skip = (page - 1) * perPage
    return prisma.blogs.findMany({
      where: {
        author_id: authorId // Filter by the provided authorId
      },
      orderBy: {
        created_at: 'desc' // Sort by created_at in descending order
      },
      skip, // Skip records for pagination
      take: perPage, // Limit the number of records per page
      include: {
        blog_categories: {
          include: {
            categories: true // Fetch category details
          }
        },
        blog_tags: {
          include: {
            tags: true // Fetch tag details
          }
        }
      }
    })
  }

  static async getBlogTags (prisma) {
    return prisma.tags.findMany()
  }

  static async getBlogCategories (prisma) {
    return prisma.categories.findMany()
  }

  static async getBlogsCount (prisma, authorId) {
    return prisma.blogs.count({
      where: {
        author_id: authorId
      }
    })
  }

  static async getAllBlogsCount (prisma, search, category, author, tag) {
    const filters = {
      status: 'Published'
    }
    if (search) {
      filters.OR = [
        { content: { contains: search } },
        { title: { contains: search } }
      ]
    }
    if (category) {
      filters.blog_categories = {
        some: {
          category_id: category
        }
      }
    }
    if (author) {
      filters.author_id = author
    }
    if (tag) {
      filters.blog_tags = {
        some: {
          tag_id: tag
        }
      }
    }
    return prisma.blogs.count({
      where: filters
    })
  }

  static async getJudgeCasesCount (prisma, judgeId) {
    return prisma.cases.count({
      where: {
        judge: judgeId,
        OR: [
          { status: CaseTypes.NEW },
          { status: CaseTypes.IN_PROGRESS }
        ]
      }
    })
  }

  static async getMediationCenterCasesCount (prisma) {
    return prisma.cases.count({
      where: {
        sub_status: CaseSubTypes.PENDING_MEDIATION_CENTER,
        OR: [
          { status: CaseTypes.NEW },
          { status: CaseTypes.IN_PROGRESS }
        ]
      }
    })
  }

  static async getMediationCenterCases (prisma, page) {
    const perPage = 10

    // Calculate the number of items to skip
    const skip = (page - 1) * perPage

    return prisma.cases.findMany({
      where: {
        sub_status: CaseSubTypes.PENDING_MEDIATION_CENTER,
        OR: [
          { status: CaseTypes.NEW },
          { status: CaseTypes.IN_PROGRESS }
        ]
      },
      orderBy: {
        created_at: 'desc'
      },
      skip, // Skip items for pagination
      take: perPage, // Limit the number of items per page
      select: {
        id: true,
        mediator: true,
        first_party: true,
        second_party: true,
        caseId: true,
        judge_document_url: true,
        nature_of_suit: true,
        stage: true,
        suit_no: true,
        status: true,
        hearing_count: true,
        sub_status: true,
        hearing_date: true,
        institution_date: true,
        mediation_date_time: true,
        referral_judge_signature: true,
        plaintiff_signature: true,
        plaintiff_phone: true,
        plaintiff_advocate: true,
        respondent_signature: true,
        respondent_phone: true,
        respondent_advocate: true,
        judge: true,
        user_cases_first_partyTouser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone_number: true,
            city: true,
            state: true
          }
        },
        user_cases_second_partyTouser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone_number: true,
            city: true,
            state: true
          }
        },
        user_cases_mediatorTouser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  static async getJudgeCases (prisma, judgeId, page) {
    const perPage = 10

    // Calculate the number of items to skip
    const skip = (page - 1) * perPage

    return prisma.cases.findMany({
      where: {
        judge: judgeId,
        OR: [
          { status: CaseTypes.NEW },
          { status: CaseTypes.IN_PROGRESS }
        ]
      },
      orderBy: {
        created_at: 'desc'
      },
      skip, // Skip items for pagination
      take: perPage, // Limit the number of items per page
      select: {
        id: true,
        mediator: true,
        first_party: true,
        second_party: true,
        caseId: true,
        judge_document_url: true,
        nature_of_suit: true,
        stage: true,
        suit_no: true,
        status: true,
        hearing_count: true,
        sub_status: true,
        hearing_date: true,
        institution_date: true,
        mediation_date_time: true,
        referral_judge_signature: true,
        plaintiff_signature: true,
        plaintiff_phone: true,
        plaintiff_advocate: true,
        respondent_signature: true,
        respondent_phone: true,
        respondent_advocate: true,
        judge: true,
        user_cases_first_partyTouser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone_number: true,
            city: true,
            state: true
          }
        },
        user_cases_second_partyTouser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone_number: true,
            city: true,
            state: true
          }
        },
        user_cases_mediatorTouser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  static async getMediatorCases (prisma, mediatorId, page) {
    // const today = new Date()
    // const startOfToday = new Date(today.setHours(0, 0, 0, 0))
    // const endOfToday = new Date(today.setHours(23, 59, 59, 999))
    const perPage = 10

    // Calculate the number of items to skip
    const skip = (page - 1) * perPage
    return prisma.cases.findMany({
      where: {
        mediator: mediatorId,
        OR: [
          { status: CaseTypes.NEW },
          { status: CaseTypes.IN_PROGRESS }
        ]
      },
      orderBy: {
        created_at: 'desc'
      },
      skip, // Skip items for pagination
      take: perPage, // Limit the number of items per page
      select: {
        id: true,
        description: true,
        category: true,
        case_type: true,
        caseId: true,
        evidence_document_url: true,
        status: true,
        user_cases_first_partyTouser: {
          select: {
            id: true,
            preferred_languages: true,
            name: true,
            state: true,
            city: true
          }
        },
        user_cases_second_partyTouser: {
          select: {
            id: true,
            name: true,
            state: true,
            city: true
          }
        },
        events: {
          orderBy: {
            created_at: 'desc'
          },
          select: {
            id: true,
            title: true,
            description: true,
            start_datetime: true,
            end_datetime: true,
            type: true,
            meeting_link: true
          }
        }
      }
    })
  }

  static async deployToS3Bucket (base64Content, fileName) {
    try {
      const s3 = new S3Client({
        region: 'eu-north-1',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
      })
      console.log(base64Content)
      // Extract file extension from base64 string
      const matches = base64Content.match(/^data:(.+);base64,(.+)$/)
      if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string')
      }
      const mimeType = matches[1]
      const fileBuffer = Buffer.from(matches[2], 'base64')
      const extension = mimeType.split('/')[1] // Extract extension from MIME type
      const fullFileName = `${fileName}.${extension}`

      // Upload to S3
      const params = {
        Bucket: 'kadr-files',
        Key: fullFileName,
        Body: fileBuffer,
        ContentType: mimeType
      }

      const command = new PutObjectCommand(params)
      await s3.send(command)

      return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`
    } catch (error) {
      console.error('Error uploading to S3:', error)
      throw error
    }
  }

  static async getUsers (isActive, prisma, page, type, relationField) {
    const perPage = 10

    // Calculate the number of items to skip
    const skip = (page - 1) * perPage

    let [inactiveUsers, totalInactiveUsers] = await prisma.$transaction([
      prisma.user.findMany({
        where: {
          AND: [
            { active: isActive },
            { is_self_signed_up: true },
            { user_type: type }
          ]
        },
        orderBy: {
          created_at: 'desc'
        },
        skip, // Skip items for pagination
        take: perPage, // Limit the number of items per page
        select: {
          id: true,
          name: true,
          email: true,
          phone_number: true,
          created_at: true,
          updated_at: true,
          user_type: true,
          active: true,
          city: true,
          state: true,
          pincode: true,
          is_self_signed_up: true,
          llb_college: true,
          llb_university: true,
          llb_year: true,
          mediator_course_year: true,
          mcpc_certificate_url: true,
          preferred_area_of_practice: true,
          llb_certificate_url: true,
          profile_picture_url: true,
          selected_hearing_types: true,
          bar_enrollment_no: true,
          preferred_languages: true,
          [relationField]: {
            select: {
              id: true,
              caseId: true,
              evidence_document_url: true,
              description: true,
              category: true,
              case_type: true,
              user_cases_second_partyTouser: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone_number: true
                }
              }
            }
          }
        }
      }),
      prisma.user.count({
        where: {
          AND: [
            { active: isActive },
            { is_self_signed_up: true },
            { user_type: type }
          ]
        }
      })
    ])

    inactiveUsers = inactiveUsers.map(user => {
      const caseData = user[relationField][0] || {}
      const otherPartyDate = user[relationField][0]?.user_cases_second_partyTouser || {}
      const caseId = caseData.id
      const userId = user.id
      const otherPartyUserId = otherPartyDate.id

      const flatUser = {
        ...otherPartyDate,
        ...caseData,
        ...user,
        caseId,
        userId,
        otherPartyUserId
      }
      delete flatUser[relationField]
      delete flatUser.user_cases_second_partyTouser
      delete flatUser.id
      return flatUser
    })

    // Send the response back to the client
    return {
      users: inactiveUsers,
      total: totalInactiveUsers,
      page,
      perPage
    }
  }

  static async hashPassword (password) {
    const saltRounds = 10 // You can adjust the number of salt rounds for more security
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  }

  static async comparePassword (enteredPassword, storedHash) {
    const isMatch = await bcrypt.compare(enteredPassword, storedHash)
    return isMatch
  }

  static verifyToken (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
          reject(err)
        } else {
          resolve(user) // Resolving with the decoded user object
        }
      })
    })
  }

  static async checkTokenAndFetch (req, res) {
    const token = req.headers.authorization

    if (!token) {
      req.error = { status: 401, message: errorCodes.NO_TOKEN_PROVIDED }
      return
    }

    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token

    try {
      const user = await this.verifyToken(tokenWithoutBearer)
      req.user = user
      return null
    } catch (err) {
      return { status: 401, message: errorCodes.TOKEN_EXPIRED }
    }
  }

  static verifySignature (data, signature) {
    // Create a new signature based on the data and compare it with the received signature
    const newSignature = this.signResponseData(data)
    return newSignature === signature
  }

  static signResponseData (data) {
    // Convert the data to a string, then hash it with the secret key
    const dataString = JSON.stringify(data)
    const signature = crypto.createHmac('sha256', process.env.SIGN_SECRET_KEY)
      .update(dataString)
      .digest('hex')
    return signature
  }

  static generateAccessToken (user) {
    return jwt.sign({ id: user.id, email: user.email, type: user.user_type ? user.user_type : user.type, name: user.name }, process.env.SECRET_KEY, { expiresIn: '1d' })
  }

  static generateRefreshToken (user) {
    return jwt.sign({ id: user.id, email: user.email, type: user.user_type ? user.user_type : user.type, name: user.name }, process.env.REFRESH_SECRET_KEY, { expiresIn: '7d' })
  }

  static async sendEmail (subject = 'Mail from kADR.live', emailId, htmlBody) {
    try {
      // Create a transporter
      const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com', // Replace with your SMTP server
        port: 465, // Use 587 for TLS or 465 for SSL
        secure: true, // True for SSL, false for TLS
        auth: {
          user: process.env.EMAIL_USER, // Your full email address
          pass: process.env.EMAIL_PASSWORD // Your email password
        }
      })
      // Email details
      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender's email address
        to: emailId, // Recipient's email address
        subject, // Subject line
        html: htmlBody
      }

      // Send the email
      const info = await transporter.sendMail(mailOptions)
      console.log('Email sent: ' + info.response)

      // Send a response to the client
      return { message: 'Email sent successfully', info: info.response }
    } catch (error) {
      return { message: 'Failed to send email', error }
    }
  }

  static async createSignatureTrackingRecord (prisma, userId, caseId) {
    try {
      const signatureExpiry = new Date()
      signatureExpiry.setHours(signatureExpiry.getHours() + 24) // Set expiry to 24 hours from now

      const record = await prisma.signature_tracking.create({
        data: {
          user_id: userId,
          case_id: caseId,
          signed: false,
          signature_expiry: signatureExpiry
        }
      })

      return record
    } catch (error) {
      console.error('Error creating signature tracking record:', error)
      throw error
    }
  }
}

module.exports = Helper
