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
  name: "WorkshopList",
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
          type: "numeric",

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
          text: "آدرس کارگاه",
          value: "address",
        },
        {
          text: "کد پستی",
          value: "postal_code",
          type: "numeric",
          filterable: false,
        },
        {
          text: "کد شعبه",
          value: "branch_code",
          type: "numeric",
          filterable: false,
        },

        {
          text: "نام شعبه",
          value: "branch_name",
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