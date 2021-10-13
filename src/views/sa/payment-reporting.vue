<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>

    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-12 content-container">
        <div class="header-container">
          <h3 class="heading">
            {{ $t("Payment Details", "Payment Details") }}
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
              :data="paymentReportingRequests"
              :columns="columns"
              :options="options"
              id="paymenttable"
              ref="paymenttable"
              class="tbl-services payment-reporting-table"
            >
              <template slot="Distribution" slot-scope="props">
                <div>
                  <button class="btn-save" @click="showDistribution(props.row)">
                    {{ $t("View Distribution", "View Distribution") }}
                  </button>
                </div>
              </template>
              <template slot="Feedback" slot-scope="props">
                <div v-if="props.row.isFeedbackExists">
                  <button class="btn-save" @click="viewFeedback(props.row)">
                    {{ $t("View Feedback", "View Feedback") }}
                  </button>
                </div>
              </template>
              <template
                ref="lotRows"
                slot-scope="props"
                v-if="props.row.id == clikedId"
                slot="child_row"
              >
                <table
                  style="width: 100%"
                  border="0"
                  class="lots-table"
                  id="lotstable"
                >
                  <!-- working here -->
                  <tr>
                    <th>
                      {{ $t("Service Request Id", "Service Request Id") }}
                    </th>

                    <th v-if="isNotObserver">
                      {{ $t("Producer Name", "Producer Name") }}
                    </th>
                    <th>
                      {{ $t("Payment To Producer", "Payment To Producer") }}
                    </th>
                    <th>
                      {{ $t("Advance Given", "Advance Given") }}
                    </th>
                    <!-- <th>{{ $t("NGO", "NGO") }}</th>
                    <th>{{ $t("Payment To NGO", "Payment To NGO") }}</th> -->
                    <th>{{ $t("Penalties", "Penalties") }}</th>
                       <th>{{ $t("View Advance Feedback", "View Advance Feedback") }}</th>
                  </tr>

                  <tr v-bind:key="singleVal" v-for="singleVal in lotsview">
                    <td>{{ singleVal.displayId }}</td>
                    <td v-if="isNotObserver">{{ singleVal.producerName }}</td>
                    <td>${{ Number(singleVal.producerAmount).toFixed(2) }}</td>
                    <td>${{ Number(singleVal.advanceGiven).toFixed(2) }}</td>

                    <!-- <td>{{ singleVal.ngoName }}</td>
                    <td>{{ singleVal.ngoAmount }}</td> -->
                    <td>
                      <p v-if="singleVal.penalties.length > 0">
                        <b-button
                          v-b-toggle.collapse-1-inner
                          @click="showPenalties(singleVal.lotId)"
                          class="btn-save"
                          >{{
                            $t("View Penalties", "View Penalties")
                          }}</b-button
                        >
                      </p>
                    </td>

                      <td>
                      <p >
                        <b-button
                          v-b-toggle.collapse-1-inner
                          @click="showFeedbackFiles(singleVal.lotId)"
                          class="btn-savefeed"
                          >{{
                            $t("View Advance Feedback", "View Advance Feedback")
                          }}</b-button
                        >
                      </p>
                    </td>

                    
                  </tr>
                </table>
              </template>
              <template slot="Lots" slot-scope="props">
                <div>
                  <button
                    class="btn-save btn-lot"
                    @click="showLots(props.row, props.index)"
                  >
                    {{ $t("View Lots", "View Lots") }}
                  </button>
                </div>
              </template>

              <!-- <template slot="Lots" slot-scope="props">
                <div>
                  <button
                    class="btn-save"
                    @click="showChildLots(props.row, props.index)"
                  >
                    +
                  </button>
                </div>
              </template>-->
              <!-- <tr slot="prependHead" id="lotrow" v-if="displayLots">
                <td colspan="7">
                  <v-client-table
                    :data="lotsview"
                    :columns="lotcolumns"
                    id="lotDisplayTable"
                    class="tbl-services lot-display-table"
                  >
                    <template
                      slot="Penalties"
                      v-if="showPenalities"
                      slot-scope="props"
                    >
                      <div>
                     
                        <b-button
                          v-b-toggle.collapse-1-inner
                          @click="showPenalties(props.row.id)"
                          class="btn-save"
                          >View Penalties</b-button
                        >
                      </div>
                    </template>
                    <template slot="Penalties" v-if="hidePenalities">
                      <div>
                        <span>Nil</span>
                      </div>
                    </template>
                  </v-client-table>
                </td>
              </tr>-->

              <!-- <template slot="child_row" scope="props">
                {{ props.index }}
                <div>
                  <v-client-table
                    :data="lotsview"
                    :columns="lotcolumns"
                    id="lotDisplayTable"
                    class="tbl-services lot-display-table">
                  </v-client-table>
                </div>
              </template>-->

              <!-- <template slot="child_row" id="props.index" scope="props">
                <div>
                  <p>The link to {{props.row["Sale Id"]}} is</p>
                  <b-button v-b-toggle.collapse-1-inner size="sm">Toggle Inner Collapse</b-button>
                  <b-collapse id="collapse-1-inner" class="mt-2">
                    <b-card>Hello!</b-card>
                  </b-collapse>
                </div>
              </template>-->

              <!-- <div>
                <b-collapse id="collapse-1" class="mt-2">
                  <b-card>
                    <p class="card-text">Collapse contents Here</p>
                    <b-button v-b-toggle.collapse-1-inner size="sm">Toggle Inner Collapse</b-button>
                    <b-collapse id="collapse-1-inner" class="mt-2">
                      <b-card>Hello!</b-card>
                    </b-collapse>
                  </b-card>
                </b-collapse>
              </div>-->
            </v-client-table>
          </div>
        </div>
      </div>

      <div class="break-down-popup">
        <b-modal
          hide-footer
          no-close-on-backdrop
          id="modalLots"
          ref="modalLots"
          hide-backdrop
          :title="$t('Lots', 'Lots')"
          @hide="hideModal()"
        >
          <div class="row-content">
            <div class="col-md-12 content-container-inner">
              <div class="main-container">
                <div>
                  <perfect-scrollbar class="view-ds-ps">
                    <table
                      style="width: 100%"
                      border="0"
                      class="pdf-table table table-striped table-bordered table-hover"
                    >
                      <tr>
                        <th>
                          {{ $t("Service Request Id", "Service Request Id") }}
                        </th>
                        <th>
                          {{ $t("Payment To Producer", "Payment To Producer") }}
                        </th>
                        <!-- <th>{{ $t("Payment To NGO", "Payment To NGO") }}</th> -->
                        <th>{{ $t("Penalties", "Penalties") }}</th>
                          
                      </tr>
                    </table>
                  </perfect-scrollbar>
                </div>
              </div>
              <div class="row">
                <span class="color-white"
                  >*
                  {{
                    $t("All payments are in USD", "All payments are in USD")
                  }}</span
                >
                <div class="btn-wrap">
                  <input
                    type="button"
                    id="ignoreThis"
                    @click="showPDF"
                    class="btn-save btn-save-pdf"
                    :value="$t('Download as PDF', 'Download as PDF')"
                  />
                </div>
              </div>
            </div>

            <p id="ignorePDF"></p>
          </div>
        </b-modal>
      </div>

      <div class="break-down-popup">
        <b-modal
          hide-footer
          no-close-on-backdrop
          id="modalbreakdown"
          ref="details-modal"
          hide-backdrop
          :title="$t('Payment Breakdown', 'Payment Breakdown')"
          @hide="hideModal()"
        >
          <!-- <perfect-scrollbar class="modal-scroll">
          <div class="inp-container">
            <label class="input-label">Service Request ID</label>
            <input class="text-input" type="text" v-model="serviceRequestId" readonly />
          </div>
          <div class="inp-container">
            <label class="input-label">Sale Id</label>
            <input class="text-input" type="text" readonly v-model="saleId" />
          </div>
          <div class="inp-container">
            <label class="input-label">Sold On</label>
            <input class="text-input" type="text" v-model="soldOn" readonly />
          </div>
          <div class="inp-container">
            <label class="input-label">Weight of Fruits sold (in Kg)</label>
            <input class="text-input" type="text" v-model="totalFruitsWeight" readonly />
          </div>
          <div class="inp-container">
            <label class="input-label">Net Sales</label>
            <input class="text-input" type="text" v-model="netSales" readonly />
          </div>
          <div class="inp-container">
            <label class="input-label">Producer Name</label>
            <input class="text-input" type="text" v-model="producerName" readonly />
          </div>
          <div class="inp-container">
            <label class="input-label">Payment to Producer in USD</label>
            <input class="text-input" type="text" v-model="paidToProducer" readonly />
          </div>
          <div class="inp-container">
            <label class="input-label">Payment to LSP in USD</label>
            <input class="text-input" type="text" v-model="paidToLsp" readonly />
          </div>
          <div class="inp-container">
            <label class="input-label">Payment to SAE in USD</label>
            <input class="text-input" type="text" v-model="paidToSae" readonly />
          </div>
          <div class="inp-container">
            <label class="input-label">Bank Transaction Fee</label>
            <input class="text-input" type="text" v-model="bankTransactionFee" readonly />
          </div>
          <div class="inp-container">
            <label class="input-label">Broker Margin</label>
            <input class="text-input" type="text" v-model="brokerMargin" readonly />
          </div>
          <div class="inp-container">
            <label class="input-label">Broker Transport</label>
            <input class="text-input" type="text" v-model="brokerTransport" readonly />
          </div>
          <div class="inp-container">
            <label class="input-label">NGO</label>
            <input class="text-input" type="text" v-model="ngo" readonly />
          </div>
          </perfect-scrollbar>-->

          <!-- <button class="btn btn-success" @click="showPDF">Download as PDF</button> -->
          <div class="row-content">
            <div class="col-md-12 content-container-inner">
              <div class="main-container">
                <div id="printThis">
                  <perfect-scrollbar class="view-ds-ps">
                    <table
                    id="reportTbl"
                      style="width: 100%"
                      border="0"
                      class="pdf-table table table-striped table-bordered table-hover"
                    >
                      <!-- <tr>
                        <td>Service Request ID</td>
                        <td>{{ serviceRequestDisplayId }}</td>
                       
                      </tr>-->
                      <tr>
                        <td>{{ $t("Sale Id", "Sale Id") }}</td>
                        <td>{{ saleId }}</td>
                        <!-- <td></td> -->
                      </tr>
                      <tr>
                        <td>{{ $t("Sold On", "Sold On") }}</td>
                        <td>{{ soldOn }}</td>
                        <!-- <td></td> -->
                      </tr>
                      <tr>
                        <td>
                          {{
                            $t(
                              "Weight of Fruits Sold (in Kg)",
                              "Weight of Fruits Sold (in Kg)"
                            )
                          }}
                        </td>
                        <td>{{ totalFruitsWeight }}</td>
                        <!-- <td></td> -->
                      </tr>
                      <tr>
                        <td>{{ $t("Price Per Kg", "Price Per Kg") }}</td>
                        <td>${{ salesPricePerKg }}</td>
                        <!-- <td></td> -->
                      </tr>
                      <tr>
                        <td>{{ $t("Net Sales", "Net Sales") }}</td>
                        <td>${{ netSales }}</td>
                        <!-- <td></td> -->
                      </tr>
                      <!-- <tr>
                        <td>Producer Name</td>
                        <td>{{ producerName }}</td>
                    
                      </tr>-->
                      <!-- <tr>
                        <td>Payment to Producer</td>
                        <td>${{ paidToProducer }}</td>
                      </tr>-->
                      <tr>
                        <td>
                          {{ $t("Payment to ", "Payment to ") }}
                          {{ lspOrganizationName }}
                        </td>
                        <td>${{ paidToLsp }}</td>
                        <!-- <td></td> -->
                      </tr>
                      <tr v-if="paidAdvanceToLsp">
                        <td>
                          {{ $t("Advance Paid to ", "Advance Paid to ") }}
                          {{ lspOrganizationName }}
                        </td>
                        <td>${{ paidAdvanceToLsp }}</td>
                        <!-- <td></td> -->
                      </tr>
                      <tr>
                        <td>
                          {{ $t("Payment to", "Payment to") }}
                          {{ tspOrganization }}
                        </td>
                        <td>${{ paidToTSP }}</td>
                        <!-- <td></td> -->
                      </tr>
                      <tr>
                        <td>
                          {{ $t("Payment to ", "Payment to ") }}
                          {{ brokerOrganizationName }}
                        </td>
                        <td>${{ paidToBroker }}</td>
                        <!-- <td></td> -->
                      </tr>
                      <tr>
                        <td>
                          {{
                            $t("Bank Transaction Fee", "Bank Transaction Fee")
                          }}
                        </td>
                        <td>${{ bankTransactionFee }}</td>
                        <!-- <td></td> -->
                      </tr>
                      <!-- <tr>
                      <td>Amount Transferred to Sogebank (ATS)</td>
                      <td>${{ sogeBankAmount }}</td>
                      </tr>-->
                      <tr>
                        <td>{{ $t("Broker Margin", "Broker Margin") }}</td>
                        <td>${{ brokerMargin }}</td>
                        <!-- <td></td> -->
                      </tr>
                      <tr>
                        <td>
                          {{ $t("Broker Transport", "Broker Transport") }}
                        </td>
                        <td>${{ brokerTransport }}</td>
                      </tr>
                      <!-- <tr>
                        <td>NGO</td>
                        <td>${{ ngo }}</td>
                
                      </tr>-->
                      <!-- <tr>
                        <td>LSP Penalty</td>
                        <td>${{ lspPenalty }}</td>
             
                      </tr>-->
                      <tr v-if="isFactored">
                        <td>
                          {{ $t("Factoring Charges", "Factoring Charges") }}
                        </td>
                        <td>${{ factoringAmount }} (@ 2% of Net Sales)</td>
                      </tr>
                    </table>
                  </perfect-scrollbar>
                </div>
              </div>
              <div class="row">
                <span class="color-white"
                  >*
                  {{
                    $t("All payments are in USD", "All payments are in USD")
                  }}</span
                >
                <div class="btn-wrap">
                  <input
                    type="button"
                    id="ignoreThis"
                    @click="showPDF"
                    class="btn-save btn-save-pdf"
                    :value="$t('Download as PDF', 'Download as PDF')"
                  />
                </div>
              </div>
            </div>

            <p id="ignorePDF"></p>
          </div>
        </b-modal>
      </div>
      <div class="feedback-popup">
        <b-modal
          hide-footer
          no-close-on-backdrop
          id="modalfeedback"
          ref="feedback-modal"
          hide-backdrop
          :title="$t('Feedback', 'Feedback')"
          @hide="hideModal()"
        >
          <div class="row-content">
            <div class="col-md-12 content-container-inner">
              <div class="main-container">
                <v-client-table
                  :data="feedbackTableData"
                  :columns="feedbackTablecolumns"
                  :options="options2"
                  id="feedbacktable"
                  ref="feedbacktable"
                  class="tbl-services feedback-table"
                ></v-client-table>
              </div>
              <!-- <div class="row">                
                <div class="btn-wrap">
                  <input
                    type="button"
                    id="ignoreThis"
                    @click="showPDF"
                    class="btn-save btn-save-pdf"
                    value="Download as PDF"
                  />
                </div>
              </div>-->
            </div>
          </div>
        </b-modal>
      </div>
        <div class="feedback-popup">
        <b-modal
          hide-footer
          no-close-on-backdrop
          id="modalfeedbackAdvance"
          ref="feedback-modal-advance"
          hide-backdrop
          :title="$t('Advance Feedback', 'Advance Feedback')"
          @hide="hideModalAdvance()"
        >
          <div class="row-content">
            <div class="col-md-12 content-container-inner">
              <div class="main-container">
                <v-client-table
                  :data="feedbackTableDataAdvance"
                  :columns="feedbackTablecolumnsAdvance"
                  :options="options3"
                  id="feedbacktableAdvance"
                  ref="feedbacktableAdvace"
                  class="tbl-services feedback-table"
                ></v-client-table>
              </div>
              <!-- <div class="row">                
                <div class="btn-wrap">
                  <input
                    type="button"
                    id="ignoreThis"
                    @click="showPDF"
                    class="btn-save btn-save-pdf"
                    value="Download as PDF"
                  />
                </div>
              </div>-->
            </div>
          </div>
        </b-modal>
      </div>
      <div class="penalty-pop-up">
        <b-modal
          hide-footer
          no-close-on-backdrop
          id="modalpenalty"
          ref="penalty-modal"
          hide-backdrop
          :title="$t('Penalties', 'Penalties')"
          @hide="hidePenalityModal()"
        >
          <div class="row-content">
            <div class="col-md-12 content-container-inner">
              <div class="main-container">
                <div id="penaltyModal">
                  <perfect-scrollbar class="view-ds-ps">
                    <v-client-table
                      :data="penaltyArray"
                      :columns="penaltycolumns"
                      id="penaltytable"
                      ref="penaltytable"
                      class="tbl-services payment-reporting-table"
                    ></v-client-table>
                    <!-- <table
                      style="width: 100%;"
                      border="0"
                      class="pdf-table table table-striped table-bordered table-hover"
                    >
                      <tr>
                        <td>Penalty Case</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>Type</td>
                        <td>{{penalty_type}}</td>
                      </tr>
                      <tr>
                        <td>Calculated On</td>
                        <td>{{calculatedOn}}</td>
                      </tr>
                      <tr>
                        <td>Amount</td>
                        <td>{{penalty_amt}}</td>
                      </tr>
                      <tr>
                        <td>Levied On</td>
                        <td>{{leviedOn}}</td>
                      </tr>
                      <tr>
                        <td>Currency</td>
                        <td>{{penalty_currency}}</td>
                      </tr>
                    </table>-->
                  </perfect-scrollbar>
                </div>
              </div>
            </div>
          </div>
        </b-modal>
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
import axios from "axios";
import "../../assets/css/main.css";
import "../../assets/css/manage-services.css";
import { ClientTable } from "vue-tables-2";
import BootstrapVue from "bootstrap-vue";
import moment from "moment";
import Datetime from "vue-datetime";
import { uuid } from "vue-uuid";
import "vue-datetime/dist/vue-datetime.css";
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
Vue.use(DropDownListPlugin);
Vue.use(Datetime);
Vue.use(BootstrapVue);
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
import jsPDF from "jspdf";
import Footer from "../../components/footer-view";
import VueFaqAccordion from "vue-faq-accordion";

