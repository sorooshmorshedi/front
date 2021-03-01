export default {
  state: {
    dashtbashiCars: [],
    dashtbashiDrivers: [],
    drivings: [],
    associations: [],
  },
  mutations: {
    setDashtbashiCars(state, data) {
      state.dashtbashiCars = data;
    },
    setDashtbashiDrivers(state, data) {
      state.dashtbashiDrivers = data;
    },
    setDrivings(state, data) {
      state.drivings = data;
    },
    setAssociations(state, data) {
      state.associations = data;
    },
  }
}