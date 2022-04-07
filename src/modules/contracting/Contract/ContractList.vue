<template>
  <v-card>
    <v-card-title>لیست قرارداد ها</v-card-title>
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
  name: "ContractList",
  props: {},
  data() {
    return {
      url: "reports/contract/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "عنوان",
          value: "title",
        },
        {
          text: "مناقصه",
          value: "tender",
        },

        {
          text: "شماره",
          value: "code",
          type: "numeric",

        },
        {
          text: "مبلغ",
          value: "amount",
          type: "numeric",

        },
        {
          text: "حداکثر میزان تغییر",
          value: "max_change_amount",
          type: "numeric",

        },
        {
          text: "پیمانکار",
          value: "contractor",
        },
        {
          text: "از تاریخ",
          value: "from_date",
          type: "date",
        },

        {
          text: "تا تاریخ",
          value: "to_date",
          type: "date",
        },

        {
          text: "تاریخ ثبت قرارداد",
          value: "registration",
          type: "date",
        },

        {
          text: "تاریخ شروع قرارداد",
          value: "inception",
          type: "date",
        },

        {
          text: "حسن انجام کار",
          value: "doing_job_well",
          type: "numeric",
        },
        {
          text: "علی الحساب بیمه",
          value: "insurance_payment",
          type: "numeric",
        },
        {
          text: "سایر",
          value: "other",
          type: "numeric",
        },
      ];
    },

  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style scoped lang="scss">
</style>