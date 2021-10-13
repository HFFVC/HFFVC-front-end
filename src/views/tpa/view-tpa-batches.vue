<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>

    <div class="row content">
      <div class="col-md-12 no-padding main-header">
        <div class="logo-container cursor-pointer" @click="gotoDashboard">
             <h3 @click="gotoDashboard" class="inter-head">HFFVC</h3>
          <!-- <img
            class="img-logo-lsp"
            alt="agriledger logo"
            src="../../assets/images/logo.png"
          />
          <sup class="beta">(BETA)</sup> -->
        </div>
        <div class="username-conatiner-lsp">
          <img
            class="user-icon"
            alt="agriledger logo"
            src="../../assets/images/user.png"
          />
          <label class="lbl-username-lsp">{{ userName }}</label>
          <br />
          <a href="#" v-on:click="logout" class="ref-logout-lsp">Logout</a>
        </div>
      </div>
      <div class="col-md-10 content-container">
        <div class="header-container">
          <h3 class="heading">Active Batches</h3>
          <div class="icon-container">
            <ul>
              <li>
                <img
                  @click="showDashboard"
                  class="sub-header-close-img"
                  src="../../assets/images/close.png"
                />
              </li>
            </ul>
          </div>
        </div>
        <div class="main-container">
          <div id="people">
            <v-client-table
              :data="serviceRequests"
              :columns="columns"
              :options="options"
              class="tbl-services tbl-view-broker-batches"
            >
              <template slot="Location" slot-scope="props">
                <div>
                  <div class="location-text">{{ props.row.Location }}</div>
                  <a class="fa fa-edit">
                    <img
                      class="location-img"
                      src="../../assets/images/location_pin.png"
                    />
                  </a>
                </div>
              </template>
              <template slot="Payment" slot-scope="props">
                <div v-if="props.row.isSellPresent">
                  <a class="btn-icn" @click="generateInvoice(props.row)">
                    <img
                      class="location-payment"
                      src="../../assets/images/invoice_payments.png"
                    />
                  </a>
                </div>
              </template>
            </v-client-table>
          </div>
        </div>
      </div>
      <b-modal
        hide-footer
        id="modal"
        @hide="hideViewBatchModal"
        ref="view-batch"
        hide-backdrop
        title="View Batch Details"
      >
        <perfect-scrollbar class="modal-scroll">
          <div class="inp-container">
            <label class="input-label">Batch No.</label>
            <input class="text-input" readonly type="text" v-model="batchNo" />
          </div>
          <div class="inp-container">
            <label class="input-label">Product Type</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="productType"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">Departure Timestamp</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="departureTimestamp"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">Departure Temperature</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="departureTemperature"
            />
          </div>
          <v-client-table
            :data="lots"
            :columns="viewColumns"
            :options="viewOptions"
            class="tbl-services view-tbl-services"
          ></v-client-table>
          <h4 class="sub-heading">Pro-forma Invoice</h4>
          <div class="inp-container">
            <label class="input-label">Proforma No.</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="proformaNo"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">Full Name</label>
            <input class="text-input" readonly type="text" v-model="fullName" />
          </div>
          <div class="inp-container">
            <label class="input-label">Email</label>
            <input class="text-input" type="text" readonly v-model="email" />
          </div>
          <h4 class="sub-heading">Selling to</h4>
          <div class="inp-container">
            <label class="input-label">Address Line 1</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="sellingAddressLine1"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">Address Line 2</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="sellingAddressLine2"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">Address Line 3</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="sellingAddressLine3"
            />
          </div>
          <h4 class="sub-heading">Shipping</h4>
          <div class="inp-container">
            <label class="input-label">Address Line 1</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="shippingAddressLine1"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">Address Line 2</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="shippingAddressLine2"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">Address Line 3</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="shippingAddressLine3"
            />
          </div>
          <div class="inp-container unit-price-container">
            <label class="input-label">Unit Price</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="unitPrice"
            />
          </div>
          <div class="inp-container unit-price-container">
            <label class="input-label">Currency</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="proformaInvoiceCurrency"
            />
          </div>
        </perfect-scrollbar>
      </b-modal>
      <b-modal
        hide-footer
        @hide="hideMaintainModal"
        id="maintain-batch-modal"
        class
        ref="maintain-batch"
        hide-backdrop
        title="Batch Details"
      >
        <div class="row">
          <div class="col-md-4">
            <div class="header-container maintain-batch-heading">
              <h3 class="heading">Batch Details</h3>
            </div>
            <div class="main-container maintain-batch-container">
              <input
                class="input-label input-readonly-label"
                v-on:click="stageSelection('Arrival & Destination')"
                value="Arrival & Destination"
                v-bind:class="{
                  active: selectedStage == 'Arrival & Destination'
                }"
                readonly
              />
              <input
                class="input-label input-readonly-label"
                v-on:click="stageSelection('Documents')"
                value="Documents"
                v-bind:class="{ active: selectedStage == 'Documents' }"
                readonly
              />
              <input
                class="input-label input-readonly-label"
                v-on:click="stageSelection('Quality Inspection')"
                v-bind:class="{ active: selectedStage == 'Quality Inspection' }"
                value="Quality Inspection"
                readonly
              />
              <input
                class="input-label input-readonly-label"
                v-on:click="stageSelection('Cold Storage')"
                v-bind:class="{ active: selectedStage == 'Cold Storage' }"
                value="Cold Storage"
                readonly
              />
              <input
                class="input-label input-readonly-label"
                v-on:click="stageSelection('Cost of Maturation')"
                v-bind:class="{ active: selectedStage == 'Cost of Maturation' }"
                value="Cost of Maturation"
                readonly
              />
            </div>
          </div>
          <div class="col-md-8">
            <div class="header-container maintain-batch-heading">
              <h3 class="heading">{{ selectedStage }}</h3>
            </div>
            <div class="main-container maintain-batch-container">
              <perfect-scrollbar class="maintain-modal-scroll">
                <div
                  class="input-wrap larvae-input-wrap"
                  v-if="selectedStage == 'Arrival & Destination'"
                >
                  <div class="inp-container">
                    <label class="input-label">Arrival Timestamp</label>
                    <input
                      class="text-input"
                      type="text"
                      readonly
                      v-model="arrivalTimestamp"
                    />
                  </div>
                  <div class="inp-container">
                    <label class="input-label">Destination</label>
                    <input
                      class="text-input"
                      type="text"
                      v-model="destination"
                    />
                  </div>
                </div>
                <div class="input-wrap" v-if="selectedStage == 'Documents'">
                  <div class="inp-container attach-container">
                    <label class="input-label">Permit</label>
                    <b-form-file
                      class="file-upload-with-label"
                      v-model="importPermit"
                      placeholder="No Attachments yet"
                      drop-placeholder="Drop file here..."
                    ></b-form-file>
                    <div class="attach-border"></div>

                    <div
                      v-if="isImportPermit"
                      class="view-broker-batches-upload-wrap"
                    >
                      <ul class="upload-file-link-ul">
                        <li
                          class="uploaded-file-link"
                          v-bind:key="file.importPermitFileName"
                          v-for="file in importFiles"
                        >
                          {{ file.importPermitFileName }}
                          <a
                            target="_blank"
                            v-bind:href="file.importPermitFilePath"
                          >
                            <img
                              class="download-icon-upload"
                              src="../../assets/images/download-button.png"
                            />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="inp-container attach-container">
                    <label class="input-label">Document</label>
                    <b-form-file
                      class="file-upload-with-label"
                      v-model="document"
                      placeholder="No Attachments yet"
                      drop-placeholder="Drop file here..."
                    ></b-form-file>
                    <div class="attach-border"></div>

                    <div
                      v-if="isDocument"
                      class="view-broker-batches-upload-wrap"
                    >
                      <ul class="upload-file-link-ul">
                        <li
                          class="uploaded-file-link"
                          v-bind:key="file.documentFileName"
                          v-for="file in documentFiles"
                        >
                          {{ file.documentFileName }}
                          <a
                            target="_blank"
                            v-bind:href="file.documentFilePath"
                          >
                            <img
                              class="download-icon-upload"
                              src="../../assets/images/download-button.png"
                            />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="inp-container attach-container">
                    <label class="input-label">Temperature Reading</label>
                    <b-form-file
                      class="file-upload-with-label"
                      v-model="temperatureReadings"
                      placeholder="No Attachments yet"
                      drop-placeholder="Drop file here..."
                    ></b-form-file>
                    <div class="attach-border"></div>

                    <div
                      v-if="isTemperatureReading"
                      class="view-broker-batches-upload-wrap"
                    >
                      <ul class="upload-file-link-ul">
                        <li
                          class="uploaded-file-link"
                          v-bind:key="file.temperatureReadingsFileName"
                          v-for="file in temperatureFiles"
                        >
                          {{ file.temperatureReadingsFileName }}
                          <a
                            target="_blank"
                            v-bind:href="file.temperatureReadingsFilePath"
                          >
                            <img
                              class="download-icon-upload"
                              src="../../assets/images/download-button.png"
                            />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div
                  class="input-wrap"
                  v-if="selectedStage == 'Quality Inspection'"
                >
                  <div class="inp-container">
                    <label class="input-label">Fruits Rejected</label>
                    <input
                      class="text-input"
                      type="number"
                      v-model="fruitsRejected"
                    />
                  </div>
                  <div class="inp-container">
                    <label class="input-label">Additional Comments</label>
                    <input
                      class="text-input"
                      type="text"
                      v-model="additionalComments"
                    />
                  </div>
                  <div class="inp-container">
                    <label class="input-label">Upload Image</label>
                    <b-form-file
                      class="file-upload-with-label"
                      multiple
                      v-model="imageUpload"
                      placeholder="No Attachments yet"
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
                    <div
                      v-if="qualityFile"
                      class="view-broker-batches-upload-wrap"
                    >
                      <ul class="upload-file-link-ul">
                        <li
                          class="uploaded-file-link"
                          v-bind:key="file.qualityInspectionImageName"
                          v-for="file in qualityFiles"
                        >
                          {{ file.qualityInspectionImageName }}
                          <a
                            target="_blank"
                            v-bind:href="file.qualityInspectionImagePath"
                          >
                            <img
                              class="download-icon-upload"
                              src="../../assets/images/download-button.png"
                            />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="input-wrap" v-if="selectedStage == 'Cold Storage'">
                  <div class="inp-container">
                    <label class="input-label">Temperature</label>
                    <input
                      class="text-input"
                      type="number"
                      v-model="temperature"
                    />
                  </div>
                  <div class="inp-container">
                    <label class="input-label">Ph Level</label>
                    <input class="text-input" type="number" v-model="phLevel" />
                  </div>
                  <div class="inp-container">
                    <label class="input-label">Ethylene Level</label>
                    <input
                      class="text-input"
                      type="number"
                      v-model="ethyleneLevel"
                    />
                  </div>
                  <div class="inp-container">
                    <label class="input-label">CO2 Level</label>
                    <input
                      class="text-input"
                      type="number"
                      v-model="co2Level"
                    />
                  </div>
                  <div class="inp-container">
                    <label class="input-label">Cold Storage In Timestamp</label>
                    <input
                      class="text-input"
                      type="text"
                      v-model="coldStorageInTimestamp"
                    />
                  </div>
                </div>
                <div
                  class="input-wrap"
                  v-if="selectedStage == 'Cost of Maturation'"
                >
                  <div class="inp-container">
                    <label class="input-label">Cost of Maturation</label>
                    <input
                      class="text-input"
                      type="number"
                      v-model="costOfMaturation"
                    />
                  </div>
                </div>
              </perfect-scrollbar>
            </div>
          </div>
        </div>
        <div class="button-container">
          <input
            type="button"
            v-on:click="hideMaintainModal"
            class="btn-cancel"
            value="Cancel"
          />
          <input
            type="button"
            v-on:click="SaveMaintain"
            class="btn-save"
            value="Save"
          />
        </div>
      </b-modal>
      <b-modal
        hide-footer
        id="generate-invoice-modal"
        class
        ref="generate-invoice"
        hide-backdrop
        title="Invoice Details"
      >
        <perfect-scrollbar class="modal-scroll">
          <div class="inp-container">
            <label class="input-label">Invoice No.</label>
            <input
              class="text-input"
              type="text"
              readonly
              v-model="invoiceNo"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">Billing Date</label>
            <input class="text-input" type="text" v-model="billingDate" />
          </div>
          <div class="inp-container">
            <label class="input-label">Broker Name</label>
            <input class="text-input" type="text" v-model="brokerName" />
          </div>
          <div class="inp-container">
            <label class="input-label">Broker Organization</label>
            <input
              class="text-input"
              type="text"
              v-model="brokerOrganization"
            />
          </div>
          <h4 class="sub-heading">Buyer Details</h4>
          <div class="inp-container">
            <label class="input-label">Buyer Name</label>
            <input class="text-input" type="text" v-model="buyerName" />
          </div>
          <div class="inp-container">
            <label class="input-label">Buyer Organization</label>
            <input class="text-input" type="text" v-model="buyerOrganization" />
          </div>
          <div class="inp-container">
            <label class="input-label">Product</label>
            <input class="text-input" type="text" v-model="product" />
          </div>
          <div class="inp-container">
            <label class="input-label">No. of Boxes Purchased</label>
            <input
              class="text-input"
              type="text"
              v-model="noofBoxesPurchased"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">Price Per Kg</label>
            <input class="text-input" type="text" v-model="pricePerKg" />
          </div>
        </perfect-scrollbar>
        <div class="button-container">
          <input
            type="button"
            v-on:click="hideGIModal"
            class="btn-cancel"
            value="Cancel"
          />
          <input
            type="button"
            v-on:click="SaveGI"
            class="btn-save"
            value="Save"
          />
        </div>
      </b-modal>
      <b-modal
        ref="success-modal"
        hide-footer
        hide-header
        title="Status"
        id="modalnew"
        hide-backdrop
      >
        <label class="lbl-modal-success">{{ succesContent }}</label>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../../router";
