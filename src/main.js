import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

require('bootstrap-v4-rtl');
require('./mixin');

import 'cleave.js'

import Multiselect from '@/components/mcomponents/Multiselect.vue';
Vue.component('multiselect', Multiselect);

import WareSelect from '@/components/selects/WareSelect.vue';
Vue.component('WareSelect', WareSelect);

import money from "@/components/mcomponents/cleave/Money";
Vue.component('money', money);

import ContextMenu from "@/components/mcomponents/ContextMenu";
Vue.component('ContextMenu', ContextMenu);


import _ from 'lodash'
window._ = _

import $ from 'jquery'
window.$ = $;


import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

import '@/assets/js/bootstrap-notify.min.js'
import VueFormGenerator from "vue-form-generator";
Vue.use(VueFormGenerator);

import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
Vue.component('date-picker', VuePersianDatetimePicker);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')