import Vue from "vue";
import App from "./App.vue";
import * as VueGoogleMaps from "vue2-google-maps";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
import firebase from "firebase";
import "firebase/firestore";
import getConfigVars from "./shared/config-env"


const config = getConfigVars().FIREBASE_CONFIG;
firebase.initializeApp(config);
firebase.firestore().enablePersistence(true)
import UUID from "vue-uuid";

Vue.use(UUID);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

Vue.use(VueGoogleMaps, {
  load: {
    key: getConfigVars().GOOGLEMAPKEY,
    libraries: "places"
  },

  installComponents: true
});
// import fullCalendar from 'vue-fullcalendar'
// Vue.component('full-calendar', fullCalendar)

import { SchedulePlugin } from "@syncfusion/ej2-vue-schedule";
Vue.use(SchedulePlugin);

import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";

Vue.use(PerfectScrollbar);

import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";

Vue.use(VueToast);
