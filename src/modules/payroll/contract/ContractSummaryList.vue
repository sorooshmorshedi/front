<template>
  <v-card>
    <v-card-title>لیست قرارداد ها</v-card-title>
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
  name: "WorkshopContractSummaryList",
  props: {},
  data() {
    return {
      url: "payroll/contract/all",
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
          text: "شماره قرارداد",
          value: "code",
        },
        {
          text: "تاریخ شروع قرارداد",
          value: "contract_from_date",
        },
        {
          text: "تاریخ پایان قرارداد",
          value: "contract_to_date",
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
        name: "WorkshopContractDetail",
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