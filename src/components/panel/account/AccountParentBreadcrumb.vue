<template>
  <nav v-if="baseAccount.id" class="account-parents">
    <ol class="breadcrumb">
      <li style="padding-left: 15px;">
        <b>حساب های پدر:</b>
      </li>
      <li
        class="breadcrumb-item"
        v-for="acc in accountParentsName(baseAccount)"
        :key="acc.id"
      >{{ acc }}</li>
    </ol>
  </nav>
</template>

<script>
import accountMixin from "@/mixin/accountMixin";

export default {
  mixins: [accountMixin],
  props: ["baseAccount"],
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.account-parents {
  margin-top: 20px;
}
</style>

