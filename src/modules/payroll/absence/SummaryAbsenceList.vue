<template>
  <v-card>
    <v-card-title>لیست مرخصی ها</v-card-title>
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
  name: "SummaryAbsenceList",
  props: {},
  data() {
    return {
      url: "payroll/absence/all",
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
          text: "نوع",
          value: "leave_type_display",
        },
        {
          text: " تاریخ",
          value: "date",
        },

        {
          text: " از تاریخ",
          value: "from_date",
        },
        {
          text: " تا تاریخ",
          value: "to_date",
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
        name: "AbsenceDetail",
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