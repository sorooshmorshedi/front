export default {
  state: {
    cars: [],
    drivers: [],
    drivings: [],
    associationCommissions: [],
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
    setAssociationCommissions(state, data) {
      state.associationCommissions = data;
    },
  }
}