<template>
  <v-card>
    <v-card-title>لیست کارگاه ها</v-card-title>
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
  name: "SummaryWorkshopList",
  props: {},
  data() {
    return {
      url: "payroll/workshop/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "کد کارگاه",
          value: "code",
        },
        {
          text: "نام کارگاه",
          value: "name",
        },
        {
          text: "نام کارفرما",
          value: "employer_name",
        },
        {
          text: "فعال",
          value: "is_active",
          type: 'boolean'
        },

      ];

    },
  },
  methods: {
    to(item) {
      return {
        name: "WorkshopDetail",
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