Vue.use(VueToast);

Vue.use(ClientTable);

import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
import Header from "../../components/header-view";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from '../../shared/auth';

export default {
  components: {
    PerfectScrollbar,
    Header,
    Footer,
    VueFaqAccordion,
  },
  name: "payment-reporting",
  data: function () {
    return {
      paymentReportingRequests: [],
      columns: [
        //  "Service Request Id",

        "Sale Id",
        "Product",
        "soldOn",
        "Total No Of Boxes Sold",
        "Total Weight of Fruits Sold (in Kg)",
        "Net Sale in USD",
        "Distribution",
        "Lots",
        "Feedback",
      ],
      options: {
        perPage: 10,
        sortable: ["soldOn"],
        headings: {
          "Sale Id": `${this.$t("Sale Id", "Sale Id")}`,
          Product: `${this.$t("Product", "Product")}`,
          soldOn: `${this.$t("Sold On", "Sold On")}`,
          "Total No Of Boxes Sold": `${this.$t(
            "Total No Of Boxes Sold",
            "Total No Of Boxes Sold"
          )}`,
          "Total Weight of Fruits Sold (in Kg)": `${this.$t(
            "Total Weight of Fruits Sold (in Kg)",
            "Total Weight of Fruits Sold (in Kg)"
          )}`,
          "Net Sale in USD": `${this.$t("Net Sale in USD", "Net Sale in USD")}`,
          Distribution: `${this.$t("Distribution", "Distribution")}`,
          Lots: `${this.$t("Lots", "Lots")}`,
          Feedback: `${this.$t("Feedback", "Feedback")}`,
        },
        customSorting: {
          soldOn: function (ascending) {
            return function (a, b) {
              let dateA = new Date(a.soldOn);
              let dateB = new Date(b.soldOn);

              if (ascending) return dateA >= dateB ? 1 : -1;

              return dateA <= dateB ? 1 : -1;
            };
          },
        },
        orderBy: {
          ascending: false,
          column: "soldOn",
        },
      },
      feedbackTablecolumns: [
        "Amount",
        "Beneficiary First Name",
        "Beneficiary Last Name",
        "Currency",
        "Status",
        "Reason For Failure",
        "File Name",
      ],
        feedbackTablecolumnsAdvance: [
        "Amount",
        "Beneficiary First Name",
        "Beneficiary Last Name",
        "Currency",
        "Status",
        "Reason For Failure",
        "File Name",
      ],
            options3: {
        perPage: 10,
        sortable: [],
        headings: {
          Amount: `${this.$t("Amount", "Amount")}`,
          "Beneficiary First Name": `${this.$t(
            "Beneficiary First Name",
            "Beneficiary First Name"
          )}`,
          "Beneficiary Last Name": `${this.$t(
            "Beneficiary Last Name",
            "Beneficiary Last Name"
          )}`,
          Currency: `${this.$t("Currency", "Currency")}`,
          Status: `${this.$t("Status", "Status")}`,
          "Reason For Failure": `${this.$t(
            "Reason For Failure",
            "Reason For Failure"
          )}`,
          "File Name": `${this.$t("File Name", "File Name")}`,
        },
        customSorting: {
          soldOn: function (ascending) {
            return function (a, b) {
              let dateA = new Date(a.soldOn);
              let dateB = new Date(b.soldOn);

              if (ascending) return dateA >= dateB ? 1 : -1;

              return dateA <= dateB ? 1 : -1;
            };
          },
        },
        orderBy: {
          ascending: false,
          column: "soldOn",
        },
      },
      options2: {
        perPage: 10,
        sortable: [],
        headings: {
          Amount: `${this.$t("Amount", "Amount")}`,
          "Beneficiary First Name": `${this.$t(
            "Beneficiary First Name",
            "Beneficiary First Name"
          )}`,
          "Beneficiary Last Name": `${this.$t(
            "Beneficiary Last Name",
            "Beneficiary Last Name"
          )}`,
          Currency: `${this.$t("Currency", "Currency")}`,
          Status: `${this.$t("Status", "Status")}`,
          "Reason For Failure": `${this.$t(
            "Reason For Failure",
            "Reason For Failure"
          )}`,
          "File Name": `${this.$t("File Name", "File Name")}`,
        },
        customSorting: {
          soldOn: function (ascending) {
            return function (a, b) {
              let dateA = new Date(a.soldOn);
              let dateB = new Date(b.soldOn);

              if (ascending) return dateA >= dateB ? 1 : -1;

              return dateA <= dateB ? 1 : -1;
            };
          },
        },
        orderBy: {
          ascending: false,
          column: "soldOn",
        },
      },
      lotsview: [],
      lotcolumns: [
        "Lot Id",
        "Producer Name",
        "Boxes Sold",
        "Producer Amount",
        "Advance Given",
        // "NGO Name",
        // "NGO Amount",
        "Penalties",
       "View Advance Feedabck"
      ],
      options3: {
        perPage: 10,
        sortable: [],
        headings: {
          "Lot Id": `${this.$t()}`,
          "Producer Name": `${this.$t("Producer Name", "Producer Name")}`,
          "Boxes Sold": `${this.$t("Boxes Sold", "Boxes Sold")}`,
          "Producer Amount": `${this.$t("Producer Amount", "Producer Amount")}`,
          "Advance Given": `${this.$t("Advance Given", "Advance Given")}`,
          // "NGO Name": `${this.$t("NGO Name", "NGO Name")}`,
          // "NGO Amount": `${this.$t("NGO Amount", "NGO Amount")}`,
          Penalties: `${this.$t("Penalties", "Penalties")}`,
          "View Advance Feedabck": `${this.$t("View Advance Feedabck", "View Advance Feedabck")}`,
        },
        customSorting: {
          soldOn: function (ascending) {
            return function (a, b) {
              let dateA = new Date(a.soldOn);
              let dateB = new Date(b.soldOn);

              if (ascending) return dateA >= dateB ? 1 : -1;

              return dateA <= dateB ? 1 : -1;
            };
          },
        },
        orderBy: {
          ascending: false,
          column: "soldOn",
        },
      },
      seen: true,
      show: false,
      userName: "",
      email: null,
      serviceRequestId: null,
      saleId: null,
      soldOn: null,
      totalFruitsWeight: null,
      producerName: null,
      paidToProducer: null,
      paidToLsp: null,
      paidToTSP: null,
      bankTransactionFee: null,
      brokerMargin: null,
      brokerTransport: null,
      ngo: null,
      selectedRecord: null,
      netSales: null,
      sellCostOfTransportation: null,
      lspPenalty: null,
      factoringAmount: 0,
      isFactored: false,
      sogeBankAmount: 0,
      salesPricePerKg: 0,
      serviceRequestDisplayId: null,
      prevPage: "",
      paidToBroker: 0,
      displayLots: false,
      showPenalities: false,
      hidePenalities: false,
      // penalty_type: "",
      // calculatedOn: null,
      // penalty_amt: 0,
      // leviedOn: "",
      // penalty_currency: "",
      penaltyArray: [],
      penaltycolumns: [
        "Type",
        "Calculated On",
        "Amount",
        "Levied On",
        "Currency",
      ],
      clikedId: null,
      previouslyClickedId: 0,
      feedbackTableData: [],
       feedbackTableDataAdvance: [],
      isNotObserver: true,
      lspOrganizationName: null,
      brokerOrganizationName: null,
      tspOrganization: null,
      paidAdvanceToLsp: null,
      //prevRoute:null
    };
  },
  mounted() {
    // if(localStorage.systemRole == 99){
    //   this.$refs.headercomp.createBreadcrumb([{"text":"SA-Dashboard","href":"/sa-dashboard"},{"text":"TPA-Dashboard","href":"/tpa-dashboard"},{"text":"Payment Reporting","href":"/payment-reporting"}]);
    // }
    if (localStorage.systemRole == 13) {
      this.isNotObserver = false;
    }
    if (
      localStorage.systemRole == 99 &&
      localStorage.prevPage == "tpa-dashboard"
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
            text: this.$t("TPA-Dashboard", "TPA-Dashboard"),
            href: "/tpa-dashboard",
          },
          {
            text: this.$t("Payment Reporting", "Payment Reporting"),
            href: "/payment-reporting",
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
            text: this.$t("TPA-Dashboard", "TPA-Dashboard"),
            href: "/tpa-dashboard",
          },
          {
            text: this.$t("Payment Reporting", "Payment Reporting"),
            href: "/payment-reporting",
          },
        ]);
      }
      // localStorage.prevPage = "";
    } else if (
      localStorage.systemRole == 99 &&
      localStorage.prevPage == "observer-dashboard"
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
            text: this.$t("Observer-Dashboard", "Observer-Dashboard"),
            href: "/observer-dashboard",
          },
          {
            text: this.$t("Payment Reporting", "Payment Reporting"),
            href: "/payment-reporting",
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
            text: this.$t("Observer-Dashboard", "Observer-Dashboard"),
            href: "/observer-dashboard",
          },
          {
            text: this.$t("Payment Reporting", "Payment Reporting"),
            href: "/payment-reporting",
          },
        ]);
      }
      //localStorage.prevPage = "";
    } else if (
      localStorage.systemRole == 99 &&
      localStorage.prevPage == "sa-dashboard"
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
            text: this.$t("Payment Reporting", "Payment Reporting"),
            href: "/payment-reporting",
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
            text: this.$t("Payment Reporting", "Payment Reporting"),
            href: "/payment-reporting",
          },
        ]);
      }
      //localStorage.prevPage = "";
    } else if (
      localStorage.systemRole == 9 &&
      localStorage.prevPage == "tpa-dashboard"
    ) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Admin-Dashboard", "Admin-Dashboard"),
          href: "/admin-dashboard",
        },
        {
          text: this.$t("TPA-Dashboard", "TPA-Dashboard"),
          href: "/tpa-dashboard",
        },
        {
          text: this.$t("Payment Reporting", "Payment Reporting"),
          href: "/payment-reporting",
        },
      ]);
      //localStorage.prevPage = "";
    } else if (
      localStorage.systemRole == 99 &&
      localStorage.prevPage == "admin-dashboard"
    ) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Root Authority-Dashboard", "Root Authority-Dashboard"),
          href: "/sa-dashboard",
        },
        {
          text: this.$t("Admin-Dashboard", "Admin-Dashboard"),
          href: "/admin-dashboard",
        },
        {
          text: this.$t("Payment Reporting", "Payment Reporting"),
          href: "/payment-reporting",
        },
      ]);
      //localStorage.prevPage = "";
    } else if (
      localStorage.systemRole == 99 &&
      localStorage.prevPage == "op-admin-dashboard"
    ) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Root Authority-Dashboard", "Root Authority-Dashboard"),
          href: "/sa-dashboard",
        },
        {
          text: this.$t("OP-Admin-Dashboard", "OP-Admin-Dashboard"),
          href: "/op-admin-dashboard",
        },
        {
          text: this.$t("Payment Reporting", "Payment Reporting"),
          href: "/payment-reporting",
        },
      ]);
      //localStorage.prevPage = "";
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
          text: this.$t("Payment Reporting", "Payment Reporting"),
          href: "/payment-reporting",
        },
      ]);
      //localStorage.prevPage = "";
    } else if (localStorage.systemRole == 6) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("TPA-Dashboard", "TPA-Dashboard"),
          href: "/tpa-dashboard",
        },
        {
          text: this.$t("Payment Reporting", "Payment Reporting"),
          href: "/payment-reporting",
        },
      ]);
    } else if (localStorage.systemRole == 13) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Observer-Dashboard", "Observer-Dashboard"),
          href: "/observer-dashboard",
        },
        {
          text: this.$t("Payment Reporting", "Payment Reporting"),
          href: "/payment-reporting",
        },
      ]);
    } else if (localStorage.systemRole == 9) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Admin-Dashboard", "Admin-Dashboard"),
          href: "/admin-dashboard",
        },
        {
          text: this.$t("Payment Reporting", "Payment Reporting"),
          href: "/payment-reporting",
        },
      ]);
    } else if (localStorage.systemRole == 10) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"),
          href: "/observer-mci-dashboard",
        },
        {
          text: this.$t("Payment Reporting", "Payment Reporting"),
          href: "/payment-reporting",
        },
      ]);
    } else if (localStorage.systemRole == 7) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("OP-Admin-Dashboard", "OP-Admin-Dashboard"),
          href: "/op-admin-dashboard",
        },
        {
          text: this.$t("Payment Reporting", "Payment Reporting"),
          href: "/payment-reporting",
        },
      ]);
    }
    this.options = {
      perPage: 10,
      sortable: ["soldOn"],
      headings: {
        "Sale Id": `${this.$t("Sale Id", "Sale Id")}`,
        Product: `${this.$t("Product", "Product")}`,
        soldOn: `${this.$t("Sold On", "Sold On")}`,
        "Total No Of Boxes Sold": `${this.$t(
          "Total No Of Boxes Sold",
          "Total No Of Boxes Sold"
        )}`,
        "Total Weight of Fruits Sold (in Kg)": `${this.$t(
          "Total Weight of Fruits Sold (in Kg)",
          "Total Weight of Fruits Sold (in Kg)"
        )}`,
        "Net Sale in USD": `${this.$t("Net Sale in USD", "Net Sale in USD")}`,
        Distribution: `${this.$t("Distribution", "Distribution")}`,
        Lots: `${this.$t("Lots", "Lots")}`,
        Feedback: `${this.$t("Feedback", "Feedback")}`,
      },
      customSorting: {
        soldOn: function (ascending) {
          return function (a, b) {
            let dateA = new Date(a.soldOn);
            let dateB = new Date(b.soldOn);

            if (ascending) return dateA >= dateB ? 1 : -1;

            return dateA <= dateB ? 1 : -1;
          };
        },
      },
      orderBy: {
        ascending: false,
        column: "soldOn",
      },
    };
    this.options2 = {
      perPage: 10,
      sortable: [],
      headings: {
        Amount: `${this.$t("Amount", "Amount")}`,
        "Beneficiary First Name": `${this.$t(
          "Beneficiary First Name",
          "Beneficiary First Name"
        )}`,
        "Beneficiary Last Name": `${this.$t(
          "Beneficiary Last Name",
          "Beneficiary Last Name"
        )}`,
        Currency: `${this.$t("Currency", "Currency")}`,
        Status: `${this.$t("Status", "Status")}`,
        "Reason For Failure": `${this.$t(
          "Reason For Failure",
          "Reason For Failure"
        )}`,
        "File Name": `${this.$t("File Name", "File Name")}`,
      },
      customSorting: {
        soldOn: function (ascending) {
          return function (a, b) {
            let dateA = new Date(a.soldOn);
            let dateB = new Date(b.soldOn);

            if (ascending) return dateA >= dateB ? 1 : -1;

            return dateA <= dateB ? 1 : -1;
          };
        },
      },
      orderBy: {
        ascending: false,
        column: "soldOn",
      },
    };
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.getData();
    this.userName = localStorage.userName;
  },

  methods: {
    showFeedbackFiles(lotId)
    {
      var vm = this;
      this.feedbackTableDataAdvance = [];
      firebase
        .database()
        .ref()
        .child("serviceRequest")
        .orderByChild("serviceRequestId")
        .equalTo(lotId)
        .on("child_added", (snapshot) => {

          if (snapshot.val() != null) {
            if (
              snapshot.val().feedBackData != undefined &&
              snapshot.val().feedBackData != null
            ) {
                         firebase
        .database()
        .ref()
        .child("serviceRequest")
.child(snapshot.key).
        child("feedBackData")

                      .on("child_added", (snapshotfeedback) => {
                        this.feedbackTableDataAdvance.push({
                          Amount: Number(snapshotfeedback.val().amount).toFixed(
                            2
                          ),
                          "Beneficiary First Name": snapshotfeedback.val()
                            .benefiaciaryFirstName,
                          "Beneficiary Last Name": snapshotfeedback.val()
                            .benefiaciaryLastName,
                          Currency: snapshotfeedback.val().currency,
                          Status: snapshotfeedback.val().status,
                          "Reason for Failure": snapshotfeedback.val()
                            .reasonForFailure,
                          "File Name": snapshotfeedback.val().fileName,
                        });
                      });
      this.$refs["feedback-modal-advance"].show();
            }
            else
            {
             Vue.$toast.open({
                          message: vm.$t(
                            "Advance feedback files not uploaded yet",
                            "Advance feedback files not uploaded yet"
                          ),
                          type: "error",
                          position: "top",
                        });
            }
          }
        });

    },
    viewFeedback(row) {
      var saleId = "";
      var saleId = row["Sale Id"];
      this.feedbackTableData = [];
      firebase
        .database()
        .ref()
        .child("batch")
        .orderByChild("batchId")
        .equalTo(row.batchId)
        .on("child_added", (snapshot) => {
          if (snapshot.val() != null) {
            if (
              snapshot.val().sell != undefined &&
              snapshot.val().sell != null
            ) {
              firebase
                .database()
                .ref()
                .child("batch")
                .child(snapshot.key)
                .child("sell")
                .on("child_added", (snapshotSell) => {
                  if (snapshotSell.val().sellId == row["Sale Id"]) {
                    firebase
                      .database()
                      .ref()
                      .child("batch")
                      .child(snapshot.key)
                      .child("sell")
                      .child(snapshotSell.key)
                      .child("feedBackData")
                      .on("child_added", (snapshotfeedback) => {
                        this.feedbackTableData.push({
                          Amount: Number(snapshotfeedback.val().amount).toFixed(
                            2
                          ),
                          "Beneficiary First Name": snapshotfeedback.val()
                            .benefiaciaryFirstName,
                          "Beneficiary Last Name": snapshotfeedback.val()
                            .benefiaciaryLastName,
                          Currency: snapshotfeedback.val().currency,
                          Status: snapshotfeedback.val().status,
                          "Reason for Failure": snapshotfeedback.val()
                            .reasonForFailure,
                          "File Name": snapshotfeedback.val().fileName,
                        });
                      });
                  }
                });
            }
          }
        });
      this.$refs["feedback-modal"].show();
    },
    getData() {
      let currentValue = this;
      var idVal = 0;
      currentValue.paymentReportingRequests = [];
      firebase
        .database()
        .ref()
        .child("batch")
        .orderByChild("status")
        .equalTo("Batch Proforma Completed")
        .on("child_added", function (snapshot) {
          if (snapshot.val() != null) {
            if (
              snapshot.val().sell != undefined &&
              snapshot.val().sell != null
            ) {
              if (localStorage.systemRole.includes(99)) {
                firebase
                  .database()
                  .ref()
                  .child("batch")
                  .child(snapshot.key)
                  .child("sell")
                  .on("child_added", function (snapshotNew) {
                    var feedbackExists = false;
                    if (snapshotNew.val().feedBackData != undefined) {
                      feedbackExists = true;
                    }
                    console.log("$$$$$$$$$$$$");
                    console.log(snapshotNew.val().sellCostOfTransportation);
                    if (
                      snapshotNew.val().sellCostOfTransportation != null &&
                      snapshotNew.val().sellCostOfTransportation != undefined &&
                      snapshotNew.val().sellCostOfTransportation != ""
                    ) {
                      idVal = Number(idVal) + 1;
                      var netsaleAmount = 0;
                      if (
                        snapshotNew.val().netSaleAmountCal != null &&
                        snapshotNew.val().netSaleAmountCal != undefined
                      ) {
                        netsaleAmount = snapshotNew.val().netSaleAmountCal;
                      }
                      currentValue.paymentReportingRequests.push({
                        id: idVal,

                        "Sale Id": snapshotNew.val().sellId,
                        Product: snapshotNew.val().soldProduct,
                        "Total No Of Boxes Sold": snapshotNew.val()
                          .totalNoOfBoxesSold,
                        soldOn: moment
                          .utc(snapshotNew.val().dateAndTimeOfUnLoading)
                          .local()
                          .format("MMM DD, YYYY hh:mm A"),
                        "Total Weight of Fruits Sold (in Kg)":
                          snapshotNew.val().salesWeightPerBox *
                          snapshotNew.val().totalNoOfBoxesSold,
                        "Net Sale in USD": Number(netsaleAmount).toFixed(2),
                        salesBrokerMargin: snapshotNew.val().salesBrokerMargin,
                        sellCostOfTransportation: snapshotNew.val()
                          .sellCostOfTransportation,
                        //  wasFactored: snapshotNew.val().confirmPayment.wasFactored,
                        salesPricePerKg: snapshotNew.val().confirmPayment,
                        batchId: snapshotNew.val().batchId,
                        isFeedbackExists: feedbackExists,
                      });
                      currentValue.paymentReportingRequests.reverse();
                      currentValue.seen = false;
                      currentValue.show = true;
                    }
                  });
              } else {
                if (
                  snapshot.val().organizationKey == localStorage.organizationKey
                ) {
                  firebase
                    .database()
                    .ref()
                    .child("batch")
                    .child(snapshot.key)
                    .child("sell")
                    .on("child_added", function (snapshotNew) {
                      var feedbackExists = false;
                      if (snapshotNew.val().feedBackData != undefined) {
                        feedbackExists = true;
                      }
                      if (
                        snapshotNew.val().sellCostOfTransportation != null &&
                        snapshotNew.val().sellCostOfTransportation !=
                          undefined &&
                        snapshotNew.val().sellCostOfTransportation != ""
                      ) {
                        idVal = Number(idVal) + 1;
                        currentValue.paymentReportingRequests.push({
                          id: idVal,

                          "Sale Id": snapshotNew.val().sellId,
                          Product: snapshotNew.val().soldProduct,
                          "Total No Of Boxes Sold": snapshotNew.val()
                            .totalNoOfBoxesSold,
                          soldOn: moment
                            .utc(snapshotNew.val().dateAndTimeOfUnLoading)
                            .local()
                            .format("MMM DD, YYYY hh:mm A"),
                          "Total Weight of Fruits Sold (in Kg)":
                            snapshotNew.val().salesWeightPerBox *
                            snapshotNew.val().totalNoOfBoxesSold,
                          "Net Sale in USD": Number(
                            snapshotNew.val().invoice.netSales
                          ).toFixed(2),
                          salesBrokerMargin: snapshotNew.val()
                            .salesBrokerMargin,
                          sellCostOfTransportation: snapshotNew.val()
                            .sellCostOfTransportation,
                          wasFactored: snapshotNew.val().confirmPayment
                            .wasFactored,
                          salesPricePerKg: snapshotNew.val().confirmPayment,
                          batchId: snapshotNew.val().batchId,
                          isFeedbackExists: feedbackExists,
                        });
                        currentValue.paymentReportingRequests.reverse();
                        currentValue.seen = false;
                        currentValue.show = true;
                      }
                    });
                }
              }
            }
          }
        });
      //  for (let i = 0; i <   snapshot.val().sell .length; i++) {

      //  }
      // const keys = Object.keys(snapshot.val().sell);
      // for (let i = 0; i < keys.length; i++) {

      //   const elem = snapshot.val().sell[keys[i]];
      //   console.log("saleeeeeeeeeeeeeeeeee")
      //   if (elem.confirmPayment) {
      //     alert(1);

      //     const {
      //       sellId,
      //       dateAndTimeOfUnLoading,
      //       soldProduct,
      //       salesWeightPerBox,
      //       totalNoOfBoxesSold,
      //       salesBrokerMargin,
      //       sellCostOfTransportation,
      //       salesPricePerKg
      //     } = elem;

      // let displayId = null;
      // var serviceRequestref = firebase
      //   .database()
      //   .ref()
      //   .child("serviceRequest")
      //   .orderByChild("serviceRequestId")
      //   .equalTo(_sri);
      // serviceRequestref.on(
      // "child_added",
      // serviceRequestSnapshot => {
      // displayId = serviceRequestSnapshot.val().displayId;
      // let factoringAmount = 0;
      // if (elem.confirmPayment.wasFactored.trim() == "Yes") {
      //   factoringAmount =
      //     Number(elem.invoice.netSales) * 0.02;
      // }
      //             let _netSales = Number(elem.invoice.netSales).toFixed(
      //               2
      //             );
      //             let totalWeight =
      //               salesWeightPerBox * totalNoOfBoxesSold;
      //             currentValue.paymentReportingRequests.push({
      //               Id: i,
      //               // guidServiceRequestId:_sri,
      //               // "Service Request Id":
      //               //   displayId != undefined && displayId != null
      //               //     ? displayId
      //               //     : _sri,
      //               "Sale Id": sellId,
      //               soldOn: moment
      //                 .utc(dateAndTimeOfUnLoading)
      //                 .local()
      //                 .format("MMM DD, YYYY hh:mm A"),
      //               "Total Weight of Fruits Sold (in Kg)": totalWeight,
      //               "Net Sale in USD": _netSales,
      //               salesBrokerMargin,
      //               sellCostOfTransportation,
      //               wasFactored: wasFactored,
      //               salesPricePerKg: salesPricePerKg
      //             });
      //         //   }
      //         // );
      //       }
      //       i++;
      //     }
      //     currentValue.paymentReportingRequests.reverse();
      //     currentValue.seen = false;
      //     currentValue.show = true;
      //   }
      // } else {
      //   currentValue.showIcons = false;
      //   currentValue.seen = false;
      // }
      // },
      // function(error) {
      //   console.log("Error: " + error.code);
      // }

      setTimeout(function () {
        if (currentValue.paymentReportingRequests.length == 0) {
          currentValue.seen = false;
        }
      }, 4000);
    },
    hideModal: function () {
      this.clearModalData();
      this.$refs["details-modal"].hide();
    },
hideModalAdvance: function () {
      this.clearModalData();
      this.$refs["feedback-modal-advance"].hide();
    },
    closeModal() {},
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
      if (localStorage.systemRole == 6) {
        Router.push("tpa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else if (localStorage.systemRole == 7) {
        Router.push("op-admin-dashboard");
      } else if (localStorage.systemRole == 13) {
        Router.push("observer-dashboard");
      } else if (localStorage.systemRole == 10) {
        Router.push("observer-mci-dashboard");
      } else {
        Router.push("sa-dashboard");
      }
    },
    Save: function () {
      this.$refs["details-modal"].hide();
    },
    // showChildLots(params, index) {
    //   //alert("childlOts");
    //   // if (row.childRows.length === 0) {
    //   //   return "hideChildToggler";
    //   // }
    //   //this.$refs["paymenttable"].toggleChildRow(4);
    // },

    showLots(params, index) {
      this.clikedId = params.id;
      var saleId = params["Sale Id"];

      let currentVal = this;
      currentVal.seen = true;
      this.lotsview = [];
      //alert(params.id);
      //this.$refs.paymenttable.hideChildRow();
      //  this.$refs.lotRows.hide();
      if (this.previouslyClickedId != params.id) {
        this.$refs.paymenttable.toggleChildRow(this.previouslyClickedId);
      }
      this.$refs.paymenttable.toggleChildRow(params.id);
      this.previouslyClickedId = params.id;
      //currentVal.$refs["paymenttable"].toggleChildRow(index);
      // currentVal.displayLots = true;

      // // let advanceGiven = 0;
      // // vm.isFactored = false;
      // // vm.factoringAmount = 0;
      // currentVal.seen = true;
      // // vm.serviceRequestDisplayId=params["Service Request Id"]
      // currentVal.saleId = params["Sale Id"];
      // // vm.soldOn = params["soldOn"];
      // // vm.totalFruitsWeight = params["Total Weight of Fruits Sold (in Kg)"];
      // // vm.netSales = params["Net Sale in USD"];
      // // vm.salesPricePerKg = Number(params.salesPricePerKg).toFixed(2);
      // // vm.brokerMargin = params.salesBrokerMargin;
      // //currentVal.$refs["modalLots"].show();

      currentVal.axios
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
          //currentVal.$refs["modalLots"].show();
          currentVal.seen = false;
          currentVal.lotsview = [];

          for (var i = 0; i < response.data.lots.length; i++) {
            currentVal.lotsview.push({
              lotId: response.data.lots[i].lotId,
              displayId: response.data.lots[i].displayId,
              producerName: response.data.lots[i].producerName,
              boxesSold: response.data.lots[i].boxesSold,
              advanceGiven: Number(
                response.data.lots[i].advanceConsidered
              ).toFixed(2),
              producerAmount: Number(
                response.data.lots[i].producerAmount
              ).toFixed(2),

              ngoName: response.data.lots[i].ngoName,
              ngoAmount: Number(response.data.lots[i].ngoAmount).toFixed(2),
              penalties: response.data.lots[i].penalties,
            });
            if (currentVal.lotsview[i].penalties.length != 0) {
              currentVal.showPenalities = true;
              currentVal.hidePenalities = false;
            } else {
              currentVal.hidePenalities = true;
              currentVal.showPenalities = false;
            }
          }
          currentVal.seen = false;

          // var tableHtml = "<table><tr><th>Service</th><tbody>";
          // for (var i = 0; i < response.data.lots.length; i++) {
          //   console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
          //   tableHtml +=
          //     "<tr><td>" + response.data.lots[i].lotId + "</td></tr>";
          // }
          // tableHtml += "</tbody></table>";
          //              currentVal.soldOn = params["soldOn"];
          //       currentVal.totalFruitsWeight = response.data.totalWeightOfFruitsSold
          //       currentVal.netSales =Number(response.data.netSales).toFixed(2);
          //       currentVal.salesPricePerKg = Number(response.data.pricePerKg).toFixed(2);
          //       currentVal.brokerMargin =((response.data.brokerMargin)*100);
          //     currentVal.brokerTransport = response.data.brokerTransport;
          //     currentVal.isFactored = response.data.wasFactored;
          //     currentVal.bankTransactionFee = response.data.bankTransactionCharges;
          //     currentVal.factoringAmount =  response.data.factoringAmount;
          //     for(var i=0;i<response.data.sales.length;i++)
          //     {
          //       if(response.data.sales[i].role == "LSP"){
          // currentVal.paidToLsp = Number(response.data.sales[i].amount).toFixed(2);
          //       }
          //       if(response.data.sales[i].role == "BROKER"){
          //         currentVal.paidToBroker = Number(response.data.sales[i].amount).toFixed(2);
          //       }
          //        if(response.data.sales[i].role == "SAE"){
          //         currentVal.paidToSae = Number(response.data.sales[i].amount).toFixed(2);
          //       }
          //     }
        })
        .catch(function (error) {
          console.log(error.message);
          //alert("fail");
          //refresh token
          let errorObject = JSON.parse(JSON.stringify(error));
          console.log(errorObject);
          currentVal.seen = false;
         if ((error.response.status == 401) || (errorObject.message.indexOf("401") > -1)) {
            firebase
              .auth()
              .currentUser.getIdToken(true)
              .then((idtoken) => {
                localStorage.IDtoken = "";
                localStorage.IDtoken = idtoken;
                currentVal.showLots(params, index);
              })
              .catch((error) => {
                currentVal.seen = false;
              });
          }
        });
    },
    showPenalties(lotId) {
      let currentVal = this;
      currentVal.seen = true;

      currentVal.axios
        .get(
          `${
            getConfigVars().BASE_URL
          }50011/api/v1.0/penalties?serviceRequestId=${lotId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          }
        )
        .then(function (response) {
          currentVal.seen = false;
          console.log("####################");
          console.log(response);
          currentVal.penaltyArray = [];
          for (var i = 0; i < response.data.penalties.length; i++) {
            // currentVal.penalty_type = response["penalties"][i].type;
            // currentVal.calculatedOn = response["penalties"][i].calculatedOn;
            // currentVal.penalty_amt = response["penalties"][i].amount;
            // currentVal.leviedOn = response["penalties"][i].leviedOn;
            // currentVal.penalty_currency = response["penalties"][i].currency;
            currentVal.penaltyArray.push({
              Type: response.data.penalties[i].type,
              "Calculated On": moment
                .utc(response.data.penalties[i].calculatedOn)
                .local()
                .format("MMM DD, YYYY hh:mm A"),
              Amount: Number(response.data.penalties[i].amount).toFixed(2),
              "Levied On": response.data.penalties[i].leviedOn,
              Currency: response.data.penalties[i].currency,
            });
          }

          currentVal.seen = false;
        })
        .catch(function (error) {
          currentVal.seen = false;
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
                currentVal.showPenalties(lotId);
              })
              .catch((error) => {
                // currentVal.lotsArray = [];
                // currentVal.lotsList = [];
              });
          }
        });
      this.$refs["penalty-modal"].show();
    },
    showDistribution(params) {
      let currentVal = this;
      // let advanceGiven = 0;
      // vm.isFactored = false;
      // vm.factoringAmount = 0;
      console.log(params);
      currentVal.seen = true;
      currentVal.lspOrganizationName = null;
      currentVal.brokerOrganizationName = null;
      // vm.serviceRequestDisplayId=params["Service Request Id"]
      currentVal.saleId = params["Sale Id"];
      // vm.soldOn = params["soldOn"];
      // vm.totalFruitsWeight = params["Total Weight of Fruits Sold (in Kg)"];
      // vm.netSales = params["Net Sale in USD"];
      // vm.salesPricePerKg = Number(params.salesPricePerKg).toFixed(2);
      // vm.brokerMargin = params.salesBrokerMargin;

      currentVal.axios
        .get(
          `${
            getConfigVars().BASE_URL
          }50011/api/v1.0/payment-distribution?saleId=${currentVal.saleId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          }
        )
        .then(function (response) {
          let ref = firebase
            .database()
            .ref()
            .child("batch")
            .child(params.batchId);
          ref.on("value", (snapshot) => {
            console.log(snapshot.val());
            currentVal.lspOrganizationName = snapshot.val().organization || "";
            currentVal.brokerOrganizationName =
              snapshot.val().proforma.brokerOrganization || "";
          });
          currentVal.$refs["details-modal"].show();
          currentVal.seen = false;
          currentVal.soldOn = params["soldOn"];
          currentVal.totalFruitsWeight = response.data.totalWeightOfFruitsSold;
          currentVal.netSales = Number(response.data.netSales).toFixed(2);
          currentVal.salesPricePerKg = Number(response.data.pricePerKg).toFixed(
            2
          );

          currentVal.brokerMargin = (
            Number(response.data.brokerMargin) * Number(response.data.netSales)
          ).toFixed(2);
          currentVal.brokerTransport =Number(response.data.brokerTransport).toFixed(2);
          currentVal.isFactored = response.data.wasFactored;
          currentVal.bankTransactionFee =Number(response.data.bankTransactionCharges).toFixed(2);
          currentVal.factoringAmount = response.data.factoringAmount;
          for (var i = 0; i < response.data.sales.length; i++) {
            if (response.data.sales[i].role == "LSP") {
              currentVal.paidToLsp = Number(
                response.data.sales[i].amount
              ).toFixed(2);
              if (Number(response.data.sales[i].advanceConsidered) != 0) {
                currentVal.paidAdvanceToLsp = Number(
                  response.data.sales[i].advanceConsidered
                ).toFixed(2);
              }
            }
            if (response.data.sales[i].role == "BROKER") {
              currentVal.paidToBroker = Number(
                response.data.sales[i].amount
              ).toFixed(2);
            }
            if (response.data.sales[i].role == "TSP") {
              currentVal.paidToTSP = Number(
                response.data.sales[i].amount
              ).toFixed(2);
              currentVal.tspOrganization =
                response.data.sales[i].organizationName;
            }
          }
        })
        .catch(function (error) {
          currentVal.seen = false;
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
                currentVal.showDistribution(params);
              })
              .catch((error) => {
                currentVal.lotsArray = [];
                currentVal.lotsList = [];
              });
          }
        });

      // vm.sellCostOfTransportation = params.sellCostOfTransportation;
      // firebase
      //   .database()
      //   .ref()
      //   .child("serviceRequest")
      //   .orderByChild("serviceRequestId")
      //   .equalTo(vm.serviceRequestId)
      //   .on("child_added", function(snapshot) {
      //     advanceGiven = snapshot.val().advanceGiven;
      //     let deliveryType = snapshot.val().shippingDetails;
      //     if (deliveryType == "Shipment by Air (US$ 1.68/kg)") {
      //       deliveryType = "air";
      //     } else {
      //       deliveryType = "sea";
      //     }
      //     vm.axios
      //       .get(
      //         `${getConfigVars().BASE_URL}/api/v1/corda/calculate/sale/${vm.saleId}`
      //       )
      //       .then(function({ data }) {
      //         // fetching LSP Penalties
      //         vm.axios
      //           .get(
      //             `${getConfigVars().BASE_URL}/api/v1/corda/history/full?lotId=${vm.serviceRequestId}&rfsId=${vm.serviceRequestId}&saleId=${vm.saleId}`
      //           )
      //           .then(function(penalties) {
      //             // console.log(data.info.penalty_values.lsp);
      //             vm.lspPenalty = penalties.data.info.penalty_values.lsp.toFixed(
      //               2
      //             );
      //           })
      //           .catch(err => console.log(err));
      //         //working

      //         if (params.wasFactored.trim() == "Yes") {
      //           vm.isFactored = true;

      //           vm.factoringAmount = (data.netSales * 0.02).toFixed(2);
      //           vm.sogeBankAmount =
      //             Number(data.netSales) -
      //             Number(data.info.brokerTransportFee.flat) -
      //             Number(data.profits.broker) -
      //             Number(vm.factoringAmount);
      //           vm.bankTransactionFee = (
      //             Number(vm.sogeBankAmount) * 0.03
      //           ).toFixed(2);

      //           let producerRevenue = (
      //             Number(vm.sogeBankAmount) -
      //             Number(data.profits.lsp) -
      //             Number(vm.bankTransactionFee)
      //           ).toFixed(2);

      //           vm.ngo = (
      //             (Number(producerRevenue) - Number(vm.paidToSae)) *
      //             0.15
      //           ).toFixed(2);
      //           vm.paidToSae = (Number(producerRevenue) * 0.01).toFixed(2);

      //           vm.paidToProducer =
      //             Number(producerRevenue) -
      //             Number(vm.paidToSae) -
      //             Number(vm.ngo) -
      //             Number(advanceGiven);
      //         } else {
      //           vm.isFactored = false;
      //           vm.factoringAmount = 0;
      //           vm.bankTransactionFee = data.profits.bankTxFee.toFixed(2);
      //           vm.paidToProducer = Number(
      //             data.profits.producer - Number(advanceGiven)
      //           ).toFixed(2);
      //           vm.paidToSae = data.profits.sae.toFixed(2);
      //           vm.ngo = data.profits.ngo.toFixed(2);
      //         }

      //         vm.producerName = data.info.producer;
      //         vm.brokerMargin = data.profits.broker.toFixed(2);

      //         vm.paidToLsp = (
      //           Number(data.profits.lsp) + Number(advanceGiven)
      //         ).toFixed(2);

      //         //  vm.bankTransactionFee = data.profits.bankTxFee.toFixed(2);
      //         vm.netSales = data.netSales.toFixed(2);
      //         vm.brokerTransport = data.info.brokerTransportFee.flat.toFixed(2);
      //         vm.seen = false;
      //         vm.$refs["details-modal"].show();
      //       })
      //       .catch(error => console.log(error));
      //   });
    },
    clearModalData() {
      this.serviceRequestId = null;
      this.saleId = null;
      this.soldOn = null;
      this.totalFruitsWeight = null;
      this.producerName = null;
      this.paidToProducer = null;
      this.paidToLsp = null;
      this.paidToSae = null;
      this.bankTransactionFee = null;
      this.brokerMargin = null;
      this.brokerTransport = null;
      this.ngo = null;
    },
    showPDF() {
      const fileName = `${this.saleId}.pdf`;
      var doc = new jsPDF("p", "pt", "a4");
      var elementHandler = {
        "#ignorePDF": function (element, renderer) {
          return true;
        },
        "#ignoreThis": function (element, renderer) {
          return true;
        },
      };

 var src = window.document.getElementById("reportTbl").innerHTML;
       var varNewElem = document.createElement('table');
       varNewElem.setAttribute("id","pdfTableContent");
        varNewElem.setAttribute("border","1");
       varNewElem.setAttribute("style","width:100%");
       varNewElem.innerHTML = src;
        
       doc.html(varNewElem, {
          callback: function (doc) {
            doc.save(fileName);
          },
          x: 10,
          y: 10,
          fileName: fileName,
        });
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else if (localStorage.systemRole == 13) {
        Router.push("observer-dashboard");
      }
    },
  },
};
</script>
<style>
#pdfTableContent
{
  width: 520px !important;
  height: auto !important;
   border-collapse: collapse !important;
}
#pdfTableContent td:nth-child(odd)
 {width: 210px !important;
  padding: 10px !important;}

