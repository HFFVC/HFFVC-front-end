<template>
  <div class="dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <!-- <div class="col-md-12 no-padding main-header">
        <div class="logo-container cursor-pointer" @click="gotoDashboard">
          <img class="img-logo" alt="agriledger logo" src="../../assets/images/logo.png" />
          <sup class="beta">(BETA)</sup>
        </div>
        <div class="username-conatiner">
          <img class="user-icon" alt="agriledger logo" src="../../assets/images/user.png" />
          <label class="lbl-username">{{userName}}</label>
          <br />
          <a href="#" v-on:click="logout" class="ref-logout">Logout</a>
        </div>
      </div>-->
      <Header ref="headercomp"></Header>
      <div class="col-md-12 content-container">
        <div class="header-container">
          <h3 class="heading">
            {{ $t("Service Request", "Service Request") }} -
            {{ $t("Map View", "Map View") }}
          </h3>
          <div class="icon-container">
            <ul>
              <!-- <li>
                <img
                  @click="showServiceRequests"
                  class="sub-header-imgs"
                  src="../../assets/images/list_view.png"
                />
              </li>
              <li>
                <img
                  @click="showMapView"
                  class="sub-header-imgs"
                  src="../../assets/images/map_view.png"
                />
              </li>
              <li>
                <img
                  @click="showCalenderView"
                  class="sub-header-imgs"
                  src="../../assets/images/calendar_view.png"
                />
              </li>-->
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
          <div class="main-container map-wrap">
            <div id="myMap" class="map-window"></div>
          </div>
        </div>
      </div>
      <Footer ref="footercomp"></Footer>
    </div>
  </div>
</template>

<script>
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../../router";
import firebase from "firebase";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";

