<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <ul id="progressbar" class="text-center">
          <li class="active step0" id="step1">Cart</li>
          <li class="step0" id="step2">Address</li>
          <li class="step0" id="step3">Payment</li>
        </ul>
        <div id="cart" class="card-block show b-0">
          <b-row>
            <b-col lg="8">
              <iq-card>
                <template v-slot:body>
                  <div class="ckeckout-product-lists">
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center">
                        <div class="ckeckout-product">
                          <img src="https://dummyimage.com/180x180/000/fff">
                        </div>
                        <div class="ml-3 checkout-product-details">
                          <h5>Curabitur Dolor Nunc consectetur adipiscing</h5>
                          <p class="text-success">In stock</p>
                          <p class="mb-0"><b>Quantity</b></p>
                          <div class="input-box">
                            <input type="number" min="1" max="10" value="1" class="increment">
                          </div>
                          <p class="mb-0 mt-2">Delivery by, Thu Jan 30 </p>
                          <p class="text-success">9% off 3 offers Available</p>
                        </div>
                      </div>
                      <div class="checkout-amount-data text-center">
                        <div class="price">
                          <h5>$599.00</h5>
                          <p class="shopping-info"><i class="ri-shopping-cart-2-line mr-2"></i>Free Shipping</p>
                        </div>
                        <div class="checkout-button">
                          <a href="#" type="submit" class="btn btn-light d-block"><i class="ri-close-line mr-1"></i>Remove</a>
                          <a href="#" type="submit" class="btn btn-primary d-block mt-2"><i class="ri-heart-line mr-1"></i>Wishlist</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </iq-card>
              <iq-card>
                <template v-slot:body>
                  <div class="ckeckout-product-lists">
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center">
                        <div class="ckeckout-product">
                          <img src="https://dummyimage.com/180x180/000/fff">
                        </div>
                        <div class="ml-3 checkout-product-details">
                          <h5>Curabitur Dolor Nunc consectetur adipiscing</h5>
                          <p class="text-success">In stock</p>
                          <p class="mb-0"><b>Quantity</b></p>
                          <div class="input-box">
                            <input type="number" min="1" max="10" value="1" class="increment">
                          </div>
                          <p class="mb-0 mt-2">Delivery by, Thu Jan 30 </p>
                          <p class="text-success">9% off 3 offers Available</p>
                        </div>
                      </div>
                      <div class="checkout-amount-data text-center">
                        <div class="price">
                          <h5>$599.00</h5>
                          <p class="shopping-info"><i class="ri-shopping-cart-2-line mr-2"></i>Free Shipping</p>
                        </div>
                        <div class="checkout-button">
                          <a href="#" type="submit" class="btn btn-light d-block"><i class="ri-close-line mr-1"></i>Remove</a>
                          <a href="#" type="submit" class="btn btn-primary d-block mt-2"><i class="ri-heart-line mr-1"></i>Wishlist</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
               </iq-card>
              <iq-card>
                <template v-slot:body>
                  <div class="ckeckout-product-lists">
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center">
                        <div class="ckeckout-product">
                          <img src="https://dummyimage.com/180x180/000/fff">
                        </div>
                        <div class="ml-3 checkout-product-details">
                          <h5>Curabitur Dolor Nunc consectetur adipiscing</h5>
                          <p class="text-success">In stock</p>
                          <p class="mb-0"><b>Quantity</b></p>
                          <div class="input-box">
                            <input type="number" min="1" max="10" value="1" class="increment">
                          </div>
                          <p class="mb-0 mt-2">Delivery by, Thu Jan 30 </p>
                          <p class="text-success">9% off 3 offers Available</p>
                        </div>
                      </div>
                      <div class="checkout-amount-data text-center">
                        <div class="price">
                          <h5>$599.00</h5>
                          <p class="shopping-info"><i class="ri-shopping-cart-2-line mr-2"></i>Free Shipping</p>
                        </div>
                        <div class="checkout-button">
                          <a href="#" type="submit" class="btn btn-light d-block"><i class="ri-close-line mr-1"></i>Remove</a>
                          <a href="#" type="submit" class="btn btn-primary d-block mt-2"><i class="ri-heart-line mr-1"></i>Wishlist</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </iq-card>
              <iq-card>
                <template v-slot:body>
                  <div class="ckeckout-product-lists">
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center">
                        <div class="ckeckout-product">
                          <img src="https://dummyimage.com/180x180/000/fff">
                        </div>
                        <div class="ml-3 checkout-product-details">
                          <h5>Curabitur Dolor Nunc consectetur adipiscing</h5>
                          <p class="text-success">In stock</p>
                          <p class="mb-0"><b>Quantity</b></p>
                          <div class="input-box">
                            <input type="number" min="1" max="10" value="1" class="increment">
                          </div>
                          <p class="mb-0 mt-2">Delivery by, Thu Jan 30 </p>
                          <p class="text-success">9% off 3 offers Available</p>
                        </div>
                      </div>
                      <div class="checkout-amount-data text-center">
                        <div class="price">
                          <h5>$599.00</h5>
                          <p class="shopping-info"><i class="ri-shopping-cart-2-line mr-2"></i>Free Shipping</p>
                        </div>
                        <div class="checkout-button">
                          <a href="#" type="submit" class="btn btn-light d-block"><i class="ri-close-line mr-1"></i>Remove</a>
                          <a href="#" type="submit" class="btn btn-primary d-block mt-2"><i class="ri-heart-line mr-1"></i>Wishlist</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </iq-card>
            </b-col>
            <b-col lg="4">
              <iq-card>
                <template v-slot:body>
                  <p>Options</p>
                  <div class="d-flex justify-content-between">
                    <span>Coupons</span>
                    <span><a href="#"><strong>Apply</strong></a></span>
                  </div>
                  <hr>
                  <p><b>Price Details</b></p>
                  <div class="d-flex justify-content-between">
                    <span>Total MRP</span>
                    <span>$500</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Bag Discount</span>
                    <span class="text-success">-15$</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Estimated Tax</span>
                    <span>$10</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>EMI Eligibility</span>
                    <span><a href="#">Details</a></span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Delivery Charges</span>
                    <span class="text-success">Free</span>
                  </div>
                  <hr>
                  <div class="d-flex justify-content-between">
                    <span class="text-dark"><strong>Total</strong></span>
                    <span class="text-dark"><strong>$450</strong></span>
                  </div>
                  <a id="place-order" href="javascript:void();" type="button" class="btn btn-primary d-block mt-1 next">Place order</a>
                </template>
              </iq-card>
            </b-col>
          </b-row>
        </div>
        <div id="address" class="card-block b-0">
          <b-row>
            <b-col lg="8">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Add New Address</h4>
                </template>
                <template v-slot:body>
                  <form onsubmit="required()">
                    <div class="row mt-3">
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="fname">Full Name: *</label>
                          <input type="text" class="form-control" name="fname" required="">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="mno">Mobile Number: *</label>
                          <input type="text" class="form-control" name="mno" required="">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="houseno">Flat, House No: *</label>
                          <input type="text" class="form-control" name="houseno" required="">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="landmark">Landmark e.g. near apollo hospital:: *</label>
                          <input type="text" class="form-control" name="landmark" required="">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="city">Town/City: *</label>
                          <input type="text" class="form-control" name="city" required="">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="pincode">Pincode: *</label>
                          <input type="text" class="form-control" name="pincode" required="">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="state">State: *</label>
                          <input type="text" class="form-control" name="state" required="">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="addtype">Address Type</label>
                          <select class="form-control" id="addtype" required="">
                            <option>Home</option>
                            <option>Office</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <button id="savenddeliver" type="submit" class="btn btn-primary">Save And Deliver Here</button>
                      </div>
                    </div>
                  </form>
                </template>
              </iq-card>
            </b-col>
            <b-col lg="4">
              <iq-card>
                <template v-slot:body>
                  <h4 class="mb-2">Nik John</h4>
                  <div class="shipping-address">
                    <p class="mb-0">9447 Glen Eagles Drive</p>
                    <p>Lewis Center, OH 43035</p>
                    <p>UTC-5: Eastern Standard Time (EST)</p>
                    <p>202-555-0140</p>
                  </div>
                  <hr>
                  <a id="deliver-address" href="javascript:void();" type="button" class="btn btn-primary d-block mt-1 next">Deliver To this Address</a>
                </template>
              </iq-card>
            </b-col>
          </b-row>
        </div>
        <div id="payment" class="card-block b-0">
          <b-row>
            <b-col lg="8">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Payment Options</h4>
                </template>
                <template v-slot:body>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex justify-content-between align-items-center">
                      <img :src="require('../../../assets/images/booking/cart.png')" alt="" height="40" width="50">
                      <span>US Unlocked Debit Card 12XX XXXX XXXX 0000</span>
                    </div>
                    <span>Nik John</span>
                    <span>28/2020</span>
                  </div>
                  <form class="mt-3">
                    <div class="d-flex align-items-center">
                      <span>Enter CVV: </span>
                      <div class="cvv-input ml-3 mr-3">
                        <input type="text" class="form-control" required="">
                      </div>
                      <button type="submit" class="btn btn-primary">Continue</button>
                    </div>
                  </form>
                  <hr>
                  <div class="card-lists">
                    <div class="form-group">
                      <div class="custom-control custom-radio">
                        <input type="radio" id="credit" name="customRadio" class="custom-control-input">
                        <label class="custom-control-label" for="credit"> Credit / Debit / ATM Card</label>
                      </div>
                      <div class="custom-control custom-radio">
                        <input type="radio" id="netbaking" name="customRadio" class="custom-control-input">
                        <label class="custom-control-label" for="netbaking"> Net Banking</label>
                      </div>
                      <div class="custom-control custom-radio">
                        <input type="radio" id="emi" name="emi" class="custom-control-input">
                        <label class="custom-control-label" for="emi"> EMI (Easy Installment)</label>
                      </div>
                      <div class="custom-control custom-radio">
                        <input type="radio" id="cod" name="cod" class="custom-control-input">
                        <label class="custom-control-label" for="cod"> Cash On Delivery</label>
                      </div>
                    </div>
                  </div>
                  <hr>
                  <div class="add-card">
                    <a href="#"><span><i class="ri-add-box-line mr-2 font-size-18"></i>Add Gift Card</span></a>
                  </div>
                </template>
              </iq-card>
            </b-col>
            <b-col lg="4">
              <iq-card>
                <template v-slot:body>
                  <h4 class="mb-2">Price Details</h4>
                  <div class="d-flex justify-content-between">
                    <span>Price 3 Items</span>
                    <span><strong>$1000.00</strong></span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Delivery Charges</span>
                    <span class="text-success">Free</span>
                  </div>
                  <hr>
                  <div class="d-flex justify-content-between">
                    <span>Amount Payable</span>
                    <span><strong>$1000.00</strong></span>
                  </div>
                </template>
              </iq-card>
            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { sofbox } from '../../../config/pluginInit'
export default {
  name: 'checkout',
  mounted () {
    sofbox.mainIndex()
  }
}
</script>
