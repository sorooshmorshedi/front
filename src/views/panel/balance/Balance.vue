<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="12" md="4">
              <v-select label="تعداد ستون ها" v-model="colsCount" :items="[2, 4]"></v-select>
            </v-col>

            <template v-if="showAccountFilters">
              <v-col cols="12" md="4">
                <v-select
                  label="سطح حساب"
                  v-model="accountFilters.level"
                  item-text="text"
                  item-value="value"
                  :items="accountLevels"
                  :return-object="false"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  label="حساب های خاص"
                  v-model="accountFilters.special"
                  :items="specialAccounts"
                  item-text="text"
                  item-value="value"
                  :return-object="false"
                />
              </v-col>
            </template>
            <v-col v-else cols="0" md="4"></v-col>

            <v-col cols="12" md="6">
              <date placeholder="از تاریخ" v-model="sanadFilters.from_date" />
            </v-col>
            <v-col cols="12" md="6">
              <date placeholder="تا تاریخ" v-model="sanadFilters.to_date" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="از شماره سند" type="number" v-model="sanadFilters.from_code" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="تا شماره سند" type="number" v-model="sanadFilters.to_code" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6">
          <v-col cols="12">
            <v-switch label="نمایش مغایرت حساب ها" v-model="accountFilters.showDifferences" />
          </v-col>
          <template v-if="showAccountFilters">
            <v-col cols="12">
              <v-switch
                label="نمایش حساب های تفضیلی شناور"
                v-model="accountFilters.showFloatAccounts"
              />
            </v-col>

            <v-col cols="12">
              <v-switch label="نمایش مرکز هزینه" v-model="accountFilters.showCostCenters" />
            </v-col>
          </template>
        </v-col>

        <v-col cols="12">
          <datatable :cols="datatableCols" :data="accounts" :hidden-cols="hiddenCols" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import date from "@/components/mcomponents/cleave/Date";
