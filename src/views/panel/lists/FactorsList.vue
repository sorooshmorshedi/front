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
  },
  data() {
    return {
      filters: {},
      url: "reports/lists/factors",
    };
  },
  computed: {
    title() {
      switch (this.type) {
        case "buy":
          return "فاکتور های خرید";
        case "backFromBuy":
          return "فاکتور های برگشت از خرید";
        case "sale":
          return "فاکتور های فروش";
        case "backFromSale":
          return "فاکتور های برگشت از فروش";
        case "cw":
          return "حواله های کالای مصرفی";
      }
    },
    headers() {
      let headers = [
        {
          text: "شماره",
          value: "code",
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

      if (this.type != 'cw') {
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
  },
  watch: {
    $route() {
      this.$refs.datatable.getDataFromApi();
      this.filters.type = this.type;
    },
  },
  methods: {
    to(item) {
      return {
        name: "FactorForm",
        params: {
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