<template>
  <v-row
    no-gutters
    :class="{'flex-row': horizontal, 'flex-column': !horizontal}"
    :title="item && item.title"
  >
    <v-col :cols="horizontal && hasDeepSelect?6:12">
      <div class="d-flex">
        <open-ledger-btn
          v-if="showLedgerBtn && hasLedger"
          :query="{account: item.id, level: `level${item.level}`}"
          class="mr-2"
        />
        <v-icon v-if="hasLedger" @click="openBalanceDialog" color="cyan" class="pl-2 mr-3">fa-wallet</v-icon>
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
          v-bind="$attrs"
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
          :class="{'': showLedgerBtn && !horizontal, 'mr-1': horizontal, 'mt-1': !horizontal}"
          v-bind="$attrs"
        />
        <account-select
          v-if="item.floatAccounts && !item.is_cost_center"
          :child-of="item.id"
          v-model="localFloatAccount"
          :disabled="disabled"
          placeholder="حساب شناور"
          items-type="floatAccounts"
          item-text="name"
          item-value="id"
          :showLedgerBtn="false"
          :class="{'mr-7': showLedgerBtn && !horizontal, 'mr-1': horizontal, 'mt-1': !horizontal}"
          v-bind="$attrs"
        />
      </v-col>
      <v-col v-if="item.costCenterGroup || (item.floatAccounts && item.is_cost_center)">
        <account-select
          v-if="item.costCenterGroup"
          :child-of="item.costCenterGroup.id"
          v-model="localCostCenter"
          :disabled="disabled"
          placeholder=" * مرکز هزینه و درآمد"
          items-type="costCenters"
          item-text="name"
          item-value="id"
          :showLedgerBtn="false"
          :class="{'mr-7': showLedgerBtn && !horizontal, 'mr-1': horizontal, 'mt-1': !horizontal}"
          v-bind="$attrs"
        />
        <account-select
          v-if="item.floatAccounts && item.is_cost_center"
          :child-of="item.id"
          v-model="localCostCenter"
          :disabled="disabled"
          placeholder="* حساب شناور"
          items-type="floatAccounts"
          item-text="name"
          item-value="id"
          :showLedgerBtn="false"
          :class="{'mr-7': showLedgerBtn && !horizontal, 'mr-1': horizontal, 'mt-1': !horizontal}"
          v-bind="$attrs"
        />
      </v-col>
    </template>

    <v-dialog v-model="balanceDialog" max-width="500px" v-if="item && item.balance">
      <v-card>
        <v-card-title>مانده حساب {{ item.name }}</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-simple-table class="text-center">
                <thead>
                  <tr>
                    <th class="text-center">بدهکار</th>
                    <th class="text-center">بستانکار</th>
                    <th class="text-center">مانده</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ item.balance.bed | toMoney}}</td>
                    <td>{{ item.balance.bes | toMoney}}</td>
                    <td>{{ item.balance.remain | toMoney}}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import OpenLedgerBtn from "@/components/btns/OpenLedgerBtn.vue";
export default {
  mixins: [accountApiMixin],
  components: { OpenLedgerBtn },
  props: {
    value: {},
    floatAccount: {},
    costCenter: {},
    label: {
      default: null,
    },
    placeholder: {
      default: null,
    },
    disabled: {
      default: false,
    },
    accountDisabled: {
      // only disables account (not float and cost center)
      default: false,
    },
    itemText: {
      default: null,
    },
    multiple: {
      default: false,
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

          "imprests",
        ].includes(value);
      },
    },
    childOf: {
      default: null,
    },
    deepSelect: {
      default: true,
    },
    showLedgerBtn: {
      default: true,
    },
    showBalanceBtn: {
      default: true,
    },
    horizontal: {
      default: false,
    },
  },
  data() {
    return {
      item: null,
      localFloatAccount: undefined,
      localCostCenter: undefined,
      balanceDialog: false,
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
        items = this.floatAccounts;
      }

      if (this.itemsType == "floatAccountGroups") {
        items = this.floatAccountGroups;
      }

      if (this.itemsType == "costCenters") {
        items = this.costCenters;
      }

      if (this.itemsType == "costCenterGroups") {
        items = this.costCenterGroups;
      }

      !items.length &&
        this.accounts.forEach((item) => {
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
            if (item.buyer_or_seller == "b") {
              items.push(item);
            }
          }

          if (this.itemsType == "sellers") {
            if (item.buyer_or_seller == "s") {
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
                (o) => o.usage == "imprest" && o.account.id == item.parent
              ).length != 0;
            if (isImprest) {
              items.push(item);
            }
          }
        });

      if (this.childOf) {
        items = items.filter((o) => {
          if (["floatAccounts", "costCenters"]) {
            return (
              o.floatAccountGroups.filter((o) => o.id == this.childOf).length ==
              1
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
          "costCenterGroups",
        ].includes(this.itemsType)
      );
    },
    hasLedger() {
      return ["level3", "persons", "buyers", "sellers", "imprests"].includes(
        this.itemsType
      );
    },
  },
  created() {
    this.getDefaultAccounts();
    this.getAccounts(false, () => this.setItem());
    this.getFloatAccounts(false, () => this.setItem());
    this.getFloatAccountGroups(false, () => this.setItem());

    this.setItem();
  },
  methods: {
    openBalanceDialog() {
      this.request({
        url: this.endpoint(`accounts/accounts/${this.item.id}`),
        method: "get",
        success: (data) => {
          this.item = data;
          this.balanceDialog = true;
        },
      });
    },
    setItem() {
      if (this.value != this.item) {
        if (isNaN(this.value)) {
          this.item = this.value;
        } else {
          this.item = this.items.find((o) => o.id == this.value);
          this.$emit("input", this.item);
          this.emitChange();
        }
      }

      if (!this.item) {
        this.localFloatAccount = null;
        this.localCostCenter = null;
      } else {
        if (this.floatAccount != this.localFloaAccount) {
          if (isNan(this.floatAccount)) {
            this.localFloatAccount = this.floatAccount;
          } else {
            this.item = this.floatAccounts.find(
              (o) => o.id == this.floatAccount
            );
            this.emitChange();
          }
        }
        if (this.costCenter != this.localCostCenter) {
          if (isNan(this.costCenter)) {
            this.localCostCenter = this.costCenter;
          } else {
            this.item = this.floatAccounts.find((o) => o.id == this.costCenter);
            this.emitChange();
          }
        }
      }
    },
    emitChange() {
      this.$emit("change", {
        account: this.item,
        floatAccount: this.localFloatAccount,
        costCenter: this.localCostCenter,
      });
    },
  },
  watch: {
    value() {
      this.setItem();
      this.localFloatAccount = null;
      this.localCostCenter = null;
    },
    floatAccount() {
      this.setItem();
    },
    costCenter() {
      this.setItem();
    },
    item() {
      this.$emit("input", this.item || null);
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
    },
  },
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