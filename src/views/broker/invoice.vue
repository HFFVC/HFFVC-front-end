<template>
  <div class="lsp-dashboard">
    <Offline @detected-condition="handleConnectivityChange"></Offline>

    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>

    <div class="row content">
      <!-- <div class="col-md-12 no-padding main-header">
        <div class="logo-container cursor-pointer" @click="gotoDashboard">
          <img class="img-logo-lsp" alt="agriledger logo" src="../../assets/images/logo.png" />
          <sup class="beta">(BETA)</sup>
        </div>
        <div class="username-conatiner-lsp">
          <img class="user-icon" alt="agriledger logo" src="../../assets/images/user.png" />
          <label class="lbl-username-lsp">{{userName}}</label>
          <br />
          <a href="#" v-on:click="logout" class="ref-logout-lsp">Logout</a>
        </div>
      </div>-->
      <Header ref="headercomp"></Header>
      <div class="col-md-10 content-container">
        <div class="header-container">
          <h3 class="heading">{{ $t("Invoice", "Invoice") }}</h3>
          <div class="icon-container">
            <ul>
              <li>
                <img
                  @click="showHome"
                  class="sub-header-close-img"
                  src="../../assets/images/close.png"
                />
              </li>
            </ul>
          </div>
        </div>
        <div class="main-container">
          <div
            id="people"
            class="invoice-payment-table-wrap view-broker-batches-invoice-wrap"
          >
            <v-client-table
              :data="serviceRequests"
              :columns="columns"
              :options="options"
              class="tbl-services tbl-view-broker-batches"
            >
              <template slot="View" slot-scope="props">
                <div>
                  <a class="btn-icn" @click="viewBatch(props.row)">
                    <img
                      class="location-img"
                      src="../../assets/images/view.png"
                    />
                  </a>
                </div>
              </template>
              <template slot="P O" slot-scope="props">
                <div>
                  <div class="tooltip">
                    <b-form-file
                      v-model="pOrder"
                      v-if="props.row.purchaseOrderUrl == undefined"
                      @input="purchaseOrder(props.row)"
                    ></b-form-file>
                    <span class="tooltiptext">{{
                      $t("Upload Purchase Order", "Upload Purchase Order")
                    }}</span>
                  </div>
                  <div class="tooltip potooltip">
                    <a
                      class="btn-icn po-view-anchor"
                      v-if="props.row.purchaseOrderUrl != undefined"
                      :href="props.row.purchaseOrderUrl"
                      target="_blank"
                    >
                      {{ props.row.purchaseOrderFileName }}
                      <img
                        class="location-img download-po-img"
                        src="../../assets/images/download-button.png"
                      />
                    </a>
                    <span class="tooltiptext">{{
                      $t("View Purchase Order", "View Purchase Order")
                    }}</span>
                  </div>
                </div>
              </template>
              <div style="clear: both"></div>
              <template slot="Generate Invoice" slot-scope="props">
                <div class="invoice-container">
                  <a class="btn-icn" @click="generateInvoice(props.row)">
                    <img
                      class="location-img"
                      src="../../assets/images/generate_invoice.png"
                    />
                  </a>
                </div>
              </template>
              <template slot="Payment" slot-scope="props">
                <div
                  v-if="props.row.canGenerateInvoice && props.row.isPaymentShow"
                >
                  <a class="btn-icn" @click="confirmPayment(props.row)">
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
      <Footer ref="footercomp"></Footer>
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
              >{{ $t("Invoice No", "Invoice No") }} *</label
            >
            <input
              class="text-input"
              type="text"
              readonly
              v-model="invoiceNo"
            />
          </div>
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Billing Date", "Billing Date") }} *</label
            >
            <input
              class="text-input"
              type="text"
              :readonly="invoiceReadonly"
              v-model="billingDate"
            />
          </div>
          <div class="inp-container invoice-payment-v-select-wrap">
            <label class="input-label"
              >{{ $t("Broker Name", "Broker Name") }} *</label
            >

            <input
              class="text-input"
              type="text"
              readonly
              v-model="brokerName"
            />

            <!-- <v-select
              v-model="brokerName"
              placeholder
              class="invoice-payment-v-select"
              :options="brokers"
              :disabled="invoiceReadonly"
              @input="onselect()"
            ></v-select>-->
          </div>
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Broker Organization", "Broker Organization") }} *</label
            >
            <input
              class="text-input"
              type="text"
              readonly
              v-model="brokerOrganization"
            />
          </div>
          <!-- <h4 class="sub-heading">Buyer Details</h4> -->
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Buyer Name", "Buyer Name") }} *</label
            >
            <input
              class="text-input"
              type="text"
              :readonly="invoiceReadonly"
              v-model="buyerName"
            />
          </div>
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Buyer Organization", "Buyer Organization") }} *</label
            >
            <input
              class="text-input"
              type="text"
              :readonly="invoiceReadonly"
              v-model="buyerOrganization"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{ $t("Product", "Product") }} *</label>
            <input class="text-input" type="text" readonly v-model="product" />
          </div>
          <div class="inp-container">
            <label class="input-label"
              >{{
                $t("No of Boxes Purchased", "No of Boxes Purchased")
              }}
              *</label
            >
            <input
              class="text-input"
              type="number"
              readonly
              v-model="noofBoxesPurchased"
            />
          </div>
          <div class="inp-container invoice-payment-v-select-wrap">
            <label class="input-label"
              >{{ $t("Currency", "Currency") }} *</label
            >
            <v-select
              v-model="pricePerKgCurrency"
              :placeholder="$t('Select Currency', 'Select Currency')"
              class="invoice-payment-v-select"
              :options="currencySource"
              :disabled="invoiceReadonly"
            ></v-select>
          </div>
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Price Per Kg", "Price Per Kg") }} *</label
            >
            <span class="prefixCurrency">
              <span class="pref" v-if="this.pricePerKgCurrency == 'USD'"
                >$</span
              >
              <span class="pref" v-if="this.pricePerKgCurrency == 'HTG'"
                >G</span
              >
              <input
                class="text-input"
                type="number"
                :readonly="invoiceReadonly"
                v-model="pricePerKg"
              />
            </span>
            <!-- <input
              class="text-input"
              type="number"
              :readonly="invoiceReadonly"
              v-model="pricePerKg"
            />-->
          </div>
          <div class="inp-container">
            <label class="input-label"
              >{{
                $t(
                  "Approximate Weight of Product Sold",
                  "Approximate Weight of Product Sold"
                )
              }}
              *</label
            >
            <input
              class="text-input"
              type="text"
              readonly
              v-model="aproximateWeightOfProduct"
            />
          </div>
          <div class="inp-container invoice-payment-v-select-wrap">
            <label class="input-label"
              >{{ $t("Currency", "Currency") }} *</label
            >
            <v-select
              v-model="GICurrency"
              :placeholder="$t('Select Currency', 'Select Currency')"
              class="invoice-payment-v-select"
              :options="currencySource"
              :disabled="invoiceReadonly"
            ></v-select>
          </div>
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Net Sales", "Net Sales") }} *</label
            >
            <span class="prefixCurrency">
              <span class="pref" v-if="this.GICurrency == 'USD'">$</span>
              <span class="pref" v-if="this.GICurrency == 'HTG'">G</span>
              <input
                class="text-input"
                readonly
                type="text"
                v-model="netSales"
              />
            </span>
            <!-- <input class="text-input" readonly type="text" v-model="netSales" /> -->
          </div>
        </perfect-scrollbar>
        <div class="gi-mandatory-warning">
          <span>* {{ $t("Mandatory Fields", "Mandatory Fields") }}</span>
        </div>
        <div class="button-container">
          <input
            type="button"
            :disabled="invoiceReadonly"
            v-on:click="hideGIModal"
            :class="invoiceReadonly ? 'button-disabled' : ''"
            class="btn-cancel"
            :value="$t('Cancel', 'Cancel')"
          />
          <input
            type="button"
            :disabled="invoiceReadonly"
            v-on:click="SaveGI"
            :class="invoiceReadonly ? 'button-disabled' : ''"
            class="btn-save"
            :value="$t('Save', 'Save')"
          />
        </div>
      </b-modal>
      <b-modal
        hide-footer
        id="confirm-payment-modal"
        class
        ref="confirm-payment"
        hide-backdrop
        :title="$t('Confirm Payment', 'Confirm Payment')"
      >
        <perfect-scrollbar class="modal-scroll">
          <div class="inp-container">
            <label class="input-label">{{ $t("Date", "Date") }} *</label>
            <input
              class="text-input"
              type="text"
              :readonly="isPaymentConfirmed"
              v-model="confrimPaymentDate"
            />
          </div>
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Invoice No", "Invoice No") }} *</label
            >
            <input
              class="text-input"
              type="text"
              :readonly="isPaymentConfirmed"
              v-model="confirmPaymentInvoiceNo"
            />
          </div>
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Buyer Name", "Buyer Name") }} *</label
            >
            <input
              class="text-input"
              type="text"
              :readonly="isPaymentConfirmed"
              v-model="confirmPaymentBuyerName"
            />
          </div>
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("No of Boxes Sold", "No of Boxes Sold") }} *</label
            >
            <input
              class="text-input"
              type="text"
              :readonly="isPaymentConfirmed"
              v-model="noOfBoxesSold"
            />
          </div>
          <div class="inp-container invoice-payment-v-select-wrap">
            <label class="input-label"
              >{{ $t("Currency", "Currency") }} *</label
            >
            <v-select
              v-model="paymentPricePerKgCurrency"
              :placeholder="$t('Select Currency', 'Select Currency')"
              class="invoice-payment-v-select"
              :options="currencySource"
              :disabled="isPaymentConfirmed"
            ></v-select>
          </div>
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Price Per Kg", "Price Per Kg") }} *</label
            >
            <span class="prefixCurrency">
              <span class="pref" v-if="this.paymentPricePerKgCurrency == 'USD'"
                >$</span
              >
              <span class="pref" v-if="this.paymentPricePerKgCurrency == 'HTG'"
                >G</span
              >
              <input
                class="text-input"
                type="text"
                :readonly="isPaymentConfirmed"
                v-model="confirmPaymentPricePerKg"
              />
            </span>
            <!-- <input
              class="text-input"
              type="text"
              :readonly="isPaymentConfirmed"
              v-model="confirmPaymentPricePerKg"
            />-->
          </div>
          <div class="inp-container invoice-payment-v-select-wrap">
            <label class="input-label"
              >{{ $t("Currency", "Currency") }} *</label
            >
            <v-select
              v-model="paymentNetReceivablesCurrency"
              :placeholder="$t('Select Currency', 'Select Currency')"
              class="invoice-payment-v-select"
              :options="currencySource"
              :disabled="isPaymentConfirmed"
            ></v-select>
          </div>

          <div class="inp-container invoice-payment-v-select-wrap">
            <label class="input-label"
              >{{
                $t(
                  "Broker Bank Transaction Currency",
                  "Broker Bank Transaction Currency"
                )
              }}
              *</label
            >
            <v-select
              v-model="brokerBankTransactionCurrency"
              :placeholder="$t('Select Currency', 'Select Currency')"
              class="invoice-payment-v-select"
              :options="brokerBankTransactionCurrencySource"
              :disabled="isPaymentConfirmed"
            ></v-select>
          </div>

          <div class="inp-container">
            <label class="input-label"
              >{{
                $t("Broker Bank Transaction Fee", "Broker Bank Transaction Fee")
              }}
              *</label
            >
            <span class="prefixCurrency">
              <span
                class="pref"
                v-if="this.brokerBankTransactionCurrency == 'USD'"
                >$</span
              >
              <span
                class="pref"
                v-if="this.brokerBankTransactionCurrency == 'HTG'"
                >G</span
              >
              <input
                class="text-input"
                type="number"
                @change="calculateNetPayable()"
                :readonly="isPaymentConfirmed"
                v-model="brokerBankTransactionFee"
              />
            </span>
          </div>

          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Net Receivables", "Net Receivables") }} *</label
            >
            <span class="prefixCurrency">
              <span
                class="pref"
                v-if="this.paymentNetReceivablesCurrency == 'USD'"
                >$</span
              >
              <span
                class="pref"
                v-if="this.paymentNetReceivablesCurrency == 'HTG'"
                >G</span
              >
              <input
                class="text-input"
                type="number"
                :readonly="isPaymentConfirmed"
                v-model="netReceivables"
              />
            </span>
          </div>

          <div class="inp-container view-link-wrap">
            <a class="view-link" target="_blank" :href="invoiceURL">{{
              $t("View Invoice", "View Invoice")
            }}</a>
            <a
              class="view-link"
              target="_blank"
              v-if="purchaseOrderUrl"
              v-bind:href="purchaseOrderUrl"
              >{{ $t("View PO", "View PO") }}</a
            >
          </div>

          <div style="clear: both"></div>
          <div class="inp-container lsp-act-container">
            <h4 class="lsp-act-heading">LSP Escrow Account Details</h4>
            <label class="input-label">{{
              $t("LSP Organization Name", "LSP Organization Name")
            }}</label>
            <br />
            <input
              class="text-input"
              type="text"
              :readonly="true"
              v-model="lspOrganizationName"
            />
            <br />
            <label class="input-label">{{
              $t(
                "LSP Organization Escrow Account Number",
                "LSP Organization Escrow Account Number"
              )
            }}</label>
            <br />
            <input
              class="text-input"
              type="text"
              :readonly="true"
              v-model="lspEscrowAccontNumber"
            />
            <br />
            <label class="input-label">{{
              $t("Net Payable", "Net Payable")
            }}</label>
            <br />

            <span class="prefixCurrency">
              <span class="pref">$</span>
              <input
                class="text-input"
                type="text"
                :readonly="true"
                v-model="netPayable"
              />
            </span>
          </div>

          <div class="inp-container factored-radio-container">
            <label class="input-label"
              >{{ $t("Was the Invoice Factored", "Was the Invoice Factored") }}?
              *</label
            >
            <label class="larvae-wrap">
              <input
                v-on:change="wasFactoredChange"
                :readonly="isPaymentConfirmed"
                :disabled="isPaymentConfirmed"
                class="larvae-input radio-btn"
                v-model="wasFactored"
                type="radio"
                name="wasFactored"
                value="Yes"
                :checked="wasFactored == 'Yes'"
              />
              <img
                class="radio-btn-img larvae-rb-img"
                disabled="isPaymentConfirmed"
              />
              {{ $t("Yes", "Yes") }}
            </label>
            <label class="larvae-wrap">
              <input
                :readonly="isPaymentConfirmed"
                :disabled="isPaymentConfirmed"
                v-on:change="wasFactoredChange"
                class="larvae-input radio-btn"
                v-model="wasFactored"
                type="radio"
                name="wasFactored"
                value="No"
                :checked="wasFactored == 'No'"
              />
              <img
                class="radio-btn-img larvae-rb-img"
                disabled="isPaymentConfirmed"
              />
              {{ $t("No", "No") }}
            </label>
          </div>
          <div class="inp-container" v-if="wasFactored == 'Yes'">
            <label class="input-label"
              >{{ $t("Amount Factored", "Amount Factored") }} (USD) *</label
            >
            <input
              class="text-input"
              :readonly="isPaymentConfirmed"
              type="number"
              v-model="amountFactored"
            />
          </div>
          <div class="inp-container" v-if="wasFactored == 'Yes'">
            <label class="input-label"
              >{{ $t("Factoring Entity", "Factoring Entity") }} *</label
            >
            <input
              class="text-input"
              :readonly="isPaymentConfirmed"
              type="text"
              v-model="factoringEntity"
            />
          </div>
          <div class="inp-container" v-if="wasFactored == 'Yes'">
            <label class="input-label"
              >{{ $t("Factoring Agent", "Factoring Agent") }} *</label
            >
            <input
              class="text-input"
              :readonly="isPaymentConfirmed"
              type="text"
              v-model="factoringAgent"
            />
          </div>
          <div class="inp-container" v-if="wasFactored == 'Yes'">
            <label class="input-label"
              >{{ $t("Contact Details", "Contact Details") }} *</label
            >
            <input
              class="text-input"
              :readonly="isPaymentConfirmed"
              type="text"
              v-model="factoringContactDetails"
            />
          </div>
          <div class="inp-container" v-if="wasFactored == 'Yes'">
            <label class="input-label"
              >{{ $t("Factoring Charges", "Factoring Charges") }} (%) *</label
            >
            <input
              class="text-input"
              :readonly="isPaymentConfirmed"
              type="number"
              v-model="factoringCharges"
            />
          </div>
        </perfect-scrollbar>
        <div class="button-container">
          <!-- <input
            :disabled="isPaymentConfirmed"
            type="button"
            :class="isPaymentConfirmed?'button-disabled':''"
            v-on:click="hideConfirmPaymentModal"
            class="btn-cancel"
            value="Cancel"
          />-->
          <input
            type="button"
            v-on:click="hideConfirmPaymentModal"
            class="btn-cancel"
            :value="$t('Cancel', 'Cancel')"
          />
          <input
            :disabled="isPaymentConfirmed"
            type="button"
            :class="isPaymentConfirmed ? 'button-disabled' : ''"
            v-on:click="openIsConfirmPaymentModal()"
            class="btn-save"
            :value="$t('Save', 'Save')"
          />
        </div>
      </b-modal>
      <b-modal
        hide-footer
        id="isconfirm-payment-modal"
        class
        ref="isconfirm-payment"
        hide-backdrop
        :title="$t('Confirm Payment', 'Confirm Payment')"
      >
        <h4 class="confirm-message">
          {{ $t("Net Sales is", "Net Sales is") }}:
          <label>{{ netSales }}USD</label>
          {{ $t("and Net receivables is", "and Net receivables is") }}:
          <label>{{ netReceivables }}USD</label>.
          {{
            $t(
              "Are you sure you want to confirm the payment",
              "Are you sure you want to confirm the payment"
            )
          }}
          ??
        </h4>

        <input
          type="button"
          v-on:click="SaveConfirmPayment"
          class="btn-save float-right"
          :value="$t('Confirm', 'Confirm')"
        />
        <input
          type="button"
          v-on:click="hideIsConfirmPaymentModal"
          class="btn-cancel float-right"
          :value="$t('Cancel', 'Cancel')"
        />
      </b-modal>
      <b-modal
        ref="success-modal"
        hide-footer
        hide-header
        :title="$t('Status', 'Status')"
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
import firebase, { functions } from "firebase";
import axios from "axios";
import "../../assets/css/main.css";
import "../../assets/css/manage-services.css";
import { ClientTable } from "vue-tables-2";
import BootstrapVue from "bootstrap-vue";
import moment from "moment";
import tz from "moment-timezone";
import Datetime from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
import mailService from "../../shared/buyer-email-service";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
import Footer from "../../components/footer-view";
import sendSMS from "../../shared/sms-service";
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
import Header from "../../components/header-view";
import Offline from "v-offline";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from "../../shared/auth";

