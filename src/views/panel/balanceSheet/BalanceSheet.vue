<template>
  <v-card>
    <v-card-title>ترازنامه</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="2">
          <date placeholder="از تاریخ" v-model="filters.from_date" />
        </v-col>
        <v-col cols="12" md="2">
          <date placeholder="تا تاریخ" v-model="filters.to_date" />
        </v-col>
        <v-col cols="12" md="3">
          <v-switch label="در نظر نگرفتن سند بستن" v-model="filters.skipClosingSanad"></v-switch>
        </v-col>

        <v-col cols="12" md="2">
          <v-btn @click="getData()" class="blue white--text w-100px mt-1">گزارش</v-btn>
        </v-col>

        <v-col cols="12" md="3" class="d-flex justify-end">
          <v-btn
            :href="this.endpoint('reports/balanceSheet/xlsx') + `?detailed=${detailed == true}&token=${token}`"
            target="_blank"
            class="export-btn"
          >اکسل</v-btn>
        </v-col>

        <template v-if="!_.isEmpty(d)">
          <v-col cols="12" md="6">
            <v-simple-table dense>
              <thead class="grey lighten-3">
                <tr>
                  <th colspan="2" class="text-center">دارایی ها</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th colspan="2" class="text-center">دارایی های جاری</th>
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
                <tr class="font-weight-bold">
                  <td>{{ d.totalCurrentAssets.name }}</td>
                  <td>{{ d.totalCurrentAssets.remain }}</td>
                </tr>
                <tr>
                  <th colspan="2" class="text-center">دارایی های غیر جاری</th>
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
                <tr class="font-weight-bold">
                  <td>{{ d.totalNotCurrentAssets.name }}</td>
                  <td>{{ d.totalNotCurrentAssets.remain }}</td>
                </tr>
                <tr class="font-weight-bold blue--text">
                  <td>{{ d.totalAssets.name }}</td>
                  <td>{{ d.totalAssets.remain }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
          <v-col cols="12" md="6">
            <v-simple-table dense>
              <thead class="grey lighten-3">
                <tr>
                  <th colspan="2" class="text-center">بدهی ها و حقوق صاحبان سهام</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th colspan="2" class="text-center">بدهی های جاری</th>
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
                  <td>{{ d.saveTypes.name }}</td>
                  <td>{{ d.saveTypes.remain }}</td>
                </tr>
                <tr>
                  <td>{{ d.paidDividends.name }}</td>
                  <td>{{ d.paidDividends.remain }}</td>
                </tr>
                <tr>
                  <td>{{ d.receivableFunds.name }}</td>
                  <td>{{ d.receivableFunds.remain }}</td>
                </tr>
                <tr class="font-weight-bold">
                  <td>{{ d.totalCurrentDebt.name }}</td>
                  <td>{{ d.totalCurrentDebt.remain }}</td>
                </tr>
                <tr>
                  <th colspan="2" class="text-center">بدهی های غیر جاری</th>
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
                <tr class="font-weight-bold">
                  <td>{{ d.totalNotCurrentDebt.name }}</td>
                  <td>{{ d.totalNotCurrentDebt.remain }}</td>
                </tr>
                <tr class="font-weight-bold">
                  <td>{{ d.totalDebt.name }}</td>
                  <td>{{ d.totalDebt.remain }}</td>
                </tr>
                <tr>
                  <th colspan="2" class="text-center">حقوق صاحبان سهام</th>
                </tr>
                <tr>
                  <td>{{ d.fund.name }}</td>
                  <td>{{ d.fund.remain }}</td>
                </tr>
                <tr>
                  <td>{{ d.savings.name }}</td>
                  <td>{{ d.savings.remain }}</td>
                </tr>
                <tr>
                  <td>{{ d.accumulatedProfit.name }}</td>
                  <td>{{ d.accumulatedProfit.remain }}</td>
                </tr>
                <tr class="font-weight-bold">
                  <td>{{ d.equitiesSum.name }}</td>
                  <td>{{ d.equitiesSum.remain }}</td>
                </tr>
                <tr class="font-weight-bold blue--text">
                  <td>{{ d.totalDebtsAndEquities.name }}</td>
                  <td>{{ d.totalDebtsAndEquities.remain }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </template>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import date from "@/components/mcomponents/cleave/Date";
import _ from "lodash";
export default {
  name: "BalanceSheet",
  components: { date },
  props: {
    detailed: {
      default: false
    }
  },
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
  },
  computed: {
    _() {
      return _;
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
  direction: ltr;
}
</style>
