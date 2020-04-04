<template>
  <balance :title="title" :cols="datatableCols" :url="url" :showAccountFilters="false"/>
</template>

<script>
import datatableCols from "./_datatableCols";
import Balance from "../Balance";

export default {
  name: "FloatAccountsBalanceByGroup",
  components: { Balance },
  props: {
    is_cost_center: {
      default: false
    }
  },
  data() {
    return {
      datatableCols
    };
  },
  computed: {
    title() {
      if (this.isCostCenter) return "تراز مراکز هزینه بر اساس گروه";
      else return "تراز حساب های شناور بر اساس گروه";
    },
    url() {
      return `reports/balance/floatsByGroup?is_cost_center=${
        this.isCostCenter
      }`;
    },
    isCostCenter() {
      return ["true", true].includes(this.is_cost_center);
    }
  }
};
</script>