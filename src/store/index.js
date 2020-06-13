import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import moment from "moment-jalaali";

export default new Vuex.Store({
  state: {
    user: null,
    OGR: 0, //on going requests
    now: null,
    snackbar: {
      show: false,
      text: '',
      color: ''
    },
    timeInterval: null,
    accounts: [],
    floatAccountGroups: [],
    floatAccounts: [],
    accountTypes: [],
    defaultAccounts: [],
    wares: {
      wareLevels: [],
      wares: [],
      warehouses: [],
      units: [],
    },
    sanads: {
      sanads: [],
      transactions: []
    },
    factors: {
      factors: [],
      factorExpenses: [],
      receipts: [],
    }
  },
  mutations: {
    incrementOGR(state) {
      state.OGR++;
    },
    decrementOGR(state) {
      state.OGR--;
    },
    setSnackbar(state, snackbar) {
      state.snackbar = snackbar;
    },
    setTime(state, time) {
      state.now = time;
      if (state.timeInterval) window.clearInterval(state.timeInterval)
      state.timeInterval = window.setInterval(() => state.now.add(1, 'second'), 1000)
    },
    setUser(state, user) {
      state.user = user;
    },
    setAccounts(state, data) {
      state.accounts = data;
    },
    setFloatAccountGroups(state, data) {
      state.floatAccountGroups = data;
    },
    setFloatAccounts(state, data) {
      state.floatAccounts = data;
    },
    setAccountTypes(state, data) {
      state.accountTypes = data;
    },
    setDefaultAccounts(state, data) {
      state.defaultAccounts = data;
    },
    setWares(state, wares) {
      wares.wareLevels && (state.wares.wareLevels = wares.wareLevels);
      wares.wares && (state.wares.wares = wares.wares);
      wares.warehouses && (state.wares.warehouses = wares.warehouses);
      wares.units && (state.wares.units = wares.units);
    },
    setSanads(state, sanads) {
      sanads.sanads && (state.sanads.sanads = sanads.sanads);
      sanads.transactions && (state.sanads.transactions = sanads.transactions);
    },
    setFactors(state, factors) {
      factors.factorExpenses && (state.factors.factorExpenses = factors.factorExpenses);
      factors.factors && (state.factors.factors = factors.factors);
      factors.receipts && (state.factors.receipts = factors.receipts);
    }

  },
  getters: {
    accounts: state => state.accounts,
    // accountTypes: state => state.accountTypes,
  },
})