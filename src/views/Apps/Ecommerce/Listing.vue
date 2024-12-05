<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <div id="js-product-list">
              <div class="Products">
                <Product :items="items" className="product_list gridcount grid row"/>
              </div>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { sofbox } from '../../../config/pluginInit'
import profile from '../../../assets/images/Screenshot (36).png'
import profile2 from '../../../assets/images/Screenshot (36)1.png'
export default {
  name: 'listingComp',
  mounted () {
    sofbox.index()
  },
  data () {
    return {
      items: [
        { title: 'Mediation Agreement with Rahul', subtitle: 'Download mediation document', image: profile, rating: '4', regular_price: '99.00', offer_price: '50.00', type: 'New' },
        { title: 'Draft Agreement', subtitle: 'Draft agreement for reference', image: profile2, rating: '5', regular_price: '199.00', offer_price: '15.00', type: 'New' }
      ]
    }
  }
}
</script>
