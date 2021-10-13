<template>
  <div class="lsp-dashboard">
    <Offline @detected-condition="handleConnectivityChange"></Offline>
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div style="clear: both"></div>
      <div class="dashboard-container">
        <button class="back-to-dashboard-btn" @click="goToCollectorDashboard">
          &lt; {{ $t("Dashboard", "Dashboard") }}
        </button>
      </div>
      <div class="col-md-5 details-container planned-pickups-container-wrap">
        <div class="header-container">
          <h6 class="heading planHeading">
            {{ $t("Planned Pickups", "Planned Pickups") }}
          </h6>
        </div>
        <div class="main-container">
          <perfect-scrollbar>
            <div class="card-body">
              <div v-if="pickupsList.length == 0">
                <h2 class="card-inside-description">
                  {{ $t("No Data", "No Data") }}
                </h2>
              </div>
              <div v-if="pickupsList.length > 0">
                <div
                  class="outer-container"
                  v-for="item in pickupsList"
                  :key="item.Id"
                >
                  <div class="photo-container">
                    <img
                      v-if="item.Produce.split(' ')[0] == 'Mango'"
                      src="../../assets/images/mango.png"
                      :alt="$t('Product Picture', 'Product Picture')"
                      class="former-picture produce-picture-mango"
                    />
                    <img
                      v-if="item.Produce.split(' ')[0] == 'Pineapple'"
                      src="../../assets/images/pineapple.png"
                      :alt="$t('Product Picture', 'Product Picture')"
                      class="former-picture"
                    />
                    <img
                      v-if="item.Produce.split(' ')[0] == 'Avocado'"
                      src="../../assets/images/avocado.png"
                      :alt="$t('Product Picture', 'Product Picture')"
                      class="former-picture"
                    />
                  </div>
                  <div class="description-container">
                    <label class="lbl-flname lbl-pickup">
                      <b>{{
                        $t("PickUp Requested On", "PickUp Requested On")
                      }}</b>
                      : {{ $t(item.PickupRequestedOn, item.PickupRequestedOn) }}
                      <input
                        v-on:click="showSelected(item)"
                        v-model="selectedItem"
                        type="radio"
                        name="foo"
                        :value="item.Id"
                      />
                      <img />
                    </label>
                    <!-- <label class="lbl-flname lbl-pickup">
                      <b>Service Request Created By</b>
                      : {{ item.createdBy || "" }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Pickup Scheduled By</b>
                      : {{ item.scheduledBy || "" }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Pickup Scheduled On</b>
                      : {{ item.scheduledOn || "" }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Enroute to Producer Added By</b>
                      : {{ item.enrouteToProducerAddedBy || "" }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Enroute to Producer Added On</b>
                      : {{ item.enrouteToProducerAddedOn || "" }}
                    </label>-->
                    <label class="lbl-flname lbl-pickup">
                      <b>{{ $t("Produce", "Produce") }}</b>
                      : {{ $t(item.Produce, item.Produce) }} ({{
                        item.estimatedNoFruits
                      }})
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>{{ $t("Producer", "Producer") }}</b>
                      : {{ $t(item.Producer, item.Producer) }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>{{ $t("Collect at", "Collect at") }}</b>
                      : {{ $t(item.Collectat, item.Collectat) }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>{{ $t("Drop Off At", "Drop Off At") }}</b>
                      : {{ $t(item.DropOffAt, item.DropOffAt) }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>{{ $t("Current Status", "Current Status") }}</b>
                      : {{ $t(item.CurrentStatus, item.CurrentStatus) }}
                    </label>
                    <label v-if="isSuperAdmin" class="lbl-flname lbl-pickup">
                      <b>{{ $t("Organization", "Organization") }}</b>
                      : {{ $t(item.organization, item.organization) }}
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
          <h6 class="heading">
            {{ $t("Status - With Producer", "Status - With Producer") }}
          </h6>
        </div>

        <div class="main-container">
          <perfect-scrollbar>
            <div class="card-body card-body-planned-pickup-status">
              <div v-if="emptyContainer" class="empty-container">
                <h2 class="card-inside-description">
                  {{
                    $t(
                      "Please Select a Pickup from the list to update Status",
                      "Please Select a Pickup from the list to update Status"
                    )
                  }}
                </h2>
              </div>
              <div v-if="producerContainer" class="withproducer-container">
                <div class="clear-both"></div>
                <div class="add-degree">
                  <input
                    type="number"
                    class="small-input with-celsius"
                    v-model="temperature"
                    :placeholder="$t('Temperatue', 'Temperatue') + ' *'"
                  />
                </div>
                <div class="add-degree">
                  <input
                    type="number"
                    class="small-input with-celsius"
                    v-model="ambientTemp"
                    :placeholder="$t('Ambient Temp', 'Ambient Temp') + ' *'"
                  />
                </div>
                <div class="clear-both"></div>
                <input
                  type="number"
                  class="small-input"
                  v-model="crates"
                  :placeholder="$t('Crates (Full)', 'Crates (Full)') + ' *'"
                />

                <div class="crates-part">
                  <v-select
                    v-model="cratesPart"
                    :placeholder="
                      $t('Select Crates Part', 'Select Crates Part')
                    "
                    class="planned-pickup-v-select"
                    :options="cratePartList"
                  ></v-select>
                </div>
                <div class="clear-both"></div>
                <input
                  type="number"
                  class="small-input"
                  v-model="fruitHarvested"
                  @change="calculateAdvance()"
                  :placeholder="$t('Fruit Harvested', 'Fruit Harvested') + ' *'"
                />
                <input
                  type="number"
                  class="small-input"
                  v-model="fruitRejected"
                  @change="calculateAdvance()"
                  :placeholder="$t('Fruit Rejected', 'Fruit Rejected') + ' *'"
                />

                <div class="clear-both"></div>

                <v-select
                  v-if="fruitRejected > 0"
                  v-model="fruitRejectReason"
                  :placeholder="
                    $t('Reason for Rejection', 'Reason for Rejection')
                  "
                  class="planned-pickup-v-select"
                  :options="fruitsRejectReason"
                ></v-select>
                <div class="clear-both"></div>

                <div
                  v-if="fruitRejected > 0"
                  class="inp-container attach-container-rejectedfruits"
                >
                  <b-form-file
                    multiple
                    v-model="rejectedFruitsImages"
                    :placeholder="
                      $t('No Images Selected', 'No Images Selected')
                    "
                    :drop-placeholder="
                      $t('Drop file here...', 'Drop file here...')
                    "
                    accept="image/*"
                  ></b-form-file>
                  <div class="attach-border"></div>
                </div>
                <label class="with-producer-labels">{{
                  $t("Advance Given to Producer", "Advance Given to Producer")
                }}</label>

                <div class="clear-both"></div>
                <!-- <div class="agreed-wrap">
                  <div class="agreed-label-wrap">
                    <label class="lbl-pickup lbl-agreed">
                      <input
                        type="checkbox"
                        :checked="isAgreed"
                        name="foo"
                        :value="isAgreed"
                        v-model="isAgreed"
                      />
                      <img />
                    </label>
                  </div>
                  <div
                    class="agreed-label-span"
                  >Please tick the box to confirm that terms and agreement of producer with each of the service provider for services being delivered have been discussed</div>
                </div>-->

                <div class="currency-container">
                  <v-select
                    readonly="true"
                    v-model="currency"
                    :placeholder="
                      $t('Select Currency', 'Select Currency') + ' *'
                    "
                    class="planned-pickup-v-select currency-planned-pickup"
                    :options="advanceGivenCurrencySource"
                  ></v-select>
                </div>
                <span class="prefixCurrency advance">
                  <span class="pref" v-if="this.currency == 'USD'">$</span>
                  <span class="pref" v-if="this.currency == 'HTG'">G</span>
                  <input
                    type="number"
                    @change="validateAdvanceAmount()"
                    class="small-input"
                    v-model="advanceGiven"
                    :placeholder="$t('Advance Given', 'Advance Given') + ' *'"
                  />
                </span>
                <div class="clear-both"></div>
                <!-- <label class="with-producer-labels">{{
                  $t("Advance Given to LSP", "Advance Given to LSP")
                }}</label> -->
                <!-- <div class="clear-both"></div>
                <div class="currency-container">
                  <v-select
                    readonly="true"
                    v-model="lspAdvanceGivenCurrency"
                    :placeholder="
                      $t('Select Currency', 'Select Currency') + ' *'
                    "
                    class="planned-pickup-v-select currency-planned-pickup"
                    :options="currencySource"
                  ></v-select>
                </div> -->
                <!-- <span class="prefixCurrency advance">
                  <span
                    class="pref"
                    v-if="this.lspAdvanceGivenCurrency == 'USD'"
                    >$</span
                  >
                  <span
                    class="pref"
                    v-if="this.lspAdvanceGivenCurrency == 'HTG'"
                    >G</span
                  >
                  <input
                    type="number"
                    class="small-input"
                    v-model="lspAdvanceGiven"
                    :placeholder="$t('Advance Given', 'Advance Given') + ' *'"
                  />
                </span> -->
                <div class="clear-both"></div>
                <div class="attach-container-qrcode">
                  <div class="qrcode-text-button-wrap">
                    <div class="qrcode-btn-wrap">
                      <button
                        class="btn-save attach-qrcode-save mt-3"
                        @click="showQrcodeModal('startQRCode')"
                      >
                        {{ $t("Attach Start QR Code", "Attach Start QR Code") }}
                      </button>
                    </div>
                    <div class="qrcode-text-input-wrap">
                      <input
                        type="text"
                        class="small-input"
                        v-model="startQRCode"
                        :placeholder="
                          $t('Start QR Code', 'Start QR Code') + ' * (A0001)'
                        "
                      />
                    </div>
                  </div>
                  <div class="qrcode-text-button-wrap">
                    <div class="qrcode-btn-wrap">
                      <button
                        class="btn-save attach-qrcode-save mt-3"
                        @click="showQrcodeModal('endQRCode')"
                      >
                        {{ $t("Attach End QR Code", "Attach End QR Code") }}
                      </button>
                    </div>
                    <div class="qrcode-text-input-wrap">
                      <input
                        type="text"
                        class="small-input"
                        v-model="endQRCode"
                        :placeholder="
                          $t('End QR Code', 'End QR Code') + ' *(A0002)'
                        "
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
                  >
                    {{ $t("View attached QR Codes", "View attached QR Codes") }}
                  </button>
                </div>
                <div class="clear-both"></div>
                <div class="payament-method-container">
                  <label>{{ $t("Payment Method", "Payment Method") }}</label>
                  <div class="radioGroup">
                    <input
                      name="paymentmethod"
                      v-on:change="selectedPaymentMethod(0)"
                      type="radio"
                    />{{ $t("Wire", "Wire") }}
                    <input
                      name="paymentmethod"
                      v-on:change="selectedPaymentMethod(1)"
                      type="radio"
                    />{{ $t("Mobile", "Mobile") }}
                    <input
                      name="paymentmethod"
                      v-on:change="selectedPaymentMethod(2)"
                      type="radio"
                    />{{ $t("Cash", "Cash") }}
                  </div>
                  <label v-if="paymentMethod == 'Cash'">{{
                    $t("Advance Cash Payment", "Advance Cash Payment")
                  }}</label>
                  <div class="radioGroup" v-if="paymentMethod == 'Cash'">
                    <input
                      type="radio"
                      name="cashPaymentMethod"
                      @change="selectCashPaymentMode(1)"
                    />
                    {{ $t("From LSP", "From LSP") }}
                    <input
                      type="radio"
                      name="cashPaymentMethod"
                      @change="selectCashPaymentMode(2)"
                    />
                    {{ $t("From Bank", "From Bank") }}
                  </div>
                </div>
                <div v-if="wireTransfer" class="wire-transfer-container">
                  <v-select
                    v-model="selectedBank"
                    :placeholder="$t('Select Bank', 'Select Bank') + ' *'"
                    class="
                      planned-pickup-v-select
                      bank-planned-pickup bank-name-input
                    "
                    :options="banks"
                  ></v-select>
                  <br />
                  <div class="payment-method-container">
                    <label>{{
                      $t("Type of Account", "Type of Account")
                    }}</label>
                    <div class="radioGroup">
                      <input
                        name="accounttype"
                        v-on:change="selectedAccountType(0)"
                        type="radio"
                        :checked="accounttype == 'Savings'"
                      />{{ $t("Savings", "Savings") }}
                      <input
                        name="accounttype"
                        v-on:change="selectedAccountType(1)"
                        type="radio"
                        :checked="accounttype == 'Current'"
                      />{{ $t("Current", "Current") }}
                    </div>
                  </div>
                  <input
                    type="number"
                    v-model="accountNumber"
                    class="bank-account-no bank-accnt-no-input"
                    :placeholder="$t('Account Number', 'Account Number') + ' *'"
                  />
                  <div class="account-currency-conatiner">
                    <v-select
                      v-model="selectedPaymentCurrency"
                      :placeholder="
                        $t('Select Currency', 'Select Currency') + ' *'
                      "
                      class="
                        planned-pickup-v-select
                        bank-planned-pickup bank-acc-currency-input
                      "
                      :options="currencySource"
                    ></v-select>
                  </div>
                </div>
                <div v-if="mobileTransfer" class="mobile-transfer-container">
                  <v-select
                    v-model="mobilePaymentOperator"
                    :placeholder="
                      $t('Mobile Payment Operator', 'Mobile Payment Operator') +
                      ' *'
                    "
                    class="
                      planned-pickup-v-select
                      bank-planned-pickup
                      mobile-payment-operator-input
                    "
                    :options="mobilePaymentOperatorOptions"
                  ></v-select>
                  <div class="account-currency-conatiner">
                    <v-select
                      v-model="selectedPaymentCurrency"
                      :placeholder="
                        $t('Select Currency', 'Select Currency') + ' *'
                      "
                      class="
                        planned-pickup-v-select
                        bank-planned-pickup
                        mobile-currency-input
                      "
                      :options="currencySource"
                    ></v-select>
                  </div>
                  <input
                    type="number"
                    v-model="mobilePaymentNumber"
                    class="bank-account-no mobile-payment-no-input"
                    :placeholder="
                      $t('Mobile Payment Number', 'Mobile Payment Number') +
                      ' *'
                    "
                  />
                </div>
                <div v-if="cashTranser">
                  <label class="lbl-ph">Phone Number</label>

                  <input
                    type="number"
                    readonly
                    v-model="contactNumber"
                    class="cash-contact-no-input"
                    :placeholder="$t('Contact Number', 'Contact Number')"
                  />
                  <div class="account-currency-conatiner">
                    <v-select
                      v-model="selectedPaymentCurrency"
                      :placeholder="
                        $t('Select Currency', 'Select Currency') + ' *'
                      "
                      class="
                        planned-pickup-v-select
                        bank-planned-pickup
                        cash-currency-input
                      "
                      :options="currencySource"
                    ></v-select>
                  </div>
                </div>

                <div></div>
                <!-- <div class="agreed-wrap mb-0">
                  <div class="agreed-label-wrap">
                    <label class="lbl-pickup lbl-agreed">
                      <input
                        type="checkbox"
                        :checked="isNGOAccepted"
                        name="foo"
                        :value="isNGOAccepted"
                        v-model="isNGOAccepted"
                      />
                      <img />
                    </label>
                  </div>
                  <div class="agreed-label-span">
                    {{
                      $t("Is ready to pay to NGO?", "Is ready to pay to NGO?")
                    }}
                  </div>
                </div> -->
                <v-select
                  v-if="isNGOAccepted"
                  :disabled="NGOAlreadyExists"
                  v-model="selectedNGO"
                  :placeholder="$t('Select NGO', 'Select NGO')"
                  class="
                    planned-pickup-v-select
                    bank-planned-pickup bank-name-input
                  "
                  :options="ngos"
                ></v-select>
                <br />
                <input
                  type="text"
                  class="addition-note"
                  v-model="withProducerNote"
                  :placeholder="$t('Additional Notes', 'Additional Notes')"
                />
                <div class="clear-both"></div>
                <label class="errormessage-withproducer">
                  {{ $t(withProducerErrorMessage, withProducerErrorMessage) }}
                </label>
                <div class="clear-both"></div>
              </div>
            </div>

            <b-modal
              hide-footer
              id="planned-pickup-reject-modal"
              ref="reject-modal"
              hide-backdrop
              :title="$t('Rejection Criteria', 'Rejection Criteria')"
            >
              <div class="reject-reason-container">
                <v-select
                  v-model="rejectReason"
                  :placeholder="
                    $t('Reason for Rejection', 'Reason for Rejection')
                  "
                  class="planned-pickup-v-select"
                  :options="rejectReasons"
                ></v-select>
              </div>

              <input
                type="text"
                class="modal-input reason-note"
                v-model="rejectAddionalNote"
                :placeholder="$t('Additional Notes', 'Additional Notes')"
              />
              <div style="clear: both"></div>
              <div class="reject-file-container">
                <div class="attach-border-planned-reject"></div>
                <b-form-file
                  multiple
                  v-model="rejectedSelectedFiles"
                  id="file-upload-new"
                  ref="rejectedFile"
                  :placeholder="$t('No Attachments yet', 'No Attachments yet')"
                  :drop-placeholder="
                    $t('Drop file here...', 'Drop file here...')
                  "
                >
                  <template slot="file-name" slot-scope="{ names }">
                    <b-badge variant="dark">{{ names[0] }}</b-badge>
                    <b-badge v-if="names.length > 1" variant="dark" class="ml-1"
                      >+ {{ names.length - 1 }}
                      {{ $t("More files", "More files") }}</b-badge
                    >
                  </template>
                </b-form-file>
              </div>
              <label class="lbl-errormessage">{{
                $t(rejectErrorMessage, rejectErrorMessage)
              }}</label>
              <div class="button-container reject-btn-container">
                <input
                  type="button"
                  v-on:click="hideModal"
                  class="btn-cancel"
                  :value="$t('Cancel', 'Cancel')"
                />
                <input
                  type="button"
                  v-on:click="updateRejectStatus"
                  class="btn-save"
                  :value="$t('Save Rejection', 'Save Rejection')"
                />
              </div>
            </b-modal>
          </perfect-scrollbar>
        </div>

        <b-modal
          ref="success-modal"
          hide-footer
          hide-header
          :title="$t('Status', 'Status')"
          id="modalnew"
          hide-backdrop
        >
          <label class="lbl-modal-success">{{
            $t(succesContent, succesContent)
          }}</label>
        </b-modal>
        <div class="planned-pickup-mandatory-warning" v-if="producerContainer">
          <span>* {{ $t("Mandatory Fields", "Mandatory Fields") }}</span>
        </div>
        <div v-if="producerContainer" class="button-container">
          <input
            type="button"
            v-on:click="cancelSelectedItem"
            class="btn-cancel"
            :value="$t('Cancel', 'Cancel')"
          />
          <input
            type="button"
            v-on:click="rejectCollection"
            class="btn-reject"
            :value="$t('Reject', 'Reject')"
          />
          <input
            type="button"
            v-on:click="UpdateWithProducerStatus"
            class="btn-save"
            :value="$t('Save', 'Save')"
          />
        </div>
      </div>
      <div v-if="!networkStatus" class="offline-container">
        <label class="offline-label"
          >{{
            $t("Application is offline now", "Application is offline now")
          }}.</label
        >
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
      :title="$t('Digital Signature', 'Digital Signature')"
      data-backdrop="static"
    >
      <div class="col-md-11 digital-signature-container">
        <div v-if="agreementData">
          <div>
            <div>
              <div id="agreementterms">
                <table
                  style="width: 90%"
                  border="0"
                  class="pdf-table-style agreementterms"
                >
                  <tr>
                    <td></td>
                  </tr>
                  <tr>
                    <td style="text-align: center; font-weight: bolder">
                      MINISTERE DU COMMERCE ET DE L’INDUSTRIE
                    </td>
                  </tr>
                  <tr>
                    <td style="text-align: center; font-weight: bolder">
                      Projet de Développement des Affaires et des
                      Investissements
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                  </tr>
                  <tr>
                    <td
                      style="
                        text-align: center;
                        padding-bottom: 10px;
                        padding-top: 15px;
                        font-weight: bolder;
                      "
                    >
                      REZIME KONTRA
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Nan kontra sa mwen dakò vann
                      {{ agreementData.produce }} mwen yo pou jwenn yon seri
                      sèvis epi rive peye pou yo
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                  </tr>
                  <tr>
                    <td
                      style="
                        padding-bottom: 10px;
                        padding-top: 10px;
                        font-weight: bolder;
                      "
                    >
                      A) Sèvis
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      1. mwen dakò Harvest Planner jwe wòl entèmèdye ant mwen
                      menm ak tout lòt founisè sèvis map bezwen itilize pou vann
                      {{ agreementData.produce }} mwen yo nan peyi lòtbò dlo ;
                    </td>
                  </tr>
                  <tr>
                    <td>
                      2. mwen dakò itilize sèvis yon founisè lojistik ki pou
                      resevwa {{ agreementData.produce }} m yo pou trete yo ak
                      voye yo lòtbò dlo ;
                    </td>
                  </tr>
                  <tr>
                    <td>
                      3. mwen dakò founisè lojistik (LSP) voye jete tout
                      {{ agreementData.produce }} ki pap ka vann nan peyi lòtbò
                      dlo ;
                    </td>
                  </tr>
                  <tr>
                    <td>
                      4. mwen dakò itilize sèvis yon koutye pou resevwa
                      {{ agreementData.produce }} yo nan men LSP, al vann yo
                      lòtbò epi vye kòb la bay sogebank pou mwen an Ayiti
                    </td>
                  </tr>
                  <tr>
                    <td>
                      5. mwen dakò Itilize sèvis SOGEBANK&nbsp;pou peye tout
                      moun ki travay pou mwen epi voye rès kòb la pou mwen dapre
                      metòd pèman mwen deside a ;
                    </td>
                  </tr>
                  <tr>
                    <td>
                      6. mwen dakò resevwa yon avans nan men ICG ke map gen pou
                      m remèt lè mwen fin vann {{ agreementData.produce }} m yo.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      7. Mwen dakò dèske founisè sèvis teknik “agriledger” gen
                      otorizasyon (itilize) enfòmasyon ki nan sistèm Kobo Osinon
                      enfòmasyon anregistre (done idantifyab pwodiktè a) e kapab
                      pataje enfòmasyon sa yo ak lòt pati ki afilye pou tout tan
                      li bezwen.
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                  </tr>
                  <tr>
                    <td
                      style="
                        padding-bottom: 10px;
                        padding-top: 10px;
                        font-weight: bolder;
                      "
                    >
                      B) Pèman
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Pou tout sèvis ki idantifye yo mwen dakò :</td>
                  </tr>
                  <tr>
                    <td>
                      1. Bay Harvest Planner 1% nan benefis mwen jwenn nan;
                    </td>
                  </tr>
                  <tr>
                    <td>
                      2. Peye founisè lojistik 1.22 dola ameriken pou chak
                      kilogram {{ agreementData.produce }} li trete epi vann pou
                      mwen lòtbò dlo ;
                    </td>
                  </tr>
                  <tr>
                    <td>
                      3. peye koutye a, komisyon ki te negosye a sou sa ki vann
                      nan
                    </td>
                  </tr>
                  <tr>
                    <td>4. Peye&nbsp;SOGEBANK&nbsp;frè&nbsp;sèvis</td>
                  </tr>
                  <tr>
                    <td style="padding-left: 20px">
                      <br />
                      a. 2.5 % plis taks si mwen chwazi pèman an fèt sou kont
                      SOGEBANK mwen;
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-left: 20px">
                      b. 5% plis taks lè mwen chwazi yon bank ki pa SOGEBANK ;
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-left: 20px">
                      c. 5% plis taks lè m chwazi rezo SOGEXPRESS&nbsp;la;
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-left: 20px">
                      d. 10% plis taks lè m chwazi rezo MonCash.
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Date {{ agreementData.agreementDate }}</td>
                  </tr>
                  <tr>
                    <td></td>
                  </tr>
                  <!-- <tr>
                  <td>Siyati:</td>
                  </tr>-->
                </table>

                <div></div>
              </div>
            </div>
          </div>
          <p id="ignorePDF"></p>
        </div>
        <div class="agreed-wrap">
          <div class="agreed-label-wrap">
            <label class="lbl-pickup lbl-agreed">
              <input
                type="checkbox"
                :checked="isAgreed"
                name="foo"
                :value="isAgreed"
                v-model="isAgreed"
              />
              <img />
            </label>
          </div>
          <div class="agreed-label-span">
            {{
              $t(
                "Please tick the box to confirm that terms and agreement of producer with each of the service provider for services being delivered have been discussed",
                "Please tick the box to confirm that terms and agreement of producer with each of the service provider for services being delivered have been discussed"
              )
            }}
            <br />
            <b>Siyati:</b>
          </div>
        </div>
        <div style="border: 2px solid #fff; margin-bottom: 10px">
          <VueSignaturePad
            width="100%"
            height="60px"
            ref="signaturePad"
            saveType="image/png"
          />
        </div>
      </div>
      <div class="col-md-12 offset-3">
        <div>
          <button class="digital-signature-btn" @click="save">
            {{ $t("Save", "Save") }}
          </button>
          <button class="digital-signature-btn" @click="undo">
            {{ $t("Undo", "Undo") }}
          </button>
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
      :title="
        $t('Hold Camera/Scanner Steady', 'Hold Camera/Scanner Steady') + '.'
      "
      data-backdrop="static"
    >
      <perfect-scrollbar class="qrcode-scroll">
        <div class="digital-signature-container">
          {{ $t(qrcodeError, qrcodeError) }}
          <qrcode-stream @decode="onDecode" @init="onInit">
            <span class="qrcode-name"
              >{{ $t("QR Code", "QR Code") + ":" }}
              {{ $t(qrcodeResult, qrcodeResult) }}</span
            >
          </qrcode-stream>
        </div>
        <button class="digital-signature-btn" @click="hideQrcodeModal">
          {{ $t("Done", "Done") }}
        </button>
      </perfect-scrollbar>
    </b-modal>
    <b-modal
      hide-footer
      id="offline-modal"
      class="dqrcode-modal"
      ref="offline-modal"
      hide-backdrop
      no-close-on-backdrop
      :title="$t('Status', 'Status')"
      data-backdrop="static"
    >
      <label class="lbl-offline">
        {{
          $t(
            `There seems to no Internet connectivity. Your data will be automatically
        synchronized the moment connectivity is established. You can continue to
        work with the application in the meanwhile`,
            `There seems to no Internet connectivity. Your data will be automatically
        synchronized the moment connectivity is established. You can continue to
        work with the application in the meanwhile`
          )
        }}.
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
      :title="$t('Attached QR Codes', 'Attached QR Codes')"
      data-backdrop="static"
      @shown="QRCodeViewModalOpened()"
    >
      <div class="digital-signature-container">
        <perfect-scrollbar class="qrcode-view-modal-scroll">
          <div
            v-for="(qrcode, index) in qrcodesToUpload"
            :key="index"
            id="qr-code-coantainer"
          >
            <span class="qrcode-label">{{ $t(qrcode, qrcode) }}</span>
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
      :title="$t('Confirm', 'Confirm')"
    >
      <label>
        {{
          $t(
            `Temperature entered is outside the defined critical limits. Are you
        sure you want to proceed`,
            `Temperature entered is outside the defined critical limits. Are you
        sure you want to proceed`
          )
        }}?
      </label>
      <div class="button-container">
        <input
          type="button"
          v-on:click="hideConfirmWarningModal"
          class="btn-cancel"
          :value="$t('Cancel', 'Cancel')"
        />
        <input
          type="button"
          v-on:click="continueWithTemperatureWarning"
          class="btn-save"
          :value="$t('Proceed', 'Proceed')"
        />
      </div>
    </b-modal>
    <b-modal
      hide-footer
      id="agreement-modal"
      ref="agreement-modal"
      hide-backdrop
      :title="$t('Agreement', 'Agreement')"
    ></b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../../router";
import firebase from "firebase";
import moment from "moment";
import tz from "moment-timezone";
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
import jsPDF from "jspdf";
import vSelect from "vue-select";
Vue.use(VueLodash, { name: "lodash" });
Vue.component("v-select", vSelect);
import { uuid } from "vue-uuid";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from "../../shared/auth";
// import func from '../../../vue-temp/vue-editor-bridge';

export default {
  name: "with-producer",
  data: function () {
    return {
      userName: null,
      seen: true,
      pickupsList: [],
      emptyContainer: true,
      withproducerContainer: false,
      currentItem: null,
      producerContainer: false,
      selectedStatus: "",
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
      autoCalculatedProducerAdvance: "0",
      selectedBank: "",
      bank: [],
      accountNumber: "",
      currencySource: ["USD", "HTG"],
      advanceGivenCurrencySource: ["HTG"],
      selectedPaymentCurrency: "HTG",
      withProducerNote: "",
      rejectReasons: [
        this.$t("Quantity", "Quantity"),
        this.$t("Quality", "Quality"),
        this.$t("Maturity", "Maturity"),
        this.$t("Temperature", "Temperature"),
        this.$t("R4NOSHOW", "R4NOSHOW"),
        this.$t("R4OTHER", "R4OTHER"),
      ],
      fruitsRejectReason: [
        this.$t("Quality", "Quality"),
        this.$t("Maturity", "Maturity"),
        this.$t("Temperature", "Temperature"),
        this.$t("R4NOSHOW", "R4NOSHOW"),
        this.$t("R4OTHER", "R4OTHER"),
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
      rejectAddionalNote: "",
      selectedFiles: "",
      rejectedSelectedFiles: null,
      succesContent: "",
      withProducerErrorMessage: "",
      dateTimeVal: "",
      bckCurrency: "HTG",
      todayDate: moment.utc().local().format("MMM DD, YYYY hh:mm A"),
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
      selectedpickupItem: false,
      pickupStatusReadOnly: false,
      serviceRequestIds: [],
      pickupcount: 0,
      qrCodesArray: [],
      startQRCode: null,
      endQRCode: null,
      startEndQRCodeFlag: null,
      networkStatus: true,
      accounttype: "",
      selectedNGO: "",
      ngos: [],
      perUnitCosts: [],
      conversionRate: null,
      conversionCurrency: null,
      isAgreed: false,
      isNGOAccepted: false,
      NGOAlreadyExists: false,
      isProducerDataPresent: false,
      agreementTemplate: template,
      agreementData: null,
      fruitRejectReason: null,
      rejectedFruitsImages: [],
      lspAdvanceGivenCurrency: "HTG",
      lspAdvanceGiven: "0",
      isSuperAdmin: false,
      internetAvailable: null,
      PaidByLSP: false,
    };
  },
  components: {
    PerfectScrollbar,
    Header,
    Offline,
    Footer,
  },
  mounted() {
    this.checkInternetStatus().then((internetStatus) => {
      console.log(internetStatus);
      if (localStorage.systemRole == 99) {
        this.isSuperAdmin = true;
      }
      let multipleRoles = localStorage.systemRole.split(",");
      if (multipleRoles.length > 1) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t("Multi-Role-Dashboard", "Multi-Role-Dashboard"),
            href: "/multi-user-dashboard",
          },

          {
            text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
            href: "/collector-dashboard",
          },
          {
            text: this.$t("With Producer", "With Producer"),
            href: "/with-producer",
          },
        ]);
      } else {
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
                text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
                href: "/lsp-dashboard",
              },
              {
                text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
                href: "/collector-dashboard",
              },
              {
                text: this.$t("With Producer", "With Producer"),
                href: "/with-producer",
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
                text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
                href: "/lsp-dashboard",
              },
              {
                text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
                href: "/collector-dashboard",
              },
              {
                text: this.$t("With Producer", "With Producer"),
                href: "/with-producer",
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
              text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
              href: "/collector-dashboard",
            },
            {
              text: this.$t("With Producer", "With Producer"),
              href: "/with-producer",
            },
          ]);
        } else if (localStorage.systemRole == 3) {
          this.$refs.headercomp.createBreadcrumb([
            {
              text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
              href: "/collector-dashboard",
            },
            {
              text: this.$t("With Producer", "With Producer"),
              href: "/with-producer",
            },
          ]);
        } else if (localStorage.systemRole == 7) {
          this.$refs.headercomp.createBreadcrumb([
            {
              text: this.$t("OP-Admin-Dashboard", "OP-Admin-Dashboard"),
              href: "/op-admin-dashboard",
            },
            {
              text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
              href: "/collector-dashboard",
            },
            {
              text: this.$t("With Producer", "With Producer"),
              href: "/with-producer",
            },
          ]);
        } else if (localStorage.systemRole == 96) {
          this.$refs.headercomp.createBreadcrumb([
            {
              text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
              href: "/lsp-dashboard",
            },
            {
              text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
              href: "/collector-dashboard",
            },
            {
              text: this.$t("With Producer", "With Producer"),
              href: "/with-producer",
            },
          ]);
        }
      }

      // if (localStorage.emailId == null || localStorage.emailId == "") {
      //   Router.push("/");
      // }
      this.userName = localStorage.userName;
      this.selectedpickupItem = false;
      var currentval = this;
      //IndexedDb code starts here - for setting networkstatus
      let dbStatus;
      let requestStatus = window.indexedDB.open("pickupsList_db", 1);
      requestStatus.onerror = () => {
        console.log("Database failed to open");
      };
      requestStatus.onsuccess = () => {
        console.log("Database opened successfully");
        dbStatus = requestStatus.result;
        let transactionStatus = dbStatus.transaction(
          ["pickupsList"],
          "readwrite"
        );
        let objectStoreStatus = transactionStatus.objectStore("pickupsList", {
          keyPath: "key",
        });
        var requestWPStatus = objectStoreStatus.get(2);
        requestWPStatus.onsuccess = (event) => {
          var dataStatus = event.target.result;
          let transactionStatus = dbStatus.transaction(
            ["pickupsList"],
            "readwrite"
          );
          let objectStoreStatus = transactionStatus.objectStore("pickupsList", {
            keyPath: "key",
          });
          if (dataStatus != undefined) {
            currentval.handleConnectivityChange(dataStatus.values);
          } else {
            currentval.getPickupList();
          }
          transactionStatus.oncomplete = () => {
            console.log(
              "Transaction completed: database modification finished."
            );
            dbStatus.close();
          };
          transactionStatus.onerror = (error) => {
            console.log("Transaction not opened due to error");
            console.log(error);
          };
          //fetching Pickupslist complete
        };
        requestWPStatus.onerror = (event) => {
          console.log("Failed to get the list from IndexedDB");
        };
      };
      requestStatus.onupgradeneeded = function (e) {
        let dbStatus = e.target.result;
        let objectStoreStatus = dbStatus.createObjectStore("pickupsList", {
          keyPath: "key",
        });
        console.log("Database setup complete");
      };
      //IndexedDb code ends here
      this.getBankList();
      this.getNGOList();
      this.getPerUnitCostList();
      this.getPackHouse();
      this.getCurrencyRate();
    });
  },

  methods: {
    calculateAdvance() {
      console.log(this.perUnitCosts);
      var currentValue = this;
      console.log(currentValue.perUnitCosts);
      if (
        this.fruitHarvested != null &&
        this.fruitHarvested != "" &&
        this.fruitRejected != null &&
        this.fruitRejected != ""
      ) {
        currentValue.perUnitCosts.forEach((item) => {
          if (
            item.productName.trim().toLowerCase() ===
            currentValue.currentItem.Produce.split(" ")[0].trim().toLowerCase()
          ) {
            if (item.advanceMultiplierForLSP == null) {
              item.advanceMultiplierForLSP = 1;
            }
            currentValue.seen = true;
            if (item.perUnitCurrency == "USD") {
              var unitCostinHTG =
                Number(currentValue.conversionRate).toFixed(2) *
                Number(item.perUnitCost);
              currentValue.advanceGiven = (
                Number(unitCostinHTG) *
                (Number(currentValue.fruitHarvested) -
                  Number(currentValue.fruitRejected))
              ).toFixed(2);
              currentValue.autoCalculatedProducerAdvance =
                currentValue.advanceGiven;
              currentValue.lspAdvanceGiven = (
                Number(item.advanceMultiplierForLSP) *
                (Number(unitCostinHTG) *
                  (Number(currentValue.fruitHarvested) -
                    Number(currentValue.fruitRejected)))
              ).toFixed(2);
            } else {
              currentValue.advanceGiven = (
                Number(item.perUnitCost) *
                (Number(currentValue.fruitHarvested) -
                  Number(currentValue.fruitRejected))
              ).toFixed(2);
              currentValue.autoCalculatedProducerAdvance =
                currentValue.advanceGiven;
              currentValue.lspAdvanceGiven = (
                Number(item.advanceMultiplierForLSP) *
                (Number(item.perUnitCost) *
                  (Number(currentValue.fruitHarvested) -
                    Number(currentValue.fruitRejected)))
              ).toFixed(2);
            }

            //currentValue.lspAdvanceGiveninUSD = currentValue.advanceGiven / currentValue.conversionRate;
            currentValue.seen = false;
          }
        });
      }
    },
    getCurrencyRate() {
      let currentValue = this;
      this.axios
        .get(
          `https://openexchangerates.org/api/latest.json?app_id=7e54f418ea954e02be2248a3b6df63aa`
        )
        .then(function (response) {
          console.log(response.data.rates.HTG);

          currentValue.conversionRate = Number(response.data.rates.HTG).toFixed(
            2
          );
          currentValue.conversionCurrency = "USD";
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    handleConnectivityChange(status) {
      var currentVal = this;
      currentVal.checkInternetStatus().then((internetStatus) => {
        console.log(internetStatus);
        if (currentVal.internetAvailable) {
          let db;
          let request = window.indexedDB.open("pickups_db_withproducer", 1);
          request.onsuccess = function () {
            console.log("Database opened successfully");
            db = request.result;
            console.log(db);
            var serviceRequestsArray = [];
            var objectStore = db.transaction("pickups").objectStore("pickups");
            objectStore.getAll().onsuccess = () => {
              serviceRequestsArray = event.target.result;
              if (
                serviceRequestsArray != undefined &&
                serviceRequestsArray.length > 0
              ) {
                currentVal.seen = true;
                Vue.$toast.open({
                  message: "Offline data syncing.....",
                  type: "warning",
                  position: "top",
                });
                serviceRequestsArray.forEach((item, index) => {
                  currentVal
                    .uploadAgreemntDoc(
                      item.serviceRequestId,
                      item.agreementDocumentUrl
                    )
                    .then(function (url) {
                      item.agreementDocUrl = url;
                      delete item.agreementDocumentUrl;
                      item.agreementDocumentUrl = url;
                      var dbRef = firebase.database().ref("serviceRequest/");
                      dbRef
                        .orderByChild("serviceRequestId")
                        .equalTo(item.serviceRequestId)
                        .on("child_added", function (data) {
                          var phoneNumber = data.val().phoneNumber;
                          var ref = firebase
                            .database()
                            .ref("serviceRequest/" + data.key);
                          ref
                            .update(item)
                            .then(function () {
                              if (
                                item.fruitsHarvested != null &&
                                item.fruitsHarvested != undefined
                              ) {
                                var fruitCount =
                                  Number(item.fruitsHarvested) -
                                  Number(item.fruitRejected);
                                var product = data.val().product;
                                sendSMS(
                                  phoneNumber,
                                  "Nimewo pou jwenn sèvis : " +
                                    item.displayId +
                                    ". Kontra ki siyen " +
                                    fruitCount +
                                    " " +
                                    product.trim() +
                                    " nan pòst kolekt"
                                );
                              }
                              if (item.status == "Rejected") {
                                sendSMS(
                                  phoneNumber,
                                  "Nimewo pou jwenn sèvis : " +
                                    item.displayId +
                                    ". Yon lo fri rejete poutèt Kalite maksimal"
                                );
                                currentVal.createRejectAPI(item);
                              } else if (item.status == "With Producer") {
                                if (currentVal.PaidByLSP) {
                                  item["PaidByLSP"] = true;
                                }
                                currentVal.createWithProducerAPICall(item);
                              }
                              console.log("success " + item.serviceRequestId);
                              //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                              var checkIndex = index + 1;
                              if (serviceRequestsArray.length == checkIndex) {
                                db.close();
                                currentVal.seen = false;
                                var req = indexedDB.deleteDatabase(
                                  "pickups_db_withproducer"
                                );
                                req.onsuccess = function () {
                                  console.log("Deleted database successfully");
                                };
                                req.onerror = function () {
                                  console.log("Couldn't delete database");
                                };
                                req.onblocked = function () {
                                  console.log(
                                    "Couldn't delete database due to the operation being blocked"
                                  );
                                };
                              }
                            })
                            .catch(() => {
                              currentVal.seen = false;
                            });
                        });
                    });
                });
              }
            };
          };
          request.onupgradeneeded = function (e) {
            e.target.transaction.abort();
          };
        } else {
          currentVal.$refs["offline-modal"].show();
          setTimeout(function () {
            currentVal.$refs["offline-modal"].hide();
          }, 4000);
          //Create/Open database
          let db;
          let request = window.indexedDB.open("pickups_db_withproducer", 1);
          request.onerror = function () {
            console.log("Database failed to open");
          };
          request.onsuccess = function () {
            console.log("Database opened successfully");
          };
          request.onupgradeneeded = function (e) {
            let db = e.target.result;
            let objectStore = db.createObjectStore("pickups", {
              keyPath: "serviceRequestId",
            });
            console.log("Database setup complete");
          };
        }
        //IndexedDB Code ends here
        //IndexedD Code start here - for setting the network status in IndexedDB
        let dbStatus;
        let requestStatus = window.indexedDB.open("pickupsList_db", 1);
        requestStatus.onerror = () => {
          console.log("Database failed to open");
        };
        requestStatus.onsuccess = () => {
          console.log("Database opened successfully");
          dbStatus = requestStatus.result;
          let newItemStatus = {
            key: 2,
            values: status,
          };
          let transactionStatus = dbStatus.transaction(
            ["pickupsList"],
            "readwrite"
          );
          let objectStoreStatus = transactionStatus.objectStore("pickupsList", {
            keyPath: "key",
          });
          var requestWPStatus = objectStoreStatus.get(2);
          requestWPStatus.onsuccess = (event) => {
            var dataStatus = event.target.result;
            let transactionStatus = dbStatus.transaction(
              ["pickupsList"],
              "readwrite"
            );
            let objectStoreStatus = transactionStatus.objectStore(
              "pickupsList",
              {
                keyPath: "key",
              }
            );
            let requestObjectStatus;
            if (dataStatus == undefined) {
              requestObjectStatus = objectStoreStatus.add(newItemStatus);
            } else {
              requestObjectStatus = objectStoreStatus.put(newItemStatus);
            }
            requestObjectStatus.onsuccess = () => {
              console.log("added successfully");
            };
            transactionStatus.oncomplete = () => {
              console.log(
                "Transaction completed: database modification finished."
              );
              dbStatus.close();
            };
            transactionStatus.onerror = (error) => {
              console.log("Transaction not opened due to error");
              console.log(error);
            };
          };
          requestWPStatus.onerror = (event) => {
            console.log("Failed to get the list from IndexedDB");
          };
        };
        requestStatus.onupgradeneeded = function (e) {
          let dbStatus = e.target.result;
          let objectStoreStatus = dbStatus.createObjectStore("pickupsList", {
            keyPath: "key",
          });
          console.log("Database setup complete");
        };
        //IndexedDB code ends here
      });
      this.networkStatus = status;
      this.getPickupList();
      //IndexedDB Code starts here
    },
    getQrCodeFiles: function () {
      if (this.$refs.ltrCode.files) {
        if (this.$refs.ltrCode.files.length > 1) {
          this.selectedFiles = this.$refs.ltrCode.files;
        } else {
          this.selectedFiles = this.$refs.ltrCode.files[0];
        }
      }
    },
    getBankList: function () {
      var currentVal = this;
      currentVal.banks = [];
      currentVal.banksWithCode = [];
      var ref = firebase.database().ref().child("masters").child("bank");

      ref.on("value", function (snapshot) {
        snapshot.forEach((requestData) => {
          currentVal.banks.push(requestData.val().institutionName);
          currentVal.banksWithCode.push({
            Name: requestData.val().institutionName,
            Code: requestData.val().bic,
          });
        });
      });
    },
    getBanksFromIndexedDb() {
      var currentVal = this;
      let dbList;
      let requestList = window.indexedDB.open("pickupsList_db_banks", 1);
      requestList.onsuccess = function () {
        console.log("Database opened successfully");
        dbList = requestList.result;
        console.log(dbList);
        var pickupsListArray = [];
        var objectStoreList = dbList
          .transaction("pickupsList")
          .objectStore("pickupsList");
        objectStoreList.getAll().onsuccess = () => {
          pickupsListArray = event.target.result;
          if (pickupsListArray != undefined && pickupsListArray.length > 0)
            pickupsListArray[0].values.forEach((item, index) => {
              currentVal.banks.push(item.institutionName);
              currentVal.banksWithCode.push({
                Name: item.institutionName,
                Code: item.bic,
              });

              var checkIndex = index + 1;
              if (pickupsListArray[0].values.length == checkIndex) {
                currentVal.seen = false;
              }
            });
        };
      };
      requestList.onupgradeneeded = function (e) {
        let dbList = e.target.result;
        let objectStoreList = dbList.createObjectStore("pickupsList", {
          keyPath: "key",
        });
        console.log("Database setup complete");
      };
    },
    getCurrencyExchangeRateFromIndexedDb() {
      var currentVal = this;
      let dbList;
      let requestList = window.indexedDB.open("pickupsList_db_currencyRate", 1);
      requestList.onsuccess = function () {
        console.log("Database opened successfully");
        dbList = requestList.result;
        console.log(dbList);
        var pickupsListArray = [];
        var objectStoreList = dbList
          .transaction("pickupsList")
          .objectStore("pickupsList");
        objectStoreList.getAll().onsuccess = () => {
          pickupsListArray = event.target.result;
          pickupsListArray[0].values.forEach((item, index) => {
            currentVal.conversionRate = Number(item);

            var checkIndex = index + 1;
            if (pickupsListArray[0].values.length == checkIndex) {
              currentVal.seen = false;
            }
          });
        };
      };
      requestList.onupgradeneeded = function (e) {
        let dbList = e.target.result;
        let objectStoreList = dbList.createObjectStore("pickupsList", {
          keyPath: "key",
        });
        console.log("Database setup complete");
      };
    },
    getNGOList: function () {
      var currentVal = this;
      currentVal.ngos = [];
      var ref = firebase.database().ref().child("masters").child("ngos");
      ref.on("child_added", function (snapshot) {
        currentVal.ngos.push(snapshot.val().title);
      });
    },
    getPerUnitCostList: function () {
      var currentVal = this;
      currentVal.ngos = [];
      var ref = firebase.database().ref().child("masters").child("product");
      ref.on("child_added", function (snapshot) {
        currentVal.perUnitCosts.push(snapshot.val());
      });
    },
    getUnitOcstFromIndexedDb() {
      var currentVal = this;
      let dbList;
      let requestList = window.indexedDB.open("pickupsList_db_unitCost", 1);
      requestList.onsuccess = function () {
        console.log("Database opened successfully");
        dbList = requestList.result;
        console.log(dbList);
        var pickupsListArray = [];
        currentVal.perUnitCosts = [];
        var objectStoreList = dbList
          .transaction("pickupsList")
          .objectStore("pickupsList");
        objectStoreList.getAll().onsuccess = () => {
          pickupsListArray = event.target.result;
          currentVal.seen = true;
          if (pickupsListArray != undefined && pickupsListArray.length > 0) {
            pickupsListArray[0].values.forEach((item, index) => {
              let abc = Object.keys(item);
              let key = Object.keys(item)[0];
              console.log(item[key]);
              currentVal.perUnitCosts.push(item[key]);
              var checkIndex = index + 1;
              if (pickupsListArray[0].values.length == checkIndex) {
                currentVal.seen = false;
              }
            });
            console.log("#################");
            console.log(currentVal.perUnitCosts);
          }
        };
      };
      requestList.onupgradeneeded = function (e) {
        let dbList = e.target.result;
        let objectStoreList = dbList.createObjectStore("pickupsList", {
          keyPath: "key",
        });
        console.log("Database setup complete");
      };
    },
    getNgosListFromIndexedDb() {
      var currentVal = this;
      let dbList;
      let requestList = window.indexedDB.open("pickupsList_db_ngo", 1);
      requestList.onsuccess = function () {
        console.log("Database opened successfully");
        dbList = requestList.result;
        console.log(dbList);
        var pickupsListArray = [];
        var objectStoreList = dbList
          .transaction("pickupsList")
          .objectStore("pickupsList");
        objectStoreList.getAll().onsuccess = () => {
          pickupsListArray = event.target.result;
          currentVal.seen = true;
          if (pickupsListArray != undefined && pickupsListArray.length > 0) {
            pickupsListArray[0].values.forEach((item, index) => {
              currentVal.ngos.push(item.title);
              var checkIndex = index + 1;
              if (pickupsListArray[0].values.length == checkIndex) {
                currentVal.seen = false;
              }
            });
          }
        };
      };
      requestList.onupgradeneeded = function (e) {
        let dbList = e.target.result;
        let objectStoreList = dbList.createObjectStore("pickupsList", {
          keyPath: "key",
        });
        console.log("Database setup complete");
      };
    },
    validateAdvanceAmount: function () {
      if (
        Number(this.advanceGiven) > Number(this.autoCalculatedProducerAdvance)
      ) {
        Vue.$toast.open({
          message: this.$t(
            "Producer Advance amount should be less than or equal to auto calculated advance",
            "Producer Advance amount should be less than or equal to auto calculated advance"
          ),
          type: "error",
          position: "top",
        });
        this.advanceGiven = this.autoCalculatedProducerAdvance;
      }
    },
    UpdateWithProducerStatus: function () {
      this.seen = true;
      let currentValue = this;
      currentValue.checkInternetStatus().then((internetStatus) => {
        console.log(internetStatus);
      });
      const fruitsInDozens = Number(currentValue.fruitHarvested / 12);
      const producerAdvanceGiven = (function () {
        if (currentValue.currency == "USD") {
          return currentValue.advanceGiven;
        } else {
          const convertedAmt =
            currentValue.advanceGiven / currentValue.conversionRate;
          return convertedAmt;
        }
      })();

      const lspAdvanceAmount = (function () {
        if (currentValue.lspAdvanceGivenCurrency == "USD") {
          return currentValue.lspAdvanceGiven;
        } else {
          const convertedAmt =
            currentValue.lspAdvanceGiven / currentValue.conversionRate;
          return convertedAmt;
        }
      })();

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
          message: currentValue.$t(
            "Please enter temperature",
            "Please enter temperature"
          ),
          type: "error",
          position: "top",
        });
      } else if (this.ambientTemp == null || this.ambientTemp == "") {
        this.seen = false;

        Vue.$toast.open({
          message: currentValue.$t(
            "Please enter ambient temp",
            "Please enter ambient temp"
          ),
          type: "error",
          position: "top",
        });
      } else if (this.crates == null || this.crates == "") {
        this.seen = false;
        Vue.$toast.open({
          message: currentValue.$t(
            "Please enter crates",
            "Please enter crates"
          ),
          type: "error",
          position: "top",
        });
      } else if (this.fruitHarvested == null || this.fruitHarvested == "") {
        this.seen = false;
        Vue.$toast.open({
          message: currentValue.$t(
            "Please enter fruit harvested",
            "Please enter fruit harvested"
          ),
          type: "error",
          position: "top",
        });
      } else if (this.fruitRejected == null || this.fruitRejected == "") {
        this.seen = false;
        Vue.$toast.open({
          message: currentValue.$t(
            "Please enter fruit rejected",
            "Please enter fruit rejected"
          ),
          type: "error",
          position: "top",
        });
      } else if (
        Number(this.fruitRejected) > 0 &&
        this.fruitRejectReason == null
      ) {
        this.seen = false;

        Vue.$toast.open({
          message: currentValue.$t(
            "Please Select a Reason for Rejected Fruits.",
            "Please Select a Reason for Rejected Fruits."
          ),
          type: "error",
          position: "top",
        });
      } else if (this.rejectedFruitsImages.length > 2) {
        this.seen = false;
        this.rejectedFruitsImages = [];
        Vue.$toast.open({
          message: currentValue.$t(
            "You can select only two images.",
            "You can select only two images."
          ),
          type: "error",
          position: "top",
        });
      } else if (
        !Number.isInteger(Number(this.fruitHarvested)) ||
        !Number.isInteger(Number(this.fruitRejected))
      ) {
        this.seen = false;
        Vue.$toast.open({
          message: currentValue.$t(
            "Please enter a valid fruit count",
            "Please enter a valid fruit count"
          ),
          type: "error",
          position: "top",
        });
      } else if (this.advanceGiven == null || this.advanceGiven == "") {
        this.seen = false;

        Vue.$toast.open({
          message: this.$t(
            "Please enter advance given",
            "Please enter advance given"
          ),
          type: "error",
          position: "top",
        });
      } else if (
        this.lspAdvanceGiven == null ||
        this.lspAdvanceGiven == "" ||
        this.lspAdvanceGiven == undefined
      ) {
        currentValue.seen = false;
        Vue.$toast.open({
          message: currentValue.$t(
            "Please enter LSP advance given",
            "Please enter LSP advance given"
          ),
          type: "error",
          position: "top",
        });
      } else if (
        currentValue.advanceGiven > 0 &&
        producerAdvanceGiven / fruitsInDozens > 1.5
      ) {
        currentValue.seen = false;
        Vue.$toast.open({
          message: currentValue.$t(
            "Advance given exceeds the specified limit of $1.5 per dozen",
            "Advance given exceeds the specified limit of $1.5 per dozen"
          ),
          type: "error",
          position: "top",
        });
      } else if (
        currentValue.lspAdvanceGiven > 0 &&
        lspAdvanceAmount / fruitsInDozens > 3
      ) {
        currentValue.seen = false;
        Vue.$toast.open({
          message: currentValue.$t(
            "Advance given exceeds the specified limit of $3 per dozen",
            "Advance given exceeds the specified limit of $3 per dozen"
          ),
          type: "error",
          position: "top",
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
          message: currentValue.$t(
            "Please scan/enter the QR codes.",
            "Please scan/enter the QR codes."
          ),
          type: "error",
          position: "top",
        });
      } else if (this.currency == null || this.currency == "") {
        this.seen = false;

        Vue.$toast.open({
          message: currentValue.$t(
            "Please select currency",
            "Please select currency"
          ),
          type: "error",
          position: "top",
        });
      } else if (this.paymentMethod == null || this.paymentMethod == "") {
        this.seen = false;
        Vue.$toast.open({
          message: currentValue.$t(
            "Please select payment method",
            "Please select payment method"
          ),
          type: "error",
          position: "top",
        });
      } else if (
        this.isNGOAccepted &&
        (this.selectedNGO == null ||
          this.selectedNGO == undefined ||
          this.selectedNGO == "")
      ) {
        this.seen = false;
        Vue.$toast.open({
          message: currentValue.$t("Please select NGO", "Please select NGO"),
          type: "error",
          position: "top",
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
          let fruitsRejectedImageBlobs = [];
          if (this.rejectedFruitsImages.length) {
            this.rejectedFruitsImages.forEach((image, index) => {
              let imageBlob = new Blob([image], { type: image.type });
              fruitsRejectedImageBlobs.push(imageBlob);
            });
          }

          console.log(fruitsRejectedImageBlobs);
          // upload or save image file
          if (this.paymentMethod == "Wire") {
            if (this.selectedBank == null || this.selectedBank == "") {
              this.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please select bank",
                  "Please select bank"
                ),
                type: "error",
                position: "top",
              });
            } else if (
              this.accountNumber == null ||
              this.accountNumber == "" ||
              this.accountNumber.length > 10
            ) {
              this.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please enter valid account number",
                  "Please enter valid account number"
                ),
                type: "error",
                position: "top",
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

                    // const fileBlob = new Blob()
                    inpData = {
                      temperature: this.temperature,
                      "ambient Temp": this.ambientTemp,
                      crates: Number(this.crates) + Number(cratesPartVal),
                      fruitsHarvested: this.fruitHarvested,
                      fruitRejected: this.fruitRejected,
                      fruitRejectReason: this.fruitRejectReason,
                      fruitsRejectedImageBlob: "",
                      advanceGiven: this.advanceGiven,
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
                      isAgreed: this.isAgreed,
                      fruitsRejectedReason: this.fruitRejectReason,
                      fruitsRejectedImageBlobs,
                      lspAdvanceGivenCurrency: this.lspAdvanceGivenCurrency,
                      lspAdvanceGiven: this.lspAdvanceGiven,
                      PaidByLSP: this.PaidByLSP ? this.PaidByLSP : false,
                    };
                    //IndexedDb Code starts here
                    if (!currentValue.internetAvailable) {
                      var arrayQRC = [];
                      this.qrcodesToUpload.forEach((ele) => {
                        arrayQRC.push(ele.toString());
                      });
                      let db;
                      let request = window.indexedDB.open(
                        "pickups_db_withproducer",
                        1
                      );
                      request.onsuccess = () => {
                        console.log("Database opened successfully");
                        db = request.result;
                        let transaction = db.transaction(
                          ["pickups"],
                          "readwrite"
                        );
                        let objectStore = transaction.objectStore("pickups", {
                          keyPath: "serviceRequestId",
                        });
                        //For updating the existing service request on click of save button
                        var requestWP = objectStore.get(
                          currentValue.currentItem.Id
                        );
                        requestWP.onerror = (event) => {
                          console.log("Failed to get the data from IndexedDB");
                        };
                        requestWP.onsuccess = (event) => {
                          var data = event.target.result;
                          //adding new valuesh
                          if (data == undefined) {
                            let newItem = {
                              serviceRequestId: currentValue.currentItem.Id,
                              status: "With Producer",
                              temperature: currentValue.temperature,
                              "ambient Temp": currentValue.ambientTemp,
                              crates:
                                Number(currentValue.crates) +
                                Number(cratesPartVal),
                              fruitsHarvested: currentValue.fruitHarvested,
                              fruitRejected: currentValue.fruitRejected,
                              advanceGiven: currentValue.advanceGiven,
                              conversionRate: currentValue.conversionRate,
                              conversionCurrency: "USD",
                              currency: currentValue.currency,
                              lotQRCodeImages: "",
                              paymentMethod: currentValue.paymentMethod,
                              SelectedBank: currentValue.selectedBank,
                              selectedBankCode: selectedBankCode,
                              accounttype: currentValue.accounttype,
                              AccountNumber: currentValue.accountNumber,
                              BankCurrency:
                                currentValue.selectedPaymentCurrency == "HTG"
                                  ? "GOURDE"
                                  : currentValue.selectedPaymentCurrency ==
                                    "USD"
                                  ? "USD"
                                  : null,
                              selectedNGO: currentValue.selectedNGO,
                              AdditionalNotes: currentValue.withProducerNote,
                              status: "With Producer",
                              withProducerQrCodeFile: arrayQRC,
                              startCrateQRCode: currentValue.startQRCode,
                              endCrateQRCode: currentValue.endQRCode,
                              isAgreed: currentValue.isAgreed,
                              fruitsRejectedReason:
                                currentValue.fruitRejectReason,
                              fruitsRejectedImageBlobs,
                              lspAdvanceGivenCurrency:
                                currentValue.lspAdvanceGivenCurrency,
                              lspAdvanceGiven: currentValue.lspAdvanceGiven,
                              displayId: currentValue.currentItem.displayId,
                              PaidByLSP: currentValue.PaidByLSP
                                ? currentValue.PaidByLSP
                                : false,
                            };

                            let transaction = db.transaction(
                              ["pickups"],
                              "readwrite"
                            );
                            let objectStore = transaction.objectStore(
                              "pickups",
                              {
                                keyPath: "serviceRequestId",
                              }
                            );
                            let requestObject = objectStore.add(newItem);
                            requestObject.onsuccess = () => {
                              var indexinArray =
                                currentValue.pickupsList.findIndex(
                                  (x) => x.Id === newItem.serviceRequestId
                                );
                              if (indexinArray != -1) {
                                currentValue.pickupsList[indexinArray].status =
                                  newItem.status;
                              }
                              //IndexedDB code starts here - for updating the pickupslist in indexedDB
                              let dbList;
                              let requestList = window.indexedDB.open(
                                "pickupsList_db",
                                1
                              );
                              requestList.onsuccess = function () {
                                console.log("Database opened successfully");
                                dbList = requestList.result;
                                console.log(db);
                                var pickupsListArray = [];
                                let transactionList = dbList.transaction(
                                  ["pickupsList"],
                                  "readwrite"
                                );
                                let objectStoreList =
                                  transactionList.objectStore("pickupsList", {
                                    keyPath: "key",
                                  });
                                var requestWPList = objectStoreList.get(1);
                                requestWPList.onsuccess = (event) => {
                                  pickupsListArray = event.target.result;
                                  currentValue.pickupsList = [];
                                  pickupsListArray.values.forEach(
                                    (item, index) => {
                                      if (
                                        item.Id == currentValue.currentItem.Id
                                      ) {
                                        item.status = "With Producer";
                                        item.CurrentStatus = "With Producer";
                                      } else {
                                        if (item.status == "Enroute Producer") {
                                          currentValue.pickupsList.push(item);
                                        }
                                      }
                                      //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                                      var checkIndex = index + 1;
                                      if (
                                        pickupsListArray.values.length ==
                                        checkIndex
                                      ) {
                                        let transactionUpdateList =
                                          dbList.transaction(
                                            ["pickupsList"],
                                            "readwrite"
                                          );
                                        let objectStoreUpdateList =
                                          transactionUpdateList.objectStore(
                                            "pickupsList",
                                            {
                                              keyPath: "key",
                                            }
                                          );
                                        let requestObjectUpdateList;
                                        requestObjectUpdateList =
                                          objectStoreUpdateList.put(
                                            pickupsListArray
                                          );
                                        requestObjectUpdateList.onsuccess =
                                          () => {
                                            currentValue.seen = false;
                                            console.log(
                                              "pickups list updated successfully"
                                            );
                                          };
                                      }
                                    }
                                  );
                                };
                              };
                              requestList.onupgradeneeded = function (e) {
                                let dbList = e.target.result;
                                let objectStoreList = dbList.createObjectStore(
                                  "pickupsList",
                                  {
                                    keyPath: "key",
                                  }
                                );
                                console.log("Database setup complete");
                              };
                              //IndexedDB code ends here - for updating the pickupslist in indexedDB
                              currentValue.$refs[
                                "digital-signature-modal"
                              ].show();
                              currentValue.seen = false;
                              console.log("added successfully");
                            };
                            transaction.oncomplete = () => {
                              console.log(
                                "Transaction completed: database modification finished."
                              );
                              db.close();
                            };
                            transaction.onerror = (error) => {
                              console.log(
                                "Transaction not opened due to error"
                              );
                              console.log(error);
                            };
                          } else {
                            data.status = "With Producer";
                            data.temperature = currentValue.temperature;
                            data["ambient Temp"] = currentValue.ambientTemp;
                            data.crates =
                              Number(currentValue.crates) +
                              Number(cratesPartVal);
                            data.fruitsHarvested = currentValue.fruitHarvested;
                            data.fruitRejected = currentValue.fruitRejected;
                            data.advanceGiven = currentValue.advanceGiven;
                            data.conversionRate = currentValue.conversionRate;
                            data.conversionCurrency = "USD";
                            data.currency = currentValue.currency;
                            data.lotQRCodeImages = "";
                            data.paymentMethod = currentValue.paymentMethod;
                            data.SelectedBank = currentValue.selectedBank;
                            data.selectedBankCode = selectedBankCode;
                            data.accounttype = currentValue.accounttype;
                            data.AccountNumber = currentValue.accountNumber;
                            data.BankCurrency =
                              currentValue.selectedPaymentCurrency == "HTG"
                                ? "GOURDE"
                                : currentValue.selectedPaymentCurrency == "USD"
                                ? "USD"
                                : null;
                            data.selectedNGO = currentValue.selectedNGO;
                            data.AdditionalNotes =
                              currentValue.withProducerNote;
                            data.status = "With Producer";
                            data.withProducerQrCodeFile = arrayQRC;
                            data.startCrateQRCode = currentValue.startQRCode;
                            data.endCrateQRCode = currentValue.endQRCode;
                            data.isAgreed = currentValue.isAgreed;
                            data.lspAdvanceGivenCurrency =
                              currentValue.lspAdvanceGivenCurrency;
                            data.lspAdvanceGiven = currentValue.lspAdvanceGiven;
                            data.displayId = currentValue.currentItem.displayId;
                            (data.fruitsRejectedReason =
                              currentValue.fruitRejectReason),
                              (data.fruitsRejectedImageBlobs =
                                fruitsRejectedImageBlobs);
                            if (currentValue.PaidByLSP) {
                              data["PaidByLSP"] = true;
                            }
                            var requestUpdate = objectStore.put(data);
                            requestUpdate.onerror = (event) => {
                              db.close();
                              console.log(
                                "Failed to update With Producer details in IndexedDB"
                              );
                            };
                            requestUpdate.onsuccess = (event) => {
                              var indexinArray =
                                currentValue.pickupsList.findIndex(
                                  (x) => x.Id === data.serviceRequestId
                                );
                              if (indexinArray != -1) {
                                currentValue.pickupsList[indexinArray].status =
                                  data.status;
                              }
                              //IndexedDB code starts here - for updating the pickupslist in indexedDB
                              let dbList;
                              let requestList = window.indexedDB.open(
                                "pickupsList_db",
                                1
                              );
                              requestList.onsuccess = function () {
                                console.log("Database opened successfully");
                                dbList = requestList.result;
                                console.log(db);
                                var pickupsListArray = [];
                                let transactionList = dbList.transaction(
                                  ["pickupsList"],
                                  "readwrite"
                                );
                                let objectStoreList =
                                  transactionList.objectStore("pickupsList", {
                                    keyPath: "key",
                                  });
                                var requestWPList = objectStoreList.get(1);
                                requestWPList.onsuccess = (event) => {
                                  pickupsListArray = event.target.result;
                                  currentValue.pickupsList = [];
                                  pickupsListArray.values.forEach(
                                    (item, index) => {
                                      if (
                                        item.Id == currentValue.currentItem.Id
                                      ) {
                                        item.status = "With Producer";
                                        item.CurrentStatus = "With Producer";
                                      } else {
                                        if (item.status == "Enroute Producer") {
                                          currentValue.pickupsList.push(item);
                                        }
                                      }
                                      //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                                      var checkIndex = index + 1;
                                      if (
                                        pickupsListArray.values.length ==
                                        checkIndex
                                      ) {
                                        let transactionUpdateList =
                                          dbList.transaction(
                                            ["pickupsList"],
                                            "readwrite"
                                          );
                                        let objectStoreUpdateList =
                                          transactionUpdateList.objectStore(
                                            "pickupsList",
                                            {
                                              keyPath: "key",
                                            }
                                          );
                                        let requestObjectUpdateList;
                                        requestObjectUpdateList =
                                          objectStoreUpdateList.put(
                                            pickupsListArray
                                          );
                                        requestObjectUpdateList.onsuccess =
                                          () => {
                                            currentValue.seen = false;
                                            console.log(
                                              "pickups list updated successfully"
                                            );
                                          };
                                      }
                                    }
                                  );
                                };
                              };
                              requestList.onupgradeneeded = function (e) {
                                let dbList = e.target.result;
                                let objectStoreList = dbList.createObjectStore(
                                  "pickupsList",
                                  {
                                    keyPath: "key",
                                  }
                                );
                                console.log("Database setup complete");
                              };
                              //IndexedDB code ends here - for updating the pickupslist in indexedDB

                              currentValue.$refs[
                                "digital-signature-modal"
                              ].show();
                              currentValue.seen = false;
                              console.log(
                                "Successfully updated With Producer details in IndexedDB"
                              );
                            };
                          }
                        };
                      };
                    }
                    //IndexedDb Code ends here
                    else {
                      this.updateWithProducerDetails(inpData);
                    }
                  } else {
                    this.seen = false;
                    Vue.$toast.open({
                      message:
                        "End QRCode can not be lesser than start QRCodes.",
                      position: "top",
                      type: "error",
                    });
                  }
                } else {
                  this.seen = false;
                  Vue.$toast.open({
                    message: "Start and end QR Code's length must be same.",
                    position: "top",
                    type: "error",
                  });
                }
              } else {
                this.seen = false;
                Vue.$toast.open({
                  message: "Start and end QR Codes are not matching.",
                  position: "top",
                  type: "error",
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
                position: "top",
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
                position: "top",
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
                      isAgreed: this.isAgreed,
                      fruitsRejectedReason: this.fruitRejectReason,
                      fruitsRejectedImageBlobs,
                      lspAdvanceGivenCurrency: this.lspAdvanceGivenCurrency,
                      lspAdvanceGiven: this.lspAdvanceGiven,
                      PaidByLSP: this.PaidByLSP ? this.PaidByLSP : false,
                    };

                    //IndexedDb Code starts here
                    if (!this.internetAvailable) {
                      var arrayQRC = [];
                      this.qrcodesToUpload.forEach((ele) => {
                        arrayQRC.push(ele.toString());
                      });
                      let db;
                      let request = window.indexedDB.open(
                        "pickups_db_withproducer",
                        1
                      );
                      request.onsuccess = () => {
                        console.log("Database opened successfully");
                        db = request.result;
                        let transaction = db.transaction(
                          ["pickups"],
                          "readwrite"
                        );
                        let objectStore = transaction.objectStore("pickups", {
                          keyPath: "serviceRequestId",
                        });
                        //For updating the existing service request on click of save button
                        var requestWP = objectStore.get(
                          currentValue.currentItem.Id
                        );
                        requestWP.onerror = (event) => {
                          console.log("Failed to get the data from IndexedDB");
                        };
                        requestWP.onsuccess = (event) => {
                          var data = event.target.result;
                          //adding new values
                          if (data == undefined) {
                            let newItem = {
                              serviceRequestId: currentValue.currentItem.Id,
                              status: "With Producer",
                              temperature: currentValue.temperature,
                              "ambient Temp": currentValue.ambientTemp,
                              crates:
                                Number(currentValue.crates) +
                                Number(cratesPartVal),
                              fruitsHarvested: currentValue.fruitHarvested,
                              fruitRejected: currentValue.fruitRejected,
                              advanceGiven: currentValue.advanceGiven,
                              conversionRate: currentValue.conversionRate,
                              conversionCurrency: "USD",
                              currency: currentValue.currency,
                              lotQRCodeImages: "",
                              paymentMethod: currentValue.paymentMethod,
                              mobilePaymentOperator:
                                currentValue.mobilePaymentOperator,
                              mobilePaymentNumber:
                                currentValue.mobilePaymentNumber,
                              mobilePaymentCurrency:
                                currentValue.selectedPaymentCurrency == "HTG"
                                  ? "GOURDE"
                                  : currentValue.selectedPaymentCurrency ==
                                    "USD"
                                  ? "USD"
                                  : null,
                              selectedNGO: currentValue.selectedNGO,
                              AdditionalNotes: currentValue.withProducerNote,
                              status: "With Producer",
                              withProducerQrCodeFile: arrayQRC,
                              startCrateQRCode: currentValue.startQRCode,
                              endCrateQRCode: currentValue.endQRCode,
                              isAgreed: currentValue.isAgreed,
                              fruitsRejectedReason:
                                currentValue.fruitRejectReason,
                              fruitsRejectedImageBlobs,
                              lspAdvanceGivenCurrency:
                                currentValue.lspAdvanceGivenCurrency,
                              lspAdvanceGiven: currentValue.lspAdvanceGiven,
                              displayId: currentValue.currentItem.displayId,
                              PaidByLSP: currentValue.PaidByLSP
                                ? currentValue.PaidByLSP
                                : false,
                            };
                            let transaction = db.transaction(
                              ["pickups"],
                              "readwrite"
                            );
                            let objectStore = transaction.objectStore(
                              "pickups",
                              {
                                keyPath: "serviceRequestId",
                              }
                            );
                            if (currentValue.PaidByLSP) {
                              newItem["PaidByLSP"] = true;
                            }
                            let requestObject = objectStore.add(newItem);
                            requestObject.onsuccess = () => {
                              var indexinArray =
                                currentValue.pickupsList.findIndex(
                                  (x) => x.Id === newItem.serviceRequestId
                                );
                              if (indexinArray != -1) {
                                currentValue.pickupsList[indexinArray].status =
                                  newItem.status;
                              }
                              //IndexedDB code starts here - for updating the pickupslist in indexedDB
                              let dbList;
                              let requestList = window.indexedDB.open(
                                "pickupsList_db",
                                1
                              );
                              requestList.onsuccess = function () {
                                console.log("Database opened successfully");
                                dbList = requestList.result;
                                console.log(db);
                                var pickupsListArray = [];
                                let transactionList = dbList.transaction(
                                  ["pickupsList"],
                                  "readwrite"
                                );
                                let objectStoreList =
                                  transactionList.objectStore("pickupsList", {
                                    keyPath: "key",
                                  });
                                var requestWPList = objectStoreList.get(1);
                                requestWPList.onsuccess = (event) => {
                                  pickupsListArray = event.target.result;
                                  currentValue.pickupsList = [];
                                  pickupsListArray.values.forEach(
                                    (item, index) => {
                                      if (
                                        item.Id == currentValue.currentItem.Id
                                      ) {
                                        item.status = "With Producer";
                                        item.CurrentStatus = "With Producer";
                                      } else {
                                        if (item.status == "Enroute Producer") {
                                          currentValue.pickupsList.push(item);
                                        }
                                      }
                                      //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                                      var checkIndex = index + 1;
                                      if (
                                        pickupsListArray.values.length ==
                                        checkIndex
                                      ) {
                                        let transactionUpdateList =
                                          dbList.transaction(
                                            ["pickupsList"],
                                            "readwrite"
                                          );
                                        let objectStoreUpdateList =
                                          transactionUpdateList.objectStore(
                                            "pickupsList",
                                            {
                                              keyPath: "key",
                                            }
                                          );
                                        let requestObjectUpdateList;
                                        requestObjectUpdateList =
                                          objectStoreUpdateList.put(
                                            pickupsListArray
                                          );
                                        requestObjectUpdateList.onsuccess =
                                          () => {
                                            currentValue.seen = false;
                                            console.log(
                                              "pickups list updated successfully"
                                            );
                                          };
                                      }
                                    }
                                  );
                                };
                              };
                              requestList.onupgradeneeded = function (e) {
                                let dbList = e.target.result;
                                let objectStoreList = dbList.createObjectStore(
                                  "pickupsList",
                                  {
                                    keyPath: "key",
                                  }
                                );
                                console.log("Database setup complete");
                              };
                              //IndexedDB code ends here - for updating the pickupslist in indexedDB

                              currentValue.$refs[
                                "digital-signature-modal"
                              ].show();
                              console.log("added successfully");
                            };
                            transaction.oncomplete = () => {
                              console.log(
                                "Transaction completed: database modification finished."
                              );
                              db.close();
                            };
                            transaction.onerror = (error) => {
                              console.log(
                                "Transaction not opened due to error"
                              );
                              console.log(error);
                            };
                          } else {
                            data.status = "With Producer";
                            data.temperature = currentValue.temperature;
                            data["ambient Temp"] = currentValue.ambientTemp;
                            data.crates =
                              Number(currentValue.crates) +
                              Number(cratesPartVal);
                            data.fruitsHarvested = currentValue.fruitHarvested;
                            data.fruitRejected = currentValue.fruitRejected;
                            data.advanceGiven = currentValue.advanceGiven;
                            data.conversionRate = currentValue.conversionRate;
                            data.conversionCurrency = "USD";
                            data.currency = currentValue.currency;
                            data.lotQRCodeImages = "";
                            data.paymentMethod = currentValue.paymentMethod;
                            data.mobilePaymentOperator =
                              currentValue.mobilePaymentOperator;
                            data.mobilePaymentNumber =
                              currentValue.mobilePaymentNumber;
                            data.mobilePaymentCurrency =
                              currentValue.selectedPaymentCurrency == "HTG"
                                ? "GOURDE"
                                : currentValue.selectedPaymentCurrency == "USD"
                                ? "USD"
                                : null;
                            data.selectedNGO = currentValue.selectedNGO;
                            data.AdditionalNotes =
                              currentValue.withProducerNote;
                            data.status = "With Producer";
                            data.withProducerQrCodeFile = arrayQRC;
                            data.startCrateQRCode = currentValue.startQRCode;
                            data.endCrateQRCode = currentValue.endQRCode;
                            data.isAgreed = currentValue.isAgreed;
                            data.fruitsRejectedReason =
                              currentValue.fruitRejectReason;
                            data.fruitsRejectedImageBlobs =
                              fruitsRejectedImageBlobs;
                            data.lspAdvanceGivenCurrency =
                              currentValue.lspAdvanceGivenCurrency;
                            data.lspAdvanceGiven = currentValue.lspAdvanceGiven;
                            if (currentValue.PaidByLSP) {
                              data["PaidByLSP"] = true;
                            }
                            var requestUpdate = objectStore.put(data);
                            data.displayId = currentValue.currentItem.displayId;
                            requestUpdate.onerror = (event) => {
                              console.log(
                                "Failed to update With Producer details in IndexedDB"
                              );
                            };
                            requestUpdate.onsuccess = (event) => {
                              var indexinArray =
                                currentValue.pickupsList.findIndex(
                                  (x) => x.Id === data.serviceRequestId
                                );
                              if (indexinArray != -1) {
                                currentValue.pickupsList[indexinArray].status =
                                  data.status;
                              }
                              //IndexedDB code starts here - for updating the pickupslist in indexedDB
                              let dbList;
                              let requestList = window.indexedDB.open(
                                "pickupsList_db",
                                1
                              );
                              requestList.onsuccess = function () {
                                console.log("Database opened successfully");
                                dbList = requestList.result;
                                console.log(db);
                                var pickupsListArray = [];
                                let transactionList = dbList.transaction(
                                  ["pickupsList"],
                                  "readwrite"
                                );
                                let objectStoreList =
                                  transactionList.objectStore("pickupsList", {
                                    keyPath: "key",
                                  });
                                var requestWPList = objectStoreList.get(1);
                                requestWPList.onsuccess = (event) => {
                                  pickupsListArray = event.target.result;
                                  currentValue.pickupsList = [];
                                  pickupsListArray.values.forEach(
                                    (item, index) => {
                                      if (
                                        item.Id == currentValue.currentItem.Id
                                      ) {
                                        item.status = "With Producer";
                                        item.CurrentStatus = "With Producer";
                                      } else {
                                        if (item.status == "Enroute Producer") {
                                          currentValue.pickupsList.push(item);
                                        }
                                      }
                                      //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                                      var checkIndex = index + 1;
                                      if (
                                        pickupsListArray.values.length ==
                                        checkIndex
                                      ) {
                                        let transactionUpdateList =
                                          dbList.transaction(
                                            ["pickupsList"],
                                            "readwrite"
                                          );
                                        let objectStoreUpdateList =
                                          transactionUpdateList.objectStore(
                                            "pickupsList",
                                            {
                                              keyPath: "key",
                                            }
                                          );
                                        let requestObjectUpdateList;
                                        requestObjectUpdateList =
                                          objectStoreUpdateList.put(
                                            pickupsListArray
                                          );
                                        requestObjectUpdateList.onsuccess =
                                          () => {
                                            currentValue.seen = false;
                                            console.log(
                                              "pickups list updated successfully"
                                            );
                                          };
                                      }
                                    }
                                  );
                                };
                              };
                              requestList.onupgradeneeded = function (e) {
                                let dbList = e.target.result;
                                let objectStoreList = dbList.createObjectStore(
                                  "pickupsList",
                                  {
                                    keyPath: "key",
                                  }
                                );
                                console.log("Database setup complete");
                              };
                              //IndexedDB code ends here - for updating the pickupslist in indexedDB

                              currentValue.$refs[
                                "digital-signature-modal"
                              ].show();
                              db.close();
                              console.log(
                                "Successfully updated With Producer details in IndexedDB"
                              );
                            };
                          }
                        };
                      };
                    }
                    //IndexedDb Code ends here
                    else {
                      this.updateWithProducerDetails(inpData);
                    }
                  } else {
                    this.seen = false;
                    Vue.$toast.open({
                      message:
                        "End QR Code can not be lesser than start QR Code.",
                      position: "top",
                      type: "error",
                    });
                  }
                } else {
                  this.seen = false;
                  Vue.$toast.open({
                    message: "Start and end QR Code's length must be same.",
                    position: "top",
                    type: "error",
                  });
                }
              } else {
                this.seen = false;
                Vue.$toast.open({
                  message: "Start and end QR Codes are not matching.",
                  position: "top",
                  type: "error",
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
                position: "top",
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
                      isAgreed: this.isAgreed,
                      fruitsRejectedReason: this.fruitRejectReason,
                      fruitsRejectedImageBlobs,
                      lspAdvanceGivenCurrency: this.lspAdvanceGivenCurrency,
                      lspAdvanceGiven: this.lspAdvanceGiven,
                      PaidByLSP: this.PaidByLSP ? this.PaidByLSP : false,
                    };
                    if (this.PaidByLSP) {
                      inpData["PaidByLSP"] = true;
                    }
                    //IndexedDb Code starts here
                    if (!currentValue.internetAvailable) {
                      var arrayQRC = [];
                      this.qrcodesToUpload.forEach((ele) => {
                        arrayQRC.push(ele.toString());
                      });
                      let db;
                      let request = window.indexedDB.open(
                        "pickups_db_withproducer",
                        1
                      );
                      request.onsuccess = () => {
                        console.log("Database opened successfully");
                        db = request.result;
                        let transaction = db.transaction(
                          ["pickups"],
                          "readwrite"
                        );
                        let objectStore = transaction.objectStore("pickups", {
                          keyPath: "serviceRequestId",
                        });
                        //For updating the existing service request on click of save button
                        var requestWP = objectStore.get(
                          currentValue.currentItem.Id
                        );
                        requestWP.onerror = (event) => {
                          console.log("Failed to get the data from IndexedDB");
                        };
                        requestWP.onsuccess = (event) => {
                          var data = event.target.result;
                          //adding new values
                          if (data == undefined) {
                            let newItem = {
                              serviceRequestId: currentValue.currentItem.Id,
                              status: "With Producer",
                              temperature: currentValue.temperature,
                              "ambient Temp": currentValue.ambientTemp,
                              crates:
                                Number(currentValue.crates) +
                                Number(cratesPartVal),
                              fruitsHarvested: currentValue.fruitHarvested,
                              fruitRejected: currentValue.fruitRejected,
                              advanceGiven: currentValue.advanceGiven,
                              conversionRate: currentValue.conversionRate,
                              conversionCurrency: "USD",
                              currency: currentValue.currency,
                              lotQRCodeImages: "",
                              paymentMethod: currentValue.paymentMethod,
                              contactnumber: currentValue.contactNumber,
                              cashPaymentCurrency:
                                currentValue.selectedPaymentCurrency == "HTG"
                                  ? "GOURDE"
                                  : currentValue.selectedPaymentCurrency ==
                                    "USD"
                                  ? "USD"
                                  : null,
                              farmerVoucher: farmerVoucher,
                              selectedNGO: currentValue.selectedNGO,
                              AdditionalNotes: currentValue.withProducerNote,
                              status: "With Producer",
                              withProducerQrCodeFile: arrayQRC,
                              startCrateQRCode: currentValue.startQRCode,
                              endCrateQRCode: currentValue.endQRCode,
                              isAgreed: currentValue.isAgreed,
                              fruitsRejectedReason:
                                currentValue.fruitRejectReason,
                              fruitsRejectedImageBlobs,
                              lspAdvanceGivenCurrency:
                                currentValue.lspAdvanceGivenCurrency,
                              lspAdvanceGiven: currentValue.lspAdvanceGiven,
                              displayId: currentValue.currentItem.displayId,
                              PaidByLSP: currentValue.PaidByLSP
                                ? currentValue.PaidByLSP
                                : false,
                            };
                            if (currentValue.PaidByLSP) {
                              newItem["PaidByLSP"] = true;
                            }
                            let transaction = db.transaction(
                              ["pickups"],
                              "readwrite"
                            );
                            let objectStore = transaction.objectStore(
                              "pickups",
                              {
                                keyPath: "serviceRequestId",
                              }
                            );
                            let requestObject = objectStore.add(newItem);
                            requestObject.onsuccess = () => {
                              var indexinArray =
                                currentValue.pickupsList.findIndex(
                                  (x) => x.Id === newItem.serviceRequestId
                                );
                              if (indexinArray != -1) {
                                currentValue.pickupsList[indexinArray].status =
                                  newItem.status;
                              }
                              //IndexedDB code starts here - for updating the pickupslist in indexedDB
                              let dbList;
                              let requestList = window.indexedDB.open(
                                "pickupsList_db",
                                1
                              );
                              requestList.onsuccess = function () {
                                console.log("Database opened successfully");
                                dbList = requestList.result;
                                console.log(db);
                                var pickupsListArray = [];
                                let transactionList = dbList.transaction(
                                  ["pickupsList"],
                                  "readwrite"
                                );
                                let objectStoreList =
                                  transactionList.objectStore("pickupsList", {
                                    keyPath: "key",
                                  });
                                var requestWPList = objectStoreList.get(1);
                                requestWPList.onsuccess = (event) => {
                                  pickupsListArray = event.target.result;
                                  currentValue.pickupsList = [];
                                  pickupsListArray.values.forEach(
                                    (item, index) => {
                                      if (
                                        item.Id == currentValue.currentItem.Id
                                      ) {
                                        item.status = "With Producer";
                                        item.CurrentStatus = "With Producer";
                                      } else {
                                        if (item.status == "Enroute Producer") {
                                          currentValue.pickupsList.push(item);
                                        }
                                      }
                                      //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                                      var checkIndex = index + 1;
                                      if (
                                        pickupsListArray.values.length ==
                                        checkIndex
                                      ) {
                                        let transactionUpdateList =
                                          dbList.transaction(
                                            ["pickupsList"],
                                            "readwrite"
                                          );
                                        let objectStoreUpdateList =
                                          transactionUpdateList.objectStore(
                                            "pickupsList",
                                            {
                                              keyPath: "key",
                                            }
                                          );
                                        let requestObjectUpdateList;
                                        requestObjectUpdateList =
                                          objectStoreUpdateList.put(
                                            pickupsListArray
                                          );
                                        requestObjectUpdateList.onsuccess =
                                          () => {
                                            currentValue.seen = false;
                                            console.log(
                                              "pickups list updated successfully"
                                            );
                                          };
                                      }
                                    }
                                  );
                                };
                              };
                              requestList.onupgradeneeded = function (e) {
                                let dbList = e.target.result;
                                let objectStoreList = dbList.createObjectStore(
                                  "pickupsList",
                                  {
                                    keyPath: "key",
                                  }
                                );
                                console.log("Database setup complete");
                              };
                              //IndexedDB code ends here - for updating the pickupslist in indexedDB

                              currentValue.$refs[
                                "digital-signature-modal"
                              ].show();
                              console.log("added successfully");
                            };
                            transaction.oncomplete = () => {
                              console.log(
                                "Transaction completed: database modification finished."
                              );
                              db.close();
                            };
                            transaction.onerror = (error) => {
                              console.log(
                                "Transaction not opened due to error"
                              );
                              console.log(error);
                            };
                          } else {
                            data.status = "With Producer";
                            data.temperature = currentValue.temperature;
                            data["ambient Temp"] = currentValue.ambientTemp;
                            data.crates =
                              Number(currentValue.crates) +
                              Number(cratesPartVal);
                            data.fruitsHarvested = currentValue.fruitHarvested;
                            data.fruitRejected = currentValue.fruitRejected;
                            data.advanceGiven = currentValue.advanceGiven;
                            data.conversionRate = currentValue.conversionRate;
                            data.conversionCurrency = "USD";
                            data.currency = currentValue.currency;
                            data.lotQRCodeImages = "";
                            data.paymentMethod = currentValue.paymentMethod;
                            data.contactnumber = currentValue.contactNumber;
                            data.cashPaymentCurrency =
                              currentValue.selectedPaymentCurrency == "HTG"
                                ? "GOURDE"
                                : currentValue.selectedPaymentCurrency == "USD"
                                ? "USD"
                                : null;
                            (data.farmerVoucher = farmerVoucher),
                              (data.selectedNGO = currentValue.selectedNGO);
                            data.AdditionalNotes =
                              currentValue.withProducerNote;
                            data.status = "With Producer";
                            data.withProducerQrCodeFile = arrayQRC;
                            data.startCrateQRCode = currentValue.startQRCode;
                            data.endCrateQRCode = currentValue.endQRCode;
                            data.isAgreed = currentValue.isAgreed;
                            data.fruitsRejectedReason =
                              currentValue.fruitRejectReason;
                            data.fruitsRejectedImageBlobs =
                              fruitsRejectedImageBlobs;
                            data.lspAdvanceGivenCurrency =
                              currentValue.lspAdvanceGivenCurrency;
                            data.lspAdvanceGiven = currentValue.lspAdvanceGiven;
                            data.displayId = currentValue.currentItem.displayId;
                            if (currentValue.PaidByLSP) {
                              data["PaidByLSP"] = true;
                            }

                            var requestUpdate = objectStore.put(data);
                            requestUpdate.onerror = (event) => {
                              console.log(
                                "Failed to update With Producer details in IndexedDB"
                              );
                            };
                            requestUpdate.onsuccess = (event) => {
                              var indexinArray =
                                currentValue.pickupsList.findIndex(
                                  (x) => x.Id === data.serviceRequestId
                                );
                              if (indexinArray != -1) {
                                currentValue.pickupsList[indexinArray].status =
                                  data.status;
                              }
                              //IndexedDB code starts here - for updating the pickupslist in indexedDB
                              let dbList;
                              let requestList = window.indexedDB.open(
                                "pickupsList_db",
                                1
                              );
                              requestList.onsuccess = function () {
                                console.log("Database opened successfully");
                                dbList = requestList.result;
                                console.log(db);
                                var pickupsListArray = [];
                                let transactionList = dbList.transaction(
                                  ["pickupsList"],
                                  "readwrite"
                                );
                                let objectStoreList =
                                  transactionList.objectStore("pickupsList", {
                                    keyPath: "key",
                                  });
                                var requestWPList = objectStoreList.get(1);
                                requestWPList.onsuccess = (event) => {
                                  pickupsListArray = event.target.result;
                                  currentValue.pickupsList = [];
                                  pickupsListArray.values.forEach(
                                    (item, index) => {
                                      if (
                                        item.Id == currentValue.currentItem.Id
                                      ) {
                                        item.status = "With Producer";
                                        item.CurrentStatus = "With Producer";
                                      } else {
                                        if (item.status == "Enroute Producer") {
                                          currentValue.pickupsList.push(item);
                                        }
                                      }
                                      //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                                      var checkIndex = index + 1;
                                      if (
                                        pickupsListArray.values.length ==
                                        checkIndex
                                      ) {
                                        let transactionUpdateList =
                                          dbList.transaction(
                                            ["pickupsList"],
                                            "readwrite"
                                          );
                                        let objectStoreUpdateList =
                                          transactionUpdateList.objectStore(
                                            "pickupsList",
                                            {
                                              keyPath: "key",
                                            }
                                          );
                                        let requestObjectUpdateList;
                                        requestObjectUpdateList =
                                          objectStoreUpdateList.put(
                                            pickupsListArray
                                          );
                                        requestObjectUpdateList.onsuccess =
                                          () => {
                                            currentValue.seen = false;
                                            console.log(
                                              "pickups list updated successfully"
                                            );
                                          };
                                      }
                                    }
                                  );
                                };
                              };
                              requestList.onupgradeneeded = function (e) {
                                let dbList = e.target.result;
                                let objectStoreList = dbList.createObjectStore(
                                  "pickupsList",
                                  {
                                    keyPath: "key",
                                  }
                                );
                                console.log("Database setup complete");
                              };
                              //IndexedDB code ends here - for updating the pickupslist in indexedDB

                              currentValue.$refs[
                                "digital-signature-modal"
                              ].show();
                              db.close();
                              console.log(
                                "Successfully updated With Producer details in IndexedDB"
                              );
                            };
                          }
                        };
                      };
                    } else {
                      this.updateWithProducerDetails(inpData);
                    }
                    //IndexedDb Code ends here
                  } else {
                    this.seen = false;
                    Vue.$toast.open({
                      message:
                        "End QR Code can not be lesser than start QR Code.",
                      position: "top",
                      type: "error",
                    });
                  }
                } else {
                  this.seen = false;
                  Vue.$toast.open({
                    message: "Start and end QR Code's length must be same.",
                    position: "top",
                    type: "error",
                  });
                }
              } else {
                this.seen = false;
                Vue.$toast.open({
                  message: "Start and end QR Codes are not matching.",
                  position: "top",
                  type: "error",
                });
              }
            }
          } else {
            inpData = null;
          }
        }
      }
    },
    printDownloadUrl: function (url, fileName, documentType) {
      var currentValue = this;
      if (url) {
        var dbRef = firebase.database().ref().child("serviceRequest");
        var inpData = {
          withProducerFilePath: url,
          withProducserFileName: fileName,
          withProducerAddedBy: localStorage.userName,
        };
        dbRef
          .orderByChild("serviceRequestId")
          .equalTo(currentValue.currentItem.Id)
          .on("child_added", function (data) {
            var ref = firebase
              .database()
              .ref("serviceRequest/" + data.key)
              .child("rejectedFiles");
            ref.push(inpData).then(function () {
              currentValue.seen = false;
            });
          });
      }
      this.seen = false;
    },

    getDataForBLockChainAPI: function () {
      let currentValue = this;
      currentValue.apiData = null;
      let typeOfPenalty = (function () {
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
        .on("child_added", function (data) {
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
            serviceRequestId: data.val().serviceRequestId,
          };
          let _data = {};
          if (currentValue.delayedBy <= 7) {
            _data = {
              product: currentValue.apiData.productId,
              producer: currentValue.apiData.producer,
              coords: currentValue.apiData.logitudeLatitude,
              scheduled: currentValue.apiData.dateOfPickup,
              amount: currentValue.apiData.estimatedFruit,
            };
          } else {
            _data = {
              penalties: [
                {
                  type: typeOfPenalty,
                  delivery_time: currentValue.delayedBy,
                  fruits_amount: currentValue.apiData.estimatedFruit,
                },
              ],
              product: currentValue.apiData.productId,
              producer: currentValue.apiData.producer,
              coords: currentValue.apiData.logitudeLatitude,
              scheduled: currentValue.apiData.dateOfPickup,
              amount: currentValue.apiData.estimatedFruit,
            };
          }
        });
    },
    updateWithProducerDetails: function (inpData) {
      let currentValue = this;
      currentValue.seen = true;
      inpData["withProducerDataAddedOn"] = moment.utc().toString();
      var fruitCount =
        Number(inpData.fruitsHarvested) - Number(inpData.fruitRejected);
      var product = currentValue.currentItem.Produce.split("(")[0];
      currentValue.withProducerErrorMessage = "";
      // upload rejected fruits images
      currentValue
        .uploadRejectedFruitsImages(inpData)
        .then((uploaded) => {
          delete inpData.fruitsRejectedImageBlobs;
          var dbRef = firebase.database().ref("serviceRequest/");
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.currentItem.Id)
            .on("child_added", function (data) {
              var ref = firebase.database().ref("serviceRequest/" + data.key);
              ref
                .update(inpData)
                .then(function () {
                  inpData.serviceRequestId = currentValue.currentItem.Id;
                  //push data to report
                  //currentValue.updateReportData(inpData);
                  if (currentValue.PaidByLSP) {
                    inpData["PaidByLSP"] = true;
                  }
                  currentValue.createWithProducerAPICall(inpData);
                  sendSMS(
                    currentValue.currentItem.phoneNumber,
                    "Nimewo pou jwenn sèvis : " +
                      currentValue.currentItem.displayId +
                      ". Kontra ki siyen " +
                      fruitCount +
                      " " +
                      product.trim() +
                      " nan pòst kolekt"
                  );
                  currentValue.qrcodesToUpload = [];
                  currentValue.getAgreementData().then(function () {
                    currentValue.$refs["digital-signature-modal"].show();
                  });
                  currentValue.seen = false;
                })
                .catch(function (error) {
                  currentValue.erroMessage = error.message;
                  currentValue.seen = false;
                });
            });
          currentValue.qrcodesToUpload = [];
          currentValue.getAgreementData().then(function () {
            // currentValue.$refs["digital-signature-modal"].show();
            console.log("agreement data fetched.");
          });
          currentValue.seen = false;
        })
        .catch((failed) => {
          console.log("failed to upload images");
        });
    },
    //working here
    updateReportData(inputData) {
      var currentVal = this;
      debugger;
      console.log(currentVal.PaidByLSP);
      firebase
        .database()
        .ref("serviceRequest/")
        .orderByChild("serviceRequestId")
        .equalTo(inputData.serviceRequestId)
        .on("child_added", function (data) {
          var farmerVoucher = uuid.v1().replace(/-/g, "");
          var inputReportData = null;
          inputReportData = {
            ServiceRequestId: inputData.serviceRequestId,
            organizationKey: data.val().organizationKey,
            mode: "Advance",
            advanceTransactionId: uuid.v1(),
            advanceFarmerVoucher: farmerVoucher,
            PaidByLSP: inputData.PaidByLSP ? inputData.PaidByLSP : false,
          };

          var nodeName = null;
          var formattedDate = moment(String(moment.utc(new Date()))).format(
            "YYYYMMDD"
          );

          var formattedTomorrowsDate = moment(
            String(moment.utc(new Date()).add("days", 1))
          ).format("YYYYMMDD");
          var currentDateinESTDate = moment(new Date()).tz("America/New_York");

          var currentDate = moment(new Date()).format("YYYY-MM-DD");
          var compareDate = moment.tz(
            currentDate + " 14:45:59",
            "America/New_York"
          );
          if (currentDateinESTDate > compareDate) {
            nodeName = "_" + formattedTomorrowsDate;
          } else {
            nodeName = "_" + formattedDate;
          }
          let smsDate = moment(data.val().requestedOn).format("MM.DD");
          var reportDataRef = firebase
            .database()
            .ref("reportData")
            .child(nodeName);
          reportDataRef
            .push(inputReportData)
            .then(function () {
              currentVal.PaidByLSP = false;
              if (Number(inputData.advanceGiven) != 0) {
                var modeTransfer = "";
                if (inputData.paymentMethod == "Wire") {
                  modeTransfer = "fil";
                } else if (inputData.paymentMethod == "Cash") {
                  modeTransfer = "Lajan Kach";
                } else if (inputData.paymentMethod == "Mobile") {
                  modeTransfer = "lajan mobil";
                }
                sendSMS(
                  currentVal.currentItem.phoneNumber,
                  `Wap resevwa HTG ${
                    inputData.advanceGiven
                  } nan ${modeTransfer} pou Harvest ${
                    data.val().displayId
                  } la ki te fèt nan dat (${smsDate})`
                )
                  .then((sent) => console.log(sent))
                  .catch((err) => console.log(err));
              }
            })
            .catch(function (error) {
              console.log(error);
              currentVal.seen = false;
              Vue.$toast.open({
                message: currentVal.$t(
                  "Error updating data to firebase",
                  "Error updating data to firebase"
                ),
                type: "error",
                position: "top",
              });
            });
        });
    },
    selectedPaymentMethod: function (val) {
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
    uploadImage: function (
      files,
      selectedStage,
      id,
      inpData,
      vm,
      documentType
    ) {
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
    hideModal: function () {
      this.$refs["reject-modal"].hide();
    },
    hideConfirmWarningModal: function () {
      this.$refs["confirm-warning-modal"].hide();
    },
    rejectCollection: function () {
      this.$refs["reject-modal"].show();
    },
    getContactNumber: function () {
      this.contactNumber = this.currentItem.phoneNumber;
    },
    cancelSelectedItem: function () {
      this.producerContainer = false;
      this.emptyContainer = true;
      this.selectedItem = null;

      this.temperature = null;
      this.ambientTemp = null;
      this.crates = null;
      this.cratesPart = null;
      this.fruitHarvested = null;
      this.fruitRejected = null;
      this.advanceGiven = "0";
      this.autoCalculatedProducerAdvance = "0";
      this.lspAdvanceGiven = "0";
      // this.lspAdvanceGiveninUSD = "0";
      // this.advanceGiveninUSD = "0";
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
      this.PaidByLSP = false;
    },
    uploadRejectedFiles: function () {
      this.uploadImage(
        this.rejectedSelectedFiles,
        "RejectedFiles",
        this.currentItem.Id,
        "",
        this,
        "RejectedFiles"
      );
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
    updateRejectStatus: function () {
      this.seen = true;
      if (this.rejectReason == null || this.rejectReason == "") {
        Vue.$toast.open({
          message: "Please select the reason.",
          type: "error",
          position: "top",
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
          position: "top",
        });
        this.seen = false;
      } else {
        this.updateRejectDetails();
      }
    },
    updateRejectDetails: function () {
      // this.getDataForBLockChainAPI();
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
        withProducerAddedBy: localStorage.userName,
      };
      //IndexedDb Code starts here
      if (!this.internetAvailable) {
        let db;
        let request = window.indexedDB.open("pickups_db_reject", 1);
        request.onsuccess = () => {
          console.log("Database opened successfully");
          db = request.result;
          let transaction = db.transaction(["pickups"], "readwrite");
          let objectStore = transaction.objectStore("pickups", {
            keyPath: "serviceRequestId",
          });
          //For updating the existing service request on click of save button
          var requestWP = objectStore.get(currentValue.currentItem.Id);
          requestWP.onerror = (event) => {
            console.log("Failed to get the data from IndexedDB");
          };
          requestWP.onsuccess = (event) => {
            var dataIndexedDB = event.target.result;
            //adding new values
            if (dataIndexedDB == undefined) {
              let newItem = {
                serviceRequestId: currentValue.currentItem.Id,
                status: "Rejected",
                rejectedOn: moment.utc().toString(),
                rejectReason: currentValue.rejectReason,
                rejectAddionalNote: currentValue.rejectAddionalNote,
                rejectedBy: localStorage.userName,
              };
              let transaction = db.transaction(["pickups"], "readwrite");
              let objectStore = transaction.objectStore("pickups", {
                keyPath: "serviceRequestId",
              });
              let requestObject = objectStore.add(newItem);
              requestObject.onsuccess = () => {
                currentValue.seen = false;
                Vue.$toast.open({
                  message: "Data will be saved once you are back online.",
                  type: "success",
                  position: "top",
                });
                //Updating the pickupslist starts here
                var indexinArray = currentValue.pickupsList.findIndex(
                  (x) => x.Id === newItem.serviceRequestId
                );
                if (indexinArray != -1) {
                  currentValue.pickupsList[indexinArray].status =
                    newItem.status;
                }
                //IndexedDB code starts here - for updating the pickupslist in indexedDB
                let dbList;
                let requestList = window.indexedDB.open("pickupsList_db", 1);
                requestList.onsuccess = function () {
                  console.log("Database opened successfully");
                  dbList = requestList.result;
                  console.log(db);
                  var pickupsListArray = [];
                  let transactionList = dbList.transaction(
                    ["pickupsList"],
                    "readwrite"
                  );
                  let objectStoreList = transactionList.objectStore(
                    "pickupsList",
                    {
                      keyPath: "key",
                    }
                  );
                  var requestWPList = objectStoreList.get(1);
                  requestWPList.onsuccess = (event) => {
                    pickupsListArray = event.target.result;
                    currentValue.pickupsList = [];
                    pickupsListArray.values.forEach((item, index) => {
                      if (item.Id == currentValue.currentItem.Id) {
                        item.status = "Rejected";
                        item.CurrentStatus = "Rejected";
                      } else {
                        if (item.status == "Enroute Producer") {
                          currentValue.pickupsList.push(item);
                        }
                      }
                      //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                      var checkIndex = index + 1;
                      if (pickupsListArray.values.length == checkIndex) {
                        let transactionUpdateList = dbList.transaction(
                          ["pickupsList"],
                          "readwrite"
                        );
                        let objectStoreUpdateList =
                          transactionUpdateList.objectStore("pickupsList", {
                            keyPath: "key",
                          });
                        let requestObjectUpdateList;
                        requestObjectUpdateList =
                          objectStoreUpdateList.put(pickupsListArray);
                        requestObjectUpdateList.onsuccess = () => {
                          currentValue.seen = false;
                          console.log("pickups list updated successfully");
                        };
                      }
                    });
                  };
                };
                requestList.onupgradeneeded = function (e) {
                  let dbList = e.target.result;
                  let objectStoreList = dbList.createObjectStore(
                    "pickupsList",
                    {
                      keyPath: "key",
                    }
                  );
                  console.log("Database setup complete");
                };
                //IndexedDB code ends here - for updating the pickupslist in indexedDB
                //Updating the pickupslist ends here

                currentValue.rejectReason = "";
                currentValue.rejectAddionalNote = "";
                currentValue.hideModal();
                currentValue.producerContainer = false;
                currentValue.emptyContainer = true;
                currentValue.selectedItem = null;
                currentValue.temperature = "";
                currentValue.ambientTemp = "";
                currentValue.crates = "";
                currentValue.cratesPartVal = "0";
                currentValue.fruitHarvested = "";
                currentValue.fruitRejected = "";
                currentValue.advanceGiven = "0";
                currentValue.lspAdvanceGiven = "0";
                currentValue.startQRCode = "";
                currentValue.endQRCode = "";
                currentValue.currency = "HTG";
                currentValue.paymentMethod = "";
                currentValue.selectedBank = "";
                currentValue.accountNumber = "";
                currentValue.selectedPaymentCurrency = "HTG";
                currentValue.withProducerNote = "";
                currentValue.seen = false;
                console.log("added successfully");
              };
              requestObject.onerror = (event) => {
                currentValue.seen = false;
                Vue.$toast.open({
                  message: "Please try again",
                  type: "error",
                  position: "top",
                });
                console.log(
                  "Failed to update digital signature details in IndexedDB"
                );
              };
              transaction.oncomplete = () => {
                console.log(
                  "Transaction completed: database modification finished."
                );
                db.close();
              };
              transaction.onerror = (error) => {
                console.log("Transaction not opened due to error");
                console.log(error);
              };
            } else {
              dataIndexedDB.status = "Rejected";
              dataIndexedDB.rejectedOn = moment.utc().toString();
              dataIndexedDB.rejectReason = currentValue.rejectReason;
              dataIndexedDB.rejectAddionalNote =
                currentValue.rejectAddionalNote;
              dataIndexedDB.rejectedBy = localStorage.userName;
              var requestUpdate = objectStore.put(dataIndexedDB);
              requestUpdate.onerror = (event) => {
                Vue.$toast.open({
                  message: "Please try again",
                  type: "error",
                  position: "top",
                });
                console.log("Failed to update rejected details in IndexedDB");
              };
              requestUpdate.onsuccess = (event) => {
                currentValue.rejectReason = "";
                currentValue.rejectAddionalNote = "";
                currentValue.hideModal();
                currentValue.producerContainer = false;
                currentValue.emptyContainer = true;
                currentValue.selectedItem = null;
                currentValue.temperature = "";
                currentValue.ambientTemp = "";
                currentValue.crates = "";
                currentValue.cratesPartVal = "0";
                currentValue.fruitHarvested = "";
                currentValue.fruitRejected = "";
                currentValue.advanceGiven = "0";
                currentValue.autoCalculatedProducerAdvance = "0";
                currentValue.lspAdvanceGiven = "0";
                currentValue.startQRCode = "";
                currentValue.endQRCode = "";
                currentValue.currency = "HTG";
                currentValue.paymentMethod = "";
                currentValue.selectedBank = "";
                currentValue.accountNumber = "";
                currentValue.selectedPaymentCurrency = "HTG";
                currentValue.withProducerNote = "";
                currentValue.seen = false;
                Vue.$toast.open({
                  message: "Data will be saved once you are back online.",
                  type: "success",
                  position: "top",
                });
                console.log(
                  "Successfully updated rejected details in IndexedDB"
                );
              };
            }
          };
        };
        request.onupgradeneeded = function (e) {
          let dbList = e.target.result;
          let objectStoreList = dbList.createObjectStore("pickups", {
            keyPath: "serviceRequestId",
          });
          console.log("Database setup complete");
        };
        //IndexedDB code ends here
      } else {
        this.getDataForBLockChainAPI();
        var dbRef = firebase.database().ref("serviceRequest/");
        dbRef
          .orderByChild("serviceRequestId")
          .equalTo(currentValue.currentItem.Id)
          .on("child_added", function (data) {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            ref
              .update(inpData)
              .then(function () {
                //upload rejected files
                currentValue.uploadRejectedFiles();
                currentValue.getAgreementData().then(function () {
                  // currentValue.$refs["digital-signature-modal"].show();
                });
                currentValue.rejectErrorMessage = "";
                currentValue.seen = false;
                console.log(inpData.rejectReason);
                switch (inpData.rejectReason) {
                  case "Quality":
                    {
                      sendSMS(
                        currentValue.currentItem.phoneNumber,
                        "Nimewo pou jwenn sèvis : " +
                          currentValue.currentItem.displayId +
                          ". Yon lo fri rejete poutèt Kalite maksimal"
                      )
                        .then((sent) => console.log(sent))
                        .catch((err) => console.log(err));
                    }
                    break;
                  case "Quantity":
                    {
                      sendSMS(
                        currentValue.currentItem.phoneNumber,
                        "Nimewo pou jwenn sèvis : " +
                          currentValue.currentItem.displayId +
                          ". Yon lo fri rejete poutèt Kantite"
                      )
                        .then((sent) => console.log(sent))
                        .catch((err) => console.log(err));
                    }
                    break;
                  case "Maturity":
                    {
                      sendSMS(
                        currentValue.currentItem.phoneNumber,
                        "Nimewo pou jwenn sèvis : " +
                          currentValue.currentItem.displayId +
                          ". Yon lo fri rejete poutèt Lè fri a rèk"
                      )
                        .then((sent) => console.log(sent))
                        .catch((err) => console.log(err));
                    }
                    break;
                  case "Temperature":
                    {
                      sendSMS(
                        currentValue.currentItem.phoneNumber,
                        "Nimewo pou jwenn sèvis : " +
                          currentValue.currentItem.displayId +
                          ". Yon lo fri rejete poutèt Lè Tanperati limit fri a"
                      )
                        .then((sent) => console.log(sent))
                        .catch((err) => console.log(err));
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
                  position: "top",
                });
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
              })
              .catch(function (error) {
                currentValue.erroMessage = error.message;
                currentValue.seen = false;
              });
          });
      }
    },
    showSelected: function (item) {
      this.emptyContainer = false;
      this.currentItem = null;
      this.currentItem = item;
      this.PaidByLSP = false;
      //IndexedDB code starts here - for setting the agreement data to be loaded in modal
      if (!this.internetAvailable) {
        const vm = this;
        const produce = vm.currentItem.Produce.split(" ")[0].toLowerCase();
        this.agreementData = {
          town: this.currentItem.town,
          collectionPoint: this.currentItem.collectionPoint,
          dateOfPickup: this.currentItem.dateOfPickup,
          producer: this.currentItem.producer,
          farmerId: this.currentItem.farmerId,
          produce: (function () {
            if (produce == "mango") {
              return "Mango";
            } else if (produce == "avocado") {
              return "Zaboka";
            } else if (produce == "pineapple") {
              return "Anana";
            } else {
              return "Invalid Fruit";
            }
          })(),
          agreementDate: moment()
            .utc()
            .format("MMM DD, YYYY hh:mm A")
            .toString(),
        };
      }
      //IndexedDB code ends here
      this.producerContainer = true;
      this.getContactNumber();
      this.selectedStatus = null;

      this.temperature = null;
      this.ambientTemp = null;
      this.crates = null;
      this.cratesPart = null;
      this.fruitHarvested = null;
      this.fruitRejected = null;
      this.advanceGiven = "0";
      this.autoCalculatedProducerAdvance = "0";
      this.lspAdvanceGiven = "0";
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
    },
    getPickupList: function () {
      let currentval = this;
      this.pickupsList = [];
      let rawName = this.userName.trim().split("(", 1);
      rawName = rawName[0].trim();

      var ref = firebase.database().ref("serviceRequest/");
      if (currentval.internetAvailable) {
        if (localStorage.systemRole == 99) {
          var count = 0;
          ref.on("value", function (snapshot) {
            currentval.pickupsList = [];
            snapshot.forEach((requestData) => {
              if (requestData.val().status == "Enroute Producer") {
                var data = "";
                data = {
                  Id: requestData.val().serviceRequestId,
                  PickupRequestedOn: moment
                    .utc(requestData.val().dateOfPickup)
                    .local()
                    .format("MMM DD, YYYY hh:mm A"),
                  Produce: requestData.val().product,
                  estimatedNoFruits: requestData.val().estimatedNoFruits,
                  Producer: requestData.val().producer,
                  Collectat: requestData.val().collectionPoint,
                  DropOffAt: requestData.val().dropOffAtPackhouse,
                  CurrentStatus: requestData.val().status,
                  totalFruits: requestData.val().estimatedNoFruits,
                  _delayedBy: requestData.val().scheduledAfter,
                  farmerId: requestData.val().farmerId,
                  phoneNumber: requestData.val().phoneNumber,
                  status: requestData.val().status,
                  collector: requestData.val().collector,
                  town: requestData.val().town,
                  collectionPoint: requestData.val().collectionPoint,
                  dateOfPickup: requestData.val().dateOfPickup,
                  producer: requestData.val().producer,
                  farmerId: requestData.val().farmerId,
                  createdBy: requestData.val().serviceRequestCreatedBy || "",
                  scheduledBy: requestData.val().scheduledBy || "",
                  scheduledOn: requestData.val().pickupAddedOn || "",
                  enrouteToProducerAddedBy:
                    requestData.val().enrouteToProducerAddedBy || "",
                  enrouteToProducerAddedOn:
                    requestData.val().plannedPickUpAddedOn || "",
                  organization: requestData.val().organization,
                  organizationKey: requestData.val().organizationKey,
                  displayId: requestData.val().displayId,
                };
                currentval.pickupsList.push(data);
              }
              var checkCount = count + 1;
              if (snapshot.numChildren() == checkCount) {
                currentval.seen = false;
                currentval.pickupsList.reverse();
              }
              count++;
            });
          });
        } else {
          var count = 0;
          ref
            .orderByChild("organizationKey")
            .equalTo(localStorage.organizationKey)
            .on("value", function (snapshot) {
              currentval.pickupsList = [];
              snapshot.forEach((requestData) => {
                if (requestData.val().status == "Enroute Producer") {
                  console.log(requestData.val());
                  var data = "";
                  data = {
                    Id: requestData.val().serviceRequestId,
                    PickupRequestedOn: moment
                      .utc(requestData.val().dateOfPickup)
                      .local()
                      .format("MMM DD, YYYY hh:mm A"),
                    Produce: requestData.val().product,
                    estimatedNoFruits: requestData.val().estimatedNoFruits,
                    Producer: requestData.val().producer,
                    Collectat: requestData.val().collectionPoint,
                    DropOffAt: requestData.val().dropOffAtPackhouse,
                    CurrentStatus: requestData.val().status,
                    totalFruits: requestData.val().estimatedNoFruits,
                    _delayedBy: requestData.val().scheduledAfter,
                    farmerId: requestData.val().farmerId,
                    status: requestData.val().status,
                    phoneNumber: requestData.val().phoneNumber,
                    collector: requestData.val().collector,
                    town: requestData.val().town,
                    collectionPoint: requestData.val().collectionPoint,
                    dateOfPickup: requestData.val().dateOfPickup,
                    producer: requestData.val().producer,
                    farmerId: requestData.val().farmerId,
                    createdBy: requestData.val().serviceRequestCreatedBy || "",
                    scheduledBy: requestData.val().scheduledBy || "",
                    scheduledOn: requestData.val().pickupAddedOn || "",
                    enrouteToProducerAddedBy:
                      requestData.val().enrouteToProducerAddedBy || "",
                    enrouteToProducerAddedOn:
                      requestData.val().plannedPickUpAddedOn || "",
                    organization: requestData.val().organization,
                    organizationKey: requestData.val().organizationKey,
                    displayId: requestData.val().displayId,
                  };
                  currentval.pickupsList.push(data);
                }
                var checkCount = count + 1;
                if (snapshot.numChildren() == checkCount) {
                  currentval.seen = false;
                  currentval.pickupsList.reverse();
                }
                count++;
              });
            });
        } // end of else condition
      } else {
        currentval.getBanksFromIndexedDb();
        currentval.getNgosListFromIndexedDb();
        currentval.getUnitOcstFromIndexedDb();
        currentval.getCurrencyExchangeRateFromIndexedDb();
        //IndexedDB code starts here - for fetching pickupslist from indexedDB if network is not there
        let dbList;
        let requestList = window.indexedDB.open("pickupsList_db", 1);
        requestList.onsuccess = function () {
          console.log("Database opened successfully");
          dbList = requestList.result;
          console.log(dbList);
          var pickupsListArray = [];
          var objectStoreList = dbList
            .transaction("pickupsList")
            .objectStore("pickupsList");
          objectStoreList.getAll().onsuccess = () => {
            pickupsListArray = event.target.result;
            currentval.seen = true;
            pickupsListArray[0].values.forEach((item, index) => {
              if (item.status == "Enroute Producer") {
                currentval.pickupsList.push(item);
              }
              //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
              var checkIndex = index + 1;
              if (pickupsListArray[0].values.length == checkIndex) {
                currentval.seen = false;
              }
            });
          };
        };
        requestList.onupgradeneeded = function (e) {
          let dbList = e.target.result;
          let objectStoreList = dbList.createObjectStore("pickupsList", {
            keyPath: "key",
          });
          console.log("Database setup complete");
        };
        //IndexedDB code ends here
      }
      setTimeout(function () {
        if (currentval.pickupsList.length == 0) {
          currentval.seen = false;
        }
      }, 8000);
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
    showDashboard: function () {
      Router.push("lsp-dashboard");
    },
    clearAllFields: function () {},
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    save() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      if (data == undefined) {
        this.seen = false;
        Vue.$toast.open({
          message: "Please sign the agreement",
          type: "error",
          position: "top",
        });
      } else if (!this.isAgreed) {
        this.seen = false;
        Vue.$toast.open({
          message: "Please accept the agreement",
          type: "error",
          position: "top",
        });
      } else {
        this.withProducerDigitalSignature = data;
        var inpData = {
          withProducerDigitalSignature: data,
          agreementDocumentUrl: null,
          withProducerAddedBy: localStorage.userName,
        };
        let currentValue = this;
        currentValue.seen = true;
        //IndexedDb Code starts here
        if (!this.internetAvailable) {
          let db;
          let request = window.indexedDB.open("pickups_db_withproducer", 1);
          request.onsuccess = () => {
            console.log("Database opened successfully");
            db = request.result;
            let transaction = db.transaction(["pickups"], "readwrite");
            let objectStore = transaction.objectStore("pickups", {
              keyPath: "serviceRequestId",
            });
            //For updating the existing service request on click of save button
            var requestWP = objectStore.get(currentValue.currentItem.Id);
            requestWP.onerror = (event) => {
              console.log("Failed to get the data from IndexedDB");
            };
            requestWP.onsuccess = (event) => {
              var dataIndexedDB = event.target.result;
              //adding new values
              if (dataIndexedDB == undefined) {
                currentValue
                  .generateAgreementFile(data)
                  .then(function (fileBlob) {
                    //Temporary
                    //Fileblob is stored in indexedDB inside agreementDocumentUrl temporarily
                    let newItem = {
                      serviceRequestId: currentValue.currentItem.Id,
                      withProducerDigitalSignature: data,
                      agreementDocumentUrl: fileBlob,
                      withProducerAddedBy: localStorage.userName,
                      withProducerAddedOn: moment()
                        .utc()
                        .format("YYYY-MM-DDTHH:mm:ss")
                        .toString(),
                    };
                    let transaction = db.transaction(["pickups"], "readwrite");
                    let objectStore = transaction.objectStore("pickups", {
                      keyPath: "serviceRequestId",
                    });
                    let requestObject = objectStore.add(newItem);
                    requestObject.onsuccess = () => {
                      currentValue.producerContainer = false;
                      currentValue.emptyContainer = true;
                      currentValue.selectedItem = null;

                      currentValue.temperature = "";
                      currentValue.ambientTemp = "";
                      currentValue.crates = "";
                      currentValue.cratesPartVal = "0";
                      currentValue.fruitHarvested = "";
                      currentValue.fruitRejected = "";
                      currentValue.advanceGiven = "0";
                      currentValue.lspAdvanceGiven = "0";
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
                      Vue.$toast.open({
                        message: "Data will be saved once you are back online.",
                        type: "success",
                        position: "top",
                      });
                      console.log("added successfully");
                    };
                    requestObject.onerror = (event) => {
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: "Please try again",
                        type: "error",
                        position: "top",
                      });
                      console.log(
                        "Failed to update digital signature details in IndexedDB"
                      );
                    };
                    transaction.oncomplete = () => {
                      console.log(
                        "Transaction completed: database modification finished."
                      );
                      db.close();
                    };
                    transaction.onerror = (error) => {
                      console.log("Transaction not opened due to error");
                      console.log(error);
                    };
                  });
              } else {
                currentValue
                  .generateAgreementFile(data)
                  .then(function (fileBlob) {
                    dataIndexedDB.withProducerDigitalSignature = data;
                    dataIndexedDB.agreementDocumentUrl = fileBlob;
                    dataIndexedDB.withProducerAddedBy = localStorage.userName;
                    dataIndexedDB.withProducerAddedOn = moment()
                      .utc()
                      .format("YYYY-MM-DDTHH:mm:ss")
                      .toString();

                    let _transaction = db.transaction(["pickups"], "readwrite");
                    let _objectStore = _transaction.objectStore("pickups", {
                      keyPath: "serviceRequestId",
                    });

                    var requestUpdate = _objectStore.put(dataIndexedDB);
                    requestUpdate.onerror = (event) => {
                      Vue.$toast.open({
                        message: "Please try again",
                        type: "error",
                        position: "top",
                      });
                      console.log(
                        "Failed to update digital signature details in IndexedDB"
                      );
                    };
                    requestUpdate.onsuccess = (event) => {
                      currentValue.producerContainer = false;
                      currentValue.emptyContainer = true;
                      currentValue.selectedItem = null;

                      currentValue.temperature = "";
                      currentValue.ambientTemp = "";
                      currentValue.crates = "";
                      currentValue.cratesPartVal = "0";
                      currentValue.fruitHarvested = "";
                      currentValue.fruitRejected = "";
                      currentValue.advanceGiven = "0";
                      currentValue.lspAdvanceGiven = "0";
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
                      Vue.$toast.open({
                        message: "Data will be saved once you are back online.",
                        type: "success",
                        position: "top",
                      });
                      console.log(
                        "Successfully updated digital signature details in IndexedDB"
                      );
                    };
                  });
              }
            };
          };
        }
        //IndexedDb Code ends here
        else {
          currentValue.getAgreementData().then(function (resolve) {
            console.log(resolve);
            currentValue
              .generateAgreementFile(inpData.withProducerDigitalSignature)
              .then(function (fileBlob) {
                console.log(fileBlob);
                currentValue
                  .uploadAgreemntDoc(currentValue.currentItem.Id, fileBlob)
                  .then(function (url) {
                    console.log("uploaded");
                    console.log(url);
                    inpData.agreementDocumentUrl = url;
                    currentValue.withProducerErrorMessage = "";
                    var dbRef = firebase.database().ref("serviceRequest/");
                    dbRef
                      .orderByChild("serviceRequestId")
                      .equalTo(currentValue.currentItem.Id)
                      .on("child_added", function (data) {
                        var ref = firebase
                          .database()
                          .ref("serviceRequest/" + data.key);
                        ref
                          .update(inpData)
                          .then(function () {
                            currentValue.seen = false;
                            Vue.$toast.open({
                              message: "Status updated successfully.",
                              type: "success",
                              position: "top",
                            });
                            currentValue.seen = false;
                            currentValue.producerContainer = false;
                            currentValue.emptyContainer = true;
                            currentValue.selectedItem = null;

                            currentValue.temperature = "";
                            currentValue.ambientTemp = "";
                            currentValue.crates = "";
                            currentValue.cratesPartVal = "0";
                            currentValue.fruitHarvested = "";
                            currentValue.fruitRejected = "";
                            currentValue.advanceGiven = "0";
                            currentValue.lspAdvanceGiven = "0";
                            currentValue.startQRCode = "";
                            currentValue.endQRCode = "";
                            currentValue.currency = "HTG";

                            currentValue.paymentMethod = "";
                            currentValue.selectedBank = "";
                            currentValue.accountNumber = "";
                            currentValue.selectedPaymentCurrency = "HTG";
                            currentValue.withProducerNote = "";

                            currentValue.$refs[
                              "digital-signature-modal"
                            ].hide();
                            currentValue.seen = false;
                          })
                          .catch(function (error) {
                            currentValue.seen = false;
                            currentValue.erroMessage = error.message;
                            currentValue.$refs[
                              "digital-signature-modal"
                            ].hide();
                          });
                      });
                  });
              });
          });
        }
      }
    },
    showSignatureModal: function () {
      this.$refs["digital-signature-modal"].show();
    },
    hideSignatureModal: function () {
      this.$refs["digital-signature-modal"].hide();
    },
    hideQrcodeModal: function () {
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
              type: "error",
            });
          }
        } else {
          this.seen = false;
          Vue.$toast.open({
            message: "Start and end QR Codes length must be same.",
            position: "top",
            type: "error",
          });
        }
      } else {
        this.seen = false;
        Vue.$toast.open({
          message: "Start and end QR Codes are not matching.",
          position: "top",
          type: "error",
        });
      }
    },
    getPackHouse: function (event) {
      var currentVal = this;
      currentVal.packHouse = [];
      let ref = null;
      if (localStorage.systemRole == 99) {
        ref = firebase.database().ref().child("masters").child("packHouse");
      } else {
        ref = firebase
          .database()
          .ref()
          .child("masters")
          .child("packHouse")
          .orderByChild("organizationKey")
          .equalTo(localStorage.organizationKey);
      }
      // var ref = firebase
      //   .database()
      //   .ref()
      //   .child("masters")
      //   .child("packHouse");

      ref.on("value", function (snapshot) {
        snapshot.forEach((requestData) => {
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
          type: "success",
        });
      } else {
        Vue.$toast.open({
          message: `QR ${qrcode} already scanned.`,
          type: "error",
          position: "top",
        });
      }
    },
    continueWithTemperatureWarning: function () {
      this.$refs["confirm-warning-modal"].hide();
      var currentValue = this;
      this.seen = true;
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
            position: "top",
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
            position: "top",
          });
        } else {
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
            withProducerAddedBy: localStorage.userName,
            lspAdvanceGivenCurrency: currentValue.lspAdvanceGivenCurrency,
            lspAdvanceGiven: currentValue.lspAdvanceGiven,
            PaidByLSP: currentValue.PaidByLSP ? currentValue.PaidByLSP : false,
          };
          //IndexedDb Code starts here
          if (!this.internetAvailable) {
            var arrayQRC = [];
            this.qrcodesToUpload.forEach((ele) => {
              arrayQRC.push(ele.toString());
            });
            let db;
            let request = window.indexedDB.open("pickups_db_withproducer", 1);
            request.onsuccess = () => {
              console.log("Database opened successfully");
              db = request.result;
              let transaction = db.transaction(["pickups"], "readwrite");
              let objectStore = transaction.objectStore("pickups", {
                keyPath: "serviceRequestId",
              });
              //For updating the existing service request on click of save button
              var requestWP = objectStore.get(currentValue.currentItem.Id);
              requestWP.onerror = (event) => {
                console.log("Failed to get the data from IndexedDB");
              };
              requestWP.onsuccess = (event) => {
                var data = event.target.result;
                //adding new values
                if (data == undefined) {
                  let newItem = {
                    serviceRequestId: currentValue.currentItem.Id,
                    status: "With Producer",
                    temperature: currentValue.temperature,
                    "ambient Temp": currentValue.ambientTemp,
                    crates: Number(currentValue.crates) + Number(cratesPartVal),
                    fruitsHarvested: currentValue.fruitHarvested,
                    fruitRejected: currentValue.fruitRejected,
                    advanceGiven: currentValue.advanceGiven,
                    conversionRate: currentValue.conversionRate,
                    conversionCurrency: "USD",
                    currency: currentValue.currency,
                    lotQRCodeImages: "",
                    paymentMethod: currentValue.paymentMethod,
                    SelectedBank: currentValue.selectedBank,
                    selectedBankCode: selectedBankCode,
                    accounttype: currentValue.accounttype,
                    AccountNumber: currentValue.accountNumber,
                    BankCurrency:
                      currentValue.selectedPaymentCurrency == "HTG"
                        ? "GOURDE"
                        : currentValue.selectedPaymentCurrency == "USD"
                        ? "USD"
                        : null,
                    selectedNGO: currentValue.selectedNGO,
                    AdditionalNotes: currentValue.withProducerNote,
                    status: "With Producer",
                    withProducerQrCodeFile: arrayQRC,
                    startCrateQRCode: currentValue.startQRCode,
                    endCrateQRCode: currentValue.endQRCode,
                    isAgreed: currentValue.isAgreed,
                    lspAdvanceGivenCurrency:
                      currentValue.lspAdvanceGivenCurrency,
                    lspAdvanceGiven: currentValue.lspAdvanceGiven,
                    displayId: currentValue.currentItem.displayId,
                    PaidByLSP: currentValue.PaidByLSP
                      ? currentValue.PaidByLSP
                      : false,
                  };
                  let transaction = db.transaction(["pickups"], "readwrite");
                  let objectStore = transaction.objectStore("pickups", {
                    keyPath: "serviceRequestId",
                  });
                  let requestObject = objectStore.add(newItem);
                  requestObject.onsuccess = () => {
                    //IndexedDB code starts here - for updating the pickupslist in indexedDB
                    let dbList;
                    let requestList = window.indexedDB.open(
                      "pickupsList_db",
                      1
                    );
                    requestList.onsuccess = function () {
                      console.log("Database opened successfully");
                      dbList = requestList.result;
                      console.log(db);
                      var pickupsListArray = [];
                      let transactionList = dbList.transaction(
                        ["pickupsList"],
                        "readwrite"
                      );
                      let objectStoreList = transactionList.objectStore(
                        "pickupsList",
                        {
                          keyPath: "key",
                        }
                      );
                      var requestWPList = objectStoreList.get(1);
                      requestWPList.onsuccess = (event) => {
                        pickupsListArray = event.target.result;
                        currentValue.pickupsList = [];
                        pickupsListArray.values.forEach((item, index) => {
                          if (item.Id == currentValue.currentItem.Id) {
                            item.status = "With Producer";
                            item.CurrentStatus = "With Producer";
                          } else {
                            if (item.status == "Enroute Producer") {
                              currentValue.pickupsList.push(item);
                            }
                          }
                          //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                          var checkIndex = index + 1;
                          if (pickupsListArray.values.length == checkIndex) {
                            let transactionUpdateList = dbList.transaction(
                              ["pickupsList"],
                              "readwrite"
                            );
                            let objectStoreUpdateList =
                              transactionUpdateList.objectStore("pickupsList", {
                                keyPath: "key",
                              });
                            let requestObjectUpdateList;
                            requestObjectUpdateList =
                              objectStoreUpdateList.put(pickupsListArray);
                            requestObjectUpdateList.onsuccess = () => {
                              currentValue.seen = false;
                              console.log("pickups list updated successfully");
                            };
                          }
                        });
                      };
                    };
                    requestList.onupgradeneeded = function (e) {
                      let dbList = e.target.result;
                      let objectStoreList = dbList.createObjectStore(
                        "pickupsList",
                        {
                          keyPath: "key",
                        }
                      );
                      console.log("Database setup complete");
                    };
                    //IndexedDB code ends here - for updating the pickupslist in indexedDB
                    currentValue.$refs["digital-signature-modal"].show();
                    currentValue.seen = false;
                    console.log("added successfully");
                  };
                  transaction.oncomplete = () => {
                    console.log(
                      "Transaction completed: database modification finished."
                    );
                    db.close();
                  };
                  transaction.onerror = (error) => {
                    console.log("Transaction not opened due to error");
                    console.log(error);
                  };
                } else {
                  data.status = "With Producer";
                  data.temperature = currentValue.temperature;
                  data["ambient Temp"] = currentValue.ambientTemp;
                  data.crates =
                    Number(currentValue.crates) + Number(cratesPartVal);
                  data.fruitsHarvested = currentValue.fruitHarvested;
                  data.fruitRejected = currentValue.fruitRejected;
                  data.advanceGiven = currentValue.advanceGiven;
                  data.conversionRate = currentValue.conversionRate;
                  data.conversionCurrency = "USD";
                  data.currency = currentValue.currency;
                  data.lotQRCodeImages = "";
                  data.paymentMethod = currentValue.paymentMethod;
                  data.SelectedBank = currentValue.selectedBank;
                  data.selectedBankCode = selectedBankCode;
                  data.accounttype = currentValue.accounttype;
                  data.AccountNumber = currentValue.accountNumber;
                  data.BankCurrency =
                    currentValue.selectedPaymentCurrency == "HTG"
                      ? "GOURDE"
                      : currentValue.selectedPaymentCurrency == "USD"
                      ? "USD"
                      : null;
                  data.selectedNGO = currentValue.selectedNGO;
                  data.AdditionalNotes = currentValue.withProducerNote;
                  data.status = "With Producer";
                  data.withProducerQrCodeFile = arrayQRC;
                  data.startCrateQRCode = currentValue.startQRCode;
                  data.endCrateQRCode = currentValue.endQRCode;
                  data.isAgreed = currentValue.isAgreed;
                  data.displayId = currentValue.currentItem.displayId;
                  data.lspAdvanceGivenCurrency =
                    currentValue.lspAdvanceGivenCurrency;
                  data.lspAdvanceGiven = currentValue.lspAdvanceGiven;
                  var requestUpdate = objectStore.put(data);
                  requestUpdate.onerror = (event) => {
                    db.close();
                    console.log(
                      "Failed to update With Producer details in IndexedDB"
                    );
                  };
                  requestUpdate.onsuccess = (event) => {
                    //IndexedDB code starts here - for updating the pickupslist in indexedDB
                    let dbList;
                    let requestList = window.indexedDB.open(
                      "pickupsList_db",
                      1
                    );
                    requestList.onsuccess = function () {
                      console.log("Database opened successfully");
                      dbList = requestList.result;
                      console.log(db);
                      var pickupsListArray = [];
                      let transactionList = dbList.transaction(
                        ["pickupsList"],
                        "readwrite"
                      );
                      let objectStoreList = transactionList.objectStore(
                        "pickupsList",
                        {
                          keyPath: "key",
                        }
                      );
                      var requestWPList = objectStoreList.get(1);
                      requestWPList.onsuccess = (event) => {
                        pickupsListArray = event.target.result;
                        currentValue.pickupsList = [];
                        pickupsListArray.values.forEach((item, index) => {
                          if (item.Id == currentValue.currentItem.Id) {
                            item.status = "With Producer";
                            item.CurrentStatus = "With Producer";
                          } else {
                            if (item.status == "Enroute Producer") {
                              currentValue.pickupsList.push(item);
                            }
                          }
                          //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                          var checkIndex = index + 1;
                          if (pickupsListArray.values.length == checkIndex) {
                            let transactionUpdateList = dbList.transaction(
                              ["pickupsList"],
                              "readwrite"
                            );
                            let objectStoreUpdateList =
                              transactionUpdateList.objectStore("pickupsList", {
                                keyPath: "key",
                              });
                            let requestObjectUpdateList;
                            requestObjectUpdateList =
                              objectStoreUpdateList.put(pickupsListArray);
                            requestObjectUpdateList.onsuccess = () => {
                              currentValue.seen = false;
                              console.log("pickups list updated successfully");
                            };
                          }
                        });
                      };
                    };
                    requestList.onupgradeneeded = function (e) {
                      let dbList = e.target.result;
                      let objectStoreList = dbList.createObjectStore(
                        "pickupsList",
                        {
                          keyPath: "key",
                        }
                      );
                      console.log("Database setup complete");
                    };
                    //IndexedDB code ends here - for updating the pickupslist in indexedDB
                    currentValue.$refs["digital-signature-modal"].show();
                    currentValue.seen = false;
                    console.log(
                      "Successfully updated With Producer details in IndexedDB"
                    );
                  };
                }
              };
            };
          } else {
            this.updateWithProducerDetails(inpData);
          }
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
            position: "top",
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
            position: "top",
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
            withProducerAddedBy: localStorage.userName,
            lspAdvanceGivenCurrency: this.lspAdvanceGivenCurrency,
            lspAdvanceGiven: this.lspAdvanceGiven,
            PaidByLSP: this.PaidByLSP ? this.PaidByLSP : false,
          };
          //IndexedDb Code starts here
          if (!this.internetAvailable) {
            var arrayQRC = [];
            this.qrcodesToUpload.forEach((ele) => {
              arrayQRC.push(ele.toString());
            });
            let db;
            let request = window.indexedDB.open("pickups_db_withproducer", 1);
            request.onsuccess = () => {
              console.log("Database opened successfully");
              db = request.result;
              let transaction = db.transaction(["pickups"], "readwrite");
              let objectStore = transaction.objectStore("pickups", {
                keyPath: "serviceRequestId",
              });
              //For updating the existing service request on click of save button
              var requestWP = objectStore.get(currentValue.currentItem.Id);
              requestWP.onerror = (event) => {
                console.log("Failed to get the data from IndexedDB");
              };
              requestWP.onsuccess = (event) => {
                var data = event.target.result;
                //adding new values
                if (data == undefined) {
                  let newItem = {
                    serviceRequestId: currentValue.currentItem.Id,
                    status: "With Producer",
                    temperature: currentValue.temperature,
                    "ambient Temp": currentValue.ambientTemp,
                    crates: Number(currentValue.crates) + Number(cratesPartVal),
                    fruitsHarvested: currentValue.fruitHarvested,
                    fruitRejected: currentValue.fruitRejected,
                    advanceGiven: currentValue.advanceGiven,
                    conversionRate: currentValue.conversionRate,
                    conversionCurrency: "USD",
                    currency: currentValue.currency,
                    lotQRCodeImages: "",
                    paymentMethod: currentValue.paymentMethod,
                    mobilePaymentOperator: currentValue.mobilePaymentOperator,
                    mobilePaymentNumber: currentValue.mobilePaymentNumber,
                    mobilePaymentCurrency:
                      currentValue.selectedPaymentCurrency == "HTG"
                        ? "GOURDE"
                        : currentValue.selectedPaymentCurrency == "USD"
                        ? "USD"
                        : null,
                    selectedNGO: currentValue.selectedNGO,
                    AdditionalNotes: currentValue.withProducerNote,
                    status: "With Producer",
                    withProducerQrCodeFile: arrayQRC,
                    startCrateQRCode: currentValue.startQRCode,
                    endCrateQRCode: currentValue.endQRCode,
                    isAgreed: currentValue.isAgreed,
                    lspAdvanceGivenCurrency:
                      currentValue.lspAdvanceGivenCurrency,
                    lspAdvanceGiven: currentValue.lspAdvanceGiven,
                    displayId: currentValue.currentItem.displayId,
                    PaidByLSP: currentValue.PaidByLSP
                      ? currentValue.PaidByLSP
                      : false,
                  };
                  let transaction = db.transaction(["pickups"], "readwrite");
                  let objectStore = transaction.objectStore("pickups", {
                    keyPath: "serviceRequestId",
                  });
                  let requestObject = objectStore.add(newItem);
                  requestObject.onsuccess = () => {
                    //IndexedDB code starts here - for updating the pickupslist in indexedDB
                    let dbList;
                    let requestList = window.indexedDB.open(
                      "pickupsList_db",
                      1
                    );
                    requestList.onsuccess = function () {
                      console.log("Database opened successfully");
                      dbList = requestList.result;
                      console.log(db);
                      var pickupsListArray = [];
                      let transactionList = dbList.transaction(
                        ["pickupsList"],
                        "readwrite"
                      );
                      let objectStoreList = transactionList.objectStore(
                        "pickupsList",
                        {
                          keyPath: "key",
                        }
                      );
                      var requestWPList = objectStoreList.get(1);
                      requestWPList.onsuccess = (event) => {
                        pickupsListArray = event.target.result;
                        currentValue.pickupsList = [];
                        pickupsListArray.values.forEach((item, index) => {
                          if (item.Id == currentValue.currentItem.Id) {
                            item.status = "With Producer";
                            item.CurrentStatus = "With Producer";
                          } else {
                            if (item.status == "Enroute Producer") {
                              currentValue.pickupsList.push(item);
                            }
                          }
                          //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                          var checkIndex = index + 1;
                          if (pickupsListArray.values.length == checkIndex) {
                            let transactionUpdateList = dbList.transaction(
                              ["pickupsList"],
                              "readwrite"
                            );
                            let objectStoreUpdateList =
                              transactionUpdateList.objectStore("pickupsList", {
                                keyPath: "key",
                              });
                            let requestObjectUpdateList;
                            requestObjectUpdateList =
                              objectStoreUpdateList.put(pickupsListArray);
                            requestObjectUpdateList.onsuccess = () => {
                              currentValue.seen = false;
                              console.log("pickups list updated successfully");
                            };
                          }
                        });
                      };
                    };
                    requestList.onupgradeneeded = function (e) {
                      let dbList = e.target.result;
                      let objectStoreList = dbList.createObjectStore(
                        "pickupsList",
                        {
                          keyPath: "key",
                        }
                      );
                      console.log("Database setup complete");
                    };
                    //IndexedDB code ends here - for updating the pickupslist in indexedDB
                    currentValue.$refs["digital-signature-modal"].show();
                    currentValue.seen = false;
                    console.log("added successfully");
                  };
                  transaction.oncomplete = () => {
                    console.log(
                      "Transaction completed: database modification finished."
                    );
                    db.close();
                  };
                  transaction.onerror = (error) => {
                    console.log("Transaction not opened due to error");
                    console.log(error);
                  };
                } else {
                  data.status = "With Producer";
                  data.temperature = currentValue.temperature;
                  data["ambient Temp"] = currentValue.ambientTemp;
                  data.crates =
                    Number(currentValue.crates) + Number(cratesPartVal);
                  data.fruitsHarvested = currentValue.fruitHarvested;
                  data.fruitRejected = currentValue.fruitRejected;
                  data.advanceGiven = currentValue.advanceGiven;
                  data.conversionRate = currentValue.conversionRate;
                  data.conversionCurrency = "USD";
                  data.currency = currentValue.currency;
                  data.lotQRCodeImages = "";
                  data.paymentMethod = currentValue.paymentMethod;
                  data.mobilePaymentOperator =
                    currentValue.mobilePaymentOperator;
                  data.mobilePaymentNumber = currentValue.mobilePaymentNumber;
                  data.mobilePaymentCurrency =
                    currentValue.selectedPaymentCurrency == "HTG"
                      ? "GOURDE"
                      : currentValue.selectedPaymentCurrency == "USD"
                      ? "USD"
                      : null;
                  data.selectedNGO = currentValue.selectedNGO;
                  data.AdditionalNotes = currentValue.withProducerNote;
                  data.status = "With Producer";
                  data.withProducerQrCodeFile = arrayQRC;
                  data.startCrateQRCode = currentValue.startQRCode;
                  data.endCrateQRCode = currentValue.endQRCode;
                  data.isAgreed = currentValue.isAgreed;
                  data.lspAdvanceGivenCurrency =
                    currentValue.lspAdvanceGivenCurrency;
                  data.lspAdvanceGiven = currentValue.lspAdvanceGiven;
                  data.displayId = currentValue.currentItem.displayId;
                  var requestUpdate = objectStore.put(data);
                  requestUpdate.onerror = (event) => {
                    console.log(
                      "Failed to update With Producer details in IndexedDB"
                    );
                  };
                  requestUpdate.onsuccess = (event) => {
                    //IndexedDB code starts here - for updating the pickupslist in indexedDB
                    let dbList;
                    let requestList = window.indexedDB.open(
                      "pickupsList_db",
                      1
                    );
                    requestList.onsuccess = function () {
                      console.log("Database opened successfully");
                      dbList = requestList.result;
                      console.log(db);
                      var pickupsListArray = [];
                      let transactionList = dbList.transaction(
                        ["pickupsList"],
                        "readwrite"
                      );
                      let objectStoreList = transactionList.objectStore(
                        "pickupsList",
                        {
                          keyPath: "key",
                        }
                      );
                      var requestWPList = objectStoreList.get(1);
                      requestWPList.onsuccess = (event) => {
                        pickupsListArray = event.target.result;
                        currentValue.pickupsList = [];
                        pickupsListArray.values.forEach((item, index) => {
                          if (item.Id == currentValue.currentItem.Id) {
                            item.status = "With Producer";
                            item.CurrentStatus = "With Producer";
                          } else {
                            if (item.status == "Enroute Producer") {
                              currentValue.pickupsList.push(item);
                            }
                          }
                          //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                          var checkIndex = index + 1;
                          if (pickupsListArray.values.length == checkIndex) {
                            let transactionUpdateList = dbList.transaction(
                              ["pickupsList"],
                              "readwrite"
                            );
                            let objectStoreUpdateList =
                              transactionUpdateList.objectStore("pickupsList", {
                                keyPath: "key",
                              });
                            let requestObjectUpdateList;
                            requestObjectUpdateList =
                              objectStoreUpdateList.put(pickupsListArray);
                            requestObjectUpdateList.onsuccess = () => {
                              currentValue.seen = false;
                              console.log("pickups list updated successfully");
                            };
                          }
                        });
                      };
                    };
                    requestList.onupgradeneeded = function (e) {
                      let dbList = e.target.result;
                      let objectStoreList = dbList.createObjectStore(
                        "pickupsList",
                        {
                          keyPath: "key",
                        }
                      );
                      console.log("Database setup complete");
                    };
                    //IndexedDB code ends here - for updating the pickupslist in indexedDB
                    currentValue.$refs["digital-signature-modal"].show();
                    currentValue.seen = false;
                    db.close();
                    console.log(
                      "Successfully updated With Producer details in IndexedDB"
                    );
                  };
                }
              };
            };
          }
          //IndexedDb Code ends here
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
            position: "top",
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
            withProducerAddedBy: localStorage.userName,
            withProducerQrCodeFile: arrayQRC,
            lspAdvanceGivenCurrency: this.lspAdvanceGivenCurrency,
            lspAdvanceGiven: this.lspAdvanceGiven,
            PaidByLSP: this.PaidByLSP ? this.PaidByLSP : false,
          };
          //IndexedDb Code starts here
          if (!this.internetAvailable) {
            var arrayQRC = [];
            this.qrcodesToUpload.forEach((ele) => {
              arrayQRC.push(ele.toString());
            });
            let db;
            let request = window.indexedDB.open("pickups_db_withproducer", 1);
            request.onsuccess = () => {
              console.log("Database opened successfully");
              db = request.result;
              let transaction = db.transaction(["pickups"], "readwrite");
              let objectStore = transaction.objectStore("pickups", {
                keyPath: "serviceRequestId",
              });
              //For updating the existing service request on click of save button
              var requestWP = objectStore.get(currentValue.currentItem.Id);
              requestWP.onerror = (event) => {
                console.log("Failed to get the data from IndexedDB");
              };
              requestWP.onsuccess = (event) => {
                var data = event.target.result;
                //adding new values
                if (data == undefined) {
                  let newItem = {
                    serviceRequestId: currentValue.currentItem.Id,
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
                    withProducerAddedBy: localStorage.userName,
                    withProducerQrCodeFile: arrayQRC,
                    lspAdvanceGivenCurrency: this.lspAdvanceGivenCurrency,
                    lspAdvanceGiven: this.lspAdvanceGiven,
                    displayId: currentValue.currentItem.displayId,
                    PaidByLSP: currentValue.PaidByLSP
                      ? currentValue.PaidByLSP
                      : false,
                  };
                  let transaction = db.transaction(["pickups"], "readwrite");
                  let objectStore = transaction.objectStore("pickups", {
                    keyPath: "serviceRequestId",
                  });
                  let requestObject = objectStore.add(newItem);
                  requestObject.onsuccess = () => {
                    //IndexedDB code starts here - for updating the pickupslist in indexedDB
                    let dbList;
                    let requestList = window.indexedDB.open(
                      "pickupsList_db",
                      1
                    );
                    requestList.onsuccess = function () {
                      console.log("Database opened successfully");
                      dbList = requestList.result;
                      console.log(db);
                      var pickupsListArray = [];
                      let transactionList = dbList.transaction(
                        ["pickupsList"],
                        "readwrite"
                      );
                      let objectStoreList = transactionList.objectStore(
                        "pickupsList",
                        {
                          keyPath: "key",
                        }
                      );
                      var requestWPList = objectStoreList.get(1);
                      requestWPList.onsuccess = (event) => {
                        pickupsListArray = event.target.result;
                        currentValue.pickupsList = [];
                        pickupsListArray.values.forEach((item, index) => {
                          if (item.Id == currentValue.currentItem.Id) {
                            item.status = "With Producer";
                            item.CurrentStatus = "With Producer";
                          } else {
                            if (item.status == "Enroute Producer") {
                              currentValue.pickupsList.push(item);
                            }
                          }
                          //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                          var checkIndex = index + 1;
                          if (pickupsListArray.values.length == checkIndex) {
                            let transactionUpdateList = dbList.transaction(
                              ["pickupsList"],
                              "readwrite"
                            );
                            let objectStoreUpdateList =
                              transactionUpdateList.objectStore("pickupsList", {
                                keyPath: "key",
                              });
                            let requestObjectUpdateList;
                            requestObjectUpdateList =
                              objectStoreUpdateList.put(pickupsListArray);
                            requestObjectUpdateList.onsuccess = () => {
                              currentValue.seen = false;
                              console.log("pickups list updated successfully");
                            };
                          }
                        });
                      };
                    };
                    requestList.onupgradeneeded = function (e) {
                      let dbList = e.target.result;
                      let objectStoreList = dbList.createObjectStore(
                        "pickupsList",
                        {
                          keyPath: "key",
                        }
                      );
                      console.log("Database setup complete");
                    };
                    //IndexedDB code ends here - for updating the pickupslist in indexedDB
                    currentValue.$refs["digital-signature-modal"].show();
                    currentValue.seen = false;
                    console.log("added successfully");
                  };
                  transaction.oncomplete = () => {
                    console.log(
                      "Transaction completed: database modification finished."
                    );
                    db.close();
                  };
                  transaction.onerror = (error) => {
                    console.log("Transaction not opened due to error");
                    console.log(error);
                  };
                } else {
                  data.temperature = this.temperature;
                  data["ambient Temp"] = this.ambientTemp;
                  data.crates = Number(this.crates) + Number(cratesPartVal);
                  data.fruitsHarvested = this.fruitHarvested;
                  data.fruitRejected = this.fruitRejected;
                  data.advanceGiven = this.advanceGiven;
                  data.selectedNGO = this.selectedNGO;
                  data.conversionRate = this.conversionRate;
                  data.conversionCurrency = "USD";
                  data.currency = this.currency;
                  data.lotQRCodeImages = "";
                  data.paymentMethod = this.paymentMethod;
                  data.contactnumber = this.contactNumber;
                  data.additionalNotes = this.withProducerNote;
                  data.status = "With Producer";
                  data.withProducerQrCodeFile = this.qrcodesToUpload;
                  data.startCrateQRCode = this.startQRCode;
                  data.endCrateQRCode = this.endQRCode;
                  data.isAgreed = this.isAgreed;
                  data.cashPaymentCurrency =
                    this.selectedPaymentCurrency == "HTG"
                      ? "GOURDE"
                      : this.selectedPaymentCurrency == "USD"
                      ? "USD"
                      : null;
                  data.withProducerAddedBy = localStorage.userName;
                  data.withProducerQrCodeFile = arrayQRC;
                  data.lspAdvanceGivenCurrency = this.lspAdvanceGivenCurrency;
                  data.lspAdvanceGiven = this.lspAdvanceGiven;
                  data.displayId = currentValue.currentItem.displayId;
                  var requestUpdate = objectStore.put(data);
                  requestUpdate.onerror = (event) => {
                    console.log(
                      "Failed to update With Producer details in IndexedDB"
                    );
                  };
                  requestUpdate.onsuccess = (event) => {
                    //IndexedDB code starts here - for updating the pickupslist in indexedDB
                    let dbList;
                    let requestList = window.indexedDB.open(
                      "pickupsList_db",
                      1
                    );
                    requestList.onsuccess = function () {
                      console.log("Database opened successfully");
                      dbList = requestList.result;
                      console.log(db);
                      var pickupsListArray = [];
                      let transactionList = dbList.transaction(
                        ["pickupsList"],
                        "readwrite"
                      );
                      let objectStoreList = transactionList.objectStore(
                        "pickupsList",
                        {
                          keyPath: "key",
                        }
                      );
                      var requestWPList = objectStoreList.get(1);
                      requestWPList.onsuccess = (event) => {
                        pickupsListArray = event.target.result;
                        currentValue.pickupsList = [];
                        pickupsListArray.values.forEach((item, index) => {
                          if (item.Id == currentValue.currentItem.Id) {
                            item.status = "With Producer";
                            item.CurrentStatus = "With Producer";
                          } else {
                            if (item.status == "Enroute Producer") {
                              currentValue.pickupsList.push(item);
                            }
                          }
                          //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                          var checkIndex = index + 1;
                          if (pickupsListArray.values.length == checkIndex) {
                            let transactionUpdateList = dbList.transaction(
                              ["pickupsList"],
                              "readwrite"
                            );
                            let objectStoreUpdateList =
                              transactionUpdateList.objectStore("pickupsList", {
                                keyPath: "key",
                              });
                            let requestObjectUpdateList;
                            requestObjectUpdateList =
                              objectStoreUpdateList.put(pickupsListArray);
                            requestObjectUpdateList.onsuccess = () => {
                              currentValue.seen = false;
                              console.log("pickups list updated successfully");
                            };
                          }
                        });
                      };
                    };
                    requestList.onupgradeneeded = function (e) {
                      let dbList = e.target.result;
                      let objectStoreList = dbList.createObjectStore(
                        "pickupsList",
                        {
                          keyPath: "key",
                        }
                      );
                      console.log("Database setup complete");
                    };
                    //IndexedDB code ends here - for updating the pickupslist in indexedDB
                    currentValue.$refs["digital-signature-modal"].show();
                    currentValue.seen = false;
                    db.close();
                    console.log(
                      "Successfully updated With Producer details in IndexedDB"
                    );
                  };
                }
              };
            };
          }
          //IndexedDb Code ends here
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
        Router.push("collector-dashboard");
      }
    },
    QRCodeViewModalOpened() {
      this.seen = false;
    },
    selectedAccountType: function (val) {
      if (val == 0) {
        this.accounttype = "Savings";
      } else if (val == 1) {
        this.accounttype = "Current";
      }
    },
    createWithProducerAPICall(inpData) {
      let currentVal = this;
      debugger;
      console.log(currentVal.PaidByLSP);
      if (inpData.paymentMethod == "Wire") {
        const wireData = {
          id: inpData.serviceRequestId,
          status: inpData.status,
          temperature: inpData.temperature,
          ambientTemp: inpData["ambient Temp"],
          crates: inpData.crates,
          fruitsHarvested: inpData.fruitsHarvested,
          fruitRejected: inpData.fruitRejected,
          advanceGiven: inpData.advanceGiven,
          ngo: inpData.selectedNGO,
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
            BankCurrency: inpData.BankCurrency,
            accountType: inpData.accounttype,
          },
          AdditionalNotes: inpData.additionalNotes,
          withProducerTimeStamp: moment()
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss")
            .toString(),
          withProducerQrCodeFile: inpData.withProducerQrCodeFile,
          lspAdvanceGivenCurrency: inpData.lspAdvanceGivenCurrency,
          lspAdvanceGiven: inpData.lspAdvanceGiven,
        };
        currentVal.axios
          .post(
            `${getConfigVars().BASE_URL}50009/api/v1.0/with-producer`,
            wireData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken,
              },
            }
          )
          .then(function (response) {
            currentVal.updateReportData(inpData);
          })
          .catch(function (error) {
            console.log(error.message);
            let errorObject = JSON.parse(JSON.stringify(error));
            console.log(errorObject);
            if (
              errorObject != undefined &&
              errorObject.message != undefined &&
              errorObject.message.indexOf("401") > -1
            ) {
              firebase
                .auth()
                .currentUser.getIdToken(true)
                .then((idtoken) => {
                  localStorage.IDtoken = "";
                  localStorage.IDtoken = idtoken;
                  currentVal.createWithProducerAPICall(inpData);
                });
            } else {
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
            contactnumber: inpData.contactnumber,
          },
          AdditionalNotes: inpData.additionalNotes,
          withProducerTimeStamp: moment()
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss")
            .toString(),
          withProducerQrCodeFile: inpData.withProducerQrCodeFile,
          lspAdvanceGivenCurrency: inpData.lspAdvanceGivenCurrency,
          lspAdvanceGiven: inpData.lspAdvanceGiven,
        };
        currentVal.axios
          .post(
            `${getConfigVars().BASE_URL}50009/api/v1.0/with-producer`,
            cashdata,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken,
              },
            }
          )
          .then(function (response) {
            currentVal.updateReportData(inpData);
          })
          .catch(function (error) {
            console.log(error.message);
            //alert("fail");
            //refresh token
            let errorObject = JSON.parse(JSON.stringify(error));
            console.log(errorObject);
            if (
              errorObject != undefined &&
              errorObject.message != undefined &&
              errorObject.message.indexOf("401") > -1
            ) {
              firebase
                .auth()
                .currentUser.getIdToken(true)
                .then((idtoken) => {
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
            mobilePaymentCurrency: inpData.mobilePaymentCurrency,
          },
          AdditionalNotes: inpData.additionalNotes,
          withProducerTimeStamp: moment()
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss")
            .toString(),
          withProducerQrCodeFile: inpData.withProducerQrCodeFile,
          lspAdvanceGivenCurrency: inpData.lspAdvanceGivenCurrency,
          lspAdvanceGiven: inpData.lspAdvanceGiven,
        };
        currentVal.axios
          .post(
            `${getConfigVars().BASE_URL}50009/api/v1.0/with-producer`,
            mobiledata,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken,
              },
            }
          )
          .then(function (response) {
            currentVal.updateReportData(inpData);
          })
          .catch(function (error) {
            console.log(error.message);
            //alert("fail");
            //refresh token
            let errorObject = JSON.parse(JSON.stringify(error));
            console.log(errorObject);
            if (
              errorObject != undefined &&
              errorObject.message != undefined &&
              errorObject.message.indexOf("401") > -1
            ) {
              firebase
                .auth()
                .currentUser.getIdToken(true)
                .then((idtoken) => {
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
    createRejectAPI(inpData) {
      let currentVal = this;
      const data = {
        id: inpData.serviceRequestId,
        status: inpData.status,
        rejectedOn: moment
          .utc(String(inpData.rejectedOn))
          .format("YYYY-MM-DDTHH:mm:ss"),
        rejectReason: inpData.rejectReason,
        rejectAddionalNote: inpData.rejectAddionalNote,
      };
      currentVal.axios
        .post(`${getConfigVars().BASE_URL}50009/api/v1.0/reject-lot`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.IDtoken,
          },
        })
        .then(function (response) {
          //alert("pass");
          currentVal.checkPenalityAPI(inpData.serviceRequestId);
        })
        .catch(function (error) {
          console.log(error.message);
          //alert("fail");
          //refresh token
          let errorObject = JSON.parse(JSON.stringify(error));
          console.log(errorObject);
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
                currentVal.createRejectAPI(inpData);
              });
          }
        });
    },
    checkPenalityAPI(serviceId) {
      console.log(serviceId);
      let currentVal = this;
      const data = {
        id: serviceId,
      };
      currentVal.axios
        .post(`${getConfigVars().BASE_URL}50005/api/v1.0/penalties`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.IDtoken,
          },
        })
        .then(function (response) {
          //alert("pass");
        })
        .catch(function (error) {
          console.log(error.message);
          //alert("fail");
          //refresh token
          let errorObject = JSON.parse(JSON.stringify(error));
          console.log(errorObject);
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
                currentVal.checkPenalityAPI(serviceId);
              });
          }
        });
    },
    showAgreement() {
      const vm = this;
      firebase
        .database()
        .ref("serviceRequest/")
        .orderByChild("serviceRequestId")
        .equalTo(vm.currentItem.Id)
        .on("child_added", function (data) {
          console.log(data.val());
          const {
            collectionPoint,
            dateOfPickup,
            producer,
            farmerId,
            town,
            product,
          } = data.val();
          const _produce = product.toLowerCase();
          vm.agreementData = {
            collectionPoint,
            dateOfPickup,
            producer,
            farmerId,
            town,
            produce: (function () {
              if (_produce == "mango") {
                return "Mango";
              } else if (_produce == "avocado") {
                return "Zaboka";
              } else if (_produce == "pineapple") {
                return "Anana";
              } else {
                return "Invalid Fruit";
              }
            })(),
            agreementDate: moment()
              .utc()
              .format("MMM DD, YYYY hh:mm A")
              .toString(),
          };
          //  vm.$refs["agreement-modal"].show()
        });
    },
    getAgreementData() {
      const vm = this;
      return new Promise(
        function (resolve, reject) {
          firebase
            .database()
            .ref("serviceRequest/")
            .orderByChild("serviceRequestId")
            .equalTo(vm.currentItem.Id)
            .on("child_added", function (data) {
              console.log(data.val());
              const {
                collectionPoint,
                dateOfPickup,
                producer,
                farmerId,
                town,
                product,
              } = data.val();
              const _produce = product.toLowerCase();
              vm.agreementData = {
                collectionPoint,
                dateOfPickup,
                producer,
                farmerId,
                town,
                produce: (function () {
                  if (_produce == "mango") {
                    return "Mango";
                  } else if (_produce == "avocado") {
                    return "Zaboka";
                  } else if (_produce == "pineapple") {
                    return "Anana";
                  } else {
                    return "Invalid Fruit";
                  }
                })(),
                agreementDate: moment()
                  .utc()
                  .format("MMM DD, YYYY hh:mm A")
                  .toString(),
              };
              resolve("resolved");
            });
        },
        function (err) {
          console.log(err);
        }
      );
    },
    generateAgreementFile(signatureBlob) {
      console.log(signatureBlob);
      return new Promise(function (resolve, reject) {
        var doc = new jsPDF("p", "pt", "letter");
        var elementHandler = {
          "#ignorePDF": function (element, renderer) {
            return true;
          },
        };
        var margins = {
          top: 80,
          bottom: 60,
          left: 80,
          width: 650,
        };

        var src = window.document.getElementById("agreementterms").innerHTML;
        var varNewElem = document.createElement("table");
        varNewElem.setAttribute("id", "pdfTableContent");
        varNewElem.setAttribute("style", "width:100%");
        varNewElem.innerHTML = src;

        doc.html(varNewElem, {
          callback: function (doc) {
            console.log("before signature");
            //doc.save();

            doc.addImage(signatureBlob, "JPEG", 70, 170, 150, 150);

            //  doc.save();
            const blobData = doc.output("blob");
            resolve(blobData);
          },
          x: 10,
          y: 10,
        });
      }, 100);
    },
    uploadAgreemntDoc(serviceRequestId, blobFile) {
      return new Promise(function (resolve, reject) {
        var storageRef = firebase
          .storage()
          .ref(`uploaded-files/agreements/${serviceRequestId}.pdf`);
        const uploadTask = storageRef.put(blobFile);
        uploadTask.on(
          "state_changed",
          (snapshot) => console.log(snapshot),
          (error) => reject(error),
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
              resolve(url);
            });
          }
        );
      });
    },

    saveFileToBlob(blobFile) {
      console.log(blobFile);
      const storageRef = firebase
        .storage()
        .ref(`uploaded-files/agreements/${this.currentItem.Id}.pdf`);
      const uploadTask = storageRef.put(blobFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => console.log(snapshot),
        (error) => console.log(error),
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            alert(url);
          });
        }
      );
    },
    goToCollectorDashboard() {
      Router.push("collector-dashboard");
    },
    uploadRejectedFruitsImages(inpData) {
      const vm = this;
      return new Promise((resolve, reject) => {
        if (inpData.fruitsRejectedImageBlobs.length == 0) {
          resolve("no images to upload.");
        } else {
          inpData.fruitsRejectedImageBlobs.forEach((image, index) => {
            const uploadRef = firebase
              .storage()
              .ref(
                `uploaded-files/with-producer-fruits-rejected/${vm.currentItem.Id}/`
              );

            const uploadTask = uploadRef.put(image);

            uploadTask.on(
              "state_changed",
              (snapshot) => console.log(snapshot),
              (err) => console.log(err),
              () => {
                uploadTask.snapshot.ref
                  .getDownloadURL()
                  .then((url) => {
                    console.log(url);
                    if (index == inpData.fruitsRejectedImageBlobs.length - 1) {
                      resolve("uploaded");
                    }
                  })
                  .catch((err) => reject(err));
              }
            );
          });
        }
      });
    },
    checkInternetStatus() {
      const vm = this;
      return new Promise((resolve, reject) => {
        vm.axios
          .get(`${getConfigVars().BASE_URL}50005/api/v1.0/templateendpoint`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          })
          .then(() => {
            console.log("internet available");
            vm.internetAvailable = true;
            resolve("available");
          })
          .catch((error) => {
            console.log(error);
            console.log(error.message);
            let errorObject = JSON.parse(JSON.stringify(error));
            console.log(errorObject);
            if (
              errorObject != undefined &&
              errorObject.message != undefined &&
              errorObject.message.indexOf("401") > -1
            ) {
              console.log("internet available");
              vm.internetAvailable = true;
              resolve("available");
            }
            if (error.status >= 200 && error.status < 300) {
              vm.internetAvailable = true;
              resolve("available");
            } else {
              vm.internetAvailable = false;
              resolve("not available");
            }
          });
      });
    },
    selectCashPaymentMode(val) {
      const vm = this;
      console.log("mode = " + val);
      if (val == 1) {
        vm.PaidByLSP = true;
      }
    },
  },
};
</script>
<style>
#pdfTableContent {
  width: 540px !important;
  height: auto !important;
}
#pdfTableContent tbody {
  width: 100% !important;
}
#pdfTableContent tr,
#pdfTableContent td {
  background-color: #fff !important;
  color: #000 !important;
  width: 100% !important;
}
</style>
<style>
.lbl-ph {
  color: #fff;
  float: left;
}
#digital-signature-modal .modal-body,
#digital-signature-modal .modal-content {
  min-width: 800px !important;
  max-width: 800px !important;
  margin: 0px auto !important;
  width: auto !important;
  min-height: 570px !important;
  max-height: 570px !important;
  overflow-y: scroll;
  color: #fff;
  font-size: 12px;
  overflow-x: hidden;
}
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
  max-height: 280px;
  overflow-y: scroll;
  background-color: white !important;
  color: black !important;
}
.agreementterms {
  max-height: 280px;
  overflow-y: scroll;
  background-color: white !important;
  color: black !important;
}
.scroll-visible {
  max-height: 280px;
  overflow-y: visible;
}
.agreementterms > tr > td {
  /* background-color: white; */
  color: black !important;
}
.printingPdf > tr > td {
  color: black !important;
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
#digital-signature-modal___BV_modal_header_ .close {
  display: none;
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
.back-to-dashboard-btn {
  float: right;
  position: relative;
  right: 16px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.616);
  border-radius: 5px 5px 0px 0px;
  border: 1px solid #000;
  color: #fff;
  margin: 10px 10px -20px 10px;
}
.dashboard-container {
  width: 100%;
  clear: both;
}
.with-producer-labels {
  float: left;
  color: #fff;
  padding-top: 10px;
}
@media only screen and (max-width: 780px) {
  #digital-signature-modal .modal-body,
  #digital-signature-modal .modal-content {
    min-width: 720px !important;
    max-width: 720px !important;
    margin: 0px auto !important;
  }
}
@media only screen and (max-width: 360px) {
  #digital-signature-modal .modal-body,
  #digital-signature-modal .modal-content {
    min-width: 340px !important;
    max-width: 340px !important;
    margin: 0px auto !important;
  }
}
.pdf-table-style {
  background-color: white !important;
  color: black !important;
}
.pdf-table-style tr td {
  background-color: white !important;
  color: black !important;
}
.pdf-table-style > tr > td {
  background-color: white !important;
  color: black !important;
}
</style>
