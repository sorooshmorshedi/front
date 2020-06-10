export default {
  computed: {
    factorCode() {
      let code = this.factorCodes[this.factorType];
      if (code) return code;
      else return {}
    },
    paymentsSum() {
      let sum = 0;
      if (this.factor.payments) {
        this.factor.payments.forEach(payment => {
          sum += +payment.value;
        });
      }
      return sum;
    },
    canSubmitTransaction() {
      if (!this.id) return false;
      return this.factor.paidValue < this.sum.total;
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

      let factor = {
        'html': url.replace("TEMP", "html"),
        'pdf': url.replace("TEMP", "pdf")
      }

      let receipt = {
        'html': factor.html + "&hide_prices=true",
        'pdf': factor.pdf + "&hide_prices=true"
      }

      let preFactor = {
        'html': factor.html + "&pre_factor=true",
        'pdf': factor.pdf + "&pre_factor=true"
      }

      return {
        factor,
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
      this.factor.expenses.forEach(e => {
        res.expenses += +e.value;
      });

      let overallDiscount = 0;
      if (this.hasValue(this.factor.discountValue)) {
        overallDiscount = +this.factor.discountValue;
        // res.afterDiscount -= +this.factor.discountValue;
      } else {
        overallDiscount =
          (res.afterDiscount * +this.factor.discountPercent) / 100;
        // res.afterDiscount = (res.afterDiscount * (100 - +this.factor.discountPercent)) / 100;
      }
      res.afterDiscount -= overallDiscount;
      res.afterTax -= overallDiscount;
      res.total -= overallDiscount;

      if (this.hasValue(this.factor.taxValue)) {
        res.afterTax += +this.factor.taxValue;
        res.tax += +this.factor.taxValue;
        res.total += +this.factor.taxValue;
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
    hasFirst() {
      if (this.factorCode == 1) return false;
      return true;
    },
    hasNext() {
      return true;
      if (!this.factor.code) return false;
      if (this.factor.code == this.factorCode - 1) return false;
      if (!this.id) return false;
      return true;
    },
    hasPrev() {
      return true;
      if (this.factorCode == 1) return false;
      if (this.factor.code == 1) return false;
      return true;
    },
    hasLast() {
      return true;
      if (this.factorCode == 1) return false;
      return true;
    },
    canSubmit() {
      return true;
    },
    canDelete() {
      if (!this.factor.id) return false;
      return true;
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
      return this.factorType.includes('back')
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
