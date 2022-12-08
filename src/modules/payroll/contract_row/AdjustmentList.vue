<template>
  <v-card>
    <v-card-title>لیست تعدیل ها</v-card-title>
    <v-card-text>
      <m-datatable  :headers="headers" :export-url="exportUrl" :apiUrl="url" :filters.sync="ex_filter"
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
  name: "AdjustmentList",
  props: {
    ex_filter:{}
  },
  data() {
    return {
      url: "payroll/adjustment/all",
      exportUrl: "payroll/adjustment/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "ردیف پیمان",
          value: "contract_row",
        },

        {
          text: " ردیف پیمان",
          value: "contract_row_display",
          filterable: false,
        },
        {
          text: "ردیف پیمان",
          value: "contract_row",
        },
        {
          text: "تاریخ ثبت",
          value: "date",
        },
        {
          text: "تاریخ تعدیل",
          value: "change_date",
        },
        {
          text: "مبلغ تعدیل",
          value: "amount",
        },
        {
          text: "نوع",
          value: "status_dis",
          filterable: false,
        },
        {
          text: "توضیحات",
          value: "explanation",
        },
      ];

    },
  },
  methods: {
    to(item) {
      return {
        name: "AdjustmentDetail",
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