#pdfTableContent td:nth-child(even)
 {width: 210px !important;
  padding: 10px !important;}
#pdfTableContent tbody
{
  width:100% !important;
}
#pdfTableContent tr,#pdfTableContent td
{
  background-color: #fff !important;
  color:#000 !important;
  width:100% !important;
}
</style>
<style scoped>
/* #paymenttable .btn-lot:active {
  background-color: darkolivegreen;
} */
#paymenttable .btn-lot:focus {
  background-color: darkolivegreen;
}
#lotstable tr:first-child th:first-child {
  width: 168px !important;
}
#lotstable tr:nth-child(n) td:first-child {
  width: 168px !important;
}

/* #lottable tr:first-child th:nth-child(4) {
  width: 215px !important;
} */
#lotstable tr:nth-child(n) td:nth-child(3),
#lotstable tr:nth-child(n) td:nth-child(5),
#lotstable tr:first-child th:nth-child(5) {
  text-align: center !important;
}
.lots-table tr td:nth-child(4) {
  text-align: left !important;
  float: none !important;
}
/* .VueTables__child-row {
  background-color: #fff !important;
}
.hideChildToggler .VueTables__child-row-toggler {
  display: none;
} */
/* .VueTables__child-row-toggler {
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
} */

/*
.VueTables__child-row--closed {
  display: none;
}
*/
.btn-save,
.btn-cancel {
  height: 30px !important;
}
/* .pdf-table tr:nth-child(2) td:nth-child(2),
.pdf-table tr:nth-child(5) td:nth-child(2),
.pdf-table tr:nth-child(6) td:nth-child(2),
.pdf-table tr:nth-child(7) td:nth-child(2),
.pdf-table tr:nth-child(8) td:nth-child(2),
.pdf-table tr:nth-child(9) td:nth-child(2),
.pdf-table tr:nth-child(10) td:nth-child(2),
.pdf-table tr:nth-child(11) td:nth-child(2),
.pdf-table tr:nth-child(12) td:nth-child(2),
.pdf-table tr:nth-child(13) td:nth-child(2),
.pdf-table tr:nth-child(14) td:nth-child(2),
.pdf-table tr:nth-child(15) td:nth-child(2) {
  text-align: right !important;
}
.pdf-table tr td:nth-child(2) {

  width: 355px;
  padding-right: 20px !important;
}
.pdf-table tr td:nth-child(1) {
  width: 250px;
  border-right: 1px solid #ededed !important;
} */
</style>
<style>
.lots-table {
  border: 1px solid #000 !important;
}

