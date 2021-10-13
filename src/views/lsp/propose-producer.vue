<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-5 details-container add-collector-wrap">
        <div class="header-container">
          <h6 class="heading">
            {{ $t("Proposed Producers", "Proposed Producers") }}
          </h6>
        </div>
        <div class="main-container">
          <perfect-scrollbar class="modal-scroll">
            <div class="card-body modal-container">
              <div
                class="outer-container"
                v-for="producer in producerList"
                :key="producer.snapshotKey"
              >
                <div class="photo-container">
                  <img
                    src="../../assets/images/collector.png"
                    alt="User Picture"
                    class="former-picture"
                  />
                </div>
                <div class="description-container">
                  <label class="lbl-flname lbl-pickup">
                    <b>{{ producer.firstName }} {{ producer.lastName }}</b>
                    <input
                      type="radio"
                      @click="editCollectorDetails(producer)"
                      :checked="snapshotKey == producer.snapshotKey"
                    />
                    <img />
                  </label>
                  <label class="lbl-flname lbl-pickup">{{
                    producer.phoneNumber
                  }}</label>
                  <label class="lbl-flname lbl-pickup">{{
                    producer.department
                  }}</label>
                  <label class="lbl-flname lbl-pickup">{{
                    producer.town
                  }}</label>
                  <label class="lbl-flname lbl-pickup"
                    >{{ $t('Proposed By', 'Proposed By')}}: {{ producer.proposedByName }}</label
                  >
                  <br />
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container">
          <input
            type="button"
            class="btn-new-collector btn-lg"
            :value="$t('Propose New Producer', 'Propose New Producer')"
            @click="createNewCollector"
          />
        </div>
      </div>

      <!-- right side container -->
      <div class="col-md-7 details-container add-collector-wrap">
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

        <div class="main-container">
          <perfect-scrollbar>
            <div class="card-body add-collector-field-wrap">
              <div class="emptyContainer" v-if="isEmptyContainer">
                <h4 class="card-inside-description">
                  {{
                    $t(
                      "Select a Producer to Edit & Update or Propose a New Producer",
                      "Select a Producer to Edit & Update or Propose a New Producer"
                    )
                  }}
                </h4>
              </div>

              <div v-if="selectedCollector">
                <div class="row">
                  <div class="col-md-12">
                    <div class="inp-container inp-half">
                      <input
                        :placeholder="$t('First Name', 'First Name')"
                        class="inp-details inp-firstname"
                        v-model="firstName"
                        type="text"
                      />
                    </div>
                    <div class="inp-container inp-half">
                      <input
                        :placeholder="$t('Last Name', 'Last Name')"
                        class="inp-details"
                        type="text"
                        v-model="lastName"
                      />
                    </div>
                  </div>

                  <div class="col-md-12">
                    <div class="inp-container">
                      <div class="inp-container inp-half">
                        <input
                          :placeholder="$t('Phone Number', 'Phone Number')"
                          class="inp-details inp-firstname"
                          v-model="phoneNumber"
                          type="number"
                        />
                      </div>
                      <div class="inp-container inp-half">
                        <v-select
                          id="dropdownlist"
                          v-model="department"
                          :placeholder="$t('Department', 'Department')"
                          class="manage-department-select"
                          :options="departmentList"
                        ></v-select>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12">
                    <div class="inp-container">
                      <div class="inp-container inp-half">
                        <input
                          :placeholder="$t('Town', 'Town')"
                          class="inp-details"
                          v-model="town"
                          type="text"
                        />
                      </div>
                      <div class="inp-container inp-half">
                        <input
                          :placeholder="$t('NIF', 'NIF')"
                          class="inp-details"
                          v-model="nif"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12">
                    <div class="inp-container">
                      <div class="inp-container inp-half">
                        <input
                          :placeholder="$t('CIN', 'CIN')"
                          class="inp-details"
                          v-model="cin"
                          type="text"
                        />
                      </div>
                      <div class="inp-container inp-half">
                        <input
                          :placeholder="
                            $t('Longitude,Latitude', 'Longitude,Latitude')
                          "
                          class="inp-details"
                          v-model="location"
                          type="text"
                          @blur="showWhat3Words"
                        />
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
                        <!-- <a  :href="mapAdd" target="_blank"><img class="img-location" src="../../assets/images/location_pin.png" />{{whatwords}}</a> -->
                      </div>
                    </div>
                  </div>

                  <div class="col-md-10">
                    <div v-if="isFileContainer" class="ProfileConatiner">
                      <img
                        :src="profilePicPath"
                        style="width: 200px; height: 200px"
                      />
                      <a target="_blank" v-bind:href="profilePicPath"
                        >{{
                          $t(
                            "Click here to view profile pic",
                            "Click here to view profile pic"
                          )
                        }}
                        : {{ profilePicName }}</a
                      >
                      <br />
                    </div>
                    <!-- <div
                      class="inp-container proposed-producers-attach-container"
                    >
                      <b-form-file
                        v-model="profilePicture"
                        :placeholder="
                          $t('No Attachments yet', 'No Attachments yet')
                        "
                        drop-placeholder="Drop file here..."
                      >
                        <template slot="file-name" slot-scope="{ names }">
                          <b-badge variant="dark">{{ names[0] }}</b-badge>
                          <b-badge
                            v-if="names.length > 1"
                            variant="dark"
                            class="ml-1"
                            >+ {{ names.length - 1 }} More files</b-badge
                          >
                        </template>
                      </b-form-file>
                      <div class="attach-border"></div>
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container" v-if="selectedCollector">
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
            @click="saveProducerDetails"
          />
        </div>
      </div>
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
import uploadFiles from "../../shared/uploa-files";
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
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import getConfigVars from "../../shared/config-env";
Vue.use(VueToast);
import { uuid } from "vue-uuid";
import axios from "axios";

