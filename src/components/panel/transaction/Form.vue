<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right ">
        <div class="card-body">
          <div class="title">
            ثبت {{ type.label }}
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
                  <button style="margin-top:27px" type="button" name="" id="" class="btn btn-info">پرداخت شده برای فاکتور های</button>
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
                      <th style="width: 200px">نوع {{ type.label }}</th>
                      <th>حساب شناور</th>
                      <th>مبلغ</th>
                      <th>شماره مستند</th>
                      <th>تاریخ {{ type.label }}</th>
                      <th>سررسید</th>
                      <th>نام بانک</th>
                      <th>توضیح</th>
                      <th>فایل</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row,i) in rows" :key="i">
                      <td>{{ i+1 }}</td>
                      <td>
                        <multiselect :disabled="hasCheque(row)" dir="rtl" :options="accountsSelectValues.defaultAccounts.filter(o => o.usage && o.usage.toLowerCase().includes(type.name))" v-model="rows[i].type" track-by="id" label="name" />
                        <button v-if="isChequeType(row) && !hasCheque(row)" @click="openSubmitChequeModal(row, i)" type="button" class="submit-tcheque btn btn-secondary btn-sm btn-block">ثبت چک</button>
                      </td>
                      <td>
                        <multiselect dir="rtl" v-if="rows[i].type && rows[i].type.account.floatAccountGroup" :options="rows[i].type.account.floatAccountGroup.floatAccounts" v-model="rows[i].floatAccount" track-by="id" label="name" />
                      </td>
                      <td>
                        <money :disabled="isChequeType(row)" class="form-control " v-model="rows[i].value" />
                      </td>
                      <td>
                        <input :disabled="isChequeType(row)" type="text" class="form-control" v-model="rows[i].documentNumber">
                      </td>
                      <td>
                        <date :disabled="isChequeType(row)" class="form-control" v-model="rows[i].date" />
                      </td>
                      <td>
                        <date class="form-control " disabled v-model="rows[i].due" />
                      </td>
                      <td>
                        <input :disabled="isChequeType(row)" type="text" class="form-control form-control" v-model="rows[i].bankName">
                      </td>
                      <td>
                        <input :disabled="isChequeType(row)" type="text" class="form-control form-control" v-model="rows[i].explanation">
                      </td>
                      <td>
                      </td>
                      <td>
                        <button v-if="i != rows.length-1 && !hasCheque(row)" @click="deleteRow(i)" type="button" class="btn btn-sm btn-warning">حذف ردیف</button>
                      </td>
                    </tr>
                    <tr>
                    </tr>
                    <tr class="bg-info text-white">
                      <td colspan="2"></td>
                      <td class="text-left">مجموع:</td>
                      <td class="">{{ sum | toMoney }}</td>
                      <td colspan="6"></td>
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
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(t,i) in transactionsList" :key="i" @click="selectTransaction(t)">
                        <td>{{ t.code }}</td>
                        <td>{{ t.explanation }}</td>
                        <td>{{ t.date }}</td>
                        <td>{{ t.account.title }}</td>
                        <td>
                          <button @click="openSanad(t.sanad)" class="btn btn-outline-info" type="button" id="button-addon1">مشاهده سند</button>
                        </td>
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

    <div class="modal fade" id="submit-cheque-modal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              ثبت چک
              <span v-if="cheque.type == 'paid'">پرداختی</span>
              <span v-else>دریافتی</span>
            </h4>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="form-group col-md-6">
                  <label for="">سریال چک</label>
                  <input v-if="cheque.type == 'received'" type="number" class="form-control" v-model="cheque.serial">
                  <multiselect v-else dir="rtl" label="title" track-by="id" :options="chequesSelectValues.cheques.filter(o => o.status == 'blank')" v-model="cheque" />
                </div>
                <div class="form-group col-12 col-md-6">
                  <label v-if="cheque.type == 'paid'">دریافت کننده</label>
                  <label v-else>پرداخت کننده</label>
                  <multiselect disabled dir="rtl" label="name" track-by="id" :options="accountsSelectValues.levels[3]" :value="transaction.account" />
                </div>
                <div class="form-group col-12 col-md-6 offset-md-6" v-if="transaction.account && transaction.account.floatAccountGroup">
                  <label for="">حساب شناور</label>
                  <multiselect disabled dir="rtl" label="name" track-by="id" :options="transaction.account.floatAccountGroup.floatAccounts" v-model="transaction.floatAccount" />
                </div>
                <div class="form-group col-12 col-md-6">
                  <label for="">مبلغ</label>
                  <money class="form-control" v-model="cheque.value" />
                </div>
                <div class="form-group col-12 col-md-3">
                  <label for="">تاریخ سررسید</label>
                  <date class="form-control" v-model="cheque.due" :default-date="true" />
                </div>
                <div class="form-group col-12 col-md-3">
                  <label v-if="cheque.type == 'paid'">تاریخ پرداخت</label>
                  <label v-else>تاریخ دریافت</label>
                  <date class="form-control" v-model="cheque.date" :default-date="true" />
                </div>
                <div class="col-12 col-md-6">
                  <div class="row">
                    <div class="form-group col-12" v-if="cheque.type == 'received'">
                      <label for="">نوع چک</label>
                      <multiselect dir="rtl" label="name" track-by="id" :options="[]" />
                    </div>
                  </div>
                </div>
                <div class="form-group col-12 col-md-6">
                  <label>شرح چک</label>
                  <textarea class="form-control" v-model="cheque.explanation" style="height:126px;"></textarea>
                </div>
                <div class="col-12">
                  <div class="row">
                    <div class="form-group col-12 col-md-4">
                      <label for="">نام بانک</label>
                      <input type="text" class="form-control" v-model="cheque.bankName" :disabled="cheque.type == 'paid'">
                    </div>
                    <div class="form-group col-12 col-md-4">
                      <label for="">نام شعبه</label>
                      <input type="text" class="form-control" v-model="cheque.branchName" :disabled="cheque.type == 'paid'">
                    </div>
                    <div class="form-group col-12 col-md-4">
                      <label for="">شماره حساب چک</label>
                      <input type="text" class="form-control" v-model="cheque.accountNumber" :disabled="cheque.type == 'paid'">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button @click="addCheque()" type="button" class="btn btn-primary w-100px">تایید</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountApi";
