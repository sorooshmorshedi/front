<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right ">
        <div class="card-body">
          <div class="title">ثبت دریافت</div>
          <div class="row">
            <div class="col-lg-6">
              <div class="row">
                <div class="form-group col-lg-4">
                  <label>شماره دریافت</label>
                  <input type="text" class="form-control" disabled>
                </div>
                <div class="form-group col-lg-4">
                  <label>تاریخ</label>
                  <date class="form-control" v-model="receive.date" />
                </div>
                <div class="form-group col-lg-4">
                  <label>تاریخ راس</label>
                  <date class="form-control" disabled/>
                </div>
                <div class="form-group col-lg-8">
                  <label>کد - نام مشتری</label>
                  <multiselect :options="accountsSelectValues.levels[3]" v-model="receive.account" track-by="id" label="title" />
                </div>
                <div class="col-lg-4">
                  <button type="button" name="" id="" class="btn btn-info">پرداخت شده برای فاکتور های</button>
                </div>
              </div>
            </div>
            <div class="form-group col-lg-6">
              <label>توضیحات دریافت</label>
              <textarea class="form-control" rows=5 v-model="receive.exp"></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="table-responsive">
                <table class="table table-striped ">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>نوع دریافت</th>
                      <th>حساب شناور</th>
                      <th>مبلغ</th>
                      <th>شماره مستند</th>
                      <th>تاریخ دریافت/سررسید</th>
                      <th>نام بانک</th>
                      <th>توضیح</th>
                      <th>فایل</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row,i) in rows" :key="i">
                      <td>{{ i+1 }}</td>
                      <td>
                        <multiselect :options="sanadsSelectValues.RPTypes" v-model="rows[i].type" track-by="id" label="name" />
                      </td>
                      <td >
                        <multiselect
                          v-if="rows[i].type && rows[i].type.account.floatAccountGroup"
                          :options="rows[i].type.account.floatAccountGroup.floatAccounts"
                          v-model="rows[i].floatAccount"
                          track-by="id"
                          label="name"
                       />
                      </td>
                      <td>
                        <money class="form-control form-control-sm" v-model="rows[i].value" />
                      </td>
                      <td>
                        <input type="text" class="form-control form-control-sm" v-model="rows[i].serial">
                      </td>
                      <td>
                        <date class="form-control form-control-sm" />
                      </td>
                      <td>
                        <input type="text" class="form-control form-control-sm">
                      </td>
                      <td>
                        <input type="text" class="form-control form-control-sm">
                      </td>
                      <td>
                        <input type="text" class="form-control form-control-sm">
                      </td>
                    </tr>
                    <tr>
                    </tr>
                    <tr class="bg-info text-white">
                      <td colspan="1"></td>
                      <td class="text-left">مجموع:</td>
                      <td class="">{{ sum | toMoney }}</td>
                      <td colspan="5"></td>
                      <td class="text-left"></td>
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
import sanadApiMixin from "@/mixin/sanadApi";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
export default {
  name: "Create",
  components: { money, date },
  mixins: [accountApiMixin, sanadApiMixin],
  data() {
    return {
      receive: {},
      rows: [{}]
    };
  },
  created() {
    this.getAccounts();
    this.getRPTypes();
  },
  mounted() {},
  computed: {
    sum() {
      let sum = 0;
      this.rows.forEach(r => {
        if (r.value) sum += +r.value;
      });
      return sum;
    }
  },
  watch: {
    rows: {
      handler() {
        if (this.rows[this.rows.length - 1].type) {
          this.rows.push({});
        }
      },
      deep: true
    }
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.table-responsive {
  overflow: visible;
  th,
  td,
  input {
    text-align: center;
  }
}
</style>

