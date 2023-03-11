<template>
  <div>
    <m-form
        :title="title"
        :showList="false"
        :listRoute="{ name: 'TransactionsList', params: { type: type } }"
        exportBaseUrl="reports/lists/transactions"
        :exportParams="{ id: id }"
        :showNavigationButtons="!modalMode"
        :showSubmitAndClearForm="!modalMode"
        :canDelete="canDelete"
        :canEdit="!item.is_auto_created"
        :canSubmit="canSubmit"
        :isEditing.sync="isEditing"
        @clearForm="clearForm"
        @goToForm="getItemByPosition"
        @submit="validate"
        @delete="deleteItem"
        @define="defineItem"
    >
      <template #header-btns>
        <open-sanad-btn v-if="item.is_defined" :sanad="item.sanad"/>
        <v-tooltip top color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-if="
            isImprest && id != undefined && hasPerm('', 'imprestSettlement')
          "
                class="primary white--text mr-1 mt-1 mt-md-0 pa-4"
                :to="{ name: 'ImprestSettlement', params: { id: item.id } }"
                icon
                depressed
                v-bind="attrs"
                v-on="on"
            >
              <v-img max-width="25" src="/img/icons/card.svg"></v-img>
            </v-btn>
          </template>
          تسویه تنخواه
        </v-tooltip>

        <v-tooltip top color="secondary">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-if="!isImprest && !isBankTransfer"
                @click="factorsDialog = true"
                class="export-btn white--text mr-1 mt-1 mt-md-0 pa-4"
                icon
                depressed
                v-bind="attrs"
                v-on="on"
            >
              <v-img max-width="25" src="/img/icons/factor.svg"></v-img>
            </v-btn>
          </template>
          بابت فاکتور های
        </v-tooltip>

      </template>

      <template>
        <v-row v-if="!modalMode">
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12" md="2">
                <v-text-field class="rounded-lg" label="شماره" disabled v-model="item.code"/>
              </v-col>
              <v-col cols="12" md="3">
                <date
                    label=" * تاریخ"
                    v-model="item.date"
                    :default="true"
                    :disabled="!isEditing"
                />
              </v-col>

              <v-col cols="12" md="3" v-if="type == 'payment'">
                <date placeholder="تاریخ راس" disabled/>
              </v-col>

              <v-col cols="12" md="3">
                <v-switch
                    inset
                    color="green"
                    v-if="id"
                    label="قطعی شده"
                    v-model="item.is_defined"
                    disabled
                />
              </v-col>

              <v-col cols="12" md="8">
                <account-select
                    :label="accountLabel"
                    :itemsType="accountsType"
                    v-model="item.account"
                    :disabled="modalMode || !isEditing"
                    required
                    :floatAccount="item.floatAccount"
                    @update:floatAccount="(v) => (item.floatAccount = v)"
                    :costCenter="item.costCenter"
                    @update:costCenter="(v) => (item.costCenter = v)"
                />
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
          </v-col>
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12">
                <v-textarea
                    class="rounded-lg"
                    label="شرح"
                    v-model="item.explanation"
                    :disabled="!isEditing"
                    height="105"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <input-table v-model="rows">
              <template #thead>
                <tr>
                  <th class="tr-counter">#</th>
                  <th v-if="!isBankTransfer">* نوع {{ title }}</th>
                  <th>{{ rowAccountLabel }}</th>
                  <th>* مبلغ</th>
                  <th>شماره پیگیری</th>
                  <th>* تاریخ {{ title }}</th>
                  <th>سررسید</th>
                  <th>نام بانک</th>
                  <th>شرح ردیف</th>
                  <template v-if="!isReceive">
                    <th>نوع عملیات بانکی</th>
                    <th>مبلغ هزینه بانکی</th>
                  </template>
                  <th></th>
                </tr>
              </template>
              <template #tbody>
                <tr
                    v-for="(row, i) in rows"
                    :key="i"
                    :class="{ 'd-print-none': i == rows.length - 1 }"
                >
                  <td>{{ i + 1 }}</td>
                  <td
                      v-if="!isBankTransfer"
                      style="min-width: 150px"
                      :title="rows[i].type.id && rows[i].type.name"
                  >
                    <v-autocomplete
                        class="rounded-lg"
                        :return-object="true"
                        :disabled="!isEditing || hasCheque(row)"
                        :items="itemPaymentMethods"
                        v-model="rows[i].type"
                        @change="isChequeType(row) && openSubmitChequeDialog(row, i)"
                        item-text="name"
                        item-value="id"
                    />
                    <v-btn
                        v-if="isChequeType(row) && !hasCheque(row)"
                        @click="openSubmitChequeDialog(row, i)"
                        class="blue white--text mt-1"
                        block
                        :disabled="!isEditing"
                    >
                      ثبت
                      {{ rows[i].type.name }}
                    </v-btn>
                  </td>
                  <td class="tr-account">
                    <account-select
                        v-if="rows[i].type.id || isBankTransfer"
                        :horizontal="true"
                        :items-type="isBankTransfer ? 'banks' : 'level3'"
                        v-model="rows[i].type.account"
                        :disabled="!isEditing"
                        :account-disabled="!isBankTransfer"
                        :floatAccount="rows[i].floatAccount"
                        @update:floatAccount="(v) => (rows[i].floatAccount = v)"
                        :costCenter="rows[i].costCenter"
                        @update:costCenter="(v) => (rows[i].costCenter = v)"
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
                        class="rounded-lg form-control"
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
                    <date disabled v-model="rows[i].due"/>
                  </td>
                  <td>
                    <v-text-field
                        :disabled="!isEditing || !hasBank(row)"
                        type="text"
                        class="form-control form-control rounded-lg"
                        v-model="rows[i].bankName"
                    />
                  </td>
                  <td style="min-width: 120px">
                    <row-textarea
                        class="rounded-lg"
                        v-model="rows[i].explanation"
                        :disabled="!isEditing || isChequeType(row)"
                        :i="i"
                        @updateRowsExplanation="updateRowsExplanation"
                    />
                  </td>
                  <template v-if="!isReceive">
                    <td>
                      <v-autocomplete
                          class="rounded-lg"
                          :return-object="false"
                          :disabled="!isEditing || hasCheque(row)"
                          :items="bankingOperations"
                          v-model="rows[i].bankingOperation"
                          item-text="name"
                          item-value="id"
                      />
                    </td>
                    <td>
                      <money
                          :disabled="!isEditing || hasCheque(row)"
                          v-model="rows[i].banking_operation_value"
                      />
                    </td>
                  </template>
                  <td class="d-print-none">
                    <v-btn
                        v-if="
                        i != rows.length - 1 && (!hasCheque(row) || !row.id)
                      "
                        :disabled="!isEditing"
                        @click="deleteRow(i)"
                        class="red--text"
                        icon
                    >
                      <v-img class="" max-width="20" src="/img/icons/delete.svg"></v-img>
                    </v-btn>
                    <v-tooltip top color="secondary">
                      <template v-slot:activator="{ on, attrs }">
                        <router-link
                            v-bind="attrs"
                            v-on="on"
                            v-if="hasCheque(row) && row.cheque.id"
                            :to="{
                            name: 'ChequeDetail',
                            params: { id: row.cheque.id },
                              }"
                            target="_blank"
                            icon
                        >
                          <v-img v-bind="attrs" v-on="on" class="" max-width="20" src="/img/icons/external.svg"></v-img>
                        </router-link>
                      </template>
                      مشاهده چک
                    </v-tooltip>

                  </td>
                </tr>
                <tr></tr>
                <tr class="back text-white">
                  <td></td>
                  <td v-if="!isBankTransfer"></td>
                  <td class="text-left">مجموع:</td>
                  <td class>{{ rowsSum("value") | toMoney }}</td>
                  <td colspan="5"></td>
                  <template v-if="!isReceive">
                    <td></td>
                    <td>{{ rowsSum("banking_operation_value") | toMoney }}</td>
                  </template>
                  <td class="d-print-none">
                    <v-btn
                        @click="deleteRow(-1)"
                        icon
                        class="red--text"
                        :disabled="!isEditing"
                    >
                      <v-img class="" max-width="20" src="/img/icons/delete.svg"></v-img>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </input-table>
          </v-col>
        </v-row>
      </template>
    </m-form>

    <v-dialog
        v-model="factorsDialog"
        scrollable
        class="pa-2 rounded-lg"
        max-width="1200px"
        :persistent="isEditing"
    >
      <v-card class="rounded-lg">
        <v-card-title>فاکتور های پرداخت نشده</v-card-title>
        <v-card-text>
          <v-simple-table class="rounded-lg">
            <thead>
            <tr class="back">
              <th>شماره فاکتور</th>
              <th>نوع فاکتور</th>
              <th>توضیحات</th>
              <th>تاریخ</th>
              <th>جمع فاکتور</th>
              <th>جمع برگشتی</th>
              <th>مبلغ خالص</th>
              <th>پرداختی قبلی</th>
              <th v-if="!isEditing">پرداختی فعلی</th>
              <th>مانده</th>
              <th v-if="isEditing">پرداختی فعلی</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(f, i) in factors" :key="i">
              <td>{{ f.code }}</td>
              <td>{{ factorTypes[f.type] }}</td>
              <td>{{ f.explanation }}</td>
              <td>{{ f.date }}</td>
              <td>{{ f.total_sum | toMoney }}</td>
              <td>{{ f.back_total_sum | toMoney }}</td>
              <td>{{ (f.total_sum - f.back_total_sum) | toMoney }}</td>
              <td>{{ f.previous_paid_value | toMoney }}</td>
              <td v-if="!isEditing">{{ f.payment.value | toMoney }}</td>
              <td>{{ f.remain | toMoney }}</td>
              <td v-if="isEditing">
                <money v-model="f.payment.value" :disabled="!isEditing"/>
              </td>
              <td>
                <v-btn @click="openFactor(f)" class="blue white--text">
                  مشاهده فاکتور
                  <v-chip class="app-background-color mr-2" x-small>{{
                      f.code
                    }}
                  </v-chip>
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
              depressed
              class="info white--text rounded-lg"
          >سرشکن کردن از پایین
          </v-btn
          >
          <v-btn
              @click="splitValue()"
              :disabled="!isEditing"
              depressed
              class="info white--text rounded-lg"
          >سرشکن کردن از بالا
          </v-btn
          >
          <v-btn @click="validatePaidValues" depressed class="success white--text w-100px rounded-lg"
          >تایید
          </v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="submitChequeDialog" scrollable max-width="1200px" class="rounded-lg">
      <v-card class="rounded-lg">
        <v-card-text>
          <cheque-form
              ref="chequeForm"
              :modalMode="true"
              :isPaid="type[0] == 'p'"
              :type="chequeType"
              :selectedAccount="{
              account: item.account,
              floatAccount: item.floatAccount,
              costCenter: item.costCenter,
            }"
              @submit="addCheque"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import {MFormMixin} from "@/components/m-form";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import _ from "lodash";
