<template>
  <balance :title="title" :cols="cols" :url="url" :showAccountFilters="false" />
</template>

<script>
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
    return {};
  },
  computed: {
    title() {
      if (this.isCostCenter) return "تراز مراکز هزینه ";
      else return "تراز حساب های شناور ";
    },
    cols() {
      let text = "تفضیلی شناور";
      if (this.isCostCenter) text = "مرکز هزینه و درآمد";
      return {
        cols: [
          {
            text: text,
            value: "float_account_name",
            type: "text"
          }
        ]
      };
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