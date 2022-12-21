<template>
  <v-card>
    <v-card-title>لیست وام یا مساعده ها</v-card-title>
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
  name: "SummaryLoanList",
  props: {},
  data() {
    return {
      url: "payroll/loan/all",
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
          value: "pay_date",
          type: 'date'
        },
        {
          text: "مبلغ کل",
          value: "amount",
          type: 'numeric'

        },
        {
          text: "مبلغ هر قسط",
          value: "monthly_pay",
          type: 'numeric',
          filterable: false,
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
        name: "LoanDetail",
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