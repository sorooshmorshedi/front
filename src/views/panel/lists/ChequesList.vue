<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <m-datatable :headers="headers" :apiUrl="url" :filters.sync="filters" ref="datatable">
        <template #item.remain="{ item }">{{ getRemain(item) | toMoney}}</template>
        <template #item.settle="{ item }">
          <v-btn color="light-blue white--text" :to="toSettle(item)" text>تسویه</v-btn>
        </template>
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>
      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
import QueryBinding from "@/components/m-query-binding";
export default {
  name: "ChequesList",
  mixins: [QueryBinding],
  props: {
    type: {},
  },
  data() {
    return {
      filters: {},
      url: "reports/lists/cheques",
    };
  },
  computed: {
    title() {
      switch (this.type) {
        case "received":
          return "چک های دریافتنی";
        case "paid":
          return "چک های پرداختنی";
      }
    },
    headers() {
      let headers = [
        {
          text: "شماره",
          value: "serial",
        },
        {
          text: "شرح",
          value: "explanation",
        },
        {
          text: "تاریخ",
          value: "date",
        },
        {
          text: "تاریخ سررسید",
          value: "due",
        },
        {
          text: "مبلغ",
          value: "value",
        },
        {
          text: "نام حساب",
          value: "account.name",
        },
        {
          text: "وضعیت",
          value: "status",
          items: [
            {
              text: "سفید",
              value: "blank",
            },
            {
              text: "پاس نشده",
              value: "notPassed",
            },
            {
              text: "در جریان",
              value: "inFlow",
            },
            {
              text: "پاس شده",
              value: "passed",
            },
            {
              text: "برگشتی",
              value: "bounced",
            },
            {
              text: "نقدی",
              value: "cashed",
            },
            {
              text: "باطل شده",
              value: "revoked",
            },
            {
              text: "انتقالی",
              value: "transferred",
            },
          ],
        },
        {
          text: "نام بانک",
          value: "bankName",
          type: "text",
          filters: ["bankName__icontains"],
        },
      ];

      headers.push({
        text: "جزئیات",
        value: "detail",
        sortable: false,
        filterable: false,
      });

      return headers;
    },
  },
  created() {
    this.filters.received_or_paid = this.type == "paid" ? "p" : "r";
  },
  watch: {
    $route() {
      this.filters.received_or_paid = this.type;
      this.$refs.datatable.getDataFromApi();
    },
  },
  methods: {
    getRemain(item) {
      let remain = item.sanad.bed;
      if (item.imprestSettlement) {
        remain -= item.imprestSettlement.settled_value;
      }
      return remain;
    },
    to(item) {
      return {
        name: "ChequeDetail",
        params: {
          type: this.type,
          id: item.id,
        },
      };
    },
  },
};
</script>

<style scoped lang="scss">
</style>