import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
import isAuthenticated from '../../shared/auth';

Vue.use(Datetime);
export default {
  name: "manage-users",
  data: function() {
    return {
      seen: true,
      userName: null,
      pageTitle: "Producer Details",
      producerList: [],
      isEmptyContainer: true,
      selectedCollector: false,
      firstName: null,
      lastName: null,
      snapshotKey: null,
      loader: false,
      departmentList: [],
      department: null,
      location: null,
      cin: null,
      nif: null,
      town: null,
      phoneNumber: null,
      profilePicture: null,
      currentItemId: null,
      profilePicPath: null,
      profilePicName: null,
      isFileContainer: false,
      whatwords:"",
      mapAdd:"",
      nearestPlace:"",
      country:"",
      iswhatwordsVisible:false
    };
  },
  components: {
    PerfectScrollbar,
    Header,
    Footer,
  },
  mounted() {
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
          text: this.$t("Propose Producer", "Propose Producer"),
          href: "/propose-producer",
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
          text: this.$t("Propose Producer", "Propose Producer"),
          href: "/propose-producer",
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
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
        {
          text: this.$t("Propose Producer", "Propose Producer"),
          href: "/propose-producer",
        },
      ]);
    } else if (localStorage.systemRole == 96) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
        {
          text: this.$t("Propose Producer", "Propose Producer"),
          href: "/propose-producer",
        },
      ]);
    } else if (localStorage.systemRole == 7) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("OP-Admin-Dashboard", "OP-Admin-Dashboard"),
          href: "/op-admin-dashboard",
        },
        {
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
        {
          text: this.$t("Propose Producer", "Propose Producer"),
          href: "/propose-producer",
        },
      ]);
    }

    // if (!localStorage.emailId) {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
    this.getProposedProducerList();
    this.getDepartmentList();
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
    signInWithEmailLink: function(email) {
      const vm = this;
      var actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be whitelisted in the Firebase Console.
        url: `${getConfigVars().APP_URL}add-collector`,
        // This must be true.
        handleCodeInApp: true,
      };
      firebase
        .auth()
        .sendSignInLinkToEmail(email, actionCodeSettings)
        .then(function() {
          alert("Succcess");
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          Vue.$toast.open({
            message: vm.$t("Email sent.", "Email sent."),
            type: "success",
            position: "top",
          });
        })
        .catch(function(error) {
          // Some error occurred, you can inspect the code: error.code
        });
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
    clearAll: function() {
      this.snapshotKey = null;
      this.selectedCollector = false;
      this.isEmptyContainer = true;
      this.isFileContainer = false;
      this.country = "";
      this.nearestPlace = "";
      this.whatwords = "";
      this.mapAdd = "";
      this.iswhatwordsVisible = false;

    },
    showDashboard: () => Router.push("lsp-dashboard"),
    getDepartmentList: function() {
      var currentVal = this;
      var ref = firebase
        .database()
        .ref()
        .child("masters")
        .child("department");

      ref.on("child_added", function(snapshot) {
        currentVal.departmentList.push(snapshot.val().departmentName);
      });
    },
    getProposedProducerList: function() {
      let currentVal = this;
      currentVal.producerList = [];

      const ref = firebase
        .database()
        .ref()
        .child("proposedProducer");

      ref.on("child_added", function(requestData) {
        console.log("key" + requestData.key);
        const {
          firstName,
          lastName,
          phoneNumber,
          town,
          department,
          cin,
          nif,
          location,
          profilePicPath,
          profilePicName,
          proposedByName,
          proposedByEmail,
        } = requestData.val();
        let _data = {
          firstName,
          lastName,
          phoneNumber,
          town,
          department,
          cin,
          nif,
          location,
          profilePicPath,
          profilePicName,
          proposedByName,
          proposedByEmail,
        };
        const dataToPush = {
          ..._data,

          snapshotKey: requestData.key,
        };
        currentVal.producerList.push(dataToPush);

        currentVal.seen = false;
      });
      setTimeout(() => {
        currentVal.seen = false;
      }, 3000);
    },
    editCollectorDetails: function({
      phoneNumber,
      firstName,
      town,
      lastName,
      department,
      snapshotKey,
      cin,
      nif,
      location,
      profilePicPath,
      profilePicName,
    }) {
      this.pageTitle = this.$t(
        "Edit Producer Details",
        "Edit Producer Details"
      );
      this.isEmptyContainer = false;
      this.selectedCollector = true;
      this.firstName = firstName;
      this.lastName = lastName;
      this.town = town;
      this.department = department;
      this.cin = cin;
      this.nif = nif;
      this.snapshotKey = snapshotKey;
      this.phoneNumber = phoneNumber;
      this.location = location;
      this.profilePicPath = profilePicPath;
      this.profilePicName = profilePicName;
      this.showWhat3Words();
      if (
        this.profilePicPath != null &&
        this.profilePicPath != "" &&
        this.profilePicPath != undefined
      ) {
        this.isFileContainer = true;
      } else {
        this.isFileContainer = false;
      }
    },
    createNewCollector: function() {
      this.isEmptyContainer = false;
      this.selectedCollector = true;
      this.pageTitle = this.$t("New Producer Details", "New Producer Details");
      this.firstName = null;
      this.lastName = null;
      this.town = null;
      this.department = null;
      this.phoneNumber = null;
      this.cin = null;
      this.nif = null;
      this.location = null;
      this.country = "";
      this.location = "";
      this.nearestPlace = "";
      this.mapAdd = "";
      this.iswhatwordsVisible = false;
    },
    saveProducerDetails: function() {
      // creating new user
      const vm = this;
      this.seen = true;
      console.log(
        vm.firstName,
        vm.lastName,
        vm.phoneNumber,
        vm.department,
        vm.town
      );
      if (
        vm.firstName == null ||
        vm.lastName == null ||
        vm.phoneNumber == null ||
        vm.department == null ||
        vm.town == null ||
        vm.location == null
      ) {
        vm.seen = false;
        Vue.$toast.open({
          message: this.$t(
            "Please fill all the mandatory fields.",
            "Please fill all the mandatory fields."
          ),
          type: "error",
          position: "top",
        });
      } else {
        var inpData = {
          firstName: vm.firstName,
          lastName: vm.lastName,
          phoneNumber: vm.phoneNumber,
          department: vm.department,
          town: vm.town,
          location: vm.location,
          nif: vm.nif || "",
          cin: vm.cin || "",
          proposedByName: localStorage.userName,
          proposedByEmail: localStorage.emailId,
        };

        if (
          this.pageTitle ==
          this.$t("New Producer Details", "New Producer Details")
        ) {
          vm.currentItemId = uuid.v1();
          firebase
            .database()
            .ref()
            .child("proposedProducer")
            .child(vm.currentItemId)
            .set(inpData)
            .then(function(response) {
              vm.uploadProducerImages();

              Vue.$toast.open({
                message: vm.$t(
                  "Producer proposed successfully",
                  "Producer proposed successfully"
                ),
                type: "success",
                position: "top",
              });
              vm.clearAll();
              vm.getProposedProducerList();
              vm.seen = false;
            })
            .catch(function(err) {
              console.log(err);
            });
        } else if (
          this.pageTitle ==
          vm.$t("Edit Producer Details", "Edit Producer Details")
        ) {
          firebase
            .database()
            .ref()
            .child("proposedProducer")
            .child(this.snapshotKey)
            .update(inpData)
            .then(function(response) {
              if (vm.profilePicture != null && vm.profilePicture != "") {
                vm.currentItemId = vm.snapshotKey;
                vm.uploadProducerImages();
              }
              Vue.$toast.open({
                message: vm.$t(
                  "Proposed producer details updated successfully",
                  "Proposed producer details updated successfully"
                ),
                type: "success",
                position: "top",
              });
              vm.clearAll();
              vm.getProposedProducerList();
              vm.seen = false;
            });
        }
      }
    },

    uploadProducerImages: function() {
      this.uploadImage(
        this.profilePicture,
        "ProposedProducerImage",
        this.currentItemId,
        "",
        this,
        "ProposedProducers"
      );
    },
    printDownloadUrl: function(url, fileName, documentType) {
      var currentValue = this;
      if (url) {
        var dbRef = firebase
          .database()
          .ref()
          .child("proposedProducer");
        var inpData = {
          profilePicPath: url,
          profilePicName: fileName,
        };

        var ref = firebase
          .database()
          .ref("proposedProducer")
          .child(currentValue.currentItemId);
        ref.update(inpData).then(function() {
          currentValue.seen = false;
        });
      }
      this.seen = false;
    },

    uploadImage: function(files, selectedStage, id, inpData, vm, documentType) {
      uploadFiles(
        files,
        selectedStage,
        id,
        inpData,
        vm,
        documentType,
        this.printDownloadUrl
      );
    },

    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else {
        Router.push("lsp-dashboard");
      }
    },
  },
};
</script>
<style scoped>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
.button-container {
  margin: 10px -4px 10px 10px !important;
}
.btn-new-collector {
  height: 30px !important;
}
.btn-save,
.btn-cancel {
  height: 30px !important;
}
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
.btn-new-collector {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 12px;
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
  margin-top: 22px !important;
}
label > input:checked + img {
  background: url("../../assets/images/tick.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 10px 10px;
}

.card-inside-description {
  font-weight: 400 !important;
  font-size: 22px;
  color: #fff !important;
  padding: 90px;
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
  display: inline;
  margin: 0px 0px 0px 0px;
  font-size: 13px;
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
  /* height: auto; */
  height: 50px !important;
  padding: 15px;
  background: rgba(0, 0, 0, 0.616);
  border-radius: 5px 5px 0px 0px;
  border: 1px solid #000;
}
.main-container {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0px 0px 5px 5px;
  border: 1px solid #000;
  border-top: 0px !important;
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
.inp-half {
  width: 40%;
  float: left;
  margin-right: 20px;
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
  margin: 10px 0px 10px 0px;
  background: none;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff;
  font-size: 13px;
  padding: 10px;
  height: 36px;
}
.inp-firstname {
  background-image: url("../../assets/images/user.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
  background-size: 20px 20px;
}
.inp-lastname {
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
  background-size: 20px 20px;
}
.inp-bda {
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
  background-size: 20px 20px;
}
.inp-function {
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
  background-size: 20px 20px;
}
.inp-email {
  background-image: url("../../assets/images/email_address.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
  background-size: 20px 20px;
}
.inp-contact {
  background-image: url("../../assets/images/landline.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
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
  margin-right: 5px;
}
.add-collector-wrap .modal-scroll {
  height: 400px;
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
  margin: 0px 0px 0px 12%;
  font-size: 13px;
}
.add-collector-field-wrap {
  margin: 10px 25px;
}
.add-collector-wrap .main-container {
  overflow-x: hidden;
  overflow-y: hidden;
}
::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  /* color: #fff !important; */
  color: #a8a8a8 !important;
  font-size: 13px;
}
::-moz-placeholder {
  /* Firefox 19+ */
  /* color: #fff !important; */
  color: #a8a8a8 !important;
  font-size: 13px;
}
:-ms-input-placeholder {
  /* IE 10+ */
  /* color: #fff !important; */
  color: #a8a8a8 !important;
  font-size: 13px;
}
:-moz-placeholder {
  /* Firefox 18- */
  font-size: 13px;
  color: #a8a8a8 !important;
  /* color: #fff !important; */
}
.function-dropdown {
  display: inline;
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
</style>
<style>
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


.location-img
{
  width: 20px;
  height: auto;
  cursor: pointer;

}
.manage-department-select .vs__dropdown-toggle {
  border: none;
  border-bottom: 1px solid #fff;
  border-radius: 0px;
  margin: 10px 0px 0px 0px !important;
}
.manage-department-select {
  font-size: 13px;
  margin: 10px 0px 10px 0px;
}
.manage-department-select span,
.manage-department-select input,
.manage-department-select .vs__no-options {
  color: #fff;
}
.manage-department-select span {
  margin-left: 0px;
  padding-left: 0px;
}
.manage-department-select .vs__dropdown-menu {
  background: none;
  padding: 0px;
  max-height: 155px;
}
.manage-department-select .vs__dropdown-option {
  color: #fff;
  padding: 10px;
  background: #1e2318;
}
.manage-department-select .vs__dropdown-option--highlight {
  background: #000;
}
.manage-department-select .vs__open-indicator,
.manage-department-select .vs__clear {
  fill: #fff;
}
.manage-department-select .vs__selected-options,
.manage-department-select .vs__search,
.vs__search:focus {
  padding: 0px;
  margin: 0px;
  padding-left: 5px !important;
}
.manage-department-select .vs__dropdown-toggle {
  padding: 0px;
  padding-bottom: 2px;
  margin: 10px 0px;
  height: 36px;
}
.manage-department-select .vs__selected {
  margin: 0px;
  padding: 0px;
}
.manage-department-select .vs__clear {
  margin-top: -10px;
}
.manage-department-select .vs__open-indicator {
  margin-top: -5px;
}
.proposed-producers-attach-container .attach-border {
  border-bottom: 1px solid #ffffff;
  position: absolute;
  width: 90%;
}
.input-wrap {
  background-color: rgb(0, 0, 0, 0.5);
  border: 1px solid #000;
  border-radius: 10px;
  padding: 10px;
  position: relative;
  padding-bottom: 20px;
  margin: 25px;
}
.proposed-producers-attach-container .custom-file-label {
  background: transparent;
  border: none;
  border-radius: 0px;
  color: #fff;
  padding: 0;
  font-size: 13px;
  top: 10px !important;
  text-align: left;
}
.proposed-producers-attach-container
  .custom-file-input:lang(en)
  ~ .custom-file-label::after {
  content: "Attach";
  background: #585a4d;
  border: 1px solid #000;
  padding: 4px 12px 4px 12px;
  color: #fff;
  margin-top: 1px;
}
.custom-file-input:focus ~ .custom-file-label {
  border: none;
  box-shadow: none;
}
.proposed-producers-attach-container .custom-file {
  height: 36px;
  margin: 10px 0px 0px 0px;
}
</style>
