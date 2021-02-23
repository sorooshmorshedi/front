export default {
  state: {
    visitors: [],
    commissionRanges: [],
  },
  mutations: {
    setVisitors(state, data) {
      state.visitors = data;
    },
    setCommissionRanges(state, data) {
      state.commissionRanges = data;
    },
  }
}