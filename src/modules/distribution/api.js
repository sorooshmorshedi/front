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
  },
  computed: {
    ...mapState([
      'visitors',
      'commissionRanges',
      'paths',
    ]),
  }
}