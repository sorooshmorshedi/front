<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <div class="title">لیست {{ options.label }}</div>
          <datatable
            v-if="showTable"
            :cols="options.cols"
            :url="options.url"
            :default-filters="defaultFilters"
            :router-name="options.routerName"
            :router-default-params="options.defaultParams"
            ref="datatable"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import datatable from "@/components/mcomponents/datatable/Server";
import formOptions from "./formOptions";
export default {
  name: "List",
  props: {
    form: { required: true },
    type: {},
    filters: {
      default() {
        return JSON.stringify({});
      }
    }
  },
  components: { datatable },
  data() {
    return {
      formOptions: formOptions,
      options: {},
      showTable: false
    };
  },
  computed: {
    defaultFilters() {
      return JSON.parse(this.filters);
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.log("init list");
      this.showTable = false;
      this.options = this.formOptions[this.form];
      let defaults;
      switch (this.type) {
        case "receive":
          this.options.label = "دریافت ها";
          defaults = { transactionType: this.type };
          this.defaultFilters = defaults;
          this.options.defaultParams = defaults;
          break;
        case "payment":
          this.options.label = "پرداخت ها";
          defaults = { transactionType: this.type };
          this.defaultFilters = defaults;
          this.options.defaultParams = defaults;
          break;
        case "received":
          this.options.label = "چک های دریافتی";
          this.defaultFilters = {
            received_or_paid: "r"
          };
          break;
        case "paid":
          this.options.label = "چک های پرداختی";
          this.defaultFilters = {
            received_or_paid: "p"
          };
          break;
        default:
          break;
      }
      if (this.form == "factor") {
        this.defaultFilters = { type: this.type };
        this.options.defaultParams = { factorType: this.type };

        switch (this.type) {
          case "buy":
            this.options.label = "فاکتور های خرید";
            break;
          case "backFromBuy":
            this.options.label = "فاکتور های برگشت از خرید";
            break;
          case "sale":
            this.options.label = "فاکتور های فروش";
            break;
          case "backFromSale":
            this.options.label = "فاکتور های برگشت از فروش";
            break;
        }
      }
      if (this.form == "receipt") {
        defaults = { receiptType: this.type };
        this.defaultFilters = defaults;
        this.options.defaultParams = defaults;
        switch (this.type) {
          case "receipt":
            this.options.label = "رسید ها";
            break;
          case "remittance":
            this.options.label = "حواله ها";
            break;
        }
      }
      this.showTable = true;
    }
  },
  watch: {
    form() {
      this.init();
    },
    type() {
      this.init();
    }
  }
};
</script>

<style scoped lang="scss">
</style>