<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <m-datatable
        :headers="headers"
        :apiUrl="url"
        :filters.sync="filters"
        ref="datatable"
        @dblclick:row="(e, row) => $router.push(to(row.item))"
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
import QueryBinding from "@/components/m-query-binding";
import ChequeMixin from "@/views/panel/cheque/mixin";
export default {
  name: "ChequesList",
  mixins: [QueryBinding, ChequeMixin],
  props: {
    type: {
      require: true,
    },
    isPaid: {
      require: true,
    },
  },
  data() {
    return {
      filters: {
        type: this.type,
        is_paid: this.isPaid,
      },
      url: "reports/lists/cheques",
    };
  },
  computed: {
    title() {
      switch (this.isPaid) {
        case false:
          return "چک های دریافتنی";
        case true:
          return "چک های پرداختنی";
      }
    },
    headers() {
      let headers = [
        {
          text: "شماره چک",
          value: "serial",
        },
        {
          text: "شماره سری",
          value: "chequebook.serial",
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
          items: this.chequeStatuses,
        },
        {
          text: "نام بانک",
          value: "bankName",
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
    this.getChequeMeta();
    this.filters.is_paid = this.isPaid;
    this.filters.type = this.type;
  },
  watch: {
    $route() {
      this.filters.is_paid = this.isPaid;
      this.filters.type = this.type;
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

<style scoped lang="scss"></style>
