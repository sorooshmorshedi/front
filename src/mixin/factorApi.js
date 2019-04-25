import {
  mapState
} from "vuex";
import {
  maxBy
} from 'lodash';

export default {
  data() {
    return {
      factorCodes: {
        buy: null,
        backFromBuy: null,
        sale: null,
        backFromSale: null,
      }
    }
  },
  methods: {
    checkInventories(clearFactor) {
      if (['buy', 'backFromSale'].includes(this.factor.type)) {
        if (this.factor.id) this.updateFactor(clearFactor);
        else this.storeFactor(clearFactor);
        return;
      }
      let payload = [];
      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;
        payload.push({
          ware: row.ware.id,
          warehouse: row.ware.warehouse.id
        });
      });
      this.request({
        url: this.endpoint('wares/inventory/check'),
        method: 'post',
        data: payload,
        success: data => {

          let flag = true;
          data.forEach((inventory, i) => {
            let count = inventory.count
            let row = this.rows.filter(o => o.ware && o.ware.id == inventory.ware)
            if (row) count += row.count
            if (count < row.count) {
              this.notify(`موجودی انبار ردیف ${i + 1} کافی نمی باشد، موجودی این انبار برای این کالا ${count} می باشد`, 'danger');
              flag = false
            }
          })

          if (!flag) return;

          if (this.factor.id) this.updateFactor(clearFactor);
          else this.storeFactor(clearFactor);
        }
      })


    },
    getFactorPayload() {
      let factor = this.copy(this.factor);
      factor = this.extractIds(factor);

      let items = [];
      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;
        let item = this.copy(row);
        item.warehouse = item.ware.warehouse;
        item = this.extractIds(item);
        ["discountPercent", "discountValue"].forEach(
          k => {
            if (item[k] == "") item[k] = 0;
          }
        );
        items.push(item);
      });


      let expenses = [];
      this.factor.expenses.forEach((row, i) => {
        // Should I put this?
        // if (i == this.rows.length - 1) return;
        let item = this.copy(row);
        item = this.extractIds(item);
        expenses.push(item)
      });

      return {
        factor: factor,
        factor_items: {
          items: items,
          ids_to_delete: this.itemsToDelete
        },
        factor_expenses: {
          items: expenses,
          ids_to_delete: this.expensesToDelete
        }
      }
    },
    storeFactor(clearFactor) {
      let data = this.getFactorPayload()
      this.request({
        url: this.endpoint('factors/factors/'),
        method: 'post',
        data: data,
        success: data => {
          this.successNotify();
          if (clearFactor) {
            this.clearFactor(true);
          } else {
            this.selectFactor(data);
          }
        }
      })
    },
    updateFactor(clearFactor) {
      let data = this.getFactorPayload()
      this.request({
        url: this.endpoint('factors/factors/' + this.factor.id + '/'),
        method: 'put',
        data: data,
        success: data => {
          this.successNotify();
          if (clearFactor) {
            this.clearFactor(true);
          } else {
            this.selectFactor(data);
          }
        }
      })

    },
    definiteFactor(clearFactor) {
      this.request({
        url: this.endpoint('factors/factors/definite/' + this.factor.id),
        method: 'post',
        success: data => {
          this.selectFactor(data);
          this.successNotify();
        }
      })

    },
    deleteFactor() {
      let data = this.copy(this.factor);
      this.request({
        url: this.endpoint('factors/factors/' + data.id + '/'),
        method: 'delete',
        success: data => {
          this.successNotify()
          this.clearFactor(true);
        }
      })

    },
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
    getFactor(factorId) {
      this.log('Get Factor By Id : ' + factorId);
      return this.request({
        url: this.endpoint('factors/factors/' + factorId + '/'),
        method: 'get',
        success: data => {
          this.selectFactor(data);
        }
      })
    },
    getFactorByPosition(pos) {
      this.log('Get Factor By Position : ', pos);
      return this.request({
        url: this.endpoint('factors/getFactorByPosition'),
        method: 'get',
        params: {
          type: this.factorType,
          id: this.factor.id,
          position: pos
        },
        success: data => {
          this.selectFactor(data, true)
        },
        error: error => {
          if (error.response.status == 404) {
            this.notify('فاکتور وجود ندارد', 'warning')
          }
        }
      })
    },
    clearFactor(redirect = false) {
      if (redirect) {
        this.$router.push({
          name: "FactorForm",
          params: {
            factorType: this.factorType,
          }
        });
      }
      this.factor = {
        taxPercent: "",
        taxValue: "",
        discountPercent: "",
        discountValue: "",
        expenses: []
      }
      this.rows = [this.copy(this.rowTemplate)];
    },
    getFactorCodes() {
      this.request({
        url: this.endpoint("factors/factors/newCodes"),
        method: "get",
        success: data => {
          this.factorCodes = data;
        }
      });
    },
    openTransaction(transaction) {
      let routeData = this.$router.resolve({
        name: "TransactionForm",
        params: {
          transactionType: transaction.type,
          id: transaction.id
        }
      });
      window.open(routeData.href, "_blank");
    },
  },
  computed: {
    ...mapState({
      factorExpenses: state => state.factors.factorExpenses,
    }),
    factorsSelectValues() {
      let res = {
        factorExpenses: [],
      };
      if (!this.factorExpenses) return res;
      res.factorExpenses = this.copy(this.factorExpenses);
      return res;
    },
    factorCode() {
      let code = this.factorCodes[this.factorType];
      if (code) return code;
      else return {}
    },
  },
  filters: {},
}
