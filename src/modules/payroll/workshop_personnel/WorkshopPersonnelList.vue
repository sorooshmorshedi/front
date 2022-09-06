<template>
  <v-card>
    <v-card-title>لیست پرسنل در کارگاه </v-card-title>
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
  name: "WorkshopPersonnelList",
  props: {},
  data() {
    return {
      url: "payroll/workshop/personnel/all",
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
          text: " پرسنل",
          value: "personnel_name",
        },
        {
          text: "عنوان شغلی",
          value: "work_title",
        },
        {
          text: " محل خدمت",
          value: "job_location",
        },
        {
          text: "وضعیت محل خدمت",
          value: "job_location_status_display",
        },
        {
          text: "سابقه بیمه قبلی خارج این کارگاه",
          value: "previous_insurance_history_out_workshop",
        },
        {
          text: "سابقه بیمه قبلی در کارگاه",
          value: "previous_insurance_history_in_workshop",
        },

        {
          text: "سابقه بیمه جاری در کارگاه",
          value: "current_insurance_history_in_workshop",
        },
        {
          text: "مجموع سوابق بیمه ای",
          value: "insurance_history_totality",
        },
        {
          text: "سمت",
          value: "job_position",
        },
        {
          text: "رسته شغلی",
          value: "job_group_display",
        },
        {
          text: "نوع استخدام",
          value: "employment_type_display",
        },
        {
          text: "نوع قرارداد",
          value: "contract_type_display",
        },
        {
          text: "وضعیت کارمند",
          value: "employee_status_display",
        },
        {
          text: "تاریخ اضافه شدن به لیست بیمه",
          value: "insurance_add_date",
        },

      ];

    },
  },
  methods: {
    to(item) {
      return {
        name: "WorkshopPersonnelDetail",
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