<template>
  <div>
    <daily-form
      :formName="type.label"
      :title="'ثبت ' + type.label"
      :ListRouteParams="{form: 'transaction', type: type.name}"
      :exportParams="{id: this.id}"
      @clearForm="clearTransaction"
      :hasFirst="hasFirst"
      :hasLast="hasLast"
      :hasPrev="hasPrev"
      :hasNext="hasNext"
      :editable="editable"
      :deletable="!modalMode && id != undefined"
      :showNavigationButtons="!modalMode"
      :showSubmitAndClearForm="!modalMode"
      @goToForm="goToForm"
      @validate="validate"
      @edit="makeFormEditable()"
      @delete="deleteTransaction()"
    >
      <template #header-btns>
        <open-sanad-btn v-if="transaction.sanad" :sanad="transaction.sanad" />
        <v-btn
          v-if="!isImprest"
          @click="factorsDialog = true"
          class="teal white--text mr-1"
        >پرداخت شده برای فاکتور های</v-btn>
      </template>

      <template #inputs>
        <v-row v-if="!modalMode">
          <v-col cols="12" md="2">
            <v-text-field :label="'شماره ' + type.label" disabled v-model="transaction.code" />
          </v-col>
          <v-col cols="12" md="2">
            <date
              label=" * تاریخ"
              v-model="transaction.date"
              :default="true"
              :disabled="!editable"
            />
          </v-col>
          <v-col cols="12" md="2">
            <date v-if="!isImprest" placeholder="تاریخ راس" disabled />
          </v-col>
          <v-col cols="12" md="6">
            <account-select
              :label="accountLabel"
              itemsType="level3"
              v-model="transaction.account"
              :disabled="modalMode || !editable"
              required
              :floatAccount="transaction.floatAccount"
              @update:floatAccount="v => transaction.floatAccount = v"
              :costCenter="transaction.costCenter"
              @update:costCenter="v => transaction.costCenter = v"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea label="توضیحات" v-model="transaction.explanation" :disabled="!editable"></v-textarea>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-simple-table>
              <thead>
                <tr>
                  <th class="tr-counter">#</th>
                  <th>* نوع {{ type.label }}</th>
                  <th>* نام حساب</th>
                  <th>* مبلغ</th>
                  <th>شماره مستند</th>
                  <th>* تاریخ {{ type.label }}</th>
                  <th>سررسید</th>
                  <th>نام بانک</th>
                  <th>توضیحات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row,i) in rows" :key="i" :class="{'d-print-none': i == rows.length-1}">
                  <td>{{ i+1 }}</td>
                  <td style="min-width: 150px">
                    <v-autocomplete
                      :disabled="!editable || hasCheque(row)"
                      :items="transactionPaymentMethods"
                      v-model="rows[i].type"
                      item-text="name"
                    />
                    <v-btn
                      v-if="isChequeType(row) && !hasCheque(row)"
                      @click="openSubmitChequeDialog(row, i)"
                      class="blue white--text mt-1"
                      block
                      :disabled="!editable"
                    >ثبت چک</v-btn>
                  </td>
                  <td class="tr-account">
                    <account-select
                      :horizontal="true"
                      v-if="rows[i].type"
                      items-type="level3"
                      v-model="rows[i].type.account"
                      :disabled="!editable"
                      :account-disabled="true"
                      :floatAccount="rows[i].floatAccount"
                      @update:floatAccount="v => rows[i].floatAccount = v"
                      :costCenter="rows[i].costCenter"
                      @update:costCenter="v => rows[i].costCenter = v"
                    />
                  </td>
                  <td>
                    <money
                      :disabled="!editable || isChequeType(row)"
                      class="form-control"
                      v-model="rows[i].value"
                    />
                  </td>
                  <td style="width: 50px">
                    <v-text-field
                      :disabled="!editable || isChequeType(row)"
                      type="text"
                      class="form-control"
                      v-model="rows[i].documentNumber"
                    />
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
                    <date class="form-control" disabled v-model="rows[i].due" />
                  </td>
                  <td>
                    <v-text-field
                      :disabled="!editable || !hasBank(row)"
                      type="text"
                      class="form-control form-control"
                      v-model="rows[i].bankName"
                    />
                  </td>
                  <td>
                    <v-text-field
                      :disabled="!editable || isChequeType(row)"
                      type="text"
                      class="form-control form-control"
                      v-model="rows[i].explanation"
                    />
                  </td>
                  <td class="d-print-none">
                    <v-btn
                      v-if="i != rows.length-1 && !hasCheque(row)"
                      :disabled="!editable"
                      @click="deleteRow(i)"
                      class="red--text"
                      icon
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                    <router-link
                      v-if="hasCheque(row) && row.cheque.id"
                      class="btn btn-sm btn-info"
                      :to="{name:'ChequeDetail', params:{id: row.cheque.id}}"
                      target="_blank"
                    >مشاهده جزئیات چک</router-link>
                  </td>
                </tr>
                <tr></tr>
                <tr class="grey lighten-3 text-white">
                  <td colspan="2"></td>
                  <td class="text-left">مجموع:</td>
                  <td class>{{ sum | toMoney }}</td>
                  <td colspan="5"></td>
                  <td class="d-print-none">
                    <v-btn @click="deleteRow(0)" icon class="red--text" :disabled="!editable">
                      <v-icon>delete_sweep</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
      </template>
    </daily-form>

    <v-dialog v-model="factorsDialog" scrollable max-width="1200px">
      <v-card>
        <v-card-title>فاکتور های پرداخت نشده</v-card-title>
        <v-card-text>
          <v-simple-table>
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
                    v-model="f.payment.value"
                    @input="validatePaidValue(f)"
                    :disabled="!editable"
                  />
                </td>
                <td>
                  <v-btn @click="openFactor(f)" class="blue white--text">
                    مشاهده فاکتور
                    <v-chip class="app-background-color mr-2" x-small>{{ f.code }}</v-chip>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="splitValue(true)"
            :disabled="!editable"
            class="blue white--text"
          >سرشکن کردن از پایین</v-btn>
          <v-btn
            @click="splitValue()"
            :disabled="!editable"
            class="blue white--text"
          >سرشکن کردن از بالا</v-btn>
          <v-btn
            :disabled="!editable || !isPaymentsValid"
            @click="factorsDialog = false"
            class="green white--text w-100px"
          >تایید</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="submitChequeDialog" scrollable max-width="1200px">
      <v-card>
        <v-card-title></v-card-title>
        <v-card-text>
          <cheque-form
            :receivedOrPaid="transactionType[0]"
            :modalMode="true"
            :account="transaction.account"
            :floatAccount="transaction.floatAccount"
            :costCenter="transaction.costCenter"
            @submit="addCheque"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import _ from "lodash";

