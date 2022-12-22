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
          filterable : false,
        },
        {
          text: "وضعیت تاهل",
          value: "marital_status_display",
          filterable : false,
        },
        {
          text: "خدمت سربازی",
          value: "military_service_display",
          filterable : false,
        },
        {
          text: "وضعیت تحصیل",
          value: "study_status_display",
          filterable : false,
        },
        {
          text: "وضعیت جسمی",
          value: "physical_condition_display",
          filterable : false,
        },
        {
          text: "فعال",
          value: "is_active",
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