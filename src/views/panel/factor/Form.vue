<template>
  <div>
    <m-form
      :title="title"
      :hasIdProp="hasIdProp"
      :showList="false"
      :showListBtn="!isFpi"
      :listRoute="listRoute"
      :exportBaseUrl="(isFpi || isCw)?'reports/lists/factors':undefined"
      :exportParams="(isFpi || isCw) && {id: this.id}"
      :showClearBtn="!isFpi"
      :showNavigationBtns="!isFpi"
      :showSubmitAndClearBtn="!isFpi"
      :isEditing.sync="isEditing"
      :canDelete="canDelete"
      :canSubmit="canSubmit"
      :confirmBtnText="confirmBtnText"
      :cancelConfirmBtnText="cancelConfirmBtnText"
      :canConfirm="canConfirm"
      :canCancelConfirm="canCancelConfirm"
      @cancelConfirm="cancelConfirm"
      @confirm="confirm"
      @clearForm="clearForm(true)"
      @goToForm="getItemByPosition"
      @submit="validate"
      @delete="deleteItem()"
    >
      <template #header-btns>
        <open-sanad-btn v-if="item.sanad" :sanad="item.sanad" />

        <v-btn
          v-if="id && !isFpi && !isCw"
          @click="transactionsDialog = true"
          class="light-blue white--text mr-1 mt-1 mt-md-0"
        >مشاهده {{ transactionLink.label }} ها</v-btn>
        <v-btn
          v-if="id && canSubmitTransaction"
          class="teal white--text mr-1 mt-1 mt-md-0"
          :to="transactionLink.to"
        >ثبت {{ transactionLink.label }}</v-btn>
        <v-menu bottom offset-y v-if="id && !isFpi && !isCw">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="teal white--text mr-1 mt-1 mt-md-0"
              v-bind="attrs"
              v-on="on"
            >ثبت {{ transactionLink.label }} سریع</v-btn>
          </template>

          <v-list class="pa-0 pt-1">
            <v-list-item
              class="px-1 pb-1"
              v-for="option in quickTransactionOptions"
              :key="option.codename"
            >
              <v-list-item-content class="pa-0">
                <v-btn
                  @click="createQuickTransaction(option.codename)"
                  block
                  color="teal lighten-3"
                >{{ option.text }}</v-btn>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          v-if="id && !isBack && !isFpi && !isCw"
          class="teal white--text mr-1 mt-1 mt-md-0"
          @click="reverseFactor"
        >
          ثبت
          <span v-html="reverseLabel"></span>
        </v-btn>
        <v-btn
          v-if="!isFpi && !isCw"
          class="teal lue white--text mr-1 mt-1 mt-md-0"
          :to="{name: 'Accounts', params: {level: 3, account_type: 'p'}, query: {showForm: true}}"
        >تعریف حساب اشخاص</v-btn>
        <v-btn
          v-if="!isFpi && !isCw && id != false"
          @click="exportsDialog = true"
          class="export-btn mr-1 mt-1 mt-md-0"
        >خروجی</v-btn>
      </template>

      <template>
        <v-row>
          <v-col cols="12" md="2" v-if="!isFpi">
            <v-text-field label="شماره موقت" disabled :value="item.temporary_code" />
          </v-col>
          <v-col cols="12" md="2" v-if="!isFpi">
            <v-text-field label="شماره قطعی" disabled v-model="item.code" />
          </v-col>
          <v-col cols="12" md="2">
            <date
              label=" * تاریخ"
              required
              v-model="item.date"
              :default="true"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <mtime
              label=" * ساعت"
              required
              v-model="item.time"
              :default="true"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2" v-if="hasBijak">
            <v-text-field label="بیجک" v-model="item.bijak" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="2" v-if="!isFpi">
            <v-text-field label="نوع" disabled :value="item.is_definite?'قطعی':'موقت'" />
          </v-col>
          <v-col cols="12" md="4">
            <account-select
              :label="' * ' + accountName"
              :itemsType="accountType"
              v-model="item.account"
              :disabled="!isEditing"
              :floatAccount="item.floatAccount"
              @update:floatAccount="v => item.floatAccount = v"
              :costCenter="item.costCenter"
              @update:costCenter="v => item.costCenter = v"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-textarea
              label="شرح"
              v-model="item.explanation"
              :disabled="!isEditing"
              @keyup.enter.stop
            ></v-textarea>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
              v-if="item.created_by"
              label="کاربر"
              disabled
              v-model="item.created_by.name"
            />
          </v-col>

          <v-col cols="12" md="2" v-if="showTax">
            <v-switch label="فاکتور مالیات دارد" v-model="item.has_tax" :disabled="!isEditing"></v-switch>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <input-table v-model="rows">
              <template #thead>
                <tr>
                  <th>#</th>
                  <th>* نام کالا</th>
                  <th></th>
                  <th>واحد</th>
                  <th class="tr-warehouse">* انبار</th>
                  <th>* تعداد</th>

                  <template v-if="!isCw">
                    <th>* قیمت واحد</th>
                    <th>مبلغ کل</th>
                  </template>

                  <th v-if="showDiscount">تخفیف (مبلغ)</th>
                  <th v-if="showDiscount">تخفیف (درصد)</th>
                  <th v-if="showDiscount">جمع کل پس از تخفیف</th>

                  <template v-if="showTax && item.has_tax">
                    <th>مالیات</th>
                    <th>جمع مبلغ کل و مالیات</th>
                  </template>

                  <th>توضیحات</th>
                  <th class="d-print-none"></th>
                </tr>
              </template>
              <template #tbody>
                <tr
                  v-for="(row,i) in rows"
                  :key="i"
                  :class="{'d-print-none': i == rows.length-1,'draggable': i != rows.length-1 && isEditing}"
                >
                  <td class="tr-counter">{{ i+1 }}</td>
                  <td class="tr-ware">
                    <ware-select v-model="rows[i].ware" :disabled="!isEditing" :factorType="type" />
                  </td>
                  <td>
                    <v-btn
                      icon
                      color="cyan"
                      :disabled="!item.account || !item.account.id || !rows[i].ware"
                      @click="showPrices(rows[i].ware)"
                    >
                      <v-icon>fa-hand-holding-usd</v-icon>
                    </v-btn>
                  </td>
                  <td style="min-width: 100px">
                    <v-autocomplete
                      v-if="rows[i].ware"
                      :items="getWareUnits(rows[i])"
                      v-model="rows[i].unit"
                      :title="rows[i].unit?rows[i].unit.title:''"
                      @change="updateRowFee(rows[i])"
                      item-text="name"
                      item-value="id"
                      :disabled="!isEditing"
                      :return-object="true"
                    ></v-autocomplete>
                  </td>
                  <td class="tr-warehouse" :title="rows[i].warehouse && rows[i].warehouse.name">
                    <v-autocomplete
                      :return-object="true"
                      v-if="rows[i].ware && !rows[i].ware.isService"
                      v-model="rows[i].warehouse"
                      :disabled="!isEditing"
                      :items="warehouses"
                      item-text="name"
                      item-value="id"
                    ></v-autocomplete>
                    <span v-else>-</span>
                  </td>
                  <td>
                    <money v-model="rows[i].unit_count" :disabled="!isEditing" />
                  </td>
                  <template v-if="!isCw">
                    <td>
                      <v-menu bottom offset-y v-if="isSale || isBackFromBuy">
                        <template v-slot:activator="{ on, attrs }">
                          <money
                            v-model="rows[i].fee"
                            :disabled="!isEditing"
                            v-bind="attrs"
                            v-on="on"
                            :suffix="getFeeSuffix(row)"
                          />
                        </template>

                        <v-list class="py-0">
                          <v-list-item
                            v-for="(price, j) in getWarePrices(rows[i])"
                            :key="j"
                            class
                            @click="rows[i].fee = price.price"
                            style="border-bottom: 1px dashed black"
                          >
                            <v-list-item-content>
                              <v-list-item-title style="font-size: 12px" class="text-center">
                                <span>{{ price.name }}</span>
                              </v-list-item-title>
                              <v-list-item-subtitle class="text-center">
                                <span>{{ price.price | toMoney }}</span>
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                      <money
                        v-else
                        v-model="rows[i].fee"
                        :disabled="!isEditing"
                        v-bind="attrs"
                        v-on="on"
                      />
                    </td>
                    <td dir="ltr">
                      <money :value="rowSum(rows[i])" disabled :decimalScale="0" />
                    </td>
                  </template>
                  <td v-if="showDiscount">
                    <money
                      :disabled="!isEditing || hasValue(rows[i].discountPercent)"
                      v-model="rows[i].discountValue"
                    />
                  </td>
                  <td v-if="showDiscount">
                    <v-text-field
                      :disabled="!isEditing || (hasValue(rows[i].discountValue) && !hasValue(rows[i].discountPercent))"
                      type="number"
                      min="0"
                      max="100"
                      v-model="rows[i].discountPercent"
                    />
                  </td>
                  <td v-if="showDiscount">
                    <money :value="rowSumAfterDiscount(row)" :decimalScale="0" disabled />
                  </td>
                  <td v-if="item.has_tax">
                    <money :value="rowTax(row)" disabled :decimalScale="0" />
                  </td>
                  <td v-if="item.has_tax">
                    <money :decimalScale="0" :value="rowSumAfterTax(row)" disabled />
                  </td>
                  <td>
                    <row-textarea
                      style="width: 150px"
                      v-model="rows[i].explanation"
                      :disabled="!isEditing"
                      :i="i"
                      @updateRowsExplanation="updateRowsExplanation"
                    />
                  </td>
                  <td class="d-print-none">
                    <v-btn
                      v-if="i != rows.length-1"
                      @click="deleteItemRow(i)"
                      class="red--text"
                      icon
                      :disabled="!isEditing"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
                <tr class="grey lighten-3 text-white">
                  <td colspan="3"></td>

                  <td v-if="isFpi">{{ rowsSum('count') | toMoney(0) }}</td>
                  <td v-else></td>

                  <td></td>

                  <td v-if="isFpi">{{ sum.sum | toMoney(0) }}</td>
                  <td v-else></td>

                  <td></td>
                  <td v-if="showDiscount" colspan="4"></td>
                  <td v-if="showTax && item.has_tax" colspan="2"></td>
                  <td>
                    <v-btn @click="deleteItemRow(-1)" icon class="red--text" :disabled="!isEditing">
                      <v-icon>delete_sweep</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </input-table>
          </v-col>
        </v-row>

        <v-row v-if="showFactorExpenses">
          <v-col cols="12" md="8" class>
            <div class="pa-3 ml-md-5" style="border: 1px dashed #9e9e9e">
              <div class="d-flex">
                <h3>هزینه های فاکتور</h3>
                <v-spacer></v-spacer>
              </div>
              <input-table v-model="item.expenses" class="mt-3">
                <template #thead>
                  <tr>
                    <th>#</th>
                    <th>نام هزینه ثابت</th>
                    <th>مبلغ</th>
                    <th>پرداخت کننده</th>

                    <th>حساب شناور</th>
                    <th>مرکز هزینه و درآمد</th>
                    <th>توضیحات</th>
                  </tr>
                </template>
                <template #tbody v-if="item.expenses.length">
                  <tr v-for="(e,i) in item.expenses" :key="i">
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
                </template>
                <tbody v-else>
                  <tr>
                    <td colspan="7">هزینه ای ثبت نشده است</td>
                  </tr>
                </tbody>
              </input-table>
              <div class="d-flex mt-2">
                <v-spacer></v-spacer>
                <v-btn
                  @click="openFactorExpensesDialog"
                  class="blue white--text"
                  :disabled="!isEditing"
                >افزودن / ویرایش</v-btn>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <v-simple-table bordered class="finals">
              <tbody>
                <tr>
                  <td>جمع:</td>
                  <td colspan="2">{{ sum.sum | toMoney(0) }} ریال</td>
                </tr>
                <tr>
                  <td>تخفیف</td>
                  <td>
                    <money
                      :disabled="!isEditing || hasValue(item.discountPercent)"
                      v-model="item.discountValue"
                      placeholder="مبلغ"
                    />
                  </td>
                  <td>
                    <v-text-field
                      :disabled="!isEditing || hasValue(item.discountValue)"
                      type="number"
                      min="0"
                      max="100"
                      v-model="item.discountPercent"
                      placeholder="درصد"
                    />
                  </td>
                </tr>
                <tr>
                  <td>مبلغ فاکتور پس از تخفیف:</td>
                  <td colspan="2">{{ sum.afterDiscount | toMoney(0) }} ریال</td>
                </tr>
                <tr v-if="item.has_tax">
                  <td>مالیات</td>
                  <td>
                    <money
                      v-if="!(!isEditing || hasValue(item.taxPercent))"
                      v-model="item.taxValue"
                      :value="sum.tax"
                    />
                    <money v-else :disabled="true" :value="sum.tax" :decimalScale="0" />
                  </td>
                  <td>
                    <v-text-field
                      :disabled="!isEditing || hasValue(item.taxValue)"
                      type="number"
                      min="0"
                      max="100"
                      v-model="item.taxPercent"
                      placeholder="درصد"
                    />
                  </td>
                </tr>
                <tr>
                  <td>مبلغ کل فاکتور:</td>
                  <td colspan="2">{{ sum.total | toMoney(0) }} ریال</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>

        <v-dialog v-model="factorExpensesDialog" scrollable max-width="1200px">
          <v-card class="form-fields">
            <v-card-title>هزینه های فاکتور</v-card-title>
            <v-card-text>
              <v-simple-table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>* نام هزینه ثابت</th>
                    <th>* مبلغ</th>
                    <th>* پرداخت کننده</th>
                    <th>توضیحات</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(e,i) in factorExpensesCopy" :key="i">
                    <td>{{ i+1 }}</td>
                    <td>
                      <v-autocomplete
                        :return-object="true"
                        :items="factorExpenses.filter(o => o.type == factorExpenseType)"
                        v-model="e.expense"
                        item-text="name"
                        item-value="id"
                      ></v-autocomplete>
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
                        :disabled="!isEditing"
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
                        :href="exportLinks.item.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        block
                      >چاپ</v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-btn
                        class="export-btn"
                        :href="exportLinks.item.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        block
                      >PDF</v-btn>
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
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions></v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="transactionsDialog" scrollable max-width="1200px">
          <v-card>
            <v-card-title>{{ transactionLink.label }} های فاکتور</v-card-title>
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
                  <template v-if="item.payments && item.payments.length">
                    <tr v-for="(p,i) in item.payments" :key="i">
                      <td>{{ i+1 }}</td>
                      <td>{{ p.value | toMoney }}</td>
                      <td>{{ p.transaction.code }}</td>
                      <td>{{ p.transaction.date }}</td>
                      <td>{{ p.transaction.explanation }}</td>
                      <td>
                        <v-btn @click="openTransaction(p.transaction)" class="blue white--text">
                          مشاهده {{ transactionLink.label }}
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

      <template #footer-outside-btns>
        <v-btn
          v-if="id && !isFpi"
          @click="definiteFactor"
          :disabled="item.is_definite"
          class="blue white--text mr-1"
        >قطعی کردن فاکتور</v-btn>
      </template>
    </m-form>

    <v-dialog v-if="priceWare" v-model="pricesDialog" scrollable max-width="1000px">
      <v-card>
        <v-card-title>آخرین قیمت های {{ priceWare.name }} برای {{ item.account.name }}</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <m-datatable
                :headers="pricesHeaders"
                api-url="reports/buySale"
                :filters.sync="pricesFilters"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
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
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";

