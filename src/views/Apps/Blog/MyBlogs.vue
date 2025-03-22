<template>
  <div>
    <Alert :message="alert.message" :type="alert.type" v-model="alert.visible" :timeout="alert.timeout"></Alert>
    <Spinner :isVisible="loading" />
    <iq-card v-if="page === 'HOME'">
      <template v-slot:headerTitle>
        <h4 class="card-title">My Blogs</h4>
      </template>
      <template v-slot:headerAction>
          <b-button variant="success" size="sm" v-b-modal.modal-lg @click="newBlog" class="ml-2">
              New
          </b-button>
      </template>
      <template v-slot:body>
        <b-col md="12">
          <b-row>
            <b-col v-if="paginatedData.total > 0" md="12" class="table-responsive">
              <b-pagination
                v-model="currentPage"
                :total-rows="paginatedData.total"
                :per-page="perPage"
                align="center"
                class="mt-3"
                @input="fetchBlogs"
              />
              <b-table bordered hover :items="paginatedData.formattedBlogs" :fields="columns" responsive="sm" >
                <template v-slot:cell(content)="data">
                  <div class="ellipsis-text">{{ data.item.content }}</div>
                </template>
                <template v-slot:cell(title)="data">
                  <a href="#" @click="onClickBlog(data.item)">{{ data.item.title }}</a>
                </template>
                <template v-slot:cell(created_at)="data">
                  {{ data.item.created_at }}
                </template>
                <template v-slot:cell(categories)="data">
                  <b-badge v-for="category in data.item.categories" class="margin-left" :key="category.id" pill variant="success">{{ category.name }}</b-badge>
                </template>
                <template v-slot:cell(tags)="data">
                  <b-badge v-for="tag in data.item.tags" :key="tag.id"  class="margin-left" pill variant="success">{{ tag.name }}</b-badge>
                </template>
                <template v-slot:cell(status)="data">
                  <b-badge pill :variant="getVariant(data.item.status)">{{data.item.status}}</b-badge>
                </template>
              </b-table>
            </b-col>
            <b-col v-else >
              <h2 style="text-align: center;">No blog found!</h2>
            </b-col>
          </b-row>
        </b-col>
      </template>
    </iq-card>
    <iq-card v-if="page == 'VIEW_EDIT'">
      <template v-slot:headerTitle>
        <h4 class="card-title">{{ selectedBlog.title }}</h4>
      </template>
      <template v-slot:headerAction>
        <button type="button" class="btn btn-secondary" @click="saveToDraft" v-if="selectedBlog.status != 'Published'">
          Save to Draft
        </button>
        <button type="submit" class="btn btn-primary" @click="publishBlog">Publish</button>
        <button type="button" class="btn btn-danger" @click="cancel">
          Cancel
        </button>
      </template>
      <template v-slot:body>
        <!-- Title -->
        <div class="mb-3">
          <label for="title" class="form-label fw-semibold">Title</label>
          <input
            id="title"
            v-model="selectedBlog.title"
            type="text"
            class="form-control"
            placeholder="Enter blog title"
            required
          />
        </div>

        <!-- Category -->
        <div class="mb-3">
          <div class="form-group">
            <label for="category" class="form-label fw-semibold">Category</label>
            <div class="d-flex flex-wrap" style="height: 60px;overflow-y: scroll;">
              <div
                v-for="(option, index) in blogAssets.blogCategories"
                :key="index"
                class="option-card"
                :class="{
                  selected: selectedBlog.categories.some(category => category.id === option.id),
                  disabled: selectedBlog.categories.length >= 3 && !selectedBlog.categories.some(category => category.id === option.id)
                }"
                @click="toggleSelection(option)">
                {{ option.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div class="mb-3">
          <label for="tags" class="form-label fw-semibold">Tags</label>
          <div class="tags-container mb-2">
              <b-badge v-for="(tag, index) in selectedBlog.tags" class="badge_tag margin-left" :key="tag.id" pill variant="success">{{ tag.name }}
              <button  type="button" class="btn-close btn-close-white ms-1" aria-label="Remove" @click="removeTag(index)" style="min-width:15px;color:white;background: transparent;border:0px;font-size:21px;">×</button>
            </b-badge>
          </div>

          <!-- Tag Input -->
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="newTag"
              placeholder="Search or add a new tag"
              @input="searchTags"
              @keyup.enter="addTag"
            />
            <button
              class="btn btn-outline-primary"
              type="button"
              @click="addTag"
            >
              Add
            </button>
          </div>

          <!-- Suggestions Dropdown -->
          <ul
            v-if="tagSuggestions.length"
            class="list-group position-absolute mt-1 shadow-sm"
            style="z-index: 1050; max-height: 150px; overflow-y: auto; width: 66%; box-sizing: border-box"
          >
            <li
              v-for="(suggestion, index) in tagSuggestions"
              :key="index"
              class="list-group-item list-group-item-action"
              @click="selectTag(suggestion)"
            >
              {{ suggestion.name }}
            </li>
          </ul>
        </div>

        <!-- Description (Rich Text Editor) -->
        <div class="mb-3">
          <label for="description" class="form-label fw-semibold">Content</label>
          <vue2-tinymce-editor v-model="selectedBlog.content" :options="options"></vue2-tinymce-editor>
        </div>

        <!-- Buttons -->
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary" @click="saveToDraft" v-if="selectedBlog.status != 'Published'">
            Save to Draft
          </button>
          <button type="submit" class="btn btn-primary" @click="publishBlog">Publish</button>
          <button type="button" class="btn btn-danger" @click="cancel">
            Cancel
          </button>
        </div>
      </template>
    </iq-card>
    <iq-card v-if="page == 'NEW'">
      <template v-slot:headerTitle>
        <h4 class="card-title">New Blog</h4>
      </template>
      <template v-slot:headerAction>
          <b-button variant="success" size="sm" v-b-modal.modal-lg @click="saveBlog" class="ml-2">
              Save
          </b-button>
      </template>
      <template v-slot:body>

      </template>
    </iq-card>
  </div>
</template>
<script>
import { sofbox } from '../../../config/pluginInit'
import Alert from '../../../components/sofbox/alert/Alert.vue'
import Spinner from '../../../components/sofbox/spinner/spinner.vue'
import 'quill/dist/quill.snow.css'
import { Vue2TinymceEditor } from 'vue2-tinymce-editor'

export default {
  name: 'MyBlogs',
  components: {
    Alert, Spinner, Vue2TinymceEditor
  },
  mounted () {
    sofbox.index()
    this.fetchBlogs(1)
  },
  methods: {
    formatDateTime (dateString) {
      console.log(dateString)
      const date = new Date(dateString)
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
      return new Intl.DateTimeFormat('en-US', options).format(date)
    },
    toggleSelection (option) {
      console.log(option)
      if (this.selectedBlog.categories.some(category => category.id === option.id)) {
        this.selectedBlog.categories = this.selectedBlog.categories.filter(item => item.id !== option.id)
      } else if (this.selectedBlog.categories.length < 3) {
        this.selectedBlog.categories.push(option)
      }
    },
    searchTags () {
      if (this.newTag.trim() === '') {
        this.tagSuggestions = []
        return
      }
      this.tagSuggestions = this.blogAssets.blogTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(this.newTag.toLowerCase()) &&
          !this.selectedBlog.tags.some(lTag => lTag.id === tag.id)
      )
    },
    addTag () {
      const tag = this.newTag.trim()
      if (tag && !this.selectedBlog.tags.some(lTag => lTag.id === tag.id)) {
        this.selectedBlog.tags.push({ id: `NEW-${this.tempTagId}`, name: tag })
        if (!this.blogAssets.blogTags.some(tag => tag.name === tag)) {
          this.blogAssets.blogTags.push({ id: `NEW-${this.tempTagId}`, name: tag }) // store in database!
        }
      }
      this.tempTagId++
      this.newTag = ''
      this.tagSuggestions = []
    },
    selectTag (selectedTag) {
      if (!this.selectedBlog.tags.some(tag => tag.id === selectedTag.id)) {
        this.selectedBlog.tags.push(selectedTag)
      }
      this.newTag = ''
      this.tagSuggestions = []
    },
    removeTag (index) {
      this.selectedBlog.tags.splice(index, 1)
    },
    async saveToDraft () {
      this.loading = true
      const response = await this.$store.dispatch('saveBlog', {
        blog: this.selectedBlog,
        status: 'Draft'
      })
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
        this.loading = false
      } else {
        this.showAlert('Blog saved to draft!', 'success')
        this.loading = false
        if (!this.selectedBlog.id) {
          this.selectedBlog.created_at = new Date().toISOString()
          this.selectedBlog.status = 'Draft'
          this.paginatedData.formattedBlogs.unshift(this.selectedBlog)
        }
        this.cancel()
      }
    },
    cancel () {
      this.page = 'HOME'
    },
    async publishBlog () {
      this.loading = true
      const response = await this.$store.dispatch('saveBlog', {
        blog: this.selectedBlog,
        status: 'Published'
      })
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
        this.loading = false
      } else {
        this.showAlert('Blog published succesfully!', 'success')
        this.loading = false
        if (!this.selectedBlog.id) {
          this.selectedBlog.created_at = new Date().toISOString()
          this.selectedBlog.status = 'Published'
          this.paginatedData.formattedBlogs.unshift(this.selectedBlog)
        }
        console.log(this.paginatedData)
        this.cancel()
      }
    },
    onClickBlog (blogRecord) {
      this.page = 'VIEW_EDIT'
      this.selectedBlog = blogRecord
    },
    newBlog () {
      this.page = 'VIEW_EDIT'
    },
    getVariant (status) {
      switch (status) {
        case 'Draft':
          return 'secondary'
        case 'Published':
          return 'success'
      }
    },
    showAlert (message, type) {
      this.alert = {
        message,
        type,
        visible: true
      }
    },
    async fetchBlogs (newPage) {
      this.currentPage = newPage
      if (this.blogsCache[this.currentPage]) {
        this.paginatedData = this.blogsCache[this.currentPage]
        return
      }
      const response = await this.$store.dispatch('getMyBlogs', {
        page: this.currentPage
      })
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
      } else {
        this.blogsCache[this.currentPage] = response
        this.paginatedData = response
      }
      this.fetchBlogAssets()
    },
    async fetchBlogAssets () {
      const response = await this.$store.dispatch('getBlogAssets')
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
      } else {
        this.blogAssets = response
      }
    }
  },
  data () {
    return {
      page: 'HOME',
      tempTagId: 0,
      selectedBlog: {
        categories: [],
        title: '',
        status: '',
        tags: [],
        content: ''
      },
      currentPage: 1,
      newTag: '',
      tagSuggestions: [],
      perPage: 10,
      blogAssets: {},
      paginatedData: {},
      options: {
        height: 800,
        plugins: [
          'autosave lists link image table media fullscreen color preview',
          'paste charmap hr anchor insertdatetime wordcount'
        ],
        toolbar: [
          'undo redo | formatselect | fontselect fontsizeselect | bold italic underline strikethrough |',
          'forecolor backcolor | alignleft aligncenter alignright alignjustify |',
          'bullist numlist outdent indent | table | link image media | fullscreen preview | restoredraft'
        ].join(' '),
        menubar: 'file edit view insert format tools table help',
        branding: false,
        image_title: true,
        automatic_uploads: true,
        autosave_interval: '20s',
        autosave_retention: '30m',
        file_picker_types: 'image',
        file_picker_callback: (callback, value, meta) => {
          const ref = this
          if (meta.filetype === 'image') {
            ref.loading = true
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')
            input.onchange = function () {
              const file = input.files[0]
              const maxFileSizeMB = 1
              const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024
              if (file.size > maxFileSizeBytes) {
                alert(`The file size exceeds the ${maxFileSizeMB} MB limit.`)
                ref.loading = false
                return
              }

              const reader = new FileReader()
              reader.onload = function (e) {
                callback(e.target.result, { alt: file.name })
                console.log('completed')
                ref.loading = false
              }
              reader.onerror = function () {
                alert('Failed to load the file. Please try again.')
                ref.loading = false
              }
              reader.readAsDataURL(file)
            }
            input.click()
          }
        },
        media_live_embeds: true,
        setup: function (editor) {
          editor.addShortcut('ctrl+s', 'Save', function () {
            console.log('Saved!')
          })
        },
        image_caption: true,
        image_dimensions: true,
        media_alt_source: true,
        media_poster: true,
        spellchecker_dialog: true,
        browser_spellcheck: true,
        contextmenu: false,
        content_style: `
          body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            line-height: 1.6;
          }
        `,
        wordcount_countregex: /[\w\u2019\x27-]+/g,
        wordcount_cleanregex: /<\/?[a-z][^>]*>/g
      },
      columns: [
        { label: 'Title', key: 'title', class: 'text-left', sortable: true },
        { label: 'Date', key: 'created_at', class: 'text-left', sortable: true },
        { label: 'Categories', key: 'categories', class: 'text-left', sortable: true },
        { label: 'Tags', key: 'tags', class: 'text-left', sortable: true },
        { label: 'Status', key: 'status', class: 'text-left', sortable: true }
      ],
      blogsCache: {},
      alert: {
        visible: false,
        message: '',
        timeout: 5000,
        type: 'primary'
      },
      loading: false
    }
  }
}
</script>
<style scoped>
.ml {
    margin-left: 0.5rem;
}
/* Add space between key and value */
ul li span {
  display: flex;
  align-items: center;
}