.lots-table tr:nth-child(even) {
  background: transparent !important;
}
.lots-table th:nth-child(3) {
  text-align: center !important;
}
.lots-table th:nth-child(4) {
  width: 215px !important;
}
.lots-table td:nth-child(3),
.lots-table th:nth-child(5) {
  text-align: right !important;
}
.lots-table td:nth-child(6),
.lots-table td:nth-child(4) {
  float: left !important;
}
.lots-table th:nth-child(2),
.lots-table th:nth-child(3) {
  width: 210px !important;
}
.lots-table td:nth-child(5),
.lots-table th:nth-child(5) {
  width: 215px !important;
}

/* .lots-table th:nth-child(3) {
  width: 220px !important;
} */
/* .VueTables__child-row-toggler {
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
} */
#lotDisplayTable .row:first-child {
  display: none !important;
}
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
@import "../../assets/css/main.css";

#modalbreakdown .modal-header {
  height: 50px !important;
}
#modalbreakdown .modal-header .close {
  margin-top: -12px !important;
}
#modalbreakdown .modal-header h5 {
  margin: -10px auto !important;
}
#modalbreakdown .modal-content {
  min-width: 600px !important;
  max-width: 600px !important;
}
#modalpenalty .modal-header {
  height: 50px !important;
  padding: 11px !important;
}
.btn-invoice {
  color: #fff !important;
  border-bottom: 1px solid #fff;
  cursor: pointer;
}
.lbl-modal-success {
  color: #fff;
}
#dropdownlist_options {
  background: transparent !important;
  color: #fff;
  padding: 0 !important;
}
.button-container {
  float: right;
}
.btn-savefeed
{
    background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 13px;
  width: 180px !important;
  height: 26px;
  /* margin: 5px; */
  float: right;
  color: #fff;
}
.btn-save {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 13px;
  width: 115px;
  height: 26px;
  /* margin: 5px; */
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
  /* color: #fff !important; */
  color: #a8a8a8 !important;
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
  min-width: 800px;
  max-width: 800px;
  margin: 0px auto !important;
}
.modal-header {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

/* .lots-table tr th:nth-child(3),
.lots-table tr td:nth-child(3)
{
  float: right !important;
} */
.payment-reporting-table thead tr th:nth-child(5),
.payment-reporting-table tbody tr td:nth-child(5),
.payment-reporting-table thead tr th:nth-child(6),
.payment-reporting-table tbody tr td:nth-child(6),
.payment-reporting-table thead tr th:nth-child(7),
.payment-reporting-table tbody tr td:nth-child(7) {
  text-align: right !important;
}

.payment-reporting-table thead tr td:nth-child(4),
.payment-reporting-table thead tr th:nth-child(4),
.payment-reporting-table thead tr th:nth-child(8),
.payment-reporting-table thead tr td:nth-child(8),
.payment-reporting-table thead tr th:nth-child(9),
.payment-reporting-table thead tr td:nth-child(9) {
  text-align: center !important;
}
/* .payment-reporting-table thead tr th:nth-child(3),
.payment-reporting-table tbody tr td:nth-child(3) {
  min-width: 160px;
} */
.modal-header .close {
  color: #fff !important;
  font-size: 2.5rem !important;
  /* margin: 0 !important; */
  padding: 0 !important;
  margin: -4px 13px !important;
}
.modal-scroll {
  height: 450px;
}

.dropdownlist {
  width: 95%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff !important;
  height: 36px;
}
.fullname-dropdown #dropdownlist_hidden {
  float: right;
  border: none;
  border-bottom: 1px solid #fff;
  background: transparent;
  width: 0%;
  color: #fff;
  height: 36px;
}
.full-name-container span {
  margin: 0px;
}
.view-batches-v-select .vs__dropdown-toggle {
  border: none;
  border-bottom: 1px solid #fff;
  border-radius: 0px;
  margin: 15px 0px 0px 0px !important;
}
.view-batches-v-select {
  font-size: 13px;
}
.view-batches-v-select span,
.view-batches-v-select input,
.view-batches-v-select .vs__no-options {
  color: #fff;
}
.view-batches-v-select span {
  margin-left: 0px;
  padding-left: 0px;
}
.view-batches-v-select .vs__dropdown-menu {
  background: none;
  padding: 0px;
  max-height: 155px;
}
.view-batches-v-select .vs__dropdown-option {
  color: #fff;
  padding: 10px;
  background: #1e2318;
}
.view-batches-v-select .vs__dropdown-option--highlight {
  background: #000;
}
.view-batches-v-select .vs__open-indicator,
.view-batches-v-select .vs__clear {
  fill: #fff;
}
.view-batches-v-select .vs__selected-options,
.view-batches-v-select .vs__search,
.vs__search:focus {
  padding: 0px;
  margin: 0px;
}
.view-batches-v-select .vs__dropdown-toggle {
  padding: 0px;
  padding-bottom: 2px;
  margin: 15px 0px;
}
.view-batches-v-select .vs__selected {
  margin: 0px;
  padding: 0px;
}
.view-batches-v-select .vs__clear {
  margin-top: -10px;
}
.view-batches-v-select .vs__open-indicator {
  margin-top: -5px;
}
.tbl-sell-list thead tr th,
.tbl-sell-list tbody tr td {
  text-align: left !important;
}
.view-batches-table thead tr th {
  font-weight: bold;
}
.payment-reporting-table .VueTables__search-field input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}
.payment-reporting-table .VueTables__limit-field select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}

