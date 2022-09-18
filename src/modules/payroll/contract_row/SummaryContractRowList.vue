<template>
  <v-card>
    <v-card-title>لیست پیمان ها</v-card-title>
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
  name: "SummaryContractRowList",
  props: {},
  data() {
    return {
      url: "payroll/conractrow/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: " کارگاه",
          value: "workshop_name",
        },
        {
          text: "ردیف پیمان",
          value: "contract_row",
          type: "numeric",
        },
        {
          text: "شماره قرارداد",
          value: "contract_number",
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
          text: "وضعیت",
          value: "status_display",
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