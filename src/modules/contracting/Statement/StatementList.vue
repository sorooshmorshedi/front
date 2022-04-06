<template>
  <v-card>
    <v-card-title>لیست صورت وضییت ها</v-card-title>
    <v-card-text>
      <m-datatable :headers="headers" :apiUrl="url" :filters.sync="filters" ref="datatable">
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>
      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "StatementList",
  props: {},
  data() {
    return {
      url: "reports/statement/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [

        {
          text: "سریال",
          value: "code",
          type: "numeric"
        },
        {
          text: "تاریخ",
          value: "date",
          type: "date",
        },
        {
          text: "قرارداد",
          value: "contract",
        },
        {
          text: "توضیحات",
          value: "explanation",
        },
        {
          text: "مبلغ",
          value: "value",
          type: "numeric",
        },
        {
          text: "دسته بندی",
          value: "type.",
        },

      ];
    },
  },  mounted() {
  },
  methods: {
  },
};
</script>

<style scoped lang="scss">
</style>