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
            :default-filters="{type}"
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
  props: ["form", "type"],
  components: { datatable },
  data() {
    return {
      formOptions: formOptions,
      options: {},
      showTable: false
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
        case "receive":
          this.options.label = "دریافت ها";
          this.options.defaultParams = {
            transactionType: this.type
          };
          break;
        case "payment":
          this.options.label = "پرداخت ها";
          this.options.defaultParams = {
            transactionType: this.type
          };
          break;
        case "received":
          this.options.label = "چک های دریافتی";
          break;
        case "paid":
          this.options.label = "چک های پرداختی";
          break;
        default:
          break;
      }
      if (this.form == "factor") {
        this.options.defaultParams = {
          factorType: this.type
        };
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
        this.options.defaultParams = {
          receiptType: this.type
        };
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
      this.$nextTick(() => {
        this.$refs.datatable.$forceUpdate();
      });
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