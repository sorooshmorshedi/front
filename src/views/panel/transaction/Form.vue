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
          >
              <button
                data-toggle="modal"
                data-target="#factors-modal"
                type="button"
                class="btn btn-info"
              >پرداخت شده برای فاکتور های</button>
          </form-header>

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
                <div class="form-group col-lg-3 col-sm-2">
                  <label class="required">تاریخ</label>
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
                <div class="form-group col-lg-3">
                  <label>شماره سند</label>
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      v-model="transaction.sanad_code"
                      :disabled="transaction.id"
                    >
                    <div class="input-group-prepend">
                      <button
                        @click="openSanad(transaction.sanad)"
                        :disabled="!transaction.sanad"
                        class="btn btn-outline-info"
                        type="button"
                        id="button-addon1"
                      >مشاهده سند</button>
                    </div>
                  </div>
                </div>
                <div class="form-group col-lg-6 col-sm-3">
                  <div class="row">
                    <div class="col-lg-8">
                      <label class="required">کد - نام مشتری</label>
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
                        type="button"
                        class="btn btn-info btn-block label-margin"
                        :disabled="!transaction.account"
                        @click="openLedger(transaction.account)"
                      >مشاهده دفتر</button>
                    </div>
                  </div>
                </div>
                <div class="form-group col-lg-3 col-sm-3">
                  <template v-if="transaction.account && transaction.account.floatAccountGroup">
                    <label class="required">حساب شناور</label>
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
                <div class="form-group col-lg-3 col-sm-3">
                  <template v-if="transaction.account && transaction.account.costCenterGroup">
                    <label class="required">مرکز هزینه</label>
                    <multiselect
                      dir="rtl"
                      :options="transactionCostCenters"
                      v-model="transaction.costCenter"
                      track-by="id"
                      label="name"
                      :disabled="!editable"
                    />
                  </template>
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
                      <th class="required" style="width: 200px">نوع {{ type.label }}</th>
                      <th>نام حساب</th>
                      <th class="required">حساب شناور</th>
                      <th class="required">مرکز هزینه</th>
                      <th class="required">مبلغ</th>
                      <th>شماره مستند</th>
                      <th class="required">تاریخ {{ type.label }}</th>
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
                        <multiselect
                          dir="rtl"
                          v-if="rows[i].type && rows[i].type.account.costCenterGroup"
                          :options="rows[i].type.account.costCenterGroup.floatAccounts"
                          v-model="rows[i].costCenter"
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
                        <router-link
                          v-if="hasCheque(row) && row.cheque.id"
                          class="btn btn-sm btn-info"
                          :to="{name:'ChequeDetail', params:{id: row.cheque.id}}"
                          target="_blank"
                        >مشاهده جزئیات چک</router-link>
                      </td>
                    </tr>
                    <tr></tr>
                    <tr class="bg-info text-white">
                      <td colspan="3"></td>
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
            :deletable="true"
            @goToForm="goToForm"
            @validate="validate"
            @edit="makeFormEditable()"
            @delete="deleteTransaction()"
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
            <button @click="splitValue(true)" type="button" class="btn btn-info">سرشکن کردن از پایین</button>
            <button @click="splitValue()" type="button" class="btn btn-info">سرشکن کردن از بالا</button>
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
              <span v-if="this.transactionType == 'payment'">پرداختی</span>
              <span v-else>دریافتی</span>
            </h4>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <cheque-form
              :receivedOrPaid="transactionType[0]"
              :modalMode="true"
              :account="transaction.account"
              :floatAccount="transaction.floatAccount"
              :costCenter="transaction.costCenter"
              @submit="addCheque"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import sanadApiMixin from "@/mixin/sanadApi";
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import _ from "lodash";

import ChequeForm from "../cheque/ChequeForm.vue";