import sanadApiMixin from "@/mixin/sanadApi";
import chequeMixin from "@/mixin/cheque";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
export default {
  name: "Form",
  components: { money, date },
  mixins: [accountApiMixin, sanadApiMixin, chequeMixin],
  props: ["transactionType", "id"],
  data() {
    return {
      transaction: {},
      rows: [{}],
      type: {
        label: "",
        name: "",
        chequeType: ""
      },
      itemsToDelete: [],
      cheque: {},
      chequeRowIndex: null
    };
  },
  created() {
    this.init();
    this.getData();
  },
  mounted() {
    setTimeout(() => {
      // $("#transaction-selection-modal").modal("show");
      // this.submitChequeModal(this.type.name);
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
      if (this.type.name == "receive") return this.receiveCode;
      else return this.paymentCode;
    },
    transactionsList() {
      return this.transactions.filter(o => o.type == this.type.name);
    },
    transactionAccounts() {
      if (this.type.name == "receive") return this.accountsSelectValues.buyers;
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
    },
    id() {
      this.getTransaction(this.id);
    }
  },
  methods: {
    init() {
      if (!this.id) {
        this.rows = [{}];
        this.transaction = {};
      }
      if (this.transactionType == "receive") {
        this.type.label = "دریافت";
        this.type.name = "receive";
        this.type.chequeType = "received";
        this.transaction.type = "receive";
      } else if (this.transactionType == "payment") {
        this.type.label = "پرداخت";
        this.type.name = "payment";
        this.type.chequeType = "paid";
        this.transaction.type = "payment";
      } else {
        console.error("404");
      }
    },
    getData() {
      this.getAccounts();
      this.getDefaultAccounts();
      this.getChequebooks();
      console.log(this.id);
      this.getTransaction(this.id);
      this.getTransactionCodes();
    },
    getTransaction(id) {
      if (!id) return;
      let url = "sanads/transactions/" + id;
      return this.request({
        url: this.endpoint(url),
        method: "get",
        success: data => {
          this.selectTransaction(data);
        }
      });
    },
    selectTransaction(transaction) {
      this.rows = [];
      this.transaction = transaction;
      this.itemsToDelete = [];
      transaction.items.forEach(item => {
        this.rows.push(this.copy(item));
      });
      this.rows.push({});
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
      let isValid = true;
      if (this.rows.length == 1) {
        this.notify(`لطفا حداقل یک ردیف وارد کنید`, "danger");
        isValid = false;
      }
      this.rows.forEach((r, i) => {
        if (i == this.rows.length - 1) return;
        if (!this.hasValue(r.value)) {
          this.notify(`لطفا مبلغ ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
        if (!this.hasValue(r.date) || r.date.length != 10) {
          this.notify(
            `لطفا تاریخ ردیف ${i + 1} را به صورت صحیح وارد کنید`,
            "danger"
          );
          isValid = false;
        }
      });
      if (!isValid) return;

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
    async syncTransactionItems() {
      let updatedItems = [];
      let newItems = [];
      await Promise.all(
        this.rows.map(async (row, i) => {
          if (i == this.rows.length - 1) return row;
          let item = this.copy(row);

          if (this.hasCheque(item)) return row;

          if (item.id) {
            updatedItems.push(this.extractIds(item));
          } else {
            if (item.cheque) {
              await this.submitCheque(item);
            }
            item.transaction = this.transaction.id;
            item.account = item.type.account;
            newItems.push(this.extractIds(item));
          }
        })
      );
      this.log("start syncing transaction items");
      Promise.all([
        this.storeTransactionItems(newItems),
        this.updateTransactionItems(updatedItems),
        this.deleteTransactionItems()
      ]).then(data => {
        this.getChequebooks(true);
        this.getTransactionCodes();
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
    },
    isChequeType(row) {
      return row.type && row.type.programingName && row.type.programingName.includes("Cheque");
    },
    hasCheque(row) {
      return row.cheque && typeof row.cheque == "number";
    },
    openSubmitChequeModal(row, i) {
      this.cheque = {};
      let account = this.transaction.account;
      if (!account) {
        this.notify(`ابتدا حساب را انتخاب کنید`, "danger");
        return;
      }
      if (account.floatAccountGroup && !this.transaction.floatAccount) {
        this.notify(`لطفا حساب شناور را انتخاب کنید`, "danger");
        return;
      }
      this.cheque = this.copy(row.cheque);
      this.cheque.type = this.type.chequeType;
      this.chequeRowIndex = i;
      $("#submit-cheque-modal").modal("show");
    },
    addCheque() {
      if (!this.hasValue(this.cheque.serial)) {
        this.notify("لطفا سریال چک را وارد کنید", "danger");
        return;
      }
      if (!this.hasValue(this.cheque.value)) {
        this.notify("لطفا مبلغ چک را وارد کنید", "danger");
        return;
      }
      if (this.cheque.date.length != 10 || this.cheque.due.length != 10) {
        this.notify("لطفا تاریخ های چک را به صورت صحیح وارد کنید", "danger");
        return;
      }
      let row = this.rows[this.chequeRowIndex];
      row.cheque = this.copy(this.cheque);
      row.value = this.cheque.value;
      row.documentNumber = this.cheque.serial;
      row.date = this.cheque.date;
      row.due = this.cheque.due;
      row.bankName = this.cheque.bankName;
      row.value = this.cheque.value;
      row.explanation = this.cheque.explanation;
      this.cheque = {};
      $("#submit-cheque-modal").modal("hide");
    },
    async submitCheque(item) {
      let cheque = item.cheque;
      cheque.account = this.transaction.account;
      cheque.floatAccount = this.transaction.floatAccount;
      if (!cheque.id) {
        await this.storeCheque(item);
        console.log("create cheque");
      }
      let update = false;
      if (cheque.statusChanges && cheque.statusChanges.length == 1)
        update = true;

      console.log("change cheque status");
      return this.request({
        url: this.endpoint("cheques/cheques/changeStatus/" + cheque.id),
        data: {
          cheque: this.extractIds(cheque),
          statusChange: {},
          update: update
        },
        method: "put",
        success: data => {
          this.log("Cheque submitd");
        }
      });
    },
    storeCheque(item) {
      return this.request({
        url: this.endpoint("cheques/cheques/"),
        data: this.extractIds(item.cheque),
        method: "post",
        success: data => {
          item.cheque.id = data.id;
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
.submit-tcheque {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>

