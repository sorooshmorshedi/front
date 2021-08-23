import {
  mapState
} from "vuex";

export default {
  methods: {
    getBankingOperations(reload, callback) {
      this.fillStore({
        url: 'transactions/bankingOperations/',
        storeKey: 'bankingOperations',
        reload: reload,
        callback: callback
      })
    },
  },
  computed: {
    ...mapState(['bankingOperations'])
  }
}