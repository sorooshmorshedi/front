<template>
  <nav v-if="account.id" class="account-parents">
    <ol class="breadcrumb">
      <li style="padding-left: 15px;">
        <b>حساب های پدر:</b>
      </li>
      <li class="breadcrumb-item" v-for="acc in accountParentsName(account)" :key="acc.id">{{ acc }}</li>
    </ol>
  </nav>
</template>

<script>
import accountMixin from "@/mixin/account";

export default {
  mixins: [accountMixin],
  props: ["account"]
};
</script>

<style lang="scss" scoped>
.account-parents {
  margin-top: 20px;
}
</style>

