<template>
  <b-container fluid>
    <b-row>
      <b-col lg="12">
        <iq-card>
          <template v-slot:body>
            <b-row>
              <b-col md="6" class="iq-item-product-left">
                <div class="iq-image-container">
                  <div class="iq-product-cover">
                    <img src="https://dummyimage.com/600x385/000/fff" alt="product-image" class="img-fluid">
                  </div>
                </div>
                <div class="iq-additional_slider">
                  <Slick :option="sliderOption" id="product-additional-slider" class="d-flex m-0 p-0">
                    <li v-for="(item,index) in images" :key="index">
                      <img :src="item.image" alt="product-image" class="img-fluid">
                    </li>
                  </Slick>
                </div>
              </b-col>
              <b-col md="6" class="iq-item-product-right">
                <div class="product-additional-details">
                  <h3 class="productpage_title">Curabitur Dolor Nunc consectetur adipiscing</h3>
                  <p>consectetur adipiscing</p>
                  <div class="ratting">
                    <ul class="ratting-item d-flex p-0 m-0">
                      <li class="full"><i class="ri-star-fill"></i></li>
                      <li class="full"><i class="ri-star-fill"></i></li>
                      <li class="full"><i class="ri-star-fill"></i></li>
                      <li class="half"><i class="ri-star-half-line"></i></li>
                      <li class="blank"><i class="ri-star-line"></i></li>
                    </ul>
                  </div>
                  <div class="product-descriptio">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at ante. Mauris eleifend, quam a vulputate dictum, massa quam dapibus leo, eget vulputate orci purus ut lorem. In fringilla mi in ligula.</p>
                  </div>
                  <div class="product-price">
                    <div class="regular-price"><b> $100.00</b> <span class="offer-price ml-2">$150.00</span></div>
                  </div>
                  <div class="shipping">
                    <p class="mb-0">Shipping Free: <span>$50</span></p>
                  </div>
                  <div class="stock">
                    <p>Stock: <span>Available</span></p>
                  </div>
                  <div class="additional-product-action d-flex align-items-center">
                    <div class="inline-flex btn-increment">
                      <button type="button" class="btn-less"><i class="ri-subtract-fill"></i></button>
                      <input type="number" min="1" max="10" value="1" class="increment">
                      <button type="button" class="btn-plus"><i class="ri-add-fill"></i></button>
                    </div>
                    <div class="product-action ml-2">
                      <div class="add-to-cart"><a href="#"> Add to Cart </a></div>
                      <div class="wishlist"><a href="#" data-toggle="tooltip" data-placement="top" title="" data-original-title="Wishlist"> <i class="ri-heart-line"></i> </a></div>
                    </div>
                  </div>
                </div>
              </b-col>
              <b-col sm="12" class="product-description-details">
                <div class="description-tabs">
                  <tab-nav :tabs="true" id="myTab-2" align="center">
                    <tab-nav-items :active="true" id="description-tab-justify" href="#description" ariaControls="description" role="tab" :ariaSelected="true" title="Description" />
                    <tab-nav-items :active="false" id="specifications-tab-justify" href="#specifications" ariaControls="specifications" role="tab" :ariaSelected="false" title="Specifications" />
                    <tab-nav-items :active="false" id="review-tab-justify" href="#review" ariaControls="review" role="tab" :ariaSelected="false" title="Review" />
                  </tab-nav>
                  <tab-content id="myTabContent-3">
                    <tab-content-item :active="true" id="description" aria-labelled-by="description-tab-justify">
                      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                    </tab-content-item>
                    <tab-content-item :active="false" id="specifications" aria-labelled-by="specifications-tab-justify">
                      <p>Mauris laoreet tempor orci, quis rhoncus urna porttitor ut. Quisque volutpat ultrices elit, ut scelerisque lacus mattis id. Quisque non euismod leo. Aenean turpis orci, dictum id luctus ac, pretium pulvinar enim. Phasellus quam eros, porttitor sed iaculis at, lacinia at augue. Aenean vel lacinia eros. Curabitur ac feugiat libero. Praesent malesuada mauris arcu, sed mollis leo efficitur pretium. Nunc ornare tempor nulla.</p>
                    </tab-content-item>
                    <tab-content-item :active="false" id="review" aria-labelled-by="review-tab-justify">
                      <p>In in mauris a sem ullamcorper maximus. In facilisis sapien vel consequat laoreet. Ut convallis elit vitae augue interdum dapibus. Vivamus nec urna quis ex congue consectetur. Sed egestas dapibus neque eu finibus. Fusce mollis congue augue, commodo ornare ante hendrerit vitae. Nunc luctus ac nunc quis facilisis. Nullam vitae gravida elit. Pellentesque maximus auctor gravida. Nulla imperdiet odio neque, non porta lacus feugiat sed. Curabitur eu lectus ut lectus convallis mattis sit amet sit amet lectus. Curabitur elit lorem, commodo a neque ac, feugiat tempor felis.</p>
                    </tab-content-item>
                  </tab-content>
                </div>
              </b-col>
              <b-col sm="12" class="mt-5 related-product">
                <div class="related-heading text-center mb-5">
                  <h2>Related Products</h2>
                </div>
                <div class="related-product-block">
                  <Slick :option="sliderOption1" id="related-slider" class="product_list row p-0">
                    <li v-for="(item,index) in items" :key="index" class="product_item col-12">
                      <div class="product-miniature">
                        <div class="thumbnail-container">
                          <a href="#"><img :src="item.image" alt="product-image" class="img-fluid"></a>
                          <a href="javascript:void();" v-if="item.type == 'New'" class="new">{{ item.type }}</a>
                        </div>
                        <div class="product-description">
                          <h4>{{ item.title }}</h4>
                          <p class="mb-0">{{ item.subtitle }}</p>
                          <div class="ratting">
                            <ul class="ratting-item d-flex p-0 m-0">
                              <li v-for="(rating, index) in 5" :key="index" class="full">
                                <i class="ri-star-fill" v-if="item.rating >= rating" />
                                <i class="ri-star-line" v-else />
                              </li>
                            </ul>
                          </div>
                          <div class="d-flex flex-wrap justify-content-between align-items-center">
                            <div class="product-action">
                              <div class="add-to-cart"><a href="#" data-toggle="tooltip" data-placement="top" title="" data-original-title="Add to Cart"> <i class="ri-shopping-cart-2-line"></i></a></div>
                              <div class="wishlist"><a href="#" data-toggle="tooltip" data-placement="top" title="" data-original-title="Wishlist"> <i class="ri-heart-line"></i></a></div>
                            </div>
                            <div class="product-price">
                              <div class="regular-price"><b> ${{ item.regular_price }}</b> <span class="offer-price ml-2">${{ item.offer_price }}</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </Slick>
                </div>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { sofbox } from '../../../config/pluginInit'
