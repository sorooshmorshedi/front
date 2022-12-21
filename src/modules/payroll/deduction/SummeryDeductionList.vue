<template>
  <v-card>
    <v-card-title>لیست کسورات اختیاری</v-card-title>
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
  name: "SummeryDeductionList",
  props: {},
  data() {
    return {
      url: "payroll/deduction/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: " پرسنل در کارگاه",
          value: "workshop_personnel_display",
        },
        {
          text: "تاریخ",
          value: "start_date",
        },
        {
          text: "تاریخ اتمام",
          value: "last_dept_date",
          filterable: false,
        },
        {
          text: "مبلغ هر ماه",
          value: "monthly_pay",
          filterable: false,
          type: 'numeric'
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
        name: "DeductionDetail",
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