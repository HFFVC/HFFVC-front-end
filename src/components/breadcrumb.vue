<template>
  <div class="breadcrumbrow">
    <b-breadcrumb :items="items"></b-breadcrumb>
  </div>
</template>
<script>
export default {
  name: "Breadcrumb",
  data: function() {
    return {
      items: []
      // items: [
      //   {
      //     text: '| Super-Admin',
      //     href: '#'
      //   },
      //   {
      //     text: 'Manage',
      //     href: '#'
      //   },
      //   {
      //     text: 'Library',
      //     active: true
      //   }
      // ]
    };
  },
  mounted() {},
  computed: {
    // getBreadcrumb:function(currentUrl){
    //     if(currentUrl == '/sa-dashboard'){
    //         this.items.push({
    //             text: '| Super-Admin',
    //             href: '/sa-dashboard'
    //         })
    //         //this.items = "Super Admin";
    //     }
    //     else if(currentUrl == '/manage-users'){
    //         // this.items.push({
    //         //     text: 'Manage Users',
    //         //     href: '/manage-users'
    //         // })
    //     }
    //     //  this.currentpage.forEach(item=>{
    //     //     if(item == '/sa-dashboard'){
    //     //       this.items.push({
    //     //         text: '| Super-Admin',
    //     //         href: '/sa-dashboard'
    //     //       });
    //     //     }
    //     //     else if(item == '/manage-users'){
    //     //       this.items.push({
    //     //          text: 'Manage Users',
    //     //          href: '/manage-users'
    //     //       });
    //     //     }
    //     //  });
    // }
  },

  methods: {
    getBreadcrumb: function(currentval) {
      this.items = currentval;
    }
  }
};
</script>
<style scoped>
.breadcrumb {
  background-color: transparent !important;
  color: #fff !important;
  text-decoration: none !important;
}
.breadcrumb a {
  /* color: #fff !important; */
  color: yellow !important;
}
.breadcrumb .active {
  /* color: grey !important; */
  color: #fff !important;
}
.breadcrumb-item + .breadcrumb-item::before {
  color: #fff !important;
}
.breadcrumbrow {
  float: left;
  position: relative;
  top: 43px;
  left: 6px;
  color: #fff;
  font-size: 13px;
}

</style>