export default {
  components: {
    PerfectScrollbar,
    Header,
    Footer,
    Offline,
  },
  name: "invoice",
  data: function () {
    return {
      serviceRequests: [],
      columns: [
        "Buyer's Name",
        "Buyer's Contact Details",
        "Buyer's Email",
        "dateOfSale",
        "No of Boxes",
        "P O",
        "Generate Invoice",
        "Payment",
      ],
      seen: true,
      show: false,
      selectedRow: null,
      userName: "",
      succesContent: "",
      isGI: true,
      isConfirm: false,

      options: {
        perPage: 10,
        sortable: ["Buyer's Name", "dateOfSale"],
        headings: {
          "Buyer's Name": `${this.$t("Buyer's Name", "Buyer's Name")}`,
          "Buyer's Contact Details": `${this.$t(
            "Buyer's Contact Details",
            "Buyer's Contact Details"
          )}`,
          "Buyer's Email": `${this.$t("Buyer's Email", "Buyer's Email")}`,
          dateOfSale: `${this.$t("Date of Sale", "Date of Sale")}`,
          "No of Boxes": `${this.$t("No of Boxes", "No of Boxes")}`,
          "P O": `${this.$t("P O", "P O")}`,
          "Generate Invoice": `${this.$t(
            "Generate Invoice",
            "Generate Invoice"
          )}`,
          Payment: `${this.$t("Payment", "Payment")}`,
        },
        customSorting: {
          dateOfSale: function (ascending) {
            return function (a, b) {
              let dateA = new Date(a.dateOfSale);
              let dateB = new Date(b.dateOfSale);

              if (ascending) return dateA >= dateB ? 1 : -1;

              return dateA <= dateB ? 1 : -1;
            };
          },
        },
        orderBy: {
          ascending: false,
          column: "dateOfSale",
        },
      },

      invoiceNo: null,
      billingDate: null,
      brokerName: null,
      brokerOrganization: null,
      buyerName: null,
      buyerOrganization: null,
      product: null,
      noofBoxesPurchased: null,
      pricePerKg: null,
      confrimPaymentDate: moment.utc().local().format("MMM DD, YYYY hh:mm A"),
      confirmPaymentInvoiceNo: null,
      confirmPaymentPricePerKg: null,
      noOfBoxesSold: null,
      confirmPaymentBuyerName: null,
      netReceivables: null,
      batchId: "",
      netSales: null,
      currencySource: ["USD"],
      GICurrency: "USD",
      amountFactored: null,
      wasFactored: null,
      amountFactoredShowFlag: false,
      brokers: [],
      completeBrokerData: [],
      fullName: null,
      invoiceReadonly: false,
      isPaymentConfirmed: false,
      aproximateWeightOfProduct: null,
      lotId: null,
      brokerPercent: null,
      brokerTransportFlatFee: null,
      invoiceURL: null,
      paymentPricePerKgCurrency: "USD",
      paymentNetReceivablesCurrency: null,
      purchaseOrderUrl: null,
      pricePerKgCurrency: "USD",
      factoringEntity: null,
      factoringAgent: null,
      factoringContactDetails: null,
      factoringCharges: null,
      pOrder: null,
      pOrderURL: null,
      networkStatus: true,
      lspEscrowAccontNumber: null,
      lspOrganizationName: null,
      brokerBankTransactionCurrency: "USD",
      brokerBankTransactionFee: null,
      netPayable: null,
      brokerBankTransactionCurrencySource: ["USD"],
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
            text: this.$t("Active Batches", "Active Batches"),
            href: "/view-broker-batches",
          },
          { text: this.$t("Invoice", "Invoice"), href: "/invoice/:id" },
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
            text: this.$t("Active Batches", "Active Batches"),
            href: "/view-broker-batches",
          },
          { text: this.$t("Invoice", "Invoice"), href: "/invoice/:id" },
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
          text: this.$t("Active Batches", "Active Batches"),
          href: "/view-broker-batches",
        },
        { text: this.$t("Invoice", "Invoice"), href: "/invoice/:id" },
      ]);
    } else if (localStorage.systemRole == 4 || localStorage.systemRole == 5) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Broker-Dashboard", "Broker-Dashboard"),
          href: "/broker-dashboard",
        },
        {
          text: this.$t("Active Batches", "Active Batches"),
          href: "/view-broker-batches",
        },
        { text: this.$t("Invoice", "Invoice"), href: "/invoice/:id" },
      ]);
    } else if (localStorage.systemRole == 97) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Broker SPOC-Dashboard", "Broker SPOC-Dashboard"),
          href: "/broker-dashboard",
        },
        {
          text: this.$t("Active Batches", "Active Batches"),
          href: "/view-broker-batches",
        },
        { text: this.$t("Invoice", "Invoice"), href: "/invoice/:id" },
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
          text: this.$t("Active Batches", "Active Batches"),
          href: "/view-broker-batches",
        },
        { text: this.$t("Invoice", "Invoice"), href: "/invoice/:id" },
      ]);
    }
    this.batchId = this.$route.params.id;
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.getData();
    // this.getBrokers();
    this.userName = localStorage.userName;
  },

  methods: {
    handleConnectivityChange(status) {
      this.networkStatus = status;
    },
    // onselect: function() {
    //   let currentVal = this;
    //   var valObj = this.completeBrokerData.filter(function(elem) {
    //     if (currentVal.brokerName != null && currentVal.brokerName != "") {
    //       if (elem.name.trim() == currentVal.brokerName.trim()) {
    //         currentVal.brokerOrganization = elem.organization;
    //         currentVal.selectedBroker = elem;
    //       }
    //     }
    //   });
    // },
    // getBrokers: function(event) {
    //   var currentVal = this;
    //   var ref = firebase
    //     .database()
    //     .ref()
    //     .child("masters")
    //     .child("broker");

    //   ref.on("value", function(snapshot) {
    //     snapshot.forEach(requestData => {
    //       currentVal.brokers.push(requestData.val().name);
    //       currentVal.completeBrokerData.push(requestData.val());
    //     });
    //   });
    // },
    getData: function () {
      //working
      let currentValue = this;
      currentValue.seen = true;
      currentValue.serviceRequests = [];
      var ref = firebase
        .database()
        .ref()
        .child("batch")
        .child(this.batchId)
        .child("sell");

      ref.on("child_added", function (snapshot) {
        console.log(snapshot.val());
        var isPaymentShow = false;
        var isPayamentDone = false;
        var isInvoiceCompleted = false;
        if (snapshot.val().confirmPayment != undefined) {
          isPayamentDone = true;
        }
        if (snapshot.val().invoice != undefined) {
          isPaymentShow = true;
        }
        currentValue.serviceRequests.push({
          "Buyer's Name": snapshot.val().sellBuyerName,
          "Buyer's Contact Details": snapshot.val().sellBuyerContactDetails,
          "Buyer's Email": snapshot.val().sellBuyerEmailAddress,
          dateOfSale: moment
            .utc(snapshot.val().saleTransactionDate)
            .local()
            .format("MMM DD, YYYY hh:mm A"),
          "No of Boxes": snapshot.val().totalNoOfBoxesSold,
          sellId: snapshot.val().sellId,
          batchId: snapshot.val().batchId,
          sellBuyerName: snapshot.val().sellBuyerName,
          sellBuyerOrganization: snapshot.val().sellBuyerOrganization,
          salesPricePerKg: snapshot.val().salesPricePerKg,
          totalNoOfBoxesSold: snapshot.val().totalNoOfBoxesSold,
          snapShotKey: snapshot.key,
          soldProduct: snapshot.val().soldProduct,
          isPayamentDone: isPayamentDone,
          isPaymentShow: isPaymentShow,
          brokerPercent: snapshot.val().salesBrokerMargin,
          brokerTransportFlatFee: snapshot.val().sellCostOfTransportation,
          dateAndTimeOfLoading: moment
            .utc(snapshot.val().dateAndTimeOfLoading)
            .local()
            .format("MMM DD, YYYY hh:mm A"),
          dateAndTimeOfUnLoading: moment
            .utc(snapshot.val().dateAndTimeOfUnLoading)
            .local()
            .format("MMM DD, YYYY hh:mm A"),
          canGenerateInvoice:
            snapshot.val().dateAndTimeOfLoading &&
            snapshot.val().dateAndTimeOfUnLoading
              ? true
              : false,
          purchaseOrderUrl:
            snapshot.val().buyerFeedback != undefined
              ? snapshot.val().buyerFeedback.purchaseOrderUrl
              : undefined,
          purchaseOrderFileName:
            snapshot.val().buyerFeedback != undefined
              ? snapshot.val().buyerFeedback.purchaseOrderFileName
              : undefined,
          phoneNumbers: snapshot.val().phoneNumbers,
          netSaleAmountCal: snapshot.val().netSaleAmountCal,
          approximateWeightProductCal: snapshot.val()
            .approximateWeightProductCal,
          brokerBankTransactionCurrency:
            snapshot.val().brokerBankTransactionCurrency || null,
          brokerBankTransactionFee:
            snapshot.val().brokerBankTransactionFee || null,
          netPayable: snapshot.val().netPayable,
        });

        currentValue.serviceRequests.reverse();
        currentValue.seen = false;
        currentValue.show = true;
      });
    },
    showHome: function () {
      Router.push({ path: "/view-broker-batches" });
    },
    generateInvoice: function (item) {
      if (item.canGenerateInvoice) {
        this.selectedRow = null;
        this.selectedRow = item;
        this.invoiceReadonly = false;
        this.$refs["generate-invoice"].show();
        let currentValue = this;
        firebase
          .database()
          .ref()
          .child("batch")
          .child(currentValue.selectedRow.batchId)
          .child("proforma")
          .on("value", function (data) {
            currentValue.brokerOrganization = data.val().brokerOrganization;
            currentValue.brokerName = data.val().batchProforma_FullName;
          });
        var interRef = firebase
          .database()
          .ref()
          .child("batch")
          .child(currentValue.selectedRow.batchId)
          .child("sell");

        interRef.on("child_added", function (data) {
          if (data.key == currentValue.selectedRow.snapShotKey) {
            if (data.val().invoice != undefined) {
              currentValue.invoiceReadonly = true;

              currentValue.invoiceNo = data.val().invoice.invoiceNo;
              currentValue.billingDate = moment
                .utc(data.val().invoice.billingDate)
                .local()
                .format("MMM DD, YYYY hh:mm A");
              currentValue.buyerName = data.val().invoice.buyerName;
              currentValue.buyerOrganization = data.val().invoice.buyerOrganization;
              currentValue.noofBoxesPurchased = data.val().invoice.noofBoxesPurchased;
              currentValue.pricePerKg = data.val().invoice.pricePerKg;
              currentValue.pricePerKgCurrency = data.val().invoice.pricePerKgCurrency;
              currentValue.product = data.val().invoice.product;
              currentValue.brokerOrganization = data.val().invoice.brokerOrganization;
              currentValue.brokerName = data.val().invoice.brokerName;
              currentValue.netSales = data.val().invoice.netSales;
              currentValue.aproximateWeightOfProduct = data.val().invoice.aproximateWeightOfProduct;
              currentValue.GICurrency = data.val().invoice.GICurrency;
              currentValue.brokerPercent = data.val().brokerPercent;
              currentValue.brokerTransportFlatFee = data.val().brokerTransportFlatFee;
              currentValue.seen = false;
              currentValue.show = true;
            } else {
              currentValue.invoiceNo =
                "IN-" + moment(String(new Date())).format("YYYYMMDDHHmmss");
              currentValue.billingDate = moment(String(new Date())).format(
                "YYYY/MM/DD HH:mm:ss"
              );

              currentValue.buyerName = currentValue.selectedRow.sellBuyerName;
              currentValue.buyerOrganization =
                currentValue.selectedRow.sellBuyerOrganization;
              currentValue.noofBoxesPurchased =
                currentValue.selectedRow.totalNoOfBoxesSold;
              currentValue.pricePerKg =
                currentValue.selectedRow.salesPricePerKg;
              currentValue.product = currentValue.selectedRow.soldProduct;
              currentValue.brokerPercent =
                currentValue.selectedRow.brokerPercent;
              currentValue.brokerTransportFlatFee =
                currentValue.selectedRow.brokerTransportFlatFee;
              currentValue.seen = false;
              currentValue.show = true;
              currentValue.netSales = currentValue.selectedRow.netSaleAmountCal;
              currentValue.aproximateWeightOfProduct =
                currentValue.selectedRow.approximateWeightProductCal;
              //   if (currentValue.product == "Mango") {
              //     currentValue.netSales =
              //       Number(currentValue.selectedRow.totalNoOfBoxesSold) *
              //       Number(currentValue.selectedRow.salesPricePerKg) *
              //       4.5;
              //     currentValue.aproximateWeightOfProduct =
              //       Number(currentValue.selectedRow.totalNoOfBoxesSold) * 4.5;
              //   } else if (currentValue.product == "Avocado") {
              //     currentValue.netSales =
              //       Number(currentValue.selectedRow.totalNoOfBoxesSold) *
              //       Number(currentValue.selectedRow.salesPricePerKg) *
              //       5;
              //     currentValue.aproximateWeightOfProduct =
              //       Number(currentValue.selectedRow.totalNoOfBoxesSold) * 5;
              //   } else {
              //     currentValue.netSales =
              //       Number(currentValue.selectedRow.totalNoOfBoxesSold) *
              //       Number(currentValue.selectedRow.salesPricePerKg) *
              //       12.25;
              //     currentValue.aproximateWeightOfProduct =
              //       Number(currentValue.selectedRow.totalNoOfBoxesSold) * 12.25;
              //  }
            }
          }
        });
        currentValue.getServiceRequestId();
      } else {
        Vue.$toast.open({
          message: this.$t(
            "Please complete the Ship Order and Unloading to generate the invoice.",
            "Please complete the Ship Order and Unloading to generate the invoice."
          ),
          type: "warning",
          position: "top",
        });
      }
    },
    confirmPayment: function (item) {
      this.selectedRow = null;
      this.selectedRow = item;
      var currentVal = this;
      currentVal.isPaymentConfirmed = false;
      currentVal.lspOrganizationName = null;
      currentVal.$refs["confirm-payment"].show();
      currentVal.invoiceURL =
        `${getConfigVars().APP_URL}broker-invoice/` +
        currentVal.selectedRow.sellId;
      var ref = firebase
        .database()
        .ref()
        .child("batch")
        .child(this.batchId)
        .child("sell");

      ref.on("child_added", function (snapshot) {
        if (snapshot.key == currentVal.selectedRow.snapShotKey) {
          var ref = firebase
            .database()
            .ref()
            .child("masters")
            .child("organization");
          ref.on("child_added", function (snapshotNew) {
            if (snapshotNew.key === snapshot.val().lspOrganizationKey) {
              currentVal.lspEscrowAccontNumber = (() => {
                switch (snapshot.val().soldProduct) {
                  case "Avocado":
                    return (
                      snapshotNew.val().avocadoEscrowAccNo ||
                      snapshotNew.val().escrowAccountNumber
                    );
                  case "Mango":
                    return (
                      snapshotNew.val().mangoEscrowAccNo ||
                      snapshotNew.val().escrowAccountNumber
                    );
                  case "Pineapple":
                    return (
                      snapshotNew.val().pineappleEscrowAccNo ||
                      snapshotNew.val().escrowAccountNumber
                    );
                  default:
                    return snapshotNew.val().escrowAccountNumber;
                }
              })();
            }
          });

          if (snapshot.val().confirmPayment != undefined) {
            currentVal.confrimPaymentDate = moment
              .utc(snapshot.val().confirmPayment.confrimPaymentDate)
              .local()
              .format("MMM DD, YYYY hh:mm A");
            currentVal.isPaymentConfirmed = true;
            currentVal.lspOrganizationName = snapshot.val().lspOrganizationName;
            currentVal.confirmPaymentInvoiceNo = snapshot.val().confirmPayment.confirmPaymentInvoiceNo;
            currentVal.confirmPaymentBuyerName = snapshot.val().confirmPayment.confirmPaymentBuyerName;
            currentVal.noOfBoxesSold = snapshot.val().confirmPayment.noOfBoxesSold;
            currentVal.confirmPaymentPricePerKg = snapshot.val().confirmPayment.confirmPaymentPricePerKg;
            currentVal.paymentPricePerKgCurrency = snapshot.val().confirmPayment.paymentPricePerKgCurrency;
            currentVal.netReceivables = snapshot.val().confirmPayment.netReceivables;
            currentVal.paymentNetReceivablesCurrency = snapshot.val().confirmPayment.paymentNetReceivablesCurrency;
            currentVal.wasFactored = snapshot.val().confirmPayment.wasFactored;
            currentVal.amountFactored = snapshot.val().confirmPayment.amountFactored;
            currentVal.netSales = snapshot.val().invoice.netSales;
            currentVal.factoringEntity = snapshot.val().confirmPayment.factoringEntity;
            currentVal.factoringAgent = snapshot.val().confirmPayment.factoringAgent;
            currentVal.factoringContactDetails = snapshot.val().confirmPayment.factoringContactDetails;
            currentVal.factoringCharges = snapshot.val().confirmPayment.factoringCharges;
            currentVal.brokerBankTransactionCurrency = snapshot.val().confirmPayment.brokerBankTransactionCurrency;
            currentVal.brokerBankTransactionFee = snapshot.val().confirmPayment.brokerBankTransactionFee;
            currentVal.netPayable = snapshot.val().confirmPayment.netPayable;
            if (snapshot.val().buyerFeedback) {
              currentVal.purchaseOrderUrl = snapshot.val().buyerFeedback.uploadedFileUrl;
            }
          } else {
            currentVal.lspOrganizationName = snapshot.val().lspOrganizationName;
            currentVal.confirmPaymentInvoiceNo = snapshot.val().invoice.invoiceNo;
            currentVal.confirmPaymentBuyerName = snapshot.val().invoice.buyerName;
            currentVal.noOfBoxesSold = snapshot.val().invoice.noofBoxesPurchased;
            currentVal.confirmPaymentPricePerKg = snapshot.val().invoice.pricePerKg;
            currentVal.netSales = snapshot.val().invoice.netSales;
            if (snapshot.val().buyerFeedback) {
              currentVal.purchaseOrderUrl = snapshot.val().buyerFeedback.uploadedFileUrl;
            }
          }
        }
      });
      currentVal.getServiceRequestId();
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
    hideGIModal: function () {
      this.$refs["generate-invoice"].hide();
    },
    getServiceRequestId: function () {
      let currentValue = this;
      currentValue.lotId = null;
      var dbRef = firebase
        .database()
        .ref()
        .child("batch")
        .child(currentValue.selectedRow.batchId)
        .child("lots");
      dbRef.on("child_added", function (snapshot) {
        currentValue.lotId = snapshot.val().serviceRequestId;
      });
    },
    SaveGI: function () {
      if (this.networkStatus) {
        let currentVal = this;
        const buyersEmailId = currentVal.selectedRow["Buyer's Email"];
        const _batchId = currentVal.selectedRow.batchId;
        const _sellId = currentVal.selectedRow.sellId;
        if (
          currentVal.invoiceNo != undefined &&
          currentVal.invoiceNo != null &&
          currentVal.invoiceNo != "" &&
          currentVal.brokerName != undefined &&
          currentVal.brokerName != null &&
          currentVal.brokerName != "" &&
          currentVal.brokerOrganization != undefined &&
          currentVal.brokerOrganization != null &&
          currentVal.brokerOrganization != "" &&
          currentVal.buyerName != undefined &&
          currentVal.buyerName != null &&
          currentVal.buyerName != "" &&
          currentVal.buyerOrganization != undefined &&
          currentVal.buyerOrganization != null &&
          currentVal.buyerOrganization != "" &&
          currentVal.noofBoxesPurchased != undefined &&
          currentVal.noofBoxesPurchased != null &&
          currentVal.noofBoxesPurchased != "" &&
          currentVal.product != undefined &&
          currentVal.product != null &&
          currentVal.product != "" &&
          currentVal.pricePerKg != undefined &&
          currentVal.pricePerKg != null &&
          currentVal.pricePerKg != "" &&
          currentVal.pricePerKgCurrency != undefined &&
          currentVal.pricePerKgCurrency != null &&
          currentVal.pricePerKgCurrency != "" &&
          currentVal.GICurrency != undefined &&
          currentVal.GICurrency != null &&
          currentVal.GICurrency != "" &&
          currentVal.netSales != undefined &&
          currentVal.netSales != null &&
          currentVal.netSales != "" &&
          currentVal.aproximateWeightOfProduct != undefined &&
          currentVal.aproximateWeightOfProduct != null &&
          currentVal.aproximateWeightOfProduct != "" &&
          currentVal.brokerPercent != undefined &&
          currentVal.brokerPercent != null &&
          currentVal.brokerPercent != "" &&
          currentVal.brokerTransportFlatFee != undefined &&
          currentVal.brokerTransportFlatFee != null &&
          currentVal.brokerTransportFlatFee != ""
        ) {
          var dbRef = firebase
            .database()
            .ref()
            .child("batch")
            .child(currentVal.selectedRow.batchId)
            .child("sell")
            .child(currentVal.selectedRow.snapShotKey)
            .child("invoice");
          currentVal.billingDate = moment.utc().toString();
          var inpData = {
            invoiceNo: currentVal.invoiceNo,
            billingDate: moment.utc().toString(),
            brokerName: currentVal.brokerName,
            brokerOrganization: currentVal.brokerOrganization,
            buyerName: currentVal.buyerName,
            buyerOrganization: currentVal.buyerOrganization,
            noofBoxesPurchased: currentVal.noofBoxesPurchased,
            product: currentVal.product,
            pricePerKg: currentVal.pricePerKg,
            pricePerKgCurrency: currentVal.pricePerKgCurrency,
            GICurrency: currentVal.GICurrency,
            netSales: currentVal.netSales,
            aproximateWeightOfProduct: currentVal.aproximateWeightOfProduct,
            brokerPercent: currentVal.brokerPercent,
            brokerTransportFlatFee: currentVal.brokerTransportFlatFee,
          };
          currentVal
            .createInvoiceAPICall(currentVal.selectedRow.sellId, inpData)
            .then((resolved) => {
              dbRef
                .set(inpData)
                .then(function (response) {
                  currentVal.getData();
                  Vue.$toast.open({
                    message: currentVal.$t(
                      "Generated invoice successfully. Email with invoice link sent to the buyer.",
                      "Generated invoice successfully. Email with invoice link sent to the buyer."
                    ),
                    type: "success",
                    position: "top",
                  });
                  currentVal.$refs["generate-invoice"].hide();
                })
                .catch(function (error) {
                  Vue.$toast.open({
                    message: error.message,
                    type: "error",
                    position: "top",
                  });
                  currentVal.erroMessage = error.message;
                  currentVal.seen = false;
                });
            })
            .catch((err) => {
              Vue.$toast.open({
                message: err,
                type: "error",
                position: "top",
              });
              currentVal.erroMessage = err;
              currentVal.seen = false;
            });
        } else {
          Vue.$toast.open({
            message: currentVal.$t(
              "Please fill all the fields.",
              "Please fill all the fields."
            ),
            type: "error",
            position: "top",
          });
        }
      } else {
        this.seen = false;
        Vue.$toast.open({
          message: this.$t(
            "Please check the internet connection",
            "Please check the internet connection"
          ),
          type: "error",
          position: "top",
        });
      }
    },
    hideConfirmPaymentModal: function () {
      this.$refs["confirm-payment"].hide();
    },
    openIsConfirmPaymentModal: function () {
      if (
        this.confirmPaymentInvoiceNo != null &&
        this.confirmPaymentInvoiceNo != undefined &&
        this.confirmPaymentInvoiceNo != "" &&
        this.confirmPaymentBuyerName != null &&
        this.confirmPaymentBuyerName != undefined &&
        this.confirmPaymentBuyerName != "" &&
        this.noOfBoxesSold != null &&
        this.noOfBoxesSold != undefined &&
        this.noOfBoxesSold != "" &&
        this.confirmPaymentPricePerKg != null &&
        this.confirmPaymentPricePerKg != undefined &&
        this.confirmPaymentPricePerKg != "" &&
        this.paymentPricePerKgCurrency != null &&
        this.paymentPricePerKgCurrency != undefined &&
        this.paymentPricePerKgCurrency != "" &&
        this.paymentNetReceivablesCurrency != null &&
        this.paymentNetReceivablesCurrency != undefined &&
        this.paymentNetReceivablesCurrency != "" &&
        this.netReceivables != null &&
        this.netReceivables != undefined &&
        this.netReceivables != "" &&
        this.wasFactored != null &&
        this.wasFactored != undefined &&
        (this.wasFactored == true
          ? this.amountFactored != null &&
            this.amountFactored != undefined &&
            this.amountFactored != "" &&
            this.factoringEntity != null &&
            this.factoringEntity != undefined &&
            this.factoringEntity != "" &&
            this.factoringAgent != null &&
            this.factoringAgent != undefined &&
            this.factoringAgent != "" &&
            this.factoringContactDetails != null &&
            this.factoringContactDetails != undefined &&
            this.factoringContactDetails != "" &&
            this.factoringCharges != null &&
            this.factoringCharges != undefined &&
            this.factoringCharges != ""
          : true)
      ) {
        if (this.netReceivables != this.netSales) {
          this.$refs["isconfirm-payment"].show();
        } else {
          this.SaveConfirmPayment();
        }
      } else {
        Vue.$toast.open({
          message: this.$t(
            "Please fill all the fields.",
            "Please fill all the fields."
          ),
          type: "error",
          position: "top",
        });
      }
    },
    hideIsConfirmPaymentModal: function () {
      this.$refs["isconfirm-payment"].hide();
    },
    SaveConfirmPayment: function () {
      if (this.networkStatus) {
        let currentVal = this;
        var dbRef = firebase
          .database()
          .ref()
          .child("batch")
          .child(currentVal.selectedRow.batchId)
          .child("sell")
          .child(currentVal.selectedRow.snapShotKey)
          .child("confirmPayment");
        currentVal.confrimPaymentDate = moment.utc().toString();
        if (
          !currentVal.brokerBankTransactionCurrency ||
          !currentVal.brokerBankTransactionFee ||
          !currentVal.netPayable
        ) {
          currentVal.seen = false;
          Vue.$toast.open({
            message: this.$t(
              "Please fill all the mandatory fields.",
              "Please fill all the mandatory fields."
            ),
            type: "error",
            position: "top",
          });
          return false;
        }

        var inpData = {
          confrimPaymentDate: moment.utc().toString(),
          confirmPaymentInvoiceNo: currentVal.confirmPaymentInvoiceNo,
          confirmPaymentBuyerName: currentVal.confirmPaymentBuyerName,
          noOfBoxesSold: currentVal.noOfBoxesSold,
          confirmPaymentPricePerKg: currentVal.confirmPaymentPricePerKg,
          paymentPricePerKgCurrency: currentVal.paymentPricePerKgCurrency,
          paymentNetReceivablesCurrency:
            currentVal.paymentNetReceivablesCurrency,
          netReceivables: currentVal.netReceivables,
          wasFactored: currentVal.wasFactored,
          amountFactored:
            currentVal.amountFactored == undefined
              ? null
              : currentVal.amountFactored,
          factoringEntity:
            currentVal.factoringEntity == undefined
              ? null
              : currentVal.factoringEntity,
          factoringAgent:
            currentVal.factoringAgent == undefined
              ? null
              : currentVal.factoringAgent,
          factoringContactDetails:
            currentVal.factoringContactDetails == undefined
              ? null
              : currentVal.factoringContactDetails,
          factoringCharges:
            currentVal.factoringCharges == undefined
              ? null
              : currentVal.factoringCharges,
          brokerBankTransactionCurrency:
            currentVal.brokerBankTransactionCurrency,
          brokerBankTransactionFee: currentVal.brokerBankTransactionFee,
          netPayable: currentVal.netPayable,
        };

        currentVal.createConfirmInvoicePaymentAPICall(
          currentVal.selectedRow.sellId,
          inpData,
          currentVal.selectedRow.batchId
        );
      } else {
        this.seen = false;
        Vue.$toast.open({
          message: this.$t(
            "Please check the internet connection",
            "Please check the internet connection"
          ),
          type: "error",
          position: "top",
        });
      }
    },
    wasFactoredChange: function () {
      if (this.wasFactored == "Yes") {
        this.amountFactoredShowFlag = true;
      } else {
        this.amountFactoredShowFlag = false;
      }
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("/sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else {
        Router.push("/broker-dashboard");
      }
    },
    purchaseOrder(item) {
      const currentVal = this;
      this.seen = true;
      var pOrder = this.pOrder;
      const storageRef = firebase
        .storage()
        .ref(`uploaded-files/BuyerPurchaseOrder/${item.sellId}/${pOrder.name}`);
      const uploadTask = storageRef.put(pOrder);
      var pOrderUrl = null;
      uploadTask.on(
        "state_changed",
        (snapshot) => console.log(snapshot),
        (error) => {
          this.seen = false;
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            pOrderUrl = url;
            var ref = firebase
              .database()
              .ref()
              .child("batch")
              .child(this.batchId)
              .child("sell");

            ref.on("child_added", (snapshot) => {
              if (snapshot.val().sellId == item.sellId) {
                ref
                  .child(snapshot.key)
                  .child("buyerFeedback")
                  .update({
                    purchaseOrderUrl: url,
                    purchaseOrderFileName: pOrder.name,
                  })
                  .then(
                    (response) => {
                      this.seen = false;
                      Vue.$toast.open({
                        message: currentVal.$t(
                          "Successfully uploaded the Purchase Order.",
                          "Successfully uploaded the Purchase Order."
                        ),
                        type: "success",
                        position: "top",
                      });
                      this.getData();
                    },
                    (error) => {
                      this.seen = false;
                    }
                  );
              }
            });
          });
        }
      );
    },
    createInvoiceAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        saleId: serviceId,
        step: "SALE_INVOICE",
        saleInvoice: {
          invoiceNo: inpData.invoiceNo,
          billingDate: moment(inpData.billingDate)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss")
            .toString(),
          brokerName: inpData.brokerName,
          brokerOrganization: inpData.brokerOrganization,
          buyerName: inpData.buyerName,
          buyerOrganization: inpData.buyerOrganization,
          noofBoxesPurchased: inpData.noofBoxesPurchased,
          product: inpData.product,
          pricePerKg: inpData.pricePerKg,
          pricePerKgCurrency: inpData.pricePerKgCurrency,
          GICurrency: inpData.GICurrency,
          netSales: inpData.netSales,
          aproximateWeightOfProduct: inpData.aproximateWeightOfProduct,
          brokerPercent: inpData.brokerPercent,
          brokerTransportFlatFee: inpData.brokerTransportFlatFee,
        },
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50011/api/v1.0/update-sale`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          })
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            //alert("fail");
            //refresh token
            let errorObject = JSON.parse(JSON.stringify(error));
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
                  currentVal
                    .createInvoiceAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      }).catch((err) => {
        console.log(err);
      });
    },
    pushPaymentData(saleId) {
      const vm = this;
      var dbRef = firebase
        .database()
        .ref()
        .child("paymentDistribution")
        .child(saleId);
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
        .then(({ data }) => {
          console.log("LLLL");
          console.log(data);
          dbRef
            .set(data)
            .then(function (response) {
              console.log("data added");
            })
            .catch(function (error) {
              console.log(
                "Error during adding payment distribution to firebase"
              );
            });
        })
        .catch(function (error) {
          console.log("Error during get payment distribution");
        });
    },
    createConfirmInvoicePaymentAPICall(saleId, inpData, batchId) {
      let currentVal = this;
      currentVal.seen = true;
      const data = {
        saleId: saleId,
        step: "CONFIRM_PAYMENT",
        confirmPayment: {
          confirmPaymentDate: moment(inpData.confirmPaymentDate)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss")
            .toString(),
          netReceivables: inpData.netReceivables,
          paymentNetReceivablesCurrency: inpData.paymentNetReceivablesCurrency,
          wasFactored: inpData.wasFactored,
          amountFactored: inpData.amountFactored,
          factoringEntity: inpData.factoringEntity,
          factoringAgent: inpData.factoringAgent,
          factoringContactDetails: inpData.factoringContactDetails,
          factoringCharges: inpData.factoringCharges,
          escrowAccountNo: currentVal.lspEscrowAccontNumber,
          brokerBankTransactionCurrency: inpData.brokerBankTransactionCurrency,
          brokerBankTransactionFee: inpData.brokerBankTransactionFee,
          netPayable: inpData.netPayable,
        },
      };

      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50011/api/v1.0/update-sale`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          })
          .then(function (response) {
            var dbRef = firebase
              .database()
              .ref()
              .child("batch")
              .child(currentVal.selectedRow.batchId)
              .child("sell")
              .child(currentVal.selectedRow.snapShotKey)
              .child("confirmPayment");
            dbRef
              .set(inpData)
              .then(function () {
                currentVal.getData();
                currentVal.pushPaymentData(saleId);
                currentVal.selectedRow.phoneNumbers.forEach((dataVal) => {
                  sendSMS(
                    dataVal.phoneNumber,
                    "Nimewo pou jwenn sèvis : " +
                      dataVal.displayId +
                      ". Vant final la realize " +
                      currentVal.confirmPaymentBuyerName +
                      " @ " +
                      currentVal.confirmPaymentPricePerKg +
                      " Pri pa Kg"
                    // "Final Sale has been made to " + currentVal.confirmPaymentBuyerName +" @ "+ currentVal.confirmPaymentPricePerKg +"per kg"
                    // "La vente finale a été faite au " + currentVal.confirmPaymentBuyerName +" @ "+ currentVal.confirmPaymentPricePerKg +"Par Kg"
                  )
                    .then((sent) => console.log(sent))
                    .catch((err) => console.log(err));
                });
                Vue.$toast.open({
                  message: currentVal.$t(
                    "Payment confirmed successfully.",
                    "Payment confirmed successfully."
                  ),
                  type: "success",
                  position: "top",
                });

                currentVal.$refs["confirm-payment"].hide();
                currentVal.$refs["isconfirm-payment"].hide();
              })
              .catch(function (error) {
                currentVal.erroMessage = error.message;
                currentVal.seen = false;
                Vue.$toast.open({
                  message: currentVal.$t(
                    "Error updating data to firebase.",
                    "Error updating data to firebase."
                  ),
                  position: "top",
                  type: "error",
                });
              });
          })
          .catch(function (error) {
            currentVal.seen = false;
            let errorObject = JSON.parse(JSON.stringify(error));
            if (
              errorObject.message != null &&
              errorObject.message != undefined &&
              errorObject.message.indexOf("401") > -1
            ) {
              firebase
                .auth()
                .currentUser.getIdToken(true)
                .then((idtoken) => {
                  localStorage.IDtoken = "";
                  localStorage.IDtoken = idtoken;
                  currentVal
                    .createConfirmInvoicePaymentAPICall(
                      saleId,
                      inpData,
                      batchId
                    )
                    .then((res) => {})
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
              Vue.$toast.open({
                message: currentVal.$t(
                  "Error updating data corda blockchain.",
                  "Error updating data corda blockchain."
                ),
                position: "top",
                type: "error",
              });
            }
          });
      });
    },
    calculateNetPayable() {
      const vm = this;
      if (vm.brokerBankTransactionFee) {
        vm.seen = true;
        firebase
          .database()
          .ref()
          .child("batch")
          .child(vm.selectedRow.batchId)
          .child("sell")
          .child(vm.selectedRow.snapShotKey)
          .on("value", (_snapshot) => {
            console.log(_snapshot.val());
            // calculating netpayable
            // Net Payable = netSaleAmountCal- (%salesBrokerMargin* netSaleAmountCal+sellCostOfTransportation+brokerBankTransactionFee)
            const {
              netSaleAmountCal,
              salesBrokerMargin,
              sellCostOfTransportation,
            } = _snapshot.val();
            const brokerPercentage = Number(salesBrokerMargin) / 100;
            const brokerShare =
              Number(brokerPercentage) * Number(netSaleAmountCal);
            const netPayable =
              Number(netSaleAmountCal) -
              (Number(brokerShare) +
                Number(sellCostOfTransportation) +
                Number(vm.brokerBankTransactionFee));
            vm.netPayable = Number(netPayable).toFixed(2);
            vm.seen = false;
          });
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
.modal-scroll {
  padding: 1.42rem !important;
}
.modal-body {
  padding: 25px !important;
}
.btn-cancel,
.btn-save {
  height: 30px !important;
}
.invoice-payment-v-select-wrap {
  margin-bottom: 38px !important;
}
.potooltip {
  z-index: 0 !important;
}
.invoice-container {
  position: relative;
  z-index: 99999;
}
.lsp-act-container {
  border: 1px solid #fff;
  padding: 10px;
}
.lsp-act-heading {
  color: #fff !important;
}
</style>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
@import "../../assets/css/main.css";

#generate-invoice-modal .modal-header {
  height: 50px !important;
}
#generate-invoice-modal .modal-header .close {
  margin-top: -12px !important;
}
#generate-invoice-modal .modal-header h5 {
  margin: -10px auto !important;
}

