<template>
  <div>
    <m-form
      :title="title"
      :showList="false"
      :listRoute="{name:'TransactionsList', params: {type: type}}"
      exportBaseUrl="reports/lists/transactions"
      :exportParams="{id: id}"
      :showNavigationButtons="!modalMode"
      :showSubmitAndClearForm="!modalMode"
      :canDelete="canDelete"
      :canSubmit="canSubmit"
      :isEditing.sync="isEditing"
      :confirmBtnText="confirmBtnText"
      :cancelConfirmBtnText="cancelConfirmBtnText"
      :canConfirm="canConfirm"
      :canCancelConfirm="canCancelConfirm"
      @cancelConfirm="cancelConfirm"
      @confirm="confirm"
      @clearForm="clearForm"
      @goToForm="getItemByPosition"
      @submit="validate"
      @delete="deleteItem"
    >
      <template #header-btns>
        <open-sanad-btn v-if="item.sanad" :sanad="item.sanad" />
        <v-btn
          v-if="isImprest && id != undefined && hasPerm('', 'imprestSettlement')"
          class="blue white--text mr-1 mt-1 mt-md-0"
          :to="{name: 'ImprestSettlement', params: {id: item.id}}"
        >تسویه تنخواه</v-btn>
        <v-btn
          v-if="!isImprest"
          @click="factorsDialog = true"
          class="teal white--text mr-1 mt-1 mt-md-0"
        >پرداخت شده برای فاکتور های</v-btn>
      </template>

      <template>
        <v-row v-if="!modalMode">
          <v-col cols="12" md="2">
            <v-text-field label="شماره" disabled v-model="item.code" />
          </v-col>
          <v-col cols="12" md="2">
            <date label=" * تاریخ" v-model="item.date" :default="true" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="2">
            <date v-if="type == 'payment'" placeholder="تاریخ راس" disabled />
          </v-col>
          <v-col cols="12" md="6">
            <account-select
              :label="accountLabel"
              :itemsType="accountsType"
              v-model="item.account"
              :disabled="modalMode || !isEditing"
              required
              :floatAccount="item.floatAccount"
              @update:floatAccount="v => item.floatAccount = v"
              :costCenter="item.costCenter"
              @update:costCenter="v => item.costCenter = v"
            />
          </v-col>
          <v-col cols="12" md="8">
            <v-textarea label="شرح" v-model="item.explanation" :disabled="!isEditing"></v-textarea>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-if="item.created_by"
              label="کاربر"
              disabled
              v-model="item.created_by.name"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <input-table v-model="rows">
              <template #thead>
                <tr>
                  <th class="tr-counter">#</th>
                  <th>* نوع {{ title }}</th>
                  <th>* نام حساب</th>
                  <th>* مبلغ</th>
                  <th>شماره پیگیری</th>
                  <th>* تاریخ {{ title }}</th>
                  <th>سررسید</th>
                  <th>نام بانک</th>
                  <th>شرح ردیف</th>
                </tr>
              </template>
              <template #tbody>
                <tr v-for="(row,i) in rows" :key="i" :class="{'d-print-none': i == rows.length-1}">
                  <td>{{ i+1 }}</td>
                  <td style="min-width: 150px" :title="rows[i].type && rows[i].type.name">
                    <v-autocomplete
                      :return-object="true"
                      :disabled="!isEditing || hasCheque(row)"
                      :items="itemPaymentMethods"
                      v-model="rows[i].type"
                      item-text="name"
                      item-value="id"
                    />
                    <v-btn
                      v-if="isChequeType(row) && !hasCheque(row)"
                      @click="openSubmitChequeDialog(row, i)"
                      class="blue white--text mt-1"
                      block
                      :disabled="!isEditing"
                    >ثبت چک</v-btn>
                  </td>
                  <td class="tr-account">
                    <account-select
                      :horizontal="true"
                      v-if="rows[i].type"
                      items-type="level3"
                      v-model="rows[i].type.account"
                      :disabled="!isEditing"
                      :account-disabled="true"
                      :floatAccount="rows[i].floatAccount"
                      @update:floatAccount="v => rows[i].floatAccount = v"
                      :costCenter="rows[i].costCenter"
                      @update:costCenter="v => rows[i].costCenter = v"
                    />
                  </td>
                  <td>
                    <money
                      :disabled="!isEditing || isChequeType(row)"
                      class="form-control"
                      v-model="rows[i].value"
                    />
                  </td>
                  <td style="width: 100px" :title="rows[i].documentNumber">
                    <v-text-field
                      :disabled="!isEditing || isChequeType(row)"
                      type="text"
                      class="form-control"
                      v-model="rows[i].documentNumber"
                    />
                  </td>
                  <td>
                    <date
                      :disabled="!isEditing || isChequeType(row)"
                      default="1"
                      v-model="rows[i].date"
                    />
                  </td>
                  <td>
                    <date disabled v-model="rows[i].due" />
                  </td>
                  <td>
                    <v-text-field
                      :disabled="!isEditing || !hasBank(row)"
                      type="text"
                      class="form-control form-control"
                      v-model="rows[i].bankName"
                    />
                  </td>
                  <td style="min-width: 120px">
                    <row-textarea
                      v-model="rows[i].explanation"
                      :disabled="!isEditing || isChequeType(row)"
                      :i="i"
                      @updateRowsExplanation="updateRowsExplanation"
                    />
                  </td>
                  <td class="d-print-none">
                    <v-btn
                      v-if="i != rows.length-1 && !hasCheque(row)"
                      :disabled="!isEditing"
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
                  <td class>{{ rowsSum('value') | toMoney }}</td>
                  <td colspan="5"></td>
                  <td class="d-print-none">
                    <v-btn @click="deleteRow(-1)" icon class="red--text" :disabled="!isEditing">
                      <v-icon>delete_sweep</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </input-table>
          </v-col>
        </v-row>
      </template>
    </m-form>

    <v-dialog v-model="factorsDialog" scrollable max-width="1200px" :persistent="isEditing">
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
                <th v-if="!isEditing">پرداختی فعلی</th>
                <th>مانده</th>
                <th v-if="isEditing">پرداختی فعلی</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(f,i) in factors" :key="i">
                <td>{{ f.code }}</td>
                <td>{{ factorTypes[f.type] }}</td>
                <td>{{ f.explanation }}</td>
                <td>{{ f.date }}</td>
                <td>{{ f.total_sum | toMoney }}</td>
                <td>{{ f.previous_paid_value | toMoney }}</td>
                <td v-if="!isEditing">{{ f.payment.value | toMoney }}</td>
                <td>{{ f.remain | toMoney }}</td>
                <td v-if="isEditing">
                  <money v-model="f.payment.value" :disabled="!isEditing" />
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
            :disabled="!isEditing"
            class="blue white--text"
          >سرشکن کردن از پایین</v-btn>
          <v-btn
            @click="splitValue()"
            :disabled="!isEditing"
            class="blue white--text"
          >سرشکن کردن از بالا</v-btn>
          <v-btn @click="validatePaidValues" class="green white--text w-100px">تایید</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="submitChequeDialog" scrollable max-width="1200px">
      <v-card>
        <v-card-text>
          <cheque-form
            ref="chequeForm"
            :receivedOrPaid="type[0]"
            :modalMode="true"
            :account="item.account"
            :floatAccount="item.floatAccount"
            :costCenter="item.costCenter"
            @submit="addCheque"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import _ from "lodash";

