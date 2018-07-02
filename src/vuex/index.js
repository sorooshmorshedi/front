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
    },
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
    },
  },
  getters: {
    accounts: state => state.accounts,
    // accountTypes: state => state.accountTypes,
  }
})
