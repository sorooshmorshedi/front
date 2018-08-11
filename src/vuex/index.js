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
    },
    wares: {
      wareLevels: [],
      wares: [],
      wareHouses: [],
      units: [],
    },
    sanads: {
      RPTypes: [],
      sanads: [],
      transactions: []
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
    },
    setWares(state, wares) {
      wares.wareLevels && (state.wares.wareLevels = wares.wareLevels);
      wares.wares && (state.wares.wares = wares.wares);
      wares.wareHouses && (state.wares.wareHouses = wares.wareHouses);
      wares.units && (state.wares.units = wares.units);
    },
    setSanads(state, sanads) {
      sanads.RPTypes && (state.sanads.RPTypes = sanads.RPTypes);
      sanads.sanads && (state.sanads.sanads = sanads.sanads);
      sanads.transactions && (state.sanads.transactions = sanads.transactions);

    }

  },
  getters: {
    accounts: state => state.accounts,
    // accountTypes: state => state.accountTypes,
  }
})
