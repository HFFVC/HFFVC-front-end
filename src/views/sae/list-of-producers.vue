<template>
  <div class="new-request">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-10 content-container">
        <div class="header-container">
          <span class="serbox">
            <img class="search-icon" src="../../assets/images/search.png" />
            <input
              type="text"
              v-model="search"
              class="txt-search"
              @keyup="searchElement"
              @keyup.enter="searchElement"
              :placeholder="
                $t(
                  'Producer Name / Depart / Town',
                  'Producer Name / Depart / Town'
                )
              "
            />
          </span>
          <img
            class="close-search-icon"
            v-on:click="clearSearch()"
            v-if="closeSearch"
            src="../../assets/images/close.png"
          />
          <!-- <div style="clear:both;"></div> -->
          <h3 class="heading main-heading">
            {{ $t("List of Producers (KOBO)", "List of Producers (KOBO)") }}
          </h3>
          <img
            class="close-img"
            @click="showDashboard"
            src="../../assets/images/close.png"
          />
        </div>
        <div class="main-container">
          <label v-if="noresult">No producer found</label>
          <div v-if="notSearchResult">
            <div class="card-body" v-if="show">
              <div
                class="outer-container"
                v-for="item in pageOfItems"
                :key="item.id"
              >
                <div class="photo-container">
                  <img
                    src="../../assets/images/producer_placeholder_image.png"
                    alt="Farmer Picture"
                    class="former-picture"
                  />
                </div>
                <div class="description-container">
                  <label class="lbl-flname">{{
                    item.firstname + " " + item.lastname
                  }}</label>
                  <img
                    @click="
                      showNewRequest(
                        item.firstname +
                          '_' +
                          item.lastname +
                          '_' +
                          item.location
                      )
                    "
                    class="truck-img"
                    src="../../assets/images/add_service_request_for_producer.png"
                  />
                  <br />
                  Tel#: {{ item.phonenumber }}
                  <br />
                  GPS: {{ item.location }}
                  <div
                    class="whatwords-wrap-producer tooltip whatwords-wrap-tooltip"
                  >
                    <span class="tooltiptext whatwords-tooltiptext-producer">
                      Mots: {{ item.words }}
                      <br />
                      Pays: {{ item.country }}
                      <br />
                      Lieu le plus proche: {{ item.nearestPlace }}
                    </span>
                    <a class="a-text" target="_blank" :href="item.map">
                      <div class="whatwords-img-wrap">
                        <img
                          class="location-img"
                          src="../../assets/images/location_pin.png"
                        />
                      </div>
                    </a>
                  </div>
                  <br />What3Words:
                  <a class="a-text" target="_blank" :href="item.map">
                    <div class="what-words">{{ item.words }}</div>
                  </a>
                  <br />
                  <br />
                  Dept: {{ item.department }}
                  <br />
                  <img
                    @click="showDetails(item)"
                    class="view-img"
                    alt="view"
                    src="../../assets/images/view.png"
                  />
                  {{ $t("Town", "Town") }}: {{ item.town }}
                </div>
              </div>
            </div>
            <div v-if="show" class="card-footer pb-0 pt-3">
              <jw-pagination
                id="pagination-prod"
                :pageSize="pageSize"
                :labels="customLabels"
                :items="dataSet"
                @changePage="onChangePage"
              ></jw-pagination>
            </div>
          </div>
          <div v-if="searchResult">
            <div class="card-body" v-if="show">
              <div
                class="outer-container"
                v-for="item in searchResultSet"
                :key="item.id"
              >
                <div class="photo-container">
                  <img
                    src="../../assets/images/producer_placeholder_image.png"
                    alt="Farmer Picture"
                    class="former-picture"
                  />
                </div>
                <div class="description-container">
                  <label class="lbl-flname">{{
                    item.firstname + " " + item.lastname
                  }}</label>
                  <img
                    @click="
                      showNewRequest(
                        item.firstname +
                          '_' +
                          item.lastname +
                          '_' +
                          item.location
                      )
                    "
                    class="truck-img"
                    src="../../assets/images/add_service_request_for_producer.png"
                  />
                  <br />
                  Tel#: {{ item.phoneNumber }}
                  <br />
                  GPS: {{ item.latitude }},{{ item.longitude }}
                  <div
                    class="whatwords-wrap-producer tooltip whatwords-wrap-tooltip"
                  >
                    <span class="tooltiptext whatwords-tooltiptext-producer">
                      Mots: {{ item.words }}
                      <br />
                      Pays: {{ item.country }}
                      <br />
                      Lieu le plus proche: {{ item.nearestPlace }}
                    </span>
                    <a class="a-text" target="_blank" :href="item.map">
                      <div class="whatwords-img-wrap">
                        <img
                          class="location-img"
                          src="../../assets/images/location_pin.png"
                        />
                      </div>
                    </a>
                  </div>
                  <br />
                  Dept: {{ item.department }}
                  <br />
                  <img
                    @click="showDetails(item)"
                    class="view-img"
                    alt="view"
                    src="../../assets/images/view.png"
                  />
                  Town: {{ item.town }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <b-modal
        hide-footer
        no-close-on-backdrop
        id="list-of-producers-modal"
        ref="producer-details"
        hide-backdrop
        title="Producer Details"
        @hide="hideModal"
      >
        <div
          class="farmer-outer-container farmer-outer-container-modal"
          v-if="farmer"
        >
          <div class="farmer-image-wrap" v-if="farmerImage">
            <img :src="farmerImage" class="former-picture-new" />
          </div>
          <div class="farmer-image-wrap" v-if="farmerImage == ''">
            <img
              src="../../assets/images/producer.png"
              class="former-picture"
            />
          </div>
          <div class="description-container desc-container-modal">
            <label class="lbl-flname">{{
              farmer.firstname + " " + farmer.lastname
            }}</label>
            <br />
            <p>
              Tel#: {{ farmer.phonenumber || farmer.phoneNumber }}
              <br />
              GPS: {{ farmer.location }}
              <br />
              Dept: {{ farmer.department }}
              <br />
              Town: {{ farmer.town }}
            </p>
          </div>
        </div>
      </b-modal>
      <Footer ref="footercomp"></Footer>
    </div>
  </div>
</template>

<script>
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/main.css";
import "../../assets/css/producer-list.css";
import Router from "../../router";
import firebase from "firebase";
import axios from "axios";
import Vue from "vue";
import JwPagination from "jw-vue-pagination";
import BootstrapVue from "bootstrap-vue";
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from '../../shared/auth';

Vue.component("jw-pagination", JwPagination);
Vue.use(PerfectScrollbar);
Vue.use(BootstrapVue);
const customLabels = {
  first: "",
  last: "",
  previous: "",
  next: "",
};

export default {
  name: "list-of-producers",

  data: function() {
    return {
      wholeDataSet: [],
      dataSet: [],
      searchResultSet: [],
      search: "",
      seen: true,
      pageSize: 10,
      pageOfItems: [],
      producerList: [],
      show: false,
      customLabels,
      notSearchResult: true,
      searchResult: false,
      noresult: false,
      userName: "",
      closeSearch: false,
      farmerImage: null,
      farmer: null,
      missedURL: [],
    };
  },
  components: {
    Header,
    Footer,
  },
  mounted() {
    let multipleRoles = localStorage.systemRole.split(",");
    if (multipleRoles.length > 1) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Multi-Role-Dashboard", "Multi-Role-Dashboard"),
          href: "/multi-user-dashboard",
        },
        {
          text: this.$t(
            "Harvest Planner - Dashboard",
            "Harvest Planner - Dashboard"
          ),
          href: "/dashboard",
        },
        {
          text: this.$t("List of Producers", "List of Producers"),
          href: "/list-of-producers",
        },
      ]);
    } else {
      if (localStorage.systemRole == 99) {
        
 if(getConfigVars().USERID == isAuthenticated())
      {
        this.$refs.headercomp.createBreadcrumb([
          {
          text: this.$t("Technology Service Provider-Dashboard", "Technology Service Provider-Dashboard"),
            href: "/sa-dashboard",
          },
           {
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
          {
            text: this.$t("List of Producers", "List of Producers"),
            href: "/list-of-producers",
          },
        ]);
      }
      else
      {
         this.$refs.headercomp.createBreadcrumb([
          {
           text: this.$t("Root Authority-Dashboard", "Root Authority-Dashboard"),
            href: "/sa-dashboard",
          },
           {
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
          {
            text: this.$t("List of Producers", "List of Producers"),
            href: "/list-of-producers",
          },
        ]);
      }
      } else if (localStorage.systemRole == 9) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t("Admin-Dashboard", "Admin-Dashboard"),
            href: "/admin-dashboard",
          },
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
          {
            text: this.$t("List of Producers", "List of Producers"),
            href: "/list-of-producers",
          },
        ]);
      } else if (localStorage.systemRole == 7) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t("OP-Admin-Dashboard", "OP-Admin-Dashboard"),
            href: "/op-admin-dashboard",
          },
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
          {
            text: this.$t("List of Producers", "List of Producers"),
            href: "/list-of-producers",
          },
        ]);
      } else if (localStorage.systemRole == 96) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
            href: "/lsp-dashboard",
          },
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
          {
            text: this.$t("List of Producers", "List of Producers"),
            href: "/list-of-producers",
          },
        ]);
      } else if (localStorage.systemRole == 1 || localStorage.systemRole == 91) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
          {
            text: this.$t("List of Producers", "List of Producers"),
            href: "/list-of-producers",
          },
        ]);
      }
    }
    this.userName = localStorage.userName;
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    var currentVal = this;
    var ref = firebase
      .database()
      .ref()
      .child("masters")
      .child("producer");

    ref.on("value", function(snapshot) {
      var numberOfItems = snapshot.numChildren();
      console.log("Total Producers" + numberOfItems);
      var itemCount = 0;
      snapshot.forEach((requestData) => {
        currentVal.producerList.push({
          id: requestData.id,
          uuid_externalId: requestData.val().uuid_externalId,
          uuid_id: requestData.val().uuid_id,
          firstname: requestData.val().firstname,
          lastname: requestData.val().lastname,
          longitude: requestData.val().longitude,
          latitude: requestData.val().latitude,
          department: requestData.val().department,
          town: requestData.val().town,
          phoneNumber: requestData.val().phoneNumber,
          farmerPicture: requestData.val().farmerPicture,
          cin: requestData.val().cin,
          nif: requestData.val().nif,
          parcelCode: requestData.val().parcelCode,
        });
        itemCount++;
        if (itemCount == numberOfItems) {
          currentVal.wholeDataSet = currentVal.producerList;
          currentVal.dataSet = currentVal.producerList.map((i) => ({
            firstname: i.firstname,
            lastname: i.lastname,
            town: i.town,
            phonenumber: i.phoneNumber,
            department: i.department,
            id: i.uuid_id,
            farmerPicture: i.farmerPicture,
            location: i.latitude + "," + i.longitude,
          }));
          currentVal.show = true;
          currentVal.seen = false;
          currentVal.setWhatWords();
        }
        // currentVal.pushProducerURL(requestData.val().uuid_id,requestData.val().farmerPicture,requestData.val().firstname);
      });
    });
  },

  methods: {
    setWhatWords() {
      const vm = this;
      vm.seen = true;
      var dbRef = firebase.database().ref("masters/what3words");
      var count = this.dataSet.length;
      this.dataSet.forEach((data, j) => {
        dbRef
          .orderByKey()
          .equalTo(data.id)
          .on("child_added", (response) => {
            (this.dataSet[j].words = response.val().words),
              (this.dataSet[j].country = response.val().country),
              (this.dataSet[j].nearestPlace = response.val().nearestPlace),
              (this.dataSet[j].map = response.val().map);
            if (count - 1 == j) {
              var onePage = this.dataSet.slice(0, 10);
              this.onChangePage(onePage);
            }
          });
      });
      this.wholeDataSet.forEach((data, j) => {
        dbRef
          .orderByKey()
          .equalTo(data.uuid_id)
          .on("child_added", (response) => {
            this.wholeDataSet[j].words = response.val().words;
            this.wholeDataSet[j].country = response.val().country;
            this.wholeDataSet[j].nearestPlace = response.val().nearestPlace;
            this.wholeDataSet[j].map = response.val().map;
            if (j == vm.wholeDataSet.length - 1) {
              vm.seen = false;
            }
          });
      });
    },
    showMap: function(id) {
      Router.push("producer-show-map/" + id);
    },
    showDashboard: function(event) {
      Router.push("dashboard");
    },
    showNewRequest(val) {
      localStorage.producerdetails = "";
      localStorage.producerdetails = val;
      Router.push("new-request");
    },
    searchElement: function(event) {
      if (this.search == null || this.search == "") {
        this.closeSearch = false;
        this.notSearchResult = true;
        this.searchResult = false;
      } else {
        this.closeSearch = true;
        this.searchResultSet = [];
        var currentVal = this;
        this.notSearchResult = false;
        this.searchResult = true;
        this.wholeDataSet.forEach((value, index) => {
          if (
            value.firstname
              .toLowerCase()
              .trim()
              .includes(currentVal.search.toLowerCase().trim()) ||
            value.lastname
              .toLowerCase()
              .trim()
              .includes(currentVal.search.toLowerCase().trim()) ||
            value.department
              .toLowerCase()
              .trim()
              .includes(currentVal.search.toLowerCase().trim()) ||
            value.town
              .toLowerCase()
              .trim()
              .includes(currentVal.search.toLowerCase().trim())
          ) {
            this.searchResultSet.push(value);
          }
        });
      }
    },
    onChangeInp(pageOfItems) {
      this.pageOfItems = pageOfItems;
    },
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },

    logout: function(event) {
      firebase
        .auth()
        .signOut()
        .then(function() {
          localStorage.emailId = "";
          localStorage.userName = "";
          Router.push("/");
        })
        .catch(function(error) {
          alert("Error");
        });
    },
    clearSearch: function() {
      this.search = "";
      this.searchElement();
    },
    showDetails: function(producer) {
      this.seen = true;
      var currentVal = this;
      const vm = this;
      if (!producer.location) {
        producer.location = `${producer.latitude},${producer.longitude}`;
      }
      this.farmer = producer;
      const id = producer.id ? producer.id : producer.uuid_id;
      firebase
        .storage()
        .ref(`profile_images/${id}.jpg`)
        .getDownloadURL()
        .then(
          function(url) {
            vm.farmerImage = url;
            currentVal.seen = false;
          },
          function() {
            vm.farmerImage = "";
            currentVal.seen = false;
          }
        );
      this.$refs["producer-details"].show();
    },
    pushProducerURL(id, URL, firstname) {
      let vm = this;
      firebase
        .storage()
        .ref(`profile_images/${id}.jpg`)
        .getDownloadURL()
        .then(
          function(url) {
            vm.farmerImage = url;
            vm.seen = false;
          },
          function() {
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            console.log(id);
            vm.farmerImage = "";
            vm.missedURL.push({ id: id, URL: URL, firstName: firstname });
            console.log(vm.missedURL);
            console.log(JSON.stringify(vm.missedURL));
            vm.seen = false;
          }
        );
    },
    hideModal: function() {
      this.farmerImage = null;
      this.$refs["producer-details"].hide();
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else {
        Router.push("dashboard");
      }
    },
  },
};
</script>
<style>
.former-picture-new {
  width: 280px !important;
  height: auto !important;
  /* display: inline !important; */
}
#list-of-producers-modal {
  display: table !important;
}
#list-of-producers-modal .modal-content {
  background: transparent;
  border-radius: 10px;
  z-index: 999;
  width: 500px;
  margin: 0px auto;
}
#list-of-producers-modal .modal-body {
  padding: 20px 60px;
}
#list-of-producers-modal .modal-title {
  margin: 0 auto !important;
  color: #fff !important;
}
#list-of-producers-modal .modal-header .close {
  position: absolute;
  right: 20px;
  top: 17px;
  color: #fff !important;
  font-size: 2.5rem !important;
  margin: 0 !important;
  padding: 0 !important;
}
#list-of-producers-modal .modal-header h5 {
  font-size: 1.75rem;
  font-weight: 400;
}

