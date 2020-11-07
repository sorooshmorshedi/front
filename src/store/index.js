import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import DashbashiStore from '@/modules/dashtbashi/Store'

export default new Vuex.Store({
  state: {
    ...DashbashiStore.state,
    user: null,
    OGR: 0, //on going requests
    isGetting: {}, // true if is getting something (account for example)
    isPrinting: false,
    now: null,
    snackbar: {
      show: false,
      text: '',
      color: ''
    },
    options: null,
    cities: [],
    accounts: [],
    floatAccountGroups: [],
    floatAccounts: [],
    accountTypes: [],
    defaultAccounts: [],
    wares: {
      wares: [],
      warehouses: [],
      units: [],
    },
    chequebooks: [],
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
    ...DashbashiStore.mutations,
    updateIsGetting(state, data) {
      state.isGetting = {
        ...state.isGetting,
        ...data
      };
    },
    setIsPrinting(state, flag) {
      state.isPrinting = flag;
    },
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
    },
    setOptions(state, data) {
      state.options = data;
    },
    setUser(state, user) {
      state.user = user;
    },
    setCities(state, data) {
      state.cities = data;
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
    setChequebooks(state, data) {
      state.chequebooks = data;
    },
    setWares(state, wares) {
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

  }
})