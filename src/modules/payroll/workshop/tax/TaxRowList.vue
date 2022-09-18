<template>
  <v-card>
    <v-card-title>جدول نرخ مالیات</v-card-title>
    <v-card-text>
      <m-datatable :headers="headers" :apiUrl="url" :filters.sync="filters" @dblclick:row="(e, row) => $router.push(to(row.item))"
                   ref="datatable">
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>

      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "TaxRowList",
  props: {},
  data() {
    return {
      url: "payroll/tax/row/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: " کارگاه",
          value: "workshop",
        },
        {
          text: "ار مبلغ",
          value: "from_amount",
        },
        {
          text: "تا مبلغ",
          value: "to_amount",
        },
        {
          text: "درصد",
          value: "ratio",
        },
      ];
    },
  },

  methods: {
    to(item) {
      return {
        name: "TaxRowDetail",
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