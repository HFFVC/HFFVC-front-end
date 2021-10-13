<template>
  <div class="lsp-dashboard">
    <Offline @detected-condition="handleConnectivityChange"></Offline>
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-12 content-container-margin">
        <div class="header-container">
          <h3 class="heading">
            {{ $t("Lots at Packhouse", "Lots at Packhouse") }}
          </h3>
          <div class="icon-container">
            <img
              @click="showDashboard"
              class="sub-header-close-img"
              src="../../assets/images/close.png"
            />
          </div>
        </div>
        <div class="main-container">
          <v-client-table
            :data="pickupsList"
            :columns="columns"
            :options="options"
            class="tbl-services lots-at-packhouse-table"
          >
            <template slot="Work Flow" slot-scope="props">
              <div>
                <a class="btn-edit" @click="sendInfo(props.row)">
                  <img
                    class="location-img plan-img"
                    src="../../assets/images/edit_record.png"
                  />
                </a>
              </div>
            </template>
          </v-client-table>
        </div>
      </div>
    </div>
    <b-modal
      hide-footer
      id="fruit-flow-modal"
      @hide="hideModal"
      class="fruit-flow-modal"
      ref="pickup-modal"
      hide-backdrop
      :title="$t('Fruit Flow', 'Fruit Flow')"
    >
      <div class="row">
        <div class="col-md-4">
          <div class="header-container fruit-flow-heading">
            <h3 class="heading">
              {{ $t("Flow Milestones", "Flow Milestones") }}
            </h3>
          </div>
          <div class="main-container fruit-flow-container">
            <perfect-scrollbar class="ps-fruit-flow">
              <input
                class="input-label"
                v-on:click="stageSelection('Larvae Testing')"
                :value="$t(larvaeTestingLabel, larvaeTestingLabel)"
                v-bind:class="{
                  active: this.selectedStage == 'Larvae Testing',
                }"
                readonly
              />
              <input
                class="input-label"
                v-on:click="stageSelection('Temperature Measurement')"
                :value="
                  $t(temperatureMeasurementLabel, temperatureMeasurementLabel)
                "
                v-bind:class="{
                  active: this.selectedStage == 'Temperature Measurement',
                }"
                readonly
              />
              <input
                class="input-label"
                v-on:click="stageSelection('Quality Inspection')"
                v-bind:class="{
                  active: this.selectedStage == 'Quality Inspection',
                }"
                :value="$t(qualityInspectionLabel, qualityInspectionLabel)"
                readonly
              />
              <input
                v-if="selectedFruit == 'Pineapple'"
                class="input-label"
                v-on:click="stageSelection('Cleaning & Trimming')"
                v-bind:class="{
                  active: this.selectedStage == 'Cleaning & Trimming',
                }"
                :value="$t(cleaningAndTrimmingLabel, cleaningAndTrimmingLabel)"
                readonly
              />
              <input
                v-if="selectedFruit != 'Avocado'"
                class="input-label"
                v-on:click="stageSelection('Fruit Washing')"
                v-bind:class="{ active: this.selectedStage == 'Fruit Washing' }"
                :value="$t(fruitWashingLabel, fruitWashingLabel)"
                readonly
              />

              <input
                class="input-label"
                v-if="selectedFruit == 'Mango'"
                v-on:click="stageSelection('First Sizing')"
                v-bind:class="{ active: this.selectedStage == 'First Sizing' }"
                :value="$t(firstSizingLabel, firstSizingLabel)"
                readonly
              />
              <input
                v-if="selectedFruit == 'Mango'"
                class="input-label"
                v-on:click="stageSelection('Hot Water Treatment Entry')"
                v-bind:class="{
                  active: this.selectedStage == 'Hot Water Treatment Entry',
                }"
                :value="
                  $t(hotWaterTreatmentEntryLabel, hotWaterTreatmentEntryLabel)
                "
                readonly
              />
              <input
                v-if="selectedFruit == 'Mango'"
                class="input-label"
                v-on:click="stageSelection('Hot Water Treatment Exit')"
                v-bind:class="{
                  active: this.selectedStage == 'Hot Water Treatment Exit',
                }"
                :value="
                  $t(hotWaterTreatmentExitLabel, hotWaterTreatmentExitLabel)
                "
                readonly
              />
              <input
                v-if="selectedFruit == 'Mango'"
                class="input-label"
                v-on:click="stageSelection('Hydro Cooling Entry')"
                v-bind:class="{
                  active: this.selectedStage == 'Hydro Cooling Entry',
                }"
                :value="$t(hydroCoolingEntryLabel, hydroCoolingEntryLabel)"
                readonly
              />
              <input
                v-if="selectedFruit == 'Mango'"
                class="input-label"
                v-on:click="stageSelection('Hydro Cooling Exit')"
                v-bind:class="{
                  active: this.selectedStage == 'Hydro Cooling Exit',
                }"
                :value="$t(hydroCoolingExitLabel, hydroCoolingExitLabel)"
                readonly
              />

              <input
                v-if="selectedFruit == 'Avocado'"
                class="input-label"
                v-on:click="stageSelection('Transfer to Cold Storage')"
                v-bind:class="{
                  active: this.selectedStage == 'Transfer to Cold Storage',
                }"
                :value="
                  $t(transferToColdStorageLabel, transferToColdStorageLabel)
                "
                readonly
              />
              <input
                v-if="selectedFruit == 'Avocado'"
                class="input-label"
                v-on:click="stageSelection('Removal from Cold Storage')"
                v-bind:class="{
                  active: this.selectedStage == 'Removal from Cold Storage',
                }"
                :value="
                  $t(removalFromColdStorageLabel, removalFromColdStorageLabel)
                "
                readonly
              />
              <input
                class="input-label"
                v-on:click="stageSelection('Feed Packing Line Conveyor Belt')"
                v-bind:class="{
                  active:
                    this.selectedStage == 'Feed Packing Line Conveyor Belt',
                }"
                :value="
                  $t(
                    feedPackingLineConveyorBeltLabel,
                    feedPackingLineConveyorBeltLabel
                  )
                "
                readonly
              />
              <input
                class="input-label"
                v-on:click="stageSelection('Grading')"
                v-bind:class="{ active: this.selectedStage == 'Grading' }"
                :value="$t(gradingLabel, gradingLabel)"
                readonly
              />
              <input
                class="input-label"
                v-on:click="stageSelection('Sizing')"
                v-bind:class="{ active: this.selectedStage == 'Sizing' }"
                :value="$t(secondSizingLabel, secondSizingLabel)"
                readonly
              />
              <input
                class="input-label"
                v-on:click="stageSelection('Carton Filling')"
                v-bind:class="{
                  active: this.selectedStage == 'Carton Filling',
                }"
                :value="
                  $t(
                    cartonFillingAndPalletizingLabel,
                    cartonFillingAndPalletizingLabel
                  )
                "
                readonly
              />
              <input
                class="input-label"
                v-on:click="
                  stageSelection('Temperature Readings for Packed Lot')
                "
                v-bind:class="{
                  active:
                    this.selectedStage == 'Temperature Readings for Packed Lot',
                }"
                :value="
                  $t(
                    temperatureReadingsForPackedLotLabel,
                    temperatureReadingsForPackedLotLabel
                  )
                "
                readonly
              />
              <input
                class="input-label"
                v-on:click="stageSelection('Forced Air Cooling Entry')"
                v-bind:class="{
                  active: this.selectedStage == 'Forced Air Cooling Entry',
                }"
                :value="
                  $t(forcedAirCoolingEntryLabel, forcedAirCoolingEntryLabel)
                "
                readonly
              />
              <input
                class="input-label"
                v-on:click="stageSelection('Removal from Forced Air Cooling')"
                v-bind:class="{
                  active:
                    this.selectedStage == 'Removal from Forced Air Cooling',
                }"
                :value="
                  $t(
                    removalFromForcedAirCoolingLabel,
                    removalFromForcedAirCoolingLabel
                  )
                "
                readonly
              />
              <input
                class="input-label"
                v-on:click="stageSelection('Cold Room Storage In')"
                v-bind:class="{
                  active: this.selectedStage == 'Cold Room Storage In',
                }"
                :value="$t(coldRoomStorageInLabel, coldRoomStorageInLabel)"
                readonly
              />
              <input
                class="input-label"
                v-on:click="stageSelection('Cold Room Storage Out')"
                v-bind:class="{
                  active: this.selectedStage == 'Cold Room Storage Out',
                }"
                :value="$t(coldRoomStorageOutLabel, coldRoomStorageOutLabel)"
                readonly
              />
              <input
                class="input-label"
                v-on:click="stageSelection('Upload Product Certifications')"
                v-bind:class="{
                  active: this.selectedStage == 'Upload Product Certifications',
                }"
                :value="
                  $t(
                    uploadProductCertificationsLabel,
                    uploadProductCertificationsLabel
                  )
                "
                readonly
              />
              <input
                class="input-label"
                v-on:click="stageSelection('Sampling')"
                v-bind:class="{ active: this.selectedStage == 'Sampling' }"
                :value="$t(samplingLabel, samplingLabel)"
              />
              <input
                class="input-label"
                v-on:click="stageSelection('Shipping Details')"
                v-bind:class="{
                  active: this.selectedStage == 'Shipping Details',
                }"
                :value="$t(shippingDetailsLabel, shippingDetailsLabel)"
                readonly
              />

              <input
                class="input-label"
                v-if="shippingDetails == 'Shipment by Sea (US$ 1.22/kg)'"
                v-on:click="stageSelection('Container Inspection')"
                v-bind:class="{
                  active: this.selectedStage == 'Container Inspection',
                }"
                :value="$t(containerInspectionLabel, containerInspectionLabel)"
                readonly
              />

              <input
                class="input-label"
                v-if="shippingDetails == 'Shipment by Sea (US$ 1.22/kg)'"
                v-on:click="stageSelection('Pre-Cooling Reefers')"
                v-bind:class="{
                  active: this.selectedStage == 'Pre-Cooling Reefers',
                }"
                :value="$t(preCoolingReefersLabel, preCoolingReefersLabel)"
                readonly
              />
              <input
                class="input-label"
                v-if="shippingDetails == 'Shipment by Sea (US$ 1.22/kg)'"
                v-on:click="stageSelection('Cold Tunnel Loading')"
                v-bind:class="{
                  active: this.selectedStage == 'Cold Tunnel Loading',
                }"
                :value="$t(coldTunnelLoadingLabel, coldTunnelLoadingLabel)"
                readonly
              />

              <input
                class="input-label"
                v-on:click="stageSelection('Transport Details')"
                v-bind:class="{
                  active: this.selectedStage == 'Transport Details',
                }"
                :value="$t(transportDetailsLabel, transportDetailsLabel)"
                readonly
              />
            </perfect-scrollbar>
          </div>
        </div>
        <div class="col-md-8">
          <div class="header-container fruit-flow-heading">
            <h3 class="heading">
              {{ $t(this.selectedStage, this.selectedStage) }}
            </h3>
          </div>
          <div class="main-container fruit-flow-container">
            <perfect-scrollbar class="ps-fruit-flow">
              <div
                class="input-wrap larvae-input-wrap"
                v-if="selectedStage == 'Larvae Testing'"
              >
                <label class="larvae-wrap">
                  <input
                    class="larvae-input radio-btn"
                    v-model="larvaeTesting"
                    type="radio"
                    name="larvaeTesting"
                    value="passed"
                  />
                  <img class="radio-btn-img larvae-rb-img" />
                  {{ $t("Passed", "Passed") }}
                </label>
                <label class="larvae-wrap">
                  <input
                    class="larvae-input radio-btn"
                    v-model="larvaeTesting"
                    type="radio"
                    name="larvaeTesting"
                    value="failed"
                  />
                  <img class="radio-btn-img larvae-rb-img" />
                  {{ $t("Failed", "Failed") }}
                </label>
              </div>
              <div
                class="input-wrap"
                v-if="selectedStage == 'Temperature Measurement'"
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Ambient Temp", "Ambient Temp") }} (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.temperatureMeasurement &&
                        (fruitFlowConfig.temperatureMeasurement.ambientTemp ==
                          'true' ||
                          fruitFlowConfig.temperatureMeasurement.ambientTemp ==
                            true)
                      "
                      >*</span
                    ></label
                  >
                  <input
                    v-model="ambientTemp"
                    min="0"
                    class="text-input"
                    type="number"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Internal Fruit Temp", "Internal Fruit Temp") }}
                    (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.temperatureMeasurement &&
                        (fruitFlowConfig.temperatureMeasurement
                          .internalFruitTemperature == 'true' ||
                          fruitFlowConfig.temperatureMeasurement
                            .internalFruitTemperature == true)
                      "
                    >
                      *</span
                    ></label
                  >
                  <input
                    type="number"
                    min="0"
                    class="text-input"
                    v-model="internalFruitTemp"
                    placeholder
                  />
                </div>
                <div class="inp-container temp-measure-inp-container">
                  <div class="attach-border attach-border-temp-measure"></div>
                  <b-form-file
                    v-model="file"
                    :placeholder="
                      $t('No Attachments yet', 'No Attachments yet')
                    "
                    drop-placeholder="Drop file here..."
                  ></b-form-file>
                </div>
                <div
                  v-if="isTemperatureFile"
                  class="lotsatpackhouse-upload-wrap"
                >
                  <ul class="upload-file-link-ul">
                    <li class="upload-li upload-li-single">
                      <div class="uploaded-file-link">
                        {{ temperatureMeasurementFileName }}
                        <a
                          target="_blank"
                          v-bind:href="temperatureMeasurementFileURL"
                        >
                          <img
                            class="download-icon-upload"
                            src="../../assets/images/download-button.png"
                          />
                        </a>
                      </div>
                      <div class="uploaded-image-wrap" v-if="imageloaded">
                        <img :src="temperatureMeasurementFileURL" />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                class="input-wrap quality-inspection-input-wrap"
                v-if="selectedStage == 'Quality Inspection'"
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{
                      $t(
                        "Quality Inspection Results",
                        "Quality Inspection Results"
                      )
                    }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.qualityInspection &&
                        (fruitFlowConfig.qualityInspection
                          .qualityInspectionResults == 'true' ||
                          fruitFlowConfig.qualityInspection
                            .qualityInspectionResults == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="qualityInspectionResults"
                    class="text-input quality-inspection"
                    type="text"
                    placeholder
                  />
                </div>
                <div class="inp-container inp-container-same-line">
                  <label class="input-label"
                    >{{ $t("Fruits Accepted", "Fruits Accepted") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.qualityInspection &&
                        (fruitFlowConfig.qualityInspection.fruitsAccepted ==
                          'true' ||
                          fruitFlowConfig.qualityInspection.fruitsAccepted ==
                            true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    type="number"
                    min="0"
                    class="text-input text-input-last-child"
                    v-model="fruitsAccepted"
                    placeholder
                  />
                </div>
                <div class="inp-container inp-container-same-line">
                  <label class="input-label"
                    >{{ $t("Fruits Rejected", "Fruits Rejected") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.qualityInspection &&
                        (fruitFlowConfig.qualityInspection.fruitsRejected ==
                          'true' ||
                          fruitFlowConfig.qualityInspection.fruitsRejected ==
                            true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    type="number"
                    min="0"
                    class="text-input text-input-last-child"
                    v-model="fruitsRejected"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="
                  selectedStage == 'First Sizing' && selectedFruit == 'Mango'
                "
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Sizing Results", "Sizing Results") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.sizing &&
                        (fruitFlowConfig.sizing.mandatory == 'true' ||
                          fruitFlowConfig.sizing.mandatory == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="firstSizingResults"
                    class="text-input quality-inspection text-input-last-child"
                    type="text"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="
                  selectedStage == 'Cleaning & Trimming' &&
                  selectedFruit == 'Pineapple'
                "
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Date & Time", "Date & Time") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.sizing &&
                        (fruitFlowConfig.cleaningAndTrimming.mandatory ==
                          'true' ||
                          fruitFlowConfig.cleaningAndTrimming.mandatory == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="dateTimeCleaningTrimming"
                    class="text-input"
                    type="text"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="
                  selectedStage == 'Hot Water Treatment Entry' &&
                  selectedFruit == 'Mango'
                "
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Time of Entry", "Time of Entry") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.hotWaterTreatmentEntry &&
                        (fruitFlowConfig.hotWaterTreatmentEntry.timeOfEntry ==
                          'true' ||
                          fruitFlowConfig.hotWaterTreatmentEntry.timeOfEntry ==
                            true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="timeofEntryHotWaterTreatment"
                    class="text-input"
                    type="text"
                    readonly
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Water Temp", "Water Temp") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.hotWaterTreatmentEntry &&
                        (fruitFlowConfig.hotWaterTreatmentEntry
                          .waterTemperature == 'true' ||
                          fruitFlowConfig.hotWaterTreatmentEntry
                            .waterTemperature == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="waterTemperatureHotWaterTreatment"
                    class="text-input"
                    type="number"
                    min="0"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Ph Level", "Ph Level") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.hotWaterTreatmentEntry &&
                        (fruitFlowConfig.hotWaterTreatmentEntry.PHLevel ==
                          'true' ||
                          fruitFlowConfig.hotWaterTreatmentEntry.PHLevel ==
                            true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="phLevelHotWaterTreatment"
                    class="text-input"
                    type="number"
                    min="0"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Chlorine Level", "Chlorine Level") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.hotWaterTreatmentEntry &&
                        (fruitFlowConfig.hotWaterTreatmentEntry.chlorineLevel ==
                          'true' ||
                          fruitFlowConfig.hotWaterTreatmentEntry
                            .chlorineLevel == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="chlorineLevelHotWaterTreatment"
                    class="text-input"
                    type="number"
                    min="0"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="
                  selectedStage == 'Hot Water Treatment Exit' &&
                  selectedFruit == 'Mango'
                "
              >
                <div class="inp-container hotwatertreatment">
                  <label class="input-label"
                    >{{ $t("Duration of Treatment", "Duration of Treatment") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.hotWaterTreatmentExit &&
                        (fruitFlowConfig.hotWaterTreatmentExit
                          .durationOfTreatment == 'true' ||
                          fruitFlowConfig.hotWaterTreatmentExit
                            .durationOfTreatment == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <!-- <input
                    v-model="durationHotWaterTreatment"
                    class="text-input"
                    type="text"
                    placeholder="HH:mm"
                  />-->
                  <input
                    type="text"
                    class="text-input"
                    v-mask="mask"
                    v-model="durationHotWaterTreatment"
                    placeholder="HH:mm"
                  />
                  <!-- <datetime
                    type="time"
                    v-model="durationHotWaterTreatment"
                    input-class="my-class datepicker time-of-admittence"
                    placeholder="HH:mm"
                    :phrases="{ ok: 'Save', cancel: 'Cancel' }"
                    :hour-step="1"
                    :minute-step="1"
                    :week-start="7"
                    use12-hour
                    auto
                  ></datetime>-->
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Time of Exit", "Time of Exit") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.hotWaterTreatmentExit &&
                        (fruitFlowConfig.hotWaterTreatmentExit.timeOfExit ==
                          'true' ||
                          fruitFlowConfig.hotWaterTreatmentExit.timeOfExit ==
                            true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="timeofExitHotWaterTreatment"
                    class="text-input"
                    type="text"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="
                  selectedStage == 'Hydro Cooling Entry' &&
                  selectedFruit == 'Mango'
                "
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Time of Entry", "Time of Entry") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.hydroCoolingEntry &&
                        (fruitFlowConfig.hydroCoolingEntry.mandatory ==
                          'true' ||
                          fruitFlowConfig.hydroCoolingEntry.mandatory == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="timeofEntryHydroCooling"
                    class="text-input"
                    type="text"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Water Temp", "Water Temp") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.hydroCoolingEntry &&
                        (fruitFlowConfig.hydroCoolingEntry.waterTemperature ==
                          'true' ||
                          fruitFlowConfig.hydroCoolingEntry.waterTemperature ==
                            true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="waterTemperatureHydroCooling"
                    class="text-input"
                    type="number"
                    min="0"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Ph Level", "Ph Level") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.hydroCoolingEntry &&
                        (fruitFlowConfig.hydroCoolingEntry.PHLevel == 'true' ||
                          fruitFlowConfig.hydroCoolingEntry.PHLevel == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="phLevelHydroCooling"
                    class="text-input"
                    type="number"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Chlorine Level", "Chlorine Level") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.hydroCoolingEntry &&
                        (fruitFlowConfig.hydroCoolingEntry.chlorineLevel ==
                          'true' ||
                          fruitFlowConfig.hydroCoolingEntry.chlorineLevel ==
                            true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="chlorineLevelHydroCooling"
                    class="text-input"
                    min="0"
                    type="number"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="
                  selectedStage == 'Hydro Cooling Exit' &&
                  selectedFruit == 'Mango'
                "
              >
                <div class="inp-container hydrocoolingexit">
                  <label class="input-label"
                    >{{ $t("Duration of Treatment", "Duration of Treatment") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.hydroCoolingExit &&
                        (fruitFlowConfig.hydroCoolingExit.duration == 'true' ||
                          fruitFlowConfig.hydroCoolingExit.duration == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <!-- <input
                    v-model="durationHydroCooling"
                    class="text-input"
                    type="text"
                    placeholder="HH:mm"
                  />-->
                  <input
                    type="text"
                    class="text-input"
                    v-mask="mask"
                    v-model="durationHydroCooling"
                    placeholder="HH:mm"
                  />
                  <!-- <datetime
                    type="time"
                    v-model="durationHydroCooling"
                    input-class="my-class datepicker time-of-admittence"
                    placeholder="HH:mm"
                    :phrases="{ ok: 'Save', cancel: 'Cancel' }"
                    :hour-step="1"
                    :minute-step="1"
                    :week-start="7"
                    use12-hour
                    auto
                  ></datetime>-->
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Time of Exit", "Time of Exit") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.hydroCoolingExit &&
                        (fruitFlowConfig.hydroCoolingExit.timeOfExit ==
                          'true' ||
                          fruitFlowConfig.hydroCoolingExit.timeOfExit == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="timeofExitHydroCooling"
                    class="text-input"
                    type="text"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Internal Fruit Temp", "Internal Fruit Temp") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.hydroCoolingExit &&
                        (fruitFlowConfig.hydroCoolingExit
                          .internalFruitTemperature == 'true' ||
                          fruitFlowConfig.hydroCoolingExit
                            .internalFruitTemperature == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="internalFruitTempHydroCooling"
                    class="text-input"
                    type="number"
                    min="0"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="
                  selectedStage == 'Fruit Washing' && selectedFruit != 'Avocado'
                "
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Water Temp", "Water Temp") }} (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.fruitWashing &&
                        (fruitFlowConfig.fruitWashing.waterTemperature ==
                          'true' ||
                          fruitFlowConfig.fruitWashing.waterTemperature == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="waterTemperature"
                    class="text-input fruit-washing-input"
                    type="number"
                    min="0"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Ph Level", "Ph Level") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.fruitWashing &&
                        (fruitFlowConfig.fruitWashing.PHLevel == 'true' ||
                          fruitFlowConfig.fruitWashing.PHLevel == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    type="number"
                    min="0"
                    class="text-input fruit-washing-input"
                    v-model="phLevel"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Chlorine Level", "Chlorine Level") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.fruitWashing &&
                        (fruitFlowConfig.fruitWashing.chlorineLevel == 'true' ||
                          fruitFlowConfig.fruitWashing.chlorineLevel == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    type="number"
                    min="0"
                    class="text-input fruit-washing-input text-input-last-child"
                    v-model="chlorineLevel"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="selectedStage == 'Transfer to Cold Storage'"
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Temperature", "Temperature") }} (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.transferToColdStorage &&
                        (fruitFlowConfig.transferToColdStorage.temperature ==
                          'true' ||
                          fruitFlowConfig.transferToColdStorage.temperature ==
                            true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="temperatureTransfer"
                    class="text-input"
                    type="number"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Cold Storage Time In", "Cold Storage Time In") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.transferToColdStorage &&
                        (fruitFlowConfig.transferToColdStorage.storageTimeIn ==
                          'true' ||
                          fruitFlowConfig.transferToColdStorage.storageTimeIn ==
                            true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="coldStorageTimeIn"
                    class="text-input text-input-last-child"
                    type="text"
                    placeholder
                    readonly
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="selectedStage == 'Removal from Cold Storage'"
              >
                <div class="inp-container">
                  <label class="input-label"
                    >Temperature (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.removalFromColdStorage &&
                        (fruitFlowConfig.removalFromColdStorage.temperature ==
                          'true' ||
                          fruitFlowConfig.removalFromColdStorage.temperature ==
                            true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="temperatureRemoval"
                    class="text-input"
                    type="number"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Cold Storage Time out", "Cold Storage Time out") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.removalFromColdStorage &&
                        (fruitFlowConfig.removalFromColdStorage
                          .storageTimeOut == 'true' ||
                          fruitFlowConfig.removalFromColdStorage
                            .storageTimeOut == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="coldStorageTimeOut"
                    class="text-input text-input-last-child"
                    type="text"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="selectedStage == 'Feed Packing Line Conveyor Belt'"
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{
                      $t(
                        "Packing Line - Time of Entry",
                        "Packing Line - Time of Entry"
                      )
                    }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.feedPackingLineConveyorBelt &&
                        (fruitFlowConfig.feedPackingLineConveyorBelt
                          .mandatory == 'true' ||
                          fruitFlowConfig.feedPackingLineConveyorBelt
                            .mandatory == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="packingLineTimeofEntry"
                    class="text-input packing-line-input text-input-last-child"
                    type="text"
                    placeholder
                  />
                </div>
              </div>
              <div class="input-wrap" v-if="selectedStage == 'Grading'">
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Grading Results", "Grading Results") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.grading &&
                        (fruitFlowConfig.grading.gradingResults == 'true' ||
                          fruitFlowConfig.grading.gradingResults == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="gradingResults"
                    class="text-input quality-inspection"
                    type="text"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{
                      $t("Number of removed fruit", "Number of removed fruit")
                    }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.grading &&
                        (fruitFlowConfig.grading.fruitsRemoved == 'true' ||
                          fruitFlowConfig.grading.fruitsRemoved == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    type="number"
                    min="0"
                    class="text-input weight-input text-input-last-child"
                    v-model="weightofRemovedFruit"
                    placeholder
                  />
                </div>
              </div>
              <div class="input-wrap" v-if="selectedStage == 'Sizing'">
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Second Sizing Results", "Second Sizing Results") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.secondSizing &&
                        (fruitFlowConfig.secondSizing.mandatory == 'true' ||
                          fruitFlowConfig.secondSizing.mandatory == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="secondSizingResults"
                    class="text-input quality-inspection text-input-last-child"
                    type="text"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="carton-conatiner"
                v-if="selectedStage == 'Carton Filling'"
              >
                <!-- new UI design starts here  -->
                <table border="1">
                  <thead>
                    <th>{{ $t("Fruits Per Box", "Fruits Per Box") }}</th>
                    <th>
                      {{ $t("Fruit QR code from #", "Fruit QR code from #") }}
                    </th>
                    <th>
                      {{ $t("Fruit QR code to #", "Fruit QR code to #") }}
                    </th>
                    <th>
                      {{ $t("Box QR code from #", "Box QR code from #") }}
                    </th>
                    <th>{{ $t("Box QR code to #", "Box QR code to #") }}</th>
                    <th>{{ $t("Edit | Delete", "Edit | Delete") }}</th>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(
                        item, index
                      ) in cartonFillingAndPalletizingFirebaseArray"
                      :key="index"
                    >
                      <td>{{ item.boxSize }}</td>
                      <td>{{ item.startQRCodeFruits }}</td>
                      <td>
                        {{ item.endQRCodeFruits }}
                        <span
                          @click="
                            generateAndShowQRCodes(
                              item.startQRCodeFruits,
                              item.endQRCodeFruits
                            )
                          "
                          ><img
                            class="view-bar-img"
                            title="View QR Code"
                            src="../../assets/images/qr-code.png"
                          />
                        </span>
                      </td>
                      <td>{{ item.startQRCodeBoxes }}</td>
                      <td>
                        {{ item.endQRCodeBoxes }}
                        <span
                          @click="
                            generateAndShowQRCodes(
                              item.startQRCodeBoxes,
                              item.endQRCodeBoxes
                            )
                          "
                          ><img
                            class="view-bar-img"
                            title="View QR Code"
                            src="../../assets/images/qr-code.png"
                        /></span>
                      </td>
                      <td>
                        <label class="icon-label"
                          ><span @click="editItem(item, index)"
                            ><img
                              title="Edit Qr Code"
                              class="edit-delete-img"
                              src="../../assets/images/edit_record.png"
                            />
                            |
                          </span>
                          <span @click="deleteItem(index)"
                            ><img
                              title="Delete QR Code"
                              class="edit-delete-img"
                              src="../../assets/images/cancel.png" /></span
                        ></label>
                      </td>
                    </tr>
                  </tbody>
                  <tr>
                    <td>
                      <!-- <v-select
                        v-model="selectedBoxSize"
                        :placeholder="$t('Fruits Per Box', 'Fruits Per Box')"
                        :options="boxSizeOptions"
                      ></v-select> -->
                      <input
                        v-model="selectedBoxSize"
                        class="box-size-text-input"
                        type="number"
                        min="1"
                        placeholder="Box Size"
                      />
                    </td>
                    <td>
                      <button
                        class="btn-save float-left"
                        @click="showQrcodeModal('startQRCodeFruits')"
                      >
                        {{ $t("Attach QR Code", "Attach QR Code") }}
                      </button>
                      <input
                        v-model="startQRCodeFruits"
                        class="text-input"
                        type="text"
                        placeholder="FA000000001"
                      />
                    </td>
                    <td>
                      <button
                        class="btn-save float-left"
                        @click="showQrcodeModal('endQRCodeFruits')"
                      >
                        {{ $t("Attach QR Code", "Attach QR Code") }}
                      </button>
                      <input
                        v-model="endQRCodeFruits"
                        class="text-input"
                        type="text"
                        placeholder="FA999999999"
                      />
                    </td>
                    <td>
                      <button
                        class="btn-save float-left"
                        @click="showQrcodeModal('startQRCodeBoxes')"
                      >
                        {{ $t("Attach QR Code", "Attach QR Code") }}
                      </button>
                      <input
                        v-model="startQRCodeBoxes"
                        class="text-input"
                        type="text"
                        placeholder="BA00000001"
                      />
                    </td>
                    <td>
                      <button
                        class="btn-save float-left"
                        @click="showQrcodeModal('endQRCodeBoxes')"
                      >
                        {{ $t("Attach QR Code", "Attach QR Code") }}
                      </button>
                      <input
                        v-model="endQRCodeBoxes"
                        class="text-input"
                        type="text"
                        placeholder="BA99999999"
                        v-on:keyup.enter="addMoreQRCodes()"
                      />
                    </td>
                  </tr>
                </table>

                <!-- new UI design ends here  -->
                <!-- <div class="inp-container inp-container-same-line">
                  <label class="input-label"
                    >{{
                      $t("Start QR Code # - Fruits", "Start QR Code # - Fruits")
                    }}
                    *</label
                  >
                  <button
                    class="btn-save float-left"
                    @click="showQrcodeModal('startQRCodeFruits')"
                  >
                    {{ $t("Attach QR Code", "Attach QR Code") }}
                  </button>
                  <input
                    v-model="startQRCodeFruits"
                    class="text-input"
                    type="text"
                    placeholder="FA000000001"
                  />
                </div>
                <div class="inp-container inp-container-same-line">
                  <label class="input-label"
                    >{{
                      $t("End QR Code # - Fruits", "End QR Code # - Fruits")
                    }}
                    *</label
                  >
                  <button
                    class="btn-save float-left"
                    @click="showQrcodeModal('endQRCodeFruits')"
                  >
                    {{ $t("Attach QR Code", "Attach QR Code") }}
                  </button>
                  <input
                    v-model="endQRCodeFruits"
                    class="text-input"
                    type="text"
                    placeholder="FA999999999"
                  />
                </div> -->
                <!-- <div class="inp-container scan-qr-input-container">
                  <button
                    class="btn btn-lg btn-info"
                    v-if="fruitsQRCodes.length"
                    @click="showQrcodeViewModal(fruitsQRCodes)"
                  >
                    {{ $t("View attached", "View attached") }}
                    {{ fruitsCount }} QR Codes.
                  </button>
                </div> -->
                <!-- <div c
                on> -->

                <button
                  class="btn-save float-left btn-add-more"
                  @click="addMoreQRCodes()"
                >
                  {{ $t("Add More", "Add More") }}
                </button>
              </div>
              <div v-if="selectedStage == 'Carton Filling'"></div>

              <!-- <div
                class="input-wrap carton-filling-input-wrap"
                v-if="selectedStage=='Carton Filling'"
              >
                <div class="inp-container inp-container-same-line">
                  <label class="input-label">Start QR Code # - Pallets *</label>
                  <button
                    class="btn-save float-left"
                    @click="showQrcodeModal('startQRCodePallets')"
                  >Attach QR Code</button>
                  <input
                    v-model="startQRCodePallets"
                    class="text-input"
                    type="text"
                    placeholder="A0000 21"
                  />
                </div>
                <div class="inp-container inp-container-same-line">
                  <label class="input-label">End QR Code # - Pallets *</label>
                  <button
                    class="btn-save float-left"
                    @click="showQrcodeModal('endQRCodePallets')"
                  >Attach QR Code</button>
                  <input
                    v-model="endQRCodePallets"
                    class="text-input"
                    type="text"
                    placeholder="A0000 25"
                  />
                </div>
                <div class="inp-container scan-qr-input-container">
                  <button
                    class="btn btn-lg btn-info"
                    v-if="palletQRCodes.length"
                    @click="showQrcodeViewModal(palletQRCodes)"
                  >View attached {{ palletQRCodes.length }} QR Codes.</button>
                </div>
              </div>-->

              <div
                class="input-wrap"
                v-if="selectedStage == 'Temperature Readings for Packed Lot'"
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Ambient Temp", "Ambient Temp") }} (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.temperatureReadingPackedLot &&
                        (fruitFlowConfig.temperatureReadingPackedLot
                          .ambientTemperature == 'true' ||
                          fruitFlowConfig.temperatureReadingPackedLot
                            .ambientTemperature == true)
                      "
                    >
                      *</span
                    ></label
                  >
                  <input
                    v-model="ambienttemperaturePacked"
                    class="text-input"
                    type="number"
                    min="0"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Internal Fruit Temp", "Internal Fruit Temp") }}
                    (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.temperatureReadingPackedLot &&
                        (fruitFlowConfig.temperatureReadingPackedLot
                          .internalFruitTemperature == 'true' ||
                          fruitFlowConfig.temperatureReadingPackedLot
                            .internalFruitTemperature == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="internalFruitTemperaturePacked"
                    class="text-input text-input-last-child"
                    type="number"
                    min="0"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="selectedStage == 'Forced Air Cooling Entry'"
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Entry Time", "Entry Time") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.forcedAirCoolingEntry &&
                        (fruitFlowConfig.forcedAirCoolingEntry.timeOfEntry ==
                          'true' ||
                          fruitFlowConfig.forcedAirCoolingEntry.timeOfEntry ==
                            true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="entryTimeForcedCooling"
                    class="text-input packing-line-input"
                    type="text"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{
                      $t(
                        "Fruit Temperature at Entry",
                        "Fruit Temperature at Entry"
                      )
                    }}
                    (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.forcedAirCoolingEntry &&
                        (fruitFlowConfig.forcedAirCoolingEntry
                          .fruitTemperatureAtEntry == 'true' ||
                          fruitFlowConfig.forcedAirCoolingEntry
                            .fruitTemperatureAtEntry == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="fruitTemperatureEntryForcedCooling"
                    class="text-input packing-line-input"
                    type="number"
                    min="0"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{
                      $t("Airflow Temperature RH", "Airflow Temperature RH")
                    }}
                    (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.forcedAirCoolingEntry &&
                        (fruitFlowConfig.forcedAirCoolingEntry
                          .airflowTemperature == 'true' ||
                          fruitFlowConfig.forcedAirCoolingEntry
                            .airflowTemperature == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="airflowTemperatureRH"
                    class="text-input packing-line-input"
                    type="number"
                    min="0"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="selectedStage == 'Removal from Forced Air Cooling'"
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Removal Time", "Removal Time") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.removalFromForcedAirCooling &&
                        (fruitFlowConfig.removalFromForcedAirCooling
                          .timeOfExit == 'true' ||
                          fruitFlowConfig.removalFromForcedAirCooling
                            .timeOfExit == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="removalTimeForcedCooling"
                    class="text-input packing-line-input"
                    type="text"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{
                      $t(
                        "Fruit Temperature at Removal",
                        "Fruit Temperature at Removal"
                      )
                    }}
                    (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.removalFromForcedAirCooling &&
                        (fruitFlowConfig.removalFromForcedAirCooling
                          .fruitTemperatureOnExit == 'true' ||
                          fruitFlowConfig.removalFromForcedAirCooling
                            .fruitTemperatureOnExit == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="fruitTemperatureRemovalForcedCooling"
                    class="text-input packing-line-input text-input-last-child"
                    min="0"
                    type="number"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="selectedStage == 'Cold Room Storage In'"
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Fruit Temperature", "Fruit Temperature") }}
                    (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.coldRoomStorageIn &&
                        (fruitFlowConfig.coldRoomStorageIn.fruitTemperature ==
                          'true' ||
                          fruitFlowConfig.coldRoomStorageIn.fruitTemperature ==
                            true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="fruitTemperatureColdStorage"
                    class="text-input"
                    min="0"
                    type="number"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{
                      $t("Airflow Temperature RH", "Airflow Temperature RH")
                    }}
                    (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.coldRoomStorageIn &&
                        (fruitFlowConfig.coldRoomStorageIn.airflowTemperature ==
                          'true' ||
                          fruitFlowConfig.coldRoomStorageIn
                            .airflowTemperature == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="airflowTemperatureRHColdStorage"
                    class="text-input"
                    type="number"
                    min="0"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Storage Time In", "Storage Time In") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.coldRoomStorageIn &&
                        (fruitFlowConfig.coldRoomStorageIn.storageTimeIn ==
                          'true' ||
                          fruitFlowConfig.coldRoomStorageIn.storageTimeIn ==
                            true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="storageTimeIn"
                    class="text-input"
                    type="text"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="selectedStage == 'Cold Room Storage Out'"
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Fruit Temp", "Fruit Temp") }} (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.coldRoomStorageOut &&
                        (fruitFlowConfig.coldRoomStorageOut.fruitTemperature ==
                          'true' ||
                          fruitFlowConfig.coldRoomStorageOut.fruitTemperature ==
                            true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="fruitTemperatureColdStorageOut"
                    class="text-input"
                    min="0"
                    type="number"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Storage Time Out", "Storage Time Out") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.coldRoomStorageOut &&
                        (fruitFlowConfig.coldRoomStorageOut.storageTimeOut ==
                          'true' ||
                          fruitFlowConfig.coldRoomStorageOut.storageTimeOut ==
                            true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="storageTimeOut"
                    class="text-input text-input-last-child"
                    type="text"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="selectedStage == 'Container Inspection'"
              >
                <div class="inp-container scan-qr-input-container">
                  <label class="input-label"
                    >{{
                      $t("Filled Inspection form", "Filled Inspection form")
                    }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.containerInspection &&
                        (fruitFlowConfig.containerInspection.mandatory ==
                          'true' ||
                          fruitFlowConfig.containerInspection.mandatory == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <div class="attach-border container-inspection-border"></div>
                  <b-form-file
                    multiple
                    class="container-inspection-div"
                    v-model="containerInspectionfile"
                    :placeholder="$t('No Attachment yet', 'No Attachment yet')"
                    drop-placeholder="Drop file here..."
                  >
                    <template slot="file-name" slot-scope="{ names }">
                      <b-badge variant="dark">{{ names[0] }}</b-badge>
                      <b-badge
                        v-if="names.length > 1"
                        variant="dark"
                        class="ml-1"
                        >+ {{ names.length - 1 }} More files</b-badge
                      >
                    </template>
                  </b-form-file>
                </div>

                <div
                  v-if="isContainerInspection"
                  class="lotsatpackhouse-upload-wrap"
                >
                  <ul class="upload-file-link-ul row">
                    <li
                      class="upload-li"
                      v-bind:key="file.containerInspectionImgFileName"
                      v-for="file in containerInspectionImgs"
                    >
                      <div class="uploaded-file-link">
                        {{ file.containerInspectionImgFileName }}
                        <a
                          target="_blank"
                          v-bind:href="file.containerInspectionImgFileURL"
                        >
                          <img
                            class="download-icon-upload"
                            src="../../assets/images/download-button.png"
                          />
                        </a>
                      </div>

                      <div class="uploaded-image-wrap" v-if="file.isImage">
                        <img :src="file.containerInspectionImgFileURL" />
                      </div>
                    </li>
                    <li
                      class="upload-li"
                      v-bind:key="one"
                      v-for="one in Math.ceil(
                        containerInspectionImgs.length / 2
                      ) *
                        2 -
                      containerInspectionImgs.length"
                    ></li>
                  </ul>
                </div>
              </div>
              <div class="input-wrap" v-if="selectedStage == 'Sampling'">
                <div class="inp-container">
                  <label class="input-label"
                    ># {{ $t("Samples Taken", "Samples Taken") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.sampling &&
                        (fruitFlowConfig.sampling.samplesTaken == 'true' ||
                          fruitFlowConfig.sampling.samplesTaken == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="samplesTaken"
                    class="text-input"
                    type="number"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Temperature", "Temperature") }} (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.sampling &&
                        (fruitFlowConfig.sampling.temperature == 'true' ||
                          fruitFlowConfig.sampling.temperature == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="samplingTemperature"
                    class="text-input"
                    type="number"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{
                      $t("Date & Time of Sampling", "Date & Time of Sampling")
                    }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.sampling &&
                        (fruitFlowConfig.sampling.timestamp == 'true' ||
                          fruitFlowConfig.sampling.timestamp == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="dateAndTimeofSampling"
                    class="text-input text-input-last-child"
                    type="text"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="selectedStage == 'Pre-Cooling Reefers'"
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{
                      $t("Reefer Wall Temperature", "Reefer Wall Temperature")
                    }}
                    (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.preCoolingReefers &&
                        (fruitFlowConfig.preCoolingReefers.mandatory ==
                          'true' ||
                          fruitFlowConfig.preCoolingReefers.mandatory == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="reeferWallTemperature"
                    class="text-input text-input-last-child"
                    min="0"
                    type="number"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap"
                v-if="selectedStage == 'Cold Tunnel Loading'"
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Destination Date/Time", "Destination Date/Time") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.coldTunnelLoading &&
                        (fruitFlowConfig.coldTunnelLoading
                          .destinationDateAndTime == 'true' ||
                          fruitFlowConfig.coldTunnelLoading
                            .destinationDateAndTime == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="destinationDateTimeColdTunnelLoading"
                    class="text-input"
                    type="text"
                    placeholder=" "
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{
                      $t("Reefer Wall Temperature", "Reefer Wall Temperature")
                    }}
                    (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.coldTunnelLoading &&
                        (fruitFlowConfig.coldTunnelLoading
                          .reeferWallTemperature == 'true' ||
                          fruitFlowConfig.coldTunnelLoading
                            .reeferWallTemperature == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="reeferWallTemperatureColdTunnelLoading"
                    class="text-input text-input-last-child"
                    min="0"
                    type="number"
                    placeholder
                  />
                </div>
              </div>
              <div
                class="input-wrap unload-input-wrap"
                v-if="selectedStage == 'Upload Product Certifications'"
              >
                <div class="inp-container temp-measure-inp-container">
                  <div class="attach-border attach-border-temp-measure"></div>
                  <b-form-file
                    multiple
                    v-model="unloadProductCertificationsDocuments"
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
                        >+ {{ names.length - 1 }} More files</b-badge
                      >
                    </template>
                  </b-form-file>
                </div>
                <div
                  v-if="isUnloadCertificate"
                  class="lotsatpackhouse-upload-wrap"
                >
                  <ul class="upload-file-link-ul">
                    <li
                      class="upload-li float-left"
                      v-bind:key="file.unloadCertificateFileName"
                      v-for="file in unloadCertificateFiles"
                    >
                      <div class="uploaded-file-link">
                        {{ file.unloadCertificateFileName }}
                        <a
                          target="_blank"
                          v-bind:href="file.unloadCertificatePath"
                        >
                          <img
                            class="download-icon-upload"
                            src="../../assets/images/download-button.png"
                          />
                        </a>
                      </div>
                      <div class="uploaded-image-wrap" v-if="imageloaded">
                        <img :src="file.unloadCertificatePath" />
                      </div>
                    </li>
                    <li
                      class="col-md-6"
                      v-bind:key="one"
                      v-for="one in Math.ceil(
                        unloadCertificateFiles.length / 2
                      ) *
                        2 -
                      unloadCertificateFiles.length"
                    ></li>
                  </ul>
                </div>
              </div>
              <div
                class="input-wrap larvae-input-wrap"
                v-if="selectedStage == 'Shipping Details'"
              >
                <label class="larvae-wrap">
                  <input
                    v-on:change="shippingDetailChange"
                    class="larvae-input radio-btn"
                    v-model="shippingDetails"
                    type="radio"
                    name="shippingDetails"
                    value="Shipment by Air (US$ 1.68/kg)"
                    :checked="
                      shippingDetails == 'Shipment by Air (US$ 1.68/kg)'
                    "
                  />
                  <img class="radio-btn-img larvae-rb-img" />
                  {{ $t("Shipment by Air", "Shipment by Air") }}
                </label>
                <label class="larvae-wrap">
                  <input
                    v-on:change="shippingDetailChange"
                    class="larvae-input radio-btn"
                    v-model="shippingDetails"
                    type="radio"
                    name="shippingDetails"
                    value="Shipment by Sea (US$ 1.22/kg)"
                    :checked="
                      shippingDetails == 'Shipment by Sea (US$ 1.22/kg)'
                    "
                  />
                  <img class="radio-btn-img larvae-rb-img" />
                  {{ $t("Shipment by Sea", "Shipment by Sea") }}
                </label>
              </div>
              <div
                class="input-wrap transport-wrap"
                v-if="selectedStage == 'Transport Details'"
              >
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Departure Date/Time", "Departure Date/Time") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.transportDetails &&
                        (fruitFlowConfig.transportDetails
                          .departureDateAndTime == 'true' ||
                          fruitFlowConfig.transportDetails
                            .departureDateAndTime == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="departureDateTimeTransport"
                    class="text-input transport-small-input"
                    type="text"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Destination", "Destination") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.transportDetails &&
                        (fruitFlowConfig.transportDetails.destination ==
                          'true' ||
                          fruitFlowConfig.transportDetails.destination == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="destinationTransport"
                    class="text-input quality-inspection"
                    type="text"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Temperature", "Temperature") }} (&#8451;)
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.transportDetails &&
                        (fruitFlowConfig.transportDetails.temperature ==
                          'true' ||
                          fruitFlowConfig.transportDetails.temperature == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="transportTemperature"
                    class="text-input transport-small-input"
                    min="0"
                    type="number"
                    placeholder
                  />
                </div>
                <div class="inp-container">
                  <label class="input-label"
                    >{{ $t("Transport Conditions", "Transport Conditions") }}
                    <span
                      v-if="
                        fruitFlowConfig &&
                        fruitFlowConfig.transportDetails &&
                        (fruitFlowConfig.transportDetails.transportConditions ==
                          'true' ||
                          fruitFlowConfig.transportDetails
                            .transportConditions == true)
                      "
                    >
                      *</span
                    >
                  </label>
                  <input
                    v-model="transportConditions"
                    class="text-input quality-inspection"
                    type="text"
                    placeholder
                  />
                </div>

                <!-- <div class="inp-container">
                  <div class="row">
                    <div class="col-md-6">
                      <label class="input-label"
                        >{{ $t("Currency", "Currency") }}
                        <span
                          v-if="
                            fruitFlowConfig &&
                            fruitFlowConfig.transportDetails &&
                            (fruitFlowConfig.transportDetails.currency ==
                              'true' ||
                              fruitFlowConfig.transportDetails.currency == true)
                          "
                        >
                          *</span
                        >
                      </label>
                      <div class="v-select-wrap">
                        <v-select
                          v-model="currency"
                          placeholder="Select Currency"
                          class="lots-at-packhouse-v-select"
                          :options="currencySource"
                        ></v-select>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="input-label"
                        >{{ $t("Transport Cost", "Transport Cost") }}
                        <span
                          v-if="
                            fruitFlowConfig &&
                            fruitFlowConfig.transportDetails &&
                            (fruitFlowConfig.transportDetails.transportCost ==
                              'true' ||
                              fruitFlowConfig.transportDetails.transportCost ==
                                true)
                          "
                        >
                          *</span
                        >
                      </label>
                      <span class="prefixCurrency">
                        <span class="pref" v-if="this.currency == 'USD'"
                          >$</span
                        >
                        <span class="pref" v-if="this.currency == 'HTG'"
                          >G</span
                        >
                        <input
                          v-model="transportCost"
                          class="text-input transport-small-input"
                          min="0"
                          type="number"
                          placeholder
                        />
                      </span>
                    </div>
                  </div>
                </div> -->

                <!-- <div class="inp-container temp-measure-inp-container">
                  <label class="input-label">SOP</label>
                  <div class="attach-border attach-sop sop-border attach-border-temp-measure"></div>
                  <b-form-file
                    class="attach-sop-div"
                    v-model="SOPFile"
                    placeholder="No Attachment yet"
                    drop-placeholder="Drop file here..."
                  ></b-form-file>
                </div>-->
                <div
                  v-if="isTransportDetailsFile"
                  class="lotsatpackhouse-upload-wrap"
                >
                  <ul class="upload-file-link-ul">
                    <li
                      v-bind:key="file.transpostSOPFileName"
                      v-for="file in transposrtDetailFiles"
                    >
                      <div class="uploaded-file-link">
                        {{ file.transpostSOPFileName }}
                        <a
                          target="_blank"
                          v-bind:href="file.transportSOPFileURL"
                        >
                          <img
                            class="download-icon-upload"
                            src="../../assets/images/download-button.png"
                          />
                        </a>
                      </div>
                      <div class="uploaded-image-wrap" v-if="imageloaded">
                        <img :src="file.transportSOPFileURL" />
                      </div>
                    </li>
                    <li
                      class="col-md-6"
                      v-bind:key="one"
                      v-for="one in Math.ceil(
                        transposrtDetailFiles.length / 2
                      ) *
                        2 -
                      transposrtDetailFiles.length"
                    ></li>
                  </ul>
                </div>
              </div>
            </perfect-scrollbar>
          </div>
        </div>
      </div>
      <div class="lots-at-packhouse-mandatory-warning">
        <span>* {{ $t("Mandatory Fields", "Mandatory Fields") }}</span>
      </div>
      <div class="button-container">
        <input
          type="button"
          v-on:click="hideModal"
          class="btn-cancel"
          :value="$t('Cancel', 'Cancel')"
        />
        <input
          type="button"
          v-on:click="Save"
          class="btn-save"
          :value="$t('Save', 'Save')"
        />
      </div>
    </b-modal>
    <b-modal
      hide-footer
      id="failed-larvae-testing-confirm-modal"
      ref="confirm-modal"
      hide-backdrop
      :title="$t('Warning', 'Warning')"
    >
      <label>
        {{
          $t(
            'Are you sure you want to proceed to update the Larvae Testing as "failed"',
            'Are you sure you want to proceed to update the Larvae Testing as "failed"'
          )
        }}
        ?
      </label>
      <div class="button-container">
        <input
          type="button"
          v-on:click="hideRejectConfirmModal"
          class="btn-cancel"
          :value="$t('Cancel', 'Cancel')"
        />
        <input
          type="button"
          v-on:click="rejectLot"
          class="btn-save"
          :value="$t('Proceed', 'Proceed')"
        />
      </div>
    </b-modal>
    <b-modal
      hide-footer
      id="save-previous-confirm-modal"
      ref="save-previous-confirm-modal"
      hide-backdrop
      :title="$t('Warning', 'Warning')"
    >
      <label>
        {{
          $t(
            "Are you sure you want to proceed to the next stage without saving?",
            "Are you sure you want to proceed to the next stage without saving?"
          )
        }}
      </label>
      <div class="button-container">
        <input
          type="button"
          v-on:click="hideSavePreviousConfirmModal"
          class="btn-cancel"
          :value="$t('Cancel', 'Cancel')"
        />
        <input
          type="button"
          v-on:click="savePreviousConfirm"
          class="btn-save"
          :value="$t('Proceed', 'Proceed')"
        />
      </div>
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
      <div class="col-md-10 digital-signature-container display-flex">
        <div
          v-for="qrcode in qrcodesToShow"
          :key="qrcode"
          id="qr-code-coantainer"
        >
          <span class="qrcode-label">{{ qrcode }}</span>
          <qr-code :text="qrcode"></qr-code>
        </div>
      </div>
      <!-- <div class="col-md-12 offset-4">
        <div>
          <button class="digital-signature-btn" @click="hideQrcodeViewModal">Close</button>
        </div>
      </div>-->
    </b-modal>
    <b-modal
      hide-footer
      id="confirm-warning-modal"
      ref="confirm-warning-modal"
      hide-backdrop
      :title="$t('Warning', 'Warning')"
    >
      <label>
        {{
          $t(
            "Temperature entered is outside the defined critical limits. Are you sure you want to proceed",
            "Temperature entered is outside the defined critical limits. Are you sure you want to proceed"
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
      id="scanner-modal-lots"
      class="scanner-modal"
      @hide="hideScannerModal"
      ref="scanner-modal"
      hide-backdrop
      no-close-on-backdrop
      :title="$t('Hold Camera/Scanner Steady', 'Hold Camera/Scanner Steady')"
      data-backdrop="static"
    >
      <perfect-scrollbar class="scanner-scroll">
        <div class="scanner-container-lots">
          {{ qrcodeError }}
          <qrcode-stream @decode="onDecode" @init="onInit">
            <span class="qrcode-label-lots">QR Code: {{ qrcodeResult }}</span>
          </qrcode-stream>
        </div>
      </perfect-scrollbar>
      <button class="scanner-done-btn-lots btn-save" @click="hideScannerModal">
        {{ $t("Done", "Done") }}
      </button>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../../router";
import firebase from "firebase";
import "../../assets/css/producer-list.css";
import BootstrapVue from "bootstrap-vue";
import moment from "moment";

Vue.use(BootstrapVue);
import uploadFiles from "../../shared/uploa-files";

import { PerfectScrollbar } from "vue2-perfect-scrollbar";

import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
Vue.use(VueToast);

// import Datetime from "vue-datetime";
// import "vue-datetime/dist/vue-datetime.css";
// Vue.use(Datetime);

import { ClientTable } from "vue-tables-2";
import Offline from "v-offline";

Vue.use(ClientTable);
import "../../assets/css/manage-services.css";
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
Vue.use(DropDownListPlugin);

import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
import VueQrcodeReader from "vue-qrcode-reader";
import VueQRCodeComponent from "vue-qrcode-component";
import sendSMS from "../../shared/sms-service";
Vue.component("qr-code", VueQRCodeComponent);
Vue.use(VueQrcodeReader);
import VueLodash from "vue-lodash";
import Header from "../../components/header-view";
import VueMask from "v-mask";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from "../../shared/auth";
Vue.use(VueMask);

export default {
  components: {
    PerfectScrollbar,
    Header,
    Offline,
  },
  name: "lots-at-packhouse",
  data: function () {
    return {
      mask: "##:##",
      selectedStage: "Larvae Testing",
      seen: true,
      userName: null,
      beforeSelection: true,
      imageloaded: false,
      pickupsList: [],
      columns: [
        "Organization",
        "pickupRequestedOn",
        "Produce",
        "Producer",
        "Collect at",
        "Drop Off At",
        "Fruits Rejected at Collection Point",
        "Current Status",
        "Work Flow",
      ],
      options: {
        perPage: 10,
        sortable: ["Producer", "pickupRequestedOn"],
        headings: {
          pickupRequestedOn: `${this.$t(
            "Pickup Requested On",
            "Pickup Requested On"
          )}`,
          Produce: `${this.$t("Produce", "Produce")}`,
          Producer: `${this.$t("Producer", "Producer")}`,
          "Collect at": `${this.$t("Collect at", "Collect at")}`,
          "Drop Off At": `${this.$t("Drop Off At", "Drop Off At")}`,
          "Fruits Rejected at Collection Point": `${this.$t(
            "Fruits Rejected at Collection Point",
            "Fruits Rejected at Collection Point"
          )}`,
          "Current Status": `${this.$t("Current Status", "Current Status")}`,
          "Work Flow": `${this.$t("Work Flow", "Work Flow")}`,
        },
        orderBy: {
          ascending: false,
          column: "pickupRequestedOn",
        },
        customSorting: {
          pickupRequestedOn: function (ascending) {
            return function (a, b) {
              let dateA = new Date(a.pickupRequestedOn);
              let dateB = new Date(b.pickupRequestedOn);

              if (ascending) return dateA >= dateB ? 1 : -1;

              return dateA <= dateB ? 1 : -1;
            };
          },
        },
      },
      cartonFillingPalletizingStoredData: [],
      selectedBoxSize: null,
      boxSizeOptions: [8, 10, 11, 12],
      // cartonFillingTableColumns: ['boxCapacity', 'fruitQRCodesFrom', 'fruitsQRCodesTo', 'boxQRCodesFrom', 'boxQRCodesTo'],
      // cartonFillingPalletizingTableOptions: {
      //   // perPage: 10,
      //   // sortable: ["Producer", "pickupRequestedOn"],
      //   headings: {
      //     boxCapacity: `${this.$t(
      //       "Box Capacity",
      //       "Box Capacity"
      //     )}`,
      //     fruitQRCodesFrom: `${this.$t("Fruit QR code from #", "Fruit QR code from #")}`,
      //     fruitsQRCodesTo: `${this.$t("Fruit QR code to #", "Fruit QR code to #")}`,
      //     boxQRCodesFrom: `${this.$t("Box QR code from #", "Box QR code from #")}`,
      //     boxQRCodesTo: `${this.$t("Box QR code to #", "Box QR code to #")}`
      //   },
      //   orderBy: {
      //     // ascending: false,
      //     // column: "pickupRequestedOn",
      //   },
      //   customSorting: {
      //     // pickupRequestedOn: function (ascending) {
      //     //   return function (a, b) {
      //     //     let dateA = new Date(a.pickupRequestedOn);
      //     //     let dateB = new Date(b.pickupRequestedOn);

      //     //     if (ascending) return dateA >= dateB ? 1 : -1;

      //     //     return dateA <= dateB ? 1 : -1;
      //     //   };
      //     // },
      //   },
      // },
      radio: null,
      selectedFlag: false,
      internalFruitTemp: null,
      ambientTemp: null,
      ambientTempAPI: null,
      larvaeTesting: null,
      file: null,
      qualityInspectionResults: null,
      fruitsAccepted: null,
      fruitsRejected: null,
      waterTemperature: null,
      phLevel: null,
      chlorineLevel: null,
      packingLineTimeofEntry: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      temperatureTransfer: null,
      coldStorageTimeIn: moment.utc().local().format("MMM DD, YYYY hh:mm A"),
      temperatureRemoval: null,
      coldStorageTimeOut: moment.utc().local().format("MMM DD, YYYY hh:mm A"),
      gradingResults: null,
      weightofRemovedFruit: null,
      fruitsQRCodesfile: null,
      boxesQRCodesfile: null,
      //palletsQRCodesFile: null,
      //startQRCodePallets: null,
      //endQRCodePallets: null,
      startQRCodeBoxes: null,
      endQRCodeBoxes: null,
      startQRCodeFruits: null,
      endQRCodeFruits: null,
      secondSizingResults: null,
      ambienttemperaturePacked: null,
      ambienttemperaturePackedAPI: null,
      internalFruitTemperaturePacked: null,
      entryTimeForcedCooling: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      fruitTemperatureEntryForcedCooling: null,
      airflowTemperatureRH: null,
      airflowTemperatureRHAPI: null,
      removalTimeForcedCooling: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      fruitTemperatureRemovalForcedCooling: null,
      fruitTemperatureColdStorage: null,
      fruitTemperatureColdStorageOut: null,
      airflowTemperatureRHColdStorage: null,
      airflowTemperatureRHColdStorageAPI: null,
      storageTimeIn: moment.utc().local().format("MMM DD, YYYY hh:mm A"),
      storageTimeOut: moment.utc().local().format("MMM DD, YYYY hh:mm A"),
      containerInspectionfile: null,
      samplesTaken: null,
      samplingTemperature: null,
      dateAndTimeofSampling: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      reeferWallTemperature: null,
      destinationDateTimeColdTunnelLoading: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      reeferWallTemperatureColdTunnelLoading: null,
      shippingDetails: null,
      departureDateTimeTransport: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      transportTemperature: null,
      destinationTransport: null,
      transportConditions: null,
      transportCost: null,
      SOPFile: null,
      selectedServiceRequest: null,
      currencySource: ["USD", "HTG"],
      currency: null,
      uploadedFilePath: null,
      selectedFruit: null,
      selectedFruitTotalCount: null,
      isContainerInspection: false,
      containerInspectionImgs: [],
      isTransportDetailsFile: false,
      transposrtDetailFiles: [],
      isTemperatureFile: false,
      temperatureMeasurementFileURL: null,
      temperatureMeasurementFileName: null,
      //isPalletsQrCodes: false,
      //palletsQRCodeFiles: [],
      isBoxesQrCodes: false,
      boxesQRCodeFiles: [],
      isFruitsQrCodes: false,
      fruitsQRCodeFiles: [],
      isUnloadCertificate: false,
      unloadCertificateFiles: [],
      apiData: null,
      isTemperatureExceed: false,
      unloadProductCertificationsDocuments: null,
      firstSizingResults: null,
      timeofEntryHotWaterTreatment: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      waterTemperatureHotWaterTreatment: null,
      phLevelHotWaterTreatment: null,
      chlorineLevelHotWaterTreatment: null,
      durationHotWaterTreatment: null,
      timeofExitHotWaterTreatment: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      timeofEntryHydroCooling: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      waterTemperatureHydroCooling: null,
      phLevelHydroCooling: null,
      chlorineLevelHydroCooling: null,
      durationHydroCooling: null,
      timeofExitHydroCooling: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      internalFruitTempHydroCooling: null,
      dateTimeCleaningTrimming: moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A"),
      palletQRCodes: [],
      boxQrCodes: [],
      fruitsQRCodes: [],
      qrcodesToShow: [],
      previousSavedFlag: false,
      nextSelectedStage: null,

      larvaeSavedFlag: false,
      temperatureMeasurementSavedFlag: false,
      qualityInspectionSavedFlag: false,
      fruitWashingSavedFlag: false,
      firstSizingSavedFlag: false,
      hotWaterTreatmentEntrySavedFlag: false,
      hotWaterTreatmentExitSavedFlag: false,
      hydroCoolingEntrySavedFlag: false,
      hydroCoolingExitSavedFlag: false,
      feedPackingLineConveyorBeltSavedFlag: false,
      gradingSavedFlag: false,
      secondSizingSavedFlag: false,
      cartonFillingPalletizingSavedFlag: false,
      temperatureReadingPackedLotSavedFlag: false,
      forcedAirCoolingEntrySavedFlag: false,
      removalFromForcedAirCoolingSavedFlag: false,
      coldRoomStorageInSavedFlag: false,
      coldRoomStorageOutSavedFlag: false,
      unloadProductCertificationSavedFlag: false,
      shippingSavedFlag: false,
      transportSavedFlag: false,
      samplingSavedFlag: false,
      containerInspectionSavedFlag: false,
      preCoolingReeferSavedFlag: false,
      coldTunnelLoadingSavedFlag: false,
      cleaningTrimmingSavedFlag: false,
      tranferColdStorageSavedFlag: false,
      removalColdStorageSavedFlag: false,
      globalTotalBoxes: null,
      isTemepertaureBreach: false,
      temperatureBreachCount: 0,
      lossOfBox: 0,
      qrcodesToUpload: [],
      qrcodeResult: "",
      qrcodeError: null,
      currentScanner: null,
      htag: "",
      fruitsCount: null,
      boxCount: null,
      networkStatus: true,
      fruitFlowConfig: null,
      fruitFlowConfigFruit: null,
      cartonFillingAndPalletizingArray: [],
      cartonFillingAndPalletizingFirebaseArray: [],
      fruitsQRCodes: [],
      boxQrCodes: [],
      larvaeTestingLabel: "Larvae Testing",
      temperatureMeasurementLabel: "Temperature Measurement",
      qualityInspectionLabel: "Quality Inspection",
      cleaningAndTrimmingLabel: "Cleaning & Trimming",
      fruitWashingLabel: "Fruit Washing",
      firstSizingLabel: "Sizing",
      hotWaterTreatmentEntryLabel: "Hot Water Treatment Entry",
      hotWaterTreatmentExitLabel: "Hot Water Treatment Exit",
      hydroCoolingEntryLabel: "Hydro Cooling Entry",
      hydroCoolingExitLabel: "Hydro Cooling Exit",
      transferToColdStorageLabel: "Transfer to Cold Storage",
      removalFromColdStorageLabel: "Removal from Cold Storage",
      feedPackingLineConveyorBeltLabel: "Feed Packing Line Conveyor Belt",
      gradingLabel: "Grading",
      secondSizingLabel: "Sizing",
      cartonFillingAndPalletizingLabel: "Carton Filling",
      temperatureReadingsForPackedLotLabel:
        "Temperature Readings for Packed Lot",
      forcedAirCoolingEntryLabel: "Forced Air Cooling Entry",
      removalFromForcedAirCoolingLabel: "Removal from Forced Air Cooling",
      coldRoomStorageInLabel: "Cold Room Storage In",
      coldRoomStorageOutLabel: "Cold Room Storage Out",
      uploadProductCertificationsLabel: "Upload Product Certifications",
      samplingLabel: "Sampling",
      shippingDetailsLabel: "Shipping Details",
      containerInspectionLabel: "Container Inspection",
      preCoolingReefersLabel: "Pre-Cooling Reefers",
      coldTunnelLoadingLabel: "Cold Tunnel Loading",
      transportDetailsLabel: "Transport Details",
      avgWeightPerBox: null,
      shipmentBySea: null,
      shipmentByAir: null,
    };
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
          text: this.$t("Lots at Packhouse", "Lots at Packhouse"),
          href: "/lots-at-packhouse",
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
              text: this.$t(
                "Packhouse Incharge-Dashboard",
                "Packhouse Incharge-Dashboard"
              ),
              href: "/pack-house-incharge-dashboard",
            },
            {
              text: this.$t("Lots at Packhouse", "Lots at Packhouse"),
              href: "/lots-at-packhouse",
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
              text: this.$t(
                "Packhouse Incharge-Dashboard",
                "Packhouse Incharge-Dashboard"
              ),
              href: "/pack-house-incharge-dashboard",
            },
            {
              text: this.$t("Lots at Packhouse", "Lots at Packhouse"),
              href: "/lots-at-packhouse",
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
            text: this.$t("Lots at Packhouse", "Lots at Packhouse"),
            href: "/lots-at-packhouse",
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
            text: this.$t("Lots at Packhouse", "Lots at Packhouse"),
            href: "/lots-at-packhouse",
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
            text: this.$t("Lots at Packhouse", "Lots at Packhouse"),
            href: "/lots-at-packhouse",
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
            text: this.$t("Lots at Packhouse", "Lots at Packhouse"),
            href: "/lots-at-packhouse",
          },
        ]);
      }
    }
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }

    this.options = {
      perPage: 10,
      sortable: ["Producer", "pickupRequestedOn"],
      headings: {
        pickupRequestedOn: `${this.$t(
          "Pickup Requested On",
          "Pickup Requested On"
        )}`,
        Produce: `${this.$t("Produce", "Produce")}`,
        Producer: `${this.$t("Producer", "Producer")}`,
        "Collect at": `${this.$t("Collect at", "Collect at")}`,
        "Drop Off At": `${this.$t("Drop Off At", "Drop Off At")}`,
        "Fruits Rejected at Collection Point": `${this.$t(
          "Fruits Rejected at Collection Point",
          "Fruits Rejected at Collection Point"
        )}`,
        "Current Status": `${this.$t("Current Status", "Current Status")}`,
        "Work Flow": `${this.$t("Work Flow", "Work Flow")}`,
      },
      orderBy: {
        ascending: false,
        column: "pickupRequestedOn",
      },
      customSorting: {
        pickupRequestedOn: function (ascending) {
          return function (a, b) {
            let dateA = new Date(a.pickupRequestedOn);
            let dateB = new Date(b.pickupRequestedOn);

            if (ascending) return dateA >= dateB ? 1 : -1;

            return dateA <= dateB ? 1 : -1;
          };
        },
      },
    };
    this.userName = localStorage.userName;
    this.getPickupList();
    //this.checkImageFile();
  },
  methods: {
    handleConnectivityChange(status) {
      this.networkStatus = status;
    },
    getPickupList: function () {
      let currentval = this;
      currentval.pickupsList = [];
      var ref = firebase.database().ref().child("serviceRequest");
      currentval
        .getHarvestPlannersList()
        .then((harvestPlanners) => {
          console.log(harvestPlanners);
          ref
            .orderByChild("status")
            .equalTo("Arrived At Packhouse")
            .on("child_added", function (snapshot) {
              var data = "";
              console.log(snapshot.val());
              data = {
                Id: snapshot.val().serviceRequestId,
                displayId: snapshot.val().displayId,
                pickupRequestedOn: moment
                  .utc(snapshot.val().dateOfPickup)
                  .local()
                  .format("MMM DD, YYYY hh:mm A"),
                Produce:
                  `${currentval.$t(
                    snapshot.val().product,
                    snapshot.val().product
                  )}` +
                  " (" +
                  (Number(snapshot.val().fruitsHarvested) -
                    Number(snapshot.val().fruitRejected)) +
                  ")",
                Producer: snapshot.val().producer,
                "Collect at": snapshot.val().collectionPoint,
                "Fruits Rejected at Collection Point":
                  snapshot.val().fruitRejected,
                "Drop Off At": snapshot.val().dropOffAtPackhouse,
                "Current Status": snapshot.val().status,
                FruitExpected:
                  Number(snapshot.val().fruitsHarvested) -
                  Number(snapshot.val().fruitRejected),
                phoneNumber: snapshot.val().phoneNumber,
                Organization: snapshot.val().organization,
              };
              if (
                snapshot.val().organizationKey == localStorage.organizationKey
                // localStorage.systemRole == 99 ||
                // localStorage.systemRole == 9 ||
                // localStorage.systemRole == 7
              ) {
                currentval.pickupsList.push(data);
              } else if (localStorage.systemRole.includes(99)) {
                currentval.pickupsList.push(data);
                // console.log(snapshot.val());
                // const createdBy = (() => {
                //   if (snapshot.val().serviceRequestcreatedBy) {
                //     const name = snapshot
                //       .val()
                //       .serviceRequestcreatedBy.split("(")[0];
                //     return name.trim();
                //   }
                // })();
                // if (harvestPlanners.includes(createdBy)) {
                //   currentval.pickupsList.push(data);
                // }
              }

              currentval.seen = false;
              currentval.pickupsList.reverse();
            });
        })
        .catch(() => {
          currentval.seen = false;
          console.log("No harvest planners found");
        });
      setTimeout(function () {
        if (currentval.pickupsList.length == 0) {
          currentval.seen = false;
        }
        //    console.log(currentval.pickupsList);
      }, 5000);
    },
    printDownloadUrl: function (url, fileName, documentType) {
      var currentValue = this;
      currentValue.seen = true;
      // TODO: bind received url to a variable
      // This is the callback function that will be executed once the files have been uploaded to the firebase store
      //var currentValue = this;
      switch (this.selectedStage) {
        case "Temperature Measurement":
          {
            var dbRef = firebase.database().ref().child("serviceRequest");
            var inpData = {
              temperatureMeasurementFileURL: url,
              temperatureMeasurementFileName: fileName,
              updatedBy: localStorage.userName,
            };
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(currentValue.selectedRow.Id)
              .on("child_added", function (data) {
                var ref = firebase.database().ref("serviceRequest/" + data.key);
                ref.update(inpData).then(function () {
                  currentValue.updateModal();
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Temperature Measurement details saved successfully.",
                      "Temperature Measurement details saved successfully."
                    ),
                    type: "success",
                    position: "top",
                  });

                  if (
                    fileName.split(".")[1] == "jpg" ||
                    fileName.split(".")[1] == "png" ||
                    fileName.split(".")[1] == "jpeg"
                  ) {
                    currentValue.imageloaded = true;
                  } else {
                    currentValue.imageloaded = false;
                  }
                  currentValue.temperatureMeasurementSavedFlag = true;
                });
              });
          }
          break;
        case "Upload Product Certifications":
          {
            currentValue.seen = true;
            var dbRef = firebase.database().ref().child("serviceRequest");
            var inpData = {
              unloadCertificatePath: url,
              unloadCertificateFileName: fileName,
            };
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(currentValue.selectedRow.Id)
              .on("child_added", function (data) {
                var ref = firebase
                  .database()
                  .ref("serviceRequest/" + data.key)
                  .child("unloadCertificates");
                ref
                  .push(inpData)
                  .then(function () {
                    currentValue.updateModal();
                    currentValue.seen = false;
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Upload Product Certifications saved successfully.",
                        "Upload Product Certifications saved successfully."
                      ),
                      type: "success",
                      position: "top",
                    });
                    currentValue.unloadProductCertificationSavedFlag = true;
                  })
                  .catch(function (error) {
                    currentValue.seen = false;
                    Vue.$toast.open({
                      message: error.message,
                      type: "error",
                      position: "top",
                    });
                  });
              });
          }
          break;
        case "Carton Filling":
          {
            // if (documentType == "palletsQRCodesFile") {
            //   var dbRef = firebase
            //     .database()
            //     .ref()
            //     .child("serviceRequest");
            //   var inpData = {
            //     palletsQRCodesFilePath: url,
            //     palletsQRCodesFileName: fileName
            //   };
            //   dbRef
            //     .orderByChild("serviceRequestId")
            //     .equalTo(currentValue.selectedRow.Id)
            //     .on("child_added", function(data) {
            //       var ref = firebase
            //         .database()
            //         .ref("serviceRequest/" + data.key)
            //         .child("palletsQRCodes");
            //       ref
            //         .push(inpData)
            //         .then(function() {
            //           currentValue.updateModal();
            //           currentValue.seen = false;
            //         })
            //         .catch(function(error) {
            //           currentValue.seen = false;
            //           Vue.$toast.open({
            //             message: error.message,
            //             type: "error",
            //             position: "top"
            //           });
            //         });
            //     });
            // }
            if (documentType == "boxesQRCodesfile") {
              var dbRef = firebase.database().ref().child("serviceRequest");
              var inpData = {
                boxesQRCodesFilePath: url,
                boxesQRCodesFileName: fileName,
              };
              dbRef
                .orderByChild("serviceRequestId")
                .equalTo(currentValue.selectedRow.Id)
                .on("child_added", function (data) {
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key)
                    .child("boxesQRCodes");
                  ref
                    .push(inpData)
                    .then(function () {
                      currentValue.updateModal();
                      currentValue.seen = false;
                    })
                    .catch(function (error) {
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: error.message,
                        type: "error",
                        position: "top",
                      });
                    });
                });
            } else if (documentType == "fruitsQRCodesfile") {
              var dbRef = firebase.database().ref().child("serviceRequest");
              var inpData = {
                fruitsQRCodesFilePath: url,
                fruitsQRCodesFileName: fileName,
              };
              dbRef
                .orderByChild("serviceRequestId")
                .equalTo(currentValue.selectedRow.Id)
                .on("child_added", function (data) {
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key)
                    .child("fruitsQRCodes");
                  ref
                    .push(inpData)
                    .then(function () {
                      currentValue.updateModal();
                      currentValue.seen = false;
                    })
                    .catch(function (error) {
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: error.message,
                        type: "error",
                        position: "top",
                      });
                    });
                });
            }
          }
          break;

        case "Container Inspection":
          {
            var dbRef = firebase.database().ref().child("serviceRequest");
            var inpData = {
              containerInspectionImgFileURL: url,
              containerInspectionImgFileName: fileName,
            };
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(currentValue.selectedRow.Id)
              .on("child_added", function (data) {
                var ref = firebase
                  .database()
                  .ref("serviceRequest/" + data.key)
                  .child("containerInspectionImg");
                ref
                  .push(inpData)
                  .then(function () {
                    currentValue.updateModal();
                    currentValue.seen = false;
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Container Inspection details saved successfully.",
                        "Container Inspection details saved successfully."
                      ),
                      type: "success",
                      position: "top",
                    });
                    currentValue.containerInspectionSavedFlag = true;
                  })
                  .catch(function (error) {
                    currentValue.seen = false;
                    Vue.$toast.open({
                      message: error.message,
                      type: "error",
                      position: "top",
                    });
                  });
              });
          }
          break;
        case "Transport Details":
          {
            var dbRef = firebase.database().ref().child("serviceRequest");
            var inpData = {
              transportSOPFileURL: url,
              transpostSOPFileName: fileName,
            };
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(currentValue.selectedRow.Id)
              .on("child_added", function (data) {
                var ref = firebase
                  .database()
                  .ref("serviceRequest/" + data.key)
                  .child("sopFile");
                ref
                  .push(inpData)
                  .then(function () {
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Transport Details saved successfully.",
                        "Transport Details saved successfully."
                      ),
                      type: "success",
                      position: "top",
                    });
                    currentValue.updateModal();
                    currentValue.seen = false;
                    currentValue.getPickupList();
                    currentValue.transportSavedFlag = true;
                    let _data = {
                      ArrivedAtPackhouseAddedOn:
                        currentValue.apiData.ArrivedAtPackhouseAddedOn,
                      airflowTemperatureRH:
                        currentValue.airflowTemperatureRHAPI,
                      airflowTemperatureRHColdStorage:
                        currentValue.airflowTemperatureRHColdStorageAPI,
                      ambientTemp: currentValue.ambientTempAPI,
                      ambienttemperaturePacked:
                        currentValue.ambienttemperaturePackedAPI,
                      arrivedAtPackhouseAddedOn:
                        currentValue.apiData.arrivedAtPackhouseAddedOn,
                      arrivedAtPackhouseAdditionalNote:
                        currentValue.apiData.arrivedAtPackhouseAdditionalNote,
                      boxes: currentValue.globalTotalBoxes,
                      lossOfBox: currentValue.lossOfBox,
                      internalFruitTemp: currentValue.internalFruitTemp,
                      temperatureTransfer: currentValue.temperatureTransfer,
                      temperatureRemoval: currentValue.temperatureRemoval,
                      internalFruitTemperaturePacked:
                        currentValue.internalFruitTemperaturePacked,
                      isTemepertaureBreach: currentValue.isTemepertaureBreach,
                      temperatureBreachCount:
                        currentValue.temperatureBreachCount,
                      requestCompletedOn: moment.utc().toString(),
                    };
                    if (
                      currentValue.temperatureBreachCount > 0 ||
                      currentValue.lossOfBox > 0
                    ) {
                      _data.penalties = [];
                    }
                    if (currentValue.temperatureBreachCount > 0) {
                      _data.penalties.push({
                        type: "PH_TEMP_BREACH",
                        temperature_breach_count:
                          currentValue.temperatureBreachCount,

                        // delivery_time: null,
                        fruits_amount: Number(
                          currentValue.selectedRow.FruitExpected
                        ),
                        boxes_amount: currentValue.lossOfBox,
                      });
                    }
                    if (currentValue.lossOfBox > 0) {
                      _data.penalties.push({
                        type: "PH_DELIVERY_LOSS",
                        boxes_amount: currentValue.lossOfBox,
                        fruits_amount: Number(currentValue.lossOfBox) * 10,
                      });
                    }
                  })
                  .catch(function (error) {
                    currentValue.seen = false;
                    Vue.$toast.open({
                      message: error.message,
                      type: "error",
                      position: "top",
                    });
                  });
                currentValue.$refs["pickup-modal"].hide();
              });
          }
          break;
        default: {
          console.log("Invalid state selected.");
        }
      }
    },
    logout: function (event) {
      firebase
        .auth()
        .signOut()
        .then(function () {
          localStorage.emailId = "";
          localStorage.userName = "";
          localStorage.phoneNumber = "";
          Router.push("/");
        })
        .catch(function () {});
    },
    newrequest: function (event) {
      Router.push("new-request");
    },
    showservicerequest: function (event) {
      Router.push("service-requests");
    },
    showListOfProducers: function (event) {
      Router.push("list-of-producers");
    },
    showSelected: function (item) {
      this.radio = item;
      this.selectedFlag = true;
    },
    showDashboard: function () {
      Router.push("pack-house-incharge-dashboard");
    },
    rejectLot: function () {
      let currentValue = this;
      currentValue.seen = true;
      var dbRef = firebase.database().ref().child("serviceRequest");
      var inpData = {
        larvaTesting: currentValue.larvaeTesting,
        status: "Rejected",
        rejectReason: "Larva test failed",
        updatedBy: localStorage.userName,
      };
      dbRef
        .orderByChild("serviceRequestId")
        .equalTo(currentValue.selectedRow.Id)
        .once("child_added", function (data) {
          currentValue
            .createRejectLotAPI(currentValue.selectedRow.Id, inpData)
            .then((response) => {
              console.log(response);
              var ref = firebase.database().ref("serviceRequest/" + data.key);
              ref
                .update(inpData)
                .then(function () {
                  sendSMS(
                    currentValue.selectedRow.phoneNumber,
                    "Nimewo pou jwenn sèvis : " +
                      currentValue.selectedRow.displayId +
                      ". Yon lo fri rejete paske yo gen ti  ze, ti cheniy ladan yo"
                    // "Lot has been rejected due to presencce of Larvae"
                    // "Un lot de fruits a été rejeté en raison de la présence de larves"
                  )
                    .then((sent) => console.log(sent))
                    .catch((err) => console.log(err));
                  Vue.$toast.open({
                    message: currentValue.$t("Lot rejected.", "Lot rejected."),
                    type: "success",
                    position: "top",
                  });
                  currentValue.seen = false;
                  currentValue.getPickupList();

                  currentValue.$refs["confirm-modal"].hide();
                  setTimeout(() => {
                    currentValue.$refs["pickup-modal"].hide();
                  }, 2000);
                })
                .catch(function (error) {
                  currentValue.seen = false;
                  currentValue.erroMessage = error.message;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to firebase.",
                      "Error updating data to firebase."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            })
            .catch((error) => {
              currentValue.erroMessage = error.message;
              currentValue.seen = false;
              Vue.$toast.open({
                position: "top",
                type: "error",
                message: currentValue.$t(
                  "Error updating data to corda blockchain.",
                  "Error updating data to corda blockchain."
                ),
              });
            });
        });
    },
    getDetailsForBlockChainAPI: function () {
      let currentValue = this;
      currentValue.apiData = null;
      var dbRef = firebase.database().ref().child("serviceRequest");
      dbRef
        .orderByChild("serviceRequestId")
        .equalTo(currentValue.selectedRow.Id)
        .on("child_added", function (data) {
          const { endQRCodeBoxes, startQRCodeBoxes } = data.val();
          if (endQRCodeBoxes && startQRCodeBoxes) {
            let splittingFactor = 0;
            for (let i = 0; i < startQRCodeBoxes.length; i++) {
              if (startQRCodeBoxes.charAt(i) == endQRCodeBoxes.charAt(i)) {
                splittingFactor++;
              } else {
                break;
              }
            }
            let start = Number(
              startQRCodeBoxes.substring(
                splittingFactor,
                startQRCodeBoxes.length
              )
            );
            let end = Number(
              endQRCodeBoxes.substring(splittingFactor, endQRCodeBoxes.length)
            );
            currentValue.globalTotalBoxes = end - start + 1;
          }
          currentValue.apiData = {
            ArrivedAtPackhouseAddedOn: data.val().ArrivedAtPackhouseAddedOn,
            arrivedAtPackhouseAddedOn: data.val().arrivedAtPackhouseAddedOn,
            arrivedAtPackhouseAdditionalNote:
              data.val().arrivedAtPackhouseAdditionalNote,
          };
        });
    },

    Save: function () {
      if (this.networkStatus) {
        this.seen = true;
        let currentValue = this;
        var dbRef = firebase.database().ref().child("serviceRequest");

        if (this.selectedStage == "Larvae Testing") {
          if (
            currentValue.fruitFlowConfig.larvaeTesting.mandatory == true ||
            currentValue.fruitFlowConfig.larvaeTesting.mandatory == "true"
          ) {
            if (
              this.larvaeTesting == null ||
              this.larvaeTesting == "" ||
              !this.larvaeTesting ||
              this.larvaeTesting == undefined
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Select Larvae Testing Results",
                  "Select Larvae Testing Results"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (this.larvaeTesting != null && this.larvaeTesting != "") {
          if (currentValue.larvaeTesting == "failed") {
            this.seen = false;
            this.$refs["confirm-modal"].show();
          } else {
            var inpData = {
              larvaTesting: currentValue.larvaeTesting,
              updatedBy: localStorage.userName,
            };
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(currentValue.selectedRow.Id)
              .once("child_added", function (data) {
                currentValue
                  .createLarvaeTestingDetailsAPICall(
                    currentValue.selectedRow.Id,
                    inpData
                  )
                  .then((response) => {
                    console.log(response);
                    var ref = firebase
                      .database()
                      .ref("serviceRequest/" + data.key);
                    ref
                      .update(inpData)
                      .then(function () {
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Larvae Testing details saved successfully.",
                            "Larvae Testing details saved successfully."
                          ),
                          type: "success",
                          position: "top",
                        });
                        currentValue.seen = false;
                        currentValue.larvaeSavedFlag = true;
                      })
                      .catch(function (error) {
                        currentValue.erroMessage = error.message;
                        currentValue.seen = false;
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Error updating data to firebase.",
                            "Error updating data to firebase."
                          ),
                          position: "top",
                          type: "error",
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
                      position: "top",
                      type: "error",
                    });
                  });
              });
          }
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Temperature Measurement") {
          this.seen = true;
          this.uploadedFilePath = null;
          if (
            currentValue.fruitFlowConfig.temperatureMeasurement.ambientTemp ==
              true ||
            currentValue.fruitFlowConfig.temperatureMeasurement.ambientTemp ==
              "true"
          ) {
            if (
              currentValue.ambientTemp == null ||
              currentValue.ambientTemp == "" ||
              currentValue.ambientTemp == undefined ||
              !currentValue.ambientTemp
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Ambient Temperature is needed.",
                  "Ambient Temperature is needed."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.temperatureMeasurement
              .internalFruitTemperature == true ||
            currentValue.fruitFlowConfig.temperatureMeasurement
              .internalFruitTemperature == "true"
          ) {
            if (
              this.internalFruitTemp == null ||
              this.internalFruitTemp == "" ||
              this.internalFruitTemp == undefined ||
              !this.internalFruitTemp
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Internal Fruit Temperature is needed.",
                  "Internal Fruit Temperature is needed."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.temperatureMeasurement.attachments ==
              true ||
            currentValue.fruitFlowConfig.temperatureMeasurement.attachments ==
              "true"
          ) {
            if (currentValue.file == null) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please add attachments.",
                  "Please add attachments."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.internalFruitTemp != null &&
          //   this.ambientTemp != null &&
          //   this.internalFruitTemp != "" &&
          //   this.ambientTemp != ""
          // ) {
          if (
            this.internalFruitTemp > 35 &&
            this.selectedRow.Produce.split(" ")[0] == "Mango"
          ) {
            this.seen = false;
            this.isTemperatureExceed = true;
            this.$refs["confirm-warning-modal"].show();
          } else if (
            this.internalFruitTemp > 30 &&
            this.selectedRow.Produce.split(" ")[0] == "Avocado"
          ) {
            this.seen = false;
            this.isTemperatureExceed = true;
            this.$refs["confirm-warning-modal"].show();
          } else if (
            this.internalFruitTemp > 33 &&
            this.selectedRow.Produce.split(" ")[0] == "Pineapple"
          ) {
            this.seen = false;
            this.isTemperatureExceed = true;
            this.$refs["confirm-warning-modal"].show();
          } else {
            var inpData = {
              ambientTemp: this.ambientTemp,
              internalFruitTemp: this.internalFruitTemp,
              updatedBy: localStorage.userName,
            };

            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(currentValue.selectedRow.Id)
              .once("child_added", function (data) {
                currentValue
                  .createTempMeasurementAPICall(
                    currentValue.selectedRow.Id,
                    inpData
                  )
                  .then((resolved) => {
                    console.log(resolved);
                    var ref = firebase
                      .database()
                      .ref("serviceRequest/" + data.key);
                    ref
                      .update(inpData)
                      .then(function () {
                        currentValue.ambientTempAPI = currentValue.ambientTemp;
                        currentValue.createTempMeasurementAPICall(
                          currentValue.selectedRow.Id,
                          inpData
                        );
                        currentValue.seen = false;
                        if (
                          currentValue.file.name &&
                          (function () {
                            if (currentValue.temperatureMeasurementFileName) {
                              if (
                                currentValue.temperatureMeasurementFileName !=
                                currentValue.file.name
                              ) {
                                return true;
                              } else {
                                return false;
                              }
                            } else {
                              return true;
                            }
                          })()
                        ) {
                          currentValue.uploadImage(
                            currentValue.file,
                            currentValue.selectedStage,
                            currentValue.selectedRow.Id,
                            inpData,
                            currentValue,
                            "Temperature Measurement"
                          );
                        } else {
                          currentValue.seen = false;
                          Vue.$toast.open({
                            message: currentValue.$t(
                              "Temperature Measurement details saved successfully.",
                              "Temperature Measurement details saved successfully."
                            ),
                            type: "success",
                            position: "top",
                          });
                          currentValue.temperatureMeasurementSavedFlag = true;
                        }
                      })
                      .catch(function (error) {
                        currentValue.erroMessage = error.message;
                        currentValue.seen = false;
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Error updating data to firebase.",
                            "Error updating data to firebase."
                          ),
                          position: "top",
                          type: "error",
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
                      position: "top",
                      type: "error",
                    });
                  });
              });
          }
          // }
          // else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Quality Inspection") {
          if (
            currentValue.fruitFlowConfig.qualityInspection.fruitsAccepted ==
              true ||
            currentValue.fruitFlowConfig.qualityInspection.fruitsAccepted ==
              "true"
          ) {
            if (
              this.fruitsAccepted == null ||
              this.fruitsAccepted == "" ||
              !Number.isInteger(Number(this.fruitsAccepted)) ||
              !this.fruitsAccepted ||
              this.fruitsAccepted == undefined
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Enter Fruits Accepted.",
                  "Enter Fruits Accepted."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.qualityInspection.fruitsRejected ==
              true ||
            currentValue.fruitFlowConfig.qualityInspection.fruitsRejected ==
              "true"
          ) {
            if (
              this.fruitsRejected == null ||
              this.fruitsRejected == "" ||
              !Number.isInteger(Number(this.fruitsRejected)) ||
              !this.fruitsRejected ||
              this.fruitsRejected == undefined
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Enter Fruits Rejected.",
                  "Enter Fruits Rejected."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.qualityInspection
              .qualityInspectionResults == true ||
            currentValue.fruitFlowConfig.qualityInspection
              .qualityInspectionResults == "true"
          ) {
            if (
              this.qualityInspectionResults == null ||
              this.qualityInspectionResults == "" ||
              !this.qualityInspectionResults ||
              this.qualityInspectionResults == undefined
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Enter Quality Inspection Results.",
                  "Enter Quality Inspection Results."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.qualityInspectionResults != null &&
          //   this.qualityInspectionResults.trim() &&
          //   this.fruitsAccepted != null &&
          //   this.fruitsRejected != null &&
          //   this.qualityInspectionResults != "" &&
          //   this.fruitsAccepted != "" &&
          //   this.fruitsRejected != ""
          // ) {
          // if (
          //   !Number.isInteger(Number(this.fruitsAccepted)) ||
          //   !Number.isInteger(Number(this.fruitsRejected))
          // ) {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please enter a valid fruit count",
          //     type: "error",
          //     position: "top"
          //   });
          // }
          //  else
          if (
            Number(this.fruitsAccepted) <=
              Number(this.selectedFruitTotalCount) &&
            Number(this.fruitsAccepted) + Number(this.fruitsRejected) <=
              Number(this.selectedFruitTotalCount) &&
            Number(this.fruitsRejected) <= Number(this.selectedFruitTotalCount)
          ) {
            var inpData = {
              fruitsAccepted: currentValue.fruitsAccepted,
              fruitsRejected: currentValue.fruitsRejected,
              qualityInspectionResults: currentValue.qualityInspectionResults,
              updatedBy: localStorage.userName,
            };
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(currentValue.selectedRow.Id)
              .once("child_added", function (data) {
                currentValue
                  .createQualityInspectionAPICall(
                    currentValue.selectedRow.Id,
                    inpData
                  )
                  .then((resolved) => {
                    console.log(resolved);
                    var ref = firebase
                      .database()
                      .ref("serviceRequest/" + data.key);
                    ref
                      .update(inpData)
                      .then(function () {
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Quality Inspection details saved successfully.",
                            "Quality Inspection details saved successfully."
                          ),
                          type: "success",
                          position: "top",
                        });

                        currentValue.seen = false;
                        currentValue.qualityInspectionSavedFlag = true;
                      })
                      .catch(function (error) {
                        currentValue.erroMessage = error.message;
                        currentValue.seen = false;
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Error updating data to firebase.",
                            "Error updating data to firebase."
                          ),
                          position: "top",
                          type: "error",
                        });
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    currentValue.erroMessage = error.message;
                    currentValue.seen = false;
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Error updating data to corda blockchain.",
                        "Error updating data to corda blockchain."
                      ),
                      position: "top",
                      type: "error",
                    });
                  });
              });
          } else {
            currentValue.seen = false;
            Vue.$toast.open({
              message: currentValue.$t(
                "Please check the fruit count.",
                "Please check the fruit count."
              ),
              type: "error",
              position: "top",
            });
          }
          // }
          //  else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if ((this.selectedStage == "Hot Water Treatment Exit") == true) {
          if (
            currentValue.fruitFlowConfig.hotWaterTreatmentExit
              .durationOfTreatment == true ||
            currentValue.fruitFlowConfig.hotWaterTreatmentExit
              .durationOfTreatment == "true"
          ) {
            if (
              typeof this.durationHotWaterTreatment == "undefined" ||
              !this.durationHotWaterTreatment ||
              this.durationHotWaterTreatment == null ||
              this.durationHotWaterTreatment == ""
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill duration of treatment.",
                  "Please fill duration of treatment."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.hotWaterTreatmentExit.timeOfExit ==
              true ||
            currentValue.fruitFlowConfig.hotWaterTreatmentExit.timeOfExit ==
              "true"
          ) {
            if (
              !this.timeofExitHotWaterTreatment ||
              !this.timeofExitHotWaterTreatment.trim() ||
              this.timeofExitHotWaterTreatment == undefined ||
              this.timeofExitHotWaterTreatment == ""
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill time of exit.",
                  "Please fill time of exit."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   typeof this.durationHotWaterTreatment != "undefined" &&
          //   this.durationHotWaterTreatment &&
          //   typeof this.timeofExitHotWaterTreatment != "undefined" &&
          //   this.timeofExitHotWaterTreatment &&
          //   this.timeofExitHotWaterTreatment.trim()
          // ) {
          var timeofExit = new Date();
          var timeofEntry = new Date(currentValue.timeofEntryHotWaterTreatment);
          var diff = timeofExit - timeofEntry;

          if (this.waterTemperatureHotWaterTreatment > 47 && diff > 600000) {
            this.seen = false;
            this.isTemperatureExceed = true;
            this.$refs["confirm-warning-modal"].show();
          } else {
            var inpData = {
              durationHotWaterTreatment: currentValue.durationHotWaterTreatment,
              timeofExitHotWaterTreatment: moment.utc().toString(),
              updatedBy: localStorage.userName,
            };
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(currentValue.selectedRow.Id)
              .once("child_added", function (data) {
                currentValue
                  .createHotWaterTreatmentExitAPICall(
                    currentValue.selectedRow.Id,
                    inpData
                  )
                  .then((resolved) => {
                    console.log(resolved);
                    var ref = firebase
                      .database()
                      .ref("serviceRequest/" + data.key);
                    ref
                      .update(inpData)
                      .then(function () {
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Hot Water Treatment Exit details saved successfully.",
                            "Hot Water Treatment Exit details saved successfully."
                          ),
                          type: "success",
                          position: "top",
                        });

                        currentValue.seen = false;
                        currentValue.hotWaterTreatmentExitSavedFlag = true;
                      })
                      .catch(function (error) {
                        currentValue.erroMessage = error.message;
                        currentValue.seen = false;
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Error updating data to firebase.",
                            "Error updating data to firebase."
                          ),
                          position: "top",
                          type: "error",
                        });
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    currentValue.erroMessage = error.message;
                    currentValue.seen = false;
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Error updating data to corda blockchain.",
                        "Error updating data to corda blockchain."
                      ),
                      position: "top",
                      type: "error",
                    });
                  });
              });
          }
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Hot Water Treatment Entry") {
          if (
            currentValue.fruitFlowConfig.hotWaterTreatmentEntry.PHLevel ==
              true ||
            currentValue.fruitFlowConfig.hotWaterTreatmentEntry.PHLevel ==
              "true"
          ) {
            if (
              typeof this.phLevelHotWaterTreatment == "undefined" ||
              !this.phLevelHotWaterTreatment ||
              this.phLevelHotWaterTreatment == null ||
              this.phLevelHotWaterTreatment == ""
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill PH Level.",
                  "Please fill PH Level."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.hotWaterTreatmentEntry.chlorineLevel ==
              true ||
            currentValue.fruitFlowConfig.hotWaterTreatmentEntry.chlorineLevel ==
              "true"
          ) {
            if (
              typeof this.chlorineLevelHotWaterTreatment == "undefined" ||
              !this.chlorineLevelHotWaterTreatment ||
              this.chlorineLevelHotWaterTreatment == null ||
              this.chlorineLevelHotWaterTreatment == ""
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill chlorine level.",
                  "Please fill chlorine level."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.hotWaterTreatmentEntry.timeOfEntry ==
              true ||
            currentValue.fruitFlowConfig.hotWaterTreatmentEntry.timeOfEntry ==
              "true"
          ) {
            if (
              typeof this.timeofEntryHotWaterTreatment == "undefined" ||
              !this.timeofEntryHotWaterTreatment ||
              this.timeofEntryHotWaterTreatment == null ||
              this.timeofEntryHotWaterTreatment == ""
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill time of entry.",
                  "Please fill time of entry."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.hotWaterTreatmentEntry
              .waterTemperature == true ||
            currentValue.fruitFlowConfig.hotWaterTreatmentEntry
              .waterTemperature == "true"
          ) {
            if (
              typeof this.waterTemperatureHotWaterTreatment == "undefined" ||
              !this.waterTemperatureHotWaterTreatment ||
              this.waterTemperatureHotWaterTreatment == null ||
              this.waterTemperatureHotWaterTreatment == ""
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill water temperature",
                  "Please fill water temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   typeof this.timeofEntryHotWaterTreatment != "undefined" &&
          //   this.timeofEntryHotWaterTreatment &&
          //   typeof this.waterTemperatureHotWaterTreatment != "undefined" &&
          //   this.waterTemperatureHotWaterTreatment &&
          //   typeof this.phLevelHotWaterTreatment != "undefined" &&
          //   this.phLevelHotWaterTreatment &&
          //   typeof this.chlorineLevelHotWaterTreatment != "undefined" &&
          //   this.chlorineLevelHotWaterTreatment
          // ) {
          var inpData = {
            timeofEntryHotWaterTreatment: moment.utc().toString(),
            waterTemperatureHotWaterTreatment:
              currentValue.waterTemperatureHotWaterTreatment,
            phLevelHotWaterTreatment: currentValue.phLevelHotWaterTreatment,
            chlorineLevelHotWaterTreatment:
              currentValue.chlorineLevelHotWaterTreatment,
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createHotWaterTreatmentEntryAPICall(
                  currentValue.selectedRow.Id,
                  inpData
                )
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Hot Water Treatment Entry details saved successfully.",
                          "Hot Water Treatment Entry details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });

                      currentValue.seen = false;
                      currentValue.hotWaterTreatmentEntrySavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  currentValue.erroMessage = error.message;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Hydro Cooling Entry") {
          if (
            currentValue.fruitFlowConfig.hydroCoolingEntry.PHLevel == true ||
            currentValue.fruitFlowConfig.hydroCoolingEntry.PHLevel == "true"
          ) {
            if (
              typeof this.phLevelHydroCooling == "undefined" ||
              !this.phLevelHydroCooling ||
              this.phLevelHydroCooling == null ||
              this.phLevelHydroCooling == ""
            ) {
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in PH Level",
                  "Please fill in PH Level"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.hydroCoolingEntry.chlorineLevel ==
              true ||
            currentValue.fruitFlowConfig.hydroCoolingEntry.chlorineLevel ==
              "true"
          ) {
            if (
              typeof this.chlorineLevelHydroCooling == "undefined" ||
              !this.chlorineLevelHydroCooling ||
              this.chlorineLevelHydroCooling == null ||
              this.chlorineLevelHydroCooling == ""
            ) {
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in Chlorine level",
                  "Please fill in Chlorine level"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.hydroCoolingEntry.waterTemperature ==
              true ||
            currentValue.fruitFlowConfig.hydroCoolingEntry.waterTemperature ==
              "true"
          ) {
            if (
              (typeof this.waterTemperatureHydroCooling == "undefined" &&
                !this.waterTemperatureHydroCooling) ||
              this.waterTemperatureHydroCooling == null ||
              this.waterTemperatureHydroCooling == ""
            ) {
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in water temperature",
                  "Please fill in water temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   typeof this.timeofEntryHydroCooling != "undefined" &&
          //   this.timeofEntryHydroCooling &&
          //   typeof this.waterTemperatureHydroCooling != "undefined" &&
          //   this.waterTemperatureHydroCooling &&
          //   typeof this.phLevelHydroCooling != "undefined" &&
          //   this.phLevelHydroCooling &&
          //   typeof this.chlorineLevelHydroCooling != "undefined" &&
          //   this.chlorineLevelHydroCooling
          // ) {
          var inpData = {
            timeofEntryHydroCooling: moment.utc().toString(),
            waterTemperatureHydroCooling:
              currentValue.waterTemperatureHydroCooling,
            phLevelHydroCooling: currentValue.phLevelHydroCooling,
            chlorineLevelHydroCooling: currentValue.chlorineLevelHydroCooling,
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createHydroCoolingEntryAPICall(
                  currentValue.selectedRow.Id,
                  inpData
                )
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Hydro Cooling Entry details saved successfully.",
                          "Hydro Cooling Entry details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });

                      currentValue.seen = false;
                      currentValue.hydroCoolingEntrySavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  currentValue.erroMessage = error.message;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Hydro Cooling Exit") {
          if (
            currentValue.fruitFlowConfig.hydroCoolingExit
              .internalFruitTemperature == true ||
            currentValue.fruitFlowConfig.hydroCoolingExit
              .internalFruitTemperature == "true"
          ) {
            if (
              typeof this.internalFruitTempHydroCooling == "undefined" ||
              !this.internalFruitTempHydroCooling ||
              this.internalFruitTempHydroCooling == null ||
              this.internalFruitTempHydroCooling == ""
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in internal fruit temperature.",
                  "Please fill in internal fruit temperature."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.hydroCoolingExit.timeOfExit == true ||
            currentValue.fruitFlowConfig.hydroCoolingExit.timeOfExit == "true"
          ) {
            if (
              typeof this.timeofExitHydroCooling == "undefined" ||
              !this.timeofExitHydroCooling ||
              !this.timeofExitHydroCooling.trim() ||
              this.timeofExitHydroCooling == null ||
              this.timeofExitHydroCooling == ""
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill time of exit.",
                  "Please fill time of exit."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.hydroCoolingExit.duration == true ||
            currentValue.fruitFlowConfig.hydroCoolingExit.duration == "true"
          ) {
            if (
              typeof this.durationHydroCooling == "undefined" ||
              !this.durationHydroCooling ||
              this.durationHydroCooling == null ||
              this.durationHydroCooling == ""
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in duration",
                  "Please fill in duration"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   typeof this.durationHydroCooling != "undefined" &&
          //   this.durationHydroCooling &&
          //   typeof this.timeofExitHydroCooling != "undefined" &&
          //   this.timeofExitHydroCooling &&
          //   this.timeofExitHydroCooling.trim() &&
          //   typeof this.internalFruitTempHydroCooling != "undefined" &&
          //   this.internalFruitTempHydroCooling
          // ) {
          if (this.internalFruitTempHydroCooling > 31) {
            this.seen = false;
            this.isTemperatureExceed = true;
            this.$refs["confirm-warning-modal"].show();
          } else {
            var inpData = {
              durationHydroCooling: currentValue.durationHydroCooling,
              timeofExitHydroCooling: moment.utc().toString(),
              internalFruitTempHydroCooling:
                currentValue.internalFruitTempHydroCooling,
              updatedBy: localStorage.userName,
            };
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(currentValue.selectedRow.Id)
              .once("child_added", function (data) {
                currentValue
                  .createHydroCoolingExitAPICall(
                    currentValue.selectedRow.Id,
                    inpData
                  )
                  .then((resolved) => {
                    console.log(resolved);
                    var ref = firebase
                      .database()
                      .ref("serviceRequest/" + data.key);
                    ref
                      .update(inpData)
                      .then(function () {
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Hydro Cooling Exit details saved successfully.",
                            "Hydro Cooling Exit details saved successfully."
                          ),
                          type: "success",
                          position: "top",
                        });
                        // currentValue.createHydroCoolingExitAPICall(
                        //   currentValue.selectedRow.Id,
                        //   inpData
                        // );
                        currentValue.seen = false;
                        currentValue.hydroCoolingExitSavedFlag = true;
                      })
                      .catch(function (error) {
                        currentValue.erroMessage = error.message;
                        currentValue.seen = false;
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Error updating data to firebase.",
                            "Error updating data to firebase."
                          ),
                          position: "top",
                          type: "error",
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
                      position: "top",
                      type: "error",
                    });
                  });
              });
          }
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Upload Product Certifications") {
          if (
            currentValue.fruitFlowConfig.uploadProductCertifications
              .mandatory == true ||
            currentValue.fruitFlowConfig.uploadProductCertifications
              .mandatory == "true"
          ) {
            if (
              !this.unloadProductCertificationsDocuments ||
              this.unloadProductCertificationsDocuments == null ||
              this.unloadProductCertificationsDocuments == undefined
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please select files to upload.",
                  "Please select files to upload."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (this.unloadProductCertificationsDocuments) {
          currentValue.seen = true;
          if (
            this.unloadProductCertificationsDocuments &&
            this.unloadProductCertificationsDocuments.length > 0
          ) {
            currentValue.uploadImage(
              currentValue.unloadProductCertificationsDocuments,
              currentValue.selectedStage,
              currentValue.selectedRow.Id,
              inpData,
              currentValue,
              "unloadcertificate"
            );
            //code
            currentValue.unloadProductCertificationsDocuments = null;
          } else {
            currentValue.seen = false;
            Vue.$toast.open({
              message: currentValue.$t(
                "Nothing to upload.",
                "Nothing to upload."
              ),
              type: "error",
              position: "top",
            });
          }

          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please upload the files.",
          //     type: "error",
          //     position: "top"
          //   });
          //   currentValue.unloadProductCertificationSavedFlag = true;
          // }
        }
        if (this.selectedStage == "Cleaning & Trimming") {
          if (
            currentValue.fruitFlowConfig.cleaningAndTrimming.mandatory ==
              true ||
            currentValue.fruitFlowConfig.cleaningAndTrimming.mandatory == "true"
          ) {
            if (
              typeof this.dateTimeCleaningTrimming == "undefined" ||
              !this.dateTimeCleaningTrimming ||
              !this.dateTimeCleaningTrimming.trim() ||
              this.dateTimeCleaningTrimming == null ||
              this.dateTimeCleaningTrimming == ""
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in all the details.",
                  "Please fill in all the details."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   typeof this.dateTimeCleaningTrimming != "undefined" &&
          //   this.dateTimeCleaningTrimming &&
          //   this.dateTimeCleaningTrimming.trim()
          // ) {
          var inpData = {
            dateTimeCleaningTrimming: moment.utc().toString(),
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createCleanTrimAPICall(currentValue.selectedRow.Id, inpData)
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Cleaning & Trimming details saved successfully.",
                          "Cleaning & Trimming details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });

                      currentValue.seen = false;
                      currentValue.cleaningTrimmingSavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  currentValue.erroMessage = error;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "First Sizing") {
          if (
            currentValue.fruitFlowConfig.sizing.mandatory == true ||
            currentValue.fruitFlowConfig.sizing.mandatory == "true"
          ) {
            if (
              typeof this.firstSizingResults == "undefined" ||
              !this.firstSizingResults ||
              !this.firstSizingResults.trim() ||
              this.firstSizingResults == null ||
              this.firstSizingResults == ""
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill all the fields.",
                  "Please fill all the fields."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   typeof this.firstSizingResults != "undefined" &&
          //   this.firstSizingResults &&
          //   this.firstSizingResults.trim()
          // ) {
          var inpData = {
            firstSizingResults: currentValue.firstSizingResults,
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createFirstSizingAPICall(currentValue.selectedRow.Id, inpData)
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Sizing details saved successfully.",
                          "Sizing details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });

                      currentValue.seen = false;
                      currentValue.firstSizingSavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  currentValue.erroMessage = error.message;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Fruit Washing") {
          if (
            currentValue.fruitFlowConfig.fruitWashing.PHLevel == true ||
            currentValue.fruitFlowConfig.fruitWashing.PHLevel == "true"
          ) {
            if (
              this.phLevel == null ||
              this.phLevel == "" ||
              this.phLevel == undefined ||
              !this.phLevel
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill PH Level.",
                  "Please fill PH Level."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.fruitWashing.chlorineLevel == true ||
            currentValue.fruitFlowConfig.fruitWashing.chlorineLevel == "true"
          ) {
            if (
              this.chlorineLevel == "" ||
              this.chlorineLevel == null ||
              this.chlorineLevel == undefined ||
              !this.chlorineLevel
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill chlorine level.",
                  "Please fill chlorine level."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.fruitWashing.waterTemperature ==
              true ||
            currentValue.fruitFlowConfig.fruitWashing.waterTemperature == "true"
          ) {
            if (
              this.waterTemperature == null ||
              this.waterTemperature == "" ||
              this.waterTemperature == undefined ||
              !this.waterTemperature
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill water temperature",
                  "Please fill water temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.waterTemperature != null &&
          //   this.phLevel != null &&
          //   this.chlorineLevel != null &&
          //   this.waterTemperature != "" &&
          //   this.phLevel != "" &&
          //   this.chlorineLevel != ""
          // ) {
          var inpData = {
            waterTemperature: currentValue.waterTemperature,
            phLevel: currentValue.phLevel,
            chlorineLevel: currentValue.chlorineLevel,
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createFruitWashingAPICall(currentValue.selectedRow.Id, inpData)
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Fruit Washing details saved successfully.",
                          "Fruit Washing details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });

                      currentValue.seen = false;
                      currentValue.fruitWashingSavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  currentValue.erroMessage = error.message;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Transfer to Cold Storage") {
          if (
            currentValue.fruitFlowConfig.transferToColdStorage.storageTimeIn ==
              true ||
            currentValue.fruitFlowConfig.transferToColdStorage.storageTimeIn ==
              "true"
          ) {
            if (
              this.coldStorageTimeIn == null ||
              this.coldStorageTimeIn == "" ||
              this.coldStorageTimeIn == undefined ||
              !this.coldStorageTimeIn
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill storage time in",
                  "Please fill storage time in"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.transferToColdStorage.temperature ==
              true ||
            currentValue.fruitFlowConfig.transferToColdStorage.temperature ==
              "true"
          ) {
            if (
              this.temperatureTransfer == null ||
              this.temperatureTransfer == "" ||
              this.temperatureTransfer == undefined ||
              !this.temperatureTransfer
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in temperature",
                  "Please fill in temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.temperatureTransfer != null &&
          //   this.coldStorageTimeIn != null &&
          //   this.coldStorageTimeIn.trim() &&
          //   this.temperatureTransfer != "" &&
          //   this.coldStorageTimeIn != ""
          // ) {
          if (
            this.selectedRow.Produce.split(" ")[0] == "Avocado" &&
            (this.temperatureTransfer > 10 || this.temperatureTransfer < 8)
          ) {
            this.isTemperatureExceed = true;
            this.$refs["confirm-warning-modal"].show();
            this.seen = false;
          } else if (
            this.selectedRow.Produce.split(" ")[0] == "Mango" &&
            (this.temperatureTransfer > 16 || this.temperatureTransfer < 15)
          ) {
            this.isTemperatureExceed = true;
            this.$refs["confirm-warning-modal"].show();
            this.seen = false;
          } else if (
            this.selectedRow.Produce.split(" ")[0] == "Pineapple" &&
            (this.temperatureTransfer > 13 || this.temperatureTransfer < 12)
          ) {
            this.isTemperatureExceed = true;
            this.$refs["confirm-warning-modal"].show();
            this.seen = false;
          } else {
            var inpData = {
              temperatureTransfer: currentValue.temperatureTransfer,
              coldStorageTimeIn: moment.utc().toString(),
              updatedBy: localStorage.userName,
            };
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(currentValue.selectedRow.Id)
              .once("child_added", function (data) {
                currentValue
                  .createtransfertoColdStorageAPICall(
                    currentValue.selectedRow.Id,
                    inpData
                  )
                  .then((resolved) => {
                    console.log(resolved);
                    var ref = firebase
                      .database()
                      .ref("serviceRequest/" + data.key);
                    ref
                      .update(inpData)
                      .then(function () {
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Transfer to Cold Storage details saved successfully.",
                            "Transfer to Cold Storage details saved successfully."
                          ),
                          type: "success",
                          position: "top",
                        });

                        currentValue.seen = false;
                        currentValue.tranferColdStorageSavedFlag = true;
                      })
                      .catch(function (error) {
                        currentValue.erroMessage = error.message;
                        currentValue.seen = false;
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Error updating data to firebase.",
                            "Error updating data to firebase."
                          ),
                          position: "top",
                          type: "error",
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
                      position: "top",
                      type: "error",
                    });
                  });
              });
          }
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Removal from Cold Storage") {
          if (
            currentValue.fruitFlowConfig.removalFromColdStorage
              .storageTimeOut == true ||
            currentValue.fruitFlowConfig.removalFromColdStorage
              .storageTimeOut == "true"
          ) {
            if (
              this.coldStorageTimeOut == null ||
              this.coldStorageTimeOut == "" ||
              !this.coldStorageTimeOut.trim() ||
              this.coldStorageTimeOut == undefined ||
              !this.coldStorageTimeOut
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in storage time out.",
                  "Please fill in storage time out."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.removalFromColdStorage.temperature ==
              true ||
            currentValue.fruitFlowConfig.removalFromColdStorage.temperature ==
              "true"
          ) {
            if (
              this.temperatureRemoval == null ||
              this.temperatureRemoval == "" ||
              this.temperatureRemoval == undefined ||
              !this.temperatureRemoval
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in temperature",
                  "Please fill in temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.temperatureRemoval != null &&
          //   this.coldStorageTimeOut != null &&
          //   this.coldStorageTimeOut.trim() &&
          //   this.temperatureRemoval != "" &&
          //   this.coldStorageTimeOut != ""
          // ) {
          if (
            this.selectedRow.Produce.split(" ")[0] == "Avocado" &&
            (this.temperatureRemoval > 8 || this.temperatureRemoval < 5)
          ) {
            this.isTemperatureExceed = true;
            this.$refs["confirm-warning-modal"].show();
            this.seen = false;
          } else if (
            this.selectedRow.Produce.split(" ")[0] == "Mango" &&
            (this.temperatureRemoval > 15 || this.temperatureRemoval < 12)
          ) {
            this.isTemperatureExceed = true;
            this.$refs["confirm-warning-modal"].show();
            this.seen = false;
          } else if (
            this.selectedRow.Produce.split(" ")[0] == "Pineapple" &&
            (this.temperatureRemoval > 12 || this.temperatureRemoval < 10)
          ) {
            this.isTemperatureExceed = true;
            this.$refs["confirm-warning-modal"].show();
            this.seen = false;
          } else {
            var inpData = {
              temperatureRemoval: currentValue.temperatureRemoval,
              coldStorageTimeOut: moment.utc().toString(),
              updatedBy: localStorage.userName,
            };
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(currentValue.selectedRow.Id)
              .once("child_added", function (data) {
                currentValue
                  .createRemovalfromColdStorageAPICall(
                    currentValue.selectedRow.Id,
                    inpData
                  )
                  .then((resolved) => {
                    console.log(resolved);
                    var ref = firebase
                      .database()
                      .ref("serviceRequest/" + data.key);
                    ref
                      .update(inpData)
                      .then(function () {
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Removal from Cold Storage details saved successfully.",
                            "Removal from Cold Storage details saved successfully."
                          ),
                          type: "success",
                          position: "top",
                        });

                        currentValue.seen = false;
                        currentValue.removalColdStorageSavedFlag = true;
                      })
                      .catch(function (error) {
                        currentValue.erroMessage = error.message;
                        currentValue.seen = false;
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Error updating data to firebase.",
                            "Error updating data to firebase."
                          ),
                          position: "top",
                          type: "error",
                        });
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    currentValue.erroMessage = error;
                    currentValue.seen = false;
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Error updating data to corda blockchain.",
                        "Error updating data to corda blockchain."
                      ),
                      position: "top",
                      type: "error",
                    });
                  });
              });
          }
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Feed Packing Line Conveyor Belt") {
          if (
            currentValue.fruitFlowConfig.feedPackingLineConveyorBelt
              .mandatory == true ||
            currentValue.fruitFlowConfig.feedPackingLineConveyorBelt
              .mandatory == "true"
          ) {
            if (
              this.packingLineTimeofEntry == null ||
              this.packingLineTimeofEntry == "" ||
              !this.packingLineTimeofEntry.trim() ||
              this.packingLineTimeofEntry == undefined ||
              !this.packingLineTimeofEntry
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill all the fields.",
                  "Please fill all the fields."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.packingLineTimeofEntry != null &&
          //   this.packingLineTimeofEntry.trim() &&
          //   this.packingLineTimeofEntry != ""
          // ) {
          var inpData = {
            packingLineTimeofEntry: moment.utc().toString(),
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createFeedPackingLineConveyorBeltAPICall(
                  currentValue.selectedRow.Id,
                  inpData
                )
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Feed Packing Line Conveyor Belt details saved successfully.",
                          "Feed Packing Line Conveyor Belt details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });

                      currentValue.seen = false;
                      currentValue.feedPackingLineConveyorBeltSavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  currentValue.erroMessage = error.message;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Grading") {
          if (
            currentValue.fruitFlowConfig.grading.fruitsRemoved == true ||
            currentValue.fruitFlowConfig.grading.fruitsRemoved == "true"
          ) {
            if (
              this.weightofRemovedFruit == null ||
              this.weightofRemovedFruit == "" ||
              !this.weightofRemovedFruit.trim() ||
              this.weightofRemovedFruit == undefined ||
              !this.weightofRemovedFruit
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in weight of the fruits removed",
                  "Please fill in weight of the fruits removed"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.grading.gradingResults == true ||
            currentValue.fruitFlowConfig.grading.gradingResults == "true"
          ) {
            if (
              this.gradingResults == null ||
              this.gradingResults == "" ||
              !this.gradingResults.trim() ||
              this.gradingResults == undefined ||
              !this.gradingResults
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in grading results",
                  "Please fill in grading results"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.gradingResults != null &&
          //   this.gradingResults.trim() &&
          //   this.weightofRemovedFruit != null &&
          //   this.gradingResults != "" &&
          //   this.weightofRemovedFruit != ""
          // ) {
          var inpData = {
            gradingResults: currentValue.gradingResults || "",
            weightofRemovedFruit: currentValue.weightofRemovedFruit || "",
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createGradingAPICall(currentValue.selectedRow.Id, inpData)
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Grading details saved successfully.",
                          "Grading details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });

                      currentValue.seen = false;
                      currentValue.gradingSavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  currentValue.erroMessage = error;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Sizing") {
          if (
            currentValue.fruitFlowConfig.secondSizing.mandatory == true ||
            currentValue.fruitFlowConfig.secondSizing.mandatory == "true"
          ) {
            if (
              this.secondSizingResults == null ||
              this.secondSizingResults == "" ||
              !this.secondSizingResults.trim() ||
              this.secondSizingResults == undefined ||
              !this.secondSizingResults
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in all the fields.",
                  "Please fill in all the fields."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.secondSizingResults != null &&
          //   this.secondSizingResults.trim() &&
          //   this.secondSizingResults != ""
          // ) {
          var inpData = {
            secondSizingResults: currentValue.secondSizingResults,
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createSecondSizingAPICall(currentValue.selectedRow.Id, inpData)
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Sizing details saved successfully.",
                          "Sizing details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });

                      currentValue.seen = false;
                      currentValue.secondSizingSavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  currentValue.erroMessage = error;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Carton Filling") {
          this.seen = true;
          if (
            this.startQRCodeFruits ||
            this.endQRCodeFruits ||
            this.startQRCodeBoxes ||
            this.endQRCodeBoxes
          ) {
            this.addMoreQRCodes();
          }
          if (this.cartonFillingAndPalletizingFirebaseArray.length > 0) {
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(currentValue.selectedRow.Id)
              .on("child_added", function (data) {
                let ref = firebase.database().ref("serviceRequest/" + data.key);

                ref.update({}).then(function () {
                  ref
                    .update({
                      cartonFillingAndPalletizingData:
                        currentValue.cartonFillingAndPalletizingFirebaseArray,
                    })
                    .then(
                      function () {
                        let dataToPush = {};
                        dataToPush.updatedBy = localStorage.userName;
                        let appendedFruitQrCodes = [];
                        let fruitsDataToPush = {};
                        fruitsDataToPush.updatedBy = localStorage.userName;
                        currentValue.cartonFillingAndPalletizingFirebaseArray.forEach(
                          (item) => {
                            item.boxQRCodes.forEach((code) => {
                              dataToPush[
                                code
                              ] = `${currentValue.selectedRow.Id}--T_${item.boxSize}`;
                            });
                            let fruitQrcodeletter =
                              item.startQRCodeFruits.replace(/[0-9]/g, "");
                            var fruitStartCount =
                              item.startQRCodeFruits.match(/\d/g);
                            fruitStartCount = fruitStartCount.join("");

                            var fruitEndCount =
                              item.endQRCodeFruits.match(/\d/g);
                            fruitEndCount = fruitEndCount.join("");
                            let _fruitQRCodes = currentValue.generateQRArray(
                              Number(fruitStartCount),
                              Number(fruitEndCount),
                              fruitQrcodeletter,
                              Number(item.startQRCodeFruits.length - 2)
                            );
                            console.log(_fruitQRCodes);
                            _fruitQRCodes.forEach((code) => {
                              console.log(code);
                              fruitsDataToPush[
                                code
                              ] = `${currentValue.selectedRow.Id}--${item.boxSize}`;
                            });
                          }
                        );
                        // currentValue.boxQrCodes.forEach(code => {
                        //   dataToPush[
                        //     code
                        //   ] = `${currentValue.selectedRow.Id}--T_${boxSize}`;
                        // });

                        // fruitsDataToPush.updatedBy = localStorage.userName;
                        // console.log(currentValue.fruitsQRCodes);
                        // currentValue.fruitsQRCodes.forEach((code) => {
                        //   fruitsDataToPush[
                        //     code
                        //   ] = `${currentValue.selectedRow.Id}`;
                        // });
                        let dataToUpdate = [];
                        currentValue.cartonFillingAndPalletizingFirebaseArray.forEach(
                          (item) => {
                            let _data = {
                              startQRCodeBoxes: item.startQRCodeBoxes,
                              endQRCodeBoxes: item.endQRCodeBoxes,
                              startQRCodeFruits: item.startQRCodeFruits,
                              endQRCodeFruits: item.endQRCodeFruits,
                            };
                            dataToUpdate.push(_data);
                          }
                        );
                        firebase
                          .database()
                          .ref()
                          .child("fruits")
                          .update(fruitsDataToPush)
                          .then(
                            function () {
                              console.log("fruits qrcode pushed succesfully");
                            },
                            function () {
                              currentValue.seen = false;
                              console.log("Error");
                            }
                          );

                        currentValue
                          .createCartonFillingPalletizingAPICall(
                            currentValue.selectedRow.Id,
                            dataToUpdate
                          )
                          .then((resolved) => {
                            console.log(resolved);
                            firebase
                              .database()
                              .ref()
                              .child("boxes")
                              .update(dataToPush)
                              .then(
                                function () {
                                  currentValue.seen = false;
                                  Vue.$toast.open({
                                    message: currentValue.$t(
                                      "Carton Filling details saved successfully.",
                                      "Carton Filling details saved successfully."
                                    ),
                                    type: "success",
                                    position: "top",
                                  });

                                  currentValue.seen = false;
                                  currentValue.cartonFillingPalletizingSavedFlag = true;
                                  currentValue.cartonFillingAndPalletizingArray =
                                    [];
                                  // currentValue.cartonFillingAndPalletizingFirebaseArray = [];
                                },
                                function () {
                                  currentValue.seen = false;
                                  Vue.$toast.open({
                                    message: currentValue.$t(
                                      "Carton Filling details not updated.",
                                      "Carton Filling details not updated."
                                    ),
                                    type: "error",
                                    position: "top",
                                  });
                                }
                              );
                          })
                          .catch((error) => {
                            console.log(error);
                            currentValue.erroMessage = error;
                            currentValue.seen = false;
                            Vue.$toast.open({
                              message: currentValue.$t(
                                "Error updating data to corda blockchain.",
                                "Error updating data to corda blockchain."
                              ),
                              position: "top",
                              type: "error",
                            });
                          });
                      },
                      function () {
                        currentValue.seen = false;
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Carton Filling details not updated.",
                            "Carton Filling details not updated."
                          ),
                          type: "error",
                          position: "top",
                        });
                      }
                    );
                });
              });
          } else {
            this.seen = false;
            Vue.$toast.open({
              message: `${this.$t(
                "Add atleast one carton filling and palletizing data.",
                "Add atleast one carton filling and palletizing data."
              )}`,
              type: "error",
              position: "top",
            });
          }
          // if (
          //   currentValue.fruitFlowConfig.cartonFillingAndPalletizing
          //     .startQRCodeFruits == true ||
          //   currentValue.fruitFlowConfig.cartonFillingAndPalletizing
          //     .startQRCodeFruits == "true"
          // ) {
          //   if (
          //     this.startQRCodeFruits == null ||
          //     this.startQRCodeFruits == "" ||
          //     this.startQRCodeFruits == undefined ||
          //     !this.startQRCodeFruits
          //   ) {
          //     currentValue.seen = false;
          //     Vue.$toast.open({
          //       message: currentValue.$t(
          //         "Please fill in fruits start QR Code",
          //         "Please fill in fruits start QR Code"
          //       ),
          //       type: "error",
          //       position: "top"
          //     });
          //     return;
          //   }
          // }
          // if (
          //   currentValue.fruitFlowConfig.cartonFillingAndPalletizing
          //     .endQRCodeFruits == true ||
          //   currentValue.fruitFlowConfig.cartonFillingAndPalletizing
          //     .endQRCodeFruits == "true"
          // ) {
          //   if (
          //     this.endQRCodeFruits == null ||
          //     this.endQRCodeFruits == "" ||
          //     this.endQRCodeFruits == undefined ||
          //     !this.endQRCodeFruits
          //   ) {
          //     currentValue.seen = false;
          //     Vue.$toast.open({
          //       message: currentValue.$t(
          //         "Please fill in fruits end QR Code",
          //         "Please fill in fruits end QR Code"
          //       ),
          //       type: "error",
          //       position: "top"
          //     });
          //     return;
          //   }
          // }

          // if (
          //   currentValue.fruitFlowConfig.cartonFillingAndPalletizing
          //     .startQRCodeBox == true ||
          //   currentValue.fruitFlowConfig.cartonFillingAndPalletizing
          //     .startQRCodeBox == "true"
          // ) {
          //   if (
          //     this.startQRCodeBoxes == null ||
          //     this.startQRCodeBoxes == "" ||
          //     this.startQRCodeBoxes == undefined ||
          //     !this.startQRCodeBoxes
          //   ) {
          //     currentValue.seen = false;
          //     Vue.$toast.open({
          //       message: currentValue.$t(
          //         "Please fill in box start QR Code",
          //         "Please fill in box start QR Code"
          //       ),
          //       type: "error",
          //       position: "top"
          //     });
          //     return;
          //   }
          // }
          // if (
          //   currentValue.fruitFlowConfig.cartonFillingAndPalletizing
          //     .endQRCodeBox == true ||
          //   currentValue.fruitFlowConfig.cartonFillingAndPalletizing
          //     .endQRCodeBox == "true"
          // ) {
          //   if (
          //     this.endQRCodeBoxes == null ||
          //     this.endQRCodeBoxes == "" ||
          //     this.endQRCodeBoxes == undefined ||
          //     !this.endQRCodeBoxes
          //   ) {
          //     currentValue.seen = false;
          //     Vue.$toast.open({
          //       message: currentValue.$t(
          //         "Please fill in box end QR Code",
          //         "Please fill in box end QR Code"
          //       ),
          //       type: "error",
          //       position: "top"
          //     });
          //     return;
          //   }
          // }

          // if (
          //   this.startQRCodeFruits.trim().length ==
          //   this.endQRCodeFruits.trim().length
          // ) {
          // if (
          //   this.startQRCodeBoxes.trim().length ==
          //   this.endQRCodeBoxes.trim().length
          // ) {
          // currentValue.palletQRCodes = [];
          // currentValue.boxQrCodes = [];
          // currentValue.fruitsQRCodes = [];

          // var startQRCodeFruitsCount = this.startQRCodeFruits.match(/\d/g);
          // startQRCodeFruitsCount = startQRCodeFruitsCount.join("");

          // var endQRCodeFruitsCount = this.endQRCodeFruits.match(/\d/g);
          // endQRCodeFruitsCount = endQRCodeFruitsCount.join("");

          // var startQRCodeBoxesCount = this.startQRCodeBoxes.match(/\d/g);
          // startQRCodeBoxesCount = startQRCodeBoxesCount.join("");

          // var endQRCodeBoxesCount = this.endQRCodeBoxes.match(/\d/g);
          // endQRCodeBoxesCount = endQRCodeBoxesCount.join("");

          // var fruitsQRCodeLetters = this.startQRCodeFruits.replace(
          //   /[0-9]/g,
          //   ""
          // );
          // var boxQRCodeLetters = this.startQRCodeBoxes.replace(
          //   /[0-9]/g,
          //   ""
          // );

          // this.globalTotalBoxes =
          //   Number(endQRCodeBoxesCount) - Number(startQRCodeBoxesCount) + 1;

          // // number of boxes
          // this.boxCount = this.globalTotalBoxes;

          // // number of fruits
          // currentValue.fruitsCount =
          //   Number(endQRCodeFruitsCount) -
          //   Number(startQRCodeFruitsCount) +
          //   1;

          // // box size
          // const boxSize = Number(currentValue.fruitsCount / this.boxCount);

          // const obj = {
          //   startQRCodeBoxes: this.startQRCodeBoxes,
          //   endQRCodeBoxes: this.endQRCodeBoxes,
          //   startQRCodeFruits: this.startQRCodeFruits,
          //   endQRCodeFruits: this.endQRCodeFruits
          // };

          // currentValue.cartonFillingAndPalletizingArray.push(obj);

          // console.log(currentValue.cartonFillingAndPalletizingArray);

          // currentValue.fruitsQRCodes = currentValue.fruitsQRCodes.concat(
          //   currentValue.generateQRArray(
          //     Number(startQRCodeFruitsCount),
          //     Number(endQRCodeFruitsCount),
          //     fruitsQRCodeLetters,
          //     Number(this.startQRCodeFruits.length - 2)
          //   )
          // );

          // currentValue.boxQrCodes = currentValue.boxQrCodes.concat(
          //   currentValue.generateQRArray(
          //     Number(startQRCodeBoxesCount),
          //     Number(endQRCodeBoxesCount),
          //     boxQRCodeLetters,
          //     Number(this.startQRCodeBoxes.length - 2)
          //   )
          // );

          // let inpData = {
          //   startQRCodeBoxes: currentValue.startQRCodeBoxes,
          //   endQRCodeBoxes: currentValue.endQRCodeBoxes,
          //   startQRCodeFruits: currentValue.startQRCodeFruits,
          //   endQRCodeFruits: currentValue.endQRCodeFruits,
          //   updatedBy: localStorage.userName,
          //   boxSize
          // };

          // currentValue.cartonFillingAndPalletizingFirebaseArray.push(
          //   inpData
          // );

          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: currentValue.$t(
          //       "Box start and end QR Code length must be same.",
          //       "Box start and end QR Code length must be same."
          //     ),
          //     position: "top",
          //     type: "error"
          //   });
          // }
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: currentValue.$t(
          //       "Fruit start and end QR Code length must be same.",
          //       "Fruit start and end QR Code length must be same."
          //     ),
          //     position: "top",
          //     type: "error"
          //   });
          // }
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          //   currentValue.seen = false;
          // }
        }
        if (this.selectedStage == "Temperature Readings for Packed Lot") {
          if (
            currentValue.fruitFlowConfig.temperatureReadingPackedLot
              .ambientTemperature == true ||
            currentValue.fruitFlowConfig.temperatureReadingPackedLot
              .ambientTemperature == "true"
          ) {
            if (
              this.ambienttemperaturePacked == null ||
              this.ambienttemperaturePacked == "" ||
              this.ambienttemperaturePacked == undefined ||
              !this.ambienttemperaturePacked
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in ambient temperature",
                  "Please fill in ambient temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.temperatureReadingPackedLot
              .internalFruitTemperature == true ||
            currentValue.fruitFlowConfig.temperatureReadingPackedLot
              .internalFruitTemperature == "true"
          ) {
            if (
              this.internalFruitTemperaturePacked == null ||
              this.internalFruitTemperaturePacked == "" ||
              this.internalFruitTemperaturePacked == undefined ||
              !this.internalFruitTemperaturePacked
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in internal fruit temperature",
                  "Please fill in internal fruit temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.ambienttemperaturePacked != null &&
          //   this.internalFruitTemperaturePacked != null &&
          //   this.ambienttemperaturePacked != "" &&
          //   this.internalFruitTemperaturePacked != ""
          // ) {
          var inpData = {
            ambienttemperaturePacked: currentValue.ambienttemperaturePacked,
            internalFruitTemperaturePacked:
              currentValue.internalFruitTemperaturePacked,
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createTemperatureReadingsForPackedLotAPICall(
                  currentValue.selectedRow.Id,
                  inpData
                )
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Temperature Readings for Packed Lot details saved successfully.",
                          "Temperature Readings for Packed Lot details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });
                      currentValue.ambienttemperaturePackedAPI =
                        currentValue.ambienttemperaturePacked;

                      currentValue.seen = false;
                      currentValue.temperatureReadingPackedLotSavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  currentValue.erroMessage = error;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Forced Air Cooling Entry") {
          if (
            currentValue.fruitFlowConfig.forcedAirCoolingEntry
              .airflowTemperature == true ||
            currentValue.fruitFlowConfig.forcedAirCoolingEntry
              .airflowTemperature == "true"
          ) {
            if (
              this.airflowTemperatureRH == null ||
              this.airflowTemperatureRH == "" ||
              this.airflowTemperatureRH == undefined ||
              !this.airflowTemperatureRH
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in airflow temperature",
                  "Please fill in airflow temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.forcedAirCoolingEntry
              .fruitTemperatureAtEntry == true ||
            currentValue.fruitFlowConfig.forcedAirCoolingEntry
              .fruitTemperatureAtEntry == "true"
          ) {
            if (
              this.fruitTemperatureEntryForcedCooling == null ||
              this.fruitTemperatureEntryForcedCooling == "" ||
              this.fruitTemperatureEntryForcedCooling == undefined ||
              !this.fruitTemperatureEntryForcedCooling
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in fruit temperature at entry",
                  "Please fill in fruit temperature at entry"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.forcedAirCoolingEntry.timeOfEntry ==
              true ||
            currentValue.fruitFlowConfig.forcedAirCoolingEntry.timeOfEntry ==
              "true"
          ) {
            if (
              this.entryTimeForcedCooling == null ||
              this.entryTimeForcedCooling == "" ||
              !this.entryTimeForcedCooling.trim() ||
              this.entryTimeForcedCooling == undefined ||
              !this.entryTimeForcedCooling
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in time of entry",
                  "Please fill in time of entry"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.entryTimeForcedCooling != null &&
          //   this.entryTimeForcedCooling.trim() &&
          //   this.fruitTemperatureEntryForcedCooling != null &&
          //   this.airflowTemperatureRH != null &&
          //   this.entryTimeForcedCooling != "" &&
          //   this.fruitTemperatureEntryForcedCooling != "" &&
          //   this.airflowTemperatureRH != ""
          // ) {
          var inpData = {
            entryTimeForcedCooling: moment.utc().toString(),
            fruitTemperatureEntryForcedCooling:
              currentValue.fruitTemperatureEntryForcedCooling,
            airflowTemperatureRH: currentValue.airflowTemperatureRH,
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createForcedAirCoolingEntryDetailsAPICall(
                  currentValue.selectedRow.Id,
                  inpData
                )
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Forced Air Cooling Entry details saved successfully.",
                          "Forced Air Cooling Entry details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });
                      currentValue.createForcedAirCoolingEntryDetailsAPICall(
                        currentValue.selectedRow.Id,
                        inpData
                      );
                      currentValue.seen = false;
                      currentValue.forcedAirCoolingEntrySavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  currentValue.erroMessage = error.message;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Removal from Forced Air Cooling") {
          if (
            currentValue.fruitFlowConfig.removalFromForcedAirCooling
              .fruitTemperatureOnExit == true ||
            currentValue.fruitFlowConfig.removalFromForcedAirCooling
              .fruitTemperatureOnExit == "true"
          ) {
            if (
              this.fruitTemperatureRemovalForcedCooling == null ||
              this.fruitTemperatureRemovalForcedCooling == "" ||
              this.fruitTemperatureRemovalForcedCooling == undefined ||
              !this.fruitTemperatureRemovalForcedCooling
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in fruit temperature",
                  "Please fill in fruit temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.removalFromForcedAirCooling
              .timeOfExit == true ||
            currentValue.fruitFlowConfig.removalFromForcedAirCooling
              .timeOfExit == "true"
          ) {
            if (
              this.removalTimeForcedCooling == null ||
              this.removalTimeForcedCooling == "" ||
              !this.removalTimeForcedCooling.trim() ||
              this.removalTimeForcedCooling == undefined ||
              !this.removalTimeForcedCooling
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in time of removal",
                  "Please fill in time of removal"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.removalTimeForcedCooling != null &&
          //   this.fruitTemperatureRemovalForcedCooling != null &&
          //   this.removalTimeForcedCooling != "" &&
          //   this.fruitTemperatureRemovalForcedCooling != ""
          // ) {
          var inpData = {
            removalTimeForcedCooling: moment.utc().toString(),
            fruitTemperatureRemovalForcedCooling:
              currentValue.fruitTemperatureRemovalForcedCooling,
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createRemovalfromForcedAirCoolingDetailsAPICall(
                  currentValue.selectedRow.Id,
                  inpData
                )
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Removal from Forced Air Cooling details saved successfully.",
                          "Removal from Forced Air Cooling details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });

                      currentValue.seen = false;
                      currentValue.removalFromForcedAirCoolingSavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((err) => {
                  console.log(err);
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Cold Room Storage In") {
          if (
            currentValue.fruitFlowConfig.coldRoomStorageIn.airflowTemperature ==
              true ||
            currentValue.fruitFlowConfig.coldRoomStorageIn.airflowTemperature ==
              "true"
          ) {
            if (
              this.airflowTemperatureRHColdStorage == null ||
              this.airflowTemperatureRHColdStorage == "" ||
              this.airflowTemperatureRHColdStorage == undefined ||
              !this.airflowTemperatureRHColdStorage
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in airflow temperature",
                  "Please fill in airflow temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.coldRoomStorageIn.fruitTemperature ==
              true ||
            currentValue.fruitFlowConfig.coldRoomStorageIn.fruitTemperature ==
              "true"
          ) {
            if (
              this.fruitTemperatureColdStorage == null ||
              this.fruitTemperatureColdStorage == "" ||
              this.fruitTemperatureColdStorage == undefined ||
              !this.fruitTemperatureColdStorage
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in fruit temperature",
                  "Please fill in fruit temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.coldRoomStorageIn.storageTimeIn ==
              true ||
            currentValue.fruitFlowConfig.coldRoomStorageIn.storageTimeIn ==
              "true"
          ) {
            if (
              this.storageTimeIn == null ||
              this.storageTimeIn == "" ||
              !this.storageTimeIn.trim() ||
              this.storageTimeIn == undefined ||
              !this.storageTimeIn
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in storage time",
                  "Please fill in storage time"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.fruitTemperatureColdStorage != null &&
          //   this.airflowTemperatureRHColdStorage != null &&
          //   this.storageTimeIn != null &&
          //   this.storageTimeIn.trim() &&
          //   this.fruitTemperatureColdStorage != "" &&
          //   this.airflowTemperatureRHColdStorage != "" &&
          //   this.storageTimeIn != ""
          // ) {
          var inpData = {
            fruitTemperatureColdStorage:
              currentValue.fruitTemperatureColdStorage,
            airflowTemperatureRHColdStorage:
              currentValue.airflowTemperatureRHColdStorage,
            storageTimeIn: moment.utc().toString(),
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createColdRoomStorageInDetailsAPICall(
                  currentValue.selectedRow.Id,
                  inpData
                )
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Cold Room Storage In details saved successfully.",
                          "Cold Room Storage In details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });

                      currentValue.seen = false;
                      currentValue.coldRoomStorageInSavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  currentValue.erroMessage = error;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Cold Room Storage Out") {
          if (
            currentValue.fruitFlowConfig.coldRoomStorageOut.fruitTemperature ==
              true ||
            currentValue.fruitFlowConfig.coldRoomStorageOut.fruitTemperature ==
              "true"
          ) {
            if (
              this.fruitTemperatureColdStorageOut == null ||
              this.fruitTemperatureColdStorageOut == "" ||
              this.fruitTemperatureColdStorageOut == undefined ||
              !this.fruitTemperatureColdStorageOut
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in fruit temperature",
                  "Please fill in fruit temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.coldRoomStorageOut.storageTimeOut ==
              true ||
            currentValue.fruitFlowConfig.coldRoomStorageOut.storageTimeOut ==
              "true"
          ) {
            if (
              this.storageTimeOut == null ||
              this.storageTimeOut == "" ||
              !this.storageTimeOut.trim() ||
              this.storageTimeOut == undefined ||
              !this.storageTimeOut
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill in storage time out.",
                  "Please fill in storage time out."
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.fruitTemperatureColdStorageOut != null &&
          //   this.storageTimeOut != null &&
          //   this.storageTimeOut.trim() &&
          //   this.fruitTemperatureColdStorageOut != "" &&
          //   this.storageTimeOut != ""
          // ) {
          var timeofOut = new Date();
          var timeofIn = new Date(currentValue.storageTimeIn);
          var diff = timeofOut - timeofIn;
          if (
            (this.selectedRow.Produce.split(" ")[0] == "Pineapple" &&
              (this.fruitTemperatureColdStorageOut < 4 ||
                (this.airflowTemperatureRHColdStorage > 7 &&
                  diff > 10800000))) ||
            (this.selectedRow.Produce.split(" ")[0] == "Mango" &&
              this.airflowTemperatureRHColdStorage > 10 &&
              diff > 86400000) ||
            (this.selectedRow.Produce.split(" ")[0] == "Avocado" &&
              this.airflowTemperatureRHColdStorage > 4 &&
              diff > 43200000) ||
            diff > 604800000
          ) {
            this.isTemperatureExceed = true;
            this.$refs["confirm-warning-modal"].show();
            this.seen = false;
          } else {
            var inpData = {
              fruitTemperatureColdStorageOut:
                currentValue.fruitTemperatureColdStorageOut,
              storageTimeOut: moment.utc().toString(),
              updatedBy: localStorage.userName,
            };
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(currentValue.selectedRow.Id)
              .once("child_added", function (data) {
                currentValue
                  .createColdRoomStorageOutDetailsAPICall(
                    currentValue.selectedRow.Id,
                    inpData
                  )
                  .then((resolved) => {
                    console.log(resolved);
                    var ref = firebase
                      .database()
                      .ref("serviceRequest/" + data.key);
                    ref
                      .update(inpData)
                      .then(function () {
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Cold Room Storage Out details saved successfully.",
                            "Cold Room Storage Out details saved successfully."
                          ),
                          type: "success",
                          position: "top",
                        });

                        currentValue.seen = false;
                        currentValue.coldRoomStorageOutSavedFlag = true;
                      })
                      .catch(function (error) {
                        currentValue.erroMessage = error.message;
                        currentValue.seen = false;
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Error updating data to firebase.",
                            "Error updating data to firebase."
                          ),
                          position: "top",
                          type: "error",
                        });
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    currentValue.erroMessage = error;
                    currentValue.seen = false;
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Error updating data to corda blockchain.",
                        "Error updating data to corda blockchain."
                      ),
                      position: "top",
                      type: "error",
                    });
                  });
              });
          }
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Container Inspection") {
          currentValue.seen = true;
          if (
            currentValue.fruitFlowConfig.containerInspection.mandatory ==
              true ||
            currentValue.fruitFlowConfig.containerInspection.mandatory == "true"
          ) {
            if (
              !currentValue.containerInspectionfile ||
              currentValue.containerInspectionfile == null ||
              currentValue.containerInspectionfile == undefined
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please attach files",
                  "Please attach files"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (currentValue.containerInspectionfile) {
          if (
            currentValue.containerInspectionfile &&
            currentValue.containerInspectionfile.length > 0
          ) {
            currentValue.seen = true;
            this.uploadImage(
              currentValue.containerInspectionfile,
              currentValue.selectedStage,
              currentValue.selectedRow.Id,
              inpData,
              currentValue,
              "containerInspectionfile"
            );
          } else {
            currentValue.seen = false;
            Vue.$toast.open({
              message: currentValue.$t(
                "Please attach files",
                "Please attach files"
              ),
              type: "error",
              position: "top",
            });
          }

          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please upload the file.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Sampling") {
          if (
            currentValue.fruitFlowConfig.sampling.samplesTaken == true ||
            currentValue.fruitFlowConfig.sampling.samplesTaken == "true"
          ) {
            if (
              this.samplesTaken == null ||
              this.samplesTaken == "" ||
              !this.samplesTaken.trim() ||
              this.samplesTaken == undefined
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please enter samples taken",
                  "Please enter samples taken"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.sampling.temperature == true ||
            currentValue.fruitFlowConfig.sampling.temperature == "true"
          ) {
            if (
              this.samplingTemperature == null ||
              this.samplingTemperature == "" ||
              this.samplingTemperature == undefined ||
              !this.samplingTemperature
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please enter sampling temperature",
                  "Please enter sampling temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.sampling.timestamp == true ||
            currentValue.fruitFlowConfig.sampling.timestamp == "true"
          ) {
            if (
              this.dateAndTimeofSampling == null ||
              this.dateAndTimeofSampling == "" ||
              !this.dateAndTimeofSampling.trim() ||
              this.dateAndTimeofSampling == undefined ||
              !this.dateAndTimeofSampling
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please enter date and time of sampling",
                  "Please enter date and time of sampling"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.samplesTaken != null &&
          //   this.samplesTaken.trim() &&
          //   this.samplingTemperature != null &&
          //   this.dateAndTimeofSampling != null &&
          //   this.dateAndTimeofSampling.trim() &&
          //   this.samplesTaken != "" &&
          //   this.samplingTemperature != "" &&
          //   this.dateAndTimeofSampling != ""
          // ) {
          var inpData = {
            samplesTaken: currentValue.samplesTaken,
            samplingTemperature: currentValue.samplingTemperature,
            dateAndTimeofSampling: moment.utc().toString(),
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createSamplingDetailsAPICall(
                  currentValue.selectedRow.Id,
                  inpData
                )
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Sampling details saved successfully.",
                          "Sampling details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });

                      currentValue.seen = false;
                      currentValue.samplingSavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  currentValue.erroMessage = error.message;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Pre-Cooling Reefers") {
          if (
            currentValue.fruitFlowConfig.preCoolingReefers.mandatory == true ||
            currentValue.fruitFlowConfig.preCoolingReefers.mandatory == "true"
          ) {
            if (
              this.reeferWallTemperature == null ||
              this.reeferWallTemperature == "" ||
              this.reeferWallTemperature == undefined
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please enter reefer wall temperature",
                  "Please enter reefer wall temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.reeferWallTemperature != null &&
          //   this.reeferWallTemperature != ""
          // ) {
          var inpData = {
            reeferWallTemperature: currentValue.reeferWallTemperature,
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createPreCoolingReefersAPICall(
                  currentValue.selectedRow.Id,
                  inpData
                )
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Pre-Cooling Reefers details saved successfully.",
                          "Pre-Cooling Reefers details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });

                      currentValue.seen = false;
                      currentValue.preCoolingReeferSavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  currentValue.erroMessage = error;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Cold Tunnel Loading") {
          if (
            currentValue.fruitFlowConfig.coldTunnelLoading
              .destinationDateAndTime == true ||
            currentValue.fruitFlowConfig.coldTunnelLoading
              .destinationDateAndTime == "true"
          ) {
            if (
              this.destinationDateTimeColdTunnelLoading == null ||
              this.destinationDateTimeColdTunnelLoading == "" ||
              !this.destinationDateTimeColdTunnelLoading.trim() ||
              this.destinationDateTimeColdTunnelLoading == undefined ||
              !this.destinationDateTimeColdTunnelLoading
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please enter destination date and time",
                  "Please enter destination date and time"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.coldTunnelLoading
              .reeferWallTemperature == true ||
            currentValue.fruitFlowConfig.coldTunnelLoading
              .reeferWallTemperature == "true"
          ) {
            if (
              this.reeferWallTemperatureColdTunnelLoading == null ||
              this.reeferWallTemperatureColdTunnelLoading == "" ||
              this.reeferWallTemperatureColdTunnelLoading == undefined
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please enter refer wall temperature",
                  "Please enter refer wall temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (
          //   this.destinationDateTimeColdTunnelLoading != null &&
          //   this.destinationDateTimeColdTunnelLoading.trim() &&
          //   this.reeferWallTemperatureColdTunnelLoading != null &&
          //   this.destinationDateTimeColdTunnelLoading != "" &&
          //   this.reeferWallTemperatureColdTunnelLoading != ""
          // ) {
          var inpData = {
            destinationDateTimeColdTunnelLoading: moment.utc().toString(),
            reeferWallTemperatureColdTunnelLoading:
              currentValue.reeferWallTemperatureColdTunnelLoading,
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createColdTunnelLoadingDetailsAPICall(
                  currentValue.selectedRow.Id,
                  inpData
                )
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Cold Tunnel Loading details saved successfully.",
                          "Cold Tunnel Loading details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });

                      currentValue.seen = false;
                      currentValue.coldTunnelLoadingSavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  currentValue.erroMessage = error;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Shipping Details") {
          if (
            currentValue.fruitFlowConfig.shippingDetails.mandatory == true ||
            currentValue.fruitFlowConfig.shippingDetails.mandatory == "true"
          ) {
            if (
              this.shippingDetails == null ||
              this.shippingDetails == "" ||
              this.shippingDetails == undefined ||
              !this.shippingDetails
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please enter shipping details",
                  "Please enter shipping details"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          // if (this.shippingDetails != null && this.shippingDetails != "") {
          var inpData = {
            shippingDetails: {
              shippingMode: currentValue.shippingDetails,
              ratePerKg:
                currentValue.shippingDetails == "Shipment by Air (US$ 1.68/kg)"
                  ? currentValue.shipmentByAir
                  : currentValue.shipmentBySea,
            },
            updatedBy: localStorage.userName,
          };
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              currentValue
                .createShippingDetailsAPICall(
                  currentValue.selectedRow.Id,
                  inpData
                )
                .then((resolved) => {
                  console.log(resolved);
                  var ref = firebase
                    .database()
                    .ref("serviceRequest/" + data.key);
                  ref
                    .update(inpData)
                    .then(function () {
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Shipping Details saved successfully.",
                          "Shipping Details saved successfully."
                        ),
                        type: "success",
                        position: "top",
                      });

                      currentValue.seen = false;
                      currentValue.shippingSavedFlag = true;
                    })
                    .catch(function (error) {
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch((error) => {
                  console.log(error);
                  currentValue.erroMessage = error;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to corda blockchain.",
                      "Error updating data to corda blockchain."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            });
          // } else {
          //   currentValue.seen = false;
          //   Vue.$toast.open({
          //     message: "Please fill all the fields.",
          //     type: "error",
          //     position: "top"
          //   });
          // }
        }
        if (this.selectedStage == "Transport Details") {
          this.seen = true;
          if (
            currentValue.fruitFlowConfig.transportDetails.currency == true ||
            currentValue.fruitFlowConfig.transportDetails.currency == "true"
          ) {
            if (
              this.currency == null ||
              this.currency == "" ||
              this.currency == undefined ||
              !this.currency
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please select currency",
                  "Please select currency"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.transportDetails
              .departureDateAndTime == true ||
            currentValue.fruitFlowConfig.transportDetails
              .departureDateAndTime == "true"
          ) {
            if (
              this.departureDateTimeTransport == null ||
              this.departureDateTimeTransport == "" ||
              !this.departureDateTimeTransport.trim() ||
              this.departureDateTimeTransport == undefined ||
              !this.departureDateTimeTransport
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please enter departure date and time",
                  "Please enter departure date and time"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.transportDetails.destination == true ||
            currentValue.fruitFlowConfig.transportDetails.destination == "true"
          ) {
            if (
              this.destinationTransport == null ||
              this.destinationTransport == "" ||
              !this.destinationTransport.trim() ||
              this.destinationTransport == undefined ||
              !this.destinationTransport
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please enter destination",
                  "Please enter destination"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.transportDetails.temperature == true ||
            currentValue.fruitFlowConfig.transportDetails.temperature == "true"
          ) {
            if (
              this.transportTemperature == null ||
              this.transportTemperature == "" ||
              !this.transportTemperature.trim() ||
              this.transportTemperature == undefined
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please enter transport temperature",
                  "Please enter transport temperature"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.transportDetails.transportConditions ==
              true ||
            currentValue.fruitFlowConfig.transportDetails.transportConditions ==
              "true"
          ) {
            if (
              this.transportConditions == null ||
              this.transportConditions == "" ||
              !this.transportConditions.trim() ||
              this.transportConditions == undefined ||
              !this.transportConditions
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please enter transport conditions",
                  "Please enter transport conditions"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.fruitFlowConfig.transportDetails.transportCost ==
              true ||
            currentValue.fruitFlowConfig.transportDetails.transportCost ==
              "true"
          ) {
            if (
              this.transportCost == null ||
              this.transportCost == "" ||
              !this.transportCost.trim() ||
              this.transportCost == undefined
            ) {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please enter transport cost",
                  "Please enter transport cost"
                ),
                type: "error",
                position: "top",
              });
              return;
            }
          }
          if (
            currentValue.cartonFillingPalletizingSavedFlag != undefined &&
            currentValue.cartonFillingPalletizingSavedFlag != false &&
            currentValue.cartonFillingPalletizingSavedFlag != null &&
            currentValue.cartonFillingPalletizingSavedFlag != ""
          ) {
            if (
              currentValue.shippingDetails != null &&
              currentValue.shippingDetails != "" &&
              currentValue.shippingDetails != undefined
            ) {
              // if (
              //   this.departureDateTimeTransport != null &&
              //   this.departureDateTimeTransport.trim() &&
              //   this.transportTemperature != null &&
              //   this.destinationTransport != null &&
              //   this.destinationTransport.trim() &&
              //   this.transportConditions != null &&
              //   this.transportConditions.trim() &&
              //   this.currency != null &&
              //   this.currency != "" &&
              //   this.transportCost != null &&
              //   this.departureDateTimeTransport != "" &&
              //   this.transportTemperature != "" &&
              //   this.destinationTransport != "" &&
              //   this.transportConditions != "" &&
              //   this.transportCost != ""
              // ) {
              if (
                ((this.selectedRow.Produce.split(" ")[0] == "Pineapple" ||
                  this.selectedRow.Produce.split(" ")[0] == "Avocado") &&
                  (this.transportTemperature < 5 ||
                    this.transportTemperature > 24)) ||
                (this.selectedRow.Produce.split(" ")[0] == "Mango" &&
                  (this.transportTemperature < 10 ||
                    this.transportTemperature > 24))
              ) {
                this.isTemperatureExceed = true;
                this.$refs["confirm-warning-modal"].show();
                this.seen = false;
              } else {
                var isPenalityApplied = 0;
                // var noOfBoxesExpected =
                //   Number(currentValue.selectedRow.FruitExpected) / 10;
                var noOfBoxesExpected =
                  (Number(currentValue.fruitsAccepted) -
                    Number(currentValue.weightofRemovedFruit)) /
                  10;
                // let splittingFactor = 0;
                // for (let i = 0; i < currentValue.startQRCodeBoxes.length; i++) {
                //   if (
                //     currentValue.startQRCodeBoxes.charAt(i) ==
                //     currentValue.endQRCodeBoxes.charAt(i)
                //   ) {
                //     splittingFactor++;
                //   } else {
                //     break;
                //   }
                // }
                // let startBox = Number(
                //   currentValue.startQRCodeBoxes.substring(
                //     splittingFactor,
                //     currentValue.startQRCodeBoxes.length
                //   )
                // );
                // let endBox = Number(
                //   currentValue.endQRCodeBoxes.substring(
                //     splittingFactor,
                //     currentValue.endQRCodeBoxes.length
                //   )
                // );
                // // var noOfBoxesArrived = Number(endBox - startBox);
                // var noOfBoxesArrived = 0;
                // for (var inc = startBox; inc <= endBox; inc++) {
                //   noOfBoxesArrived++;
                // }

                // Number(currentValue.endQRCodeBoxes) -
                // Number(currentValue.startQRCodeBoxes);
                var penalityAmount = null;
                if (currentValue.globalTotalBoxes < noOfBoxesExpected) {
                  if (
                    currentValue.selectedRow.Produce.split(" ")[0] == "Mango"
                  ) {
                    penalityAmount =
                      2 *
                      1.45 *
                      4.5 *
                      (Number(noOfBoxesExpected) -
                        Number(currentValue.globalTotalBoxes));
                    currentValue.lossOfBox =
                      Number(noOfBoxesExpected) -
                      Number(currentValue.globalTotalBoxes);
                    // Vue.$toast.open({
                    //   message:
                    //     "Warning: There is a loss of " +
                    //     (Number(noOfBoxesExpected) -
                    //       Number(currentValue.globalTotalBoxes)) +
                    //     " boxes at packhouse, penalty of " +
                    //     penalityAmount +
                    //     " USD levied.",
                    //   type: "warning",
                    //   position: "bottom",
                    //   duration: 8000,
                    // });
                  } else if (
                    currentValue.selectedRow.Produce.split(" ")[0] == "Avocado"
                  ) {
                    penalityAmount =
                      2 *
                      1.45 *
                      5 *
                      (Number(noOfBoxesExpected) -
                        Number(currentValue.globalTotalBoxes));
                    currentValue.lossOfBox =
                      Number(noOfBoxesExpected) -
                      Number(currentValue.globalTotalBoxes);
                    // Vue.$toast.open({
                    //   message:
                    //     "Warning: There is a loss of " +
                    //     (Number(noOfBoxesExpected) -
                    //       Number(currentValue.globalTotalBoxes)) +
                    //     " boxes at packhouse, penalty of " +
                    //     penalityAmount +
                    //     " USD levied.",
                    //   type: "warning",
                    //   position: "bottom",
                    //   duration: 8000,
                    // });
                  } else {
                    penalityAmount =
                      2 *
                      1.45 *
                      12.25 *
                      (Number(noOfBoxesExpected) -
                        Number(currentValue.globalTotalBoxes));
                    currentValue.lossOfBox =
                      Number(noOfBoxesExpected) -
                      Number(currentValue.globalTotalBoxes);
                    // Vue.$toast.open({
                    //   message:
                    //     "Warning: There is a loss of " +
                    //     (
                    //       Number(noOfBoxesExpected) -
                    //       Number(currentValue.globalTotalBoxes)
                    //     ).toFixed(0) +
                    //     " boxes at packhouse, penalty of " +
                    //     penalityAmount +
                    //     " USD levied.",
                    //   type: "warning",
                    //   position: "bottom",
                    //   duration: 8000,
                    // });
                  }
                }
                var inpData = {
                  departureDateTimeTransport: moment.utc().toString(),
                  transportTemperature: currentValue.transportTemperature,
                  destinationTransport: currentValue.destinationTransport,
                  transportConditions: currentValue.transportConditions,
                  // transportCost: currentValue.transportCost,
                  transportCost: 0,
                  SOPFile: currentValue.SOPFile,
                  // transportCurrency: currentValue.currency,
                  transportCurrency: "HTG",
                  status: "Packing Completed",
                  fruitFlowCompletedOn: moment.utc().toString(),
                  penalityAmount: penalityAmount,
                  lossOfBox: currentValue.lossOfBox || 0,
                  updatedBy: localStorage.userName,
                };
                if (currentValue.checkStageValidations()) {
                  dbRef
                    .orderByChild("serviceRequestId")
                    .equalTo(currentValue.selectedRow.Id)
                    .once("child_added", function (data) {
                      currentValue
                        .createTransportDetailsAPICall(
                          currentValue.selectedRow.Id,
                          inpData
                        )
                        .then((resolved) => {
                          console.log(resolved);
                          var ref = firebase
                            .database()
                            .ref("serviceRequest/" + data.key);
                          ref
                            .update(inpData)
                            .then(function () {
                              if (currentValue.SOPFile) {
                                currentValue.uploadImage(
                                  currentValue.SOPFile,
                                  currentValue.selectedStage,
                                  currentValue.selectedRow.Id,
                                  inpData,
                                  currentValue,
                                  "SOPFile"
                                );
                              } else {
                                currentValue.seen = false;

                                Vue.$toast.open({
                                  message: currentValue.$t(
                                    "Transport Details saved successfully.",
                                    "Transport Details saved successfully."
                                  ),
                                  type: "success",
                                  position: "top",
                                });
                                //close pickup modal
                                currentValue.getPickupList();
                                currentValue.$refs["pickup-modal"].hide();

                                currentValue.transportSavedFlag = true;
                                let _data = {
                                  ArrivedAtPackhouseAddedOn:
                                    currentValue.apiData
                                      .ArrivedAtPackhouseAddedOn,
                                  airflowTemperatureRH:
                                    currentValue.airflowTemperatureRHAPI,
                                  airflowTemperatureRHColdStorage:
                                    currentValue.airflowTemperatureRHColdStorageAPI,
                                  ambientTemp: currentValue.ambientTempAPI,
                                  ambienttemperaturePacked:
                                    currentValue.ambienttemperaturePackedAPI,
                                  arrivedAtPackhouseAddedOn:
                                    currentValue.apiData
                                      .arrivedAtPackhouseAddedOn,
                                  arrivedAtPackhouseAdditionalNote:
                                    currentValue.apiData
                                      .arrivedAtPackhouseAdditionalNote,
                                  boxes: currentValue.globalTotalBoxes,
                                  lossOfBox: currentValue.lossOfBox,
                                  internalFruitTemp:
                                    currentValue.internalFruitTemp,
                                  temperatureTransfer:
                                    currentValue.temperatureTransfer,
                                  temperatureRemoval:
                                    currentValue.temperatureRemoval,
                                  internalFruitTemperaturePacked:
                                    currentValue.internalFruitTemperaturePacked,
                                  isTemepertaureBreach:
                                    currentValue.isTemepertaureBreach,
                                  temperatureBreachCount:
                                    currentValue.temperatureBreachCount,
                                  requestCompletedOn: moment.utc().toString(),
                                };
                                if (
                                  currentValue.temperatureBreachCount > 0 ||
                                  currentValue.lossOfBox > 0
                                ) {
                                  _data.penalties = [];
                                }
                                if (currentValue.temperatureBreachCount > 0) {
                                  _data.penalties.push({
                                    type: "PH_TEMP_BREACH",
                                    temperature_breach_count:
                                      currentValue.temperatureBreachCount,
                                    fruits_amount: Number(
                                      currentValue.selectedRow.FruitExpected
                                    ),
                                    boxes_amount: currentValue.lossOfBox,
                                  });
                                }
                                if (currentValue.lossOfBox > 0) {
                                  _data.penalties.push({
                                    type: "PH_DELIVERY_LOSS",
                                    boxes_amount: currentValue.lossOfBox,
                                    fruits_amount:
                                      Number(currentValue.lossOfBox) * 10,
                                    // temperature_breach_count:
                                    //   currentValue.temperatureBreachCount
                                  });
                                }
                                // currentValue.axios
                                //   .post(
                                //     "${getConfigVars().BASE_URL}/api/v1/corda/chain/packhouse-process/accept",
                                //     {
                                //       lotId: currentValue.selectedRow.Id,
                                //       data: _data
                                //     }
                                //   )
                                //   .then(function(response) {
                                //     currentValue.getPickupList();
                                //     currentValue.$refs["pickup-modal"].hide();
                                //     console.log(
                                //       "packhouse-process accepted api success"
                                //     );
                                //   })
                                //   .catch(function(error) {
                                //     currentValue.getPickupList();
                                //     currentValue.$refs["pickup-modal"].hide();
                                //     console.log(
                                //       "packhouse-process accepted api error"
                                //     );
                                //     currentValue.seen = false;
                                //     currentValue.erroMessage = error.message;
                                //   });
                              }
                            })
                            .catch(function (error) {
                              Vue.$toast.open({
                                message: error.message,
                                type: "error",
                                position: "top",
                              });
                              //close pickup-modal
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
                          //close pickup-modal
                          currentValue.seen = false;
                        });
                    });
                } else {
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Please complete previous stages to update Transport Details.",
                      "Please complete previous stages to update Transport Details."
                    ),
                    position: "top",
                    type: "error",
                  });
                }
              }
              // } else {
              //   currentValue.seen = false;
              //   Vue.$toast.open({
              //     message: "Please fill all the fields.",
              //     type: "error",
              //     position: "top"
              //   });
              // }
            } else {
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Please fill Shipping Details.",
                  "Please fill Shipping Details."
                ),
                type: "error",
                position: "top",
              });
            }
          } else {
            currentValue.seen = false;
            Vue.$toast.open({
              message: currentValue.$t(
                "Please fill Carton Filling Details.",
                "Please fill Carton Filling Details."
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

    updateModal: function () {
      let currentVal = this;
      //currentVal.palletsQRCodeFiles = [];
      currentVal.containerInspectionImgs = [];
      currentVal.boxesQRCodeFiles = [];
      currentVal.fruitsQRCodeFiles = [];
      currentVal.transposrtDetailFiles = [];
      currentVal.unloadCertificateFiles = [];
      currentVal.file = [];
      currentVal.temperatureMeasurementFileURL = null;
      currentVal.temperatureMeasurementFileName = null;
      currentVal.isTemperatureFile = false;
      currentVal.fruitsQRCodes = [];
      currentVal.boxesQRCodes = [];
      currentVal.cartonFillingAndPalletizingFirebaseArray = [];

      currentVal.getBoxQrCodes(currentVal.selectedRow.Id);
      currentVal.getFruitQrCodes(currentVal.selectedRow.Id);
      var ref = firebase.database().ref().child("serviceRequest");
      ref.on("value", (snapshot) => {
        snapshot.forEach((requestData) => {
          if (requestData.val().serviceRequestId == this.selectedRow.Id) {
            this.selectedFruit = requestData.val().product;
            this.selectedFruitTotalCount = Number(
              requestData.val().fruitsHarvested -
                requestData.val().fruitRejected
            );
          }
        });
      });
      var dbRef = firebase.database().ref("serviceRequest/");
      dbRef
        .orderByChild("serviceRequestId")
        .equalTo(currentVal.selectedRow.Id)
        .on("child_added", function (data) {
          var snapshotKey = data.key;
          currentVal.larvaeTesting = data.val().larvaTesting;
          const { isTemepertaureBreach, temperatureBreachCount, lossOfBox } =
            data.val();
          currentVal.isTemepertaureBreach = isTemepertaureBreach
            ? isTemepertaureBreach
            : false;
          currentVal.temperatureBreachCount = temperatureBreachCount
            ? temperatureBreachCount
            : 0;
          currentVal.lossOfBox = lossOfBox ? lossOfBox : 0;
          if (
            currentVal.larvaeTesting != null &&
            currentVal.larvaeTesting != undefined
          ) {
            currentVal.larvaeSavedFlag = true;
          } else {
            currentVal.larvaeSavedFlag = false;
          }
          currentVal.internalFruitTemp = data.val().internalFruitTemp;
          currentVal.ambientTemp = data.val().ambientTemp;
          currentVal.ambientTempAPI = data.val().ambientTemp;
          if (
            currentVal.internalFruitTemp != null &&
            currentVal.internalFruitTemp != undefined &&
            currentVal.ambientTemp != null &&
            currentVal.ambientTemp != undefined
          ) {
            currentVal.temperatureMeasurementSavedFlag = true;
          } else {
            currentVal.temperatureMeasurementSavedFlag = false;
          }
          currentVal.fruitsAccepted = data.val().fruitsAccepted;
          currentVal.fruitsRejected = data.val().fruitsRejected;
          currentVal.qualityInspectionResults =
            data.val().qualityInspectionResults;
          if (
            currentVal.fruitsAccepted != null &&
            currentVal.fruitsAccepted != undefined &&
            currentVal.fruitsRejected != null &&
            currentVal.fruitsRejected != undefined &&
            currentVal.qualityInspectionResults != null &&
            currentVal.qualityInspectionResults != undefined
          ) {
            currentVal.qualityInspectionSavedFlag = true;
          } else {
            currentVal.qualityInspectionSavedFlag = false;
          }
          currentVal.waterTemperature = data.val().waterTemperature;
          currentVal.phLevel = data.val().phLevel;
          currentVal.chlorineLevel = data.val().chlorineLevel;
          if (
            currentVal.waterTemperature != null &&
            currentVal.waterTemperature != undefined &&
            currentVal.phLevel != null &&
            currentVal.phLevel != undefined &&
            currentVal.chlorineLevel != null &&
            currentVal.chlorineLevel != undefined
          ) {
            currentVal.fruitWashingSavedFlag = true;
          } else {
            currentVal.fruitWashingSavedFlag = false;
          }
          currentVal.temperatureTransfer = data.val().temperatureTransfer;
          if (
            data.val().coldStorageTimeIn != undefined &&
            data.val().coldStorageTimeIn != null &&
            data.val().coldStorageTimeIn != ""
          ) {
            currentVal.coldStorageTimeIn = moment
              .utc(data.val().coldStorageTimeIn)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }

          if (
            currentVal.temperatureTransfer != null &&
            currentVal.temperatureTransfer != undefined &&
            currentVal.coldStorageTimeIn != null &&
            currentVal.coldStorageTimeIn != undefined
          ) {
            currentVal.tranferColdStorageSavedFlag = true;
          } else {
            currentVal.tranferColdStorageSavedFlag = false;
          }
          currentVal.temperatureRemoval = data.val().temperatureRemoval;
          if (
            data.val().coldStorageTimeOut != undefined &&
            data.val().coldStorageTimeOut != null &&
            data.val().coldStorageTimeOut != ""
          ) {
            currentVal.coldStorageTimeOut = moment
              .utc(data.val().coldStorageTimeOut)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }
          if (
            currentVal.temperatureRemoval != null &&
            currentVal.temperatureRemoval != undefined &&
            currentVal.coldStorageTimeOut != null &&
            currentVal.coldStorageTimeOut != undefined
          ) {
            currentVal.removalColdStorageSavedFlag = true;
          } else {
            currentVal.removalColdStorageSavedFlag = false;
          }
          if (
            data.val().packingLineTimeofEntry != undefined &&
            data.val().packingLineTimeofEntry != null &&
            data.val().packingLineTimeofEntry != ""
          ) {
            currentVal.packingLineTimeofEntry = moment
              .utc(data.val().packingLineTimeofEntry)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }
          if (
            data.val().packingLineTimeofEntry != null &&
            data.val().packingLineTimeofEntry != undefined
          ) {
            currentVal.feedPackingLineConveyorBeltSavedFlag = true;
          } else {
            currentVal.feedPackingLineConveyorBeltSavedFlag = false;
          }
          currentVal.gradingResults = data.val().gradingResults;
          currentVal.weightofRemovedFruit = data.val().weightofRemovedFruit;
          if (
            currentVal.gradingResults != null &&
            currentVal.gradingResults != undefined &&
            currentVal.weightofRemovedFruit != null &&
            currentVal.weightofRemovedFruit != undefined
          ) {
            currentVal.gradingSavedFlag = true;
          } else {
            currentVal.gradingSavedFlag = false;
          }

          currentVal.secondSizingResults = data.val().secondSizingResults;
          if (
            currentVal.secondSizingResults != null &&
            currentVal.secondSizingResults != undefined &&
            currentVal.secondSizingResults != ""
          ) {
            currentVal.secondSizingSavedFlag = true;
          } else {
            currentVal.secondSizingSavedFlag = false;
          }
          const temp = data.val();
          console.log(temp);
          currentVal.fruitsQRCodesfile = data.val().fruitsQRCodesfile;
          currentVal.boxesQRCodesfile = data.val().boxesQRCodesfile;
          //currentVal.palletsQRCodesFile = data.val().palletsQRCodesFile;
          // currentVal.startQRCodePallets = data.val().startQRCodePallets;
          //   currentVal.endQRCodePallets = data.val().endQRCodePallets;

          // @TODO get the array list and fetch out the date and then bind it

          currentVal.startQRCodeBoxes = data.val().startQRCodeBoxes;
          currentVal.boxCount = currentVal.boxQrCodes.length;
          currentVal.fruitsCount = currentVal.fruitsQRCodes.length;
          // currentVal.palletQRCodes = data.val().palletQRCodes || [];
          //   currentVal.boxQrCodes = data.val().boxQrCodes || [];
          //  currentVal.fruitsQRCodes = data.val().fruitsQRCodes || [];
          (currentVal.endQRCodeBoxes = data.val().endQRCodeBoxes),
            (currentVal.startQRCodeFruits = data.val().startQRCodeFruits);
          currentVal.endQRCodeFruits = data.val().endQRCodeFruits;
          if (
            //currentVal.startQRCodePallets != null &&
            // currentVal.startQRCodePallets != undefined &&
            //currentVal.endQRCodePallets != null &&
            //currentVal.endQRCodePallets != undefined &&
            // currentVal.startQRCodeBoxes != null &&
            // currentVal.endQRCodePallets != undefined &&
            // currentVal.endQRCodeBoxes != null &&
            // currentVal.endQRCodeBoxes != undefined &&
            // currentVal.startQRCodeFruits != null &&
            // currentVal.startQRCodeFruits != undefined &&
            // currentVal.endQRCodeFruits != null &&
            // currentVal.endQRCodeFruits != undefined
            temp.cartonFillingAndPalletizingData != undefined &&
            temp.cartonFillingAndPalletizingData.length != 0 &&
            temp.cartonFillingAndPalletizingData != null
          ) {
            currentVal.cartonFillingPalletizingSavedFlag = true;
          } else {
            currentVal.cartonFillingPalletizingSavedFlag = false;
          }
          currentVal.ambienttemperaturePacked =
            data.val().ambienttemperaturePacked;
          currentVal.ambienttemperaturePackedAPI =
            data.val().ambienttemperaturePacked;
          currentVal.internalFruitTemperaturePacked =
            data.val().internalFruitTemperaturePacked;

          if (
            currentVal.ambienttemperaturePacked != null &&
            currentVal.ambienttemperaturePacked != undefined &&
            currentVal.internalFruitTemperaturePacked != null &&
            currentVal.internalFruitTemperaturePacked != undefined
          ) {
            currentVal.temperatureReadingPackedLotSavedFlag = true;
          } else {
            currentVal.temperatureReadingPackedLotSavedFlag = false;
          }
          if (
            data.val().entryTimeForcedCooling != undefined &&
            data.val().entryTimeForcedCooling != null &&
            data.val().entryTimeForcedCooling != ""
          ) {
            currentVal.entryTimeForcedCooling = moment
              .utc(data.val().entryTimeForcedCooling)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }
          currentVal.fruitTemperatureEntryForcedCooling =
            data.val().fruitTemperatureEntryForcedCooling;
          currentVal.airflowTemperatureRH = data.val().airflowTemperatureRH;
          currentVal.airflowTemperatureRHAPI = data.val().airflowTemperatureRH;
          if (
            data.val().removalTimeForcedCooling != undefined &&
            data.val().removalTimeForcedCooling != null &&
            data.val().removalTimeForcedCooling != ""
          ) {
            currentVal.removalTimeForcedCooling = moment
              .utc(data.val().removalTimeForcedCooling)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }
          currentVal.fruitTemperatureRemovalForcedCooling =
            data.val().fruitTemperatureRemovalForcedCooling;

          if (
            currentVal.entryTimeForcedCooling != null &&
            currentVal.entryTimeForcedCooling != undefined &&
            currentVal.fruitTemperatureEntryForcedCooling != null &&
            currentVal.fruitTemperatureEntryForcedCooling != undefined &&
            currentVal.airflowTemperatureRH != null &&
            currentVal.airflowTemperatureRH != undefined &&
            currentVal.airflowTemperatureRH != null &&
            currentVal.airflowTemperatureRH != undefined
          ) {
            currentVal.forcedAirCoolingEntrySavedFlag = true;
          } else {
            currentVal.forcedAirCoolingEntrySavedFlag = false;
          }
          if (
            currentVal.removalTimeForcedCooling != null &&
            currentVal.removalTimeForcedCooling != undefined &&
            currentVal.fruitTemperatureRemovalForcedCooling != null &&
            currentVal.fruitTemperatureRemovalForcedCooling != undefined
          ) {
            currentVal.removalFromForcedAirCoolingSavedFlag = true;
          } else {
            currentVal.removalFromForcedAirCoolingSavedFlag = false;
          }
          currentVal.fruitTemperatureColdStorage =
            data.val().fruitTemperatureColdStorage;
          currentVal.fruitTemperatureColdStorageOut =
            data.val().fruitTemperatureColdStorageOut;
          currentVal.airflowTemperatureRHColdStorage =
            data.val().airflowTemperatureRHColdStorage;
          currentVal.airflowTemperatureRHColdStorageAPI =
            data.val().airflowTemperatureRHColdStorage;
          if (
            data.val().storageTimeIn != undefined &&
            data.val().storageTimeIn != null &&
            data.val().storageTimeIn != ""
          ) {
            currentVal.storageTimeIn = moment
              .utc(data.val().storageTimeIn)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }
          if (
            data.val().storageTimeOut != undefined &&
            data.val().storageTimeOut != null &&
            data.val().storageTimeOut != ""
          ) {
            currentVal.storageTimeOut = moment
              .utc(data.val().storageTimeOut)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }

          if (
            currentVal.fruitTemperatureColdStorage != null &&
            currentVal.fruitTemperatureColdStorage != undefined &&
            currentVal.airflowTemperatureRHColdStorage != null &&
            currentVal.airflowTemperatureRHColdStorage != undefined &&
            currentVal.storageTimeIn != null &&
            currentVal.storageTimeIn != undefined &&
            currentVal.storageTimeOut != null &&
            currentVal.storageTimeOut != undefined
          ) {
            currentVal.coldRoomStorageInSavedFlag = true;
          } else {
            currentVal.coldRoomStorageInSavedFlag = false;
          }
          if (
            currentVal.fruitTemperatureColdStorageOut != null &&
            currentVal.fruitTemperatureColdStorageOut != undefined &&
            currentVal.storageTimeOut != null &&
            currentVal.storageTimeOut != undefined
          ) {
            currentVal.coldRoomStorageOutSavedFlag = true;
          } else {
            currentVal.coldRoomStorageOutSavedFlag = false;
          }
          currentVal.containerInspectionfile =
            data.val().containerInspectionImg;
          if (
            currentVal.containerInspectionfile != null &&
            currentVal.containerInspectionfile != undefined
          ) {
            currentVal.containerInspectionSavedFlag = true;
          } else {
            currentVal.containerInspectionSavedFlag = false;
          }
          currentVal.samplesTaken = data.val().samplesTaken;
          currentVal.samplingTemperature = data.val().samplingTemperature;
          if (
            data.val().dateAndTimeofSampling != undefined &&
            data.val().dateAndTimeofSampling != null &&
            data.val().dateAndTimeofSampling != ""
          ) {
            currentVal.dateAndTimeofSampling = moment
              .utc(data.val().dateAndTimeofSampling)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }
          if (
            currentVal.samplesTaken != null &&
            currentVal.samplesTaken != undefined &&
            currentVal.samplingTemperature != null &&
            currentVal.samplingTemperature != undefined &&
            currentVal.dateAndTimeofSampling != null &&
            currentVal.dateAndTimeofSampling != undefined
          ) {
            currentVal.samplingSavedFlag = true;
          } else {
            currentVal.samplingSavedFlag = false;
          }
          currentVal.reeferWallTemperature = data.val().reeferWallTemperature;
          if (
            currentVal.reeferWallTemperature != null &&
            currentVal.reeferWallTemperature != undefined
          ) {
            currentVal.preCoolingReeferSavedFlag = true;
          } else {
            currentVal.preCoolingReeferSavedFlag = false;
          }
          if (
            data.val().destinationDateTimeColdTunnelLoading != undefined &&
            data.val().destinationDateTimeColdTunnelLoading != null &&
            data.val().destinationDateTimeColdTunnelLoading != ""
          ) {
            currentVal.destinationDateTimeColdTunnelLoading = moment
              .utc(data.val().destinationDateTimeColdTunnelLoading)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }
          currentVal.reeferWallTemperatureColdTunnelLoading =
            data.val().reeferWallTemperatureColdTunnelLoading;
          if (
            currentVal.destinationDateTimeColdTunnelLoading != null &&
            currentVal.destinationDateTimeColdTunnelLoading != undefined &&
            currentVal.reeferWallTemperatureColdTunnelLoading != null &&
            currentVal.reeferWallTemperatureColdTunnelLoading != undefined
          ) {
            currentVal.coldTunnelLoadingSavedFlag = true;
          } else {
            currentVal.coldTunnelLoadingSavedFlag = false;
          }
          currentVal.shippingDetails = (function () {
            if (data.val().shippingDetails) {
              return data.val().shippingDetails.shippingMode;
            } else {
              return null;
            }
          })();
          if (
            currentVal.shippingDetails != null &&
            currentVal.shippingDetails != undefined
          ) {
            currentVal.shippingSavedFlag = true;
          } else {
            currentVal.shippingSavedFlag = false;
          }
          if (
            data.val().departureDateTimeTransport != undefined &&
            data.val().departureDateTimeTransport != null &&
            data.val().departureDateTimeTransport != ""
          ) {
            currentVal.departureDateTimeTransport = moment
              .utc(data.val().departureDateTimeTransport)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }
          currentVal.transportTemperature = data.val().transportTemperature;
          currentVal.destinationTransport = data.val().destinationTransport;
          currentVal.transportConditions = data.val().transportConditions;
          currentVal.transportCost = data.val().transportCost;
          if (
            currentVal.departureDateTimeTransport != null &&
            currentVal.departureDateTimeTransport != undefined &&
            currentVal.transportTemperature != null &&
            currentVal.transportTemperature != undefined &&
            currentVal.transportConditions != null &&
            currentVal.transportConditions != undefined &&
            currentVal.destinationTransport != null &&
            currentVal.destinationTransport != undefined &&
            currentVal.transportCost != null &&
            currentVal.transportCost != undefined
          ) {
            currentVal.transportSavedFlag = true;
          } else {
            currentVal.transportSavedFlag = false;
          }
          if (
            data.val().dateTimeCleaningTrimming != undefined &&
            data.val().dateTimeCleaningTrimming != null &&
            data.val().dateTimeCleaningTrimming != ""
          ) {
            currentVal.dateTimeCleaningTrimming = moment
              .utc(data.val().dateTimeCleaningTrimming)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }
          if (
            currentVal.dateTimeCleaningTrimming != null &&
            currentVal.dateTimeCleaningTrimming != undefined
          ) {
            currentVal.cleaningTrimmingSavedFlag = true;
          } else {
            currentVal.cleaningTrimmingSavedFlag = false;
          }
          currentVal.firstSizingResults = data.val().firstSizingResults;
          if (
            currentVal.firstSizingResults != null &&
            currentVal.firstSizingResults != undefined
          ) {
            currentVal.firstSizingSavedFlag = true;
          } else {
            currentVal.firstSizingSavedFlag = false;
          }
          if (
            data.val().timeofEntryHotWaterTreatment != undefined &&
            data.val().timeofEntryHotWaterTreatment != null &&
            data.val().timeofEntryHotWaterTreatment != ""
          ) {
            currentVal.timeofEntryHotWaterTreatment = moment
              .utc(data.val().timeofEntryHotWaterTreatment)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }
          currentVal.waterTemperatureHotWaterTreatment =
            data.val().waterTemperatureHotWaterTreatment;
          currentVal.phLevelHotWaterTreatment =
            data.val().phLevelHotWaterTreatment;
          currentVal.chlorineLevelHotWaterTreatment =
            data.val().chlorineLevelHotWaterTreatment;
          currentVal.durationHotWaterTreatment =
            data.val().durationHotWaterTreatment;
          if (
            data.val().timeofExitHotWaterTreatment != undefined &&
            data.val().timeofExitHotWaterTreatment != null &&
            data.val().timeofExitHotWaterTreatment != ""
          ) {
            currentVal.timeofExitHotWaterTreatment = moment
              .utc(data.val().timeofExitHotWaterTreatment)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }
          if (
            currentVal.timeofEntryHotWaterTreatment != null &&
            currentVal.timeofEntryHotWaterTreatment != undefined &&
            currentVal.waterTemperatureHotWaterTreatment != null &&
            currentVal.waterTemperatureHotWaterTreatment != undefined &&
            currentVal.phLevelHotWaterTreatment != null &&
            currentVal.phLevelHotWaterTreatment != undefined &&
            currentVal.chlorineLevelHotWaterTreatment != null &&
            currentVal.chlorineLevelHotWaterTreatment != undefined
          ) {
            currentVal.hotWaterTreatmentEntrySavedFlag = true;
          } else {
            currentVal.hotWaterTreatmentEntrySavedFlag = false;
          }
          if (
            currentVal.durationHotWaterTreatment != null &&
            currentVal.durationHotWaterTreatment != undefined &&
            currentVal.timeofExitHotWaterTreatment != null &&
            currentVal.timeofExitHotWaterTreatment != undefined
          ) {
            currentVal.hotWaterTreatmentExitSavedFlag = true;
          } else {
            currentVal.hotWaterTreatmentExitSavedFlag = false;
          }
          if (
            data.val().timeofEntryHydroCooling != undefined &&
            data.val().timeofEntryHydroCooling != null &&
            data.val().timeofEntryHydroCooling != ""
          ) {
            currentVal.timeofEntryHydroCooling = moment
              .utc(data.val().timeofEntryHydroCooling)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }
          currentVal.waterTemperatureHydroCooling =
            data.val().waterTemperatureHydroCooling;
          currentVal.phLevelHydroCooling = data.val().phLevelHydroCooling;
          currentVal.chlorineLevelHydroCooling =
            data.val().chlorineLevelHydroCooling;
          currentVal.durationHydroCooling = data.val().durationHydroCooling;
          if (
            data.val().timeofExitHydroCooling != undefined &&
            data.val().timeofExitHydroCooling != null &&
            data.val().timeofExitHydroCooling != ""
          ) {
            currentVal.timeofExitHydroCooling = moment
              .utc(data.val().timeofExitHydroCooling)
              .local()
              .format("MMM DD, YYYY hh:mm A");
          }
          currentVal.internalFruitTempHydroCooling =
            data.val().internalFruitTempHydroCooling;
          if (
            currentVal.timeofEntryHydroCooling != null &&
            currentVal.timeofEntryHydroCooling != undefined &&
            currentVal.waterTemperatureHydroCooling != null &&
            currentVal.waterTemperatureHydroCooling != undefined &&
            currentVal.phLevelHydroCooling != null &&
            currentVal.phLevelHydroCooling != undefined &&
            currentVal.chlorineLevelHydroCooling != null &&
            currentVal.chlorineLevelHydroCooling != undefined
          ) {
            currentVal.hydroCoolingEntrySavedFlag = true;
          } else {
            currentVal.hydroCoolingEntrySavedFlag = false;
          }
          if (
            currentVal.durationHydroCooling != null &&
            currentVal.durationHydroCooling != undefined &&
            currentVal.timeofExitHydroCooling != null &&
            currentVal.timeofExitHydroCooling != undefined &&
            currentVal.internalFruitTempHydroCooling != null &&
            currentVal.internalFruitTempHydroCooling != undefined
          ) {
            currentVal.hydroCoolingExitSavedFlag = true;
          } else {
            currentVal.hydroCoolingExitSavedFlag = false;
          }
          if (data.val().containerInspectionImg != undefined) {
            var containerref = firebase
              .database()
              .ref()
              .child("serviceRequest")
              .child(snapshotKey)
              .child("containerInspectionImg");

            containerref.on("child_added", function (snapshot) {
              //working
              var isImageFile = false;
              if (
                snapshot.val().containerInspectionImgFileName.split(".")[1] ==
                  "png" ||
                snapshot.val().containerInspectionImgFileName.split(".")[1] ==
                  "jpg" ||
                snapshot.val().containerInspectionImgFileName.split(".")[1] ==
                  "jpeg"
              ) {
                isImageFile = true;
              } else {
                isImageFile = false;
              }
              currentVal.containerInspectionImgs.push({
                containerInspectionImgFileName:
                  snapshot.val().containerInspectionImgFileName,
                containerInspectionImgFileURL:
                  snapshot.val().containerInspectionImgFileURL,
                isImage: isImageFile,
              });
            });
            currentVal.isContainerInspection = true;
            // console.log(currentVal.containerInspectionImgs);
          }

          if (data.val().boxesQRCodes != undefined) {
            var containerref = firebase
              .database()
              .ref()
              .child("serviceRequest")
              .child(snapshotKey)
              .child("boxesQRCodes");

            containerref.on("child_added", function (snapshot) {
              currentVal.boxesQRCodeFiles.push({
                boxesQRCodesFileName: snapshot.val().boxesQRCodesFileName,
                boxesQRCodesFilePath: snapshot.val().boxesQRCodesFilePath,
              });
            });
            currentVal.isBoxesQrCodes = true;
          }

          if (data.val().fruitsQRCodes != undefined) {
            var containerref = firebase
              .database()
              .ref()
              .child("serviceRequest")
              .child(snapshotKey)
              .child("fruitsQRCodes");

            containerref.on("child_added", function (snapshot) {
              currentVal.fruitsQRCodeFiles.push({
                fruitsQRCodesFileName: snapshot.val().fruitsQRCodesFileName,
                fruitsQRCodesFilePath: snapshot.val().fruitsQRCodesFilePath,
              });
            });
            currentVal.isFruitsQrCodes = true;
          }

          // if (data.val().palletsQRCodes != undefined) {
          //   var containerref = firebase
          //     .database()
          //     .ref()
          //     .child("serviceRequest")
          //     .child(snapshotKey)
          //     .child("palletsQRCodes");

          //   containerref.on("child_added", function(snapshot) {
          //     currentVal.palletsQRCodeFiles.push({
          //       palletsQRCodesFileName: snapshot.val().palletsQRCodesFileName,
          //       palletsQRCodesFilePath: snapshot.val().palletsQRCodesFilePath
          //     });
          //   });
          //   currentVal.isPalletsQrCodes = true;
          // }
          if (data.val().sopFile != undefined) {
            var containerref = firebase
              .database()
              .ref()
              .child("serviceRequest")
              .child(snapshotKey)
              .child("sopFile");

            containerref.on("child_added", function (snapshot) {
              currentVal.transposrtDetailFiles.push({
                transpostSOPFileName: snapshot.val().transpostSOPFileName,
                transportSOPFileURL: snapshot.val().transportSOPFileURL,
              });
            });
            currentVal.isTransportDetailsFile = true;
          }

          if (data.val().unloadCertificates != undefined) {
            var containerref = firebase
              .database()
              .ref()
              .child("serviceRequest")
              .child(snapshotKey)
              .child("unloadCertificates");

            containerref.on("child_added", function (snapshot) {
              currentVal.unloadCertificateFiles.push({
                unloadCertificatePath: snapshot.val().unloadCertificatePath,
                unloadCertificateFileName:
                  snapshot.val().unloadCertificateFileName,
              });
            });
            currentVal.isUnloadCertificate = true;
            if (
              currentVal.unloadCertificateFiles != undefined &&
              currentVal.unloadCertificateFiles.length != 0
            ) {
              currentVal.unloadProductCertificationSavedFlag = true;
            }
          }

          if (data.val().temperatureMeasurementFileName != undefined) {
            currentVal.temperatureMeasurementFileURL =
              data.val().temperatureMeasurementFileURL;
            currentVal.temperatureMeasurementFileName =
              data.val().temperatureMeasurementFileName;
            if (
              currentVal.temperatureMeasurementFileName.split(".")[1] ==
                "png" ||
              currentVal.temperatureMeasurementFileName.split(".")[1] ==
                "jpg" ||
              currentVal.temperatureMeasurementFileName.split(".")[1] == "jpeg"
            ) {
              currentVal.imageloaded = true;
            } else {
              currentVal.imageloaded = false;
            }
            currentVal.isTemperatureFile = true;
          }
        });
    },
    sendInfo(item) {
      this.cartonFillingAndPalletizingFirebaseArray = [];
      this.fruitFlowConfigFruit = this.getFruit(item.Produce.split(" ")[0]);
      console.log(this.fruitFlowConfigFruit);
      this.getAvgWeightAndShipementRates(this.fruitFlowConfigFruit);
      this.getFruitFlowConfig();
      this.selectedRow = null;
      this.selectedRow = item;
      this.previousSavedFlag = false;
      this.getDetailsForBlockChainAPI();

      this.updateModal();

      this.$refs["pickup-modal"].show();
    },
    hideModal: function () {
      this.$refs["pickup-modal"].hide();
      this.$refs["confirm-modal"].hide();
      this.selectedStage = "Larvae Testing";
      this.internalFruitTemp = null;
      this.ambientTemp = null;
      this.ambientTempAPI = null;
      this.larvaeTesting = null;
      this.file = null;
      this.qualityInspectionResults = null;
      this.fruitsAccepted = null;
      this.fruitsRejected = null;
      this.waterTemperature = null;
      this.phLevel = null;
      this.chlorineLevel = null;
      this.firstSizingResults = null;
      this.timeofEntryHotWaterTreatment = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.waterTemperatureHotWaterTreatment = null;
      this.phLevelHotWaterTreatment = null;
      this.chlorineLevelHotWaterTreatment = null;
      this.durationHotWaterTreatment = null;
      this.timeofEntryHotWaterTreatment = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.chlorineLevelHydroCooling = null;
      this.timeofEntryHydroCooling = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.waterTemperatureHydroCooling = null;
      this.phLevelHydroCooling = null;
      this.durationHydroCooling = null;
      this.timeofExitHydroCooling = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.internalFruitTempHydroCooling = null;
      this.packingLineTimeofEntry = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.temperatureTransfer = null;
      this.coldStorageTimeIn = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.temperatureRemoval = null;
      this.coldStorageTimeOut = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.gradingResults = null;
      this.weightofRemovedFruit = null;
      this.fruitsQRCodesfile = null;
      this.boxesQRCodesfile = null;
      //this.palletsQRCodesFile = null;
      //this.startQRCodePallets = null;
      //this.endQRCodePallets = null;
      this.startQRCodeBoxes = null;
      this.endQRCodeBoxes = null;
      this.startQRCodeFruits = null;
      this.endQRCodeFruits = null;
      this.secondSizingResults = null;
      this.ambienttemperaturePacked = null;
      this.ambienttemperaturePackedAPI = null;
      this.internalFruitTemperaturePacked = null;
      this.entryTimeForcedCooling = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.fruitTemperatureEntryForcedCooling = null;
      this.airflowTemperatureRH = null;
      (this.removalTimeForcedCooling = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A")),
        (this.fruitTemperatureRemovalForcedCooling = null);
      this.fruitTemperatureColdStorage = null;
      this.fruitTemperatureColdStorageOut = null;
      this.airflowTemperatureRHColdStorage = null;
      this.storageTimeIn = moment.utc().local().format("MMM DD, YYYY hh:mm A");
      this.storageTimeOut = moment.utc().local().format("MMM DD, YYYY hh:mm A");
      this.containerInspectionfile = null;
      this.samplesTaken = null;
      this.samplingTemperature = null;
      this.dateAndTimeofSampling = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.reeferWallTemperature = null;
      this.destinationDateTimeColdTunnelLoading = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.reeferWallTemperatureColdTunnelLoading = null;
      this.shippingDetails = null;
      this.departureDateTimeTransport = moment
        .utc()
        .local()
        .format("MMM DD, YYYY hh:mm A");
      this.transportTemperature = null;
      this.destinationTransport = null;
      this.transportConditions = null;
      this.transportCost = null;
      this.SOPFile = null;
    },

    generateQRArray: function (start, end, prefix, noOfDigits) {
      let currentValue = this;

      var arr = [];
      for (var i = start; i <= end; i++) {
        arr.push(prefix + currentValue.getConvertedNumber(i, noOfDigits));
      }
      //console.log(arr);
      return arr;
    },
    getConvertedNumber: function (number, noOfDigits) {
      var numberStr = number.toString();
      var result = numberStr;

      var numberLength = numberStr.length;
      for (var i = numberLength + 1; i <= noOfDigits; i++) {
        result = "0" + result;
      }

      return result;
    },
    stageSelection: function (label) {
      this.nextSelectedStage = label;

      if (
        (this.selectedStage == "Larvae Testing" && !this.larvaeSavedFlag) ||
        (this.selectedStage == "Temperature Measurement" &&
          !this.temperatureMeasurementSavedFlag) ||
        (this.selectedStage == "Quality Inspection" &&
          !this.qualityInspectionSavedFlag) ||
        (this.selectedStage == "Cleaning & Trimming" &&
          !this.cleaningTrimmingSavedFlag) ||
        (this.selectedStage == "Fruit Washing" &&
          !this.fruitWashingSavedFlag) ||
        (this.selectedStage == "Feed Packing Line Conveyor Belt" &&
          !this.feedPackingLineConveyorBeltSavedFlag) ||
        (this.selectedStage == "Grading" && !this.gradingSavedFlag) ||
        (this.selectedStage == "First Sizing" && !this.firstSizingSavedFlag) ||
        (this.selectedStage == "Sizing" && !this.secondSizingSavedFlag) ||
        (this.selectedStage == "Carton Filling" &&
          !this.cartonFillingPalletizingSavedFlag) ||
        (this.selectedStage == "Temperature Readings for Packed Lot" &&
          !this.temperatureReadingPackedLotSavedFlag) ||
        (this.selectedStage == "Forced Air Cooling Entry" &&
          !this.forcedAirCoolingEntrySavedFlag) ||
        (this.selectedStage == "Removal from Forced Air Cooling" &&
          !this.removalFromForcedAirCoolingSavedFlag) ||
        (this.selectedStage == "Cold Room Storage In" &&
          !this.coldRoomStorageInSavedFlag) ||
        (this.selectedStage == "Cold Room Storage Out" &&
          !this.coldRoomStorageOutSavedFlag) ||
        (this.selectedStage == "Upload Product Certifications" &&
          !this.unloadProductCertificationSavedFlag) ||
        (this.selectedStage == "Shipping Details" && !this.shippingSavedFlag) ||
        (this.selectedStage == "Transport Details" &&
          !this.transportSavedFlag) ||
        (this.selectedStage == "Sampling" && !this.samplingSavedFlag) ||
        (this.selectedStage == "Container Inspection" &&
          !this.containerInspectionSavedFlag) ||
        (this.selectedStage == "PreCooling Reefers" &&
          !this.preCoolingReeferSavedFlag) ||
        (this.selectedStage == "Cold Tunnel Loading" &&
          !this.coldTunnelLoadingSavedFlag) ||
        (this.selectedStage == "Transfer to Cold Storage" &&
          !this.tranferColdStorageSavedFlag) ||
        (this.selectedStage == "Removal from Cold Storage" &&
          !this.removalColdStorageSavedFlag) ||
        (this.selectedStage == "Hot Water Treatment Entry" &&
          !this.hotWaterTreatmentEntrySavedFlag) ||
        (this.selectedStage == "Hot Water Treatment Exit" &&
          !this.hotWaterTreatmentExitSavedFlag) ||
        (this.selectedStage == "Hydro Cooling Entry" &&
          !this.hydroCoolingEntrySavedFlag) ||
        (this.selectedStage == "Hydro Cooling Exit" &&
          !this.hydroCoolingExitSavedFlag)
      ) {
        this.$refs["save-previous-confirm-modal"].show();
      } else {
        this.larvaeSavedFlag = false;
        this.temperatureMeasurementSavedFlag = false;
        this.qualityInspectionSavedFlag = false;
        this.fruitWashingSavedFlag = false;
        this.firstSizingSavedFlag = false;
        this.hotWaterTreatmentEntrySavedFlag = false;
        this.hotWaterTreatmentExitSavedFlag = false;
        this.hydroCoolingEntrySavedFlag = false;
        this.hydroCoolingExitSavedFlag = false;
        this.feedPackingLineConveyorBeltSavedFlag = false;
        this.gradingSavedFlag = false;
        this.secondSizingSavedFlag = false;
        this.cartonFillingPalletizingSavedFlag = false;
        this.temperatureReadingPackedLotSavedFlag = false;
        this.forcedAirCoolingEntrySavedFlag = false;
        this.removalFromForcedAirCoolingSavedFlag = false;
        this.coldRoomStorageInSavedFlag = false;
        this.coldRoomStorageOutSavedFlag = false;
        this.unloadProductCertificationSavedFlag = false;
        this.shippingSavedFlag = false;
        this.transportSavedFlag = false;
        this.samplingSavedFlag = false;
        this.containerInspectionSavedFlag = false;
        this.preCoolingReeferSavedFlag = false;
        this.coldTunnelLoadingSavedFlag = false;
        this.cleaningTrimmingSavedFlag = false;
        this.tranferColdStorageSavedFlag = false;
        this.removalColdStorageSavedFlag = false;
        this.updateModal();
        this.previousSavedFlag = false;
        this.selectedStage = label;
      }
    },
    savePreviousConfirm: function () {
      this.selectedStage = this.nextSelectedStage;
      this.$refs["save-previous-confirm-modal"].hide();
    },
    hideSavePreviousConfirmModal: function () {
      this.$refs["save-previous-confirm-modal"].hide();
    },
    uploadImage: function (
      files,
      selectedStage,
      id,
      inpData,
      vm,
      documentType
    ) {
      this.seen = true;
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
    shippingDetailChange: function () {
      if (this.shippingDetails == "Shipment by Sea (US$ 1.22/kg)") {
      }
    },
    hideRejectConfirmModal: function () {
      this.$refs["confirm-modal"].hide();
    },
    hideQrcodeViewModal() {
      this.$refs["qrcode-view-modal"].hide();
    },
    generateAndShowQRCodes(start, end) {
      const vm = this;
      let letter = start.replace(/[0-9]/g, "");

      var startCount = start.match(/\d/g);
      startCount = startCount.join("");

      var endCount = end.match(/\d/g);
      endCount = endCount.join("");

      let _qrcodes = vm.generateQRArray(
        Number(startCount),
        Number(endCount),
        letter,
        Number(start.length - 2)
      );
      vm.showQrcodeViewModal(_qrcodes);
    },
    showQrcodeViewModal(qrcodes) {
      this.seen = true;
      this.qrcodesToShow = [];
      this.qrcodesToShow = qrcodes;
      this.$refs["qrcode-view-modal"].show();
    },
    hideConfirmWarningModal: function () {
      this.$refs["confirm-warning-modal"].hide();
    },
    continueWithTemperatureWarning: function () {
      this.$refs["confirm-warning-modal"].hide();
      let currentValue = this;
      currentValue.isTemepertaureBreach = true;
      currentValue.temperatureBreachCount++;
      var dbRef = firebase.database().ref().child("serviceRequest");
      if (this.selectedStage == "Temperature Measurement") {
        var inpData = {
          ambientTemp: this.ambientTemp,
          internalFruitTemp: this.internalFruitTemp,
          isTemepertaureBreach: currentValue.isTemepertaureBreach,
          temperatureBreachCount: currentValue.temperatureBreachCount,
          updatedBy: localStorage.userName,
        };
        dbRef
          .orderByChild("serviceRequestId")
          .equalTo(currentValue.selectedRow.Id)
          .once("child_added", function (data) {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            ref
              .update(inpData)
              .then(
                function () {
                  currentValue.createTempMeasurementAPICall(
                    currentValue.selectedRow.Id,
                    inpData
                  );
                  if (
                    currentValue.file.name &&
                    (function () {
                      if (currentValue.temperatureMeasurementFileName) {
                        if (
                          currentValue.temperatureMeasurementFileName !=
                          currentValue.file.name
                        ) {
                          return true;
                        } else {
                          return false;
                        }
                      } else {
                        return true;
                      }
                    })()
                  ) {
                    currentValue.uploadImage(
                      currentValue.file,
                      currentValue.selectedStage,
                      currentValue.selectedRow.Id,
                      inpData,
                      currentValue,
                      "Temperature Measurement"
                    );
                  } else {
                    currentValue.seen = false;
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Temperature Measurement details saved successfully.",
                        "Temperature Measurement details saved successfully."
                      ),
                      type: "success",
                      position: "top",
                    });
                    // currentValue.createTempMeasurementAPICall(
                    //   currentValue.selectedRow.Id,
                    //   inpData
                    // );
                    currentValue.temperatureMeasurementSavedFlag = true;
                  }
                },
                function () {
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Temperature Measurement details saved successfully.",
                      "Temperature Measurement details saved successfully."
                    ),
                    type: "success",
                    position: "top",
                  });
                  // currentValue.createTempMeasurementAPICall(
                  //   currentValue.selectedRow.Id,
                  //   inpData
                  // );
                  currentValue.temperatureMeasurementSavedFlag = true;
                }
              )
              .catch(function (error) {
                currentValue.erroMessage = error.message;
                currentValue.seen = false;
                Vue.$toast.open({
                  message: currentValue.$t(
                    "Error fetching data.",
                    "Error fetching data."
                  ),
                  position: "top",
                  type: "error",
                });
              });
          });
      } else if (this.selectedStage == "Transfer to Cold Storage") {
        var inpData = {
          temperatureTransfer: currentValue.temperatureTransfer,
          coldStorageTimeIn: moment.utc().toString(),
          isTemepertaureBreach: currentValue.isTemepertaureBreach,
          temperatureBreachCount: currentValue.temperatureBreachCount,
          updatedBy: localStorage.userName,
        };
        dbRef
          .orderByChild("serviceRequestId")
          .equalTo(currentValue.selectedRow.Id)
          .once("child_added", function (data) {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            currentValue
              .createtransfertoColdStorageAPICall(
                currentValue.selectedRow.Id,
                inpData
              )
              .then((resolved) => {
                console.log(resolved);
                ref
                  .update(inpData)
                  .then(function () {
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Transfer to cold storage details saved successfully.",
                        "Transfer to cold storage details saved successfully."
                      ),
                      type: "success",
                      position: "top",
                    });
                    currentValue.tranferColdStorageSavedFlag = true;
                  })
                  .catch(function (error) {
                    currentValue.erroMessage = error.message;
                    currentValue.seen = false;
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Error updating data to firebase.",
                        "Error updating data to firebase."
                      ),
                      position: "top",
                      type: "error",
                    });
                  });
              })
              .catch((error) => {
                currentValue.seen = false;
                Vue.$toast.open({
                  message: currentValue.$t(
                    "Error updating data to corda.",
                    "Error updating data to corda."
                  ),
                  type: "error",
                  position: "top",
                });
              });
          });
      } else if (this.selectedStage == "Cold Room Storage Out") {
        var inpData = {
          fruitTemperatureColdStorageOut:
            currentValue.fruitTemperatureColdStorageOut,
          storageTimeOut: moment.utc().toString(),
          updatedBy: localStorage.userName,
        };
        dbRef
          .orderByChild("serviceRequestId")
          .equalTo(currentValue.selectedRow.Id)
          .once("child_added", function (data) {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            currentValue
              .createColdRoomStorageOutDetailsAPICall(
                currentValue.selectedRow.Id,
                inpData
              )
              .then((updated) => {
                console.log(updated);
                ref
                  .update(inpData)
                  .then(function () {
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Cold Room Storage Out details saved successfully.",
                        "Cold Room Storage Out details saved successfully."
                      ),
                      type: "success",
                      position: "top",
                    });

                    currentValue.coldRoomStorageOutSavedFlag = true;
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
              .catch((error) => {
                console.log(error);
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
          });
      } else if (this.selectedStage == "Removal from Cold Storage") {
        var inpData = {
          temperatureRemoval: currentValue.temperatureRemoval,
          coldStorageTimeOut: moment.utc().toString(),
          isTemepertaureBreach: currentValue.isTemepertaureBreach,
          temperatureBreachCount: currentValue.temperatureBreachCount,
          updatedBy: localStorage.userName,
        };
        dbRef
          .orderByChild("serviceRequestId")
          .equalTo(currentValue.selectedRow.Id)
          .once("child_added", function (data) {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            currentValue
              .createRemovalfromColdStorageAPICall(
                currentValue.selectedRow.Id,
                inpData
              )
              .then((updated) => {
                console.log(updated);
                ref
                  .update(inpData)
                  .then(function () {
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Removal from Cold Storage details saved successfully.",
                        "Removal from Cold Storage details saved successfully."
                      ),
                      type: "success",
                      position: "top",
                    });

                    currentValue.removalColdStorageSavedFlag = true;
                  })
                  .catch(function (error) {
                    currentValue.erroMessage = error.message;
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
              })
              .catch((error) => {
                console.log(error);
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
          });
      } else if (this.selectedStage == "Temperature Readings for Packed Lot") {
        var inpData = {
          ambienttemperaturePacked: currentValue.ambienttemperaturePacked,
          internalFruitTemperaturePacked:
            currentValue.internalFruitTemperaturePacked,
          isTemepertaureBreach: currentValue.isTemepertaureBreach,
          temperatureBreachCount: currentValue.temperatureBreachCount,
          updatedBy: localStorage.userName,
        };
        dbRef
          .orderByChild("serviceRequestId")
          .equalTo(currentValue.selectedRow.Id)
          .once("child_added", function (data) {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            currentValue
              .createTemperatureReadingsForPackedLotAPICall(
                currentValue.selectedRow.Id,
                inpData
              )
              .then((updated) => {
                console.log(updated);
                ref
                  .update(inpData)
                  .then(function () {
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Temperature Readings for Packed Lot details saved successfully.",
                        "Temperature Readings for Packed Lot details saved successfully."
                      ),
                      type: "success",
                      position: "top",
                    });

                    currentValue.ambienttemperaturePackedAPI =
                      currentValue.ambienttemperaturePacked;
                    currentValue.temperatureReadingPackedLotSavedFlag = true;
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
              .catch((error) => {
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
          });
      }
      //**Working */
      else if (this.selectedStage == "Transport Details") {
        var isPenalityApplied = 0;
        var noOfBoxesExpected =
          Number(currentValue.selectedRow.FruitExpected) / 10;

        let splittingFactor = 0;
        for (let i = 0; i < currentValue.startQRCodeBoxes.length; i++) {
          if (
            currentValue.startQRCodeBoxes.charAt(i) ==
            currentValue.endQRCodeBoxes.charAt(i)
          ) {
            splittingFactor++;
          } else {
            break;
          }
        }
        let startBox = Number(
          currentValue.startQRCodeBoxes.substring(
            splittingFactor,
            currentValue.startQRCodeBoxes.length
          )
        );
        let endBox = Number(
          currentValue.endQRCodeBoxes.substring(
            splittingFactor,
            currentValue.endQRCodeBoxes.length
          )
        );
        // var noOfBoxesArrived = Number(endBox - startBox);
        var noOfBoxesArrived = 0;
        for (var inc = startBox; inc <= endBox; inc++) {
          noOfBoxesArrived++;
        }

        // Number(currentValue.endQRCodeBoxes) -
        // Number(currentValue.startQRCodeBoxes);
        var penalityAmount = null;
        if (noOfBoxesArrived < noOfBoxesExpected) {
          if (currentValue.selectedRow.Produce.split(" ")[0] == "Mango") {
            penalityAmount =
              2 *
              1.45 *
              4.5 *
              (Number(noOfBoxesExpected) - Number(noOfBoxesArrived));
            currentValue.lossOfBox =
              Number(noOfBoxesExpected) - Number(noOfBoxesArrived);
            // Vue.$toast.open({
            //   message:
            //     "Warning: There is a loss of " +
            //     (Number(noOfBoxesExpected) - Number(noOfBoxesArrived)) +
            //     " boxes at packhouse, penalty of " +
            //     penalityAmount +
            //     " USD levied.",
            //   type: "warning",
            //   position: "bottom",
            //   duration: 8000,
            // });
          } else if (
            currentValue.selectedRow.Produce.split(" ")[0] == "Avocado"
          ) {
            penalityAmount =
              2 *
              1.45 *
              5 *
              (Number(noOfBoxesExpected) - Number(noOfBoxesArrived));
            currentValue.lossOfBox =
              Number(noOfBoxesExpected) - Number(noOfBoxesArrived);
            // Vue.$toast.open({
            //   message:
            //     "Warning: There is a loss of " +
            //     (Number(noOfBoxesExpected) - Number(noOfBoxesArrived)) +
            //     " boxes at packhouse, penalty of " +
            //     penalityAmount +
            //     " USD levied.",
            //   type: "warning",
            //   position: "bottom",
            //   duration: 8000,
            // });
          } else {
            penalityAmount =
              2 *
              1.45 *
              12.25 *
              (Number(noOfBoxesExpected) - Number(noOfBoxesArrived));
            currentValue.lossOfBox =
              Number(noOfBoxesExpected) - Number(noOfBoxesArrived);
            // Vue.$toast.open({
            //   message:
            //     "Warning: There is a loss of " +
            //     (Number(noOfBoxesExpected) - Number(noOfBoxesArrived)).toFixed(
            //       0
            //     ) +
            //     " boxes at packhouse, penalty of " +
            //     penalityAmount +
            //     " USD levied.",
            //   type: "warning",
            //   position: "bottom",
            //   duration: 8000,
            // });
          }
        }
        var inpData = {
          departureDateTimeTransport: moment.utc().toString(),
          transportTemperature: currentValue.transportTemperature,
          destinationTransport: currentValue.destinationTransport,
          transportConditions: currentValue.transportConditions,
          transportCost: 0,
          SOPFile: currentValue.SOPFile,
          transportCurrency: "HTG",
          status: "Packing Completed",
          fruitFlowCompletedOn: moment.utc().toString(),
          penalityAmount: penalityAmount,
          lossOfBox: currentValue.lossOfBox || 0,
          updatedBy: localStorage.userName,
        };
        if (currentValue.checkStageValidations()) {
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(currentValue.selectedRow.Id)
            .once("child_added", function (data) {
              var ref = firebase.database().ref("serviceRequest/" + data.key);
              currentValue
                .createTransportDetailsAPICall(
                  currentValue.selectedRow.Id,
                  inpData
                )
                .then((updated) => {
                  console.log(updated);
                  ref
                    .update(inpData)
                    .then(function () {
                      if (currentValue.SOPFile) {
                        currentValue.uploadImage(
                          currentValue.SOPFile,
                          currentValue.selectedStage,
                          currentValue.selectedRow.Id,
                          inpData,
                          currentValue,
                          "SOPFile"
                        );
                      } else {
                        currentValue.seen = false;

                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Transport Details saved successfully.",
                            "Transport Details saved successfully."
                          ),
                          type: "success",
                          position: "top",
                        });

                        currentValue.transportSavedFlag = true;
                        let _data = {
                          ArrivedAtPackhouseAddedOn:
                            currentValue.apiData.ArrivedAtPackhouseAddedOn,
                          airflowTemperatureRH:
                            currentValue.airflowTemperatureRHAPI,
                          airflowTemperatureRHColdStorage:
                            currentValue.airflowTemperatureRHColdStorageAPI,
                          ambientTemp: currentValue.ambientTempAPI,
                          ambienttemperaturePacked:
                            currentValue.ambienttemperaturePackedAPI,
                          arrivedAtPackhouseAddedOn:
                            currentValue.apiData.arrivedAtPackhouseAddedOn,
                          arrivedAtPackhouseAdditionalNote:
                            currentValue.apiData
                              .arrivedAtPackhouseAdditionalNote,
                          boxes: currentValue.globalTotalBoxes,
                          lossOfBox: currentValue.lossOfBox,
                          internalFruitTemp: currentValue.internalFruitTemp,
                          temperatureTransfer: currentValue.temperatureTransfer,
                          temperatureRemoval: currentValue.temperatureRemoval,
                          internalFruitTemperaturePacked:
                            currentValue.internalFruitTemperaturePacked,
                          isTemepertaureBreach:
                            currentValue.isTemepertaureBreach,
                          temperatureBreachCount:
                            currentValue.temperatureBreachCount,
                          requestCompletedOn: moment.utc().toString(),
                        };
                        if (
                          currentValue.temperatureBreachCount > 0 ||
                          currentValue.lossOfBox > 0
                        ) {
                          _data.penalties = [];
                        }
                        if (currentValue.temperatureBreachCount > 0) {
                          _data.penalties.push({
                            type: "PH_TEMP_BREACH",
                            temperature_breach_count:
                              currentValue.temperatureBreachCount,
                            fruits_amount: Number(
                              currentValue.selectedRow.FruitExpected
                            ),
                            boxes_amount: currentValue.lossOfBox,
                          });
                        }
                        if (currentValue.lossOfBox > 0) {
                          _data.penalties.push({
                            type: "PH_DELIVERY_LOSS",
                            boxes_amount: currentValue.lossOfBox,
                            fruits_amount: Number(currentValue.lossOfBox) * 10,
                          });
                        }
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
                .catch((error) => {
                  console.log(error);
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
            });
        } else {
          currentValue.seen = false;
          Vue.$toast.open({
            message: currentValue.$t(
              "Please complete previous stages to update Transport Details.",
              "Please complete previous stages to update Transport Details."
            ),
            position: "top",
            type: "error",
          });
        }
      } else if (this.selectedStage == "Hot Water Treatment Exit") {
        var inpData = {
          durationHotWaterTreatment: currentValue.durationHotWaterTreatment,
          timeofExitHotWaterTreatment: moment.utc().toString(),
          updatedBy: localStorage.userName,
        };
        dbRef
          .orderByChild("serviceRequestId")
          .equalTo(currentValue.selectedRow.Id)
          .once("child_added", function (data) {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            currentValue
              .createHotWaterTreatmentExitAPICall(
                currentValue.selectedRow.Id,
                inpData
              )
              .then((updated) => {
                console.log(updated);
                ref
                  .update(inpData)
                  .then(function () {
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Hot Water Treatment Exit details saved successfully.",
                        "Hot Water Treatment Exit details saved successfully."
                      ),
                      type: "success",
                      position: "top",
                    });

                    currentValue.hotWaterTreatmentExitSavedFlag = true;
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
              .catch((error) => {
                console.log(error);
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
          });
      } else if (this.selectedStage == "Hydro Cooling Exit") {
        var inpData = {
          durationHydroCooling: currentValue.durationHydroCooling,
          timeofExitHydroCooling: moment.utc().toString(),
          internalFruitTempHydroCooling:
            currentValue.internalFruitTempHydroCooling,
          updatedBy: localStorage.userName,
        };
        dbRef
          .orderByChild("serviceRequestId")
          .equalTo(currentValue.selectedRow.Id)
          .once("child_added", function (data) {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            currentValue
              .createHydroCoolingExitAPICall(
                currentValue.selectedRow.Id,
                inpData
              )
              .then((updated) => {
                console.log(updated);
                ref
                  .update(inpData)
                  .then(function () {
                    Vue.$toast.open({
                      message: currentValue.$t(
                        "Hydro Cooling Exit details saved successfully.",
                        "Hydro Cooling Exit details saved successfully."
                      ),
                      type: "success",
                      position: "top",
                    });

                    currentValue.hydroCoolingExitSavedFlag = true;
                  })
                  .catch(function (error) {
                    currentValue.erroMessage = error.message;
                    currentValue.seen = false;
                  });
              })
              .catch((error) => {
                console.log(error);
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
          });
      }
    },
    checkFlags(fruit) {
      switch (fruit) {
        case "Pineapple": {
          if (
            this.larvaeSavedFlag &&
            this.temperatureMeasurementSavedFlag &&
            this.qualityInspectionSavedFlag &&
            this.cleaningTrimmingSavedFlag &&
            this.fruitWashingSavedFlag &&
            this.feedPackingLineConveyorBeltSavedFlag &&
            this.gradingSavedFlag &&
            this.secondSizingSavedFlag &&
            this.cartonFillingPalletizingSavedFlag &&
            this.temperatureReadingPackedLotSavedFlag &&
            this.forcedAirCoolingEntrySavedFlag &&
            this.removalFromForcedAirCoolingSavedFlag &&
            this.coldRoomStorageInSavedFlag &&
            this.coldRoomStorageOutSavedFlag &&
            this.unloadProductCertificationSavedFlag &&
            this.shippingSavedFlag
          ) {
            if (this.shippingDetails == "Shipment by Sea (US$ 1.22/kg)") {
              if (
                this.samplingSavedFlag &&
                this.containerInspectionSavedFlag &&
                this.preCoolingReeferSavedFlag &&
                this.coldTunnelLoadingSavedFlag
              ) {
                return true;
              } else {
                return false;
              }
            }
            return true;
          } else {
            return false;
          }
        }
        case "Mango": {
          if (
            this.larvaeSavedFlag &&
            this.temperatureMeasurementSavedFlag &&
            this.qualityInspectionSavedFlag &&
            this.fruitWashingSavedFlag &&
            this.firstSizingSavedFlag &&
            this.hotWaterTreatmentEntrySavedFlag &&
            this.hotWaterTreatmentExitSavedFlag &&
            this.hydroCoolingEntrySavedFlag &&
            this.hydroCoolingExitSavedFlag &&
            this.feedPackingLineConveyorBeltSavedFlag &&
            this.gradingSavedFlag &&
            this.secondSizingSavedFlag &&
            this.cartonFillingPalletizingSavedFlag &&
            this.temperatureReadingPackedLotSavedFlag &&
            this.forcedAirCoolingEntrySavedFlag &&
            this.removalFromForcedAirCoolingSavedFlag &&
            this.coldRoomStorageInSavedFlag &&
            this.coldRoomStorageOutSavedFlag &&
            this.unloadProductCertificationSavedFlag &&
            this.shippingSavedFlag
          ) {
            if (this.shippingDetails == "Shipment by Sea (US$ 1.22/kg)") {
              if (
                this.samplingSavedFlag &&
                this.containerInspectionSavedFlag &&
                this.preCoolingReeferSavedFlag &&
                this.coldTunnelLoadingSavedFlag
              ) {
                return true;
              } else {
                return false;
              }
            }
            return true;
          } else {
            return false;
          }
        }
        case "Avocado": {
          if (
            this.larvaeSavedFlag &&
            this.temperatureMeasurementSavedFlag &&
            this.qualityInspectionSavedFlag &&
            this.tranferColdStorageSavedFlag &&
            this.removalColdStorageSavedFlag &&
            this.feedPackingLineConveyorBeltSavedFlag &&
            this.gradingSavedFlag &&
            this.secondSizingSavedFlag &&
            this.cartonFillingPalletizingSavedFlag &&
            this.temperatureReadingPackedLotSavedFlag &&
            this.forcedAirCoolingEntrySavedFlag &&
            this.removalFromForcedAirCoolingSavedFlag &&
            this.coldRoomStorageInSavedFlag &&
            this.coldRoomStorageOutSavedFlag &&
            this.unloadProductCertificationSavedFlag &&
            this.shippingSavedFlag
          ) {
            if (this.shippingDetails == "Shipment by Sea (US$ 1.22/kg)") {
              if (
                this.samplingSavedFlag &&
                this.containerInspectionSavedFlag &&
                this.preCoolingReeferSavedFlag &&
                this.coldTunnelLoadingSavedFlag
              ) {
                return true;
              } else {
                return false;
              }
            }
            return true;
          } else {
            return false;
          }
        }
        default: {
          return false;
        }
      }
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
    hideScannerModal: function () {
      this.qrcodeResult = null;
      this.$refs["scanner-modal"].hide();
    },
    onDecode(result) {
      this.qrcodeResult = result;
      if (this.currentScanner == "startQRCodeBoxes") {
        this.startQRCodeBoxes = result;
      } else if (this.currentScanner == "endQRCodeBoxes") {
        this.endQRCodeBoxes = result;
      }
      // else if (this.currentScanner == "startQRCodePallets") {
      //   this.startQRCodePallets = result;
      // }
      // else if (this.currentScanner == "endQRCodePallets") {
      //   this.endQRCodePallets = result;
      // }
      else if (this.currentScanner == "startQRCodeFruits") {
        this.startQRCodeFruits = result;
      } else if (this.currentScanner == "endQRCodeFruits") {
        this.endQRCodeFruits = result;
      }
      this.uploadQrcode(result);
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
    showQrcodeModal(state) {
      this.$refs["scanner-modal"].show();
      this.currentScanner = state;
    },
    QRCodeViewModalOpened() {
      this.seen = false;
    },
    createTempMeasurementAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "TEMPERATURE_MEASUREMENT",
        temperatureMeasurement: {
          ambientTemp: inpData.ambientTemp,
          internalFruitTemp: inpData.internalFruitTemp,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          })
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            console.log(error.message);
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
                    .createTempMeasurementAPICall(serviceId, inpData)
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
        id: serviceId,
        step: "QUALITY_INSPECTION",
        qualityInspection: {
          fruitsAccepted: inpData.fruitsAccepted,
          fruitsRejected: inpData.fruitsRejected,
          qualityInspectionResults: inpData.qualityInspectionResults,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
    createHotWaterTreatmentExitAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "HOT_WATER_TREATMENT_EXIT",
        hotWaterTreatmentExit: {
          durationHotWaterTreatment: inpData.durationHotWaterTreatment,
          timeofExitHotWaterTreatment: moment
            .utc(String(inpData.timeofExitHotWaterTreatment))
            .format("YYYY-MM-DDTHH:mm:ss"),
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createHotWaterTreatmentExitAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createHotWaterTreatmentEntryAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "HOT_WATER_TREATMENT_ENTRY",
        hotWaterTreatmentEntry: {
          timeofEntryHotWaterTreatment: moment
            .utc(String(inpData.timeofEntryHotWaterTreatment))
            .format("YYYY-MM-DDTHH:mm:ss"),
          waterTemperatureHotWaterTreatment:
            inpData.waterTemperatureHotWaterTreatment,
          phLevelHotWaterTreatment: inpData.phLevelHotWaterTreatment,
          chlorineLevelHotWaterTreatment:
            inpData.chlorineLevelHotWaterTreatment,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createHotWaterTreatmentEntryAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createHydroCoolingEntryAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "HYDRO_COOLING_ENTRY",
        hydroCoolingEntry: {
          timeofEntryHydroCooling: moment
            .utc(String(inpData.timeofEntryHydroCooling))
            .format("YYYY-MM-DDTHH:mm:ss"),

          waterTemperatureHydroCooling: inpData.waterTemperatureHydroCooling,
          phLevelHydroCooling: inpData.phLevelHydroCooling,
          chlorineLevelHydroCooling: inpData.chlorineLevelHydroCooling,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createHydroCoolingEntryAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createHydroCoolingExitAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "HYDRO_COOLING_EXIT",
        hydroCoolingExit: {
          durationHydroCooling: inpData.durationHydroCooling,
          timeofExitHydroCooling: moment
            .utc(String(inpData.timeofExitHydroCooling))
            .format("YYYY-MM-DDTHH:mm:ss"),

          internalFruitTempHydroCooling: inpData.internalFruitTempHydroCooling,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createHydroCoolingExitAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createCleanTrimAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "CLEANING_AND_TRIMMING",
        cleaningAndTrimming: {
          dateTimeCleaningTrimming: moment
            .utc(inpData.dateTimeCleaningTrimming.toString())
            .format("YYYY-MM-DDTHH:mm:ss"),
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createCleanTrimAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createFirstSizingAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "FIRST_SIZING",
        firstSizing: {
          firstSizingResults: inpData.firstSizingResults,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createFirstSizingAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createFruitWashingAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "FRUIT_WASHING",
        fruitWashing: {
          waterTemperature: inpData.waterTemperature,
          phLevel: inpData.phLevel,
          chlorineLevel: inpData.chlorineLevel,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createFruitWashingAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createtransfertoColdStorageAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "TRANSFER_TO_COLD_STORAGE",
        transferToColdStorage: {
          temperatureTransfer: inpData.temperatureTransfer,
          coldStorageTimeIn: moment
            .utc(String(inpData.coldStorageTimeIn))
            .format("YYYY-MM-DDTHH:mm:ss"),
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createtransfertoColdStorageAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createRemovalfromColdStorageAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "REMOVAL_FROM_COLD_STORAGE",
        removalFromColdStorage: {
          temperatureRemoval: inpData.temperatureRemoval,
          coldStorageTimeOut: moment
            .utc(String(inpData.coldStorageTimeOut))
            .format("YYYY-MM-DDTHH:mm:ss"),
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createRemovalfromColdStorageAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createFeedPackingLineConveyorBeltAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "FEED_PACKING_LINE_CONVEYOR_BELT",
        feedLineConveyorBelt: {
          packingLineTimeofEntry: moment
            .utc(String(inpData.packingLineTimeofEntry))
            .format("YYYY-MM-DDTHH:mm:ss"),
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createFeedPackingLineConveyorBeltAPICall(
                      serviceId,
                      inpData
                    )
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createGradingAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "GRADING",
        grading: {
          gradingResults: inpData.gradingResults,
          weightofRemovedFruit: inpData.weightofRemovedFruit,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createGradingAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createSecondSizingAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "SECOND_SIZING",
        secondSizing: {
          secondSizingResults: inpData.secondSizingResults,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createSecondSizingAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createCartonFillingPalletizingAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "CARTON_FILLING_AND_PALLETIZING",
        cartonFillingAndPalletizing: inpData,
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createCartonFillingPalletizingAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createTemperatureReadingsForPackedLotAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "TEMPERATURE_READING_PACKED_LOT",
        temperatureReadingPackedLot: {
          ambienttemperaturePacked: inpData.ambienttemperaturePacked,
          internalFruitTemperaturePacked:
            inpData.internalFruitTemperaturePacked,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createTemperatureReadingsForPackedLotAPICall(
                      serviceId,
                      inpData
                    )
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createForcedAirCoolingEntryDetailsAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "FORCED_AIR_COOLING_ENTRY",
        forcedAirCoolingEntry: {
          entryTimeForcedCooling: moment
            .utc(String(inpData.entryTimeForcedCooling))
            .format("YYYY-MM-DDTHH:mm:ss"),
          fruitTemperatureEntryForcedCooling:
            inpData.fruitTemperatureEntryForcedCooling,
          airflowTemperatureRH: inpData.airflowTemperatureRH,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createForcedAirCoolingEntryDetailsAPICall(
                      serviceId,
                      inpData
                    )
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createRemovalfromForcedAirCoolingDetailsAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "FORCED_AIR_COOLING_REMOVAL",
        forcedAirCoolingRemoval: {
          removalTimeForcedCooling: moment
            .utc(String(inpData.removalTimeForcedCooling))
            .format("YYYY-MM-DDTHH:mm:ss"),
          fruitTemperatureRemovalForcedCooling:
            inpData.fruitTemperatureRemovalForcedCooling,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createRemovalfromForcedAirCoolingDetailsAPICall(
                      serviceId,
                      inpData
                    )
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createColdRoomStorageInDetailsAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "COLD_ROOM_STORAGE_IN",
        coldRoomStorageIn: {
          fruitTemperatureColdStorage: inpData.fruitTemperatureColdStorage,
          airflowTemperatureRHColdStorage:
            inpData.airflowTemperatureRHColdStorage,
          storageTimeIn: moment
            .utc(String(inpData.storageTimeIn))
            .format("YYYY-MM-DDTHH:mm:ss"),
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createColdRoomStorageInDetailsAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createColdRoomStorageOutDetailsAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "COLD_ROOM_STORAGE_OUT",
        coldRoomStorageOut: {
          fruitTemperatureColdStorageOut:
            inpData.fruitTemperatureColdStorageOut,
          storageTimeOut: moment
            .utc(String(inpData.storageTimeOut))
            .format("YYYY-MM-DDTHH:mm:ss"),
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createColdRoomStorageOutDetailsAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createSamplingDetailsAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "SAMPLING_DETAILS",
        samplingDetails: {
          samplesTaken: inpData.samplesTaken,
          samplingTemperature: inpData.samplingTemperature,
          dateAndTimeofSampling: moment
            .utc(String(inpData.dateAndTimeofSampling))
            .format("YYYY-MM-DDTHH:mm:ss"),
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createSamplingDetailsAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createPreCoolingReefersAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "PRE_COOLING_REEFERS",
        preCoolingReefers: {
          reeferWallTemperature: inpData.reeferWallTemperature,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createPreCoolingReefersAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createColdTunnelLoadingDetailsAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "COLD_TUNNEL_LOADING",
        coldTunnelLoading: {
          destinationDateTimeColdTunnelLoading: moment
            .utc(String(inpData.destinationDateTimeColdTunnelLoading))
            .format("YYYY-MM-DDTHH:mm:ss"),
          reeferWallTemperatureColdTunnelLoading:
            inpData.reeferWallTemperatureColdTunnelLoading,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createColdTunnelLoadingDetailsAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createShippingDetailsAPICall(serviceId, inpData) {
      let currentVal = this;
      var shippingMode = null;
      if (
        inpData.shippingDetails.shippingMode == "Shipment by Air (US$ 1.68/kg)"
      ) {
        shippingMode = "SHIPMENT_BY_AIR";
      } else {
        shippingMode = "SHIPMENT_BY_SEA";
      }
      const data = {
        id: serviceId,
        step: "SHIPPING_DETAILS",
        shippingDetails: {
          shippingDetails: shippingMode,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createShippingDetailsAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createTransportDetailsAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "TRANSPORT_DETAILS",
        transportDetails: {
          departureDateTimeTransport: moment
            .utc(String(inpData.departureDateTimeTransport))
            .format("YYYY-MM-DDTHH:mm:ss"),
          transportTemperature: inpData.transportTemperature,
          destinationTransport: inpData.destinationTransport,
          transportConditions: inpData.transportConditions,
          transportCost: inpData.transportCost,
          transportCurrency: inpData.transportCurrency,
          status: "PACKING COMPLETED",
          fruitFlowCompletedOn: moment
            .utc(String(inpData.fruitFlowCompletedOn))
            .format("YYYY-MM-DDTHH:mm:ss"),
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
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
                    .createTransportDetailsAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createLarvaeTestingDetailsAPICall(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        step: "LARVAE_TESTING",
        larvaeTesting: {
          larvaeTesting: inpData.larvaTesting,
        },
        fruitFlowStages: currentVal.fruitFlowConfig,
      };

      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50007/api/v1.0/fruit-flow`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          })
          .then((response) => resolve(response))
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
                    .createLarvaeTestingDetailsAPICall(serviceId, inpData)
                    .then((resolvedData) => resolve(resolvedData))
                    .catch((error) => reject(error));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    createRejectLotAPI(serviceId, inpData) {
      let currentVal = this;
      const data = {
        id: serviceId,
        status: inpData.status,
        rejectedOn: moment().utc().format("YYYY-MM-DDTHH:mm:ss").toString(),
        rejectReason: inpData.rejectReason,
        rejectAddionalNote: "",
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50009/api/v1.0/reject-lot`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          })
          .then(function () {
            currentVal
              .checkPenalityAPI(serviceId)
              .then((resolved) => resolve(resolved))
              .catch((error) => reject(error));
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
                    .createRejectLotAPI(serviceId, inpData)
                    .then(function () {
                      currentVal
                        .checkPenalityAPI(serviceId)
                        .then((resolved) => resolve(resolved))
                        .catch((error) => reject(error));
                    });
                });
            } else {
              reject(error);
            }
          });
      });
    },
    getBoxQrCodes(serviceId) {
      var currentValue = this;
      currentValue.boxQrCodes = [];
      firebase
        .database()
        .ref("boxes/")
        .orderByValue()
        .equalTo(serviceId + "--T")
        .on("child_added", function (snapshot) {
          currentValue.boxQrCodes.push(snapshot.key);
        });
    },
    getFruitQrCodes(serviceId) {
      var currentValue = this;
      currentValue.fruitsQRCodes = [];
      // firebase
      //   .database()
      //   .ref("fruits/")
      //   .orderByValue()
      //   .equalTo(serviceId)
      //   .on("child_added", function (snapshot) {
      //     currentValue.fruitsQRCodes.push(snapshot.key);
      //   });
      currentValue.boxQrCodes = [];
      firebase
        .database()
        .ref()
        .child("serviceRequest/")
        .orderByChild("serviceRequestId")
        .equalTo(serviceId)
        .on("child_added", (snapshot) => {
          console.log(snapshot.val());
          if (snapshot.val().cartonFillingAndPalletizingData) {
            let cartonFillingAndPalletizingData =
              snapshot.val().cartonFillingAndPalletizingData;
            currentValue.cartonFillingAndPalletizingFirebaseArray =
              snapshot.val().cartonFillingAndPalletizingData;
            cartonFillingAndPalletizingData.forEach((item) => {
              let fruitQrcodeletter = item.startQRCodeFruits.replace(
                /[0-9]/g,
                ""
              );

              let boxQrcodeletter = item.startQRCodeBoxes.replace(/[0-9]/g, "");

              var fruitStartCount = item.startQRCodeFruits.match(/\d/g);
              fruitStartCount = fruitStartCount.join("");

              var boxStartCount = item.startQRCodeBoxes.match(/\d/g);
              boxStartCount = boxStartCount.join("");

              var fruitEndCount = item.endQRCodeFruits.match(/\d/g);
              fruitEndCount = fruitEndCount.join("");

              var boxEndCount = item.endQRCodeBoxes.match(/\d/g);
              boxEndCount = boxEndCount.join("");

              let _fruitQRCodes = currentValue.generateQRArray(
                Number(fruitStartCount),
                Number(fruitEndCount),
                fruitQrcodeletter,
                Number(item.startQRCodeFruits.length - 2)
              );

              let _boxQRCodes = currentValue.generateQRArray(
                Number(boxStartCount),
                Number(boxEndCount),
                boxQrcodeletter,
                Number(item.startQRCodeBoxes.length - 2)
              );

              console.log("#################");
              console.log(_fruitQRCodes);
              _fruitQRCodes.forEach((code) => {
                currentValue.fruitsQRCodes.push(code);
              });
              console.log("#################");
              console.log(_boxQRCodes);
              _boxQRCodes.forEach((code) => {
                currentValue.boxQrCodes.push(code);
              });
            });
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
          .post(`${getConfigVars().BASE_URL}50011/api/v1.0/penalties`, data, {
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
                    .checkPenalityAPI(serviceId)
                    .then((res) => resolve(res))
                    .catch((error) => reject(error));
                });
            } else {
              reject(error);
            }
          });
      });
    },

    getFruitFlowConfig() {
      const vm = this;
      vm.fruitFlowConfig = null;
      vm.seen = true;
      let ref = null;
      let timeout = setTimeout(() => {
        if (vm.fruitFlowConfig == null) {
          firebase
            .database()
            .ref()
            .child("masters")
            .child(`fruits/master/${vm.fruitFlowConfigFruit}`)
            .on("value", (snapshot) => {
              console.log(snapshot.val());
              vm.fruitFlowConfig = snapshot.val();
              let config = snapshot.val();
              // setting labels
              if (
                vm.fruitFlowConfig.larvaeTesting.mandatory == true ||
                vm.fruitFlowConfig.larvaeTesting.mandatory == "true"
              ) {
                vm.larvaeTestingLabel = "Larvae Testing *";
              } else {
                vm.larvaeTestingLabel = "Larvae Testing";
              }

              if (
                vm.fruitFlowConfig.temperatureMeasurement.mandatory == true ||
                vm.fruitFlowConfig.temperatureMeasurement.mandatory == "true"
              ) {
                vm.temperatureMeasurementLabel = "Temperature Measurement *";
              } else {
                vm.temperatureMeasurementLabel = "Temperature Measurement";
              }

              if (
                vm.fruitFlowConfig.qualityInspection.mandatory == true ||
                vm.fruitFlowConfig.qualityInspection.mandatory == "true"
              ) {
                vm.qualityInspectionLabel = "Quality Inspection *";
              } else {
                vm.qualityInspectionLabel = "Quality Inspection";
              }

              if (
                vm.fruitFlowConfig.cleaningAndTrimming.mandatory == true ||
                vm.fruitFlowConfig.cleaningAndTrimming.mandatory == "true"
              ) {
                vm.cleaningAndTrimmingLabel = "Cleaning & Trimming *";
              } else {
                vm.cleaningAndTrimmingLabel = "Cleaning & Trimming";
              }

              if (
                vm.fruitFlowConfig.fruitWashing.mandatory == true ||
                vm.fruitFlowConfig.fruitWashing.mandatory == "true"
              ) {
                vm.fruitWashingLabel = "Fruit Washing *";
              } else {
                vm.fruitWashingLabel = "Fruit Washing";
              }

              if (
                vm.fruitFlowConfig.sizing.mandatory == true ||
                vm.fruitFlowConfig.sizing.mandatory == "true"
              ) {
                vm.firstSizingLabel = "Sizing *";
              } else {
                vm.firstSizingLabel = "Sizing";
              }

              if (
                vm.fruitFlowConfig.hotWaterTreatmentEntry.mandatory == true ||
                vm.fruitFlowConfig.hotWaterTreatmentEntry.mandatory == "true"
              ) {
                vm.hotWaterTreatmentEntryLabel = "Hot Water Treatment Entry *";
              } else {
                vm.hotWaterTreatmentEntryLabel = "Hot Water Treatment Entry";
              }

              if (
                vm.fruitFlowConfig.hotWaterTreatmentExit.mandatory == true ||
                vm.fruitFlowConfig.hotWaterTreatmentExit.mandatory == "true"
              ) {
                vm.hotWaterTreatmentExitLabel = "Hot Water Treatment Exit *";
              } else {
                vm.hotWaterTreatmentExitLabel = "Hot Water Treatment Exit";
              }

              if (
                vm.fruitFlowConfig.hydroCoolingEntry.mandatory == true ||
                vm.fruitFlowConfig.hydroCoolingEntry.mandatory == "true"
              ) {
                vm.hydroCoolingEntryLabel = "Hydro Cooling Entry *";
              } else {
                vm.hydroCoolingEntryLabel = "Hydro Cooling Entry";
              }

              if (
                vm.fruitFlowConfig.hydroCoolingExit.mandatory == true ||
                vm.fruitFlowConfig.hydroCoolingExit.mandatory == "true"
              ) {
                vm.hydroCoolingExitLabel = "Hydro Cooling Exit *";
              } else {
                vm.hydroCoolingExitLabel = "Hydro Cooling Exit";
              }

              if (
                vm.fruitFlowConfig.transferToColdStorage.mandatory == true ||
                vm.fruitFlowConfig.transferToColdStorage.mandatory == "true"
              ) {
                vm.transferToColdStorageLabel = "Transfer to Cold Storage *";
              } else {
                vm.transferToColdStorageLabel = "Transfer to Cold Storage";
              }

              if (
                vm.fruitFlowConfig.removalFromColdStorage.mandatory == true ||
                vm.fruitFlowConfig.removalFromColdStorage.mandatory == "true"
              ) {
                vm.removalFromColdStorageLabel = "Removal from Cold Storage *";
              } else {
                vm.removalFromColdStorageLabel = "Removal from Cold Storage";
              }

              if (
                vm.fruitFlowConfig.feedPackingLineConveyorBelt.mandatory ==
                  true ||
                vm.fruitFlowConfig.feedPackingLineConveyorBelt.mandatory ==
                  "true"
              ) {
                vm.feedPackingLineConveyorBeltLabel =
                  "Feed Packing Line Conveyor Belt *";
              } else {
                vm.feedPackingLineConveyorBeltLabel =
                  "Feed Packing Line Conveyor Belt";
              }

              if (
                vm.fruitFlowConfig.grading.mandatory == true ||
                vm.fruitFlowConfig.grading.mandatory == "true"
              ) {
                vm.gradingLabel = "Grading *";
              } else {
                vm.gradingLabel = "Grading";
              }

              if (
                vm.fruitFlowConfig.secondSizing.mandatory == true ||
                vm.fruitFlowConfig.secondSizing.mandatory == "true"
              ) {
                vm.secondSizingLabel = "Sizing *";
              } else {
                vm.secondSizingLabel = "Sizing";
              }

              if (
                vm.fruitFlowConfig.cartonFillingAndPalletizing.mandatory ==
                  true ||
                vm.fruitFlowConfig.cartonFillingAndPalletizing.mandatory ==
                  "true"
              ) {
                vm.cartonFillingAndPalletizingLabel = "Carton Filling *";
              } else {
                vm.cartonFillingAndPalletizingLabel = "Carton Filling";
              }

              if (
                vm.fruitFlowConfig.temperatureReadingPackedLot.mandatory ==
                  true ||
                vm.fruitFlowConfig.temperatureReadingPackedLot.mandatory ==
                  "true"
              ) {
                vm.temperatureReadingsForPackedLotLabel =
                  "Temperature Readings for Packed Lot *";
              } else {
                vm.temperatureReadingsForPackedLotLabel =
                  "Temperature Readings for Packed Lot";
              }

              if (
                vm.fruitFlowConfig.forcedAirCoolingEntry.mandatory == true ||
                vm.fruitFlowConfig.forcedAirCoolingEntry.mandatory == "true"
              ) {
                vm.forcedAirCoolingEntryLabel = "Forced Air Cooling Entry *";
              } else {
                vm.forcedAirCoolingEntryLabel = "Forced Air Cooling Entry";
              }

              if (
                vm.fruitFlowConfig.removalFromForcedAirCooling.mandatory ==
                  true ||
                vm.fruitFlowConfig.removalFromForcedAirCooling.mandatory ==
                  "true"
              ) {
                vm.removalFromForcedAirCoolingLabel =
                  "Removal from Forced Air Cooling *";
              } else {
                vm.removalFromForcedAirCoolingLabel =
                  "Removal from Forced Air Cooling";
              }

              if (
                vm.fruitFlowConfig.coldRoomStorageIn.mandatory == true ||
                vm.fruitFlowConfig.coldRoomStorageIn.mandatory == "true"
              ) {
                vm.coldRoomStorageInLabel = "Cold Room Storage In *";
              } else {
                vm.coldRoomStorageInLabel = "Cold Room Storage In";
              }

              if (
                vm.fruitFlowConfig.coldRoomStorageOut.mandatory == true ||
                vm.fruitFlowConfig.coldRoomStorageOut.mandatory == "true"
              ) {
                vm.coldRoomStorageOutLabel = "Cold Room Storage Out *";
              } else {
                vm.coldRoomStorageOutLabel = "Cold Room Storage Out";
              }

              if (
                vm.fruitFlowConfig.uploadProductCertifications.mandatory ==
                  true ||
                vm.fruitFlowConfig.uploadProductCertifications.mandatory ==
                  "true"
              ) {
                vm.uploadProductCertificationsLabel =
                  "Upload Product Certifications *";
              } else {
                vm.uploadProductCertificationsLabel =
                  "Upload Product Certifications";
              }

              if (
                vm.fruitFlowConfig.sampling.mandatory == true ||
                vm.fruitFlowConfig.sampling.mandatory == "true"
              ) {
                vm.samplingLabel = "Sampling *";
              } else {
                vm.samplingLabel = "Sampling";
              }

              if (
                vm.fruitFlowConfig.shippingDetails.mandatory == true ||
                vm.fruitFlowConfig.shippingDetails.mandatory == "true"
              ) {
                vm.shippingDetailsLabel = "Shipping Details *";
              } else {
                vm.shippingDetailsLabel = "Shipping Details";
              }

              if (
                vm.fruitFlowConfig.containerInspection.mandatory == true ||
                vm.fruitFlowConfig.containerInspection.mandatory == "true"
              ) {
                vm.containerInspectionLabel = "Container Inspection *";
              } else {
                vm.containerInspectionLabel = "Container Inspection";
              }

              if (
                vm.fruitFlowConfig.preCoolingReefers.mandatory == true ||
                vm.fruitFlowConfig.preCoolingReefers.mandatory == "true"
              ) {
                vm.preCoolingReefersLabel = "Pre-Cooling Reefers *";
              } else {
                vm.preCoolingReefersLabel = "Pre-Cooling Reefers";
              }

              if (
                vm.fruitFlowConfig.coldTunnelLoading.mandatory == true ||
                vm.fruitFlowConfig.coldTunnelLoading.mandatory == "true"
              ) {
                vm.coldTunnelLoadingLabel = "Cold Tunnel Loading *";
              } else {
                vm.coldTunnelLoadingLabel = "Cold Tunnel Loading";
              }

              if (
                vm.fruitFlowConfig.transportDetails.mandatory == true ||
                vm.fruitFlowConfig.transportDetails.mandatory == "true"
              ) {
                vm.transportDetailsLabel = "Transport Details *";
              } else {
                vm.transportDetailsLabel = "Transport Details";
              }

              vm.seen = false;
            });
        }
      }, 3000);
      if (
        localStorage.systemRole == 99 &&
        localStorage.organizationKey == localStorage.emailId
      ) {
        ref = firebase
          .database()
          .ref()
          .child("masters/fruits/master")
          .child(vm.fruitFlowConfigFruit);
      } else {
        ref = firebase
          .database()
          .ref()
          .child("masters/fruits")
          .child(localStorage.organizationKey)
          .child(vm.fruitFlowConfigFruit);
      }
      // firebase
      //   .database()
      //   .ref()
      //   .child("masters")
      //   .child(`fruits/${vm.fruitFlowConfigFruit}`)
      ref.on("value", (snapshot) => {
        console.log(snapshot.val());
        vm.fruitFlowConfig = snapshot.val();
        if (
          vm.fruitFlowConfig.larvaeTesting.mandatory == true ||
          vm.fruitFlowConfig.larvaeTesting.mandatory == "true"
        ) {
          vm.larvaeTestingLabel = "Larvae Testing *";
        } else {
          vm.larvaeTestingLabel = "Larvae Testing";
        }

        if (
          vm.fruitFlowConfig.temperatureMeasurement.mandatory == true ||
          vm.fruitFlowConfig.temperatureMeasurement.mandatory == "true"
        ) {
          vm.temperatureMeasurementLabel = "Temperature Measurement *";
        } else {
          vm.temperatureMeasurementLabel = "Temperature Measurement";
        }

        if (
          vm.fruitFlowConfig.qualityInspection.mandatory == true ||
          vm.fruitFlowConfig.qualityInspection.mandatory == "true"
        ) {
          vm.qualityInspectionLabel = "Quality Inspection *";
        } else {
          vm.qualityInspectionLabel = "Quality Inspection";
        }

        if (
          vm.fruitFlowConfig.cleaningAndTrimming.mandatory == true ||
          vm.fruitFlowConfig.cleaningAndTrimming.mandatory == "true"
        ) {
          vm.cleaningAndTrimmingLabel = "Cleaning & Trimming *";
        } else {
          vm.cleaningAndTrimmingLabel = "Cleaning & Trimming";
        }

        if (
          vm.fruitFlowConfig.fruitWashing.mandatory == true ||
          vm.fruitFlowConfig.fruitWashing.mandatory == "true"
        ) {
          vm.fruitWashingLabel = "Fruit Washing *";
        } else {
          vm.fruitWashingLabel = "Fruit Washing";
        }

        if (
          vm.fruitFlowConfig.sizing.mandatory == true ||
          vm.fruitFlowConfig.sizing.mandatory == "true"
        ) {
          vm.firstSizingLabel = "Sizing *";
        } else {
          vm.firstSizingLabel = "Sizing";
        }

        if (
          vm.fruitFlowConfig.hotWaterTreatmentEntry.mandatory == true ||
          vm.fruitFlowConfig.hotWaterTreatmentEntry.mandatory == "true"
        ) {
          vm.hotWaterTreatmentEntryLabel = "Hot Water Treatment Entry *";
        } else {
          vm.hotWaterTreatmentEntryLabel = "Hot Water Treatment Entry";
        }

        if (
          vm.fruitFlowConfig.hotWaterTreatmentExit.mandatory == true ||
          vm.fruitFlowConfig.hotWaterTreatmentExit.mandatory == "true"
        ) {
          vm.hotWaterTreatmentExitLabel = "Hot Water Treatment Exit *";
        } else {
          vm.hotWaterTreatmentExitLabel = "Hot Water Treatment Exit";
        }

        if (
          vm.fruitFlowConfig.hydroCoolingEntry.mandatory == true ||
          vm.fruitFlowConfig.hydroCoolingEntry.mandatory == "true"
        ) {
          vm.hydroCoolingEntryLabel = "Hydro Cooling Entry *";
        } else {
          vm.hydroCoolingEntryLabel = "Hydro Cooling Entry";
        }

        if (
          vm.fruitFlowConfig.hydroCoolingExit.mandatory == true ||
          vm.fruitFlowConfig.hydroCoolingExit.mandatory == "true"
        ) {
          vm.hydroCoolingExitLabel = "Hydro Cooling Exit *";
        } else {
          vm.hydroCoolingExitLabel = "Hydro Cooling Exit";
        }

        if (
          vm.fruitFlowConfig.transferToColdStorage.mandatory == true ||
          vm.fruitFlowConfig.transferToColdStorage.mandatory == "true"
        ) {
          vm.transferToColdStorageLabel = "Transfer to Cold Storage *";
        } else {
          vm.transferToColdStorageLabel = "Transfer to Cold Storage";
        }

        if (
          vm.fruitFlowConfig.removalFromColdStorage.mandatory == true ||
          vm.fruitFlowConfig.removalFromColdStorage.mandatory == "true"
        ) {
          vm.removalFromColdStorageLabel = "Removal from Cold Storage *";
        } else {
          vm.removalFromColdStorageLabel = "Removal from Cold Storage";
        }

        if (
          vm.fruitFlowConfig.feedPackingLineConveyorBelt.mandatory == true ||
          vm.fruitFlowConfig.feedPackingLineConveyorBelt.mandatory == "true"
        ) {
          vm.feedPackingLineConveyorBeltLabel =
            "Feed Packing Line Conveyor Belt *";
        } else {
          vm.feedPackingLineConveyorBeltLabel =
            "Feed Packing Line Conveyor Belt";
        }

        if (
          vm.fruitFlowConfig.grading.mandatory == true ||
          vm.fruitFlowConfig.grading.mandatory == "true"
        ) {
          vm.gradingLabel = "Grading *";
        } else {
          vm.gradingLabel = "Grading";
        }

        if (
          vm.fruitFlowConfig.secondSizing.mandatory == true ||
          vm.fruitFlowConfig.secondSizing.mandatory == "true"
        ) {
          vm.secondSizingLabel = "Sizing *";
        } else {
          vm.secondSizingLabel = "Sizing";
        }

        if (
          vm.fruitFlowConfig.cartonFillingAndPalletizing.mandatory == true ||
          vm.fruitFlowConfig.cartonFillingAndPalletizing.mandatory == "true"
        ) {
          vm.cartonFillingAndPalletizingLabel = "Carton Filling *";
        } else {
          vm.cartonFillingAndPalletizingLabel = "Carton Filling";
        }

        if (
          vm.fruitFlowConfig.temperatureReadingPackedLot.mandatory == true ||
          vm.fruitFlowConfig.temperatureReadingPackedLot.mandatory == "true"
        ) {
          vm.temperatureReadingsForPackedLotLabel =
            "Temperature Readings for Packed Lot *";
        } else {
          vm.temperatureReadingsForPackedLotLabel =
            "Temperature Readings for Packed Lot";
        }

        if (
          vm.fruitFlowConfig.forcedAirCoolingEntry.mandatory == true ||
          vm.fruitFlowConfig.forcedAirCoolingEntry.mandatory == "true"
        ) {
          vm.forcedAirCoolingEntryLabel = "Forced Air Cooling Entry *";
        } else {
          vm.forcedAirCoolingEntryLabel = "Forced Air Cooling Entry";
        }

        if (
          vm.fruitFlowConfig.removalFromForcedAirCooling.mandatory == true ||
          vm.fruitFlowConfig.removalFromForcedAirCooling.mandatory == "true"
        ) {
          vm.removalFromForcedAirCoolingLabel =
            "Removal from Forced Air Cooling *";
        } else {
          vm.removalFromForcedAirCoolingLabel =
            "Removal from Forced Air Cooling";
        }

        if (
          vm.fruitFlowConfig.coldRoomStorageIn.mandatory == true ||
          vm.fruitFlowConfig.coldRoomStorageIn.mandatory == "true"
        ) {
          vm.coldRoomStorageInLabel = "Cold Room Storage In *";
        } else {
          vm.coldRoomStorageInLabel = "Cold Room Storage In";
        }

        if (
          vm.fruitFlowConfig.coldRoomStorageOut.mandatory == true ||
          vm.fruitFlowConfig.coldRoomStorageOut.mandatory == "true"
        ) {
          vm.coldRoomStorageOutLabel = "Cold Room Storage Out *";
        } else {
          vm.coldRoomStorageOutLabel = "Cold Room Storage Out";
        }

        if (
          vm.fruitFlowConfig.uploadProductCertifications.mandatory == true ||
          vm.fruitFlowConfig.uploadProductCertifications.mandatory == "true"
        ) {
          vm.uploadProductCertificationsLabel =
            "Upload Product Certifications *";
        } else {
          vm.uploadProductCertificationsLabel = "Upload Product Certifications";
        }

        if (
          vm.fruitFlowConfig.sampling.mandatory == true ||
          vm.fruitFlowConfig.sampling.mandatory == "true"
        ) {
          vm.samplingLabel = "Sampling *";
        } else {
          vm.samplingLabel = "Sampling";
        }

        if (
          vm.fruitFlowConfig.shippingDetails.mandatory == true ||
          vm.fruitFlowConfig.shippingDetails.mandatory == "true"
        ) {
          vm.shippingDetailsLabel = "Shipping Details *";
        } else {
          vm.shippingDetailsLabel = "Shipping Details";
        }

        if (
          vm.fruitFlowConfig.containerInspection.mandatory == true ||
          vm.fruitFlowConfig.containerInspection.mandatory == "true"
        ) {
          vm.containerInspectionLabel = "Container Inspection *";
        } else {
          vm.containerInspectionLabel = "Container Inspection";
        }

        if (
          vm.fruitFlowConfig.preCoolingReefers.mandatory == true ||
          vm.fruitFlowConfig.preCoolingReefers.mandatory == "true"
        ) {
          vm.preCoolingReefersLabel = "Pre-Cooling Reefers *";
        } else {
          vm.preCoolingReefersLabel = "Pre-Cooling Reefers";
        }

        if (
          vm.fruitFlowConfig.coldTunnelLoading.mandatory == true ||
          vm.fruitFlowConfig.coldTunnelLoading.mandatory == "true"
        ) {
          vm.coldTunnelLoadingLabel = "Cold Tunnel Loading *";
        } else {
          vm.coldTunnelLoadingLabel = "Cold Tunnel Loading";
        }

        if (
          vm.fruitFlowConfig.transportDetails.mandatory == true ||
          vm.fruitFlowConfig.transportDetails.mandatory == "true"
        ) {
          vm.transportDetailsLabel = "Transport Details *";
        } else {
          vm.transportDetailsLabel = "Transport Details";
        }

        if (vm.fruitFlowConfig != null) {
          clearTimeout(timeout);
        }
        vm.seen = false;
      });
    },
    checkStageValidations() {
      const vm = this;
      if (
        vm.fruitFlowConfig.larvaeTesting.mandatory == true ||
        vm.fruitFlowConfig.larvaeTesting.mandatory == "true"
      ) {
        if (!vm.larvaeSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.temperatureMeasurement.mandatory == true ||
        vm.fruitFlowConfig.temperatureMeasurement.mandatory == "true"
      ) {
        if (!vm.temperatureMeasurementSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.qualityInspection.mandatory == true ||
        vm.fruitFlowConfig.qualityInspection.mandatory == "true"
      ) {
        if (!vm.qualityInspectionSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.hotWaterTreatmentEntry.mandatory == true ||
        vm.fruitFlowConfig.hotWaterTreatmentEntry.mandatory == "true"
      ) {
        if (!vm.hotWaterTreatmentEntrySavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.hotWaterTreatmentExit.mandatory == true ||
        vm.fruitFlowConfig.hotWaterTreatmentExit.mandatory == "true"
      ) {
        if (!vm.hotWaterTreatmentExitSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.hydroCoolingEntry.mandatory == true ||
        vm.fruitFlowConfig.hydroCoolingEntry.mandatory == "true"
      ) {
        if (!vm.hydroCoolingEntrySavedFlag) {
          return false;
        }
      }
      if (
        ((vm.fruitFlowConfig.hydroCoolingExit.mandatory == true) ==
          vm.fruitFlowConfig.hydroCoolingExit.mandatory) ==
        "true"
      ) {
        if (!vm.hydroCoolingExitSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.uploadProductCertifications.mandatory == true ||
        vm.fruitFlowConfig.uploadProductCertifications.mandatory == "true"
      ) {
        if (!vm.unloadProductCertificationSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.cleaningAndTrimming.mandatory == true ||
        vm.fruitFlowConfig.cleaningAndTrimming.mandatory == "true"
      ) {
        if (!vm.cleaningTrimmingSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.sizing.mandatory == true ||
        vm.fruitFlowConfig.sizing.mandatory == "true"
      ) {
        if (!vm.firstSizingSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.fruitWashing.mandatory == true ||
        vm.fruitFlowConfig.fruitWashing.mandatory == "true"
      ) {
        if (!vm.fruitWashingSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.transferToColdStorage.mandatory == true ||
        vm.fruitFlowConfig.transferToColdStorage.mandatory == "true"
      ) {
        if (!vm.tranferColdStorageSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.removalFromColdStorage.mandatory == true ||
        vm.fruitFlowConfig.removalFromColdStorage.mandatory == "true"
      ) {
        if (!vm.removalColdStorageSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.feedPackingLineConveyorBelt.mandatory == true ||
        vm.fruitFlowConfig.feedPackingLineConveyorBelt.mandatory == "true"
      ) {
        if (!vm.feedPackingLineConveyorBeltSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.grading.mandatory == true ||
        vm.fruitFlowConfig.grading.mandatory == "true"
      ) {
        if (!vm.gradingSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.secondSizing.mandatory == true ||
        vm.fruitFlowConfig.secondSizing.mandatory == "true"
      ) {
        if (!vm.secondSizingSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.cartonFillingAndPalletizing.mandatory == true ||
        vm.fruitFlowConfig.cartonFillingAndPalletizing.mandatory == "true"
      ) {
        if (!vm.cartonFillingPalletizingSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.temperatureReadingPackedLot.mandatory == true ||
        vm.fruitFlowConfig.temperatureReadingPackedLot.mandatory == "true"
      ) {
        if (!vm.temperatureReadingPackedLotSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.forcedAirCoolingEntry.mandatory == true ||
        vm.fruitFlowConfig.forcedAirCoolingEntry.mandatory == "true"
      ) {
        if (!vm.forcedAirCoolingEntrySavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.removalFromColdStorage.mandatory == true ||
        vm.fruitFlowConfig.removalFromColdStorage.mandatory == "true"
      ) {
        if (!vm.removalColdStorageSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.coldRoomStorageIn.mandatory == true ||
        vm.fruitFlowConfig.coldRoomStorageIn.mandatory == "true"
      ) {
        if (!vm.coldRoomStorageInSavedFlag) {
          return false;
        }
      }
      if (
        vm.fruitFlowConfig.coldRoomStorageOut.mandatory == true ||
        vm.fruitFlowConfig.coldRoomStorageOut.mandatory == "true"
      ) {
        if (!vm.coldRoomStorageOutSavedFlag) {
          return false;
        }
      }
      if (vm.shippingDetails == "Shipment by Sea (US$ 1.22/kg)") {
        if (
          vm.fruitFlowConfig.sampling.mandatory == true ||
          vm.fruitFlowConfig.sampling.mandatory == "true"
        ) {
          if (!vm.samplingSavedFlag) {
            return false;
          }
        }
        if (
          vm.fruitFlowConfig.containerInspection.mandatory == true ||
          vm.fruitFlowConfig.containerInspection.mandatory == "true"
        ) {
          if (!vm.containerInspectionSavedFlag) {
            return false;
          }
        }
        if (
          vm.fruitFlowConfig.preCoolingReefers.mandatory == true ||
          vm.fruitFlowConfig.preCoolingReefers.mandatory == "true"
        ) {
          if (!vm.preCoolingReeferSavedFlag) {
            return false;
          }
        }
        if (
          vm.fruitFlowConfig.coldTunnelLoading.mandatory == true ||
          vm.fruitFlowConfig.coldTunnelLoading.mandatory == "true"
        ) {
          if (!vm.coldTunnelLoadingSavedFlag) {
            return false;
          }
        }
      }
      if (
        vm.fruitFlowConfig.shippingDetails.mandatory == true ||
        vm.fruitFlowConfig.shippingDetails.mandatory == "true"
      ) {
        if (!vm.shippingSavedFlag) {
          return false;
        }
      }
      // if (vm.fruitFlowConfig.transportDetails.mandatory == true) {
      //   if (vm.transportSavedFlag != true) {
      //     return false;
      //   }
      // }
      return true;
    },
    getFruit(fruit) {
      if (fruit == "Avocado" || fruit == "Avocat" || fruit == "Zaboka") {
        return "Avocado";
      } else if (fruit == "Mango" || fruit == "Mangue") {
        return "Mango";
      } else if (
        fruit == "Pineapple" ||
        fruit == "Ananas" ||
        fruit == "Anana"
      ) {
        return "Pineapple";
      } else {
        return "Invalid Fruit";
      }
    },
    addMoreQRCodes() {
      const currentValue = this;
      if (
        currentValue.fruitFlowConfig.cartonFillingAndPalletizing
          .startQRCodeFruits == true ||
        currentValue.fruitFlowConfig.cartonFillingAndPalletizing
          .startQRCodeFruits == "true"
      ) {
        if (
          this.startQRCodeFruits == null ||
          this.startQRCodeFruits == "" ||
          this.startQRCodeFruits == undefined ||
          !this.startQRCodeFruits
        ) {
          currentValue.seen = false;
          Vue.$toast.open({
            message: currentValue.$t(
              "Please fill in fruits start QR Code",
              "Please fill in fruits start QR Code"
            ),
            type: "error",
            position: "top",
          });
          return;
        }
      }
      if (
        currentValue.fruitFlowConfig.cartonFillingAndPalletizing
          .endQRCodeFruits == true ||
        currentValue.fruitFlowConfig.cartonFillingAndPalletizing
          .endQRCodeFruits == "true"
      ) {
        if (
          this.endQRCodeFruits == null ||
          this.endQRCodeFruits == "" ||
          this.endQRCodeFruits == undefined ||
          !this.endQRCodeFruits
        ) {
          currentValue.seen = false;
          Vue.$toast.open({
            message: currentValue.$t(
              "Please fill in fruits end QR Code",
              "Please fill in fruits end QR Code"
            ),
            type: "error",
            position: "top",
          });
          return;
        }
      }

      if (
        currentValue.fruitFlowConfig.cartonFillingAndPalletizing
          .startQRCodeBox == true ||
        currentValue.fruitFlowConfig.cartonFillingAndPalletizing
          .startQRCodeBox == "true"
      ) {
        if (
          this.startQRCodeBoxes == null ||
          this.startQRCodeBoxes == "" ||
          this.startQRCodeBoxes == undefined ||
          !this.startQRCodeBoxes
        ) {
          currentValue.seen = false;
          Vue.$toast.open({
            message: currentValue.$t(
              "Please fill in box start QR Code",
              "Please fill in box start QR Code"
            ),
            type: "error",
            position: "top",
          });
          return;
        }
      }
      if (
        currentValue.fruitFlowConfig.cartonFillingAndPalletizing.endQRCodeBox ==
          true ||
        currentValue.fruitFlowConfig.cartonFillingAndPalletizing.endQRCodeBox ==
          "true"
      ) {
        if (
          this.endQRCodeBoxes == null ||
          this.endQRCodeBoxes == "" ||
          this.endQRCodeBoxes == undefined ||
          !this.endQRCodeBoxes
        ) {
          currentValue.seen = false;
          Vue.$toast.open({
            message: currentValue.$t(
              "Please fill in box end QR Code",
              "Please fill in box end QR Code"
            ),
            type: "error",
            position: "top",
          });
          return;
        }
      }

      if (this.selectedBoxSize == null) {
        return;
      }

      if (
        this.startQRCodeFruits.trim().length ==
        this.endQRCodeFruits.trim().length
      ) {
        if (
          this.startQRCodeBoxes.trim().length ==
          this.endQRCodeBoxes.trim().length
        ) {
          // currentValue.palletQRCodes = [];
          // currentValue.boxQrCodes = [];
          // currentValue.fruitsQRCodes = [];

          var startQRCodeFruitsCount = this.startQRCodeFruits.match(/\d/g);
          startQRCodeFruitsCount = startQRCodeFruitsCount.join("");

          var endQRCodeFruitsCount = this.endQRCodeFruits.match(/\d/g);
          endQRCodeFruitsCount = endQRCodeFruitsCount.join("");

          var startQRCodeBoxesCount = this.startQRCodeBoxes.match(/\d/g);
          startQRCodeBoxesCount = startQRCodeBoxesCount.join("");

          var endQRCodeBoxesCount = this.endQRCodeBoxes.match(/\d/g);
          endQRCodeBoxesCount = endQRCodeBoxesCount.join("");

          var fruitsQRCodeLetters = this.startQRCodeFruits.replace(
            /[0-9]/g,
            ""
          );
          var boxQRCodeLetters = this.startQRCodeBoxes.replace(/[0-9]/g, "");

          this.globalTotalBoxes =
            Number(endQRCodeBoxesCount) - Number(startQRCodeBoxesCount) + 1;

          // number of boxes
          this.boxCount = this.globalTotalBoxes;

          // number of fruits
          currentValue.fruitsCount =
            Number(endQRCodeFruitsCount) - Number(startQRCodeFruitsCount) + 1;

          // box size
          const boxSize = Number(currentValue.fruitsCount / this.boxCount);

          const obj = {
            startQRCodeBoxes: this.startQRCodeBoxes,
            endQRCodeBoxes: this.endQRCodeBoxes,
            startQRCodeFruits: this.startQRCodeFruits,
            endQRCodeFruits: this.endQRCodeFruits,
            boxSize: this.selectedBoxSize,
            avgWeight: currentValue.avgWeightPerBox,
          };

          currentValue.cartonFillingAndPalletizingArray.push(obj);

          console.log(currentValue.cartonFillingAndPalletizingArray);
          let newFruitQRCodes = currentValue.generateQRArray(
            Number(startQRCodeFruitsCount),
            Number(endQRCodeFruitsCount),
            fruitsQRCodeLetters,
            Number(this.startQRCodeFruits.length - 2)
          );
          currentValue.fruitsQRCodes =
            currentValue.fruitsQRCodes.concat(newFruitQRCodes);
          const _boxQrCodes = currentValue.generateQRArray(
            Number(startQRCodeBoxesCount),
            Number(endQRCodeBoxesCount),
            boxQRCodeLetters,
            Number(this.startQRCodeBoxes.length - 2)
          );

          currentValue.boxQrCodes = currentValue.boxQrCodes.concat(_boxQrCodes);

          let inpData = {
            startQRCodeBoxes: currentValue.startQRCodeBoxes,
            endQRCodeBoxes: currentValue.endQRCodeBoxes,
            startQRCodeFruits: currentValue.startQRCodeFruits,
            endQRCodeFruits: currentValue.endQRCodeFruits,
            updatedBy: localStorage.userName,
            boxSize: currentValue.selectedBoxSize,
            boxQRCodes: _boxQrCodes,
            avgWeight: currentValue.avgWeightPerBox,
          };
          const expectedBoxes = Math.ceil(
            newFruitQRCodes.length / currentValue.selectedBoxSize
          );
          if (_boxQrCodes.length == expectedBoxes) {
            currentValue.cartonFillingAndPalletizingFirebaseArray.push(inpData);

            currentValue.seen = false;
            Vue.$toast.open({
              message: currentValue.$t(
                "Carton Filling details added.",
                "Carton Filling details added"
              ),
              type: "success",
              position: "top",
            });

            currentValue.startQRCodeBoxes = null;
            currentValue.endQRCodeBoxes = null;
            currentValue.startQRCodeFruits = null;
            currentValue.endQRCodeFruits = null;
            currentValue.selectedBoxSize = null;
          } else {
            currentValue.seen = false;
            Vue.$toast.open({
              message: currentValue.$t(
                "The entered fruit and box qr codes are not matching with the selected fruits per box count",
                "The entered fruit and box qr codes are not matching with the selected fruits per box count"
              ),
              type: "error",
              position: "top",
            });
          }
        } else {
          currentValue.seen = false;
          Vue.$toast.open({
            message: currentValue.$t(
              "Box start and end QR Code length must be same.",
              "Box start and end QR Code length must be same."
            ),
            position: "top",
            type: "error",
          });
        }
      } else {
        currentValue.seen = false;
        Vue.$toast.open({
          message: currentValue.$t(
            "Fruit start and end QR Code length must be same.",
            "Fruit start and end QR Code length must be same."
          ),
          position: "top",
          type: "error",
        });
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
    deleteItem(index) {
      const vm = this;
      vm.cartonFillingAndPalletizingFirebaseArray.splice(index, 1);
    },
    editItem(item, index) {
      const vm = this;
      vm.selectedBoxSize = item.boxSize;
      vm.startQRCodeFruits = item.startQRCodeFruits;
      vm.endQRCodeFruits = item.endQRCodeFruits;
      vm.startQRCodeBoxes = item.startQRCodeBoxes;
      vm.endQRCodeBoxes = item.endQRCodeBoxes;

      vm.cartonFillingAndPalletizingFirebaseArray.splice(index, 1);
    },
    getAvgWeightAndShipementRates(fruit) {
      const vm = this;
      vm.avgWeightPerBox = null;
      vm.shipmentByAir = null;
      vm.shipmentBySea = null;

      firebase
        .database()
        .ref()
        .child("masters")
        .child("product")
        .child(fruit)
        .on("value", (snapshot) => {
          console.log(snapshot.val());
          if (snapshot.val() != null) {
            vm.avgWeightPerBox = snapshot.val().avgWeightPerBox;
            vm.shipmentByAir = snapshot.val().shipmentByAir;
            vm.shipmentBySea = snapshot.val().shipmentBySea;
          }
        });
    },
  },
};
</script>
<style scoped>
.hotwatertreatment .vdatetime-input {
  margin: 0 !important;
}
.hotwatertreatment .vdatetime {
  float: left;
  width: 100%;
  margin-left: 9px;
}
.hydrocoolingexit .vdatetime-input {
  margin: 0 !important;
}
.hydrocoolingexit .vdatetime {
  float: left;
  width: 100%;
  margin-left: 9px;
}
.time-of-admittence {
  width: 100% !important;
}
.prefixCurrency {
  color: #fff;
}
.pref {
  margin-top: 9px;
  font-size: 15px;
  padding-right: 1px;
  font-weight: bolder;
}
.pref input {
  margin-left: 2px !important;
}
</style>
<style>
.btn-add-more {
  margin: 20px !important;
}
.carton-conatiner .vs__dropdown-menu {
  background: #000 !important;
  color: #fff !important;
}
.carton-conatiner .vs__dropdown-option {
  color: #fff !important;
}
.carton-conatiner .vs__dropdown-option--highlight {
  background: #34342e !important;
  color: #fff !important;
}
.carton-conatiner table {
  margin: 20px !important;
}
.edit-delete-img {
  width: 15px;
  height: auto;
  cursor: pointer;
  margin: 5px;
}
.view-bar-img {
  background: #fff;
  width: 20px;
  height: auto;
  cursor: pointer;
  margin: 5px;
}
.carton-conatiner .vs__selected {
  color: #fff !important;
}
.carton-conatiner .vs__dropdown-toggle {
  width: 110px !important;
}
.carton-conatiner {
  overflow-x: auto;
  overflow-y: hidden;
}
.carton-conatiner th,
.carton-conatiner td {
  color: #fff;
  font-weight: 500;
  font-size: 12px;
}

#scanner-modal-lots .modal-header {
  height: 50px !important;
}
#scanner-modal-lots .modal-header .close {
  margin-top: -12px !important;
}
#scanner-modal-lots .modal-header h5 {
  margin: -10px auto !important;
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
#qrcode-view-modal .modal-header {
  height: 50px !important;
}
#qrcode-view-modal .modal-header .close {
  margin-top: -12px !important;
}
#qrcode-view-modal .modal-header h5 {
  margin: -10px auto !important;
}
#save-previous-confirm-modal .modal-header {
  height: 50px !important;
}
#save-previous-confirm-modal .modal-header .close {
  margin-top: -12px !important;
}
#save-previous-confirm-modal .modal-header h5 {
  margin: -10px auto !important;
}
#fruit-flow-modal .modal-header {
  height: 50px !important;
}
#fruit-flow-modal .modal-header .close {
  margin-top: -12px !important;
}
#fruit-flow-modal .modal-header h5 {
  margin: -10px auto !important;
}
#failed-larvae-testing-confirm-modal .modal-header {
  height: 50px !important;
}
#failed-larvae-testing-confirm-modal .modal-header .close {
  margin-top: -12px !important;
}
#failed-larvae-testing-confirm-modal .modal-header h5 {
  margin: -10px auto !important;
}
.lots-at-packhouse-table thead tr th,
.lots-at-packhouse-table tbody tr td {
  text-align: left !important;
}
.lots-at-packhouse-table thead tr th {
  font-weight: bold;
}
.lots-at-packhouse-table thead tr th:nth-child(7),
.lots-at-packhouse-table tbody tr td:nth-child(7) {
  text-align: center !important;
}
.lots-at-packhouse-table thead tr th:nth-child(6) {
  max-width: 100px;
  text-align: center !important;
}
.lots-at-packhouse-table tbody tr td:nth-child(6) {
  text-align: center !important;
}
.lots-at-packhouse-v-select .vs__dropdown-toggle {
  border: none;
  border-bottom: 1px solid #fff;
  border-radius: 0px;
  margin: 15px 0px 0px 0px !important;
}
.lots-at-packhouse-v-select {
  font-size: 13px;
}
.lots-at-packhouse-v-select span,
.lots-at-packhouse-v-select input,
.lots-at-packhouse-v-select .vs__no-options {
  color: #fff;
}
.lots-at-packhouse-v-select span {
  margin-left: 0px;
  padding-left: 0px;
}
.lots-at-packhouse-v-select .vs__dropdown-menu {
  background: none;
  padding: 0px;
  max-height: 155px;
}
.lots-at-packhouse-v-select .vs__dropdown-option {
  color: #fff;
  padding: 10px;
  background: #1e2318;
}
.lots-at-packhouse-v-select .vs__dropdown-option--highlight {
  background: #000;
}
.lots-at-packhouse-v-select .vs__open-indicator,
.lots-at-packhouse-v-select .vs__clear {
  fill: #fff;
}
.lots-at-packhouse-v-select .vs__selected-options,
.lots-at-packhouse-v-select .vs__search,
.vs__search:focus {
  padding: 0px;
  margin: 0px;
}
.lots-at-packhouse-v-select .vs__dropdown-toggle {
  padding: 0px;
  padding-bottom: 2px;
  margin: 15px 0px;
}
.lots-at-packhouse-v-select .vs__selected {
  margin: 0px;
  padding: 0px;
}
.lots-at-packhouse-v-select .vs__clear {
  margin-top: -10px;
}
.lots-at-packhouse-v-select .vs__open-indicator {
  margin-top: -5px;
}
.v-select-wrap {
  margin: 10px;
}
.lots-at-packhouse-table thead .VueTables__no-results th,
.lots-at-packhouse-table tbody .VueTables__no-results td {
  text-align: center !important;
}
.lots-at-packhouse-table .VueTables__search-field input {
  background: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid !important;
  border-radius: 3px !important;
}
.lots-at-packhouse-table .VueTables__limit-field select {
  background: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid !important;
  border-radius: 3px !important;
}
.transport-wrap .inp-container .col-md-6 {
  padding: 0px 0px;
}
.ps-fruit-flow .input-wrap .text-input {
  margin-bottom: 32px !important;
  height: 26px !important;
}
.ps-fruit-flow .input-wrap .input-label {
  margin-bottom: -8px !important;
}
.transport-wrap .transport-small-input {
  margin-top: 12px;
}
.icon-label {
  width: 60px !important;
}
</style>
<style scoped>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";

label {
  color: #fff !important;
}
.description-container {
  margin: 0 auto !important;
  padding-left: 20px;
}
.former-picture {
  width: 65px;
  margin-top: 30px;
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
  border-top: 0px !important;
}

.content-container-margin {
  height: fit-content;
  margin: auto;
  margin-top: 30px;
}
.ref-logout-lsp {
  font-size: 13px;
  margin-top: -5px;
  text-transform: none !important;
}
.card-body {
  padding: 20px !important;
}
.lbl-username-lsp {
  text-transform: none !important;
  font-size: 13px;
}
.outer-container {
  width: 100%;
  margin: 0 auto !important;
  margin-bottom: 20px !important;
}
.center-text {
  font-size: 35px;
  color: #bfbfbf;
  vertical-align: middle;
  margin: 0 auto;
  margin-top: 130px;
}
.cancel-btn {
  background-color: #43532c;
  border: 1px solid #000;
  padding: 7px 30px 7px 30px;
  color: #fff;
}
.main-container {
  position: relative;
}
.cancel-wrap {
  bottom: 15px;
  right: 15px;
  position: absolute;
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
.radiobtn-wrap > input:checked + img {
  background: url("../../assets/images/tick.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 11px 11px;
}
.description-container {
  width: 70%;
}
.radiobtn-wrap {
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
.input-label {
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  width: 100%;
  padding: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
}
.field-wrap {
  padding: 20px 10px;
  text-align: left;
  width: 40%;
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
.larvae-wrap {
  width: 100%;
  padding: 10px 0px 10px 0px;
  color: #fff;
}
.larvae-rb-img {
  background-color: #fff;
  border-radius: 29px;
  width: 18px;
  height: 18px;
  margin-bottom: 3px;
}
.larvae-wrap > input:checked + img {
  background: url("../../assets/images/black-circle.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 12px 12px;
  background-color: #fff;
}
.fruit-flow-container .text-input {
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  width: 90%;
  background: transparent;
  margin-bottom: 20px;
  height: 36px;
  margin-left: 10px;
  color: #fff;
  font-size: 12px !important;
}
.fruit-flow-container .box-size-text-input {
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  width: 90%;
  background: transparent;
  margin-bottom: 20px;
  height: 36px;
  margin: 20px 0px 0px 0px;
  color: #fff;
  font-size: 12px !important;
}
.larvae-input-wrap {
  padding: 10px 0px 10px 0px;
}
.attach-border {
  border-bottom: 1px solid #ffffff;
  position: absolute;
  width: 56%;
  bottom: 20px;
  margin-left: 10px;
}
.quality-inspection {
  background-image: url(/img/edit_record.45cd3415.png) !important;
  background-position: left !important;
  background-size: 15px !important;
  background-repeat: no-repeat !important;
  padding-left: 25px !important;
  color: #fff !important;
  width: 95%;
}
.input-half-size {
  width: 30%;
  margin-right: 20px;
}
.scroll-body {
  overflow-y: scroll;
  height: 400px;
}
.fruit-washing-input {
  width: 93%;
}
.packing-line-input {
  width: 65%;
}
.field-wrap-quality {
  width: 70%;
}
.weight-input {
  margin-right: 20px;
  width: 40%;
}
.scan-attach {
  width: 60%;
}
.carton-filling-input-wrap {
  margin-bottom: 10px;
}
.field-wrap-carton {
  width: 95%;
}
.container-inspection-border {
  width: 70%;
  bottom: 0px;
}
.sop-border {
  width: 81%;
}
.transport-small-input {
  width: 130px;
}
.text-input-last-child {
  margin-bottom: 10px;
}
.sub-header-close-img {
  width: 16px;
  height: auto;
  float: right;
  /* margin-top: -20px; */
  margin-top: -12px;
  margin-right: 16px;
}
.scan-attach-pallets,
.scan-attach-boxes,
.scan-attach-fruits {
  width: 70%;
  bottom: 0px;
}

@media screen and (max-width: 1063px) and (min-width: 768px) {
  .col-md-6 {
    max-width: 100% !important;
    width: 100% !important;
    flex: 100%;
  }
}
@media screen and (max-width: 1350px) and (min-width: 768px) {
  .field-wrap {
    width: 90%;
  }
  .input-half-size {
    width: 50%;
  }
  .weight-input {
    width: 70%;
  }
  .container-inspection-border,
  .scan-attach-fruits,
  .scan-attach-boxes,
  .scan-attach-pallets {
    width: 80%;
  }
  .container-inspection-div {
    margin-top: 10px;
  }
  .transport-small-input {
    width: 50%;
  }
  .sop-border {
    width: 58%;
  }
  .former-picture {
    margin-top: 75px;
  }
}
@media screen and (max-width: 602px) {
  .content-container-margin {
    margin-top: 30px;
  }
}
@media screen and (max-width: 531px) {
  .service-img-container {
    width: 100%;
    text-align: center;
  }
}
</style>
<style>
@import "../../assets/css/main.css";
.custom-file-label {
  background: transparent;
  border: none;
  border-radius: 0px;
  color: #fff;
  margin-left: 10px;
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
.scan-attach-pallets-div
  .custom-file-input:lang(en)
  ~ .custom-file-label::after {
  content: "Attach PALLETS QR Codes";
  font-size: 12px;
}
.scan-attach-boxes-div .custom-file-input:lang(en) ~ .custom-file-label::after {
  content: "Attach BOXES QR Codes";
  font-size: 12px;
}
.scan-attach-fruits-div
  .custom-file-input:lang(en)
  ~ .custom-file-label::after {
  content: "Attach FRUITS QR Codes";
  font-size: 12px;
}
.container-inspection-div
  .custom-file-input:lang(en)
  ~ .custom-file-label::after {
  content: "Attach Filled Inspection Form";
  font-size: 12px;
}
.attach-sop-div .custom-file-input:lang(en) ~ .custom-file-label::after {
  content: "Upload SOP";
  font-size: 12px;
}
.ps {
  height: 400px;
}
.main-ps {
  height: 495px;
}
.plan-img {
  width: 20px;
  margin-left: 5px;
}
.fruit-flow-container {
  height: 330px;
  margin-bottom: 20px;
}
.fruit-flow-heading {
  height: 53px !important;
}
.button-container {
  float: right;
}
.input-label:focus {
  outline: none;
}
.active {
  color: #8a5d04 !important;
  text-decoration: underline;
  outline: none;
  box-shadow: 0px;
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
.modal-title {
  margin: 0 auto !important;
  color: #fff !important;
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
#fruit-flow-modal .modal-content {
  min-width: 768px;
  max-width: 1000px;
  margin: 0px auto !important;
  width: auto !important;
}
.modal-header {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.modal-header .close {
  color: #fff !important;
  font-size: 2.5rem !important;
  margin: 0 !important;
  padding: 0 !important;
}
.quality-inspection-input-wrap {
  float: left;
}
.scan-qr-input-container {
  clear: both;
}
.inp-container-same-line {
  width: 50%;
  float: left;
}
#currency-dropdown {
  border-color: #fff;
  border-bottom: 1px solid #fff;
  margin-left: 10px;
  margin-bottom: 20px;
}
#currency-dropdown .e-input-group .e-input-group-icon,
#currency-dropdown .e-input-group.e-control-wrapper .e-input-group-icon {
  color: #fff !important;
  border-bottom: 1px solid;
  margin-bottom: 20px;
}
#currency-dropdown_popup {
  margin-top: -20px !important;
  margin-left: 10px;
}
.e-input-group:not(.e-float-icon-left):not(.e-float-input)::before,
.e-input-group:not(.e-float-icon-left):not(.e-float-input)::after {
  background: none !important;
}
#failed-larvae-testing-confirm-modal .modal-content {
  width: 450px;
  margin: 0 auto;
}
.ps-fruit-flow {
  height: 330px !important;
}
.lotsatpackhouse-upload-wrap .uploaded-file-link {
  width: 100%;
  background: rgb(256, 256, 256, 0.1);
  color: #fff;
  margin: 10px 0px;
  float: none;
  padding: 10px;
  list-style-type: none;
  word-break: break-all;
}
.lotsatpackhouse-upload-wrap .uploaded-file-link a {
  color: #fff;
}
.lotsatpackhouse-upload-wrap .upload-file-link-ul {
  padding: 20px 0px 0px 0px !important;
}
.lotsatpackhouse-upload-wrap .download-icon-upload {
  float: right;
}
.temp-measure-inp-container,
.scan-qr-input-container {
  position: relative;
}
.attach-border-temp-measure {
  bottom: 0px !important;
  width: 85% !important;
}
.temp-measure-inp-container .custom-file-label::after {
  width: 20% !important;
  padding: 2px 0px !important;
  text-align: center !important;
}
.scan-qr-inpt-container .custom-file-label::after {
  width: 30% !important;
  padding: 2px 0px !important;
  text-align: center !important;
}
.lotsatpackhouse-upload-wrap {
  padding: 0px 0px 0px 10px;
}
.lotsatpackhouse-upload-wrap .uploaded-image-wrap {
  text-align: center;
}
.lotsatpackhouse-upload-wrap .upload-li {
  width: 50%;
  border-bottom: 1px solid #fff;
  padding-bottom: 10px;
  height: 150px;
}
.lotsatpackhouse-upload-wrap .upload-li:nth-of-type(odd) {
  border-right: 1px solid #fff;
}
.lotsatpackhouse-upload-wrap .upload-li-single:nth-of-type(odd) {
  border-right: none;
}
.lotsatpackhouse-upload-wrap .upload-li:nth-last-child(1),
.lotsatpackhouse-upload-wrap .upload-li:nth-last-child(2) {
  border-bottom: none;
}
.lotsatpackhouse-upload-wrap img {
  max-height: 70px;
  max-width: 70px;
}
.lotsatpackhouse-upload-wrap .upload-li-single {
  width: 100%;
}
.unload-input-wrap {
  float: left;
  width: 90%;
}
#scanner-modal-lots .modal-content {
  width: 500px;
  margin: 0 auto;
}
.scanner-scroll {
  padding: 30px 30px 20px 30px;
  height: 400px;
}
#scanner-modal-lots .btn-save {
  margin-bottom: 30px;
}
#scanner-modal-lots .modal-body {
  padding: 0px;
  text-align: center;
}
#qr-code-coantainer {
  margin: 0 auto;
  text-align: center;
}
.lots-at-packhouse-mandatory-warning {
  position: absolute;
  bottom: 44px;
  font-size: 13px;
  color: #fff;
  padding-left: 15px;
}
.fruit-flow-container .custom-file {
  display: block;
}
@media screen and (max-width: 1350px) and (min-width: 768px) {
  .scan-attach-pallets-div
    .custom-file-input:lang(en)
    ~ .custom-file-label::after {
    content: "Attach PALLETS QR Codes";
    font-size: 12px;
    width: 110px;
    height: 40px;
    padding: 0px 10px;
    margin-top: -8px;
    text-align: center;
  }
  .scan-attach-boxes-div
    .custom-file-input:lang(en)
    ~ .custom-file-label::after {
    content: "Attach PALLETS QR Codes";
    font-size: 12px;
    width: 110px;
    height: 40px;
    padding: 0px 10px;
    margin-top: -8px;
    text-align: center;
  }
  .scan-attach-fruits-div
    .custom-file-input:lang(en)
    ~ .custom-file-label::after {
    content: "Attach PALLETS QR Codes";
    font-size: 12px;
    width: 110px;
    height: 40px;
    padding: 0px 10px;
    margin-top: -8px;
    text-align: center;
  }
  .container-inspection-div
    .custom-file-input:lang(en)
    ~ .custom-file-label::after {
    width: 110px;
    height: 40px;
    padding: 0px 10px;
    margin-top: -8px;
    text-align: center;
  }
}
@media screen and (max-width: 768px) {
  .table-striped tbody tr td:nth-child(6) {
    padding-right: 20px !important;
  }
}
#qrcode-view-modal .modal-content {
  width: 400px;
  margin: 0px auto;
}
/* #qrcode-view-modal .close {
  visibility: hidden;
} */
.qrcode-label {
  font-size: small;
  font-weight: bold;
}
#qr-code-coantainer img {
  height: 100px;
  width: 100px;
  padding: 10px 10px 10px 10px;
  border-bottom: 1px solid red;
}
.display-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.float-left {
  float: left;
}
.margin-l-10 {
  margin: 0px 0px 0px 10px;
}
.qrcode-name {
  font-size: large;
  font-weight: bold;
  color: #fff;
}
.digital-signature-container {
  background-color: rgb(256, 256, 256, 0.1);
  margin-left: 30px;
  max-height: 400px;
  overflow: hidden;
  overflow-y: auto;
}
.text-input::placeholder {
  /* Firefox, Chrome, Opera */
  /* color: gray !important; */
  color: #a8a8a8 !important;
}

.text-input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  /* color: gray !important; */
  color: #a8a8a8 !important;
}

.text-input::-ms-input-placeholder {
  /* Microsoft Edge */
  /* color: gray !important; */
  color: #a8a8a8 !important;
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
#save-previous-confirm-modal .modal-content {
  width: 400px;
  margin: 0 auto;
}
#confirm-warning-modal label {
  color: #fff;
}
#confirm-warning-modal .modal-content {
  width: 400px;
  margin: 0 auto;
}
.VueTables__no-results td {
  text-align: center !important;
}
</style>
