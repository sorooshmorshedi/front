<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right ">
        <div class="card-body">
          <div class="title">ثبت فاکتور</div>
          <div class="row">
            <div class="col-lg-6">
              <div class="row">
                <div class="form-group col-lg-3">
                  <label>شماره فاکتور</label>
                  <input type="text" class="form-control" disabled>
                </div>
                <div class="form-group col-lg-3">
                  <label>تاریخ فاکتور</label>
                  <date class="form-control" v-model="factor.date" />
                </div>
                <div class="form-group col-lg-3">
                  <label>ساعت فاکتور</label>
                  <mtime class="form-control" v-model="factor.time" />
                </div>
                <div class="form-group col-lg-3">
                  <label>صادر کننده فاکتور</label>
                  <input type="text" class="form-control" disabled>
                </div>
                <div class="form-group col-lg-12">
                  <label>کد - نام مشتری</label>
                  <multiselect :options="accountsSelectValues.levels[3]" v-model="factor.customer" track-by="id" label="title" />
                </div>
              </div>
            </div>
            <div class="form-group col-lg-6">
              <label>توضیحات</label>
              <textarea class="form-control" rows=5 v-model="factor.exp"></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>انبار</th>
                      <th>کد - نام کالا</th>
                      <th>مقدار</th>
                      <th>فی</th>
                      <th>مبلغ تخفیف</th>
                      <th>مبلغ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row,i) in rows" :key="i">
                      <td>{{ i+1 }}</td>
                      <td>
                        <multiselect :options="waresSelectValues.wareHouses" v-model="rows[i].wareHouse" track-by="id" label="title" />
                      </td>
                      <td>
                        <multiselect :options="wareHouseWares[i]" v-model="rows[i].ware" track-by="id" label="title" />
                      </td>
                      <td>
                        <input type="number" class="form-control form-control-sm" v-model="rows[i].count">
                      </td>
                      <td>
                        <money class="form-control form-control-sm" v-model="rows[i].fee" />
                      </td>
                      <td>
                        <money class="form-control form-control-sm" v-model="rows[i].discount" />
                      </td>
                      <td>
                        <money class="form-control form-control-sm" disabled :value="rowValues[i]" />
                      </td>
                    </tr>
                    <tr>
                    </tr>
                    <tr class="bg-info text-white">
                      <td colspan="5"></td>
                      <td class="text-left">مجموع:</td>
                      <td class="text-left">{{ sum | toMoney }}</td>
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
import wareApiMixin from "@/mixin/wareApi";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import mtime from "@/components/mcomponents/cleave/Time";
export default {
  name: "Create",
  components: { money, date, mtime },
  mixins: [accountApiMixin, wareApiMixin],
  data() {
    return {
      factor: {},
      rows: [{}]
    };
  },
  created() {
    this.getAccounts();
    this.getWareHouses();
    this.getWares();
  },
  mounted() {},
  computed: {
    sum() {
      let sum = 0;
      this.rowValues.forEach(rv => {
        sum += rv;
      });
      return sum;
    },
    wareHouseWares() {
      let res = [];
      this.rows.forEach((r, i) => {
        if (!r.wareHouse) res.push([]);
        else {
          res.push(
            this.wares.filter(w => {
              return w.wareHouse.id == r.wareHouse.id;
            })
          );
        }
      });
      return res;
    },
    rowValues() {
      let res = [];
      this.rows.forEach((r, i) => {
        if (!r.fee || !r.count) res.push(0);
        else {
          let value = r.fee * r.count;
          if (r.discount) value -= r.discount;
          res.push(value);
        }
      });
      return res;
    }
  },
  watch: {
    rows: {
      handler() {
        if (this.rows[this.rows.length - 1].wareHouse) {
          this.rows.push({});
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.table-responsive {
  overflow: visible;
}
</style>

