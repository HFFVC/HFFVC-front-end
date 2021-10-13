<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-12 content-container">
        <div class="header-container">
          <h3 class="heading">
            {{ $t("Previous Service Requests", "Previous Service Requests") }}
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
          <div id="people">
            <v-client-table
              :data="serviceRequests"
              :columns="columns"
              :options="options"
              id="previousServiceRequeststable"
              ref="previousServiceRequeststable"
              class="tbl-services previous-requests-table"
            >
              <template slot="Location" slot-scope="props">
                <div>
                  <div class="location-text">{{ props.row.Location }}</div>
                  <a class="fa fa-edit" v-on:click="showMap(props.row.Id)">
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
              <template slot="View More" slot-scope="props">
                <div   v-if="props.row.Status != 'Pending Assign' && props.row.Status != 'Rejected' && props.row.Status != 'Cancelled'" class="plus-accordion">
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
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{
                                      $t(
                                        "Collection Time Stamp",
                                        "Collection Time Stamp"
                                      )
                                    }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{ accordionDetails.collectionTimestamp }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{
                                      $t(
                                        "Collection Point Name",
                                        "Collection Point Name"
                                      )
                                    }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{ accordionDetails.collectionPointName }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{ $t("Collector Name", "Collector Name") }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{ accordionDetails.collectorName }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{
                                      $t(
                                        "Fruits Rejected at CP",
                                        "Fruits Rejected at CP"
                                      )
                                    }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{ accordionDetails.fruitsRejectedAtCP }}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="row">
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{
                                      $t("Fruits Collected", "Fruits Collected")
                                    }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{ accordionDetails.fruitsCollected }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{
                                      $t(
                                        "Internal temp. of Fruit @ CP",
                                        "Internal temp. of Fruit @ CP"
                                      )
                                    }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{
                                      accordionDetails.internalfruitTemperatureAtCP
                                    }}
                                    (&#8451;)
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{
                                      $t(
                                        "Time of departure from CP",
                                        "Time of departure from CP"
                                      )
                                    }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{ accordionDetails.timeOfDepartureAtCP }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{
                                      $t(
                                        "Arrival at Packhouse",
                                        "Arrival at Packhouse"
                                      )
                                    }}
                                  </div>
                                </div>
                                <div class="col-md-6">
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
                        aria-expanded="false"
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
                        v-if="
                          accordionDetails.batchId != undefined &&
                          accordionDetails.batchId.length > 0
                        "
                      >
                        <div class="card-body">
                          <div class="row">
                            <div class="col-md-6 first-row-accordion">
                              <div class="row">
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{ $t("Batch Id", "Batch Id") }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{ accordionDetails.batchId }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{
                                      $t(
                                        "No. of boxes shipped",
                                        "No. of boxes shipped"
                                      )
                                    }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{ accordionDetails.noOfBoxesShipped }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{
                                      $t(
                                        "Weight of Fruits Shipped (in Kgs)",
                                        "Weight of Fruits Shipped (in Kgs)"
                                      )
                                    }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{ accordionDetails.weightOffruitsShipped }}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="row">
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{
                                      $t(
                                        "Fruits rejected at Packhouse",
                                        "Fruits rejected at Packhouse"
                                      )
                                    }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{
                                      accordionDetails.fruitsRejectedAtPackhouse
                                    }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{
                                      $t(
                                        "Broker Organization",
                                        "Broker Organization"
                                      )
                                    }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{ accordionDetails.brokerOrganization }}
                                  </div>
                                </div>
                                <div class="col-md-6">
                                  <div class="inner-data">
                                    {{
                                      $t(
                                        "Date of shipment (Pro-forma creation Date)",
                                        "Date of shipment (Pro-forma creation Date)"
                                      )
                                    }}
                                  </div>
                                </div>
                                <div class="col-md-6">
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
                              $t("View Payment Details", "View Payment Details")
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
                                  {{ $t("Sale", "Sale") }} {{ saleIndex + 1 }} -
                                  {{ accordionDetails.sale[saleIndex].saleId }}
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
                                      <div class="col-md-6">
                                        <div class="inner-data">
                                          {{ $t("Sold On", "Sold On") }}
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <div class="inner-data">
                                          {{
                                            accordionDetails.sale[saleIndex]
                                              .soldOn
                                          }}
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <div class="inner-data">
                                          {{
                                            $t(
                                              "Weight of Fruits Sold (in Kgs)",
                                              "Weight of Fruits Sold (in Kgs)"
                                            )
                                          }}
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <div class="inner-data">
                                          {{
                                            accordionDetailsWeightOfFruitsSold[
                                              saleIndex
                                            ]
                                          }}
                                        </div>
                                      </div>

                                      <!-- <div class="col-md-6">
                                        <div class="inner-data">Price per kg</div>
                                      </div>
                                      <div class="col-md-6">
                                        <div
                                          class="inner-data"
                                        >{{accordionDetails.sale[saleIndex].pricePerKg}}</div>
                                      </div>-->
                                    </div>
                                  </div>
                                  <div class="col-md-6">
                                    <div class="row">
                                      <div class="col-md-6">
                                        <div class="inner-data">
                                          {{
                                            $t(
                                              "No. of Boxes Sold",
                                              "No. of Boxes Sold"
                                            )
                                          }}
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <div class="inner-data">
                                          {{
                                            accordionDetailsNoOfBoxesSold[
                                              saleIndex
                                            ]
                                          }}
                                        </div>
                                      </div>
                                      <!-- <div class="col-md-6">
                                        <div class="inner-data">Net Sales (USD)</div>
                                      </div>
                                      <div class="col-md-6">
                                        <div
                                          class="inner-data"
                                        >{{accordionDetailsNetSales[saleIndex]}}</div>
                                      </div>-->
                                      <div class="col-md-6">
                                        <div class="inner-data">
                                          {{
                                            $t(
                                              "Payment to LSP (USD)",
                                              "Payment to LSP (USD)"
                                            )
                                          }}
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <div class="inner-data">
                                          {{
                                            accordionDetailsPaymentToLSP[
                                              saleIndex
                                            ]
                                          }}
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <div class="inner-data">
                                          {{
                                            $t(
                                              "Penalties (If any)",
                                              "Penalties (If any)"
                                            )
                                          }}
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <div class="inner-data">
                                          {{
                                            accordionDetailsPenalties[saleIndex]
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
      <Footer ref="footercomp"></Footer>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../../router";
import firebase from "firebase";
import "../../assets/css/main.css";
import "../../assets/css/common.css";
import "../../assets/css/manage-services.css";
import { ClientTable } from "vue-tables-2";
import moment from "moment";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from '../../shared/auth';

Vue.use(ClientTable);

export default {
  name: "previous-service-requests",
  data: function () {
    return {
      serviceRequests: [],
      columns: [
        "Organization",
        "Service Request Id",
        "collectionRequestedOn",
        "Product",
        "Producer",
        "Department / Town",
        "Location",
        "what3words",
        "Estimated Fruits #",
        "Status",
        "View More",
      ],
      seen: true,
      show: false,
      userName: "",
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
      options: {
        perPage: 10,
        sortable: ["Producer", "collectionRequestedOn", "Status"],
        orderBy: {
          ascending: false,
          column: "collectionRequestedOn",
        },
        headings: {
          "Service Request Id": `${this.$t(
            "Service Request Id",
            "Service Request Id"
          )}`,
          collectionRequestedOn: `${this.$t(
            "Collection Requested On",
            "Collection Requested On"
          )}`,
          Product: `${this.$t("Product", "Product")}`,
          Producer: `${this.$t("Producer", "Producer")}`,
          "Department / Town": `${this.$t(
            "Department / Town",
            "Department / Town"
          )}`,
          Location: `${this.$t("Location", "Location")}`,
          what3words: `${this.$t("what3words", "what3words")}`,
          "Estimated Fruits #": `${this.$t(
            "Estimated Fruits #",
            "Estimated Fruits #"
          )}`,
          Status: `${this.$t("Status", "Status")}`,
          "View More": `${this.$t("View More", "View More")}`,
        },
        customSorting: {
          collectionRequestedOn: function (ascending) {
            return function (a, b) {
              let dateA = new Date(a.collectionRequestedOn);
              let dateB = new Date(b.collectionRequestedOn);

              if (ascending) return dateA >= dateB ? 1 : -1;

              return dateA <= dateB ? 1 : -1;
            };
          },
        },
      },
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
            "Packhouse Incharge-Dashboard",
            "Packhouse Incharge-Dashboard"
          ),
          href: "/pack-house-incharge-dashboard",
        },
        {
          text: this.$t(
            "Previous Service Requests",
            "Previous Service Requests"
          ),
          href: "/previous-service-requests",
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
              "Packhouse Incharge-Dashboard",
              "Packhouse Incharge-Dashboard"
            ),
            href: "/pack-house-incharge-dashboard",
          },
          {
            text: this.$t(
              "Previous Service Requests",
              "Previous Service Requests"
            ),
            href: "/previous-service-requests",
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
              "Packhouse Incharge-Dashboard",
              "Packhouse Incharge-Dashboard"
            ),
            href: "/pack-house-incharge-dashboard",
          },
          {
            text: this.$t(
              "Previous Service Requests",
              "Previous Service Requests"
            ),
            href: "/previous-service-requests",
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
            text: this.$t(
              "Previous Service Requests",
              "Previous Service Requests"
            ),
            href: "/previous-service-requests",
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
              "Packhouse Incharge-Dashboard",
              "Packhouse Incharge-Dashboard"
            ),
            href: "/pack-house-incharge-dashboard",
          },
          {
            text: this.$t(
              "Previous Service Requests",
              "Previous Service Requests"
            ),
            href: "/previous-service-requests",
          },
        ]);
      } else if (localStorage.systemRole == 2) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t(
              "Packhouse Incharge-Dashboard",
              "Packhouse Incharge-Dashboard"
            ),
            href: "/pack-house-incharge-dashboard",
          },
          {
            text: this.$t(
              "Previous Service Requests",
              "Previous Service Requests"
            ),
            href: "/previous-service-requests",
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
            text: this.$t(
              "Previous Service Requests",
              "Previous Service Requests"
            ),
            href: "/previous-service-requests",
          },
        ]);
      }
    }
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.options = {
      perPage: 10,
      sortable: ["Producer", "collectionRequestedOn", "Status"],
      orderBy: {
        ascending: false,
        column: "collectionRequestedOn",
      },
      headings: {
        "Service Request Id": `${this.$t(
          "Service Request Id",
          "Service Request Id"
        )}`,
        collectionRequestedOn: `${this.$t(
          "Collection Requested On",
          "Collection Requested On"
        )}`,
        Product: `${this.$t("Product", "Product")}`,
        Producer: `${this.$t("Producer", "Producer")}`,
        "Department / Town": `${this.$t(
          "Department / Town",
          "Department / Town"
        )}`,
        Location: `${this.$t("Location", "Location")}`,
        what3words: `${this.$t("what3words", "what3words")}`,
        "Estimated Fruits #": `${this.$t(
          "Estimated Fruits #",
          "Estimated Fruits #"
        )}`,
        Status: `${this.$t("Status", "Status")}`,
        "View More": `${this.$t("View More", "View More")}`,
      },
      customSorting: {
        collectionRequestedOn: function (ascending) {
          return function (a, b) {
            let dateA = new Date(a.collectionRequestedOn);
            let dateB = new Date(b.collectionRequestedOn);

            if (ascending) return dateA >= dateB ? 1 : -1;

            return dateA <= dateB ? 1 : -1;
          };
        },
      },
    };
    this.userName = localStorage.userName;
    var retrievedObject = localStorage.getItem("producerList");
    var producerList = JSON.parse(retrievedObject);
    let currentValue = this;
    var dbRefLoc = firebase.database().ref("masters/what3words");

    var ref = firebase.database().ref().child("serviceRequest");
    var count = 0;
    currentValue
      .getHarvestPlannersList()
      .then((harvestPlanners) => {
        console.log(harvestPlanners);
        ref.on(
          "child_added",
          function (snapshot) {
            dbRefLoc
              .orderByKey()
              .equalTo(snapshot.val().farmerId)
              .on("child_added", (response) => {
                if (snapshot.val() != null) {
                  var status = "";
                  if (snapshot.val().status != "New") {
                    const _data = {
                      id: count,
                      "Service Request Id":
                        snapshot.val().displayId != undefined &&
                        snapshot.val().displayId != null
                          ? snapshot.val().displayId
                          : snapshot.val().serviceRequestId,
                      collectionRequestedOn: moment(
                        String(snapshot.val().requestedOn)
                      )
                        .local()
                        .format("MMM DD, YYYY hh:mm A"),
                      Product: currentValue.$t(
                        snapshot.val().product,
                        snapshot.val().product
                      ),
                      Producer: snapshot.val().producer,
                      "Department / Town":
                        snapshot.val().department + " / " + snapshot.val().town,
                      Location: snapshot.val().location,
                      "Estimated Fruits #": snapshot.val().estimatedNoFruits,
                      Status: snapshot.val().status,
                      Id: snapshot.val().serviceRequestId,
                      words: response.val().words,
                      country: response.val().country,
                      nearestPlace: response.val().nearestPlace,
                      map: response.val().map,
                      createdBy: snapshot.val().createdBy,
                      collectionPoint: snapshot.val().collectionPoint,
                      dropOffAtPackhouse: snapshot.val().dropOffAtPackhouse,
                      collector: snapshot.val().collector,
                      scheduledOn: snapshot.val().pickupAddedOn,
                      Organization: snapshot.val().organization,
                    };
                    if (
                      snapshot.val().organizationKey ==
                      localStorage.organizationKey
                    ) {
                      currentValue.serviceRequests.push(_data);
                    } else if (localStorage.systemRole.includes(99)) {
                      currentValue.serviceRequests.push(_data);
                      // const createdBy = (() => {
                      //   if (snapshot.val().serviceRequestcreatedBy) {
                      //     const name = snapshot
                      //       .val()
                      //       .serviceRequestcreatedBy.split("(")[0];
                      //     return name.trim();
                      //   }
                      // })();
                      // if (harvestPlanners.includes(createdBy)) {
                      //   currentValue.serviceRequests.push(_data);
                      // }
                    }

                    count++;
                  }
                  currentValue.seen = false;
                  currentValue.show = true;
                  currentValue.serviceRequests.reverse();
                   setTimeout(function () {
                  if (currentValue.serviceRequests.length == 0) {
                    currentValue.seen = false;
                    currentValue.showIcons = false;
                  }
                }, 4000);
                } else {
                  currentValue.showIcons = false;
                  currentValue.seen = false;
                }
              
              });
              
          },
          function (error) {
            console.log("Error: " + error.code);
          }
        );
          setTimeout(function () {
                  if (currentValue.serviceRequests.length == 0) {
                    currentValue.seen = false;
                    currentValue.showIcons = false;
                  }
                }, 4000);
      })
      .catch(() => {
        console.log("No harvest planners found");
        currentValue.seen = false;
      });
  },
  methods: {
    ShowSaleAccordion(params, batchId, serviceRequest) {
      var vm = this;
      var refSaleAccordion = firebase
        .database()
        .ref()
        .child("batch/" + batchId + "/sell");
      vm.accordionDetails.sale = [];
      vm.accordionDetailsNetSales = [];
      vm.accordionDetailsPaymentToLSP = [];
      vm.accordionDetailsPenalties = [];
      vm.accordionDetailsWeightOfFruitsSold = [];
      vm.accordionDetailsNoOfBoxesSold = [];
      var indexCount = 0;
      refSaleAccordion.on("child_added", (snapshotSale) => {
        console.log(snapshotSale.val());
        var saleDetails = {
          saleId: null,
          soldOn: null,
          pricePerKg: null,
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
                .then(function (response) {
                  console.log(response);
                  vm.accordionDetailsNetSales.push(response.data.netSales);
                  response.data.sales.forEach((item) => {
                    if (item.role == "LSP") {
                      vm.accordionDetailsPaymentToLSP.push(item.amount);
                    }
                  });
                  if (
                    response.data.lots != undefined &&
                    response.data.lots.length > 0
                  )
                    response.data.lots.forEach((element) => {
                      if (element.lotId == serviceRequest.serviceRequestId) {
                        if (
                          element.penalties != undefined &&
                          element.penalties.length > 0
                        ) {
                          var amount = 0;
                          element.penalties.forEach((penalty) => {
                            amount += penalty.amount;
                          });
                          vm.accordionDetailsPenalties.push(amount);
                        }
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
                        vm.accordionDetailsNoOfBoxesSold.push(
                          element.boxesSold
                        );
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
              saleDetails.pricePerKg = snapshotSale.val().salesPricePerKg;
              vm.accordionDetails.sale.push(saleDetails);
              break;
            }
          }
        }

        if (vm.previouslyClickedId != params.id) {
          vm.$refs.previousServiceRequeststable.toggleChildRow(
            vm.previouslyClickedId
          );
        }
        vm.$refs.previousServiceRequeststable.toggleChildRow(params.id);
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
        .then(function (response) {
          console.log(response);
          vm.accordionDetailsNetSales.push(response.data.netSales);
          response.data.sales.forEach((item) => {
            if (item.role == "LSP") {
              vm.accordionDetailsPaymentToLSP.push(item.amount);
            }
          });
          if (response.data.lots != undefined && response.data.lots.length > 0)
            response.data.lots.forEach((element) => {
              if (element.lotId == snapshot.val().serviceRequestId) {
                if (
                  element.penalties != undefined &&
                  element.penalties.length > 0
                ) {
                  var amount = 0;
                  element.penalties.forEach((penalty) => {
                    amount += penalty.amount;
                  });
                  vm.accordionDetailsPenalties.push(amount);
                }
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
        var refAccordion = firebase.database().ref().child("serviceRequest");
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
              internalfruitTemperatureAtCP: snapshot.val().temperature,
              batchId: snapshot.val().batchId,
            };
            if (snapshot.val().dateOfPickup != undefined)
              vm.accordionDetails.collectionTimestamp = moment(
                String(snapshot.val().dateOfPickup)
              )
                .local()
                .format("MMM DD, YYYY hh:mm A");
            if (snapshot.val().timeofAdmittence != undefined)
              vm.accordionDetails.timeOfDepartureAtCP = moment(
                String(snapshot.val().timeofAdmittence)
              ).format("MMM DD, YYYY hh:mm A");
            if (snapshot.val().arrivedAtPackhouseAddedOn != undefined)
              vm.accordionDetails.arrivalAtPackhouse = moment(
                String(snapshot.val().arrivedAtPackhouseAddedOn)
              )
                .local()
                .format("MMM DD, YYYY hh:mm A");
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
              if (vm.previouslyClickedId != params.id) {
                vm.$refs.previousServiceRequeststable.toggleChildRow(
                  vm.previouslyClickedId
                );
              }
              vm.$refs.previousServiceRequeststable.toggleChildRow(params.id);
              vm.previouslyClickedId = params.id;
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
                  // console.log(snapshotBatch.val());
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
                  vm.ShowSaleAccordion(
                    params,
                    snapshot.val().batchId,
                    snapshot.val()
                  );
                  if (
                    snapshotBatch.val().sell == undefined ||
                    snapshotBatch.val().sell == null
                  ) {
                    if (vm.previouslyClickedId != params.id) {
                      vm.$refs.previousServiceRequeststable.toggleChildRow(
                        vm.previouslyClickedId
                      );
                    }
                    vm.$refs.previousServiceRequeststable.toggleChildRow(
                      params.id
                    );
                    vm.previouslyClickedId = params.id;
                    vm.seen = false;
                  }
                });
            }
          });
        //fetch ends
      } else {
        if (vm.previouslyClickedId != params.id) {
          vm.$refs.previousServiceRequeststable.toggleChildRow(
            vm.previouslyClickedId
          );
        }
        vm.$refs.previousServiceRequeststable.toggleChildRow(params.id);
        vm.previouslyClickedId = params.id;
        vm.seen = false;
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
    showMap: function (id) {
      Router.push("previous-service-map/" + id);
    },
    showMapView: function (event) {
      Router.push("previous-service-map-view");
    },
    showServiceRequests: function (event) {
      Router.push("previous-service-requests");
    },
    showCalenderView: function (event) {
      Router.push("previous-service-calender-view");
    },
    showDashboard: function () {
      Router.push("pack-house-incharge-dashboard");
    },
    showMoreDetails(id) {
      console.log(id);
      this.detailsId = id;
      console.log(this.detailsId);
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
    getHarvestPlannersList() {
      let harvestPlanners = [];
      return new Promise((resolve, reject) => {
        const ref = firebase
          .database()
          .ref()
          .child("profile")
          .orderByChild("systemRole")
          .equalTo(1);

        ref.on("value", function (snapshot) {
          snapshot.forEach((requestData) => {
            console.log(requestData.val());

            if (
              localStorage.systemRole == 99 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 7
            ) {
              if (requestData.val().createdBy) {
                harvestPlanners.push(
                  `${requestData.val().firstName} ${requestData.val().lastName}`
                );
              }
            } else {
              if (
                requestData.val().createdBy &&
                requestData.val().createdBy == localStorage.userName
              ) {
                if (requestData.val().createdBy) {
                  harvestPlanners.push(
                    `${requestData.val().firstName} ${
                      requestData.val().lastName
                    }`
                  );
                }
              }
            }
          });
          resolve(harvestPlanners);
        });
      });
    },
  },
};
</script>
<style scoped>
.previous-requests-table thead th {
  font-weight: bold;
}
thead tr th {
  font-weight: 400;
}
tbody tr td {
  font-weight: 400;
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
</style>
<style>
.previous-requests-table tbody tr td:nth-child(6) {
  text-align: center !important;
  /* width: 170px;
  padding-right: 65px !important; */
}
.previous-requests-table tbody tr td:nth-child(7),
.previous-requests-table tbody tr th:nth-child(7) {
  text-align: center !important;
  /* width: 170px;
  padding-right: 65px !important; */
}
.previous-requests-table thead tr th:nth-child(5),
.previous-requests-table tbody tr td:nth-child(5) {
  text-align: center !important;
}
.previous-requests-table .VueTables__search-field input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid !important;
  border-radius: 3px !important;
}
.previous-requests-table .VueTables__limit-field select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid !important;
  border-radius: 3px !important;
}
@media screen and (max-width: 768px) {
  ul li {
    padding: 12px 10px 10px 10px !important;
  }
  .previous-requests-table tbody tr td:nth-child(6) {
    width: auto !important;
    padding-right: 30px !important;
  }
}
</style>
<style scoped>
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
  /* padding: 20px; */
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
  border-top: 0px !important;
}

.content-container {
  height: fit-content;
  margin: auto;
  margin-top: -30px;
}
.main-header {
  height: fit-content;
  padding: 20px;
  background: rgba(0, 0, 0, 0.616);
  border: 1px solid #000;
  height: 100px;
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
  margin-left: 10px;
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
/* 
.header-container {
  height: auto;
  padding: 20px;
  background: rgba(0, 0, 0, 0.616);
  border-radius: 5px 5px 0px 0px;
  border: 1px solid #000;
} */
.main-container {
  background: rgba(0, 0, 0, 0.2);
}

.content-container {
  height: fit-content;
  margin: auto;
  margin-top: 40px;
  margin-bottom: 40px;
}
.main-header {
  height: fit-content;
  padding: 20px;
  background: rgba(0, 0, 0, 0.616);
  border: 1px solid #000;
  height: 78px;
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
.more-details-icon {
  font-size: 25px;
  float: left;
  margin-top: -6px;
  margin-right: 10px;
}
.more-details-table {
  border: 1px solid #000 !important;
}
.more-details-table tr:nth-child(even) {
  background: transparent !important;
}
.more-details-table td {
  text-align: left !important;
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
@media screen and (max-width: 1063px) and (min-width: 768px) {
  .col-md-6 {
    max-width: 100% !important;
    width: 100% !important;
    flex: 100%;
  }
}
</style>
