export default {
  state: {
    visitors: [],
    commissionRanges: [],
    paths: [],
  },
  mutations: {
    setVisitors(state, data) {
      state.visitors = data;
    },
    setCommissionRanges(state, data) {
      state.commissionRanges = data;
    },
    setPaths(state, data) {
      state.paths = data;
    },
  }
}