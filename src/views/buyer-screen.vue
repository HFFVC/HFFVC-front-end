<template>
  <div>
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <div class="col-md-12 no-padding main-header p-0">
        <div class="logo-container">
          <h3 class="inter-head">HFFVC</h3>
          <!-- <img class="img-logo-lsp" alt="agriledger logo" src="../assets/images/logo.png" />
          <sup class="beta">(BETA)</sup> -->
        </div>
      </div>
      <div class="col-md-12">
        <div class="main-wrap">
          <div style="padding:20px;">
            <p>Dear {{ buyerName }},</p>
            <p>Greetings!</p>
            <!-- <p>
              We are excited to have you onboard for your journey to "Building
              Trust" in the Agricultural Value Chain. By purchasing these fruits
              you are supporting farmers in earning a fair share from selling
              their produce.
            </p> -->
            <!-- <hr /> -->
            <!-- <p>
              You may extend your contribution by selecting answers to the below
              questions:
            </p> -->
            <div>
              <div class="question-wrap">
                <p>
                  Would you like the payment distribution to be visible to
                  consumer?
                </p>
                <div class="radio-wrap">
                  Yes
                  <input
                    type="radio"
                    v-model="selectedVisibility"
                    value="Y"
                    name="visibility"
                  />
                  No
                  <input
                    type="radio"
                    v-model="selectedVisibility"
                    value="N"
                    name="visibility"
                  />
                </div>

                <div
                  style="padding-left:20px;"
                  v-if="this.selectedVisibility == 'Y'"
                >
                  If yes, Please enter the unit price at which you intend to
                  sell it to the consumer
                </div>
                <div
                  style="padding:20px;"
                  v-if="this.selectedVisibility == 'Y'"
                >
                  <input
                    v-model="unitPrice"
                    placeholder="Price Per Kg"
                    style="background:transparent;border:none;border-bottom:1px solid #fff;outline:none;color:#fff"
                    class="input-textbox"
                    type="text"
                  />
                  USD
                </div>
              </div>
              <!-- <div class="question-wrap">
                <p>2) Do you accept the invoice from the broker?</p>
                <div class="radio-wrap">
                  Yes
                  <input
                    type="radio"
                    value="Y"
                    v-model="selectedInvoiceAcceptance"
                    name="invoiceAcceptance"
                  />
                  No
                  <input
                    type="radio"
                    value="N"
                    v-model="selectedInvoiceAcceptance"
                    name="invoiceAcceptance"
                  />
                </div>
              </div> -->
              <!-- <div class="question-wrap">
                <p>3) Please upload your Purchase Order</p>
                <div class="inp-buyer-container">
                  <div class="attach-border"></div>
                  <b-form-file
                    v-model="uploadedFile"
                    placeholder="No Attachments yet"
                    drop-placeholder="Drop file here..."
                  ></b-form-file>
                </div>
              </div>-->
            </div>
            <p>Thank you for your contribution!</p>
          </div>
          <div class="save-wrap">
            <input
              type="button"
              v-on:click="updateBuyerDetails"
              class="buyer-btn-save"
              value="Save"
            />
          </div>
        </div>
      </div>
      <div class="col-md-12 footer-buyer-screen">
        <img class="footer-img" src="../assets/images/logo.png" />
        <div class="footer-text">
          © 2019 AgriLedger.
          <br />To find out more about us, you can visit our website here.
          Follow us on Linkedin, Twitter or Facebook
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import firebase from "firebase";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
Vue.use(VueToast);
import BootstrapVue from "bootstrap-vue";
import sendSMS from "../shared/sms-service";
import getConfigVars from '../shared/config-env';
Vue.use(BootstrapVue);

