import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

require('./mixin');
require('@fortawesome/fontawesome-free/css/all.css')

import 'cleave.js'

import WareSelect from '@/components/selects/WareSelect.vue';
Vue.component('WareSelect', WareSelect);

import AccountSelect from '@/components/selects/AccountSelect.vue';
Vue.component('AccountSelect', AccountSelect);

import CitySelect from '@/components/selects/CitySelect.vue';
Vue.component('CitySelect', CitySelect);

import money from "@/components/mcomponents/cleave/Money";
Vue.component('money', money);

import date from "@/components/mcomponents/cleave/Date";
Vue.component('date', date);

import ContextMenu from "@/components/mcomponents/ContextMenu";
Vue.component('ContextMenu', ContextMenu);


import _ from 'lodash'
window._ = _

import $ from 'jquery'
window.$ = $;


import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
Vue.component('date-picker', VuePersianDatetimePicker);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')