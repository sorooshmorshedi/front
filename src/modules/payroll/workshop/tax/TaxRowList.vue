<template>
  <v-card>
    <v-card-title> معافیت مالیات و حقوق سالانه</v-card-title>
    <v-card-text>
      <m-datatable :headers="headers" :apiUrl="url" :export-url="url" :filters.sync="filters" @dblclick:row="(e, row) => $router.push(to(row.item))"
                   ref="datatable" :show-export-btns="false">
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
      url: "payroll/tax/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: " اسم",
          value: "name",
        },
        {
          text: "ار تاربخ",
          value: "from_date",
        },
        {
          text: "تا تاربخ",
          value: "to_date",
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