import ChequeForm from "../cheque/ChequeForm.vue";

export default {
  name: "Form",
  components: { ChequeForm, money, date },
  mixins: [formsMixin, accountApiMixin],
  props: {
    transactionType: {},
    id: {},
    accountId: {},
    factorId: {},
    modalMode: {
      default: false
    }
  },
  data() {
    return {
      receiveCode: null,
      paymentCode: null,
      factorsDialog: false,
      submitChequeDialog: false,
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
    isImprest() {
      return this.transactionType == "imprest";
    },
    accountLabel() {
      if (this.isImprest) return "* تنخواه گردان";
      return " * کد - نام مشتری";
    },
    transactionPaymentMethods() {
      let type = this.usage == "receive" ? "receive" : "payment";
      return this.defaultAccounts.filter(
        o => o.usage && o.usage.toLowerCase().includes(type)
      );
    },
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
      } else if (this.isImprest) {
        this.type.label = "پرداخت تنخواه";
        this.type.name = "imprest";
        this.type.chequeType = "paid";
      } else {
        console.error("404");
      }
      this.getData();
    },
    getTransactionCodes() {
      this.request({
        url: this.endpoint("transactions/newCodes"),
        method: "get",
        success: data => {
          this.receiveCode = data["receive"];
          this.paymentCode = data["payment"];
        }
      });
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
      let url = "transactions/" + id;
      return this.request({
        url: this.endpoint(url),
        method: "get",
        success: data => {
          this.selectTransaction(data);
        }
      });
    },
    getTransactionByCode(code) {
      let url = "transactions/getTransactionByCode";
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

      if (this.modalMode) {
        this.$emit("submit", this.getSerialized());
      } else {
        if (this.transaction.id) this.updateTransaction(clearTransaction);
        else this.storeTransaction(clearTransaction);
      }
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
        url: this.endpoint("transactions/"),
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
        url: this.endpoint("transactions/" + this.transaction.id),
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
        url: this.endpoint("transactions/" + this.transaction.id),
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
      if (row.type && row.type.codename == "cash") return false;
      return true;
    },
    isChequeType(row) {
      return (
        row.type && row.type.codename && row.type.codename.includes("Cheque")
      );
    },
    hasCheque(row) {
      return row.cheque;
    },
    openSubmitChequeDialog(row, i) {
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
      this.submitChequeDialog = true;
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
      this.submitChequeDialog = false;
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
.submit-tcheque {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>

