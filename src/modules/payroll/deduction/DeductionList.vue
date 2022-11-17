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
  name: "DeductionList",
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
          text: "قالب است؟",
          value: "is_template",
        },
        {
          text: "نام",
          value: "name",
        },
        {
          text: "نام قالب",
          value: "template_name",
        },
        {
          text: "مبلغ",
          value: "amount",
        },
        {
          text: "تعداد اقساط",
          value: "episode",
        },

        {
          text: "مبلغ هر قسط",
          value: "monthly_pay",
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