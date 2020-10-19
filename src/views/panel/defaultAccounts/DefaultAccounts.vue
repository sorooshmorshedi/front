<template>
  <m-form
    :title="title"
    :items="items"
    :cols="cols"
    :canClear="canClear"
    :canSubmit="canSubmit"
    :canDelete="canDelete"
    :is-editing.sync="isEditing"
    :showListBtn="false"
    :show-navigation-btns="false"
    :showActions="showActions"
    @click:row="setItem"
    @clearForm="clearForm"
    @submit="submit"
    @delete="deleteItem"
  >
    <template #default>
      <v-row>
        <v-col cols="12">
          <v-text-field label=" * نام" v-model="item.name" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12">
          <account-select
            :disabled="!isEditing"
            label=" * حساب"
            :itemsType="accountLevel"
            v-model="item.account"
            :floatAccount="item.floatAccount"
            @update:floatAccount="v => item.floatAccount = v"
            :costCenter="item.costCenter"
            @update:costCenter="v => item.costCenter = v"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
        </v-col>
      </v-row>
    </template>

    <template #item.detail="{ item }">
      <v-btn
        v-if="usage == 'imprest'"
        color="blue white--text"
        :to="{name: 'Accounts', params:{level: 3}, query:{parent: item.account.id}}"
      >تعریف حساب تفصیلی</v-btn>
    </template>
  </m-form>
</template>
<script>
import AccountApiMixin from "@/mixin/accountMixin";
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";

export default {
  mixins: [MFormMixin, AccountApiMixin],
  props: {
    usage: {
      requried: true,
    },
  },
  data() {
    return {
      item: {},
      baseUrl: "accounts/defaultAccounts",
      permissionBasename: "defaultAccount",
      cols: [
        {
          text: "نام",
          value: "name",
          type: "text",
        },
        {
          text: "حساب",
          value: "account.title",
          type: "text",
        },
        {
          text: "",
          value: "detail",
          filterable: false,
          sortable: false,
        },
      ],
    };
  },
  computed: {
    title() {
      let title = "حساب های پیشفرض ";
      if (this.usage == "receive") return title + "دریافت";
      if (this.usage == "payment") return title + "پرداخت";
      if (this.usage == "factor") return title + "فاکتور";
      if (this.usage == "closeAccounts") return title + "بستن";
      if (this.usage == "imprest") return title + "تنخواه";
      if (this.usage == "other") return title  = "دیگر حساب های پیشفرض";
    },
    accountLevel() {
      if (this.usage == "imprest") return "level2";
      return `level${this.item.account_level || 3}`;
    },
    items() {
      return this.defaultAccounts.filter((o) =>
        o.usage.toLowerCase().includes(this.usage.toLowerCase())
      );
    },
    canClear() {
      return ["factor", "closingAccounts", "imprest"].includes(this.usage);
    },
    showActions() {
      if (["imprest", "receive", "payment"].includes(this.usage)) return true;
      return this.item.id != undefined;
    },
  },
  methods: {
    getItemTemplate() {
      return {
        usage: this.usage,
      };
    },
    getData() {
      this.getDefaultAccounts(true);
      this.getAccounts();
    },
    setItem(item) {
      this.item = item;
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      if (!item.account_level) {
        let level = 3;
        if (this.usage == "imprest") level = 2;
        item.account_level = level;
      }
      return item;
    },
  },
};
</script>