export default {
  name: "buyer-screen",
  data: function() {
    return {
      buyerName: "",
      selectedInvoiceAcceptance: null,
      uploadedFileUrl: null,
      selectedVisibility: null,
      unitPrice: null,
      uploadedFile: null,
      seen: false
    };
  },
  mounted() {
    this.seen = true;
    var currentval = this;
    firebase
      .auth()
    .signInWithEmailAndPassword(getConfigVars().PUBLICUSERNAME,getConfigVars().PUBLICUSERPASSWORD)
      .then(response => {
        localStorage.emailId = response.user.email;

        // var ref = firebase
        //   .database()
        //   .ref()
        //   .child("profile")
        //   .child(response.user.uid);
        // ref.on("value", snapshot => {
        //   localStorage.userName =
        //     snapshot.val().firstName +
        //     " " +
        //     snapshot.val().lastName +
        //     " (" +
        //     snapshot.val().function +
        //     ")";
        //   localStorage.systemRole = snapshot.val().systemRole;
          var sellId = this.$route.params.id;
          var dbRef = firebase
            .database()
            .ref()
            .child("batch/");
          dbRef.on("child_added", snapshot => {
            var ref = firebase
              .database()
              .ref()
              .child("batch/" + snapshot.key);
            ref
              .child("sell")
              .orderByChild("sellId")
              .equalTo(sellId)
              .on("child_added", snapshot1 => {
                this.buyerName = snapshot1.val().sellBuyerName;
              });
          });
       // });
        currentval.seen = false;
      })
      .catch(function() {
        currentval.seen = false;
        Vue.$toast.open({
          message: "Something went wrong! Please try after sometime!",
          type: "error",
          position: "top"
        });
      });
  },
  methods: {
    updateBuyerDetails: function() {
      this.seen = true;
      // if (
      //   typeof this.selectedInvoiceAcceptance != "undefined" &&
      //   this.selectedInvoiceAcceptance &&
      //   // typeof this.uploadedFile != "undefined" &&
      //   //  this.uploadedFile &&
      //   typeof this.selectedVisibility != "undefined" &&
      //   this.selectedVisibility
      // ) {
        if (
          this.selectedVisibility == "N" ||
          (this.selectedVisibility == "Y" &&
            typeof this.unitPrice != "undefined" &&
            this.unitPrice)
        ) {
          // this.uploadFile(this.uploadedFile);
          var sellId = this.$route.params.id;
          var inpData = {
            //invoiceAcceptance: this.selectedInvoiceAcceptance,
            //  uploadedFileUrl: this.uploadedFileUrl,
            paymentDistributionVisibility: this.selectedVisibility,
            unitPrice: this.unitPrice
          };
          var dbRef = firebase
            .database()
            .ref()
            .child("batch/");
          dbRef.on("child_added", snapshot => {
            var ref = firebase
              .database()
              .ref()
              .child("batch/" + snapshot.key);
            ref
              .child("sell")
              .orderByChild("sellId")
              .equalTo(sellId)
              .on("child_added", snapshot1 => {
                var ref1 = firebase
                  .database()
                  .ref()
                  .child("batch/" + snapshot.key)
                  .child("sell/" + snapshot1.key + "/buyerFeedback/");

                ref1.set(inpData).then(() => {
                  this.seen = false;
                  // sendSMS(
                  //   "contact",
                  // //  `Final sale has been made to ${this.buyerName} @` +
                  // //    "$" +
                  // //     `${inpData.unitPrice}`
                  //    "Vant final la realize " + this.buyerName +" @ "+ inpData.unitPrice + " Pri pa Kg"
                  //    // "La vente finale a été faite au " + this.buyerName +" @ "+ inpData.unitPrice +"Par unité"
                  // )
                  //   .then(sent => console.log(sent))
                  //   .catch(err => console.log(err));
                  Vue.$toast.open({
                    message:
                      "Thank you for your valuable time.Your feedback has been successfully submitted!",
                    type: "success",
                    position: "top"
                  });
                });
              });
          });
        } else {
          this.seen = false;
          Vue.$toast.open({
            message: "Please fill all the fields.",
            type: "error",
            position: "top"
          });
        }
      // } else {
      //   this.seen = false;
      //   Vue.$toast.open({
      //     message: "Please fill all the fields.",
      //     type: "error",
      //     position: "top"
      //   });
      // }
    },
    uploadFile: function(file) {
      const storageRef = firebase
        .storage()
        .ref(
          `uploaded-files/BuyerPurchaseOrder/${this.$route.params.id}/${file.name}`
        );
      const uploadTask = storageRef.put(file);
      uploadTask.on(
        "state_changed",
        snapshot => console.log(snapshot),
        error => console.log(error),
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(url => {
            this.uploadedFileUrl = url;

            var sellId = this.$route.params.id;
            var inpData = {
              invoiceAcceptance: this.selectedInvoiceAcceptance,
              uploadedFileUrl: this.uploadedFileUrl,
              paymentDistributionVisibility: this.selectedVisibility,
              unitPrice: this.unitPrice
            };
            var dbRef = firebase
              .database()
              .ref()
              .child("batch/");
            dbRef.on("child_added", snapshot => {
              var ref = firebase
                .database()
                .ref()
                .child("batch/" + snapshot.key);
              ref
                .child("sell")
                .orderByChild("sellId")
                .equalTo(sellId)
                .on("child_added", snapshot1 => {
                  var ref1 = firebase
                    .database()
                    .ref()
                    .child("batch/" + snapshot.key)
                    .child("sell/" + snapshot1.key + "/buyerFeedback/");

                  ref1.set(inpData).then(() => {
                    this.seen = false;
                    sendSMS(
                      "contact",
                      "Vant final la realize " + this.buyerName +" @ "+ inpData.unitPrice + " Pri pa Kg"
                      // `Final sale has been made to ${this.buyerName} @` +
                      //   "$" +
                      //   `${inpData.unitPrice}`
                    //  "La vente finale a été faite au " + this.buyerName +" @ "+ inpData.unitPrice +"Par unité"
                    )
                      .then(sent => console.log(sent))
                      .catch(err => console.log(err));
                    Vue.$toast.open({
                      message:
                        "Thank you for your valuable time.Your feedback has been successfully submitted!",
                      type: "success",
                      position: "top"
                    });
                  });
                });
            });
          });
        }
      );
    }
  }
};
</script>
<style scoped>
.inter-head {
  color: #fff;
  font-size: 39px;
  margin-top: 14px;
  float: left;
  margin-left: 14px;
  position: absolute;
}
</style>