export default {
  name: 'detail',
  mounted () {
    sofbox.index()
  },
  data () {
    return {
      images: [
        { image: 'https://dummyimage.com/600x385/000/fff' },
        { image: 'https://dummyimage.com/600x385/000/fff' },
        { image: 'https://dummyimage.com/600x385/000/fff' },
        { image: 'https://dummyimage.com/600x385/000/fff' },
        { image: 'https://dummyimage.com/600x385/000/fff' },
        { image: 'https://dummyimage.com/600x385/000/fff' },
        { image: 'https://dummyimage.com/600x385/000/fff' }
      ],
      items: [
        { title: 'consectetur adipiscing elit', subtitle: 'Proin sed risus mattis', image: 'https://dummyimage.com/384x250/000/fff', rating: '4', regular_price: '99.00', offer_price: '50.00', type: '' },
        { title: 'Sed dictum orci vel', subtitle: 'Proin sed risus mattis', image: 'https://dummyimage.com/384x250/000/fff', rating: '5', regular_price: '199.00', offer_price: '15.00', type: 'New' },
        { title: 'neque venenatis', subtitle: 'Proin sed risus mattis', image: 'https://dummyimage.com/384x250/000/fff', rating: '4', regular_price: '1000.00', offer_price: '500.00', type: '' },
        { title: 'Etiam interdum nisi et', subtitle: 'Proin sed risus mattis', image: 'https://dummyimage.com/384x250/000/fff', rating: '4', regular_price: '100.00', offer_price: '50.00', type: '' },
        { title: 'Proin at diam sit amet', subtitle: 'Proin sed risus mattis', image: 'https://dummyimage.com/384x250/000/fff', rating: '5', regular_price: '150.00', offer_price: '50.00', type: 'New' },
        { title: 'augue rhoncus ornare', subtitle: 'Proin sed risus mattis', image: 'https://dummyimage.com/384x250/000/fff', rating: '4', regular_price: '599.00', offer_price: '99.00', type: '' },
        { title: 'Nulla venenatis mi sed', subtitle: 'Proin sed risus mattis', image: 'https://dummyimage.com/384x250/000/fff', rating: '3', regular_price: '199.00', offer_price: '50.00', type: '' },
        { title: 'Etiam interdum nisi et', subtitle: 'Proin sed risus mattis', image: 'https://dummyimage.com/384x250/000/fff', rating: '4', regular_price: '100.00', offer_price: '50.00', type: '' },
        { title: 'dignissim orci quis', subtitle: 'Proin sed risus mattis', image: 'https://dummyimage.com/384x250/000/fff', rating: '5', regular_price: '150.00', offer_price: '50.00', type: 'New' }
      ],
      sliderOption: {
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 3,
        slidesToScroll: 1,
        focusOnSelect: true,
        responsive: [{
          breakpoint: 992,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '30',
            slidesToShow: 4
          }
        }, {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '15',
            slidesToShow: 1
          }
        }],
        nextArrow: '<a href="#" class="ri-arrow-left-s-line left"></a>',
        prevArrow: '<a href="#" class="ri-arrow-right-s-line right"></a>'
      },
      sliderOption1: {
        centerMode: false,
        centerPadding: '60px',
        slidesToShow: 3,
        slidesToScroll: 1,
        focusOnSelect: true,
        responsive: [{
          breakpoint: 992,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '30',
            slidesToShow: 2
          }
        }, {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '15',
            slidesToShow: 1
          }
        }],
        nextArrow: '<a href="#" class="ri-arrow-left-s-line left"></a>',
        prevArrow: '<a href="#" class="ri-arrow-right-s-line right"></a>'
      }
    }
  }
}
</script>
