<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <m-datatable
        :headers="headers"
        :apiUrl="url"
        :filters.sync="filters"
        @dblclick:row="(e, row) => $router.push(to(row.item))"
        ref="datatable"
      >
        <template #item.remain="{ item }">{{
          getRemain(item) | toMoney
        }}</template>
        <template #item.settle="{ item }">
          <v-btn color="light-blue white--text" :to="toSettle(item)" text
            >تسویه</v-btn
          >
        </template>
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>
      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "TransactionsList",
  props: {
    type: {},
    contract_received: {},
    contract_guarantee: {}
  },
  data() {
    return {
      filters: {},
      url: "reports/lists/transactions",
    };
  },
  computed: {
    title() {
      switch (this.type) {
        case "receive":
          return "لیست دریافت ها";
        case "payment":
          return "لیست پرداخت ها";
        case "receivedGuarantee":
          return "لیست اسناد ضمانتی دریافتی";
        case "paymentGuarantee":
          return "لیست اسناد ضمانتی پرداختی";
        case "imprest":
          return "پرداخت های تنخواه";
      }
    },
    headers() {
      let headers = [
        {
          text: "شماره",
          value: "code",
        },
        {
          text: "نام حساب",
          value: "account.name",
        },
        {
          text: "تاریخ",
          value: "date",
        },
        {
          text: "شرح",
          value: "explanation",
        },
        {
          text: "مبلغ مجموع",
          value: "sanad.bed",
          type: "numeric",
        },
      ];
      let imprestHeaders = [
        {
          text: "تاریخ تسویه",
          value: "imprestSettlement.date",
        },
        {
          text: "مبلغ تسویه شده",
          value: "imprestSettlement.settled_value",
          type: "numeric",
        },
        {
          text: "مانده",
          value: "remain",
          type: "numeric",
          sortable: false,
          filterable: false,
        },
        {
          text: "تسویه",
          value: "settle",
          sortable: false,
          filterable: false,
        },
      ];

      if (this.type == "imprest") headers = headers.concat(imprestHeaders);

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
    this.filters.type = this.type;
    this.filters.contract_received = this.contract_received
    this.filters.contract_guarantee = this.contract_guarantee
  },
  watch: {
    $route() {
      this.$refs.datatable.getDataFromApi();
    },
  },
  methods: {
    getRemain(item) {
      let remain = 0;
      if (item.sanad) {
        remain = item.sanad.bed;
        if (item.imprestSettlement) {
          remain -= item.imprestSettlement.settled_value;
        }
      }
      return remain;
    },
    to(item) {
      return {
        name: "TransactionForm",
        params: {
          type: this.type,
          id: item.id,
        },
      };
    },

    toSettle(item) {
      return {
        name: "ImprestSettlement",
        params: {
          id: item.id,
        },
      };
    },
  },
};
</script>

<style scoped lang="scss"></style>