export default {
  name: "Form",
  components: { money, date, mtime },
  mixins: [
    MFormMixin,
    formsMixin,
    accountApiMixin,
    wareApiMixin,
    getFactorExpensesApi,
    formComputed,
    formMethods,
  ],
  props: {
    type: {
      required: true,
    },
    id: {
      default: false,
    },
    fromId: {
      default: null,
    },
  },
  data() {
    return {
      hasList: false,
      transactionsDialog: false,
      baseUrl: "factors/factors",
      leadingSlash: true,
      rowKey: "ware",
      hasIdProp: true,

      exportsDialog: false,
      factorExpensesDialog: false,
      factorExpensesCopy: [{}],
      expensesToDelete: [],
      exportOptions: {
        summarized: false,
        hide_expenses: false,
        hide_remain: false,
      },

      pricesDialog: false,
      priceWare: null,
      pricesFilters: {
        offset: 0,
        limit: 5,
        ware: null,
        factor__account: null,
        factor__floatAccount: null,
        factor__costCenter: null,
        factor__type__in: null,
      },
      pricesHeaders: [
        {
          text: "شماره فاکتور",
          value: "factor.code",
        },
        {
          text: "تاریخ",
          value: "factor.date",
          type: "date",
        },
        {
          text: "تعداد",
          value: "count",
          type: "numeric",
        },
        {
          text: "واحد",
          value: "unit.name",
        },
        {
          text: "فی",
          value: "fee",
          type: "numeric",
          sortable: false,
        },
        {
          text: "مبلغ کل",
          value: "total_value",
          type: "numeric",
          sortable: false,
        },
      ],
    };
  },
  watch: {
    rows: {
      handler(newRows, oldRows) {
        this.setDefaultValues();
      },
      deep: true,
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
      deep: true,
    },
    "item.has_tax"() {
      if (this.item.has_tax == false) {
        this.item.taxPercent = 0;
        this.item.taxValue = 0;
      }
    },
  },
  mounted() {
    this.getUnits();
    this.getSalePriceTypes();
  },
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
.v-list-item {
  min-height: 30px !important;
}
</style>

