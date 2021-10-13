import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import WithProducer from "./views/lsp/with-producer.vue";
import EnrouteProducer from "./views/lsp/enroute-producer.vue";
import ArrivedAtPackhouse from "./views/lsp/arrived-at-packhouse.vue";
import EnroutePackhouse from "./views/lsp/enroute-packhouse.vue";
import isAuthenticated from "./shared/auth";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 91 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 1 ||
              multipleRoles.includes("1")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sae/dashboard.vue"),
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("./views/forgot-password.vue"),
    },
    {
      path: "/login-phone",
      name: "login-phone",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("./views/login-phone.vue"),
    },
    {
      path: "/new-request",
      name: "new-request",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 91 ||
              localStorage.systemRole == 1 ||
              multipleRoles.includes("1")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sae/new-request.vue"),
    },
    {
      path: "/service-requests",
      name: "service-requests",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 91 ||
              localStorage.systemRole == 1 ||
              multipleRoles.includes("1")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sae/service-requests.vue"),
    },
    {
      path: "/modify-service-request/:id",
      name: "modify-service-request",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 91 ||
              localStorage.systemRole == 1 ||
              multipleRoles.includes("1")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sae/modify-service-request.vue"),
    },
    {
      path: "/list-of-producers",
      name: "list-of-producers",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 91 ||
              localStorage.systemRole == 1 ||
              multipleRoles.includes("1")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sae/list-of-producers.vue"),
    },
    {
      path: "/map-view",
      name: "map-view",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 91 ||
              localStorage.systemRole == 1 ||
              localStorage.systemRole == 13 ||
              multipleRoles.includes("1")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sae/map-view.vue"),
    },
    {
      path: "/collection-point-map-view/:id",
      name: "collection-point-map-view",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 91 ||
              localStorage.systemRole == 1 ||
              localStorage.systemRole == 13 ||
              multipleRoles.includes("1")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sae/collection-point-map-view.vue"),
    },
    {
      path: "/calender-view",
      name: "calender-view",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 91 ||
              localStorage.systemRole == 1 ||
              localStorage.systemRole == 13 ||
              multipleRoles.includes("1")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sae/calender-view.vue"),
    },
    {
      path: "/show-map/:id",
      name: "show-map",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 1 ||
              localStorage.systemRole == 91 ||
              localStorage.systemRole == 13 ||
              multipleRoles.includes("1")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sae/show-map.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("./views/sa/signup.vue"),
    },
    {
      path: "/lsp-dashboard",
      name: "lsp-dashboard",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/lsp-dashboard.vue"),
    },
    {
      path: "/pack-house-incharge-dashboard",
      name: "pack-house-incharge-dashboard",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/pack-house-incharge-dashboard.vue"),
    },
    {
      path: "/producer-show-map/:location",
      name: "producer-show-map",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 91 ||
              localStorage.systemRole == 1 ||
              multipleRoles.includes("1")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sae/producer-show-map.vue"),
    },
    {
      path: "/active-service-map-view",
      name: "active-service-map-view",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/active-service-map-view.vue"),
    },
    {
      path: "/planned-pickups",
      name: "planned-pickups",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 3 ||
              multipleRoles.includes("3")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/planned-pickups.vue"),
    },
    {
      path: "/enroute-producer",
      name: "enroute-producer",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 3 ||
              multipleRoles.includes("3")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: EnrouteProducer,
    },
    {
      path: "/enroute-packhouse",
      name: "enroute-packhouse",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 3 ||
              multipleRoles.includes("3")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: EnroutePackhouse,
    },
    {
      path: "/arrived-at-packhouse",
      name: "arrived-at-packhouse",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 3 ||
              multipleRoles.includes("3")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: ArrivedAtPackhouse,
    },
    {
      path: "/with-producer",
      name: "with-producer",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 3 ||
              multipleRoles.includes("3")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: WithProducer,
    },
    {
      path: "/collector-dashboard",
      name: "collector-dashboard",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 3 ||
              multipleRoles.includes("3")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/collector-dashboard.vue"),
    },
    {
      path: "/active-service-requests",
      name: "active-service-requests",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/active-service-requests.vue"),
    },
    {
      path: "/previous-service-requests",
      name: "previous-service-requests",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/previous-service-requests.vue"),
    },
    {
      path: "/active-service-map/:id",
      name: "active-service-map",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/active-service-map.vue"),
    },
    {
      path: "/previous-service-map-view",
      name: "previous-service-map-view",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/previous-service-map-view.vue"),
    },
    {
      path: "/previous-service-map/:id",
      name: "previous-service-map",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/previous-service-map.vue"),
    },
    {
      path: "/active-service-calender-view",
      name: "active-service-calender-view",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/active-service-calender-view.vue"),
    },
    {
      path: "/previous-service-calender-view",
      name: "previous-service-calender-view",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/previous-service-calender-view.vue"),
    },
    {
      path: "/lots-at-packhouse",
      name: "lots-at-packhouse",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/lots-at-packhouse.vue"),
    },
    {
      path: "/lsp-payment-history",
      name: "lsp-payment-history",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/lsp-payment-history.vue"),
    },
    {
      path: "/sa-dashboard",
      name: "sa-dashboard",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (localStorage.systemRole == 99 && isAuthenticated()) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sa/sa-dashboard.vue"),
    },
    {
      path: "/view-broker-batches",
      name: "view-broker-batches",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 97 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 5 ||
              localStorage.systemRole == 4) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/broker/view-broker-batches.vue"),
    },
    {
      path: "/add-manage-user",
      name: "add-manage-user",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 || localStorage.systemRole == 96) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/add-manage-user.vue"),
    },
    {
      path: "/view-batch-details",
      name: "view-batch-details",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 97 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 5 ||
              localStorage.systemRole == 4) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/broker/view-batch-details.vue"),
    },
    {
      path: "/create-batch",
      name: "create-batch",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/create-batch.vue"),
    },
    {
      path: "/view-batches",
      name: "view-batches",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/view-batches.vue"),
    },
    {
      path: "/payment/:id",
      name: "payment",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 6) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/tpa/payment.vue"),
    },
    {
      path: "/view-tpa-batches",
      name: "view-tpa-batches",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 6) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/tpa/view-tpa-batches.vue"),
    },
    {
      path: "/tpa-dashboard",
      name: "tpa-dashboard",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 6) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/tpa/tpa-dashboard.vue"),
    },
    {
      path: "/invoice/:id",
      name: "invoice",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 97 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 5 ||
              localStorage.systemRole == 4) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/broker/invoice.vue"),
    },
    {
      path: "/manage-users",
      name: "manage-users",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 10) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sa/manage-users.vue"),
    },
    {
      path: "/manage-packhouses",
      name: "manage-packhouses",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 9 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 99 ||
              localStorage.systemRole == 10) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sa/manage-packhouses.vue"),
    },
    {
      path: "/manage-collection-points",
      name: "manage-collection-points",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 9 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 99 ||
              localStorage.systemRole == 10 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sa/manage-collection-points.vue"),
    },
    {
      path: "/manage-ngos",
      name: "manage-ngos",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 9 ||
              localStorage.systemRole == 99 ||
              localStorage.systemRole == 10) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sa/manage-ngos.vue"),
    },
    {
      path: "/manage-bank-accounts",
      name: "manage-bank-accounts",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 9 ||
              localStorage.systemRole == 99 ||
              localStorage.systemRole == 10) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sa/manage-bank-accounts.vue"),
    },
    {
      path: "/broker-dashboard",
      name: "broker-dashboard",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 9 ||
              localStorage.systemRole == 97 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 99 ||
              localStorage.systemRole == 5 ||
              localStorage.systemRole == 4) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/broker/broker-dashboard.vue"),
    },
    {
      path: "/view-broker-batches-previous",
      name: "view-broker-batches-previous",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 97 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 5 ||
              localStorage.systemRole == 4) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () =>
        import("./views/broker/view-broker-batches-previous.vue"),
    },
    {
      path: "/invoice-payment-previous/:id",
      name: "invoice-payment-previous",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 97 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 5 ||
              localStorage.systemRole == 4) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/broker/invoice-payment-previous.vue"),
    },
    {
      path: "/payment-history",
      name: "payment-history",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 8) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/aml/payment-history.vue"),
    },

    {
      path: "/broker-payment-history",
      name: "broker-payment-history",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 97 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 5 ||
              localStorage.systemRole == 4) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/broker/broker-payment-history.vue"),
    },
    {
      path: "/payment-history-broker",
      name: "payment-history-broker",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 97 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 5 ||
              localStorage.systemRole == 4) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/broker/payment-history-broker.vue"),
    },
    {
      path: "/journey-v1/:id",
      name: "journey-v1",
      component: () => import("./views/customer/customer_home.vue"),
    },
    {
      path: "/journey-v1",
      name: "journey-v1",
      component: () => import("./views/customer/customer_home.vue"),
    },
    {
      path: "/journey-v2",
      name: "journey-v2",
      component: () => import("./views/customer/journey-v2.vue"),
    },
    {
      path: "/journey-v2/:id",
      name: "journey-v2",
      component: () => import("./views/customer/journey-v2.vue"),
    },
    {
      path: "/customer-map/:location",
      name: "customer-map",
      props: true,
      component: () => import("./views/customer/customer_map.vue"),
    },
    {
      path: "/qrcode-reader",
      name: "qrcode-reader",
      component: () => import("./shared/qr_code_reader.vue"),
    },
    {
      path: "/buyer-screen/:id",
      name: "buyer-screen",
      component: () => import("./views/buyer-screen.vue"),
    },
    {
      path: "/add-collector",
      name: "add-collector",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/add-collector.vue"),
    },
    {
      path: "/pdf-gen",
      name: "pdf-gen",
      component: () => import("./shared/pdf-gen"),
    },
    {
      path: "/get-invoice/:invoiceNumber",
      name: "get-invoice",
      props: true,
      // beforeEnter: (to, from, next) => {
      //   if ( localStorage.userName && localStorage.systemRole) {
      //     if (localStorage.systemRole == 99 || localStorage.systemRole == 2) {
      //       next();
      //     } else {
      //       next("/");
      //     }
      //   } else {
      //     next("/");
      //   }
      // },
      component: () => import("./views/lsp/get-invoice.vue"),
    },
    {
      path: "/broker-invoice/:invoiceNumber",
      name: "broker-invoice",
      props: true,
      // beforeEnter: (to, from, next) => {
      //   if ( localStorage.userName && localStorage.systemRole) {
      //     if (localStorage.systemRole == 99 || localStorage.systemRole == 4) {
      //       next();
      //     } else {
      //       next("/");
      //     }
      //   } else {
      //     next("/");
      //   }
      // },
      component: () => import("./views/broker/broker-gen-invoice.vue"),
    },
    {
      path: "/payment-reporting",
      name: "payment-reporting",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 6 ||
              localStorage.systemRole == 13 ||
              localStorage.systemRole == 10) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sa/payment-reporting.vue"),
    },
    {
      path: "/view-unsuccessful-sale",
      name: "view-unsuccessful-sale",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 9 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 99 ||
              localStorage.systemRole == 13 ||
              localStorage.systemRole == 10) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sa/view-unsuccessful-sale.vue"),
    },
    {
      path: "/admin-dashboard",
      name: "admin-dashboard",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 7) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/admin/admin-dashboard.vue"),
    },
    {
      path: "/op-admin-dashboard",
      name: "op-admin-dashboard",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 7) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/op-admin/op-admin-dashboard.vue"),
    },
    {
      path: "/observer-dashboard",
      name: "observer-dashboard",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 13 ||
              localStorage.systemRole == 9) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/observer/observer-dashboard.vue"),
    },
    {
      path: "/observer-mci-dashboard",
      name: "observer-mci-dashboard",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 13 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 10) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () =>
        import("./views/observer-MCI/observer-mci-dashboard.vue"),
    },
    {
      path: "/view-service-requests",
      name: "view-service-requests",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 13 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 10) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/observer/view-service-requests.vue"),
    },
    {
      path: "/observer-show-map/:id",
      name: "observer-show-map",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 13 ||
              localStorage.systemRole == 9) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/observer/observer-show-map.vue"),
    },
    {
      path: "/observer-map-view",
      name: "observer-map-view",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 13 ||
              localStorage.systemRole == 9) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/observer/observer-map-view.vue"),
    },
    {
      path: "/observer-calender-view",
      name: "observer-calender-view",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 13 ||
              localStorage.systemRole == 9) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/observer/observer-calender-view.vue"),
    },
    {
      path: "/manage-icg-distribution",
      name: "manage-icg-distribution",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 9 ||
              localStorage.systemRole == 99 ||
              localStorage.systemRole == 10) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sa/manage-icg-distribution.vue"),
    },
    {
      path: "/manage-products",
      name: "manage-products",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 9 ||
              localStorage.systemRole == 99 ||
              localStorage.systemRole == 10) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sa/manage-products.vue"),
    },
    {
      path: "/manage-fruits",
      name: "manage-fruits",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 9 ||
              localStorage.systemRole == 99 ||
              localStorage.systemRole == 10) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sa/manage-fruits.vue"),
    },
    {
      path: "/manage-organizations",
      name: "manage-organizations",
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 9 || localStorage.systemRole == 99) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sa/manage-organizations.vue"),
    },
    {
      path: "/propose-producer",
      name: "propose-producer",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 96 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/propose-producer.vue"),
    },
    {
      path: "/manage-harvest-planner",
      name: "manage-harvest-planner",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/add-harvest-planner.vue"),
    },
    {
      path: "/approve-reject-proposed-producer",
      name: "approve-reject-proposed-producer",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          let multipleRoles = localStorage.systemRole.split(",");
          if (
            (localStorage.systemRole == 99 ||
              localStorage.systemRole == 7 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 10 ||
              localStorage.systemRole == 2 ||
              multipleRoles.includes("2")) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () =>
        import("./views/sa/approve-reject-proposed-producer.vue"),
    },
    {
      path: "/add-broker",
      name: "add-broker",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (
            (localStorage.systemRole == 99 || localStorage.systemRole == 97) &&
            isAuthenticated()
          ) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/broker/add-broker.vue"),
    },
    {
      path: "/multi-user-dashboard",
      name: "multi-user-dashboard",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (localStorage.systemRole && isAuthenticated()) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/lsp/multi-user-dashboard"),
    },
    {
      path: "/auditor",
      name: "auditor",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (localStorage.systemRole && isAuthenticated()) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/aml/auditor"),
    },
    {
      path: "/organization-details",
      name: "organization-details",
      props: true,
      beforeEnter: (to, from, next) => {
        if (localStorage.userName && localStorage.systemRole) {
          if (localStorage.systemRole && isAuthenticated()) {
            next();
          } else {
            next("/");
          }
        } else {
          next("/");
        }
      },
      component: () => import("./views/sa/organization-details"),
    },
  ],
});
