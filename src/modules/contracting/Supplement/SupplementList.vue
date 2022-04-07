<template>
  <v-card>
    <v-card-title>لیست الحاقیه ها</v-card-title>
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
  name: "SupplementList",
  props: {},
  data() {
    return {
      url: "reports/supplement/all",
      filters: {},
    };
  },
  computed: {

    computed: {
      headers() {
        return [
          {
            text: "شماره",
            value: "code",
            type: "numeric",
          },

          {
            text: "قرارداد",
            value: "contract",
          },
          {
            text: "تاریخ جدید قرارداد",
            value: "new_contract_date",
            type: "date",
          },
          {
            text: "شرح",
            value: "explanation",
          },
          {
            text: "مبلغ",
            value: "value",
          },
          {
            text: "تاریخ",
            value: "date",
            type: "date",
          },

        ];
      },

    },
    mounted() {
    },
    methods: {},
  },
}
</script>

<style scoped lang="scss">
</style>