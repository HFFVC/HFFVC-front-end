<template>
  <div class="col-md-12 powerby">
    <p>Powered By AgriLedger</p>
  </div>
</template>
<script>
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../router";
// import firebase from "firebase";
// import Breadcrumb from "./breadcrumb";
export default {
  name: "Footer",
  data: function() {
    return {};
  },
  components: {},
  mounted() {},
  methods: {}
};
</script>
<style scoped>
.powerby p {
  color: #fff !important;
  position: absolute;
  bottom: 2px;
  right: 19px;
  font-size: 14px;
}
</style>
