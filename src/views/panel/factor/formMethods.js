export default {
  methods: {
    getData() {
      this.getAccounts();
      this.getFactorCodes();
      this.getWarehouses();
      this.getWares();
      this.getFactorExpenses();
      if (this.id) {
        this.getFactor(this.id);
      } else if (this.fromId) {
        this.getFactor(this.fromId);
      }
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
      this.setFactorLabel(this.factorType);
      this.getData();
    },
    setDefaultValues() {
      let items = this.rows.filter(o => o.ware);
      items.forEach(item => {
        if (!this.isBuy && !item.fee) item.fee = item.ware.price;
        if (!item.warehouse) item.warehouse = item.ware.warehouse;
        item.sale_price = item.ware.price;
      });
    },
    setFactorLabel(factorType) {
      switch (factorType) {
        case "sale":
          this.factorLabel = "فروش";
          break;
        case "backFromSale":
          this.factorLabel = "برگشت از فروش";
          break;
        case "buy":
          this.factorLabel = "خرید";
          break;
        case "backFromBuy":
          this.factorLabel = "برگشت از خرید";
          break;
      }
    },
    validate(clearFactor = false) {
      let isValid = true;
      if (this.rows.length == 1) {
        this.notify(`لطفا حداقل یک ردیف وارد کنید`, "danger");
        isValid = false;
      }
      if (!this.factor.account) {
        this.notify(`لطفا حساب را انتخاب کنید`, "danger");
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
      if (this.factor.id) this.updateFactor(clearFactor);
      else this.storeFactor(clearFactor);
    },
    selectFactor(factor, changeRoute = false) {
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
        this.setFactorLabel(factor.type);
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
