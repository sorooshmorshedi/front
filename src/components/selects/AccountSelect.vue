<template>
  <v-row no-gutters :class="{'flex-row': horizontal, 'flex-column': !horizontal}">
    <v-col :cols="horizontal && hasDeepSelect?6:12">
      <div class="d-flex">
        <v-icon
          @click="item && openLedger(item)"
          color="cyan"
          class="pl-2 mr-3"
          v-if="showLedgerBtn && hasLedger"
        >fa-book-open</v-icon>
        <v-autocomplete
          :items="items"
          v-model="item"
          :label="label"
          :item-text="mainSelectItemText"
          :disabled="disabled || accountDisabled"
          :multiple="multiple"
          :placeholder="placeholder"
          item-value="id"
          :return-object="true"
        ></v-autocomplete>
      </div>
    </v-col>
    <template v-if="hasDeepSelect">
      <v-col>
        <account-select
          v-if="item.floatAccountGroup"
          :child-of="item.floatAccountGroup.id"
          v-model="localFloatAccount"
          :disabled="disabled"
          placeholder=" * حساب شناور"
          items-type="floatAccounts"
          item-text="name"
          item-value="id"
          :showLedgerBtn="false"
          :class="{'mr-7': showLedgerBtn && !horizontal, 'mr-1': horizontal, 'mt-1': !horizontal}"
        />
      </v-col>
      <v-col>
        <account-select
          v-if="item.costCenterGroup"
          :child-of="item.costCenterGroup.id"
          v-model="localCostCenter"
          :disabled="disabled"
          placeholder=" * مرکز هزینه"
          items-type="floatAccounts"
          item-text="name"
          item-value="id"
          :showLedgerBtn="false"
          :class="{'mr-7': showLedgerBtn && !horizontal, 'mr-1': horizontal, 'mt-1': !horizontal}"
        />
        <account-select
          v-if="item.floatAccounts"
          :child-of="item.id"
          v-model="localFloatAccount"
          :disabled="disabled"
          placeholder=" * حساب شناور"
          items-type="floatAccounts"
          item-text="name"
          item-value="id"
          :showLedgerBtn="false"
          :class="{'mr-7': showLedgerBtn && !horizontal, 'mr-1': horizontal, 'mt-1': !horizontal}"
        />
      </v-col>
    </template>
  </v-row>
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
    accountDisabled: {
      // only disables account (not float and cost center)
      default: false
    },
    itemText: {
      default: null
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
          "costCenterGroups",

          "imprests"
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
    },
    horizontal: {
      default: false
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
    mainSelectItemText() {
      if (this.itemText) return this.itemText;
      if (this.itemsType.includes("level")) return "title";
      return "name";
    },
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

          if (this.itemsType == "imprests") {
            let isImprest =
              this.defaultAccounts.filter(
                o => o.usage == "imprest" && o.account.id == item.parent
              ).length != 0;
            if (isImprest) {
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
      return (
        this.item &&
        (this.item.floatAccountGroup ||
          this.item.costCenterGroup ||
          this.item.floatAccounts) &&
        this.deepSelect &&
        [
          "level3",
          "persons",
          "buyers",
          "sellers",
          "imprests",
          "floatAccountGroups",
          "costCenters"
        ].includes(this.itemsType)
      );
    },
    hasLedger() {
      return ["level3", "persons", "buyers", "sellers", "imprests"].includes(
        this.itemsType
      );
    }
  },
  created() {
    this.getDefaultAccounts();
    this.getAccounts();
    this.getFloatAccounts();
    this.getFloatAccountGroups();

    this.setItem();
  },
  methods: {
    setItem() {
      if (this.value != this.item) this.item = this.value;

      if (this.floatAccount != this.localFloaAccount)
        this.localFloatAccount = this.floatAccount;
      if (this.costCenter != this.localCostCenter)
        this.localCostCenter = this.costCenter;
    },
    emitChange() {
      this.$emit("change", {
        account: this.item,
        floatAccount: this.localFloatAccount,
        costCenter: this.localCostCenter
      });
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
        if (!this.item.floatAccountGroup) {
          this.$emit("update:floatAccount", null);
        }
        if (!this.item.costCenterGroup) {
          this.$emit("update:costCenter", null);
        }
      }
      this.emitChange();
    },
    localFloatAccount() {
      this.$emit("update:floatAccount", this.localFloatAccount);
      this.emitChange();
    },
    localCostCenter() {
      this.$emit("update:costCenter", this.localCostCenter);
      this.emitChange();
    }
  }
};
</script>

<style lang="scss" scoped>
.account-select-container {
  &.horizontal {
    display: flex;
    min-width: 200px;
  }
}
</style>

// --- Document
// The itemsType item uses v-model, but floatAccount & costCenters must hanle like this:
// 
//   :floatAccount="item.floatAccount"
//   @update:floatAccount="v => item.floatAccount = v"
// 
//   :costCenter="item.costCenter"
//   @update:costCenter="v => item.costCenter = v"