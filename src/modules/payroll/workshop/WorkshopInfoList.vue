<template>
  <v-card>
    <v-card-title>برای نمایش جامع روی کارگاه کلیک کنید</v-card-title>
    <v-card-text>
      <m-datatable :headers="headers" :apiUrl="url" :filters.sync="filters"
                   :show-export-btns="false"
                   @dblclick:row="(e, row) => $router.push('/panel/info/workshop?workshop=' + row.item.id)"
                   ref="datatable">

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
        {
          text: "پیشفرض",
          value: "is_default",
          type: 'boolean'
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