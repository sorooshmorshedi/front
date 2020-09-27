<template>
  <v-card>
    <v-card-title>لیست {{ options.label }}</v-card-title>
    <v-card-text class="mt-2">
      <m-datatable
        v-if="showTable"
        :headers="[...options.cols, ...detailCol]"
        :apiUrl="options.url"
        :filters.sync="filters"
        :router-name="options.routerName"
        :router-default-params="options.defaultParams"
        ref="datatable"
      >
        <template #item.detail="{ item }">
          <v-btn
            color="light-blue white--text"
            :to="{name:options.routerName, params: {id: item.id, ...options.defaultParams}}"
            target="_blank"
            icon
          >
            <v-icon>fa-external-link-alt</v-icon>
          </v-btn>
        </template>
      </m-datatable>
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
  },
  data() {
    return {
      formOptions: formOptions,
      options: {},
      showTable: false,
      filters: {},
      detailCol: {
        text: "",
        value: "detail",
        sortable: false,
        filterable: false,
      },
    };
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
        case "ia":
          this.options.label = "رسید های تعدیل انبار";
          this.filters = { type: this.type };
          this.options.defaultParams = this.filters;
          break;
        case "oa":
          this.options.label = "حواله های تعدیل انبار";
          this.filters = { type: this.type };
          this.options.defaultParams = this.filters;
          break;
        case "receive":
          this.options.label = "دریافت ها";
          this.filters = { transactionType: this.type };
          this.options.defaultParams = this.filters;
          break;
        case "payment":
          this.options.label = "پرداخت ها";
          this.filters = { transactionType: this.type };
          this.options.defaultParams = this.filters;
          break;
        case "imprest":
          this.options.label = "پرداخت های تنخواه";
          this.filters = { transactionType: this.type };
          this.options.defaultParams = this.filters;
          break;
        case "received":
          this.options.label = "چک های دریافتنی";
          this.filters = {
            received_or_paid: "r",
          };
          break;
        case "paid":
          this.options.label = "چک های پرداختنی";
          this.filters = {
            received_or_paid: "p",
          };
          break;
        default:
          break;
      }
      if (this.form == "factor") {
        this.filters = { type: this.type };
        this.options.defaultParams = { type: this.type };

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
        filters = { receiptType: this.type };
        this.filters = filters;
        this.options.defaultParams = filters;
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

      this.filters = {
        ...this.filters,
        ...this.$route.query,
      };
    },
  },
  watch: {
    form() {
      this.init();
    },
    type() {
      this.init();
    },
    urlQuery() {
      this.init();
    },
  },
};
</script>

<style scoped lang="scss">
</style>