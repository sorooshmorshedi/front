import {
  mapState
} from "vuex";
import {
  maxBy
} from 'lodash';

export default {
  data() {
    return {}
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
    getRPTypes(force = false, init = true) {
      if (!force && this.RPTypes.length) return;
      return this.request({
        url: this.endpoint('sanads/RPTypes'),
        method: 'get',
        success: data => {
          this.$store.commit('setSanads', {
            RPTypes: data
          });
          init && this.init();
        }
      })
    },
    getTransactions(force = false, init = true) {
      if (!force && this.transactions.length) return;
      return this.request({
        url: this.endpoint('sanads/transactions'),
        method: 'get',
        success: data => {
          this.$store.commit('setSanads', {
            transactions: data
          });
          init && this.init();
        }
      })
    },
    clearSanads() {},
  },
  computed: {
    ...mapState({
      RPTypes: state => state.sanads.RPTypes,
      sanads: state => state.sanads.sanads,
      transactions: state => state.sanads.transactions,
      receives: state => state.sanads.transactions.filter(o => o.type == 'receive'),
      payments: state => state.sanads.transactions.filter(o => o.type == 'payment'),
    }),
    sanadCode() {
      let lastSanad = maxBy(this.sanads, sanad => sanad.code);
      if (lastSanad) {
        let code = +lastSanad.code + 1
        return code;
      }
      return 1;
    },
    receiveCode() {
      let last = maxBy(this.receives.filter(o => o.type == 'receive'), o => o.code);
      if (last) {
        let code = +last.code + 1
        return code;
      }
      return 1;
    },
    paymentCode() {
      let last = maxBy(this.payments.filter(o => o.type == 'payment'), o => o.code);
      if (last) {
        let code = +last.code + 1
        return code;
      }
      return 1;
    },
    sanadsSelectValues() {
      this.log('Generate sanadsSelectValues');
      let res = {
        RPTypes: [],
        sanads: [],
      }
      res.RPTypes.push({
        name: 'خنثی',
        id: null
      });
      this.RPTypes.forEach(rptype => {
        res.RPTypes.push({
          ...rptype,
        });
      });
      this.sanads.forEach(sanad => {
        res.sanads.push({
          ...sanad,
        });
      });
      return res;

    }
  }
}
