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
          data.forEach((count, i) => {
            if (this.rows[i].id) {
              let item = this.factor.items.filter(o => o.id == this.rows[i].id)[0];
              count += item.count;
            }
            if (count < this.rows[i].count) {
              this.notify(`موجودی انبار ردیف ${i+1} کافی نمی باشد، موجودی این انبار برای این کالا ${count} می باشد`, 'danger');
              flag = false
            }
          })

          if (!flag) return;

          if (this.factor.id) this.updateFactor(clearFactor);
          else this.storeFactor(clearFactor);
        }
      })


    },
    storeFactor(clearFactor) {
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
          this.syncFactor(data.id, clearFactor);
        }
      })
    },
    updateFactor(clearFactor) {
      let data = this.copy(this.factor);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      })
      this.request({
        url: this.endpoint('factors/factors/' + data.id + '/'),
        method: 'put',
        data: data,
        success: data => {
          this.syncFactor(data.id, clearFactor);
        }
      })

    },
    syncFactor(factorId, clearFactor) {
      let updatedItems = [];
      let newItems = [];
      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;
        let item = this.copy(row);
        item.warehouse = item.ware.warehouse;
        Object.keys(item).forEach(key => {
          if (item[key] && item[key].id) item[key] = item[key].id;
        });
        ["discountPercent", "discountValue"].forEach(
          k => {
            if (item[k] == "") item[k] = 0;
          }
        );
        if (item.id) {
          updatedItems.push(item);
        } else {
          item.factor = factorId;
          newItems.push(item);
        }
      });
      let updatedExpenses = [];
      let newExpenses = [];
      this.factor.expenses.forEach((row, i) => {
        let item = this.copy(row);
        Object.keys(item).forEach(key => {
          if (item[key] && item[key].id) item[key] = item[key].id;
        });
        if (item.id) {
          updatedExpenses.push(item);
        } else {
          item.factor = factorId;
          newExpenses.push(item);
        }
      });
      Promise.all([
        this.storeFactorItems(newItems),
        this.updateFactorItems(updatedItems),
        this.deleteFactorItems(),
        this.storeFactorExpenses(newExpenses),
        this.updateFactorExpenses(updatedExpenses),
        this.deleteFactorExpenses()
      ]).then(data => {
        this.getFactorCodes(true);
        this.updateFactorSanadAndReceipt(factorId, clearFactor);
      });
    },
    storeFactorItems(items) {
      if (!items.length) return;
      return this.request({
        url: this.endpoint("factors/items/mass"),
        method: "post",
        data: items,
        success: data => {
          this.log(items.length + " factor items created");
        }
      });
    },
    updateFactorItems(items) {
      if (!items.length) return;
      return this.request({
        url: this.endpoint("factors/items/mass"),
        method: "put",
        data: items,
        success: data => {
          this.log(items.length + " factor items updated");
        }
      });
    },
    deleteFactorItems() {
      if (!this.itemsToDelete.length) return;
      return this.request({
        url: this.endpoint("factors/items/mass"),
        method: "delete",
        data: this.itemsToDelete,
        success: data => {
          this.log(this.itemsToDelete.length + " factor items deleted");
          this.itemsToDelete = [];
        }
      });
    },
    storeFactorExpenses(expenses) {
      if (!expenses.length) return;
      return this.request({
        url: this.endpoint("factors/factorExpenses/mass"),
        method: "post",
        data: expenses,
        success: data => {
          this.log(expenses.length + " factor expenses created");
        }
      });
    },
    updateFactorExpenses(expenses) {
      if (!expenses.length) return;
      return this.request({
        url: this.endpoint("factors/factorExpenses/mass"),
        method: "put",
        data: expenses,
        success: data => {
          this.log(expenses.length + " factor expenses updated");
        }
      });
    },
    deleteFactorExpenses() {
      if (!this.expensesToDelete.length) return;
      return this.request({
        url: this.endpoint("factors/factorExpenses/mass"),
        method: "delete",
        data: this.expensesToDelete,
        success: data => {
          this.log(this.expensesToDelete.length + " factor expenses deleted");
          this.expensesToDelete = [];
        }
      });
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
          init && this.init();
        }
      })
    },
    getFactor(factorId) {
      if (!factorId) return;
      return this.request({
        url: this.endpoint('factors/factors/' + factorId + '/'),
        method: 'get',
        success: data => {
          if (this.factorType) this.selectFactor(data);
          else {
            this.$router.push({
              name: 'CreateFactor',
              params: {
                id: data.id,
                type: data.type,
              }
            });
          }
        }
      })
    },
    updateFactorSanadAndReceipt(factorId, clearFactor) {
      this.request({
        url: this.endpoint("factors/factors/updateSanadAndReceipt/" + factorId),
        method: "put",
        success: data => {
          this.successNotify();
          if (clearFactor) {
            this.clearFactor();
            this.$router.push({
              name: "FactorForm",
              params: {
                type: this.factorType,
              }
            });
          } else {
            this.$router.push({
              name: "FactorForm",
              params: {
                type: this.factorType,
                id: this.sanad.id
              }
            });
          }
        }
      });
    },
    clearFactor() {
      this.factor = {
        taxPercent: "",
        taxValue: "",
        discountPercent: "",
        discountValue: "",
        expenses: []
      }
      this.rows = [{}];
    },
    getFactorCodes() {
      Object.keys(this.factorCodes).forEach(k => this.factorCodes[k] = null);
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
      return this.factorCodes[this.factorType];
    },
  },
  filters: {},
}
