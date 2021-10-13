<template>
  <div class="service-requests">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-12 content-container">
        <div class="header-container">
          <h3 class="heading">
            {{ $t("Service Requests", "Service Requests") }}
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
                id="viewServiceRequeststable"
                ref="viewServiceRequeststable"
                :data="serviceRequests"
                :columns="columns"
                :options="options"
                class="tbl-services view-observer-service-request-table"
              >
                <template slot="Location" slot-scope="props">
                  <div>
                    <a class v-on:click="showMap(props.row.MapId)">
                      <img
                        class="location-img"
                        src="../../assets/images/location_pin.png"
                      />
                    </a>
                  </div>
                </template>
                <template slot="what3words" slot-scope="props">
                  <div
                    class="whatwords-wrap-active-sr tooltip whatwords-wrap-tooltip"
                  >
                    <span
                      class="tooltiptext whatwords-tooltiptext whatwords-tooltiptext-asr"
                    >
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

                <template slot="View More" slot-scope="props">
                  <div
                    class="plus-accordion"
                    v-if="props.row.Status != 'Pending Assign'"
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
                                      {{ accordionDetails.collectionTimestamp }}
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
                                      {{ accordionDetails.collectionPointName }}
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
                                      {{ accordionDetails.collectorName }}
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
                                      {{ accordionDetails.fruitsRejectedAtCP }}
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
                                      {{ accordionDetails.fruitsCollected }}
                                    </div>
                                  </div>
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
                                          "Time of departure from CP",
                                          "Time of departure from CP"
                                        )
                                      }}
                                    </div>
                                  </div>
                                  <div class="col-md-8">
                                    <div class="inner-data">
                                      {{ accordionDetails.timeOfDepartureAtCP }}
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
                                      {{ accordionDetails.arrivalAtPackhouse }}
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
                                      {{ accordionDetails.noOfBoxesShipped }}
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
                                      Broker Organization
                                    </div>
                                  </div>
                                  <div class="col-md-8">
                                    <div class="inner-data">
                                      {{ accordionDetails.brokerOrganization }}
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
                                      {{ accordionDetails.dateOfShipment }}
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
                                  "View Payment Details",
                                  "View Payment Details"
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
                                    Sale {{ saleIndex + 1 }} -
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
                                    <div class="col-md-6 first-row-accordion">
                                      <div class="row">
                                        <div class="col-md-4">
                                          <div class="inner-data">
                                            {{ $t("Sales Id", "Sales Id") }}
                                          </div>
                                        </div>
                                        <div class="col-md-8">
                                          <div class="inner-data">
                                            {{
                                              accordionDetails.sale[saleIndex]
                                                .saleId
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
                                              accordionDetails.sale[saleIndex]
                                                .soldOn
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
                                      </div>
                                    </div>
                                    <div class="col-md-6">
                                      <div class="row">
                                        <div class="col-md-4">
                                          <div class="inner-data">
                                            {{
                                              $t(
                                                "Net Sales (USD)",
                                                "Net Sales (USD)"
                                              )
                                            }}
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
                                                "Buyer Organization",
                                                "Buyer Organization"
                                              )
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-8">
                                          <div class="inner-data">
                                            {{
                                              accordionDetails.sale[saleIndex]
                                                .buyerOrganization
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-4">
                                          <div class="inner-data">
                                            {{
                                              $t(
                                                "Payment confirmed on",
                                                "Payment confirmed on"
                                              )
                                            }}
                                          </div>
                                        </div>
                                        <div class="col-md-8">
                                          <div class="inner-data">
                                            {{
                                              accordionDetails.sale[saleIndex]
                                                .paymentConfirmedOn
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
                  </template>
                </template>
              </v-client-table>
            </div>
          </div>
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
import getConfigVars from "../../shared/config-env";
import isAuthenticated from '../../shared/auth';

Vue.use(ClientTable);

export default {
  name: "service-requests",
  data: function() {
    return {
      serviceRequests: [],
      columns: [
        "Service Request Id",
        "Department / Town",
        "Product",
        "Estimated Fruits #",
        "Created By",
        "orderRequested",
        "Location",
        "what3words",
        "Status",
        "View More",
      ],
      options: {
        perPage: 10,
        headings: {
          "Service Request Id": `${this.$t(
            "Service Request Id",
            "Service Request Id"
          )}`,
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
          orderRequested: `${this.$t("Order Requested", "Order Requested")}`,
          Location: `${this.$t("Location", "Location")}`,
          what3words: `${this.$t("what3words", "what3words")}`,
          Status: `${this.$t("Status", "Status")}`,
          "View More": `${this.$t("View More", "View More")}`,
        },
        orderBy: {
          ascending: false,
          column: "orderRequested",
        },
        sortable: ["Producer", "orderRequested", "Status"],
        headings: {
          orderRequested: "Order Requested",
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
      seen: true,
      show: false,
      userName: "",
      totalRecords: 0,
      showIcons: true,
      detailsId: null,
      clickedId: null,
      previouslyClickedId: null,
      elHeight: 0,
      openPaneNum: 0,
      accordionDetails: null,
      accordionDetailsNetSales: null,
      accordionDetailsPaymentToLSP: null,
      accordionDetailsPenalties: null,
      accordionDetailsWeightOfFruitsSold: null,
      accordionDetailsNoOfBoxesSold: null,
    };
  },
  components: {
    Header,
    Footer,
  },
  mounted() {
    this.seen = true;
    if (
      localStorage.systemRole == 99 &&
      localStorage.prevPage == "sa-dashboard"
    ) {
       if(getConfigVars().USERID == isAuthenticated())
      {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Technology Service Provider-Dashboard", "Technology Service Provider-Dashboard"),
          href: "/sa-dashboard",
        },
        {
          text: this.$t("Observer-Dashboard", "Observer-Dashboard"),
          href: "/observer-dashboard",
        },
        {
          text: this.$t("Service Requests", "Service Requests"),
          href: "/view-service-requests",
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
          text: this.$t("Observer-Dashboard", "Observer-Dashboard"),
          href: "/observer-dashboard",
        },
        {
          text: this.$t("Service Requests", "Service Requests"),
          href: "/view-service-requests",
        },
      ]);
      }
    } else if (
      localStorage.systemRole == 99 &&
      localStorage.prevPage == "observer-dashboard"
    ) {
       if(getConfigVars().USERID == isAuthenticated())
      {
      this.$refs.headercomp.createBreadcrumb([
        {
      text: this.$t("Technology Service Provider-Dashboard", "Technology Service Provider-Dashboard"),
          href: "/sa-dashboard",
        },
        {
          text: this.$t("Observer-Dashboard", "Observer-Dashboard"),
          href: "/observer-dashboard",
        },
        {
          text: this.$t("Service Requests", "Service Requests"),
          href: "/view-service-requests",
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
          text: this.$t("Observer-Dashboard", "Observer-Dashboard"),
          href: "/observer-dashboard",
        },
        {
          text: this.$t("Service Requests", "Service Requests"),
          href: "/view-service-requests",
        },
      ]);
      localStorage.prevPage = "";
      }
    } else if (
      localStorage.systemRole == 99 &&
      localStorage.prevPage == "observer-mci-dashboard"
    ) {
      this.$refs.headercomp.createBreadcrumb([
        {
     text: this.$t("Root Authority-Dashboard", "Root Authority-Dashboard"),
          href: "/sa-dashboard",
        },
        {
          text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"),
          href: "/observer-mci-dashboard",
        },
        {
          text: this.$t("Service Requests", "Service Requests"),
          href: "/view-service-requests",
        },
      ]);
      localStorage.prevPage = "";
    } else if (localStorage.systemRole == 99) {
      
 if(getConfigVars().USERID == isAuthenticated())
      {

      this.$refs.headercomp.createBreadcrumb([
        {
       text: this.$t("Technology Service Provider-Dashboard", "Technology Service Provider-Dashboard"),
          href: "/sa-dashboard",
        },
        {
          text: this.$t("Observer-Dashboard", "Observer-Dashboard"),
          href: "/observer-dashboard",
        },
        {
          text: this.$t("Service Requests", "Service Requests"),
          href: "/view-service-requests",
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
          text: this.$t("Observer-Dashboard", "Observer-Dashboard"),
          href: "/observer-dashboard",
        },
        {
          text: this.$t("Service Requests", "Service Requests"),
          href: "/view-service-requests",
        },
      ]);
      localStorage.prevPage = "";
      }
    } else if (localStorage.systemRole == 9) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Admin-Dashboard", "Admin-Dashboard"),
          href: "/admin-dashboard",
        },
        {
          text: this.$t("Observer-Dashboard", "Observer-Dashboard"),
          href: "/observer-dashboard",
        },
        {
          text: this.$t("Service Requests", "Service Requests"),
          href: "/view-service-requests",
        },
      ]);
    } else if (localStorage.systemRole == 13) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Observer-Dashboard", "Observer-Dashboard"),
          href: "/observer-dashboard",
        },
        {
          text: this.$t("Service Requests", "Service Requests"),
          href: "/view-service-requests",
        },
      ]);
    } else if (localStorage.systemRole == 10) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"),
          href: "/observer-mci-dashboard",
        },
        {
          text: this.$t("Service Requests", "Service Requests"),
          href: "/view-service-requests",
        },
      ]);
    }
    this.options = {
      perPage: 10,
      headings: {
        "Service Request Id": `${this.$t(
          "Service Request Id",
          "Service Request Id"
        )}`,
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
        orderRequested: `${this.$t("Order Requested", "Order Requested")}`,
        Location: `${this.$t("Location", "Location")}`,
        what3words: `${this.$t("what3words", "what3words")}`,
        Status: `${this.$t("Status", "Status")}`,
        "View More": `${this.$t("View More", "View More")}`,
      },
      orderBy: {
        ascending: false,
        column: "orderRequested",
      },
      sortable: ["Producer", "orderRequested", "Status"],
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
    let currentValue = this;
    var dbRef = firebase.database().ref("masters/what3words");
    var ref = firebase
      .database()
      .ref()
      .child("serviceRequest");

    ref.on(
      "value",
      function(snapshot) {
        if (snapshot.val() != null) {
          if (localStorage.systemRole.includes(99)) {
            var indexcount = 0;

            snapshot.forEach((requestData) => {
              dbRef
                .orderByKey()
                .equalTo(requestData.val().farmerId)
                .on("child_added", (response) => {
                  currentValue.totalRecords++;
                  var status = "";
                  var isEditShown = false;
                  if (requestData.val().status == "New") {
                    status = "Pending Assign";
                    isEditShown = true;
                  } else {
                    status = requestData.val().status;
                  }
                  currentValue.serviceRequests.push({
                    // serviceRequestId: requestData.val().serviceRequestId,
                    //  Producer: requestData.val().producer,
                    id: indexcount,
                    "Department / Town":
                      requestData.val().department +
                      " / " +
                      requestData.val().town,
                    Product: requestData.val().product,
                    "Estimated Fruits #": requestData.val().estimatedNoFruits,
                    "Created By": requestData.val().serviceRequestcreatedBy
                      ? requestData.val().serviceRequestcreatedBy.split("(")[0]
                      : " ",
                    orderRequested: moment(
                      String(requestData.val().requestedOn)
                    ).format("MMM DD, YYYY hh:mm A"),
                    Location: requestData.val().location,
                    words: response.val().words,
                    country: response.val().country,
                    nearestPlace: response.val().nearestPlace,
                    map: response.val().map,
                    Status: status,
                    MapId: requestData.val().serviceRequestId,
                    Id:
                      requestData.val().displayId != undefined &&
                      requestData.val().displayId != null
                        ? requestData.val().displayId
                        : requestData.val().serviceRequestId,
                    "Service Request Id":
                      requestData.val().displayId != undefined &&
                      requestData.val().displayId != null
                        ? requestData.val().displayId
                        : requestData.val().serviceRequestId,
                    // isEditShown: isEditShown,
                    serviceRequestId: requestData.val().serviceRequestId,
                  });
                  indexcount++;
                  currentValue.seen = false;
                  currentValue.show = true;
                });
            });
            currentValue.seen = false;

            currentValue.serviceRequests.reverse();
          } else {
            var indexcount = 0;

            snapshot.forEach((requestData) => {
              if (
                requestData.val().organizationKey ==
                localStorage.organizationKey
              ) {
                dbRef
                  .orderByKey()
                  .equalTo(requestData.val().farmerId)
                  .on("child_added", (response) => {
                    currentValue.totalRecords++;
                    var status = "";
                    var isEditShown = false;
                    if (requestData.val().status == "New") {
                      status = "Pending Assign";
                      isEditShown = true;
                    } else {
                      status = requestData.val().status;
                    }
                    currentValue.serviceRequests.push({
                      // serviceRequestId: requestData.val().serviceRequestId,
                      //  Producer: requestData.val().producer,
                      id: indexcount,
                      "Department / Town":
                        requestData.val().department +
                        " / " +
                        requestData.val().town,
                      Product: requestData.val().product,
                      "Estimated Fruits #": requestData.val().estimatedNoFruits,
                      "Created By": requestData.val().serviceRequestcreatedBy
                        ? requestData
                            .val()
                            .serviceRequestcreatedBy.split("(")[0]
                        : " ",
                      orderRequested: moment(
                        String(requestData.val().requestedOn)
                      ).format("MMM DD, YYYY hh:mm A"),
                      Location: requestData.val().location,
                      words: response.val().words,
                      country: response.val().country,
                      nearestPlace: response.val().nearestPlace,
                      map: response.val().map,
                      Status: status,
                      MapId: requestData.val().serviceRequestId,
                      Id:
                        requestData.val().displayId != undefined &&
                        requestData.val().displayId != null
                          ? requestData.val().displayId
                          : requestData.val().serviceRequestId,
                      "Service Request Id":
                        requestData.val().displayId != undefined &&
                        requestData.val().displayId != null
                          ? requestData.val().displayId
                          : requestData.val().serviceRequestId,
                      // isEditShown: isEditShown,
                      serviceRequestId: requestData.val().serviceRequestId,
                    });
                    indexcount++;
                    currentValue.seen = false;
                    currentValue.show = true;
                  });
              }
            });
            currentValue.seen = false;

            currentValue.serviceRequests.reverse();
          }
        } else {
          currentValue.showIcons = false;
          currentValue.seen = false;
        }
      },
      function(error) {
        console.log("Error: " + error.code);
      }
    );
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
      vm.accordionDetailsWeightOfFruitsSold = [];
      vm.accordionDetailsNoOfBoxesSold = [];

      refSaleAccordion.on("child_added", (snapshotSale) => {
        console.log(snapshotSale.val());
        var saleDetails = {
          saleId: null,
          soldOn: null,
          buyerOrganization: null,
          paymentConfirmedOn: null,
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
              saleDetails.buyerOrganization = snapshotSale.val().sellBuyerOrganization;
              if (snapshotSale.val().dateAndTimeOfUnLoading != undefined)
                saleDetails.soldOn = moment(
                  String(snapshotSale.val().dateAndTimeOfUnLoading)
                )
                  .local()
                  .format("MMM DD, YYYY hh:mm A");
              if (
                snapshotSale.val().confirmPayment != undefined &&
                snapshotSale.val().confirmPayment.confrimPaymentDate !=
                  undefined
              )
                saleDetails.paymentConfirmedOn = moment(
                  String(snapshotSale.val().confirmPayment.confrimPaymentDate)
                )
                  .local()
                  .format("MMM DD, YYYY hh:mm A");
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
                  console.log(response);
                  vm.accordionDetailsNetSales.push(response.data.netSales);
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
              vm.accordionDetails.sale.push(saleDetails);
              break;
            }
          }
        }
        if (vm.previouslyClickedId != params.id) {
          vm.$refs.viewServiceRequeststable.toggleChildRow(
            vm.previouslyClickedId
          );
        }
        vm.$refs.viewServiceRequeststable.toggleChildRow(params.id);
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
          console.log(response);
          vm.accordionDetailsNetSales.push(response.data.netSales);
          response.data.lots.forEach((element) => {
            if (element.lotId == serviceRequestId) {
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
          .equalTo(params.serviceRequestId)
          .on("child_added", (snapshot) => {
            vm.accordionDetails = {
              collectionPointName: snapshot.val().collectionPoint,
              collectorName: snapshot.val().collector,
              fruitsRejectedAtCP: snapshot.val().fruitRejected,
              pdfContract: snapshot.val().agreementDocumentUrl,
              batchId: snapshot.val().batchId,
            };
            vm.accordionDetails.internalfruitTemperatureAtCP = snapshot.val().temperature;
            if (snapshot.val().timeofAdmittence != undefined)
              vm.accordionDetails.timeOfDepartureAtCP = moment(
                String(snapshot.val().timeofAdmittence)
              ).format("MMM DD, YYYY hh:mm A");
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
                vm.$refs.viewServiceRequeststable.toggleChildRow(
                  vm.previouslyClickedId
                );
              }
              vm.$refs.viewServiceRequeststable.toggleChildRow(params.id);
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
                      vm.$refs.viewServiceRequeststable.toggleChildRow(
                        vm.previouslyClickedId
                      );
                    }
                    vm.$refs.viewServiceRequeststable.toggleChildRow(params.id);
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
          vm.$refs.viewServiceRequeststable.toggleChildRow(
            vm.previouslyClickedId
          );
        }
        vm.$refs.viewServiceRequeststable.toggleChildRow(params.id);
        vm.previouslyClickedId = params.id;
        vm.seen = false;
      }
    },
    edit: function(id) {
      Router.push("modify-service-request/" + id);
    },
    showMap: function(id) {
      localStorage.prevPage = "view-service-requests";
      Router.push("observer-show-map/" + id);
    },
    showMapView: function(event) {
      localStorage.prevPage = "view-service-requests";
      Router.push("observer-map-view");
    },
    showServiceRequests: function(event) {
      localStorage.prevPage = "observer-dashboard";
      // Router.push("service-requests");
      Router.push("view-service-requests");
    },
    showCalenderView: function(event) {
      localStorage.prevPage = "view-service-requests";
      Router.push("observer-calender-view");
    },
    showDashboard: function() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else if (localStorage.systemRole == 13) {
        Router.push("observer-dashboard");
      } else if (localStorage.systemRole == 10) {
        Router.push("observer-mci-dashboard");
      } else {
        Router.push("dashboard");
      }
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
      } else if (localStorage.systemRole == 13) {
        Router.push("observer-dashboard");
      } else if (localStorage.systemRole == 10) {
        Router.push("observer-mci-dashboard");
      } else {
        Router.push("dashboard");
      }
    },
  },
};
</script>
<style scoped>
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
.view-observer-service-request-table thead tr th:nth-child(5),
.view-observer-service-request-table tbody tr td:nth-child(5) {
  /* text-align: center !important; */
  text-align: center !important;
}
.view-observer-service-request-table thead tr th:nth-child(4),
.view-observer-service-request-table tbody tr td:nth-child(4) {
  /* text-align: center !important; */
  text-align: center !important;
}
.view-observer-service-request-table thead tr th:nth-child(8),
.view-observer-service-request-table tbody tr td:nth-child(8) {
  text-align: left !important;
}
.view-observer-service-request-table .VueTables__search-field input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}
.view-observer-service-request-table .VueTables__limit-field select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
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
.whatwords-wrap-active-sr {
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
.whatwords-tooltiptext-asr {
  left: 50px;
}
</style>
