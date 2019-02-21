<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right ">
        <div class="card-body">
          <div class="title">
            ترازنامه
          </div>
          <div class="row">
            <div class="col-lg-12">
              <div class="card right ">
                <div class="card-body">
                  <div class="row">
                    <div class="form-group col-lg-2">
                      <label>از تاریخ</label>
                      <date class="form-control" v-model="filters.from_date" placeholder="xxxx-xx-xx" />
                    </div>
                    <div class="form-group col-lg-2">
                      <label>تا تاریخ</label>
                      <date class="form-control" v-model="filters.to_date" placeholder="xxxx-xx-xx" />
                    </div>
                    <div class="form-group col-lg-2">
                      <button @click="getData()" class="btn btn-info btn-label-margin w-100px">گزارش</button>
                    </div>
                    <div class="w-100"></div>
                    <div class="col-lg-6">
                      <div class="table-responsive table-bordered table-striped">
                        <table class="table">
                          <thead>
                            <tr>
                              <th colspan="2">دارایی ها</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th colspan="2">دارایی های جاری</th>
                            </tr>
                            <tr>
                              <td>{{ d.cacheAndBank.name }}</td>
                              <td>{{ d.cacheAndBank.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.shortTimeInvestments.name }}</td>
                              <td>{{ d.shortTimeInvestments.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.commercialAccountsAndReceivables.name }}</td>
                              <td>{{ d.commercialAccountsAndReceivables.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.otherAccountsAndReceivables.name }}</td>
                              <td>{{ d.otherAccountsAndReceivables.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.inventories.name }}</td>
                              <td>{{ d.inventories.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.ordersAndPrepayments.name }}</td>
                              <td>{{ d.ordersAndPrepayments.remain }}</td>
                            </tr>
                            <tr class="text-bold">
                              <td>{{ d.totalCurrentAssets.name }}</td>
                              <td>{{ d.totalCurrentAssets.remain }}</td>
                            </tr>
                            <tr>
                              <th colspan="2">دارایی های غیر جاری</th>
                            </tr>
                            <tr>
                              <td>{{ d.evidentFixedAssets.name }}</td>
                              <td>{{ d.evidentFixedAssets.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.notEvidentAssets.name }}</td>
                              <td>{{ d.notEvidentAssets.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.longTimeInvestments.name }}</td>
                              <td>{{ d.longTimeInvestments.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.otherAssets.name }}</td>
                              <td>{{ d.otherAssets.remain }}</td>
                            </tr>
                            <tr class="text-bold">
                              <td>{{ d.totalNotCurrentAssets.name }}</td>
                              <td>{{ d.totalNotCurrentAssets.remain }}</td>
                            </tr>
                            <tr class="text-bold text-primary">
                              <td>{{ d.totalAssets.name }}</td>
                              <td>{{ d.totalAssets.remain }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="table-responsive table-bordered table-striped">
                        <table class="table">
                          <thead>
                            <tr>
                              <th colspan="2">بدهی ها و حقوق صاحبان سهام</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th colspan="2">بدهی های جاری</th>
                            </tr>
                            <tr>
                              <td>{{ d.businessAccountsAndPayableDocuments.name }}</td>
                              <td>{{ d.businessAccountsAndPayableDocuments.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.otherAccountsAndPayableDocuments.name }}</td>
                              <td>{{ d.otherAccountsAndPayableDocuments.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.prepayments.name }}</td>
                              <td>{{ d.prepayments.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.taxSave.name }}</td>
                              <td>{{ d.taxSave.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.paidDividends.name }}</td>
                              <td>{{ d.paidDividends.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.receivableFunds.name }}</td>
                              <td>{{ d.receivableFunds.remain }}</td>
                            </tr>
                            <tr class="text-bold">
                              <td>{{ d.totalCurrentDebt.name }}</td>
                              <td>{{ d.totalCurrentDebt.remain }}</td>
                            </tr>
                            <tr>
                              <th colspan="2">بدهی های غیر جاری</th>
                            </tr>
                            <tr>
                              <td>{{ d.longtermAccountsAndPayableDocuments.name }}</td>
                              <td>{{ d.longtermAccountsAndPayableDocuments.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.longtermReceivableFunds.name }}</td>
                              <td>{{ d.longtermReceivableFunds.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.savedEndingServiceBenefits.name }}</td>
                              <td>{{ d.savedEndingServiceBenefits.remain }}</td>
                            </tr>
                            <tr class="text-bold">
                              <td>{{ d.totalNotCurrentDebt.name }}</td>
                              <td>{{ d.totalNotCurrentDebt.remain }}</td>
                            </tr>
                            <tr class="text-bold">
                              <td>{{ d.totalDebt.name }}</td>
                              <td>{{ d.totalDebt.remain }}</td>
                            </tr>
                            <tr>
                              <th colspan="2">حقوق صاحبان سهام</th>
                            </tr>
                            <tr>
                              <td>{{ d.fund.name }}</td>
                              <td>{{ d.fund.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.legalSaving.name }}</td>
                              <td>{{ d.legalSaving.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.otherSavings.name }}</td>
                              <td>{{ d.otherSavings.remain }}</td>
                            </tr>
                            <tr>
                              <td>{{ d.accumulatedProfit.name }}</td>
                              <td>{{ d.accumulatedProfit.remain }}</td>
                            </tr>
                            <tr class="text-bold">
                              <td>{{ d.equitiesSum.name }}</td>
                              <td>{{ d.equitiesSum.remain }}</td>
                            </tr>
                            <tr class="text-bold text-primary">
                              <td>{{ d.totalDebtsAndEquities.name }}</td>
                              <td>{{ d.totalDebtsAndEquities.remain }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import date from "@/components/mcomponents/cleave/Date";
export default {
  name: "BalanceSheet",
  components: { date },
  mixins: [],
  data() {
    return {
      d: {},
      filters: {}
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      let filters = {};
      for (const k of Object.keys(this.filters)) {
        if (["undefined", ""].includes(this.filters[k])) return;
        if (k.includes("date") || k.includes("due")) {
          let gDate = this.toGDate(this.filters[k]);
          if (gDate == "Invalid date") {
            this.notify("فرمت تاریخ وارد شده معتبر نمی باشد", "danger");
            return;
          }
          filters[k] = gDate;
        } else {
          filters[k] = this.filters[k];
        }
      }

      return this.request({
        url: this.endpoint("reports/balanceSheet"),
        method: "get",
        params: {
          ...this.filters
        },
        success: data => {
          this.d = data;
          Object.keys(this.d).forEach(k => {
            this.d[k].remain = this.toMoney(this.d[k].remain);
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
th {
  text-align: center;
}
td {
  width: 50%;
}
tr td:nth-child(2) {
  text-align: left;
}
</style>
