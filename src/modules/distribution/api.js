import {
  mapState
} from "vuex";
export default {
  methods: {
    getVisitors(reload) {
      this.fillStore({
        url: 'distributions/visitors/',
        storeKey: 'visitors',
        reload: reload
      })
    },
    getCommissionRanges(reload) {
      this.fillStore({
        url: 'distributions/commissionRanges/',
        storeKey: 'commissionRanges',
        reload: reload
      })
    },
    getPaths(reload) {
      this.fillStore({
        url: 'distributions/paths/',
        storeKey: 'paths',
        reload: reload
      })
    },
    getDrivers(reload) {
      this.fillStore({
        url: 'distributions/drivers/',
        storeKey: 'drivers',
        reload: reload
      })
    },
    getDistributors(reload) {
      this.fillStore({
        url: 'distributions/distributors/',
        storeKey: 'distributors',
        reload: reload
      })
    },
    getCars(reload) {
      this.fillStore({
        url: 'distributions/cars/',
        storeKey: 'cars',
        reload: reload
      })
    },
  },
  computed: {
    ...mapState([
      'visitors',
      'commissionRanges',
      'paths',
      'drivers',
      'distributors',
      'cars',
    ]),
  }
}