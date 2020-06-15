<template>
  <div class="account-select-container">
    <v-autocomplete
      :items="items"
      v-model="item"
      :label="label"
      :item-text="itemText"
      :disabled="disabled"
      :multiple="multiple"
      :placeholder="placeholder"
      :prepend-icon="showLedgerBtn?'fa-book-open':''"
      @click:prepend="item && openLedger(item)"
    ></v-autocomplete>
    <template v-if="hasDeepSelect && item && deepSelect">
      <account-select
        class="child"
        v-if="item.floatAccountGroup"
        :child-of="item.floatAccountGroup.id"
        v-model="localFloatAccount"
        :disabled="disabled"
        placeholder="حساب شناور"
        items-type="floatAccounts"
        item-text="name"
        :showLedgerBtn="false"
        :class="{'mr-10': showLedgerBtn}"
      />
      <account-select
        class="child"
        v-if="item.costCenterGroup"
        :child-of="item.costCenterGroup.id"
        v-model="localCostCenter"
        :disabled="disabled"
        placeholder="مرکز هزینه"
        items-type="floatAccounts"
        item-text="name"
        :showLedgerBtn="false"
        :class="{'mr-10': showLedgerBtn}"
      />
    </template>
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
export default {
  mixins: [accountApiMixin],
  props: {
    value: {},
    floatAccount: {},
    costCenter: {},
    label: {
      default: null
    },
    placeholder: {
      default: null
    },
    disabled: {
      default: false
    },
    itemText: {
      default: "title"
    },
    multiple: {
      default: false
    },
    itemsType: {
      default: "all",
      validator(value) {
        return [
          "all",
          "level0",
          "level1",
          "level2",
          "level3",
          "persons",
          "buyers",
          "sellers",
          "banks",

          "floatAccounts",
          "floatAccountGroups",

          "costCenters",
          "costCenterGroups"
        ].includes(value);
      }
    },
    childOf: {
      default: null
    },
    deepSelect: {
      default: true
    },
    showLedgerBtn: {
      default: true
    }
  },
  data() {
    return {
      item: null,
      localFloatAccount: undefined,
      localCostCenter: undefined
    };
  },
  computed: {
    items() {
      let items = [];

      if (this.itemsType == "floatAccounts") {
        items = this.floatAccounts.filter(o => o.is_cost_center == false);
      }

      if (this.itemsType == "floatAccountGroups") {
        items = this.floatAccountGroups.filter(o => o.is_cost_center == false);
      }

      if (this.itemsType == "costCenters") {
        items = this.floatAccounts.filter(o => o.is_cost_center == true);
      }

      if (this.itemsType == "costCenterGroups") {
        items = this.floatAccountGroups.filter(o => o.is_cost_center == true);
      }

      !items.length &&
        this.accounts.forEach(item => {
          if (this.itemsType == "all") {
            items.push(item);
          }

          if (this.itemsType.includes("level")) {
            let level = this.itemsType[this.itemsType.length - 1];
            if (item.level == level) {
              items.push(item);
            }
          }

          if (this.itemsType == "persons") {
            if (item.account_type == "p") {
              items.push(item);
            }
          }

          if (this.itemsType == "buyers") {
            if (item.person_type == "buyer") {
              items.push(item);
            }
          }

          if (this.itemsType == "sellers") {
            if (item.person_type == "seller") {
              items.push(item);
            }
          }

          if (this.itemsType == "banks") {
            if (item.account_type == "b") {
              items.push(item);
            }
          }
        });

      if (this.childOf) {
        items = items.filter(o => {
          if (["floatAccounts", "costCenters"]) {
            return (
              o.floatAccountGroups.filter(o => o.id == this.childOf).length == 1
            );
          } else {
            return o.parent == this.childOf;
          }
        });
      }

      return items;
    },
    hasDeepSelect() {
      return ["level3", "persons", "buyers", "sellers"].includes(
        this.itemsType
      );
    },
    containerStyles() {},
    childStyles() {}
  },
  created() {
    this.getAccounts();
    this.getFloatAccounts();

    this.setItem();
  },
  methods: {
    setItem() {
      if (this.value != this.item) this.item = this.value;

      if (this.floatAccount != this.localFloaAccount)
        this.localFloatAccount = this.floatAccount;
      if (this.costCenter != this.localCostCenter)
        this.localCostCenter = this.costCenter;
    }
  },
  watch: {
    value() {
      this.setItem();
    },
    item() {
      this.setItem();
    },
    floatAccount() {
      this.setItem();
    },
    costCenter() {
      this.setItem();
    },
    item() {
      this.$emit("input", this.item);
      if (this.item) {
        if (!this.item.floatAccountGroup)
          this.$emit("update:floatAccount", null);
        if (!this.item.costCenterGroup) this.$emit("update:costCenter", null);
      }
    },
    localFloatAccount() {
      this.$emit("update:floatAccount", this.localFloatAccount);
    },
    localCostCenter() {
      this.$emit("update:costCenter", this.localCostCenter);
    }
  }
};
</script>

<style lang="scss" scoped></style>

// --- Document
// The itemsType item uses v-model, but floatAccount & costCenters must hanle like this:
// 
//   :floatAccount="item.floatAccount"
//   @update:floatAccount="v => item.floatAccount = v"
// 
//   :costCenter="item.costCenter"
//   @update:costCenter="v => item.costCenter = v"