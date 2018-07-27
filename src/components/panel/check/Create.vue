<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right ">
        <div class="card-body">
          <div class="title">ثبت سند</div>
          <div class="row">
            <div class="col-lg-6">
              <div class="row">
                <div class="form-group col-lg-6">
                  <label>شماره سند</label>
                  <input type="text" class="form-control" disabled>
                </div>
                <div class="form-group col-lg-6">
                  <label>تاریخ سند</label>
                  <date class="form-control" v-model="sanad.date" />
                </div>
                <div class="form-group col-lg-6">
                  <label>صادر کننده سند</label>
                  <input type="text" class="form-control" disabled>
                </div>
              </div>
            </div>
            <div class="form-group col-lg-6">
              <label>توضیحات سند</label>
              <textarea class="form-control" rows=5 v-model="sanad.exp"></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="table-responsive">
                <table class="table table-striped ">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>شماره - نام حساب</th>
                      <th>نوع</th>
                      <th>توضیحات</th>
                      <th>تفضیلی شناور</th>
                      <th>مرکز هزینه</th>
                      <th>بدهکار</th>
                      <th>بستانکار</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row,i) in rows" :key="i">
                      <td>{{ i+1 }}</td>
                      <td>
                        <multiselect :options="accountsSelectValues.levels[3]" v-model="rows[i].account" track-by="id" label="title" />
                      </td>
                      <td>
                        <input type="text" class="form-control form-control-sm">
                      </td>
                      <td>
                        <input type="text" class="form-control form-control-sm" v-model="rows[i].exp">
                      </td>
                      <td>
                        <multiselect :options="floatAccounts(rows[i])" v-model="rows[i].floatAccount" track-by="id" label="name" />
                      </td>
                      <td>
                        <multiselect :options="costCenters(rows[i])" v-model="rows[i].costCenter" track-by="id" label="name" />
                      </td>
                      <td>
                        <money class="form-control form-control-sm" v-model="rows[i].bed" />
                      </td>
                      <td>
                        <money class="form-control form-control-sm" v-model="rows[i].bes" />
                      </td>
                    </tr>
                    <tr>
                    </tr>
                    <tr class="bg-info text-white">
                      <td colspan="5"></td>
                      <td class="text-left">مجموع:</td>
                      <td class="">{{ bedSum | toMoney }}</td>
                      <td class="">{{ besSum | toMoney }}</td>
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
</template>

<script>
import accountApiMixin from "@/mixin/accountApi";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
export default {
  name: "Create",
  components: { money, date },
  mixins: [accountApiMixin],
  data() {
    return {
      sanad: {},
      rows: [{}]
    };
  },
  created() {
    this.getAccounts();
    this.getCostCenterGroups();
  },
  mounted() {},
  computed: {
    bedSum() {
      let sum = 0;
      this.rows.forEach(r => {
        if (r.bed) sum += +r.bed;
      });
      return sum;
    },
    besSum() {
      let sum = 0;
      this.rows.forEach(r => {
        if (r.bes) sum += +r.bes;
      });
      return sum;
    }
  },
  watch: {
    rows: {
      handler() {
        if (this.rows[this.rows.length - 1].account) {
          this.rows.push({});
        }
      },
      deep: true
    }
  },
  methods: {
    floatAccounts(row) {
      if (row.account && row.account.floatAccountGroup) {
        return row.account.floatAccountGroup.floatAccounts;
      } else {
        return [];
      }
    },
    costCenters(row) {
      if (row.account && row.account.costCenterGroup) {
        return row.account.costCenterGroup.costCenters;
      } else {
        return [];
      }
    },
  }
};
</script>

<style scoped lang="scss">
.table-responsive {
  overflow: visible;
  th,td,input {
    text-align: center;
  }
}
</style>

