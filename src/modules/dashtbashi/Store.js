export default {
  state: {
    cars: [],
    drivers: [],
    drivings: [],
    associations: [],
  },
  mutations: {
    setCars(state, data) {
      state.cars = data;
    },
    setDrivers(state, data) {
      state.drivers = data;
    },
    setDrivings(state, data) {
      state.drivings = data;
    },
    setAssociations(state, data) {
      state.associations = data;
    },
  }
}