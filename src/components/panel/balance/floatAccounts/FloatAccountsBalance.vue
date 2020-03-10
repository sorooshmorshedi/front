<template>
  <balance title="تراز حساب های شناور" :cols="datatableCols" url="reports/balance/floats"/>
</template>

<script>
import datatableCols from "./_datatableCols";
import Balance from "../Balance";

export default {
  name: "AccountsBalance",
  components: { Balance },
  data() {
    return {
      datatableCols
    };
  }
};
</script>