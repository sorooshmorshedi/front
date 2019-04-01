<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <form-header
            :formName="type.label"
            :title="'ثبت ' + type.label"
            :ListRouteParams="{form: 'transaction', type: type.name}"
            :exportParams="{id: this.id}"
            @clearForm="clearTransaction"
          ></form-header>

          <div class="row">
            <div class="col-lg-8">
              <div class="row">
                <div class="form-group col-lg-3 col-sm-2">
                  <label>شماره {{ type.label }}</label>
                  <input
                    v-if="transaction.id"
                    type="text"
                    class="form-control"
                    disabled
                    v-model="transaction.code"
                  >
                  <input v-else type="text" class="form-control" disabled :value="transactionCode">
                </div>
                <div class="form-group col-lg-5 col-sm-3">
                  <div class="row">
                    <div class="col-lg-8">
                      <label>کد - نام مشتری</label>
                      <multiselect
                        dir="rtl"
                        :options="transactionAccounts"
                        v-model="transaction.account"
                        track-by="id"
                        label="title"
                        :disabled="!editable"
                      />
                    </div>
                    <div class="col-lg-4">
                      <button
                        style="margin-top:27px"
                        type="button"
                        class="btn btn-info btn-block"
                        :disabled="!transaction.account"
                        @click="openLedger(transaction.account)"
                      >مشاهده دفتر</button>
                    </div>
                  </div>
                </div>
                <div class="form-group col-lg-4 col-sm-3">
                  <template v-if="transaction.account && transaction.account.floatAccountGroup">
                    <label>حساب شناور</label>
                    <multiselect
                      dir="rtl"
                      :options="transactionFloatAccounts"
                      v-model="transaction.floatAccount"
                      track-by="id"
                      label="name"
                      :disabled="!editable"
                    />
                  </template>
                </div>
                <div class="form-group col-lg-3 col-sm-2">
                  <label>تاریخ</label>
                  <date
                    class="form-control"
                    v-model="transaction.date"
                    default="1"
                    :disabled="!editable"
                  />
                </div>
                <div class="form-group col-lg-3 col-sm-2">
                  <label>تاریخ راس</label>
                  <date class="form-control" disabled/>
                </div>
                <div class="col-lg-3 d-print-none">
                  <button
                    data-toggle="modal"
                    data-target="#factors-modal"
                    style="margin-top:27px"
                    type="button"
                    name
                    id
                    class="btn btn-info"
                  >پرداخت شده برای فاکتور های</button>
                </div>
                <div class="col-lg-3" v-if="transaction.sanad">
                  <label>شماره سند</label>
                  <div class="input-group">
                    <input type="text" class="form-control" disabled :value="transaction.sanad">
                    <div class="input-group-prepend">
                      <button
                        @click="openSanad(transaction.sanad)"
                        class="btn btn-outline-info"
                        type="button"
                        id="button-addon1"
                      >مشاهده سند</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group col-lg-4">
              <label>توضیحات {{ type.label }}</label>
              <textarea
                class="form-control"
                rows="5"
                v-model="transaction.explanation"
                :disabled="!editable"
              ></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th style="width: 200px">نوع {{ type.label }}</th>
                      <th>نام حساب</th>
                      <th>حساب شناور</th>
                      <th>مبلغ</th>
                      <th>شماره مستند</th>
                      <th>تاریخ {{ type.label }}</th>
                      <th>سررسید</th>
                      <th>نام بانک</th>
                      <th>توضیح</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(row,i) in rows"
                      :key="i"
                      :class="{'d-print-none': i == rows.length-1}"
                    >
                      <td>{{ i+1 }}</td>
                      <td>
                        <multiselect
                          :disabled="!editable || hasCheque(row)"
                          dir="rtl"
                          :options="accountsSelectValues.defaultAccounts.filter(o => o.usage && o.usage.toLowerCase().includes(type.name))"
                          v-model="rows[i].type"
                          track-by="id"
                          label="name"
                        />
                        <button
                          v-if="isChequeType(row) && !hasCheque(row)"
                          @click="openSubmitChequeModal(row, i)"
                          type="button"
                          class="submit-tcheque btn btn-secondary btn-sm btn-block"
                          :disabled="!editable"
                        >ثبت چک</button>
                      </td>
                      <td>
                        <span v-if="rows[i].type">{{ rows[i].type.account.title }}</span>
                      </td>
                      <td>
                        <multiselect
                          dir="rtl"
                          v-if="rows[i].type && rows[i].type.account.floatAccountGroup"
                          :options="rows[i].type.account.floatAccountGroup.floatAccounts"
                          v-model="rows[i].floatAccount"
                          track-by="id"
                          label="name"
                          :disabled="!editable"
                        />
                      </td>
                      <td>
                        <money
                          :disabled="!editable || isChequeType(row)"
                          class="form-control"
                          v-model="rows[i].value"
                        />
                      </td>
                      <td>
                        <input
                          :disabled="!editable || isChequeType(row)"
                          type="text"
                          class="form-control"
                          v-model="rows[i].documentNumber"
                        >
                      </td>
                      <td>
                        <date
                          :disabled="!editable || isChequeType(row)"
                          default="1"
                          class="form-control"
                          v-model="rows[i].date"
                        />
                      </td>
                      <td>
                        <date class="form-control" disabled v-model="rows[i].due"/>
                      </td>
                      <td>
                        <input
                          :disabled="!editable || !hasBank(row)"
                          type="text"
                          class="form-control form-control"
                          v-model="rows[i].bankName"
                        >
                      </td>
                      <td>
                        <input
                          :disabled="!editable || isChequeType(row)"
                          type="text"
                          class="form-control form-control"
                          v-model="rows[i].explanation"
                        >
                      </td>
                      <td class="d-print-none">
                        <button
                          v-if="i != rows.length-1 && !hasCheque(row)"
                          :disabled="!editable"
                          @click="deleteRow(i)"
                          type="button"
                          class="btn btn-sm btn-warning"
                        >حذف ردیف</button>
                      </td>
                    </tr>
                    <tr></tr>
                    <tr class="bg-info text-white">
                      <td colspan="2"></td>
                      <td class="text-left">مجموع:</td>
                      <td class>{{ sum | toMoney }}</td>
                      <td colspan="6"></td>
                      <td class="d-print-none">
                        <button
                          @click="deleteRow(0)"
                          type="button"
                          class="btn btn-sm btn-danger"
                          :disabled="!editable"
                        >حذف همه ردیف ها</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <form-footer
            :hasFirst="hasFirst"
            :hasLast="hasLast"
            :hasPrev="hasPrev"
            :hasNext="hasNext"
            :formName="type.label"
            :editable="editable"
            @goToForm="goToForm"
            @validate="validate"
            @edit="makeFormEditable()"
          />
        </div>
      </div>
    </div>

    <div class="modal fade" id="factors-modal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">فاکتور های پرداخت نشده</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12">
                <div class="table-responsive">
                  <table class="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>شماره فاکتور</th>
                        <th>نوع فاکتور</th>
                        <th>توضیحات</th>
                        <th>تاریخ</th>
                        <th>جمع فاکتور</th>
                        <th>پرداختی قبلی</th>
                        <th v-if="!editable">پرداختی فعلی</th>
                        <th>مانده</th>
                        <th v-if="editable">پرداختی فعلی</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(f,i) in factors" :key="i">
                        <td>{{ f.code }}</td>
                        <td>{{ factorTypes[f.type] }}</td>
                        <td>{{ f.explanation }}</td>
                        <td>{{ f.date }}</td>
                        <td>{{ f.sum | toMoney }}</td>
                        <td>{{ f.prevPaidValue | toMoney }}</td>
                        <td v-if="!editable">{{ f.payment.value | toMoney }}</td>
                        <td>{{ f.remain | toMoney }}</td>
                        <td v-if="editable">
                          <money
                            class="form-control"
                            type="text"
                            v-model="f.payment.value"
                            @input="validatePaidValue(f)"
                            :disabled="!editable"
                          />
                        </td>
                        <td>
                          <button
                            @click="openFactor(f)"
                            class="btn btn-outline-info"
                            type="button"
                            id="button-addon1"
                          >مشاهده فاکتور</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              :disabled="!isPaymentsValid"
              type="button"
              class="btn btn-info w-100px"
              data-dismiss="modal"
            >تایید</button>
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
                  <label for>سریال چک</label>
                  <input
                    v-if="cheque.type == 'received'"
                    type="number"
                    class="form-control"
                    v-model="cheque.serial"
                  >
                  <multiselect
                    v-else
                    dir="rtl"
                    label="title"
                    track-by="id"
                    :options="chequesSelectValues.cheques.filter(o => o.status == 'blank')"
                    v-model="cheque"
                  />
                </div>
                <div class="form-group col-12 col-md-6">
                  <label v-if="cheque.type == 'paid'">دریافت کننده</label>
                  <label v-else>پرداخت کننده</label>
                  <multiselect
                    disabled
                    dir="rtl"
                    label="name"
                    track-by="id"
                    :options="accountsSelectValues.levels[3]"
                    :value="transaction.account"
                  />
                </div>
                <div
                  class="form-group col-12 col-md-6 offset-md-6"
                  v-if="transaction.account && transaction.account.floatAccountGroup"
                >
                  <label for>حساب شناور</label>
                  <multiselect
                    disabled
                    dir="rtl"
                    label="name"
                    track-by="id"
                    :options="transaction.account.floatAccountGroup.floatAccounts"
                    v-model="transaction.floatAccount"
                  />
                </div>
                <div class="form-group col-12 col-md-6">
                  <label for>مبلغ</label>
                  <money class="form-control" v-model="cheque.value"/>
                </div>
                <div class="form-group col-12 col-md-3">
                  <label for>تاریخ سررسید</label>
                  <date class="form-control" v-model="cheque.due" :default="true"/>
                </div>
                <div class="form-group col-12 col-md-3">
                  <label v-if="cheque.type == 'paid'">تاریخ پرداخت</label>
                  <label v-else>تاریخ دریافت</label>
                  <date class="form-control" v-model="cheque.date" :default="true"/>
                </div>
                <div class="col-12 col-md-6">
                  <div class="row">
                    <div class="form-group col-12" v-if="cheque.type == 'received'">
                      <label for>نوع چک</label>
                      <multiselect dir="rtl" label="name" track-by="id" :options="[]"/>
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
                      <label for>نام بانک</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="cheque.bankName"
                        :disabled="cheque.type == 'paid'"
                      >
                    </div>
                    <div class="form-group col-12 col-md-4">
                      <label for>نام شعبه</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="cheque.branchName"
                        :disabled="cheque.type == 'paid'"
                      >
                    </div>
                    <div class="form-group col-12 col-md-4">
                      <label for>شماره حساب چک</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="cheque.accountNumber"
                        :disabled="cheque.type == 'paid'"
                      >
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
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import _ from "lodash";
export default {
  name: "Form",
  components: { money, date },
  mixins: [formsMixin, accountApiMixin, sanadApiMixin, chequeMixin],
  props: ["transactionType", "id", "accountId", "factorId"],
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
      chequeRowIndex: null,
      factors: [],
      factorTypes: {
        buy: "خرید",
        sale: "فروش",
        backFromBuy: "برگشت از خرید",
        backFromSale: "برگشت از فروش"
      },
      d: {
        getNotPaidFactors: null
      }
    };
  },
  created() {
    this.d.getNotPaidFactors = _.debounce(this.getNotPaidFactors, 1000, {});
    this.initForm();
  },
  computed: {
    hasFirst() {
      if (this.transactionCode == 1) return false;
      return true;
    },
    hasNext() {
      if (this.transaction.code == this.transactionCode - 1) return false;
      if (!this.id) return false;
      return true;
    },
    hasPrev() {
      if (this.transaction.code == 1) return false;
      return true;
    },
    hasLast() {
      if (this.transactionCode == 1) return false;
      return true;
    },
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
      return this.accountsSelectValues.persons;
    },
    transactionFloatAccounts() {
      if (
        this.transaction.account &&
        this.transaction.account.floatAccountGroup
      ) {
        return this.transaction.account.floatAccountGroup.floatAccounts;
      }
      return [];
    },
    isPaymentsValid() {
      let sum = 0;
      for (const factor of this.factors) {
        sum += +factor.payment.value;
      }
      return sum <= this.sum;
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
    transactionType(a, b) {
      this.initForm();
    },
    id() {
      this.getTransaction(this.id);
    },
    "transaction.account"() {
      if (this.transaction.account) this.d.getNotPaidFactors();
    }
  },
  methods: {
    initForm() {
      this.log("Init Transaction Form");
      if (!this.id) {
        this.rows = [{}];
        this.transaction = this.getTransactionTemplate();
        this.factors = [];
      }
      if (this.transactionType == "receive") {
        this.type.label = "دریافت";
        this.type.name = "receive";
        this.type.chequeType = "received";
      } else if (this.transactionType == "payment") {
        this.type.label = "پرداخت";
        this.type.name = "payment";
        this.type.chequeType = "paid";
      } else {
        console.error("404");
      }
      this.getData();
    },
    validatePaidValue(factor) {
      let paymentValue = +factor.payment.value;
      if (paymentValue < 0) {
        factor.payment.value = 0;
      } else if (paymentValue > 0) {
        let remain = +factor.remain
        let oldPayments = 0;
        factor.payments.forEach(payment => {
          if (payment.transaction == this.transaction.id)
            oldPayments += +payment.value;
        });
        if (paymentValue - oldPayments > remain)
          this.$nextTick(() => (factor.payment.value = remain + oldPayments));
      }
    },
    goToForm(pos) {
      let newCode = null;
      switch (pos) {
        case "next":
          newCode = this.transaction.code + 1;
          break;
        case "prev":
          newCode = this.transaction.code
            ? this.transaction.code - 1
            : this.transactionCode - 1;
          break;
        case "first":
          newCode = 1;
          break;
        case "last":
          newCode = this.transactionCode - 1;
          break;
      }
      if (newCode) this.getTransactionByCode(newCode);
    },
    getData() {
      Promise.all([
        this.getAccounts(),
        this.getDefaultAccounts(),
        this.getChequebooks(),
        this.getTransaction(this.id),
        this.getTransactionCodes()
      ]).then(values => {
        if (this.accountId) this.selectAccount(this.accountId);
      });
    },
    selectAccount(accountId) {
      this.log("Select Account : ", accountId);
      let account = this.transactionAccounts.filter(o => o.id == accountId)[0];
      this.transaction.account = account;
    },
    selectNotPaidFactor(factorId) {
      let factor = this.factors.filter(o => o.id == factorId);
      if (factor.length) factor = factor[0];
      else {
        console.error("Factor Not Found");
        return;
      }
      this.transaction.floatAccount = factor.floatAccount;
      let value = factor.sum - factor.paidValue;
      this.rows[0].value = value;
      this.rows.push({});
      factor.payment.value = value;
    },
    getNotPaidFactors() {
      if (this.id) this.transaction.id = this.id;
      return this.request({
        url: this.endpoint("factors/notPaidFactors"),
        method: "get",
        params: {
          transactionType: this.type.name,
          transactionId: this.transaction.id,
          accountId: this.transaction.account.id
        },
        success: data => {
          this.factors = [];
          for (let factor of data) {
            factor.prevPaidValue = factor.paidValue;
            factor.remain = +factor.sum - +factor.paidValue;

            let payment = [];
            if (this.transaction.id) {
              payment = factor.payments.filter(p => {
                return p.transaction == this.transaction.id;
              });
            }

            if (payment.length) {
              payment = payment[0];
              factor.payment = this.copy(payment);
              factor.prevPaidValue -= payment.value;
            } else {
              factor.payment = {
                value: 0,
                factor: factor.id
              };
            }
            this.factors.push(factor);
          }
          if (this.factorId) this.selectNotPaidFactor(this.factorId);
        }
      });
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
    getTransactionByCode(code) {
      let url = "sanads/transactions/getTransactionByCode";
      return this.request({
        url: this.endpoint(url),
        method: "get",
        params: { type: this.transactionType, code },
        success: data => {
          this.selectTransaction(data, true);
        }
      });
    },
    selectTransaction(transaction, redirect = false) {
      if (redirect) {
        this.makeFormUneditable();
        this.$router.push({
          name: "TransactionForm",
          params: { id: transaction.id, transactionType: this.transactionType }
        });
      }
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
    validate(clearTransaction) {
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

      let sum = 0;
      this.factors.forEach(factor => {
        sum += +factor.payment.value;
      });
      if (sum != 0 && sum > this.sum) {
        this.notify(
          "مبلغ وارد شده برای فاکتور های پرداختی باید کمتر و یا مساوری مجموع ردیف ها باشد",
          "danger"
        );
        isValid = false;
      }

      if (!isValid) return;

      if (this.transaction.id) this.updateTransaction(clearTransaction);
      else this.storeTransaction(clearTransaction);
    },
    storeTransaction(clearTransaction) {
      let data = this.extractIds(this.transaction);
      data.code = this.transactionCode;
      data.type = this.type.name;
      this.request({
        url: this.endpoint("sanads/transactions"),
        method: "post",
        data: data,
        success: data => {
          this.transaction.id = data.id;
          this.syncTransactionItems(clearTransaction);
        }
      });
    },
    updateTransaction(clearTransaction) {
      let data = this.extractIds(this.transaction);
      this.request({
        url: this.endpoint("sanads/transactions/" + this.transaction.id),
        method: "put",
        data: data,
        success: data => {
          this.transaction.id = data.id;
          this.syncTransactionItems(clearTransaction);
        }
      });
    },
    async syncTransactionItems(clearTransaction) {
      let updatedItems = [];
      let newItems = [];
      let updatedPayments = [];
      let newPayments = [];

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

      this.factors.forEach(factor => {
        let payment = factor.payment;
        payment.transaction = this.transaction.id;
        if (payment.id) updatedPayments.push(payment);
        else if (payment.value != 0) newPayments.push(payment);
      });

      this.log("start syncing transaction");

      Promise.all([
        this.storeTransactionItems(newItems),
        this.updateTransactionItems(updatedItems),
        this.deleteTransactionItems(),
        this.storePayments(newPayments),
        this.updatePayments(updatedPayments)
      ]).then(data => {
        this.getChequebooks(true);
        this.getTransactionCodes();
        this.getNotPaidFactors();
        if (clearTransaction) {
          this.clearTransaction();
        } else {
          this.makeFormUneditable();
          this.$router.push({
            name: "TransactionForm",
            params: {
              id: this.transaction.id,
              transactionType: this.transactionType
            }
          });
        }
        this.successNotify();
      });
    },
    storePayments(items) {
      if (!items.length) return;
      return this.request({
        url: this.endpoint("factors/factorPayments/mass"),
        method: "post",
        data: items,
        success: data => {
          this.log(items.length + " factor payments created");
        }
      });
    },
    updatePayments(items) {
      if (!items.length) return;
      return this.request({
        url: this.endpoint("factors/factorPayments/mass"),
        method: "put",
        data: items,
        success: data => {
          this.log(items.length + " factor payments updated");
        }
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
    hasBank(row) {
      if (this.isChequeType(row)) return false;
      if (row.type && row.type.programingName == "cash") return false;
      return true;
    },
    isChequeType(row) {
      return (
        row.type &&
        row.type.programingName &&
        row.type.programingName.includes("Cheque")
      );
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
      }
      let update = false;
      if (cheque.statusChanges && cheque.statusChanges.length == 1)
        update = true;
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
        data: {
          ...this.extractIds(item.cheque),
          has_transaction: true
        },
        method: "post",
        success: data => {
          item.cheque.id = data.id;
        }
      });
    },
    clearTransaction() {
      this.log("Clear Transaction");
      this.$router.push({
        name: "TransactionForm",
        params: {
          transactionType: this.transactionType
        }
      });
      this.rows = [{}];
      this.transaction = this.getTransactionTemplate();
      this.factors = [];
    },
    getTransactionTemplate() {
      return {
        account: null,
        floatAccount: null
      };
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

