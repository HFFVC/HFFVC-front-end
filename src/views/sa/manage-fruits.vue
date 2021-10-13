<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-5 details-container">
        <div class="header-container">
          <h6 class="heading">{{ $t("Fruits", "Fruits") }}</h6>
        </div>

        <div class="main-container-manage-packhouses">
          <perfect-scrollbar class="manage-packhouses-ps">
            <div class="card-body">
              <div
                class="outer-container manage-fruits-wrap"
                v-for="fruit in fruitsList"
                :key="fruit"
              >
                <div
                  class="photo-container manage-fruits-picture-wrap photo-container-icg"
                >
                  <img
                    v-if="fruit == 'Avocado'"
                    src="../../assets/images/avocado.png"
                    :alt="$t('Avocado', 'Avocado')"
                    class="former-picture"
                  />
                  <img
                    v-if="fruit == 'Mango'"
                    src="../../assets/images/mango.png"
                    :alt="$t('Mango', 'Mango')"
                    class="former-picture mango-picture"
                  />
                  <img
                    v-if="fruit == 'Pineapple'"
                    src="../../assets/images/pineapple.png"
                    :alt="$t('Pineapple', 'Pineapple')"
                    class="former-picture"
                  />
                </div>
                <div class="description-container">
                  <label class="lbl-flname lbl-pickup">
                    <!-- <b>Name:</b> -->
                    <span class="fruit-span">{{ $t(fruit, fruit) }}</span>

                    <input
                      type="radio"
                      @click="getFruitFlowStagesData(fruit)"
                      name="fruit"
                      :value="fruit"
                      :checked="selectedFruit == fruit"
                    />
                    <img class="manage-fruits-checklist" />
                  </label>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
      </div>

      <!-- right side container -->
      <div class="col-md-7 details-container">
        <div class="header-container">
          <h6 class="heading">{{ $t(pageTitle, pageTitle) }}</h6>
          <div>
            <img
              @click="showDashboard"
              class="close-details"
              src="../../assets/images/close.png"
            />
          </div>
        </div>

        <div
          class="main-container-manage-packhouses manage-bank-accounts-main-container"
        >
          <perfect-scrollbar>
            <div class="card-body manage-packhouses-field-wrap">
              <div class="emptyContainer" v-if="!fruitFlowConfig">
                <h2 class="card-inside-description">
                  {{ $t("No data to display", "No data to display") }}
                </h2>
              </div>
              <div class="row" v-if="fruitFlowConfig">
                <span class="mandatory-label">
                  {{
                    $t(
                      "The fields marked * are mandatory and the values need to be updated.",
                      "The fields marked * are mandatory and the values need to be updated."
                    )
                  }}
                </span>
              </div>
              <div v-if="financeContainer" class="row margin-top-30 finance-container">
                <h4 class="finance-heading">Finance</h4>
                <div class="col-md-6">
                    <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <label class="lbl-flname lbl-pickup">
                          <b> {{ $t("Per Unit Cost", "Per Unit Cost") }} * </b>
                        </label>
                        <div class="inp-container">
                          {{ $t("Currency", "Currency") }}
                        <br />
                         <v-select
                    v-model="perUnitCurrency"
                    :placeholder="
                      $t('Currency', 'Currency')
                    "
                    class="manage-bank-accountsv-select"
                    :options="currencySource"
                  ></v-select>
                        <!-- <label>HTG</label> -->
                        </div>
                        <div class="inp-container">
                          {{ $t("Per Unit Cost", "Per Unit Cost") }}
                          <input
                            :placeholder="
                              $t('Per Unit Cost', 'Per Unit Cost')
                            "
                            class="inp-details"
                            type="number"
                            v-model="perUnitCost"
                          />
                        </div>
                        <div class="inp-container">
                          {{ $t("Advance Multiplier for LSP", "Advance Multiplier for LSP") }}
                          <input
                            :placeholder="
                              $t('Advance Multiplier for LSP', 'Advance Multiplier for LSP')
                            "
                            class="inp-details"
                            type="number"
                            v-model="advanceMultiplierForLSP"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <label class="lbl-flname lbl-pickup">
                          <b>
                            {{
                              $t(
                                "Average weight per box",
                                "Average weight per box"
                              )
                            }}
                            *
                          </b>
                        </label>
                        <div class="inp-container">
                          <input
                            :placeholder="
                              $t('Average Weight', 'Average Weight')
                            "
                            class="inp-details"
                            type="number"
                            v-model="avgWeightPerBox"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <label class="lbl-flname lbl-pickup">
                          <b> {{ $t("Rate per Kg", "Rate per Kg") }} * </b>
                        </label>
                        <div class="inp-container">
                          {{ $t("Shipment by Air", "Shipment by Air") }}
                          <input
                            :placeholder="
                              $t('Shipment by Air', 'Shipment by Air')
                            "
                            class="inp-details"
                            type="number"
                            v-model="shipmentByAir"
                          />
                        </div>
                        <div class="inp-container">
                          {{ $t("Shipment by Sea", "Shipment by Sea") }}
                          <input
                            :placeholder="
                              $t('Shipment by Sea', 'Shipment by Sea')
                            "
                            class="inp-details"
                            type="number"
                            v-model="shipmentBySea"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
              <div v-if="fruitControlContainer" class="fruit-control-container row">
                <h4 class="finance-heading">Fruit Flow Control</h4>
              <div class="row">
                 <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <label class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.larvaeTesting.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{ $t("Larvae Testing", "Larvae Testing") }}</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              @change="toggle()"
                              switch
                              state
                              size="lg"
                              checked="fruitFlowConfig.larvaeTesting.mandatory"
                              v-model="fruitFlowConfig.larvaeTesting.mandatory"
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.larvaeTesting.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                          <!-- <input
                      type="radio"
                      @click="getFruitFlowStagesData(fruit)"
                      name="fruit"
                      :value="fruit"
                    />
                          <img />-->
                          <!-- <b-form-checkbox switch state checked="fruitFlowConfig.larvaeTesting.mandatory" v-model="fruitFlowConfig.larvaeTesting.mandatory"><span>Larvae Testing Results</span></b-form-checkbox> -->
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
               
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.temperatureMeasurement.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t(
                                "Temperature Measurement",
                                "Temperature Measurement"
                              )
                            }}
                            *</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              size="lg"
                              checked="fruitFlowConfig.temperatureMeasurement.mandatory"
                              v-model="
                                fruitFlowConfig.temperatureMeasurement.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.temperatureMeasurement.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.temperatureMeasurement
                                  .ambientTemp
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Ambient Temperature", "Ambient Temperature")
                              }}</span
                            >
                            <b-form-checkbox
                              disabled
                              switch
                              state
                              checked="fruitFlowConfig.temperatureMeasurement.ambientTemp"
                              v-model="
                                fruitFlowConfig.temperatureMeasurement
                                  .ambientTemp
                              "
                            >
                              <label>{{
                                fruitFlowConfig.temperatureMeasurement
                                  .ambientTemp
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.temperatureMeasurement
                                  .attachments == true
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{ $t("Attachments", "Attachments") }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.temperatureMeasurement.attachments"
                              v-model="
                                fruitFlowConfig.temperatureMeasurement
                                  .attachments
                              "
                            >
                              <label>{{
                                fruitFlowConfig.temperatureMeasurement
                                  .attachments == true
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.temperatureMeasurement
                                  .internalFruitTemperature
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t(
                                  "Internal Fruit Temperature",
                                  "Internal Fruit Temperature"
                                )
                              }}</span
                            >
                            <b-form-checkbox
                              disabled
                              switch
                              state
                              checked="fruitFlowConfig.temperatureMeasurement.internalFruitTemperature"
                              v-model="
                                fruitFlowConfig.temperatureMeasurement
                                  .internalFruitTemperature
                              "
                            >
                              <label>{{
                                fruitFlowConfig.temperatureMeasurement
                                  .internalFruitTemperature
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.qualityInspection.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t("Quality Inspection", "Quality Inspection")
                            }}
                            *</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              disabled
                              switch
                              state
                              size="lg"
                              checked="fruitFlowConfig.qualityInspection.mandatory"
                              v-model="
                                fruitFlowConfig.qualityInspection.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.qualityInspection.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.qualityInspection.fruitsAccepted
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Fruits Accepted", "Fruits Accepted")
                              }}</span
                            >
                            <b-form-checkbox
                              disabled
                              switch
                              state
                              checked="fruitFlowConfig.qualityInspection.fruitsAccepted"
                              v-model="
                                fruitFlowConfig.qualityInspection.fruitsAccepted
                              "
                            >
                              <label>{{
                                fruitFlowConfig.qualityInspection.fruitsAccepted
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.qualityInspection.fruitsRejected
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Fruits Rejected", "Fruits Rejected")
                              }}</span
                            >
                            <b-form-checkbox
                              disabled
                              switch
                              state
                              checked="fruitFlowConfig.qualityInspection.fruitsRejected"
                              v-model="
                                fruitFlowConfig.qualityInspection.fruitsRejected
                              "
                            >
                              <label>{{
                                fruitFlowConfig.qualityInspection.fruitsRejected
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.qualityInspection
                                  .qualityInspectionResults
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t(
                                  "Quality Inspection Results",
                                  "Quality Inspection Results"
                                )
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.qualityInspection.qualityInspectionResults"
                              v-model="
                                fruitFlowConfig.qualityInspection
                                  .qualityInspectionResults
                              "
                            >
                              <label>{{
                                fruitFlowConfig.qualityInspection
                                  .qualityInspectionResults
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                         <div class="col-md-6" v-if="selectedFruit != 'Avocado'">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.fruitWashing.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{ $t("Fruit Washing", "Fruit Washing") }}</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              @change="toggle()"
                              switch
                              state
                              size="lg"
                              checked="fruitFlowConfig.fruitWashing.mandatory"
                              v-model="fruitFlowConfig.fruitWashing.mandatory"
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.fruitWashing.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.fruitWashing.PHLevel
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{ $t("PH Level", "PH Level") }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.fruitWashing.PHLevel"
                              v-model="fruitFlowConfig.fruitWashing.PHLevel"
                            >
                              <label>{{
                                fruitFlowConfig.fruitWashing.PHLevel
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.fruitWashing.chlorineLevel
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Chlorine Level", "Chlorine Level")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.fruitWashing.chlorineLevel"
                              v-model="
                                fruitFlowConfig.fruitWashing.chlorineLevel
                              "
                            >
                              <label>{{
                                fruitFlowConfig.fruitWashing.chlorineLevel
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.fruitWashing.waterTemperature
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Water Temperature", "Water Temperature")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.fruitWashing.waterTemperature"
                              v-model="
                                fruitFlowConfig.fruitWashing.waterTemperature
                              "
                            >
                              <label>{{
                                fruitFlowConfig.fruitWashing.waterTemperature
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             
              <div class="row">
                <div class="col-md-6" v-if="selectedFruit == 'Avocado'">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.transferToColdStorage.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t(
                                "Transfer to Cold Storage",
                                "Transfer to Cold Storage"
                              )
                            }}
                            *</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              disabled
                              switch
                              state
                              size="lg"
                              checked="fruitFlowConfig.transferToColdStorage.mandatory"
                              v-model="
                                fruitFlowConfig.transferToColdStorage.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.transferToColdStorage.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.transferToColdStorage
                                  .storageTimeIn
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Storage Time In", "Storage Time In")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              checked="fruitFlowConfig.transferToColdStorage.storageTimeIn"
                              v-model="
                                fruitFlowConfig.transferToColdStorage
                                  .storageTimeIn
                              "
                            >
                              <label>{{
                                fruitFlowConfig.transferToColdStorage
                                  .storageTimeIn
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.transferToColdStorage
                                  .temperature
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{ $t("Temperature", "Temperature") }}</span
                            >
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              checked="fruitFlowConfig.transferToColdStorage.temperature"
                              v-model="
                                fruitFlowConfig.transferToColdStorage
                                  .temperature
                              "
                            >
                              <label>{{
                                fruitFlowConfig.transferToColdStorage
                                  .temperature
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6" v-if="selectedFruit == 'Avocado'">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.removalFromColdStorage.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t(
                                "Removal from Cold Storage",
                                "Removal from Cold Storage"
                              )
                            }}
                            *</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              size="lg"
                              checked="fruitFlowConfig.removalFromColdStorage.mandatory"
                              v-model="
                                fruitFlowConfig.removalFromColdStorage.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.removalFromColdStorage.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div class="config-label-wrap">
                          <span
                            v-bind:class="
                              fruitFlowConfig.removalFromColdStorage
                                .storageTimeOut
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t("Storage Time Out", "Storage Time Out")
                            }}</span
                          >
                          <b-form-checkbox
                            switch
                            state
                            disabled
                            checked="fruitFlowConfig.removalFromColdStorage.storageTimeOut"
                            v-model="
                              fruitFlowConfig.removalFromColdStorage
                                .storageTimeOut
                            "
                          >
                            <label>{{
                              fruitFlowConfig.removalFromColdStorage
                                .storageTimeOut
                                ? "On"
                                : "Off"
                            }}</label>
                          </b-form-checkbox>
                        </div>
                        <div class="config-label-wrap">
                          <span
                            v-bind:class="
                              fruitFlowConfig.removalFromColdStorage.temperature
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{ $t("Temperature", "Temperature") }}</span
                          >
                          <b-form-checkbox
                            switch
                            disabled
                            state
                            checked="fruitFlowConfig.removalFromColdStorage.temperature"
                            v-model="
                              fruitFlowConfig.removalFromColdStorage.temperature
                            "
                          >
                            <label>{{
                              fruitFlowConfig.removalFromColdStorage.temperature
                                ? "On"
                                : "Off"
                            }}</label>
                          </b-form-checkbox>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.feedPackingLineConveyorBelt
                                .mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t(
                                "Feed Packing Line Conveyor Belt",
                                "Feed Packing Line Conveyor Belt"
                              )
                            }}</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              state
                              size="lg"
                              checked="fruitFlowConfig.feedPackingLineConveyorBelt.mandatory"
                              v-model="
                                fruitFlowConfig.feedPackingLineConveyorBelt
                                  .mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.feedPackingLineConveyorBelt
                                .mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.grading.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{ $t("Grading", "Grading") }}</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              @change="toggle()"
                              state
                              size="lg"
                              checked="fruitFlowConfig.grading.mandatory"
                              v-model="fruitFlowConfig.grading.mandatory"
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.grading.mandatory ? "On" : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.grading.fruitsRemoved
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Fruits Removed", "Fruits Removed")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.grading.fruitsRemoved"
                              v-model="fruitFlowConfig.grading.fruitsRemoved"
                            >
                              <label>{{
                                fruitFlowConfig.grading.fruitsRemoved
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.grading.gradingResults
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Grading Results", "Grading Results")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.grading.gradingResults"
                              v-model="fruitFlowConfig.grading.gradingResults"
                            >
                              <label>{{
                                fruitFlowConfig.grading.gradingResults
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div
                    class="card-body h-100"
                    v-if="fruitFlowConfig && selectedFruit == 'Mango'"
                  >
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.sizing.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{ $t("First Sizing", "First Sizing") }}</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              @change="toggle()"
                              state
                              size="lg"
                              checked="fruitFlowConfig.sizing.mandatory"
                              v-model="fruitFlowConfig.sizing.mandatory"
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.sizing.mandatory ? "On" : "Off"
                            }}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.cartonFillingAndPalletizing
                                .mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{ $t("Carton Filling", "Carton Filling") }} *</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              size="lg"
                              checked="fruitFlowConfig.cartonFillingAndPalletizing.mandatory"
                              v-model="
                                fruitFlowConfig.cartonFillingAndPalletizing
                                  .mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.cartonFillingAndPalletizing
                                .mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.cartonFillingAndPalletizing
                                  .startQRCodeFruits
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t(
                                  "Start QR Code Fruits",
                                  "Start QR Code Fruits"
                                )
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              disabled
                              checked="fruitFlowConfig.cartonFillingAndPalletizing.startQRCodeFruits"
                              v-model="
                                fruitFlowConfig.cartonFillingAndPalletizing
                                  .startQRCodeFruits
                              "
                            >
                              <label>{{
                                fruitFlowConfig.cartonFillingAndPalletizing
                                  .startQRCodeFruits
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.cartonFillingAndPalletizing
                                  .endQRCodeFruits
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("End QR Code Fruits", "End QR Code Fruits")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              disabled
                              checked="fruitFlowConfig.cartonFillingAndPalletizing.endQRCodeFruits"
                              v-model="
                                fruitFlowConfig.cartonFillingAndPalletizing
                                  .endQRCodeFruits
                              "
                            >
                              <label>{{
                                fruitFlowConfig.cartonFillingAndPalletizing
                                  .endQRCodeFruits
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.cartonFillingAndPalletizing
                                  .startQRCodeBox
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Start QR Code Boxes", "Start QR Code Boxes")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              disabled
                              checked="fruitFlowConfig.cartonFillingAndPalletizing.startQRCodeBox"
                              v-model="
                                fruitFlowConfig.cartonFillingAndPalletizing
                                  .startQRCodeBox
                              "
                            >
                              <label>{{
                                fruitFlowConfig.cartonFillingAndPalletizing
                                  .startQRCodeBox
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.cartonFillingAndPalletizing
                                  .endQRCodeBox
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("End QR Code Boxes", "End QR Code Boxes")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              disabled
                              checked="fruitFlowConfig.cartonFillingAndPalletizing.endQRCodeBox"
                              v-model="
                                fruitFlowConfig.cartonFillingAndPalletizing
                                  .endQRCodeBox
                              "
                            >
                              <label>{{
                                fruitFlowConfig.cartonFillingAndPalletizing
                                  .endQRCodeBox
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.temperatureReadingPackedLot
                                .mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t(
                                "Temperature Reading For Packed Lot",
                                "Temperature Reading For Packed Lot"
                              )
                            }}
                            *</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              size="lg"
                              checked="fruitFlowConfig.temperatureReadingPackedLot.mandatory"
                              v-model="
                                fruitFlowConfig.temperatureReadingPackedLot
                                  .mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.temperatureReadingPackedLot
                                .mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.temperatureReadingPackedLot
                                  .ambientTemperature
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Ambient Temperature", "Ambient Temperature")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              checked="fruitFlowConfig.temperatureReadingPackedLot.ambientTemperature"
                              v-model="
                                fruitFlowConfig.temperatureReadingPackedLot
                                  .ambientTemperature
                              "
                            >
                              <label>{{
                                fruitFlowConfig.temperatureReadingPackedLot
                                  .ambientTemperature
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.temperatureReadingPackedLot
                                  .internalFruitTemperature
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t(
                                  "Internal Fruit Temperature",
                                  "Internal Fruit Temperature"
                                )
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              disabled
                              checked="fruitFlowConfig.temperatureReadingPackedLot.internalFruitTemperature"
                              v-model="
                                fruitFlowConfig.temperatureReadingPackedLot
                                  .internalFruitTemperature
                              "
                            >
                              <label>{{
                                fruitFlowConfig.temperatureReadingPackedLot
                                  .internalFruitTemperature
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.forcedAirCoolingEntry.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t(
                                "Forced Air Cooling Entry",
                                "Forced Air Cooling Entry"
                              )
                            }}
                            *</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              size="lg"
                              checked="fruitFlowConfig.forcedAirCoolingEntry.mandatory"
                              v-model="
                                fruitFlowConfig.forcedAirCoolingEntry.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.forcedAirCoolingEntry.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.forcedAirCoolingEntry
                                  .airflowTemperature
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Airflow Temperature", "Airflow Temperature")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              disabled
                              checked="fruitFlowConfig.forcedAirCoolingEntry.airflowTemperature"
                              v-model="
                                fruitFlowConfig.forcedAirCoolingEntry
                                  .airflowTemperature
                              "
                            >
                              <label>{{
                                fruitFlowConfig.forcedAirCoolingEntry
                                  .airflowTemperature
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.forcedAirCoolingEntry
                                  .fruitTemperatureAtEntry
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t(
                                  "Fruit Temperature at Entry",
                                  "Fruit Temperature at Entry"
                                )
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              checked="fruitFlowConfig.forcedAirCoolingEntry.fruitTemperatureAtEntry"
                              v-model="
                                fruitFlowConfig.forcedAirCoolingEntry
                                  .fruitTemperatureAtEntry
                              "
                            >
                              <label>{{
                                fruitFlowConfig.forcedAirCoolingEntry
                                  .fruitTemperatureAtEntry
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.removalFromForcedAirCooling
                                .mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t(
                                "Removal from Forced Air Cooling",
                                "Removal from Forced Air Cooling"
                              )
                            }}
                            *</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              size="lg"
                              checked="fruitFlowConfig.removalFromForcedAirCooling.mandatory"
                              v-model="
                                fruitFlowConfig.removalFromForcedAirCooling
                                  .mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.removalFromForcedAirCooling
                                .mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.removalFromForcedAirCooling
                                  .fruitTemperatureOnExit
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t(
                                  "Fruit Temperature on Exit",
                                  "Fruit Temperature on Exit"
                                )
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              checked="fruitFlowConfig.removalFromForcedAirCooling.fruitTemperatureOnExit"
                              v-model="
                                fruitFlowConfig.removalFromForcedAirCooling
                                  .fruitTemperatureOnExit
                              "
                            >
                              <label>{{
                                fruitFlowConfig.removalFromForcedAirCooling
                                  .fruitTemperatureOnExit
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.removalFromForcedAirCooling
                                  .timeOfExit
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{ $t("Time of Exit", "Time of Exit") }}</span
                            >
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              checked="fruitFlowConfig.removalFromForcedAirCooling.timeOfExit"
                              v-model="
                                fruitFlowConfig.removalFromForcedAirCooling
                                  .timeOfExit
                              "
                            >
                              <label>{{
                                fruitFlowConfig.removalFromForcedAirCooling
                                  .timeOfExit
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.coldRoomStorageIn.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{ $t("Cold Storage In", "Cold Storage In") }}</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              @change="toggle()"
                              state
                              size="lg"
                              checked="fruitFlowConfig.coldRoomStorageIn.mandatory"
                              v-model="
                                fruitFlowConfig.coldRoomStorageIn.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.coldRoomStorageIn.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.coldRoomStorageIn
                                  .airflowTemperature
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Airflow Temperature", "Airflow Temperature")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.coldRoomStorageIn.airflowTemperature"
                              v-model="
                                fruitFlowConfig.coldRoomStorageIn
                                  .airflowTemperature
                              "
                            >
                              <label>{{
                                fruitFlowConfig.coldRoomStorageIn
                                  .airflowTemperature
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.coldRoomStorageIn
                                  .fruitTemperature
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Fruit Temperature", "Fruit Temperature")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.coldRoomStorageIn.fruitTemperature"
                              v-model="
                                fruitFlowConfig.coldRoomStorageIn
                                  .fruitTemperature
                              "
                            >
                              <label>{{
                                fruitFlowConfig.coldRoomStorageIn
                                  .fruitTemperature
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.coldRoomStorageIn.storageTimeIn
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Storage Time In", "Storage Time In")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.coldRoomStorageIn.storageTimeIn"
                              v-model="
                                fruitFlowConfig.coldRoomStorageIn.storageTimeIn
                              "
                            >
                              <label>{{
                                fruitFlowConfig.coldRoomStorageIn.storageTimeIn
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.coldRoomStorageOut.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{ $t("Cold Storage Out", "Cold Storage Out") }}</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              @change="toggle()"
                              state
                              size="lg"
                              checked="fruitFlowConfig.coldRoomStorageOut.mandatory"
                              v-model="
                                fruitFlowConfig.coldRoomStorageOut.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.coldRoomStorageOut.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.coldRoomStorageOut
                                  .fruitTemperature
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Fruit Temperature", "Fruit Temperature")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.coldRoomStorageOut.fruitTemperature"
                              v-model="
                                fruitFlowConfig.coldRoomStorageOut
                                  .fruitTemperature
                              "
                            >
                              <label>{{
                                fruitFlowConfig.coldRoomStorageOut
                                  .fruitTemperature
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.coldRoomStorageOut
                                  .storageTimeOut
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Storage Time Out", "Storage Time Out")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.coldRoomStorageOut.storageTimeOut"
                              v-model="
                                fruitFlowConfig.coldRoomStorageOut
                                  .storageTimeOut
                              "
                            >
                              <label>{{
                                fruitFlowConfig.coldRoomStorageOut
                                  .storageTimeOut
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.uploadProductCertifications
                                .mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t(
                                "Upload Product Certifications",
                                "Upload Product Certifications"
                              )
                            }}</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              state
                              size="lg"
                              checked="fruitFlowConfig.uploadProductCertifications.mandatory"
                              v-model="
                                fruitFlowConfig.uploadProductCertifications
                                  .mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.uploadProductCertifications
                                .mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.sampling.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{ $t("Sampling", "Sampling") }}</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              @change="toggle()"
                              state
                              size="lg"
                              checked="fruitFlowConfig.sampling.mandatory"
                              v-model="fruitFlowConfig.sampling.mandatory"
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.sampling.mandatory ? "On" : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.sampling.samplesTaken
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{ $t("Samples Taken", "Samples Taken") }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.sampling.samplesTaken"
                              v-model="fruitFlowConfig.sampling.samplesTaken"
                            >
                              <label>{{
                                fruitFlowConfig.sampling.samplesTaken
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.sampling.temperature
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{ $t("Temperature", "Temperature") }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.sampling.temperature"
                              v-model="fruitFlowConfig.sampling.temperature"
                            >
                              <label>{{
                                fruitFlowConfig.sampling.temperature
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.sampling.timestamp
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{ $t("Timestamp", "Timestamp") }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.sampling.timestamp"
                              v-model="fruitFlowConfig.sampling.timestamp"
                            >
                              <label>{{
                                fruitFlowConfig.sampling.timestamp
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.shippingDetails.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t("Shipping Details", "Shipping Details")
                            }}
                            *</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              size="lg"
                              checked="fruitFlowConfig.shippingDetails.mandatory"
                              v-model="
                                fruitFlowConfig.shippingDetails.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.shippingDetails.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.containerInspection.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t("Container Inspection", "Container Inspection")
                            }}
                            *</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              size="lg"
                              checked="fruitFlowConfig.containerInspection.mandatory"
                              v-model="
                                fruitFlowConfig.containerInspection.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.containerInspection.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.preCoolingReefers.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t("Pre Cooling Reefers", "Pre Cooling Reefers")
                            }}
                            *</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              size="lg"
                              checked="fruitFlowConfig.preCoolingReefers.mandatory"
                              v-model="
                                fruitFlowConfig.preCoolingReefers.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.preCoolingReefers.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.coldTunnelLoading.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t("Cold Tunnel Loading", "Cold Tunnel Loading")
                            }}
                            *</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              size="lg"
                              checked="fruitFlowConfig.coldTunnelLoading.mandatory"
                              v-model="
                                fruitFlowConfig.coldTunnelLoading.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.coldTunnelLoading.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.coldTunnelLoading
                                  .destinationDateAndTime
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t(
                                  "Destination Date And Time",
                                  "Destination Date And Time"
                                )
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              checked="fruitFlowConfig.coldTunnelLoading.destinationDateAndTime"
                              v-model="
                                fruitFlowConfig.coldTunnelLoading
                                  .destinationDateAndTime
                              "
                            >
                              <label>{{
                                fruitFlowConfig.coldTunnelLoading
                                  .destinationDateAndTime
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.coldTunnelLoading
                                  .reeferWallTemperature
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t(
                                  "Reefer Wall Temperature",
                                  "Reefer Wall Temperature"
                                )
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              checked="fruitFlowConfig.coldTunnelLoading.reeferWallTemperature"
                              v-model="
                                fruitFlowConfig.coldTunnelLoading
                                  .reeferWallTemperature
                              "
                            >
                              <label>{{
                                fruitFlowConfig.coldTunnelLoading
                                  .reeferWallTemperature
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.transportDetails.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t("Transport Details", "Transport Details")
                            }}
                            *</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              size="lg"
                              checked="fruitFlowConfig.transportDetails.mandatory"
                              v-model="
                                fruitFlowConfig.transportDetails.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.transportDetails.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                          <div>
                            <!-- <div class="config-label-wrap">
                              <span
                                v-bind:class="
                                  fruitFlowConfig.transportDetails.transportCost
                                    ? 'green-color'
                                    : 'white-color'
                                "
                                >{{
                                  $t("Transport Cost", "Transport Cost")
                                }}</span
                              >
                              <b-form-checkbox
                                switch
                                state
                                checked="fruitFlowConfig.transportDetails.transportCost"
                                v-model="
                                  fruitFlowConfig.transportDetails.transportCost
                                "
                              >
                                <label>{{
                                  fruitFlowConfig.transportDetails.transportCost
                                    ? "On"
                                    : "Off"
                                }}</label>
                              </b-form-checkbox>
                            </div> -->
                            <div class="config-label-wrap">
                              <span
                                v-bind:class="
                                  fruitFlowConfig.transportDetails
                                    .transportConditions
                                    ? 'green-color'
                                    : 'white-color'
                                "
                                >{{
                                  $t(
                                    "Transport Conditions",
                                    "Transport Conditions"
                                  )
                                }}</span
                              >
                              <b-form-checkbox
                                switch
                                state
                                checked="fruitFlowConfig.transportDetails.transportConditions"
                                v-model="
                                  fruitFlowConfig.transportDetails
                                    .transportConditions
                                "
                              >
                                <label>{{
                                  fruitFlowConfig.transportDetails
                                    .transportConditions
                                    ? "On"
                                    : "Off"
                                }}</label>
                              </b-form-checkbox>
                            </div>
                            <div class="config-label-wrap">
                              <span
                                v-bind:class="
                                  fruitFlowConfig.transportDetails.temperature
                                    ? 'green-color'
                                    : 'white-color'
                                "
                                >{{ $t("Temperature", "Temperature") }}</span
                              >
                              <b-form-checkbox
                                switch
                                disabled
                                state
                                checked="fruitFlowConfig.transportDetails.temperature"
                                v-model="
                                  fruitFlowConfig.transportDetails.temperature
                                "
                              >
                                <label>{{
                                  fruitFlowConfig.transportDetails.temperature
                                    ? "On"
                                    : "Off"
                                }}</label>
                              </b-form-checkbox>
                            </div>
                            <div class="config-label-wrap">
                              <span
                                v-bind:class="
                                  fruitFlowConfig.transportDetails.destination
                                    ? 'green-color'
                                    : 'white-color'
                                "
                                >{{ $t("Destination", "Destination") }}</span
                              >
                              <b-form-checkbox
                                switch
                                disabled
                                state
                                checked="fruitFlowConfig.transportDetails.destination"
                                v-model="
                                  fruitFlowConfig.transportDetails.destination
                                "
                              >
                                <label>{{
                                  fruitFlowConfig.transportDetails.destination
                                    ? "On"
                                    : "Off"
                                }}</label>
                              </b-form-checkbox>
                            </div>
                            <div class="config-label-wrap">
                              <span
                                v-bind:class="
                                  fruitFlowConfig.transportDetails
                                    .departureDateAndTime
                                    ? 'green-color'
                                    : 'white-color'
                                "
                                >{{
                                  $t(
                                    "Departure Date and Time",
                                    "Departure Date and Time"
                                  )
                                }}</span
                              >
                              <b-form-checkbox
                                switch
                                disabled
                                state
                                checked="fruitFlowConfig.transportDetails.departureDateAndTime"
                                v-model="
                                  fruitFlowConfig.transportDetails
                                    .departureDateAndTime
                                "
                              >
                                <label>{{
                                  fruitFlowConfig.transportDetails
                                    .departureDateAndTime
                                    ? "On"
                                    : "Off"
                                }}</label>
                              </b-form-checkbox>
                            </div>
                            <!-- <div class="config-label-wrap">
                              <span
                                v-bind:class="
                                  fruitFlowConfig.transportDetails.currency
                                    ? 'green-color'
                                    : 'white-color'
                                "
                                >{{ $t("Currency", "Currency") }}</span
                              >
                              <b-form-checkbox
                                switch
                                state
                                checked="fruitFlowConfig.transportDetails.currency"
                                v-model="
                                  fruitFlowConfig.transportDetails.currency
                                "
                              >
                                <label>{{
                                  fruitFlowConfig.transportDetails.currency
                                    ? "On"
                                    : "Off"
                                }}</label>
                              </b-form-checkbox>
                            </div> -->
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6" v-if="selectedFruit == 'Pineapple'">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.cleaningAndTrimming.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t(
                                "Cleaning And Trimming",
                                "Cleaning And Trimming"
                              )
                            }}</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              size="lg"
                              checked="fruitFlowConfig.cleaningAndTrimming.mandatory"
                              v-model="
                                fruitFlowConfig.cleaningAndTrimming.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.cleaningAndTrimming.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6" v-if="selectedFruit == 'Mango'">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.hotWaterTreatmentEntry.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t(
                                "Hot Water Treatment Entry",
                                "Hot Water Treatment Entry"
                              )
                            }}</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              @change="toggle()"
                              state
                              size="lg"
                              checked="fruitFlowConfig.hotWaterTreatmentEntry.mandatory"
                              v-model="
                                fruitFlowConfig.hotWaterTreatmentEntry.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.hotWaterTreatmentEntry.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.hotWaterTreatmentEntry.PHLevel
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{ $t("PH Level", "PH Level") }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.hotWaterTreatmentEntry.PHLevel"
                              v-model="
                                fruitFlowConfig.hotWaterTreatmentEntry.PHLevel
                              "
                            >
                              <label>{{
                                fruitFlowConfig.hotWaterTreatmentEntry.PHLevel
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.hotWaterTreatmentEntry
                                  .chlorineLevel
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Chlorine Level", "Chlorine Level")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.hotWaterTreatmentEntry.chlorineLevel"
                              v-model="
                                fruitFlowConfig.hotWaterTreatmentEntry
                                  .chlorineLevel
                              "
                            >
                              <label>{{
                                fruitFlowConfig.hotWaterTreatmentEntry
                                  .chlorineLevel
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.hotWaterTreatmentEntry
                                  .timeOfEntry
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{ $t("Time of Entry", "Time of Entry") }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.hotWaterTreatmentEntry.timeOfEntry"
                              v-model="
                                fruitFlowConfig.hotWaterTreatmentEntry
                                  .timeOfEntry
                              "
                            >
                              <label>{{
                                fruitFlowConfig.hotWaterTreatmentEntry
                                  .timeOfEntry
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.hotWaterTreatmentEntry
                                  .waterTemperature
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Water Temperature", "Water Temperature")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.hotWaterTreatmentEntry.waterTemperature"
                              v-model="
                                fruitFlowConfig.hotWaterTreatmentEntry
                                  .waterTemperature
                              "
                            >
                              <label>{{
                                fruitFlowConfig.hotWaterTreatmentEntry
                                  .waterTemperature
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6" v-if="selectedFruit == 'Mango'">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.hotWaterTreatmentExit.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t(
                                "Hot Water Treatment Exit",
                                "Hot Water Treatment Exit"
                              )
                            }}</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              @change="toggle()"
                              switch
                              state
                              size="lg"
                              checked="fruitFlowConfig.hotWaterTreatmentExit.mandatory"
                              v-model="
                                fruitFlowConfig.hotWaterTreatmentExit.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.hotWaterTreatmentExit.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.hotWaterTreatmentExit
                                  .durationOfTreatment
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t(
                                  "Duration of Treatment",
                                  "Duration of Treatment"
                                )
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.hotWaterTreatmentExit.durationOfTreatment"
                              v-model="
                                fruitFlowConfig.hotWaterTreatmentExit
                                  .durationOfTreatment
                              "
                            >
                              <label>{{
                                fruitFlowConfig.hotWaterTreatmentExit
                                  .durationOfTreatment
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.hotWaterTreatmentExit.timeOfExit
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{ $t("Time of Exit", "Time of Exit") }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              checked="fruitFlowConfig.hotWaterTreatmentExit.timeOfExit"
                              v-model="
                                fruitFlowConfig.hotWaterTreatmentExit.timeOfExit
                              "
                            >
                              <label>{{
                                fruitFlowConfig.hotWaterTreatmentExit.timeOfExit
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6" v-if="selectedFruit == 'Mango'">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.hydroCoolingEntry.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t("Hydro Cooling Entry", "Hydro Cooling Entry")
                            }}
                            *</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              disabled
                              switch
                              state
                              size="lg"
                              checked="fruitFlowConfig.hydroCoolingEntry.mandatory"
                              v-model="
                                fruitFlowConfig.hydroCoolingEntry.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.hydroCoolingEntry.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.hydroCoolingEntry.PHLevel
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{ $t("PH Level", "PH Level") }}</span
                            >
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              checked="fruitFlowConfig.hydroCoolingEntry.PHLevel"
                              v-model="
                                fruitFlowConfig.hydroCoolingEntry.PHLevel
                              "
                            >
                              <label>{{
                                fruitFlowConfig.hydroCoolingEntry.PHLevel
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.hydroCoolingEntry.chlorineLevel
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Chlorine Level", "Chlorine Level")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              checked="fruitFlowConfig.hydroCoolingEntry.chlorineLevel"
                              v-model="
                                fruitFlowConfig.hydroCoolingEntry.chlorineLevel
                              "
                            >
                              <label>{{
                                fruitFlowConfig.hydroCoolingEntry.chlorineLevel
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.hydroCoolingEntry
                                  .waterTemperature
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t("Water Temperature", "Water Temperature")
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              state
                              disabled
                              checked="fruitFlowConfig.hydroCoolingEntry.waterTemperature"
                              v-model="
                                fruitFlowConfig.hydroCoolingEntry
                                  .waterTemperature
                              "
                            >
                              <label>{{
                                fruitFlowConfig.hydroCoolingEntry
                                  .waterTemperature
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6" v-if="selectedFruit == 'Mango'">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.hydroCoolingExit.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{
                              $t("Hydro Cooling Exit", "Hydro Cooling Exit")
                            }}
                            *</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              size="lg"
                              checked="fruitFlowConfig.hydroCoolingExit.mandatory"
                              v-model="
                                fruitFlowConfig.hydroCoolingExit.mandatory
                              "
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.hydroCoolingExit.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                        <div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.hydroCoolingExit
                                  .internalFruitTemperature
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{
                                $t(
                                  "Internal Fruit Temperature",
                                  "Internal Fruit Temperature"
                                )
                              }}</span
                            >
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              checked="fruitFlowConfig.hydroCoolingExit.internalFruitTemperature"
                              v-model="
                                fruitFlowConfig.hydroCoolingExit
                                  .internalFruitTemperature
                              "
                            >
                              <label>{{
                                fruitFlowConfig.hydroCoolingExit
                                  .internalFruitTemperature
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.hydroCoolingExit.timeOfExit
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{ $t("Time of Exit", "Time of Exit") }}</span
                            >
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              checked="fruitFlowConfig.hydroCoolingExit.timeOfExit"
                              v-model="
                                fruitFlowConfig.hydroCoolingExit.timeOfExit
                              "
                            >
                              <label>{{
                                fruitFlowConfig.hydroCoolingExit.timeOfExit
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                          <div class="config-label-wrap">
                            <span
                              v-bind:class="
                                fruitFlowConfig.hydroCoolingExit.duration
                                  ? 'green-color'
                                  : 'white-color'
                              "
                              >{{ $t("Duration", "Duration") }}</span
                            >
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              checked="fruitFlowConfig.hydroCoolingExit.duration"
                              v-model="
                                fruitFlowConfig.hydroCoolingExit.duration
                              "
                            >
                              <label>{{
                                fruitFlowConfig.hydroCoolingExit.duration
                                  ? "On"
                                  : "Off"
                              }}</label>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card-body h-100" v-if="fruitFlowConfig">
                    <div class="outer-container h-100 config-outer-container">
                      <div
                        class="description-container config-description w-100"
                      >
                        <div class="lbl-flname lbl-pickup">
                          <b
                            v-bind:class="
                              fruitFlowConfig.secondSizing.mandatory
                                ? 'green-color'
                                : 'white-color'
                            "
                            >{{ $t("Sizing", "Sizing") }}</b
                          >
                          <div class="stage-switch">
                            <b-form-checkbox
                              switch
                              disabled
                              state
                              size="lg"
                              checked="fruitFlowConfig.secondSizing.mandatory"
                              v-model="fruitFlowConfig.secondSizing.mandatory"
                            ></b-form-checkbox>
                            <label>{{
                              fruitFlowConfig.secondSizing.mandatory
                                ? "On"
                                : "Off"
                            }}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container" v-if="fruitFlowConfig != null">
          <input type="button" class="btn-cancel" value="Cancel" />
          <input
            type="button"
            class="btn-save"
            value="Save"
            @click="updateFruitFlowStageDetails()"
          />
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
Vue.use(VueToast);

Vue.use(Datetime);
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from '../../shared/auth';


export default {
  name: "manage-fruits",
  data: function () {
    return {
      seen: true,
      emptyContainer: true,
      financeContainer:false,
      fruitControlContainer : false,
      userName: null,
      pageTitle: null,
      productSelected: null,
      fruitsList: ["Avocado", "Mango", "Pineapple"],
      fruitFlowConfig: null,
      selectedFruit: null,
      avgWeightPerBox: null,
      shipmentByAir: null,
      shipmentBySea: null,
      perUnitCost:null,
      advanceMultiplierForLSP:1,
      productName:null,
      perUnitCurrency:"USD",
      currencySource: ["USD", "HTG"]
    };
  },
  components: {
    PerfectScrollbar,
    Header,
    Footer,
  },
  mounted() {

    if (localStorage.systemRole == 99) {
       if(getConfigVars().USERID == isAuthenticated())
      {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Technology Service Provider-Dashboard", "Technology Service Provider-Dashboard"),
          href: "/sa-dashboard",
        },
        {
          text: this.$t("Manage Fruit Flow", "Manage Fruit Flow"),
          href: "/manage-fruits",
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
          text: this.$t("Manage Fruit Flow", "Manage Fruit Flow"),
          href: "/manage-fruits",
        },
      ]);
      }
    } else if (localStorage.systemRole == 10) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"),
          href: "/observer-mci-dashboard",
        },
        {
          text: this.$t("Manage Fruit Flow", "Manage Fruit Flow"),
          href: "/manage-fruits",
        },
      ]);
    }
    // if (!localStorage.emailId) {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
    this.pageTitle = this.$t("Finance and Fruit Flow Control", "Finance and Fruit Flow Control");
    this.seen = false;
    // this.getFruitFlowStagesData()
  },
  methods: {
    logout: function () {
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
    showDashboard: () => Router.push("sa-dashboard"),
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      }
    },
    getFruitFlowStagesData(fruit) {
      console.log(fruit);
       this.financeContainer = true;
      this.fruitControlContainer = true;
      const vm = this;
      // let flag = false;
      vm.seen = true;
      vm.selectedFruit = fruit;
      vm.getWeightAndRateDetails();
      let timeout = setTimeout(() => {
        vm.seen = true;
        // if not found then take from master
        if (!vm.fruitFlowConfig) {
          firebase
            .database()
            .ref()
            .child("masters")
            .child("fruits")
            .child("master")
            .child(fruit)
            .on("value", (snapshot) => {
              clearTimeout(timeout);
              vm.fruitFlowConfig = snapshot.val();
              console.log(vm.fruitFlowConfig);
              vm.seen = false;
            });
        }
      }, 3000);
      let _ref = null;
      if (
        localStorage.systemRole == 99 &&
        localStorage.emailId == localStorage.organizationKey
      ) {
        _ref = firebase
          .database()
          .ref()
          .child("masters")
          .child("fruits")
          .child("master")
          .child(fruit);
      } else {
        _ref = firebase
          .database()
          .ref()
          .child("masters")
          .child("fruits")
          .child(localStorage.organizationKey)
          .child(fruit);
      }
      _ref.on("value", (snapshot) => {
        vm.fruitFlowConfig = snapshot.val();
        console.log(vm.fruitFlowConfig);
        if (vm.fruitFlowConfig != null) {
          clearTimeout(timeout);
          vm.seen = false;
        }
      });
    },
    getWeightAndRateDetails() {
      const vm = this;
      console.log(vm.selectedFruit);
      vm.perUnitCost = null;
      vm.advanceMultiplierForLSP = 1;
      vm.productName = null;
      vm.perUnitCurrency = null;
      vm.avgWeightPerBox = null;
      vm.shipmentBySea = null;
      vm.shipmentByAir = null;
      firebase
        .database()
        .ref()
        .child("masters/product")
        .child(vm.selectedFruit)
        .once("value", (snapshot) => {
          console.log(snapshot.val());
          if (snapshot.val() != null) {
            vm.perUnitCost = snapshot.val().perUnitCost;
            if(snapshot.val().advanceMultiplierForLSP != null)
            {
            vm.advanceMultiplierForLSP = snapshot.val().advanceMultiplierForLSP;
            }
            vm.productName = vm.selectedFruit;
            vm.perUnitCurrency = snapshot.val().perUnitCurrency;
            vm.avgWeightPerBox = snapshot.val().avgWeightPerBox;
            vm.shipmentByAir = snapshot.val().shipmentByAir;
            vm.shipmentBySea = snapshot.val().shipmentBySea;
          }
        });
    },
    updateFruitFlowStageDetails() {
      const vm = this;
      vm.seen = true;
      if (vm.fruitFlowConfig) {
        if (vm.checkAtleastOneStageValid()) {
           if (
            vm.perUnitCost == null ||
            vm.perUnitCost == "" ||
            vm.perUnitCost == undefined ||
            vm.perUnitCost == 0
          ) {
            vm.seen = false;
            Vue.$toast.open({
              message: vm.$t(
                "Per unit cost is invalid.",
                "Per unit cost is invalid."
              ),
              type: "error",
              position: "top",
            });
            return false;
          }
          if (
            vm.advanceMultiplierForLSP == null ||
            vm.advanceMultiplierForLSP == "" ||
            vm.advanceMultiplierForLSP == undefined
          ) {
            vm.seen = false;
            Vue.$toast.open({
              message: vm.$t(
                "Advance muliplier for LSP is invalid.",
                "Advance muliplier for LSP is invalid."
              ),
              type: "error",
              position: "top",
            });
            return false;
          }
          if (
            vm.avgWeightPerBox == null ||
            vm.avgWeightPerBox == "" ||
            vm.avgWeightPerBox == undefined ||
            vm.avgWeightPerBox == 0
          ) {
            vm.seen = false;
            Vue.$toast.open({
              message: vm.$t(
                "Average weight per box is invalid.",
                "Average weight per box is invalid."
              ),
              type: "error",
              position: "top",
            });
            return false;
          }
          if (
            vm.shipmentByAir == null ||
            vm.shipmentByAir == "" ||
            vm.shipmentByAir == undefined ||
            vm.shipmentByAir == 0
          ) {
            vm.seen = false;
            Vue.$toast.open({
              message: vm.$t(
                "Shipment by air rate is invalid.",
                "Shipment by air rate is invalid."
              ),
              type: "error",
              position: "top",
            });
            return false;
          }
          if (
            vm.shipmentBySea == null ||
            vm.shipmentBySea == "" ||
            vm.shipmentBySea == undefined ||
            vm.shipmentBySea == 0
          ) {
            vm.seen = false;
            Vue.$toast.open({
              message: vm.$t(
                "Shipment by sea rate is invalid.",
                "Shipment by sea rate is invalid."
              ),
              type: "error",
              position: "top",
            });
            return false;
          }
          vm.updateWeightAndPerKgPrice()
            .then(() => {
              console.log("updated weight and per kg price.");
              let ref = null;
              if (
                localStorage.systemRole == 99 &&
                localStorage.emailId == localStorage.organizationKey
              ) {
                ref = firebase
                  .database()
                  .ref()
                  .child("masters")
                  .child("fruits/master")
                  .child(`${vm.selectedFruit}`);
              } else {
                ref = firebase
                  .database()
                  .ref()
                  .child("masters")
                  .child(`fruits/${localStorage.organizationKey}`)
                  .child(`${vm.selectedFruit}`);
              }

              ref
                .set(vm.fruitFlowConfig)
                .then((updated) => {
                  console.log(updated);
                  vm.selectedFruit = null;
                  vm.seen = false;
                  Vue.$toast.open({
                    message: vm.$t(
                      "Details Updated Successfully",
                      "Details Updated Successfully"
                    ),
                    position: "top",
                    type: "success",
                  });
                  vm.fruitFlowConfig = null;
                })
                .catch((error) => {
                  console.log(error);
                  vm.seen = false;
                });
            })
            .catch(() => {
              console.log(
                "error updating avg weight and price per kg details."
              );
              vm.seen = false;
              Vue.$toast.open({
                message: vm.$t(
                  "Error updating average weight and peice per kg details.",
                  "Error updating average weight and peice per kg details."
                ),
                type: "error",
                position: "top",
              });
            });
        } else {
          vm.seen = false;
          Vue.$toast.open({
            message: vm.$t(
              "Please ensure that at least one field has been marked as mandatory for all mandatory stages.",
              "Please ensure that at least one field has been marked as mandatory for all mandatory stages."
            ),
            type: "error",
            position: "top",
          });
        }
      } else {
        vm.seen = false;
        console.log("Failed to load config");
      }
    },
    toggle() {
      // disables all the fields of a stage if disabled
      const vm = this;
      vm.seen = true;
      setTimeout(() => {
        console.log("testing");

        if (
          vm.fruitFlowConfig.fruitWashing.mandatory == false ||
          vm.fruitFlowConfig.fruitWashing.mandatory == "false"
        ) {
          vm.fruitFlowConfig.fruitWashing.PHLevel = false;
          vm.fruitFlowConfig.fruitWashing.chlorineLevel = false;
          vm.fruitFlowConfig.fruitWashing.waterTemperature = false;
        }

        if (
          vm.fruitFlowConfig.hotWaterTreatmentEntry.mandatory == false ||
          vm.fruitFlowConfig.hotWaterTreatmentEntry.mandatory == "false"
        ) {
          vm.fruitFlowConfig.hotWaterTreatmentEntry.PHLevel = false;
          vm.fruitFlowConfig.hotWaterTreatmentEntry.chlorineLevel = false;
          vm.fruitFlowConfig.hotWaterTreatmentEntry.timeOfEntry = false;
          vm.fruitFlowConfig.hotWaterTreatmentEntry.waterTemperature = false;
        }

        if (
          vm.fruitFlowConfig.hotWaterTreatmentExit.mandatory == false ||
          vm.fruitFlowConfig.hotWaterTreatmentExit.mandatory == "false"
        ) {
          vm.fruitFlowConfig.hotWaterTreatmentExit.durationOfTreatment = false;
          vm.fruitFlowConfig.hotWaterTreatmentExit.timeOfExit = false;
        }

        if (
          vm.fruitFlowConfig.grading.mandatory == false ||
          vm.fruitFlowConfig.grading.mandatory == "false"
        ) {
          vm.fruitFlowConfig.grading.fruitsRemoved = false;
          vm.fruitFlowConfig.grading.gradingResults = false;
        }

        if (
          vm.fruitFlowConfig.coldRoomStorageIn.mandatory == false ||
          vm.fruitFlowConfig.coldRoomStorageIn.mandatory == "false"
        ) {
          vm.fruitFlowConfig.coldRoomStorageIn.airflowTemperature = false;
          vm.fruitFlowConfig.coldRoomStorageIn.fruitTemperature = false;
          vm.fruitFlowConfig.coldRoomStorageIn.storageTimeIn = false;
        }

        if (
          vm.fruitFlowConfig.coldRoomStorageOut.mandatory == false ||
          vm.fruitFlowConfig.coldRoomStorageOut.mandatory == "false"
        ) {
          vm.fruitFlowConfig.coldRoomStorageOut.fruitTemperature = false;
          vm.fruitFlowConfig.coldRoomStorageOut.storageTimeOut = false;
        }

        if (
          vm.fruitFlowConfig.sampling.mandatory == false ||
          vm.fruitFlowConfig.sampling.mandatory == "false"
        ) {
          vm.fruitFlowConfig.sampling.samplesTaken = false;
          vm.fruitFlowConfig.sampling.temperature = false;
          vm.fruitFlowConfig.sampling.timestamp = false;
        }

        vm.seen = false;
      }, 100);
    },
    checkAtleastOneStageValid() {
      const vm = this;
      let fruitWashingFlag = false;
      let hotWaterTreatmentEntryFlag = false;
      let hotWaterTreatmentExitFlag = false;
      let gradingFlag = false;
      let coldRoomStorageInFlag = false;
      let coldRoomStorageOutFlag = false;
      let samplingFlag = false;

      if (
        vm.fruitFlowConfig.fruitWashing.mandatory == true ||
        vm.fruitFlowConfig.fruitWashing.mandatory == "true"
      ) {
        if (
          vm.fruitFlowConfig.fruitWashing.PHLevel == true ||
          vm.fruitFlowConfig.fruitWashing.PHLevel == "true" ||
          vm.fruitFlowConfig.fruitWashing.chlorineLevel == true ||
          vm.fruitFlowConfig.fruitWashing.chlorineLevel == "true" ||
          vm.fruitFlowConfig.fruitWashing.waterTemperature == true ||
          vm.fruitFlowConfig.fruitWashing.waterTemperature == "true"
        ) {
          fruitWashingFlag = true;
        }
      } else {
        fruitWashingFlag = true;
      }

      if (
        vm.fruitFlowConfig.hotWaterTreatmentEntry.mandatory == true ||
        vm.fruitFlowConfig.hotWaterTreatmentEntry.mandatory == "true"
      ) {
        if (
          vm.fruitFlowConfig.hotWaterTreatmentEntry.PHLevel == true ||
          vm.fruitFlowConfig.hotWaterTreatmentEntry.PHLevel == "true" ||
          vm.fruitFlowConfig.hotWaterTreatmentEntry.chlorineLevel == true ||
          vm.fruitFlowConfig.hotWaterTreatmentEntry.chlorineLevel == "true" ||
          vm.fruitFlowConfig.hotWaterTreatmentEntry.timeOfEntry == true ||
          vm.fruitFlowConfig.hotWaterTreatmentEntry.timeOfEntry == "true"
        ) {
          hotWaterTreatmentEntryFlag = true;
        }
      } else {
        hotWaterTreatmentEntryFlag = true;
      }

      if (
        vm.fruitFlowConfig.hotWaterTreatmentExit.mandatory == true ||
        vm.fruitFlowConfig.hotWaterTreatmentExit.mandatory == "true"
      ) {
        if (
          vm.fruitFlowConfig.hotWaterTreatmentExit.timeOfExit == true ||
          vm.fruitFlowConfig.hotWaterTreatmentExit.timeOfExit == "true" ||
          vm.fruitFlowConfig.hotWaterTreatmentExit.durationOfTreatment ==
            true ||
          vm.fruitFlowConfig.hotWaterTreatmentExit.durationOfTreatment == "true"
        ) {
          hotWaterTreatmentExitFlag = true;
        }
      } else {
        hotWaterTreatmentExitFlag = true;
      }

      if (
        vm.fruitFlowConfig.grading.mandatory == true ||
        vm.fruitFlowConfig.grading.mandatory == "true"
      ) {
        if (
          vm.fruitFlowConfig.grading.fruitsRemoved == true ||
          vm.fruitFlowConfig.grading.fruitsRemoved == "true" ||
          vm.fruitFlowConfig.grading.gradingResults == true ||
          vm.fruitFlowConfig.grading.gradingResults == "true"
        ) {
          gradingFlag = true;
        }
      } else {
        gradingFlag = true;
      }

      if (
        vm.fruitFlowConfig.coldRoomStorageIn.mandatory == true ||
        vm.fruitFlowConfig.coldRoomStorageIn.mandatory == "true"
      ) {
        if (
          vm.fruitFlowConfig.coldRoomStorageIn.airflowTemperature == true ||
          vm.fruitFlowConfig.coldRoomStorageIn.airflowTemperature == "true" ||
          vm.fruitFlowConfig.coldRoomStorageIn.fruitTemperature == true ||
          vm.fruitFlowConfig.coldRoomStorageIn.fruitTemperature == "true" ||
          vm.fruitFlowConfig.coldRoomStorageIn.storageTimeIn == true ||
          vm.fruitFlowConfig.coldRoomStorageIn.storageTimeIn == "true"
        ) {
          coldRoomStorageInFlag = true;
        }
      } else {
        coldRoomStorageInFlag = true;
      }

      if (
        vm.fruitFlowConfig.coldRoomStorageOut.mandatory == true ||
        vm.fruitFlowConfig.coldRoomStorageOut.mandatory == "true"
      ) {
        if (
          vm.fruitFlowConfig.coldRoomStorageOut.fruitTemperature == true ||
          vm.fruitFlowConfig.coldRoomStorageOut.fruitTemperature == "true" ||
          vm.fruitFlowConfig.coldRoomStorageOut.storageTimeOut == true ||
          vm.fruitFlowConfig.coldRoomStorageOut.storageTimeOut == "true"
        ) {
          coldRoomStorageOutFlag = true;
        }
      } else {
        coldRoomStorageOutFlag = true;
      }

      if (
        vm.fruitFlowConfig.sampling.mandatory == true ||
        vm.fruitFlowConfig.sampling.mandatory == "true"
      ) {
        if (
          vm.fruitFlowConfig.sampling.samplesTaken == true ||
          vm.fruitFlowConfig.sampling.samplesTaken == "true" ||
          vm.fruitFlowConfig.sampling.temperature == true ||
          vm.fruitFlowConfig.sampling.temperature == "true" ||
          vm.fruitFlowConfig.sampling.timestamp == true ||
          vm.fruitFlowConfig.sampling.timestamp == "true"
        ) {
          samplingFlag = true;
        }
      } else {
        samplingFlag = true;
      }

      if (
        fruitWashingFlag == true &&
        hotWaterTreatmentEntryFlag == true &&
        hotWaterTreatmentExitFlag == true &&
        gradingFlag == true &&
        coldRoomStorageInFlag == true &&
        coldRoomStorageOutFlag == true &&
        samplingFlag == true
      ) {
        return true;
      } else {
        return false;
      }
    },
    updateWeightAndPerKgPrice() {
      const vm = this;
      console.log(vm.selectedFruit);
      let data = {};
      data[vm.selectedFruit] = {
        perUnitCost:vm.perUnitCost,
        advanceMultiplierForLSP: vm.advanceMultiplierForLSP,
        productName:vm.selectedFruit,
        perUnitCurrency : vm.perUnitCurrency,
        avgWeightPerBox: vm.avgWeightPerBox,
        shipmentByAir: vm.shipmentByAir,
        shipmentBySea: vm.shipmentBySea,
      };
      return new Promise((resolve, reject) => {
        firebase
          .database()
          .ref()
          .child("masters")
          .child("product")
          .update(data)
          .then(() => {
            console.log("updated");
            vm.perUnitCost = null;
            vm.advanceMultiplierForLSP = 1;
            vm.productName = null;
            vm.perUnitCurrency = "USD";
            vm.avgWeightPerBox = null;
            vm.shipmentBySea = null;
            vm.shipmentByAir = null;
            resolve();
          })
          .catch(() => {
            console.log("error");
              vm.perUnitCost = null;
              vm.productName = null;
               vm.advanceMultiplierForLSP = 1;
              vm.perUnitCurrency = "USD";
            vm.avgWeightPerBox = null;
            vm.shipmentBySea = null;
            vm.shipmentByAir = null;
            reject();
          });
      });
    },
  },
};
</script>
<style scoped>
.button-container {
  margin: 10px -4px 10px 10px !important;
}
.btn-save,
.btn-cancel {
  height: 30px !important;
}
.header-container {
  height: 50px;
}
.close-details {
  margin-top: -16px !important;
}
.manage-packhouses-ps {
  min-height: 383px !important;
  max-height: 383px !important;
}
</style>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
.finance-heading{
 color:#fff;
  width:100%;
  padding:10px;
}
.fruit-control-container
{
margin-top:20px;
border:1px solid #fff;
}
.finance-container
{
border: 1px solid #fff;
}
.manage-packhouses-ps {
  height: 400px;
  overflow-x: hidden !important;
}
.ps__rail-x {
  display: none !important;
}
.addition-note {
  background-color: transparent;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  float: left;
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 22px;
  background-size: 15px 15px;
  width: 95%;
  margin: 15px;
  color: #fff !important;
}
.small-input {
  background: none !important;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  float: left;
  width: 100px;
  margin: 15px;
  color: #fff !important;
}
.modal-input {
  background-color: transparent !important;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  float: left;
  margin: 15px;
  width: 96%;
}
.button-container {
  float: right;
  margin: 10px 0px 10px 10px;
  position: relative;
  bottom: 0px;
}
.btn-save {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 12px;
  min-width: 115px;
  height: 26px;
  margin: 5px;
  color: #fff;
}
.btn-reject {
  background-color: #c55a11;
  border-radius: 0px;
  border: none;
  font-size: 12px;
  width: 115px;
  height: 26px;
  margin: 5px;
  color: #fff;
}
.btn-cancel {
  background: #1e2318;
  border-radius: 0px;
  border: 1px solid #000;
  font-size: 12px;
  color: #fff;
  width: 115px;
  height: 26px;
  margin: 5px;
}
label > input {
  visibility: hidden;
}
.close-img {
  width: 13px !important;
  margin-top: -10px !important;
}

.lbl-pickup > img {
  float: right;
  display: inline-block;
  padding: 0px;
  height: 15px;
  width: 15px;
  background: none;
}

.lbl-pickup-sa > img {
  float: left;
  display: inline-block;
  padding: 0px;
  height: 15px;
  width: 15px;
  background: none;
}
.photo-container {
  margin-top: 22px !important;
}
label > input:checked + img {
  background: url("../../assets/images/tick.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 10px 10px;
}

.card-inside-description {
  font-weight: 400 !important;
  font-size: 32px;
  color: #fff !important;
  margin-top: 60px;
}
.outer-container {
  width: 100%;
  margin: 0px !important;
  padding: 0px !important;
  padding-top: 10px !important;
}
.description-container {
  margin-left: 30px;
}
.former-picture {
  width: 65px;
}
.lbl-pickup {
  display: block;
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
.inp-container {
  margin: 0px 0px 0px 0px;
  font-size: 13px;
  width: 100%;
  margin-bottom: 20px;
}
.heading {
  color: #fff;
  text-align: center;
  margin: auto;
  font-size: 14px !important;
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
  background: rgba(0, 0, 0, 0.616);
  border-radius: 5px 5px 0px 0px;
  border: 1px solid #000;
}
.main-container-manage-packhouses {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0px 0px 5px 5px;
  border: 1px solid #000;
  border-top: 0px !important;
  height: 400px;
  overflow-y: hidden;
  overflow-x: hidden;
}
.sign-up-form-container {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px 10px 10px 10px;
}
.details-container {
  margin: auto;
  margin-top: 35px;
  margin-bottom: 35px;
}
.ref-logout-lsp {
  font-size: 13px;
  margin-top: -5px;
  text-transform: none !important;
}
.lbl-username-lsp {
  text-transform: none !important;
  font-size: 13px;
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
.additional-modal-note {
  float: left;
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 22px;
  background-size: 15px 15px;
  width: 100%;
}
.inp-details {
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff;
  font-size: 13px;
  padding: 10px;
}
.inp-packhouse-name {
  background-image: url("../../assets/images/packhouse.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-town {
  background-image: url("../../assets/images/row_houses.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-contact {
  background-image: url("../../assets/images/landline.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-address {
  background-image: url("../../assets/images/address_signboard.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-truck {
  background-image: url("../../assets/images/truck_front_facing.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-additional-notes {
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-email {
  background-image: url("../../assets/images/email_address.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.email-container {
  padding: 0px;
  margin: -20px;
}
.grant-privilage-container {
  padding-top: 5px;
  margin-left: 35px;
}
.close-details {
  height: 16px;
  float: right;
  margin-top: -15px;
  cursor: pointer;
}
.manage-packhouses-ps {
  min-height: 340px;
  max-height: 340px;
  overflow: hidden;
}
.manage-packhouses-left-container {
  min-height: 350px;
  max-height: 350px;
  overflow-y: hidden;
}
label > input:checked + img {
  background: url("../../assets/images/tick.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 10px 10px;
}
.inp-half {
  width: 40%;
  float: left;
  margin-right: 20px;
}
.manage-packhouses-field-wrap {
  margin: 10px 25px;
}
.sa-packhouse-btn {
  width: 160px;
}
.manage-bank-accountsv-select .vs__dropdown-toggle {
  border: none;
  border-bottom: 1px solid #fff;
  border-radius: 0px;
  margin: 15px 0px 0px 0px !important;
}
.manage-bank-accountsv-select {
  font-size: 13px;
}
.manage-bank-accountsv-select span,
.manage-bank-accountsv-select input,
.manage-bank-accountsv-select .vs__no-options {
  color: #fff;
}
.manage-bank-accountsv-select span {
  margin-left: 0px;
  padding-left: 0px;
}
.manage-bank-accountsv-select .vs__dropdown-menu {
  background: none;
  padding: 0px;
  max-height: 155px;
}
.manage-bank-accountsv-select .vs__dropdown-option {
  color: #fff;
  padding: 10px;
  background: #1e2318;
}
.manage-bank-accountsv-select .vs__dropdown-option--highlight {
  background: #000;
}
.manage-bank-accountsv-select .vs__open-indicator,
.manage-bank-accountsv-select .vs__clear {
  fill: #fff;
}
.manage-bank-accountsv-select .vs__selected-options,
.manage-bank-accountsv-select .vs__search,
.vs__search:focus {
  padding: 0px;
  margin: 0px;
}
.manage-bank-accountsv-select .vs__dropdown-toggle {
  padding: 0px;
  padding-bottom: 2px;
  margin: 15px 0px;
}
.manage-bank-accountsv-select .vs__selected {
  margin: 0px;
  padding: 0px;
}
.manage-bank-accountsv-select .vs__clear {
  margin-top: -10px;
}
.manage-bank-accountsv-select .vs__open-indicator {
  margin-top: -5px;
}
.v-select-wrap {
  margin: 10px;
}
.accnt-details-heading {
  color: #fff;
  text-align: left;
  margin: 20px 0px;
}
.type-of-account-wrap .radio-btn {
  visibility: hidden;
}
.type-of-account-wrap .radio-btn-img {
  display: inline-block;
  padding: 0px;
  height: 15px;
  width: 15px;
  background: none;
}
.type-of-account-wrap .radiobtn-wrap > input:checked + img {
  background: url("../../assets/images/tick.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 11px 11px;
}
.type-of-account-wrap .description-container {
  width: 70%;
}
.type-of-account-wrap .radiobtn-wrap {
  float: right;
}
.type-of-account-wrap .larvae-wrap {
  width: 30%;
  padding: 10px 0px 10px 0px;
  color: #fff;
  float: left;
}
.type-of-account-wrap .larvae-rb-img {
  background-color: #fff;
  border-radius: 29px;
  width: 18px;
  height: 18px;
  margin-bottom: 3px;
}
.type-of-account-wrap .larvae-wrap > input:checked + img {
  background: url("../../assets/images/black-circle.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 12px 12px;
  background-color: #fff;
}
.type-of-account-wrap label {
  float: left;
  color: #fff;
  padding-top: 10px;
}
.type-of-account-wrap {
  margin-bottom: 0px;
}
.manage-bank-accounts-main-container .inp-details {
  padding: 0px 0px 10px 0px;
}
.manage-bank-accounts-main-container .vs__selected-options {
  padding-bottom: 8px;
}
.stage-switch .custom-control {
  display: inline-block;
}
.custom-switch .custom-control {
  display: inline-block;
}
.green-color {
  color: #7aeb34;
}
.white-color {
  color: #fff;
}
.mango-picture {
  width: 55px;
}
.manage-fruits-checklist {
  position: relative !important;
  top: 2px !important;
  right: 0 !important;
}
.fruit-span {
  font-size: 14px;
}
.manage-fruits-wrap {
  display: flex;
  align-items: center;
  padding-top: 0px !important;
  padding: 15px 0px !important;
  margin-bottom: 5px !important;
}
.manage-fruits-picture-wrap {
  margin: 0;
  padding: 0;
  margin-top: 0px !important;
  padding-top: 0px;
}
.config-outer-container {
  margin: 0px !important;
  padding: 10px !important;
}
.config-description {
  margin: 0 !important;
  margin-left: 0px !important;
}
.config-label-wrap {
  position: relative;
  width: 80%;
  margin: 10px 0px;
}
.config-label-wrap .custom-switch {
  position: absolute;
  right: 0;
  top: 0;
}
.config-label-wrap label {
  color: #fff !important;
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
@media screen and (max-width: 602px) {
  .content-container {
    margin-top: 30px;
  }
}
.stage-switch {
  position: absolute;
  top: 22px;
  right: 12px;
}
.warning-label {
  color: rgb(238, 102, 11);
}
.mandatory-label {
  position: absolute;
  left: 50px;
  color: #fff;
  font-weight: bold;
}
.margin-top-30 {
  margin-top: 40px;
}
</style>
