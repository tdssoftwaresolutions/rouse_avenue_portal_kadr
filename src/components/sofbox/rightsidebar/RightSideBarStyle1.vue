<template>
  <!-- Right Sidebar Panel Start-->
  <div :class="`right-sidebar-mini `+miniClass">
    <div class="right-sidebar-toggle" @click="toggleMini">
      <i class="ri-arrow-left-line side-left-icon"></i>
      <i class="ri-arrow-right-line side-right-icon"></i>
    </div>
    <div class="right-sidebar-panel p-0">
      <slot />
    </div>
  </div>
  <!-- Right Sidebar Panel End-->
</template>
<script>
export default {
  name: 'RightSideBarStyle1',
  data () {
    return {
      rightSideBarMini: false,
      miniClass: ''
    }
  },
  methods: {
    toggleMini () {
      this.rightSideBarMini = !this.rightSideBarMini
      this.checkRightSideBar()
    },
    checkRightSideBar () {
      if (this.rightSideBarMini) {
        this.miniClass = 'right-sidebar'
      } else {
        this.miniClass = ''
      }
    }
  }
}
</script>
