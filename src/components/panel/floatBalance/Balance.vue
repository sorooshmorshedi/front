<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <div class="title">تراز حساب های شناور</div>
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
        url: this.endpoint("reports/balance/floats"),
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

        return true;
      });

    },
    clearFilters() {
      this.accountFilters = {
        status: "all",
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
