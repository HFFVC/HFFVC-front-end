<template>
  <div
    id="main-fruit-block"
    class="customer-home"
    :class="product=='Mango'?'mango-bg':(product=='Pineapple'?'pineapple-bg':'avocado-bg')"
  >
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div>
      <div class v-if="!tableData">
        <div class="row">
          <div class="col-md-12">
            <div class="text-input-wrapper" v-if="urlParam==false">
              <!-- <input
                type="text"
                placeholder="Enter Qr Code"
                class="text-input"
                v-model="qrCodeValueInput"
                @keyup.enter="proceed(qrCodeValueInput)"
              />-->
              <input type="button" @click="showQrcodeModal" class="btn-save" value="Scan QR Code" />
            </div>
          </div>
        </div>
      </div>
      <div class="consumer-header" v-if="tableData">
        <nav role="navigation">
          <div id="menuToggle">
            <input id="menu-input" v-on:click="checkClicked()" type="checkbox" />

            <span></span>
            <span></span>
            <span></span>

            <ul id="menu">
              <li>
                <a href="#" v-scroll-to="'#main-fruit-block'">About</a>
              </li>
              <li>
                <a href="#" v-scroll-to="'#nutritional-value-block'">Nutritional Value</a>
              </li>
              <li>
                <a href="#" v-scroll-to="'#farmer-block'">About Producer</a>
              </li>
              <li>
                <a href="#" v-scroll-to="'#journey-block'">The Journey</a>
              </li>
              <li v-if="isDistributionVisible">
                <a href="#" v-scroll-to="'#payment-block'">Payment Distribution</a>
              </li>
            </ul>
          </div>
          <div class="consumer-header-text">KISKEYA</div>
        </nav>
      </div>
      <div class="col-md-12 details-container" v-if="tableData">
        <div class="details-inner">
          <div class="fruit-title">
            {{product=="Mango"?"Haitian Mango(a.k.a Madame Francis mango)":(product=="Avocado"?"Zaboka Pwa":"Haitian Pineapple")}}
            <br />
            <div
              class="sub-title-text"
            >({{ product=="Mango"?"Francis ":(product=="Avocado"?"Avocado ":"Ananas") }})</div>
          </div>
          <div class="nutri-val-img-wrap">
            <img
              v-if="product == 'Mango'"
              src="../../assets/images/mango-main.png"
              alt="Product Picture"
              class="former-picture fruit-picture-mango"
            />

            <img
              v-if="product == 'Avocado'"
              src="../../assets/images/Picture5.png"
              alt="Product Picture"
              class="former-picture"
            />

            <img
              v-if="product == 'Pineapple'"
              src="../../assets/images/pineapple-main.png"
              alt="Product Picture"
              class="former-picture"
            />
          </div>
          <div class="row">
            <div class="fruit-details main-fruit-details col-md-12" v-if="product == 'Mango'">
              <p
                class="text-fruit"
              >Francis is easily recognizable because they are flatter and hold a more elongated shape than their mango cousins. When ripe, they take on a yellowish-gold color and become freckled with little black dots. Cut them in half and their insides are a vibrant orangey-yellow.</p>
              <p
                class="text-fruit"
              >The rich, sweet and spicy Francis Mango grows on small farms throughout Haiti. Its bright yellow skin with green overtones covers a soft, juicy flesh with fibers. Francis mango differentiates itself from the rest of their mango cousins because they are flatter and hold a more elongated shape. This variety of mango is usually sliced fresh and served plain but you can also use it in salads or smoothies. Francis is righ in Vitamins A and C, is a good source of dietary fiber & antioxidants and plays a protective role in eye health.</p>
              <p class="text-fruit" id="nutritional-value-block">
                Haitian Mangoes are awesome when sliced fresh and served plain. However, there are a few creative recipes our there in the form of salads, salsa, smoothie, etc.
                <br />
                <a class="read-more" href="http://www.johnvenaproduce.com/products/246">Read More</a>
              </p>
            </div>
            <div class="fruit-details main-fruit-details col-md-12" v-if="product == 'Pineapple'">
              <p
                class="text-fruit"
              >Ananas grow in the cooler areas of Haiti, mostly up in the mountains and the ripe ones have distinct yellow, orange-yellow or reddish outer color. This juicy, fleshy fruit is rich in Vitamin C (80% of the fruit is Vitamin C), Potassium, Copper, Manganese and fiber. They are naturally very low on calories with zero fat/cholesterol. It's proteolytic enzyme "Bromelain" is anti-inflammatory, anti-cancer and also helps fight arthritis, indigestion and worm infestation. Regular use of Pineapple boots overall immunity.</p>
              <p
                class="text-fruit"
              >Note: It is not safe for pregnant women to consume Pineapple in large quantities. However, smaller quantities of a few slices do not pose any risk.</p>
              <p
                class="text-fruit"
              >Pineapple can be cut and peeled in many ways. Usually, the crown and the base of the fruit are chopped off with a knife. To peel the fruit, place its base side down and carefully slice off the skin, carving out any remaining "eyes" with the tip of your knife. Once the rind removed, cut the fruit into desirable chunks.</p>
              <p class="text-fruit" id="nutritional-value-block">
                The most famous Pineapple recipe is the Haitian Pineapple Nog, although, there are more than a dozen recipes out there that you can try out.
                <a
                  class="read-more"
                  href="http://www.whfoods.com/genpage.php?tname=foodspice&dbid=34"
                >Read More</a>
              </p>
            </div>
            <div class="fruit-details main-fruit-details col-md-12" v-if="product == 'Avocado'">
              <p
                class="text-fruit"
              >Avocados are characteristically buttery yet subtly flavorful pear-shaped fruits of Central American origin. Unlike most other fruits, they feature high-fat content and carry more calories. Nonetheless, they are among the popular fruits having good nutrition profile and health benefiting properties. Some of the common names are alligator pear, aguacate, butter pear, etc.</p>
              <p
                class="text-fruit"
              >Once Ripen, their complexion turns from light green to deep green or purple, and yield to gentle thumb pressure. Inside, its creamy flesh has a buttery texture with bland taste yet pleasant aroma. The fruit features centrally placed single brown color seed.</p>
              <p
                class="text-fruit"
              >Avocados, like olives, are high in mono-unsaturated fats and calories. However, they are very rich in Vitamins A, E, K, dietary fiber & minerals, Potassium and packed with numerous health benefiting plant nutrients. Its creamy pulp is an excellent source of mono-unsaturated fatty acids like oleic and palmitoleic acids as well as omega-6 polyunsaturated fatty acid, linoleic acid. Research studies suggest that the Mediterranean diet which is rich in mono-unsaturated fatty acids help lower LDL or bad cholesterol and increase HDL or good cholesterol, and thereby, help prevent coronary artery disease as well as stroke risk through favoring healthy blood lipid profile. They are an excellent source of soluble and insoluble dietary fiber. 100 grams of fruit provides 6.7 g or about 18% of recommended daily intake of fiber. Dietary fiber helps lower blood cholesterol levels and prevent constipation.</p>
              <p
                class="text-fruit"
              >The Avocado is a natural anti-inflammatory, anti-ulcer, and antioxidant fruit with immense health benefits.</p>
              <p
                class="text-fruit"
              >Avoid very hard fruits as they may take quite some time to ripe. On the other hand, avoid buying excessively soft, ripe fruits as they tend to be mushy and out of flavor. Look carefully for any surface cuts, blemishes, and bruising and if so, avoid them.</p>
              <p
                class="text-fruit"
              >Avocado has delicate nutty flavor, buttery texture, and neutral taste. To eat, cut the fruit lengthwise through its center all the way around the seed. Then rotate or twist the halves in opposite directions and gently pull apart. Scoop the seed using a spoon. Gently peel the skin with your fingers, beginning at its stem end. Cut the flesh into desired cubes using a knife.</p>
              <p class="text-fruit" id="nutritional-value-block">
                Sprinkle or rinse cut sections of the fruit in lemon juice to prevent enzymatic brown discoloration.
                <br />
                <a
                  class="read-more"
                  href="http://www.whfoods.com/genpage.php?tname=foodspice&dbid=5"
                >Read More</a>
              </p>
            </div>
          </div>
        </div>
        <div class="details-inner">
          <div class="fruit-title nutri-val-text">
            Nutritional
            <br />Value
          </div>
          <div class="nutri-val-img-wrap">
            <img
              v-if="product == 'Avocado'"
              src="../../assets/images/Picture11.png"
              alt="Nutritional value"
              class="nutritional-value-img"
            />
            <img
              v-if="product == 'Pineapple'"
              src="../../assets/images/NP.png"
              alt="Nutritional value"
              class="nutritional-value-img"
            />
            <img
              v-if="product == 'Mango'"
              src="../../assets/images/Picture1.png"
              alt="Nutritional value"
              class="nutritional-value-img"
            />
          </div>
          <div class="row bar-chart-row">
            <div class="col-md-6 col-nutri-6">
              <div class="nutri-col">
                <span class="big-no">{{calories}}</span>
                <br />Calories
                <br />Kcal
              </div>
            </div>
            <div class="col-md-6 col-nutri-6">
              <div class="nutri-col">
                <span class="big-no">{{carbs}}</span>
                <br />Carbs
                <br />gm
              </div>
            </div>
            <div class="col-md-6 col-nutri-6">
              <div class="nutri-col nutri-col-fats">
                <span class="big-no">{{fats}}%</span>
                <br />Fats
              </div>
            </div>
            <div class="col-md-6 col-nutri-6">
              <div class="nutri-col">
                <span class="big-no">{{protein}}</span>
                <br />Protein
                <br />gm
              </div>
            </div>
          </div>
          <div class="row bar-chart-row">
            <ul id="categories" class="clr">
              <li v-for="one in Values" v-bind:key="one.mineral">
                <div class="hex-inner">
                  <div class="middle-container">
                    <div class="box-middle">
                      <span class="big-no">{{one.value}}</span>
                      <div class="next-line">{{one.mineral}}</div>
                      <div class="next-line">{{one.unit=="micro"?"μ":one.unit}}</div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div id="farmer-block"></div>
        </div>
        <div class="details-inner farmer-bg">
          <div class="row bar-chart-row">
            <div class="farmer-title col-md-6 col-nutri-6">
              {{ farmerName }}
              <br />
              <div class="sub-title-text">(The Farmer)</div>
            </div>
            <div class="farmer-img-wrap col-md-6 col-nutri-6">
              <div class="farmer-img-inner">
                <img class="farmer-img" v-if="farmerImage" :src="farmerImage" />
                <img
                  class="farmer-img"
                  v-if="!farmerImage"
                  src="../../assets/images/Picture_dark.png"
                />
              </div>
            </div>
          </div>
          <div class="fruit-details farmer-address">
            <span v-if="latitude!=undefined">{{ Number(latitude).toFixed(3) }}</span>Latitude
            <span v-if="longitude!=undefined">{{ Number(longitude).toFixed(3) }} Longitude</span>
            <div>
              <a :href="urlLink">
                <img
                  src="../../assets/images/location_pin_dark.png"
                  class="loaction-pin"
                  alt="Location"
                />
              </a>
              <div class="loc-pin-text mt-5">Tap the pin to see where the farmer lives</div>
            </div>
          </div>
        </div>
        <div id="journey-block"></div>
        <div class="details-inner details-inner-journey">
          <div class="fruit-title journey-title">The Journey</div>

          <table class="table table-dark customer-home-table" v-if="tableData">
            <tr>
              <td class="journey-table-td">
                <div class="col float-left">
                  <div class="journey-content-wrap">
                    <div class="float-left text-center text-wrap-journey-icon">
                      <img src="../../assets/images/Picture2.png" alt="Harvested" />
                    </div>
                    <div class="float-right text-right text-wrap-journey">
                      <div class="stage-name">Harvested</div>
                      <span class="stage-value">{{requestedOn}}</span>
                    </div>
                  </div>
                </div>
                <div class="col-right float-left">
                  <div class="circle">1</div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="journey-table-td">
                <div class="col float-right">
                  <div class="journey-content-wrap">
                    <div class="float-right text-center text-wrap-journey-icon">
                      <img src="../../assets/images/Picture3.png" class="width-38" alt="collected" />
                    </div>
                    <div class="float-left text-left text-wrap-journey">
                      <div class="stage-name">Collected On</div>

                      <span class="stage-value">{{ pickupAddedOn }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-right float-right">
                  <div class="circle">2</div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="journey-table-td">
                <div class="col float-left">
                  <div class="journey-content-wrap">
                    <div class="float-left text-center text-wrap-journey-icon">
                      <img src="../../assets/images/Picture14.png" alt="arrived" width="30" />
                    </div>
                    <div
                      class="float-right text-right text-wrap-journey text-wrap-journey-long text-wrap-journey-longer"
                    >
                      <div class="stage-name">Arrived at Packhouse On</div>

                      <span class="stage-value">{{ arrivedAtPackhouseAddedOn }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-right float-left col-right-long col-right-longer">
                  <div class="circle">3</div>
                </div>
              </td>
            </tr>

            <tr>
              <td class="journey-table-td">
                <div class="col float-right">
                  <div class="journey-content-wrap">
                    <div class="float-right text-center text-wrap-journey-icon">
                      <img src="../../assets/images/Picture13.png" alt="shipped" class="width-38" />
                    </div>
                    <div class="float-left text-left text-wrap-journey">
                      <div
                        class="stage-name"
                      >{{shippingDetails.trim()==="Shipment by Air"?'Shipped By Air':'Shipped By Sea'}}</div>

                      <span class="stage-value">{{ departureDateTimeTransport }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-right float-right">
                  <div class="circle">4</div>
                </div>
              </td>
            </tr>
          <tr>
              <td class="journey-table-td">
                <div class="col float-left">
                  <div class="journey-content-wrap">
                    <div class="float-left text-center text-wrap-journey-icon">
                      <img src="../../assets/images/Picture14.png" alt="stored" width="30" />
                    </div>
                    <div class="float-right text-right text-wrap-journey">
                      <div class="stage-name">Stored</div>

                      <span class="stage-value">{{ arrivalTimestamp }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-right float-left">
                  <div class="circle">5</div>
                </div>
              </td>
            </tr>
             <!--  <tr>
              <td class="journey-table-td">
                <div class="col float-right">
                  <div class="journey-content-wrap">
                    <div class="float-right text-center text-wrap-journey-icon">
                      <img src="../../assets/images/Picture10.png" alt="transported" width="15" />
                    </div>
                    <div class="float-left text-left text-wrap-journey text-wrap-journey-long">
             
                      <div class="stage-name">Arrived at Final Location</div>

                      <span class="stage-value">{{ dateAndTimeOfLoading }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-right float-right col-right-long">
                  <div class="circle">6</div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="journey-table-td">
                <div class="col float-left">
                  <div class="journey-content-wrap">
                    <div class="float-left text-center text-wrap-journey-icon">
                      <img src="../../assets/images/Picture14.png" alt="storage" width="30" />
                    </div>
                    <div class="float-right text-right text-wrap-journey">
                      <div class="stage-name">Buyer’s Storage</div>

                      <span class="stage-value">{{ dateAndTimeOfUnLoading }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-right float-left">
                  <div class="circle">7</div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="journey-table-td">
                <div class="col float-right">
                  <div class="journey-content-wrap">
                    <div class="float-right text-center text-wrap-journey-icon">
                      <img src="../../assets/images/Picture9.png" class="width-38" alt="Location" />
                    </div>
                    <div class="float-left text-left text-wrap-journey" id="payment-block">
                      <div class="stage-name">Buyer Location</div>

                      <span class="stage-value">{{ buyersLocation }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-right float-right">
                  <div class="circle">8</div>
                </div>
              </td>
            </tr> -->
          </table>
        </div>
        <div id="payment-block"></div>
        <div class="details-inner last-details-inner" v-if="isDistributionVisible">
          <div class="fruit-title title-distribution">
            Who Got How Much!
            <br />
            <span class="sub-title-text">(Money Distribution)</span>
          </div>
          <div class="dist-details col-md-12">
            <p class="text-fruit text-bold">
              Below is a snapshot of the price distribution per fruit.
              The farmer receives the least in spite of a steep price consumers pay for the produce.
              Help increase farmer's income.
            </p>
          </div>
          <div class="distribution-btn-wrap">
            <a
              class="btn-here text-bold"
              v-on:click="showTempModal()"
              href="#"
            >Click here to know how!</a>
          </div>
          <div class="dist-details col-md-12">
            <!-- <p class="text-fruit text-bold">
              Total fruits sold by farmer:
              <span class="text-normal">{{totalFruitsSold}} {{product=="Mango"?'Mangoes':(product=="Pineapple"?"Pineapples":"Avocados")}}</span>
            </p>-->
            <p class="text-fruit text-bold">Price distribution per fruit:</p>
            <ul class="ul-details">
              <li class="dist-details-li">
                <div class="dist-left">Farmer's Net Income:</div>
                <div class="dist-right">
                  <span class="text-normal">${{farmersRevenue}}</span>
                </div>
              </li>
              <li class="dist-details-li">
                <div class="dist-left">Logistics Provider:</div>
                <div class="dist-right">
                  <span class="text-normal">${{logisticsProvider}}</span>
                </div>
              </li>
              <!-- <li class="dist-details-li">
                To Freight Provider:
                <span class="text-normal">${{toFreightProvider}}</span>
              </li>-->
              <li class="dist-details-li">
                <div class="dist-left">Broker's Margin:</div>
                <div class="dist-right">
                  <span class="text-normal">${{brokersMargin}}</span>
                </div>
              </li>
              <li class="dist-details-li">
                <div class="dist-left">Transport Charges:</div>
                <div class="dist-right">
                  <span class="text-normal">${{transportCharges}}</span>
                </div>
              </li>
              <li v-if="superMarketFlag && retailersPrice" class="dist-details-li">
                <div class="dist-left">
                  Retailer's Price:
                  <br />
                  <span
                    class="inner-foor-note"
                  >* approximate value. Assuming {{fruitCountPerKg}} pieces per kg</span>
                </div>
                <div class="dist-right">
                  <span class="text-normal">${{retailersPrice}}</span>
                </div>
              </li>
              <li class="dist-details-li">
                <div class="dist-left">Miscellaneous:</div>
                <div class="dist-right">
                  <span class="text-normal">${{miscellaneous}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="foot-note">* Currency is US Dollars</div>
        <b-modal ref="temp-modal" hide-footer title id="temp-modal" hide-backdrop>
          <label class="lbl-temp-modal">Development Under Progress!</label>
        </b-modal>
      </div>
    </div>
    <b-modal
      hide-footer
      id="qrcode-modal"
      class="qrcode-modal"
      @hide="hideQrcodeModal"
      ref="qrcode-modal"
      hide-backdrop
      no-close-on-backdrop
      title="Scan QR Code"
      data-backdrop="static"
    >
      <div class="digital-signature-container">
        {{ qrcodeError }}
        <qrcode-stream @decode="onDecode" @init="onInit">
          <span class="qrcode-name">QR Code: {{ qrcodeResult }}</span>
        </qrcode-stream>
      </div>
      <!-- <button class="digital-signature-btn" @click="hideQrcodeModal">Done</button> -->
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../../router";
import firebase, { functions } from "firebase";
import moment from "moment";
import "../../assets/css/producer-list.css";
import "../../assets/css/planned-pickup.css";
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.use(DropDownListPlugin);
import Datetime from "vue-datetime";
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import "vue-datetime/dist/vue-datetime.css";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
import VueQrcodeReader from "vue-qrcode-reader";
import axios from "axios";
Vue.use(VueQrcodeReader);
Vue.use(VueToast);

import VueScrollTo from "vue-scrollto";
import getConfigVars from '../../shared/config-env';
Vue.use(VueScrollTo);

export default {
  components: {
    PerfectScrollbar
  },
  mounted() {
    firebase
      .auth()
      .signInWithEmailAndPassword(getConfigVars().PUBLICUSERNAME, getConfigVars().PUBLICUSERPASSWORD)
      .then(response => {
        localStorage.emailId = response.user.email;
firebase
              .auth()
              .currentUser.getIdToken(true)
              .then(idtoken => {
                console.log(idtoken);
                localStorage.IDtoken = idtoken;
                console.log(localStorage.IDtoken);
              });
        // var ref = firebase
        //   .database()
        //   .ref()
        //   .child("profile")
        //   .child(response.user.uid);
        // ref.on("value", snapshot => {
        //   localStorage.userName =
        //     snapshot.val().firstName +
        //     " " +
        //     snapshot.val().lastName +
        //     " (" +
        //     snapshot.val().function +
        //     ")";
        //   localStorage.systemRole = snapshot.val().systemRole;
          if (this.$route.params.id) {
            this.urlParam = true;
            this.proceed(this.$route.params.id);
          } else {
            this.urlParam = false;
            this.showInputText = true;
          }
        // });
      })
      .catch(function(error) {
        currentval.seen = false;
        Vue.$toast.open({
          message: "Something went wrong! Please try after sometime!",
          type: "error",
          position: "top"
        });
      });
  },
  data() {
    return {
      serviceRequest: null,
      seen: false,
      tableData: null,
      currentServiceRequest: null,
      serviceRequestId: null,
      requestedOn: "",
      pickupAddedOn: "",
      collectionPoint: "",
      arrivedAtPackhouseAddedOn: "",
      departureDateTimeTransport: "",
      batchId: "",
      producer: "",
      product: "",
      arrivalTimestamp: null,
      farmerId: null,
      farmerName: null,
      latitude: null,
      longitude: null,
      buyersLocation: null,
      dateAndTimeOfLoading: null,
      dateAndTimeOfUnLoading: null,
      pageTitle: "MY JOURNEY",
      farmerImage: null,
      shippingDetails: "",
      qrcodeResult: "",
      qrcodeError: "",
      showInputText: false,
      qrCodeValueInput: null,
      urlParam: true,
      urlLink: null,
      vitaminAPercent: 0,
      vitaminCPercent: 0,
      ironPercent: 0,
      calciumPercent: 0,
      productName: "Zaboka Pwa",
      calories: 0,
      carbs: 0,
      fats: 0,
      protein: 0,
      Values: null,
      farmersRevenue: null,
      logisticsProvider: null,
      toFreightProvider: null,
      brokersMargin: null,
      transportCharges: null,
      miscellaneous: null,
      retailersPrice: null,
      totalFruitsSold: null,
      priceDistributionPerFruit: null,
      superMarketFlag: true,
      isDistributionVisible: false,
      fruitCountPerKg: 0,
      boxSize:0
    };
  },
  methods: {
    showTempModal: function() {
      this.$refs["temp-modal"].show();
    },
    hideTempModal: function() {
      this.$refs["temp-modal"].hide();
    },
    getFarmerImage: function(farmerId) {
      let currentValue = this;
      console.log(farmerId);
      firebase
        .storage()
        .ref(`profile_images/${farmerId}.jpg`)
        .getDownloadURL()
        .then(function(url) {
          currentValue.farmerImage = url;
        });
    },
    proceed(qrcode) {
      if (
        qrcode != undefined &&
        qrcode != null &&
        qrcode != "" &&
        qrcode.trim()
      ) {
        const vm = this;
        vm.seen = true;
        //const _qrcode = qrcode.split("-")[0];
        vm.hideQrcodeModal();
        firebase
          .database()
          .ref()
          .child("fruits")
          .child(qrcode)
          .on("value", function(snapshot) {
            console.log(snapshot.val());
            if (snapshot.val() == null) {
              vm.seen = false;
              Vue.$toast.open({
                message: `Invalid QR Code or No record present.`,
                type: "error",
                position: "top"
              });
              return false;
            }
            const _serviceRequestId = snapshot.val().split("--")[0];
            vm.boxSize = snapshot.val().split("--")[1];
            if (_serviceRequestId) {
              const ref = firebase
                .database()
                .ref("serviceRequest/")
                .orderByChild("serviceRequestId")
                .equalTo(_serviceRequestId)
                .on("child_added", function(snapshot) {
                  const {
                    requestedOn,
                    pickupAddedOn,
                    collectionPoint,
                    arrivedAtPackhouseAddedOn,
                    departureDateTimeTransport,
                    batchId,
                    producer,
                    product,
                    farmerId,
                    shippingDetails
                  } = snapshot.val();
                  firebase
                    .database()
                    .ref()
                    .child("batch")
                    .orderByChild("batchId")
                    .equalTo(batchId)
                    .on("child_added", function(snap) {
                      console.log("*******");
                      // console.log(snap.val().sell)
                      let key = Object.keys(snap.val().sell)[0];
                      // console.log(key)
                      let saleData = snap.val().sell[key];
                      console.log(saleData);
                      const _sellId = saleData.sellId;
                      const _srid = saleData.boxesSelected[0].serviceRequestId.split(
                        "--"
                      )[0];

                      if (saleData.buyerFeedback) {
                        vm.product = saleData.soldProduct;
                        const fruitsPerBoxes = (function() {
                          if (saleData.soldProduct == "Mango") {
                            vm.fruitCountPerKg = 3;
                            return 3;
                          } else if (saleData.soldProduct == "Avocado") {
                            vm.fruitCountPerKg = 2;
                            return 2;
                          } else {
                            vm.fruitCountPerKg = 1;
                            return 1;
                          }
                        })();
                        vm.retailersPrice = (
                          saleData.buyerFeedback.unitPrice / fruitsPerBoxes
                        ).toFixed(2);
                        vm.superMarketFlag =
                          saleData.buyerFeedback
                            .paymentDistributionVisibility == "Y"
                            ? true
                            : false;
                      }
                      vm.isDistributionVisible = true;
                      // vm.axios
                      //   .get(
                      //     `${getConfigVars().BASE_URL}/api/v1/corda/calculate/sale/${_sellId}`
                      //   )
                      //   .then(function({ data }) {
                      //     console.log("$$$$$$$$$$");
                      //     console.log(data);
                      //     vm.product = (function() {
                      //       if (data.info.product == "avocado") {
                      //         return "Avocado";
                      //       } else if (data.info.product == "mango") {
                      //         return "Mango";
                      //       } else {
                      //         return "Pineapple";
                      //       }
                      //     })();
                      //     const perUnit = data.info.boxesSold * 10;
                      //     const fr = Number(data.profits.producer).toFixed(2);
                      //     const lp = data.profits.lsp.toFixed(2);
                      //     const bm = data.profits.broker.toFixed(2);
                      //     const tc = data.profits.brokerTransport;
                      //     vm.farmersRevenue = (fr / perUnit).toFixed(2);
                      //     vm.logisticsProvider = (lp / perUnit).toFixed(2);
                      //     vm.brokersMargin = (bm / perUnit).toFixed(2);
                      //     vm.transportCharges = (tc / perUnit).toFixed(2);
                      //     vm.miscellaneous = (
                      //       (data.profits.ngo +
                      //         data.profits.sae +
                      //         data.profits.bankTxFee) /
                      //       perUnit
                      //     ).toFixed(2);
                      //   });
                        vm.axios
        .get(
          `${getConfigVars().BASE_URL}50011/api/v1.0/payment-distribution?saleId=${_sellId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken
            }
          }
        )
        .then(function(response) {
                            vm.seen = false;
                          //vm.product = response.data.product
                     
                           const perUnit = Number(response.data.totalBoxesSold * vm.boxSize);
                          // const fr = Number(data.profits.producer).toFixed(2);
                          var saeAmount = null;
                          var ngoAmount = null;
                          var bankTransFee = null;
                          response.data.sales.forEach(singleVal => {
if(singleVal.role == "LSP")
{
    const lp = Number(singleVal.amount).toFixed(2);
            vm.logisticsProvider = (lp / perUnit).toFixed(2);
}
else if(singleVal.role == "SAE")
{
  saeAmount = Number(singleVal.amount).toFixed(2);
}
                          });  
                          response.data.lots.forEach(singleVal => {
                          
                            if(singleVal.lotId == (_serviceRequestId))
                            {
                           ngoAmount = Number(singleVal.ngoAmount);
                              vm.farmersRevenue = (Number(singleVal.producerAmount) / perUnit).toFixed(2);
                            }
                          });
                        
                          // const bm = data.profits.broker.toFixed(2);
                          // const tc = data.profits.brokerTransport;
                          // vm.farmersRevenue = (fr / perUnit).toFixed(2);
 
                          vm.brokersMargin = ((Number(response.data.brokerMargin)) / Number(perUnit)).toFixed(4);
                           vm.transportCharges = (Number(response.data.brokerTransport)  / Number(perUnit)).toFixed(2);
                        
                          vm.miscellaneous = Number(
                            (Number(ngoAmount) +
                             Number(saeAmount) +
                             Number(response.data.bankTransactionCharges)) /
                           Number(perUnit)
                          ).toFixed(2);
                        });
                    });
                  vm.requestedOn = moment
                    .utc(requestedOn)
                    .local()
                    .format("MMM DD, YYYY hh:mm A");
                  vm.pickupAddedOn = moment
                    .utc(pickupAddedOn)
                    .local()
                    .format("MMM DD, YYYY hh:mm A");
                  vm.arrivedAtPackhouseAddedOn = moment
                    .utc(arrivedAtPackhouseAddedOn)
                    .local()
                    .format("MMM DD, YYYY hh:mm A");
                  vm.departureDateTimeTransport = moment
                    .utc(departureDateTimeTransport)
                    .local()
                    .format("MMM DD, YYYY hh:mm A");
                  vm.batchId = batchId;
                  vm.producer = producer;
                  vm.product = product;
                  vm.farmerId = farmerId;
                  vm.shippingDetails = shippingDetails.shippingMode.split("(")[0];
                  if (vm.product == "Mango") {
                    vm.Values = [
                      {
                        value: "122",
                        mineral: "Vitamin C",
                        unit: "mg"
                      },
                      {
                        value: "3.36",
                        mineral: "Sodium",
                        unit: "mg"
                      },
                      {
                        value: "564",
                        mineral: "Potassium",
                        unit: "mg"
                      },
                      {
                        value: "144",
                        mineral: "Folate",
                        unit: "micro"
                      }
                    ];
                    vm.calories = 202;
                    vm.carbs = 50.3;
                    vm.fats = 2;
                    vm.protein = 2.76;
                  } else if (vm.product == "Pineapple") {
                    vm.calories = 452;
                    vm.carbs = 119;
                    vm.fats = 1;
                    vm.protein = 4.8;
                    vm.Values = [
                      {
                        value: "433",
                        mineral: "Vitamin C",
                        unit: "mg"
                      },
                      {
                        value: "9.05",
                        mineral: "Sodium",
                        unit: "mg"
                      },
                      {
                        value: "986",
                        mineral: "Potassium",
                        unit: "mg"
                      },
                      {
                        value: "8.39",
                        mineral: "Manganese",
                        unit: "mg"
                      }
                    ];
                  } else {
                    vm.calories = 160;
                    vm.carbs = 9;
                    vm.fats = 23;
                    vm.protein = 2;
                    vm.Values = [
                      {
                        value: "10",
                        mineral: "Vitamin C",
                        unit: "mg"
                      },
                      {
                        value: "7",
                        mineral: "Sodium",
                        unit: "mg"
                      },
                      {
                        value: "485",
                        mineral: "Potassium",
                        unit: "mg"
                      },
                      {
                        value: "21",
                        mineral: "Vitamin K",
                        unit: "micro"
                      }
                    ];
                  }
                  // TODO: replace static batchId with _batchId
                  firebase
                    .database()
                    .ref()
                    .child("batch")
                    .child(batchId)
                    .child("sell")
                    .orderByChild("batchId")
                    .equalTo(batchId)
                    .on("child_added", function(snapshot) {
                      // console.log(snapshot.val());
                      if (snapshot.val().boxesSelected) {
                        let boxes = snapshot.val().boxesSelected;
                        boxes.forEach(box => {
                          let srid = box.serviceRequestId.split("--")[0];
                          if (_serviceRequestId == srid) {
                            const {
                              dateAndTimeOfLoading,
                              dateAndTimeOfUnLoading,
                              buyersLocation
                            } = snapshot.val();
                            vm.dateAndTimeOfLoading = moment
                              .utc(dateAndTimeOfLoading)
                              .local()
                              .format("MMM DD, YYYY hh:mm A");
                            vm.dateAndTimeOfUnLoading = moment
                              .utc(dateAndTimeOfUnLoading)
                              .local()
                              .format("MMM DD, YYYY hh:mm A");
                            vm.buyersLocation = buyersLocation;
                          }
                        });
                      }
                    });

                  vm.getFarmerImage(vm.farmerId);
               
                  firebase
                    .database()
                    .ref("batch")
                    .child(vm.batchId)
                    .child("maintain")
                    .on("value", function(snapshot) {
                      vm.arrivalTimestamp = moment(
                        snapshot.val().arrivalTimestamp
                      ).format("DD MMM YYYY");
                      vm.tableData = true;
                    });

                  firebase
                    .database()
                    .ref()
                    .child("masters")
                    .child("producer")
                    .orderByChild("uuid_id")
                    .equalTo(vm.farmerId)
                    .on("child_added", function(snapshot) {
                      const {
                        firstname,
                        lastname,
                        latitude,
                        longitude
                      } = snapshot.val();
                      vm.farmerName = `${firstname} ${lastname}`;
                      vm.latitude = latitude;
                      vm.longitude = longitude;
                      vm.tableData = true;
                      vm.urlLink =
                        "https://www.google.com/maps/@" +
                        longitude +
                        "," +
                        latitude +
                        ",10z";
                    });

                  firebase
                    .database()
                    .ref()
                    .child("batch")
                    .child(vm.batchId)
                    .child("sell")
                    .on("child_added", function(snapshot) {
                      if (vm.buyersLocation) {
                        const {
                          dateAndTimeOfUnLoading,
                          buyersLocation,
                          dateAndTimeOfLoading
                        } = snapshot.val();
                        vm.dateAndTimeOfUnLoading = moment
                          .utc(dateAndTimeOfUnLoading)
                          .local()
                          .format("MMM DD, YYYY hh:mm A");
                        vm.buyersLocation = buyersLocation;
                        vm.dateAndTimeOfLoading = moment
                          .utc(dateAndTimeOfLoading)
                          .local()
                          .format("MMM DD, YYYY hh:mm A");
                        vm.tableData = true;
                      }
                    });
                });
            } else {
              Vue.$toast.open({
                message: "Please enter a service request to proceed.",
                type: "error",
                position: "top"
              });
            }
          });
      } else {
        Vue.$toast.open({
          message: "Please enter a QR Code",
          type: "error",
          position: "top"
        });
      }
    },
    showMap(latitude, longitude) {
      const location = `${latitude},${longitude}`;
      Router.push("customer-map/" + location);
    },
    onDecode(result) {
      this.qrcodeResult = result;
      this.proceed(result);
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.qrcodeError = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.qrcodeError = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.qrcodeError =
            "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.qrcodeError = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.qrcodeError = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.qrcodeError =
            "ERROR: Stream API is not supported in this browser";
        }
      }
    },
    async onDetect(promise) {
      try {
        const { content } = await promise;

        this.result = content;
        this.error = null;
      } catch (error) {
        if (error.name === "DropImageFetchError") {
          this.error = "Sorry, you can't load cross-origin images :/";
        } else if (error.name === "DropImageDecodeError") {
          this.error = "Ok, that's not an image. That can't be decoded.";
        } else {
          this.error = "Ups, what kind of error is this?! " + error.message;
        }
      }
    },
    logErrors(promise) {
      promise.catch(console.error);
    },
    checkClicked: function() {
      var width = "235";
      var hint = document.getElementById("menu");
      if (hint.style.visibility == "hidden" || hint.style.visibility == "") {
        hint.style.width = width + "px";
        hint.style.opacity = "1";
        hint.style.visibility = "visible";
      } else {
        hint.style.visibility = "hidden";
        hint.style.opacity = "0";
        hint.style.width = "0";
      }
    },
    showQrcodeModal() {
      this.$refs["qrcode-modal"].show();
    },
    hideQrcodeModal() {
      this.$refs["qrcode-modal"].hide();
    }
  }
};
window.addEventListener("click", function(e) {
  if (!document.getElementById("menuToggle").contains(e.target)) {
    var width = "235";
    var hint = document.getElementById("menu");
    if (hint.style.visibility != "hidden" && hint.style.visibility != "") {
      hint.style.visibility = "hidden";
      hint.style.opacity = "0";
      hint.style.width = "0";
    }
    document.getElementById("menu-input").checked = false;
    // Clicked outside the box
  }
});
</script>
<style>
html,
body,
#app {
  height: 100%;
}
.title-text {
  font-size: 15px !important;
}
#qrcode-modal .modal-content {
  margin: 0 auto;
}
#qrcode-modal .modal-body {
  text-align: center;
}
#temp-modal .modal-content {
  width: 400px;
  margin: 0 auto;
  position: relative;
}
@media screen and (max-width: 1062px) and (max-width: 768px) {
  #qrcode-modal .modal-content {
    width: 100%;
  }
}
</style>
<style scoped>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
.customer-home {
  font-weight: 400;
  width: 500px;
  margin: 0px auto;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: -5px -5px;
  min-height: 100%;
  height: auto;
}
.farmer-img {
  width: 100%;
  height: auto;
  padding: 30px;
}
.container-bg {
  position: absolute;
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  right: 0;
  top: 0;
  min-width: 100%;
  min-height: 100%;
}
.mango-bg {
  background-image: url("../../assets/images/mango-bg.png");
}
.avocado-bg {
  background-image: url("../../assets/images/Picture12.png");
}
.pineapple-bg {
  background-image: url("../../assets/images/pineapple-bg.png");
}
.content {
  margin: auto;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.details-container {
  margin: auto;
  padding-top: 65px;
  padding-bottom: 35px;
}
.header-container {
  height: auto;
  padding: 15px;
  background: rgba(0, 0, 0, 0.616);
  border-radius: 5px 5px 0px 0px;
  border: 1px solid #000;
}
.main-container {
  /* border: 0.5px solid #000; */
  background: rgba(0, 0, 0, 0.4);
  /* border-radius: 0px 0px 5px 5px; */
  /* border: 1px solid #000; */
  /* border-top: 0px !important; */
}
.heading {
  color: #fff;
  text-align: center;
  margin: auto;
  font-size: 14px !important;
}
.inp-container {
  float: left;
  display: inline;
  margin: 0px 0px 0px 0px;
  font-size: 13px;
}
.inp-details {
  width: 90%;
  margin: 15px;
  background: none;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff;
  font-size: 13px;
  padding: 10px;
}
.inp-service {
  background-image: url("../../assets/images/service_request.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
  background-size: 20px 20px;
}
.btn-save {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 12px;
  width: 115px;
  height: 26px;
  margin: 5px;
  color: #fff;
}
.photo-container {
  margin-top: 22px !important;
}
.former-picture {
  width: 38%;
  height: auto;
  margin-top: 20px;
}
.fruit-details {
  color: #000;
}
.margin-l-5 {
  margin-left: 5%;
}
.stage-name {
  color: #000;
  font-weight: 700;
}
.stage-value {
  color: #000;
}
.customer-home-table tbody tr td:nth-child(4) {
  text-align: right !important;
  padding-right: 50px !important;
}
.customer-home-table thead > tr > th:nth-child(4) {
  text-align: right !important;
  padding-right: 50px !important;
}
.customer-home-table tbody,
.customer-home-table td,
.customer-home-table td,
.customer-home-table td,
.customer-home-table th,
.customer-home-table tr {
  text-align: left !important;
}
.table-dark {
  background-color: transparent;
}
.table-dark td {
  border: 0px !important;
}
.font-smaller {
  font-size: smaller;
}
.read-more {
  text-decoration: none;
}
.loaction-pin {
  height: 30px;
  margin-top: 30px;
  cursor: pointer;
}
#qrcode-modal .modal-content {
  width: 600px;
  margin: 0px auto;
  position: relative;
}
#qrcode-modal .modal-body {
  text-align: center;
}
#qrcode-modal .modal.show .modal-dialog {
  display: block;
}
#qrcode-modal .close {
  /* visibility: hidden; */
}
.digital-signature-label {
  color: #fff;
  margin-left: 30px;
}
.digital-signature-container {
  background-color: rgba(256, 256, 256, 0.1);
  margin: 0 auto;
  padding-top: 20px;
}
.digital-signature-btn {
  padding: 5px 20px;
  color: #fff;
  background-color: #7f7f7f;
  border: 1px solid black;
  margin: 0 auto;
  margin-top: 20px;
}
.details-wrap {
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #000;
}
.fruit-title {
  margin: 10px;
  font-weight: 800;
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 22px;
  text-align: left;
  width: 50%;
}
.customer-scroll {
  height: 600px;
}
.details-container .main-container {
  height: auto !important;
  /* border: 1px solid #000 !important; */
  background: none;
}
.text-fruit {
  text-align: justify;
}
.hr-customer {
  margin: 25px;
  color: #000;
  border-color: #000;
}
.farmer-img-wrap {
  width: 100%;
  text-align: right;
  padding-top: 20px;
}

.details-wrap h5 {
  font-weight: 700;
}
.fruit-details p {
  color: #000;
}
.main-fruit-details {
  padding: 0px 60px;
}
.text-input-wrapper {
  margin: 0 auto;
  width: 300px;
  margin-top: 200px;
  border: 1px solid #000;
  padding: 40px;
  background: rgba(256, 256, 256, 0.5);
  border-radius: 5px;
  color: #fff;
}
.text-input-wrapper .text-input {
  background: transparent;
  outline: none;
  border: none;
  border-bottom: 1px solid #000;
  margin-top: 10px;
}
.text-input-wrapper .btn-save {
  margin-top: 30px;
}
::placeholder {
  color: #000 !important;
}
.details-inner {
  background: rgba(256, 256, 256, 0.7);
  width: 90%;
  margin: 0 auto;
  border-radius: 20px;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 35px;
  font-size: 16px;
}
.nutritional-value-img {
  width: 50%;
  margin: 0 auto;
  margin-top: 10px;
  margin-right: 5px;
}
.nutri-col {
  border: 2px solid #fff;
  background: rgba(256, 256, 256, 0.8);
  height: 125px;
  padding: 10px;
  border-radius: 10px;
  margin: 10px;
  color: #385723;
}
.percent-bar-row {
  height: 200px;
}
.vit-bar {
  background-color: #abd090;
  position: absolute;
  bottom: 40px;
  width: 55px;
  border: 1px solid #fff;
  border-radius: 3px;
  text-align: center;
  left: 50px;
}
.bar-chart-row {
  margin: 0px;
}
.col-vit {
  -webkit-box-flex: 0;
  flex: 0 0 25%;
  max-width: 25%;
  margin-top: 50px;
}
.bar-label {
  font-size: 12px;
  font-weight: 400;
  position: absolute;
  bottom: 16px;
  width: 55px;
  left: 50px;
  color: #385723;
}
.sub-title-text {
  font-size: 18px;
}
.nutri-val-img-wrap {
  width: 100%;
  text-align: right;
}
.nutri-val-text {
  text-align: left;
}
.col-nutri-6 {
  -webkit-box-flex: 0;
  flex: 0 0 50%;
  max-width: 50%;
}
.vit-bar-inside-label {
  font-size: 10px;
  position: absolute;
  bottom: 0px;
  left: 5px;
}
.customer-home {
  font-weight: 400;
}
.farmer-address {
  font-weight: 500;
  font-size: 18px;
  padding-bottom: 100px;
  padding: 20px;
}
.loc-pin-text {
  color: #35462e;
  font-size: 14px;
}
.details-inner-journey {
  padding-top: 100px;
}
.col {
  border: 1px solid #000;
  border-radius: 50px;
  padding: 20px;
  width: 70%;
  background: rgba(256, 256, 256, 0.6);
}
.journey-content-wrap {
  width: 100%;
  margin: 0 auto;
}
.col-nutri-6 {
  -webkit-box-flex: 0;
  flex: 0 0 50%;
  max-width: 50%;
}
.col-right {
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 15px;
  width: 20% !important;
}
.circle {
  border: 1px solid #000;
  border-radius: 50px;
  background: rgba(256, 256, 256, 0.6);
  text-align: center;
  color: #000;
  font-size: 18px;
  padding: 11px 11px;
  width: 50px;
  height: 50px;
}
.journey-title {
  top: 20px;
  left: 20px;
}
.journey-table-td {
  padding: 10px 30px;
}
.farmer-img-inner {
}
.farmer-title {
  padding: 20px 0px 0px 20px;
  font-weight: 800;
  font-size: 22px;
  text-align: left;
  width: 50%;
}
.col-right {
  width: auto;
}
.nutri-col-fats {
  padding-top: 18px;
}
.farmer-bg {
  background: url(../../assets/images/Picture19.png);
  background-repeat: no-repeat;
  background-size: cover;
  padding-bottom: 180px;
}
.big-no {
  font-size: 35px;
  margin: 0 auto;
  position: relative !important;
}
#categories {
  overflow: hidden;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  padding: 0;
}
.clr:after {
  content: "";
  display: block;
  clear: both;
}
#categories li {
  position: relative;
  list-style-type: none;
  width: 33.857143%;
  padding-bottom: 38.167601%;
  /*width: 27.85714285714286%;  = (100-2.5) / 3.5 */
  /*padding-bottom: 32.16760145166612%;  =  width /0.866 */
  /* float: left; */
  display: inline-block;
  overflow: hidden;
  visibility: hidden;
  border: 1px solid #fff;
  -webkit-transform: rotate(-60deg) skewY(30deg);
  -ms-transform: rotate(-60deg) skewY(30deg);
  transform: rotate(-60deg) skewY(30deg);
}
#categories li:nth-child(3n + 2) {
  margin: 0 1%;
}
#categories li:nth-child(6n + 4),
#categories li:nth-child(6n + 2) {
  margin-left: 17.5%;
}
#categories li:nth-child(6n + 3),
#categories li:nth-child(6n + 4),
#categories li:nth-child(6n + 6) {
  margin-top: 2.071429%;
  /* margin-bottom: -6.9285714285%; */

  -webkit-transform: translateX(0%) rotate(-60deg) skewY(30deg);
  -ms-transform: translateX(0%) rotate(-60deg) skewY(30deg);
  transform: translateX(0%) rotate(-60deg) skewY(30deg);
}
#categories li:nth-child(6n + 3):last-child,
#categories li:nth-child(6n + 4):last-child,
#categories li:nth-child(6n + 6):last-child {
  margin-bottom: 0%;
}
#categories li * {
  position: absolute;
  visibility: visible;
}
#categories li > div {
  width: 100%;
  height: 100%;
  text-align: center;
  color: #35462e;
  overflow: hidden;
  border: 1px solid #fff;
  -webkit-transform: skewY(-30deg) rotate(60deg);
  -ms-transform: skewY(-30deg) rotate(60deg);
  transform: skewY(-30deg) rotate(60deg);

  -webkit-backface-visibility: hidden;
  background: rgba(256, 256, 256, 0.6);
}

/* HEX CONTENT */
#categories li img {
  left: -100%;
  right: -100%;
  width: auto;
  height: 100%;
  margin: 0 auto;
}

#categories div h1,
#categories div p {
  width: 90%;
  padding: 0 5%;
  background-color: #008080;
  background-color: rgba(0, 128, 128, 0.8);
  font-family: "Raleway", sans-serif;

  -webkit-transition: top 0.2s ease-out, bottom 0.2s ease-out,
    0.2s padding 0.2s ease-out;
  -ms-transition: top 0.2s ease-out, bottom 0.2s ease-out,
    0.2s padding 0.2s ease-out;
  transition: top 0.2s ease-out, bottom 0.2s ease-out,
    0.2s padding 0.2s ease-out;
}
#categories li h1 {
  bottom: 110%;
  font-style: italic;
  font-weight: normal;
  font-size: 1.5em;
  padding-top: 100%;
  padding-bottom: 100%;
}
#categories li h1:after {
  content: "";
  display: block;
  position: absolute;
  bottom: -1px;
  left: 45%;
  width: 10%;
  text-align: center;
  z-index: 1;
  border-bottom: 2px solid #fff;
}
#categories li p {
  padding-top: 50%;
  top: 110%;
  padding-bottom: 50%;
}

/* HOVER EFFECT  */

#categories li div:hover h1 {
  bottom: 50%;
  padding-bottom: 10%;
}

#categories li div:hover p {
  top: 50%;
  padding-top: 10%;
}
#fork {
  position: fixed;
  top: 0;
  left: 0;
  color: #000;
  text-decoration: none;
  border: 1px solid #000;
  padding: 0.5em 0.7em;
  margin: 1%;
  transition: color 0.5s;
  overflow: hidden;
}
#fork:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 130%;
  height: 100%;
  background: #000;
  z-index: -1;
  transform-origin: 0 0;
  transform: translateX(-100%) skewX(-45deg);
  transition: transform 0.5s;
}
#fork:hover {
  color: #fff;
}
#fork:hover:before {
  transform: translateX(0) skewX(-45deg);
}
.hex-inner {
  text-align: center;
}
.middle-container {
  display: table;
  position: absolute;
  width: 100%;
  height: 100%;
}
.box-middle {
  display: table-cell;
  vertical-align: middle;
  position: relative !important;
}
.next-line {
  position: relative !important;
}
.width-38 {
  width: 38px;
}
.title-distribution {
  text-align: center;
  font-weight: 800;
  width: 100%;
  position: relative;
  top: 0px;
  left: 0px;
  margin: 0px;
  padding-top: 20px;
}
.btn-here {
  background-color: #c55a11;
  border-radius: 25px;
  border: none;
  font-size: 12px;
  color: #fff;
  padding: 5px 15px;
}
.dist-details {
  padding: 40px;
  color: #000;
}
.dist-details p {
  color: #000;
}
.ul-details {
  list-style-type: square;
  font-weight: 700;
  margin-top: 15px;
  padding: 0px;
  padding-left: 30px;
}
.text-bold {
  font-weight: 700;
}
.dist-details-li {
  text-align: left;
  padding-bottom: 15px;
  padding-left: 15px;
  width: 100%;
  height: 50px;
}
.text-normal {
  font-weight: 100;
}
.last-details-inner {
  margin-bottom: 0px;
}
.foot-note {
  text-align: left;
  font-size: 12px;
  color: #000;
  padding-top: 10px;
  width: 90%;
  margin: 0 auto;
  font-weight: 500;
  padding-left: 10px;
}
.lbl-temp-modal {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  text-align: center;
  margin: 30px 0px;
  width: 100%;
}
.consumer-header {
  background: rgba(256, 256, 256, 0.7);
  height: 45px;
  position: fixed;
  width: 500px;
  z-index: 9;
}
.consumer-header-text {
  float: left;
  font-size: 20px;
  text-align: left;
  padding: 3px 10px 10px 64px;
  position: relative;
  top: -17px;
}
.consumer-menu-icon {
  width: 60px;
  position: absolute;
  padding: 10px 10px 10px 20px;
}
nav {
  background: rgba(256, 256, 256, 0.7);
  height: 45px;
}

#menuToggle {
  display: flex;
  flex-direction: column;
  position: relative;
  top: 14px;
  padding-left: 17px;
  z-index: 1;
  -webkit-user-select: none;
  user-select: none;
}

#menuToggle input {
  display: flex;
  width: 40px;
  height: 32px;
  position: absolute;
  cursor: pointer;
  opacity: 0;
  z-index: 2;
}

#menuToggle span {
  display: flex;
  width: 29px;
  height: 2px;
  margin-bottom: 5px;
  position: relative;
  background: #000;
  border-radius: 3px;
  z-index: 1;
  transform-origin: 5px 0px;
  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
    background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease;
}

#menuToggle span:first-child {
  transform-origin: 0% 0%;
}

#menuToggle span:nth-last-child(2) {
  transform-origin: 0% 100%;
}

#menuToggle input:checked ~ span {
  opacity: 1;
  transform: rotate(45deg) translate(-3px, -1px);
  background: #36383f;
}
#menuToggle input:checked ~ span:nth-last-child(3) {
  opacity: 0;
  transform: rotate(0deg) scale(0.2, 0.2);
}

#menuToggle input:checked ~ span:nth-last-child(2) {
  transform: rotate(-45deg) translate(0, -1px);
}
#menuToggle input:checked ~ ul {
  transform: none;
}
#menu {
  position: fixed;
  list-style-type: none;
  width: 0px;
  height: 100vh;
  box-shadow: 0 0 10px #85888c;
  margin: 0px 0 0 0px;
  padding: 60px 20px 20px 20px;
  background-color: rgba(256, 256, 256, 0.9);
  top: 0;
  visibility: hidden;
  margin-left: -17px;
}

#menu li {
  padding: 6px 12px;
  text-align: left;
  background-color: #ffffff;
  margin: 6px 0px;
  border-radius: 2px;
  border: 1px solid #eee;
  width: 195px;
}
#menu li a {
  color: #000;
}
.inner-foor-note {
  font-size: 9px;
  font-weight: 100;
}
.text-wrap-journey {
  width: 70%;
}
.text-wrap-journey-icon {
  width: 30%;
}
.dist-left {
  float: left;
  width: 170px;
}
.dist-right {
  float: left;
  margin-left: 10px;
}
#menu {
  box-sizing: border-box;
  overflow: hidden;
  transition: width 0.5s, visibility 1s, opacity 0.5s ease-out;
}
/* @media screen and (min-width: 1025px) {	
  .details-inner {	
    font-size: 16px;	
  }	
  .text-wrap-journey-long {	
    width: 80%;	
  }	
  .foot-note {	
  }	
}	
@media screen and (max-width: 1120px) {	
  .text-wrap-journey-long {	
    width: 230px;	
  }	
  .details-inner {	
    font-size: 25px;	
  }	
}	
@media screen and (max-width: 900px) {	
  .col {	
    width: 80%;	
  }	
  .farmer-bg {	
    background-position: 0px -180px;	
  }	
}	
@media screen and (max-width: 768px) {	
  .text-wrap-journey-long {	
    width: 175px;	
  }	
  .journey-content-wrap {	
    width: 230px;	
  }	
  .big-no {	
    font-size: 25px;	
  }	
  .details-inner {	
    font-size: 12px;	
  }	
  .fruit-title {	
    font-size: 30px;	
  }	
  .sub-title-text {	
    font-size: 20px;	
  }	
  .farmer-title {	
    font-size: 30px;	
  }	
  .farmer-img-inner {	
    padding-right: 20px;	
  }	
  .bar-label,	
  .vit-bar {	
    font-size: 9px;	
    width: 50px;	
    left: 45px;	
  }	
  .nutri-col {	
    height: 110px;	
  }	
  .farmer-bg {	
    background-position: 0px -56px;	
  }	
}	
@media screen and (max-width: 680px) {	
  .farmer-bg {	
    background-position: 0px -100px;	
    padding-bottom: 150px;	
  }	
}	
@media screen and (max-width: 600px) {	
  .farmer-bg {	
    background-position: 0px -30px;	
    padding-bottom: 150px;	
  }	
} */
@media screen and (max-width: 520px) {
  .text-wrap-journey-long {
    width: 70%;
  }
  .fruit-title {
    font-size: 20px;
  }
  .sub-title-text {
    font-size: 10px;
  }
  .farmer-title {
    font-size: 20px;
  }
  .col {
    padding: 10px 10px;
  }
  .col-right {
    margin-left: 2px;
    margin-right: 2px;
    margin-top: 17px;
  }
  .journey-content-wrap {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .farmer-img {
    padding: 0px;
  }
  .bar-label,
  .vit-bar {
    font-size: 9px;
    width: 40px;
    left: 20px;
  }
  .text-wrap-journey-longer {
    width: 70%;
  }
  .col-right-longer {
    margin-top: 26px;
  }
  .farmer-bg {
    background-position: 0px 8px;
    padding-bottom: 150px;
  }
}
@media screen and (max-width: 500px) {
  .customer-home {
    width: 320px;
  }
  .fruit-title {
    font-size: 15px;
  }
  .details-inner {
    font-size: 13px;
  }
  .big-no {
    font-size: 20px;
  }
  .nutir-col {
    height: 100px;
  }
  .nutri-col {
    height: 100px;
  }
  .journey-table-td {
    padding: 10px 15px;
  }
  .col {
    width: 77%;
  }
  .circle {
    padding: 6px 6px;
    width: 40px;
    height: 40px;
  }
  .text-wrap-journey-long {
    width: 70%;
  }
  #categories li {
    width: 30.857143%;
    padding-bottom: 35.167601%;
  }
  .journey-content-wrap {
    width: 80%;
  }
  .dist-left {
    width: 80px;
  }
}
@media screen and (max-width: 360px) {
  .text-wrap-journey-long {
    width: 70%;
  }
  .col-right-long {
    margin-top: 26px;
  }
  .farmer-address {
    font-size: 15px;
  }
  .bar-label,
  .vit-bar {
    font-size: 9px;
    width: 40px;
    left: 12px;
  }
}
</style>

