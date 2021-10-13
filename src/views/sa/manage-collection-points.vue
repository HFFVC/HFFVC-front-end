<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-5 details-container">
        <div class="header-container">
          <h6 class="heading">
            {{
              $t("Registered Collection Points", "Registered Collection Points")
            }}
          </h6>
        </div>
        <div class="main-container-manage-collection">
          <div class="card-body">
            <perfect-scrollbar class="manage-collection-points-table-ps">
              <div class="card-body">
                <div
                  class="outer-container"
                  v-for="(collectionPoint, index) in collectionPoints"
                  :key="index"
                >
                  <div class="photo-container">
                    <img
                      src="../../assets/images/collection_point.png"
                      alt="User Picture"
                      class="former-picture"
                    />
                  </div>
                  <div class="description-container">
                    <label class="lbl-flname lbl-pickup">
                      <b>{{ collectionPoint.title }}</b>
                      <input
                        type="radio"
                        @click="editCollectionPoint(collectionPoint)"
                        :checked="collectionPoint.snapshotKey == snapshotKey"
                      />
                      <img />
                    </label>

                    <label v-if="isSuperAdmin" class="lbl-flname lbl-pickup"
                      >Organization: {{ collectionPoint.organization }}</label
                    >
                  </div>
                </div>
              </div>
            </perfect-scrollbar>
          </div>
        </div>
        <div class="button-container">
          <input
            type="button"
            class="btn-save sa-collection-btn"
            :value="$t('Create Collection Point', 'Create Collection Point')"
            @click="createNewCollectionPoint"
          />
        </div>
      </div>

      <!-- right side container -->
      <div class="col-md-7 details-container">
        <div class="header-container">
          <h6 class="heading">{{ $t(pageTitle, pageTitle) }}</h6>
          <div>
            <img
              @click="showDashboard"
              class="close-details"
              src="../../assets/images/close.png"
            />
          </div>
        </div>
        <div class="main-container-manage-collection">
          <perfect-scrollbar>
            <div class="card-body manage-collection-right-container">
              <div class="emptyContainer" v-if="!selectedCollectionPoint">
                <h2 class="card-inside-description">
                  {{
                    $t(
                      "Select a Collection Point to Edit",
                      "Select a Collection Point to Edit"
                    )
                  }}
                </h2>
              </div>
              <div v-if="selectedCollectionPoint">
                <div class="inp-container inp-half">
                  <input
                    :placeholder="
                      $t('Collection Point Name', 'Collection Point Name')
                    "
                    class="inp-details inp-packhouse-name"
                    type="text"
                    v-model="title"
                  />
                </div>
                <div class="inp-container inp-half">
                  <!-- <input
                    placeholder="Lat,Lng"
                    class="inp-details inp-location"
                    type="text"
                    v-model="location"
                  />-->
                  <span class="locationfield">
                    <a class v-if="location" v-on:click="showCPMap()">
                      <img
                        class="map-img"
                        src="../../assets/images/location_pin.png"
                      />
                    </a>
                    <input
                      placeholder="Lat,Lng"
                      class="inp-details"
                      type="text"
                      v-model="location"
                       @blur="showWhat3Words"
                    />
                       </span>
                         <div v-if="iswhatwordsVisible" class="whatwords-wrap tooltip whatwords-wrap-tooltip">
                    <span class="tooltiptext whatwords-tooltiptext">
                      {{ $t("Mots", "Mots") }}: {{ whatwords }}
                      <br />
                      {{ $t("Pays", "Pays") }}: {{ country }}
                      <br />
                      {{ $t("Lieu le plus proche", "Lieu le plus proche") }}:
                      {{ nearestPlace }}
                    </span>
                    <a class="a-text" target="_blank" :href="mapAdd">
                      <div class="what-words">{{ whatwords }}</div>
                      <div class="whatwords-img-wrap">
                        <img
                          class="location-img"
                          src="../../assets/images/location_pin.png"
                        />
                      </div>
                    </a>
                  </div>
               
                </div>
                <!-- <div v-if="location"> -->
                <!-- <a class v-on:click="showMap(location)">
                    <img
                      class="map-img"
                      src="../../assets/images/location_pin.png"
                    />
                </a>-->
                <!-- <a class v-on:click="showCPMap(location)">
                    <img
                      class="map-img"
                      src="../../assets/images/location_pin.png"
                    />
                </a>-->
                <!-- </div> -->
                <div class="inp-container">
                  <input
                    :placeholder="$t('Address', 'Address')"
                    class="inp-details inp-address"
                    type="text"
                    v-model="address"
                  />
                </div>
                <div class="col-md-12" v-if="isSuperAdmin">
                  <div class="function-dropdown">
                    <v-select
                      id="dropdownlist"
                      v-model="organizationSelected"
                      :placeholder="$t('Organization', 'Organization')"
                      class="manage-users-v-select rolesel"
                      :options="organizationList"
                      label="name"
                    ></v-select>
                  </div>
                </div>
                <div class="inp-container">
                  <input
                    :placeholder="$t('Additional Notes', 'Additional Notes')"
                    class="inp-details inp-additional-notes"
                    type="text"
                    v-model="additionalNotes"
                  />
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container" v-if="selectedCollectionPoint">
          <input
            type="button"
            @click="clearAll()"
            class="btn-cancel"
            :value="$t('Cancel', 'Cancel')"
          />
          <input
            type="button"
            class="btn-save"
            :value="$t('Save', 'Save')"
            @click="saveCollectionPoint"
          />
        </div>
      </div>
      <b-modal
        hide-footer
        no-close-on-backdrop
        id="collection-point-map-view-modal"
        ref="mapview-modal"
        hide-backdrop
        :title="
          $t('Collection Point - Map-View', 'Collection Point - Map-View')
        "
        @hide="hideModal()"
      >
        <div class="main-container">
          <div class="main-container map-wrap">
            <!-- <iframe> -->
            <div id="myMap" ref="myMap" class="map-window"></div>
            <!-- </iframe> -->
          </div>
        </div>
      </b-modal>
      <Footer ref="footercomp"></Footer>
    </div>
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
import mailService from "../../shared/email.service";
Vue.use(VueToast);
Vue.use(Datetime);
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import getConfigVars from "../../shared/config-env";
import sendMail from "../../shared/email.service";
import { ClientTable } from "vue-tables-2";
import axios from "axios";
import isAuthenticated from '../../shared/auth';
var map;
Vue.use(
  ClientTable,
  {
    perPage: 10,
    sortable: [],
    filterable: false,
  },
  false
);

