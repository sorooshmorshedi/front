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
        <template v-if="hasParent">
          <v-col cols="12">
            <v-text-field label="نام" v-model="item.name" />
          </v-col>
          <v-col cols="12">
            <account-select
              label="حساب"
              itemsType="level3"
              v-model="item.account"
              :floatAccount="item.floatAccount"
              @update:floatAccount="v => item.floatAccount = v"
              :costCenter="item.costCenter"
              @update:costCenter="v => item.costCenter = v"
            />
          </v-col>
        </template>
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
import FactorApiMixin from "@/mixin/factorApi";

export default {
  mixins: [ListModalFormMixin, FactorApiMixin],
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
        type: this.factorType,
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
    parentTitle() {
      return this.getWareLevelTitle(+this.level - 1);
    },
    hasParent() {
      return this.level != 0;
    },
    items() {
      return this.factorExpenses.filter(o => o.type == this.factorType);
    }
  },
  methods: {
    getData() {
      this.getFactorExpenses(true);
    },
    getWareLevelTitle(level) {
      switch (Number(level)) {
        case 0:
          return "ماهیت";
        case 1:
          return "گروه";
        case 2:
          return "دسته بندی";
      }
    },
    getWareLevels(force = false) {
      if (!force && this.wareLevels.length) return;
      return this.request({
        url: this.endpoint("wares/wareLevels"),
        method: "get",
        success: data => {
          this.$store.commit("setWares", {
            wareLevels: data
          });
        }
      });
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