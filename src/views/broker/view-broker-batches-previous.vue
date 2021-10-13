<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>

    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-10 content-container">
        <div class="header-container">
          <h3 class="heading">
            {{ $t("Unsuccessful Batches", "Unsuccessful Batches") }}
          </h3>
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
              class="tbl-services tbl-view-broker-batches-previous"
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
              <template slot="View" slot-scope="props">
                <div>
                  <a class="btn-icn" @click="viewBatch(props.row)">
                    <img
                      class="location-img"
                      src="../../assets/images/view_ready_batches.png"
                    />
                  </a>
                </div>
              </template>
              <template slot="Maintain" slot-scope="props">
                <div>
                  <a class="btn-icn" @click="maintainBatch(props.row)">
                    <img
                      class="location-img"
                      src="../../assets/images/maintain_batch.png"
                    />
                  </a>
                </div>
              </template>

              <!-- <template slot="Invoice & Payment" slot-scope="props">
                <div v-if="props.row.isSellPresent">
                  <a class="btn-icn" @click="generateInvoice(props.row)">
                    <img class="location-payment" src="../../assets/images/invoice_payments.png" />
                  </a>
                </div>
              </template>-->
            </v-client-table>
          </div>
        </div>
      </div>
      <Footer ref="footercomp"></Footer>
      <b-modal
        hide-footer
        id="hideViewBatchmodal"
        @hide="hideViewBatchModal"
        ref="view-batch"
        hide-backdrop
        :title="$t('View Batch Details', 'View Batch Details')"
      >
        <perfect-scrollbar class="modal-scroll">
          <div class="inp-container">
            <label class="input-label">{{ $t("Batch No", "Batch No") }}.</label>
            <input class="text-input" readonly type="text" v-model="batchNo" />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Product Type", "Product Type")
            }}</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="productType"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Departure Timestamp", "Departure Timestamp")
            }}</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="departureTimestamp"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Departure Temperature", "Departure Temperature")
            }}</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="departureTemperature"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Total Number Of Lots", "Total Number Of Lots")
            }}</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="lotsLength"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Total Number Of Boxes", "Total Number Of Boxes")
            }}</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="totalBoxCount"
            />
          </div>
          <v-client-table
            :data="lots"
            :columns="viewColumns"
            :options="viewOptions"
            class="tbl-services view-tbl-services"
          ></v-client-table>
          <h4 class="sub-heading">
            {{ $t("Proforma Invoice", "Proforma Invoice") }}
          </h4>
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Proforma No.", "Proforma No.") }}.</label
            >
            <input
              class="text-input"
              readonly
              type="text"
              v-model="proformaNo"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Full Name", "Full Name")
            }}</label>
            <input class="text-input" readonly type="text" v-model="fullName" />
          </div>
          <div class="inp-container">
            <label class="input-label">{{ $t("Email", "Email") }}</label>
            <input class="text-input" type="text" readonly v-model="email" />
          </div>
          <h4 class="sub-heading">{{ $t("Selling to", "Selling to") }}</h4>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Address Line 1", "Address Line 1")
            }}</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="sellingAddressLine1"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Address Line 2", "Address Line 2")
            }}</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="sellingAddressLine2"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Address Line 3", "Address Line 3")
            }}</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="sellingAddressLine3"
            />
          </div>
          <h4 class="sub-heading">{{ $t("Shipping", "Shipping") }}</h4>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Address Line 1", "Address Line 1")
            }}</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="shippingAddressLine1"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Address Line 2", "Address Line 2")
            }}</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="shippingAddressLine2"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Address Line 3", "Address Line 3")
            }}</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="shippingAddressLine3"
            />
          </div>
          <div class="inp-container unit-price-container">
            <label class="input-label">{{
              $t("Unit Price", "Unit Price")
            }}</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="unitPrice"
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
        :title="$t('Batch Details', 'Batch Details')"
      >
        <div class="row">
          <div class="col-md-4">
            <div class="header-container maintain-batch-heading">
              <h3 class="heading">
                {{ $t("Batch Details", "Batch Details") }}
              </h3>
            </div>
            <div class="main-container maintain-batch-container">
              <input
                class="input-label input-readonly-label"
                v-on:click="stageSelection('Arrival & Destination')"
                :value="$t('Arrival & Destination', 'Arrival & Destination')"
                v-bind:class="{
                  active: selectedStage == 'Arrival & Destination',
                }"
                readonly
              />
              <input
                class="input-label input-readonly-label"
                v-on:click="stageSelection('Documents')"
                :value="$t('Documents', 'Documents')"
                v-bind:class="{ active: selectedStage == 'Documents' }"
                readonly
              />
              <input
                class="input-label input-readonly-label"
                v-on:click="stageSelection('Quality Inspection')"
                v-bind:class="{ active: selectedStage == 'Quality Inspection' }"
                :value="$t('Quality Inspection', 'Quality Inspection')"
                readonly
              />
              <input
                class="input-label input-readonly-label"
                v-on:click="stageSelection('Cold Storage')"
                v-bind:class="{ active: selectedStage == 'Cold Storage' }"
                :value="$t('Cold Storage', 'Cold Storage')"
                readonly
              />
              <input
                class="input-label input-readonly-label"
                v-on:click="stageSelection('Cost of Maturation')"
                v-bind:class="{ active: selectedStage == 'Cost of Maturation' }"
                :value="$t('Cost of Ripening', 'Cost of Ripening')"
                readonly
              />
            </div>
          </div>
          <div class="col-md-8">
            <div class="header-container maintain-batch-heading">
              <h3 class="heading">{{ $t(selectedStage, selectedStage) }}</h3>
            </div>
            <div class="main-container maintain-batch-container">
              <perfect-scrollbar class="maintain-modal-scroll">
                <div
                  class="input-wrap larvae-input-wrap"
                  v-if="selectedStage == 'Arrival & Destination'"
                >
                  <input
                    class="text-input"
                    type="text"
                    readonly
                    :placeholder="$t('Arrival Timestamp', 'Arrival Timestamp')"
                    v-model="arrivalTimestamp"
                  />
                  <input
                    class="text-input"
                    type="text"
                    :placeholder="$t('Destination', 'Destination')"
                    v-model="destination"
                  />
                </div>
                <div class="input-wrap" v-if="selectedStage == 'Documents'">
                  <div class="inp-container attach-container">
                    <b-form-file
                      v-model="importPermit"
                      :placeholder="
                        $t('No Attachments yet', 'No Attachments yet')
                      "
                      drop-placeholder="Drop file here..."
                    ></b-form-file>
                    <div class="attach-border"></div>
                  </div>
                  <div class="inp-container attach-container">
                    <b-form-file
                      v-model="document"
                      :placeholder="
                        $t('No Attachments yet', 'No Attachments yet')
                      "
                      drop-placeholder="Drop file here..."
                    ></b-form-file>
                    <div class="attach-border"></div>
                  </div>
                  <div class="inp-container attach-container">
                    <b-form-file
                      v-model="temperatureReadings"
                      :placeholder="
                        $t('No Attachments yet', 'No Attachments yet')
                      "
                      drop-placeholder="Drop file here..."
                    ></b-form-file>
                    <div class="attach-border"></div>
                  </div>
                </div>
                <div
                  class="input-wrap"
                  v-if="selectedStage == 'Quality Inspection'"
                >
                  <input
                    v-model="fruitsRejected"
                    class="text-input quality-inspection"
                    type="text"
                    :placeholder="$t('Fruits Rejected', 'Fruits Rejected')"
                  />
                  <input
                    type="text"
                    class="text-input input-half-size text-input-last-child"
                    v-model="additionalComments"
                    :placeholder="
                      $t('Additional Comments', 'Additional Comments')
                    "
                  />
                  <div class="inp-container">
                    <b-form-file
                      multiple
                      v-model="imageUpload"
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
                    <!-- working -->
                    <div v-if="qualityFile">
                      <ul class="upload-file-link-ul">
                        <li
                          class="uploaded-file-link"
                          v-bind:key="file"
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
                  <input
                    v-model="temperature"
                    class="text-input fruit-washing-input"
                    type="text"
                    :placeholder="$t('Temperature', 'Temperature')"
                  />
                  <input
                    type="text"
                    class="text-input fruit-washing-input"
                    v-model="phLevel"
                    :placeholder="$t('Ph Level', 'Ph Level')"
                  />
                  <input
                    type="text"
                    class="text-input fruit-washing-input text-input-last-child"
                    v-model="ethyleneLevel"
                    :placeholder="$t('Ethylene Level', 'Ethylene Level')"
                  />
                  <input
                    type="text"
                    class="text-input fruit-washing-input text-input-last-child"
                    v-model="co2Level"
                    :placeholder="$t('CO2 Level', 'CO2 Level')"
                  />
                  <input
                    type="text"
                    class="text-input fruit-washing-input text-input-last-child"
                    v-model="coldStorageInTimestamp"
                    :placeholder="
                      $t(
                        'Cold Storage In Timestamp',
                        'Cold Storage In Timestamp'
                      )
                    "
                  />
                </div>
                <div
                  class="input-wrap"
                  v-if="selectedStage == 'Cost of Maturation'"
                >
                  <input
                    v-model="costOfMaturation"
                    class="text-input"
                    type="text"
                    :placeholder="$t('Cost of Ripening', 'Cost of Ripening')"
                  />
                </div>
              </perfect-scrollbar>
            </div>
          </div>
        </div>
      </b-modal>
      <b-modal
        hide-footer
        id="generate-invoice-modal"
        class
        ref="generate-invoice"
        hide-backdrop
        :title="$t('Invoice Details', 'Invoice Details')"
      >
        <perfect-scrollbar class="modal-scroll">
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Invoice No", "Invoice No") }}.</label
            >
            <input
              class="text-input"
              type="text"
              readonly
              v-model="invoiceNo"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Billing Date", "Billing Date")
            }}</label>
            <input class="text-input" type="text" v-model="billingDate" />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Broker Name", "Broker Name")
            }}</label>
            <input class="text-input" type="text" v-model="brokerName" />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Broker Organization", "Broker Organization")
            }}</label>
            <input
              class="text-input"
              type="text"
              v-model="brokerOrganization"
            />
          </div>
          <h4 class="sub-heading">
            {{ $t("Buyer Details", "Buyer Details") }}
          </h4>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Buyer Name", "Buyer Name")
            }}</label>
            <input class="text-input" type="text" v-model="buyerName" />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Buyer Organization", "Buyer Organization")
            }}</label>
            <input class="text-input" type="text" v-model="buyerOrganization" />
          </div>
          <div class="inp-container">
            <label class="input-label">{{ $t("Product", "Product") }}</label>
            <input class="text-input" type="text" v-model="product" />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Nr of Boxes Purchased", "Nr of Boxes Purchased")
            }}</label>
            <input
              class="text-input"
              type="text"
              v-model="noofBoxesPurchased"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Price Per Kg", "Price Per Kg")
            }}</label>
            <input class="text-input" type="text" v-model="pricePerKg" />
          </div>
        </perfect-scrollbar>
      </b-modal>

      <b-modal
        ref="success-modal"
        hide-footer
        hide-header
        :title="$t('Status', 'Status')"
        id="modalnewviewbrokerprevioussuccess"
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
import firebase, { functions } from "firebase";
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
import { uuid } from "vue-uuid";
import uploadFiles from "../../shared/uploa-files";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";