import firebase from "firebase";
import axios from "axios";
import "../../assets/css/main.css";
import "../../assets/css/manage-services.css";
import { ClientTable } from "vue-tables-2";
import BootstrapVue from "bootstrap-vue";
import moment from "moment";
import Datetime from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";

import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
import uploadFiles from "../../shared/uploa-files";

Vue.use(VueToast);

Vue.use(Datetime);

Vue.use(BootstrapVue);

Vue.use(ClientTable);

import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
Vue.use(DropDownListPlugin);

import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
export default {
  components: {
    PerfectScrollbar
  },
  name: "view-tpa-batches",
  data: function() {
    return {
      serviceRequests: [],
      columns: ["Batch Id", "batchCreatedOn", "No Of Lots", "Payment"],
      exceededColumns: ["Lot", "totalNoofBoxes", "remaininglNoofBoxes"],
      sellListColumns: [
        "Sale Id",
        "Buyer's Name",
        "Total No Of Boxes Sold",
        "Ship Order & Unloading"
      ],
      seen: true,
      show: false,
      selectedRow: null,
      sportsData: ["Mango", "Pineapple", "Avocado"],
      dateTime: null,
      userName: "",
      packHouse: [],
      errorMessage: "",
      succesContent: "",
      checkedRows: [],
      isSell: false,
      isGI: true,
      isConfirm: false,
      viewColumns: ["LotNo", "NoofBoxes"],
      lots: [],
      batchNo: null,
      productType: null,
      departureTimestamp: null,
      departureTemperature: null,
      departureDestination: null,
      options: {
        perPage: 10,
        sortable: ["Product", "batchCreatedOn"],
        headings: {
          batchCreatedOn: "Batch Created On"
        },
        customSorting: {
          batchCreatedOn: function(ascending) {
            return function(a, b) {
              let dateA = new Date(a.batchCreatedOn);
              let dateB = new Date(b.batchCreatedOn);

              if (ascending) return dateA >= dateB ? 1 : -1;

              return dateA <= dateB ? 1 : -1;
            };
          }
        }
      },
      viewOptions: {
        perPage: 10,
        filterable: false,
        headings: {
          LotNo: "Lot No.",
          NoofBoxes: "No. of Boxes"
        },
        sortable: []
      },
      exceededOptions: {
        perPage: 10,
        headings: {
          totalNoofBoxes: "Total No. of Boxes",
          remaininglNoofBoxes: "Unsold No. of Boxes"
        },
        filterable: false,
        sortable: []
      },
      sellListOptions: {
        perPage: 5,
        headings: {
          totalNoofBoxes: "Total No. of Boxes",
          remaininglNoofBoxes: "Unsold No. of Boxes"
        },
        perPageValues: [],
        filterable: false,
        sortable: []
      },
      arrivalTimestamp: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      destination: null,
      importPermit: null,
      selectedStage: "Arrival & Destination",
      document: null,
      temperatureReadings: null,
      fruitsRejected: null,
      additionalComments: null,
      imageUpload: null,
      temperature: null,
      phLevel: null,
      ethyleneLevel: null,
      co2Level: null,
      coldStorageInTimestamp: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      costOfMaturation: null,
      invoiceNo: null,
      billingDate: null,
      brokerName: null,
      brokerOrganization: null,
      buyerName: null,
      buyerOrganization: null,
      product: null,
      proformaNo: null,
      fullName: null,
      email: null,
      sellingAddressLine1: null,
      sellingAddressLine2: null,
      sellingAddressLine3: null,
      shippingAddressLine1: null,
      shippingAddressLine2: null,
      shippingAddressLine3: null,
      unitPrice: null,
      noofBoxesPurchased: null,
      pricePerKg: null,
      lotsList: [],
      sellSelectedStage: null,
      beforeLotSelection: true,
      sellBuyerName: null,
      sellBuyerOrganization: null,
      sellBuyerAddress: null,
      sellBuyerContactDetails: null,
      sellBuyerEmailAddress: null,
      saleTransactionDate: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      totalNoOfBoxesSold: null,
      soldProduct: null,
      salesPricePerKg: null,
      salesWeightPerBox: null,
      dateAndTimeOfLoading: null,
      totalNoofBoxesLoaded: null,
      sellCostOfTransportation: null,
      buyersLocation: null,
      nextTabtobeLoaded: null,
      dateAndTimeOfUnLoading: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      totalNoofBoxesUnLoaded: null,
      totalNumberOfBoxes: 0,
      detailsSelectedStage: "Enter Buyer Details",
      salesCurrency: "USD",
      currencySource: ["USD"],
      salesBrokerMargin: null,
      shipOrderCurrency: "USD",
      exceededComments: null,
      arrivalTimestampInSell: new Date(2018, 11, 24),
      qualityInspectionFileLength: 0,
      qualityFile: false,
      qualityFiles: [],
      importFiles: [],
      documentFiles: [],
      temperatureFiles: [],
      isImportPermit: false,
      isDocument: false,
      isTemperatureReading: false,
      nextShowFlag: true,
      sellList: [],
      newSaleTabShow: false,
      updateSaleTabShow: false,
      selectedSellRow: null,
      proformaInvoiceCurrency: null
    };
  },
  mounted() {
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.getData();

    this.userName = localStorage.userName;
  },

  methods: {
    getData: function() {
      let currentValue = this;
      currentValue.seen = true;
      currentValue.serviceRequests = [];
      var ref = firebase
        .database()
        .ref()
        .child("batch");

      ref
        .orderByChild("status")
        .equalTo("Batch Proforma Completed")
        .on("child_added", function(snapshot) {
          if (snapshot.val() != null) {
            var isSellPresent = false;

            var isMaintain = false;
            if (snapshot.val().maintain != undefined) {
              isMaintain = true;
            }
            if (snapshot.val().sell != undefined) {
              isSellPresent = true;

              currentValue.serviceRequests.push({
                "Batch Id": snapshot.val().batchId,
                batchCreatedOn: moment
                  .utc(snapshot.val().batchCreatedAt)
                  .local()
                  .format("MMM DD, YYYY hh:mm A"),
                "No Of Lots": snapshot.val().noOfLots,
                Id: snapshot.val().batchId,
                isSellPresent: isSellPresent,
                isMaintain: isMaintain,
                product: snapshot.val().product
              });
            }
            currentValue.serviceRequests.reverse();
            currentValue.seen = false;
            currentValue.show = true;
          } else {
            currentValue.showIcons = false;
            currentValue.seen = false;
          }
        });
      setTimeout(function() {
        if (currentValue.serviceRequests.length == 0) {
          currentValue.seen = false;
        }
      }, 4000);
    },

    hideModal: function() {
      this.$refs["invoice-modal"].hide();
      location.reload();
    },

    closeModal() {
      this.collector = null;
      this.collectionpoint = null;
      this.dropoffatpackhouse = null;
      this.date = null;
    },

    getSellList: function() {
      this.sellList = [];
      var currentVal = this;
      var ref = firebase
        .database()
        .ref()
        .child("batch")
        .child(currentVal.selectedRow.Id);
      ref.on("value", function(snapshot) {
        if (snapshot.val().sell != undefined) {
          var sellRef = firebase
            .database()
            .ref()
            .child("batch")
            .child(currentVal.selectedRow.Id)
            .child("sell");
          sellRef.on("child_added", function(datashot) {
            currentVal.sellList.push({
              "Sale Id": datashot.val().sellId,
              "Buyer's Name": datashot.val().sellBuyerName,
              "Total No Of Boxes Sold": datashot.val().totalNoOfBoxesSold,
              pushId: datashot.key
            });
          });
        }
      });
    },

    getLots: function() {
      this.lotsList = [];
      let currentVal = this;
      var iteration = 0;
      var ref = firebase
        .database()
        .ref()
        .child("batch")
        .child(currentVal.selectedRow.Id)
        .child("lots");

      ref.on("child_added", function(snapshot) {
        iteration = iteration + 1;
        var unsoldBoxes = "";
        if (snapshot.val().remaingNoOfBoxes == null) {
          unsoldBoxes = snapshot.val().noOfBoxes;
        } else {
          unsoldBoxes = snapshot.val().remaingNoOfBoxes;
        }

        currentVal.lotsList.push({
          Id: iteration,
          Lot: "Lot " + iteration,
          totalNoofBoxes: snapshot.val().noOfBoxes,
          remaininglNoofBoxes: unsoldBoxes,
          boxesSelected: null,
          selectAllBoxes: false,
          serviceRequestId: snapshot.val().serviceRequestId,
          status: status
        });
      });
    },
    updateSoldOutStatus: function(id) {
      var serviceRequestRef = firebase.database().ref("serviceRequest");
      serviceRequestRef
        .orderByChild("serviceRequestId")
        .equalTo(id)
        .on("child_added", function(data) {
          var ref = firebase.database().ref("serviceRequest/" + data.key);
          ref
            .update({ status: "Sold Out" })
            .then(function() {})
            .catch(function(error) {
              console.log(error.message);
            });
        });
    },
    generateInvoice: function(item) {
      this.selectedRow = null;
      this.selectedRow = item;
      Router.push("payment/" + this.selectedRow.Id);
    },
    confirmPayment: function(item) {
      this.selectedRow = null;
      this.selectedRow = item;
      Vue.$toast.open({
        message: "Payment confirmed.",
        type: "success",
        position: "top"
      });
    },
    saveSoldLot: function() {},
    sendInfo(item) {
      this.selectedRow = null;
      this.errorMessage = "";
      this.collector = null;
      this.collectionpoint = null;
      this.dropoffatpackhouse = null;
      this.date = null;
      this.selectedRow = item;
      this.$refs["invoice-modal"].show();
    },
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(function() {
          localStorage.emailId = "";
          localStorage.userName = "";
          Router.push("/");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    stageSelection: function(label) {
      this.selectedStage = label;
    },
    hideMaintainModal: function() {
      this.$refs["maintain-batch"].hide();
      this.selectedStage = "Arrival & Destination";
    },
    hideGIModal: function() {
      this.$refs["generate-invoice"].hide();
    },
    SaveGI: function() {
      let currentValue = this;
      var inpData = null;
      var ref = firebase
        .database()
        .ref("batch")
        .child(this.selectedRow.Id)
        .child("invoice");
      inpData = {
        invoiceNo: currentValue.arrivalTimestamp,
        destination: currentValue.destination
      };

      ref
        .set(inpData)
        .then(function() {
          Vue.$toast.open({
            message: "Arrival and destination details saved successfully.",
            type: "success",
            position: "top"
          });
        })
        .catch(function(error) {
          currentValue.erroMessage = error.message;
          currentValue.seen = false;
        });
    },
    SaveMaintain: function() {
      let currentValue = this;
      var inpData = null;

      var ref = firebase
        .database()
        .ref("batch")
        .child(this.selectedRow.Id)
        .child("maintain");
      if (this.selectedStage == "Arrival & Destination") {
        if (
          typeof currentValue.arrivalTimestamp != "undefined" &&
          currentValue.arrivalTimestamp &&
          typeof currentValue.destination != "undefined" &&
          currentValue.destination
        ) {
          inpData = {
            arrivalTimestamp: currentValue.arrivalTimestamp,
            destination: currentValue.destination
          };

          ref
            .update(inpData)
            .then(function() {
              currentValue.getData();
              Vue.$toast.open({
                message: "Arrival and destination details saved successfully.",
                type: "success",
                position: "top"
              });

              // axios
              //   .post(
              //     "${getConfigVars().BASE_URL}/api/v1/corda/chain/shipping/accept",
              //     {
              //       batchId: currentValue.selectedRow.Id,
              //       data: {
              //         received_on: currentValue.arrivalTimestamp.replace(
              //           /\//g,
              //           "-"
              //         )
              //       }
              //     }
              //   )
              //   .then(function(response) {
              //     console.log("broker screen API success");
              //     console.log(response);
              //   })
              //   .catch(function(error) {
              //     console.log(error.message);
              //     console.log("broker screen API error");
              //     currentValue.seen = false;
              //     currentValue.erroMessage = error.message;
              //   });
            })
            .catch(function(error) {
              currentValue.erroMessage = error.message;
              currentValue.seen = false;
            });
        } else {
          Vue.$toast.open({
            message: "Please fill all the fields.",
            type: "error",
            position: "top"
          });
        }
      }
      if (this.selectedStage == "Documents") {
        currentValue.seen = true;
        if (
          currentValue.importPermit &&
          currentValue.document &&
          currentValue.temperatureReadings
        ) {
          if (currentValue.importPermit) {
            currentValue.uploadImage(
              currentValue.importPermit,
              currentValue.selectedStage,
              currentValue.selectedRow.Id,
              inpData,
              currentValue,
              "importPermit"
            );
          }

          if (currentValue.document) {
            currentValue.uploadImage(
              currentValue.document,
              currentValue.selectedStage,
              currentValue.selectedRow.Id,
              inpData,
              currentValue,
              "document"
            );
          }

          if (currentValue.temperatureReadings) {
            currentValue.uploadImage(
              currentValue.temperatureReadings,
              currentValue.selectedStage,
              currentValue.selectedRow.Id,
              inpData,
              currentValue,
              "temperaturereading"
            );
          }
        } else {
          currentValue.seen = false;
          Vue.$toast.open({
            message: "Please upload all documents.",
            type: "error",
            position: "top"
          });
        }
      }
      if (this.selectedStage == "Quality Inspection") {
        if (
          typeof currentValue.fruitsRejected != "undefined" &&
          currentValue.fruitsRejected &&
          typeof currentValue.additionalComments != "undefined" &&
          currentValue.additionalComments &&
          currentValue.imageUpload
        ) {
          currentValue.seen = true;
          currentValue.qualityInspectionFileLength = null;
          inpData = {
            fruitsRejected: currentValue.fruitsRejected,
            additionalComments: currentValue.additionalComments
          };
          ref
            .update(inpData)
            .then(function() {
              if (currentValue.imageUpload) {
                currentValue.qualityInspectionFileLength =
                  currentValue.imageUpload.length;
                currentValue.uploadImage(
                  currentValue.imageUpload,
                  currentValue.selectedStage,
                  currentValue.selectedRow.Id,
                  inpData,
                  currentValue,
                  "qualityInsPection"
                );
              } else {
                currentValue.seen = false;
                currentValue.getData();
                Vue.$toast.open({
                  message: "Quality Inspection details saved successfully.",
                  type: "success",
                  position: "top"
                });
              }
            })
            .catch(function(error) {
              Vue.$toast.open({
                message: error.message,
                type: "error",
                position: "top"
              });
              currentValue.seen = false;
            });
        } else {
          Vue.$toast.open({
            message: "Please fill all the fields.",
            type: "error",
            position: "top"
          });
        }
      }
      if (this.selectedStage == "Cold Storage") {
        if (
          typeof currentValue.temperature != "undefined" &&
          currentValue.temperature &&
          typeof currentValue.phLevel != "undefined" &&
          currentValue.phLevel &&
          typeof currentValue.ethyleneLevel != "undefined" &&
          currentValue.ethyleneLevel &&
          typeof currentValue.co2Level != "undefined" &&
          currentValue.co2Level &&
          typeof currentValue.coldStorageInTimestamp != "undefined" &&
          currentValue.coldStorageInTimestamp
        ) {
          if (
            currentValue.selectedRow.product.split(" ")[0] == "Avocado" &&
            (currentValue.temperature > 8 || currentValue.temperature < 5)
          ) {
            Vue.$toast.open({
              message:
                "Warning: Temperature entered is outside the defined critical limits.",
              type: "warning",
              position: "bottom",
              duration: 8000
            });
          } else if (
            currentValue.selectedRow.product.split(" ")[0] == "Mango" &&
            (currentValue.temperature > 15 || currentValue.temperature < 12)
          ) {
            Vue.$toast.open({
              message:
                "Warning: Temperature entered is outside the defined critical limits.",
              type: "warning",
              position: "bottom",
              duration: 8000
            });
          } else if (
            currentValue.selectedRow.product.split(" ")[0] == "Pineapple" &&
            (currentValue.temperature > 12 || currentValue.temperature < 7)
          ) {
            Vue.$toast.open({
              message:
                "Warning: Temperature entered is outside the defined critical limits.",
              type: "warning",
              position: "bottom",
              duration: 8000
            });
          }

          inpData = {
            temperature: currentValue.temperature,
            phLevel: currentValue.phLevel,
            ethyleneLevel: currentValue.ethyleneLevel,
            co2Level: currentValue.co2Level,
            coldStorageInTimestamp: currentValue.coldStorageInTimestamp
          };

          ref
            .update(inpData)
            .then(function() {
              currentValue.getData();
              Vue.$toast.open({
                message: "Cold Storage details saved successfully.",
                type: "success",
                position: "top"
              });
            })
            .catch(function(error) {
              currentValue.erroMessage = error.message;
              currentValue.seen = false;
            });
        } else {
          Vue.$toast.open({
            message: "Please fill all the fields.",
            type: "error",
            position: "top"
          });
        }
      }
      if (this.selectedStage == "Cost of Maturation") {
        if (
          typeof currentValue.costOfMaturation != "undefined" &&
          currentValue.costOfMaturation
        ) {
          inpData = {
            costOfMaturation: currentValue.costOfMaturation
          };

          ref
            .update(inpData)
            .then(function() {
              currentValue.getData();
              Vue.$toast.open({
                message: "Cost of Maturation details saved successfully.",
                type: "success",
                position: "top"
              });
            })
            .catch(function(error) {
              currentValue.erroMessage = error.message;
              currentValue.seen = false;
            });
        } else {
          Vue.$toast.open({
            message: "Please fill all the fields.",
            type: "error",
            position: "top"
          });
        }
      }
    },
    sellStageSelection: function(lot) {
      if (lot.remaininglNoofBoxes == 0) {
        this.nextShowFlag = false;
      } else {
        this.nextShowFlag = true;
      }
      this.sellSelectedStage = lot.Lot;
      this.beforeLotSelection = false;
      this.totalNumberOfBoxes = 0;
    },
    hideSellModal: function() {
      this.sellSelectedStage = null;
      this.nextShowFlag = true;
      this.beforeLotSelection = true;
      this.$refs["sell-modal"].hide();
    },
    hideViewBatchModal: function() {
      this.$refs["view-batch"].hide();
    },
    SelectAll: function(lot) {
      if (lot.selectAllBoxes == true) {
        for (var i = 0; i < this.lotsList.length; i++) {
          if (lot.Id == this.lotsList[i].Id) {
            this.lotsList[i].boxesSelected = this.lotsList[
              i
            ].remaininglNoofBoxes;
          }
        }
      } else {
        for (var j = 0; j < this.lotsList.length; j++) {
          if (lot.Id == this.lotsList[j].Id) {
            this.lotsList[j].boxesSelected = "";
          }
        }
      }
    },
    printDownloadUrl: function(url, fileName, documentType) {
      var currentVal = this;
      var inpData = null;
      var ref = null;
      switch (currentVal.selectedStage) {
        case "Documents":
          {
            if (documentType == "importPermit") {
              inpData = {
                importPermitFilePath: url,
                importPermitFileName: fileName
              };
              ref = firebase
                .database()
                .ref("batch")
                .child(currentVal.selectedRow.Id)
                .child("maintain")
                .child("documents");

              ref
                .push(inpData)
                .then(function() {
                  currentVal.updateMaintainData();
                })
                .catch(function(error) {
                  Vue.$toast.open({
                    message: error.message,
                    type: "error",
                    position: "top"
                  });
                  currentVal.seen = false;
                });
            } else if (documentType == "document") {
              inpData = {
                documentFilePath: url,
                documentFileName: fileName
              };
              ref = firebase
                .database()
                .ref("batch")
                .child(currentVal.selectedRow.Id)
                .child("maintain")
                .child("documents");

              ref
                .push(inpData)
                .then(function() {
                  currentVal.updateMaintainData();
                })
                .catch(function(error) {
                  Vue.$toast.open({
                    message: error.message,
                    type: "error",
                    position: "top"
                  });
                  currentVal.seen = false;
                });
            } else if (documentType == "temperaturereading") {
              inpData = {
                temperatureReadingsFilePath: url,
                temperatureReadingsFileName: fileName
              };
              ref = firebase
                .database()
                .ref("batch")
                .child(currentVal.selectedRow.Id)
                .child("maintain")
                .child("documents");

              ref
                .push(inpData)
                .then(function() {
                  currentVal.seen = false;
                  currentVal.updateMaintainData();
                  currentVal.getData();
                  Vue.$toast.open({
                    message: "Documents uploaded successfully.",
                    type: "success",
                    position: "top"
                  });
                })
                .catch(function(error) {
                  Vue.$toast.open({
                    message: error.message,
                    type: "error",
                    position: "top"
                  });
                  currentVal.seen = false;
                });
            }
          }
          break;
        case "Quality Inspection":
          {
            ref = firebase
              .database()
              .ref("batch")
              .child(this.selectedRow.Id)
              .child("maintain")
              .child("qualityInspectionFiles");
            inpData = {
              qualityInspectionImagePath: url,
              qualityInspectionImageName: fileName
            };

            ref
              .push(inpData)
              .then(function() {
                currentVal.qualityInspectionFileLength =
                  currentVal.qualityInspectionFileLength - 1;
                if (currentVal.qualityInspectionFileLength == 0) {
                  currentVal.seen = false;
                  currentVal.updateMaintainData();
                  currentVal.getData();
                  Vue.$toast.open({
                    message: "Quality Inspection details saved successfully.",
                    type: "success",
                    position: "top"
                  });
                }
              })
              .catch(function(error) {
                Vue.$toast.open({
                  message: error.message,
                  type: "error",
                  position: "top"
                });
                currentVal.seen = false;
              });
          }
          break;
        default:
          console.log("no case matched");
          break;
      }
    },
    uploadImage: function(
      files,
      selectedStage,
      id,
      inputData,
      vm,
      documentType
    ) {
      uploadFiles(
        files,
        selectedStage,
        id,
        inputData,
        vm,
        documentType,
        this.printDownloadUrl
      );
    },
    detailsStageSelection: function(label) {
      this.detailsSelectedStage = label;
      if (label == "Ship Order") {
        if (this.sellBuyerAddress != null) {
          this.buyersLocation = this.sellBuyerAddress;
        }
      }
    },
    updateUnsuccessStatus: function() {
      let currentValue = this;
      var dbRef = firebase
        .database()
        .ref("batch/" + currentValue.selectedRow.Id + "/lots");
      dbRef.on("child_added", function(snapshot) {
        var serviceRequestRef = firebase.database().ref("serviceRequest");
        serviceRequestRef
          .orderByChild("serviceRequestId")
          .equalTo(snapshot.key)
          .on("child_added", function(data) {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            ref
              .update({ status: "Unsuccessful" })
              .then(function() {})
              .catch(function(error) {
                alert(error.message);
              });
          });
      });
    },
    showDashboard: function() {
      Router.push("tpa-dashboard");
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else {
        Router.push("tpa-dashboard");
      }
    }
  }
};
</script>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
@import "../../assets/css/main.css";

.tbl-view-broker-batches tbody tr td:nth-child(3),
.tbl-view-broker-batches thead tr th:nth-child(3) {
  text-align: right !important;
}
.btn-invoice {
  color: #fff !important;
  border-bottom: 1px solid #fff;
  cursor: pointer;
}
.lbl-modal-success {
  color: #fff;
}
.dropdownlist_options {
  background: transparent !important;
  color: #fff;
  padding: 0 !important;
}
.button-container {
  float: right;
}
.btn-save {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 13px;
  width: 115px;
  height: 26px;
  margin: 5px;
  float: right;
  color: #fff;
}
.btn-cancel {
  background: #1e2318;
  border-radius: 0px;
  border: 1px solid #000;
  font-size: 13px;
  color: #fff;
  width: 115px;
  height: 26px;
  margin: 5px;
}
.lbl-errormessage {
  color: red;
}
ul {
  padding: 0 !important;
}
.e-dropdownbase .e-list-item {
  color: #fff;
  list-style-type: none;
  padding-left: 20px;
}
#dropdownlist_popup {
  color: #fff;
}
#dropdownlist_popup > .e-content {
  color: #fff;
}
.e-input-group:focus {
  outline: none !important;
}
.e-input-group .e-input-group-icon,
.e-input-group.e-control-wrapper .e-input-group-icon {
  color: #fff !important;
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
.e-input-group:not(.e-disabled):not(.e-float-icon-left)::before,
.e-input-group:not(.e-disabled):not(.e-float-icon-left)::after,
.e-input-group.e-float-icon-left:not(.e-disabled) .e-input-in-wrap::before,
.e-input-group.e-float-icon-left:not(.e-disabled) .e-input-in-wrap::after,
.e-input-group.e-control-wrapper:not(.e-disabled):not(.e-float-icon-left)::before,
.e-input-group.e-control-wrapper:not(.e-disabled):not(.e-float-icon-left)::after,
.e-input-group.e-control-wrapper.e-float-icon-left:not(.e-disabled)
  .e-input-in-wrap::before,
.e-input-group.e-control-wrapper.e-float-icon-left:not(.e-disabled)
  .e-input-in-wrap::after {
  background: transparent !important;
}
.modal-title {
  margin: 0 auto !important;
  color: #fff !important;
}
.datepicker {
  width: 100% !important;
  background: transparent !important;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  margin-bottom: 20px !important;
  border-radius: 0 !important;
  outline: 0 !important;
  height: 36px;
}
.datepicker:focus {
  box-shadow: none !important;
}
.datepicker {
  background-image: url("../../assets/images/calendar_view2.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  width: 100% !important;
  color: #fff !important;
  font-size: 13px;
}
::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  color: #fff !important;
  font-size: 13px;
}
::-moz-placeholder {
  /* Firefox 19+ */
  color: #fff !important;
  font-size: 13px;
}
:-ms-input-placeholder {
  /* IE 10+ */
  color: #fff !important;
  font-size: 13px;
}
:-moz-placeholder {
  /* Firefox 18- */
  font-size: 13px;

  color: #fff !important;
}
.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 13px;
}
.btn-primary,
.btn-secondary {
  width: 120px;
}