import ChequeForm from "../cheque/ChequeForm.vue";

export default {
  name: "TransactionForm",
  components: { ChequeForm, money, date },
  mixins: [MFormMixin, accountApiMixin],
  props: {
    type: {
      required: true,
    },
    id: {},
    accountId: {},
    modalMode: {
      default: false,
    },
  },
  data() {
    return {
      baseUrl: "transactions",
      leadingSlash: true,
      hasList: false,
      hasIdProp: true,
      rowKey: "type",
      factorsDialog: false,
      submitChequeDialog: false,
      item: {},
      rows: [],
      itemsToDelete: [],
      chequeRowIndex: null,
      factors: [],
      factorTypes: {
        buy: "خرید",
        sale: "فروش",
        backFromBuy: "برگشت از خرید",
        backFromSale: "برگشت از فروش",
      },
    };
  },
  created() {
    this.getDefaultAccounts();
  },
  computed: {
    accountsType() {
      if (this.isImprest) return "imprests";
      return "level3";
    },
    title() {
      if (this.type == "receive") {
        return "دریافت";
      } else if (this.type == "payment") {
        return "پرداخت";
      } else if (this.isImprest) {
        return "پرداخت تنخواه";
      }
    },
    permissionBasename() {
      return `${this.type}Transaction`;
    },
    isImprest() {
      return this.type == "imprest";
    },
    accountLabel() {
      if (this.isImprest) return "* تنخواه گردان";
      return " * کد - نام حساب";
    },
    itemPaymentMethods() {
      let type = this.type == "receive" ? "receive" : "payment";
      return this.defaultAccounts.filter(
        (o) => o.usage && o.usage.toLowerCase().includes(type)
      );
    },
    itemAccounts() {
      return this.accountsSelectValues.levels[3];
    },
    isPaymentsValid() {
      let sum = 0;
      for (const factor of this.factors) {
        sum += +factor.payment.value;
      }
      return sum <= this.rowsSum("value");
    },
  },
  watch: {
    "item.account"() {
      if (this.item.account && this.item.account.id) this.getNotPaidFactors();
    },
  },
  methods: {
    validatePaidValues() {
      if (this.isEditing) {
        let totalPaymentValue = 0;

        for (let factor of this.factors) {
          let paymentValue = +factor.payment.value;
          totalPaymentValue += paymentValue;

          if (paymentValue + +factor.previous_paid_value > +factor.total_sum) {
            this.notify(
              `پرداختی فعلی فاکتور شماره ${factor.code} بیشتر از مانده آن است.`,
              "danger"
            );
            return;
          }
        }

        if (totalPaymentValue > this.rowsSum("value")) {
          this.notify(
            `جمع کل مبلغ پرداختی فاکتور ها بیشتر از جمع ${this.title} است`,
            "danger"
          );
          return;
        }
      }

      this.factorsDialog = false;
    },
    selectNotPaidFactor(factorIds) {
      let totalValue = 0;
      for (let factorId of factorIds) {
        let factor = this.factors.find((o) => o.id == factorId);
        if (factor) {
          let value = factor.remain;
          this.rows.push(this.getRowTemplate());
          factor.payment.value = value;
          totalValue += value;
        } else {
          console.error("Factor Not Found : ", factorId);
        }
        this.rows[0].value = totalValue;
      }
    },
    getNotPaidFactors() {
      if (this.item.account && this.item.account.id) {
        if (this.id) this.item.id = this.id;
        this.request({
          url: this.endpoint("transactions/factors"),
          method: "get",
          params: {
            transaction_type: this.type,
            transaction_id: this.item.id,
            account_id: this.item.account.id,
            floatAccount_id:
              this.item.floatAccount && this.item.floatAccount.id,
            costCenter_id: this.item.costCenter && this.item.costCenter.id,
          },
          success: (data) => {
            this.factors = data;
            let factorIds = this.urlQuery.factorIds;
            if (factorIds) {
              factorIds = factorIds.split(",");
              this.selectNotPaidFactor(factorIds);
            }
          },
        });
      }
    },

    getItemByPosition(position) {
      return this.request({
        url: this.endpoint(`${this.baseUrl}/byPosition`),
        method: "get",
        params: {
          id: this.item.id,
          position: position,
          type: this.type,
        },
        success: (data) => {
          this.setItem(data);
        },
      });
    },
    setAccount(accountId) {
      let account = this.itemAccounts.filter((o) => o.id == accountId)[0];
      this.item.account = account;
    },
    validate(clearForm) {
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
      this.factors.forEach((factor) => {
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
        this.submit(clearForm);
      }
    },
    getSerialized() {
      let data = {};

      data.item = this.extractIds(this.item);
      data.item.type = this.type;

      data.items = {
        items: [],
        ids_to_delete: this.itemsToDelete,
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
        ids_to_delete: [],
      };
      this.factors.forEach((factor) => {
        let payment = factor.payment;
        if (!payment.value) {
          if (payment.id) data.payments.ids_to_delete.push(payment.id);
        } else {
          data.payments.items.push(payment);
        }
      });

      return data;
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
      let account = this.item.account;
      if (!account) {
        this.notify(`ابتدا حساب را انتخاب کنید`, "danger");
        return;
      }
      if (account.floatAccountGroup && !this.item.floatAccount) {
        this.notify(`لطفا حساب شناور را انتخاب کنید`, "danger");
        return;
      }
      if (account.costCenterGroup && !this.item.costCenter) {
        this.notify(`لطفا مرکز هزینه و درآمد را انتخاب کنید`, "danger");
        return;
      }

      this.chequeRowIndex = i;
      this.submitChequeDialog = true;

      this.$nextTick(() => {
        this.$refs.chequeForm.setDefaults({
          "item.account": this.item.account.id,
        });
      });
    },
    addCheque(cheque) {
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
    clearForm() {
      this.log("Clear Item");
      this.changeRouteTo(null);
      this.rows = [this.getRowTemplate()];
      this.item = this.getItemTemplate();
      this.factors = [];
      this.itemsToDelete = [];
    },
    getItemTemplate() {
      return {
        account: null,
        floatAccount: null,
        costCenter: null,
        imprestSettlement: {},
        factorPayments: [],
      };
    },
    splitValue(reverse = false) {
      let total = this.rowsSum("value");
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
    },
    getRowTemplate() {
      return {
        value: 0,
      };
    },
    setItem(item) {
      this.rows = [];
      this.item = item;
      this.itemsToDelete = [];
      item.items
        .sort((a, b) => a.order - b.order)
        .forEach((item) => {
          this.rows.push(this.copy(item));
        });
      this.rows.push(this.getRowTemplate());

      if (!this.modalMode) this.changeRouteTo(item.id);
    },
  },
};
</script>

<style scoped lang="scss">
.submit-tcheque {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>

