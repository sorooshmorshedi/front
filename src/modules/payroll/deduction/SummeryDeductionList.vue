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
      filters: {is_template: false},
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
          text: "تاریخ شروع",
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