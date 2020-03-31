import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    OGR: 0, //on going requests
    now: null,
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
    setTime(state, time) {
      state.now = time;
      state.timeInterval && clearInterval(state.timeInterval)
      state.timeInterval = setInterval(() => state.now.add(1, 'second'), 1000)
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
    setCostCenterGroups(state, data) {
      state.costCenterGroups = data;
    },
    setIndependentAccounts(state, data) {
      state.independentAccounts = data;
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
