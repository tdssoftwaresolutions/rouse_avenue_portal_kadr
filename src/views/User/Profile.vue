<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <iq-card body-class=" profile-page p-0">
          <template v-slot:body>
            <div class="profile-header">
              <div class="cover-container">
                <b-img :src="require('../../assets/images/page-img/profile-bg.jpg')" alt="profile-bg" rounded fluid />
                <ul class="header-nav d-flex flex-wrap justify-end p-0 m-0">
                  <li><b-link href="javascript:void();"><i class="ri-pencil-line"></i></b-link></li>
                  <li><b-link href="javascript:void();"><i class="ri-settings-4-line"></i></b-link></li>
                </ul>
              </div>
              <div class="profile-info p-4">
                <b-row>
                  <b-col md="6" sm="12">
                    <div class="user-detail pl-5">
                      <div class="d-flex flex-wrap align-items-center">
                        <div class="profile-img pr-4">
                          <b-img :src="require('../../assets/images/user/11.png')" alt="profile-img" fluid class="avatar-130" />
                        </div>
                        <div class="profile-detail d-flex align-items-center">
                          <h3>Nik Jone</h3>
                          <p class="m-0 pl-3"> - Web designer</p>
                        </div>
                      </div>
                    </div>
                  </b-col>
                  <b-col md="6" sm="12">
                    <ul class="nav nav-pills d-flex align-items-end float-right profile-feed-items p-0 m-0">
                      <li>
                        <b-link class="nav-link active" data-toggle="pill" href="#profile-feed">feed</b-link>
                      </li>
                      <li>
                        <b-link class="nav-link" data-toggle="pill" href="#profile-activity">Activity</b-link>
                      </li>
                      <li>
                        <b-link class="nav-link" data-toggle="pill" href="#profile-friends">friends</b-link>
                      </li>
                      <li>
                        <b-link class="nav-link" data-toggle="pill" href="#profile-profile">profile</b-link>
                      </li>
                    </ul>
                  </b-col>
                </b-row>
              </div>
            </div>
          </template>
        </iq-card>
      </b-col>
      <b-col sm="12">
        <b-row>
          <b-col lg="3" class="profile-left">
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">News</h4>
              </template>
              <template v-slot:body>
                <ul class="m-0 p-0">
                  <li class="d-flex" v-for="(list,index) in news" :key="index"  :class="{ 'mb-2': index === 0 }"   >
                    <div class="news-icon" :class="{ 'mb-0': index==news.length-1 }"><i class="ri-chat-4-fill"></i></div>
                    <p class="news-detail mb-0" v-html="list.description"></p>
                  </li>
                </ul>
              </template>
            </iq-card>
            <iq-card body-class="p-0">
              <template v-slot:headerTitle>
                <h4 class="card-title">Gallery</h4>
              </template>
              <template v-slot:headerAction>
                <p class="m-0">132 pics</p>
              </template>
              <template v-slot:body>
                <ul class="profile-img-gallary d-flex flex-wrap p-0 m-0">
                  <li v-for="(item,index) in galary" :key="index" class="col-md-4 col-6 pl-1 pr-0 pb-1">
                    <b-link :href="item.href">
                    <b-img :src="item.image" alt="gallary-image" fluid /></b-link>
                  </li>
                </ul>
              </template>
            </iq-card>
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">Twitter Feeds</h4>
              </template>
              <template v-slot:body>
                <div class="twit-feed" v-for="(feed,index) in twitterFeed" :key="index">
                  <div class="media-support-header" :class="{ 'mb-2': index !== twitterFeed.length-1 }" >
                    <div class="media-support-user-img mr-3">
                      <b-img rounded="circle" fluid :src="feed.image" alt="" />
                    </div>
                    <div class="media-support-info">
                      <h6 class="mb-0"><b-link href="#" class="">{{ feed.name }}</b-link></h6>
                      <p>{{ feed.username }} <span v-html="`${feed.isVerify  ? '<i class=ri-check-fill></i>' : ''}`"> </span></p>
                    </div>
                  </div>
                  <div class="media-support-body">
                    <p class="mb-0">{{ feed.description }}</p>
                    <div class="d-flex flex-wrap">
                      <b-link v-for="(tag,index1) in feed.tags" :key="index1" class="twit-meta-tag pr-2" :href="tag.link" >#{{ tag.text }} </b-link>
                    </div>
                    <div class="twit-date"><a href="#">{{ feed.date }}</a></div>
                  </div>
                  <hr v-if="index != twitterFeed.length-1" class="mt-4 mb-4">
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col lg="6" class="profile-center">
            <div class="tab-content">
              <div class="tab-pane fade active show" id="profile-feed" role="tabpanel">
                <iq-card body-class="p-0">
                  <template v-slot:body>
                    <div class="user-post-data p-3">
                      <div class="d-flex flex-wrap">
                        <div class="media-support-user-img mr-3">
                          <b-img  rounded="circle" fluid :src="require('../../assets/images/user/01.jpg')" alt=""/>
                        </div>
                        <div class="media-support-info mt-2">
                          <h5 class="mb-0"><b-link href="#" class="">Anna Sthesia</b-link></h5>
                          <p class="mb-0 text-primary">colleages</p>
                        </div>
                        <div class="iq-card-header-toolbar d-flex align-items-center">
                          <b-dropdown id="dropdownMenuButton40" right variant="none" menu-class="p-0">
                            <template v-slot:button-content>
                              <b-link href="#" class="text-secondary">29 mins <i class="ri-more-2-line ml-3"></i></b-link>
                            </template>
                            <b-dropdown-item href="#"><i class="ri-user-unfollow-line mr-2"></i>Unfollow</b-dropdown-item>
                            <b-dropdown-item href="#"><i class="ri-share-forward-line mr-2"></i>Share</b-dropdown-item>
                            <b-dropdown-item href="#"><i class="ri-file-copy-line mr-2"></i>Copy Link</b-dropdown-item>
                          </b-dropdown>
                        </div>
                      </div>
                    </div>
                  </template>
                  <div class="user-post">
                    <b-link href="javascript:void();"><b-img :src="require('../../assets/images/page-img/p1.jpg')" alt="post-image" fluid /></b-link>
                  </div>
                  <div class="comment-area p-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="d-flex align-items-center">
                        <div class="d-flex align-items-center feather-icon mr-3">
                          <b-link href="javascript:void();"><i class="ri-heart-line"></i></b-link>
                          <span class="ml-1">140</span>
                        </div>
                        <div class="d-flex align-items-center message-icon">
                          <b-link href="javascript:void();"><i class="ri-chat-4-line"></i></b-link>
                          <span class="ml-1">140</span>
                        </div>
                      </div>
                      <div class="d-flex align-items-center">
                        <div class="iq-media-group">
                          <b-link href="#" class="iq-media">
                            <b-img class="avatar-40"  rounded="circle" fluid :src="require('../../assets/images/user/05.jpg')" alt="" />
                          </b-link>
                          <b-link href="#" class="iq-media">
                            <b-img class="avatar-40"  rounded="circle" fluid :src="require('../../assets/images/user/06.jpg')" alt="" />
                          </b-link>
                          <b-link href="#" class="iq-media">
                            <b-img class="avatar-40"  rounded="circle" fluid :src="require('../../assets/images/user/07.jpg')" alt="" />
                          </b-link>
                          <b-link href="#" class="iq-media">
                            <b-img class="avatar-40"  rounded="circle" fluid :src="require('../../assets/images/user/08.jpg')" alt="" />
                          </b-link>
                          <b-link href="#" class="iq-media">
                            <b-img class="avatar-40"  rounded="circle" fluid :src="require('../../assets/images/user/09.jpg')" alt="" />
                          </b-link>
                        </div>
                        <span class="ml-2">+140 more</span>
                      </div>
                    </div>
                    <hr>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus</p>
                    <hr>
                    <ul class="post-comments p-0 m-0">
                      <li class="mb-2">
                        <div class="d-flex flex-wrap">
                          <div class="user-img">
                            <b-img :src="require('../../assets/images/user/02.jpg')" alt="userimg" class="avatar-35"  rounded="circle" fluid />
                          </div>
                          <div class="comment-data-block ml-3">
                            <h6>Monty Carlo</h6>
                            <p class="mb-0">Lorem ipsum dolor sit amet</p>
                            <div class="d-flex flex-wrap align-items-center comment-activity">
                              <b-link href="javascript:void();">like</b-link>
                              <b-link href="javascript:void();">reply</b-link>
                              <b-link href="javascript:void();">translate</b-link>
                              <span> 5 minit </span>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div class="d-flex flex-wrap">
                          <div class="user-img">
                            <b-img :src="require('../../assets/images/user/03.jpg')" alt="userimg" class="avatar-35"  rounded="circle" fluid />
                          </div>
                          <div class="comment-data-block ml-3">
                            <h6>Paul Molive</h6>
                            <p class="mb-0">Lorem ipsum dolor sit amet</p>
                            <div class="d-flex flex-wrap align-items-center comment-activity">
                              <b-link href="javascript:void();">like</b-link>
                              <b-link href="javascript:void();">reply</b-link>
                              <b-link href="javascript:void();">translate</b-link>
                              <span> 5 minit </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <b-form class="comment-text d-flex align-items-center mt-3" action="javascript:void(0);">
                      <b-form-input type="text" class="rounded" placeholder="Lovely!" />
                      <div class="comment-attagement d-flex">
                        <b-link href="javascript:void();"><i class="ri-user-smile-line mr-2"></i></b-link>
                        <b-link href="javascript:void();"><i class="ri-camera-line mr-2"></i></b-link>
                      </div>
                    </b-form>
                  </div>
                </iq-card>
                <iq-card body-class="p-0">
                  <template v-slot:body>
                    <div class="user-post-data p-3">
                      <div class="d-flex flex-wrap">
                        <div class="media-support-user-img mr-3">
                          <b-img rounded="circle" fluid :src="require('../../assets/images/user/02.jpg')" alt="" />
                        </div>
                        <div class="media-support-info mt-2">
                          <h5 class="mb-0"><b-link href="#" class="">jenny issad</b-link></h5>
                          <p class="mb-0 text-primary">colleages</p>
                        </div>
                        <div class="iq-card-header-toolbar d-flex align-items-center">
                          <b-dropdown id="dropdownMenuButton40" right variant="none" menu-class="p-0">
                            <template v-slot:button-content>
                              <b-link href="#" class="text-secondary">1 hr <i class="ri-more-2-line ml-3"></i></b-link>
                            </template>
                            <b-dropdown-item href="#"><i class="ri-user-unfollow-line mr-2"></i>Unfollow</b-dropdown-item>
                            <b-dropdown-item href="#"><i class="ri-share-forward-line mr-2"></i>Share</b-dropdown-item>
                            <b-dropdown-item href="#"><i class="ri-file-copy-line mr-2"></i>Copy Link</b-dropdown-item>
                          </b-dropdown>
                        </div>
                      </div>
                    </div>
                    <hr class="mt-0">
                    <p class="p-3 mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus</p>
                    <div class="comment-area p-3">
                      <hr class="mt-0">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                          <div class="d-flex align-items-center feather-icon mr-3">
                            <b-link id="clickme" href="javascript:void();"><i class="ri-heart-line"></i></b-link>
                            <span class="ml-1">140</span>
                          </div>
                          <div class="d-flex align-items-center message-icon">
                            <b-link href="javascript:void();"><i class="ri-chat-4-line"></i></b-link>
                            <span class="ml-1">140</span>
                          </div>
                        </div>
                        <div class="d-flex align-items-center">
                          <div class="iq-media-group">
                            <b-link href="#" class="iq-media">
                              <b-img class="avatar-40" rounded="circle" fluid :src="require('../../assets/images/user/05.jpg')" alt="" />
                            </b-link>
                            <b-link href="#" class="iq-media">
                              <b-img class="avatar-40" rounded="circle" fluid :src="require('../../assets/images/user/06.jpg')" alt="" />
                            </b-link>
                            <b-link href="#" class="iq-media">
                              <b-img class="avatar-40" rounded="circle" fluid :src="require('../../assets/images/user/07.jpg')" alt="" />
                            </b-link>
                            <b-link href="#" class="iq-media">
                              <b-img class="avatar-40" rounded="circle" fluid :src="require('../../assets/images/user/08.jpg')" alt="" />
                            </b-link>
                            <b-link href="#" class="iq-media">
                              <b-img class="avatar-40" rounded="circle" fluid :src="require('../../assets/images/user/09.jpg')" alt="" />
                            </b-link>
                          </div>
                          <span class="ml-2">+140 more</span>
                        </div>
                      </div>
                      <b-form class="comment-text d-flex align-items-center mt-3" action="javascript:void(0);">
                        <b-form-input type="text" class="rounded" placeholder="Lovely!" />
                        <div class="comment-attagement d-flex">
                          <b-link href="javascript:void();"><i class="ri-user-smile-line mr-2"></i></b-link>
                          <b-link href="javascript:void();"><i class="ri-camera-line mr-2"></i></b-link>
                        </div>
                      </b-form>
                    </div>
                  </template>
                </iq-card>
              </div>
              <div class="tab-pane fade" id="profile-activity" role="tabpanel">
                <iq-card>
                  <template v-slot:headerTitle>
                    <h4 class="card-title">Activity timeline</h4>
                  </template>
                  <template v-slot:headerAction>
                    <b-dropdown id="dropdownMenuButton5" right variant="none">
                      <template v-slot:button-content>
                        <span class="text-primary">View All</span>
                      </template>
                      <b-dropdown-item href="#"><i class="ri-eye-fill mr-2"></i>View</b-dropdown-item>
                      <b-dropdown-item href="#"><i class="ri-close-circle-line mr-2"></i>Delete</b-dropdown-item>
                      <b-dropdown-item href="#"><i class="ri-pencil-fill mr-2"></i>Edit</b-dropdown-item>
                      <b-dropdown-item href="#"><i class="ri-printer-fill mr-2"></i>Print</b-dropdown-item>
                      <b-dropdown-item href="#"><i class="ri-file-download-fill mr-2"></i>Download</b-dropdown-item>
                    </b-dropdown>
                  </template>
                  <template v-slot:body>
                    <TimeLine :items="timelineItems" />
                  </template>
                </iq-card>
              </div>
              <div class="tab-pane fade" id="profile-friends" role="tabpanel">
                <iq-card>
                  <template v-slot:headerTitle>
                    <h4 class="card-title">Friends</h4>
                  </template>
                  <template v-slot:body>
                    <ul class="suggestions-lists m-0 p-0">
                      <li v-for="(item,index) in friends" :key="index" class="d-flex mb-4 align-items-center">
                        <div class="user-img img-fluid">
                          <b-img :src="item.image" alt="story-img" rounded="circle" class="avatar-40" />
                        </div>
                        <div class="media-support-info ml-3">
                          <h6>{{ item.name }}</h6>
                          <p class="mb-0">{{ item.role }}</p>
                        </div>
                        <div class="iq-card-header-toolbar d-flex align-items-center">
                          <b-dropdown id="dropdownMenuButton40" right variant="none" menu-class="p-0">
                            <template v-slot:button-content>
                              <i class="ri-more-2-line"></i>
                            </template>
                            <b-dropdown-item href="#"><i class="ri-user-unfollow-line mr-2"></i>Unfollow</b-dropdown-item>
                            <b-dropdown-item href="#"><i class="ri-share-forward-line mr-2"></i>Share</b-dropdown-item>
                            <b-dropdown-item href="#"><i class="ri-file-copy-line mr-2"></i>Copy Link</b-dropdown-item>
                          </b-dropdown>
                        </div>
                      </li>
                    </ul>
                    <b-button href="javascript:void();" variant="primary" class="d-block"><i class="ri-add-line"></i> Load More</b-button>
                  </template>
                </iq-card>
              </div>
              <div class="tab-pane fade" id="profile-profile" role="tabpanel">
                <iq-card>
                  <template v-slot:headerTitle>
                    <h4 class="card-title">Profile</h4>
                  </template>
                  <template v-slot:body>
                    <div class="user-detail text-center">
                      <div class="user-profile">
                        <b-img :src="require('../../assets/images/user/11.png')" alt="profile-img" fluid class="avatar-130" />
                      </div>
                      <div class="profile-detail mt-3">
                        <h3 class="d-inline-block">Nik Jone</h3>
                        <p class="d-inline-block pl-3"> - Web designer</p>
                        <p class="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 500s</p>
                      </div>
                    </div>
                  </template>
                </iq-card>
                <iq-card>
                  <template v-slot:headerTitle>
                    <h4 class="card-title">About User</h4>
                  </template>
                  <template v-slot:body>
                    <div class="user-bio">
                      <p>Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes.Topping cake wafer.</p>
                    </div>
                    <div v-for="(item,index) in userBio" :key="index" class="mt-2">
                      <h6>{{ item.title }}:</h6>
                      <p v-html="item.description"></p>
                    </div>
                  </template>
                </iq-card>
              </div>
            </div>
          </b-col>
          <b-col lg="3" class="profile-right">
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">About</h4>
              </template>
              <template v-slot:body>
                <div class="about-info m-0 p-0">
                  <b-row>
                    <b-col cols="12"><p>Lorem ipsum dolor sit amet, contur adipiscing elit.</p></b-col>
                    <b-col cols="3">Email:</b-col>
                    <b-col cols="9"><b-link href="mailto:nikjone@demoo.com"> nikjone@demoo.com </b-link></b-col>
                    <b-col cols="3">Phone:</b-col>
                    <b-col cols="9"><b-link href="tel:001 2351 256 12">001 2351 256 12</b-link></b-col>
                    <b-col cols="3">Location:</b-col>
                    <b-col cols="9">USA</b-col>
                  </b-row>
                </div>
              </template>
            </iq-card>
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">Stories</h4>
              </template>
              <template v-slot:body>
                <ul class="media-story m-0 p-0">
                  <li v-for="(item,index) in story" :key="index" class="d-flex align-items-center" :class="item.isActive +' '+ item.class">
                    <b-img :src="item.image" alt="story-img" rounded="circle" fluid />
                    <div class="stories-data ml-3">
                      <h5>{{ item.title }}</h5>
                      <p class="mb-0">{{ item.time }}</p>
                    </div>
                  </li>
                </ul>
              </template>
            </iq-card>
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">Suggestions</h4>
              </template>
              <template v-slot:headerAction>
                <b-link href="#"><i class="ri-more-fill"></i></b-link>
              </template>
              <template v-slot:body>
                <ul class="suggestions-lists m-0 p-0">
                  <li v-for="(item,index) in suggestions" :key="index" class="d-flex mb-4 align-items-center">
                    <div class="user-img img-fluid">
                      <b-img :src="item.image" alt="story-img" rounded="circle" class="avatar-40" />
                    </div>
                    <div class="media-support-info ml-3">
                      <h6>{{ item.name }}</h6>
                      <p class="mb-0">{{ item.mutual_friend }}</p>
                    </div>
                    <div class="add-suggestion"><b-link href="javascript:void();"><i class="ri-user-add-line"></i></b-link></div>
                  </li>
                </ul>
                <b-link href="javascript:void();" class="btn btn-primary d-block"><i class="ri-add-line"></i> Load More</b-link>
              </template>
            </iq-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
