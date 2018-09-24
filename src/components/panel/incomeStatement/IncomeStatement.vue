<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right ">
        <div class="card-body">
          <div class="title">
            صورت سود و زیان
          </div>
          <div class="row">
            <div class="col-lg-12">
              <div class="card right ">
                <div class="card-body">
                  <div class="row">
                    <div class="form-group col-lg-2">
                      <label>از تاریخ</label>
                      <date class="form-control" v-model="filters.from_date" />
                    </div>
                    <div class="form-group col-lg-2">
                      <label>تا تاریخ</label>
                      <date class="form-control" v-model="filters.to_date" />
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
                              <th>مبلغ</th>
                              <th>مبلغ</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(r, i) in rows" :key="i">
                              <td>{{ i+1 }}</td>
                              <td>{{ r.type.name }}</td>
                              <td class="" dir="ltr">{{ r.remain?r.remain:'-' }}</td>
                              <td class="" dir="ltr">{{ r.sum?r.sum:'-' }}</td>
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
import accountApiMixin from "@/mixin/accountApi";
export default {
  name: "IncomeStatement",
  components: { date },
  mixins: [],
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
</style>
