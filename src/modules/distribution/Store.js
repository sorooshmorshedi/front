export default {
  state: {
    visitors: [],
    commissionRanges: [],
    paths: [],
    drivers: [],
    distributors: [],
    cars: [],
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
    setDrivers(state, data) {
      state.drivers = data;
    },
    setDistributors(state, data) {
      state.distributors = data;
    },
    setCars(state, data) {
      state.cars = data;
    },
  }
}