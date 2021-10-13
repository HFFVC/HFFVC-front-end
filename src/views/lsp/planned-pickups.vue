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
      <div class="col-md-5 details-container planned-pickups-container-wrap">
        <div class="header-container">
          <h6 class="heading planHeading">Planned Pickups</h6>
          <v-select
            v-model="groupPickUps"
            placeholder="Group By"
            @input="onGroupSelect"
            class="planned-pickup-v-select grpBy"
            :options="pickupStatus"
          ></v-select>
        </div>
        <div class="main-container">
          <perfect-scrollbar>
            <div class="card-body">
              <div v-if="pickupsList.length == 0">
                <h2 class="card-inside-description">No Data</h2>
              </div>
              <div v-if="pickupsList.length > 0">
                <div class="outer-container" v-for="item in pickupsList" :key="item.Id">
                  <div class="photo-container">
                    <img
                      v-if="item.Produce.split(' ')[0] == 'Mango'"
                      src="../../assets/images/mango.png"
                      alt="Product Picture"
                      class="former-picture produce-picture-mango"
                    />
                    <img
                      v-if="item.Produce.split(' ')[0] == 'Pineapple'"
                      src="../../assets/images/pineapple.png"
                      alt="Product Picture"
                      class="former-picture"
                    />
                    <img
                      v-if="item.Produce.split(' ')[0] == 'Avocado'"
                      src="../../assets/images/avocado.png"
                      alt="Product Picture"
                      class="former-picture"
                    />
                  </div>
                  <div class="description-container" v-if="!grpPickup">
                    <label class="lbl-flname lbl-pickup">
                      <b>PickUp Requested On</b>
                      : {{ item.PickupRequestedOn }}
                      <input
                        v-on:click="showSelected(item)"
                        v-model="selectedItem"
                        type="radio"
                        name="foo"
                        :value="item.Id"
                      />
                      <img />
                    </label>

                    <label class="lbl-flname lbl-pickup">
                      <b>Produce</b>
                      : {{ item.Produce }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Producer</b>
                      : {{ item.Producer }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Collect at</b>
                      : {{ item.Collectat }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Drop Off At</b>
                      : {{ item.DropOffAt }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Current Status</b>
                      : {{ item.CurrentStatus }}
                    </label>
                    <br />
                  </div>
                  <div class="description-container" v-if="grpPickup">
                    <label class="lbl-flname lbl-pickup">
                      <b>PickUp Requested On</b>
                      : {{ item.PickupRequestedOn }}
                      <input
                        type="checkbox"
                        :checked="selectedpickupItem"
                        name="foo"
                        :value="item"
                        v-model="selectedPackageItem"
                        @change="showSelectedPackage($event)"
                      />
                      <img />
                    </label>

                    <label class="lbl-flname lbl-pickup">
                      <b>Produce</b>
                      : {{ item.Produce }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Producer</b>
                      : {{ item.Producer }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Collect at</b>
                      : {{ item.Collectat }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Drop Off At</b>
                      : {{ item.DropOffAt }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Current Status</b>
                      : {{ item.CurrentStatus }}
                    </label>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
      </div>
      <div class="col-md-7 details-container planned-pickups-container-wrap">
        <div class="header-container">
          <h6 class="heading">Status {{ statusText }}</h6>
        </div>

        <div class="main-container">
          <perfect-scrollbar>
            <div class="card-body card-body-planned-pickup-status">
              <div v-if="emptyContainer" class="empty-container">
                <h2
                  class="card-inside-description"
                >Please Select a Pickup from the list to update Status</h2>
              </div>
              <div v-if="initialContainer">
                <h2
                  class="card-inside-description"
                >Please Select a Pickup from the list to update Status</h2>
              </div>
              <h5 class="updateStatus" v-if="grpPickup">{{ this.selectedStatus }}</h5>
              <div class="planned-pickup-pt-container" v-if="dropdownContainer && !grpPickup">
                <v-select
                  v-if="dropdownContainer"
                  @input="onStatusSelect"
                  v-model="selectedStatus"
                  placeholder="Select Status *"
                  class="planned-pickup-v-select"
                  :options="statusSource"
                ></v-select>
              </div>
              <div v-if="enrouteContainer" class="enroute-container">
                <input
                  type="text"
                  class="addition-note"
                  v-model="additionalNotes"
                  placeholder="Additional Notes"
                />
                <div class="clear-both"></div>
              </div>

              <div v-if="producerContainer" class="withproducer-container">
                <div class="clear-both"></div>
                <div class="add-degree">
                  <input
                    type="number"
                    class="small-input with-celsius"
                    v-model="temperature"
                    placeholder="Temperatue *"
                  />
                </div>
                <div class="add-degree">
                  <input
                    type="number"
                    class="small-input with-celsius"
                    v-model="ambientTemp"
                    placeholder="Ambient Temp *"
                  />
                </div>
                <div class="clear-both"></div>
                <input
                  type="number"
                  class="small-input"
                  v-model="crates"
                  placeholder="Crates (Full) *"
                />

                <div class="crates-part">
                  <v-select
                    v-model="cratesPart"
                    placeholder="Select Crates Part"
                    class="planned-pickup-v-select"
                    :options="cratePartList"
                  ></v-select>
                </div>
                <div class="clear-both"></div>
                <input
                  type="number"
                  class="small-input"
                  v-model="fruitHarvested"
                  placeholder="Fruit Harvested *"
                />
                <input
                  type="number"
                  class="small-input"
                  v-model="fruitRejected"
                  placeholder="Fruit Rejected *"
                />
                <div class="clear-both"></div>
                <div class="agreed-wrap">
                  <div class="agreed-label-wrap">
                    <label class="lbl-pickup lbl-agreed">
                      <input
                        type="checkbox"
                        :checked="isAgreed"
                        name="foo"
                        :value="isAgreed"
                        v-model="isAgreed"
                        @change="isAgreedChange($event)"
                      />
                      <img />
                    </label>
                  </div>
                  <div
                    class="agreed-label-span"
                  >Please tick the box to confirm that terms and agreement of producer with each of the service provider for services being delivered have been discussed</div>
                </div>
                <div class="currency-container">
                  <v-select
                    v-model="currency"
                    placeholder="Select Currency *"
                    class="planned-pickup-v-select currency-planned-pickup"
                    :options="currencySource"
                  ></v-select>
                </div>
                <span class="prefixCurrency advance">
                  <span class="pref" v-if="this.currency == 'USD'">$</span>
                  <span class="pref" v-if="this.currency == 'HTG'">G</span>
                  <input
                    type="number"
                    class="small-input"
                    v-model="advanceGiven"
                    placeholder="Advance Given *"
                  />
                </span>

                <!-- <input
                  type="number"
                  class="small-input advance"
                  v-model="advanceGiven"
                  placeholder="Advance Given"
                />-->

                <div class="clear-both"></div>
                <div class="attach-container-qrcode">
                  <div class="qrcode-text-button-wrap">
                    <div class="qrcode-btn-wrap">
                      <button
                        class="btn-save attach-qrcode-save mt-3"
                        @click="showQrcodeModal('startQRCode')"
                      >Attach Start QR Code</button>
                    </div>
                    <div class="qrcode-text-input-wrap">
                      <input
                        type="text"
                        class="small-input"
                        v-model="startQRCode"
                        placeholder="Start QR Code * (A0001)"
                      />
                    </div>
                  </div>
                  <div class="qrcode-text-button-wrap">
                    <div class="qrcode-btn-wrap">
                      <button
                        class="btn-save attach-qrcode-save mt-3"
                        @click="showQrcodeModal('endQRCode')"
                      >Attach End QR Code</button>
                    </div>
                    <div class="qrcode-text-input-wrap">
                      <input
                        type="text"
                        class="small-input"
                        v-model="endQRCode"
                        placeholder="End QR Code *(A0002)"
                      />
                    </div>
                  </div>
                  <button
                    class="btn-info float-left btn-view-qr-code"
                    v-if="
                      startQRCode != null &&
                        startQRCode.length > 0 &&
                        endQRCode != null &&
                        endQRCode.length > 0
                    "
                    @click="showQrcodeViewModal()"
                  >View attached QR Codes</button>
                </div>
                <div class="clear-both"></div>
                <div class="payament-method-container">
                  <label>{{$t('Payment Method', 'Payment Method')}}</label>
                  <div class="radioGroup">
                    <input name="paymentmethod" v-on:change="selectedPaymentMethod(0)" type="radio" />Wire
                    <input
                      name="paymentmethod"
                      v-on:change="selectedPaymentMethod(1)"
                      type="radio"
                    />Mobile
                    <input
                      name="paymentmethod"
                      v-on:change="selectedPaymentMethod(2)"
                      type="radio"
                    />Cash
                  </div>
                </div>
                <div v-if="wireTransfer" class="wire-transfer-container">
                  <v-select
                    v-model="selectedBank"
                    placeholder="Select Bank *"
                    class="planned-pickup-v-select bank-planned-pickup bank-name-input"
                    :options="banks"
                  ></v-select>
                  <br />
                  <div class="payment-method-container">
                    <label>Type of Account</label>
                    <div class="radioGroup">
                      <input
                        name="accounttype"
                        v-on:change="selectedAccountType(0)"
                        type="radio"
                        :checked="accounttype == 'Savings'"
                      />Savings
                      <input
                        name="accounttype"
                        v-on:change="selectedAccountType(1)"
                        type="radio"
                        :checked="accounttype == 'Current'"
                      />Current
                    </div>
                  </div>
                  <input
                    type="number"
                    v-model="accountNumber"
                    class="bank-account-no bank-accnt-no-input"
                    placeholder="Account Number *"
                  />
                  <div class="account-currency-conatiner">
                    <v-select
                      v-model="selectedPaymentCurrency"
                      placeholder="Select Currency *"
                      class="planned-pickup-v-select bank-planned-pickup bank-acc-currency-input"
                      :options="currencySource"
                    ></v-select>
                  </div>
                </div>
                <div v-if="mobileTransfer" class="mobile-transfer-container">
                  <v-select
                    v-model="mobilePaymentOperator"
                    placeholder="Mobile Payment Operator *"
                    class="planned-pickup-v-select bank-planned-pickup mobile-payment-operator-input"
                    :options="mobilePaymentOperatorOptions"
                  ></v-select>
                  <div class="account-currency-conatiner">
                    <v-select
                      v-model="selectedPaymentCurrency"
                      placeholder="Select Currency *"
                      class="planned-pickup-v-select bank-planned-pickup mobile-currency-input"
                      :options="currencySource"
                    ></v-select>
                  </div>
                  <input
                    type="number"
                    v-model="mobilePaymentNumber"
                    class="bank-account-no mobile-payment-no-input"
                    placeholder="Mobile Payment Number *"
                  />
                </div>
                <div v-if="cashTranser">
                  <input
                    type="number"
                    readonly
                    v-model="contactNumber"
                    class="cash-contact-no-input"
                    placeholder="Contact Number"
                  />
                  <div class="account-currency-conatiner">
                    <v-select
                      v-model="selectedPaymentCurrency"
                      placeholder="Select Currency *"
                      class="planned-pickup-v-select bank-planned-pickup cash-currency-input"
                      :options="currencySource"
                    ></v-select>
                  </div>
                </div>

                <div></div>
                <div class="agreed-wrap mb-0">
                  <div class="agreed-label-wrap">
                    <label class="lbl-pickup lbl-agreed">
                      <input
                        type="checkbox"
                        :checked="isNGOAccepted"
                        name="foo"
                        :value="isNGOAccepted"
                        v-model="isNGOAccepted"
                        @change="isNGOAcceptChange($event)"
                      />
                      <img />
                    </label>
                  </div>
                  <div class="agreed-label-span">Is ready to pay to NGO?</div>
                </div>
                <v-select
                  v-if="isNGOAccepted"
                  :disabled="NGOAlreadyExists"
                  v-model="selectedNGO"
                  placeholder="Select NGO"
                  class="planned-pickup-v-select bank-planned-pickup bank-name-input"
                  :options="ngos"
                ></v-select>
                <br />
                <input
                  type="text"
                  class="addition-note"
                  v-model="withProducerNote"
                  placeholder="Additional Notes"
                />
                <div class="clear-both"></div>
                <label class="errormessage-withproducer">
                  {{
                  withProducerErrorMessage
                  }}
                </label>
                <div class="clear-both"></div>
              </div>

              <div v-if="enrouteContainerPackHouse" class="enroute-packhouse">
                <v-select
                  v-model="selectedDropOffLocation"
                  placeholder="Drop-Off location"
                  class="planned-pickup-v-select drop-off-loc-planned-pickup"
                  :options="packHouse"
                ></v-select>
                <input
                  type="text"
                  class="addition-note"
                  v-model="enrouteAdditionalNotes"
                  placeholder="Additional Notes"
                />
              </div>
              <div v-if="arrivedAtPackHouse" class="arrived-at-packhouse">
                <input
                  type="text"
                  class="todayDate"
                  v-model="todayDate"
                  readonly
                  placeholder="Arrival time at the pack house"
                />
                <div class="atpck-currency-container currency-arrived">
                  <v-select
                    v-model="bckCurrency"
                    placeholder="Select Currency"
                    class="planned-pickup-v-select currency-planned-pickup"
                    :options="currencySource"
                  ></v-select>
                </div>
                <div class="transport-cost-wrap">
                  <span class="prefixCurrency">
                    <span class="pref" v-if="this.bckCurrency == 'USD'">$</span>
                    <span class="pref" v-if="this.bckCurrency == 'HTG'">G</span>
                    <input
                      type="number"
                      class="small-input"
                      v-model="transportCostArrivedAtPackhouse"
                      placeholder="Transport Cost"
                    />
                  </span>
                </div>
                <datetime
                  type="time"
                  v-model="dateTimeVal"
                  input-class="my-class datepicker time-of-admittence"
                  placeholder="Time of Admittence *"
                  :phrases="{ ok: 'Save', cancel: 'Cancel' }"
                  :hour-step="1"
                  :minute-step="1"
                  :week-start="7"
                  use12-hour
                  auto
                ></datetime>

                <input
                  type="text"
                  class="addition-note"
                  v-model="arrivedAtAdditionalNotes"
                  placeholder="Additional Notes"
                />
              </div>
            </div>

            <b-modal
              hide-footer
              id="planned-pickup-reject-modal"
              ref="reject-modal"
              hide-backdrop
              title="Rejection Criteria"
            >
              <div class="reject-reason-container">
                <v-select
                  v-model="rejectReason"
                  placeholder="Reason for Rejection"
                  class="planned-pickup-v-select"
                  :options="rejectReasons"
                ></v-select>
              </div>

              <input
                type="text"
                class="modal-input reason-note"
                v-model="rejectAddionalNote"
                placeholder="Additional Notes"
              />
              <div style="clear:both;"></div>
              <div class="reject-file-container">
                <div class="attach-border-planned-reject"></div>
                <!-- <b-form-file
                  v-model="rejectedSelectedFiles"
                  id="file-upload-new"
                  ref="rejectedFile"
                  v-on:change="getRejectedFiles"
                  placeholder="No Attachments yet"
                  drop-placeholder="Drop file here..."
                >-->
                <b-form-file
                  multiple
                  v-model="rejectedSelectedFiles"
                  id="file-upload-new"
                  ref="rejectedFile"
                  placeholder="No Attachments yet"
                  drop-placeholder="Drop file here..."
                >
                  <template slot="file-name" slot-scope="{ names }">
                    <b-badge variant="dark">{{ names[0] }}</b-badge>
                    <b-badge
                      v-if="names.length > 1"
                      variant="dark"
                      class="ml-1"
                    >+ {{ names.length - 1 }} More files</b-badge>
                  </template>
                </b-form-file>
              </div>
              <label class="lbl-errormessage">{{ rejectErrorMessage }}</label>
              <div class="button-container reject-btn-container">
                <input type="button" v-on:click="hideModal" class="btn-cancel" value="Cancel" />
                <input
                  type="button"
                  v-on:click="updateRejectStatus"
                  class="btn-save"
                  value="Save Rejection"
                />
              </div>
            </b-modal>
          </perfect-scrollbar>
        </div>

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
        <div
          class="planned-pickup-mandatory-warning"
          v-if="
            arrivedAtPackHouse ||
              enrouteContainerPackHouse ||
              producerContainer ||
              enrouteContainer
          "
        >
          <span>* Mandatory Fields</span>
        </div>
        <div v-if="arrivedAtPackHouse" class="button-container enroute-button-container">
          <input type="button" v-on:click="cancelSelectedItem" class="btn-cancel" value="Cancel" />
          <input
            type="button"
            v-on:click="updateArrivedAtPackHouseStatus"
            class="btn-save"
            value="Save"
          />
        </div>
        <div v-if="enrouteContainerPackHouse" class="button-container enroute-button-container">
          <input type="button" v-on:click="cancelSelectedItem" class="btn-cancel" value="Cancel" />
          <input
            type="button"
            v-on:click="updateEnroutePackhouseStatus"
            class="btn-save"
            value="Save"
          />
        </div>
        <div v-if="producerContainer" class="button-container">
          <input type="button" v-on:click="cancelSelectedItem" class="btn-cancel" value="Cancel" />
          <input type="button" v-on:click="rejectCollection" class="btn-reject" value="Reject" />
          <input type="button" v-on:click="UpdateWithProducerStatus" class="btn-save" value="Save" />
        </div>
        <div v-if="enrouteContainer" class="button-container enroute-button-container">
          <input type="button" v-on:click="cancelSelectedItem" class="btn-cancel" value="Cancel" />
          <input type="button" v-on:click="updateEnrouteStatus" class="btn-save" value="Save" />
        </div>
      </div>
      <div v-if="!netwrokStatus" class="offline-container">
        <label class="offline-label">Application is offline now.</label>
      </div>
      <Footer ref="footercomp"></Footer>
    </div>
    <!-- digital signature modal -->
    <b-modal
      hide-footer
      id="digital-signature-modal"
      class="digital-signature-modal"
      @hide="hideSignatureModal"
      ref="digital-signature-modal"
      hide-backdrop
      no-close-on-backdrop
      title="Digital Signature"
      data-backdrop="static"
    >
      <div class="col-md-10 digital-signature-container">
        <div v-if="agreementData">
          <div class>
            <div class>
              <div id="agreementterms">
                <table style="width: 100%;" border="0">
                  <tr>
                    <td></td>
                  </tr>
                  <tr>
                    <td>HAITI FRESH FRUIT VALUE CHAIN – FRAMEWORK SERVICE AGREEMENT</td>
                  </tr>
                  <tr>
                    <td>In the {{ agreementData.collectionPoint }}, this agreement to be called “Framework Service Agreement” is made on this {{ agreementData.dateOfPickup }} by and between:</td>
                  </tr>
                  <tr>
                    <td>A) {{ agreementData.producer }}, residing and living at {{ agreementData.town }} identified by the Tax ID #: …5.., hereinafter referred to as “Producer” and</td>
                  </tr>
                  <tr>
                    <td>B) multiple “Service Providers” as stated in the below appended agreements:</td>
                  </tr>
                  <tr>
                    <td>1. TERMS OF SERVICE FOR THE USE OF LOGISTICS SERVICE PROVIDER (LSP)</td>
                  </tr>
                  <tr>
                    <td>2. TERMS OF SERVICE FOR THE USE OF IMPORT AND SALES AGENT IN THE HAITI BLOCKCHAIN SOLUTION</td>
                  </tr>
                  <tr>
                    <td>3. TERMS OF SERVICE FOR THE USE OF A PAYMENT PROVIDER</td>
                  </tr>
                  <tr>
                    <td>4. TERMS OF SERVICE FOR THE USE OF A FACTORING UNIT</td>
                  </tr>
                  <tr>
                    <td>5. TERMS OF SERVICE FOR THE USE OF A BUYER (SUPERMARKET)</td>
                  </tr>
                  <tr>
                    <td>6. TERMS OF SERVICE FOR THE USE OF TECHNICAL SERVICE PROVIDER</td>
                  </tr>
                  <tr>
                    <td>Whereas the Producer is a producer of one or more of the following products (hereinafter referred to as “Products”):</td>
                  </tr>
                  <tr>
                    <td>1. Pineapple 2. Avocado 3. Mango</td>
                  </tr>
                  <tr>
                    <td>
                      Whereas the Producer wishes to export his Products;
                      Whereas the service providers have the capacity and knowledge to provide services to the Producer as stated in their respective agreement. Whereas this agreement needs to be signed at the first pick up of produce from producer, for all the subsequent transactions, individual contracts will be in effect. By signing electronically and/or delivering its fruits to the collection point in Haiti, the producer and legal owner of fruits accepts these Terms of Services.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Article 1. Notification. All notification about the address, contact details and payment instructions will be done electronically through Haiti Fresh Fruit Value Chain “HFFVC” platform. This information would be provided and taken from the system at the time of signing of the contract by the producer.
                      Any change of above information shall be notified immediately to the other party as per this article. Failure to notify such change discharge the other party of any responsibility that may arise. Defaulting party will be liable for such failure.
                    </td>
                  </tr>
                  <tr>
                    <td>Article 2. Governing law. The framework service agreement and individual contracts shall be governed by the laws of the Republic of Haiti, excluding any conflict of laws provisions that would refer to and apply the substantive laws of another jurisdiction.</td>
                  </tr>
                  <tr>
                    <td>Article 3. Dispute resolution. Notwithstanding the right of Producer to obtain conservatory measures through common courts, any dispute, controversy, or claim arising out of, in connection with, or relating to the performance of this Agreement or its termination shall be settled by arbitration pursuant to the rules of the Chambre de Conciliation et d’Arbitrage d’Haiti (CCAH). Any award shall be final, binding and conclusive upon the parties and a judgment rendered thereon may be entered in any court having jurisdiction thereof.</td>
                  </tr>
                  <tr>
                    <td>Article 4. Termination. This contract may be early terminated by mutual agreement between the parties. In case of breach of contract by one party, the interested party may, within thirty (30) days following a formal notice to the defaulting party remained without effect; request the full termination of the present contract.</td>
                  </tr>
                  <tr>
                    <td>APPENDED AGREEMENTS</td>
                  </tr>
                  <tr>
                    <td>1. TERMS OF SERVICE FOR THE USE OF LOGISTICS SERVICE PROVIDER (LSP)</td>
                  </tr>
                  <tr>
                    <td>
                      The logistical service is provided by the ………5………… [LSP Organization], company duly registered under the laws of Haiti, published in the official gazette, Le Moniteur, # …6. [Company Registration No.], having its headquarter at …7….[LSP address], Ph:……8……… [LSP contact no.] identified by Tax ID #: ……9………[LSP CIN/NIF No.] duly represented by ………10………….. [LSP Representative], identified by the Tax ID#: …11. [Representative’s Tax ID], hereinafter referred to as the “Logistic Service Provider” or “LSP”, who has a contract with the Ministry of Commerce of Haiti, to provide logistics, quality control, packing and exporting services to Haitian fruit and vegetable producers.
                      WHEREAS the LSP as agreed to provide services according to the following terms and conditions now this agreement witnesses as follows:
                    </td>
                  </tr>
                  <tr>
                    <td>Article 1. Object. Producer retains the nonexclusive services of the LSP to provide logistic support to export his Products at the Final Destination that will be instructed to LSP. LSP commits to provide logistic services from the Pick address until the Products reaches the Final Destination.</td>
                  </tr>
                  <tr>
                    <td>Article 2. Term. This contract is made for a period of …. Months starting on …. 2019 ending on …. 20…</td>
                  </tr>
                  <tr>
                    <td>
                      Article 3. Obligations of Producer. The Producer commits to:
                      - pay to LSP a commission calculated as follows:
                      o Specify payment term
                    </td>
                  </tr>
                  <tr>
                    <td>Article 4. Payment. Producer commits to pay LSP by wire transfer as per banking coordinated notified by LSP upon receipt of payment from the Buyer</td>
                  </tr>
                  <tr>
                    <td>
                      Article 5. Obligations of LSP. The LSP commits to perform the services as follows:
                      - Collect the Products from Producer 0 to 24 hours from Notification
                      - Perform quality control of the Products at Pick up location
                      - Obtain authorization to export from the Ministry of Agriculture
                      - Clear customs in Haiti
                      - Proceed to shipment to Final Destination instructed by Producer
                      - Clear customs at the Final Destination instructed by Producer
                    </td>
                  </tr>
                  <tr>
                    <td>LSP will take full responsibility of the quality of the Product to the Producer’s Buyer.</td>
                  </tr>
                  <tr>
                    <td>Article 6. Responsibility of LSP. Any loss of quality to the Product from the Pickup location until Final Destination is the sole responsibility of LSP. LSP will compensate Producer for such loss.</td>
                  </tr>
                  <tr>
                    <td>
                      Article 7. Termination. This contract may be early terminated by mutual agreement between the parties. In case of breach of contract by one party, the interested party may, within thirty (30) days following a formal notice to the defaulting party remained without effect; request the full termination of the present contract.
                      Producer may at his sole discretion terminate this agreement by notifying LSP at least 15 days in before the desired date.
                    </td>
                  </tr>
                  <tr>
                    <td>2. TERMS OF SERVICE FOR THE USE OF IMPORT AND SALES AGENT IN THE HAITI BLOCKCHAIN SOLUTION</td>
                  </tr>
                  <tr>
                    <td>
                      By signing electronically and/or delivering its fruits to the Logistics Service Provider (LSP) in the collection point in Haiti, the producer and legal owner of fruits, hereafter called “PRODUCER” detailed at the end accepts these Terms of Service.
                      The Import and Sales Agent service is provided by the ………………… [Import and Sales Agent Organization], located at, …………………[address], Ph:………………………[Contact No.] with EIN …………… [EIN] represented by …………….[Broker Representative], hereafter called “IMPORT AND SALES AGENT”, and the Logistics Service Provider is the ………………………. [LSP Organization Name] , represented by [LSP representative], with ID…… [LSP representative ID], and hereafter called “EXPORTER”, who has a contract with the Ministry of Commerce of Haiti, to provide logistics, quality control, packing and exporting services to Haitian fruit and vegetable producers.
                      WHEREAS the exporter has offered to supply the Import and Sales Agent and the Import and Sales Agent has agreed to sell the mangoes, from the exporter on a regular basis, according to the following terms and conditions NOW THIS AGREEMENT WITNESSES AS FOLLOWS:
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Article 1. Obligations of the exporter.
                      The exporter agrees to supply the shipments to the Import and Sales Agent, during the harvest season of the year in question, as per schedule that will be communicated electronically through a Blockchain/Distributed Ledger Technology software solution, hereafter called “Blockchain/DLT”; compliant with the quality requirements indicated in the Annex of this agreement. The delivery of the products shall take place using a door to door or port to door service by a carrier/shipping line, which will be evaluated and selected by all the involved parties in this contract.
                      The exporter will provide to the Import and Sales Agent the full traceability for each fruit and vegetable through the Blockchain/DLT, that registers the origin (Producer and farm location), as well as the time and temperature stamps from the collection point near the farm gates until reception in the Import and Sales Agent’s premises.
                      The exporter and producer provide to the Import and Sales Agent the right to use and display this information and provide it to the final buyer and the consumer, if the final buyer chooses to do so.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Article 2. Obligations of the Import and Sales Agent.
                      The Import and Sales Agent commits to pay the seller based on an OPEN PRICE TERM format, meaning that the FOB/ExW value which the seller will receive, will be determined by the following structure:
                      - Once the lot is sold completely, the IMPORT AND SALES AGENT will collect …………….. [Broker Margin] the TOTAL SALES VALUE.
                      - From the remaining percentage of the sales, the logistic expenses incurred by the Import and Sales Agent’s will be deducted.
                      The IMPORT AND SALES AGENT commits to use the solution indicated by the seller to communicate between both parties. The IMPORT AND SALES AGENT will be given a profile in the application to access all the information of shipments coming and will commit to input into the application the following information:
                      - reception in buyers’ warehouse (amounts, temperature of fruit, temperature of container, any apparent quality defaults)
                      - date and price of final sale
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Article 3. Quality Claims
                      In the event of quality issues at the time of arrival to the Import and Sales Agent’s facility, the following procedure should take place:
                      a) The IMPORT AND SALES AGENT will collect the thermograph from the container and request a quality and condition inspection by the USDA within 24 hours of arrival. The cost of this will be deducted at the seller’s expense.
                      b) Once the results are sent by the USDA, the BUYER will communicate with the SELLER’s representative and determine (in the supply chain) who is responsible for the damage.
                      Parties involved will agree to either discard the product or sell at product condition’s best attainable price.
                      c) In the case that all parties involved determine the product can be sold at the best attainable price considering quality/condition issues, the same OPEN PRICE TERM format will be utilized as noted in the OBLIGATIONS OF THE BUYER clause in this contract.
                      d) If all parties involved determine the product is to be discarded, then a corresponding claim should be filed with the shipping line, if damage is found to have happened during transportation. Discarding costs will be assumed by the BUYER but will be deducted once the claim coverage is received by the contracting party (in this case the BUYER).
                      e) In the event damage is found to be caused by the SELLER’s supply chain, then all discarding costs will be credited to the BUYER’s favor; either applied to the next shipment or by payment from the SELLER by bank wire.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Article 4. Payment terms and financial transactions
                      i) The IMPORT AND SALES AGENT is to send a sales liquidation 7 days after GOOD ARRIVAL of the product in the IMPORT AND SALES AGENT’s warehouse; if quality/condition issues with the product arise at the time of receiving, procedures stated in Clause 3 of this agreement should be applied and the 7 days due for sales liquidation, is to be waived until the lot is sold completely.
                      ii) Payment for the goods received by the IMPORT AND SALES AGENT, will be wired to the designated escrow bank account, SOGEBANK account detailed below, not later than 14 days after the final sales liquidation. SOGEBANK is responsible to allocate the proceeding to the Exporter and to the Producer, according to the contracts established between them and SOGEBANK.
                      Account name: Solution Blockchain MCI
                      Account number: 0716019666
                      Account currency: USD
                      Account address: Delmas 30, Port-au-Prince, Haiti
                      SWIFT code: SOGHHTPP
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Article 5. Force majeure.
                      In case where unforeseen situations such as hail, drought, excessive rain, war, fire, civil unrest, and any other reasonable cause, which is beyond the parties control (the so called “force majeure” cause) arise affecting the correct execution of this agreement, neither party shall be considered liable of non-performance, losses and damages occurred.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Article 6. Duration.
                      This agreement shall have a seasonal duration determined by start ship date until the last arrival is sold and resolved (claims included).
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Article 7. Termination.
                      The parties may terminate this agreement giving a prior notice of 15 days under the following circumstances:
                      a) Failure of the buyer to pay the price or breach of any other term of the agreement.
                      b) Failure of the seller to supply the agreed products or breach of any other term of the agreement. In this case, the seller shall compensate for damages occurred from this nonperformance the buyer.
                      c) Occurrence of a “force majeure” situation, according to clause 5 that prevent the parties from continuing the fulfillment of the agreement.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Article 8. Dispute resolution.
                      Any conflict arising from this agreement shall first be resolved amicably between the parties and if they fail, it will be referred to an on-line arbitrator to be nominated by a Chamber of Arbitration. Both parties agree to provide the arbitrator access to the data in the Blockchain/DLT for the transaction in in dispute.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Article 9. Law applicable.
                      This agreement shall be governed by the laws of the United States of America
                    </td>
                  </tr>
                  <tr>
                    <td>3. TERMS OF SERVICE FOR THE USE OF PAYMENT PROCESSOR</td>
                  </tr>
                  <tr>
                    <td>
                      Entre les soussignées :
                      La Société Générale Haïtienne de Banque S.A. (SOGEBANK S.A.) Banque Commerciale, ayant son siège social à Port-au-Prince, Haïti, sous forme de Société Anonyme, au capital autorisé de UN MILLIARD CINQ CENT MILLIONS DE GOURDES (Gdes1.500.000.000.00), identifiée et patentée aux Nos 000-001-768-1 et 1907058146 autorisée à fonctionner suivant arrêté présidentiel en date du dix janvier mil neuf cent quatre-vingt-six, publié au Moniteur Journal officiel de la République d’Haïti No 5 du vingt janvier mil neuf cent quatre-vingt-six et aussi suivant modifications des statuts publiées au Moniteur No 13 du quatorze février mil neuf cent quatre-vingt-onze et celles en date du vingt-huit janvier deux mille six publiées au Moniteur No 70 du vingt juillet de la même année, suivant autres modifications des statuts en date du quatre janvier deux mille treize, publiées au Journal officiel le Moniteur # 39 du sept mars deux mille treize. Ladite Banque est représentée par son Président-directeur Général Monsieur Robert MOSCOSO, propriétaire, demeurant et domicilié à Port-au-Prince identifié au NIF : No 003-022-294-9 et CIN No. 01-01-99-1959-07-00161 agissant par Madame Gladys COUPET, identifiée par son NIF au No ______________ et par son CIN au No _________________________, propriétaire demeurant et domiciliée à Port-au-Prince, en sa qualité d’Administrateur Délégué de la Société Générale Haïtienne de Banque S.A. (SOGEBANK S.A.), ci-après désignée « la SOGEBANK ou la Banque »
                      Et
                    </td>
                  </tr>
                  <tr>
                    <td>_________________________________, demeurant et domicilié à ____________________________, identifié au No _______________________, dûment autorisée aux fins des présentes, ci-après dénommée « le Contractant ».</td>
                  </tr>
                  <tr>
                    <td>
                      PRÉAMBULE
                      Considérant que le Contractant souhaite bénéficier d’un service pour la réception et le paiement de fonds provenant de la vente de ses produits agricoles à travers la technologie de blockchain.
                      Considérant que la SOGEBANK offre à ses contractants un service de paiement électronique et qu’elle a démontré les compétences professionnelles requises ainsi que les ressources humaines et techniques nécessaires, pour fournir les services selon les termes et les conditions stipulés dans le présent contrat ;
                      Considérant que les parties confèrent force contractuelle au préambule.
                    </td>
                  </tr>
                  <tr>
                    <td>IL A ETE CONVENU ET ARRETÉ CE QUI SUIT:</td>
                  </tr>
                  <tr>
                    <td>
                      ARTICLE 1.- DÉFINITION
                      Dans le cadre du présent contrat, sauf mention contraire :
                      - Banque désigne la Société Générale Haïtienne de Banque S.A. (SOGEBANK).
                      - Contractant désigne le producteur qui a signé ce contrat avec la SOGEBANK et pour lequel des fonds seront reçus et des paiements émis selon les dispositions de ce contrat.
                      - Instruction désigne une demande du Contractant auprès de la SOGEBANK, émanant directement de la blockchain d’Agriledger, pour la prestation de services à travers le système de paiement électronique.
                      - Paiement électronique désigne le service par lequel la SOGEBANK effectue le paiement d’individus sous requête et en fonction d’instructions émises par le Contractant à travers la blockchain d’Agriledger.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      ARTICLE 2.- OBJET DU CONTRAT
                      Le présent contrat a pour objet de déterminer les termes et conditions du partenariat établi entre la SOGEBANK et le Contractant visant à recevoir des fonds provenant de la vente de produits agricoles par le Contractant et à fournir des paiements à tout individu que le Contractant aura désigné selon des instructions répondant aux critères pré-établis par la Banque.
                      Tous les termes et conditions du présent contrat y font partie intégrante. Ils s’appliquent pleinement pendant toute la durée du contrat. Aucun amendement ne sera valide sans l’accord des parties.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      ARTICLE 3.- DURÉE DU CONTRAT
                      Le présent contrat est conclu pour une durée de douze (12) mois à compter de sa signature et est renouvelable par tacite reconduction dans les mêmes conditions et pour une période similaire.
                      Si l’une ou l’autre des parties décide de ne pas renouveler le contrat ou souhaite une renégociation des termes de celui-ci, elle avertira l’autre par écrit avec accusé de réception au moins un (1) mois avant l’expiration du contrat.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      ARTICLE 4.- OBLIGATIONS ET RESPONSABILITÉS DES PARTIES
                      4.1 Obligations et responsabilités de la SOGEBANK
                      La SOGEBANK s’engage à:
                      - Exécuter ses activités conformément aux dispositions arrêtées et convenues entre les parties ;
                      - Exécuter ses activités avec diligence, professionnalisme, loyauté, confidentialité et efficacité, dans le respect des lois applicables en vigueur et selon les dispositions du présent contrat;
                      - Exécuter les transactions de paiements suivant les instructions fournies par le Contractant à travers le système de la blockchain d’Agriledger.
                      La SOGEBANK, en sa qualité de fournisseur de services :
                      - N’engage aucunement sa responsabilité quant au montant négocié et perçu par le Contractant pour la vente de ses produits ;
                      - N’engage aucunement sa responsabilité vis-à-vis des individus bénéficiaires des paiements, quant aux instructions reçues. Dès lors que la transaction effectuée est conforme à l’instruction, la Banque décline toutes responsabilités pouvant y découler ;
                      - Ne pourra être tenue responsable du non-paiement d'un individu suite à un statut de son compte ne lui permettant pas de recevoir le dit paiement ;
                      - S’engage à effectuer le paiement électronique avec un maximum de précautions pour qu’aucune erreur ne soit commise dans les montants objets des transactions. Si le cas échéant, une erreur devait survenir et ce quel qu’en serait la cause, la SOGEBANK ne sera responsable que de la rectification du dit montant sur le compte de l’individu qui serait domicilié à la Banque, sans que celui-ci, ni le Contractant ne puisse faire valoir aucun droit à une indemnisation complémentaire.
                      - Se réserve le droit de refuser toute instruction qu’elle juge inexacte, incomplète ou insatisfaisante pour quelque motif que ce soit.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      4.2 Obligations et responsabilités du Contractant
                      Le Contractant :
                      - S’engage à fournir toutes les informations nécessaires pour remplir avec succès ses obligations dans le cadre de ce contrat dans la blockchain d’Agriledger tout en reconnaissant que, afin que la Banque puisse fournir les services aux termes des présentes, le Contractant devra lui fournir certains renseignements bancaires, les montants des transactions ou d’autres renseignements liés au paiement ;
                      - Autorise par les présentes la Banque, agissant directement ou par l’entremise d’un membre du Groupe Sogebank, à accepter, à agir et à se fier à toute instruction que la Banque estime raisonnablement provenir de la blockchain d’Agriledger, et donc du Contractant.
                      - Reconnaît que toute instruction qu’il donne aux termes des présentes conditions générales le liera et lui sera opposable et ne viole pas les conditions d’une autre entente qui lie le Contractant.
                      - Est responsable de l’exactitude et de la complétude des renseignements qui seront établis électroniquement et disponibles sur la blockchain d’Agriledger.
                      - Reconnaît et convient qu’à défaut de savoir concrètement que des instructions censées provenir du Contractant à travers le système de blockchain d’Agriledger ne proviennent pas réellement de lui, la Banque peut accepter des instructions à l’égard du Contractant de toute personne/entité utilisant/ayant accès au système la blockchain d’Agriledger, sauf si le Contractant a avisé la Banque que ces instructions ne devraient pas être acceptées.
                      - S’engage à fournir à la Banque une autorisation signée du titulaire du compte bénéficiaire pour toute requête de retour de fonds après un paiement effectif concernant un compte domicilié à la Banque. Cette autorisation doit être annexée à la requête.
                      Le Contractant s’engage à prendre fait et cause pour la Banque en cas de poursuites engagées contre elle, à la suite d’erreurs ou d’omissions qui lui sont imputables.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      ARTICLE 5.- MODALITÉS DE PAIEMENTS
                      La mise en exécution des paiements électroniques est subordonnée à l’existence de fonds disponibles sur un compte spécialement et exclusivement affecté au versement des sommes correspondantes au produit de la vente de produits agricoles. Le solde du compte doit nécessairement et à tout moment être positif ou nul c’est-à-dire que le montant cumulé des remises effectuées sur le compte doit toujours être supérieur ou égal au montant cumulé de paiements qui lui sont imputés. Toutes les transactions vers d’autres comptes, portefeuilles ou en liquide exécutées pour le compte du Contractant seront effectuées en gourde.
                      Les ordres de paiements sont exécutés conformément au nom du bénéficiaire et/ou identifiant communiqués par le Contractant. Si les informations fournies sont inexactes, la Banque n’est pas responsable de l’inexécution ou de la mauvaise exécution de l’ordre de paiement.
                      La SOGEBANK convient de traiter les transactions pour le Contractant dès que cela sera possible sur le plan commercial (c’est-à-dire durant les heures normales de bureau) conformément à l’instruction du client, sous réserve des autres dispositions des présentes conditions générales. Les parties conviennent qu’une transaction est réputée exécutoire et définitive une fois que la Banque a produit une confirmation de transaction.
                      L’absence de contestation d’une opération dans un délai d’un (1) mois à compter de la date de la transaction vaudra approbation de ladite opération.
                      Le Contractant reconnaît et convient qu’il n’y aura pas de lien débiteur-créancier entre lui-même et la Banque (ou un membre du Groupe Sogebank).
                    </td>
                  </tr>
                  <tr>
                    <td>
                      ARTICLE 6.- RÉMUNÉRATION
                      Le Contractant comprend que la Banque imposera certains frais à l’égard des services, lesquels frais sont énoncés ci-dessous:
                      - 2.5%, plus les taxes applicables, par requête de paiement pour les comptes domiciliés à la SOGEBANK
                      - 5%, plus les taxes applicables, par requête de paiement pour les comptes domiciliés dans une autre banque.
                      - 5%, plus les taxes applicables, par requête de paiement pour les transactions en liquide qui seront effectuées à travers le réseau de la Sogexpress.
                      - 10%, plus les taxes applicables, par requête de paiement pour les transactions MonCash
                      La Banque se réserve le droit de réviser, à tout moment, la tarification ci-haut précisée. Le Contractant sera avisé par écrit avec accusé de réception au moins un (1) mois avant le changement de tarification. Néanmoins, si la nouvelle tarification ne lui convient pas, ce dernier pourra résilier le contrat par écrit avec accusé de réception moyennant préavis de cinq (5) jours ouvrables.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      ARTICLE 7.- DIVISIBILITÉ
                      S’il advenait que l’une ou plusieurs clauses de la présente soient nulles, inopposables, illégales, inapplicables en vertu d’une loi, d’un règlement ou à la suite d’une décision judiciaire, cela n’atteindra pas la validité du contrat car toutes les clauses restantes conserveront leur pleine et entière validité.
                      Dans l’hypothèse où une telle nullité serait prononcée, les Parties se rapprocheront afin de convenir d’une clause de substitution dont l’effet sera le plus proche possible de la stipulation frappée de nullité.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      ARTICLE 8.- RÉSILIATION ET MODIFICATIONS
                      En cas de violation de l’une quelconque des clauses du contrat par l’une des parties, il pourra être mis fin de manière unilatérale et sans aucun dédommagement quelconque au présent contrat.
                      Si pour une raison l’une des parties souhaite résilier le contrat avant le terme de celui-ci, elle en avertira l’autre par écrit avec accusé de réception en respectant un délai préavis d’un (1) mois.
                      Les parties pourront s’entendre afin de modifier l’un ou plusieurs articles de la présente ou y ajouter de nouvelles dispositions. Ces modifications devront faire l’objet d’un avenant signé par les deux parties et faisant partie intégrante de la présente.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Article 9.- DISPOSITIONS GÉNÉRALES
                      Aucune des parties ne pourra céder ni partiellement ni totalement ses droits et obligations dans la présente sans l’accord écrit préalable de l’autre partie.
                      Le défaut d’exercice ou la renonciation expresse d’une partie d’exercer ou de faire valoir un droit quelconque dont elle serait titulaire aux termes de la présente convention ne pourra être assimilé à une renonciation par ladite partie à ce droit pour l’avenir, le défaut d’exercice ou la renonciation ne produisant leurs effets qu’au titre de l’événement concerné.
                      Aucune partie ne se trouvera en défaut si, dans l’accomplissement de ses obligations, elle se trouve empêchée par la survenance d’évènements présentant les caractéristiques du cas de force majeure.
                      La SOGEBANK peut communiquer des renseignements sur le Contractant ou les bénéficiaires de paiement aux membres du Groupe Sogebank afin d’effectuer la prestation des services dans le cadre de ce contrat. La Banque a également le droit de divulguer les renseignements confidentiels du client à un tiers et, à son entière appréciation, communiquer tout renseignement lié à une transaction afin de remplir ses obligations juridiques en vertu des lois applicables, notamment des lois et/ou des règlements en matière de lutte contre le blanchiment d’argent ou relatives à des sanctions commerciales et économiques, ou comme cela peut par ailleurs être requis par la loi ou aux termes d’une ordonnance d’un tribunal.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      ARTICLE 10.- RÉSOLUTION DE LITIGES, ELECTION DE DOMICILE ET LOIS APPLICABLES
                      Pour l’exécution des présentes, les parties élisent domicile à Port-au-Prince.
                      Les parties s’efforceront, dans la mesure du possible, de résoudre tous les conflits par voie amiable, le cas échéant. Tous les différends qui viendraient à se produire à propos de la validité, de l’interprétation, de l’exécution ou de l’inexécution, de l’interruption ou de la résiliation du présent contrat seront soumis à l’arbitrage conformément au règlement d’arbitrage de la Chambre de Conciliation et d’Arbitrage d’Haïti (CCAH), dont les parties ont eu connaissance et auquel elles déclarent adhérer. Chacune des parties désignera un arbitre de son choix et le troisième arbitre sera désigné par la CCAH. Si aucune solution satisfaisante pour les parties n’intervient dans un délai de trente (30) jours à compter de la notification de la décision du Tribunal Arbitral, le recours aux Tribunaux ordinaires demeure autorisé.
                      Pour tout ce qui ne sera pas prévu par la présente, les parties déclarent se référer aux dispositions légales haïtiennes régissant la matière.
                      Le présent accord remplace et annule tous contrats, propositions, négociations, ententes ayant eu lieu précédemment entre les parties.
                      Fait à Port-au-Prince de bonne foi et en double original le ______________________deux mille dix-neuf.
                    </td>
                  </tr>
                </table>
                <div></div>
                <!-- <input
                type="button"
                id="ignoreThis"
                @click="showPDF"
                class="btn-save btn-save-pdf"
                value="Download Invoice"
                />-->
              </div>
            </div>
          </div>
          <p id="ignorePDF"></p>
        </div>

        <VueSignaturePad width="100%" height="100px" ref="signaturePad" saveType="image/png" />
      </div>
      <div class="col-md-12 offset-3">
        <div>
          <button class="digital-signature-btn" @click="save">Save</button>
          <button class="digital-signature-btn" @click="undo">Undo</button>
        </div>
      </div>
    </b-modal>

    <b-modal
      hide-footer
      id="qrcode-modal"
      class="dqrcode-modal"
      @hide="hideQrcodeModal"
      ref="qrcode-modal"
      hide-backdrop
      no-close-on-backdrop
      title="Hold Camera/Scanner Steady."
      data-backdrop="static"
    >
      <perfect-scrollbar class="qrcode-scroll">
        <div class="digital-signature-container">
          {{ qrcodeError }}
          <qrcode-stream @decode="onDecode" @init="onInit">
            <span class="qrcode-name">QR Code: {{ qrcodeResult }}</span>
          </qrcode-stream>
        </div>
        <button class="digital-signature-btn" @click="hideQrcodeModal">Done</button>
      </perfect-scrollbar>
    </b-modal>
    <b-modal
      hide-footer
      id="offline-modal"
      class="dqrcode-modal"
      ref="offline-modal"
      hide-backdrop
      no-close-on-backdrop
      title="Status"
      data-backdrop="static"
    >
      <label class="lbl-offline">
        There seems to no Internet connectivity. Your data will be automatically
        synchronized the moment connectivity is established. You can continue to
        work with the application in the meanwhile.
      </label>
    </b-modal>
    <b-modal
      hide-footer
      id="qrcode-view-modal"
      class="dqrcode-view-modal"
      @hide="hideQrcodeViewModal"
      ref="qrcode-view-modal"
      hide-backdrop
      no-close-on-backdrop
      title="Attached QR Codes"
      data-backdrop="static"
      @shown="QRCodeViewModalOpened()"
    >
      <div class="digital-signature-container">
        <perfect-scrollbar class="qrcode-view-modal-scroll">
          <div v-for="qrcode in qrcodesToUpload" :key="qrcode" id="qr-code-coantainer">
            <span class="qrcode-label">{{ qrcode }}</span>
            <qr-code :text="qrcode"></qr-code>
          </div>
        </perfect-scrollbar>
      </div>
      <!-- <button class="digital-signature-btn" @click="hideQrcodeViewModal">Close</button> -->
    </b-modal>
    <b-modal
      hide-footer
      id="confirm-warning-modal"
      ref="confirm-warning-modal"
      hide-backdrop
      title="Confirm"
    >
      <label>
        Temperature entered is outside the defined critical limits. Are you
        sure you want to proceed?
      </label>
      <div class="button-container">
        <input type="button" v-on:click="hideConfirmWarningModal" class="btn-cancel" value="Cancel" />
        <input
          type="button"
          v-on:click="continueWithTemperatureWarning"
          class="btn-save"
          value="Proceed"
        />
      </div>
    </b-modal>
    <b-modal hide-footer id="agreement-modal" ref="agreement-modal" hide-backdrop title="Agreement"></b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../../router";
