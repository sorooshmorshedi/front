<template>
  <v-card>
    <v-card-title>لیست ماموریت ها</v-card-title>
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
  name: "SummaryMissionList",
  props: {},
  data() {
    return {
      url: "payroll/mission/all",
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
          text: " نوع",
          value: "mission_type_display",
        },
        {
          text: " مدت به روز",
          value: "time_period",
        },
        {
          text: " مکان",
          value: "location",
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
        name: "MissionDetail",
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