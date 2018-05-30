// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex';

require('bootstrap-v4-rtl');
require('./mixin');

import 'cleave.js'

import Multiselect  from 'vue-multiselect'
Vue.component('multiselect', Multiselect );

import _ from 'underscore'
window._ = _

window.numeral = require('numeral')

import './assets/js/bootstrap-notify.min.js'
import VueFormGenerator from "vue-form-generator";
Vue.use(VueFormGenerator);

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