#list-of-producers-modal .modal-header {
  height: 50px !important;
}
#list-of-producers-modal .modal-header .close {
  margin-top: -10px !important;
}
#list-of-producers-modal .modal-header h5 {
  margin: -10px auto !important;
}
</style>
<style scoped>
@import "../../assets/css/main.css";
.close-search-icon {
  margin-top: 10px !important;
}
.outer-container {
  width: 38% !important;
  display: inline-block;
  color: #fff !important;
  font-size: 13px;
  font-weight: normal;
  background: rgba(0, 0, 0, 0.3);
  margin: 10px 30px 10px 30px !important;
  border: 1px solid rgba(145, 125, 125, 0.5);
  padding: 10px !important;
  border-radius: 10px;
}
.description-container {
  display: inline;
  float: left;
  text-align: left;
  margin: 5px;
  margin-left: 20px;
  width: 60%;
}
.former-picture {
  width: 110px;
  height: auto;
  display: inline;
  margin-left: 0px;
}
.photo-container {
  margin-top: 0px !important;
}
.description-container p {
  text-align: left;
}
.truck-img {
  width: 25px;
  height: auto;
  margin-left: 20px;
  float: right;
  cursor: pointer;
}
.location-img {
  width: 16px;
  margin-left: 20px;
  height: auto;
  float: right;
  cursor: pointer;
}
.view-img {
  width: 22px;
  height: auto;
  margin-left: 20px;
  float: right;
  cursor: pointer;
}
.lbl-flname {
  font-weight: bold;
}

