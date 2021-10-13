<template>
  <div class="lsp-dashboard">
    <Offline @detected-condition="handleConnectivityChange"></Offline>

    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-10 content-container">
        <div class="header-container">
          <h3 class="heading">{{ $t("Batch Details", "Batch Details") }}</h3>
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
              id="batchtable"
              ref="batchtable"
              :data="serviceRequests"
              :columns="columns"
              :options="options"
              class="tbl-services tbl-view-broker-batches"
            >
              <template slot="batchId" slot-scope="props">
                <div>{{ props.row.batchId }}</div>
              </template>
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
              <template slot="View More" slot-scope="props">
                <div
                  class="plus-accordion"
                  @click="showLotsAccordion(props.row)"
                >
                  <img src="../../assets/images/plus.png" />
                </div>
              </template>
              <template
                slot-scope="props"
                v-if="props.row.id == clickedId"
                slot="child_row"
              >
                <template>
                  <div id="accordion-outer" class="details-accordion">
                    <div
                      class="card"
                      v-for="(lot, lotIndex) in props.row.lotLists"
                      v-bind:key="lot.lotIndex"
                      @click="showAccordion(lot, props.index)"
                    >
                      <div
                        class="card-header"
                        data-toggle="collapse"
                        :data-target="'#collapseOuter' + lot.lotIndex"
                        aria-expanded="true"
                        :aria-controls="'collapseOuter' + lot.lotIndex"
                        :id="'headingOuter' + lot.lotIndex"
                      >
                        <h5 class="mb-0">
                          <button class="btn btn-link">
                            Lot {{ lotIndex + 1 }}- {{ lot.lotId }}
                          </button>
                        </h5>
                      </div>

                      <div
                        :id="'collapseOuter' + lot.lotIndex"
                        class="collapse"
                        :aria-labelledby="'headingOuter' + lot.lotIndex"
                        data-parent="#accordion-outer"
                      >
                        <div class="card-body">
                          <div
                            id="accordion"
                            class="details-accordion"
                            v-if="
                              accordionDetails != null ||
                              accordionDetails != undefined
                            "
                          >
                            <div class="card">
                              <div
                                class="card-header"
                                data-toggle="collapse"
                                :data-target="'#collapseOne' + lot.lotId"
                                aria-expanded="true"
                                :aria-controls="'collapseOne' + lot.lotId"
                                :id="'headingOne' + lot.lotId"
                              >
                                <h5 class="mb-0">
                                  <button class="btn btn-link">
                                    {{
                                      $t(
                                        "View Collection Point Details",
                                        "View Collection Point Details"
                                      )
                                    }}
                                  </button>
                                </h5>
                              </div>

                              <div
                                :id="'collapseOne' + lot.lotId"
                                class="collapse"
                                :aria-labelledby="'headingOne' + lot.lotId"
                                data-parent="#accordion"
                              >
                                <div class="card-body">
                                  <div class="row">
                                    <div class="col-md-6 first-row-accordion">
                                      <div class="row">
                                        <div class="col-md-4">
                                          <div class="inner-data">
                                            {{
                                              $t(
                                                "Collection Time Stamp",
                                                "Collection Time Stamp"
                                              )
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-8">
                                          <div class="inner-data">
                                            {{
                                              accordionDetails.collectionTimestamp
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-4">
                                          <div class="inner-data">
                                            {{
                                              $t(
                                                "Fruits Rejected at CP",
                                                "Fruits Rejected at CP"
                                              )
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-8">
                                          <div class="inner-data">
                                            {{
                                              accordionDetails.fruitsRejectedAtCP
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-4">
                                          <div class="inner-data">
                                            {{
                                              $t(
                                                "Fruits Collected",
                                                "Fruits Collected"
                                              )
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-8">
                                          <div class="inner-data">
                                            {{
                                              accordionDetails.fruitsCollected
                                            }}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-6">
                                      <div class="row">
                                        <div class="col-md-4">
                                          <div class="inner-data">
                                            {{
                                              $t(
                                                "Internal temp. of Fruit @ CP",
                                                "Internal temp. of Fruit @ CP"
                                              )
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-8">
                                          <div class="inner-data">
                                            {{
                                              accordionDetails.internalfruitTemperatureAtCP
                                            }}
                                            (&#8451;)
                                          </div>
                                        </div>
                                        <div class="col-md-4">
                                          <div class="inner-data">
                                            {{
                                              $t(
                                                "Arrival at Packhouse",
                                                "Arrival at Packhouse"
                                              )
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-8">
                                          <div class="inner-data">
                                            {{
                                              accordionDetails.arrivalAtPackhouse
                                            }}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              class="card"
                              v-if="
                                accordionDetails.batchId != undefined &&
                                accordionDetails.batchId != null
                              "
                            >
                              <div
                                class="card-header"
                                data-toggle="collapse"
                                :data-target="'#collapseTwo' + lot.lotId"
                                aria-expanded="true"
                                :aria-controls="'collapseTwo' + lot.lotId"
                                :id="'headingTwo' + lot.lotId"
                              >
                                <h5 class="mb-0">
                                  <button class="btn btn-link collapsed">
                                    {{
                                      $t(
                                        "View Shipment Details",
                                        "View Shipment Details"
                                      )
                                    }}
                                  </button>
                                </h5>
                              </div>
                              <div
                                :id="'collapseTwo' + lot.lotId"
                                class="collapse"
                                :aria-labelledby="'headingTwo' + lot.lotId"
                                data-parent="#accordion"
                              >
                                <div class="card-body">
                                  <div class="row">
                                    <div class="col-md-6 first-row-accordion">
                                      <div class="row">
                                        <div class="col-md-4">
                                          <div class="inner-data">
                                            {{ $t("Batch Id", "Batch Id") }}
                                          </div>
                                        </div>
                                        <div class="col-md-8">
                                          <div class="inner-data">
                                            {{ accordionDetails.batchId }}
                                          </div>
                                        </div>
                                        <div class="col-md-4">
                                          <div class="inner-data">
                                            {{
                                              $t(
                                                "No. of boxes shipped",
                                                "No. of boxes shipped"
                                              )
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-8">
                                          <div class="inner-data">
                                            {{
                                              accordionDetails.noOfBoxesShipped
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-4">
                                          <div class="inner-data">
                                            {{
                                              $t(
                                                "Weight of Fruits Shipped (in Kgs)",
                                                "Weight of Fruits Shipped (in Kgs)"
                                              )
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-8">
                                          <div class="inner-data">
                                            {{
                                              accordionDetails.weightOffruitsShipped
                                            }}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-6">
                                      <div class="row">
                                        <div class="col-md-4">
                                          <div class="inner-data">
                                            {{
                                              $t(
                                                "Fruits rejected at Packhouse",
                                                "Fruits rejected at Packhouse"
                                              )
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-8">
                                          <div class="inner-data">
                                            {{
                                              accordionDetails.fruitsRejectedAtPackhouse
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-4">
                                          <div class="inner-data">
                                            {{
                                              $t(
                                                "Date of shipment (Pro-forma creation Date)",
                                                "Date of shipment (Pro-forma creation Date)"
                                              )
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-8">
                                          <div class="inner-data">
                                            {{
                                              accordionDetails.dateOfShipment
                                            }}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              class="card"
                              v-if="
                                accordionDetails.sale != undefined &&
                                accordionDetails.sale.length > 0
                              "
                            >
                              <div
                                class="card-header"
                                data-toggle="collapse"
                                :data-target="'#collapseThree' + lot.lotId"
                                aria-expanded="false"
                                :aria-controls="'collapseThree' + lot.lotId"
                                :id="'headingThree' + lot.lotId"
                              >
                                <h5 class="mb-0">
                                  <button class="btn btn-link collapsed">
                                    {{
                                      $t(
                                        "View Payment Details",
                                        "View Payment Details"
                                      )
                                    }}
                                  </button>
                                </h5>
                              </div>
                              <div
                                :id="'collapseThree' + lot.lotId"
                                class="collapse"
                                :aria-labelledby="'headingThree' + lot.lotId"
                                data-parent="#accordion"
                              >
                                <div
                                  id="accordionSale"
                                  v-for="(
                                    sale, saleIndex
                                  ) in accordionDetails.sale"
                                  v-bind:key="sale.sellId"
                                  class="details-accordion"
                                >
                                  <div class="card">
                                    <div
                                      class="card-header"
                                      data-toggle="collapse"
                                      :data-target="
                                        '#collapsePayment' + saleIndex
                                      "
                                      aria-expanded="true"
                                      :aria-controls="
                                        'collapsePayment' + saleIndex
                                      "
                                      :id="'headingPayment' + saleIndex"
                                    >
                                      <h5 class="mb-0">
                                        <button class="btn btn-link">
                                          {{ $t("Sale", "Sale") }}
                                          {{ saleIndex + 1 }} -
                                          {{
                                            accordionDetails.sale[saleIndex]
                                              .saleId
                                          }}
                                        </button>
                                      </h5>
                                    </div>

                                    <div
                                      :id="'collapsePayment' + saleIndex"
                                      class="collapse"
                                      :aria-labelledby="
                                        'headingPayment' + saleIndex
                                      "
                                      data-parent="#accordionSale"
                                    >
                                      <div class="card-body">
                                        <div class="row">
                                          <div
                                            class="col-md-6 first-row-accordion"
                                          >
                                            <div class="row">
                                              <div class="col-md-4">
                                                <div class="inner-data">
                                                  {{
                                                    $t("Sales Id", "Sales Id")
                                                  }}
                                                </div>
                                              </div>
                                              <div class="col-md-8">
                                                <div class="inner-data">
                                                  {{
                                                    accordionDetails.sale[
                                                      saleIndex
                                                    ].saleId
                                                  }}
                                                </div>
                                              </div>
                                              <div class="col-md-4">
                                                <div class="inner-data">
                                                  {{ $t("Sold On", "Sold On") }}
                                                </div>
                                              </div>
                                              <div class="col-md-8">
                                                <div class="inner-data">
                                                  {{
                                                    accordionDetails.sale[
                                                      saleIndex
                                                    ].soldOn
                                                  }}
                                                </div>
                                              </div>
                                              <div class="col-md-4">
                                                <div class="inner-data">
                                                  {{
                                                    $t(
                                                      "Weight of Fruits Sold (in Kgs)",
                                                      "Weight of Fruits Sold (in Kgs)"
                                                    )
                                                  }}
                                                </div>
                                              </div>
                                              <div class="col-md-8">
                                                <div class="inner-data">
                                                  {{
                                                    accordionDetailsWeightOfFruitsSold[
                                                      saleIndex
                                                    ]
                                                  }}
                                                </div>
                                              </div>
                                              <div class="col-md-4">
                                                <div class="inner-data">
                                                  {{
                                                    $t(
                                                      "Total No Of Boxes Sold",
                                                      "Total No Of Boxes Sold"
                                                    )
                                                  }}
                                                </div>
                                              </div>
                                              <div class="col-md-8">
                                                <div class="inner-data">
                                                  {{
                                                    accordionDetailsNoOfBoxesSold[
                                                      saleIndex
                                                    ]
                                                  }}
                                                </div>
                                              </div>
                                              <div class="col-md-4">
                                                <div class="inner-data">
                                                  {{
                                                    $t(
                                                      "Price Per Kg",
                                                      "Price Per Kg"
                                                    )
                                                  }}
                                                </div>
                                              </div>
                                              <div class="col-md-8">
                                                <div class="inner-data">
                                                  {{
                                                    accordionDetails.sale[
                                                      saleIndex
                                                    ].pricePerKg
                                                  }}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="col-md-6">
                                            <div class="row">
                                              <div class="col-md-4">
                                                <div class="inner-data">
                                                  {{
                                                    $t("Net Sales", "Net Sales")
                                                  }}
                                                  (USD)
                                                </div>
                                              </div>
                                              <div class="col-md-8">
                                                <div class="inner-data">
                                                  {{
                                                    accordionDetailsNetSales[
                                                      saleIndex
                                                    ]
                                                  }}
                                                </div>
                                              </div>
                                              <div class="col-md-4">
                                                <div class="inner-data">
                                                  {{
                                                    $t(
                                                      "Buyer Name",
                                                      "Buyer Name"
                                                    )
                                                  }}
                                                </div>
                                              </div>
                                              <div class="col-md-8">
                                                <div class="inner-data">
                                                  {{
                                                    accordionDetails.sale[
                                                      saleIndex
                                                    ].buyerName
                                                  }}
                                                </div>
                                              </div>
                                              <div class="col-md-4">
                                                <div class="inner-data">
                                                  {{
                                                    $t(
                                                      "Buyer Organization",
                                                      "Buyer Organization"
                                                    )
                                                  }}
                                                </div>
                                              </div>
                                              <div class="col-md-8">
                                                <div class="inner-data">
                                                  {{
                                                    accordionDetails.sale[
                                                      saleIndex
                                                    ].buyerOrganization
                                                  }}
                                                </div>
                                              </div>

                                              <div class="col-md-4">
                                                <div class="inner-data">
                                                  {{
                                                    $t(
                                                      "Payment to Broker",
                                                      "Payment to Broker"
                                                    )
                                                  }}
                                                  (USD)
                                                </div>
                                              </div>
                                              <div class="col-md-8">
                                                <div class="inner-data">
                                                  {{
                                                    accordionDetailsPaymentToBroker[
                                                      saleIndex
                                                    ]
                                                  }}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </v-client-table>
          </div>
        </div>
      </div>
      <Footer ref="footercomp"></Footer>
      <b-modal
        hide-footer
        id="viewbatchmodal"
        @hide="hideViewBatchModal"
        ref="view-batch"
        hide-backdrop
        :title="$t('View Batch Details', 'View Batch Details')"
      >
        <perfect-scrollbar class="modal-scroll">
          <div class="inp-container">
            <label class="input-label">{{ $t("Batch No", "Batch No") }}</label>
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
            <label class="input-label"
              >{{
                $t("Departure Temperature", "Departure Temperature")
              }}
              (&#8451;)</label
            >
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
          <h4 class="sub-heading">
            {{ $t("Proforma Invoice", "Proforma Invoice") }}
          </h4>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Proforma No.", "Proforma No.")
            }}</label>
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
            <label class="input-label">{{ $t("Currency", "Currency") }}</label>
            <input
              class="text-input"
              readonly
              type="text"
              v-model="proformaInvoiceCurrency"
            />
          </div>
          <div class="inp-container unit-price-container">
            <label class="input-label">{{
              $t("Unit Price", "Unit Price")
            }}</label>
            <span class="prefixCurrency">
              <span class="pref" v-if="this.proformaInvoiceCurrency == 'USD'"
                >$</span
              >
              <span class="pref" v-if="this.proformaInvoiceCurrency == 'HTG'"
                >G</span
              >
              <input
                class="text-input"
                readonly
                type="text"
                v-model="unitPrice"
              />
            </span>
            <!-- <input class="text-input" readonly type="text" v-model="unitPrice" /> -->
          </div>
        </perfect-scrollbar>
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
import Multiselect from "vue-multiselect";
Vue.component("multiselect", Multiselect);
import "vue-multiselect/dist/vue-multiselect.min.css";
import Footer from "../../components/footer-view";

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
import sendSMS from "../../shared/sms-service";
import Header from "../../components/header-view";
import Offline from "v-offline";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from "../../shared/auth";

export default {
  components: {
    PerfectScrollbar,
    Multiselect,
    Header,
    Footer,
    Offline,
  },
  name: "view-batch-details",
  data: function () {
    return {
      serviceRequests: [],
      columns: [
        "batchId",
        "organizationName",
        "batchCreatedOn",
        "No Of Lots",
        "No of Boxes",
        "View",
        "View More",
      ],
      exceededColumns: ["Lot", "totalNoofBoxes", "remaininglNoofBoxes"],
      sellListColumns: [
        "Sale Id",
        "Buyer's Name",
        "Total No Of Boxes Sold",
        "Ship Order & Unloading",
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
        sortable: ["batchCreatedOn"],
        headings: {
          batchId: `${this.$t("Batch Id", "Batch Id")}`,
          organizationName: `${this.$t(
            "Organization Name",
            "Organization Name"
          )}`,
          batchCreatedOn: `${this.$t("Batch Created On", "Batch Created On")}`,
          "No Of Lots": `${this.$t("No Of Lots", "No Of Lots")}`,
          "No of Boxes": `${this.$t("No of Boxes", "No of Boxes")}`,
          View: `${this.$t("View", "View")}`,
          "View More": `${this.$t("View More", "View More")}`,
        },
        sortable: ["batchCreatedOn"],
        orderBy: {
          ascending: false,
          column: "batchCreatedOn",
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
          totalNoofBoxes: "Total No Of Boxes",
          remaininglNoofBoxes: "Unsold No. of Boxes",
        },
        filterable: false,
        sortable: [],
      },
      sellListOptions: {
        perPage: 5,
        headings: {
          totalNoofBoxes: "Total No Of Boxes",
          remaininglNoofBoxes: "Unsold No. of Boxes",
        },
        perPageValues: [],
        filterable: false,
        sortable: [],
      },
      arrivalTimestamp: moment.utc().local().format("MMM DD, YYYY hh:mm A"),

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
      dateAndTimeOfLoading: moment.utc().local().format("MMM DD, YYYY hh:mm A"),
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
      proformaInvoiceCurrency: null,
      qrCodeOpions: [],
      selectedQRCodes: [],
      selectedQRCodeArray: [],
      qrCodeOptionsRows: 0,
      maturationCurrencySource: ["USD", "HTG"],
      currency: null,
      selectedLotId: null,
      selectAllBoxes: null,
      maxBoxesCanBeSold: null,
      transportationOrder: null,
      isTransportationOrder: false,
      transportationOrderFileLength: 0,
      transportationOrderFiles: null,
      lotsArray: [],
      networkStatus: true,
      detailsId: null,
      clickedId: null,
      lotClicked: null,
      previouslyClickedId: null,
      previouslyLotClickedId: null,
      elHeight: 0,
      openPaneNum: 0,
      accordionDetails: null,
      accordionDetailsNetSales: null,
      accordionDetailsPaymentToBroker: null,
      accordionDetailsWeightOfFruitsSold: null,
      accordionDetailsNoOfBoxesSold: null,
    };
  },
  mounted() {
    if (localStorage.systemRole == 99) {
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
            text: this.$t("Batch Details", "Batch Details"),
            href: "/view-broker-batches",
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
            text: this.$t("Batch Details", "Batch Details"),
            href: "/view-broker-batches",
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
          text: this.$t("Batch Details", "Batch Details"),
          href: "/view-broker-batches",
        },
      ]);
    } else if (localStorage.systemRole == 4 || localStorage.systemRole == 5) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Broker-Dashboard", "Broker-Dashboard"),
          href: "/broker-dashboard",
        },
        {
          text: this.$t("Batch Details", "Batch Details"),
          href: "/view-broker-batches",
        },
      ]);
    } else if (localStorage.systemRole == 97) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Broker SPOC-Dashboard", "Broker SPOC-Dashboard"),
          href: "/broker-dashboard",
        },
        {
          text: this.$t("Batch Details", "Batch Details"),
          href: "/view-broker-batches",
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
          text: this.$t("Batch Details", "Batch Details"),
          href: "/view-broker-batches",
        },
      ]);
    }
    this.options = {
      perPage: 10,
      sortable: ["batchCreatedOn"],
      headings: {
        batchId: `${this.$t("Batch Id", "Batch Id")}`,
        organizationName: `${this.$t(
          "Organization Name",
          "Organization Name"
        )}`,
        batchCreatedOn: `${this.$t("Batch Created On", "Batch Created On")}`,
        "No Of Lots": `${this.$t("No Of Lots", "No Of Lots")}`,
        "No of Boxes": `${this.$t("No of Boxes", "No of Boxes")}`,
        View: `${this.$t("View", "View")}`,
        "View More": `${this.$t("View More", "View More")}`,
      },
      sortable: ["batchCreatedOn"],
      orderBy: {
        ascending: false,
        column: "batchCreatedOn",
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
        totalNoofBoxes: "Total No Of Boxes",
        remaininglNoofBoxes: "Unsold No. of Boxes",
      },
      filterable: false,
      sortable: [],
    };

    this.sellListOptions = {
      perPage: 5,
      headings: {
        totalNoofBoxes: "Total No Of Boxes",
        remaininglNoofBoxes: "Unsold No. of Boxes",
      },
      perPageValues: [],
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
    ShowSaleAccordion(params, batchId, serviceRequest) {
      var vm = this;
      var refSaleAccordion = firebase
        .database()
        .ref()
        .child("batch/" + batchId + "/sell");
      vm.accordionDetails.sale = [];
      var indexCount = 0;
      vm.accordionDetailsNetSales = [];
      vm.accordionDetailsPaymentToBroker = [];
      vm.accordionDetailsWeightOfFruitsSold = [];
      vm.accordionDetailsNoOfBoxesSold = [];
      refSaleAccordion.on("child_added", (snapshotSale) => {
        console.log(snapshotSale.val());
        var saleDetails = {
          saleId: null,
          soldOn: null,
          pricePerKg: null,
          buyerContactNumber: null,
          buyerEmailAddress: null,
          buyerOrganization: null,
          buyerName: null,
        };

        if (snapshotSale.val().dateAndTimeOfUnLoading != undefined)
          saleDetails.soldOn = moment(
            String(snapshotSale.val().dateAndTimeOfUnLoading)
          )
            .local()
            .format("MMM DD, YYYY hh:mm A");
        if (
          snapshotSale.val().boxesSelected != undefined &&
          snapshotSale.val().boxesSelected != null
        ) {
          for (let i = 0; i < snapshotSale.val().boxesSelected.length; i++) {
            if (
              snapshotSale
                .val()
                .boxesSelected[i].serviceRequestId.indexOf(
                  serviceRequest.serviceRequestId
                ) != -1
            ) {
              saleDetails.saleId = snapshotSale.val().sellId;
              saleDetails.pricePerKg = snapshotSale.val().salesPricePerKg;
              saleDetails.buyerName = snapshotSale.val().sellBuyerName;
              saleDetails.buyerContactNumber = snapshotSale.val().sellBuyerContactDetails;
              saleDetails.buyerEmailAddress = snapshotSale.val().sellBuyerEmailAddress;
              saleDetails.buyerOrganization = snapshotSale.val().sellBuyerOrganization;
              //calling payment distribution API
              vm.axios
                .get(
                  `${
                    getConfigVars().BASE_URL
                  }50011/api/v1.0/payment-distribution?saleId=${
                    snapshotSale.val().sellId
                  }`,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + localStorage.IDtoken,
                    },
                  }
                )
                .then(function (response) {
                  console.log(response);
                  vm.accordionDetailsNetSales.push(response.data.netSales);
                  response.data.sales.forEach((item) => {
                    if (item.role == "BROKER") {
                      vm.accordionDetailsPaymentToBroker.push(item.amount);
                    }
                  });
                  response.data.lots.forEach((element) => {
                    if (element.lotId == serviceRequest.serviceRequestId) {
                      var weight = null;
                      if (response.data.product.toLowerCase() == "mango") {
                        var weight = Number(element.boxesSold) * 4.5;
                      } else if (
                        response.data.product.toLowerCase() == "avocado"
                      ) {
                        var weight = Number(element.boxesSold) * 5;
                      } else {
                        var weight = Number(element.boxesSold) * 12.25;
                      }

                      vm.accordionDetailsWeightOfFruitsSold.push(weight);
                      vm.accordionDetailsNoOfBoxesSold.push(element.boxesSold);
                    }
                  });
                })
                .catch((error) => {
                  let errorObject = JSON.parse(JSON.stringify(error));
                  if (
                    errorObject.message != undefined &&
                    errorObject.message != null
                  ) {
                    if (
                      error.response.status == 401 ||
                      errorObject.message.indexOf("401") > -1
                    ) {
                      firebase
                        .auth()
                        .currentUser.getIdToken(true)
                        .then((idtoken) => {
                          localStorage.IDtoken = "";
                          localStorage.IDtoken = idtoken;
                          vm.fetchPaymentDistributionDetails(
                            serviceRequest.serviceRequestId,
                            snapshotSale.val().sellId
                          );
                        });
                    }
                  }
                });
              //API call Ends
              vm.accordionDetails.sale.push(saleDetails);
              break;
            }
          }
        }
        vm.seen = false;
        indexCount++;
      });
    },
    showLotsAccordion(params) {
      console.log(params);
      this.clickedId = params.id;
      if (this.previouslyClickedId != params.id) {
        this.$refs.batchtable.toggleChildRow(this.previouslyClickedId);
      }
      this.$refs.batchtable.toggleChildRow(params.id);
      this.previouslyClickedId = params.id;
    },
    beforeEnter(el) {
      this.elHeight = el.scrollHeight;
    },
    enter(el) {
      el.style.height = this.elHeight + "px";
    },
    beforeLeave(el) {
      el.style.height = 0;
    },
    handlePaneOpened(num) {
      if (this.openPaneNum == num) {
        return (this.openPaneNum = null);
      }
      this.openPaneNum = num;
    },
    fetchPaymentDistributionDetails(serviceRequestId, saleId) {
      let vm = this;
      vm.axios
        .get(
          `${
            getConfigVars().BASE_URL
          }50011/api/v1.0/payment-distribution?saleId=${saleId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          }
        )
        .then(function (response) {
          vm.accordionDetailsNetSales.push(response.data.netSales);
          response.data.sales.forEach((item) => {
            if (item.role == "BROKER") {
              vm.accordionDetailsPaymentToBroker.push(item.amount);
            }
          });
          response.data.lots.forEach((element) => {
            if (element.lotId == serviceRequest.serviceRequestId) {
              var weight = null;
              if (response.data.product.toLowerCase() == "mango") {
                var weight = Number(element.boxesSold) * 4.5;
              } else if (response.data.product.toLowerCase() == "avocado") {
                var weight = Number(element.boxesSold) * 5;
              } else {
                var weight = Number(element.boxesSold) * 12.25;
              }

              vm.accordionDetailsWeightOfFruitsSold.push(weight);
              vm.accordionDetailsNoOfBoxesSold.push(element.boxesSold);
            }
          });
        })
        .catch(function (error) {
          let errorObject = JSON.parse(JSON.stringify(error));
          if (errorObject.message != undefined && errorObject.message != null) {
            if (
              error.response.status == 401 ||
              errorObject.message.indexOf("401") > -1
            ) {
              firebase
                .auth()
                .currentUser.getIdToken(true)
                .then((idtoken) => {
                  localStorage.IDtoken = "";
                  localStorage.IDtoken = idtoken;
                  vm.fetchPaymentDistributionDetails(serviceRequestId, saleId);
                });
            }
          }
        });
    },
    showAccordion(params, index) {
      var vm = this;
      vm.seen = true;
      //fetching data from database for the selected batch ID
      var refAccordion = firebase.database().ref().child("serviceRequest");
      var count = 0;
      refAccordion
        .orderByChild("serviceRequestId")
        .equalTo(params.lotId)
        .on("child_added", (snapshot) => {
          console.log(snapshot.val());
          vm.accordionDetails = {
            fruitsRejectedAtCP: snapshot.val().fruitRejected,
            internalfruitTemperatureAtCP: snapshot.val().temperature,
            batchId: snapshot.val().batchId,
          };
          if (snapshot.val().dateOfPickup != undefined)
            vm.accordionDetails.collectionTimestamp = moment(
              String(snapshot.val().dateOfPickup)
            )
              .local()
              .format("MMM DD, YYYY hh:mm A");
          if (snapshot.val().arrivedAtPackhouseAddedOn != undefined) {
            vm.accordionDetails.arrivalAtPackhouse = moment(
              String(snapshot.val().arrivedAtPackhouseAddedOn)
            )
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }
          if (
            snapshot.val().fruitsHarvested != null &&
            snapshot.val().fruitsHarvested != undefined &&
            snapshot.val().fruitRejected != null &&
            snapshot.val().fruitRejected != undefined
          )
            vm.accordionDetails.fruitsCollected =
              snapshot.val().fruitsHarvested - snapshot.val().fruitRejected;
          if (
            snapshot.val().batchId == null ||
            snapshot.val().batchId == undefined
          ) {
            vm.seen = false;
          }
          if (
            snapshot.val().batchId != undefined &&
            snapshot.val().batchId != null
          ) {
            var refBatchAccordion = firebase.database().ref().child("batch");
            refBatchAccordion
              .orderByChild("batchId")
              .equalTo(snapshot.val().batchId)
              .on("child_added", (snapshotBatch) => {
                // var startQRCodeBoxesCount = snapshot
                //   .val()
                //   .startQRCodeBoxes.match(/\d/g);
                // startQRCodeBoxesCount = startQRCodeBoxesCount.join("");
                // var endQRCodeBoxesCount = snapshot
                //   .val()
                //   .endQRCodeBoxes.match(/\d/g);
                // endQRCodeBoxesCount = endQRCodeBoxesCount.join("");
                let totalBoxes = 0;
                snapshot
                  .val()
                  .cartonFillingAndPalletizingData.forEach((item) => {
                    totalBoxes += item.boxQRCodes.length;
                  });
                vm.accordionDetails.noOfBoxesShipped = totalBoxes;
                // endQRCodeBoxesCount - startQRCodeBoxesCount + 1;
                if (snapshot.val().product == "Mango") {
                  vm.accordionDetails.weightOffruitsShipped =
                    vm.accordionDetails.noOfBoxesShipped * 4.5;
                } else if (snapshot.val().product == "Avocado") {
                  vm.accordionDetails.weightOffruitsShipped =
                    vm.accordionDetails.noOfBoxesShipped * 5;
                } else {
                  vm.accordionDetails.weightOffruitsShipped =
                    vm.accordionDetails.noOfBoxesShipped * 12.25;
                }
                vm.accordionDetails.fruitsRejectedAtPackhouse =
                  parseInt(snapshot.val().fruitRejected) +
                  parseInt(snapshot.val().fruitsRejected) +
                  parseInt(snapshot.val().weightofRemovedFruit);
                if (
                  snapshotBatch.val().proforma != undefined &&
                  snapshotBatch.val().proforma != null &&
                  snapshotBatch.val().proforma.proFormaUpdatedOn != undefined
                )
                  vm.accordionDetails.dateOfShipment = moment(
                    String(snapshotBatch.val().proforma.proFormaUpdatedOn)
                  )
                    .local()
                    .format("MMM DD, YYYY hh:mm A");
                if (
                  snapshotBatch.val().sell == null ||
                  snapshotBatch.val().sell == undefined
                ) {
                  vm.seen = false;
                }
                vm.ShowSaleAccordion(
                  params,
                  snapshot.val().batchId,
                  snapshot.val()
                );
              });
          }
        });
      //fetch ends
    },
    handleConnectivityChange(status) {
      this.networkStatus = status;
    },
    getData: function () {
      let currentValue = this;
      currentValue.seen = true;
      currentValue.serviceRequests = [];
      var phoneNumbers = [];
      var ref = firebase.database().ref().child("batch");
      var sellRef = ref
        .orderByChild("status")
        .equalTo("Batch Proforma Completed");
      var count = 0;
      ref
        .orderByChild("status")
        .equalTo("Batch Proforma Completed")
        .on("child_added", function (snapshot) {
          if (snapshot.val() != null) {
            if (localStorage.systemRole.includes(99)) {
              var isSellPresent = false;

              var isMaintain = false;
              if (snapshot.val().maintain != undefined) {
                isMaintain = true;
              }
              var isSellCompleted = true;
              if (snapshot.val().sell != undefined) {
                firebase
                  .database()
                  .ref()
                  .child("batch/" + snapshot.val().batchId)
                  .child("sell")
                  .on("child_added", function (snapshot1) {
                    if (
                      (snapshot1.val().dateAndTimeOfLoading == undefined ||
                        snapshot1.val().dateAndTimeOfUnLoading == undefined) &&
                      isSellCompleted
                    ) {
                      isSellCompleted = false;
                    }
                  });
                isSellPresent = true;
              }
              var lots = snapshot.val().lots;
              if (lots) {
                var keys = Object.keys(lots);
                var _noOfBoxes = 0;
                var lotsList = [];
                var lotIndex = 0;
                keys.forEach(function (key) {
                  lotIndex++;
                  _noOfBoxes += lots[key].noOfBoxes;
                  lotsList.push({
                    lotIndex: lotIndex,
                    lotId: lots[key].serviceRequestId,
                  });
                });
              }

              currentValue.serviceRequests.push({
                id: count,
                lots: snapshot.val().lots,
                batchId: snapshot.val().batchId,
                organizationName: snapshot.val().proforma.brokerOrganization,
                batchCreatedOn: moment
                  .utc(snapshot.val().batchCreatedAt)
                  .local()
                  .format("MMM DD, YYYY hh:mm A"),
                "No Of Lots": snapshot.val().noOfLots,
                "No of Boxes": _noOfBoxes,
                Id: snapshot.val().batchId,
                isSellPresent: isSellPresent,
                isMaintain: isMaintain,
                product: snapshot.val().product,
                isSellCompleted: isSellCompleted,
                brokerMargin: snapshot.val().proforma.brokerMargin,
                phoneNumbers: [],
                lotLists: lotsList,
              });
              if (snapshot.val().lots != undefined) {
                firebase
                  .database()
                  .ref()
                  .child("batch/" + snapshot.val().batchId)
                  .child("lots")
                  .on("child_added", function (snapshotLots) {
                    currentValue.serviceRequests.forEach((item, index) => {
                      if (
                        item.batchId == snapshot.val().batchId &&
                        snapshotLots.val().phoneNumber != undefined
                      ) {
                        currentValue.serviceRequests[index].phoneNumbers.push(
                          snapshotLots.val().phoneNumber
                        );
                      }
                    });
                  });
              }
              currentValue.serviceRequests.reverse();
              console.log(currentValue.serviceRequest);
              currentValue.seen = false;
              currentValue.show = true;
            } else {
              if (
                snapshot.val().proforma.brokerOrganizationKey ==
                localStorage.organizationKey
              ) {
                var isSellPresent = false;

                var isMaintain = false;
                if (snapshot.val().maintain != undefined) {
                  isMaintain = true;
                }
                var isSellCompleted = true;
                if (snapshot.val().sell != undefined) {
                  firebase
                    .database()
                    .ref()
                    .child("batch/" + snapshot.val().batchId)
                    .child("sell")
                    .on("child_added", function (snapshot1) {
                      if (
                        (snapshot1.val().dateAndTimeOfLoading == undefined ||
                          snapshot1.val().dateAndTimeOfUnLoading ==
                            undefined) &&
                        isSellCompleted
                      ) {
                        isSellCompleted = false;
                      }
                    });
                  isSellPresent = true;
                }
                var lots = snapshot.val().lots;
                if (lots) {
                  var keys = Object.keys(lots);
                  var _noOfBoxes = 0;
                  var lotsList = [];
                  var lotIndex = 0;
                  keys.forEach(function (key) {
                    _noOfBoxes += lots[key].noOfBoxes;
                    lotsList.push({
                      lotIndex: lotIndex,
                      lotId: lots[key].serviceRequestId,
                    });
                  });
                }

                currentValue.serviceRequests.push({
                  id: count,
                  lots: snapshot.val().lots,
                  batchId: snapshot.val().batchId,
                  organizationName: snapshot.val().proforma.brokerOrganization,
                  batchCreatedOn: moment
                    .utc(snapshot.val().batchCreatedAt)
                    .local()
                    .format("MMM DD, YYYY hh:mm A"),
                  "No Of Lots": snapshot.val().noOfLots,
                  "No of Boxes": _noOfBoxes,
                  Id: snapshot.val().batchId,
                  isSellPresent: isSellPresent,
                  isMaintain: isMaintain,
                  product: snapshot.val().product,
                  isSellCompleted: isSellCompleted,
                  brokerMargin: snapshot.val().proforma.brokerMargin,
                  phoneNumbers: [],
                  lotLists: lotsList,
                });
                if (snapshot.val().lots != undefined) {
                  firebase
                    .database()
                    .ref()
                    .child("batch/" + snapshot.val().batchId)
                    .child("lots")
                    .on("child_added", function (snapshotLots) {
                      currentValue.serviceRequests.forEach((item, index) => {
                        if (
                          item.batchId == snapshot.val().batchId &&
                          snapshotLots.val().phoneNumber != undefined
                        ) {
                          currentValue.serviceRequests[index].phoneNumbers.push(
                            snapshotLots.val().phoneNumber
                          );
                        }
                      });
                    });
                }
                currentValue.serviceRequests.reverse();
                currentValue.seen = false;
                currentValue.show = true;
              }
            }
          } else {
            currentValue.showIcons = false;
            currentValue.seen = false;
          }
          count++;
        });

      setTimeout(function () {
        if (currentValue.serviceRequests.length == 0) {
          currentValue.seen = false;
        }
      }, 4000);
    },

    viewBatch: function (item) {
      this.seen = true;
      this.selectedRow = null;
      this.selectedRow = item;
      this.lots = [];
      let currentValue = this;
      console.log("$$$");
      console.log(item);
      var batchDetails = firebase
        .database()
        .ref()
        .child("batch")
        .child(currentValue.selectedRow.Id)
        .child("proforma");
      batchDetails.on("value", function (snapshot) {
        let abc = snapshot.val();
        console.log(abc);
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
        currentValue.proformaInvoiceCurrency = snapshot.val().batchProforma_Shipping_Currency;
      });
      var ref = firebase.database().ref().child("serviceRequest");
      var itemNo = 0;

      ref.on("child_added", function (snapshot) {
        if (snapshot.val() != null) {
          if (snapshot.val().batchId == currentValue.selectedRow.Id) {
            let splittingFactor = 0;
            let startCode = snapshot.val().startQRCodeBoxes;
            let endCode = snapshot.val().endQRCodeBoxes;
            // for (let i = 0; i < startCode.length; i++) {
            //   if (startCode.charAt(i) == endCode.charAt(i)) {
            //     splittingFactor++;
            //   } else {
            //     break;
            //   }
            // }
            // let startBox = Number(
            //   startCode.substring(splittingFactor, startCode.length)
            // );
            // let endBox = Number(
            //   endCode.substring(splittingFactor, endCode.length)
            // );
            let totalBoxes = 0;
            snapshot.val().cartonFillingAndPalletizingData.forEach((item) => {
              totalBoxes += item.boxQRCodes.length;
            });
            itemNo = itemNo + 1;
            currentValue.batchNo = snapshot.val().batchId;
            currentValue.productType = snapshot.val().product;

            currentValue.departureTimestamp = moment
              .utc(snapshot.val().departureDateTimeTransport)
              .local()
              .format("MMM DD, YYYY hh:mm A");
            currentValue.departureTemperature = snapshot.val().transportTemperature;
            currentValue.lots.push({
              Id: itemNo,
              LotNo: itemNo,
              NoofBoxes: totalBoxes,
            });
          }
        }
        currentValue.seen = false;
      });

      currentValue.$refs["view-batch"].show();
    },

    getLots: function () {
      this.lotsList = [];
      let currentVal = this;
      var iteration = 0;
      var ref = firebase
        .database()
        .ref()
        .child("batch")
        .child(currentVal.selectedRow.Id)
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
          status: status,
        });
      });
    },
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

    hideViewBatchModal: function () {
      this.$refs["view-batch"].hide();
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
.prefixCurrency {
  display: inline-flex;
  width: 100%;
  color: #fff;
}
.prefixCurrency .pref {
  margin-top: 8px;
  font-size: 15px;
  padding-right: 1px;
  font-weight: bolder;
}
.btn-save,
.btn-cancel {
  height: 30px !important;
}
.sub-header-close-img {
  margin-top: 3px !important;
}
.modal-scroll {
  padding: 1.45rem !important;
}
.modal-body {
  padding: 25px !important;
}
.custom-file-input:lang(en) ~ .custom-file-label::after {
  margin-top: 9px !important;
}
</style>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
@import "../../assets/css/main.css";

#modalBoxes > div > .modal-content {
  width: 590px !important;
}

#confirm-warning-modal .modal-header {
  height: 50px !important;
}
#confirm-warning-modal .modal-header .close {
  margin-top: -12px !important;
}
#confirm-warning-modal .modal-header h5 {
  margin: -10px auto !important;
}

#modalBoxes .modal-header {
  height: 50px !important;
}
#modalBoxes .modal-header .close {
  margin-top: -12px !important;
}
#modalBoxes .modal-header h5 {
  margin: -10px auto !important;
}

#modalnewviewbrokersuccess .modal-header {
  height: 50px !important;
}
#modalnewviewbrokersuccess .modal-header .close {
  margin-top: -12px !important;
}
#modalnewviewbrokersuccess .modal-header h5 {
  margin: -10px auto !important;
}

#sell-modal .modal-header {
  height: 50px !important;
}
#sell-modal .modal-header .close {
  margin-top: -12px !important;
}
#sell-modal .modal-header h5 {
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

#maintain-batch-modal .modal-header {
  height: 50px !important;
}
#maintain-batch-modal .modal-header .close {
  margin-top: -12px !important;
}
#maintain-batch-modal .modal-header h5 {
  margin: -10px auto !important;
}

#viewbatchmodal .modal-header {
  height: 50px !important;
}
#viewbatchmodal .modal-header .close {
  margin-top: -12px !important;
}
#viewbatchmodal .modal-header h5 {
  margin: -10px auto !important;
}
.tbl-view-broker-batches tbody tr td:nth-child(3),
.tbl-view-broker-batches thead tr th:nth-child(3) {
  /* text-align: right !important; */
  text-align: center !important;
}
.qrcode-lbl {
  color: #fff !important;
}
.box-img {
  width: 65px !important;
  height: auto !important;
}
.active-box {
  cursor: pointer;
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
.sale-btn-container {
  margin-bottom: -7px !important;
  margin-top: 7px;
  margin-right: -5px !important;
}
.saledetails {
  margin-right: 11px;
}
.sale-bk-container {
  position: absolute !important;
  top: -46px;
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
  /* padding: 30px; */
  padding: 25px;
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
  /* margin: 0 !important; */
  margin: 0px 20px !important;
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
  height: 100% !important;
}
.sell-modal-scroll {
  height: 100% !important;
  overflow-x: hidden !important;
  padding-right: 13px !important;
  margin-right: 0px !important;
}
.tbl-view-broker-batches th:nth-child(4),
.tbl-view-broker-batches th:nth-child(5),
.tbl-view-broker-batches th:nth-child(6),
.tbl-view-broker-batches th:nth-child(7),
.tbl-view-broker-batches td:nth-child(4),
.tbl-view-broker-batches td:nth-child(5),
.tbl-view-broker-batches td:nth-child(6),
.tbl-view-broker-batches td:nth-child(7),
.tbl-view-broker-batches td:nth-child(8) {
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
  /* text-align: right !important; */
  text-align: center !important;
}
.view-tbl-services thead tr th:nth-child(2),
.view-tbl-services tbody tr td:nth-child(2) {
  /* text-align: right !important;
  padding-right: 40px !important; */
  text-align: center !important;
}
.view-tbl-services thead tr th:nth-child(1),
.view-tbl-services tbody tr td:nth-child(1) {
  padding-left: 40px !important;
}
.view-tbl-services thead tr th {
  font-weight: bold;
}
#modalBoxes .modal-header {
  background: #3a4527;
  padding: 15px;
}
#modalBoxes .modal-body {
  padding: 0;
  background: #6a765a;
}
#modalBoxes .table-li {
  border-color: #4a582c;
}
.tbl-view-broker-batches .VueTables__search-field input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}
.tbl-view-broker-batches .VueTables__limit-field select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}
.maintain-batch-container .input-wrap .input-label {
  margin-bottom: -8px !important;
}
.maintain-batch-container .input-wrap .text-input {
  margin-bottom: 32px !important;
  height: 26px !important;
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
  z-index: 1;
  font-size: 12px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
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
/* .inp-container {
  margin-bottom: 15px;
} */
.inp-container {
  margin-bottom: 30px;
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
  /* height: auto; */
  height: 50px;
  padding: 12px;
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
  padding: 12px 15px 10px 15px;
}
.sub-header-close-img {
  width: 16px;
  height: auto;
  margin-right: 1px;
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
  width: 316px;
}
.maintain-batch-container {
  height: 250px;
  margin-bottom: 20px;
}
.maintain-batch-heading {
  height: 50px !important;
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
  height: 50px;
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
.checkmark:hover {
  background-color: transparent !important;
  border: 1px solid #fff !important;
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
  word-break: break-all;
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
#confirm-warning-modal label {
  color: #fff;
}
#confirm-warning-modal .modal-content {
  width: 400px;
  margin: 0 auto;
}
.box-table {
  color: #fff;
}
.inactive-display {
  display: none;
}
.box-table {
  border-collapse: collapse;
}
.table-li {
  border: 1px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 120px;
  width: 100px;
  text-align: center;
  padding-top: 10px;
  overflow: auto;
  word-break: break-all;
}
.table-li:nth-child(4n) {
  border-right: 0;
}
.table-li:nth-child(4n + 1) {
  border-left: 0;
}
.table-li:nth-child(1),
.table-li:nth-child(2),
.table-li:nth-child(3),
.table-li:nth-child(4) {
  border-top: 0;
}
.table-li:nth-last-child(1),
.table-li:nth-last-child(2),
.table-li:nth-last-child(3),
.table-li:nth-last-child(4) {
  border-bottom: 0px;
}
.box-table-scroll {
  max-height: 400px;
}
.select-box-btn {
  padding: 5px 10px;
  color: #fff !important;
  float: right;
  margin-right: 15px;
  font-size: 13px;
  margin-top: -4px;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 0;
  background-color: #6a765a;
}
.select-box-btn:active,
.select-box-btn:focus {
  background-color: #6a765a !important;
}
.inp-con-checkbox-boxselect {
  width: 30%;
  float: left;
}
.inp-con-checkbox-boxselect {
  margin-bottom: 0px;
}
.inp-con-checkbox-boxselect .checkbox-container {
  margin-bottom: 0px;
  padding-left: 22px;
  margin-top: 5px;
  /* margin-top: -7px; */
}
.inp-con-checkbox-boxselect .checkmark {
  width: 15px;
  height: 15px;
  top: 2px;
}
.inp-con-checkbox-boxselect .checkmark:after {
  top: 0px;
  left: 4px;
}
.button-container-box-modal {
  width: 100%;
  text-align: right;
  border: 1px soild #000;
  background: #3a4527;
  color: #fff;
  padding: 10px;
}
.btn-cancel-box-modal {
  background: #6a765a;
  outline: none;
  border: none;
}
.input-half {
  width: 40%;
}
.box-modal-header-text {
  color: #fff;
  float: left;
  width: 40%;
  text-align: center;
  margin: 0 auto;
  font-size: 1.75rem;
}
.box-modal-custom-header {
  width: 100%;
}
.box-modal-header-close {
  float: right;
  margin-top: 6px;
  margin-right: 5px;
}
.view-broker-batches-upload-wrap .uploaded-image-wrap {
  text-align: center;
}
.view-broker-batches-upload-wrap .upload-li {
  width: 50%;
  border-bottom: 1px solid #fff;
  padding-bottom: 10px;
}
.view-broker-batches-upload-wrap .upload-li:nth-of-type(odd) {
  border-right: 1px solid #fff;
}
.view-broker-batches-upload-wrap .upload-li-single:nth-of-type(odd) {
  border-right: none;
  border-bottom: none;
}
.view-broker-batches-upload-wrap .upload-li:nth-last-child(1),
.view-broker-batches-upload-wrap .upload-li:nth-last-child(2) {
  border-bottom: none;
}
.view-broker-batches-upload-wrap img {
  max-height: 70px;
  max-width: 70px;
}
.view-broker-batches-upload-wrap .upload-li-single {
  width: 100%;
}
.view-broker-batches-upload-wrap .upload-file-link-ul {
  margin-top: 10px !important;
}
.checkbox-container:hover input ~ .checkmark {
  border: 1px solid #fff;
}
.view-broker-batches-upload-wrap .v-select-wrap {
  margin: 0px !important;
}
.maintain-mandatory-warning {
  position: absolute;
  bottom: 40px;
  font-size: 13px;
  color: #fff;
  padding-left: 15px;
}
.sell-mandatory-warning {
  position: absolute;
  bottom: 40px;
  font-size: 13px;
  color: #fff;
  padding-left: 15px;
}
.edit-disabled {
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.7;
}
.sell-exclamation {
  width: 12px;
}
.sell-exclamation-wrap {
  float: left;
  margin-right: 5px;
  margin-top: -4px;
}
.sell-exclamation-tooltiptext {
  background: #ffc000;
  width: 230px;
  z-index: 1;
  color: #000;
  border: 1px solid #d29d00;
  bottom: 15px;
  font-weight: 500;
}
.maintain-batch-container .custome-file {
  display: block;
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