Vue.use(Datetime);

export default {
  name: "manage-collection-points",
  data: function () {
    return {
      seen: true,
      pickupsList: [],
      emptyContainer: true,
      userName: null,
      pageTitle: "",
      tableHeaders: ["title", "edit"],
      collectionPoints: [],
      selectedCollectionPoint: false,
      snapshotKey: null,
      title: null,
      location: null,
      address: null,
      additionalNotes: null,
      options: {
        perPage: 50,
        perPageValues: [],
      },
      //map variables
      contentstring: [],
      regionlocation: [],
      areaiterator: 0,
      markers: [],
      iterator: 0,
      infowindow: [],
      organizationSelected: null,
      organizationList: [],
      isSuperAdmin: false,
      country:"",
      nearestPlace:"",
      mapAdd:"",
      whatwords:"",
      iswhatwordsVisible:false
    };
  },
  components: {
    PerfectScrollbar,
    Header,
    Footer,
  },
  mounted() {
    if (
      localStorage.systemRole == 99 &&
      localStorage.prevPage == "observer-mci-dashboard"
    ) {
      if (getConfigVars().USERID == isAuthenticated()) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t(
              "Technology Service Provider-Dashboard",
              "Technology Service Provider-Dashboard"
            ),
            href: "/sa-dashboard",
          },
          {
            text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"),
            href: "/observer-mci-dashboard",
          },
          {
            text: this.$t(
              "Manage Collection Points",
              "Manage Collection Points"
            ),
            href: "/manage-collection-points",
          },
        ]);
      } else {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t(
              "Root Authority-Dashboard",
              "Root Authority-Dashboard"
            ),
            href: "/sa-dashboard",
          },
          {
            text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"),
            href: "/observer-mci-dashboard",
          },
          {
            text: this.$t(
              "Manage Collection Points",
              "Manage Collection Points"
            ),
            href: "/manage-collection-points",
          },
        ]);
      }
    } else if (localStorage.systemRole == 96) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
        {
          text: this.$t("Manage Collection Point", "Manage Collection Point"),
          href: "/manage-collection-point",
        },
      ]);
    } else if (localStorage.systemRole == 99) {
      if (getConfigVars().USERID == isAuthenticated()) {
        if (localStorage.emailId == localStorage.organizationKey) {
          this.isSuperAdmin = true;
        }
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t(
              "Technology Service Provider-Dashboard",
              "Technology Service Provider-Dashboard"
            ),
            href: "/sa-dashboard",
          },
          {
            text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
            href: "/lsp-dashboard",
          },
          {
            text: this.$t(
              "Manage Collection Points",
              "Manage Collection Points"
            ),
            href: "/manage-collection-points",
          },
        ]);
      } else {
        if (localStorage.emailId == localStorage.organizationKey) {
          this.isSuperAdmin = true;
        }
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t(
              "Root Authority-Dashboard",
              "Root Authority-Dashboard"
            ),
            href: "/sa-dashboard",
          },
          {
            text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
            href: "/lsp-dashboard",
          },
          {
            text: this.$t(
              "Manage Collection Points",
              "Manage Collection Points"
            ),
            href: "/manage-collection-points",
          },
        ]);
      }
    }
    if (localStorage.systemRole == 9) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Admin-Dashboard", "Admin-Dashboard"),
          href: "/admin-dashboard",
        },
        {
          text: this.$t("Manage Collection Points", "Manage Collection Points"),
          href: "/manage-collection-points",
        },
      ]);
    }
    if (localStorage.systemRole == 10) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"),
          href: "/observer-mci-dashboard",
        },
        {
          text: this.$t("Manage Collection Points", "Manage Collection Points"),
          href: "/manage-collection-points",
        },
      ]);
    }

    // if (!localStorage.emailId) {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
    this.pageTitle = this.$t(
      "Collection Point Details",
      "Collection Point Details"
    );
    this.getOrganizationList();
    this.loadCollectionPoints();
  },
  methods: {
      showWhat3Words()
    {
      var vm = this;
      vm.seen=true;
if(this.location != null && this.location.split(",").length == 2)
{
  this.axios
        .get(
         "https://api.what3words.com/v3/convert-to-3wa?coordinates=" + vm.location.split(",")[1] + "%2C" + vm.location.split(",")[0] + "&key=91KFM3N3&language=fr"
        )
        .then(function(response) {
          vm.iswhatwordsVisible = true;
          vm.whatwords = response.data.words;
          vm.mapAdd = response.data.map;
          vm.country = response.data.country;
          vm.nearestPlace = response.data.nearestPlace;
          console.log("sucees");
          console.log(response);
          vm.seen=false;
}).
catch (function(error) {
    vm.iswhatwordsVisible = false;
   vm.iswhatwordsVisible = false;
    vm.seen=false;
    console.log("fail");
        Vue.$toast.open({
          message: vm.$t(
            "Please enter valid location coordinates",
          "Please enter valid location coordinates",

          ),
          type: "error",
          position: "top",
        });
        vm.location = null;
});

}
else
{
     vm.iswhatwordsVisible = false;
  vm.seen = false;
         Vue.$toast.open({
          message: vm.$t(
            "Please enter valid location coordinates",
          "Please enter valid location coordinates",

          ),
          type: "error",
          position: "top",
        });
        vm.location = null;
}
    },
    logout: function (event) {
      firebase
        .auth()
        .signOut()
        .then(function () {
          localStorage.emailId = "";
          localStorage.userName = "";
          Router.push("/");
        })
        .catch(function (error) {
          alert("Error");
        });
    },
    showDashboard: function () {
      if (localStorage.systemRole == 99) {
        Router.push("lsp-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else if (localStorage.systemRole == 10) {
        Router.push("observer-mci-dashboard");
      } else if (localStorage.systemRole == 96) {
        Router.push("lsp-dashboard");
      }
    },
    loadCollectionPoints: function () {
      const vm = this;
      vm.seen = true;
      vm.collectionPoints = [];
      const ref = firebase
        .database()
        .ref()
        .child("masters")
        .child("collectionPoint")
        .on("value", function (snapshot) {
          snapshot.forEach((requestData) => {
            const {
              title,
              address,
              location,
              additionalNotes,
              organization,
              organizationKey,
            } = requestData.val();
            let data = {
              title,
              address,
              location,
              additionalNotes,
              organization,
              organizationKey,
            };
            if (data.organizationKey == localStorage.organizationKey) {
              vm.collectionPoints.push({
                ...data,
                snapshotKey: requestData.key,
              });
            } else if (localStorage.systemRole.includes(99)) {
              vm.collectionPoints.push({
                ...data,
                snapshotKey: requestData.key,
              });
            }
            // if (localStorage.systemRole == 99 || localStorage.systemRole == 7) {
            //   vm.collectionPoints.push({
            //     ...data,
            //     snapshotKey: requestData.key
            //   });
            // } else {
            //   if (
            //     requestData.val().collectionPointAddedBy &&
            //     requestData.val().collectionPointAddedBy ==
            //       localStorage.userName
            //   ) {
            //     vm.collectionPoints.push({
            //       ...data,
            //       snapshotKey: requestData.key
            //     });
            //   }
            // }
          });
          vm.seen = false;
        });
      this.options.perPage = vm.collectionPoints.length;
    },
    editCollectionPoint: function ({
      address,
      location,
      snapshotKey,
      title,
      additionalNotes,
      organizationKey,
      organization,
    }) {
      this.organizationSelected = {
        name: organization,
        orgKey: organizationKey,
      };
      this.selectedCollectionPoint = true;
      this.snapshotKey = snapshotKey;
      this.pageTitle = this.$t(
        "Edit Collection Point Details",
        "Edit Collection Point Details"
      );
      this.title = title;
      this.address = address;
      this.location = location;
      this.additionalNotes = additionalNotes;
      this.country = "";
      this.whatwords = "";
      this.nearestPlace = "";
      this.mapAdd = "";
      this.iswhatwordsVisible = false;
      //this.showCPMap(this.location);
      this.showWhat3Words();
    },
    createNewCollectionPoint: function () {
      this.pageTitle = this.$t(
        "New Collection Point Details",
        "New Collection Point Details"
      );
      this.selectedCollectionPoint = true;
      this.title = "";
      this.address = "";
      this.location = "";
      this.additionalNotes = "";
    },
    saveCollectionPoint: function () {
      this.seen = true;
      const vm = this;

      const orgKey = vm.isSuperAdmin
        ? vm.organizationSelected.orgKey
        : localStorage.organizationKey;

      const _orgName = vm.isSuperAdmin
        ? vm.organizationSelected.name
        : localStorage.organization;

      if (
        this.pageTitle ==
        this.$t("New Collection Point Details", "New Collection Point Details")
      ) {
        const { title, location, address, additionalNotes } = this;
        const dataToInsert = {
          title,
          location,
          address,
          additionalNotes: additionalNotes || "",
          collectionPointAddedBy: localStorage.userName,
          organization: _orgName,
          organizationKey: orgKey,
        };

        if (title && location && address && orgKey) {
          const ref = firebase
            .database()
            .ref()
            .child("masters")
            .child("collectionPoint")
            .push(dataToInsert)
            .then((snapshot) => {
              vm.addMapping(snapshot.key, orgKey);
              Vue.$toast.open({
                message: vm.$t(
                  "New collection data inserted.",
                  "New collection data inserted."
                ),
                type: "success",
                position: "top",
              });
              vm.loadCollectionPoints();
              vm.title = null;
              vm.location = null;
              vm.address = null;
              vm.additionalNotes = null;
              vm.selectedCollectionPoint = false;
              vm.seen = false;
              vm.country = "";
              vm.nearestPlace = "";
              vm.mapAdd = "";
              vm.whatwords = "";
              vm.iswhatwordsVisible = false;
            })
            .catch(() => {
              Vue.$toast.open({
                message: vm.$t(
                  "Error creating new collection point.",
                  "Error creating new collection point."
                ),
                type: "error",
                position: "top",
              });
              vm.seen = false;
            });
        } else {
          Vue.$toast.open({
            message: vm.$t(
              "Please fill out all the fields.",
              "Please fill out all the fields."
            ),
            type: "error",
            position: "top",
          });
          this.seen = false;
        }
      } else if (
        this.pageTitle ==
        this.$t(
          "Edit Collection Point Details",
          "Edit Collection Point Details"
        )
      ) {
        const { title, location, additionalNotes, address } = this;
        const dataToInsert = {
          title,
          location,
          additionalNotes: additionalNotes || "",
          address,
          organization: localStorage.organization,
          organizationKey: orgKey,
        };
        if (title && location && address && orgKey) {
          const ref = firebase
            .database()
            .ref()
            .child("masters")
            .child("collectionPoint")
            .child(this.snapshotKey)
            .update(dataToInsert)
            .then(() => {
              vm.addMapping(vm.snapshotKey, orgKey);
              Vue.$toast.open({
                message: vm.$t(
                  "Collection point details updated.",
                  "Collection point details updated."
                ),
                type: "success",
                position: "top",
              });
              vm.loadCollectionPoints();
              vm.seen = false;
                vm.country = "";
              vm.nearestPlace = "";
              vm.mapAdd = "";
              vm.whatwords = "";
              vm.iswhatwordsVisible = false;
            })
            .catch(() => {
              Vue.$toast.open({
                message: vm.$t(
                  "Failed to update collection point details.",
                  "Failed to update collection point details."
                ),
                type: "error",
                location: "top",
              });
              vm.seen = false;
            });
        } else {
          Vue.$toast.open({
            message: vm.$t(
              "Please fill out all the fields.",
              "Please fill out all the fields."
            ),
            type: "error",
            position: "top",
          });
          this.seen = false;
        }
      }
    },

    drop: function () {
      var currentVal = this;
      for (var i = 0; i < this.regionlocation.length; i++) {
        setTimeout(function () {
          currentVal.addMarker();
        }, 800);
      }
    },
    addMarker: function () {
      var address = this.contentstring[this.areaiterator];
      var templat = this.regionlocation[this.areaiterator].split(",")[0];
      var templong = this.regionlocation[this.areaiterator].split(",")[1];
      var temp_latLng = new google.maps.LatLng(templat, templong);
      this.markers.push(
        new google.maps.Marker({
          position: temp_latLng,
          map: map,
          draggable: false,
        })
      );
      this.iterator++;
      // this.info(this.iterator);
      this.areaiterator++;
    },
    info: function (i) {
      this.infowindow[i] = new google.maps.InfoWindow({
        content: this.contentstring[i - 1],
      });
      this.infowindow[i].content = this.contentstring[i - 1];
      var currentVal = this;
      google.maps.event.addListener(
        currentVal.markers[i - 1],
        "click",
        function () {
          for (var j = 1; j < currentVal.contentstring.length + 1; j++) {
            currentVal.infowindow[j].close();
          }
          currentVal.infowindow[i].open(map, currentVal.markers[i - 1]);
        }
      );
    },
    clearAll: function () {
      this.snapshotKey = null;
      this.selectedCollectionPoint = false;
    },
    // gotoDashboard: () => Router.push("sa-dashboard")
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else if (localStorage.systemRole == 10) {
        Router.push("observer-mci-dashboard");
      } else if (localStorage.systemRole == 2) {
        Router.push("lsp-dashboard");
      }
    }, //Map Functions
    // showMap: function(location) {
    //   localStorage.prevPage = "manage-collection-points";
    //   Router.push("collection-point-map-view/" + location);
    // },
    showCPMap: function () {
      const vm = this;
      this.$refs["mapview-modal"].show();
      if (
        this.location !== null &&
        this.location !== "" &&
        this.location !== undefined
      ) {
        this.seen = true;
        let currentVal = this;

        var locationVal = "";

        locationVal = this.location.split(",");

        currentVal.regionlocation.push(locationVal[1] + "," + locationVal[0]);
        // currentVal.contentstring.push(currentVal.details);

        var region = new google.maps.LatLng("-71.7355318", "19.41428607");
        setTimeout(function () {
          currentVal.seen = false;
          map = new google.maps.Map(currentVal.$refs["myMap"], {
            center: region,
            zoom: 1,
          });
          currentVal.drop();
        }, 1000);

        // Router.push("collection-point-map-view/" + location);
      } else {
        Vue.$toast.open({
          message: vm.$t(
            "Please enter a valid latitude and longitude.",
            "Please enter a valid latitude and longitude."
          ),
          type: "error",
          position: "top",
        });
      }
    },
    hideModal: function () {
      this.$refs["mapview-modal"].hide();
    },
    getOrganizationList() {
      const vm = this;
      vm.seen = true;
      var ref = firebase
        .database()
        .ref()
        .child("masters")
        .child("organization")
        .orderByChild("organizationType")
        .equalTo("Logistic / Cold Chain Service Provider");
      vm.organizationList = [];
      vm.mappedOrganization = {};
      ref.on("value", (snapshot) => {
        snapshot.forEach((requestData) => {
          if (requestData.val().status != "Disabled") {
            this.organizationList.push({
              name: requestData.val().name,
              orgKey: requestData.key,
            });
          }
        });
      });
      vm.seen = false;
    },
    addMapping(profileKey, organizationKey) {
      let dataToUpdate = {};
      dataToUpdate[profileKey] = profileKey;
      firebase
        .database()
        .ref()
        .child("OrganizationUserMapping")
        .child(organizationKey)
        .update(dataToUpdate)
        .then((updated) => {
          console.log(updated);
          console.log("mapping added");
        });
    },
  },
};
</script>
<style scoped>
.locationfield {
  display: inline-flex;
  width: 100%;
}
#myMap {
  height: 500px;
  width: 100%;
  top: -20px;
  position: relative;
  padding: 30px;
  margin-top: 20px;
  margin-bottom: -19px;
}

