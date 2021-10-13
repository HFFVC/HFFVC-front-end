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
          <h3 class="heading">{{ $t("Active Batches", "Active Batches") }}</h3>
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
              <template slot="batchId" slot-scope="props">
                <div
                  class="sell-exclamation-wrap tooltip sell-exclamation-tooltip"
                >
                  <span class="tooltiptext sell-exclamation-tooltiptext">
                    Loading/Unloading information has not been furnished for
                    this batch
                  </span>
                  <img
                    class="sell-exclamation"
                    v-if="!props.row.isSellCompleted"
                    src="../../assets/images/exclamation_symbol.png"
                  />
                </div>
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
              <template slot="Sell" slot-scope="props">
                <div v-if="props.row.isMaintain">
                  <a class="btn-icn" @click="sellBatch(props.row)">
                    <img
                      class="location-img"
                      src="../../assets/images/sell_batches.png"
                    />
                  </a>
                </div>
              </template>
              <template slot="Invoice" slot-scope="props">
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
            <label class="input-label">{{ $t("Proforma No") }}</label>
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
              <!-- <input
                class="input-label input-readonly-label"
                v-on:click="stageSelection('Documents')"
                value="Documents"
                v-bind:class="{ active: selectedStage == 'Documents' }"
                readonly
              />-->
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
                v-on:click="stageSelection('Cost of Ripening')"
                v-bind:class="{ active: selectedStage == 'Cost of Ripening' }"
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
              <perfect-scrollbar
                class="maintain-modal-scroll"
                id="thisistheone"
              >
                <div
                  class="input-wrap larvae-input-wrap"
                  v-if="selectedStage == 'Arrival & Destination'"
                >
                  <div class="inp-container">
                    <label class="input-label"
                      >{{
                        $t("Arrival Timestamp", "Arrival Timestamp")
                      }}
                      *</label
                    >
                    <input
                      class="text-input"
                      type="text"
                      readonly
                      v-model="arrivalTimestamp"
                    />
                  </div>
                  <div class="inp-container">
                    <label class="input-label"
                      >{{ $t("Destination", "Destination") }} *</label
                    >
                    <input
                      class="text-input"
                      type="text"
                      v-model="destination"
                    />
                  </div>
                </div>
                <div
                  class="input-wrap view-broker-batches-upload"
                  v-if="selectedStage == 'Documents'"
                >
                  <div class="inp-container attach-container">
                    <label class="input-label"
                      >{{ $t("Permit", "Permit") }} *</label
                    >
                    <b-form-file
                      class="file-upload-with-label"
                      v-model="importPermit"
                      :placeholder="
                        $t('No Attachments yet', 'No Attachments yet')
                      "
                      drop-placeholder="Drop file here..."
                    ></b-form-file>
                    <div class="attach-border"></div>

                    <div
                      v-if="isImportPermit"
                      class="view-broker-batches-upload-wrap"
                    >
                      <ul class="upload-file-link-ul row">
                        <li
                          class="upload-li"
                          v-bind:key="file.importPermitFileName"
                          v-for="file in importFiles"
                        >
                          <div class="uploaded-file-link">
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
                          </div>
                          <div class="uploaded-image-wrap">
                            <img :src="file.importPermitFilePath" />
                          </div>
                        </li>
                        <li
                          class="upload-li"
                          v-bind:key="one"
                          v-for="one in Math.ceil(importFiles.length / 2) * 2 -
                          importFiles.length"
                        ></li>
                      </ul>
                    </div>
                  </div>
                  <div class="inp-container attach-container">
                    <label class="input-label"
                      >{{ $t("Document", "Document") }} *</label
                    >
                    <b-form-file
                      class="file-upload-with-label"
                      v-model="document"
                      :placeholder="
                        $t('No Attachments yet', 'No Attachments yet')
                      "
                      drop-placeholder="Drop file here..."
                    ></b-form-file>
                    <div class="attach-border"></div>

                    <div
                      v-if="isDocument"
                      class="view-broker-batches-upload-wrap"
                    >
                      <ul class="upload-file-link-ul row">
                        <li
                          v-bind:key="file.documentFileName"
                          v-for="file in documentFiles"
                          class="upload-li"
                        >
                          <div class="uploaded-file-link">
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
                          </div>
                          <div class="uploaded-image-wrap">
                            <img :src="file.documentFilePath" />
                          </div>
                        </li>
                        <li
                          class="upload-li"
                          v-bind:key="one"
                          v-for="one in Math.ceil(documentFiles.length / 2) *
                            2 -
                          documentFiles.length"
                        ></li>
                      </ul>
                    </div>
                  </div>
                  <div class="inp-container attach-container">
                    <label class="input-label"
                      >{{
                        $t("Temperature Reading", "Temperature Reading")
                      }}
                      *</label
                    >
                    <b-form-file
                      class="file-upload-with-label"
                      v-model="temperatureReadings"
                      :placeholder="
                        $t('No Attachments yet', 'No Attachments yet')
                      "
                      drop-placeholder="Drop file here..."
                    ></b-form-file>
                    <div class="attach-border"></div>

                    <div
                      v-if="isTemperatureReading"
                      class="view-broker-batches-upload-wrap"
                    >
                      <ul class="upload-file-link-ul row">
                        <li
                          class="upload-li"
                          v-bind:key="file.temperatureReadingsFileName"
                          v-for="file in temperatureFiles"
                        >
                          <div class="uploaded-file-link">
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
                          </div>
                          <div class="uploaded-image-wrap">
                            <img :src="file.temperatureReadingsFilePath" />
                          </div>
                        </li>
                        <li
                          class="upload-li"
                          v-bind:key="one"
                          v-for="one in Math.ceil(temperatureFiles.length / 2) *
                            2 -
                          temperatureFiles.length"
                        ></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div
                  class="input-wrap"
                  v-if="selectedStage == 'Quality Inspection'"
                >
                  <div class="inp-container">
                    <label class="input-label"
                      >{{ $t("Fruits Rejected", "Fruits Rejected") }} *</label
                    >
                    <input
                      class="text-input"
                      type="number"
                      v-model="fruitsRejected"
                    />
                  </div>
                  <div class="inp-container">
                    <label class="input-label"
                      >{{
                        $t("Additional Comments", "Additional Comments")
                      }}
                      *</label
                    >
                    <input
                      class="text-input"
                      type="text"
                      v-model="additionalComments"
                    />
                  </div>
                  <div class="inp-container">
                    <label class="input-label"
                      >{{ $t("Upload Image", "Upload Image") }} *</label
                    >
                    <b-form-file
                      class="file-upload-with-label"
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
                          >+ {{ names.length - 1 }}
                          {{ $t("More files", "More files") }}</b-badge
                        >
                      </template>
                    </b-form-file>
                    <div class="attach-border"></div>
                    <div
                      v-if="qualityFile"
                      class="view-broker-batches-upload-wrap"
                    >
                      <ul class="upload-file-link-ul row">
                        <li
                          class="upload-li col-md-6"
                          v-bind:key="file.qualityInspectionImageName"
                          v-for="file in qualityFiles"
                        >
                          <div class="uploaded-file-link">
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
                          </div>
                          <div class="uploaded-image-wrap">
                            <img :src="file.qualityInspectionImagePath" />
                          </div>
                        </li>
                        <li
                          class="col-md-6"
                          v-bind:key="one"
                          v-for="one in Math.ceil(qualityFiles.length / 2) * 2 -
                          qualityFiles.length"
                        ></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="input-wrap" v-if="selectedStage == 'Cold Storage'">
                  <div class="inp-container">
                    <label class="input-label"
                      >{{ $t("Temperature", "Temperature") }} (&#8451;) *</label
                    >
                    <input
                      class="text-input"
                      type="number"
                      v-model="temperature"
                    />
                  </div>
                  <div class="inp-container">
                    <label class="input-label"
                      >{{ $t("Ph Level", "Ph Level") }} *</label
                    >
                    <input class="text-input" type="number" v-model="phLevel" />
                  </div>
                  <div class="inp-container">
                    <label class="input-label"
                      >{{ $t("Ethylene Level", "Ethylene Level") }} *</label
                    >
                    <input
                      class="text-input"
                      type="number"
                      v-model="ethyleneLevel"
                    />
                  </div>
                  <div class="inp-container">
                    <label class="input-label"
                      >{{ $t("CO2 Level", "CO2 Level") }} *</label
                    >
                    <input
                      class="text-input"
                      type="number"
                      v-model="co2Level"
                    />
                  </div>
                  <div class="inp-container">
                    <label class="input-label"
                      >{{
                        $t(
                          "Cold Storage In Timestamp",
                          "Cold Storage In Timestamp"
                        )
                      }}
                      *</label
                    >
                    <input
                      class="text-input"
                      type="text"
                      v-model="coldStorageInTimestamp"
                    />
                  </div>
                </div>
                <div
                  class="input-wrap"
                  v-if="selectedStage == 'Cost of Ripening'"
                >
                  <div class="inp-container">
                    <label class="input-label">{{
                      $t("Currency", "Currency")
                    }}</label>
                    <div class="v-select-wrap">
                      <v-select
                        v-model="currency"
                        :placeholder="$t('Select Currency', 'Select Currency')"
                        class="view-broker-batches-v-select"
                        :options="maturationCurrencySource"
                      ></v-select>
                    </div>
                  </div>
                  <div class="inp-container">
                    <label class="input-label">{{
                      $t("Cost of Ripening", "Cost of Ripening")
                    }}</label>
                    <span class="prefixCurrency">
                      <span class="pref" v-if="this.currency == 'USD'">$</span>
                      <span class="pref" v-if="this.currency == 'HTG'">G</span>
                      <input
                        class="text-input"
                        type="number"
                        v-model="costOfMaturation"
                      />
                    </span>
                    <!-- <input class="text-input" type="number" v-model="costOfMaturation" /> -->
                  </div>
                  <!-- <div class="inp-container">
                    <label class="input-label">Currency *</label>
                    <div class="v-select-wrap">
                      <v-select
                        v-model="currency"
                        placeholder="Select Currency"
                        class="view-broker-batches-v-select"
                        :options="maturationCurrencySource"
                      ></v-select>
                    </div>
                  </div>-->
                </div>
              </perfect-scrollbar>
            </div>
          </div>
        </div>
        <div class="maintain-mandatory-warning">
          <span>* {{ $t("Mandatory Fields", "Mandatory Fields") }}</span>
        </div>
        <div class="button-container saledetails">
          <input
            type="button"
            v-on:click="hideMaintainModal"
            class="btn-cancel"
            :value="$t('Cancel', 'Cancel')"
          />
          <input
            type="button"
            v-on:click="SaveMaintain"
            class="btn-save"
            :value="$t('Save', 'Save')"
          />
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
            <label class="input-label">{{
              $t("Invoice No", "Invoice No")
            }}</label>
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
              $t("Buyer's Name", "Buyer's Name")
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
        <div class="button-container">
          <input
            type="button"
            v-on:click="hideGIModal"
            class="btn-cancel"
            :value="$t('Cancel', 'Cancel')"
          />
          <input
            type="button"
            v-on:click="SaveGI"
            class="btn-save"
            :value="$t('Save', 'Save')"
          />
        </div>
      </b-modal>
      <b-modal
        hide-footer
        @hide="hideSellModal"
        id="sell-modal"
        class="sell-modal"
        ref="sell-modal"
        hide-backdrop
        no-close-on-backdrop
        :title="$t('Sell', 'Sell')"
      >
        <!-- <div class="button-container" v-if="!newSaleTabShow&&!updateSaleTabShow&&!CheckDateLimit()">
          <input type="button" v-on:click="createNewSale" class="btn-save" value="Create New Sale" />
        </div>-->
        <div
          class="button-container sale-bk-container"
          v-if="newSaleTabShow || updateSaleTabShow"
        >
          <input
            type="button"
            v-on:click="backSellClick()"
            class="btn-cancel"
            :value="$t('Back To List', 'Back To List')"
          />
        </div>
        <v-client-table
          v-if="!newSaleTabShow && !updateSaleTabShow"
          :data="sellList"
          :columns="sellListColumns"
          :options="sellListOptions"
          class="tbl-sell-list"
        >
          <template slot-scope="props" slot="Ship Order & Unloading">
            <div>
              <a
                class="fa fa-edit"
                :class="props.row.isInvoiceOver ? 'edit-disabled' : ''"
                v-on:click="updateSaleClick(props.row)"
              >
                <img
                  class="ship-order-img"
                  src="../../assets/images/edit_record.png"
                />
              </a>
            </div>
          </template>
        </v-client-table>
        <div
          class="button-container sale-btn-container"
          v-if="!newSaleTabShow && !updateSaleTabShow && !CheckDateLimit()"
        >
          <input
            type="button"
            v-on:click="createNewSale"
            class="btn-save"
            :value="$t('Create New Sale', 'Create New Sale')"
          />
        </div>
        <div v-if="CheckDateLimit()">
          <h4 class="exceeded-h4">
            {{ $t("Exceeded Time limit", "Exceeded Time limit") }}
          </h4>
          <v-client-table
            :data="lotsList"
            :columns="exceededColumns"
            :options="exceededOptions"
            class="tbl-exceeded"
          ></v-client-table>
          <h4 class="exceeded-h4">
            {{ $t("Status", "Status") }} :
            {{ $t("Unsuccessful", "Unsuccessful") }}
          </h4>
          <div class="inp-container">
            <label class="input-label">{{ $t("Comments", "Comments") }}</label>
            <input class="text-input" type="text" v-model="exceededComments" />
          </div>
          <input
            type="button"
            v-on:click="SaveExceededComment(lotsList.id)"
            class="btn-save"
            :value="$t('Save', 'Save')"
          />
        </div>
        <div class="row" v-if="!CheckDateLimit() && newSaleTabShow">
          <div class="col-md-4" v-if="nextTabtobeLoaded == null">
            <div class="header-container sell-heading"></div>
            <div class="main-container sell-container">
              <perfect-scrollbar class="sell-modal-scroll">
                <input
                  class="input-label input-readonly-label"
                  v-for="lot in lotsList"
                  v-on:click="sellStageSelection(lot)"
                  :value="lot.Lot"
                  v-bind:class="{ active: sellSelectedStage == lot.Lot }"
                  readonly
                  v-bind:key="lot.Id"
                />
              </perfect-scrollbar>
            </div>
          </div>
          <div class="col-md-8" v-if="nextTabtobeLoaded == null">
            <div class="header-container sell-heading">
              <h3 class="heading">
                {{ $t(sellSelectedStage, sellSelectedStage) }}
              </h3>
            </div>
            <div class="main-container sell-container sell-container-right">
              <div v-if="beforeLotSelection" class="empty-sell-container-right">
                {{
                  $t(
                    "Please select a lot to proceed with Box selections",
                    "Please select a lot to proceed with Box selections"
                  )
                }}
              </div>

              <div
                style="height: 100%"
                v-if="!beforeLotSelection && nextTabtobeLoaded == null"
              >
                <perfect-scrollbar class="sell-modal-scroll">
                  <div v-for="lot in lotsList" v-bind:key="lot.Id">
                    <div
                      v-if="
                        sellSelectedStage == lot.Lot &&
                        lot.remaininglNoofBoxes > 0
                      "
                    >
                      <div class="inp-container input-half">
                        <label class="input-label">{{
                          $t("Total No Of Boxes", "Total No Of Boxes")
                        }}</label>
                        <input
                          class="text-input"
                          type="text"
                          readonly
                          v-model="lot.totalNoofBoxes"
                        />
                      </div>
                      <div class="inp-container input-half">
                        <label class="input-label">{{
                          $t("Unsold No of Boxes", "Unsold No of Boxes")
                        }}</label>
                        <input
                          class="text-input"
                          type="text"
                          readonly
                          v-model="lot.remaininglNoofBoxes"
                        />
                      </div>
                      <div class="inp-container input-half">
                        <label class="input-label">{{
                          $t("Boxes Selected", "Boxes Selected")
                        }}</label>
                        <input
                          class="text-input"
                          readonly
                          type="number"
                          v-model="lot.boxesSelected"
                        />
                      </div>
                      <div class="inp-container">
                        <a
                          v-on:click="showBoxModal(lot.selectAllBoxes)"
                          class="btn-info select-box-btn"
                          >{{ $t("Select Boxes", "Select Boxes") }}</a
                        >
                        <!-- <label class="input-label">Select Boxes QR Codes</label>
                        <multiselect v-model="selectedQRCodes" :searchable="true"  :multiple="true"  :options="qrCodeOpions"></multiselect>-->
                      </div>
                    </div>
                    <div
                      v-if="
                        sellSelectedStage == lot.Lot &&
                        lot.remaininglNoofBoxes == 0
                      "
                    >
                      <div class="inp-container">
                        <label class="input-label">{{
                          $t("Total No of Boxes", "Total No of Boxes")
                        }}</label>
                        <input
                          class="text-input"
                          type="text"
                          readonly
                          v-model="lot.totalNoofBoxes"
                        />
                      </div>
                      <h4 class="exceeded-h4">
                        {{
                          $t(
                            "No available boxes to sell",
                            "No available boxes to sell"
                          )
                        }}
                      </h4>
                    </div>
                  </div>
                </perfect-scrollbar>
              </div>
            </div>
          </div>

          <div
            class="col-md-12"
            v-if="!beforeLotSelection && nextTabtobeLoaded != null"
          >
            <div class="header-container sell-heading">
              <h3 class="heading">{{ $t("Details", "Details") }}</h3>
            </div>
            <div class="main-container sell-container sell-container-right">
              <div
                style="height: 100%"
                v-if="
                  !beforeLotSelection &&
                  nextTabtobeLoaded == 'Enter Buyer Details'
                "
              >
                <perfect-scrollbar class="sell-modal-scroll">
                  <div>
                    <h4 class="sub-heading sell-sub-heading">
                      {{ $t("Enter Buyer Details", "Enter Buyer Details") }}
                    </h4>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{ $t("Name", "Name") }} *</label
                      >
                      <input
                        class="text-input"
                        type="text"
                        v-model="sellBuyerName"
                      />
                    </div>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{ $t("Organization", "Organization") }} *</label
                      >
                      <input
                        class="text-input"
                        type="text"
                        v-model="sellBuyerOrganization"
                      />
                    </div>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{ $t("Address", "Address") }} *</label
                      >
                      <input
                        class="text-input"
                        type="text"
                        v-model="sellBuyerAddress"
                      />
                    </div>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{ $t("Contact Details", "Contact Details") }} *</label
                      >
                      <input
                        class="text-input"
                        type="number"
                        v-model="sellBuyerContactDetails"
                      />
                    </div>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{ $t("Email Address", "Email Address") }} *</label
                      >
                      <input
                        class="text-input"
                        type="text"
                        v-model="sellBuyerEmailAddress"
                      />
                    </div>
                    <h4 class="sub-heading sell-sub-heading">
                      {{
                        $t(
                          "Sale Transaction Details",
                          "Sale Transaction Details"
                        )
                      }}
                    </h4>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{ $t("Date", "Date") }} *</label
                      >
                      <input
                        class="text-input"
                        type="text"
                        v-model="saleTransactionDate"
                      />
                    </div>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{
                          $t("Total No Of Boxes Sold", "Total No Of Boxes Sold")
                        }}
                        *</label
                      >
                      <input
                        class="text-input"
                        type="number"
                        readonly
                        v-model="totalNumberOfBoxes"
                      />
                    </div>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{ $t("Product", "Product") }} *</label
                      >
                      <input
                        class="text-input"
                        type="text"
                        readonly
                        v-model="soldProduct"
                      />
                    </div>
                    <div
                      class="inp-container sales-currency-container sales-cur-broker-wrap"
                    >
                      <label class="input-label"
                        >{{ $t("Currency", "Currency") }} *</label
                      >
                      <v-select
                        v-model="salesCurrency"
                        :placeholder="$t('Select Currency', 'Select Currency')"
                        class="view-broker-batches-v-select"
                        :options="currencySource"
                      ></v-select>
                    </div>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{
                          $t("Sales Price Per Kg", "Sales Price Per Kg")
                        }}
                        *</label
                      >
                      <span class="prefixCurrency">
                        <span class="pref" v-if="this.salesCurrency == 'USD'"
                          >$</span
                        >
                        <span class="pref" v-if="this.salesCurrency == 'HTG'"
                          >G</span
                        >
                        <input
                          class="text-input"
                          type="number"
                          v-model="salesPricePerKg"
                        />
                      </span>
                    </div>

                    <div class="inp-container">
                      <label class="input-label"
                        >{{
                          $t("Weight(Kg) Per Box", "Weight(Kg) Per Box")
                        }}
                        *</label
                      >
                      <input
                        class="text-input"
                        type="number"
                        v-model="salesWeightPerBox"
                        readonly
                      />
                    </div>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{ $t("Broker Margin", "Broker Margin") }} (%) *</label
                      >
                      <input
                        class="text-input"
                        type="number"
                        readonly
                        v-model="salesBrokerMargin"
                      />
                    </div>
                  </div>
                </perfect-scrollbar>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-if="!CheckDateLimit() && updateSaleTabShow">
          <div class="col-md-5" v-if="nextTabtobeLoaded != null">
            <div class="header-container sell-heading">
              <h3 class="heading">{{ $t("Details", "Details") }}</h3>
            </div>
            <div class="main-container sell-container sell-container-right">
              <div
                style="height: 100%"
                v-if="nextTabtobeLoaded == 'Ship Order'"
              >
                <perfect-scrollbar class="sell-modal-scroll">
                  <input
                    class="input-label input-readonly-label"
                    v-on:click="detailsStageSelection('Ship Order')"
                    :value="$t('Ship Order', 'Ship Order')"
                    v-bind:class="{
                      active: detailsSelectedStage == 'Ship Order',
                    }"
                    readonly
                  />
                  <input
                    class="input-label input-readonly-label"
                    v-on:click="
                      detailsStageSelection('Unloading at Buyers Place')
                    "
                    :value="
                      $t(
                        'Unloading at Buyer\'s Place',
                        'Unloading at Buyer\'s Place'
                      )
                    "
                    v-bind:class="{
                      active:
                        detailsSelectedStage == 'Unloading at Buyers Place',
                    }"
                    readonly
                  />
                </perfect-scrollbar>
              </div>
            </div>
          </div>
          <div class="col-md-7" v-if="nextTabtobeLoaded != null">
            <div class="header-container sell-heading">
              <h3 class="heading">{{ $t("Details", "Details") }}</h3>
            </div>
            <div class="main-container sell-container sell-container-right">
              <div
                style="height: 100%"
                v-if="nextTabtobeLoaded == 'Ship Order'"
              >
                <perfect-scrollbar class="sell-modal-scroll">
                  <div v-if="detailsSelectedStage == 'Ship Order'">
                    <h4 class="sub-heading sell-sub-heading">
                      {{ $t("Ship Order", "Ship Order") }}
                    </h4>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{
                          $t("Date & Time of Loading", "Date & Time of Loading")
                        }}
                        *</label
                      >
                      <input
                        class="text-input"
                        type="text"
                        v-model="dateAndTimeOfLoading"
                      />
                    </div>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{
                          $t(
                            "Total No of Boxes Loaded",
                            "Total No of Boxes Loaded"
                          )
                        }}
                        *</label
                      >
                      <input
                        class="text-input"
                        type="number"
                        v-model="totalNoofBoxesLoaded"
                      />
                    </div>
                    <div
                      class="inp-container sales-currency-container sales-cur-broker-wrap"
                    >
                      <label class="input-label"
                        >{{ $t("Currency", "Currency") }} *</label
                      >
                      <v-select
                        v-model="shipOrderCurrency"
                        :placeholder="$t('Select Currency', 'Select Currency')"
                        class="view-broker-batches-v-select"
                        :options="currencySource"
                      ></v-select>
                    </div>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{
                          $t("Cost of Transportation", "Cost of Transportation")
                        }}
                        *</label
                      >
                      <span class="prefixCurrency">
                        <span
                          class="pref"
                          v-if="this.shipOrderCurrency == 'USD'"
                          >$</span
                        >
                        <span
                          class="pref"
                          v-if="this.shipOrderCurrency == 'HTG'"
                          >G</span
                        >
                        <input
                          class="text-input"
                          type="number"
                          v-model="sellCostOfTransportation"
                        />
                      </span>
                      <!-- <input class="text-input" type="number" v-model="sellCostOfTransportation" /> -->
                    </div>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{
                          $t("Buyer's Location", "Buyer's Location")
                        }}
                        *</label
                      >
                      <input
                        class="text-input"
                        type="text"
                        v-model="buyersLocation"
                      />
                    </div>
                  </div>
                  <div
                    v-if="detailsSelectedStage == 'Unloading at Buyers Place'"
                  >
                    <h4 class="sub-heading sell-sub-heading">
                      {{
                        $t(
                          "Unloading at Buyer's Place",
                          "Unloading at Buyer's Place"
                        )
                      }}
                    </h4>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{
                          $t(
                            "Date & Time of UnLoading",
                            "Date & Time of UnLoading"
                          )
                        }}
                        *</label
                      >
                      <input
                        class="text-input"
                        type="text"
                        v-model="dateAndTimeOfUnLoading"
                      />
                    </div>
                    <div class="inp-container">
                      <label class="input-label"
                        >{{
                          $t(
                            "Total No of Boxes UnLoaded",
                            "Total No of Boxes UnLoaded"
                          )
                        }}
                        *</label
                      >
                      <input
                        class="text-input"
                        type="number"
                        v-model="totalNoofBoxesUnLoaded"
                      />
                    </div>
                    <div class="inp-container attach-container">
                      <label class="input-label">{{
                        $t("Transportation Order", "Transportation Order")
                      }}</label>
                      <b-form-file
                        class="file-upload-with-label"
                        v-model="transportationOrder"
                        :placeholder="
                          $t('No Attachments yet', 'No Attachments yet')
                        "
                        drop-placeholder="Drop file here..."
                      ></b-form-file>
                      <div class="attach-border"></div>

                      <div
                        v-if="isTransportationOrder"
                        class="view-broker-batches-upload-wrap"
                      >
                        <ul class="upload-file-link-ul row">
                          <li class="upload-li">
                            <div class="uploaded-file-link">
                              {{
                                transportationOrderFiles.transportationOrderFileName
                              }}
                              <a
                                target="_blank"
                                v-bind:href="
                                  transportationOrderFiles.transportationOrderFilePath
                                "
                              >
                                <img
                                  class="download-icon-upload"
                                  src="../../assets/images/download-button.png"
                                />
                              </a>
                            </div>
                            <div class="uploaded-image-wrap">
                              <img
                                :src="
                                  transportationOrderFiles.transportationOrderFilePath
                                "
                              />
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </perfect-scrollbar>
              </div>
            </div>
          </div>
        </div>
        <div
          class="sell-mandatory-warning"
          v-if="
            nextTabtobeLoaded != null && (newSaleTabShow || updateSaleTabShow)
          "
        >
          <span>* {{ $t("Mandatory Fields", "Mandatory Fields") }}</span>
        </div>
        <div class="saledetails button-container">
          <input
            type="button"
            :disabled="
              detailsSelectedStage == 'Ship Order' ? isDisabled : false
            "
            v-on:click="SaveSell"
            v-if="
              nextTabtobeLoaded != null && (newSaleTabShow || updateSaleTabShow)
            "
            class="btn-save"
            :value="$t('Save', 'Save')"
          />

          <input
            type="button"
            v-on:click="sellBack"
            v-if="nextTabtobeLoaded != null && newSaleTabShow"
            class="btn-cancel"
            :value="$t('Back', 'Back')"
          />
          <input
            type="button"
            v-on:click="sellNext"
            v-if="
              !beforeLotSelection &&
              nextTabtobeLoaded == null &&
              nextShowFlag &&
              newSaleTabShow
            "
            class="btn-save"
            :value="$t('Next', 'Next')"
          />
        </div>
      </b-modal>
      <b-modal
        ref="success-modal"
        hide-footer
        hide-header
        :title="$t('Status', 'Status')"
        id="modalnewviewbrokersuccess"
        hide-backdrop
      >
        <label class="lbl-modal-success">{{ succesContent }}</label>
      </b-modal>

      <b-modal
        ref="select-box"
        hide-footer
        title="Box Selection"
        id="modalBoxes"
        hide-backdrop
      >
        <div slot="modal-header" class="box-modal-custom-header">
          <div class="inp-container inp-con-checkbox-boxselect">
            <label class="checkbox-container">
              <span v-if="!selectAllBoxes">{{
                $t("Select all unsold boxes", "Select all unsold boxes")
              }}</span>
              <span v-if="selectAllBoxes">{{
                $t("Unselect all boxes", "Unselect all boxes")
              }}</span>
              <input
                type="checkbox"
                v-on:change="SelectAll()"
                v-model="selectAllBoxes"
              />
              <span class="checkmark"></span>
            </label>
          </div>
          <div class="box-modal-header-text">
            {{ $t("Box Selection", "Box Selection") }}
          </div>
          <img
            @click="hideBoxModal()"
            class="sub-header-close-img box-modal-header-close"
            src="../../assets/images/close.png"
          />
        </div>
        <perfect-scrollbar class="box-table-scroll">
          <div class="table-ul row">
            <div
              v-for="singleVal in qrCodeOpions"
              v-bind:key="singleVal.qrCode"
              class="table-li col-md-3"
            >
              <div
                class="box-div tooltip"
                v-if="
                  singleVal.soldOut == false && singleVal.isSelected == false
                "
              >
                <span class="tooltiptext">{{
                  $t("Available", "Available")
                }}</span>
                <img
                  v-on:click="
                    makeSelect(singleVal);
                    singleVal.isSelected = true;
                  "
                  class="box-img active-box"
                  src="../../assets/images/box_unselected.png"
                />
                <br />
                <label class="qrcode-lbl">{{ singleVal.qrCode }}</label>
                <br />
                <label class="qrcode-lbl"
                  >{{ $t("Fruits Per Box", "Fruits Per Box") }} :
                  {{ singleVal.boxCapacity }}</label
                >
              </div>
              <div class="box-div tooltip" v-if="singleVal.soldOut == true">
                <span class="tooltiptext">Sold Out</span>
                <img class="box-img" src="../../assets/images/box_sold.png" />
                <br />
                <label class="qrcode-lbl">{{ singleVal.qrCode }}</label>
                <br />
                <label class="qrcode-lbl"
                  >{{ $t("Fruits Per Box", "Fruits Per Box") }} :
                  {{ singleVal.boxCapacity }}</label
                >
              </div>

              <div
                class="box-div tooltip"
                v-if="
                  singleVal.soldOut == false && singleVal.isSelected == true
                "
              >
                <span class="tooltiptext">{{
                  $t("Available", "Available")
                }}</span>
                <img
                  v-on:click="
                    makeUnSelect(singleVal);
                    singleVal.isSelected = false;
                  "
                  class="box-img active-box"
                  src="../../assets/images/box_selected.png"
                />
                <br />
                <label class="qrcode-lbl">{{ singleVal.qrCode }}</label>
              </div>
            </div>
            <div
              class="table-li col-md-3"
              v-for="one in Math.ceil(qrCodeOpions.length / 4) * 4 -
              qrCodeOpions.length"
              v-bind:key="one"
            ></div>
          </div>
        </perfect-scrollbar>
        <div class="button-container-box-modal">
          <input
            type="button"
            v-on:click="hideBoxModal"
            class="btn-cancel btn-cancel-box-modal"
            :value="$t('Done', 'Done')"
          />
        </div>
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
              "Temperature entered is outside the defined critical limits. Are you sure you want to proceed?",
              "Temperature entered is outside the defined critical limits. Are you sure you want to proceed?"
            )
          }}
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