export default {
  name: 'Profile',
  mounted () {
    sofbox.index()
  },
  data () {
    return {
      galary: [
        { image: require('../../assets/images/page-img/g1.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g2.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g3.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g4.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g5.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g6.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g7.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g8.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g9.jpg'), href: 'javascript:void();' }
      ],
      timelineItems: [
        {
          color: 'primary',
          title: 'Client Login',
          right: '24 November 2019',
          description: 'Bonbon macaroon jelly beans gummi bears jelly lollipop apple',
          child: {
            type: 'img',
            items: [
            ]
          }
        },
        {
          color: 'success',
          title: 'Scheduled Maintenance',
          right: '23 November 2019',
          description: 'Bonbon macaroon jelly beans gummi bears jelly lollipop apple',
          child: {
            type: 'img',
            items: [
            ]
          }
        },
        {
          color: 'danger',
          title: 'Dev Meetup',
          right: '20 November 2019',
          description: 'Bonbon macaroon jelly <b-link href="">beans gummi</b-link> bears jelly lollipop apple',
          child: {
            type: 'img',
            items: [
              require('../../assets/images/user/05.jpg'),
              require('../../assets/images/user/06.jpg'),
              require('../../assets/images/user/07.jpg'),
              require('../../assets/images/user/08.jpg'),
              require('../../assets/images/user/09.jpg'),
              require('../../assets/images/user/10.jpg')
            ]
          }
        },
        {
          color: 'primary',
          title: 'Client Call',
          right: '19 November 2019',
          description: 'Bonbon macaroon jelly beans gummi bears jelly lollipop apple',
          child: {
            type: 'img',
            items: [
            ]
          }
        },
        {
          color: 'warning',
          title: 'Mega Event',
          right: '15 November 2019',
          description: 'Bonbon macaroon jelly beans gummi bears jelly lollipop apple',
          child: {
            type: 'img',
            items: [
            ]
          }
        }
      ],
      friends: [
        { name: 'Paul Molive', role: 'Web Designer', image: require('../../assets/images/user/01.jpg') },
        { name: 'Paul Molive', role: 'trainee', image: require('../../assets/images/user/01.jpg') },
        { name: 'Anna Mull', role: 'Web Developer', image: require('../../assets/images/user/02.jpg') },
        { name: 'Paige Turner', role: 'trainee', image: require('../../assets/images/user/03.jpg') },
        { name: 'Barb Ackue', role: 'Web Designer', image: require('../../assets/images/user/04.jpg') },
        { name: 'Greta Life', role: 'Tester', image: require('../../assets/images/user/05.jpg') },
        { name: 'Ira Membrit', role: 'Android Developer', image: require('../../assets/images/user/06.jpg') },
        { name: 'Pete Sariya', role: 'Web Designer', image: require('../../assets/images/user/07.jpg') }
      ],
      userBio: [
        { title: 'Joined', description: 'November 15, 2012' },
        { title: 'Lives', description: 'United States of America' },
        { title: 'Email', description: '<a href="mailto:nikjone@gmail.com"> nikjone@gmail.com</a>' },
        { title: 'Url', description: '<a href="https://getbootstrap.com/docs/4.0/getting-started/introduction/" target="_blank"> www.bootstrap.com </a>' },
        { title: 'Contact', description: '<a href="tel:001 4544 565 456">(001) 4544 565 456</a>' }
      ],
      story: [
        { title: 'Web Design', time: '1 hour ago', image: require('../../assets/images/page-img/s1.jpg'), class: 'mb-4', isActive: 'active' },
        { title: 'App Design', time: '4 hour ago', image: require('../../assets/images/page-img/s2.jpg'), class: 'mb-4', isActive: '' },
        { title: 'Abstract Design', time: '9 hour ago', image: require('../../assets/images/page-img/s3.jpg'), class: '', isActive: '' }
      ],
      suggestions: [
        { name: 'Paul Molive', mutual_friend: '4 mutual friends', image: require('../../assets/images/user/01.jpg') },
        { name: 'Paul Molive', mutual_friend: '4 mutual friends', image: require('../../assets/images/user/01.jpg') },
        { name: 'Anna Mull', mutual_friend: '6 mutual friends', image: require('../../assets/images/user/02.jpg') },
        { name: 'Paige Turner', mutual_friend: '8 mutual friends', image: require('../../assets/images/user/03.jpg') },
        { name: 'Barb Ackue', mutual_friend: '1 mutual friends', image: require('../../assets/images/user/04.jpg') },
        { name: 'Greta Life', mutual_friend: '3 mutual friends', image: require('../../assets/images/user/05.jpg') },
        { name: 'Ira Membrit', mutual_friend: '12 mutual friends', image: require('../../assets/images/user/06.jpg') },
        { name: 'Pete Sariya', mutual_friend: '2 mutual friends', image: require('../../assets/images/user/07.jpg') }
      ],
      news: [
        { description: 'there is a meetup in your city on friday at 19:00.<a href="#">see details</a>' },
        { description: '20% off coupon on selected items at pharmaprix' }
      ],
      twitterFeed: [
        {
          image: require('../../assets/images/user/01.jpg'),
          name: 'Anna Sthesia',
          username: '@anna59',
          isVerify: true,
          tags: [
            {
              link: '#',
              text: 'Html'
            },
            {
              link: '#',
              text: 'Bootstrap'
            }
          ],
          date: '07 Jan 2020',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
        },
        {
          image: require('../../assets/images/user/02.jpg'),
          name: 'Paige Turner',
          username: '@paige30',
          isVerify: true,
          tags: [
            {
              link: '#',
              text: 'Js'
            },
            {
              link: '#',
              text: 'Bootstrap'
            }
          ],
          date: '07 Jan 2020',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
        },
        {
          image: require('../../assets/images/user/03.jpg'),
          name: 'Greta Life',
          username: '@greta07',
          isVerify: false,
          tags: [
            {
              link: '#',
              text: 'Html'
            },
            {
              link: '#',
              text: 'CSS'
            }
          ],
          date: '07 Jan 2020',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
        }
      ]
    }
  }
}
</script>
