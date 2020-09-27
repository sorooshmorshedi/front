import {
  mapState
} from "vuex";
import {
  maxBy
} from 'lodash';

export default {
  methods: {
    getFactorExpenses(force = false, init = true) {
      if (!force && this.factorExpenses.length) return;
      return this.request({
        url: this.endpoint('factors/expenses/'),
        method: 'get',
        success: data => {
          this.$store.commit('setFactors', {
            factorExpenses: data
          });
          // init && this.init();
        }
      })
    },
  },
  computed: {
    ...mapState({
      factorExpenses: state => state.factors.factorExpenses,
    }),
  },
  filters: {},
}