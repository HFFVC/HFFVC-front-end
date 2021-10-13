<template>
  <div class="service-requests">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-12 content-container">
        <div class="header-container">
          <h3 class="heading">
            {{ $t("Manage Service Requests", "Manage Service Requests") }}
          </h3>
          <div class="icon-container">
            <ul>
              <li v-if="showIcons">
                <img
                  @click="showServiceRequests"
                  class="sub-header-imgs"
                  src="../../assets/images/list_view.png"
                />
              </li>
              <li v-if="showIcons">
                <img
                  @click="showMapView"
                  class="sub-header-imgs"
                  src="../../assets/images/map_view.png"
                />
              </li>
              <li v-if="showIcons">
                <img
                  @click="showCalenderView"
                  class="sub-header-imgs"
                  src="../../assets/images/calendar_view.png"
                />
              </li>
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
          <div class="main-container">
            <div id="people">
              <v-client-table
                id="manageServiceRequeststable"
                ref="manageServiceRequeststable"
                :data="serviceRequests"
                :columns="columns"
                :options="options"
                class="tbl-services manage-service-request-table"
              >
                <template slot="Select" slot-scope="props">
                  <div v-if="props.row.isCancel">
                    <input
                      type="checkbox"
                      :checked="props.row.selected"
                      v-model="checkedRows"
                      :value="props.row"
                      v-if="props.row.Status != 'Cancelled'"
                    />
                  </div>
                </template>
                <template slot="Organization" slot-scope="props">
                  <div>
                    <label>{{ props.row.organization }}</label>
                  </div>
                </template>
                <template slot="Location" slot-scope="props">
                  <div>
                    <a class v-on:click="showMap(props.row.Id)">
                      <img
                        class="location-img"
                        src="../../assets/images/location_pin.png"
                      />
                    </a>
                  </div>
                </template>
                <template slot="what3words" slot-scope="props">
                  <div class="whatwords-wrap tooltip whatwords-wrap-tooltip">
                    <span class="tooltiptext whatwords-tooltiptext">
                      {{ $t("Mots", "Mots") }}: {{ props.row.words }}
                      <br />
                      {{ $t("Pays", "Pays") }}: {{ props.row.country }}
                      <br />
                      {{ $t("Lieu le plus proche", "Lieu le plus proche") }}:
                      {{ props.row.nearestPlace }}
                    </span>
                    <a class="a-text" target="_blank" :href="props.row.map">
                      <div class="what-words">{{ props.row.words }}</div>
                      <div class="whatwords-img-wrap">
                        <img
                          class="location-img"
                          src="../../assets/images/location_pin.png"
                        />
                      </div>
                    </a>
                  </div>
                </template>

                <template slot="Edit" slot-scope="props">
                  <div>
                    <a
                      class="btn-edit"
                      v-if="props.row.isEditShown"
                      v-on:click="edit(props.row.Id)"
                    >
                      <img
                        class="location-img"
                        src="../../assets/images/edit_record.png"
                      />
                    </a>
                  </div>
                </template>
                <template slot="Cancel" slot-scope="props">
                  <div v-if="props.row.isCancel">
                    <a
                      class="btn-edit"
                      v-if="
                        checkedRows.length == 0 &&
                          props.row.Status != 'Cancelled'
                      "
                      v-on:click="showConfirmModal(props.row.Id)"
                    >
                      <img
                        class="location-img"
                        src="../../assets/images/cancel.png"
                      />
                    </a>
                  </div>
                </template>
                <template slot="View More" slot-scope="props">
                  <div
                    v-if="props.row.Status != 'Pending Assign' && props.row.Status != 'Rejected' && props.row.Status != 'Cancelled'"
                    class="plus-accordion"
                  >
                    <img
                      src="../../assets/images/plus.png"
                      @click="showAccordion(props.row, props.index)"
                    />
                  </div>
                </template>
                <template
                  slot-scope="props"
                  v-if="props.row.id == clickedId"
                  slot="child_row"
                >
                  <template>
                    <div id="accordion" class="details-accordion">
                      <div class="card">
                        <div
                          class="card-header"
                          data-toggle="collapse"
                          data-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                          id="headingOne"
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
                          id="collapseOne"
                          class="collapse"
                          aria-labelledby="headingOne"
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
                                        $t(
                                          accordionDetails.collectionTimestamp,
                                          accordionDetails.collectionTimestamp
                                        )
                                      }}
                                    </div>
                                  </div>
                                  <div class="col-md-4">
                                    <div class="inner-data">
                                      {{
                                        $t(
                                          "Collection Point Name",
                                          "Collection Point Name"
                                        )
                                      }}
                                    </div>
                                  </div>
                                  <div class="col-md-8">
                                    <div class="inner-data">
                                      {{
                                        $t(
                                          accordionDetails.collectionPointName,
                                          accordionDetails.collectionPointName
                                        )
                                      }}
                                    </div>
                                  </div>
                                  <div class="col-md-4">
                                    <div class="inner-data">
                                      {{
                                        $t("Collector Name", "Collector Name")
                                      }}
                                    </div>
                                  </div>
                                  <div class="col-md-8">
                                    <div class="inner-data">
                                      {{
                                        $t(
                                          accordionDetails.collectorName,
                                          accordionDetails.collectorName
                                        )
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
                                        $t(
                                          accordionDetails.fruitsRejectedAtCP,
                                          accordionDetails.fruitsRejectedAtCP
                                        )
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
                                          "Fruits Collected",
                                          "Fruits Collected"
                                        )
                                      }}
                                    </div>
                                  </div>
                                  <div class="col-md-8">
                                    <div class="inner-data">
                                      {{
                                        $t(
                                          accordionDetails.fruitsCollected,
                                          accordionDetails.fruitsCollected
                                        )
                                      }}
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
                                        $t(
                                          accordionDetails.arrivalAtPackhouse,
                                          accordionDetails.arrivalAtPackhouse
                                        )
                                      }}
                                    </div>
                                  </div>
                                  <div class="col-md-4">
                                    <div class="inner-data">
                                      {{ $t("PDF Contract", "PDF Contract") }}
                                    </div>
                                  </div>
                                  <div class="col-md-8">
                                    <div class="inner-data">
                                      <a
                                        :href="accordionDetails.pdfContract"
                                        target="_blank"
                                      >
                                        <img
                                          class="download-pdf"
                                          src="../../assets/images/pdf-dwld-icon.png"
                                        />
                                      </a>
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
                          data-target="#collapseTwo"
                          aria-expanded="true"
                          aria-controls="collapseTwo"
                          id="headingTwo"
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
                          id="collapseTwo"
                          class="collapse"
                          aria-labelledby="headingTwo"
                          data-parent="#accordion"
                        >
                          <div class="card-body">
                            <div class="row">
                              <div class="col-md-6 first-row-accordion">
                                <div class="row">
                                  <div class="col-md-4">
                                    <div class="inner-data">
                                      {{ $t("Batch ID", "Batch ID") }}
                                    </div>
                                  </div>
                                  <div class="col-md-8">
                                    <div class="inner-data">
                                      {{
                                        $t(
                                          accordionDetails.batchId,
                                          accordionDetails.batchId
                                        )
                                      }}
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
                                        $t(
                                          accordionDetails.noOfBoxesShipped,
                                          accordionDetails.noOfBoxesShipped
                                        )
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
                                        $t(
                                          accordionDetails.weightOffruitsShipped,
                                          accordionDetails.weightOffruitsShipped
                                        )
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
                                        $t(
                                          accordionDetails.fruitsRejectedAtPackhouse,
                                          accordionDetails.fruitsRejectedAtPackhouse
                                        )
                                      }}
                                    </div>
                                  </div>
                                  <div class="col-md-4">
                                    <div class="inner-data">
                                      {{
                                        $t(
                                          "Broker Organization",
                                          "Broker Organization"
                                        )
                                      }}
                                    </div>
                                  </div>
                                  <div class="col-md-8">
                                    <div class="inner-data">
                                      {{
                                        $t(
                                          accordionDetails.brokerOrganization,
                                          accordionDetails.brokerOrganization
                                        )
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
                                        $t(
                                          accordionDetails.dateOfShipment,
                                          accordionDetails.dateOfShipment
                                        )
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
                          data-target="#collapseThree"
                          aria-expanded="false"
                          aria-controls="collapseThree"
                          id="headingThree"
                        >
                          <h5 class="mb-0">
                            <button class="btn btn-link collapsed">
                              {{
                                $t(
                                  "View Sale Details",
                                  "View Sale Details"
                                )
                              }}
                            </button>
                          </h5>
                        </div>
                        <div
                          id="collapseThree"
                          class="collapse"
                          aria-labelledby="headingThree"
                          data-parent="#accordion"
                        >
                          <div
                            id="accordionSale"
                            v-for="(sale, saleIndex) in accordionDetails.sale"
                            v-bind:key="sale.sellId"
                            class="details-accordion"
                          >
                            <div class="card">
                              <div
                                class="card-header"
                                data-toggle="collapse"
                                :data-target="'#collapsePayment' + saleIndex"
                                aria-expanded="true"
                                :aria-controls="'collapsePayment' + saleIndex"
                                :id="'headingPayment' + saleIndex"
                              >
                                <h5 class="mb-0">
                                  <button class="btn btn-link">
                                    {{ $t("Sale", "Sale") }} Sale
                                    {{ saleIndex + 1 }} -
                                    {{
                                      accordionDetails.sale[saleIndex].saleId
                                    }}
                                  </button>
                                </h5>
                              </div>

                              <div
                                :id="'collapsePayment' + saleIndex"
                                class="collapse"
                                :aria-labelledby="'headingPayment' + saleIndex"
                                data-parent="#accordionSale"
                              >
                                <div class="card-body">
                                  <div class="row">
                                    <div class="col-md-6">
                                      <div class="row">
                                        <div class="col-md-4">
                                          <div class="inner-data">
                                            {{ $t("Sales ID", "Sales ID") }}
                                          </div>
                                        </div>
                                        <div class="col-md-8">
                                          <div class="inner-data">
                                            {{
                                              $t(
                                                accordionDetails.sale[saleIndex]
                                                  .saleId,
                                                accordionDetails.sale[saleIndex]
                                                  .saleId
                                              )
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
                                              $t(
                                                accordionDetails.sale[saleIndex]
                                                  .soldOn,
                                                accordionDetails.sale[saleIndex]
                                                  .soldOn
                                              )
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
                                              $t(
                                                accordionDetailsWeightOfFruitsSold[
                                                  saleIndex
                                                ],
                                                accordionDetailsWeightOfFruitsSold[
                                                  saleIndex
                                                ]
                                              )
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
                                                "NO. of boxes sold",
                                                "NO. of boxes sold"
                                              )
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-8">
                                          <div class="inner-data">
                                            {{
                                              $t(
                                                accordionDetailsNoOfBoxesSold[
                                                  saleIndex
                                                ],
                                                accordionDetailsNoOfBoxesSold[
                                                  saleIndex
                                                ]
                                              )
                                            }}
                                          </div>
                                        </div>
                                        <!-- <div class="col-md-4">
                                          <div class="inner-data">
                                            {{
                                              $t(
                                                "Payment to Producer (USD)",
                                                "Payment to Producer (USD)"
                                              )
                                            }}
                                          </div>
                                        </div> -->
                                        <!-- <div class="col-md-8">
                                          <div class="inner-data">
                                            {{
                                              $t(
                                                accordionDetailsPaymentToProducer[
                                                  saleIndex
                                                ],
                                                accordionDetailsPaymentToProducer[
                                                  saleIndex
                                                ]
                                              )
                                            }}
                                          </div>
                                        </div> -->
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
              <input
                type="button"
                v-if="Number(noOfRowsChecked) > 0"
                class="btn-save pickup-save btn-cancel-request"
                v-on:click="showConfirmModal(null)"
                :value="$t('Cancel Request', 'Cancel Request')"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer ref="footercomp"></Footer>
    </div>
    <b-modal
      ref="confirm-modal"
      hide-footer
      :title="$t('Warning', 'Warning')"
      id="confirm-cancel-modal"
      hide-backdrop
    >
      <div v-if="warningDiv">
        <label class="confirm-message-label">{{
          $t(
            "Are you sure you want to cancel ?",
            "Are you sure you want to cancel ?"
          )
        }}</label>
        <div>
          <input
            type="button"
            v-on:click="hideConfirmWarningModal"
            class="btn-cancel"
            :value="$t('Cancel', 'Cancel')"
          />
          <input
            type="button"
            v-on:click="cancelRequest(selectedServiceRequestId)"
            class="btn-save"
            :value="$t('Proceed', 'Proceed')"
          />
        </div>
      </div>
      <div v-if="reasonDiv">
        <textarea
          type="text"
          id="reasontext"
          v-model="cancelReason"
          :placeholder="$t('Reason', 'Reason')"
        ></textarea>
        <br />
        <br />
        <input
          type="button"
          v-on:click="hideConfirmWarningModal"
          class="btn-cancel"
          :value="$t('Cancel', 'Cancel')"
        />
        <input
          type="button"
          v-on:click="saveRequest(selectedServiceRequestId)"
          class="btn-save"
          :value="$t('Save', 'Save')"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "../../assets/css/service-requests.css";
import "../../assets/css/manage-services.css";
import "../../assets/script/jquery.min.js";
import Router from "../../router";
import firebase from "firebase";
import { ClientTable } from "vue-tables-2";
import moment from "moment";
import "../../assets/css/main.css";
import "../../assets/css/common.css";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import axios from "axios";
import sanitizeInputForCorda from "../../shared/sanitize_input";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from '../../shared/auth';
// import getConfigVars from "../../shared/config-env";
Vue.use(ClientTable);

export default {
  name: "service-requests",
  data: function() {
    return {
      serviceRequests: [],

      columns: [
        "Select",
        "Organization",
        "Display Id",
        "Producer",
        "Department / Town",
        "Product",
        "Estimated Fruits #",
        "Created By",
        "orderRequested",
        "Location",
        "what3words",
        "Status",
        "Edit",
        "Cancel",
        "View More",
      ],
      seen: true,
      show: false,
      userName: "",
      totalRecords: 0,
      showIcons: true,
      checkedRows: [],
      selectedServiceRequestId: null,
      warningDiv: true,
      reasonDiv: false,
      cancelReason: "",
      detailsId: null,
      clickedId: null,
      previouslyClickedId: null,
      elHeight: 0,
      openPaneNum: 0,
      accordionDetails: null,
      accordionDetailsNetSales: null,
      accordionDetailsPaymentToProducer: null,
      accordionDetailsPenalties: null,
      accordionDetailsWeightOfFruitsSold: null,
      accordionDetailsNoOfBoxesSold: null,
      isSuperUser: false,
      options: {
        perPage: 10,
        orderBy: {
          ascending: false,
         column: "Display Id",
        },
        sortable: ["Producer","Display Id", "orderRequested", "Status"],
        headings: {
          Select: `${this.$t("Select", "Select")}`,
          orderRequested: `${this.$t(
            "Order Requested On",
            "Order Requested On"
          )}`,
          "Display Id": `${this.$t("Display Id", "Display Id")}`,
          Producer: `${this.$t("Producer", "Producer")}`,
          "Department / Town": `${this.$t(
            "Department / Town",
            "Department / Town"
          )}`,
          Product: `${this.$t("Product", "Product")}`,
          "Estimated Fruits #": `${this.$t(
            "Estimated Fruits #",
            "Estimated Fruits #"
          )}`,
          "Created By": `${this.$t("Created By", "Created By")}`,
          Location: `${this.$t("Location", "Location")}`,
          Status: `${this.$t("Status", "Status")}`,
          Edit: `${this.$t("Edit", "Edit")}`,
          Cancel: `${this.$t("Cancel", "Cancel")}`,
          "View More": `${this.$t("View More", "View More")}`,
        },
        customSorting: {
          orderRequested: function(ascending) {
            return function(a, b) {
              let dateA = new Date(a.orderRequested);
              let dateB = new Date(b.orderRequested);

              if (ascending) return dateA >= dateB ? 1 : -1;

              return dateA <= dateB ? 1 : -1;
            };
          },
        },
      },
    };
  },
  computed: {
    // a computed getter
    noOfRowsChecked: function() {
      // `this` points to the vm instance
      return this.checkedRows.length;
    },
  },
  components: {
    Header,
    Footer,
  },
  mounted() {
    if (
      localStorage.systemRole == 99 &&
      isAuthenticated() == localStorage.organizationKey
    ) {
      this.isSuperUser = true;
    }
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
          text: this.$t("Manage Service Requests", "Manage Service Requests"),
          href: "/service-requests",
        },
      ]);
    } else {
      if (
        localStorage.systemRole == 99 &&
        localStorage.prevPage == "dashboard"
      ) {
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
            text: this.$t("Manage Service Requests", "Manage Service Requests"),
            href: "/service-requests",
          },
        ]);
        localStorage.prevPage = "";
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
            text: this.$t("Manage Service Requests", "Manage Service Requests"),
            href: "/service-requests",
          },
        ]);
        localStorage.prevPage = "";
      }
      } else if (localStorage.systemRole == 99) {
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
            text: this.$t("Manage Service Requests", "Manage Service Requests"),
            href: "/service-requests",
          },
        ]);
      }
      else
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
            text: this.$t("Manage Service Requests", "Manage Service Requests"),
            href: "/service-requests",
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
            text: this.$t("Manage Service Requests", "Manage Service Requests"),
            href: "/service-requests",
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
            text: this.$t("Manage Service Requests", "Manage Service Requests"),
            href: "/service-requests",
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
            text: this.$t("Manage Service Requests", "Manage Service Requests"),
            href: "/service-requests",
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
            text: this.$t("Manage Service Requests", "Manage Service Requests"),
            href: "/service-requests",
          },
        ]);
      }
    }
    this.options = {
      perPage: 10,
      orderBy: {
        ascending: false,
        column: "Display Id",
      },
      sortable: ["Producer","Display Id", "orderRequested", "Status"],
      headings: {
        Select: `${this.$t("Select", "Select")}`,
        orderRequested: `${this.$t(
          "Order Requested On",
          "Order Requested On"
        )}`,
        "Display Id": `${this.$t("Display Id", "Display Id")}`,
        Producer: `${this.$t("Producer", "Producer")}`,
        "Department / Town": `${this.$t(
          "Department / Town",
          "Department / Town"
        )}`,
        Product: `${this.$t("Product", "Product")}`,
        "Estimated Fruits #": `${this.$t(
          "Estimated Fruits #",
          "Estimated Fruits #"
        )}`,
        "Created By": `${this.$t("Created By", "Created By")}`,
        Location: `${this.$t("Location", "Location")}`,
        Status: `${this.$t("Status", "Status")}`,
        Edit: `${this.$t("Edit", "Edit")}`,
        Cancel: `${this.$t("Cancel", "Cancel")}`,
        "View More": `${this.$t("View More", "View More")}`,
      },
      customSorting: {
        orderRequested: function(ascending) {
          return function(a, b) {
            let dateA = new Date(a.orderRequested);
            let dateB = new Date(b.orderRequested);

            if (ascending) return dateA >= dateB ? 1 : -1;

            return dateA <= dateB ? 1 : -1;
          };
        },
      },
    };
    this.userName = localStorage.userName;
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.getData();
  },
  methods: {
    ShowSaleAccordion(params, batchId, serviceRequest) {
      var vm = this;
      var refSaleAccordion = firebase
        .database()
        .ref()
        .child("batch/" + batchId + "/sell");
      vm.accordionDetails.sale = [];
      vm.accordionDetailsPaymentToProducer = [];
      vm.accordionDetailsWeightOfFruitsSold = [];
      vm.accordionDetailsNoOfBoxesSold = [];
      var indexCount = 0;
      refSaleAccordion.on("child_added", (snapshotSale) => {
        console.log(snapshotSale.val());
        var saleDetails = {
          saleId: null,
          soldOn: null,
        };
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
                .then(function(response) {
                  if (
                    response.data.lots != undefined &&
                    response.data.lots.length > 0
                  )
                    response.data.lots.forEach((element) => {
                      if (element.lotId == serviceRequest.serviceRequestId) {
                        vm.accordionDetailsPaymentToProducer.push(
                          Number(element.producerAmount).toFixed(2)
                        );
                        vm.accordionDetailsNoOfBoxesSold.push(
                          element.boxesSold
                        );
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
                      }
                    });
                })
                .catch((error) => {
                  let errorObject = JSON.parse(JSON.stringify(error));
                  if (
                    errorObject.message != undefined &&
                    errorObject.message != null
                  ) {
                    if ((error.response.status == 401) || (errorObject.message.indexOf("401") > -1)) {
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
              if (
                snapshotSale.val().invoice != undefined &&
                snapshotSale.val().invoice != null &&
                snapshotSale.val().dateAndTimeOfUnLoading != undefined
              )
                saleDetails.soldOn = moment(
                  String(snapshotSale.val().dateAndTimeOfUnLoading)
                )
                  .local()
                  .format("MMM DD, YYYY hh:mm A");
              vm.accordionDetails.sale.push(saleDetails);
              break;
            }
          }
        }
        if (vm.previouslyClickedId != params.id) {
          vm.$refs.manageServiceRequeststable.toggleChildRow(
            vm.previouslyClickedId
          );
        }
        vm.$refs.manageServiceRequeststable.toggleChildRow(params.id);
        vm.previouslyClickedId = params.id;
        vm.seen = false;
        indexCount++;
      });
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
        .then(function(response) {
          if (response.data.lots != undefined && response.data.lots.length > 0)
            response.data.lots.forEach((element) => {
              if (element.lotId == serviceRequestId) {
                vm.accordionDetailsPaymentToProducer.push(
                  element.producerAmount
                );
                vm.accordionDetailsNoOfBoxesSold.push(element.boxesSold);
                var weight = null;
                if (response.data.product.toLowerCase() == "mango") {
                  var weight = Number(element.boxesSold) * 4.5;
                } else if (response.data.product.toLowerCase() == "avocado") {
                  var weight = Number(element.boxesSold) * 5;
                } else {
                  var weight = Number(element.boxesSold) * 12.25;
                }
                vm.accordionDetailsWeightOfFruitsSold.push(weight);
              }
            });
        })
        .catch(function(error) {
          let errorObject = JSON.parse(JSON.stringify(error));
          console.log(errorObject);
          if (errorObject.message != undefined && errorObject.message != null) {
             if ((error.response.status == 401) || (errorObject.message.indexOf("401") > -1)) {
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
      vm.clickedId = params.id;
      if (vm.previouslyClickedId != params.id) {
        //fetching data from database for the selected service request ID
        var refAccordion = firebase
          .database()
          .ref()
          .child("serviceRequest");
        var count = 0;
        refAccordion
          .orderByChild("serviceRequestId")
          .equalTo(params.Id)
          .on("child_added", (snapshot) => {
            console.log(snapshot.val());
            vm.accordionDetails = {
              collectionPointName: snapshot.val().collectionPoint,
              collectorName: snapshot.val().collector,
              fruitsRejectedAtCP: snapshot.val().fruitRejected,
              pdfContract: snapshot.val().agreementDocumentUrl,
              batchId: snapshot.val().batchId,
            };
            if (
              snapshot.val().fruitsHarvested != null &&
              snapshot.val().fruitsHarvested != undefined &&
              snapshot.val().fruitRejected != null &&
              snapshot.val().fruitRejected != undefined
            )
              vm.accordionDetails.fruitsCollected =
                snapshot.val().fruitsHarvested - snapshot.val().fruitRejected;

            //dates existence validation starts
            if (snapshot.val().arrivedAtPackhouseAddedOn != undefined) {
              vm.accordionDetails.arrivalAtPackhouse = moment(
                String(snapshot.val().arrivedAtPackhouseAddedOn)
              )
                .local()
                .format("MMM DD, YYYY hh:mm A");
            }
            if (snapshot.val().dateOfPickup != undefined) {
              vm.accordionDetails.collectionTimestamp = moment(
                String(snapshot.val().dateOfPickup)
              )
                .local()
                .format("MMM DD, YYYY hh:mm A");
            }
            //dates existence validation ends

            if (
              snapshot.val().batchId == null ||
              snapshot.val().batchId == undefined
            ) {
              if (vm.previouslyClickedId != params.id) {
                vm.$refs.manageServiceRequeststable.toggleChildRow(
                  vm.previouslyClickedId
                );
              }
              vm.$refs.manageServiceRequeststable.toggleChildRow(params.id);
              vm.previouslyClickedId = params.id;
              vm.seen = false;
            }
            if (
              snapshot.val().batchId != undefined &&
              snapshot.val().batchId != null
            ) {
              var refBatchAccordion = firebase
                .database()
                .ref()
                .child("batch");
              refBatchAccordion
                .orderByChild("batchId")
                .equalTo(snapshot.val().batchId)
                .on("child_added", (snapshotBatch) => {
                  // console.log(snapshotBatch.val());
                  // console.log(snapshot.val());
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
                    snapshotBatch.val().proforma != null
                  ) {
                    //Dates existence validation starts
                    if (
                      snapshotBatch.val().proforma.proFormaUpdatedOn !=
                      undefined
                    )
                      vm.accordionDetails.dateOfShipment = moment(
                        String(snapshotBatch.val().proforma.proFormaUpdatedOn)
                      )
                        .local()
                        .format("MMM DD, YYYY hh:mm A");
                    //Dates existence validation starts
                    vm.accordionDetails.brokerOrganization = snapshotBatch.val().proforma.brokerOrganization;
                  }
                  if (
                    snapshotBatch.val().sell == null ||
                    snapshotBatch.val().sell == undefined
                  ) {
                    if (vm.previouslyClickedId != params.id) {
                      vm.$refs.manageServiceRequeststable.toggleChildRow(
                        vm.previouslyClickedId
                      );
                    }
                    vm.$refs.manageServiceRequeststable.toggleChildRow(
                      params.id
                    );
                    vm.previouslyClickedId = params.id;
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
      } else {
        if (vm.previouslyClickedId != params.id) {
          vm.$refs.manageServiceRequeststable.toggleChildRow(
            vm.previouslyClickedId
          );
        }
        vm.$refs.manageServiceRequeststable.toggleChildRow(params.id);
        vm.previouslyClickedId = params.id;
        vm.seen = false;
      }
    },
    getData() {
      let currentValue = this;
      var serviceRequests = [];
      currentValue.serviceRequests = [];
      var dbRef = firebase.database().ref("masters/what3words");

      let ref = null;
      if (currentValue.isSuperUser || localStorage.systemRole == 91) {
        ref = firebase
          .database()
          .ref()
          .child("serviceRequest");
      } else {
        ref = firebase
          .database()
          .ref()
          .child("serviceRequest")
          .orderByChild("organization")
          .equalTo(localStorage.organization);
      }

      firebase
        .database()
        .ref()
        .child("serviceRequest");
      var count = 0;
      ref.on(
        "child_added",
        (requestData) => {
          console.log(requestData.val());
          dbRef
            .orderByKey()
            .equalTo(requestData.val().farmerId)
            .on(
              "child_added",
              (response) => {
                currentValue.totalRecords++;
                var status = "";
                var isEditShown = false;
                var isCancel = false;
                if (requestData.val().status == "New") {
                  status = "Pending Assign";
                  isEditShown = true;
                } else {
                  status = requestData.val().status;
                }
                if (
                  requestData.val().status == "New" ||
                  requestData.val().status == "Assigned" ||
                  requestData.val().status == "Enroute Producer"
                ) {
                  isCancel = true;
                }
                serviceRequests.push({
                  id: count,
                  "Display Id": requestData.val().displayId,
                  Producer: requestData.val().producer,
                  "Department / Town":
                    requestData.val().department +
                    " / " +
                    requestData.val().town,
                  Product: `${currentValue.$t(
                    requestData.val().product,
                    requestData.val().product
                  )}`,
                  "Estimated Fruits #": requestData.val().estimatedNoFruits,
                  "Created By":
                    requestData.val().serviceRequestcreatedBy.split("(")[0] ||
                    "",
                  orderRequested: moment(
                    String(requestData.val().requestedOn)
                  ).format("MMM DD, YYYY hh:mm A"),
                  Location: requestData.val().location,
                  Status: status,
                  Id: requestData.val().serviceRequestId,
                  isEditShown: isEditShown,
                  isCancel: isCancel,
                  words: response.val().words,
                  country: response.val().country,
                  nearestPlace: response.val().nearestPlace,
                  map: response.val().map,
                  organization: requestData.val().organization,
                });
                currentValue.show = true;
                count++;
              },
              (error) => {
                console.log("error.message");
                console.log(error.message);
              }
            );
        },
        (error) => {
          console.log("Error: " + error.code);
        }
      );
      setTimeout(function() {
        currentValue.seen = false;
        currentValue.serviceRequests = serviceRequests;
      }, 4000);
    },
    edit: function(id) {
      Router.push("modify-service-request/" + id);
    },
    showMap: function(id) {
      localStorage.prevPage = "dashboard";
      Router.push("show-map/" + id);
    },
    showMapView: function(event) {
      localStorage.prevPage = "service-requests";
      Router.push("map-view");
    },
    showServiceRequests: function(event) {
      localStorage.prevPage = "dashboard";
      Router.push("service-requests");
    },
    showCalenderView: function(event) {
      localStorage.prevPage = "service-requests";
      Router.push("calender-view");
    },
    showDashboard: function() {
      Router.push("dashboard");
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
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else {
        Router.push("dashboard");
      }
    },
    showConfirmModal(servicerequestId) {
      this.selectedServiceRequestId = servicerequestId;
      this.$refs["confirm-modal"].show();
    },
    hideConfirmWarningModal: function() {
      this.warningDiv = true;
      this.reasonDiv = false;
      this.$refs["confirm-modal"].hide();
    },
    cancelRequest() {
      this.warningDiv = false;
      this.reasonDiv = true;
    },
    rejectAPICall(serviceId) {
      let currentVal = this;

      const data = {
        id: serviceId,
        status: "Cancelled",
        rejectedOn: moment()
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss")
          .toString(),
        rejectReason: currentVal.cancelReason,
        rejectAddionalNote: "",
      };
      var sanitizedInput = sanitizeInputForCorda(data);
      currentVal.axios
        .post(
          `${getConfigVars().BASE_URL}50009/api/v1.0/reject-lot`,
          sanitizedInput,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
              //Authorization :  "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjgzYTczOGUyMWI5MWNlMjRmNDM0ODBmZTZmZWU0MjU4Yzg0ZGI0YzUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20va2lza2V5YXdlYi10ZXN0IiwiYXVkIjoia2lza2V5YXdlYi10ZXN0IiwiYXV0aF90aW1lIjoxNTg1ODA4OTE5LCJ1c2VyX2lkIjoiM2FiTVNlbXZDMmNROHJDVk41cnpnZk96azg4MiIsInN1YiI6IjNhYk1TZW12QzJjUThyQ1ZONXJ6Z2ZPems4ODIiLCJpYXQiOjE1ODU4MTM3MzUsImV4cCI6MTU4NTgxNzMzNSwiZW1haWwiOiJzYUBhZ3JpbGVkZ2VyLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJzYUBhZ3JpbGVkZ2VyLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.RYpBffUZU3XYRpY1TwZaawdpuQ9hjSwHciCL7Xllg8Ov4F_HQQbe7G9swFPdd3317w7GLpkp9296Iw1YadfGnSC_ffS3CTu4cnx5wh3tQQipJh0HdgdaM3GLUN2jmFW2CNNABQju_DqzmL06wDcYstOySnvtlBpbF9mqea4PJN5UU8TfBRoMTKqAYldFlQldYs10hsA_vR-1A69FqCj2iNdYqB2SlP6Xo5zq6_WEvRVXo1aRBBW7U_O5XJK9YjmbB2MlqeYxk955HngKVFvae4xzDkjeRU_3GPlO-xBpwhBiyvTsx4pGeNLdrULe6Rz0inlGa-WipJeApn50bT95_Q"
            },
          }
        )
        .then(function(response) {
          currentVal.checkPenalityAPI(serviceId);
        })
        .catch(function(error) {
          console.log(error.message);
          //alert("fail");
          //refresh token
          let errorObject = JSON.parse(JSON.stringify(error));
          console.log(errorObject);
          if ((error.response.status == 401) || (errorObject.message.indexOf("401") > -1)) {
            firebase
              .auth()
              .currentUser.getIdToken(true)
              .then((idtoken) => {
                localStorage.IDtoken = "";
                localStorage.IDtoken = idtoken;
                currentVal.rejectAPICall(serviceId);
              });
          }
        });
    },
    saveRequest(servicerequestId) {
      var currentVal = this;
      console.log(this.checkedRows);
      var inpData = {
        cancelReason: this.cancelReason,
        status: "Cancelled",
      };
      var ref = firebase
        .database()
        .ref()
        .child("serviceRequest");
      if (this.checkedRows.length == 0) {
        var dbRef = ref
          .orderByChild("serviceRequestId")
          .equalTo(servicerequestId);
        dbRef.on("child_added", (data) => {
          var ref = firebase.database().ref("serviceRequest/" + data.key);
          inpData.updatedBy = localStorage.userName;
          ref.update(inpData).then(
            () => {
              currentVal.rejectAPICall(servicerequestId);
              Vue.$toast.open({
                message: "Status updated successfully.",
                type: "success",
                position: "top",
              });
              currentVal.checkedRows = [];
              currentVal.getData();
              currentVal.$refs["confirm-modal"].hide();
              console.log("success");
            },
            (error) => {
              console.log("error");
              currentVal.$refs["confirm-modal"].hide();
            }
          );
        });
      } else {
        this.checkedRows.forEach((element, i) => {
          var dbRef = ref.orderByChild("serviceRequestId").equalTo(element.Id);
          dbRef.on("child_added", (data) => {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            inpData.updatedBy = localStorage.userName;
            ref.update(inpData).then(
              () => {
                currentVal.rejectAPICall(element.Id);
                if (i == this.checkedRows.length - 1) {
                  Vue.$toast.open({
                    message: "Status updated successfully.",
                    type: "success",
                    position: "top",
                  });
                  currentVal.checkedRows = [];
                  currentVal.getData();
                  currentVal.$refs["confirm-modal"].hide();
                  currentVal.warningDiv = true;
                  currentVal.reasonDiv = false;
                  setTimeout(function() {
                    currentVal.cancelReason = "";
                  }, 3000);
                }
                console.log("success");
              },
              (error) => {
                currentVal.$refs["confirm-modal"].hide();
                console.log("error");
              }
            );
          });
        });
      }
    },
  },
};
</script>
<style>

#confirm-cancel-modal .modal-content {
  position: relative;
  margin: 0 auto;
  color: #fff;
  text-align: center;
  min-width: 400px;
  max-width: 400px;
}
#confirm-cancel-modal .modal-dialog {
  position: relative;
  margin: 0 auto;
  display: block;
  margin-top: 100px;
}
#confirm-cancel-modal .modal-body {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-right: 1px soild #000;
  border-left: 1px soild #000;
  border-bottom: 1px soild #000;
}
#confirm-cancel-modal .modal-header .close {
  color: #fff !important;
  font-size: 2.5rem !important;
  margin: -15px -4px !important;
  padding: 0 !important;
  display: none;
}
#confirm-cancel-modal .modal-title {
  margin: -9px auto;
  font-size: 16px;
}
#confirm-cancel-modal .modal-header {
  height: 50px !important;
}
</style>
<style scoped>
.download-pdf {
  height: 32px;
  width: 32px;
}
#reasontext {
  width: 238px;
  height: 60px;
}
.breadcrumbrow {
  top: -34px !important;
  left: 137px !important;
}
.location-text {
  float: left;
  min-width: 135px;
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

th:nth-child(3) {
  text-align: center;
}
th:nth-child(1) span span {
  background: url("../../assets/images/sort_by.png");
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
.location-img {
  width: 15px;
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
  padding: 11px 12px 7px 12px;
}
.sub-header-close-img {
  width: 16px;
  height: auto;
  cursor: pointer;
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
  /* height: auto; */
  height: 50px !important;
  padding: 15px;
  background: rgba(0, 0, 0, 0.616);
  border-radius: 5px 5px 0px 0px;
  border: 1px solid #000;
}
.main-container {
  background: rgba(0, 0, 0, 0.2);
}

.content-container {
  height: fit-content;
  margin: auto;
  margin-top: 40px;
  margin-bottom: 40px;
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
.total-records {
  position: absolute;
  bottom: 88px;
  left: 45px;
  color: #fff;
}
.btn-save {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 13px;
  width: 115px;
  height: 26px;
  margin: 5px;
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
.confirm-message-label {
  margin: 20px;
}
.btn-cancel-request {
  float: right;
  margin-right: 30px;
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
@media screen and (max-width: 360px) {
  .content-container {
    margin-top: 30px;
  }
}
</style>
<style>
.manage-service-request-table thead tr th:nth-child(7),
.manage-service-request-table thead tr th:nth-child(6),
.manage-service-request-table tbody tr td:nth-child(7),
.manage-service-request-table thead tr th:nth-child(10),
.manage-service-request-table tbody tr td:nth-child(10),
.manage-service-request-table thead tr th:nth-child(1),
.manage-service-request-table tbody tr td:nth-child(1),
.manage-service-request-table thead tr th:nth-child(9),
.manage-service-request-table tbody tr td:nth-child(9),
.manage-service-request-table thead tr th:nth-child(5),
.manage-service-request-table tbody tr td:nth-child(5),
.manage-service-request-table tbody tr td:nth-child(6) {
  text-align: center !important;
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
.whatwords-tooltiptext {
  width: 250px !important;
  text-align: left !important;
  padding: 10px !important;
  bottom: -15px;
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
.details-accordion {
  text-align: left !important;
}
</style>
