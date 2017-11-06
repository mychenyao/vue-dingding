import Vue from "vue"
import moment from "moment"
Vue.filter('moment', function(input, fmtstring) {
    if (!input) return "";
    return moment(input).format(fmtstring);
});