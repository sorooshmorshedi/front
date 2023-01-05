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
  name: "SummaryWorkshopPersonnelList",
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
          value: "title_name",
        },
        {
          text: "رسته شغلی",
          value: "job_group_display",
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