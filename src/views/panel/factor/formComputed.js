export default {
  computed: {

    canSubmit() {
      if (this.item.id || this.isFpi) {
        return this.hasPerm('update', this.permissionBasename, this.item)
      } else {
        return this.hasPerm('create', this.permissionBasename, this.item)
      }
    },
    permissionBasename() {
      if (this.isFpi) return this.type
      if (this.isCw) return "consumptionWareFactor"
      return this.type + "Factor";
    },
    accountType() {
      if (this.isCw || this.isFpi) return 'level3'
      else return 'persons';
    },
    createUrl() {
      return 'factors/factors/'
    },
    updateUrl() {
      return `factors/factors/${this.id}/`
    },
    listRoute() {
      return {
        name: 'FactorsList',
        params: {
          type: this.type
        }
      }
    },
    isFpi() {
      return this.type == 'fpi';
    },
    isCw() {
      return this.type == 'cw';
    },
    title() {
      switch (this.type) {
        case "sale":
          return "فاکتور فروش";
        case "backFromSale":
          return "فاکتور برگشت از فروش";
        case "buy":
          return "فاکتور خرید";
        case "backFromBuy":
          return "فاکتور برگشت از خرید";
        case "fpi":
          return "موجودی اول دوره";
        case "cw":
          return "حواله ی کالای مصرفی";
      }
    },
    showDiscount() {
      return !this.isFpi && !this.isCw;
    },
    showTax() {
      return !this.isFpi && !this.isCw;
    },
    showFactorExpenses() {
      return !this.isFpi && !this.isCw;
    },
    reverseLabel() {
      switch (this.type) {
        case "sale":
          return "فاکتور برگشت از فروش";
        case "buy":
          return "فاکتور برگشت از خرید";
      }

    },
    paymentsSum() {
      let sum = 0;
      if (this.item.payments) {
        this.item.payments.forEach(payment => {
          sum += +payment.value;
        });
      }
      return sum;
    },
    canSubmitTransaction() {
      if (!this.id || this.isFpi || this.isCw) return false;
      return this.item.paidValue < this.sum.total;
    },
    exportLinks() {
      let url =
        "reports/lists/factors/TEMP?form=factor&type=" +
        this.type +
        "&id=" +
        this.id +
        "&token=" +
        this.token;
      url = this.endpoint(url);

      Object.keys(this.exportOptions).forEach(key => {
        let value = this.exportOptions[key];
        url += `&${key}=${value}`;
      });

      let item = {
        'html': url.replace("TEMP", "html"),
        'pdf': url.replace("TEMP", "pdf")
      }

      let receipt = {
        'html': item.html + "&summarized=true&hide_prices=true&receipt=true",
        'pdf': item.pdf + "&summarized=true&hide_prices=true&receipt=true"
      }

      return {
        item,
        receipt,
      };
    },
    sum() {
      let res = {
        sum: 0,
        afterDiscount: 0,
        tax: 0,
        discount: 0,
        afterTax: 0,
        total: 0,
        expenses: 0
      };
      this.rows.forEach(r => {
        res.sum += this.rowSumAfterDiscount(r);
        res.afterDiscount += this.rowSumAfterDiscount(r);
        res.tax += this.rowTax(r);
        res.afterTax += this.rowSumAfterTax(r);
        res.total += this.rowSumAfterTax(r);
      });
      this.item.expenses.forEach(e => {
        res.expenses += +e.value;
      });

      let overallDiscount = 0;
      if (this.hasValue(this.item.discountValue)) {
        overallDiscount = +this.item.discountValue;
        // res.afterDiscount -= +this.item.discountValue;
      } else {
        overallDiscount =
          (res.afterDiscount * +this.item.discountPercent) / 100;
        // res.afterDiscount = (res.afterDiscount * (100 - +this.item.discountPercent)) / 100;
      }
      res.afterDiscount -= overallDiscount;
      res.afterTax -= overallDiscount;
      res.total -= overallDiscount;

      if (this.hasValue(this.item.taxValue)) {
        res.afterTax += +this.item.taxValue;
        res.tax += +this.item.taxValue;
        res.total += +this.item.taxValue;
      }

      return res;
    },
    accountName() {
      if (this.isCw || this.isFpi) return "حساب"
      if (["buy", "backFromSale"].includes(this.type)) {
        return "فروشنده";
      } else {
        return "مشتری";
      }
    },

    hasBijak() {
      return ["buy", "backFromBuy"].includes(this.type) || this.isFpi;
    },
    transactionType() {
      let label;
      let name;
      if (["buy", "backFromSale"].includes(this.type)) {
        name = "payment";
        label = "پرداخت ";
      } else {
        name = "receive";
        label = "دریافت ";
      }
      return {
        label,
        name
      };
    },
    factorExpenseType() {
      if (this.isBuy || this.isBackFromSale) return 'buy'
      else return 'sale'
    },
    isBuy() {
      return this.type == 'buy'
    },
    isSale() {
      return this.type == 'sale'
    },
    isBack() {
      return ['backFromBuy', 'backFromSale'].includes(this.type);
    },
    isBackFromBuy() {
      return this.type == 'backFromBuy'
    },
    isBackFromSale() {
      return this.type == 'backFromSale'
    },
    receiptLabel() {
      if (this.isSale || this.isBackFromBuy) return 'حواله'
      else return 'رسید'
    }
  },
}