.lbl-error {
  color: red;
}

.username-conatiner {
  float: right;
  margin: 20px;
}
.no-padding {
  margin: 0px !important;
  padding: 0px !important;
}
.serbox input {
  border: 1px solid #fff;
  padding-right: 30px;
  height: 28px;
  border-radius: 3px;
  padding-left: 25px;
  background: rgba(0, 0, 0, 0.4);
  margin-top: -3px !important;
}
/* 
.heading {
  color: #fff;
  text-align: center;
  margin: auto;
  position: relative;
  top: -19px;
  font-weight: 400;
} */

.header-container .heading {
  color: #fff;
  /* text-align: center; */
  /* margin: auto; */
  position: relative !important;
  top: 1px !important;
  font-weight: 400 !important;
  left: -122px !important;
  font-size: 17px !important;
}
.header-container .close-img {
  margin-top: -20px !important;
  margin-right: 6px !important;
}
.container-bg {
  position: absolute;
  background-image: url("../../assets/images/bg2.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  right: 0;
  top: 0;
  min-width: 100%;
  min-height: 100%;
  filter: blur(20px);
  -webkit-filter: blur(20px);
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

.header-container {
  height: auto;
  padding: 15px;
  background: rgba(0, 0, 0, 0.616);
  border-radius: 5px 5px 0px 0px;
  border: 1px solid #000;
}

.main-container {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0px 0px 5px 5px;
  border: 1px solid #000;
  border-top: 0px !important;
}

.content-container {
  height: fit-content;
  margin: auto;
  margin-top: 30px;
  margin-bottom: 30px;
}

.ref-logout {
  font-size: 13px;
  margin-top: -5px;
  text-transform: none !important;
}
.lbl-username {
  text-transform: none !important;
  font-size: 13px;
}
input[type="text"],
input[type="number"],
input[type="password"],
textarea,
select,
input[type="text"]:focus {
  outline: none;
  border-bottom: 1px solid #fff !important;
  color: #fff !important ;
}
.view-batches-table thead tr th:nth-child(3),
.view-batches-table tbody tr td:nth-child(3) {
  text-align: right !important;
}

.farmer-image {
  height: 200px;
  width: 250px;
}
.farmer-outer-container {
  width: 80%;
  display: inline-block;
  color: #fff !important;
  font-size: 13px;
  font-weight: normal;
  background: rgba(0, 0, 0, 0.3);
  margin: 10px 30px 10px 30px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 10px;
}
.margin-l-25 {
  margin-left: 25%;
}
/* .desc-container-modal {
  width: 100%;
  margin: 0px auto;
  text-align: center;
} */
.farmer-outer-container-modal {
  width: 100%;
  margin: 0px auto;
}
.farmer-image-wrap {
  width: 100%;
  text-align: center;
}
.search-icon {
  left: 19px !important;
}
.tooltip {
  position: relative;
  display: inline-block;
  opacity: 1;
  font-size: 14px;
  text-align: center;
  z-index: 1;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 70px;
  background-color: #3a4527;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  /* Position the tooltip */
  position: absolute;
  z-index: 99999;
  font-size: 12px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
.whatwords-tooltiptext-producer {
  width: 250px !important;
  text-align: left !important;
  padding: 10px !important;
  bottom: 30px;
}
.whatwords-img-wrap {
  width: 20%;
  float: right;
}
.what-words {
  width: 80%;
  float: left;
  text-align: left;
  word-break: break-all;
  text-decoration: underline;
}
.whatwords-wrap-producer {
  float: right;
  cursor: pointer;
}
.a-text {
  color: #fff;
}
.a-text:hover,
.a-text:active,
.a-text:focus {
  color: #fff;
  outline: none;
  text-decoration: none;
}
@media screen and (max-width: 1283px) {
  .main-heading {
    top: 0px !important;
  }
}
@media screen and (max-width: 1063px) and (min-width: 768px) {
  .col-md-6 {
    max-width: 100% !important;
    width: 100% !important;
    flex: 100%;
  }
  .photo-container {
    width: 100%;
    margin: 0 auto;
  }
  .description-container {
    width: 100%;
    margin: 0 !important;
    padding: 10px 0px 10px 0px;
  }
}
@media screen and (max-width: 768px) {
  .heading {
    padding: 18px 0px 0px 12px;
    text-align: left;
  }
  .header-container {
    position: relative;
  }
  .close-img {
    width: 16px;
    height: auto;
    float: right;
    cursor: pointer;
    position: absolute;
    top: 12px;
    right: 13px;
    margin-top: 0px;
  }
  .photo-container {
    width: 100%;
    margin: 0 auto;
  }
  .description-container {
    width: 100%;
    margin: 0 !important;
    padding: 10px 0px 10px 0px;
  }
}
@media screen and (max-width: 602px) {
  .content-container {
    margin-top: 30px;
  }
}
.what-words {
  width: 80%;
  float: left;
  text-align: left;
  word-break: break-all;
  text-decoration: underline;
}
</style>
