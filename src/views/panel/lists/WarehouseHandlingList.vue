<template>
  <v-card>
    <v-card-title>لیست انبار گردانی ها</v-card-title>
    <v-card-text>
      <m-datatable :headers="headers" :apiUrl="url" :filters.sync="filters" ref="datatable">
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>
      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "WarehouseHandlingList",
  props: {
    type: {},
  },
  data() {
    return {
      filters: {},
      url: "reports/lists/warehouseHandlings",
    };
  },
  computed: {
    headers() {
      let headers = [
        {
          text: "شماره",
          value: "code",
        },
        {
          text: "تاریخ آغاز",
          value: "start_date",
        },
        {
          text: "تاریخ شمارش",
          value: "counting_date",
        },
        {
          text: "تاریخ ثبت انبارگردانی",
          value: "submit_date",
        },
        {
          text: "انبار گردان",
          value: "handler",
        },
        {
          text: "انبار",
          value: "warehouse.name",
        },
        {
          text: "قطعی",
          value: "is_defined",
          type: "boolean",
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
        name: "WarehouseHandlingForm",
        params: {
          id: item.id,
        },
      };
    },
  },
};
</script>

<style scoped lang="scss">
</style>