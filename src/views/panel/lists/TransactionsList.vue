<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <m-datatable :headers="headers" :apiUrl="url" :filters.sync="filters" ref="datatable">
        <template #item.detail="{ item }">
          <v-btn color="light-blue white--text" :to="to(item)" target="_blank" icon>
            <v-icon>fa-external-link-alt</v-icon>
          </v-btn>
        </template>
      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
import formOptions from "./formOptions";
export default {
  name: "TransactionsList",
  props: {
    type: {},
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
          return "دریافت ها";
        case "payment":
          return "پرداخت ها";
        case "imprest":
          return "پرداخت های تنخواه";
      }
    },
    headers() {
      return [
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
          text: "توضیحات",
          value: "explanation",
        },
        {
          text: "مبلغ مجموع",
          value: "sanad.bed",
          type: "money",
        },
        {
          text: "تاریخ تسویه",
          value: "imprestSttlement",
          type: "money",
        },
        {
          text: "جزئیات",
          value: "detail",
          sortable: false,
          filterable: false,
        },
      ];
    },
  },
  created() {
    this.filters.type = this.type;
  },
  methods: {
    to(item) {
      return {
        name: "TransactionForm",
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