export default {
  name: "Form",
  components: { ChequeForm, money, date },
  mixins: [formsMixin, accountApiMixin, sanadApiMixin],
  props: ["transactionType", "id", "accountId", "factorId"],
  data() {
    return {
      transaction: {},
      rows: [],
      type: {
        label: "",
        name: "",
        chequeType: ""
      },
      itemsToDelete: [],
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
      },
      rowTemplate: {
        value: 0
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
      return this.accountsSelectValues.levels[3];
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
    transactionCostCenters() {
      if (
        this.transaction.account &&
        this.transaction.account.costCenterGroup
      ) {
        return this.transaction.account.costCenterGroup.floatAccounts;
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
          this.rows.push(this.copy(this.rowTemplate));
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
        this.rows = [this.copy(this.rowTemplate)];
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
        let remain = +factor.remain;
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
      this.transaction.costCenter = factor.costCenter;
      let value = factor.sum - factor.paidValue;
      this.rows[0].value = value;
      this.rows.push(this.copy(this.rowTemplate));
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
      this.rows.push(this.copy(this.rowTemplate));
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
    getSerialized() {
      let data = {};

      data.transaction = this.extractIds(this.transaction);
      data.transaction.code = this.transactionCode;
      data.transaction.type = this.type.name;

      data.items = {
        items: [],
        ids_to_delete: this.itemsToDelete
      };
      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return row;
        let item = this.copy(row);

        if (!item.id) {
          item.account = item.type.account;
        }

        if (item.cheque) {
          item.cheque = this.extractIds(item.cheque);
        }

        data.items.items.push(this.extractIds(item, "cheque"));
      });

      data.payments = {
        items: [],
        ids_to_delete: []
      };
      this.factors.forEach(factor => {
        let payment = factor.payment;
        data.payments.items.push(payment);
      });

      return data;
    },
    setTransaction(transaction) {
      this.makeFormUneditable();
      this.$router.push({
        name: "TransactionForm",
        params: {
          id: transaction.id,
          transactionType: this.transactionType
        }
      });
    },
    storeTransaction(clearTransaction) {
      this.request({
        url: this.endpoint("sanads/transactions"),
        method: "post",
        data: this.getSerialized(),
        success: data => {
          if (clearTransaction) {
            this.clearTransaction();
          } else {
            this.setTransaction(data);
          }
          this.successNotify();
        }
      });
    },
    updateTransaction(clearTransaction) {
      let data = this.getSerialized();
      this.request({
        url: this.endpoint("sanads/transactions/" + this.transaction.id),
        method: "put",
        data: data,
        success: data => {
          if (clearTransaction) {
            this.clearTransaction();
          } else {
            this.setTransaction(data);
          }
          this.successNotify();
        }
      });
    },
    deleteTransaction(clearTransaction) {
      this.request({
        url: this.endpoint("sanads/transactions/" + this.transaction.id),
        method: "delete",
        success: data => {
          this.successNotify();
          this.getTransactionCodes();
          this.clearTransaction();
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
      return row.cheque;
    },
    openSubmitChequeModal(row, i) {
      let account = this.transaction.account;
      if (!account) {
        this.notify(`ابتدا حساب را انتخاب کنید`, "danger");
        return;
      }
      if (account.floatAccountGroup && !this.transaction.floatAccount) {
        this.notify(`لطفا حساب شناور را انتخاب کنید`, "danger");
        return;
      }
      if (account.costCenterGroup && !this.transaction.costCenter) {
        this.notify(`لطفا مرکز هزینه را انتخاب کنید`, "danger");
        return;
      }
      this.chequeRowIndex = i;
      $("#submit-cheque-modal").modal("show");
    },
    addCheque(cheque) {
      console.log(cheque);
      if (!this.hasValue(cheque.serial)) {
        this.notify("لطفا سریال چک را وارد کنید", "danger");
        return;
      }
      if (!this.hasValue(cheque.value)) {
        this.notify("لطفا مبلغ چک را وارد کنید", "danger");
        return;
      }
      if (cheque.date.length != 10 || cheque.due.length != 10) {
        this.notify("لطفا تاریخ های چک را به صورت صحیح وارد کنید", "danger");
        return;
      }
      let row = this.rows[this.chequeRowIndex];
      row.cheque = cheque;
      row.value = cheque.value;
      row.documentNumber = cheque.serial;
      row.date = cheque.date;
      row.due = cheque.due;
      row.bankName = cheque.bankName;
      row.value = cheque.value;
      row.explanation = cheque.explanation;
      $("#submit-cheque-modal").modal("hide");
    },
    clearTransaction() {
      this.log("Clear Transaction");
      this.$router.push({
        name: "TransactionForm",
        params: {
          transactionType: this.transactionType
        }
      });
      this.rows = [this.copy(this.rowTemplate)];
      this.transaction = this.getTransactionTemplate();
      this.factors = [];
      this.itemsToDelete = [];
    },
    getTransactionTemplate() {
      return {
        account: null,
        floatAccount: null,
        costCenter: null
      };
    },
    splitValue(reverse = false) {
      let total = this.sum;
      let factors = [];
      let factor = {};
      for (let i = 0; i < this.factors.length; i++) {
        if (reverse) factor = this.factors[this.factors.length - i - 1];
        else factor = this.factors[i];

        if (total > 0) {
          let remain = factor.remain;
          if (total >= remain) {
            factor.payment.value = remain;
            total -= remain;
          } else {
            factor.payment.value = total;
            total = 0;
          }
        } else {
          factor.payment.value = 0;
        }
      }
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

