<template>
  <balance :title="title" :cols="datatableCols" :url="url" :showAccountFilters="false"/>
</template>

<script>
import datatableCols from "./_datatableCols";
import Balance from "../Balance";

export default {
  name: "AccountsBalance",
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
      if (this.isCostCenter) return "تراز مراکز هزینه ";
      else return "تراز حساب های شناور ";
    },
    url() {
      return `reports/balance/floats?is_cost_center=${this.isCostCenter}`;
    },
    isCostCenter() {
      return ["true", true].includes(this.is_cost_center);
    }
  }
};
</script>