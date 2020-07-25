export default {
  computed: {

    createUrl() {
      if (this.isFpi) {
        return "factors/firstPeriodInventory"
      } else {
        return 'factors/factors/'
      }
    },
    listRoute() {
      return {
        name: 'List',
        params: {
          form: 'factor',
          type: this.factorType
        }
      }
    },
    isFpi() {
      return this.factorType == 'fpi';
    },
    formTitle() {
      switch (this.factorType) {
        case "sale":
          return "فاکتور فروش";
          break;
        case "backFromSale":
          return "فاکتور برگشت از فروش";
          break;
        case "buy":
          return "فاکتور خرید";
          break;
        case "backFromBuy":
          return "فاکتور برگشت از خرید";
        case "fpi":
          return "موجودی اول دوره";
          break;
      }

    },
    hasDiscount() {
      return !this.isFpi;
    },
    reverseLabel() {
      switch (this.factorType) {
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
      if (!this.id) return false;
      return this.item.paidValue < this.sum.total;
    },
    exportLinks() {
      let url =
        "reports/lists/factors/TEMP?form=factor&type=" +
        this.factorType +
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
        'html': item.html + "&hide_prices=true",
        'pdf': item.pdf + "&hide_prices=true"
      }

      let preFactor = {
        'html': item.html + "&pre_factor=true",
        'pdf': item.pdf + "&pre_factor=true"
      }

      return {
        item,
        receipt,
        preFactor,
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
      if (["buy", "backFromSale"].includes(this.factorType)) {
        return "فروشنده";
      } else {
        return "مشتری";
      }
    },

    hasBijak() {
      return ["buy", "backFromBuy"].includes(this.factorType);
    },
    transactionType() {
      let label;
      let name;
      if (["buy", "backFromSale"].includes(this.factorType)) {
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
    isBuy() {
      return this.factorType == 'buy'
    },
    isSale() {
      return this.factorType == 'sale'
    },
    isBack() {
      return ['backFromBuy', 'backFromSale'].includes(this.factorType);
    },
    isBackFromBuy() {
      return this.factorType == 'backFromBuy'
    },
    isBackFromSale() {
      return this.factorType == 'backFromSale'
    },
    receiptLabel() {
      if (this.isSale || this.isBackFromBuy) return 'حواله'
      else return 'رسید'
    }
  },
}