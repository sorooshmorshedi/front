<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <m-datatable :headers="headers" :apiUrl="url" :filters.sync="filters" ref="datatable">
        <template #item.remain="{ item }">{{ getRemain(item) | toMoney}}</template>
        <template #item.settle="{ item }">
          <v-btn color="light-blue white--text" :to="toSettle(item)" text>تسویه</v-btn>
        </template>
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>
      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "FactorsList",
  props: {
    type: {},
    isPreFactor: {},
  },
  data() {
    return {
      filters: {},
      url: "reports/lists/factors",
    };
  },
  computed: {
    title() {
      let title = "";
      switch (this.type) {
        case "buy":
          title = "فاکتور های خرید";
          break;
        case "backFromBuy":
          title = "فاکتور های برگشت از خرید";
          break;
        case "sale":
          title = "فاکتور های فروش";
          break;
        case "backFromSale":
          title = "فاکتور های برگشت از فروش";
          break;
        case "cw":
          title = "حواله های کالای مصرفی";
          break;
        case "rc":
          title = "رسید ها";
          break;
        case "rm":
          title = "حواله ها";
          break;
      }

      if (this.isPreFactor) {
        title = "پیش " + title;
      }

      return title;
    },
    headers() {
      let headers = [
        {
          text: "شماره",
          value: "temporary_code",
        },
        {
          text: "تاریخ",
          value: "date",
          type: "date",
        },
        {
          text: "ساعت",
          value: "time",
        },
        {
          text: ["buy", "backFromBuy"].includes(this.type) ? "فروشنده" : "حساب",
          value: "account.name",
        },
        {
          text: "شرح",
          value: "explanation",
        },
        {
          text: "مبلغ کل فاکتور",
          value: "total_sum",
          type: "numeric",
        },
        {
          text: "قطعی",
          value: "is_definite",
          type: "boolean",
        },
      ];

      if (this.type != "cw") {
        headers.push({
          text: "مالیات ",
          value: "has_tax",
          type: "boolean",
        });
      }

      headers.push({
        text: "جزئیات",
        value: "detail",
        sortable: false,
        filterable: false,
      });

      return headers;
    },
  },
  created() {
    this.filters.type = this.type;
    this.filters.is_pre_factor = this.isPreFactor;
  },
  watch: {
    $route() {
      this.filters.type = this.type;
      this.filters.is_pre_factor = this.isPreFactor;
      this.$refs.datatable.getDataFromApi();
    },
  },
  methods: {
    to(item) {
      return {
        name: "FactorForm",
        params: {
          isPreFactor: item.is_pre_factor,
          type: this.type,
          id: item.id,
        },
      };
    },
  },
};
</script>

<style scoped lang="scss">
</style>