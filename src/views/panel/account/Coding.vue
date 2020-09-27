<template>
  <v-card>
    <v-card-title>گزارش کدینگ حساب ها</v-card-title>

    <v-card-text>
      <m-datatable :headers="headers" :items="items" :searchable="false" :filters.sync="filters"></m-datatable>
    </v-card-text>
  </v-card>
</template>
<script>
import AccountApiMixin from "@/mixin/accountMixin";

import MDatatable from "@/components/mcomponents/datatable/MDatatable";

export default {
  mixins: [AccountApiMixin],
  components: { MDatatable },
  data() {
    return {
      filters: {},
      headers: [
        {
          text: "کد حساب",
          value: "code",
        },
        {
          text: "نام حساب",
          value: "name",
        },
        {
          text: "نوع",
          value: "type.name",
        },
      ],
    };
  },
  computed: {
    permissionBasename() {
      return `account`;
    },
    items() {
      return this.getSortedAccounts(this.accounts);
    },
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.getAccounts(true);
    },
  },
};
</script>