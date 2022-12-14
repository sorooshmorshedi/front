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
  name: "LoanList",
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
          filterable: false,
        },
        {
          text: "تاریخ",
          value: "pay_date",
        },
        {
          text: "نوع",
          value: "loan_type_display",
        },
        {
          text: "مبلغ",
          value: "amount",
        },
        {
          text: "تعداد اقساط",
          value: "episode",
          type: 'numeric'
        },

        {
          text: "مبلغ هر قسط",
          value: "monthly_pay",
          filterable: false,
          type: 'numeric'
        },
        {
          text: "تاریخ سررسید",
          value: "last_dept_date",
          filterable: false,
        },
        {
          text: "اقساط پرداخت شده",
          value: "episode_payed",
          filterable: false,

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