<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <div class="title">صورت سود و زیان</div>
          <div class="row">
            <div class="col-lg-12">
              <div class="card right">
                <div class="card-body">
                  <div class="row">
                    <div class="form-group col-lg-2">
                      <label>از تاریخ</label>
                      <date
                        class="form-control"
                        v-model="filters.from_date"
                        placeholder="xxxx-xx-xx"
                      />
                    </div>
                    <div class="form-group col-lg-2">
                      <label>تا تاریخ</label>
                      <date
                        class="form-control"
                        v-model="filters.to_date"
                        placeholder="xxxx-xx-xx"
                      />
                    </div>
                    <div class="form-group col-lg-2">
                      <button @click="getData()" class="btn btn-info btn-label-margin w-100px">گزارش</button>
                    </div>
                    <div class="col-lg-12">
                      <div class="table-responsive table-bordered table-striped">
                        <table class="table">
                          <thead>
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
                                <td :class="{'text-bold': i == rows.length-1}">
                                  <span
                                    :class="{'text-danger': r.type.prefixColor == 'red', 'text-primary': r.type.prefixColor == 'blue'}"
                                    v-if="r.type.hasPrefix"
                                  >{{ r.type.prefix }}</span>
                                  {{ r.type.name }}
                                </td>

                                <td
                                  :class="{'text-bold': i == rows.length-1}"
                                  dir="ltr"
                                >{{ r.remain | toMoney }}</td>
                                <td v-if="detailed"></td>
                              </tr>
                              <template v-if="detailed">
                                <template v-for="(acc, j) in r.accounts">
                                  <tr :key="i + '' + j">
                                    <td></td>
                                    <td class="account-row">{{ acc.title }}</td>
                                    <td>{{ acc.remain | toMoney }}</td>
                                    <td></td>
                                  </tr>
                                </template>
                                <tr :key="i">
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
