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
  name: "AdjustmentsList",
  props: {
    type: {},
  },
  data() {
    return {
      filters: {},
      url: "reports/lists/adjustments",
    };
  },
  computed: {
    title() {
      switch (this.type) {
        case "ia":
          return "رسید های تعدیل انبار";
        case "oa":
          return "حواله های تعدیل انبار";
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
        },
        {
          text: "توضیحات",
          value: "explanation",
        },
      ];

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
        name: "AdjustmentForm",
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