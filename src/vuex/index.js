import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    accounts: [{
        name: 'dc1 name',
        code: 1,
      },
      {
        name: 'ali2',
        code: 2,
      }, {
        name: 'ali3',
        code: 3,
      },
      {
        name: 'ali4',
        code: 4,
      }
    ],
    accountTypes: [{
        name: 'ali1',
        id: 1,
      },
      {
        name: 'ali2',
        id: 2,
      }, {
        name: 'ali3',
        id: 3,
      },
      {
        name: 'ali4',
        id: 4,
      }

    ]
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  getters: {
    accounts: state => state.accounts,
    accountTypes: state => state.accountTypes,
  }
})
