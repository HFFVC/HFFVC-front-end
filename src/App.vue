<template>
  <div id="app">
    <router-view />
    <!-- <div class="col-md-12 row powerby">
      <p>Powered By Agriledger</p>
    </div>-->
  </div>
</template>
<script>
export default {};
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
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
/* .powerby p {
  color: #fff !important;
  position: absolute;
  bottom: 2px;
  right: 19px;
  font-size: 14px;
} */
</style>
