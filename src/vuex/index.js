import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    doctors: [],
    specialities: [],
    postSpecialities: [],
  },
  mutations: {
    setDoctors(state, doctors) {
      state.doctors = doctors;
    },
    setSpecialities(state, specialities) {
      state.specialities = specialities;
    },
    setPostSpecialities(state, postSpecialities) {
      state.postSpecialities = postSpecialities;
    }

  }
})
