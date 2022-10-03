<template>
  <v-card>
    <v-card-title>لیست حقوق و دستمزد</v-card-title>
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
  name: "PaymentList",
  props: {},
  data() {
    return {
      url: "payroll/listOfPay/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: " کارگاه",
          value: "workshop_display",
        },
        {
          text: " سال",
          value: "year",
        },
        {
          text: " ماه",
          value: "month_name",
        },
        {
          text: " از",
          value: "start_date",
        },
        {
          text: " تا",
          value: "end_date",
        },
      ];
    },
  },
  methods: {
    to(item) {
      return {
        name: "ListOfPayDetail",
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