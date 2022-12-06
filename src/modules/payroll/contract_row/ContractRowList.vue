<template>
  <v-card>
    <v-card-title>لیست پیمان ها</v-card-title>
    <v-card-text>
      <m-datatable :headers="headers" :export-url="exportUrl" :apiUrl="url" :filters.sync="filters" @dblclick:row="(e, row) => $router.push(to(row.item))"
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
  name: "ContractRowList",
  props: {},
  data() {
    return {
      url: "payroll/contractRows/all",
      exportUrl: "payroll/contractRows/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: " کارگاه",
          value: "workshop",
        },
        {
          text: "ردیف پیمان",
          value: "contract_row",
        },
        {
          text: "شماره قرارداد",
          value: "contract_number",
        },
        {
          text: "تاریخ قرارداد",
          value: "registration_date",
        },
        {
          text: "تاریخ شروع قرارداد",
          value: "from_date",
        },
        {
          text: "تاریخ پایان قرارداد",
          value: "to_date",
        },
        {
          text: "شناسه ملی واگذار کننده",
          value: "assignor_national_code",
        },
        {
          text: "نام واگذار کننده",
          value: "assignor_name",
        },

        {
          text: "کد کارگاه واگذار کننده",
          value: "assignor_workshop_code",
        },
        {
          text: "شعبه",
          value: "branch",
        },
        {
          text: "مبلغ اولیه قرارداد",
          value: "contract_initial_amount",
          type: "numeric",
        },
        {
          text: "فعال",
          value: "status",
          type: "boolean"
        },
        {
          text: "نهایی",
          value: "is_verified",
          type: "boolean"
        },
      ];

    },
  },
  methods: {
    to(item) {
      return {
        name: "ContractRowDetail",
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