<script>
import accountApiMixin from "@/mixin/accountMixin";
import getFactorExpensesApi from "./getFactorExpensesApi";
import wareApiMixin from "@/mixin/wareApi";
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import mtime from "@/components/mcomponents/cleave/Time";
import DistributionApiMixin from "@/modules/distribution/api";
import FactorMixin from "@/views/panel/factor/mixin";

import { MFormMixin } from "@/components/m-form";

export default {
  components: { money, date, mtime },
  mixins: [
    MFormMixin,
    formsMixin,
    accountApiMixin,
    wareApiMixin,
    getFactorExpensesApi,
    DistributionApiMixin,
    FactorMixin,
  ],
  props: {
    isPreFactor: {
      required: true,
      type: Boolean,
    },
    type: {
      required: true,
    },
    id: {
      default: false,
    },
    backFrom: {
      default: null,
    },
  },
  data() {
    return {
      hasList: false,
      transactionsDialog: false,
      baseUrl: "factors/factors",
      appendSlash: true,
      rowKey: "ware",
      hasIdProp: true,

      exportsDialog: false,
      factorExpensesDialog: false,
      factorExpensesCopy: [{}],
      expensesToDelete: [],
      exportOptions: {
        summarized: false,
        hide_expenses: false,
        hide_remain: false,
      },

      pricesDialog: false,
      priceWare: null,
      pricesFilters: {
        ware: null,
        factor__account: null,
        factor__floatAccount: null,
        factor__costCenter: null,
        factor__type__in: null,
      },

      priceMenus: {},

      pricesHeaders: [
        {
          text: "شماره فاکتور",
          value: "factor.code",
        },
        {
          text: "تاریخ",
          value: "factor.date",
          type: "date",
        },
        {
          text: "تعداد",
          value: "count",
          type: "numeric",
        },
        {
          text: "واحد",
          value: "unit.name",
        },
        {
          text: "فی",
          value: "fee",
          type: "numeric",
          sortable: false,
        },
        {
          text: "مبلغ کل",
          value: "total_value",
          type: "numeric",
          sortable: false,
        },
      ],

      calculatorDialog: false,
      row: null,
    };
  },
  computed: {
    showCalculatorBtn() {
      return true;
    },
    RoRFactorTypes() {
      return {
        rc: {
          factor: {
            label: "خرید",
            type: "buy",
          },
          backFactor: {
            label: "برگشت از فروش",
            type: "backFromSale",
          },
        },
        rm: {
          factor: {
            label: "فروش",
            type: "sale",
          },
          backFactor: {
            label: "برگشت از خرید",
            type: "backFromBuy",
          },
        },
      };
    },
    preFactor() {
      for (let row of this.rows) {
        if (row.id && row.preFactorItem) {
          let isPreFactor = row.preFactorItem.factor__is_pre_factor;
          let factorType = row.preFactorItem.factor__type;

          let label = "";
          if (isPreFactor) label = "پیش فاکتور";
          else if (factorType == "rm") label = "حواله";
          else if (factorType == "rc") label = "رسید";

          return {
            label: label,
            id: row.preFactorItem.factor__id,
            isPreFactor: isPreFactor,
            type: factorType,
          };
        }
      }
      return null;
    },
    isConverted() {
      for (let row of this.rows) {
        if (row.id && row.factorItem) return true;
      }
      return false;
    },
    hasSelect() {
      return this.isPreFactor || this.isRoR;
    },
    canSubmit() {
      if (this.item.id || this.isFpi) {
        return this.hasPerm("update", this.permissionBasename, this.item);
      } else {
        return this.hasPerm("create", this.permissionBasename, this.item);
      }
    },
    permissionBasename() {
      let basenames = {
        buy: "buyFactor",
        sale: "saleFactor",
        backFromBuy: "backFromBuyFactor",
        backFromSale: "backFromSaleFactor",
        fpi: "firstPeriodInventory",
        cw: "consumptionWareFactor",
        rc: "receipt",
        rm: "remittance",
        p: "production",
      };
      return basenames[this.type];
    },
    accountType() {
      if (this.isCw || this.isFpi || this.isProduction) return "level3";
      else return "persons";
    },
    createUrl() {
      return "factors/factors/";
    },
    updateUrl() {
      return `factors/factors/${this.id}/`;
    },
    listRoute() {
      return {
        name: "FactorsList",
        params: {
          isPreFactor: this.isPreFactor,
          type: this.type,
        },
      };
    },
    isRoR() {
      // is Receipt or Remittance
      return ["rc", "rm"].includes(this.type);
    },
    isFpi() {
      return this.type == "fpi";
    },
    isCw() {
      return this.type == "cw";
    },
    isBuy() {
      return this.type == "buy";
    },
    isSale() {
      return this.type == "sale";
    },
    isBack() {
      return ["backFromBuy", "backFromSale"].includes(this.type);
    },
    isBackFromBuy() {
      return this.type == "backFromBuy";
    },
    isBackFromSale() {
      return this.type == "backFromSale";
    },
    isProduction() {
      return this.type == "p";
    },
    title() {
      return this.getFactorTitle(this.type, this.isPreFactor);
    },
    showDiscount() {
      return !this.isFpi && !this.isCw && !this.isRoR && !this.isProduction;
    },
    showTax() {
      return !this.isFpi && !this.isCw && !this.isRoR && !this.isProduction;
    },
    showFactorExpenses() {
      return !this.isFpi && !this.isPreFactor && !this.isProduction;
    },
    hasTransaction() {
      return (
        this.id &&
        !this.isFpi &&
        !this.isCw &&
        !this.isPreFactor &&
        !this.isProduction
      );
    },
    hasReverseFactor() {
      return this.id && (this.isBuy || this.isSale);
    },
    hasBijak() {
      return ["buy", "backFromBuy"].includes(this.type) || this.isFpi;
    },
    reverseLabel() {
      let labels = {
        salereturn: "فاکتور برگشت از فروش",
        buyreturn: "فاکتور برگشت از خرید",
      };
      return labels[this.type];
    },
    paymentsSum() {
      let sum = 0;
      if (this.item.payments) {
        this.item.payments.forEach((payment) => {
          sum += +payment.value;
        });
      }
      return sum;
    },
    canSubmitTransaction() {
      if (
        !this.id ||
        this.isFpi ||
        this.isCw ||
        this.isPreFactor ||
        this.isRoR ||
        this.isProduction
      )
        return false;
      return this.item.paidValue < this.sum.total;
    },
    exportLinks() {
      let url =
        "reports/lists/factors/TEMP?form=factor&type=" +
        this.type +
        "&is_pre_factor=" +
        this.isPreFactor +
        "&id=" +
        this.id +
        "&token=" +
        this.token;
      url = this.endpoint(url);

      Object.keys(this.exportOptions).forEach((key) => {
        let value = this.exportOptions[key];
        url += `&${key}=${value}`;
      });

      let item = {
        html: url.replace("TEMP", "html"),
        pdf: url.replace("TEMP", "pdf"),
      };

      let receipt = {
        html: item.html + "&summarized=true&hide_prices=true&receipt=true",
        pdf: item.pdf + "&summarized=true&hide_prices=true&receipt=true",
      };

      return {
        item,
        receipt,
      };
    },
    sum() {
      let res = {
        sum: 0,
        afterDiscount: 0,
        discount: 0,
        afterTax: 0,
        total: 0,
        expenses: 0,
      };
      this.rows.forEach((r) => {
        res.sum += this.rowSumAfterTax(r);
      });
      this.item.expenses.forEach((e) => {
        res.expenses += +e.value;
      });

      let overallDiscount = 0;
      if (this.hasValue(this.item.discountValue)) {
        overallDiscount = +this.item.discountValue;
      } else {
        overallDiscount = (res.sum * +this.item.discountPercent) / 100;
      }
      res.afterDiscount = res.sum - overallDiscount;
      res.total = res.afterDiscount + +this.item.taxValue;

      return res;
    },
    accountName() {
      if (this.isCw || this.isFpi || this.isRoR || this.isProduction)
        return "حساب";
      if (["buy", "backFromBuy"].includes(this.type)) {
        return "فروشنده";
      } else {
        return "مشتری";
      }
    },
    transactionLink() {
      return this.getFactorTransactionLink(this.item);
    },
    factorExpenseType() {
      if (this.isBuy || this.isBackFromSale) return "buy";
      else return "sale";
    },
    receiptLabel() {
      if (this.isSale || this.isBackFromBuy) return "حواله";
      else return "رسید";
    },
    quickTransactionOptions() {
      if (["buy", "backFromSale"].includes(this.type)) {
        return [
          {
            text: "وجه نقد سریع",
            codename: "quickCachePayment",
          },
          {
            text: "بانکی سریع",
            codename: "quickBankPayment",
          },
        ];
      } else {
        return [
          {
            text: "وجه نقد سریع",
            codename: "quickCacheReceive",
          },
          {
            text: "کارتخوان سریع",
            codename: "quickPosReceive",
          },
        ];
      }
    },

    factorVisitors() {
      let visitors = this.visitors.filter((o) => o.level == 3);
      let userVisitor = visitors.find((o) => o.user.id == this.user.id);
      if (userVisitor) {
        this.item.visitor = userVisitor.id;
        return [userVisitor];
      } else {
        return visitors;
      }
    },
    squareMetters() {
      let data = this.row.meta;
      return (this.row.meta.square_meters = +(data.length * data.width).toFixed(
        6
      ));
    },
    totalSquareMetters() {
      let data = this.row.meta;
      return (this.row.meta.total_square_meters = +(
        this.row.meta.square_meters * data.count
      ).toFixed(6));
    },
  },
  watch: {
    rows: {
      handler(newRows, oldRows) {
        this.setDefaultValues();
      },
      deep: true,
    },
    factorExpensesCopy: {
      handler() {
        let expense = this.factorExpensesCopy[
          this.factorExpensesCopy.length - 1
        ];
        if (expense && expense.expense) {
          this.factorExpensesCopy.push({});
        }
      },
      deep: true,
    },
    "item.has_tax"() {
      if (this.item.has_tax == false) {
        this.item.taxPercent = 0;
        this.item.taxValue = 0;
      }
    },
  },
  mounted() {
    this.getVisitors();
    this.getUnits();
    this.getSalePriceTypes();
  },
  methods: {
    getData() {
      this.getWarehouses();
      this.getFactorExpenses();
      if (this.isFpi) {
        this.getFirstPeriodInventory();
      } else if (this.backFrom) {
        this.getFactor(this.backFrom);
      }
    },
    getFirstPeriodInventory() {
      this.request({
        url: this.endpoint("factors/firstPeriodInventory"),
        method: "get",
        success: (data) => {
          if (!data.message) {
            this.setItem(data);
            this.isEditing = false;
          }
        },
      });
    },
    getItemTemplate() {
      return {
        account: {},
        hax_tax: false,
        taxValue: "",
        discountPercent: "",
        discountValue: "",
        backFrom: null,
        expenses: [],
        date: undefined,
        time: undefined,
        is_pre_factor: this.isPreFactor,
      };
    },
    getRowTemplate() {
      let explanation = "";
      if (this.isFpi) {
        explanation = "ثبت موجودی اول دوره";
      }
      return {
        discountValue: "",
        discountPercent: "",
        tax_value: "",
        tax_percent: "",
        fee: "",
        count: null,
        unit_count: null,
        ware: null,
        unit: null,
        warehouse: null,
        explanation: explanation,
        is_selected: false,
        meta: {},
      };
    },
    getFactor(factorId) {
      return this.request({
        url: this.endpoint("factors/factors/" + factorId + "/"),
        method: "get",
        success: (data) => {
          this.setItem(data);
        },
      });
    },
    getItemByPosition(pos) {
      return this.request({
        url: this.endpoint("factors/factors/byPosition"),
        method: "get",
        params: {
          type: this.type,
          is_pre_factor: this.isPreFactor,
          id: this.item.id,
          position: pos,
        },
        success: (data) => {
          this.setItem(data, true);
        },
        error: (error) => {
          if (error.response.status == 404) {
            this.notify("فاکتور وجود ندارد", "warning");
          }
        },
      });
    },
    setProductionAccount() {
      let defaultAccount = this.getDefaultAccount("producedWareAccount");
      if (defaultAccount) {
        this.$set(this.item, "account", defaultAccount.account);
        this.$set(this.item, "floatAccount", defaultAccount.floatAccount);
        this.$set(this.item, "costCenter", defaultAccount.costCenter);
      }
    },
    openTransaction(transaction) {
      let routeData = this.$router.resolve({
        name: "TransactionForm",
        params: {
          type: transaction.type,
          id: transaction.id,
        },
      });
      window.open(routeData.href, "_blank");
    },
    getSerialized() {
      if (this.isProduction) {
        this.setProductionAccount();
      }

      let factor = this.copy(this.item);
      factor = this.extractIds(factor);
      factor.path = this.item.account.path;

      let items = [];
      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;
        let item = this.copy(row);
        item.count = this.convertToMainUnit(
          item.ware,
          item.unit_count,
          item.unit
        );
        item = this.extractIds(item);
        [
          "discountPercent",
          "discountValue",
          "tax_value",
          "tax_percent",
        ].forEach((k) => {
          if (item[k] == "") item[k] = 0;
        });
        items.push(item);
      });

      let expenses = [];
      this.item.expenses.forEach((row, i) => {
        // Should I put this?
        // if (i == this.rows.length - 1) return;
        let item = this.copy(row);
        item = this.extractIds(item);
        expenses.push(item);
      });

      return {
        item: factor,
        items: {
          items: items,
          ids_to_delete: this.itemsToDelete,
        },
        expenses: {
          items: expenses,
          ids_to_delete: this.expensesToDelete,
        },
      };
    },
    definiteFactor(clearForm) {
      this.request({
        url: this.endpoint("factors/factors/definite/" + this.item.id),
        method: "post",
        success: (data) => {
          this.setItem(data);
          this.successNotify();
        },
      });
    },
    setDefaultValues() {
      let items = this.rows.filter((o) => o.ware);
      items.forEach((item) => {
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
        if (!r.unit_count || r.unit_count == 0) {
          this.notify(`لطفا تعداد ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
        if (r.fee == undefined || r.fee == "") {
          if (this.isCw || this.isRoR) r.fee = 0;
          else {
            this.notify(`لطفا قیمت واحد ردیف ${i + 1} را وارد کنید`, "danger");
            isValid = false;
          }
        }
        if (r.unit_count == undefined) {
          this.notify(`لطفا تعداد ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
      });
      if (!isValid) return;

      ["discountPercent", "discountValue", "taxPercent", "taxValue"].forEach(
        (k) => {
          if (this.item[k] == "") this.item[k] = 0;
        }
      );

      this.item.type = this.type;

      this.submit(clearForm);
    },
    setItem(item) {
      this.rows = item.items.sort((a, b) => a.order - b.order);

      if (this.backFrom && item.backFrom != this.backFrom) {
        let keysToCopy = [
          "account",
          "floatAccount",
          "costCenter",
          "date",
          "time",
          "discountValue",
          "discountPercent",
          "has_tax",
          "taxValue",
          "taxPercent",
          "visitor",
          "path",
        ];

        for (let key of keysToCopy) {
          this.$set(this.item, key, item[key]);
        }
        this.item.type = this.type;
        this.item.backFrom = this.backFrom;

        this.rows.map((row) => {
          delete row.id;
          delete row.factor;
          return row;
        });
        this.item.expenses.map((expense) => {
          delete expense.id;
          delete expense.factor;
          return expense;
        });
      } else {
        this.item = item;
        this.changeRouteTo(item.id, {
          type: item.type,
          isPreFactor: item.is_pre_factor,
        });
      }

      this.rows.push(this.getRowTemplate());
      this.itemsToDelete = [];
    },
    deleteItemRow(index) {
      if (index == -1) {
        this.rows.forEach((row) => {
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
      if (!this.hasValue(row.fee) || !this.hasValue(row.unit_count)) return 0;
      return +row.fee * +row.unit_count;
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
      if (!this.hasValue(row.tax_value) && !this.hasValue(row.tax_percent))
        return 0;
      if (this.hasValue(row.tax_value)) return +row.tax_value;
      else
        return +(
          (this.rowSumAfterDiscount(row) * +row.tax_percent) /
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
        this.item.expenses.forEach((e) => {
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
          this.notify(
            `لطفا مرکز هزینه و درآمد ردیف ${i + 1} را وارد کنید`,
            "danger"
          );
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

      this.$router.push(this.getReverseFactorLink(this.item).to);

      this.$nextTick(() => {
        this.rows = [];
        for (const row of rows) {
          if (row.id) delete row.id;
          this.rows.push({
            ...row,
          });
        }
      });
    },
    showPrices(ware) {
      this.priceWare = ware;
      if (this.item.account) {
        this.pricesFilters.factor__account = this.item.account.id;
        if (this.item.floatAccount)
          this.pricesFilters.factor__floatAccount = this.item.floatAccount.id;
        if (this.item.costCenter)
          this.pricesFilters.factor__costCenter = this.item.costCenter.id;
      }
      this.pricesFilters.ware = ware.id;
      this.pricesFilters.factor__type__in = this.type;
      this.pricesDialog = true;
    },
    getWarePrices(row) {
      if (row.ware && row.unit) {
        let salePrices = row.ware.salePrices;
        let unit = row.unit;
        let prices = salePrices.filter((o) => o.unit == unit.id)[0].prices;
        let result = [];
        for (let salePriceTypeId of Object.keys(prices)) {
          let salePriceType = this.salePriceTypes.filter(
            (o) => o.id == salePriceTypeId
          )[0];
          if (salePriceType) {
            result.push({
              id: salePriceTypeId,
              price: prices[salePriceTypeId],
              name: salePriceType.name,
            });
          }
        }
        return result;
      } else {
        return [];
      }
    },
    updateRowFee(row) {
      if (
        (this.isSale || this.isBackFromBuy) &&
        this.item.account &&
        row.ware &&
        row.unit
      ) {
        let defaultSalePriceType = this.item.account.defaultSalePriceType;
        let prices = this.getWarePrices(row);
        let price = prices.find((o) => o.id == defaultSalePriceType.id);
        if (price) {
          row.fee = price.price;
        } else {
          row.fee = null;
        }
      } else {
        row.fee = null;
      }
    },
    createQuickTransaction(codename) {
      this.request({
        url: this.endpoint("transactions/quickFactorTransaction"),
        method: "post",
        data: {
          factor_id: this.id,
          default_account_codename: codename,
        },
        success: (data) => {
          this.setItem(data);
          this.successNotify();
        },
      });
    },
    getFeeSuffix(row) {
      let price = this.getWarePrices(row).find((o) => o.price == row.fee);
      if (price) return price.name;
      return undefined;
    },
    clearRow(i) {
      let template = this.getRowTemplate();
      Object.keys(template).forEach((key) => {
        if (key == "ware") return;
        this.rows[i][key] = template[key];
      });
    },
    convertPreFactorToFactor() {
      this.rows = this.rows.filter(
        (o) => o.id && o.preFactorItem == null && o.is_selected
      );

      this.rows = this.rows.map((o) => {
        o.preFactorItem = o.id;
        o.id = null;
        return o;
      });
      this.rows.push(this.getItemTemplate());

      this.item.id = null;
      this.item.is_pre_factor = false;

      this.submit(false);
    },
    getFactorItemLink(row) {
      let factorItem = row.factorItem;

      let to = {
        name: "FactorForm",
        params: {
          id: factorItem.factor_id,
          type: factorItem.factor_type,
          is_pre_factor: false,
        },
      };

      let title = `تبدیل شده به فاکتور شماره ${
        factorItem.factor_temporary_code
      } ردیف ${+factorItem.order + 1}`;

      let text = factorItem.factor_temporary_code;

      return {
        to,
        title,
        text,
      };
    },
    convertRoRToFactor(factorType) {
      let rows = this.rows.filter(
        (o) => o.id && o.preFactorItem == null && o.is_selected
      );

      rows = rows.map((o) => {
        o.preFactorItem = o.id;
        o.id = null;
        return o;
      });

      let item = this.copy(this.item);
      item.id = null;
      item.temporary_code = null;
      item.factorType = factorType;

      this.$router.push({
        to: "FactorForm",
        params: {
          id: null,
          type: factorType,
          isPreFactor: false,
        },
      });

      this.$nextTick(() => {
        this.item = item;

        this.rows = [];
        for (const row of rows) {
          this.rows.push({
            ...row,
          });
        }
      });
    },
    openCalculatorDialog(row) {
      this.row = row;
      this.calculatorDialog = true;
    },
    setCalculatorData() {
      let meta = this.row.meta;
      if (!meta.static_value) this.row.unit_count = meta.total_square_meters;
      this.row.explanation = `قطر: ${meta.diameter}، طول: ${meta.length}، عرض: ${meta.width}، تعداد: ${meta.count}، متر مربع: ${meta.square_meters}، متر مربع کل: ${meta.total_square_meters}`;
      this.calculatorDialog = false;
    },
  },
};
</script>