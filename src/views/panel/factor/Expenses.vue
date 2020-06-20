<template>
  <list-modal-form
    :title="title"
    :items="items"
    :cols="cols"
    :deletable="item.id"
    @rowClick="setItem"
    @clearForm="clearForm"
    @submit="submit"
    @delete="deleteItem"
    ref="listModelForm"
  >
    <template #default>
      <v-row>
        <v-col cols="12">
          <v-text-field label=" * نام" v-model="item.name" />
        </v-col>
        <v-col cols="12">
          <account-select
            label=" * حساب"
            itemsType="level3"
            v-model="item.account"
            :floatAccount="item.floatAccount"
            @update:floatAccount="v => item.floatAccount = v"
            :costCenter="item.costCenter"
            @update:costCenter="v => item.costCenter = v"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" />
        </v-col>
      </v-row>
    </template>
  </list-modal-form>
</template>
<script>
import { fromCodeFilter, toCodeFilter } from "@/mixin/accountMixin.js";
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";
import GetFactorExpenseApi from "./getFactorExpensesApi";

export default {
  mixins: [ListModalFormMixin, GetFactorExpenseApi],
  props: {
    factorType: {
      requried: true
    }
  },
  data() {
    return {
      item: {},
      itemTemplate: {
        level: this.level,
        type: this.factorType
      },
      baseUrl: "factors/expenses",
      leadingSlash: true,
      cols: [
        {
          th: "نام",
          td: "name",
          type: "text",
          filters: ["name"]
        },
        {
          th: "حساب",
          td: "account.title",
          type: "text",
          filters: ["account__title__icontains"]
        }
      ]
    };
  },
  computed: {
    title() {
      let title = "هزینه های پیشفرض فاکتور ";
      if (this.factorType == "sale") return title + "خرید";
      else return title + "فروش";
    },
    items() {
      return this.factorExpenses.filter(o => o.type == this.factorType);
    }
  },
  methods: {
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
    }
  }
};
</script>