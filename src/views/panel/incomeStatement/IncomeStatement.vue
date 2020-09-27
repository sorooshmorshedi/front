<template>
  <v-card>
    <v-card-title>صورت سود و زیان</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="2">
          <date placeholder="از تاریخ" v-model="filters.from_date" />
        </v-col>
        <v-col cols="12" md="2">
          <date placeholder="تا تاریخ" v-model="filters.to_date" />
        </v-col>
        <v-col cols="12" md="2">
          <v-btn @click="getData()" class="blue white--text w-100px mt-1">گزارش</v-btn>
        </v-col>
        <v-col cols="6" class="d-flex justify-end">
          <v-btn
            :href="this.endpoint('reports/incomeStatement/xlsx') + `?detailed=${detailed == true}&token=${token}`"
            target="_blank"
            class="export-btn"
          >اکسل</v-btn>
        </v-col>
        <v-col cols="12">
          <v-simple-table dense>
            <thead class="grey lighten-3">
              <tr>
                <th>#</th>
                <th>شرح</th>
                <th colspan="2">مبلغ</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(r, i) in rows">
                <tr :key="i">
                  <td>{{ i+1 }}</td>
                  <td :class="{'font-weight-bold': i == rows.length-1}">
                    <span
                      :class="{'red--text': r.type.prefixColor == 'red', 'blue--text': r.type.prefixColor == 'blue'}"
                      v-if="r.type.hasPrefix"
                    >{{ r.type.prefix }}</span>
                    {{ r.type.name }}
                  </td>

                  <td
                    :class="{'font-weight-bold': i == rows.length-1}"
                    dir="ltr"
                  >{{ r.remain | toMoney }}</td>
                  <td v-if="detailed"></td>
                </tr>
                <template v-if="detailed">
                  <template v-for="(acc, j) in r.accounts">
                    <tr :key="i + '' + j">
                      <td></td>
                      <td class="account-row">{{ acc.title }}</td>
                      <td class="ltr">{{ acc.remain | toMoney }}</td>
                      <td></td>
                    </tr>
                  </template>
                  <tr :key="'s' + i">
                    <td></td>
                    <td class="account-row">جمع {{ r.type.name }}</td>
                    <td></td>
                    <td
                      :class="{'text-bold': i == rows.length-1}"
                      dir="ltr"
                    >{{ r.remain | toMoney }}</td>
                  </tr>
                </template>
              </template>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import date from "@/components/mcomponents/cleave/Date";
import accountApiMixin from "@/mixin/accountMixin";
export default {
  name: "IncomeStatement",
  components: { date },
  props: {
    detailed: {
      default: false
    }
  },
  data() {
    return {
      rows: [],
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
        url: this.endpoint("reports/incomeStatement"),
        method: "get",
        params: {
          ...this.filters
        },
        success: data => {
          this.rows = data;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.account-row {
  padding-right: 30px;
}
</style>