<style>
body {
  font-size: 14px;
}
.input-textbox:focus {
  outline: none;
}

.radio-wrap {
  padding: 20px;
}

::-webkit-input-placeholder {
  /* Edge */
  color: #fff;
  font-size: 11px;
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #fff;
  font-size: 11px;
}

::placeholder {
  color: #fff;
  font-size: 11px;
}
.container-bg {
  position: absolute;
  background-image: url("../assets/images/bg10.png");
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
.buyer-btn-save {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 12px;
  width: 115px;
  height: 26px;
  margin: 5px;
  margin-top: 20px;
  color: #fff;
}
.attach-border {
  border-bottom: 1px solid #ffffff;
  position: absolute;
  width: 95%;
  bottom: -2px;
  margin-left: 15px;
}
.inp-buyer-container {
  position: relative;
  width: 50%;
}
.inp-buyer-container .custom-file-label {
  background: transparent;
  border: none;
  color: #fff;
}
.inp-buyer-container
  .custom-file-input
  ~ .custom-file-label[data-browse]::after {
  content: "Upload";
  background: #585a4d;
  border: 1px solid #000;
  padding: 4px 12px 4px 12px;
  color: #fff;
  margin-top: 6px;
}
.inp-buyer-container .custom-file {
  margin-left: 8px;
}
.inp-buyer-container {
  margin-bottom: 20px;
}
.save-wrap {
  width: 100%;
  text-align: right;
}
.footer-img {
  width: 55px;
}
.footer-text {
  font-size: 11px;
}
.footer {
  text-align: center;
}
.footer-buyer-screen {
  background: rgba(0, 0, 0, 0.616);
  border: 1px solid #000;
  color: #fff;
  padding: 10px;
}
.question-wrap {
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border: 1px solid #000;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
}
.main-wrap {
  text-align: left;
  background-color: rgb(0, 0, 0, 0.5);
  color: #fff;
  padding: 40px 40px 20px 40px;
  border-radius: 10px;
  width: 70%;
  margin: 0 auto;
  vertical-align: middle;
  margin-top: 70px;
  margin-bottom: 70px;
  border: 1px solid #000;
}
@media screen and (max-width: 1062px) {
  .inp-buyer-container {
    width: 100%;
  }
  .main-wrap {
    width: auto;
  }
}
@media screen and (max-width: 768px) {
  .radio-wrap {
    padding: 0px;
  }
  .main-wrap {
    padding: 10px;
  }
  .inp-buyer-container .custom-file-label {
    font-size: 12px;
  }
}
@media screen and (max-width: 768px) {
  .beta {
    font-size: 8px;
    color: #fff;
    float: left;
    margin-top: 44px;
    padding: 0px;
    position: absolute;
    top: 0px;
    left: 80px;
  }
}
</style>
