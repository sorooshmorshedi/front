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
      this.log("Get sanad by code: ", code);
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
      this.$router.push({
        name: "CreateSanad"
      });
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
        url: this.endpoint('sanads/transactions/newCodes'),
        method: 'get',
        success: data => {
          this.receiveCode = data['receive']
          this.paymentCode = data['payment']
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
