<template>
  <div>
    <daily-form
      formName="فاکتور"
      :title="'فاکتور ' + factorLabel"
      :ListRouteParams="{form: 'factor', type: factorType}"
      @clearForm="clearFactor(true)"
      :hasFirst="hasFirst"
      :hasLast="hasLast"
      :hasPrev="hasPrev"
      :hasNext="hasNext"
      :editable="editable"
      :deletable="id"
      :canDelete="canDelete"
      :canSubmit="canSubmit"
      @goToForm="goToForm"
      @validate="validate"
      @edit="makeFormEditable()"
      @delete="deleteFactor()"
    >
      <template #header-btns>
        <v-btn
          v-if="id && !isBack"
          class="blue white--text mr-1"
          :to="{
              name: 'FactorForm',
              params: { factorType:reverseType(factorType)},
              query: {fromId: id}}"
        >
          ثبت فاکتور برگشت از
          <span v-html="factorLabel"></span>
        </v-btn>
        <v-btn
          class="blue white--text mr-1"
          :to="{name: 'Accounts', params: {level: 3, account_type: 'p'}, query: {showForm: true}}"
        >تعریف حساب اشخاص</v-btn>
        <template v-if="id">
          <v-btn
            v-if="canSubmitTransaction"
            class="blue white--text mr-1"
            :to="{name: 'TransactionForm', params: {transactionType: transactionType.name}, query:{accountId: factor.account.id, factorId: id}}"
          >ثبت {{ transactionType.label }}</v-btn>
          <v-btn
            @click="transactionsDialog = true"
            class="blue white--text mr-1"
          >مشاهده {{ transactionType.label }} ها</v-btn>

          <v-btn
            v-if="factor.sanad"
            @click="openSanad(factor.sanad.id)"
            class="blue white--text mr-1"
          >
            مشاهده سند
            <v-chip class="app-background-color mr-2" x-small>{{ factor.sanad.code }}</v-chip>
          </v-btn>

          <v-btn @click="exportsDialog = true" class="export-btn mr-1">خروجی</v-btn>
        </template>
      </template>

      <template #inputs>
        <v-row>
          <v-col cols="12" md="2">
            <v-text-field label="شماره فاکتور" disabled v-model="factor.code" />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="عطف" disabled :value="factor.id" />
          </v-col>
          <v-col cols="12" md="2">
            <date
              label="تاریخ فاکتور"
              required
              v-model="factor.date"
              :default="true"
              :disabled="!editable"
            />
          </v-col>
          <v-col cols="12" md="2">
            <mtime
              label="ساعت فاکتور"
              required
              v-model="factor.time"
              :default="true"
              :disabled="!editable"
            />
          </v-col>
          <v-col cols="12" md="2" v-if="hasBijak">
            <v-text-field label="بیجک" v-model="factor.bijak" :disabled="!editable" />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="نوع فاکتور" disabled :value="factor.is_definite?'قطعی':'موقت'" />
          </v-col>
          <v-col cols="12" md="6">
            <account-select
              :label="accountName"
              itemsType="persons"
              v-model="factor.account"
              :disabled="!editable"
              :floatAccount="factor.floatAccount"
              @update:floatAccount="v => factor.floatAccount = v"
              :costCenter="factor.costCenter"
              @update:costCenter="v => factor.costCenter = v"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-textarea
              label="شرح"
              v-model="factor.explanation"
              :disabled="!editable"
              @keyup.enter.stop
            ></v-textarea>
          </v-col>

          <v-col cols="12">
            <v-switch label="فاکتور مالیات دارد" v-model="hasTax" :disabled="!editable"></v-switch>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-simple-table>
              <thead>
                <tr>
                  <th>#</th>
                  <th class="required">شرح</th>
                  <th>انبار</th>
                  <th class="required">تعداد</th>
                  <th>واحد</th>
                  <th class="required">قیمت واحد</th>
                  <th>جمع</th>
                  <th>تخفیف (مبلغ)</th>
                  <th>تخفیف (درصد)</th>
                  <th>جمع کل پس از تخفیف</th>

                  <th v-if="hasTax">مالیات</th>
                  <th v-if="hasTax">جمع مبلغ کل و مالیات</th>
                  <th>توضیحات</th>
                  <th v-if="isBuy">قیمت فروش</th>
                  <th class="d-print-none"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row,i) in rows" :key="i" :class="{'d-print-none': i == rows.length-1}">
                  <td>{{ i+1 }}</td>
                  <td>
                    <ware-select
                      v-model="rows[i].ware"
                      :disabled="!editable"
                      style="width: 200px;"
                    />
                  </td>
                  <td>
                    <v-autocomplete
                      v-if="rows[i].ware && !rows[i].ware.isService"
                      v-model="rows[i].warehouse"
                      :disabled="!editable"
                      :items="warehouses"
                      item-text="name"
                      style="width: 150px;"
                    ></v-autocomplete>
                    <span v-else>-</span>
                  </td>
                  <td>
                    <money
                      class="form-control form-control"
                      v-model="rows[i].count"
                      :disabled="!editable"
                      decimalScale="6"
                    />
                  </td>
                  <td>{{ rows[i].ware?rows[i].ware.unit.name:' - ' }}</td>
                  <td>
                    <money
                      class="form-control form-control"
                      v-model="rows[i].fee"
                      :disabled="!editable"
                    />
                  </td>
                  <td dir="ltr">
                    <money
                      class="form-control form-control"
                      :value="rowSum(rows[i])"
                      disabled
                      decimalScale="6"
                    />
                  </td>
                  <td>
                    <money
                      :disabled="!editable || hasValue(rows[i].discountPercent)"
                      class="form-control form-control"
                      v-model="rows[i].discountValue"
                    />
                  </td>
                  <td>
                    <v-text-field
                      :disabled="!editable || (hasValue(rows[i].discountValue) && !hasValue(rows[i].discountPercent))"
                      type="number"
                      min="0"
                      max="100"
                      class="form-control form-control"
                      v-model="rows[i].discountPercent"
                    />
                  </td>
                  <td dir="ltr">
                    <money
                      class="form-control form-control"
                      :value="rowSumAfterDiscount(row)"
                      decimalScale="6"
                      disabled
                    />
                  </td>
                  <td v-if="hasTax">
                    <money
                      class="form-control form-control"
                      :value="rowTax(row)"
                      disabled
                      decimalScale="6"
                    />
                  </td>
                  <td v-if="hasTax">
                    <money
                      decimalScale="6"
                      class="form-control form-control"
                      :value="rowSumAfterTax(row)"
                      disabled
                    />
                  </td>
                  <td>
                    <v-textarea
                      style="width: 150px"
                      v-model="rows[i].explanation"
                      :disabled="!editable"
                      rows="1"
                      auto-grow
                    ></v-textarea>
                  </td>
                  <td v-if="isBuy">
                    <money
                      style="width: 80px"
                      v-if="rows[i].ware"
                      :disabled="!editable"
                      class="form-control form-control"
                      v-model="rows[i].sale_price"
                    />
                  </td>
                  <td class="d-print-none">
                    <v-btn
                      v-if="i != rows.length-1"
                      @click="deleteItemRow(i)"
                      class="red--text"
                      icon
                      :disabled="!editable"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
                <tr class="bg-info text-white">
                  <td :colspan="hasTax?13:11"></td>
                  <td>
                    <v-btn @click="deleteItemRow(-1)" icon class="red--text" :disabled="!editable">
                      <v-icon>delete_sweep</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="8" class>
            <div class="pa-3 ml-5" style="border: 1px dashed #9e9e9e">
              <div class="d-flex">
                <h3>هزینه های فاکتور</h3>
                <v-spacer></v-spacer>
              </div>
              <v-simple-table class="mt-3">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>نام هزینه ثابت</th>
                    <th>مبلغ</th>
                    <th>پرداخت کننده</th>

                    <th>حساب شناور</th>
                    <th>مرکز هزینه</th>
                    <th>توضیحات</th>
                  </tr>
                </thead>
                <tbody v-if="factor.expenses.length">
                  <tr v-for="(e,i) in factor.expenses" :key="i">
                    <td>{{ i+1 }}</td>
                    <td>{{ e.expense.name }}</td>
                    <td>{{ e.value | toMoney }}</td>
                    <td>{{ e.account.title }}</td>
                    <td>{{ e.floatAccount?e.floatAccount.name:' - ' }}</td>
                    <td>{{ e.costCenter?e.costCenter.name:' - ' }}</td>
                    <td>{{ e.explanation }}</td>
                  </tr>
                  <tr class="grey lighten-3">
                    <td colspan="2">جمع هزینه های فاکتور:</td>
                    <td>{{ sum.expenses | toMoney }}</td>
                    <td colspan="4"></td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="7">هزینه ای ثبت نشده است</td>
                  </tr>
                </tbody>
              </v-simple-table>
              <div class="d-flex mt-2">
                <v-spacer></v-spacer>
                <v-btn
                  @click="openFactorExpensesDialog"
                  class="blue white--text"
                  :disabled="!editable"
                >افزودن / ویرایش</v-btn>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <v-simple-table bordered>
              <table class="table table-bordered finals">
                <tbody>
                  <tr>
                    <td>جمع:</td>
                    <td colspan="2">{{ sum.sum | toMoney }} ریال</td>
                  </tr>
                  <tr>
                    <td>تخفیف</td>
                    <td>
                      <money
                        :disabled="!editable || hasValue(factor.discountPercent)"
                        class="form-control"
                        v-model="factor.discountValue"
                        placeholder="مبلغ"
                      />
                    </td>
                    <td>
                      <v-text-field
                        :disabled="!editable || hasValue(factor.discountValue)"
                        type="number"
                        min="0"
                        max="100"
                        class="form-control"
                        v-model="factor.discountPercent"
                        placeholder="درصد"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>مبلغ فاکتور پس از تخفیف:</td>
                    <td colspan="2">{{ sum.afterDiscount | toMoney }} ریال</td>
                  </tr>
                  <tr v-if="hasTax">
                    <td>مالیات</td>
                    <td>
                      <money
                        v-if="!(!editable || hasValue(factor.taxPercent))"
                        v-model="factor.taxValue"
                        :value="sum.tax"
                      />
                      <money v-else :disabled="true" :value="sum.tax" />
                    </td>
                    <td>
                      <v-text-field
                        :disabled="!editable || hasValue(factor.taxValue)"
                        type="number"
                        min="0"
                        max="100"
                        class="form-control"
                        v-model="factor.taxPercent"
                        placeholder="درصد"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>مبلغ کل فاکتور:</td>
                    <td colspan="2">{{ sum.total | toMoney }} ریال</td>
                  </tr>
                </tbody>
              </table>
            </v-simple-table>
          </v-col>
        </v-row>

        <v-dialog v-model="factorExpensesDialog" scrollable max-width="1200px">
          <v-card>
            <v-card-title>هزینه های ثابت فاکتور</v-card-title>
            <v-card-text>
              <v-simple-table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th class="required">نام هزینه ثابت</th>
                    <th class="required">مبلغ</th>
                    <th class="required">پرداخت کننده</th>
                    <th>توضیحات</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(e,i) in factorExpensesCopy" :key="i">
                    <td>{{ i+1 }}</td>
                    <td>
                      <v-autocomplete :items="factorExpenses" v-model="e.expense" item-text="name"></v-autocomplete>
                    </td>
                    <td>
                      <money v-model="e.value" />
                    </td>
                    <td>
                      <account-select
                        :horizontal="true"
                        itemsType="level3"
                        label
                        v-model="e.account"
                        :floatAccount="e.floatAccount"
                        @update:floatAccount="v => e.floatAccount = v"
                        :costCenter="e.costCenter"
                        @update:costCenter="v => e.costCenter = v"
                      />
                    </td>
                    <td>
                      <v-textarea v-model="e.explanation" rows="1" auto-grow />
                    </td>
                    <td>
                      <v-btn
                        v-if="i != factorExpensesCopy.length-1"
                        @click="deleteExpenseRow(i)"
                        class="red--text"
                        icon
                        :disabled="!editable"
                      >
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="addExpenses()" class="blue white--text">تایید</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="exportsDialog" scrollable max-width="600px">
          <v-card>
            <v-card-title>خروجی</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-switch label="خلاصه کردن فاکتور" v-model="exportOptions.summarized"></v-switch>
                  <v-switch
                    label="مخفی کردن هزینه های فاکتور"
                    v-model="exportOptions.hide_expenses"
                  ></v-switch>
                  <v-switch label="مخفی کردن مانده حساب" v-model="exportOptions.hide_remain"></v-switch>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-btn
                        class="export-btn"
                        :href="exportLinks.factor.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        block
                      >چاپ فاکتور</v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-btn
                        class="export-btn"
                        :href="exportLinks.factor.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        block
                      >PDF فاکتور</v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-btn
                        class="export-btn"
                        :href="exportLinks.receipt.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        block
                      >چاپ {{receiptLabel}}</v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-btn
                        class="export-btn"
                        :href="exportLinks.receipt.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        block
                      >PDF {{receiptLabel}}</v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-btn
                        class="export-btn"
                        :href="exportLinks.preFactor.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        block
                      >چاپ پیش فاکتور</v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-btn
                        class="export-btn"
                        :href="exportLinks.preFactor.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        block
                      >PDF پیش فاکتور</v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions></v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="transactionsDialog" scrollable max-width="1200px">
          <v-card>
            <v-card-title>{{ transactionType.label }} های فاکتور</v-card-title>
            <v-card-text>
              <v-simple-table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>مبغ</th>
                    <th>کد دریافت/پرداخت</th>
                    <th>تاریخ</th>
                    <th>توضیحات</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="factor.payments && factor.payments.length">
                    <tr v-for="(p,i) in factor.payments" :key="i">
                      <td>{{ i+1 }}</td>
                      <td>{{ p.value | toMoney }}</td>
                      <td>{{ p.transaction.code }}</td>
                      <td>{{ p.transaction.date }}</td>
                      <td>{{ p.transaction.explanation }}</td>
                      <td>
                        <v-btn @click="openTransaction(p.transaction)" class="blue white--text">
                          مشاهده {{ transactionType.label }}
                          <v-chip class="app-background-color mr-2" x-small>{{ p.transaction.code }}</v-chip>
                        </v-btn>
                      </td>
                    </tr>
                    <tr class="grey lighten-3">
                      <td>جمع:</td>
                      <td>{{ paymentsSum | toMoney }}</td>
                      <td colspan="4"></td>
                    </tr>
                  </template>
                  <tr v-else>
                    <td colspan="4" class="text-center">موردی برای نمایش وجود ندارد</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-dialog>
      </template>

      <template slot="always">
        <v-btn
          v-if="id"
          @click="definiteFactor"
          :disabled="factor.is_definite"
          class="blue white--text"
        >قطعی کردن فاکتور</v-btn>
      </template>
    </daily-form>
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import getFactorExpensesApi from "./getFactorExpensesApi";
import wareApiMixin from "@/mixin/wareApi";
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import mtime from "@/components/mcomponents/cleave/Time";

