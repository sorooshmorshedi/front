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
    getSanad(sanadId) {
      return this.request({
        url: this.endpoint('sanads/sanads/' + sanadId),
        method: 'get',
        success: data => {
          this.selectSanad(data);
        }
      })
    },
    getSanadByCode(code) {
      return this.request({
        url: this.endpoint('sanads/sanads/getSanadByCode'),
        method: 'get',
        params: {
          code
        },
        success: data => {
          this.selectSanad(data);
        }
      })
    },
    clearSanad() {
      this.sanad = {
        type: "temporary"
      };
      this.rows = [{
        bed: "",
        bes: ""
      }];
    },
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
