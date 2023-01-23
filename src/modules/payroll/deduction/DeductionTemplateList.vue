<template>
  <v-card>
    <v-card-title>لیست قالب کسورات اختیاری</v-card-title>
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
  name: "TemplateDeductionList",
  props: {},
  data() {
    return {
      url: "payroll/deduction/all",
      filters: {is_template: true},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "نام قالب",
          value: "template_name",
        },
        {
          text: "تاریخ",
          value: "start_date",
        },
        {
          text: "مبلغ",
          value: "amount",
          type: 'numeric'
        },
        {
          text: "تعداد ماه",
          value: "episode",
        },
        {
          text: "تاریخ اتمام",
          value: "last_dept_date",
          filterable: false,
        },
        {
          text: "مبلغ هر ماه",
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
        name: "DeductionTemplateDetail",
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