import firebase from "firebase";
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
import VueSignaturePad from "vue-signature-pad";
import uploadFiles from "../../shared/uploa-files";
import VueQrcodeReader from "vue-qrcode-reader";
import VueQRCodeComponent from "vue-qrcode-component";
Vue.component("qr-code", VueQRCodeComponent);
Vue.use(VueQrcodeReader);
Vue.use(VueToast);
Vue.use(VueSignaturePad);
Vue.use(Datetime);
import VueLodash from "vue-lodash";
import "vue-select/dist/vue-select.css";
import sendSMS from "../../shared/sms-service";
import Header from "../../components/header-view";
import Offline from "v-offline";
import Footer from "../../components/footer-view";
import template from "../../shared/agreement-contents";
// import Agreement from "../../components/agreementComponent"
import jsPDF from "jspdf";

import vSelect from "vue-select";
Vue.use(VueLodash, { name: "lodash" });
Vue.component("v-select", vSelect);
import { uuid } from "vue-uuid";
import getConfigVars from "../../shared/config-env";

export default {
  name: "planned-pickups",
  data: function() {
    return {
      userName: null,
      seen: true,
      pickupsList: [],
      emptyContainer: true,
      statusSource: [
        "Enroute Producer",
        "With Producer",
        "Enroute Packhouse",
        "Arrived At Packhouse"
      ],
      enrouteContainer: false,
      withproducerContainer: false,
      currentItem: null,
      producerContainer: false,
      selectedStatus: "",
      dropdownContainer: false,
      additionalNotes: "",
      selectedImgLocation: "",
      isSelected: false,
      temperature: "",
      ambientTemp: "",
      crates: "",
      fruitHarvested: "",
      fruitRejected: "",
      currency: "HTG",
      cratesPart: "0",
      advanceGiven: "0",
      selectedBank: "",
      bank: [],
      accountNumber: "",
      currencySource: ["USD", "HTG"],
      selectedPaymentCurrency: "HTG",
      withProducerNote: "",
      rejectReasons: [
        "Quantity",
        "Quality",
        "Maturity",
        "Temperature",
        "R4NOSHOW",
        "R4OTHER"
      ],
      rejectReason: "",
      rejectErrorMessage: "",
      banks: [],
      wireTransfer: false,
      mobileTransfer: false,
      cashTranser: false,
      paymentMethod: "",
      mobilePaymentOperator: "",
      mobilePaymentNumber: "",
      cashAccountNumber: "",
      cratePartList: ["1/4", "1/2", "3/4", "0"],
      mobilePaymentOperatorOptions: ["Digicel"],
      contactNumber: "",
      statusText: "",
      enrouteContainerPackHouse: false,
      arrivedAtPackHouse: false,
      arrivedAtAdditionalNotes: "",
      enrouteAdditionalNotes: "",
      rejectAddionalNote: "",
      selectedFiles: "",
      rejectedSelectedFiles: null,
      succesContent: "",
      withProducerErrorMessage: "",
      dateTimeVal: "",
      bckCurrency: "HTG",
      todayDate: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      initialContainer: false,
      selectedItem: null,
      withProducerQrCodeFile: null,
      withProducerDigitalSignature: null,
      transportCostArrivedAtPackhouse: null,
      packHouse: [],
      selectedDropOffLocation: null,
      qrCodeFiles: null,
      apiData: null,
      qrcodeError: "",
      qrcodeResult: "",
      qrcodesToUpload: [],
      delayedBy: null,
      banksWithCode: [],
      pickupStatus: ["Assigned", "With Producer", "Enroute Packhouse"],
      groupPickUps: "",
      selectedpickupItem: false,
      grpPickup: false,
      pickupStatusReadOnly: false,
      packageArray: [],
      serviceRequestIds: [],
      // packageArray: [
      //   {
      //     id: String,
      //     pickupRequestedOn: String,
      //     produce: String,
      //     Producer: String,
      //     collectat: String,
      //     dropOffAt: String,
      //     currentStatus: String,
      //     totalFruits: String,
      //     _delayedBy: String,
      //     status: Boolean
      //   }
      // ],
      pickupcount: 0,
      selectedPackageItem: [],
      qrCodesArray: [],
      startQRCode: null,
      endQRCode: null,
      startEndQRCodeFlag: null,
      netwrokStatus: true,
      accounttype: "",
      selectedNGO: "",
      ngos: [],
      conversionRate: null,
      conversionCurrency: null,
      isAgreed: false,
      isNGOAccepted: false,
      NGOAlreadyExists: false,
      isProducerDataPresent: false,
      agreementTemplate: template,
      agreementData: null
    };
  },
  components: {
    PerfectScrollbar,
    Header,
    Offline,
    Footer
  },
  mounted() {
    if (localStorage.systemRole == 99) {
      this.$refs.headercomp.createBreadcrumb([
        { text: "SA-Dashboard", href: "/sa-dashboard" },
        { text: "Planned Pickups", href: "/planned-pickups" }
      ]);
    } else if (localStorage.systemRole == 9) {
      this.$refs.headercomp.createBreadcrumb([
        { text: "Admin-Dashboard", href: "/admin-dashboard" },
        { text: "Planned Pickups", href: "/planned-pickups" }
      ]);
    } else if (localStorage.systemRole == 3) {
      this.$refs.headercomp.createBreadcrumb([
        { text: "Planned Pickups", href: "/planned-pickups" }
      ]);
    } else if (localStorage.systemRole == 7) {
      this.$refs.headercomp.createBreadcrumb([
        { text: "OP-Admin-Dashboard", href: "/op-admin-dashboard" },
        { text: "Planned Pickups", href: "/planned-pickups" }
      ]);
    }

    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }

    if (localStorage.offLineDataPresent == "true") {
      this.seen = true;
      //this.saveOfflineData();
    }

    this.userName = localStorage.userName;
    this.selectedpickupItem = false;
    this.getBankList();
    this.getNGOList();
    this.getPackHouse();
    this.getPickupList();
    this.getCurrencyRate();
  },

  beforeUpdate() {
    if (this.netwrokStatus) {
      localStorage.setItem("pickupsList", JSON.stringify(this.pickupsList));
      localStorage.setItem("banksWithCode", JSON.stringify(this.banksWithCode));

      localStorage.setItem("banks", JSON.stringify(this.banks));
      localStorage.setItem("packHouse", JSON.stringify(this.packHouse));
    }
  },
  methods: {
    getCurrencyRate() {
      let currentValue = this;
      // this.axios
      //         .get(
      //           `http://apilayer.net/api/live?access_key=107539ac917268dcb387c04b6c6685da&currencies=HTG&source=USD&format=1`
      //         )
      //         .then(function(response) {

      //           currentValue.conversionRate = Number(
      //             response.data.quotes.USDHTG
      //           ).toFixed(2);
      //           currentValue.conversionCurrency = "USD";

      //           console.log(response);
      //           console.log("Currency Rate");
      //           console.log(currentValue.conversionRate);
      //         })
      //         .catch(function(error) {

      //           console.log(error);
      //         });

      this.axios
        .get(
          `https://openexchangerates.org/api/latest.json?app_id=7e54f418ea954e02be2248a3b6df63aa`
        )
        .then(function(response) {
          console.log(response.data.rates.HTG);

          currentValue.conversionRate = Number(response.data.rates.HTG).toFixed(
            2
          );
          currentValue.conversionCurrency = "USD";

          // console.log(response);
          // console.log("Currency Rate");
          // console.log(currentValue.conversionRate);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    handleConnectivityChange(status) {
      var currentValue = this;
      this.netwrokStatus = status;
      var inpData = JSON.parse(localStorage.getItem("rejectedData"));
      inpData.updatedBy = localStorage.userName;
      if (!status) {
        this.pickupsList = JSON.parse(localStorage.getItem("pickupsList"));
        this.banks = JSON.parse(localStorage.getItem("banks"));
        this.banksWithCode = JSON.parse(localStorage.getItem("banksWithCode"));
        this.packHouse = JSON.parse(localStorage.getItem("packHouse"));

        this.$refs["offline-modal"].show();
        setTimeout(function() {
          currentValue.$refs["offline-modal"].hide();
        }, 4000);
      }
      if (status) {
        if (
          localStorage.IsEnrouteData == "true" ||
          localStorage.isRejectData == "true" ||
          localStorage.IsArrivedData == "true" ||
          localStorage.isAPIDataPresent == "true" ||
          localStorage.offLineDataPresent == "true"
        ) {
          this.seen = true;
          this.isProducerDataPresent = true;
          Vue.$toast.open({
            message: "Offline data syncing.....",
            type: "warning",
            position: "top"
          });
          localStorage.offLineDataPresent = false;
          localStorage.IsEnrouteData = false;
          localStorage.IsArrivedData = false;
          localStorage.offLineWithProducer = false;
        } else {
          currentValue.seen = false;
        }

        if (localStorage.isRejectData == "true") {
          var dbRef = firebase.database().ref("serviceRequest/");
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(localStorage.offLineServiceRequestId)
            .on("child_added", function(data) {
              var ref = firebase.database().ref("serviceRequest/" + data.key);
              ref.update(inpData).then(function() {
                //upload digital signature
                var digitalSignatureVal = JSON.parse(
                  localStorage.getItem("degitalSigntaureData")
                );
                digitalSignatureVal.updatedBy = localStorage.userName;
                var dbRef = firebase.database().ref("serviceRequest/");
                dbRef
                  .orderByChild("serviceRequestId")
                  .equalTo(localStorage.offLineServiceRequestId)
                  .on("child_added", function(data) {
                    var ref = firebase
                      .database()
                      .ref("serviceRequest/" + data.key);
                    ref.update(digitalSignatureVal).then(function() {});
                  });
                //upload rejected files
                //             console.log(JSON.parse(localStorage.getItem("rejectedFiles")));
                // currentValue.uploadImage((JSON.parse(localStorage.getItem("rejectedFiles"))),
                // "RejectedFiles",
                // localStorage.offLineServiceRequestId,
                // "",
                // currentValue,
                // "RejectedFiles")

                localStorage.offLineServiceRequestId = null;

                localStorage.setItem("degitalSigntaureData", null);
                localStorage.offLineDataPresent = false;
                currentValue.seen = false;

                localStorage.setItem("rejectedFiles", null);

                localStorage.setItem("rejectedData", null);
                localStorage.isRejectData = false;

                currentValue.rejectErrorMessage = "";
                currentValue.seen = false;
                switch (inpData.rejectReason) {
                  case "Quality":
                    {
                      sendSMS(
                        currentValue.currentItem.phoneNumber,
                        "Yon lo fri rejete poutèt Kalite maksimal"
                        //  `Lot has been rejected due to quality breach.`
                      )
                        .then(sent => console.log(sent))
                        .catch(err => console.log(err));
                    }
                    break;
                  case "Maturity":
                    {
                      sendSMS(
                        currentValue.currentItem.phoneNumber,
                        "Yon lo fri rejete poutèt Lè fri a rèk"
                        //  `Lot has been rejected due to maturity breach.`
                      )
                        .then(sent => console.log(sent))
                        .catch(err => console.log(err));
                    }
                    break;
                  case "Temperature":
                    {
                      sendSMS(
                        currentValue.currentItem.phoneNumber,
                        "Yon lo fri rejete poutèt Lè Tanperati limit fri a"
                        //`Lot has been rejected due to temperature breach.`
                      )
                        .then(sent => console.log(sent))
                        .catch(err => console.log(err));
                    }
                    break;
                  case "R4NOSHOW":
                  case "R4OTHER":
                  default:
                    console.log("sms not needed");
                }
                Vue.$toast.open({
                  message: "Product rejected successfully.",
                  type: "success",
                  position: "top"
                });
                // currentValue.createRejectAPI(
                //   localStorage.offLineServiceRequestId,
                //   inpData
                // );
                currentValue.createSeriesAPICalls(
                  localStorage.offLineServiceRequestId,
                  "R"
                );
                currentValue.hideModal();
                currentValue.enrouteContainer = false;
                currentValue.dropdownContainer = false;
                currentValue.producerContainer = false;
                currentValue.enrouteContainerPackHouse = false;
                currentValue.arrivedAtPackHouse = false;
                currentValue.initialContainer = true;
                currentValue.selectedItem = null;
                currentValue.seen = false;
              });
            });
        } else {
          setTimeout(function() {
            currentValue.seen = false;
          }, 8000);
        }
        // if (localStorage.isAPIDataPresent == "true") {
        //   var serviceRequestIds = localStorage.offLineServiceRequestId;
        //   var ids = serviceRequestIds.split(",");

        //   for (var i = 0; i < ids.length; i++) {
        //     i + 1 == ids.length;
        //     var dbRef = firebase.database().ref("serviceRequest/");
        //     dbRef
        //       .orderByChild("serviceRequestId")
        //       .equalTo(ids[i])
        //       .on("child_added", function(dataval) {
        //         currentValue.axios
        //           .post(
        //             "${getConfigVars().BASE_URL}/api/v1/corda/chain/after-harvest/reject",
        //             {
        //               rfsId: dataval.val().serviceRequestId,
        //               lotId: dataval.val().serviceRequestId,
        //               data: {
        //                 product: dataval.val().product,
        //                 producer: dataval.val().producer,
        //                 coords: dataval.val().location,
        //                 scheduled: moment
        //                   .utc(dataval.val().dateOfPickup)
        //                   .format("YYYY-MM-DD"),
        //                 amount: dataval.val().estimatedNoFruits
        //               }
        //             }
        //           )
        //           .then(function(response) {
        //             console.log("Reject lot API success");

        //             localStorage.isAPIDataPresent = false;
        //             currentValue.seen = false;
        //             localStorage.offLineServiceRequestId = null;
        //           })
        //           .catch(function(error) {
        //             // alert("fail")
        //             console.log("Reject lot API error");

        //             currentValue.erroMessage = error.message;

        //             currentValue.seen = false;
        //             localStorage.isAPIDataPresent = false;
        //             localStorage.offLineServiceRequestId = null;
        //           });
        //       });
        //   }
        // }
      }
    },
    saveOfflineEnrouteDataData: function() {
      var currentValue = this;
      currentValue.seen = true;
      var inpDataVal = JSON.parse(localStorage.getItem("EnrouteData"));
      inpDataVal.updatedBy = localStorage.userName;
      console.log(localStorage.offLineServiceRequestId);
      var dbRef = firebase.database().ref("serviceRequest/");
      dbRef
        .orderByChild("serviceRequestId")
        .equalTo(localStorage.offLineServiceRequestId)
        .on("child_added", function(data) {
          var ref = firebase.database().ref("serviceRequest/" + data.key);
          ref.update(inpDataVal).then(function() {
            Vue.$toast.open({
              message: `Data updated successfully`,
              type: "success",
              position: "top"
            });
            currentValue.seen = false;
            localStorage.IsEnrouteData = false;
            localStorage.setItem("EnrouteData", null);
            localStorage.offLineServiceRequestId = null;
          });
        });
    },
    getQrCodeFiles: function() {
      if (this.$refs.ltrCode.files) {
        if (this.$refs.ltrCode.files.length > 1) {
          this.selectedFiles = this.$refs.ltrCode.files;
        } else {
          this.selectedFiles = this.$refs.ltrCode.files[0];
        }
      }
    },
    getBankList: function() {
      var currentVal = this;
      currentVal.banks = [];
      currentVal.banksWithCode = [];
      var ref = firebase
        .database()
        .ref()
        .child("masters")
        .child("bank");

      ref.on("value", function(snapshot) {
        snapshot.forEach(requestData => {
          currentVal.banks.push(requestData.val().institutionName);
          currentVal.banksWithCode.push({
            Name: requestData.val().institutionName,
            Code: requestData.val().bic
          });
        });
      });
    },
    getNGOList: function() {
      var currentVal = this;
      currentVal.ngos = [];
      var ref = firebase
        .database()
        .ref()
        .child("masters")
        .child("ngos");
      ref.on("child_added", function(snapshot) {
        currentVal.ngos.push(snapshot.val().title);
      });
    },
    UpdateWithProducerStatus: function() {
      this.seen = true;
      let currentValue = this;
      // if (
      //   this.advanceGiven != null &&
      //   this.advanceGiven != "" &&
      //   this.advanceGiven != 0 &&
      //   this.advanceGiven != undefined
      // ) {
      //   this.axios
      //     .get(
      //       `http://apilayer.net/api/live?access_key=107539ac917268dcb387c04b6c6685da&currencies=HTG&source=USD&format=1`
      //     )
      //     .then(function(response) {
      //       currentValue.conversionRate = Number(
      //         response.data.quotes.USDHTG
      //       ).toFixed(2);
      //       currentValue.conversionCurrency = "USD";

      //       console.log(response);
      //     })
      //     .catch(function(error) {
      //       console.log(error);
      //     });
      // }
      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date + " " + time;
      var cratesPartVal = ".0";

      if (currentValue.cratesPart == "1/4") {
        cratesPartVal = ".25";
      } else if (currentValue.cratesPart == "1/2") {
        cratesPartVal = ".5";
      } else if (currentValue.cratesPart == "3/4") {
        cratesPartVal = ".75";
      }

      var inpData = null;
      if (this.temperature == null || this.temperature == "") {
        this.seen = false;

        Vue.$toast.open({
          message: "Please enter temperature",
          type: "error",
          position: "top"
        });
      } else if (this.ambientTemp == null || this.ambientTemp == "") {
        this.seen = false;

        Vue.$toast.open({
          message: "Please enter ambient temp",
          type: "error",
          position: "top"
        });
      } else if (this.crates == null || this.crates == "") {
        this.seen = false;
        Vue.$toast.open({
          message: "Please enter crates",
          type: "error",
          position: "top"
        });
      } else if (this.fruitHarvested == null || this.fruitHarvested == "") {
        this.seen = false;
        Vue.$toast.open({
          message: "Please enter fruit harvested",
          type: "error",
          position: "top"
        });
      } else if (this.fruitRejected == null || this.fruitRejected == "") {
        this.seen = false;
        Vue.$toast.open({
          message: "Please enter fruit rejected",
          type: "error",
          position: "top"
        });
        //keeping NGO as mandatory field
        // } else if (this.selectedNGO == null || this.selectedNGO == "") {
        //   this.seen = false;
        //   Vue.$toast.open({
        //     message: "Please select NGO",
        //     type: "error",
        //     position: "top"
        //   });
      } else if (
        !Number.isInteger(Number(this.fruitHarvested)) ||
        !Number.isInteger(Number(this.fruitRejected))
      ) {
        this.seen = false;
        Vue.$toast.open({
          message: "Please enter a valid fruit count",
          type: "error",
          position: "top"
        });
      } else if (this.advanceGiven == null || this.advanceGiven == "") {
        this.seen = false;

        Vue.$toast.open({
          message: "Please enter advance given",
          type: "error",
          position: "top"
        });
      } else if (
        this.qrcodesToUpload.length < 1 &&
        (this.startQRCode == null ||
          this.endQRCode == null ||
          this.startQRCode == undefined ||
          this.startQRCode == "" ||
          this.endQRCode == undefined ||
          this.endQRCode == "")
      ) {
        this.seen = false;
        Vue.$toast.open({
          message: "Please scan/enter the QR codes.",
          type: "error",
          position: "top"
        });
      } else if (this.currency == null || this.currency == "") {
        this.seen = false;

        Vue.$toast.open({
          message: "Please select currency",
          type: "error",
          position: "top"
        });
      } else if (this.paymentMethod == null || this.paymentMethod == "") {
        this.seen = false;
        Vue.$toast.open({
          message: "Please select payment method",
          type: "error",
          position: "top"
        });
      } else if (!this.isAgreed) {
        this.seen = false;
        Vue.$toast.open({
          message: "Please accept the agreement",
          type: "error",
          position: "top"
        });
      } else if (
        this.isNGOAccepted &&
        (this.selectedNGO == null ||
          this.selectedNGO == undefined ||
          this.selectedNGO == "")
      ) {
        this.seen = false;
        Vue.$toast.open({
          message: "Please select NGO",
          type: "error",
          position: "top"
        });
      } else {
        if (
          this.currentItem.Produce.split(" ")[0] == "Avocado" &&
          this.temperature > 26
        ) {
          this.seen = false;
          this.$refs["confirm-warning-modal"].show();
        } else if (this.temperature > 30) {
          this.seen = false;
          this.$refs["confirm-warning-modal"].show();
        } else {
          if (this.paymentMethod == "Wire") {
            if (this.selectedBank == null || this.selectedBank == "") {
              this.seen = false;
              Vue.$toast.open({
                message: "Please select bank",
                type: "error",
                position: "top"
              });
            } else if (
              this.accountNumber == null ||
              this.accountNumber == "" ||
              this.accountNumber.length > 10
            ) {
              this.seen = false;
              Vue.$toast.open({
                message: "Please enter valid account number",
                type: "error",
                position: "top"
              });
            } else {
              var selectedBankCode = null;
              for (var i = 0; i < this.banksWithCode.length; i++) {
                if (this.banksWithCode[i].Name == this.selectedBank) {
                  selectedBankCode = this.banksWithCode[i].Code;
                }
              }
              if (!this.isNGOAccepted) {
                this.selectedNGO = null;
              }
              this.qrcodesToUpload = [];
              let splittingFactor = 0;
              for (let i = 0; i < this.startQRCode.length; i++) {
                if (this.startQRCode.charAt(i) == this.endQRCode.charAt(i)) {
                  splittingFactor++;
                } else {
                  break;
                }
              }
              const startQRCodeCode = this.startQRCode.substring(
                0,
                splittingFactor
              );
              const startQRCodeStart = Number(
                this.startQRCode.substring(
                  splittingFactor,
                  this.startQRCode.length
                )
              );

              const endQRCodeCode = this.endQRCode.substring(
                0,
                splittingFactor
              );
              const endQRCodeEnd = Number(
                this.endQRCode.substring(splittingFactor, this.endQRCode.length)
              );

              if (startQRCodeCode == endQRCodeCode && startQRCodeCode != "") {
                if (this.startQRCode.length == this.endQRCode.length) {
                  if (endQRCodeEnd >= startQRCodeStart) {
                    if (startQRCodeStart == 0) {
                      for (let j = startQRCodeStart; j <= endQRCodeEnd; j++) {
                        this.qrcodesToUpload.push(`${startQRCodeCode}`);
                      }
                    } else {
                      for (let j = startQRCodeStart; j <= endQRCodeEnd; j++) {
                        this.qrcodesToUpload.push(`${startQRCodeCode}${j}`);
                      }
                    }

                    inpData = {
                      temperature: this.temperature,
                      ambientTemp: this.ambientTemp,
                      crates: Number(this.crates) + Number(cratesPartVal),
                      fruitsHarvested: this.fruitHarvested,
                      fruitRejected: this.fruitRejected,
                      advanceGiven: this.advanceGiven,
                      // ngo:this.selectedNGO,
                      conversionRate: this.conversionRate,
                      conversionCurrency: "USD",
                      currency: this.currency,
                      lotQRCodeImages: "",
                      paymentMethod: this.paymentMethod,
                      SelectedBank: this.selectedBank,
                      selectedBankCode: selectedBankCode,
                      accounttype: this.accounttype,
                      AccountNumber: this.accountNumber,
                      BankCurrency:
                        this.selectedPaymentCurrency == "HTG"
                          ? "GOURDE"
                          : this.selectedPaymentCurrency == "USD"
                          ? "USD"
                          : null,
                      selectedNGO: this.selectedNGO,
                      AdditionalNotes: this.withProducerNote,
                      status: "With Producer",
                      withProducerQrCodeFile: this.qrcodesToUpload,
                      startCrateQRCode: this.startQRCode,
                      endCrateQRCode: this.endQRCode,
                      isAgreed: this.isAgreed
                    };
                    this.updateWithProducerDetails(inpData);
                  } else {
                    this.seen = false;
                    Vue.$toast.open({
                      message:
                        "End QRCode can not be lesser than start QRCodes.",
                      position: "top",
                      type: "error"
                    });
                  }
                } else {
                  this.seen = false;
                  Vue.$toast.open({
                    message: "Start and end QR Code's length must be same.",
                    position: "top",
                    type: "error"
                  });
                }
              } else {
                this.seen = false;
                Vue.$toast.open({
                  message: "Start and end QR Codes are not matching.",
                  position: "top",
                  type: "error"
                });
              }
            }
          } else if (this.paymentMethod == "Mobile") {
            if (
              this.mobilePaymentOperator == null ||
              this.mobilePaymentOperator == ""
            ) {
              this.seen = false;

              Vue.$toast.open({
                message: "Please select mobile payment operator",
                type: "error",
                position: "top"
              });
            } else if (
              this.mobilePaymentNumber == null ||
              this.mobilePaymentNumber == "" ||
              this.mobilePaymentNumber.length > 45
            ) {
              this.seen = false;

              Vue.$toast.open({
                message: "Please enter valid mobile payment number",
                type: "error",
                position: "top"
              });
            } else {
              this.qrcodesToUpload = [];
              let splittingFactor = 0;
              for (let i = 0; i < this.startQRCode.length; i++) {
                if (this.startQRCode.charAt(i) == this.endQRCode.charAt(i)) {
                  splittingFactor++;
                } else {
                  break;
                }
              }
              const startQRCodeCode = this.startQRCode.substring(
                0,
                splittingFactor
              );
              const startQRCodeStart = Number(
                this.startQRCode.substring(
                  splittingFactor,
                  this.startQRCode.length
                )
              );

              const endQRCodeCode = this.endQRCode.substring(
                0,
                splittingFactor
              );
              const endQRCodeEnd = Number(
                this.endQRCode.substring(splittingFactor, this.endQRCode.length)
              );

              if (startQRCodeCode == endQRCodeCode && startQRCodeCode != "") {
                if (this.startQRCode.length == this.endQRCode.length) {
                  if (endQRCodeEnd >= startQRCodeStart) {
                    if (startQRCodeStart == 0) {
                      for (let j = startQRCodeStart; j <= endQRCodeEnd; j++) {
                        this.qrcodesToUpload.push(`${startQRCodeCode}`);
                      }
                    } else {
                      for (let j = startQRCodeStart; j <= endQRCodeEnd; j++) {
                        this.qrcodesToUpload.push(`${startQRCodeCode}${j}`);
                      }
                    }
                    inpData = {
                      temperature: this.temperature,
                      "ambient Temp": this.ambientTemp,
                      crates: Number(this.crates) + Number(cratesPartVal),
                      fruitsHarvested: this.fruitHarvested,
                      fruitRejected: this.fruitRejected,
                      advanceGiven: this.advanceGiven,
                      //ngo:this.selectedNGO,
                      conversionRate: this.conversionRate,
                      conversionCurrency: "USD",
                      currency: this.currency,
                      lotQRCodeImages: "",
                      paymentMethod: this.paymentMethod,
                      mobilePaymentOperator: this.mobilePaymentOperator,
                      mobilePaymentNumber: this.mobilePaymentNumber,
                      selectedNGO: this.selectedNGO,
                      additionalNotes: this.withProducerNote,
                      status: "With Producer",
                      withProducerQrCodeFile: this.qrcodesToUpload,
                      mobilePaymentCurrency:
                        this.selectedPaymentCurrency == "HTG"
                          ? "GOURDE"
                          : this.selectedPaymentCurrency == "USD"
                          ? "USD"
                          : null,
                      startCrateQRCode: this.startQRCode,
                      endCrateQRCode: this.endQRCode,
                      isAgreed: this.isAgreed
                    };
                    this.updateWithProducerDetails(inpData);
                  } else {
                    this.seen = false;
                    Vue.$toast.open({
                      message:
                        "End QR Code can not be lesser than start QR Code.",
                      position: "top",
                      type: "error"
                    });
                  }
                } else {
                  this.seen = false;
                  Vue.$toast.open({
                    message: "Start and end QR Code's length must be same.",
                    position: "top",
                    type: "error"
                  });
                }
              } else {
                this.seen = false;
                Vue.$toast.open({
                  message: "Start and end QR Codes are not matching.",
                  position: "top",
                  type: "error"
                });
              }
            }
          } else if (this.paymentMethod == "Cash") {
            if (
              this.selectedPaymentCurrency == null ||
              this.selectedPaymentCurrency == "" ||
              this.selectedPaymentCurrency == undefined
            ) {
              this.seen = false;
              Vue.$toast.open({
                message: "Please select cash payment currency",
                type: "error",
                position: "top"
              });
            } else {
              var farmerVoucher = null;
              farmerVoucher = uuid.v1().replace(/-/g, "");
              this.qrcodesToUpload = [];
              let splittingFactor = 0;
              for (let i = 0; i < this.startQRCode.length; i++) {
                if (this.startQRCode.charAt(i) == this.endQRCode.charAt(i)) {
                  splittingFactor++;
                } else {
                  break;
                }
              }
              const startQRCodeCode = this.startQRCode.substring(
                0,
                splittingFactor
              );
              const startQRCodeStart = Number(
                this.startQRCode.substring(
                  splittingFactor,
                  this.startQRCode.length
                )
              );

              const endQRCodeCode = this.endQRCode.substring(
                0,
                splittingFactor
              );
              const endQRCodeEnd = Number(
                this.endQRCode.substring(splittingFactor, this.endQRCode.length)
              );

              if (startQRCodeCode == endQRCodeCode && startQRCodeCode != "") {
                if (this.startQRCode.length == this.endQRCode.length) {
                  if (endQRCodeEnd >= startQRCodeStart) {
                    if (startQRCodeStart == 0) {
                      for (let j = startQRCodeStart; j <= endQRCodeEnd; j++) {
                        this.qrcodesToUpload.push(`${startQRCodeCode}`);
                      }
                    } else {
                      for (let j = startQRCodeStart; j <= endQRCodeEnd; j++) {
                        this.qrcodesToUpload.push(`${startQRCodeCode}${j}`);
                      }
                    }
                    inpData = {
                      temperature: this.temperature,
                      "ambient Temp": this.ambientTemp,
                      crates: Number(this.crates) + Number(cratesPartVal),
                      fruitsHarvested: this.fruitHarvested,
                      fruitRejected: this.fruitRejected,
                      advanceGiven: this.advanceGiven,
                      // ngo:this.selectedNGO,
                      conversionRate: this.conversionRate,
                      conversionCurrency: "USD",
                      currency: this.currency,
                      lotQRCodeImages: "",
                      paymentMethod: this.paymentMethod,
                      contactnumber: this.contactNumber,
                      selectedNGO: this.selectedNGO,
                      additionalNotes: this.withProducerNote,
                      status: "With Producer",
                      withProducerQrCodeFile: this.qrcodesToUpload,
                      farmerVoucher: farmerVoucher,
                      cashPaymentCurrency:
                        this.selectedPaymentCurrency == "HTG"
                          ? "GOURDE"
                          : this.selectedPaymentCurrency == "USD"
                          ? "USD"
                          : null,
                      startCrateQRCode: this.startQRCode,
                      endCrateQRCode: this.endQRCode,
                      isAgreed: this.isAgreed
                    };
                    this.updateWithProducerDetails(inpData);
                  } else {
                    this.seen = false;
                    Vue.$toast.open({
                      message:
                        "End QR Code can not be lesser than start QR Code.",
                      position: "top",
                      type: "error"
                    });
                  }
                } else {
                  this.seen = false;
                  Vue.$toast.open({
                    message: "Start and end QR Code's length must be same.",
                    position: "top",
                    type: "error"
                  });
                }
              } else {
                this.seen = false;
                Vue.$toast.open({
                  message: "Start and end QR Codes are not matching.",
                  position: "top",
                  type: "error"
                });
              }
            }
          } else {
            inpData = null;
          }
        }
      }
    },
    printDownloadUrl: function(url, fileName, documentType) {
      var currentValue = this;
      if (url) {
        var dbRef = firebase
          .database()
          .ref()
          .child("serviceRequest");
        var inpData = {
          withProducerFilePath: url,
          withProducserFileName: fileName,
          updatedBy: localStorage.userName
        };
        dbRef
          .orderByChild("serviceRequestId")
          .equalTo(currentValue.currentItem.Id)
          .on("child_added", function(data) {
            var ref = firebase
              .database()
              .ref("serviceRequest/" + data.key)
              .child("rejectedFiles");
            ref.push(inpData).then(function() {
              currentValue.seen = false;
            });
          });
      }
      this.seen = false;
    },

    getDataForBLockChainAPI: function() {
      let currentValue = this;
      currentValue.apiData = null;
      let typeOfPenalty = (function() {
        if (currentValue.delayedBy > 7 && currentValue.delayedBy <= 10) {
          return "AH_LSP_ACCEPT_DELAY";
        } else if (currentValue.delayedBy > 10) {
          return "AH_LSP_DENIAL";
        }
      })();
      var dbRef = firebase.database().ref("serviceRequest/");
      dbRef
        .orderByChild("serviceRequestId")
        .equalTo(currentValue.currentItem.Id)
        .on("child_added", function(data) {
          currentValue.apiData = {
            producer: data.val().producer,
            farmerId: data.val().farmerId,
            department: data.val().department,
            town: data.val().town,
            estimatedFruit: data.val().estimatedNoFruits,
            logitudeLatitude: data.val().location,
            productId: data.val().product,
            dateOfPickup: moment
              .utc(data.val().dateOfPickup)
              .format("YYYY-MM-DD"),
            serviceRequestId: data.val().serviceRequestId
          };
        });
      let _data = {};
      if (currentValue.delayedBy <= 7) {
        _data = {
          product: currentValue.apiData.productId,
          producer: currentValue.apiData.producer,
          coords: currentValue.apiData.logitudeLatitude,
          scheduled: currentValue.apiData.dateOfPickup,
          amount: currentValue.apiData.estimatedFruit
        };
      } else {
        _data = {
          penalties: [
            {
              type: typeOfPenalty,
              delivery_time: currentValue.delayedBy,
              fruits_amount: currentValue.apiData.estimatedFruit
              // boxes_amount: null,
              // temperature_breach_count: null
            }
          ],
          product: currentValue.apiData.productId,
          producer: currentValue.apiData.producer,
          coords: currentValue.apiData.logitudeLatitude,
          scheduled: currentValue.apiData.dateOfPickup,
          amount: currentValue.apiData.estimatedFruit
        };
      }

      // currentValue.axios
      //   .post(
      //     "${getConfigVars().BASE_URL}/api/v1/corda/chain/after-harvest/accept",
      //     {
      //       rfsId: currentValue.apiData.serviceRequestId,
      //       lotId: currentValue.apiData.serviceRequestId,
      //       data: _data
      //     }
      //   )
      //   .then(function(response) {
      //     console.log("planned pick accept success");
      //   })
      //   .catch(function(error) {
      //     console.log("planned pick accept error");
      //     currentValue.seen = false;
      //     currentValue.erroMessage = error.message;
      //   });
    },
    updateWithProducerDetails: function(inpData) {
      //work here
      let currentValue = this;
      currentValue.seen = true;
      inpData["withProducerDataAddedOn"] = moment.utc().toString();
      var fruitCount =
        Number(inpData.fruitsHarvested) - Number(inpData.fruitRejected);
      var product = currentValue.currentItem.Produce.split("(")[0];
      currentValue.withProducerErrorMessage = "";
      var dbRef = firebase.database().ref("serviceRequest/");
      dbRef
        .orderByChild("serviceRequestId")
        .equalTo(currentValue.currentItem.Id)
        .on("child_added", function(data) {
          var ref = firebase.database().ref("serviceRequest/" + data.key);
          ref
            .update(inpData)
            .then(function() {
              sendSMS(
                currentValue.currentItem.phoneNumber,
                "Kontra ki siyen " +
                  fruitCount +
                  " " +
                  product.trim() +
                  " nan pòst kolekt"
                //  "Contrat signé pour "+fruitCount+ " "+ product.trim()+" au point de collecte"
                //  "Signed contract for "+fruitCount+ " "+ product.trim()+" at collection point"
              );
              if (localStorage.offLineDataPresent != "true") {
                if (currentValue.isProducerDataPresent == false) {
                  currentValue.qrcodesToUpload = [];
                  currentValue.getAgreementData(currentValue).then(function() {
                    currentValue.$refs["digital-signature-modal"].show();
                  });
                  currentValue.seen = false;
                  localStorage.offLineWithProducer = false;
                }
              }
            })
            .catch(function(error) {
              currentValue.erroMessage = error.message;
              currentValue.seen = false;
            });
        });
      //  if (
      //     this.selectedNGO != undefined &&
      //     this.selectedNGO != null &&
      //     this.selectedNGO != ""
      //   )
      //     {
      // var dbRefMaster = firebase.database().ref("masters/producer");
      // dbRefMaster
      //   .orderByChild("uuid_id")
      //   .equalTo(currentValue.currentItem.farmerId)
      //   .on("child_added", data => {
      //     var refMaster = firebase
      //       .database()
      //       .ref("masters/producer/" + data.key);

      //     refMaster
      //       .update({ selectedNGO: this.selectedNGO })
      //       .then(() => {
      //         currentValue.seen = false;
      //       })
      //       .catch(function(error) {
      //         currentValue.seen = false;
      //       });

      //   });
      //     }

      if (!currentValue.netwrokStatus) {
        currentValue.qrcodesToUpload = [];
        var listCount = 0;
        currentValue.pickupsList.forEach(item => {
          if (item.Id == currentValue.currentItem.Id) {
            item.status = "With Producer";
            item.CurrentStatus = "With Producer";
          }
          if (listCount == currentValue.pickupsList.length - 1) {
            localStorage.setItem(
              "pickupsList",
              JSON.stringify(currentValue.pickupsList)
            );
          }
          listCount++;
        });
        currentValue.currentItem.CurrentStatus = "With Producer";
        currentValue.currentItem.status = "With Producer";
        currentValue.getAgreementData(currentValue).then(function() {
          currentValue.$refs["digital-signature-modal"].show();
        });
        currentValue.seen = false;
        localStorage.offLineDataPresent = true;
        localStorage.offLineWithProducer = true;
        localStorage.setItem("withProducerData", JSON.stringify(inpData));
        localStorage.offLineServiceRequestId = currentValue.currentItem.Id;
      }
    },
    saveOfflineData() {
      var currentValue = this;
      currentValue.seen = true;
      var inpDataVal = JSON.parse(localStorage.getItem("withProducerData"));
      console.log(inpDataVal);
      inpDataVal.updatedBy = localStorage.userName;
      console.log(localStorage.offLineServiceRequestId);
      var dbRef = firebase.database().ref("serviceRequest/");
      dbRef
        .orderByChild("serviceRequestId")
        .equalTo(localStorage.offLineServiceRequestId)
        .on("child_added", function(data) {
          var ref = firebase.database().ref("serviceRequest/" + data.key);
          ref.update(inpDataVal).then(function() {
            var digitalSignatureVal = JSON.parse(
              localStorage.getItem("degitalSigntaureData")
            );
            var dbRef = firebase.database().ref("serviceRequest/");
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(localStorage.offLineServiceRequestId)
              .on("child_added", function(data) {
                var ref = firebase.database().ref("serviceRequest/" + data.key);
                ref.update(inpDataVal).then(function() {
                  var digitalSignatureVal = JSON.parse(
                    localStorage.getItem("degitalSigntaureData")
                  );
                  digitalSignatureVal.updatedBy = localStorage.userName;
                  var dbRef = firebase.database().ref("serviceRequest/");
                  dbRef
                    .orderByChild("serviceRequestId")
                    .equalTo(localStorage.offLineServiceRequestId)
                    .on("child_added", function(data) {
                      var ref = firebase
                        .database()
                        .ref("serviceRequest/" + data.key);
                      ref.update(digitalSignatureVal).then(function() {
                        localStorage.offLineServiceRequestId = null;
                        localStorage.setItem("withProducerData", null);
                        localStorage.setItem("degitalSigntaureData", null);
                        localStorage.offLineDataPresent = false;
                        currentValue.seen = false;
                        Vue.$toast.open({
                          message: `Data updated successfully`,
                          type: "success",
                          position: "top"
                        });
                      });
                    });
                });
              });
          });
        });
    },
    selectedPaymentMethod: function(val) {
      if (val == 0) {
        this.paymentMethod = "Wire";
        this.wireTransfer = true;
        this.mobileTransfer = false;
        this.cashTranser = false;
      } else if (val == 1) {
        this.paymentMethod = "Mobile";
        this.wireTransfer = false;
        this.mobileTransfer = true;
        this.cashTranser = false;
      } else if (val == 2) {
        this.paymentMethod = "Cash";
        this.wireTransfer = false;
        this.mobileTransfer = false;
        this.cashTranser = true;
      } else {
        this.wireTransfer = false;
        this.mobileTransfer = false;
        this.cashTranser = false;
      }
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
    hideModal: function() {
      this.$refs["reject-modal"].hide();
    },
    hideConfirmWarningModal: function() {
      this.$refs["confirm-warning-modal"].hide();
    },
    rejectCollection: function() {
      this.$refs["reject-modal"].show();
    },
    getContactNumber: function() {
      // let currentVal = this;
      // var dbRef = firebase.database().ref("serviceRequest/");
      // dbRef
      //   .orderByChild("serviceRequestId")
      //   .equalTo(this.currentItem.Id)
      //   .on("child_added", function(snapshot) {
      //     var farmerId = snapshot.val().farmerId;
      //     var masterDb = firebase
      //       .database()
      //       .ref("masters")
      //       .child("producer");
      //     masterDb
      //       .orderByChild("uuid_id")
      //       .equalTo(farmerId)
      //       .on("child_added", function(childSnapShot) {
      //         currentVal.contactNumber = childSnapShot.val().phoneNumber;
      //       });
      //   });

      this.contactNumber = this.currentItem.phoneNumber;
    },
    onStatusSelect: function() {
      if (this.selectedStatus == "Enroute Producer") {
        this.producerContainer = false;
        this.enrouteContainer = true;
        this.emptyContainer = false;
        this.dropdownContainer = true;
        this.enrouteContainerPackHouse = false;
        this.arrivedAtPackHouse = false;
        this.statusText = "- ENROUTE PRODUCER";
      } else if (this.selectedStatus == "With Producer") {
        this.producerContainer = true;
        this.enrouteContainer = false;
        this.emptyContainer = false;
        this.dropdownContainer = true;
        this.statusText = "- WITH PRODUCER";
        this.enrouteContainerPackHouse = false;
        this.arrivedAtPackHouse = false;
      } else if (this.selectedStatus == "Enroute Packhouse") {
        // console.log(this.selectedItem);

        // var dbRef = firebase.database().ref("serviceRequest/");
        // dbRef
        //   .orderByChild("serviceRequestId")
        //   .equalTo(this.selectedItem)
        //   .on("child_added", data => {
        if (this.grpPickup) {
          this.producerContainer = false;
          this.enrouteContainer = false;
          this.emptyContainer = false;
          this.dropdownContainer = true;
          this.enrouteContainerPackHouse = true;
          this.dateTimeVal = "";
          this.arrivedAtPackHouse = false;
          this.statusText == "- ENROUTE PACKHOUSE";
        } else {
          if (
            this.currentItem.status == "Assigned" ||
            this.currentItem.status == "Enroute Producer"
          ) {
            Vue.$toast.open({
              message: `Please complete the previous stage.`,
              type: "error",
              position: "top"
            });
            this.selectedStatus = null;
          } else {
            this.producerContainer = false;
            this.enrouteContainer = false;
            this.emptyContainer = false;
            this.dropdownContainer = true;
            this.enrouteContainerPackHouse = true;
            this.dateTimeVal = "";
            this.arrivedAtPackHouse = false;
            this.statusText == "- ENROUTE PACKHOUSE";
            this.selectedDropOffLocation = this.currentItem.DropOffAt;
          }
        }
        // });
      } else if (this.selectedStatus == "Arrived At Packhouse") {
        // var dbRef = firebase.database().ref("serviceRequest/");
        // dbRef
        //   .orderByChild("serviceRequestId")
        //   .equalTo(this.selectedItem)
        //   .on("child_added", data => {
        if (this.grpPickup) {
          this.producerContainer = false;
          this.enrouteContainer = false;
          this.emptyContainer = false;
          this.dropdownContainer = true;
          this.enrouteContainerPackHouse = false;
          this.arrivedAtPackHouse = true;
          this.statusText = "- ARRIVED AT PACKHOUSE";
        } else {
          if (
            this.currentItem.status == "Assigned" ||
            this.currentItem.status == "Enroute Producer"
          ) {
            Vue.$toast.open({
              message: `Please complete the previous stage.`,
              type: "error",
              position: "top"
            });
            this.selectedStatus = null;
          } else {
            this.producerContainer = false;
            this.enrouteContainer = false;
            this.emptyContainer = false;
            this.dropdownContainer = true;
            this.enrouteContainerPackHouse = false;
            this.arrivedAtPackHouse = true;
            this.statusText = "- ARRIVED AT PACKHOUSE";
            // if (!this.grpPickup) {
            //   this.getDataForBLockChainAPI();
            // }
          }
        }
        // });
      } else {
        this.producerContainer = false;
        this.enrouteContainer = false;
        this.emptyContainer = false;
        this.enrouteContainerPackHouse = false;
        this.arrivedAtPackHouse = false;
      }
      this.temperature = null;
      this.ambientTemp = null;
      this.crates = null;
      this.cratesPart = null;
      this.fruitHarvested = null;
      this.fruitRejected = null;
      this.advanceGiven = "0";
      this.currency = "HTG";
      this.paymentMethod = null;
      this.withProducerNote = null;
      this.selectedBank = null;
      this.accountNumber = null;
      this.selectedPaymentCurrency = null;
      this.mobilePaymentOperator = null;
      this.mobilePaymentNumber = null;
      this.qrCodeFiles = null;
      this.wireTransfer = false;
      this.mobileTransfer = false;
      this.cashTranser = false;
      this.transportCostArrivedAtPackhouse = null;
      this.dateTimeVal = null;
      this.arrivedAtAdditionalNotes = null;
      this.startQRCode = null;
      this.endQRCode = null;
      this.isAgreed = false;
    },
    cancelSelectedItem: function() {
      this.enrouteContainer = false;
      this.dropdownContainer = false;
      this.producerContainer = false;
      this.enrouteContainerPackHouse = false;
      this.arrivedAtPackHouse = false;
      this.initialContainer = true;
      this.selectedItem = null;
      this.statusText = "";

      this.temperature = null;
      this.ambientTemp = null;
      this.crates = null;
      this.cratesPart = null;
      this.fruitHarvested = null;
      this.fruitRejected = null;
      this.advanceGiven = "0";
      this.currency = "HTG";
      this.paymentMethod = null;
      this.withProducerNote = null;
      this.selectedBank = null;
      this.accountNumber = null;
      this.selectedPaymentCurrency = null;
      this.mobilePaymentOperator = null;
      this.mobilePaymentNumber = null;
      this.qrCodeFiles = null;
      this.wireTransfer = false;
      this.mobileTransfer = false;
      this.cashTranser = false;
      this.transportCostArrivedAtPackhouse = null;
      this.dateTimeVal = null;
      this.arrivedAtAdditionalNotes = null;
      this.startQRCode = null;
      this.endQRCode = null;
      this.isAgreed = false;
      this.isNGOAccepted = false;
      this.NGOAlreadyExists = false;
    },
    updateEnrouteStatus: function() {
      if (this.grpPickup) {
        if (this.selectedPackageItem.length == 0) {
          Vue.$toast.open({
            message: `Please select pickups.`,
            type: "error",
            position: "top"
          });
        } else {
          this.seen = true;
          let currentValue = this;
          this.packageArray.forEach((value, index) => {
            currentValue.currentItem = value;
            currentValue.commonUpdateEnrouteStatus(index);
          });
          this.selectedStatus = "";
          this.selectedDropOffLocation = null;
          this.groupPickUps = null;
          this.initialContainer = true;
          this.grpPickup = false;
        }
      } else {
        this.commonUpdateEnrouteStatus(-1);
      } //end of else
    },
    commonUpdateEnrouteStatus(itemCount) {
      //console.log(this.currentItem);
      this.seen = true;
      let currentValue = this;
      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date + " " + time;

      var inpData = {
        status: "Enroute Producer",
        plannedPickUpAddedOn: moment.utc().toString(),
        enrouteAdditionalNote: currentValue.additionalNotes,
        updatedBy: localStorage.userName
      };

      var dbRef = firebase.database().ref("serviceRequest/");
      dbRef
        .orderByChild("serviceRequestId")
        .equalTo(currentValue.currentItem.Id)
        .on("child_added", function(data) {
          var ref = firebase.database().ref("serviceRequest/" + data.key);
          ref
            .update(inpData)
            .then(function() {
              currentValue.seen = false;
              // Vue.$toast.open({
              //   message: "Status updated successfully",
              //   type: "success",
              //   position: "top"
              // });
              if (
                itemCount == -1 ||
                currentValue.packageArray.length == itemCount + 1
              ) {
                Vue.$toast.open({
                  message: "Status updated successfully.",
                  type: "success",
                  position: "top"
                });

                currentValue.packageArray = [];
              }
              currentValue.enrouteContainer = false;
              currentValue.dropdownContainer = false;
              currentValue.initialContainer = true;
              currentValue.selectedItem = null;
              currentValue.statusText = "";
              currentValue.additionalNotes = "";
              localStorage.IsEnrouteData = false;
              localStorage.setItem("EnrouteData", null);
              localStorage.offLineServiceRequestId = null;
            })
            .catch(function(error) {
              currentValue.erroMessage = error.message;
              currentValue.seen = false;
              Vue.$toast.open({
                message: "Error updating data to firebase.",
                position: "top",
                type: "error"
              });
            });
        });
      //working
      if (!currentValue.netwrokStatus && currentValue.netwrokStatus != null) {
        currentValue.currentItem.CurrentStatus = "Enroute Producer";
        currentValue.currentItem.status = "Enroute Producer";
        currentValue.seen = false;
        localStorage.IsEnrouteData = true;
        localStorage.setItem("EnrouteData", JSON.stringify(inpData));
        localStorage.offLineServiceRequestId = currentValue.currentItem.Id;
        Vue.$toast.open({
          message: "Data will save once you back to online.",
          type: "success",
          position: "top"
        });
        var listCount = 0;
        currentValue.pickupsList.forEach(item => {
          if (item.Id == currentValue.currentItem.Id) {
            item.status = "Enroute Producer";
            item.CurrentStatus = "Enroute Producer";
          }
          if (listCount == currentValue.pickupsList.length - 1) {
            localStorage.setItem(
              "pickupsList",
              JSON.stringify(currentValue.pickupsList)
            );
          }
          listCount++;
        });
        currentValue.enrouteContainer = false;
        currentValue.dropdownContainer = false;
        currentValue.initialContainer = true;
        currentValue.selectedItem = null;
        currentValue.statusText = "";
        currentValue.packageArray = [];
        localStorage.setItem("EnrouteData", null);
        localStorage.offLineServiceRequestId = null;
      }
    },
    //working
    uploadRejectedFiles: function() {
      this.uploadImage(
        this.rejectedSelectedFiles,
        "RejectedFiles",
        this.currentItem.Id,
        "",
        this,
        "RejectedFiles"
      );
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
    updateRejectStatus: function() {
      console.log("REJECTED");
      console.log(this.rejectAddionalNote);
      this.seen = true;
      if (this.rejectReason == null || this.rejectReason == "") {
        Vue.$toast.open({
          message: "Please select the reason.",
          type: "error",
          position: "top"
        });
        this.seen = false;
      } else if (
        this.rejectAddionalNote == null ||
        this.rejectAddionalNote == ""
      ) {
        this.rejectAddionalNote = "";
        Vue.$toast.open({
          message: "Please provide additional note.",
          type: "error",
          position: "top"
        });
        this.seen = false;
      } else {
        this.updateRejectDetails();
      }
    },
    updateRejectDetails: function() {
      this.getDataForBLockChainAPI();
      let currentValue = this;
      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date + " " + time;

      var inpData = {
        status: "Rejected",
        rejectedOn: moment.utc().toString(),
        rejectReason: currentValue.rejectReason,
        rejectAddionalNote: currentValue.rejectAddionalNote,
        updatedBy: localStorage.userName
      };
      var dbRef = firebase.database().ref("serviceRequest/");
      dbRef
        .orderByChild("serviceRequestId")
        .equalTo(currentValue.currentItem.Id)
        .on("child_added", function(data) {
          var ref = firebase.database().ref("serviceRequest/" + data.key);
          ref
            .update(inpData)
            .then(function() {
              //upload rejected files
              currentValue.uploadRejectedFiles();
              if (
                localStorage.isRejectData != "true" &&
                localStorage.isRejectData != undefined
              ) {
                currentValue.getAgreementData(currentValue).then(function() {
                  currentValue.$refs["digital-signature-modal"].show();
                });
              }
              localStorage.setItem("rejectedData", null);
              localStorage.isRejectData = false;

              currentValue.rejectErrorMessage = "";
              currentValue.seen = false;
              switch (inpData.rejectReason) {
                case "Quality":
                  {
                    sendSMS(
                      currentValue.currentItem.phoneNumber,
                      "Yon lo fri rejete poutèt Kalite maksimal"
                      // `Lot has been rejected due to quality breach.`
                      // `Un groupe de fruits est rejeté en raison du Seuil de qualité`
                    )
                      .then(sent => console.log(sent))
                      .catch(err => console.log(err));
                  }
                  break;
                case "Maturity":
                  {
                    sendSMS(
                      currentValue.currentItem.phoneNumber,
                      "Yon lo fri rejete poutèt Lè fri a rèk"
                      // `Lot has been rejected due to maturity breach.`
                      // `Un groupe de fruits est rejeté en raison du Seuil de maturité`
                    )
                      .then(sent => console.log(sent))
                      .catch(err => console.log(err));
                  }
                  break;
                case "Temperature":
                  {
                    sendSMS(
                      currentValue.currentItem.phoneNumber,
                      "Yon lo fri rejete poutèt Lè Tanperati limit fri a"
                      //`Lot has been rejected due to temperature breach.`
                      // `Un groupe de fruits est rejeté en raison du Seuil de température`
                    )
                      .then(sent => console.log(sent))
                      .catch(err => console.log(err));
                  }
                  break;
                case "R4NOSHOW":
                case "R4OTHER":
                default:
                  console.log("sms not needed");
              }
              Vue.$toast.open({
                message: "Product rejected successfully.",
                type: "success",
                position: "top"
              });
              // currentValue.createRejectAPI(
              //   currentValue.currentItem.Id,
              //   inpData
              // );
              currentValue.createSeriesAPICalls(
                currentValue.currentItem.Id,
                "R"
              );
              // currentValue.checkPenalityAPI(currentValue.currentItem.Id);
              currentValue.rejectReason = "";
              currentValue.rejectAddionalNote = "";
              currentValue.hideModal();
              currentValue.enrouteContainer = false;
              currentValue.dropdownContainer = false;
              currentValue.producerContainer = false;
              currentValue.enrouteContainerPackHouse = false;
              currentValue.arrivedAtPackHouse = false;
              currentValue.initialContainer = true;
              currentValue.selectedItem = null;

              // currentValue.axios
              //   .post(
              //     "${getConfigVars().BASE_URL}/api/v1/corda/chain/after-harvest/reject",
              //     {
              //       rfsId: currentValue.apiData.serviceRequestId,
              //       lotId: currentValue.apiData.serviceRequestId,
              //       data: {
              //         penalties: [
              //           {
              //             type: "AH_LSP_DENIAL",
              //             // delivery_time: null,
              //             fruits_amount: currentValue.apiData.estimatedFruit
              //             // boxes_amount: null,
              //             // temperature_breach_count: null
              //           }
              //         ],
              //         product: currentValue.apiData.productId,
              //         producer: currentValue.apiData.producer,
              //         coords: currentValue.apiData.logitudeLatitude,
              //         scheduled: currentValue.apiData.dateOfPickup,
              //         amount: currentValue.apiData.estimatedFruit
              //       }
              //     }
              //   )
              //   .then(function(response) {
              //     // alert("successs")
              //     currentValue.$refs["digital-signature-modal"].show();
              //     console.log("Reject lot API success");
              //     localStorage.isAPIDataPresent = false;

              //     localStorage.offLineServiceRequestId = null;
              //   })
              //   .catch(function(error) {
              //     console.log("Reject lot API error");
              //     currentValue.seen = false;
              //     currentValue.erroMessage = error.message;
              //   });
            })
            .catch(function(error) {
              currentValue.erroMessage = error.message;
              currentValue.seen = false;
              Vue.$toast.open({
                message: "Error updating data to firebase.",
                type: "error",
                position: "top"
              });
            });
        });
      if (!currentValue.netwrokStatus && currentValue.netwrokStatus != null) {
        //working 1
        //             console.log(currentValue.rejectedSelectedFiles)
        //             console.log(currentValue.rejectedSelectedFiles.length);
        //             var i=0;
        //             var rejectedFileList = [];
        //             if(currentValue.rejectedSelectedFiles.length > 0 )
        //             {

        //            currentValue.rejectedSelectedFiles.forEach((value, index) => {
        //    i=i+1;
        // rejectedFileList.push("File"+{"name":value.name,"lastModified":value.lastModified,
        // "size":value.size,
        // "type":value.type});
        // console.log(rejectedFileList)
        // console.log(i)
        // console.log(currentValue.rejectedSelectedFiles.length)
        //    if(i == currentValue.rejectedSelectedFiles.length)
        //    {
        // localStorage.setItem("rejectedFiles",JSON.stringify(rejectedFileList))
        //    }
        // });

        //             }
        currentValue.getAgreementData(currentValue).then(function() {
          currentValue.$refs["digital-signature-modal"].show();
        });

        localStorage.setItem("rejectedData", JSON.stringify(inpData));
        localStorage.isAPIDataPresent = true;
        localStorage.isRejectData = true;
        var serviceRequestIds = localStorage.offLineServiceRequestId;
        if (
          serviceRequestIds != undefined &&
          serviceRequestIds != null &&
          serviceRequestIds != "null" &&
          serviceRequestIds != " " &&
          serviceRequestIds != "undefined"
        ) {
          localStorage.offLineServiceRequestId =
            serviceRequestIds + "," + currentValue.currentItem.Id;
        } else {
          localStorage.offLineServiceRequestId = currentValue.currentItem.Id;
        }
        //  console.log(JSON.stringify(currentValue.rejectedSelectedFiles))

        currentValue.seen = false;

        // Vue.$toast.open({
        //       message: "Data will be saved once you back to online.",
        //       type: "success",
        //       position: "top"
        //     });
        currentValue.$refs["reject-modal"].hide();
      }
    },
    showSelected: function(item) {
      this.initialContainer = false;
      this.currentItem = null;
      this.currentItem = item;
      this.enrouteContainer = false;
      this.emptyContainer = false;
      this.producerContainer = false;
      this.arrivedAtPackHouse = false;
      this.enrouteContainerPackHouse = false;
      this.dropdownContainer = true;
      this.getContactNumber();
      this.selectedStatus = null;
      this.statusText = "";

      this.temperature = null;
      this.ambientTemp = null;
      this.crates = null;
      this.cratesPart = null;
      this.fruitHarvested = null;
      this.fruitRejected = null;
      this.advanceGiven = "0";
      this.currency = "HTG";
      this.paymentMethod = null;
      this.withProducerNote = null;
      this.selectedBank = null;
      this.accountNumber = null;
      this.selectedPaymentCurrency = null;
      this.mobilePaymentOperator = null;
      this.mobilePaymentNumber = null;
      this.qrCodeFiles = null;
      this.wireTransfer = false;
      this.mobileTransfer = false;
      this.cashTranser = false;
      this.transportCostArrivedAtPackhouse = null;
      this.dateTimeVal = null;
      this.arrivedAtAdditionalNotes = null;
      this.delayedBy = item._delayedBy;
      this.startQRCode = null;
      this.endQRCode = null;
      this.isAgreed = false;
      this.isNGOAccepted = false;
      this.NGOAlreadyExists = false;
      // var dbRefMaster = firebase.database().ref("masters/producer");
      // dbRefMaster
      //   .orderByChild("uuid_id")
      //   .equalTo(this.currentItem.farmerId)
      //   .on("child_added", data => {
      //     this.selectedNGO = data.val().selectedNGO;
      //     if (
      //       this.selectedNGO != undefined &&
      //       this.selectedNGO != null &&
      //       this.selectedNGO != ""
      //     ) {
      //       this.NGOAlreadyExists = true;
      //       this.isNGOAccepted = true;
      //     }
      //   });
      if (this.currentItem.CurrentStatus == "Enroute Producer") {
        this.statusSource = [
          "With Producer",
          "Enroute Packhouse",
          "Arrived At Packhouse"
        ];
      } else if (this.currentItem.CurrentStatus == "With Producer") {
        this.statusSource = ["Enroute Packhouse", "Arrived At Packhouse"];
      } else if (this.currentItem.CurrentStatus == "Enroute Packhouse") {
        this.statusSource = ["Arrived At Packhouse"];
      } else if (this.currentItem.CurrentStatus == "Arrived At Packhouse") {
        this.statusSource = [];
        this.dropdownContainer = false;
        this.arrivedAtPackHouse = false;
        this.initialContainer = true;
        this.selectedItem = null;
        this.statusText = "";
        this.packageArray = [];
      } else {
        this.statusSource = [
          "Enroute Producer",
          "With Producer",
          "Enroute Packhouse",
          "Arrived At Packhouse"
        ];
      }
      //  this.getDataForBLockChainAPI();
    },
    getPickupList: function() {
      let currentval = this;
      // var ref = firebase
      //   .database()
      //   .ref()
      //   .child("serviceRequest");
      // console.log(this.userName);

      let rawName = this.userName.trim().split("(", 1);
      rawName = rawName[0].trim();

      var ref = firebase.database().ref("serviceRequest/");

      if (
        localStorage.systemRole == 99 ||
        localStorage.systemRole == 9 ||
        localStorage.systemRole == 7
      ) {
        ref.on("value", function(snapshot) {
          currentval.pickupsList = [];
          snapshot.forEach(requestData => {
            if (
              requestData.val().status == "Assigned" ||
              requestData.val().status == "Enroute Packhouse" ||
              requestData.val().status == "With Producer" ||
              requestData.val().status == "Enroute Producer"
            ) {
              console.log(requestData.val());
              var data = "";
              data = {
                Id: requestData.val().serviceRequestId,
                PickupRequestedOn: moment
                  .utc(requestData.val().dateOfPickup)
                  .local()
                  .format("MMM DD, YYYY hh:mm A"),
                Produce:
                  requestData.val().product +
                  " (" +
                  requestData.val().estimatedNoFruits +
                  ")",
                Producer: requestData.val().producer,
                Collectat: requestData.val().collectionPoint,
                DropOffAt: requestData.val().dropOffAtPackhouse,
                CurrentStatus: requestData.val().status,
                totalFruits: requestData.val().estimatedNoFruits,
                _delayedBy: requestData.val().scheduledAfter,
                farmerId: requestData.val().farmerId,
                phoneNumber: requestData.val().phoneNumber,
                status: requestData.val().status,
                collector: requestData.val().collector
              };
              currentval.pickupsList.push(data);
              currentval.seen = false;
            }
          });
          currentval.pickupsList.reverse();
          console.log(currentval.pickupsList);
        });
      } else {
        ref
          .orderByChild("collector")
          .equalTo(rawName)
          .on("value", function(snapshot) {
            currentval.pickupsList = [];
            snapshot.forEach(requestData => {
              if (
                requestData.val().status == "Assigned" ||
                requestData.val().status == "Enroute Packhouse" ||
                requestData.val().status == "With Producer" ||
                requestData.val().status == "Enroute Producer"
              ) {
                console.log(requestData.val());
                var data = "";
                data = {
                  Id: requestData.val().serviceRequestId,
                  PickupRequestedOn: moment
                    .utc(requestData.val().dateOfPickup)
                    .local()
                    .format("MMM DD, YYYY hh:mm A"),
                  Produce:
                    requestData.val().product +
                    " (" +
                    requestData.val().estimatedNoFruits +
                    ")",
                  Producer: requestData.val().producer,
                  Collectat: requestData.val().collectionPoint,
                  DropOffAt: requestData.val().dropOffAtPackhouse,
                  CurrentStatus: requestData.val().status,
                  totalFruits: requestData.val().estimatedNoFruits,
                  _delayedBy: requestData.val().scheduledAfter,
                  farmerId: requestData.val().farmerId,
                  status: requestData.val().status,
                  phoneNumber: requestData.val().phoneNumber,
                  collector: requestData.val().collector
                };
                currentval.pickupsList.push(data);
                currentval.seen = false;
              }
            });
            currentval.pickupsList.reverse();
            console.log(currentval.pickupsList);
          });
      } // end of else condition

      setTimeout(function() {
        if (currentval.pickupsList.length == 0) {
          currentval.seen = false;
        }
      }, 4000);
    },
    updateArrivedAtPackHouseStatus: function() {
      let currentValue = this;
      if (this.grpPickup) {
        if (this.selectedPackageItem.length == 0) {
          Vue.$toast.open({
            message: `Please select pickups.`,
            type: "error",
            position: "top"
          });
        } else {
          if (
            typeof currentValue.transportCostArrivedAtPackhouse !=
              "undefined" &&
            currentValue.transportCostArrivedAtPackhouse &&
            currentValue.dateTimeVal != ""
          ) {
            this.seen = true;
            let currentValue = this;
            console.log(this.packageArray);
            this.packageArray.forEach((value, index) => {
              currentValue.serviceRequestIds.push(value.Id);
              console.log("Valueeeeeeeeeeeeeeeeeeee");
              currentValue.currentItem = null;
              currentValue.currentItem = value;
              console.log("@@@@@@@@@@@@@@@@2@@@@@@@@@@@@@@@@@@");
              console.log(currentValue.currentItem.Id);
              // alert(index)

              currentValue.commonUpdateArrivedAtPackHouseStatus(index, value);
              // alert("completed"+index);
            });
            this.selectedStatus = "";
            this.groupPickUps = null;
            this.initialContainer = true;
            this.grpPickup = false;

            // let typeOfPenalty = (function() {
            //   if (currentValue.delayedBy > 7 && currentValue.delayedBy <= 10) {
            //     return "AH_LSP_ACCEPT_DELAY";
            //   } else if (currentValue.delayedBy > 10) {
            //     return "AH_LSP_DENIAL";
            //   }
            // })();
            // if (
            //   typeof currentValue.transportCostArrivedAtPackhouse != "undefined" &&
            //   currentValue.transportCostArrivedAtPackhouse
            // ) {
            // var inpData = {
            //   status: "Arrived At Packhouse",
            //   arrivedAtPackhouseAddedOn: moment(String(new Date())).format(
            //     "YYYY/MM/DD HH:mm:ss"
            //   ),
            //   arrivedAtPackhouseAdditionalNote:
            //     currentValue.arrivedAtAdditionalNotes || "",
            //   transportCostArrivedAtPackhouse:
            //     currentValue.transportCostArrivedAtPackhouse
            // };

            //   var dbRef = firebase.database().ref("serviceRequest/");
            //   dbRef
            //     .orderByChild("serviceRequestId")
            //     .equalTo(currentValue.currentItem.Id)
            //     .on("child_added", function(data) {
            //       var ref = firebase.database().ref("serviceRequest/" + data.key);
            //       ref
            //         .update(inpData)
            //         .then(function() {
            //           currentValue.seen = false;
            //           // arrived at packhouse sms
            //           sendSMS("contact", "Fruits have arrived at packhouse")
            //             .then(sent => console.log(sent))
            //             .catch(err => console.log(err));
            //           Vue.$toast.open({
            //             message: "Status updated successfully",
            //             type: "success",
            //             position: "top"
            //           });
            //           currentValue.dropdownContainer = false;
            //           currentValue.arrivedAtPackHouse = false;
            //           currentValue.initialContainer = true;
            //           currentValue.selectedItem = null;
            //           currentValue.statusText = "";
            //           let _data = {};
            //           if (currentValue.delayedBy <= 7) {
            //             _data = {
            //               product: currentValue.apiData.productId,
            //               producer: currentValue.apiData.producer,
            //               coords: currentValue.apiData.logitudeLatitude,
            //               scheduled: moment(
            //                 String(currentValue.apiData.dateOfPickup)
            //               ).format("YYYY-MM-DD"),
            //               amount: currentValue.apiData.estimatedFruit
            //             };
            //           } else {
            //             _data = {
            //               penalties: [
            //                 {
            //                   type: typeOfPenalty,
            //                   delivery_time: currentValue.delayedBy,
            //                   fruits_amount: currentValue.apiData.estimatedFruit
            //                   // boxes_amount: null,
            //                   // temperature_breach_count: null
            //                 }
            //               ],
            //               product: currentValue.apiData.productId,
            //               producer: currentValue.apiData.producer,
            //               coords: currentValue.apiData.logitudeLatitude,
            //               scheduled: moment(
            //                 String(currentValue.apiData.dateOfPickup)
            //               ).format("YYYY-MM-DD"),
            //               amount: currentValue.apiData.estimatedFruit
            //             };
            //           }
            //           currentValue.axios
            //             .post(
            //               "https://agriledger-test.herokuapp.com/api/v1/chain/after-harvest/accept",
            //               {
            //                 rfsId: currentValue.apiData.serviceRequestId,
            //                 lotId: currentValue.apiData.serviceRequestId,
            //                 data: _data
            //               }
            //             )
            //             .then(function(response) {
            //               console.log("planned pick accept success");
            //             })
            //             .catch(function(error) {
            //               console.log("planned pick accept error");
            //               currentValue.seen = false;
            //               currentValue.erroMessage = error.message;
            //             });
            //         })
            //         .catch(function(error) {
            //           currentValue.erroMessage = error.message;
            //           currentValue.seen = false;
            //         });
            //     });
            //   // //this.pickupcount = this.selectedpackageItem.length;
          } else {
            Vue.$toast.open({
              message: "Please fill all the fields.",
              type: "error",
              position: "top"
            });
            this.seen = false;
          }
        }
      } else {
        this.serviceRequestIds.push(this.currentItem.Id);
        this.commonUpdateArrivedAtPackHouseStatus(-1, currentValue.currentItem);
      } // end of else part
    },
    commonUpdateArrivedAtPackHouseStatus(itemCount, currentItemVal) {
      this.seen = true;
      let currentValue = this;
      //currentValue.getDataForBLockChainAPI();
      if (currentValue.dateTimeVal != null && currentValue.dateTimeVal != "") {
        var inpData = {
          status: "Arrived At Packhouse",
          arrivedAtPackhouseAddedOn: moment.utc().toString(),
          arrivedAtPackhouseAdditionalNote:
            currentValue.arrivedAtAdditionalNotes || "",
          transportCostArrivedAtPackhouse:
            currentValue.transportCostArrivedAtPackhouse,
          timeofAdmittence: currentValue.dateTimeVal,
          updatedBy: localStorage.userName
        };

        var dbRef = firebase.database().ref("serviceRequest/");
        dbRef
          .orderByChild("serviceRequestId")
          .equalTo(currentItemVal.Id)
          .on("child_added", function(data) {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            ref
              .update(inpData)
              .then(function() {
                //  currentValue.seen = false;
                // arrived at packhouse sms
                currentValue.createSeriesAPICalls(currentItemVal.Id, "N");

                sendSMS(
                  currentValue.currentItem.phoneNumber,
                  //  "Les fruits sont arrivés à la station de conditionnement"
                  "Fri yo rive nan stasyon pou kondisyònman"
                )
                  .then(sent => console.log(sent))
                  .catch(err => console.log(err));

                if (
                  itemCount == -1 ||
                  currentValue.packageArray.length == itemCount + 1
                ) {
                  Vue.$toast.open({
                    message: "Status updated successfully.",
                    type: "success",
                    position: "top"
                  });
                  currentValue.dropdownContainer = false;
                  currentValue.arrivedAtPackHouse = false;
                  currentValue.initialContainer = true;
                  currentValue.selectedItem = null;
                  currentValue.statusText = "";
                  currentValue.packageArray = [];
                  //  currentValue.serviceRequestIds.forEach((value, index) => {

                  //});
                }

                // Vue.$toast.open({
                //   message: "Status updated successfully",
                //   type: "success",
                //   position: "top"
                // });
              })
              .catch(function(error) {
                currentValue.erroMessage = error.message;
                currentValue.seen = false;
                Vue.$toast.open({
                  message: "Error updating data to firebase.",
                  position: "top",
                  type: "error"
                });
              });
          });
        if (!currentValue.netwrokStatus && currentValue.netwrokStatus != null) {
          currentValue.seen = false;
          localStorage.IsArrivedData = true;

          localStorage.offLineServiceRequestId = currentValue.currentItem.Id;
          Vue.$toast.open({
            message: "Data will save once you back to online.",
            type: "success",
            position: "top"
          });
          var listCount = 0;
          currentValue.pickupsList.forEach(item => {
            if (item.Id == currentValue.currentItem.Id) {
              item.status = "Arrived At Packhouse";
              item.CurrentStatus = "Arrived At Packhouse";
            }
            if (listCount == currentValue.pickupsList.length - 1) {
              localStorage.setItem(
                "pickupsList",
                JSON.stringify(currentValue.pickupsList)
              );
            }
            listCount++;
          });
          currentValue.enrouteContainer = false;
          currentValue.dropdownContainer = false;
          currentValue.arrivedAtPackHouse = false;
          currentValue.initialContainer = true;
          currentValue.selectedItem = null;
          currentValue.statusText = "";
          currentValue.currentItem.CurrentStatus = "Arrived At Packhouse";
          currentValue.currentItem.status = "Arrived At Packhouse";
        }
      } else {
        currentValue.seen = false;
        Vue.$toast.open({
          message: "Please fill the mandatory fields",
          type: "error",
          position: "top"
        });
      }
    },
    updateEnroutePackhouseStatus: function() {
      if (this.grpPickup) {
        if (this.selectedPackageItem.length == 0) {
          Vue.$toast.open({
            message: `Please select pickups.`,
            type: "error",
            position: "top"
          });
        } else if (
          this.selectedDropOffLocation == null ||
          this.selectedDropOffLocation == undefined ||
          this.selectedDropOffLocation == ""
        ) {
          Vue.$toast.open({
            message: `Please select drop-off location`,
            type: "error",
            position: "top"
          });
        } else {
          this.seen = true;
          let currentValue = this;
          this.packageArray.forEach((value, index) => {
            currentValue.currentItem = value;
            console.log(currentValue.currentItem);
            // currentValue.commonEnroutePackhouseStatus(this.currentItem.Id);
            currentValue.commonEnroutePackhouseStatus(index);
          });
          this.selectedStatus = "";
          this.groupPickUps = null;
          this.initialContainer = true;
          this.grpPickup = false;
        }
        // if (this.packageArray.length == 0) {
        //   Vue.$toast.open({
        //     message: `Please select the packages.`,
        //     type: "error",
        //     position: "top"
        //   });
        // } else {
        //   alert("Function Begins!");
        // }
      } else {
        this.commonEnroutePackhouseStatus(-1);
        //working
        // var today = new Date();
        // var date =
        //   today.getFullYear() +
        //   "-" +
        //   (today.getMonth() + 1) +
        //   "-" +
        //   today.getDate();
        // var time =
        //   today.getHours() +
        //   ":" +
        //   today.getMinutes() +
        //   ":" +
        //   today.getSeconds();
      }
    },
    commonEnroutePackhouseStatus(itemCount) {
      let currentValue = this;
      var dateTime = moment(String(new Date())).format("yyyyMMdd hh:mm:ss");

      var inpData = {
        status: "Enroute Packhouse",
        enroutePackhouseAddedOn: moment.utc().toString(),
        enroutePackhouseAdditionalNote: currentValue.enrouteAdditionalNotes,
        dropOffAtPackhouse: currentValue.selectedDropOffLocation,
        updatedBy: localStorage.userName
      };

      var dbRef = firebase.database().ref("serviceRequest/");
      dbRef
        .orderByChild("serviceRequestId")
        .equalTo(currentValue.currentItem.Id)
        .on("child_added", function(data) {
          var ref = firebase.database().ref("serviceRequest/" + data.key);
          ref
            .update(inpData)
            .then(function() {
              currentValue.seen = false;
              if (
                itemCount == -1 ||
                currentValue.packageArray.length == itemCount + 1
              ) {
                Vue.$toast.open({
                  message: "Status updated successfully.",
                  type: "success",
                  position: "top"
                });

                currentValue.packageArray = [];
              }
              currentValue.dropdownContainer = false;
              currentValue.enrouteContainerPackHouse = false;
              currentValue.initialContainer = true;
              currentValue.selectedItem = null;
              currentValue.statusText = "";
              currentValue.enrouteAdditionalNotes = "";
              localStorage.IsEnrouteData = false;
              localStorage.setItem("EnrouteData", null);
              localStorage.offLineServiceRequestId = null;
            })
            .catch(function(error) {
              currentValue.erroMessage = error.message;
              currentValue.seen = false;
              Vue.$toast.open({
                message: "Error updating data to firebase.",
                type: "error",
                position: "top"
              });
            });
        });
      if (!currentValue.netwrokStatus && currentValue.netwrokStatus != null) {
        currentValue.seen = false;
        localStorage.IsEnrouteData = true;
        localStorage.setItem("EnrouteData", JSON.stringify(inpData));
        localStorage.offLineServiceRequestId = currentValue.currentItem.Id;
        Vue.$toast.open({
          message: "Data will save once you back to online.",
          type: "success",
          position: "top"
        });
        var listCount = 0;
        currentValue.pickupsList.forEach(item => {
          if (item.Id == currentValue.currentItem.Id) {
            item.status = "Enroute Packhouse";
            item.CurrentStatus = "Enroute Packhouse";
          }
          if (listCount == currentValue.pickupsList.length - 1) {
            localStorage.setItem(
              "pickupsList",
              JSON.stringify(currentValue.pickupsList)
            );
          }
          listCount++;
        });
        currentValue.currentItem.CurrentStatus = "Enroute Packhouse";
        currentValue.currentItem.status = "Enroute Packhouse";
        currentValue.dropdownContainer = false;
        currentValue.enrouteContainerPackHouse = false;
        currentValue.initialContainer = true;
        currentValue.selectedItem = null;
        currentValue.statusText = "";

        localStorage.setItem("EnrouteData", null);
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
    showDashboard: function() {
      Router.push("lsp-dashboard");
    },
    clearAllFields: function() {},
    undo() {
      this.$refs.signaturePad.undoSignature();
      //this.$refs.signaturePad.hideSignatureModal();
    },
    save() {
      if (localStorage.offLineDataPresent == true) {
        Vue.$toast.open({
          message: "Data sync in progress....,please wait",
          type: "success",
          position: "top"
        });
        this.seen = true;
      }
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      this.withProducerDigitalSignature = data;
      var inpData = {
        withProducerDigitalSignature: data,
        agreementDocumentUrl: null,
        updatedBy: localStorage.userName
      };
      let currentValue = this;
      currentValue.seen = true;
      currentValue.getAgreementData(currentValue).then(function(resolve) {
        console.log(resolve);
        currentValue
          .generateAgreementFile(
            currentValue,
            inpData.withProducerDigitalSignature
          )
          .then(function(fileBlob) {
            console.log(fileBlob);
            currentValue
              .uploadAgreemntDoc(currentValue, fileBlob)
              .then(function(url) {
                console.log("uploaded");
                console.log(url);
                inpData.agreementDocumentUrl = url;
                currentValue.withProducerErrorMessage = "";
                var dbRef = firebase.database().ref("serviceRequest/");
                dbRef
                  .orderByChild("serviceRequestId")
                  .equalTo(currentValue.currentItem.Id)
                  .on("child_added", function(data) {
                    var ref = firebase
                      .database()
                      .ref("serviceRequest/" + data.key);
                    ref
                      .update(inpData)
                      .then(function() {
                        currentValue.seen = false;
                        Vue.$toast.open({
                          message: "Status updated successfully.",
                          type: "success",
                          position: "top"
                        });
                        currentValue.offLineDataPresent = false;
                        localStorage.offLineWithProducer = false;
                        currentValue.offLineDataPresent = false;
                        currentValue.seen = false;
                        currentValue.dropdownContainer = false;
                        currentValue.producerContainer = false;
                        currentValue.initialContainer = true;
                        currentValue.selectedItem = null;
                        currentValue.statusText = "";

                        currentValue.temperature = "";
                        currentValue.ambientTemp = "";
                        currentValue.crates = "";
                        currentValue.cratesPartVal = "0";
                        currentValue.fruitHarvested = "";
                        currentValue.fruitRejected = "";
                        currentValue.advanceGiven = "0";
                        currentValue.startQRCode = "";
                        currentValue.endQRCode = "";
                        currentValue.currency = "HTG";

                        currentValue.paymentMethod = "";
                        currentValue.selectedBank = "";
                        currentValue.accountNumber = "";
                        currentValue.selectedPaymentCurrency = "HTG";
                        currentValue.withProducerNote = "";

                        currentValue.$refs["digital-signature-modal"].hide();
                        currentValue.seen = false;
                      })
                      .catch(function(error) {
                        currentValue.seen = false;
                        currentValue.erroMessage = error.message;
                        Vue.$toast.open({
                          message: "Error updating data to firebase.",
                          position: "top",
                          type: "error"
                        });
                        currentValue.$refs["digital-signature-modal"].hide();
                      });
                  });
              });
          });
      });

      if (!currentValue.netwrokStatus && currentValue.netwrokStatus != null) {
        localStorage.setItem("degitalSigntaureData", JSON.stringify(inpData));
        currentValue.seen = false;
        Vue.$toast.open({
          message: "Data will save once your back to online.",
          type: "success",
          position: "top"
        });
        currentValue.currentItem.CurrentStatus = "With Producer";
        currentValue.currentItem.status = "With Producer";
        currentValue.dropdownContainer = false;
        currentValue.producerContainer = false;
        currentValue.initialContainer = true;
        currentValue.selectedItem = null;
        currentValue.statusText = "";

        currentValue.temperature = "";
        currentValue.ambientTemp = "";
        currentValue.crates = "";
        currentValue.cratesPartVal = "0";
        currentValue.fruitHarvested = "";
        currentValue.fruitRejected = "";
        currentValue.advanceGiven = "0";
        currentValue.startQRCode = "";
        currentValue.endQRCode = "";
        currentValue.currency = "HTG";

        currentValue.paymentMethod = "";
        currentValue.selectedBank = "";
        currentValue.accountNumber = "";
        currentValue.selectedPaymentCurrency = "HTG";
        currentValue.withProducerNote = "";

        currentValue.$refs["digital-signature-modal"].hide();
      }
    },
    showSignatureModal: function() {
      this.$refs["digital-signature-modal"].show();
    },
    hideSignatureModal: function() {
      this.$refs["digital-signature-modal"].hide();
    },
    hideQrcodeModal: function() {
      this.qrcodeResult = null;
      this.$refs["qrcode-modal"].hide();
    },
    hideQrcodeViewModal() {
      this.$refs["qrcode-view-modal"].hide();
    },
    showQrcodeViewModal() {
      this.seen = true;
      this.qrcodesToUpload = [];

      let splittingFactor = 0;
      for (let i = 0; i < this.startQRCode.length; i++) {
        if (this.startQRCode.charAt(i) == this.endQRCode.charAt(i)) {
          splittingFactor++;
        } else {
          break;
        }
      }
      const startQRCodeCode = this.startQRCode.substring(0, splittingFactor);
      const startQRCodeStart = Number(
        this.startQRCode.substring(splittingFactor, this.startQRCode.length)
      );

      const endQRCodeCode = this.endQRCode.substring(0, splittingFactor);
      const endQRCodeEnd = Number(
        this.endQRCode.substring(splittingFactor, this.endQRCode.length)
      );

      if (startQRCodeCode == endQRCodeCode && startQRCodeCode != "") {
        if (this.startQRCode.length == this.endQRCode.length) {
          if (endQRCodeEnd >= startQRCodeStart) {
            if (startQRCodeStart == 0) {
              for (let j = startQRCodeStart; j <= endQRCodeEnd; j++) {
                this.qrcodesToUpload.push(`${startQRCodeCode}`);
                if (j == endQRCodeEnd) {
                }
              }
            } else {
              for (let j = startQRCodeStart; j <= endQRCodeEnd; j++) {
                this.qrcodesToUpload.push(`${startQRCodeCode}${j}`);
                if (j == endQRCodeEnd) {
                }
              }
            }
            this.$refs["qrcode-view-modal"].show();
          } else {
            this.seen = false;
            Vue.$toast.open({
              message: "End QR Code can not be lesser than start QR Code.",
              position: "top",
              type: "error"
            });
          }
        } else {
          this.seen = false;
          Vue.$toast.open({
            message: "Start and end QR Codes length must be same.",
            position: "top",
            type: "error"
          });
        }
      } else {
        this.seen = false;
        Vue.$toast.open({
          message: "Start and end QR Codes are not matching.",
          position: "top",
          type: "error"
        });
      }
    },
    getPackHouse: function(event) {
      var currentVal = this;
      currentVal.packHouse = [];
      var ref = firebase
        .database()
        .ref()
        .child("masters")
        .child("packHouse");

      ref.on("value", function(snapshot) {
        snapshot.forEach(requestData => {
          currentVal.packHouse.push(requestData.val().title);
        });
      });
    },
    showQrcodeModal(flag) {
      this.startEndQRCodeFlag = flag;
      this.$refs["qrcode-modal"].show();
    },
    onDecode(result) {
      this.qrcodeResult = result;
      if (this.startEndQRCodeFlag == "startQRCode") {
        this.startQRCode = result;
      } else {
        this.endQRCode = result;
      }
      // this.uploadQrcode(result);
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.qrcodeError = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.qrcodeError = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.qrcodeError =
            "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.qrcodeError = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.qrcodeError = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.qrcodeError =
            "ERROR: Stream API is not supported in this browser";
        }
      }
    },
    async onDetect(promise) {
      try {
        const { content } = await promise;

        this.result = content;
        this.error = null;
      } catch (error) {
        if (error.name === "DropImageFetchError") {
          this.error = "Sorry, you can't load cross-origin images :/";
        } else if (error.name === "DropImageDecodeError") {
          this.error = "Ok, that's not an image. That can't be decoded.";
        } else {
          this.error = "Ups, what kind of error is this?! " + error.message;
        }
      }
    },
    logErrors(promise) {
      promise.catch(console.error);
    },
    uploadQrcode(qrcode) {
      const index = Vue.lodash.indexOf(this.qrcodesToUpload, qrcode);
      if (index == -1 && typeof qrcode == "string") {
        this.qrcodesToUpload.push(qrcode);
        Vue.$toast.open({
          message: `QR ${qrcode} added.`,
          position: "top",
          type: "success"
        });
      } else {
        Vue.$toast.open({
          message: `QR ${qrcode} already scanned.`,
          type: "error",
          position: "top"
        });
      }
    },
    continueWithTemperatureWarning: function() {
      this.$refs["confirm-warning-modal"].hide();

      var inpData = null;
      var cratesPartVal = ".0";
      if (this.CratesPart == "1/4") {
        cratesPartVal = ".25";
      } else if (this.CratesPart == "1/2") {
        cratesPartVal = ".5";
      } else if (this.CratesPart == "3/4") {
        cratesPartVal = ".75";
      }
      if (this.paymentMethod == "Wire") {
        if (this.selectedBank == null || this.selectedBank == "") {
          this.seen = false;
          Vue.$toast.open({
            message: "Please select bank.",
            type: "error",
            position: "top"
          });
        } else if (
          this.accountNumber == null ||
          this.accountNumber == "" ||
          this.accountNumber.length > 10
        ) {
          this.seen = false;
          Vue.$toast.open({
            message: "Please enter valid account number.",
            type: "error",
            position: "top"
          });
        } else {
          inpData = {
            temperature: this.temperature,
            ambientTemp: this.ambientTemp,
            crates: Number(this.crates) + Number(cratesPartVal),
            fruitsHarvested: this.fruitHarvested,
            fruitRejected: this.fruitRejected,
            advanceGiven: this.advanceGiven,
            // ngo:this.selectedNGO,
            conversionRate: this.conversionRate,
            conversionCurrency: "USD",
            selectedNGO: this.selectedNGO,
            currency: this.currency,
            lotQRCodeImages: "",
            paymentMethod: this.paymentMethod,
            SelectedBank: this.selectedBank,
            accounttype: this.accounttype,
            AccountNumber: this.accountNumber,
            BankCurrency:
              this.selectedPaymentCurrency == "HTG"
                ? "GOURDE"
                : this.selectedPaymentCurrency == "USD"
                ? "USD"
                : null,
            AdditionalNotes: this.withProducerNote,
            status: "With Producer",
            withProducerQrCodeFile: this.qrcodesToUpload,
            startCrateQRCode: this.startQRCode,
            endCrateQRCode: this.endQRCode,
            isAgreed: this.isAgreed,
            updatedBy: localStorage.userName
          };
          this.updateWithProducerDetails(inpData);
        }
      } else if (this.paymentMethod == "Mobile") {
        if (
          this.mobilePaymentOperator == null ||
          this.mobilePaymentOperator == ""
        ) {
          this.seen = false;

          Vue.$toast.open({
            message: "Please select mobile payment operator.",
            type: "error",
            position: "top"
          });
        } else if (
          this.mobilePaymentNumber == null ||
          this.mobilePaymentNumber == "" ||
          this.mobilePaymentNumber.length > 45
        ) {
          this.seen = false;

          Vue.$toast.open({
            message: "Please enter valid mobile payment number.",
            type: "error",
            position: "top"
          });
        } else {
          inpData = {
            temperature: this.temperature,
            "ambient Temp": this.ambientTemp,
            crates: Number(this.crates) + Number(cratesPartVal),
            fruitsHarvested: this.fruitHarvested,
            fruitRejected: this.fruitRejected,
            advanceGiven: this.advanceGiven,
            selectedNGO: this.selectedNGO,
            // ngo:this.selectedNGO,
            conversionRate: this.conversionRate,
            conversionCurrency: "USD",
            currency: this.currency,
            lotQRCodeImages: "",
            paymentMethod: this.paymentMethod,
            mobilePaymentOperator: this.mobilePaymentOperator,
            mobilePaymentNumber: this.mobilePaymentNumber,
            additionalNotes: this.withProducerNote,
            status: "With Producer",
            withProducerQrCodeFile: this.qrcodesToUpload,
            startCrateQRCode: this.startQRCode,
            endCrateQRCode: this.endQRCode,
            isAgreed: this.isAgreed,
            updatedBy: localStorage.userName
          };
          this.updateWithProducerDetails(inpData);
        }
      } else if (this.paymentMethod == "Cash") {
        if (
          this.selectedPaymentCurrency == null ||
          this.selectedPaymentCurrency == undefined ||
          this.selectedPaymentCurrency == ""
        ) {
          this.seen = false;
          Vue.$toast.open({
            message: "Please enter cash payment currency",
            type: "error",
            position: "top"
          });
        } else {
          inpData = {
            temperature: this.temperature,
            "ambient Temp": this.ambientTemp,
            crates: Number(this.crates) + Number(cratesPartVal),
            fruitsHarvested: this.fruitHarvested,
            fruitRejected: this.fruitRejected,
            advanceGiven: this.advanceGiven,
            selectedNGO: this.selectedNGO,
            // ngo:this.selectedNGO,
            conversionRate: this.conversionRate,
            conversionCurrency: "USD",
            currency: this.currency,
            lotQRCodeImages: "",
            paymentMethod: this.paymentMethod,
            contactnumber: this.contactNumber,
            additionalNotes: this.withProducerNote,
            status: "With Producer",
            withProducerQrCodeFile: this.qrcodesToUpload,
            startCrateQRCode: this.startQRCode,
            endCrateQRCode: this.endQRCode,
            isAgreed: this.isAgreed,
            cashPaymentCurrency:
              this.selectedPaymentCurrency == "HTG"
                ? "GOURDE"
                : this.selectedPaymentCurrency == "USD"
                ? "USD"
                : null,
            updatedBy: localStorage.userName
          };
          this.updateWithProducerDetails(inpData);
        }
      } else {
        inpData = null;
      }
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else if (localStorage.systemRole == 7) {
        Router.push("op-admin-dashboard");
      } else {
        Router.push("planned-pickups");
      }
    },
    getFIlterData(filterType) {
      this.seen = true;
      let current = this;
      current.pickupsList = [];
      //wortking offline
      if (!this.netwrokStatus) {
        var masterData = [];
        masterData = JSON.parse(localStorage.getItem("pickupsList"));
        if (localStorage.systemRole == 99 || localStorage.systemRole == 9) {
          masterData.forEach(requestData => {
            if (requestData.status == filterType) {
              current.pickupsList.push(requestData);
              current.pickupsList.reverse();
              current.seen = false;
            }
          });
        } else {
          let rawName = this.userName.trim().split("(", 1);
          rawName = rawName[0].trim();

          masterData.forEach(requestData => {
            if (
              requestData.status == filterType &&
              requestData.collector == rawName
            ) {
              current.pickupsList.push(requestData);
              current.pickupsList.reverse();
              current.seen = false;
            }
          });
        }
      } else {
        let rawName = this.userName.trim().split("(", 1);
        rawName = rawName[0].trim();
        var ref = firebase.database().ref("serviceRequest/");
        // var ref = firebase
        //   .database()
        //   .ref()
        //   .child("serviceRequest");

        ref
          .orderByChild("status")
          .equalTo(filterType)
          .on("child_added", function(requestData) {
            var data = "";
            if (localStorage.systemRole == 99 || localStorage.systemRole == 9) {
              data = {
                Id: requestData.val().serviceRequestId,
                PickupRequestedOn: moment
                  .utc(requestData.val().dateOfPickup)
                  .local()
                  .format("MMM DD, YYYY hh:mm A"),
                Produce:
                  requestData.val().product +
                  " (" +
                  requestData.val().estimatedNoFruits +
                  ")",
                Producer: requestData.val().producer,
                Collectat: requestData.val().collectionPoint,
                DropOffAt: requestData.val().dropOffAtPackhouse,
                CurrentStatus: requestData.val().status,
                totalFruits: requestData.val().estimatedNoFruits,
                _delayedBy: requestData.val().scheduledAfter,
                collector: requestData.val().collector
              };
              current.pickupsList.push(data);
              //pickupval.seen = false;
              current.pickupsList.reverse();
              current.seen = false;
            } else {
              if (requestData.val().collector == rawName) {
                data = {
                  Id: requestData.val().serviceRequestId,
                  PickupRequestedOn: moment
                    .utc(requestData.val().dateOfPickup)
                    .local()
                    .format("MMM DD, YYYY hh:mm A"),
                  Produce:
                    requestData.val().product +
                    " (" +
                    requestData.val().estimatedNoFruits +
                    ")",
                  Producer: requestData.val().producer,
                  Collectat: requestData.val().collectionPoint,
                  DropOffAt: requestData.val().dropOffAtPackhouse,
                  CurrentStatus: requestData.val().status,
                  totalFruits: requestData.val().estimatedNoFruits,
                  _delayedBy: requestData.val().scheduledAfter,
                  collector: requestData.val().collector
                };
                current.pickupsList.push(data);
                //pickupval.seen = false;
                current.pickupsList.reverse();
                current.seen = false;
              } // end of if condition
              else {
                current.seen = false;
              }
            } // end of else section
          });
      }
      if (this.grpPickup) {
        if (current.pickupsList.length != 0) {
          this.pickupStatusReadOnly = true;
        }
        // else {
        //   this.selectedStatus = "";
        //   this.producerContainer = false;
        //   this.enrouteContainer = false;
        //   this.enrouteContainerPackHouse = false;
        //   this.arrivedAtPackHouse = false;
        //   this.grpPickup = false;
        // }
        if (filterType == "Assigned") {
          this.selectedStatus = "Enroute Producer";
          this.statusText = " - ENROUTE PRODUCER";
          this.emptyContainer = false;
          this.dropdownContainer = false;
        } else if (filterType == "With Producer") {
          this.selectedStatus = "Enroute Packhouse";
          this.statusText = " - ENROUTE PACKHOUSE";

          this.emptyContainer = false;
          this.dropdownContainer = false;
        } else if (filterType == "Enroute Packhouse") {
          this.selectedStatus = "Arrived At Packhouse";
          this.statusText = " - ARRIVED AT PACKHOUSE";

          this.emptyContainer = false;
          // this.dropdownContainer = true;
          this.dropdownContainer = false;
          // this.onStatusSelect();
        }
      }
      setTimeout(function() {
        if (current.pickupsList.length == 0) {
          current.seen = false;
        }
      }, 4000);
    },
    onGroupSelect() {
      this.selectedpickupItem = false;
      this.initialContainer = false;
      this.dropdownContainer = false;
      this.emptyContainer = false;
      this.selectedPackageItem = [];
      this.selectedItem = null;
      this.grpPickup = true;

      if (this.groupPickUps == "Assigned") {
        this.producerContainer = false;
        this.enrouteContainer = true;
        this.enrouteContainerPackHouse = false;
        this.arrivedAtPackHouse = false;
        this.getFIlterData("Assigned");
      } else if (this.groupPickUps == "With Producer") {
        this.producerContainer = false;
        this.enrouteContainer = false;
        this.enrouteContainerPackHouse = true;
        this.arrivedAtPackHouse = false;
        this.getFIlterData("With Producer");
      } else if (this.groupPickUps == "Enroute Packhouse") {
        this.producerContainer = false;
        this.enrouteContainer = false;
        this.enrouteContainerPackHouse = false;
        this.arrivedAtPackHouse = true;
        this.dropdownContainer = false;
        //this.selectedStatus = "Arrived At Packhouse";
        this.getFIlterData("Enroute Packhouse");
      } else if (this.groupPickUps == "Arrived At Packhouse") {
        this.producerContainer = false;
        this.enrouteContainer = false;
        this.enrouteContainerPackHouse = false;
        this.arrivedAtPackHouse = false;
        this.getFIlterData("Arrived At Packhouse");
      } else {
        this.getPickupList();
        this.grpPickup = false;
        this.producerContainer = false;
        this.enrouteContainer = false;
        this.enrouteContainerPackHouse = false;
        this.arrivedAtPackHouse = false;
        this.statusText = "";
        this.initialContainer = true;
        this.selectedItem = null;
      }
    },
    showSelectedPackage(e) {
      this.additionalNotes = "";
      //console.log(JSON.stringify(this.selectedPackageItem));
      this.packageArray = this.selectedPackageItem;
      //console.log(JSON.stringify(this.packageArray));
      this.onStatusSelect();
      this.dropdownContainer = false;
      this.initialContainer = false;
      this.emptyContainer = false;
      // this.NGOAlreadyExists = false;
      // this.isNGOAccepted = false;
      // var dbRefMaster = firebase.database().ref("masters/producer");
      // dbRefMaster
      //   .orderByChild("uuid_id")
      //   .equalTo(this.selectedPackageItem.farmerId)
      //   .on("child_added", data => {
      //     this.selectedNGO = data.val().selectedNGO;
      //     if (
      //       this.selectedNGO != undefined &&
      //       this.selectedNGO != null &&
      //       this.selectedNGO != ""
      //     ) {
      //       this.NGOAlreadyExists = true;
      //       this.isNGOAccepted = true;
      //     }
      //   });
    },
    QRCodeViewModalOpened() {
      this.seen = false;
    },
    selectedAccountType: function(val) {
      if (val == 0) {
        this.accounttype = "Savings";
      } else if (val == 1) {
        this.accounttype = "Current";
      }
    },
    createEnrouteAPICall(firebaseData, flowType) {
      console.log(firebaseData);

      let currentVal = this;
      currentVal.seen = true;
      if (
        firebaseData.advanceGiven != null &&
        firebaseData.advanceGiven != "0" &&
        firebaseData.advanceGiven != 0
      ) {
        currentVal.getCurrencyRate();
      }
      const data = {
        id: firebaseData.serviceRequestId,
        status: "Enroute Producer",
        plannedPickUpAddedOn: moment
          .utc(String(firebaseData.plannedPickUpAddedOn))
          .format("YYYY-MM-DDTHH:mm:ss"),
        enrouteAdditionalNote: firebaseData.enrouteAdditionalNote
      };
      // var myHeaders = new Headers();
      // myHeaders.append("Content-Type", "application/json");
      // myHeaders.append("Authorization", "Bearer " + localStorage.IDtoken);
      currentVal.axios
        .post(
          `${
            getConfigVars().BASE_URL
          }50009/api/v1.0/collector-en-route-to-producer`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken
            }
          }
        )
        .then(function(response) {
          if (flowType == "N") {
            currentVal.createWithProducerAPICall(firebaseData);
          } else {
            currentVal.createRejectAPI(firebaseData);
          }
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
              .then(idtoken => {
                localStorage.IDtoken = "";
                localStorage.IDtoken = idtoken;
                currentVal.createEnrouteAPICall(firebaseData, flowType);
              });
          } else {
            currentVal.seen = false;
          }
        });
    },
    createWithProducerAPICall(inpData) {
      let currentVal = this;
      currentVal.seen = true;
      // var myHeaders = new Headers();
      // myHeaders.append("Content-Type", "application/json");
      // myHeaders.append("Authorization", "Bearer " + localStorage.IDtoken);
      console.log("****");
      console.log(inpData);
      if (inpData.paymentMethod == "Wire") {
        const wireData = {
          id: inpData.serviceRequestId,
          status: inpData.status,
          temperature: inpData.temperature,
          ambientTemp: inpData.ambientTemp,
          crates: inpData.crates,
          fruitsHarvested: inpData.fruitsHarvested,
          fruitRejected: inpData.fruitRejected,
          advanceGiven: inpData.advanceGiven,
          ngo: inpData.selectedNGO,
          //selectedNGO: this.selectedNGO,
          conversionRate: this.conversionRate,
          conversionCurrency: "USD",
          currency: inpData.currency,
          startingQRCode: inpData.withProducerQrCodeFile[0], //not passed from UI
          endingQRCode:
            inpData.withProducerQrCodeFile[
              inpData.withProducerQrCodeFile.length - 1
            ], // not passed from UI
          paymentMethod: inpData.paymentMethod,
          wirePayment: {
            SelectedBank: inpData.SelectedBank,
            selectedBankCode: inpData.selectedBankCode,
            AccountNumber: inpData.AccountNumber,
            BankCurrency: inpData.BankCurrency
          },
          AdditionalNotes: inpData.additionalNotes,
          withProducerTimeStamp: moment()
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss")
            .toString(),
          withProducerQrCodeFile: inpData.withProducerQrCodeFile
        };
        currentVal.axios
          .post(
            `${getConfigVars().BASE_URL}50009/api/v1.0/with-producer`,
            wireData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken
              }
            }
          )
          .then(function(response) {
            currentVal.createEnroutePackhouseAPICall(inpData);
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
                .then(idtoken => {
                  localStorage.IDtoken = "";
                  localStorage.IDtoken = idtoken;
                  currentVal.createWithProducerAPICall(inpData);
                });
            } else {
              currentVal.seen = false;
            }
          });
      } else if (inpData.paymentMethod == "Cash") {
        const cashdata = {
          id: inpData.serviceRequestId,
          status: inpData.status,
          temperature: inpData.temperature,
          ambientTemp: inpData["ambient Temp"],
          crates: inpData.crates,
          fruitsHarvested: inpData.fruitsHarvested,
          fruitRejected: inpData.fruitRejected,
          advanceGiven: inpData.advanceGiven,
          ngo: inpData.selectedNGO,
          //selectedNGO: this.selectedNGO,
          conversionRate: this.conversionRate,
          conversionCurrency: "USD",
          currency: inpData.currency,
          startingQRCode: inpData.withProducerQrCodeFile[0], //not passed from UI
          endingQRCode:
            inpData.withProducerQrCodeFile[
              inpData.withProducerQrCodeFile.length - 1
            ], // not passed from UI
          paymentMethod: inpData.paymentMethod,
          cashPayment: {
            cashPaymentCurrency: inpData.cashPaymentCurrency,
            farmerVoucher: inpData.farmerVoucher,
            contactnumber: inpData.contactnumber
          },
          AdditionalNotes: inpData.additionalNotes,
          withProducerTimeStamp: moment()
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss")
            .toString(),
          withProducerQrCodeFile: inpData.withProducerQrCodeFile
        };
        currentVal.axios
          .post(
            `${getConfigVars().BASE_URL}50009/api/v1.0/with-producer`,
            cashdata,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken
              }
            }
          )
          .then(function(response) {
            currentVal.createEnroutePackhouseAPICall(inpData);
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
                .then(idtoken => {
                  localStorage.IDtoken = "";
                  localStorage.IDtoken = idtoken;
                  currentVal.createWithProducerAPICall(inpData);
                });
            } else {
              currentVal.seen = false;
            }
          });
      } else if (inpData.paymentMethod == "Mobile") {
        const mobiledata = {
          id: inpData.serviceRequestId,
          status: inpData.status,
          temperature: inpData.temperature,
          ambientTemp: inpData["ambient Temp"],
          crates: inpData.crates,
          fruitsHarvested: inpData.fruitsHarvested,
          fruitRejected: inpData.fruitRejected,
          advanceGiven: inpData.advanceGiven,
          ngo: inpData.selectedNGO,
          // selectedNGO: this.selectedNGO,
          conversionRate: this.conversionRate,
          conversionCurrency: "USD",
          currency: inpData.currency,
          startingQRCode: inpData.withProducerQrCodeFile[0], //not passed from UI
          endingQRCode:
            inpData.withProducerQrCodeFile[
              inpData.withProducerQrCodeFile.length - 1
            ], // not passed from UI
          paymentMethod: inpData.paymentMethod,
          mobilePayment: {
            mobilePaymentOperator: inpData.mobilePaymentOperator,
            mobilePaymentNumber: inpData.mobilePaymentNumber,
            mobilePaymentCurrency: inpData.mobilePaymentCurrency
          },
          AdditionalNotes: inpData.additionalNotes,
          withProducerTimeStamp: moment()
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss")
            .toString(),
          withProducerQrCodeFile: inpData.withProducerQrCodeFile
        };
        currentVal.axios
          .post(
            `${getConfigVars().BASE_URL}50009/api/v1.0/with-producer`,
            mobiledata,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken
              }
            }
          )
          .then(function(response) {
            currentVal.createEnroutePackhouseAPICall(inpData);
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
                .then(idtoken => {
                  localStorage.IDtoken = "";
                  localStorage.IDtoken = idtoken;
                  currentVal.createWithProducerAPICall(inpData);
                });
            } else {
              currentVal.seen = false;
            }
          });
      }
    },
    createEnroutePackhouseAPICall(inpData) {
      let currentVal = this;
      currentVal.seen = true;
      // var myHeaders = new Headers();
      // myHeaders.append("Content-Type", "application/json");
      // myHeaders.append("Authorization", "Bearer " + localStorage.IDtoken);
      const data = {
        id: inpData.serviceRequestId,
        status: "Enroute Packhouse",
        enroutePackhouseAddedOn: moment
          .utc(String(inpData.enroutePackhouseAddedOn))
          .format("YYYY-MM-DDTHH:mm:ss"),
        enroutePackhouseAdditionalNote: inpData.enroutePackhouseAdditionalNote,
        dropOffAtPackhouse: inpData.dropOffAtPackhouse
      };
      currentVal.axios
        .post(
          `${
            getConfigVars().BASE_URL
          }50009/api/v1.0/collector-enroute-packhouse`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken
            }
          }
        )
        .then(function(response) {
          currentVal.createArrivedAtPackhouseAPICall(inpData);
          //alert("pass");
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
              .then(idtoken => {
                localStorage.IDtoken = "";
                localStorage.IDtoken = idtoken;
                currentVal.createEnroutePackhouseAPICall(inpData);
              });
          } else {
            currentVal.seen = false;
          }
        });
    },
    createSeriesAPICalls(serviceId, flowType) {
      console.log(serviceId);
      let currentVal = this;

      firebase
        .database()
        .ref()
        .child("serviceRequest")
        .orderByChild("serviceRequestId")
        .equalTo(serviceId)
        .on("child_added", function(data) {
          var firebaseData = null;
          firebaseData = data.val();

          console.log(firebaseData);

          if (flowType == "N") {
            currentVal.createEnrouteAPICall(firebaseData, flowType);
          } else {
            currentVal.createEnrouteAPICall(firebaseData, flowType);
          }
        });
    },
    createArrivedAtPackhouseAPICall(inpData) {
      let currentVal = this;
      // var myHeaders = new Headers();
      // myHeaders.append("Content-Type", "application/json");
      // myHeaders.append("Authorization", "Bearer " + localStorage.IDtoken);

      const data = {
        id: inpData.serviceRequestId,
        status: "Arrived At Packhouse",
        arrivedAtPackhouseAddedOn: moment
          .utc(String(inpData.arrivedAtPackhouseAddedOn))
          .format("YYYY-MM-DDTHH:mm:ss"),
        arrivedAtPackhouseAdditionalNote:
          inpData.arrivedAtPackhouseAdditionalNote,
        transportCostArrivedAtPackhouse:
          inpData.transportCostArrivedAtPackhouse,
        timeOfAdmittance: moment
          .utc(String(inpData.timeofAdmittence))
          .format("YYYY-MM-DDTHH:mm:ss")
      };
      currentVal.axios
        .post(
          `${
            getConfigVars().BASE_URL
          }50009/api/v1.0/collector-arrived-at-packhouse`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken
            }
          }
        )
        .then(function(response) {
          //alert("pass");
          currentVal.isProducerDataPresent = false;
          currentVal.seen = false;
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
              .then(idtoken => {
                localStorage.IDtoken = "";
                localStorage.IDtoken = idtoken;
                currentVal.createArrivedAtPackhouseAPICall(inpData);
              });
          } else {
            currentVal.seen = false;
          }
        });
    },

    createRejectAPI(inpData) {
      // console.log(serviceId);
      // console.log(inpData);
      let currentVal = this;
      // var myHeaders = new Headers();
      // myHeaders.append("Content-Type", "application/json");
      // myHeaders.append("Authorization", "Bearer " + localStorage.IDtoken);
      const data = {
        id: inpData.serviceRequestId,
        status: inpData.status,
        rejectedOn: moment
          .utc(String(inpData.rejectedOn))
          .format("YYYY-MM-DDTHH:mm:ss"),
        rejectReason: inpData.rejectReason,
        rejectAddionalNote: inpData.rejectAddionalNote
      };
      currentVal.axios
        .post(`${getConfigVars().BASE_URL}50009/api/v1.0/reject-lot`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.IDtoken
          }
        })
        .then(function(response) {
          //alert("pass");
          currentVal.checkPenalityAPI(inpData.serviceRequestId);
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
              .then(idtoken => {
                localStorage.IDtoken = "";
                localStorage.IDtoken = idtoken;
                currentVal.createRejectAPI(inpData);
              });
          }
        });
    },
    checkPenalityAPI(serviceId) {
      console.log(serviceId);
      let currentVal = this;
      const data = {
        id: serviceId
      };
      currentVal.axios
        .post(`${getConfigVars().BASE_URL}50005/api/v1.0/penalties`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.IDtoken
          }
        })
        .then(function(response) {
          //alert("pass");
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
              .then(idtoken => {
                localStorage.IDtoken = "";
                localStorage.IDtoken = idtoken;
                currentVal.checkPenalityAPI(serviceId);
              });
          }
        });
    },
    isAgreedChange() {},
    isNGOAcceptChange() {
      if (!this.NGOAlreadyExists) this.selectedNGO = null;
    },
    showAgreement() {
      const vm = this;
      firebase
        .database()
        .ref("serviceRequest/")
        .orderByChild("serviceRequestId")
        .equalTo(vm.currentItem.Id)
        .on("child_added", function(data) {
          console.log(data.val());
          const {
            collectionPoint,
            dateOfPickup,
            producer,
            farmerId,
            town
          } = data.val();
          vm.agreementData = {
            collectionPoint,
            dateOfPickup,
            producer,
            farmerId,
            town
          };
          //  vm.$refs["agreement-modal"].show()
        });
    },
    getAgreementData(currentValue) {
      return new Promise(
        function(resolve, reject) {
          const vm = currentValue;
          firebase
            .database()
            .ref("serviceRequest/")
            .orderByChild("serviceRequestId")
            .equalTo(vm.currentItem.Id)
            .on("child_added", function(data) {
              console.log(data.val());
              const {
                collectionPoint,
                dateOfPickup,
                producer,
                farmerId,
                town
              } = data.val();
              vm.agreementData = {
                collectionPoint,
                dateOfPickup,
                producer,
                farmerId,
                town
              };
              resolve("resolved");
            });
        },
        function(err) {
          console.log(err);
        }
      );
    },
    generateAgreementFile(currentval, signatureBlob) {
      return new Promise(function(resolve, reject) {
        var doc = new jsPDF("p", "pt", "letter");
        var elementHandler = {
          "#ignorePDF": function(element, renderer) {
            return true;
          }
        };
        var margins = {
          top: 80,
          bottom: 60,
          left: 80,
          width: 600
        };
        var vm = currentval;
        var source = document.getElementById("agreementterms");
        doc.fromHTML(source, margins.left, margins.top, {
          width: margins.width,
          height: source.offsetHeight,
          elementHandlers: elementHandler
        });
        doc.setFont("helvetica");
        doc.setFontSize(5);
        //   const storageRef = firebase.storage().ref("uploaded-files/testingpdfupload");
        //   console.log(doc);
        //   const storageTask = storageRef.put(doc)
        //   storageTask.on("state_changed",
        //   snapshot => console.log(snapshot),
        //   error => console.log(error)
        //   )
        doc.addImage(signatureBlob, "JPEG", 40, 400, 60, 60);
        // doc.output("dataurlnewwindow")
        const blobData = doc.output("blob");
        resolve(blobData);
        // console.log(blobData)
        // doc.save("some_file_name.pdf");
        // console.log(doc);
      });
    },
    uploadAgreemntDoc(currentVal, blobFile) {
      return new Promise(function(resolve, reject) {
        var storageRef = firebase
          .storage()
          .ref(`uploaded-files/agreements/${currentVal.currentItem.Id}.pdf`);
        const uploadTask = storageRef.put(blobFile);
        uploadTask.on(
          "state_changed",
          snapshot => console.log(snapshot),
          error => reject(error),
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(url => {
              resolve(url);
            });
          }
        );
      });
    },
    showPDF() {
      var doc = new jsPDF("p", "pt", "letter");
      var elementHandler = {
        "#ignorePDF": function(element, renderer) {
          return true;
        }
      };
      var margins = {
        top: 80,
        bottom: 60,
        left: 80,
        width: 600
      };

      var source = document.getElementById("agreementterms");
      doc.fromHTML(source, margins.left, margins.top, {
        width: margins.width,
        height: source.offsetHeight,
        elementHandlers: elementHandler
      });
      doc.setFont("helvetica");
      doc.setFontSize(5);
      //   const storageRef = firebase.storage().ref("uploaded-files/testingpdfupload");
      //   console.log(doc);
      //   const storageTask = storageRef.put(doc)
      //   storageTask.on("state_changed",
      //   snapshot => console.log(snapshot),
      //   error => console.log(error)
      //   )
      var imageData =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAwBAMAAACh2TSJAAAALVBMVEUAAADtNTX////3n5/+9fX719f7zMz5tLTzfHzuQED//f31jY3ybGzxXV3wVFRaxp+rAAAAAXRSTlMAQObYZgAAALVJREFUOMut0rENAjEQRNHdC4kY0QBaAQUQX0QAFSAKIKQEKiAA6VqgIkriApuV1x7pQPz0aWwHljLMpZ0CRDBGoXmeghGYKFJsUo90giAImCgV5OJF+oOgKE48MlGgs2VLBIunWesw0a1ZHqF82c7GmmIfUSpgotOly29DFPFJFDEhkgIT/V5mZuvj6XofKrHU6vyI4u37IYi36aN4h5tL7PJyif1dvCgEpapzISbCTEj5R78BZq5A5Ldh2XYAAAAASUVORK5CYII";
      doc.addImage(imageData, "JPEG", 0, 140, 10, 10);
      doc.output("dataurlnewwindow");
      // const blobData = doc.output("blob");
      // doc.save("some_file_name.pdf");
      console.log(doc);
    },

    saveFileToBlob(blobFile) {
      console.log(blobFile);
      const storageRef = firebase
        .storage()
        .ref(`uploaded-files/agreements/${this.currentItem.Id}.pdf`);
      const uploadTask = storageRef.put(blobFile);
      uploadTask.on(
        "state_changed",
        snapshot => console.log(snapshot),
        error => console.log(error),
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(url => {
            alert(url);
          });
        }
      );
    }
  }
};
</script>
<style>
#offline-modal .modal.show .modal-dialog {
  display: table-cell !important;
}
#offline-modal .modal-content {
  min-width: 400px !important;
  max-width: 400px !important;
  margin: 0px auto !important;
  width: auto !important;
}
#agreement-modal .modal.show .modal-dialog {
  display: table-cell !important;
}
#agreement-modal .modal-content {
  min-width: 800px !important;
  max-width: 800px !important;
  margin: 0px auto !important;
  width: auto !important;
  min-height: 600px !important;
  max-height: 600px !important;
  overflow-y: scroll;
  color: #fff;
  font-size: 12px;
}
#agreementterms {
  max-height: 300px;
  overflow-y: scroll;
  color: #fff;
}
.offline-container {
  width: 100%;
}
.offline-label {
  color: #fff;
  background: red;
  padding: 10px;
}
#pl #planned-pickup-reject-modal .modal-header {
  height: 50px !important;
}
#planned-pickup-reject-modal .modal-header .close {
  margin-top: -22px !important;
}
#planned-pickup-reject-modal .modal-header h5 {
  margin: -10px auto !important;
}

