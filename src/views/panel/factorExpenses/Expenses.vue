<template>
  <m-form
    :title="title"
    :items="items"
    :cols="cols"
    :canSubmit="canSubmit"
    :canDelete="canDelete"
    :is-editing.sync="isEditing"
    :showListBtn="false"
    :show-navigation-btns="false"
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
            label=" * حساب"
            itemsType="level3"
            v-model="item.account"
            :disabled="!isEditing"
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
  </m-form>
</template>
<script>
import { MFormMixin } from "@/components/m-form";
import GetFactorExpensesApi from "@/views/panel/factorExpenses/getFactorExpensesApi";

export default {
  mixins: [MFormMixin, GetFactorExpensesApi],
  props: {
    factorType: {
      requried: true,
    },
  },
  data() {
    return {
      item: {},
      baseUrl: "factors/expenses",
      permissionBasename: "factorExpenses",
      appendSlash: true,
      cols: [
        {
          text: "نام",
          value: "name",
          type: "text",
          filters: ["name"],
        },
        {
          text: "حساب",
          value: "account.title",
          type: "text",
          filters: ["account__title__icontains"],
        },
      ],
    };
  },
  computed: {
    title() {
      let title = "هزینه های پیشفرض فاکتور ";
      if (this.factorType == "sale") return title + "فروش";
      else return title + "خرید";
    },
    items() {
      return this.factorExpenses.filter((o) => o.type == this.factorType);
    },
  },
  methods: {
    getItemTemplate() {
      return {
        level: this.level,
        type: this.factorType,
      };
    },
    getData() {
      this.getFactorExpenses(true);
    },
    setItem(item) {
      this.item = item;
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      item.type = this.factorType;
      return item;
    },
  },
};
</script>