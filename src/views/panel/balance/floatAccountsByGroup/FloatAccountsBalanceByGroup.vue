<template>
  <balance
    :title="title"
    :cols="cols"
    :url="url"
    :showAccountFilters="false"
    :getAccountLedgerQuery="getAccountLedgerQuery"
  />
</template>

<script>
import Balance from "../Balance";

export default {
  name: "FloatAccountsBalanceByGroup",
  components: { Balance },
  props: {
    is_cost_center: {
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    title() {
      if (this.isCostCenter) return "تراز مراکز هزینه بر اساس گروه";
      else return "تراز حساب های شناور بر اساس گروه";
    },

    cols() {
      let text = "تفضیلی شناور";
      if (this.isCostCenter) text = "مرکز هزینه و درآمد";
      return {
        cols: [
          {
            text: "گروه " + text,
            value: "group_name",
            type: "text",
          },
          {
            text: text,
            value: "float_account_name",
            type: "text",
          },
        ],
      };
    },
    url() {
      return `reports/balance/floatsByGroup?is_cost_center=${this.isCostCenter}&`;
    },
    isCostCenter() {
      return ["true", true].includes(this.is_cost_center);
    },
  },
  methods: {
    getAccountLedgerQuery(item) {
      let query = {};
      if (item.group_name) {
        query["ledger.account"] = item.group_id;
        if (this.isCostCenter) {
          query["ledger.level"] = "costCenterGroups";
        } else {
          query["ledger.level"] = "floatAccountGroups";
        }
      } else {
        query["ledger.account"] = item.float_account_id;
        if (this.isCostCenter) {
          query["ledger.level"] = "costCenters";
        } else {
          query["ledger.level"] = "floatAccounts";
        }
      }
      return query;
    },
  },
};
</script>