#qrcode-modal .modal-header {
  height: 50px !important;
}
#qrcode-modal .modal-header .close {
  margin-top: -22px !important;
}
#qrcode-modal .modal-header h5 {
  /* margin: -10px auto !important; */
  margin: -7px 10px !important;
}

#qrcode-view-modal .modal-header {
  height: 50px !important;
}
#qrcode-view-modal .modal-header .close {
  margin-top: -22px !important;
}
#qrcode-view-modal .modal-header h5 {
  margin: -4px 107px !important;
}
#confirm-warning-modal .modal-header {
  height: 50px !important;
}
#confirm-warning-modal .modal-header .close {
  margin-top: -22px !important;
}
#confirm-warning-modal .modal-header h5 {
  margin: -10px auto !important;
}
</style>

<style scoped>
.payment-method-container {
  color: #fff;
  text-align: left;
}
.payment-method-container label {
  margin-top: 15px !important;
}
.card-body-planned-pickup-status .bank-account-no {
  color: #fff !important;
}
.digital-signature-container {
  overflow-y: hidden !important;
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
.prefixCurrency {
  color: #fff;
  float: left !important;
}
.prefixCurrency input {
  float: none;
}
.pref {
  margin-top: 8px;
  font-size: 15px;
  padding-right: 1px;
  font-weight: bolder;
}
.advance {
  margin-left: 10px !important;
}
.button-container {
  margin: 10px -4px 10px 10px !important;
}
.btn-save,
.btn-cancel,
.btn-reject {
  height: 30px !important;
}
.header-container {
  height: 50px !important;
}
.lbl-offline {
  color: #fff;
}
</style>
