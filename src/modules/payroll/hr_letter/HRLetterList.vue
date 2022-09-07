<template>
  <v-card>
    <v-card-title>لیست حکم های کارگزینی</v-card-title>
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
  name: "HRLetterList",
  props: {},
  data() {
    return {
      url: "payroll/hrletter/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: " قالب ",
          value: "is_template_display",
          filterable: false,

        },
        {
          text: " قرارداد",
          value: "contract",
        },
        {
          text: "نام",
          value: "name",
        },
        {
          text: "مزد مبنای روزانه",
          value: "daily_pay_base",
          type: "numeric",
          filterable: false,


        },
        {
          text: "مزد مبنای ماهانه",
          value: "monthly_pay_base",
          type: "numeric",
          filterable: false,


        },
        {
          text: "مزد ساعتی بر مبنای روزانه",
          value: "day_hourly_pay_base",
          type: "numeric",
          filterable: false,


        },
        {
          text: " مزد ساعتی بر  مبنای ماهانه",
          value: "month_hourly_pay_base",
          type: "numeric",
          filterable: false,


        },
        {
          text: "غیر قابل تغییر",
          value: "pay_done",
          filterable: false,

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