import ChequeForm from "../cheque/ChequeForm.vue";
import ChequeMixin from "@/views/panel/cheque/mixin";
import TransactionMixin from "@/views/panel/transaction/mixin";

export default {
  name: "TransactionForm",
  components: {ChequeForm, money, date},
  mixins: [MFormMixin, accountApiMixin, TransactionMixin, ChequeMixin],
  props: {
    type: {
      required: true,
    },
    id: {},
    accountId: {},

    /*
      rather than submiting the transaction, `submit` event will be emitted 
    */
    modalMode: {
      default: false,
    },
    contractModalMode: {
      default: false,
    }
  },
  data() {
    3
    return {
      baseUrl: "transactions",
      appendSlash: true,
      isDefinable: true,
      hasList: false,
      hasIdProp: true,
      hasLock: true,
      factorsDialog: false,
      submitChequeDialog: false,
      item: {},
      rows: [],
      itemsToDelete: [],
      chequeRowIndex: null,
      chequeType: "c",
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
    this.getChequeMeta();
    this.getDefaultAccounts();
    this.getBankingOperations();
  },
  computed: {
    accountsType() {
      if (this.isImprest) return "imprests";
      if (this.isBankTransfer) return "banks";
      return "level3";
    },
    title() {
      if (this.type == "receive") {
        return "دریافت";
      } else if (this.type == "payment") {
        return "پرداخت";
      } else if (this.isImprest) {
        return "پرداخت تنخواه";
      } else if (this.isBankTransfer) {
        return "پرداخت بین بانک ها";
      } else if (this.type == "receivedGuarantee") {
        return "اسناد ضمانتی دریافتی";
      } else if (this.type == "paymentGuarantee") {
        return "اسناد ضمانتی پرداختی";
      }
    },
    permissionBasename() {
      return `${this.type}Transaction`;
    },
    isReceive() {
      return this.type == "receive";
    },
    isImprest() {
      return this.type == "imprest";
    },
    isBankTransfer() {
      return this.type == "bankTransfer";
    },
    isGuarantee() {
      return this.type.includes("Guarantee");
    },
    accountLabel() {
      if (this.isImprest) return "* تنخواه گردان";
      if (this.isBankTransfer) return "* برداشت از حساب";
      return " * کد - نام حساب";
    },
    rowAccountLabel() {
      if (this.isBankTransfer) return "* واریز به حساب";
      return " * کد - نام حساب";
    },
    itemPaymentMethods() {
      if (this.isGuarantee) {
        return this.GuaranteeTypes;
      } else {
        let type = this.type == "receive" ? "receive" : "payment";
        return this.defaultAccounts.filter(
            (o) => o.usage && o.usage.toLowerCase().includes(type)
        );
      }
    },
    itemAccounts() {
      if (this.isBankTransfer) {
        return this.accountsSelectValues.banks;
      } else {
        return this.accountsSelectValues.levels[3];
      }
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
    rows: {
      handler() {
        let hasValue = this.rows[this.rows.length - 1]["type"]["id"];
        if (this.isBankTransfer) {
          hasValue = this.rows[this.rows.length - 1]["type"]["account"];
        }
        if (this.rows.length > 0 && hasValue) {
          this.rows.push(this.getRowTemplate());
        }
      },
      deep: true,
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

        item.account = item.type.account;

        if (item.cheque) {
          item.cheque = this.extractIds(item.cheque);
        }

        if (this.isBankTransfer) {
          item.type = null;
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
      if (row.type.id && row.type.codename == "cash") return false;
      return true;
    },

    isChequeType(row) {
      if (row.type.id && row.type.codename) {
        let isCheque = row.type.codename.includes("Cheque");
        let isGuarantee =
            this.GuaranteeTypes.find((o) => o.codename == row.type.codename) !=
            undefined;

        return isCheque || isGuarantee;
      } else {
        return false;
      }
    },
    hasCheque(row) {
      return this.hasValue(row.cheque);
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
      if (this.isGuarantee) {
        this.chequeType = row.type.codename;
      } else {
        this.chequeType = "c";
      }
      this.submitChequeDialog = true;

      this.$nextTick(() => {
        this.$refs.chequeForm.clearForm();
      });
    },
    addCheque(cheque) {
      if (!this.hasValue(cheque.serial)) {
        this.notify("لطفا سریال را وارد کنید", "danger");
        return;
      }
      if (!this.hasValue(cheque.value)) {
        this.notify("لطفا مبلغ را وارد کنید", "danger");
        return;
      }
      if (cheque.date.length != 10 || cheque.due.length != 10) {
        this.notify("لطفا تاریخ های را به صورت صحیح وارد کنید", "danger");
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
        is_defined: false,
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
      let template = {
        value: 0,
        type: {},
      };

      return template;
    },
    setItem(item) {
      this.rows = [];
      this.item = item;
      this.itemsToDelete = [];
      item.items
          .sort((a, b) => a.order - b.order)
          .forEach((item) => {
            item = this.copy(item);
            if (item.type == null) {
              item.type = {
                account: item.account,
              };
            }
            this.rows.push(item);
          });
      this.rows.push(this.getRowTemplate());


      if (!this.modalMode && !this.contractModalMode) this.changeRouteTo(item.id);
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

