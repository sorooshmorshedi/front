<template>
  <balance
    title="تراز حساب ها"
    :cols="datatableCols"
    url="reports/balance"
    :getAccountLedgerQuery="getAccountLedgerQuery"
    :getSubAccountLedgerQuery="getSubAccountLedgerQuery"
  />
</template>

<script>
import datatableCols from "./_datatableCols";
import Balance from "../Balance";

export default {
  name: "AccountsBalance",
  components: { Balance },
  data() {
    return {
      datatableCols,
    };
  },
  methods: {
    getAccountLedgerQuery(item) {
      return {
        "ledger.account": item.id,
        "ledger.level": `level${item.level}`,
      };
    },
    getSubAccountLedgerQuery(item, subAccount) {
      return {
        "ledger.account": item.id,
        "ledger.floatAccount":
          subAccount.level == "floatAccounts" ? subAccount.id : null,
        "ledger.costCenter":
          subAccount.level == "costCenters" ? subAccount.id : null,
        "ledger.level": `level${item.level}`,
      };
    },
  },
};
</script>