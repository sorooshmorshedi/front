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
                  <multiselect dir="rtl" :options="accountsSelectValues.levels[3]" v-model="factor.customer" track-by="id" label="title" />
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
                      <th>کالا</th>
                      <th>انبار</th>
                      <th>تعداد</th>
                      <th>واحد</th>
                      <th>قیمت واحد</th>
                      <th>جمع</th>
                      <th>تخفیف (مبلغ)</th>
                      <th>تخفیف (درصد)</th>
                      <th>جمع کل پس از تخفیف</th>

                      <th v-if="hasTax">مالیات</th>
                      <th v-if="hasTax">جمع مبلغ کل و مالیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row,i) in rows" :key="i">
                      <td>{{ i+1 }}</td>
                      <td>
                        <multiselect dir="rtl" :options="waresSelectValues.wares" v-model="rows[i].ware" track-by="id" label="title" />
                      </td>
                      <td>
                        <multiselect v-if="rows[i].ware" dir="rtl" :options="waresSelectValues.wareHouses" v-model="rows[i].ware.wareHouse" track-by="id" label="title" />
                        <span v-else> - </span>
                      </td>
                      <td>
                        <input dir="ltr" type="number" class="form-control form-control-sm" v-model="rows[i].count">
                      </td>
                      <td>
                        {{ rows[i].ware?rows[i].ware.unit.name:' - ' }}
                      </td>
                      <td>
                        <money class="form-control form-control-sm" v-model="rows[i].fee" />
                      </td>
                      <td dir="ltr">
                        {{ rowSum(row) | toMoney}}
                      </td>
                      <td>
                        <money :disabled="rows[i].discountPercent != ''" class="form-control form-control-sm" v-model="rows[i].discountValue" />
                      </td>
                      <td>
                        <input :disabled="rows[i].discountValue != ''" type="number" min=0 max=100 class="form-control form-control-sm" v-model="rows[i].discountPercent" />
                      </td>
                      <td dir="ltr">
                        {{ rowSumAfterDiscount(row) | toMoney }}
                      </td>
                      <td>
                        {{ rowTax(row) | toMoney }}
                      </td>
                      <td>
                        {{ rowSumAfterTax(row) | toMoney }}
                      </td>
                    </tr>
                    <tr>
                    </tr>
                    <tr class="bg-info text-white">
                      <td colspan="5"></td>
                      <td class="text-left">مجموع:</td>
                      <td class="text-left">{{ sum.sum | toMoney }}</td>
                      <td colspan="2"></td>
                      <td class="text-left">{{ sum.afterDiscount | toMoney }}</td>
                      <td class="text-left">{{ sum.tax | toMoney }}</td>
                      <td class="text-left">{{ sum.afterTax | toMoney }}</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="row">

            <div class="form-group col-lg-3">
              <label>تخفیف فاکتور (مبلغ)</label>
              <money :disabled="factor.discountPercent != ''" class="form-control" v-model="factor.discountValue" />
            </div>
            <div class="form-group col-lg-3">
              <label>تخفیف فاکتور (درصد)</label>
              <input :disabled="factor.discountValue != ''" type="number" min=0 max=100 class="form-control" v-model="factor.discountPercent" />
            </div>

            <div class="form-group col-lg-3">
              <label>مالیات (درصد)</label>
              <money :disabled="factor.taxPercent != ''" class="form-control" v-model="factor.taxValue" />
            </div>
            <div class="form-group col-lg-3">
              <label>مالیات (مبلغ)</label>
              <input :disabled="factor.taxValue != ''" type="number" min=0 max=100 class="form-control" v-model="factor.taxPercent" />
            </div>
            <div class="form-group col-lg-3">
              <label></label>
              <input type="text" class="form-control">
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
      factor: {
        taxPercent: "",
        taxValue: "",
        discountPercent: "",
        discountValue: ""
      },
      rows: [],
      hasTax: true,
      rowTemplate: {
        discountValue: "",
        discountPercent: ""
      }
    };
  },
  created() {
    this.getAccounts();
    this.getWareHouses();
    this.getWares();
    this.rows.push(this.rowTemplate);
  },
  methods: {
    rowSum(row) {
      if (!row.fee || !row.count) return 0;
      return +row.fee * +row.count;
    },
    rowSumAfterDiscount(row) {
      if (!this.rowSum(row)) return 0;
      if (!row.discountValue && !row.discountPercent) return this.rowSum(row);
      if (row.discountValue) return this.rowSum(row) - +row.discountValue;
      else
        return +(this.rowSum(row) * (100 - +row.discountPercent) / 100).toFixed(
          2
        );
    },
    rowTax(row) {
      if (!this.rowSumAfterDiscount(row)) return 0;
      if (!this.factor.taxValue && !this.factor.taxPercent) return 0;
      if (this.factor.taxValue)
        return +this.factor.taxValue / (this.rows.length - 1);
      else
        return +(
          this.rowSumAfterDiscount(row) *
          +this.factor.taxPercent /
          100
        ).toFixed(2);
    },
    rowSumAfterTax(row) {
      if (!this.rowTax(row)) return this.rowSumAfterDiscount(row);
      return this.rowSumAfterDiscount(row) + this.rowTax(row);
    }
  },
  computed: {
    sum() {
      let res = {
        sum: 0,
        afterDiscount: 0,
        tax: 0,
        afterTax: 0
      };
      this.rows.forEach(r => {
        res.sum += this.rowSum(r);
        res.afterDiscount += this.rowSumAfterDiscount(r);
        res.tax += this.rowTax(r);
        res.afterTax += this.rowSumAfterTax(r);
      });
      return res;
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
    }
  },
  watch: {
    rows: {
      handler() {
        let row = this.rows[this.rows.length - 1];
        if (row && row.ware) {
          this.rows.push({
            discountValue: "",
            discountPercent: ""
          });
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