#confirm-payment-modal .modal-header {
  height: 50px !important;
}
#confirm-payment-modal .modal-header .close {
  margin-top: -12px !important;
}
#confirm-payment-modal .modal-header h5 {
  margin: -10px auto !important;
}

#isconfirm-payment-modal .modal-header {
  height: 50px !important;
}
#isconfirm-payment-modal .modal-header .close {
  margin-top: -12px !important;
}
#isconfirm-payment-modal .modal-header h5 {
  margin: -10px auto !important;
}

.invoice-link {
  background: #a8a8a8 !important;
}

.invoice-payment-table-wrap .VueTables__search-field input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}

.invoice-payment-table-wrap .table-striped tbody tr td:nth-child(6),
.invoice-payment-table-wrap .table-striped tbody tr td:nth-child(7),
.invoice-payment-table-wrap .table-striped thead tr th:nth-child(6),
.invoice-payment-table-wrap .table-striped thead tr th:nth-child(7) {
  text-align: center !important;
}
.invoice-payment-table-wrap .table-striped tbody tr td:nth-child(3),
.invoice-payment-table-wrap .table-striped thead tr th:nth-child(3),
.invoice-payment-table-wrap .table-striped tbody tr td:nth-child(4),
.invoice-payment-table-wrap .table-striped thead tr th:nth-child(4) {
  text-align: left !important;
}
.invoice-payment-table-wrap .table-striped tbody tr td:nth-child(5),
.invoice-payment-table-wrap .table-striped thead tr th:nth-child(5) {
  /* text-align: right !important; */
  text-align: center !important;
}
.invoice-payment-table-wrap thead tr th {
  font-weight: bold;
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
  /* margin: 0 !important; */
  margin: 0px 9px !important;
  padding: 0 !important;
}
.view-broker-batches-invoice-wrap .custom-file {
  height: 20px;
  width: 20px;
  background: url("../../assets/images/upload.png");
  background-size: cover;
  background-repeat: no-repeat;
}
.view-broker-batches-invoice-wrap .custom-file-label {
  height: 20px;
  width: 20px;
  display: none;
}
.view-broker-batches-invoice-wrap
  .custom-file-input:focus
  ~ .custom-file-label {
  border: none;
  box-shadow: none;
}
.view-broker-batches-invoice-wrap .custom-file-input {
  height: 20px;
  width: 20px;
}
.confirm-message {
  color: #fff;
  font-weight: 400;
  text-align: center;
  margin: 40px;
}
.invoice-payment-v-select .vs__dropdown-toggle {
  border: none;
  border-bottom: 1px solid #fff;
  border-radius: 0px;
  margin: 15px 0px 0px 0px !important;
}
.invoice-payment-v-select {
  font-size: 13px;
}
.invoice-payment-v-select span,
.invoice-payment-v-select input,
.invoice-payment-v-select .vs__no-options {
  color: #fff;
}
.invoice-payment-v-select span {
  margin-left: 0px;
  padding-left: 0px;
}
.invoice-payment-v-select .vs__dropdown-menu {
  background: none;
  padding: 0px;
  max-height: 155px;
}
.invoice-payment-v-select .vs__dropdown-option {
  color: #fff;
  padding: 10px;
  background: #1e2318;
}
.invoice-payment-v-select .vs__dropdown-option--highlight {
  background: #000;
}
.invoice-payment-v-select .vs__open-indicator,
.invoice-payment-v-select .vs__clear {
  fill: #fff;
}
.invoice-payment-v-select .vs__selected-options,
.invoice-payment-v-select .vs__search,
.vs__search:focus {
  padding: 0px;
  margin: 0px;
}
.invoice-payment-v-select .vs__dropdown-toggle {
  padding: 0px;
  padding-bottom: 2px;
  margin: 15px 0px;
}
.invoice-payment-v-select .vs__selected {
  margin: 0px;
  padding: 0px;
}
.invoice-payment-v-select .vs__clear {
  margin-top: -10px;
}
.invoice-payment-v-select .vs__open-indicator {
  margin-top: -5px;
}
.invoice-payment-v-select-wrap .vs--disabled .vs__clear,
.invoice-payment-v-select-wrap .vs--disabled .vs__dropdown-toggle,
.invoice-payment-v-select-wrap .vs--disabled .vs__open-indicator,
.invoice-payment-v-select-wrap .vs--disabled .vs__search,
.invoice-payment-v-select-wrap .vs--disabled .vs__selected {
  background: transparent !important;
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
  /* height: auto;
  padding: 15px; */
  height: 50px !important;
  padding: 12px !important;
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
  /* top: -35px; */
  top: -31px;
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
.larvae-input-wrap {
  padding: 10px 0px 10px 0px;
}
.radio-btn {
  visibility: hidden;
}
.radio-btn-img {
  display: inline-block;
  padding: 0px;
  height: 15px;
  width: 15px;
  background: none;
}
.factored-radio-container .larvae-wrap {
  width: 30%;
  padding: 10px 0px 10px 0px;
  color: #fff;
}
.larvae-wrap > input:checked + img {
  background: url("../../assets/images/black-circle.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 12px 12px;
  background-color: #fff;
}
.larvae-rb-img {
  background-color: #fff;
  border-radius: 29px;
  width: 18px;
  height: 18px;
  margin-bottom: 3px;
}
.tbl-sell-list thead tr th,
.tbl-sell-list tbody tr td {
  text-align: left !important;
}
.location-payment {
  width: auto;
  height: 20px;
  cursor: pointer;
}
.view-link-wrap {
  float: left;
  text-align: center;
  width: 100%;
  margin-bottom: 30px;
  margin-top: 20px;
}
.view-link {
  background: #1e2318;
  border-radius: 0px;
  border: 1px solid #000;
  font-size: 13px;
  color: #fff;
  padding: 10px;
  margin-right: 50px;
  text-decoration: none;
}
.gi-mandatory-warning {
  position: absolute;
  bottom: 40px;
  font-size: 13px;
  color: #fff;
}
.button-disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
.view-broker-batches-invoice-wrap .tooltip {
  position: relative;
  display: inline-block;
  opacity: 1;
  font-size: 14px;
  text-align: center;
  z-index: 1;
}

.view-broker-batches-invoice-wrap .tooltip .tooltiptext {
  visibility: hidden;
  width: 150px;
  background-color: rgba(256, 256, 256, 0.9);
  color: #000;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  font-size: 12px;
  bottom: 0px;
  left: -99px;
}
.download-po-img {
  width: 15px;
}
.view-broker-batches-invoice-wrap .tooltip:hover .tooltiptext {
  visibility: visible;
}
.po-view-anchor {
  color: #fff;
  text-decoration: none;
}
.po-view-anchor:hover {
  color: #fff;
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
