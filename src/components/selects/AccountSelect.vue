<template>
  <div>
    <v-autocomplete
      :items="items"
      v-model="item"
      :label="label"
      :item-text="itemText"
      :disabled="disabled"
      :multiple="multiple"
      height="40"
    ></v-autocomplete>
    <template v-if="itemsType == 'level3' && item">
      <account-select
        class="mt-3"
        v-if="item.floatAccountGroup"
        :child-of="item.floatAccountGroup.id"
        v-model="localFloatAccount"
        label="حساب شناور"
        items-type="floatAccounts"
        item-text="name"
      />
      <account-select
        class="mt-3"
        v-if="item.costCenterGroup"
        :child-of="item.costCenterGroup.id"
        v-model="localCostCenter"
        label="مرکز هزینه"
        items-type="floatAccounts"
        item-text="name"
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
      default: "حساب"
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

          if (this.itemsType == "person") {
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

          if (this.itemsType == "bank") {
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
    }
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
      this.$emit("update:floatAccount", null);
      this.$emit("update:costCenter", null);
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

<style lang="scss" >
</style>

// --- Document
// The itemsType item uses v-model, but floatAccount & costCenters must hanle like this:
// 
//   :floatAccount="item.floatAccount"
//   @update:floatAccount="v => item.floatAccount = v"
// 
//   :costCenter="item.costCenter"
//   @update:costCenter="v => item.costCenter = v"