<template>
  <ul :class="className" :id="id">
    <li v-for="(item,index) in items" :key="index" class="product_item col-12 col-6 col-6 col-4">
      <div class="product-miniature">
        <div class="thumbnail-container">
          <a href="#"><img :src="item.image" alt="product-image" class="img-fluid"></a>
          <a href="javascript:void();" v-if="item.type == 'New'" class="new">{{ item.type }}</a>
        </div>
        <div class="product-description">
          <h4>{{ item.title }}</h4>
          <p class="mb-0">{{ item.subtitle }}</p>
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="product-action">
              <div class="wishlist"><a href="https://automatic-barnacle-5vqxxjpjr92vjp5-3000.app.github.dev/mediation_format.pdf" target="_blank" data-toggle="tooltip" data-placement="top" title="" data-original-title="Wishlist"> <i class="ri-download-cloud-fill"></i></a></div>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'Product',
  props: {
    items: { type: Array, default: () => [] },
    className: { type: String, default: '' },
    id: { type: String, default: '' }
  }
}
</script>