@media screen and (max-width: 768px) {
  .view-batches-table tbody tr td:nth-child(6) {
    padding-right: 20px !important;
  }
}
</style>
<style scoped>
#penaltyModal .view-ds-ps {
  height: auto !important;
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
.view-batches-table tbody tr td:nth-child(4) {
  text-align: center;
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
  /* height: auto;
  padding: 15px; */
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

/* .view-batches-table th:nth-child(3) {
  text-align: center;
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
} */
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
.service-img-container {
  width: 46%;
  float: left;
  margin: 10px;
}
.main-container {
  background: rgba(0, 0, 0, 0.2);
}

.content-container {
  height: fit-content;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
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
}
.sub-heading {
  color: #fff !important;
  text-align: center;
  margin: 20px 0px;
}
.unit-price-container {
  margin-top: 40px;
}
@media screen and (max-width: 1063px) and (min-width: 768px) {
  .col-md-6 {
    max-width: 100% !important;
    width: 100% !important;
    flex: 100%;
  }
  .lots-table td:first-child,
  .lots-table th:first-child {
    width: 269px !important;
  }
  .lots-table td:nth-child(3),
  .lots-table th:nth-child(3) {
    width: 326px !important;
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
.content-container {
  height: fit-content;
  margin: auto;
  margin-top: -30px;
}
.content-container {
  height: fit-content;
  margin: auto;
  margin-top: 40px;
  margin-bottom: 40px;
}
.main-container {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0px 0px 5px 5px;
  border: 1px solid #000;
  border-top: 0px !important;
  margin: 0px 0px 15px 0px;
}
.main-container {
  background: rgba(0, 0, 0, 0.2);
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
.pdf-table {
  color: #fff !important;
  font-size: 13px !important;
  border: 1px solid rgba(0, 0, 0, 0.7) !important;
  border-radius: 30px !important;
}
.pdf-table tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
.pdf-table tr:nth-of-type(even) {
  background: rgba(0, 0, 0, 0.4) !important;
}
.view-ds-ps {
  height: 400px;
}
.btn-wrap {
  position: absolute;
  right: 15px;
}
.color-white {
  color: #fff;
  padding-top: 10px;
}
.pdf-table-priniting > tr > td {
  background-color: #fff;
  color: #000 !important;
}
</style>
