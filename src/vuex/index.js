import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    accounts: {
      accounts: [],
      floatAccountGroups: [],
      accountTypes: [],
      costCenterGroups: [],
      independentAccounts: [],
      defaultAccounts: [],
    },
    wares: {
      wareLevels: [],
      wares: [],
      wareHouses: [],
      units: [],
    },
    sanads: {
      sanads: [],
      transactions: []
    },
    cheques: {
      chequebooks: [],
      cheques: [],
    },
    factors: {
      factors: [],
      factorExpenses: [],
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setAccounts(state, accounts) {
      accounts.accounts && (state.accounts.accounts = accounts.accounts);
      accounts.floatAccountGroups && (state.accounts.floatAccountGroups = accounts.floatAccountGroups);
      accounts.accountTypes && (state.accounts.accountTypes = accounts.accountTypes);
      accounts.costCenterGroups && (state.accounts.costCenterGroups = accounts.costCenterGroups);
      accounts.independentAccounts && (state.accounts.independentAccounts = accounts.independentAccounts);
      accounts.defaultAccounts && (state.accounts.defaultAccounts = accounts.defaultAccounts);
    },
    setWares(state, wares) {
      wares.wareLevels && (state.wares.wareLevels = wares.wareLevels);
      wares.wares && (state.wares.wares = wares.wares);
      wares.wareHouses && (state.wares.wareHouses = wares.wareHouses);
      wares.units && (state.wares.units = wares.units);
    },
    setSanads(state, sanads) {
      sanads.sanads && (state.sanads.sanads = sanads.sanads);
      sanads.transactions && (state.sanads.transactions = sanads.transactions);
    },
    setCheques(state, cheques) {
      cheques.chequebooks && (state.cheques.chequebooks = cheques.chequebooks);
      cheques.cheques && (state.cheques.cheques = cheques.cheques);
    },
    setFactors(state, factors) {
      factors.factorExpenses && (state.factors.factorExpenses = factors.factorExpenses);
      factors.factors && (state.factors.factors = factors.factors);
    }

  },
  getters: {
    accounts: state => state.accounts,
    // accountTypes: state => state.accountTypes,
  }
})