import formComputed from "./formComputed.js";
import formMethods from "./formMethods.js";

import DailyForm from "@/components/form/DailyForm";

export default {
  name: "Form",
  components: { money, date, mtime, DailyForm },
  props: {
    factorType: {
      required: true
    },
    id: {
      default: false
    },
    fromId: {
      default: null
    }
  },
  mixins: [
    formsMixin,
    accountApiMixin,
    wareApiMixin,
    getFactorExpensesApi,
    formComputed,
    formMethods
  ],
  data() {
    return {
      factorCodes: {
        buy: null,
        backFromBuy: null,
        sale: null,
        backFromSale: null
      },
      transactionsDialog: false,
      exportsDialog: false,
      factorExpensesDialog: false,
      factor: {
        taxPercent: "",
        taxValue: "",
        discountPercent: "",
        discountValue: "",
        expenses: [],
        bijak: null
      },
      factorExpensesCopy: [{}],
      rows: [],
      hasTax: false,
      rowTemplate: {
        discountValue: "",
        discountPercent: "",
        fee: "",
        ware: null,
        warehouse: null
      },
      itemsToDelete: [],
      expensesToDelete: [],
      factorLabel: "",
      exportOptions: {
        summarized: false,
        hide_expenses: false,
        hide_remain: false
      }
    };
  },
  created() {
    this.initForm();
  },
  watch: {
    $route() {
      this.initForm();
    },
    rows: {
      handler(newRows, oldRows) {
        let row = this.rows[this.rows.length - 1];
        if (row && row.ware) {
          this.rows.push(this.copy(this.rowTemplate));
        }
        this.setDefaultValues();
      },
      deep: true
    },
    factorExpensesCopy: {
      handler() {
        let expense = this.factorExpensesCopy[
          this.factorExpensesCopy.length - 1
        ];
        if (expense && expense.expense) {
          this.factorExpensesCopy.push({});
        }
      },
      deep: true
    },
    factorType() {
      this.initForm();
    },
    hasTax() {
      if (this.hasTax == false) {
        this.factor.taxPercent = 0;
        this.factor.taxValue = 0;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.finals {
  td:first-child {
    text-align: right !important;
  }
  td:last-child {
    text-align: left !important;
  }
}

.custom-checkbox {
  padding-left: 0px;
  margin-left: 0px;
}
</style>