var map;
export default {
  name: "observer-show-map",
  data: function () {
    return {
      contentstring: [],
      regionlocation: [],
      areaiterator: 0,
      markers: [],
      id: "",
      iterator: 0,
      infowindow: [],
      seen: true,
      location: "",
      latLng: "",
      details: "",
      userName: "",
    };
  },
  components: {
    Header,
    Footer,
  },
  mounted() {
    if (localStorage.systemRole == 99 && localStorage.prevPage == "dashboard") {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("SA-Dashboard", "SA-Dashboard"),
          href: "/sa-dashboard",
        },
        {
          text: this.$t(
            "Harvest Planner - Dashboard",
            "Harvest Planner - Dashboard"
          ),
          href: "/dashboard",
        },
        {
          text: this.$t("Manage Service Requests", "Manage Service Requests"),
          href: "/service-requests",
        },
        {
          text: this.$t(
            "Service Request - Map-View",
            "Service Request - Map-View"
          ),
          href: "/show-map/:id",
        },
      ]);
      localStorage.prevPage = "";
    } else if (
      localStorage.systemRole == 99 &&
      localStorage.prevPage == "view-service-requests"
    ) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("SA-Dashboard", "SA-Dashboard"),
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
        {
          text: this.$t(
            "Service Request - Map-View",
            "Service Request - Map-View"
          ),
          href: "/show-map/:id",
        },
      ]);
      localStorage.prevPage = "";
    } else if (localStorage.systemRole == 9) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Admin-Dashboard", "Admin-Dashboard"),
          href: "/admin-dashboard",
        },
        {
          text: this.$t(
            "Harvest Planner - Dashboard",
            "Harvest Planner - Dashboard"
          ),
          href: "/dashboard",
        },
        {
          text: this.$t("Manage Service Requests", "Manage Service Requests"),
          href: "/service-requests",
        },
        {
          text: this.$t(
            "Service Request - Map-View",
            "Service Request - Map-View"
          ),
          href: "/show-map/:id",
        },
      ]);
    } else if (localStorage.systemRole == 1) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t(
            "Harvest Planner - Dashboard",
            "Harvest Planner - Dashboard"
          ),
          href: "/dashboard",
        },
        {
          text: this.$t("Manage Service Requests", "Manage Service Requests"),
          href: "/service-requests",
        },
        {
          text: this.$t(
            "Service Request - Map-View",
            "Service Request - Map-View"
          ),
          href: "/show-map/:id",
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
        {
          text: this.$t(
            "Service Request - Map-View",
            "Service Request - Map-View"
          ),
          href: "/show-map/:id",
        },
      ]);
    }

    this.userName = localStorage.userName;
    this.id = this.$route.params.id;
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.id = this.$route.params.id;

    this.getValue();
  },
  methods: {
    getValue: function () {
      var currentVal = this;
      var dbRef = firebase.database().ref("serviceRequest/");
      dbRef
        .orderByChild("serviceRequestId")
        .equalTo(this.id)
        .on("child_added", function (data) {
          currentVal.location = data.val().location;
          currentVal.details =
            "Producer : " +
            data.val().producer +
            ", Requested ON : " +
            data.val().requestedOn +
            ", Product : " +
            data.val().product +
            ", Estimated Fruits : " +
            data.val().estimatedNoFruits;

          var locationVal = "";
          locationVal = currentVal.location.split(",");

          currentVal.regionlocation.push(locationVal[1] + "," + locationVal[0]);
          currentVal.contentstring.push(currentVal.details);
          currentVal.seen = false;
          var region = new google.maps.LatLng(
            currentVal.regionlocation[currentVal.areaiterator].split(",")[0],
            currentVal.regionlocation[currentVal.areaiterator].split(",")[1]
          );
          map = new google.maps.Map(document.getElementById("myMap"), {
            center: region,
            zoom: 13,
          });
          currentVal.drop();
        });
    },
    drop: function () {
      var currentVal = this;
      for (var i = 0; i < this.regionlocation.length; i++) {
        setTimeout(function () {
          currentVal.addMarker();
        }, 800);
      }
    },
    addMarker: function () {
      var address = this.contentstring[this.areaiterator];
      var templat = this.regionlocation[this.areaiterator].split(",")[0];
      var templong = this.regionlocation[this.areaiterator].split(",")[1];
      var temp_latLng = new google.maps.LatLng(templat, templong);
      this.markers.push(
        new google.maps.Marker({
          position: temp_latLng,
          map: map,
          draggable: false,
        })
      );
      this.iterator++;
      this.info(this.iterator);
      this.areaiterator++;
    },
    info: function (i) {
      this.infowindow[i] = new google.maps.InfoWindow({
        content: this.contentstring[i - 1],
      });
      this.infowindow[i].content = this.contentstring[i - 1];
      var currentVal = this;
      google.maps.event.addListener(
        currentVal.markers[i - 1],
        "click",
        function () {
          for (var j = 1; j < currentVal.contentstring.length + 1; j++) {
            currentVal.infowindow[j].close();
          }
          currentVal.infowindow[i].open(map, currentVal.markers[i - 1]);
        }
      );
    },
    showMapView: function (event) {
      Router.push({ path: "/observer-map-view" });
    },
    showCalenderView: function (event) {
      Router.push({ path: "/observer-calender-view" });
    },
    showServiceRequests: function (event) {
      Router.push({ path: "/view-service-requests" });
    },
    showDashboard: function () {
      Router.push({ path: "/observer-dashboard" });
    },
    logout: function (event) {
      firebase
        .auth()
        .signOut()
        .then(function () {
          localStorage.emailId = "";
          localStorage.userName = "";
          Router.push({ path: "/" });
        })
        .catch(function (error) {
          alert("Error");
        });
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("/sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else {
        Router.push("/dashboard");
      }
    },
  },
};
</script>
<style scoped>
#myMap {
  height: 500px;
  width: 100%;
  top: -20px;
  position: relative;
  padding: 30px;
}
.vue-title {
  text-align: center;
  margin-bottom: 10px;
}

.location-img {
  width: 20px;
  height: auto;
}
.control-section {
  padding: 30px;
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
  height: auto;
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
.map-wrap {
  position: relative;
  height: 500px;
}
.map-window {
  top: -25px !important;
}
.main-container,
.map-window {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
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