Vue.use(VueToast);

Vue.use(Datetime);

Vue.use(BootstrapVue);

Vue.use(ClientTable);

import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from "../../shared/auth";
Vue.use(DropDownListPlugin);

export default {
  components: {
    PerfectScrollbar,
    Header,
    Footer,
  },
  name: "active-service-requests",
  data: function () {
    return {
      serviceRequests: [],
      columns: [
        "Batch Id",
        "organizationName",
        "batchCreatedOn",
        "No Of Lots",
        "View",
        "Maintain",
      ],
      exceededColumns: ["Lot", "totalNoofBoxes", "remaininglNoofBoxes"],
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
        orderBy: {
          ascending: false,
          column: "batchCreatedOn",
        },
        headings: {
          "Batch Id": `${this.$t("Batch Id", "Batch Id")}`,
          organizationName: `${this.$t(
            "Organization Name",
            "Organization Name"
          )}`,
          batchCreatedOn: `${this.$t("Batch Created On", "Batch Created On")}`,
          "No Of Lots": `${this.$t("No Of Lots", "No Of Lots")}`,
          View: `${this.$t("View", "View")}`,
          Maintain: `${this.$t("Maintain", "Maintain")}`,
        },
        customSorting: {
          batchCreatedOn: function (ascending) {
            return function (a, b) {
              let dateA = new Date(a.batchCreatedOn);
              let dateB = new Date(b.batchCreatedOn);

              if (ascending) return dateA >= dateB ? 1 : -1;

              return dateA <= dateB ? 1 : -1;
            };
          },
        },
      },
      viewOptions: {
        perPage: 10,
        filterable: false,
        headings: {
          LotNo: `${this.$t("Lot No", "Lot No")}`,
          NoofBoxes: `${this.$t("No of Boxes", "No of Boxes")}`,
        },
        sortable: [],
      },
      exceededOptions: {
        perPage: 10,
        headings: {
          totalNoofBoxes: "Total No. of Boxes",
          remaininglNoofBoxes: "Unsold No. of Boxes",
        },
        filterable: false,
        sortable: [],
      },
      arrivalTimestamp: moment.utc().local().format("MMM DD, YYYY hh:mm A"),
      arrivalTimestamp: null,
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
      saleTransactionDate: moment.utc().local().format("MMM DD, YYYY hh:mm A"),
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
      lotsLength: 0,
      totalBoxCount: 0,
    };
  },
  mounted() {
    if (localStorage.systemRole.includes(99)) {
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
            text: this.$t("Broker-Dashboard", "Broker-Dashboard"),
            href: "/broker-dashboard",
          },
          {
            text: this.$t("Unsuccessful Batches", "Unsuccessful Batches"),
            href: "/view-broker-batches-previous",
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
            text: this.$t("Broker-Dashboard", "Broker-Dashboard"),
            href: "/broker-dashboard",
          },
          {
            text: this.$t("Unsuccessful Batches", "Unsuccessful Batches"),
            href: "/view-broker-batches-previous",
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
          text: this.$t("Broker-Dashboard", "Broker-Dashboard"),
          href: "/broker-dashboard",
        },
        {
          text: this.$t("Unsuccessful Batches", "Unsuccessful Batches"),
          href: "/view-broker-batches-previous",
        },
      ]);
    } else if (localStorage.systemRole == 7) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("OP-Admin-Dashboard", "OP-Admin-Dashboard"),
          href: "/op-admin-dashboard",
        },
        {
          text: this.$t("Broker-Dashboard", "Broker-Dashboard"),
          href: "/broker-dashboard",
        },
        {
          text: this.$t("Unsuccessful Batches", "Unsuccessful Batches"),
          href: "/view-broker-batches-previous",
        },
      ]);
    } else if (localStorage.systemRole == 97) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Broker SPOC-Dashboard", "Broker SPOC-Dashboard"),
          href: "/broker-dashboard",
        },
        {
          text: this.$t("Unsuccessful Batches", "Unsuccessful Batches"),
          href: "/view-broker-batches-previous",
        },
      ]);
    } else if (localStorage.systemRole == 4 || localStorage.systemRole == 5) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Broker-Dashboard", "Broker-Dashboard"),
          href: "/broker-dashboard",
        },
        {
          text: this.$t("Unsuccessful Batches", "Unsuccessful Batches"),
          href: "/view-broker-batches-previous",
        },
      ]);
    }
    this.options = {
      perPage: 10,
      sortable: ["Product", "batchCreatedOn"],
      orderBy: {
        ascending: false,
        column: "batchCreatedOn",
      },
      headings: {
        "Batch Id": `${this.$t("Batch Id", "Batch Id")}`,
        organizationName: `${this.$t(
          "Organization Name",
          "Organization Name"
        )}`,
        batchCreatedOn: `${this.$t("Batch Created On", "Batch Created On")}`,
        "No Of Lots": `${this.$t("No Of Lots", "No Of Lots")}`,
        View: `${this.$t("View", "View")}`,
        Maintain: `${this.$t("Maintain", "Maintain")}`,
      },
      customSorting: {
        batchCreatedOn: function (ascending) {
          return function (a, b) {
            let dateA = new Date(a.batchCreatedOn);
            let dateB = new Date(b.batchCreatedOn);

            if (ascending) return dateA >= dateB ? 1 : -1;

            return dateA <= dateB ? 1 : -1;
          };
        },
      },
    };

    this.viewOptions = {
      perPage: 10,
      filterable: false,
      headings: {
        LotNo: `${this.$t("Lot No", "Lot No")}`,
        NoofBoxes: `${this.$t("No of Boxes", "No of Boxes")}`,
      },
      sortable: [],
    };

    this.exceededOptions = {
      perPage: 10,
      headings: {
        totalNoofBoxes: "Total No. of Boxes",
        remaininglNoofBoxes: "Unsold No. of Boxes",
      },
      filterable: false,
      sortable: [],
    };
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.getData();

    this.userName = localStorage.userName;
  },

  methods: {
    getData: function () {
      let currentValue = this;
      currentValue.seen = true;
      currentValue.serviceRequests = [];
      var ref = firebase.database().ref().child("batch");
      if (localStorage.systemRole.includes(99)) {
        ref
          .orderByChild("status")
          .equalTo("Unsuccessful")
          .on("child_added", function (snapshot) {
            if (snapshot.val() != null) {
              var isSellPresent = false;
              if (snapshot.val().sell != undefined) {
                isSellPresent = true;
              }
              currentValue.serviceRequests.push({
                "Batch Id": snapshot.val().batchId,
                organizationName: snapshot.val().proforma.brokerOrganization,
                batchCreatedOn: moment(snapshot.val().batchCreatedAt).format(
                  "MMM DD, YYYY hh:mm A"
                ),
                "No Of Lots": snapshot.val().noOfLots,
                Id: snapshot.val().batchId,
                isSellPresent: isSellPresent,
              });

              currentValue.serviceRequests.reverse();
              currentValue.seen = false;
              currentValue.show = true;
            } else {
              currentValue.showIcons = false;
              currentValue.seen = false;
            }
          });
      } else {
        ref
          .orderByChild("status")
          .equalTo("Unsuccessful")
          .on("child_added", function (snapshot) {
            if (snapshot.val() != null) {
              if (
                snapshot.val().proforma.brokerOrganizationKey ===
                localStorage.organizationKey
              ) {
                var isSellPresent = false;
                if (snapshot.val().sell != undefined) {
                  isSellPresent = true;
                }
                currentValue.serviceRequests.push({
                  "Batch Id": snapshot.val().batchId,
                  organizationName: snapshot.val().proforma.brokerOrganization,
                  batchCreatedOn: moment(snapshot.val().batchCreatedAt).format(
                    "MMM DD, YYYY hh:mm A"
                  ),
                  "No Of Lots": snapshot.val().noOfLots,
                  Id: snapshot.val().batchId,
                  isSellPresent: isSellPresent,
                });

                currentValue.serviceRequests.reverse();
                currentValue.seen = false;
                currentValue.show = true;
              } else {
                currentValue.showIcons = false;
                currentValue.seen = false;
              }
            }
          });
      }
      setTimeout(function () {
        if (currentValue.serviceRequests.length == 0) {
          currentValue.seen = false;
        }
      }, 4000);
    },

    hideModal: function () {
      this.$refs["invoice-modal"].hide();
      location.reload();
    },

    closeModal() {
      this.collector = null;
      this.collectionpoint = null;
      this.dropoffatpackhouse = null;
      this.date = null;
    },
    viewBatch: function (item) {
      this.selectedRow = null;
      this.selectedRow = item;
      this.lots = [];
      let currentValue = this;

      currentValue.lotsLength = this.selectedRow["No Of Lots"];
      currentValue.totalBoxCount = this.selectedRow["No of Boxes"];

      var batchDetails = firebase
        .database()
        .ref()
        .child("batch")
        .child(currentValue.selectedRow.Id)
        .child("proforma");
      batchDetails.on("value", function (snapshot) {
        currentValue.proformaNo = snapshot.val().batchProforma_ProformaNo;
        currentValue.fullName = snapshot.val().batchProforma_FullName;
        currentValue.email = snapshot.val().batchProforma_Email;
        currentValue.sellingAddressLine1 = snapshot.val().batchProforma_Selling_AddressLine1;
        currentValue.sellingAddressLine2 = snapshot.val().batchProforma_Selling_AddressLine2;
        currentValue.sellingAddressLine3 = snapshot.val().batchProforma_Selling_AddressLine3;
        currentValue.shippingAddressLine1 = snapshot.val().batchProforma_Shipping_AddressLine1;
        currentValue.shippingAddressLine2 = snapshot.val().batchProforma_Shipping_AddressLine2;
        currentValue.shippingAddressLine3 = snapshot.val().batchProforma_Shipping_AddressLine3;
        currentValue.unitPrice = snapshot.val().batchProforma_Shipping_UnitPrice;
      });
      var ref = firebase.database().ref().child("serviceRequest");

      ref.on("value", function (snapshot) {
        if (snapshot.val() != null) {
          var itemNo = 0;
          snapshot.forEach((requestData) => {
            if (requestData.val().batchId == currentValue.selectedRow.Id) {
              let splittingFactor = 0;
              let startCode = requestData.val().startQRCodeBoxes;
              let endCode = requestData.val().endQRCodeBoxes;
              for (let i = 0; i < startCode.length; i++) {
                if (startCode.charAt(i) == endCode.charAt(i)) {
                  splittingFactor++;
                } else {
                  break;
                }
              }
              console.log(splittingFactor);
              let startBox = Number(
                startCode.substring(splittingFactor, startCode.length)
              );
              let endBox = Number(
                endCode.substring(splittingFactor, endCode.length)
              );

              itemNo = itemNo + 1;
              currentValue.batchNo = requestData.val().batchId;
              currentValue.productType = requestData.val().product;
              currentValue.productType = requestData.val().product;
              currentValue.productType = requestData.val().product;
              currentValue.departureTimestamp = moment
                .utc(requestData.val().departureDateTimeTransport)
                .local()
                .format("MMM DD, YYYY hh:mm A");
              currentValue.departureTemperature = requestData.val().transportTemperature;
              currentValue.lots.push({
                Id: itemNo,
                LotNo: itemNo,
                NoofBoxes: Number(endBox) - Number(startBox) + 1,
              });
            }
          });
        }
      });
      currentValue.$refs["view-batch"].show();
    },

    maintainBatch: function (item) {
      this.selectedRow = null;
      this.selectedRow = item;
      this.$refs["maintain-batch"].show();
      let currentValue = this;
      var batchDetails = firebase
        .database()
        .ref()
        .child("batch")
        .child(currentValue.selectedRow.Id)
        .child("maintain");
      batchDetails.on("value", function (snapshot) {
        if (snapshot.val() != null) {
          if (
            snapshot.val().arrivalTimestamp != null &&
            snapshot.val().arrivalTimestamp != undefined
          )
            (currentValue.arrivalTimestamp = snapshot.val().arrivalTimestamp),
              (currentValue.destination = snapshot.val().destination);

          (currentValue.fruitsRejected = snapshot.val().fruitsRejected),
            (currentValue.additionalComments = snapshot.val().additionalComments);

          (currentValue.temperature = snapshot.val().temperature),
            (currentValue.phLevel = snapshot.val().phLevel),
            (currentValue.ethyleneLevel = snapshot.val().ethyleneLevel),
            (currentValue.co2Level = snapshot.val().co2Level),
            (currentValue.coldStorageInTimestamp = moment
              .utc()
              .local()
              .format("MMM DD, YYYY hh:mm A")),
            (currentValue.costOfMaturation = snapshot.val().costOfMaturation);
          if (snapshot.val().qualityInspectionFiles != undefined) {
            var batchDetails = firebase
              .database()
              .ref()
              .child("batch")
              .child(currentValue.selectedRow.Id)
              .child("maintain")
              .child("qualityInspectionFiles");
            batchDetails.on("child_added", function (snapshot) {
              currentValue.qualityFiles.push({
                qualityInspectionImageName: snapshot.val()
                  .qualityInspectionImageName,
                qualityInspectionImagePath: snapshot.val()
                  .qualityInspectionImagePath,
              });
            });
            currentValue.qualityFile = true;
          }
        } else {
          currentValue.arrivalTimestamp = moment
            .utc()
            .local()
            .format("MMM DD, YYYY hh:mm A");
        }
      });
    },
    getLots: function () {
      this.lotsList = [];
      let currentVal = this;
      var iteration = 0;
      var ref = firebase
        .database()
        .ref()
        .child("batch")
        .child(this.selectedRow.Id)
        .child("lots");

      ref.on("child_added", function (snapshot) {
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
        });
      });
    },
    generateInvoice: function (item) {
      this.selectedRow = null;
      this.selectedRow = item;
      Router.push("invoice-payment-previous/" + this.selectedRow.Id);
    },
    confirmPayment: function (item) {
      this.selectedRow = null;
      this.selectedRow = item;
      Vue.$toast.open({
        message: this.$t("Payment confirmed.", "Payment confirmed."),
        type: "success",
        position: "top",
      });
    },
    saveSoldLot: function () {},
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
    logout: function (event) {
      firebase
        .auth()
        .signOut()
        .then(function () {
          localStorage.emailId = "";
          localStorage.userName = "";
          localStorage.organization = "";
          localStorage.phoneNumber = "";
          Router.push("/");
        })
        .catch(function (error) {
          alert("Error");
        });
    },
    stageSelection: function (label) {
      this.selectedStage = label;
    },
    hideMaintainModal: function () {
      this.$refs["maintain-batch"].hide();
    },
    hideGIModal: function () {
      this.$refs["generate-invoice"].hide();
    },
    SaveGI: function () {
      let currentValue = this;
      var ref = firebase
        .database()
        .ref("batch")
        .child(this.selectedRow.Id)
        .child("invoice");
      var inpData = {
        invoiceNo: currentValue.arrivalTimestamp,
        destination: currentValue.destination,
      };

      ref
        .set(inpData)
        .then(function () {
          Vue.$toast.open({
            message: currentValue.$t(
              "Arrival and destination details saved successfully.",
              "Arrival and destination details saved successfully."
            ),
            type: "success",
            position: "top",
          });
        })
        .catch(function (error) {
          currentValue.erroMessage = error.message;
          currentValue.seen = false;
        });
    },
    SaveMaintain: function () {
      let currentValue = this;
      var ref = firebase
        .database()
        .ref("batch")
        .child(this.selectedRow.Id)
        .child("maintain");
      if (this.selectedStage == "Arrival & Destination") {
        var inpData = {
          arrivalTimestamp: currentValue.arrivalTimestamp,
          destination: currentValue.destination,
        };

        ref
          .update(inpData)
          .then(function () {
            Vue.$toast.open({
              message: currentValue.$t(
                "Arrival and destination details saved successfully.",
                "Arrival and destination details saved successfully."
              ),
              type: "success",
              position: "top",
            });
          })
          .catch(function (error) {
            currentValue.erroMessage = error.message;
            currentValue.seen = false;
          });
      }
      if (this.selectedStage == "Documents") {
        if (
          currentValue.importPermit ||
          currentValue.document ||
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
            message: currentValue.$t(
              "Please upload document.",
              "Please upload document."
            ),
            type: "error",
            position: "top",
          });
        }
      }
      if (this.selectedStage == "Quality Inspection") {
        currentValue.seen = true;
        currentValue.qualityInspectionFileLength = null;
        var inpData = {
          fruitsRejected: currentValue.fruitsRejected,
          additionalComments: currentValue.additionalComments,
        };
        ref
          .update(inpData)
          .then(function () {
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
              Vue.$toast.open({
                message: currentValue.$t(
                  "Quality Inspection details saved successfully.",
                  "Quality Inspection details saved successfully."
                ),
                type: "success",
                position: "top",
              });
            }
          })
          .catch(function (error) {
            Vue.$toast.open({
              message: error.message,
              type: "error",
              position: "top",
            });
            currentValue.seen = false;
          });
      }
      if (this.selectedStage == "Cold Storage") {
        var inpData = {
          temperature: currentValue.temperature,
          phLevel: currentValue.phLevel,
          ethyleneLevel: currentValue.ethyleneLevel,
          co2Level: currentValue.co2Level,
          coldStorageInTimestamp: currentValue.coldStorageInTimestamp,
        };
        ref
          .update(inpData)
          .then(function () {
            Vue.$toast.open({
              message: currentValue.$t(
                "Cold Storage details saved successfully.",
                "Cold Storage details saved successfully."
              ),
              type: "success",
              position: "top",
            });
          })
          .catch(function (error) {
            currentValue.erroMessage = error.message;
            currentValue.seen = false;
          });
      }
      if (this.selectedStage == "Cost of Maturation") {
        var inpData = {
          costOfMaturation: currentValue.costOfMaturation,
        };
        ref
          .update(inpData)
          .then(function () {
            Vue.$toast.open({
              message: currentValue.$t(
                "Cost of Maturation details saved successfully.",
                "Cost of Maturation details saved successfully."
              ),
              type: "success",
              position: "top",
            });
          })
          .catch(function (error) {
            currentValue.erroMessage = error.message;
            currentValue.seen = false;
          });
      }
    },
    sellStageSelection: function (label) {
      this.sellSelectedStage = label;
      this.beforeLotSelection = false;
    },
    hideSellModal: function () {
      this.$refs["sell-modal"].hide();
    },
    hideViewBatchModal: function () {
      this.$refs["view-batch"].hide();
    },
    SaveSell: function () {
      let currentVal = this;
      var dbRef = firebase
        .database()
        .ref()
        .child("batch")
        .child(currentVal.selectedRow.Id)
        .child("sell");

      if (
        this.detailsSelectedStage == "Enter Buyer Details" &&
        typeof this.sellBuyerName != "undefined" &&
        this.sellBuyerName &&
        typeof this.sellBuyerAddress != "undefined" &&
        this.sellBuyerAddress &&
        typeof this.sellBuyerOrganization != "undefined" &&
        this.sellBuyerOrganization &&
        typeof this.sellBuyerContactDetails != "undefined" &&
        this.sellBuyerContactDetails
      ) {
        var inpData = {
          batchId: currentVal.selectedRow.Id,
          sellId: uuid.v1(),
          sellBuyerName: currentVal.sellBuyerName,
          sellBuyerAddress: currentVal.sellBuyerAddress,
          sellBuyerOrganization: currentVal.sellBuyerOrganization,
          sellBuyerContactDetails: currentVal.sellBuyerContactDetails,
          sellBuyerEmailAddress: currentVal.sellBuyerEmailAddress,
        };
      } else if (
        this.detailsSelectedStage == "Sale Transaction Details" &&
        typeof this.saleTransactionDate != "undefined" &&
        this.saleTransactionDate &&
        typeof this.totalNumberOfBoxes != "undefined" &&
        this.totalNumberOfBoxes &&
        typeof this.soldProduct != "undefined" &&
        this.soldProduct &&
        typeof this.salesPricePerKg != "undefined" &&
        this.salesPricePerKg &&
        typeof this.salesWeightPerBox != "undefined" &&
        this.salesWeightPerBox &&
        typeof this.salesCurrency != "undefined" &&
        this.salesCurrency &&
        typeof this.salesBrokerMargin != "undefined" &&
        this.salesBrokerMargin
      ) {
        var inpData = {
          batchId: currentVal.selectedRow.Id,
          sellId: uuid.v1(),
          saleTransactionDate: moment(currentVal.saleTransactionDate)
            .utc()
            .toString(),
          totalNoOfBoxesSold: currentVal.totalNumberOfBoxes,
          soldProduct: currentVal.soldProduct,
          salesPricePerKg: currentVal.salesPricePerKg,
          salesWeightPerBox: currentVal.salesWeightPerBox,
          salesCurrency: currentVal.salesCurrency,
          salesBrokerMargin: currentVal.salesBrokerMargin,
        };
      } else if (
        this.detailsSelectedStage == "Ship Order" &&
        typeof this.dateAndTimeOfLoading != "undefined" &&
        this.dateAndTimeOfLoading &&
        typeof this.totalNoofBoxesLoaded != "undefined" &&
        this.totalNoofBoxesLoaded &&
        typeof this.sellCostOfTransportation != "undefined" &&
        this.sellCostOfTransportation &&
        typeof this.buyersLocation != "undefined" &&
        this.buyersLocation &&
        typeof this.shipOrderCurrency != "undefined" &&
        this.shipOrderCurrency
      ) {
        var inpData = {
          batchId: currentVal.selectedRow.Id,
          sellId: uuid.v1(),
          dateAndTimeOfLoading: moment(currentVal.dateAndTimeOfLoading)
            .utc()
            .toString(),
          totalNoofBoxesLoaded: currentVal.totalNoofBoxesLoaded,
          sellCostOfTransportation: currentVal.sellCostOfTransportation,
          buyersLocation: currentVal.buyersLocation,
          shipOrderCurrency: currentVal.shipOrderCurrency,
        };
      } else if (
        this.detailsSelectedStage == "Unloading at Buyers Place" &&
        typeof this.dateAndTimeOfUnLoading != "undefined" &&
        this.dateAndTimeOfUnLoading &&
        typeof this.totalNoofBoxesUnLoaded != "undefined" &&
        this.totalNoofBoxesUnLoaded
      ) {
        if (this.totalNoofBoxesUnLoaded > this.totalNoofBoxesLoaded) {
          Vue.$toast.open({
            message: currentVal.$t(
              "Total no. of boxes unloaded should be less than total no. of boxes loaded.",
              "Total no. of boxes unloaded should be less than total no. of boxes loaded."
            ),
            type: "error",
            position: "top",
          });
        } else {
          var inpData = {
            batchId: currentVal.selectedRow.Id,
            sellId: uuid.v1(),
            dateAndTimeOfUnLoading: moment(currentVal.dateAndTimeOfUnLoading)
              .utc()
              .toString(),
            totalNoofBoxesUnLoaded: currentVal.totalNoofBoxesUnLoaded,
          };
        }
      } else {
        Vue.$toast.open({
          message: currentVal.$t(
            "Please enter all the fields marked with *",
            "Please enter all the fields marked with *"
          ),
          type: "error",
          position: "top",
        });
      }
      if (inpData != undefined) {
        dbRef
          .push(inpData)
          .then(function (response) {
            Vue.$toast.open({
              message: currentVal.$t(
                "Sell placed successfully.",
                "Sell placed successfully."
              ),
              type: "success",
              position: "top",
            });
          })
          .catch(function (error) {
            currentVal.erroMessage = error.message;
            currentVal.seen = false;
          });
      }
    },
    sellNext: function () {
      let currentVal = this;

      if (this.lotsList.length > 0) {
        var boxesSelected = 0;
        var boxesSelectedComparison = true;
        for (var i = 0; i < currentVal.lotsList.length; i++) {
          if (
            currentVal.lotsList[i].boxesSelected != null &&
            currentVal.lotsList[i].boxesSelected != "" &&
            Number(currentVal.lotsList[i].boxesSelected) > 0
          ) {
            boxesSelected++;
          }
          if (
            Number(currentVal.lotsList[i].boxesSelected) >
            Number(currentVal.lotsList[i].remaininglNoofBoxes)
          ) {
            boxesSelectedComparison = false;
          }
        }
        if (boxesSelected > 0) {
          if (boxesSelectedComparison) {
            this.seen = true;
            var dbRef = firebase
              .database()
              .ref("batch")
              .child(this.selectedRow.Id);
            for (var i = 0; i < currentVal.lotsList.length; i++) {
              currentVal.totalNumberOfBoxes =
                currentVal.totalNumberOfBoxes +
                Number(currentVal.lotsList[i].boxesSelected);
              dbRef
                .orderByChild("serviceRequestId")
                .equalTo(currentVal.lotsList[i].serviceRequestId)
                .on("child_added", function (data) {
                  var inpData = {
                    remaingNoOfBoxes:
                      Number(currentVal.lotsList[i].remaininglNoofBoxes) -
                      Number(currentVal.lotsList[i].boxesSelected),
                  };
                  var ref = firebase
                    .database()
                    .ref("batch/" + currentVal.selectedRow.Id + "/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {})
                    .catch(function (error) {
                      currentVal.erroMessage = error.message;
                      currentVal.seen = false;
                    });
                });
              if (currentVal.nextTabtobeLoaded == null) {
                currentVal.seen = false;
                currentVal.nextTabtobeLoaded = "Enter Buyer Details";
              }
            }
          } else {
            Vue.$toast.open({
              message: currentVal.$t(
                "Boxes selected should be less than corresponding Unsold No. of Boxes.",
                "Boxes selected should be less than corresponding Unsold No. of Boxes."
              ),
              type: "error",
              position: "top",
            });
          }
        } else {
          Vue.$toast.open({
            message: currentVal.$t(
              "Enter number Of boxes to buy.",
              "Enter number Of boxes to buy."
            ),
            type: "error",
            position: "top",
          });
        }
      }
    },

    sellBack: function () {
      if (this.nextTabtobeLoaded == "Enter Buyer Details") {
        this.nextTabtobeLoaded = null;
      }
    },
    SelectAll: function (lot) {
      if (lot.selectAllBoxes == true) {
        for (var i = 0; i < this.lotsList.length; i++) {
          if (lot.Id == this.lotsList[i].Id) {
            this.lotsList[i].boxesSelected = this.lotsList[
              i
            ].remaininglNoofBoxes;
          }
        }
      } else {
        for (var i = 0; i < this.lotsList.length; i++) {
          if (lot.Id == this.lotsList[i].Id) {
            this.lotsList[i].boxesSelected = "";
          }
        }
      }
    },
    printDownloadUrl: function (url, fileName, documentType) {
      var currentVal = this;
      switch (this.selectedStage) {
        case "Documents": {
          var inpData = null;
          if (documentType == "importPermit") {
            var inpData = {
              importPermitFilePath: url,
              importPermitFileName: fileName,
            };
          } else if (documentType == "document") {
            var inpData = {
              documentFilePath: url,
              documentFileName: fileName,
            };
          } else if (documentType == "temperatureReadings") {
            var inpData = {
              temperatureReadingsFilePath: url,
              temperatureReadingsFileName: fileName,
            };
          }
          var ref = firebase
            .database()
            .ref("batch")
            .child(this.selectedRow.Id)
            .child("maintain")
            .child("Documents");

          ref
            .push(inpData)
            .then(function () {
              if (documentType == "temperatureReadings") {
                Vue.$toast.open({
                  message: currentVal.$t(
                    "Documents uploaded successfully.",
                    "Documents uploaded successfully."
                  ),
                  type: "success",
                  position: "top",
                });
              }
            })
            .catch(function (error) {
              Vue.$toast.open({
                message: error.message,
                type: "error",
                position: "top",
              });
              currentVal.seen = false;
            });
        }
        case "Quality Inspection": {
          var ref = firebase
            .database()
            .ref("batch")
            .child(this.selectedRow.Id)
            .child("maintain")
            .child("qualityInspectionFiles");
          var inpData = {
            qualityInspectionImagePath: url,
            qualityInspectionImageName: fileName,
          };

          ref
            .push(inpData)
            .then(function () {
              currentVal.qualityInspectionFileLength =
                currentVal.qualityInspectionFileLength - 1;
              if (currentVal.qualityInspectionFileLength == 0) {
                currentVal.seen = false;

                Vue.$toast.open({
                  message: currentVal.$t(
                    "Quality Inspection details saved successfully.",
                    "Quality Inspection details saved successfully."
                  ),
                  type: "success",
                  position: "top",
                });
              }
            })
            .catch(function (error) {
              Vue.$toast.open({
                message: error.message,
                type: "error",
                position: "top",
              });
              currentVal.seen = false;
            });
        }
        default:
          console.log("no case matched");
      }
    },
    uploadImage: function (
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
    detailsStageSelection: function (label) {
      this.detailsSelectedStage = label;
      if (label == "Ship Order") {
        if (this.sellBuyerAddress != null) {
          this.buyersLocation = this.sellBuyerAddress;
        }
      }
    },

    showDashboard: function () {
      Router.push("broker-dashboard");
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else {
        Router.push("broker-dashboard");
      }
    },
  },
};
</script>
<style scoped>
.header-container {
  height: 50px !important;
  padding: 12px !important;
}
</style>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
@import "../../assets/css/main.css";

