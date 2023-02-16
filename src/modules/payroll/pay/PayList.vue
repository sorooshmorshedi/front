<template>
  <v-card>
    <v-card-title> لیست پرداخت حقوق</v-card-title>
    <v-card-text>
      <m-datatable :headers="headers" :apiUrl="url" :export-url="url" :filters.sync="filters" @dblclick:row="(e, row) => $router.push('/panel/pay/' + row.item.id)"
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
  name: "PayList",
  props: {},
  data() {
    return {
      url: "payroll/pay/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "کارگاه",
          value: "workshop_name",
        },
        {
          text: "نام لیست",
          value: "name",
        },
        {
          text: "سال",
          value: "year",
        },
        {
          text: "ماه",
          value: "month_name",
        },
        {
          text: "تاریخ ایجاد",
          value: "pay_form_create_date",
        },
        {
          text: "تاریخ پرداخت بانک",
          value: "bank_pay_date",
        },
        {
          text: "جمع پرداختی",
          value: "get_total_paid",
          type: 'numeric',
          filterable: false
        },
        {
          text: "جمع باقیمانده",
          value: "get_un_paid",
          type: 'numeric',
          filterable: false
        },
        {
          text: "پرداخت نهایی",
          value: "is_pay_verify",
          type: 'boolean',
        },

      ];
    },
  },

  methods: {
    to(item) {
      return {
        name: "PaymentItemList",
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