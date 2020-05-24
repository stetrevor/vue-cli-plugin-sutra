import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import workbox from "./registerServiceWorker";
import { darkMode } from "./storage";

Vue.config.productionTip = false;

Vue.prototype.$workbox = workbox;

const setDarkMode = darkMode =>
  darkMode
    ? document.body.classList.add("dark-mode")
    : document.body.classList.remove("dark-mode");

setDarkMode(darkMode.getDarkModeSetting() || true);

Vue.prototype.$setDarkMode = setDarkMode;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
