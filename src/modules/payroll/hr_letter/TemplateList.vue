<template>
  <v-card>
    <v-card-title>لیست قالب های حکم کارگزینی</v-card-title>
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
  name: "TemplateList",
  props: {},
  data() {
    return {
      url: "payroll/hrletter/all",
      filters: {'is_template': 't'},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "نام",
          value: "name",
        },
        {
          text: "حداقل مزد روزانه",
          value: "hoghooghe_roozane_amount",
          type: "numeric",
        },
        {
          text: "پایه سنوات روزانه",
          value: "paye_sanavat_amount",
          type: "numeric",
        },
        {
          text: "حق مسکن",
          value: "haghe_maskan_amount",
          type: "numeric",
        },
        {
          text: "بن خوار و بار",
          value: "bon_kharo_bar_amount",
          type: "numeric",
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
        name: "HRTemplateDetail",
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