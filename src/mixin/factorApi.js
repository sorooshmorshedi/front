import {
  mapState
} from "vuex";
import {
  maxBy
} from 'lodash';

export default {
  methods: {
    getFactors(force = false, init = true) {
      if (!force && this.factors.length) return;
      return this.request({
        url: this.endpoint('factors/factors/'),
        method: 'get',
        success: data => {
          this.$store.commit('setFactors', {
            factors: data
          });
          init && this.init();
        }
      })
    },
    storeFactor() {
      let data = this.copy(this.factor);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      })
      data.code = this.factorCode;
      this.request({
        url: this.endpoint('factors/factors/'),
        method: 'post',
        data: data,
        success: data => {
          this.getFactors(true);
          this.successNotify();
        }
      })
    },
    updateFactor() {
      let data = this.copy(this.factor);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      })
      this.request({
        url: this.endpoint('factors/factors/' + data.id + '/'),
        method: 'put',
        data: data,
        success: data => {
          this.getFactors(true);
          this.successNotify();
        }
      })

    },
    deleteFactor(factor) {
      this.request({
        url: this.endpoint('factors/factors/' + factor.id),
        method: 'delete',
        success: data => {
          this.getFactors(true);
          this.successNotify();
        }
      })
    },
    getFactorExpenses(force = false, init = true) {
      if (!force && this.factorExpenses.length) return;
      return this.request({
        url: this.endpoint('factors/expenses/'),
        method: 'get',
        success: data => {
          console.log(data);
          this.$store.commit('setFactors', {
            factorExpenses: data
          });
          init && this.init();
        }
      })
    },
  },
  computed: {
    ...mapState({
      factors: state => state.factors.factors,
      factorExpenses: state => state.factors.factorExpenses,
    }),
    factorsSelectValues() {
      if (!this.factors) return [];
      let res = {
        factors: [],
        factorExpenses: [],
      };
      res.factors = this.copy(this.factors);
      res.factorExpenses = this.copy(this.factorExpenses);
      return res;
    },
    factorCode() {
      let last = maxBy(this.factors, o => o.code);
      if (last) {
        let code = +last.code + 1
        return code;
      }
      return 1;
    },
  },
  filters: {},
}
