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
    splitCode(code) {
      let res = [];
      let levelCodeLens = [1, 3, 5, 9];
      levelCodeLens.forEach(len => {
        let codePart = code.substr(0, len);
        if (!res.includes(codePart)) res.push(codePart);
      });
      return res;
    },
    accountParentsName(account) {
      if (!account) return [];
      let res = [];
      let codes = this.splitCode(account.code);
      for (const code of codes) {
        let acc = this.findAccount("code", code);
        if (!acc) {
          console.log("no account for", code);
          continue;
        }
        res.push(acc.name);
        if (codes.indexOf(code) == code.length - 3) break;
      }
      return res;
    }
  }
};
</script>

<style lang="scss" scoped>
.account-parents {
  margin-top: 20px;
}
</style>

