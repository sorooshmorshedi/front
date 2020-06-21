export default {
  methods: {
    getData() {
      this.getAccounts();
      this.getFactorCodes();
      this.getWarehouses();
      this.getWares();
      this.getFactorExpenses();
      if (this.isFpi) {
        this.getFirstPeriodInventory();
      } else if (this.id) {
        this.getFactor(this.id);
      } else if (this.fromId) {
        this.getFactor(this.fromId);
      }
    },
    getFirstPeriodInventory() {
      this.request({
        url: this.endpoint("factors/firstPeriodInventory"),
        method: "get",
        success: data => {
          if (!data.message) {
            this.selectFactor(data, true);
          }
        }
      });
    },
    initForm() {
      this.log("Init Form");
      if (!this.id) {
        this.factor = {
          taxPercent: "",
          taxValue: "",
          discountPercent: "",
          discountValue: "",
          expenses: []
        };
        this.rows = [];
        this.rows.push(this.copy(this.rowTemplate));
      }
      this.getData();
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
    reverseType(factorType) {
      let factorReverseTypes = {
        sale: "backFromSale",
        buy: "backFromBuy"
      }
      return factorReverseTypes[factorType]
    },
    getFactorPayload() {
      let factor = this.copy(this.factor);
      factor = this.extractIds(factor);
      console.log('t', factor.time);

      let items = [];
      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;
        let item = this.copy(row);
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
      let url;
      if (this.isFpi) {
        url = "factors/firstPeriodInventory"
      } else {
        url = 'factors/factors/'
      }
      this.request({
        url: this.endpoint(url),
        method: 'post',
        data: data,
        success: data => {
          this.successNotify();
          if (clearFactor) {
            this.clearFactor(true);
          } else {
            this.selectFactor(data, true);
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
            this.selectFactor(data, true);
          }
        }
      })

    },
    definiteFactor(clearFactor) {
      this.request({
        url: this.endpoint('factors/factors/definite/' + this.factor.id),
        method: 'post',
        success: data => {
          this.selectFactor(data, true);
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
    setDefaultValues() {
      let items = this.rows.filter(o => o.ware);
      items.forEach(item => {
        if (!this.isBuy && !item.fee) item.fee = item.ware.price;
        if (!item.warehouse) item.warehouse = item.ware.warehouse;
        item.sale_price = item.ware.price;
      });
    },
    validate(clearFactor = false) {
      let isValid = true;
      if (this.rows.length == 1) {
        this.notify(`لطفا حداقل یک ردیف وارد کنید`, "danger");
        isValid = false;
      }
      this.rows.forEach((r, i) => {
        if (i == this.rows.length - 1) return;
        if (!r.count || r.count == 0) {
          this.notify(`لطفا تعداد ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
        if (r.fee == undefined || r.fee == "") {
          this.notify(`لطفا قیمت واحد ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
        if (r.count == undefined) {
          this.notify(`لطفا تعداد ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
      });
      if (!isValid) return;

      ["discountPercent", "discountValue", "taxPercent", "taxValue"].forEach(
        k => {
          if (this.factor[k] == "") this.factor[k] = 0;
        }
      );

      this.factor.type = this.factorType;

      if (this.isFpi) {
        this.storeFactor(clearFactor);
      } else if (this.factor.id) {
        this.updateFactor(clearFactor);
      } else {
        this.storeFactor(clearFactor);
      }
    },
    selectFactor(factor, changeRoute = false) {
      console.log('t', factor.time);
      this.log("Selecting Factor : ", factor);
      this.factor = factor;
      this.itemsToDelete = [];
      this.rows = factor.items;
      this.rows.push(this.copy(this.rowTemplate));

      if (this.fromId && !changeRoute) {
        delete this.factor.id;
        this.rows.map(row => {
          if (row.id) delete row.id;
        });
        this.factor.expenses.map(expense => {
          if (expense.id) delete expense.id;
        });
      } else {
        if (changeRoute) {
          this.makeFormUneditable();
          this.$router.push({
            name: "FactorForm",
            params: {
              id: factor.id,
              factorType: factor.type
            }
          });
        }
      }
    },
    deleteItemRow(index) {
      if (index == -1) {
        this.rows.forEach(row => {
          if (row.id) this.itemsToDelete.push(row.id);
        });
        this.rows.splice(0, this.rows.length - 1);
      } else {
        let row = this.rows[index];
        if (row.id) this.itemsToDelete.push(row.id);
        this.rows.splice(index, 1);
      }
    },
    deleteExpenseRow(index) {
      let row = this.factorExpensesCopy[index];
      if (row.id) this.expensesToDelete.push(row.id);
      this.factorExpensesCopy.splice(index, 1);
    },
    rowSum(row) {
      if (!this.hasValue(row.fee) || !this.hasValue(row.count)) return 0;
      return +row.fee * +row.count;
    },
    rowDiscount(row) {
      if (!this.rowSum(row)) return 0;
      if (
        !this.hasValue(row.discountValue) &&
        !this.hasValue(row.discountPercent)
      )
        return 0;
      if (this.hasValue(row.discountValue)) return +row.discountValue;
      else return +((this.rowSum(row) * +row.discountPercent) / 100).toFixed(2);
    },
    rowSumAfterDiscount(row) {
      return this.rowSum(row) - this.rowDiscount(row);
    },
    rowTax(row) {
      if (!this.rowSumAfterDiscount(row)) return 0;
      if (!this.factor.taxPercent) return 0;
      return +(
        (this.rowSumAfterDiscount(row) * +this.factor.taxPercent) /
        100
      ).toFixed(2);
    },
    rowSumAfterTax(row) {
      if (!this.rowTax(row)) return this.rowSumAfterDiscount(row);
      return this.rowSumAfterDiscount(row) + this.rowTax(row);
    },
    openFactorExpensesDialog() {
      if (this.factor.expenses.length) {
        this.factorExpensesCopy = [];
        this.factor.expenses.forEach(e => {
          this.factorExpensesCopy.push(this.copy(e));
        });
      }
      this.factorExpensesDialog = true;
    },
    addExpenses() {
      let isValid = true;
      this.factorExpensesCopy.forEach((e, i) => {
        if (i == this.factorExpensesCopy.length - 1) return;
        if (!e.expense) {
          this.notify(`لطفا نام هزینه ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
        if (!e.value || e.value == 0) {
          this.notify(`لطفا مبلغ ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
        if (!e.account) {
          this.notify(
            `لطفا حساب پرداخت کننده ردیف ${i + 1} را وارد کنید`,
            "danger"
          );
          isValid = false;
        }
        if (e.account && e.account.floatAccountGroup && !e.floatAccount) {
          this.notify(`لطفا حساب شناور ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
        if (e.account && e.account.costCenterGroup && !e.costCenter) {
          this.notify(`لطفا مرکز هزینه ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
      });

      if (!isValid) return;

      this.factorExpensesDialog = false;
      this.factor.expenses = this.copy(this.factorExpensesCopy);
      this.factor.expenses.pop();
      this.factorExpensesCopy = [{}];
    },
    goToForm(pos) {
      this.getFactorByPosition(pos);
    }

  }
}