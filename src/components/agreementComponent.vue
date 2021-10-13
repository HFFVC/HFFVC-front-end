<template>
  <div>this is the component
     {{ data.name }}
  </div>
</template>

<script>
export default {
    name: "Agreement",
    props: {
        agreementdata: Object
    },
    data() {
        return {
            // data: this.agreementdata
        }
    },
    created () {
        console.log("data from parent");
        console.log(this.agreementdata)
    },
};
</script>

<style lang="scss" scoped>
</style>