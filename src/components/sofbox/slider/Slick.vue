<template>
  <vue-slick :options="option">
    <slot />
  </vue-slick>
</template>
<script>
import VueSlick from 'vue-slick'
export default {
  name: 'Slick',
  components: {
    VueSlick
  },
  props: {
    option: { type: Object }
  },
  data () {
    return {
    }
  }
}
</script>