#modalnewviewbrokerprevioussuccess .modal-header {
  height: 50px !important;
}
#modalnewviewbrokerprevioussuccess .modal-header .close {
  margin-top: -12px !important;
}
#modalnewviewbrokerprevioussuccess .modal-header h5 {
  margin: -10px auto !important;
}

#hideViewBatchmodal .modal-header {
  height: 50px !important;
}
#hideViewBatchmodal .modal-header .close {
  margin-top: -12px !important;
}
#hideViewBatchmodal .modal-header h5 {
  margin: -10px auto !important;
}

#hideMaintainModal .modal-header {
  height: 50px !important;
}
#hideMaintainModal .modal-header .close {
  margin-top: -12px !important;
}
#hideMaintainModal .modal-header h5 {
  margin: -10px auto !important;
}

#generate-invoice-modal .modal-header {
  height: 50px !important;
}
#generate-invoice-modal .modal-header .close {
  margin-top: -12px !important;
}
#generate-invoice-modal .modal-header h5 {
  margin: -10px auto !important;
}

.tbl-view-broker-batches-previous tbody tr td:nth-child(3),
.tbl-view-broker-batches-previous thead tr th:nth-child(3) {
  /* text-align: right !important; */
  text-align: center;
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
.tbl-view-broker-batches-previous th:nth-child(4),
.tbl-view-broker-batches-previous th:nth-child(5),
.tbl-view-broker-batches-previous th:nth-child(6),
.tbl-view-broker-batches-previous td:nth-child(4),
.tbl-view-broker-batches-previous td:nth-child(5),
.tbl-view-broker-batches-previous td:nth-child(6) {
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
.tbl-view-broker-batches-previous thead tr th {
  font-weight: bold;
}
.tbl-view-broker-batches-previous .VueTables__search-field input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}
.tbl-view-broker-batches-previous .VueTables__limit-field select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}
</style>
<style scoped>
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
  right: 3px;
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
.uploaded-file-link {
  width: 100%;
  background: rgb(256, 256, 256, 0.1);
  color: #fff;
  margin: 10px 0px;
  float: none;
}
.uploaded-file-link a {
  color: #fff;
}
.upload-file-link-ul {
  padding: 20px 0px 0px 0px !important;
}
.download-icon-upload {
  float: right;
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
</style>
