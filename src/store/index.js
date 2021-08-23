import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import DashbashiStore from '@/modules/dashtbashi/Store'
import DistributionStore from '@/modules/distribution/Store'

export default new Vuex.Store({
  state: {
    ...DashbashiStore.state,
    ...DistributionStore.state,
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
    companyUsers: [],
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
      salePriceTypes: [],
    },
    factorExpenses: [],
    chequebooks: [],
    defaultTexts: [],
    bankingOperations: []
  },
  mutations: {
    ...DashbashiStore.mutations,
    ...DistributionStore.mutations,
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
      state.serverNow = time;
    },
    setOptions(state, data) {
      state.options = data;
    },
    setUser(state, user) {
      state.user = user;
    },
    setCompanyUsers(state, companyUsers) {
      state.companyUsers = companyUsers;
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
      wares.salePriceTypes && (state.wares.salePriceTypes = wares.salePriceTypes);
    },
    setFactorExpenses(state, data) {
      state.factorExpenses = data;
    },
    setDefaultTexts(state, data) {
      state.defaultTexts = data;
    },
    setBankingOperations(state, data) {
      state.bankingOperations = data;
    },
  }
})