thead tr th {
  font-weight: 400;
}
tbody tr td {
  font-weight: 400;
}
.modal-body {
  padding: 30px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.modal-header h5 {
  font-size: 1.75rem;
  font-weight: 400;
}
.modal {
  display: table !important;
}
.modal.show .modal-dialog {
  display: table-cell;
  vertical-align: middle;
}
.modal-content {
  width: 500px;
  margin: 0px auto !important;
}
.modal-header {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.modal-scroll {
  height: 355px;
}
.view-tbl-services {
  padding: 0px !important;
  background: none !important;
}
.modal-header .close {
  color: #fff !important;
  font-size: 2.5rem !important;
  margin: 0 !important;
  padding: 0 !important;
}
.custom-file-label {
  background: transparent;
  border: none;
  border-radius: 0px;
  color: #fff;
  padding: 0;
  font-size: 13px;
}
.custom-file-input:lang(en) ~ .custom-file-label::after {
  content: "Attach";
  background: #585a4d;
  border: 1px solid #000;
  padding: 4px 12px 4px 12px;
  color: #fff;
  margin-top: 6px;
}
.custom-file-input:focus ~ .custom-file-label {
  border: none;
  box-shadow: none;
}
#maintain-batch-modal .modal-content {
  min-width: 768px;
  max-width: 1000px;
  margin: 0px auto !important;
}
.maintain-modal-scroll {
  height: 100%;
}
.sell-modal-scroll {
  height: 100%;
}
.tbl-view-broker-batches th:nth-child(4),
.tbl-view-broker-batches th:nth-child(5),
.tbl-view-broker-batches th:nth-child(6),
.tbl-view-broker-batches th:nth-child(7),
.tbl-view-broker-batches td:nth-child(4),
.tbl-view-broker-batches td:nth-child(5),
.tbl-view-broker-batches td:nth-child(6),
.tbl-view-broker-batches td:nth-child(7) {
  text-align: center !important;
}
#sell-modal .modal-content {
  min-width: 768px;
  max-width: 1000px;
}
.sell-modal-scroll {
  height: 100%;
}
.sales-currency-container .e-input-group,
.e-input-group.e-control-wrapper {
  margin-bottom: 20px;
}
.tbl-exceeded .table-striped tbody tr td:nth-child(3),
.tbl-exceeded .table-striped thead tr th:nth-child(3),
.tbl-exceeded .table-striped tbody tr td:nth-child(2),
.tbl-exceeded .table-striped thead tr th:nth-child(2) {
  text-align: right !important;
}
.view-broker-batches-v-select .vs__dropdown-toggle {
  border: none;
  border-bottom: 1px solid #fff;
  border-radius: 0px;
  margin: 15px 0px 0px 0px !important;
}
.view-broker-batches-v-select {
  font-size: 13px;
}
.view-broker-batches-v-select span,
.view-broker-batches-v-select input,
.view-broker-batches-v-select .vs__no-options {
  color: #fff;
}
.view-broker-batches-v-select span {
  margin-left: 0px;
  padding-left: 0px;
}
.view-broker-batches-v-select .vs__dropdown-menu {
  background: none;
  padding: 0px;
  max-height: 155px;
}
.view-broker-batches-v-select .vs__dropdown-option {
  color: #fff;
  padding: 10px;
  background: #1e2318;
}
.view-broker-batches-v-select .vs__dropdown-option--highlight {
  background: #000;
}
.view-broker-batches-v-select .vs__open-indicator,
.view-broker-batches-v-select .vs__clear {
  fill: #fff;
}
.view-broker-batches-v-select .vs__selected-options,
.view-broker-batches-v-select .vs__search,
.vs__search:focus {
  padding: 0px;
  margin: 0px;
}
.view-broker-batches-v-select .vs__dropdown-toggle {
  padding: 0px;
  padding-bottom: 2px;
  margin: 15px 0px;
}
.view-broker-batches-v-select .vs__selected {
  margin: 0px;
  padding: 0px;
}
.view-broker-batches-v-select .vs__clear {
  margin-top: -10px;
}
.view-broker-batches-v-select .vs__open-indicator {
  margin-top: -5px;
}
.tbl-sell-list thead tr th,
.tbl-sell-list tbody tr td {
  text-align: left !important;
}
.tbl-sell-list thead tr th:nth-child(4),
.tbl-sell-list tbody tr td:nth-child(4) {
  text-align: center !important;
}
.tbl-sell-list .VueTables__no-results td {
  text-align: center !important;
}
.tbl-view-broker-batches thead tr th {
  font-weight: bold;
}
.tbl-sell-list thead tr th:nth-child(3),
.tbl-sell-list tbody tr td:nth-child(3) {
  text-align: right !important;
}
.view-tbl-services thead tr th:nth-child(2),
.view-tbl-services tbody tr td:nth-child(2) {
  text-align: right !important;
  padding-right: 40px !important;
}
.view-tbl-services thead tr th:nth-child(1),
.view-tbl-services tbody tr td:nth-child(1) {
  padding-left: 40px !important;
}
.view-tbl-services thead tr th {
  font-weight: bold;
}
</style>
<style scoped>
.inter-head {
  color: #fff;
  font-size: 39px;
  margin-top: 14px;
  float: left;
  margin-left: 14px;
  position: absolute;
}
.collector {
  background-image: url("../../assets/images/collector.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  position: absolute !important;
  width: 100% !important;
  color: #fff !important;
}
.collectionpoint {
  background-image: url("../../assets/images/collection_point.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  position: absolute !important;
  width: 100% !important;
  color: #fff !important;
}
.dropoff {
  background-image: url("../../assets/images/packhouse.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  position: absolute !important;
  width: 100% !important;
  color: #fff !important;
}

.dropdownlist {
  width: 95%;
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
.inp-container {
  margin-bottom: 15px;
}
.e-input-group .e-control-wrapper .e-ddl .e-lib .e-keyboard {
  width: 100%;
}
.input-container {
  width: 68%;
  float: left;
  margin: 10px;
  text-align: left;
}
.location-text {
  float: left;
  min-width: 135px;
  display: none;
}
.service-img-container,
.product-container {
  cursor: pointer;
}
.img-previous {
  width: 59px !important;
  margin: 5px 0px 3px 0px !important;
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
.heading {
  color: #fff;
  text-align: center;
  margin: auto;
  font-weight: 400;
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
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px 5px 0px 0px;
  border: 1px solid #000;
}
.main-container {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0px 0px 5px 5px;
  border: 1px solid #000;
  border-top-color: rgba(0, 0, 0, 0.4);
}

.content-container {
  height: fit-content;
  margin: auto;
  margin-top: -30px;
}

.VueTables__heading {
  color: #fff !important;
}
.column-content {
  color: #fff !important;
}
/* table design */
.btn-edit {
  cursor: pointer;
  color: blue !important;
}
.VuePagination {
  text-align: center;
}

.vue-title {
  text-align: center;
  margin-bottom: 10px;
}

.vue-pagination-ad {
  text-align: center;
}

.glyphicon.glyphicon-eye-open {
  width: 16px;
  display: block;
  margin: 0 auto;
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
  background: rgba(0, 0, 0, 0.3);
}
.tbl-services table {
  color: #fff !important;
}
.table {
  color: #fff !important;
}
td {
  color: #fff !important;
}
.location-payment {
  width: auto;
  height: 20px;
  cursor: pointer;
}
.location-img {
  width: 20px;
  height: auto;
  cursor: pointer;
}
.control-section {
  padding: 30px;
}
td,
th {
  padding: 5px;
}
ul {
  list-style-type: none;
}
ul li {
  float: left;
  padding: 12px 15px 10px 15px;
}
.sub-header-close-img {
  width: 16px;
  height: auto;
}
.sub-header-imgs {
  width: 22px;
  height: auto;
  cursor: pointer;
}
.icon-container {
  float: right;
  position: relative;
  top: -35px;
}
.manage-img {
  width: 75px !important;
  margin: 5px 0px 3px 0px !important;
}

.new-request-container {
  cursor: pointer;
}

.username-conatiner {
  float: right;
  margin: 20px;
}
.no-padding {
  margin: 0px !important;
  padding: 0px !important;
}
.service-img-container {
  width: 46%;
  float: left;
  margin: 10px;
}
.content-container {
  height: fit-content;
  margin: auto;
  margin-top: 40px;
  margin-bottom: 40px;
}

.plan-img {
  width: 20px;
  margin-left: 5px;
}
.ref-logout-lsp {
  font-size: 13px;
  margin-top: -5px;
  text-transform: none !important;
}
.lbl-username-lsp {
  text-transform: none !important;
}
.input-label {
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  width: 100%;
  padding: 0px;
  background: transparent;
  border: none;
  cursor: pointer;
  margin-bottom: 0px !important;
}
.text-input {
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  width: 100%;
  background: transparent;
  height: 36px;
  color: #fff;
  font-size: 12px !important;
  margin-bottom: 20px;
}
.attach-border {
  border-bottom: 1px solid #ffffff;
  position: absolute;
  width: 335px;
}
.maintain-batch-container {
  height: 250px;
  margin-bottom: 20px;
}
.maintain-batch-heading {
  height: 53px !important;
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
.input-readonly-label {
  padding: 10px !important;
}
.input-readonly-label:focus,
.active {
  color: #8a5d04 !important;
  text-decoration: underline;
  outline: none;
  box-shadow: 0px;
}
.attach-container {
  margin-bottom: 20px;
}
.sub-heading {
  color: #fff !important;
  text-align: center;
  margin: 20px 0px;
}
.sell-heading {
  height: 53px;
}
.sell-container {
  height: 300px;
  margin-bottom: 20px;
  padding: 10px;
}
.sell-container-right {
  padding: 25px;
}
.checkbox-container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 13px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: #fff;
  font-weight: 400;
}

/* Hide the browser's default checkbox */
.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: transparent;
  border: 1px solid #fff;
}

/* On mouse-over, add a grey background color */
.checkbox-container:hover input ~ .checkmark {
  background-color: transparent;
  border: 1px soild #fff;
}

/* When the checkbox is checked, add a blue background */
.checkbox-container input:checked ~ .checkmark {
  background-color: transparent;
  border: 1px solid #fff;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.checkbox-container .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0px 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
.empty-sell-container-right {
  color: #fff;
  text-align: center;
  font-size: 20px;
  width: 100%;
  margin-top: 20px;
}
.sell-sub-heading {
  margin-top: 0px;
}
.exceeded-h4 {
  color: #fff;
  text-align: center;
  margin: 15px;
}
.tbl-exceeded {
  margin: 0 auto;
}
.view-broker-batches-upload-wrap .uploaded-file-link {
  width: 100%;
  background: rgb(256, 256, 256, 0.1);
  color: #fff;
  margin: 10px 0px;
  float: none;
}
.view-broker-batches-upload-wrap .uploaded-file-link a {
  color: #fff;
}
.view-broker-batches-upload-wrap .upload-file-link-ul {
  padding: 0px 0px 0px 0px !important;
}
.view-broker-batches-upload-wrap .download-icon-upload {
  float: right;
}
.sales-cur-broker-wrap {
  min-height: 80px;
}
.ship-order-img {
  cursor: pointer;
  width: 14px;
}
.file-upload-with-label {
  margin-top: 10px;
}
@media screen and (max-width: 1063px) and (min-width: 768px) {
  .col-md-6 {
    max-width: 100% !important;
    width: 100% !important;
    flex: 100%;
  }
}
@media screen and (max-width: 531px) {
  .service-img-container {
    width: 100%;
    text-align: center;
  }
}
@media screen and (max-width: 360px) {
  .content-container {
    margin-top: 30px;
  }
}
.beta {
  font-size: 10px;
  color: #fff;
  float: left;
  margin-top: 60px;
  padding: 0px;
  position: absolute;
  top: 1px;
  left: 110px;
}
</style>