.map-img {
  width: 15px;
  height: auto;
  cursor: pointer;
  margin-top: 11px;
  padding: 0px !important;
  color: blue !important;
}
.grant-privilage-container .lbl-pickup-sa {
  margin-left: -9px !important;
}
.button-container {
  margin: 10px -4px 10px 10px !important;
}
.btn-save,
.btn-cancel {
  height: 30px !important;
}
.header-container {
  height: 50px;
}
.inp-bda {
  height: 34px !important;
}
.rolesel .vs__dropdown-toggle {
  height: 34px !important;
}
.clear {
  clear: both;
}
.close-details {
  margin-top: -16px !important;
}
.sa-left-scroll {
  padding: 1.25em !important;
  min-height: 379px !important;
  max-height: 379px !important;
}
.card-body {
  padding: 0rem !important;
}
.manageUserOuterContainer {
  width: 98% !important;
}
/* .ps{
  height:0px !important;
} */
</style>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";

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
.whatwords-tooltiptext {
  width: 250px !important;
  text-align: left !important;
  padding: 10px !important;
  bottom: -15px;
  left:120px;
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
.whatwords-wrap {
  width: 100%;
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


.ps {
  height: 399px;
  overflow-x: hidden !important;
}
.ps__rail-x {
  display: none !important;
}
.addition-note {
  background-color: transparent;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  float: left;
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 22px;
  background-size: 15px 15px;
  width: 95%;
  margin: 15px;
  color: #fff !important;
}
.small-input {
  background: none !important;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  float: left;
  width: 100px;
  margin: 15px;
  color: #fff !important;
}
.modal-input {
  background-color: transparent !important;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  float: left;
  margin: 15px;
  width: 96%;
}
.button-container {
  float: right;
  margin: 10px 0px 10px 10px;
  position: relative;
  bottom: 0px;
}
.btn-save {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 12px;
  min-width: 115px;
  height: 26px;
  margin: 5px;
  color: #fff;
}
.btn-reject {
  background-color: #c55a11;
  border-radius: 0px;
  border: none;
  font-size: 12px;
  width: 115px;
  height: 26px;
  margin: 5px;
  color: #fff;
}
.btn-cancel {
  background: #1e2318;
  border-radius: 0px;
  border: 1px solid #000;
  font-size: 12px;
  color: #fff;
  width: 115px;
  height: 26px;
  margin: 5px;
}
label > input {
  visibility: hidden;
}
.close-img {
  width: 13px !important;
  margin-top: -10px !important;
}

.lbl-pickup > img {
  float: right;
  display: inline-block;
  padding: 0px;
  height: 15px;
  width: 15px;
  background: none;
}

.lbl-pickup-sa > img {
  float: left;
  display: inline-block;
  padding: 0px;
  height: 15px;
  width: 15px;
  background: none;
}
.photo-container {
  margin-top: 0px !important;
}
label > input:checked + img {
  background: url("../../assets/images/tick.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 10px 10px;
}

.card-inside-description {
  font-weight: 400 !important;
  font-size: 32px;
  color: #fff !important;
  margin-top: 60px;
}
.outer-container {
  width: 100%;
  margin: 0px !important;
  padding: 0px !important;
  padding-top: 10px !important;
}
.description-container {
  margin-left: 30px;
}
.former-picture {
  width: 65px;
}
.lbl-pickup {
  display: block;
}
.service-img-container,
.product-container {
  cursor: pointer;
}
.img-previous {
  width: 59px !important;
  margin: 5px 0px 3px 0px !important;
}

.new-request-container {
  cursor: pointer;
}

.no-padding {
  margin: 0px !important;
  padding: 0px !important;
}
.product-container {
  text-align: center;
  margin: 10px 10px 30px 10px;
}
p {
  color: #fff;
  text-align: center;
}
.service-img-container {
  width: 46%;
  float: left;
  margin: 10px;
  height: 125px;
}
.service-img {
  width: 80px;
  height: auto;
  text-align: center;
  margin: 10px;
  padding: 10px;
}
.service-container {
  display: flex;
  width: 100%;
}
.inp-container {
  margin: 0px 0px 0px 0px;
  font-size: 13px;
  width: 100%;
  margin-bottom: 20px;
}
.heading {
  color: #fff;
  text-align: center;
  margin: auto;
  font-size: 14px !important;
}
.container-bg {
  position: absolute;
  background-image: url("../../assets/images/bg10.png");
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  right: 0;
  top: 0;
  min-width: 100%;
  min-height: 100%;
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
.main-container-manage-users {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0px 0px 5px 5px;
  border: 1px solid #000;
  border-top: 0px !important;
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}
.edit-user-container {
  float: left;
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px 10px 10px 10px;
}
.details-container {
  margin: auto;
  margin-top: 35px;
  margin-bottom: 35px;
}
.ref-logout-lsp {
  font-size: 13px;
  margin-top: -5px;
  text-transform: none !important;
}
.lbl-username-lsp {
  text-transform: none !important;
  font-size: 13px;
}

@media screen and (max-width: 531px) {
  .service-img-container {
    width: 100%;
    text-align: center;
  }
}
@media screen and (max-width: 1063px) and (min-width: 768px) {
  .col-md-6 {
    max-width: 100% !important;
    width: 100% !important;
    flex: 100%;
  }
}
@media screen and (max-width: 602px) {
  .content-container {
    margin-top: 30px;
  }
}
.e-input-group:not(.e-success):not(.e-warning):not(.e-error):not(.e-float-n-left),
.e-input-group.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap,
.e-input-group.e-control-wrapper:not(.e-success):not(.e-warning):not(.e-error):not(.e-float-icon-left),
.e-input-group.e-control-wrapper.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap,
.e-float-input.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap,
.e-float-input.e-control-wrapper.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap {
  border-color: #fff !important;
}
.additional-modal-note {
  float: left;
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 22px;
  background-size: 15px 15px;
  width: 100%;
}
.inp-details {
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff;
  font-size: 13px;
  height: 36px;
}
.inp-firstname {
  width: 100%;
  background-image: url("../../assets/images/user.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
  height: 36px;
}
.inp-lastname {
  width: 100%;
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 0px;
  background-size: 20px 20px;
  height: 36px;
}
.inp-bda {
  width: 100%;
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
  height: 36px;
}
.inp-function {
  width: 100%;
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
  height: 36px;
}
.inp-email {
  width: 100%;
  background-image: url("../../assets/images/email_address.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
  height: 36px;
}
.email-container {
  padding: 0px;
  margin: -20px;
}
.grant-privilage-container {
  float: left;
  padding-top: 5px;
  margin-left: 10px;
  margin-top: 5px;
  text-align: left;
}
.grant-privilage {
  float: left;
  margin-left: 10px;
  margin-top: -2px;
}
.close-details {
  height: 16px;
  float: right;
  margin-top: -15px;
  cursor: pointer;
}
.sa-left-scroll {
  min-height: 360px;
  max-height: 360px;
  overflow: hidden;
}
.dropdownlist {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff !important;
  height: 36px;
}
#dropdownlist_hidden {
  float: right;
  border: none;
  border-bottom: 1px solid #fff;
  background: transparent;
  width: 100%;
  color: #fff;
  height: 36px;
}
.role-descriptions {
  background-image: url("../../assets/images/user_role.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  position: absolute !important;
  width: 100% !important;
  color: #fff !important;
}
label > input:checked + img {
  background: url("../../assets/images/tick.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 10px 10px;
}
.function-dropdown {
  display: inline;
  font-size: 13px;
}
.e-input-group:not(.e-disabled) .e-input-group-icon:hover,
.e-input-group.e-control-wrapper:not(.e-disabled) .e-input-group-icon:hover {
  color: #fff !important;
}
.name-container {
  width: 40%;
  float: left;
}
.manage-users-v-select .vs__dropdown-toggle {
  border: none;
  border-bottom: 1px solid #fff;
  border-radius: 0px;
  margin: 15px 0px 0px 0px !important;
}
.manage-users-v-select {
  font-size: 13px;
}
.manage-users-v-select span,
.manage-users-v-select input,
.manage-users-v-select .vs__no-options {
  color: #fff;
}
.manage-users-v-select span {
  margin-left: 0px;
  padding-left: 0px;
}
.manage-users-v-select .vs__dropdown-menu {
  background: none;
  padding: 0px;
  max-height: 155px;
}
.manage-users-v-select .vs__dropdown-option {
  color: #fff;
  padding: 10px;
  background: #1e2318;
}
.manage-users-v-select .vs__dropdown-option--highlight {
  background: #000;
}
.manage-users-v-select .vs__open-indicator,
.manage-users-v-select .vs__clear {
  fill: #fff;
}
.manage-users-v-select .vs__selected-options,
.manage-users-v-select .vs__search,
.vs__search:focus {
  padding: 0px;
  margin: 0px;
}
.manage-users-v-select .vs__dropdown-toggle {
  padding: 0px;
  padding-bottom: 2px;
  margin: 15px 0px;
}
.manage-users-v-select .vs__selected {
  margin: 0px;
  padding: 0px;
}
.manage-users-v-select .vs__clear {
  margin-top: -10px;
}
.manage-users-v-select .vs__open-indicator {
  margin-top: -5px;
}
.manage-users-v-select {
  margin-bottom: 15px;
}
.manage-users-field-wrap {
  /* margin: 10px 25px; */
  margin: 17px 25px;
}
.inp-half {
  width: 40%;
  float: left;
  margin-right: 20px;
}
</style>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";

#collection-point-map-view-modal h5 {
  margin: -8px auto !important;
  font-size: 15px !important;
  font-weight: 400 !important;
}
#collection-point-map-view-modal .modal-header {
  height: 50px !important;
}
#collection-point-map-view-modal .close {
  margin-top: -23px !important;
  margin-left: 0px !important;
}
/* #collection-point-map-view-modal {
  width: 1309px !important;
  margin-left: 145px !important;
} */
.ps {
  height: 400px;
  overflow-x: hidden !important;
}
.ps__rail-x {
  display: none !important;
}
.addition-note {
  background-color: transparent;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  float: left;
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 22px;
  background-size: 15px 15px;
  width: 95%;
  margin: 15px;
  color: #fff !important;
}
.small-input {
  background: none !important;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  float: left;
  width: 100px;
  margin: 15px;
  color: #fff !important;
}
.modal-input {
  background-color: transparent !important;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  float: left;
  margin: 15px;
  width: 96%;
}
.button-container {
  float: right;
  margin: 10px 0px 10px 10px;
  position: relative;
  bottom: 0px;
}
.btn-save {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 12px;
  min-width: 115px;
  height: 26px;
  margin: 5px;
  color: #fff;
}
.btn-reject {
  background-color: #c55a11;
  border-radius: 0px;
  border: none;
  font-size: 12px;
  width: 115px;
  height: 26px;
  margin: 5px;
  color: #fff;
}
.btn-cancel {
  background: #1e2318;
  border-radius: 0px;
  border: 1px solid #000;
  font-size: 12px;
  color: #fff;
  width: 115px;
  height: 26px;
  margin: 5px;
}
label > input {
  visibility: hidden;
}
.close-img {
  width: 13px !important;
  margin-top: -10px !important;
}

.lbl-pickup > img {
  float: right;
  display: inline-block;
  padding: 0px;
  height: 15px;
  width: 15px;
  background: none;
}

.lbl-pickup-sa > img {
  float: left;
  display: inline-block;
  padding: 0px;
  height: 15px;
  width: 15px;
  background: none;
}
.photo-container {
  margin-top: 0px !important;
}
label > input:checked + img {
  background: url("../../assets/images/tick.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 10px 10px;
}

.card-inside-description {
  font-weight: 400 !important;
  font-size: 32px;
  color: #fff !important;
  padding: 100px;
  margin-top: 60px;
}
.outer-container {
  width: 100%;
  margin: 0px !important;
  padding: 0px !important;
  padding-top: 10px !important;
}
.description-container {
  margin-left: 30px;
}
.former-picture {
  width: 65px;
}
.lbl-pickup {
  display: block;
}
.service-img-container,
.product-container {
  cursor: pointer;
}
.img-previous {
  width: 59px !important;
  margin: 5px 0px 3px 0px !important;
}

.new-request-container {
  cursor: pointer;
}

.no-padding {
  margin: 0px !important;
  padding: 0px !important;
}
.product-container {
  text-align: center;
  margin: 10px 10px 30px 10px;
}
p {
  color: #fff;
  text-align: center;
}
.service-img-container {
  width: 46%;
  float: left;
  margin: 10px;
  height: 125px;
}
.service-img {
  width: 80px;
  height: auto;
  text-align: center;
  margin: 10px;
  padding: 10px;
}
.service-container {
  display: inline-block;
  width: 100%;
}
.inp-container {
  margin: 0px 0px 0px 0px;
  font-size: 13px;
  width: 100%;
  margin-bottom: 20px;
}
.heading {
  color: #fff;
  text-align: center;
  margin: auto;
  font-size: 14px !important;
}
.container-bg {
  position: absolute;
  background-image: url("../../assets/images/bg10.png");
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  right: 0;
  top: 0;
  min-width: 100%;
  min-height: 100%;
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
.main-container-manage-collection {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0px 0px 5px 5px;
  border: 1px solid #000;
  border-top: 0px !important;
  height: 400px;
  overflow-y: hidden;
  overflow-x: hidden;
}
.sign-up-form-container {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px 10px 10px 10px;
}
.details-container {
  margin: auto;
  margin-top: 35px;
  margin-bottom: 35px;
}
.ref-logout-lsp {
  font-size: 13px;
  margin-top: -5px;
  text-transform: none !important;
}
.lbl-username-lsp {
  text-transform: none !important;
  font-size: 13px;
}
.e-input-group:not(.e-success):not(.e-warning):not(.e-error):not(.e-float-icon-left),
.e-input-group.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap,
.e-input-group.e-control-wrapper:not(.e-success):not(.e-warning):not(.e-error):not(.e-float-icon-left),
.e-input-group.e-control-wrapper.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap,
.e-float-input.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap,
.e-float-input.e-control-wrapper.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap {
  border-color: #fff !important;
}
.additional-modal-note {
  float: left;
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 22px;
  background-size: 15px 15px;
  width: 100%;
}
.inp-details {
  width: 100%;
  /* margin: 15px; */
  background: none;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff;
  font-size: 13px;
  padding: 10px;
}
.inp-packhouse-name {
  background-image: url("../../assets/images/packhouse.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 18px 20px;
}
.inp-location {
  background-image: url("../../assets/images/location_pin.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 15px 20px;
}
.inp-contact {
  background-image: url("../../assets/images/packhouse.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-address {
  background-image: url("../../assets/images/address_signboard.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-truck {
  background-image: url("../../assets/images/packhouse.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-additional-notes {
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 15px 15px;
}
.inp-email {
  background-image: url("../../assets/images/email_address.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.email-container {
  padding: 0px;
  margin: -20px;
}
.grant-privilage-container {
  padding-top: 5px;
  margin-left: 35px;
}
.close-details {
  height: 16px;
  float: right;
  margin-top: -15px;
  cursor: pointer;
}
.modal-scroll {
  min-height: 340px;
  max-height: 340px;
  overflow: hidden;
}
.modal-container {
  min-height: 350px;
  max-height: 350px;
  overflow-y: scroll;
}
.VueTables__child-row-toggler {
  width: 16px;
  height: 16px;
  line-height: 16px;
  display: block;
  margin: auto;
  text-align: center;
}

.VueTables__child-row-toggler--closed::before {
  content: "+";
}

.VueTables__child-row-toggler--open::before {
  content: "-";
}
.tbl-services {
  color: #fff !important;
  padding: 30px;
  background: rgba(0, 0, 0, 0.2);
}
.tbl-services table {
  color: #fff !important;
}
.table > td {
  color: #fff !important;
  border: 0px;
}
td {
  color: #fff !important;
}

.location-img {
  margin-left: 10px;
  width: 15px;
  height: auto;
  cursor: pointer;
}
.control-section {
  padding: 30px;
}
td {
  padding: 5px;
  border: 0px !important;
}
.manage-collection-points-table thead {
  display: none;
}
tr:nth-child(even) {
  background: rgba(0, 0, 0, 0.4);
}
label > input:checked + img {
  background: url("../../assets/images/tick.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 10px 10px;
}
select {
  color: #fff !important;
}
.inp-half {
  width: 40%;
  float: left;
  margin-right: 20px;
}
.manage-collection-right-container {
  /* margin: 10px 25px; */
  margin: 21px 25px !important;
}
.manage-collection-points-table-ps {
  height: 350px;
}
.outer-container-manage-collection {
  padding-top: 0px !important;
}
.manage-collection-points-table {
  padding: 0px;
}
.manage-collection-points-table .table-bordered td,
.manage-collection-points-table .table-bordered th {
  padding-left: 50px !important;
  padding-right: 50px !important;
  text-align: left;
}
.sa-collection-btn {
  width: 160px;
}
.manage-collection-points-table .VueTables__search {
  display: none;
}
@media screen and (max-width: 531px) {
  .service-img-container {
    width: 100%;
    text-align: center;
  }
}
@media screen and (max-width: 1063px) and (min-width: 768px) {
  .col-md-6 {
    max-width: 100% !important;
    width: 100% !important;
    flex: 100%;
  }
}
@media screen and (max-width: 602px) {
  .content-container {
    margin-top: 30px;
  }
}
</style>
