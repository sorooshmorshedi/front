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
          value: "workshop_code",
          sortable: false,
        },
        {
          text: "نام کارگاه",
          value: "name",
          sortable: false,

        },
        {
          text: "نام کارفرما",
          value: "employer_name",
          sortable: false,

        },
        {
          text: "آدرس کارگاه",
          value: "address",
          sortable: false,

        },
        {
          text: "کد پستی",
          value: "postal_code",
          sortable: false,

        },
        {
          text: "کد شعبه",
          value: "branch_code",
          sortable: false,

        },

        {
          text: "نام شعبه",
          value: "branch_name",
          sortable: false,

        },
        {
          text: "فعال",
          value: "is_active",
          type: 'boolean',
          sortable: false,

        },
        {
          text: "پیشفرض",
          value: "is_default",
          type: 'boolean',
          sortable: false,

        },

        {
          text: "نهایی",
          value: "is_verified",
          type: 'boolean',
          sortable: false,

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