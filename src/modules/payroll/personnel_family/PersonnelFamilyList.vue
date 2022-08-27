<template>
  <v-card>
    <v-card-title>لیست خانواده پرسنل </v-card-title>
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
  name: "PersonnelFamilyList",
  props: {},
  data() {
    return {
      url: "payroll/personnel/family/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "پرسنل",
          value: "personnel_name",
        },
        {
          text: "نام",
          value: "name",
        },
        {
          text: "نام خانوادگی",
          value: "last_name",
        },
        {
          text: "کد ملی",
          value: "national_code",
        },
        {
          text: "تاریخ  تولد",
          value: "date_of_birth",
        },
        {
          text: "نسبت",
          value: "relative_display",
        },
        {
          text: "وضعیت تاهل",
          value: "marital_status_display",
        },
        {
          text: "خدمت سربازی",
          value: "military_service_display",
        },
        {
          text: "خدمت سربازی",
          value: "military_service_display",
        },
        {
          text: "وضعیت تحصیل",
          value: "study_status_display",
        },
        {
          text: "وضعیت جسمی",
          value: "physical_condition_display",
        },

      ];

    },
  },
  methods: {
    to(item) {
      return {
        name: "PersonnelFamilyDetail",
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