import {
  mapState
} from "vuex";
import {
  maxBy
} from 'lodash';

export default {
  data() {
    return {
      sanadCode: null,
      receiveCode: null,
      paymentCode: null,
    }
  },
  methods: {
    getSanads(force = false, init = true) {
      if (!force && this.sanads.length) return;
      return this.request({
        url: this.endpoint('sanads/sanads'),
        method: 'get',
        success: data => {
          this.$store.commit('setSanads', {
            sanads: data
          });
          init && this.init();
        }
      })
    },
    
    clearSanads() {},
    getSanadCode() {
      return this.request({
        url: this.endpoint('sanads/sanads/newCode'),
        method: 'get',
        success: data => {
          this.sanadCode = data
        }
      })
    },
    getTransactionCodes() {
      this.request({
        url: this.endpoint('sanads/transactions/newCode?type=receive'),
        method: 'get',
        success: data => {
          this.receiveCode = data
        }
      })
      this.request({
        url: this.endpoint('sanads/transactions/newCode?type=payment'),
        method: 'get',
        success: data => {
          this.paymentCode = data
        }
      })
    },
  },
  computed: {
    ...mapState({
      sanads: state => state.sanads.sanads,
      transactions: state => state.sanads.transactions,
      receives: state => state.sanads.transactions.filter(o => o.type == 'receive'),
      payments: state => state.sanads.transactions.filter(o => o.type == 'payment'),
    }),
  }
}
