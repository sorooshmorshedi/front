<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right ">
        <div class="card-body">
          <div class="title">
            ثبت {{ type.label }}
            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#transaction-selection-modal" style="margin-right:15px;">انتخاب {{ type.label }}</button>
          </div>
          <div class="row">
            <div class="col-lg-8">
              <div class="row">
                <div class="form-group col-lg-3">
                  <label>شماره {{ type.label }}</label>
                  <input v-if="transaction.id" type="text" class="form-control" disabled v-model="transaction.code">
                  <input v-else type="text" class="form-control" disabled :value="transactionCode">
                </div>
                <div class="form-group col-lg-5">
                  <label>کد - نام مشتری</label>
                  <multiselect dir="rtl" :options="transactionAccounts" v-model="transaction.account" track-by="id" label="title" />
                </div>
                <div class="form-group col-lg-4">
                  <template v-if="transaction.account && transaction.account.floatAccountGroup">
                    <label>حساب شناور</label>
                    <multiselect dir="rtl" :options="transactionFloatAccounts" v-model="transaction.floatAccount" track-by="id" label="name" />
                  </template>
                </div>
                <div class="form-group col-lg-3">
                  <label>تاریخ</label>
                  <date class="form-control" v-model="transaction.date" />
                </div>
                <div class="form-group col-lg-3">
                  <label>تاریخ راس</label>
                  <date class="form-control" disabled/>
                </div>
                <div class="col-lg-4">
                  <button type="button" name="" id="" class="btn btn-info">پرداخت شده برای فاکتور های</button>
                </div>
              </div>
            </div>
            <div class="form-group col-lg-4">
              <label>توضیحات {{ type.label }} </label>
              <textarea class="form-control" rows=5 v-model="transaction.exp"></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="table-responsive">
                <table class="table table-striped ">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>نوع {{ type.label }}</th>
                      <th>حساب شناور</th>
                      <th>مبلغ</th>
                      <th>شماره مستند</th>
                      <th>تاریخ {{ type.label }}/سررسید</th>
                      <th>نام بانک</th>
                      <th>توضیح</th>
                      <th>فایل</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row,i) in rows" :key="i">
                      <td>{{ i+1 }}</td>
                      <td>
                        <multiselect dir="rtl" :options="accountsSelectValues.defaultAccounts" v-model="rows[i].type" track-by="id" label="name" />
                      </td>
                      <td>
                        <multiselect dir="rtl" v-if="rows[i].type && rows[i].type.account.floatAccountGroup" :options="rows[i].type.account.floatAccountGroup.floatAccounts" v-model="rows[i].floatAccount" track-by="id" label="name" />
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
                      <td>
                        <button v-if="i != rows.length-1" @click="deleteRow(i)" type="button" class="btn btn-sm btn-warning">حذف ردیف</button>
                      </td>
                    </tr>
                    <tr>
                    </tr>
                    <tr class="bg-info text-white">
                      <td colspan="2"></td>
                      <td class="text-left">مجموع:</td>
                      <td class="">{{ sum | toMoney }}</td>
                      <td colspan="5"></td>
                      <td>
                        <button @click="deleteRow(0)" type="button" class="btn btn-sm btn-danger">حذف همه ردیف ها</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="row rtl">
            <div class="col-12 ">
              <button @click="validate()" type="button" class="btn submit btn-primary float-left w-100px">ثبت</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="transaction-selection-modal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{ type.label }} ها</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12">
                <div class="table-responsive">
                  <table class="table table-striped table-hover table-pointer">
                    <thead>
                      <tr>
                        <th>شماره {{ type.label }}</th>
                        <th>توضیحات</th>
                        <th>تاریخ</th>
                        <th>شخص</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(t,i) in transactionsList" :key="i" @click="selectTransaction(t)">
                        <td>{{ t.code }}</td>
                        <td>{{ t.explanation }}</td>
                        <td>{{ t.date }}</td>
                        <td>{{ t.account.title }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button type="button" class="btn btn-primary">انتخاب</button>
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
  props: ["transactionType"],
  data() {
    return {
      transaction: {},
      rows: [{}],
      type: {
        label: "",
        type: ""
      },
      itemsToDelete: []
    };
  },
  created() {
    this.init();
    this.getData();
  },
  mounted() {
    setTimeout(() => {
      $("#transaction-selection-modal").modal("show");
    }, 200);
  },
  computed: {
    sum() {
      let sum = 0;
      this.rows.forEach(r => {
        if (r.value) sum += +r.value;
      });
      return sum;
    },
    transactionCode() {
      if (this.type.type == "receive") return this.receiveCode;
      else return this.paymentCode;
    },
    transactionsList() {
      return this.transactions.filter(o => o.type == this.type.type);
    },
    transactionAccounts() {
      if (this.type.type == "receive") return this.accountsSelectValues.buyers;
      else return this.accountsSelectValues.sellers;
    },
    transactionFloatAccounts() {
      if (
        this.transaction.account &&
        this.transaction.account.floatAccountGroup
      ) {
        return this.transaction.account.floatAccountGroup.floatAccounts;
      }
      return [];
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
    },
    transactionType() {
      this.init();
    }
  },
  methods: {
    init() {
      if (this.transactionType == "receive") {
        this.type.label = "دریافت";
        this.type.type = "receive";
        this.transaction.type = "receive";
      } else if (this.transactionType == "payment") {
        this.type.label = "پرداخت";
        this.type.type = "payment";
        this.transaction.type = "payment";
      } else {
        console.error("404");
      }
    },
    getData() {
      this.getAccounts();
      this.getDefaultAccounts();
      this.getTransactions();
    },
    selectTransaction(transaction) {
      this.transaction = transaction;
      this.itemsToDelete = [];
      this.rows = transaction.items;
      this.rows.push({});
      $("#transaction-selection-modal").modal("hide");
    },
    deleteRow(index) {
      if (index == 0) {
        this.rows.forEach(row => {
          if (row.id) this.itemsToDelete.push(row.id);
        });
        this.rows.splice(0, this.rows.length - 1);
      } else {
        let row = this.rows[index];
        if (row.id) this.itemsToDelete.push(row.id);
        this.rows.splice(index, 1);
      }
    },
    validate() {
      if (this.transaction.id) this.updateTransaction();
      else this.storeTransaction();
    },
    storeTransaction() {
      let data = this.copy(this.transaction);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      });
      data.code = this.transactionCode;
      this.request({
        url: this.endpoint("sanads/transactions"),
        method: "post",
        data: data,
        success: data => {
          this.transaction = data;
          this.syncTransactionItems();
        }
      });
    },
    updateTransaction() {
      let data = this.copy(this.transaction);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      });
      this.request({
        url: this.endpoint("sanads/transactions/" + this.transaction.id),
        method: "put",
        data: data,
        success: data => {
          this.transaction = data;
          this.syncTransactionItems();
        }
      });
    },
    syncTransactionItems() {
      let updatedItems = [];
      let newItems = [];
      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;
        let item = this.copy(row);
        Object.keys(item).forEach(key => {
          if (item[key] && item[key].id) item[key] = item[key].id;
        });
        if (item.id) {
          updatedItems.push(item);
        } else {
          item.transaction = this.transaction.id;
          newItems.push(item);
        }
      });
      Promise.all([
        this.storeTransactionItems(newItems),
        this.updateTransactionItems(updatedItems),
        this.deleteTransactionItems()
      ]).then(data => {
        this.successNotify();
      });
    },
    storeTransactionItems(items) {
      if (!items.length) return;
      return this.request({
        url: this.endpoint("sanads/transactionItems/"),
        method: "post",
        data: items,
        success: data => {
          this.log(items.length + " transaction items created");
        }
      });
    },
    updateTransactionItems(items) {
      if (!items.length) return;
      return this.request({
        url: this.endpoint("sanads/transactionItems/mass"),
        method: "put",
        data: items,
        success: data => {
          this.log(items.length + " transaction items updated");
        }
      });
    },
    deleteTransactionItems() {
      if (!this.itemsToDelete.length) return;
      return this.request({
        url: this.endpoint("sanads/transactionItems/mass"),
        method: "delete",
        data: this.itemsToDelete,
        success: data => {
          this.log(this.itemsToDelete.length + " transaction items deleted");
          this.itemsToDelete = [];
        }
      });
    }
  }
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

