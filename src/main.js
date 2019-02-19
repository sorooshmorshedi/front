// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex';


require('bootstrap-v4-rtl');
require('./mixin');

import 'cleave.js'

import Multiselect from './components/mcomponents/multiselect.vue';
Vue.component('multiselect', Multiselect);

import {
  VueContext
} from 'vue-context';
Vue.component('VueContext', VueContext);

import _ from 'lodash'
window._ = _


import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

window.numeral = require('numeral')

import './assets/js/bootstrap-notify.min.js'
import VueFormGenerator from "vue-form-generator";
Vue.use(VueFormGenerator);


import 'vue-tree-halower/dist/halower-tree.min.css'
import VTree from 'vue-tree-halower'
Vue.use(VTree)

import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
Vue.component('date-picker', VuePersianDatetimePicker);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