import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
import { uuid } from "vue-uuid";
import uploadFiles from "../../shared/uploa-files";
import Multiselect from "vue-multiselect";
Vue.component("multiselect", Multiselect);
import "vue-multiselect/dist/vue-multiselect.min.css";
import Footer from "../../components/footer-view";
import $ from "jquery";

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
  name: "active-service-requests",
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
        "Maintain",
        "Sell",
        "Invoice",
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
          Maintain: `${this.$t("Maintain", "Maintain")}`,
          Sell: `${this.$t("Sell", "Sell")}`,
          Invoice: `${this.$t("Invoice", "Invoice")}`,
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
          totalNoofBoxes: `${this.$t(
            "Total No Of Boxes",
            "Total No Of Boxes"
          )}`,
          remaininglNoofBoxes: `${this.$t(
            "Unsold No of Boxes",
            "Unsold No of Boxes"
          )}`,
        },
        filterable: false,
        sortable: [],
      },
      sellListOptions: {
        perPage: 5,
        headings: {
          "Sale Id": `${this.$t("Sale Id", "Sale Id")}`,
          "Buyer's Name": `${this.$t("Buyer's Name", "Buyer's Name")}`,
          "Total No Of Boxes Sold": `${this.$t(
            "Total No Of Boxes Sold",
            "Total No Of Boxes Sold"
          )}`,
          "Ship Order & Unloading": `${this.$t(
            "Ship Order & Unloading",
            "Ship Order & Unloading"
          )}`,
          totalNoofBoxes: "Total No of Boxes",
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
      ratePerKg: null,
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
      lotsLength: 0,
      totalBoxCount: 0,
      tspOrganizationName: null,
      tspOrganizationKey: null,
      tspMargin: 0,
      isDisabled: false,
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
        { text: "Active Batches", href: "/view-broker-batches" },
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
        Maintain: `${this.$t("Maintain", "Maintain")}`,
        Sell: `${this.$t("Sell", "Sell")}`,
        Invoice: `${this.$t("Invoice", "Invoice")}`,
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
        totalNoofBoxes: `${this.$t("Total No Of Boxes", "Total No Of Boxes")}`,
        remaininglNoofBoxes: `${this.$t(
          "Unsold No of Boxes",
          "Unsold No of Boxes"
        )}`,
      },
      filterable: false,
      sortable: [],
    };

    this.sellListOptions = {
      perPage: 5,
      headings: {
        "Sale Id": `${this.$t("Sale Id", "Sale Id")}`,
        "Buyer's Name": `${this.$t("Buyer's Name", "Buyer's Name")}`,
        "Total No Of Boxes Sold": `${this.$t(
          "Total No Of Boxes Sold",
          "Total No Of Boxes Sold"
        )}`,
        "Ship Order & Unloading": `${this.$t(
          "Ship Order & Unloading",
          "Ship Order & Unloading"
        )}`,
        totalNoofBoxes: "Total No of Boxes",
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
    //working
    handleConnectivityChange(status) {
      this.networkStatus = status;
    },
    makeSelect: function (selectedBox) {
      this.selectedQRCodes.push(selectedBox);
      this.selectedQRCodeArray.push({
        qrCode: selectedBox.qrCode,
        Lot: this.selectedLotId,
      });
      for (var k = 0; k < this.lotsList.length; k++) {
        //iterate through each object in an array
        if (
          JSON.stringify(this.lotsList[k].Id) ===
          JSON.stringify(this.selectedLotId)
        ) {
          this.lotsList[k].boxesSelected++;
        }
      }
    },
    makeUnSelect: function (unSelectedBox) {
      for (var m = 0; m < this.lotsList.length; m++) {
        if (
          JSON.stringify(this.lotsList[m].Id) ===
          JSON.stringify(this.selectedLotId)
        ) {
          this.lotsList[m].selectAllBoxes = false;
          this.selectAllBoxes = false;
        }
      }
      var selectedQRCodeTemp = this.selectedQRCodes;
      for (var j = 0; j < selectedQRCodeTemp.length; j++) {
        if (
          JSON.stringify(selectedQRCodeTemp[j]) ===
          JSON.stringify(unSelectedBox)
        ) {
          this.selectedQRCodes.splice(j, 1);
        }
      }
      var selectedArrayTemp = this.selectedQRCodeArray;
      for (var i = 0; i < selectedArrayTemp.length; i++) {
        //iterate through each object in an array
        if (
          JSON.stringify(selectedArrayTemp[i]) ===
          JSON.stringify({
            qrCode: unSelectedBox.qrCode,
            Lot: this.selectedLotId,
          })
        ) {
          this.selectedQRCodeArray.splice(i, 1);
        }
      }
      for (var k = 0; k < this.lotsList.length; k++) {
        //iterate through each object in an array
        if (
          JSON.stringify(this.lotsList[k].Id) ===
          JSON.stringify(this.selectedLotId)
        ) {
          this.lotsList[k].boxesSelected--;
        }
      }
    },
    showBoxModal: function (selectAllBoxes) {
      this.selectAllBoxes = selectAllBoxes;
      this.$refs["select-box"].show();
    },
    hideBoxModal: function () {
      this.$refs["select-box"].hide();
    },
    getBoxQrCodes: function (serviceRequestId) {
      let currentValue = this;
      firebase
        .database()
        .ref("boxes/")
        .orderByValue()
        .startAt(serviceRequestId)
        .on("child_added", function (snapshot) {
          if (
            snapshot
              .val()
              .toString()
              .includes(serviceRequestId + "--T")
          ) {
            var isSelected = false;
            if (
              currentValue.checkBoxSelection({
                qrCode: snapshot.key,
                Lot: currentValue.selectedLotId,
              })
            ) {
              isSelected = true;
            }
            currentValue.qrCodeOpions.push({
              qrCode: snapshot.key,
              boxCapacity: snapshot.val().split("_")[1],
              soldOut: false,
              isSelected: isSelected,
              serviceRequestId: serviceRequestId + "--T",
            });

            currentValue.qrCodeOptionsRows = Math.ceil(
              currentValue.qrCodeOpions.length / 3
            );
          }
        });

      firebase
        .database()
        .ref("boxes/")
        .orderByValue()
        .startAt(serviceRequestId)
        .on("child_added", function (snapshot) {
          if (
            snapshot
              .val()
              .toString()
              .includes(serviceRequestId + "--F")
          ) {
            var isSelected = false;

            if (
              currentValue.checkBoxSelection({
                qrCode: snapshot.key,
                Lot: currentValue.selectedLotId,
              })
            ) {
              isSelected = true;
            }
            currentValue.qrCodeOpions.push({
              qrCode: snapshot.key,
              boxCapacity: snapshot.val().split("_")[1],
              soldOut: true,
              isSelected: isSelected,
              serviceRequestId: serviceRequestId + "--F",
            });
            currentValue.qrCodeOptionsRows = Math.ceil(
              currentValue.qrCodeOpions.length / 3
            );
          }
        });
      //       alert(serviceRequestId);
      // let currentValue = this;
      // currentValue.qrCodeOpions = [];
      //  var dbRef = firebase.database().ref("serviceRequest/");
      //     dbRef
      //       .orderByChild("serviceRequestId")
      //       .equalTo(serviceRequestId)
      //       .on("child_added", function(data) {
      //         console.log(data.val().boxQrCodes)
      //         if(data.val().boxQrCodes.length != null &&data.val().boxQrCodes.length > 0 )
      //         {
      //               for(var i = 0; i <=  data.val().boxQrCodes.length; i++){
      //                 currentValue.qrCodeOpions.push(data.val().boxQrCodes[i]+"-SR-"+serviceRequestId)
      //               }

      //         }

      //       });
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
              let keys = [];
              let _noOfBoxes = 0;
              let shipping = null;
              if (lots) {
                keys = Object.keys(lots);
                _noOfBoxes = 0;
                keys.forEach(function (key) {
                  _noOfBoxes += lots[key].noOfBoxes;
                  shipping = lots[key].shipping;
                });
              }

              currentValue.totalBoxCount = _noOfBoxes;
              currentValue.lotsLength = keys.length;
              // lots.forEach(function(element) {
              //   console.log(element)
              // });
              currentValue.serviceRequests.push({
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
                shipping: shipping,
                phoneNumbers: [],
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
                        //        firebase.database()
                        // .ref()
                        // .child("serviceRequest").orderByChild("serviceRequestId").
                        // equalTo(snapshotLots.val().serviceRequestId )
                        //     .on("child_added", function (snapShotService) {
                        //       if(snapShotService.val().serviceRequestId == snapshotLots.val().serviceRequestId)
                        //       {
                        console.log(snapshotLots.val().serviceRequestId);
                        currentValue.serviceRequests[index].phoneNumbers.push({
                          phoneNumber: snapshotLots.val().phoneNumber,
                          displayId: snapshotLots.val().displayId,
                        });
                      }
                      // });
                      //  }
                    });
                  });
              }
              currentValue.serviceRequests.reverse();
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
                let shippingMode = null;
                if (lots) {
                  var keys = Object.keys(lots);
                  var _noOfBoxes = 0;

                  keys.forEach(function (key) {
                    _noOfBoxes += lots[key].noOfBoxes;
                    shippingMode = lots[key].shipping;
                  });
                }

                currentValue.totalBoxCount = _noOfBoxes;
                currentValue.serviceRequests.push({
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
                  shipping: shippingMode,
                  phoneNumbers: [],
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
                          //          firebase.database()
                          // .ref()
                          // .child("serviceRequest").orderByChild("serviceRequestId").
                          // equalTo(snapshotLots.key)
                          //     .on("child_added", function (snapShotService) {
                          currentValue.serviceRequests[index].phoneNumbers.push(
                            {
                              phoneNumber: snapshotLots.val().phoneNumber,
                              displayId: snapshotLots.val().displayId,
                            }
                          );
                          //   });
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
        });
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
      this.seen = true;
      this.selectedRow = null;
      this.selectedRow = item;
      this.lots = [];
      let currentValue = this;
      currentValue.lotsLength = 0;
      currentValue.totalBoxCount = 0;

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
        currentValue.proformaInvoiceCurrency = snapshot.val().batchProforma_Shipping_Currency;
      });
      var ref = firebase.database().ref().child("serviceRequest");
      var itemNo = 0;

      ref.on("child_added", function (snapshot) {
        if (snapshot.val() != null) {
          if (snapshot.val().batchId == currentValue.selectedRow.Id) {
            // let splittingFactor = 0;
            // let startCode = snapshot.val().startQRCodeBoxes;
            // let endCode = snapshot.val().endQRCodeBoxes;
            // for (let i = 0; i < startCode.length; i++) {
            //   if (startCode.charAt(i) == endCode.charAt(i)) {
            //     splittingFactor++;
            //   } else {
            //     break;
            //   }
            // }
            // console.log(splittingFactor);
            // let startBox = Number(
            //   startCode.substring(splittingFactor, startCode.length)
            // );
            // let endBox = Number(
            //   endCode.substring(splittingFactor, endCode.length)
            // );
            const cartonFillingAndPalletizingData = snapshot.val()
              .cartonFillingAndPalletizingData;
            let numberOfBoxes = 0;
            cartonFillingAndPalletizingData.forEach((item) => {
              console.log(item);
              numberOfBoxes += item.boxQRCodes.length;
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
              NoofBoxes: numberOfBoxes,
            });
          }
        }
        currentValue.seen = false;
      });

      currentValue.$refs["view-batch"].show();
    },
    updateMaintainData: function () {
      this.importPermitFilePath = null;
      this.importPermitFileName = null;
      this.documentFilePath = null;
      this.documentFileName = null;
      this.temperatureReadingsFilePath = null;
      this.temperatureReadingsFileName = null;
      this.arrivalTimestamp = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.destination = null;
      this.fruitsRejected = null;
      this.additionalComments = null;
      this.temperature = null;
      this.phLevel = null;
      this.ethyleneLevel = null;
      this.co2Level = null;
      this.coldStorageInTimestamp = null;
      this.costOfMaturation = null;
      this.imageUpload = null;
      this.temperatureReadings = null;
      this.importPermit = null;
      this.document = null;
      this.qualityFiles = [];
      this.importFiles = [];
      this.documentFiles = [];
      this.temperatureFiles = [];
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
          ) {
            currentValue.arrivalTimestamp = moment
              .utc(snapshot.val().arrivalTimestamp)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          } else {
            currentValue.arrivalTimestamp = moment
              .utc()
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }
          currentValue.destination = snapshot.val().destination;
          currentValue.fruitsRejected = snapshot.val().fruitsRejected;
          currentValue.additionalComments = snapshot.val().additionalComments;
          currentValue.temperature = snapshot.val().temperature;
          currentValue.phLevel = snapshot.val().phLevel;
          currentValue.ethyleneLevel = snapshot.val().ethyleneLevel;
          currentValue.co2Level = snapshot.val().co2Level;
          currentValue.coldStorageInTimestamp = moment
            .utc()
            .local()
            .format("MMM DD, YYYY hh:mm A");
          currentValue.costOfMaturation = snapshot.val().costOfMaturation;

          if (snapshot.val().qualityInspectionFiles != undefined) {
            var batchDetails = firebase
              .database()
              .ref()
              .child("batch")
              .child(currentValue.selectedRow.Id)
              .child("maintain")
              .child("qualityInspectionFiles");
            batchDetails.on("child_added", function (snapshot) {
              console.log(snapshot.val());
              currentValue.qualityFiles.push({
                qualityInspectionImageName: snapshot.val()
                  .qualityInspectionImageName,
                qualityInspectionImagePath: snapshot.val()
                  .qualityInspectionImagePath,
              });
            });
            currentValue.qualityFile = true;
          }
          if (snapshot.val().documents != undefined) {
            var batchDetails = firebase
              .database()
              .ref()
              .child("batch")
              .child(currentValue.selectedRow.Id)
              .child("maintain")
              .child("documents");
            batchDetails.on("child_added", function (snapshot) {
              if (snapshot.val().importPermitFilePath != undefined) {
                currentValue.importFiles.push({
                  importPermitFilePath: snapshot.val().importPermitFilePath,
                  importPermitFileName: snapshot.val().importPermitFileName,
                });
                currentValue.isImportPermit = true;
              }
              if (snapshot.val().documentFilePath != undefined) {
                currentValue.documentFiles.push({
                  documentFilePath: snapshot.val().documentFilePath,
                  documentFileName: snapshot.val().documentFileName,
                });
                currentValue.isDocument = true;
              }
              if (snapshot.val().temperatureReadingsFilePath != undefined) {
                currentValue.temperatureFiles.push({
                  temperatureReadingsFilePath: snapshot.val()
                    .temperatureReadingsFilePath,
                  temperatureReadingsFileName: snapshot.val()
                    .temperatureReadingsFileName,
                });
                currentValue.isTemperatureReading = true;
              }
            });
          }
        } else {
          currentValue.arrivalTimestamp = moment
            .utc()
            .local()
            .format("MMM DD, YYYY hh:mm A");
        }
      });
    },
    maintainBatch: function (item) {
      this.selectedRow = null;
      this.selectedRow = item;
      this.updateMaintainData();
      this.$refs["maintain-batch"].show();
    },
    getTechnologyServiceProvider: function () {
      var vm = this;
      firebase
        .database()
        .ref()
        .child("masters")
        .child("organization")
        .orderByChild("organizationType")
        .equalTo("Technology Service Provider")
        .on("child_added", (snapshot) => {
          console.log("ppppppppppppppp");
          vm.tspMargin = snapshot.val().percentDistribution;
          vm.tspOrganizationName = snapshot.val().name;
          vm.tspOrganizationKey = snapshot.key;
        });
    },
    sellBatch: function (item) {
      const vm = this;
      vm.getTechnologyServiceProvider();
      console.log(item);
      this.selectedRow = null;
      this.selectedRow = item;
      this.soldProduct = this.selectedRow.product;
      this.ratePerKg = null;
      this.salesWeightPerBox = null;
      firebase
        .database()
        .ref()
        .child("masters")
        .child("product")
        .child(vm.soldProduct)
        .on("value", (snapshot) => {
          console.log(snapshot.val());
          vm.salesWeightPerBox = snapshot.val().avgWeightPerBox;
          if (item.shipping == "Shipment by Air") {
            vm.ratePerKg = snapshot.val().shipmentByAir;
          } else {
            vm.ratePerKg = snapshot.val().shipmentBySea;
          }
        });
      // if (this.soldProduct == "Mango") {
      //   this.salesWeightPerBox = 4.5;
      // } else if (this.soldProduct == "Avocado") {
      //   this.salesWeightPerBox = 5;
      // } else {
      //   this.salesWeightPerBox = 12.25;
      // }
      this.salesBrokerMargin = item.brokerMargin;
      // this.dateAndTimeOfLoading = moment
      //   .utc()
      //   .local()
      //   .format("MMM DD, YYYY hh:mm A");
      this.$refs["sell-modal"].show();
      this.getArrivedDateTime();
      this.getSellList();
      this.getLots();
      this.selectedQRCodes = [];
      this.selectedQRCodeArray = [];
      this.qrCodeOpions = [];
    },
    getSellList: function () {
      this.sellList = [];
      var currentVal = this;
      var ref = firebase
        .database()
        .ref()
        .child("batch")
        .child(currentVal.selectedRow.Id);
      ref.on("value", function (snapshot) {
        if (snapshot.val().sell != undefined) {
          var sellRef = firebase
            .database()
            .ref()
            .child("batch")
            .child(currentVal.selectedRow.Id)
            .child("sell");
          sellRef.on("child_added", function (datashot) {
            currentVal.sellList.push({
              "Sale Id": datashot.val().sellId,
              "Buyer's Name": datashot.val().sellBuyerName,
              salesPricePerKg: datashot.val().salesPricePerKg,
              salesWeightPerBox: datashot.val().salesWeightPerBox,
              "Total No Of Boxes Sold": datashot.val().totalNoOfBoxesSold,
              pushId: datashot.key,
              isInvoiceOver: datashot.val().invoice != undefined ? true : false,
              isPaymentOver:
                datashot.val().confirmPayment != undefined ? true : false,
            });
          });
        }
      });
    },
    getArrivedDateTime: function () {
      var currentVal = this;
      var ref = firebase
        .database()
        .ref()
        .child("batch")
        .child(this.selectedRow.Id)
        .child("maintain");

      ref.on("value", function (snapshot) {
        currentVal.arrivalTimestampInSell = moment
          .utc(snapshot.val().arrivalTimestamp)
          .local()
          .format("MMM DD, YYYY hh:mm A");
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
    updateSoldOutStatus: function (id) {
      const vm = this;
      vm.seen = true;
      var serviceRequestRef = firebase.database().ref("serviceRequest");
      serviceRequestRef
        .orderByChild("serviceRequestId")
        .equalTo(id)
        .on("child_added", function (data) {
          var ref = firebase.database().ref("serviceRequest/" + data.key);
          ref
            .update({ status: "Sold Out", updatedBy: localStorage.userName })
            .then(function () {
              vm.seen = false;
            })
            .catch(function (error) {
              console.log(error.message);
              vm.seen = false;
              Vue.$toast.open({
                message: vm.$t(
                  "Error updating Sold Out Status in firebase",
                  "Error updating Sold Out Status in firebase"
                ),
                position: "top",
                type: "error",
              });
            });
        });
    },
    generateInvoice: function (item) {
      this.selectedRow = null;
      this.selectedRow = item;
      Router.push("invoice/" + this.selectedRow.Id);
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
      $("#thisistheone").animate(
        {
          scrollTop: $("#thisistheone").offset().top - 230,
        },
        "slow"
      );
      this.selectedStage = label;
    },
    hideMaintainModal: function () {
      this.$refs["maintain-batch"].hide();
      this.selectedStage = "Arrival & Destination";
    },
    hideGIModal: function () {
      this.$refs["generate-invoice"].hide();
    },
    SaveGI: function () {
      let currentValue = this;
      currentValue.seen = true;
      // var ref = firebase
      //   .database()
      //   .ref("batch")
      //   .child(this.selectedRow.Id)
      //   .child("invoice");

      var ref = firebase
        .database()
        .ref("batch")
        .child(currentValue.selectedRow.Id)
        .child("invoice");

      var inpData = {
        invoiceNo: currentValue.arrivalTimestamp,
        destination: currentValue.destination,
        updatedBy: localStorage.userName,
      };

      if (/^ *$/.test(inpData.destination)) {
        currentValue.showErrorToast(`Invalid Destination Entered.`);
      } else {
        inpData.destination = inpData.destination.trim();
        currentValue
          .createArrivalDestinationAPICall(currentValue.selectedRow.Id, inpData)
          .then((resolved) => {
            console.log(resolved);
            ref
              .set(inpData)
              .then(function () {
                currentValue.seen = false;
                Vue.$toast.open({
                  message: currentValue.$t(
                    "Arrival and Destination details saved successfully.",
                    "Arrival and Destination details saved successfully."
                  ),
                  type: "success",
                  position: "top",
                });
              })
              .catch(function (error) {
                currentValue.erroMessage = error.message;
                currentValue.seen = false;
                Vue.$toast.open({
                  message: currentValue.$t(
                    "Error updating data to firebase.",
                    "Error updating data to firebase."
                  ),
                  type: "error",
                  position: "top",
                });
              });
          })
          .catch((err) => {
            currentValue.erroMessage = err;
            currentValue.seen = false;
            Vue.$toast.open({
              message: currentValue.$t(
                "Error updating data to corda blockchain.",
                "Error updating data to corda blockchain."
              ),
              type: "error",
              position: "top",
            });
          });
      }
    },
    SaveMaintain: function () {
      if (this.networkStatus) {
        let currentValue = this;
        currentValue.seen = true;
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
            var inpData = {
              arrivalTimestamp: moment.utc().toString(),
              destination: currentValue.destination,
              updatedBy: localStorage.userName,
            };
            if (/^ *$/.test(inpData.destination)) {
              currentValue.showErrorToast(`Invalid Destination Value Entered.`);
              currentValue.seen = false;
            } else {
              currentValue.seen = true;
              inpData.destination = inpData.destination.trim();
              currentValue
                .createArrivalDestinationAPICall(
                  currentValue.selectedRow.Id,
                  inpData
                )
                .then((resolved) => {
                  console.log(resolved);
                  ref
                    .update(inpData)
                    .then(function () {
                      currentValue.seen = false;
                      //currentValue.getData();
                      console.log("@@@");
                      console.log(currentValue.selectedRow.phoneNumbers);
                      currentValue.selectedRow.phoneNumbers.forEach(
                        (dataVal) => {
                          if (
                            dataVal.displayId == null ||
                            dataVal.displayId == undefined
                          ) {
                            dataVal.displayId = "";
                          }
                          sendSMS(
                            dataVal.phoneNumber,
                            // "Fruits have arrived in US"
                            "Nimewo pou jwenn sèvis : " +
                              dataVal.displayId +
                              ". Fri ki bon yo rive peyi Etazini"
                          )
                            //  "Les fruits sont arrivés aux Etats-Unis")
                            .then((sent) => console.log(sent))
                            .catch((err) => console.log(err));
                        }
                      );
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Arrival and Destination details saved successfully.",
                          "Arrival and Destination details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        type: "error",
                        position: "top",
                      });
                    });
                })
                .catch((err) => {
                  console.log(err);
                  currentValue.erroMessage = err;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    type: "error",
                    position: "top",
                  });
                });
            }
          } else {
            currentValue.seen = false;
            Vue.$toast.open({
              message: currentValue.$t(
                "Please fill all the fields.",
                "Please fill all the fields."
              ),
              type: "error",
              position: "top",
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
              message: currentValue.$t(
                "Please upload all documents.",
                "Please upload all documents."
              ),
              type: "error",
              position: "top",
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
            var inpData = {
              fruitsRejected: currentValue.fruitsRejected,
              additionalComments: currentValue.additionalComments,
              updatedBy: localStorage.userName,
            };
            currentValue
              .createQualityInspectionAPICall(
                currentValue.selectedRow.Id,
                inpData
              )
              .then((resolve) => {
                console.log(resolve);
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
                      currentValue.getData();
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
              })
              .catch((err) => {
                console.log(err);
                Vue.$toast.open({
                  message: err,
                  type: "error",
                  position: "top",
                });
                currentValue.seen = false;
              });
          } else {
            currentValue.seen = false;
            Vue.$toast.open({
              message: currentValue.$t(
                "Please fill all the fields.",
                "Please fill all the fields."
              ),
              type: "error",
              position: "top",
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
              this.seen = false;
              this.$refs["confirm-warning-modal"].show();
            } else if (
              currentValue.selectedRow.product.split(" ")[0] == "Mango" &&
              (currentValue.temperature > 15 || currentValue.temperature < 12)
            ) {
              this.seen = false;
              this.$refs["confirm-warning-modal"].show();
            } else if (
              currentValue.selectedRow.product.split(" ")[0] == "Pineapple" &&
              (currentValue.temperature > 12 || currentValue.temperature < 7)
            ) {
              this.seen = false;
              this.$refs["confirm-warning-modal"].show();
            } else {
              currentValue.seen = true;
              var inpData = {
                temperature: currentValue.temperature,
                phLevel: currentValue.phLevel,
                ethyleneLevel: currentValue.ethyleneLevel,
                co2Level: currentValue.co2Level,
                coldStorageInTimestamp: moment.utc().toString(),
                updatedBy: localStorage.userName,
              };
              currentValue
                .createColdStorageAPICall(currentValue.selectedRow.Id, inpData)
                .then((resolved) => {
                  console.log(resolved);
                  ref
                    .update(inpData)
                    .then(function () {
                      currentValue.seen = false;
                      currentValue.getData();
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
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        type: "error",
                        position: "top",
                      });
                    });
                })
                .catch((err) => {
                  console.log(err);
                  currentValue.erroMessage = err;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    type: "error",
                    position: "top",
                  });
                });
            }
          } else {
            currentValue.seen = false;
            Vue.$toast.open({
              message: currentValue.$t(
                "Please fill all the fields.",
                "Please fill all the fields."
              ),
              type: "error",
              position: "top",
            });
          }
        }
        if (this.selectedStage == "Cost of Ripening") {
          if (
            typeof currentValue.costOfMaturation != "undefined" &&
            typeof currentValue.currency != "undefined" &&
            currentValue.costOfMaturation &&
            currentValue.currency
          ) {
            currentValue.seen = true;
            var inpData = {
              costOfMaturation: currentValue.costOfMaturation,
              currency: currentValue.currency,
              updatedBy: localStorage.userName,
            };
            currentValue
              .createCostOfMaturationAPICall(
                currentValue.selectedRow.Id,
                inpData
              )
              .then((resolved) => {
                console.log(resolved);
                ref
                  .update(inpData)
                  .then(function () {
                    currentValue.seen = false;
                    currentValue.getData();
                    // TODO: get farmer contact

                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Cost of Ripening details saved successfully.",
                        "Cost of Ripening details saved successfully."
                      ),
                      type: "success",
                      position: "top",
                    });

                    currentValue.$refs["maintain-batch"].hide();
                  })
                  .catch(function (error) {
                    currentValue.erroMessage = error.message;
                    currentValue.seen = false;
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Error updating data to firebase.",
                        "Error updating data to firebase."
                      ),
                      type: "error",
                      position: "top",
                    });
                  });
              })
              .catch((err) => {
                console.log(err);
                currentValue.erroMessage = err;
                currentValue.seen = false;
                Vue.$toast.open({
                  message: currentValue.$t(
                    "Error updating data to corda blockchain.",
                    "Error updating data to corda blockchain."
                  ),
                  type: "error",
                  position: "top",
                });
              });
          } else {
            currentValue.seen = false;
            Vue.$toast.open({
              message: this.$t(
                "Please fill all the details.",
                "Please fill all the details."
              ),
              type: "error",
              position: "top",
            });
          }
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
    sellStageSelection: function (lot) {
      this.selectedLotId = lot.Id;
      this.selectAllBoxes = lot.selectAllBoxes;
      if (lot.remaininglNoofBoxes == 0) {
        this.nextShowFlag = false;
      } else {
        this.qrCodeOpions = [];
        this.getBoxQrCodes(lot.serviceRequestId);
        this.nextShowFlag = true;
      }
      this.sellSelectedStage = lot.Lot;
      this.beforeLotSelection = false;
      this.totalNumberOfBoxes = 0;
    },
    hideSellModal: function () {
      this.sellSelectedStage = null;
      this.nextShowFlag = true;
      this.beforeLotSelection = true;
      this.$refs["sell-modal"].hide();
      this.updateSaleTabShow = false;
      this.newSaleTabShow = false;
      this.beforeLotSelection = true;

      this.sellBuyerName = null;
      this.sellBuyerOrganization = null;
      this.sellBuyerAddress = null;
      this.sellBuyerContactDetails = null;
      this.sellBuyerEmailAddress = null;
      this.saleTransactionDate = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.salesCurrency = "USD";
      this.totalNoOfBoxesSold = null;
      this.salesPricePerKg = null;
      this.salesWeightPerBox = null;
      this.salesBrokerMargin = null;

      this.dateAndTimeOfLoading = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.totalNoofBoxesLoaded = null;
      this.sellCostOfTransportation = null;
      this.shipOrderCurrency = "USD";
      this.buyersLocation = null;

      this.dateAndTimeOfUnLoading = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.totalNoofBoxesUnLoaded = null;
      this.boxesSelected = null;
    },
    hideViewBatchModal: function () {
      this.$refs["view-batch"].hide();
    },
    updateBoxQRCodes: function () {
      let currentValue = this;
      for (var i = 0; i < this.selectedQRCodes.length; i++) {
        var jsonVar = {};
        jsonVar[this.selectedQRCodes[i].qrCode] =
          currentValue.selectedQRCodes[i].serviceRequestId.replace(
            "--T",
            "--F"
          ) +
          "_" +
          this.selectedQRCodes[i].boxCapacity;
        jsonVar.updatedBy = localStorage.userName;
        console.log(jsonVar);
        console.log(this.selectedQRCodes[i].boxCapacity);

        firebase
          .database()
          .ref("boxes")
          .update(jsonVar)
          .then(function () {
            //firebase.database().ref("boxes").update({this.selectedQRCodes[i].qrCode: currentValue.selectedQRCodes[i].serviceRequestId.replace("--T","--F") }).then(function(){
            //alert("succes")
          })
          .catch(function (exception) {
            //console.log(exception.message)
          });
      }
    },
    SaveSell: function () {
      if (this.networkStatus) {
        let currentVal = this;
        currentVal.getAvgWeightAndShipementRates(currentVal.soldProduct);
        var dbRef = firebase
          .database()
          .ref()
          .child("batch")
          .child(currentVal.selectedRow.Id)
          .child("sell");

        if (this.detailsSelectedStage == "Enter Buyer Details") {
          if (
            typeof this.sellBuyerName != "undefined" &&
            this.sellBuyerName &&
            typeof this.sellBuyerAddress != "undefined" &&
            this.sellBuyerAddress &&
            typeof this.sellBuyerOrganization != "undefined" &&
            this.sellBuyerOrganization &&
            typeof this.sellBuyerContactDetails != "undefined" &&
            this.sellBuyerContactDetails &&
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
            currentVal.seen = true;
            var inpData = {
              batchId: currentVal.selectedRow.Id,
              sellId: uuid.v1(),
              sellBuyerName: currentVal.sellBuyerName,
              sellBuyerAddress: currentVal.sellBuyerAddress,
              sellBuyerOrganization: currentVal.sellBuyerOrganization,
              sellBuyerContactDetails: currentVal.sellBuyerContactDetails,
              sellBuyerEmailAddress: currentVal.sellBuyerEmailAddress,
              saleTransactionDate: moment.utc().toString(),
              totalNoOfBoxesSold: currentVal.totalNumberOfBoxes,
              soldProduct: currentVal.soldProduct,
              salesPricePerKg: currentVal.salesPricePerKg,
              salesWeightPerBox: currentVal.salesWeightPerBox,
              salesCurrency: currentVal.salesCurrency,
              salesBrokerMargin: currentVal.salesBrokerMargin,
              boxesSelected: currentVal.selectedQRCodes,
              updatedBy: localStorage.userName,
            };
            const pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
            if (pattern.test(currentVal.sellBuyerEmailAddress)) {
              if (/^ *$/.test(inpData.sellBuyerName)) {
                currentVal.showErrorToast(`Buyer's name is invalid.`);
              } else if (/^ *$/.test(inpData.sellBuyerOrganization)) {
                currentVal.showErrorToast(`Buyer's organization is invalid.`);
              } else if (/^ *$/.test(inpData.sellBuyerAddress)) {
                currentVal.showErrorToast(`Buyer's address in invalid.`);
              } else {
                inpData.sellBuyerName = inpData.sellBuyerName.trim();
                inpData.sellBuyerOrganization = inpData.sellBuyerOrganization.trim();
                inpData.sellBuyerAddress = inpData.sellBuyerAddress.trim();

                for (var i = 0; i < currentVal.lotsList.length; i++) {
                  if (
                    currentVal.lotsList[i].boxesSelected != null &&
                    currentVal.lotsList[i].boxesSelected != "null" &&
                    Number(currentVal.lotsList[i].boxesSelected > 0)
                  ) {
                    currentVal.lotsArray.push({
                      id: currentVal.lotsList[i].serviceRequestId,
                      boxesSold: currentVal.lotsList[i].boxesSelected,
                    });
                  }
                }
                currentVal
                  .getOrganizationData(currentVal.selectedRow.Id)
                  .then((_data) => {
                    inpData.lspOrganizationName = _data.lspOrganizationName;
                    inpData.lspOrganizationKey = _data.lspOrganizationKey;
                    inpData.lspPercentageDistribution =
                      _data.lspPercentageDistribution;
                    inpData.brokerOrganizationName =
                      _data.brokerOrganizationName;
                    inpData.brokerOrganizationKey = _data.brokerOrganizationKey;

                    currentVal
                      .createNewSaleAPICall(
                        currentVal.selectedRow.Id,
                        inpData,
                        currentVal.lotsArray
                      )
                      .then((resolved) => {
                        console.log(resolved);
                        currentVal.checkBatchSoldOut(currentVal.selectedRow.Id);
                        dbRef
                          .push(inpData)
                          .then(function (response) {
                            //update mapping
                            let mapData = {};
                            mapData.updatedBy = localStorage.userName;
                            mapData[inpData.sellId] = `${
                              inpData.batchId + "_" + response.key
                            }`;

                            firebase
                              .database()
                              .ref()
                              .child("batch_sale_map")
                              .update(mapData)
                              .then(function () {
                                //alert("success");
                              })
                              .catch(function () {
                                //  alert("fail");
                              });
                            //update boxes
                            currentVal.updateBoxQRCodes();
                            var dbRef = firebase
                              .database()
                              .ref("batch")
                              .child(currentVal.selectedRow.Id)
                              .child("lots");
                            for (
                              var i = 0;
                              i < currentVal.lotsList.length;
                              i++
                            ) {
                              if (
                                currentVal.lotsList[i].boxesSelected != null &&
                                currentVal.lotsList[i].boxesSelected !=
                                  "null" &&
                                Number(currentVal.lotsList[i].boxesSelected > 0)
                              ) {
                                currentVal.totalNumberOfBoxes =
                                  currentVal.totalNumberOfBoxes +
                                  Number(currentVal.lotsList[i].boxesSelected);
                                currentVal.lotsArray.push({
                                  id: currentVal.lotsList[i].serviceRequestId,
                                  boxesSold:
                                    currentVal.lotsList[i].boxesSelected,
                                });
                              }
                              dbRef
                                .orderByChild("serviceRequestId")
                                .equalTo(
                                  currentVal.lotsList[i].serviceRequestId
                                )
                                .on("child_added", function (data) {
                                  var status = null;
                                  if (
                                    Number(
                                      currentVal.lotsList[i].remaininglNoofBoxes
                                    ) -
                                      Number(
                                        currentVal.lotsList[i].boxesSelected
                                      ) ==
                                    0
                                  ) {
                                    status = "Sold Out";
                                    currentVal.updateSoldOutStatus(
                                      currentVal.lotsList[i].serviceRequestId
                                    );
                                  }

                                  var inpDataVal = {
                                    remaingNoOfBoxes:
                                      Number(
                                        currentVal.lotsList[i]
                                          .remaininglNoofBoxes
                                      ) -
                                      Number(
                                        currentVal.lotsList[i].boxesSelected
                                      ),
                                    status: status,
                                    updatedBy: localStorage.userName,
                                  };

                                  var ref = firebase
                                    .database()
                                    .ref(
                                      "batch/" +
                                        currentVal.selectedRow.Id +
                                        "/lots/" +
                                        data.key
                                    );
                                  ref
                                    .update(inpDataVal)
                                    .then(function () {
                                      currentVal.seen = false;
                                      currentVal.hideSellModal();
                                      currentVal.getData();
                                    })
                                    .catch(function (error) {
                                      currentVal.erroMessage = error.message;
                                      currentVal.seen = false;
                                      Vue.$toast.open({
                                        message: currentVal.$t(
                                          "Error updating data to firebase.",
                                          "Error updating data to firebase."
                                        ),
                                        type: "error",
                                        position: "top",
                                      });
                                    });
                                });
                            }
                            Vue.$toast.open({
                              message: currentVal.$t(
                                "Sale placed successfully.",
                                "Sale placed successfully."
                              ),
                              type: "success",
                              position: "top",
                            });

                            currentVal.lotsArray = [];
                            currentVal.lotsList = [];
                            currentVal.sellBatch(currentVal.selectedRow);
                          })
                          .catch(function (error) {
                            currentVal.erroMessage = error.message;
                            currentVal.seen = false;
                            Vue.$toast.open({
                              message: currentVal.$t(
                                "Error updating data to firebase.",
                                "Error updating data to firebase."
                              ),
                              type: "error",
                              position: "top",
                            });
                          });
                      })
                      .catch((error) => {
                        currentVal.seen = false;
                        Vue.$toast.open({
                          message: currentVal.$t(
                            "Error creating sale.",
                            "Error creating sale."
                          ),
                          type: "error",
                          position: "top",
                        });
                      });
                  });
              }
            } else {
              Vue.$toast.open({
                message: currentVal.$t(
                  "Invalid email address.",
                  "Invalid email address."
                ),
                type: "error",
                position: "top",
              });
              currentVal.seen = false;
            }
          } else {
            currentVal.seen = false;
            Vue.$toast.open({
              message: currentVal.$t(
                "Please enter all the fields marked with *",
                "Please enter all the fields marked with *"
              ),
              type: "error",
              position: "top",
            });
          }
        } else if (this.detailsSelectedStage == "Ship Order") {
          if (
            typeof this.dateAndTimeOfLoading != "undefined" &&
            this.dateAndTimeOfLoading &&
            typeof this.totalNoofBoxesLoaded != "undefined" &&
            this.totalNoofBoxesLoaded &&
            typeof this.sellCostOfTransportation != "undefined" &&
            this.sellCostOfTransportation &&
            typeof this.shipOrderCurrency != "undefined" &&
            this.shipOrderCurrency &&
            typeof this.buyersLocation != "undefined" &&
            this.buyersLocation
          ) {
            currentVal.seen = true;
            if (this.totalNoofBoxesLoaded <= this.maxBoxesCanBeSold) {
              var netSaleAmountCal = 0;
              var approximateWeightProductCal = 0;
              // if (currentVal.selectedRow.product == "Mango") {
              netSaleAmountCal =
                Number(currentVal.totalNoofBoxesLoaded) *
                Number(currentVal.selectedSellRow.salesPricePerKg) *
                Number(currentVal.selectedSellRow.salesWeightPerBox);
              approximateWeightProductCal =
                Number(currentVal.totalNoofBoxesLoaded) *
                Number(currentVal.selectedSellRow.salesWeightPerBox);
              // } else if (currentVal.selectedRow.product == "Avocado") {
              //   netSaleAmountCal =
              //     Number(currentVal.totalNoofBoxesLoaded) *
              //     Number(currentVal.selectedSellRow.salesPricePerKg) *
              //     5;
              //   approximateWeightProductCal =
              //     Number(currentVal.totalNoofBoxesLoaded) * 5;
              // } else {
              //   netSaleAmountCal =
              //     Number(currentVal.totalNoofBoxesLoaded) *
              //     Number(currentVal.selectedSellRow.salesPricePerKg) *
              //     12.25;
              //   approximateWeightProductCal =
              //     Number(currentVal.totalNoofBoxesLoaded) * 12.25;
              //   }
              var orderRef = firebase
                .database()
                .ref()
                .child("batch")
                .child(currentVal.selectedRow.Id)
                .child("sell")
                .child(currentVal.selectedSellRow.pushId);
              currentVal.dateAndTimeOfLoading = moment
                .utc()
                .local()
                .format("MMM DD, YYYY hh:mm A");
              var inpData = {
                dateAndTimeOfLoading: moment.utc().toString(),
                totalNoofBoxesLoaded: currentVal.totalNoofBoxesLoaded,
                sellCostOfTransportation: currentVal.sellCostOfTransportation,
                buyersLocation: currentVal.buyersLocation,
                shipOrderCurrency: currentVal.shipOrderCurrency,
                updatedBy: localStorage.userName,
                netSaleAmountCal: netSaleAmountCal,
                approximateWeightProductCal: approximateWeightProductCal,
              };
              if (/^ *$/.test(inpData.buyersLocation)) {
                currentVal.showErrorToast(`Buyer's location is invalid.`);
                currentVal.seen = false;
              } else {
                currentVal
                  .createShipOrderAPICall(
                    currentVal.selectedSellRow["Sale Id"],
                    inpData
                  )
                  .then((resolved) => {
                    inpData.buyersLocation = inpData.buyersLocation.trim();
                    orderRef
                      .update(inpData)
                      .then(function () {
                        currentVal.sellBatch(currentVal.selectedRow);
                        currentVal.seen = false;
                        currentVal.isDisabled = true;
                        Vue.$toast.open({
                          message: currentVal.$t(
                            "Ship order details saved successfully.",
                            "Ship order details saved successfully."
                          ),
                          type: "success",
                          position: "top",
                        });
                      })
                      .catch(function (error) {
                        currentVal.seen = false;
                        Vue.$toast.open({
                          message: error.message,
                          type: "error",
                          position: "top",
                        });
                      });
                  })
                  .catch((err) => {
                    currentVal.seen = false;
                    Vue.$toast.open({
                      message: err,
                      type: "error",
                      position: "top",
                    });
                  });
              }
            } else {
              currentVal.seen = false;
              Vue.$toast.open({
                message: currentVal.$t(
                  "Boxes loaded cannot be more than boxes sold.",
                  "Boxes loaded cannot be more than boxes sold."
                ),
                type: "error",
                position: "top",
              });
            }
          } else {
            currentVal.seen = false;
            Vue.$toast.open({
              message: currentVal.$t(
                "Please enter all the fields marked with *",
                "Please enter all the fields marked with *"
              ),
              type: "error",
              position: "top",
            });
          }
        } else if (this.detailsSelectedStage == "Unloading at Buyers Place") {
          if (this.totalNoofBoxesUnLoaded > this.totalNoofBoxesLoaded) {
            Vue.$toast.open({
              message: currentVal.$t(
                "Total no. of boxes unloaded should be less than total no. of boxes loaded.",
                "Total no. of boxes unloaded should be less than total no. of boxes loaded."
              ),
              type: "error",
              position: "top",
            });
          } else if (
            typeof this.dateAndTimeOfUnLoading != "undefined" &&
            this.dateAndTimeOfUnLoading &&
            typeof this.totalNoofBoxesUnLoaded != "undefined" &&
            this.totalNoofBoxesUnLoaded
          ) {
            currentVal.seen = true;
            currentVal.transportationOrderFileLength = null;

            var orderRef = firebase
              .database()
              .ref()
              .child("batch")
              .child(currentVal.selectedRow.Id)
              .child("sell")
              .child(currentVal.selectedSellRow.pushId);
            currentVal.dateAndTimeOfUnLoading = moment
              .utc()
              .local()
              .format("MMM DD, YYYY hh:mm A");
            var inpData = {
              dateAndTimeOfUnLoading: moment.utc().toString(),
              totalNoofBoxesUnLoaded: currentVal.totalNoofBoxesUnLoaded,
              phoneNumbers: currentVal.selectedRow.phoneNumbers,
              updatedBy: localStorage.userName,
            };
            currentVal
              .createUnloadingAtBuyersPlaceAPICall(
                currentVal.selectedSellRow["Sale Id"],
                inpData
              )
              .then((resolved) => {
                orderRef
                  .update(inpData)
                  .then(function () {
                    //currentVal.UpdateReportData(currentVal.selectedRow.Id,currentVal.selectedSellRow["Sale Id"]);
                    if (currentVal.transportationOrder) {
                      currentVal.seen = false;
                      currentVal.uploadImage(
                        currentVal.transportationOrder,
                        currentVal.detailsSelectedStage,
                        currentVal.selectedRow.Id,
                        inpData,
                        currentVal,
                        "transportationOrder"
                      );
                    } else {
                      currentVal.sellBatch(currentVal.selectedRow);
                      currentVal.seen = false;
                      // TODO: get farmer contact
                      currentVal.selectedRow.phoneNumbers.forEach((dataVal) => {
                        sendSMS(
                          dataVal.phoneNumber,
                          "Nimewo pou jwenn sèvis : " +
                            dataVal.displayId +
                            ". Fri yo rive jwenn moun ki achte a"
                          // "Fruits have been shipped to buyer"
                          //   "Les fruits ont été envoyés à l’acheteur"
                        )
                          .then((sent) => console.log(sent))
                          .catch((err) => console.log(err));
                      });

                      Vue.$toast.open({
                        message: currentVal.$t(
                          "Unloading at buyer's place details saved successfully.",
                          "Unloading at buyer's place details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });
                      //working here
                      currentVal.$refs["sell-modal"].hide();
                    }
                  })
                  .catch(function (error) {
                    currentVal.seen = false;
                    Vue.$toast.open({
                      message: error.message,
                      type: "error",
                      position: "top",
                    });
                  });
              })
              .catch((err) => {
                currentVal.seen = false;
                Vue.$toast.open({
                  message: err,
                  type: "error",
                  position: "top",
                });
              });
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
    updatePenalties: function (batchId) {
      let currentVal = this;
      currentVal.seen = true;
      firebase
        .database()
        .ref()
        .child("batch")
        .child(batchId)
        .child("lots")

        .on("child_added", function (snapshot) {
          if (Number(snapshot.val().remaingNoOfBoxes) == 0) {
            currentVal.checkPenalityAPI(snapshot.val().serviceRequestId);
          }
        });
    },
    checkPenalityAPI(serviceId) {
      let currentVal = this;
      const data = {
        id: serviceId,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50005/api/v1.0/penalties`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          })
          .then(function (response) {
            currentVal.seen = false;
            resolve(response);
          })
          .catch(function (error) {
            currentVal.seen = false;

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
                    .checkPenalityAPI(serviceId)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },

    updatePaymentDistributionAPI(saleId, batchId) {
      let vm = this;
      vm.seen = true;
      return new Promise((resolve, reject) => {
        vm.axios
          .post(
            `${
              getConfigVars().BASE_URL
            }50011/api/v1.0/payment-distribution?saleId=` + saleId,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken,
              },
            }
          )
          .then(function (resolved) {
            vm.sendSMSToProducer(saleId);
            vm.updatePenalties(batchId);

            vm.seen = false;
            resolve(resolved);
          })
          .catch(function (error) {
            vm.seen = false;

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
                });
            } else {
              reject(error);
            }
          });
      });
    },

    sendSMSToProducer(saleId) {
      const vm = this;
      // hit the payment distribution get api
      // exract farmer phone number
      // send sms with approx amount
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
          if (data) {
            if (data.lots) {
              console.log("%%%%%%%%%%");
              console.log(data.lots);
              data.lots.forEach((item) => {
                var modeTransfer = "";
                if (item.paymentMode == "Wire") {
                  modeTransfer = "fil";
                } else if (item.paymentMode == "Cash") {
                  modeTransfer = "Lajan Kach";
                } else if (item.paymentMode == "Mobile") {
                  modeTransfer = "lajan mobil";
                }
                var convertedAmount = (
                  Number(item.exchangeRate).toFixed(2) *
                  Number(item.producerAmount)
                ).toFixed(2);
                sendSMS(
                  item.phoneNo,
                  "Nimewo pou jwenn sèvis : " +
                    item.displayId +
                    `. Bonjou ${item.producerName}, ou gen dwa resevwa yon apwoksimasyon kantite HTG ${convertedAmount} nan ${modeTransfer} pou vant lan ${saleId}`
                  // `Hi ${item.producerName}, you are entitled to receive an approximate amount of ${item.currency} ${item.producerAmount} for the sale ${saleId}`
                )
                  .then((sent) => {
                    console.log(sent);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    UpdateReportData(batchId, saleId) {
      var currentVal = this;
      currentVal.seen = true;
      var inpReportData = {
        sellId: saleId,
        batchId: batchId,
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
      var reportDataRef = firebase.database().ref("reportData").child(nodeName);
      reportDataRef
        .push(inpReportData)
        .then(function () {
          currentVal
            .updatePaymentDistributionAPI(saleId, batchId)
            .then((res) => {
              currentVal.updatePenalties(batchId);
              currentVal.seen = false;
              resolve(res);
            })
            .catch((err) => {
              currentVal.seen = false;
              reject(err);
            });
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
            if (currentVal.selectedQRCodes.length > 0) {
              this.seen = true;
              for (var i = 0; i < currentVal.lotsList.length; i++) {
                currentVal.totalNumberOfBoxes =
                  currentVal.totalNumberOfBoxes +
                  Number(currentVal.lotsList[i].boxesSelected);
                if (i + 1 == currentVal.lotsList.length) {
                  // if (
                  //   Number(currentVal.totalNumberOfBoxes) !=
                  //   Number(currentVal.selectedQRCodes.length)
                  // ) {
                  //   currentVal.seen = false;
                  //   Vue.$toast.open({
                  //     message:
                  //       "There is a difference in the selected boxes qrcode count and boxes selected, Please check",
                  //     type: "error",
                  //     position: "top"
                  //   });
                  // } else {
                  currentVal.seen = false;
                  currentVal.nextTabtobeLoaded = "Enter Buyer Details";
                  // }
                }
              }
            } else {
              currentVal.seen = false;
              Vue.$toast.open({
                message: currentVal.$t(
                  "Please select boxes.",
                  "Please select boxes."
                ),
                type: "error",
                position: "top",
              });
            }
          } else {
            currentVal.seen = false;
            Vue.$toast.open({
              message: currentVal.$t(
                "Boxes selected should be less than corresponding unsold no. of boxes.",
                "Boxes selected should be less than corresponding unsold no. of boxes."
              ),
              type: "error",
              position: "top",
            });
          }
        } else {
          currentVal.seen = false;
          Vue.$toast.open({
            message: currentVal.$t(
              "Select the boxes to buy.",
              "Select the boxes to buy."
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
      this.totalNumberOfBoxes = 0;
    },
    SelectAll: function () {
      var i = this.selectedQRCodeArray.length;
      while (i--) {
        if (this.selectedQRCodeArray[i].Lot === this.selectedLotId) {
          this.selectedQRCodes.splice(i, 1);
          this.selectedQRCodeArray.splice(i, 1);
        }
      }
      for (var j = 0; j < this.qrCodeOpions.length; j++) {
        this.qrCodeOpions[j].isSelected = false;
      }

      if (this.selectAllBoxes == true) {
        for (var i = 0; i < this.lotsList.length; i++) {
          if (this.selectedLotId == this.lotsList[i].Id) {
            this.lotsList[i].selectAllBoxes = this.selectAllBoxes;
            this.lotsList[i].boxesSelected = this.lotsList[
              i
            ].remaininglNoofBoxes;
          }
        }
        for (var j = 0; j < this.qrCodeOpions.length; j++) {
          this.qrCodeOpions[j].isSelected = true;
          this.selectedQRCodes.push(this.qrCodeOpions[j]);
          this.selectedQRCodeArray.push({
            qrCode: this.qrCodeOpions[j].qrCode,
            Lot: this.selectedLotId,
          });
        }
      } else {
        for (var i = 0; i < this.lotsList.length; i++) {
          if (this.selectedLotId == this.lotsList[i].Id) {
            this.lotsList[i].selectAllBoxes = this.selectAllBoxes;
            this.lotsList[i].boxesSelected = "";
          }
        }
      }
    },
    printDownloadUrl: function (url, fileName, documentType) {
      var currentVal = this;
      switch (currentVal.selectedStage) {
        case "Documents":
          {
            var inpData = null;
            if (documentType == "importPermit") {
              var inpData = {
                importPermitFilePath: url,
                importPermitFileName: fileName,
                updatedBy: localStorage.userName,
              };
              var ref = firebase
                .database()
                .ref("batch")
                .child(currentVal.selectedRow.Id)
                .child("maintain")
                .child("documents");

              ref
                .push(inpData)
                .then(function () {
                  currentVal.updateMaintainData();
                })
                .catch(function (error) {
                  Vue.$toast.open({
                    message: error,
                    type: "error",
                    position: "top",
                  });
                  currentVal.seen = false;
                });
            } else if (documentType == "document") {
              var inpData = {
                documentFilePath: url,
                documentFileName: fileName,
              };
              var ref = firebase
                .database()
                .ref("batch")
                .child(currentVal.selectedRow.Id)
                .child("maintain")
                .child("documents");

              ref
                .push(inpData)
                .then(function () {
                  currentVal.updateMaintainData();
                })
                .catch(function (error) {
                  Vue.$toast.open({
                    message: error,
                    type: "error",
                    position: "top",
                  });
                  currentVal.seen = false;
                });
            } else if (documentType == "temperaturereading") {
              var inpData = {
                temperatureReadingsFilePath: url,
                temperatureReadingsFileName: fileName,
                updatedBy: localStorage.userName,
              };
              var ref = firebase
                .database()
                .ref("batch")
                .child(currentVal.selectedRow.Id)
                .child("maintain")
                .child("documents");

              ref
                .push(inpData)
                .then(function () {
                  currentVal.seen = false;
                  currentVal.updateMaintainData();
                  currentVal.getData();
                  Vue.$toast.open({
                    message: currentVal.$t(
                      "Documents uploaded successfully.",
                      "Documents uploaded successfully."
                    ),
                    type: "success",
                    position: "top",
                  });
                })
                .catch(function (error) {
                  Vue.$toast.open({
                    message: error,
                    type: "error",
                    position: "top",
                  });
                  currentVal.seen = false;
                });
            }
          }
          break;
        case "Quality Inspection":
          {
            var ref = firebase
              .database()
              .ref("batch")
              .child(this.selectedRow.Id)
              .child("maintain")
              .child("qualityInspectionFiles");
            var inpData = {
              qualityInspectionImagePath: url,
              qualityInspectionImageName: fileName,
              updatedBy: localStorage.userName,
            };

            ref
              .push(inpData)
              .then(function () {
                currentVal.qualityInspectionFileLength =
                  currentVal.qualityInspectionFileLength - 1;
                if (currentVal.qualityInspectionFileLength == 0) {
                  currentVal.seen = false;
                  currentVal.updateMaintainData();
                  currentVal.getData();
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
                  message: error,
                  type: "error",
                  position: "top",
                });
                currentVal.seen = false;
              });
          }
          break;
        default:
      }
      if (currentVal.detailsSelectedStage == "Unloading at Buyers Place") {
        var ref = firebase
          .database()
          .ref("batch")
          .child(this.selectedRow.Id)
          .child("sell")
          .child(currentVal.selectedSellRow.pushId)
          .child("transportationOrderFiles");
        var inpData = {
          transportationOrderFilePath: url,
          transportationOrderFileName: fileName,
          updatedBy: localStorage.userName,
        };

        ref
          .set(inpData)
          .then(function () {
            currentVal.seen = false;
            currentVal.sellBatch(currentVal.selectedRow);
            currentVal.getData();
            Vue.$toast.open({
              message: currentVal.$t(
                "Unloading at buyer's place details saved successfully.",
                "Unloading at buyer's place details saved successfully."
              ),
              type: "success",
              position: "top",
            });
            currentVal.getData();
          })
          .catch(function (error) {
            Vue.$toast.open({
              message: error,
              type: "error",
              position: "top",
            });
            currentVal.seen = false;
          });
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
    CheckDateLimit: function () {
      var dt = new Date();
      dt.setDate(dt.getDate() - 21);
      if (moment(new Date(this.arrivalTimestampInSell)).utc().local() < dt) {
        return true;
      } else {
        return false;
      }
    },
    SaveExceededComment: function (id) {
      var currentValue = this;
      var isideRef = firebase
        .database()
        .ref("batch/" + currentValue.selectedRow.Id);
      currentValue
        .checkNoSaleAPI(currentValue.selectedRow.Id)
        .then((resolved) => {
          isideRef
            .update({
              status: "Unsuccessful",
              exceededComments: currentValue.exceededComments,
              unsuccessfulStatusUpdatedOn: moment.utc().toString(),
              updatedBy: localStorage.userName,
            })
            .then(function () {
              currentValue.seen = false;

              Vue.$toast.open({
                message: currentValue.$t(
                  "Status updated successfully.",
                  "Status updated successfully."
                ),
                type: "success",
                position: "top",
              });
              // currentValue.checkPenalityAPI(id);

              currentValue.$refs["sell-modal"].hide();
              currentValue.updateUnsuccessStatus();
              currentValue.getData();
              currentValue.hideModal();
            })
            .catch(function (error) {
              currentValue.erroMessage = error.message;
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Error updating data to firebase.",
                  "Error updating data to firebase."
                ),
                type: "error",
                position: "top",
              });
            });
        })
        .catch((err) => {
          currentValue.erroMessage = err;
          currentValue.seen = false;
          Vue.$toast.open({
            message: currentValue.$t(
              "Error updating data to corda blockchain.",
              "Error updating data to corda blockchain."
            ),
            type: "error",
            position: "top",
          });
        });
    },
    updateUnsuccessStatus: function () {
      let currentValue = this;
      var dbRef = firebase
        .database()
        .ref("batch/" + currentValue.selectedRow.Id + "/lots");
      dbRef.on("child_added", function (snapshot) {
        var serviceRequestRef = firebase.database().ref("serviceRequest");
        serviceRequestRef
          .orderByChild("serviceRequestId")
          .equalTo(snapshot.key)
          .on("child_added", function (data) {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            ref
              .update({
                status: "Unsuccessful",
                updatedBy: localStorage.userName,
              })
              .then(function () {
                //   currentValue.axios.post(
                //     `${getConfigVars().BASE_URL}/api/v1/corda/chain/payment/finalize`,
                //     {
                //       lotId: snapshot.key,
                //       data: {
                //         penalties: [
                //           {
                //             type: "BR_NO_SALE",
                //             // delivery_time: null,
                //             // fruits_amount: null,
                //             boxes_amount: snapshot.val().noOfBoxes
                //             // temperature_breach_count: null
                //           }
                //         ]
                //         //   receiptHash: null,
                //         // boxesAmount: null,
                //         //  pricePerBox: null,
                //         //  retailer: null,
                //         //  internalFruitTemp: null,
                //         //   internalFruitTemperaturePacked: null,
                //         //  isTemepertaureBreach: null,
                //         // lossOfBox: null,
                //         //  requestCompletedOn: null,
                //         //  temperatureBreachCount: null
                //       }
                //     }
                //   );
                //   // currentValue.checkPenalityAPI();
              })
              .catch(function (error) {
                currentValue.seen = false;
                Vue.$toast.open({
                  message: currentValue.$t(
                    "Error updating data to firebase.",
                    "Error updating data to firebase."
                  ),
                  type: "error",
                  position: "top",
                });
              });
          });
      });
    },
    showDashboard: function () {
      Router.push("broker-dashboard");
    },
    createNewSale: function () {
      this.newSaleTabShow = true;
      this.nextTabtobeLoaded = null;
      this.totalNoOfBoxesSold = 0;
      this.totalNumberOfBoxes = 0;
      this.detailsSelectedStage = "Enter Buyer Details";
      this.getLots();
    },
    updateSaleClick: function (item) {
      this.maxBoxesCanBeSold = item["Total No Of Boxes Sold"];
      this.updateSaleTabShow = true;
      this.selectedSellRow = null;
      this.selectedSellRow = item;
      this.seen = false;
      this.detailsSelectedStage = "Ship Order";
      this.nextTabtobeLoaded = "Ship Order";
      this.getShipAndUnloadingData();
    },
    getShipAndUnloadingData: function () {
      let currentVal = this;
      var ref = firebase
        .database()
        .ref()
        .child("batch")
        .child(currentVal.selectedRow.Id)
        .child("sell");

      ref.on("child_added", function (snapshot) {
        if (snapshot.key == currentVal.selectedSellRow.pushId) {
          if (snapshot.val().dateAndTimeOfLoading != undefined) {
            currentVal.dateAndTimeOfLoading = moment(
              snapshot.val().dateAndTimeOfLoading
            )
              .local()
              .format("MMM DD, YYYY hh:mm A");
            currentVal.totalNoofBoxesLoaded = snapshot.val().totalNoofBoxesLoaded;
            currentVal.sellCostOfTransportation = snapshot.val().sellCostOfTransportation;
            currentVal.buyersLocation = snapshot.val().buyersLocation;
            currentVal.shipOrderCurrency = snapshot.val().shipOrderCurrency;
            currentVal.isDisabled = true;
          } else {
            currentVal.isDisabled = false;
          }
          if (snapshot.val().dateAndTimeOfUnLoading != undefined) {
            currentVal.dateAndTimeOfUnLoading = moment
              .utc(snapshot.val().dateAndTimeOfUnLoading)
              .local()
              .format("MMM DD, YYYY hh:mm A");
            currentVal.totalNoofBoxesUnLoaded = snapshot.val().totalNoofBoxesUnLoaded;
            if (snapshot.val().transportationOrderFiles != undefined) {
              var batchDetails = firebase
                .database()
                .ref()
                .child("batch")
                .child(currentVal.selectedRow.Id)
                .child("sell");
              batchDetails.on("child_added", function (snapshot1) {
                if (snapshot1.key == currentVal.selectedSellRow.pushId) {
                  firebase
                    .database()
                    .ref()
                    .child("batch")
                    .child(currentVal.selectedRow.Id)
                    .child("sell")
                    .child(snapshot1.key)
                    .child("transportationOrderFiles")
                    .on("value", function (snapshot2) {
                      currentVal.transportationOrderFiles = {
                        transportationOrderFileName: snapshot2.val()
                          .transportationOrderFileName,
                        transportationOrderFilePath: snapshot2.val()
                          .transportationOrderFilePath,
                      };
                    });
                }
              });
              currentVal.isTransportationOrder = true;
            }
          }
        }
      });
    },
    backSellClick: function () {
      this.sellSelectedStage = null;
      this.updateSaleTabShow = false;
      this.newSaleTabShow = false;
      this.beforeLotSelection = true;

      this.sellBuyerName = null;
      this.sellBuyerOrganization = null;
      this.sellBuyerAddress = null;
      this.sellBuyerContactDetails = null;
      this.sellBuyerEmailAddress = null;
      this.saleTransactionDate = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.salesCurrency = "USD";
      this.totalNoOfBoxesSold = null;
      this.salesPricePerKg = null;
      this.salesWeightPerBox = null;
      this.salesBrokerMargin = null;

      this.dateAndTimeOfLoading = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.totalNoofBoxesLoaded = null;
      this.sellCostOfTransportation = null;
      this.shipOrderCurrency = "USD";
      this.buyersLocation = null;

      this.dateAndTimeOfUnLoading = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.totalNoofBoxesUnLoaded = null;
      this.boxesSelected = null;
      this.selectedQRCodeArray = [];
      this.selectedQRCodes = [];
    },
    hideConfirmWarningModal: function () {
      this.$refs["confirm-warning-modal"].hide();
    },
    continueWithTemperatureWarning: function () {
      this.$refs["confirm-warning-modal"].hide();
      let currentValue = this;
      var ref = firebase
        .database()
        .ref("batch")
        .child(this.selectedRow.Id)
        .child("maintain");
      var inpData = {
        temperature: currentValue.temperature,
        phLevel: currentValue.phLevel,
        ethyleneLevel: currentValue.ethyleneLevel,
        co2Level: currentValue.co2Level,
        coldStorageInTimestamp: moment.utc().toString(),
        updatedBy: localStorage.userName,
      };
      currentValue
        .createColdStorageAPICall(currentValue.selectedRow.Id, inpData)
        .then((resolved) => {
          ref
            .update(inpData)
            .then(function () {
              currentValue.getData();
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
              Vue.$toast.open({
                message: currentValue.$t(
                  "Error updating data to firebase.",
                  "Error updating data to firebase."
                ),
                type: "error",
                position: "top",
              });
            });
        })
        .catch((err) => {
          currentValue.erroMessage = err;
          currentValue.seen = false;
          Vue.$toast.open({
            message: currentValue.$t(
              "Error updating data to corda blockchain.",
              "Error updating data to corda blockchain."
            ),
            type: "error",
            position: "top",
          });
        });
    },
    checkBoxSelection: function (item) {
      for (var i = 0; i < this.selectedQRCodeArray.length; i++) {
        //iterate through each object in an array
        if (
          JSON.stringify(this.selectedQRCodeArray[i]) === JSON.stringify(item)
        ) {
          return true;
        }
      }
    },
    showErrorToast(message) {
      Vue.$toast.open({
        message,
        position: "top",
        type: "error",
      });
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
    createNewSaleAPICall(serviceId, inpData, lots) {
      let currentVal = this;
      // currentVal.getAvgWeightAndShipementRates(inpData.soldProduct)
      //   .then(
      //     _data => {
      //       // get shipping mode
      //       firebase
      //         .database()
      //         .ref()
      //         .child("batch")
      //         .child(inpData.batchId)
      //         .once('value', batchSnapshot => {
      //           console.log(batchSnapshot.val());
      //           // get first lot's key
      //           const keys = Object.keys(batchSnapshot.val().lots);
      //           let shippingMode = batchSnapshot.val().lot[keys[0]].shipping;
      //           // set rate per kg based on shipping mode
      //         })
      //     }
      //   )
      const data = {
        saleId: inpData.sellId,
        batchId: inpData.batchId,
        sellBuyerName: inpData.sellBuyerName,
        sellBuyerAddress: inpData.sellBuyerAddress,
        sellBuyerOrganization: inpData.sellBuyerOrganization,
        sellBuyerContactDetails: inpData.sellBuyerContactDetails,
        sellBuyerEmailAddress: inpData.sellBuyerEmailAddress,
        saleTransactionDate: moment(inpData.saleTransactionDate)
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss")
          .toString(),
        totalNoOfBoxesSold: inpData.totalNoOfBoxesSold,
        soldProduct: inpData.soldProduct,
        salesPricePerKg: inpData.salesPricePerKg,
        salesWeightPerBox: inpData.salesWeightPerBox,
        salesCurrency: inpData.salesCurrency,
        salesBrokerMargin: inpData.salesBrokerMargin,
        //boxesSelected: inpData.boxesSelected,
        lots: lots, //no data from UI,
        lspOrganizationName: inpData.lspOrganizationName,
        lspOrganizationKey: inpData.lspOrganizationKey,
        lspPercentageDistribution: inpData.lspPercentageDistribution,
        brokerOrganizationName: inpData.brokerOrganizationName,
        brokerOrganizationKey: inpData.brokerOrganizationKey,
        tspMargin: currentVal.tspMargin,
        tspOrganizationKey: currentVal.tspOrganizationKey,
        tspOrganizationName: currentVal.tspOrganizationName,
        avgWeight: currentVal.salesWeightPerBox,
        ratePerKg: currentVal.ratePerKg,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50011/api/v1.0/new-sale`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          })
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
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
                    .createNewSaleAPICall(serviceId, inpData, lots)
                    .then((res) => resolve(res))
                    .catch((err) => {
                      currentVal.lotsArray = [];
                      currentVal.lotsList = [];
                      reject(err);
                    });
                })
                .catch(() => {
                  currentVal.lotsArray = [];
                  currentVal.lotsList = [];
                });
            } else {
              reject(error);
            }
          });
      });
    },
    getAvgWeightAndShipementRates(fruit) {
      let data = null;

      return new Promise((resolve, reject) => {
        let timeout = setTimeout(() => {
          if (data == null) {
            console.log("error fetching avg weight and shipping data");
            reject();
          }
        }, 500);
        firebase
          .database()
          .ref()
          .child("masters")
          .child("product")
          .child(fruit)
          .on("value", (snapshot) => {
            if (snapshot.val() != null) {
              clearTimeout(timeout);
              data = {
                avgWeight: snapshot.val().avgWeightPerBox,
                shipmentByAir: snapshot.val().shipmentByAir,
                shipmentBySea: snapshot.val().shipmentBySea,
              };
              resolve(data);
            }
          });
      });
    },
    createShipOrderAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        saleId: serviceId,
        step: "SHIP_ORDER",
        shipOrder: {
          dateAndTimeOfLoading: moment(inpData.dateAndTimeOfLoading)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss"),
          totalNoofBoxesLoaded: inpData.totalNoofBoxesLoaded,
          sellCostOfTransportation: inpData.sellCostOfTransportation,
          buyersLocation: inpData.buyersLocation,
          shipOrderCurrency: inpData.shipOrderCurrency,
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
            currentVal.UpdateReportData(currentVal.selectedRow.Id, serviceId);
            resolve(response);
          })
          .catch(function (error) {
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
                    .createShipOrderAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createUnloadingAtBuyersPlaceAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        saleId: serviceId,
        step: "UNLOADING_AT_BUYER",
        unloadingAtBuyer: {
          dateAndTimeOfUnLoading: moment(inpData.dateAndTimeOfUnLoading)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss"),
          totalNoofBoxesUnLoaded: inpData.totalNoofBoxesUnLoaded,
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
                    .createUnloadingAtBuyersPlaceAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    checkPenalityAPI(serviceId) {
      let currentVal = this;
      currentVal.seen = true;
      const data = {
        id: serviceId,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50005/api/v1.0/penalties`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          })
          .then(function (response) {
            currentVal.seen = false;
            resolve(response);
          })
          .catch(function (error) {
            currentVal.seen = false;
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
                    .checkPenalityAPI(serviceId)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createArrivalDestinationAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        batchId: serviceId,
        step: "ARRIVAL_AND_DESTINATION",
        arrivalAndDestination: {
          arrivalTimestamp: moment(inpData.invoiceNo)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss"),
          destination: inpData.destination,
        },
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(
            `${getConfigVars().BASE_URL}50011/api/v1.0/update-batch`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken,
              },
            }
          )
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
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
                    .createArrivalDestinationAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createQualityInspectionAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        batchId: serviceId,
        step: "QUALITY_INSPECTION",
        qualityInspection: {
          fruitsRejected: inpData.fruitsRejected,
          additionalComments: inpData.additionalComments,
        },
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(
            `${getConfigVars().BASE_URL}50011/api/v1.0/update-batch`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken,
              },
            }
          )
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
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
                    .createQualityInspectionAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createColdStorageAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        batchId: serviceId,
        step: "COLD_STORAGE",
        coldStorage: {
          temperature: inpData.temperature,
          phLevel: inpData.phLevel,
          ethyleneLevel: inpData.ethyleneLevel,
          co2Level: inpData.co2Level,
          coldStorageInTimestamp: moment(inpData.coldStorageInTimestamp)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss"),
        },
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(
            `${getConfigVars().BASE_URL}50011/api/v1.0/update-batch`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken,
              },
            }
          )
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
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
                    .createColdStorageAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createCostOfMaturationAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        batchId: serviceId,
        step: "COST_OF_MATURATION",
        costOfMaturation: {
          costOfMaturation: inpData.costOfMaturation,
          currency: inpData.currency,
        },
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(
            `${getConfigVars().BASE_URL}50011/api/v1.0/update-batch`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken,
              },
            }
          )
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
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
                    .createCostOfMaturationAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    checkNoSaleAPI(batchId) {
      let currentVal = this;
      const data = {
        batchId: batchId,
        status: "NO_SALE",
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50011/api/v1.0/no-sale`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          })
          .then(function (response) {
            var dbRef = firebase.database().ref("batch/" + batchId + "/lots");
            dbRef.on("child_added", function (snapshot) {
              currentVal.checkPenalityAPI(snapshot.val().serviceRequestId);
            });
            resolve(response);
          })
          .catch(function (error) {
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
                    .checkNoSaleAPI(batchId)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    checkBatchSoldOut(batchId) {
      let unsoldBoxesInBatch = 0;
      var ref = firebase
        .database()
        .ref()
        .child("batch")
        .orderByChild("batchId")
        .equalTo(batchId);

      ref.on("child_added", function (snapshot) {
        const keys = Object.keys(snapshot.val().lots);
        // console.log(snapshot.val().lots[keys[0]]);
        keys.forEach((key) => {
          const currentRequest = snapshot.val().lots[key];
          unsoldBoxesInBatch += currentRequest.remaingNoOfBoxes;
        });
        if (unsoldBoxesInBatch == 0) {
          firebase
            .database()
            .ref()
            .child("batch")
            .child(batchId)
            .update({ status: "Sold Out" })
            .then((updated) => {
              console.log(updated);
            })
            .catch((failed) => {
              console.log(failed);
            });
        }
      });
    },
    getOrganizationData(batchId) {
      const vm = this;
      let data = {};
      return new Promise((resolve, reject) => {
        firebase
          .database()
          .ref()
          .child("batch")
          .child(batchId)
          .on("value", (batchSnapshot) => {
            let lspOrgKey = batchSnapshot.val().organizationKey;
            firebase
              .database()
              .ref()
              .child("masters")
              .child("organization")
              .child(lspOrgKey)
              .on("value", (orgSnapshot) => {
                let fruit = batchSnapshot.val().product;
                data = {
                  lspOrganizationName: batchSnapshot.val().organization,
                  lspOrganizationKey: lspOrgKey,
                  lspPercentageDistribution: (function () {
                    if (orgSnapshot.val() == null) {
                      return null;
                    }
                    if (fruit == "Avocado") {
                      return orgSnapshot.val().avocadoPercent;
                    } else if (fruit == "Mango") {
                      return orgSnapshot.val().mangoPercent;
                    } else {
                      return orgSnapshot.val().pineapplePercent;
                    }
                  })(),
                  brokerOrganizationName: batchSnapshot.val().proforma
                    .brokerOrganization,
                  brokerOrganizationKey: batchSnapshot.val().proforma
                    .brokerOrganizationKey,
                };
                resolve(data);
              });
            // .catch((error) => {
            //   console.log(error);
            //   reject();
            // });
          });
      });
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
  font-size: 13px;
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
  height: 130px;
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
