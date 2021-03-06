import Vue from "vue";
// import App from "./App";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

if (process.env.IS_ELECTRON) {
  Vue.prototype.$electron = require("electron");
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
