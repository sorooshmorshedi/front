<template>
  <v-card>
    <v-card-title>لیست {{ options.label }}</v-card-title>
    <v-card-text class="mt-2">
      <m-datatable
        v-if="showTable"
        :headers="options.cols"
        :apiUrl="options.url"
        :default-filters="defaultFilters"
        :router-name="options.routerName"
        :router-default-params="options.defaultParams"
        ref="datatable"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import MDatatable from "@/components/mcomponents/datatable/MDatatable";
import formOptions from "./formOptions";
export default {
  name: "List",
  components: { MDatatable },
  props: {
    form: { required: true },
    type: {},
    filters: {
      default() {
        return JSON.stringify({});
      }
    },
  },
  data() {
    return {
      formOptions: formOptions,
      options: {},
      showTable: false,
      defaults: {}
    };
  },
  computed: {
    defaultFilters() {
      return {
        ...JSON.parse(this.filters),
        ...this.defaults
      };
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
      switch (this.type) {
        case "receive":
          this.options.label = "دریافت ها";
          this.defaults = { type: this.type };
          this.options.defaultParams = this.defaults;
          break;
        case "payment":
          this.options.label = "پرداخت ها";
          this.defaults = { type: this.type };
          this.options.defaultParams = this.defaults;
          break;
        case "received":
          this.options.label = "چک های دریافتی";
          this.defaults = {
            received_or_paid: "r"
          };
          break;
        case "paid":
          this.options.label = "چک های پرداختی";
          this.defaults = {
            received_or_paid: "p"
          };
          break;
        default:
          break;
      }
      if (this.form == "factor") {
        this.defaults = { type: this.type };
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
        this.defaults = defaults;
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