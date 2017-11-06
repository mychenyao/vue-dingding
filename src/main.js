// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import mintui from 'mint-ui'
import "mint-ui/lib/style.min.css"
import "../static/mui/css/mui.css"
import "../static/js/rem.js"
import axios from "axios"
import "@/js/filter"
import Vuex from "vuex"
import { Toast } from 'mint-ui';
import { mutations } from "@/components/vuex/mutations"
import { state } from "@/components/vuex/state";
import common from "./js/baseHttp"
Vue.prototype.$common=common;
Vue.prototype.$Toast = Toast;
Vue.use(Vuex)
const store = new Vuex.Store({
    state,
    mutations
});
Vue.prototype.$http = axios;
Vue.use(mintui);
Vue.config.productionTip = false;
import "../static/css/common.css"
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})
