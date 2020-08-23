<template>
  <v-row>
    <v-col cols="12" class="ledger">
      <v-card>
        <v-card-title>دفتر کل، معین، تفضیلی</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="ledger.level"
                label="سطح حساب"
                :items="accountLevels"
                item-text="text"
                item-value="value"
                :return-object="false"
              />
            </v-col>
            <v-col cols="12" md="8">
              <account-select
                label="حساب"
                v-if="ledger.level != undefined"
                :items-type="ledger.level"
                v-model="ledger.account"
                :floatAccount="ledger.floatAccount"
                @update:floatAccount="v => ledger.floatAccount = v"
                :costCenter="ledger.costCenter"
                @update:costCenter="v => ledger.costCenter = v"
                :showLedgerBtn="false"
              />
            </v-col>
            <template v-if="ledger.account">
              <v-col cols="12" md="2">
                <date label="از تاریخ" v-model="filters.sanad__date__gte" clearable />
              </v-col>
              <v-col cols="12" md="2">
                <date label="تا تاریخ" v-model="filters.sanad__date__lte" clearable />
              </v-col>
              <v-col cols="12" md="2">
                <money label="از شماره" v-model="filters.sanad__code__gte" clearable />
              </v-col>
              <v-col cols="12" md="2">
                <money label="تا شماره" v-model="filters.sanad__code__lte" clearable />
              </v-col>
              <v-col cols="12" md="4">
                <v-radio-group v-model="filters.order_sanads_by" row>
                  <template #label>مرتب سازی بر اساس:</template>
                  <v-radio label="تاریخ سند" value="date" />
                  <v-radio label="شماره سند" value="code" />
                </v-radio-group>
              </v-col>
              <v-col cols="12">
                <sanad-item-list-report
                  :filters.sync="filters"
                  :showAccountInTable="showAccountInTable"
                  :sortable="false"
                  :filterable="false"
                  :showRemain="true"
                  :showPreviousRemain="true"
                />
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import MDatatable from "@/components/mcomponents/datatable/MDatatable";
import accountApiMixin from "@/mixin/accountMixin";
import _ from "lodash";
import SanadItemListReport from "@/components/mcomponents/report/SanadItemListReport";
export default {
  name: "Ledger",
  components: { MDatatable, SanadItemListReport },
  mixins: [accountApiMixin],
  props: {
    ledgerAccountIds: {
      default: () => []
    }
  },
  data() {
    return {
      apiData: {
        results: []
      },
      ledger: {
        level: null,
        account: null,
        floatAccount: null,
        costCenter: null
      },
      filters: {},
      accountLevels: [
        { value: "level0", text: "گروه" },
        { value: "level1", text: "کل" },
        { value: "level2", text: "معین" },
        { value: "level3", text: "تفضیلی" },
        { value: "floatAccountGroups", text: "گروه شناور" },
        { value: "costCenterGroups", text: "مرکز هزینه" }
      ]
    };
  },
  computed: {
    showAccountInTable() {
      return this.ledger.level != 3;
    }
  },
  created() {
    this.filters = this.getFiltersTemplate();
    this.init();
  },
  methods: {
    getFiltersTemplate() {
      return {
        account__code__startswith: "",
        order_sanads_by: "code",
        floatAccount: null,
        costCenter: null,
        floatAccount__floatAccountGroups: null,
        costCenter__floatAccountGroups: null
      };
    },
    init() {
      if (typeof this.ledgerAccountIds == "string") {
        let acc = this.findAccount("id", +this.ledgerAccountIds);
      } else {
        for (const id of this.ledgerAccountIds) {
          let acc = this.findAccount("id", id);
          if (!acc) {
            console.error("There is no code ");
            return;
          }
        }
      }
    }
  },
  watch: {
    "ledger.level"() {
      this.filters = this.getFiltersTemplate();
      this.ledger.account = this.ledger.floatAccount = this.ledger.costCenter = null;
    },
    "ledger.account"() {
      if (this.ledger.level.includes("level")) {
        this.filters.account__code__startswith = this.ledger.account
          ? this.ledger.account.code
          : null;
      } else {
        this.filters.account__code__startswith = null;
        if (this.ledger.level == "floatAccountGroups") {
          this.filters["floatAccount__floatAccountGroups"] = this.ledger.account
            ? this.ledger.account.id
            : null;
        } else {
          this.filters["costCenter__floatAccountGroups"] = this.ledger.account
            ? this.ledger.account.id
            : null;
        }
      }
    },
    "ledger.floatAccount"() {
      this.filters["floatAccount"] = this.ledger.floatAccount
        ? this.ledger.floatAccount.id
        : null;
    },
    "ledger.costCenter"() {
      this.filters["costCenter"] = this.ledger.costCenter
        ? this.ledger.costCenter.id
        : null;
    }
  }
};
</script>

<style scoped lang="scss">
</style>