ul li span strong {
  margin-right: 8px; /* Add space between key (bold) and value */
}
.ellipsis-text {
  width: 200px;           /* Set a specific width */
  white-space: nowrap;    /* Prevent text from wrapping to the next line */
  overflow: hidden;       /* Hide any overflow text */
  text-overflow: ellipsis; /* Add the ellipsis (...) */
  display: block;         /* Ensure it's treated as a block element */
}
.card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  border-bottom: none;
}

.card-body {
  padding: 20px;
  background: #f9f9f9;
}

button {
  min-width: 120px;
}

.rich-text-editor {
  border: 1px solid #ced4da;
  border-radius: 4px;
  min-height: 300px; /* Adjust height */
  max-height: 500px; /* Optional: Limit max height */
  overflow-y: auto; /* Ensure scrollable content */
}
.ql-container.ql-snow {
  min-height: 300px;
  max-height: 600px;
  overflow: scroll;
}
.form-select {
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 16px;
  background-color: #ffffff;
  color: #495057;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-select:focus {
  border-color: #80bdff;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-select option {
  font-size: 14px;
  color: #495057;
}

/* Optional: Add hover effect */
.form-select:hover {
  border-color: #86b7fe;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600; /* Optional: To make the label stand out */
}
.btn {
  margin-right: 0.5rem;
}
.margin-left {
  margin-left: 0.3rem;
}
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.badge_tag {
  display: flex;
  align-items: center;
  font-size: 14px;
  border-radius: 15px;
}

.input-group {
  display: flex;
}

.input-group input {
  flex: 1;
}

.list-group-item {
  cursor: pointer;
}
.list-group-item:hover {
  background-color: #f1f1f1;
}
ul.list-group {
  max-width: 100%; /* Prevent it from exceeding the container width */
  width: 100%; /* Match the input field's width */
  box-sizing: border-box; /* Include padding and border in the width */
}
.option-card {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #007bff;
      border-radius: 20px;
      padding: 0.5rem 1rem;
      margin: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
    }

    .option-card.selected {
      background-color: #007bff;
      color: #fff;
      border-color: #0056b3;
    }

    .option-card.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .limit-reached {
      color: red;
      font-size: 0.875rem;
      margin-top: 1rem;
    }
</style>