import datatable from "@/components/mcomponents/datatable/Client";
import datatableBaseCols from "./_datatableBaseCols";
import _ from "lodash";
export default {
  name: "Balance",
  components: { date, datatable },
  props: {
    title: {
      required: true
    },
    cols: {
      required: true
    },
    url: {
      required: true
    },
    showAccountFilters: {
      default: true
    }
  },
  data() {
    return {
      sanadFilters: {},
      accountFilters: {},

      allAccounts: [],
      accounts: [],
      debouncedGetData: null,
      debouncedFilterAccounts: null,

      colsCount: 2,

      accountLevels: [
        { value: "all", text: "همه" },
        { value: 0, text: "گروه" },
        { value: 1, text: "کل" },
        { value: 2, text: "معین" },
        { value: 3, text: "تفضیلی" }
      ],
      specialAccounts: [
        { value: "all", text: "همه" },
        { value: "bank", text: "بانک" },
        { value: "buyer", text: "خریدار" },
        { value: "seller", text: "فروشنده" }
      ],
      accountStatuses: [
        { value: "all", text: "همه" },
        { value: "withRemain", text: "حساب های دارای مانده" },
        { value: "bedRemain", text: "مانده بدهکار" },
        { value: "besRemain", text: "مانده بستانکار" },
        { value: "withoutRemain", text: "بدون مانده" },
        { value: "withTransaction", text: "حساب های دارای گردش" }
      ]
    };
  },
  computed: {
    hiddenCols() {
      if (this.colsCount == 4) return [];
      return ["bed_sum", "bes_sum"];
    },
    datatableCols() {
      let cols = [...this.cols.cols, ...datatableBaseCols.cols];
      return cols;
    }
  },
  created() {
    this.debouncedGetData = _.debounce(this.getData, 1000);
    this.debouncedFilterAccounts = _.debounce(this.filterAccounts, 200);
    this.clearFilters();
  },
  watch: {
    url() {
      this.getData();
    },
    sanadFilters: {
      handler() {
        if (this.debouncedGetData) this.debouncedGetData();
        else this.getData();
      },
      deep: true
    },
    accountFilters: {
      handler() {
        if (this.debouncedFilterAccounts) this.debouncedFilterAccounts();
        else this.filterAccounts();
      },
      deep: true
    }
  },
  methods: {
    getData() {
      let filters = {};
      Object.keys(this.sanadFilters).forEach(k => {
        if (["undefined", ""].includes(this.sanadFilters[k])) return;
        if (k.includes("date") || k.includes("due")) {
          let gDate = this.toGDate(this.sanadFilters[k]);
          if (gDate == "Invalid date") {
            this.notify("فرمت تاریخ وارد شده معتبر نمی باشد", "danger");
            return;
          }
          filters[k] = gDate;
        } else {
          filters[k] = this.sanadFilters[k];
        }
      });
      this.request({
        url: this.endpoint(this.url),
        method: "get",
        params: {
          ...filters
        },
        success: data => {
          this.allAccounts = data;
          this.filterAccounts();
        }
      });
    },
    filterAccounts() {
      let filters = this.accountFilters;
      let accounts = this.allAccounts.filter(acc => {
        if (filters.level != "all") {
          if (acc.level != filters.level) return false;
        }

        if (filters.status != "all") {
          switch (filters.status) {
            case "withRemain":
              if (acc.bes_remain == 0 && acc.bes_remain == 0) return false;
              break;
            case "bedRemain":
              if (acc.bed_remain == 0) return false;
              break;
            case "besRemain":
              if (acc.bes_remain == 0) return false;
              break;
            case "withoutRemain":
              if (acc.bed_sum != 0 || acc.bes_sum != 0) return false;
              break;
            case "withTransaction":
              if (acc.bed_sum == 0 && acc.bes_sum == 0) return false;
              break;
          }
        }

        if (filters.from_code) {
          // todo: check for chilren too
          if (acc.code < filters.from_code) return false;
        }

        if (filters.special != "all") {
          switch (filters.special) {
            case "seller":
              if (!acc._person || acc._person.type != "seller") return false;
              break;
            case "buyer":
              if (!acc._person || acc._person.type != "buyer") return false;
              break;
            case "bank":
              if (!acc._bank) return false;
              break;
          }
        }

        if (filters.showDifferences) {
          if (!acc._type) return false;
          let nature = acc._type.nature;
          if (acc.bes_remain == 0 && acc.bed_remain == 0) return false;
          if (nature == "bed" && acc.bes_remain == 0) return false;
          if (nature == "bes" && acc.bed_remain == 0) return false;
        }

        return true;
      });

      let res = [];
      for (const acc of accounts) {
        res.push(acc);
        if (filters.showFloatAccounts) {
          for (const floatAccount of acc._floatAccounts) {
            res.push({
              code: "حساب شناور",
              name: floatAccount.name,
              bes_sum: floatAccount.bes_sum,
              bed_sum: floatAccount.bed_sum,
              bes_remain: floatAccount.bes_remain,
              bed_remain: floatAccount.bed_remain,
              classes: "float-account-row"
            });
          }
        }
        if (filters.showCostCenters) {
          for (const floatAccount of acc._costCenters) {
            res.push({
              code: "مرکز هزینه",
              name: floatAccount.name,
              bes_sum: floatAccount.bes_sum,
              bed_sum: floatAccount.bed_sum,
              bes_remain: floatAccount.bes_remain,
              bed_remain: floatAccount.bed_remain,
              classes: "float-account-row"
            });
          }
        }
      }

      this.accounts = res;
    },
    clearFilters() {
      this.accountFilters = {
        level: "all",
        status: "all",
        special: "all",
        showFloatAccounts: false,
        showCostCenters: false,
        showDifferences: false
      };
      this.sanadFilters = {};
    }
  }
};
</script>

<style scoped lang="scss">
.fixed-head {
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.fixed-head thead tr {
  th {
    box-shadow: 0px 4px 8px -2px rgba(0, 0, 0, 0.2);
    position: sticky;
    top: 0;
    background-color: #eee;
  }
}

.fa-sort {
  color: rgba(0, 0, 0, 0.3);
}
</style>

<style lang="scss">
.float-account-row {
  background-color: #fafafa !important;
  td:nth-child(3) {
    // padding-right: 30px;
  }
}
</style>
