export default {
  methods: {
    getData() {
      this.getWarehouses();
      this.getFactorExpenses();
      if (this.isFpi) {
        this.getFirstPeriodInventory();
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
            successResponse(data)
          }
        }
      });
    },
    getItemTemplate() {
      return {
        account: {},
        hax_tax: false,
        taxPercent: "",
        taxValue: "",
        discountPercent: "",
        discountValue: "",
        expenses: []
      }
    },
    getRowTemplate() {
      let explanation = "";
      if (this.isFpi) {
        explanation = "ثبت موجودی اول دوره"
      }
      return {
        discountValue: "",
        discountPercent: "",
        fee: "",
        ware: null,
        warehouse: null,
        explanation: explanation
      }

    },

    getFactor(factorId) {
      return this.request({
        url: this.endpoint('factors/factors/' + factorId + '/'),
        method: 'get',
        success: data => {
          this.setItem(data);
        }
      })
    },
    getItemByPosition(pos) {
      return this.request({
        url: this.endpoint('factors/factors/byPosition'),
        method: 'get',
        params: {
          type: this.type,
          id: this.item.id,
          position: pos
        },
        success: data => {
          this.setItem(data, true)
        },
        error: error => {
          if (error.response.status == 404) {
            this.notify('فاکتور وجود ندارد', 'warning')
          }
        }
      })
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
    reverseType(type) {
      let factorReverseTypes = {
        sale: "backFromSale",
        buy: "backFromBuy"
      }
      return factorReverseTypes[type]
    },
    getSerialized() {
      let factor = this.copy(this.item);
      factor = this.extractIds(factor);

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
      this.item.expenses.forEach((row, i) => {
        // Should I put this?
        // if (i == this.rows.length - 1) return;
        let item = this.copy(row);
        item = this.extractIds(item);
        expenses.push(item)
      });

      return {
        item: factor,
        items: {
          items: items,
          ids_to_delete: this.itemsToDelete
        },
        expenses: {
          items: expenses,
          ids_to_delete: this.expensesToDelete
        }
      }
    },
    definiteFactor(clearForm) {
      this.request({
        url: this.endpoint('factors/factors/definite/' + this.item.id),
        method: 'post',
        success: data => {
          this.setItem(data);
          this.successNotify();
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
    validate(clearForm = false) {
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
          if (this.isCw) r.fee = 0
          else {
            this.notify(`لطفا قیمت واحد ردیف ${i + 1} را وارد کنید`, "danger");
            isValid = false;
          }
        }
        if (r.count == undefined) {
          this.notify(`لطفا تعداد ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
      });
      if (!isValid) return;

      ["discountPercent", "discountValue", "taxPercent", "taxValue"].forEach(
        k => {
          if (this.item[k] == "") this.item[k] = 0;
        }
      );

      this.item.type = this.type;

      this.submit(clearForm);
    },
    setItem(item) {
      this.item = item;
      this.itemsToDelete = [];
      this.rows = item.items;
      this.rows.push(this.getRowTemplate());

      if (this.fromId) {
        delete this.item.id;
        this.rows.map(row => {
          if (row.id) delete row.id;
        });
        this.item.expenses.map(expense => {
          if (expense.id) delete expense.id;
        });
      }

      this.changeRouteTo(item.id);
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
      if (!this.item.taxPercent) return 0;
      return +(
        (this.rowSumAfterDiscount(row) * +this.item.taxPercent) /
        100
      ).toFixed(2);
    },
    rowSumAfterTax(row) {
      if (!this.rowTax(row)) return this.rowSumAfterDiscount(row);
      return this.rowSumAfterDiscount(row) + this.rowTax(row);
    },
    openFactorExpensesDialog() {
      if (this.item.expenses.length) {
        this.factorExpensesCopy = [];
        this.item.expenses.forEach(e => {
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
          this.notify(`لطفا مرکز هزینه و درآمد ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
      });

      if (!isValid) return;

      this.factorExpensesDialog = false;
      this.item.expenses = this.copy(this.factorExpensesCopy);
      this.item.expenses.pop();
      this.factorExpensesCopy = [{}];
    },
    reverseFactor() {
      let rows = this.copy(this.rows);
      this.$router.push({
        name: 'FactorForm',
        params: {
          type: this.reverseType(this.type)
        },
        query: {
          'item.account': this.item.account.id
        }
      })
      this.$nextTick(() => {
        this.rows = [];
        for (const row of rows) {
          if (row.id) delete row.id;
          this.rows.push({
            ...row
          });
        }
      });


    }

  }
}