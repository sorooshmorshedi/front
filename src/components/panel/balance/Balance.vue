<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <div class="title">تراز حساب ها</div>
          <div class="row">
            <div class="col-lg-3">
              <div class="card right">
                <div class="card-body">
                  <div class="row">
                    <div class="form-group col-12">
                      <label>تعداد ستون ها</label>
                      <select class="custom-select" v-model="colsCount">
                        <option selected value="2">2</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                    <div class="form-group col-12">
                      <label>سطح حساب</label>
                      <select class="custom-select" v-model="accountFilters.level">
                        <option selected value="all">همه</option>
                        <option value="0">گروه</option>
                        <option value="1">کل</option>
                        <option value="2">معین</option>
                        <option value="3">تفضیلی</option>
                      </select>
                    </div>

                    <div class="form-group col-12">
                      <label>حساب های خاص</label>
                      <select class="custom-select" v-model="accountFilters.special">
                        <option selected value="all">همه</option>
                        <option value="bank">بانک</option>
                        <option value="buyer">خریدار</option>
                        <option value="seller">فروشنده</option>
                      </select>
                    </div>

                    <div class="form-group col-6">
                      <label>از تاریخ</label>
                      <date class="form-control" v-model="sanadFilters.from_date"/>
                    </div>
                    <div class="form-group col-6">
                      <label>تا تاریخ</label>
                      <date class="form-control" v-model="sanadFilters.to_date"/>
                    </div>

                    <div class="form-group col-6">
                      <label>از شماره سند</label>
                      <input type="number" class="form-control" v-model="sanadFilters.from_code">
                    </div>
                    <div class="form-group col-6">
                      <label>تا شماره سند</label>
                      <input type="number" class="form-control" v-model="sanadFilters.to_code">
                    </div>

                    <div class="form-group col-12">
                      <label>وضعیت حساب ها</label>
                      <select class="custom-select" v-model="accountFilters.status">
                        <option selected value="all">همه</option>
                        <option value="withRemain">حساب های دارای مانده</option>
                        <option value="bedRemain">مانده بدهکار</option>
                        <option value="besRemain">مانده بستانکار</option>
                        <option value="withoutRemain">بدون مانده</option>
                        <option value="withTransaction">حساب های دارای گردش</option>
                      </select>
                    </div>

                    <div class="form-group col-12">
                      <div class="form-check">
                        <label class="form-check-label">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            v-model="accountFilters.showFloatAccounts"
                          >
                          نمایش حساب های تفضیلی شناور
                        </label>
                      </div>
                    </div>

                    <div class="form-group col-12">
                      <div class="form-check">
                        <label class="form-check-label">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            v-model="accountFilters.showDifferences"
                          >
                          نمایش مغایرت حساب ها
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-9">
              <datatable :cols="datatableCols.cols" :data="accounts" :hidden-cols="hiddenCols"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import date from "@/components/mcomponents/cleave/Date";
import datatable from "@/components/mcomponents/datatable/Client";
import datatableCols from "./_datatableCols";
import _ from "lodash";
export default {
  name: "Balance",
  components: { date, datatable },
  data() {
    return {
      sanadFilters: {},
      accountFilters: {},
      allAccounts: [],
      accounts: [],
      debouncedGetData: null,
      debouncedFilterAccounts: null,
      colsCount: 2,
      datatableCols
    };
  },
  created() {
    this.debouncedGetData = _.debounce(this.getData, 1000);
    this.debouncedFilterAccounts = _.debounce(this.filterAccounts, 200);
    this.clearFilters();
  },
  watch: {
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
        url: this.endpoint("reports/balance"),
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
      this.log("filtering accounts");
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
          console.log(nature);
          if (acc.bes_remain == 0 && acc.bed_remain == 0) return false;
          if (nature == "bed" && acc.bes_remain == 0) return false;
          if (nature == "bes" && acc.bed_remain == 0) return false;
        }

        return true;
      });

      let res = [];
      for (const acc of accounts) {
        res.push(acc);
        if (filters.showFloatAccounts)
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

      this.accounts = res;
    },
    clearFilters() {
      this.accountFilters = {
        level: "all",
        status: "all",
        special: "all",
        showFloatAccounts: false,
        showDifferences: false
      };
      this.sanadFilters = {};
    }
  },
  computed: {
    hiddenCols() {
      if (this.colsCount == 4) return [];
      return ["bed_sum", "bes_sum"];
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
