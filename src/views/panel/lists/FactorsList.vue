<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <m-datatable
        :headers="headers"
        :apiUrl="url"
        :filters.sync="filters"
        ref="datatable"
        @dblclick:row="(e, row) => $router.push(to(row.item))"
      >
        <template #item.remain="{ item }">{{
          getRemain(item) | toMoney
        }}</template>
        <template #item.settle="{ item }">
          <v-btn color="light-blue white--text" :to="toSettle(item)" text
            >تسویه</v-btn
          >
        </template>
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>
      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
import FactorMixin from "@/views/panel/factor/mixin";
export default {
  name: "FactorsList",
  mixins: [FactorMixin],
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
      return "لیست " + this.getFactorTitle(this.type, this.isPreFactor);
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
          value: "is_defined",
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

<style scoped lang="scss"></style>
