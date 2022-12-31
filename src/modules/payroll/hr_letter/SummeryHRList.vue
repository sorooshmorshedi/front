<template>
  <v-card class="pa-4">
    <v-card-title class="primary darken-3 white--text"> لیست کارگزینی  قرارداد {{contract_code}}</v-card-title>
    <m-datatable :show-applied-filters="false" :headers="headers" :apiUrl="url" :filters.sync="filter"
                 @dblclick:row="(e, row) => $router.push(to(row.item))"
                 ref="datatable">
      <template #item.detail="{ item }">
        <detail-link :to="to(item)"/>
</template>

</m-datatable>
  </v-card>

</template>

<script>
export default {
  name: "SummaryHRLetterList",
  props: {
    contract: null,
    contract_code: null,
    filter: null
  },
  data() {
    return {
      url: "payroll/hrletter/all",
      filters: {'is_template': 'p'}
      ,
    };
  },
  computed: {
    headers() {
      return [
        {
          text: " نام",
          value: "name",
        },
        {
          text: "مزد مبنای ماهانه",
          value: "monthly_pay_base",
          type: "numeric",
          filterable: false,
        },
        {
          text: "قابل ویرایش",
          value: "is_calculated",
          type: 'boolean',

        },
        {
          text: "فعال",
          value: "is_active",
          type: 'boolean'
        },
        {
          text: "نهایی",
          value: "is_verified",
          type: 'boolean'
        },

      ];

    },
  },
  methods: {
    to(item) {
      return {
        name: "HRLetterDetail",
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