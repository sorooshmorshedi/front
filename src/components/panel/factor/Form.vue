<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body" @keyup.enter="validate(true)">
          <form-header
            formName="فاکتور"
            :title="'فاکتور ' + factorLabel"
            :ListRouteParams="{form: 'factor', type: factorType}"
            @clearForm="clearFactor(true)"
          >
            <router-link
              v-if="id && !isBack"
              class="btn btn-info"
              :to="{
              name: 'FactorForm',
              params: { factorType:reverseType(factorType)},
              query: {fromId: id}}"
            >
              ثبت فاکتور برگشت از
              <span v-html="factorLabel"></span>
            </router-link>
            <router-link class="btn btn-info" :to="{name: 'CreatePersonAccounts'}">تعریف حساب اشخاص</router-link>
            <template v-if="id">
              <button class="btn btn-info" data-toggle="modal" data-target="#exports-modal">خروجی</button>
              <router-link
                v-if="canSubmitTransaction"
                class="btn btn-info"
                :to="{name: 'TransactionForm', params: {transactionType: transactionType.name}, query:{accountId: factor.account.id, factorId: id}}"
              >ثبت {{ transactionType.label }}</router-link>
              <button
                class="btn btn-info"
                data-toggle="modal"
                data-target="#payments-modal"
              >مشاهده {{ transactionType.label }} ها</button>
            </template>
          </form-header>

          <div class="row">
            <div class="col-lg-8">
              <div class="row">
                <div class="form-group col-lg-2 col-sm-2">
                  <label>شماره فاکتور</label>
                  <input type="text" class="form-control" disabled v-model="factor.code">
                </div>
                <div class="form-group col-lg-2 col-sm-2">
                  <label>عطف</label>
                  <input type="text" class="form-control" disabled :value="factor.id">
                </div>
                <div class="col-lg-4 col-sm-2" v-if="factor.sanad">
                  <label>شماره سند</label>
                  <div class="input-group">
                    <input type="text" class="form-control" disabled :value="factor.sanad.code">
                    <div class="input-group-prepend d-print-none">
                      <button
                        @click="openSanad(factor.sanad.id)"
                        class="btn btn-outline-info"
                        type="button"
                        id="button-addon1"
                      >مشاهده سند</button>
                    </div>
                  </div>
                </div>
                <div class="form-group col-lg-2 col-sm-2">
                  <label class="required">تاریخ فاکتور</label>
                  <date
                    class="form-control"
                    v-model="factor.date"
                    :default="true"
                    :disabled="!editable"
                  />
                </div>
                <div class="form-group col-lg-2 col-sm-2">
                  <label class="required">ساعت فاکتور</label>
                  <mtime
                    class="form-control"
                    v-model="factor.time"
                    :default="true"
                    :disabled="!editable"
                  />
                </div>
                <div v-if="hasBijak" class="form-group col-lg-2 col-sm-2">
                  <label>بیجک</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model="factor.bijak"
                    :disabled="!editable"
                  >
                </div>

                <div class="form-group col-lg-2 col-sm-2">
                  <label>نوع فاکتور</label>
                  <input
                    type="text"
                    class="form-control"
                    disabled="1"
                    :value="factor.is_definite?'قطعی':'موقت'"
                  >
                </div>
                <div class="w-100"></div>
                <div class="col-lg-2">
                  <label>
                    <br>
                  </label>
                  <div class="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      class="custom-control-input"
                      id="customCheck1"
                      v-model="hasTax"
                      :disabled="!editable"
                    >
                    <label class="custom-control-label" for="customCheck1">فاکتور مالیات دارد</label>
                  </div>
                </div>
                <div class="form-group col-lg-4 col-sm-4">
                  <label class="required">{{ accountName }}</label>
                  <multiselect
                    dir="rtl"
                    :options="accountsSelectValues.persons"
                    v-model="factor.account"
                    track-by="id"
                    label="title"
                    :disabled="!editable || hasNotEditableRow"
                  />
                </div>
                <div
                  class="form-group col-lg-3 col-sm-4"
                  v-if="factor.account && factor.account.floatAccountGroup"
                >
                  <label>حساب شناور</label>
                  <multiselect
                    dir="rtl"
                    :options="factor.account.floatAccountGroup.floatAccounts"
                    v-model="factor.floatAccount"
                    track-by="id"
                    label="name"
                    :disabled="!editable || hasNotEditableRow"
                  />
                </div>
                <div class="form-group col-lg-2 d-print-none">
                  <button
                    v-if="factor.account"
                    @click="openLedger(factor.account)"
                    class="btn btn-info btn-block btn-label-margin"
                  >مشاهده دفتر</button>
                </div>
              </div>
            </div>
            <div class="form-group col-lg-4">
              <label>شرح</label>
              <textarea
                class="form-control"
                rows="5"
                v-model="factor.explanation"
                :disabled="!editable"
                @keyup.enter.stop
              ></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="table-responsive-lg">
                <table class="table table-striped table-bordered">
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
                    <tr
                      v-for="(row,i) in rows"
                      :key="i"
                      :class="{'d-print-none': i == rows.length-1}"
                    >
                      <td>{{ i+1 }}</td>
                      <td>
                        <ware-select
                          v-model="rows[i].ware"
                          :disabled="!editable || !row.is_editable"
                        />

                        <!-- <multiselect
                          :option-height="104"
                          dir="rtl"
                          :options="waresSelectValues.wares"
                          v-model="rows[i].ware"
                          track-by="id"
                          label="name"
                          :disabled="!editable || !row.is_editable"
                        />-->
                      </td>
                      <td>
                        <multiselect
                          v-if="rows[i].ware"
                          dir="rtl"
                          :allow-empty="false"
                          :options="waresSelectValues.warehouses"
                          v-model="rows[i].warehouse"
                          track-by="id"
                          label="name"
                          :disabled="!editable || !row.is_editable"
                        />
                        <span v-else>-</span>
                      </td>
                      <td>
                        <money
                          class="form-control form-control"
                          v-model="rows[i].count"
                          :disabled="!editable || !row.is_editable"
                          decimalScale="6"
                        />
                      </td>
                      <td>{{ rows[i].ware?rows[i].ware.unit.name:' - ' }}</td>
                      <td>
                        <money
                          class="form-control form-control"
                          v-model="rows[i].fee"
                          :disabled="!editable || !row.is_editable"
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
                          :disabled="!editable || hasValue(rows[i].discountPercent) || !row.is_editable"
                          class="form-control form-control"
                          v-model="rows[i].discountValue"
                        />
                      </td>
                      <td>
                        <input
                          :disabled="!editable || (hasValue(rows[i].discountValue) && !hasValue(rows[i].discountPercent)) || !row.is_editable"
                          type="number"
                          min="0"
                          max="100"
                          class="form-control form-control"
                          v-model="rows[i].discountPercent"
                        >
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
                        <input
                          type="text"
                          class="form-control form-control"
                          v-model="rows[i].explanation"
                          :disabled="!editable || !row.is_editable"
                        >
                      </td>
                      <td v-if="isBuy">
                        <money
                          v-if="rows[i].ware"
                          :disabled="!editable"
                          class="form-control form-control"
                          v-model="rows[i].sale_price"
                        />
                      </td>
                      <td class="d-print-none">
                        <button
                          v-if="i != rows.length-1"
                          @click="deleteItemRow(i)"
                          type="button"
                          class="btn btn-sm btn-warning"
                          :disabled="!editable || !row.is_editable"
                        >حذف ردیف</button>
                      </td>
                    </tr>
                    <tr class="bg-info text-white">
                      <td :colspan="hasTax?13:11"></td>
                      <td>
                        <button
                          @click="deleteItemRow(-1)"
                          type="button"
                          class="btn btn-danger d-print-none"
                          :disabled="!editable || hasNotEditableRow"
                        >حذف همه ردیف ها</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6 col-sm-6">
              <h5>
                هزینه های فاکتور
                <button
                  @click="factorExpensesModal()"
                  class="btn btn-info d-print-none"
                  :disabled="!editable"
                >افزودن / ویرایش</button>
              </h5>
              <div class="table-responsive-lg">
                <table class="table table-striped" v-if="factor.expenses.length">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>نام هزینه ثابت</th>
                      <th>مبلغ</th>
                      <th>پرداخت کننده</th>

                      <th>حساب شناور</th>
                      <th>توضیحات</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(e,i) in factor.expenses" :key="i">
                      <td>{{ i+1 }}</td>
                      <td>{{ e.expense.name }}</td>
                      <td>{{ e.value | toMoney }}</td>
                      <td>{{ e.account.title }}</td>
                      <td>{{ e.floatAccount?e.floatAccount.name:' - ' }}</td>
                      <td>{{ e.explanation }}</td>
                    </tr>
                    <tr class="bg-info text-white">
                      <td></td>
                      <td>جمع هزینه های فاکتور:</td>
                      <td>{{ sum.expenses | toMoney }}</td>
                      <td colspan="3"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="col-lg-6 col-sm-6">
              <div class="row">
                <div class="col-lg-12">
                  <table class="table table-bordered finals">
                    <tbody>
                      <tr>
                        <th>جمع:</th>
                        <td colspan="2">{{ sum.sum | toMoney }} ریال</td>
                      </tr>
                      <tr>
                        <th>تخفیف</th>
                        <td>
                          <money
                            :disabled="!editable || hasValue(factor.discountPercent)"
                            class="form-control"
                            v-model="factor.discountValue"
                            placeholder="مبلغ"
                          />
                        </td>
                        <td>
                          <input
                            :disabled="!editable || hasValue(factor.discountValue)"
                            type="number"
                            min="0"
                            max="100"
                            class="form-control"
                            v-model="factor.discountPercent"
                            placeholder="درصد"
                          >
                        </td>
                      </tr>
                      <tr>
                        <th>مبلغ فاکتور پس از تخفیف:</th>
                        <td colspan="2">{{ sum.afterDiscount | toMoney }} ریال</td>
                      </tr>
                      <tr v-if="hasTax">
                        <th>مالیات</th>
                        <td>
                          <money
                            :disabled="!editable || hasValue(factor.taxPercent)"
                            class="form-control"
                            v-model="factor.taxValue"
                            placeholder="مبلغ"
                          />
                        </td>
                        <td>
                          <input
                            :disabled="!editable || hasValue(factor.taxValue)"
                            type="number"
                            min="0"
                            max="100"
                            class="form-control"
                            v-model="factor.taxPercent"
                            placeholder="درصد"
                          >
                          <span v-if="factor.taxPercent">{{ sum.tax | toMoney }} ریال</span>
                        </td>
                      </tr>
                      <tr>
                        <th>مبلغ کل فاکتور:</th>
                        <td colspan="2">{{ sum.total | toMoney }} ریال</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <hr class="d-print-none">

          <form-footer
            formName="فاکتور"
            :hasFirst="hasFirst"
            :hasLast="hasLast"
            :hasPrev="hasPrev"
            :hasNext="hasNext"
            :editable="editable"
            :deletable="this.id"
            :canDelete="canDelete"
            :canSubmit="canSubmit"
            @goToForm="goToForm"
            @validate="validate"
            @edit="makeFormEditable()"
            @delete="deleteFactor()"
          >
            <template slot="always">
              <button
                v-if="this.id"
                @click="definiteFactor"
                :disabled="this.factor.is_definite"
                type="button"
                class="btn submit btn-primary foat-left w-100px"
              >قطعی کردن فاکتور</button>
            </template>
          </form-footer>
        </div>
      </div>
    </div>

    <div class="modal fade" id="factor-expenses-modal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">هزینه های ثابت فاکتور</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container">
              <div class="row">
                <div class="col-12">
                  <div class="table-responsive-lg">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th class="required">نام هزینه ثابت</th>
                          <th class="required">مبلغ</th>
                          <th class="required">پرداخت کننده</th>
                          <th>حساب شناور</th>
                          <th>توضیحات</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(e,i) in factorExpensesCopy" :key="i">
                          <td>{{ i+1 }}</td>
                          <td>
                            <multiselect
                              dir="rtl"
                              label="name"
                              track-by="id"
                              :options="factorsSelectValues.factorExpenses"
                              v-model="e.expense"
                            />
                          </td>
                          <td>
                            <money class="form-control" v-model="e.value"/>
                          </td>
                          <td>
                            <multiselect
                              dir="rtl"
                              label="title"
                              track-by="id"
                              :options="accountsSelectValues.levels[3]"
                              v-model="e.account"
                            />
                          </td>
                          <td>
                            <multiselect
                              v-if="e.account && e.account.floatAccountGroup"
                              dir="rtl"
                              label="name"
                              track-by="id"
                              :options="e.account.floatAccountGroup.floatAccounts"
                              v-model="e.floatAccount"
                            />
                            <span v-else>-</span>
                          </td>
                          <td>
                            <textarea class="form-control" v-model="e.explanation" rows="1"></textarea>
                          </td>
                          <td>
                            <button
                              v-if="i != factorExpensesCopy.length-1"
                              @click="deleteExpenseRow(i)"
                              type="button"
                              class="btn btn-sm btn-warning"
                            >حذف ردیف</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button @click="addExpenses()" type="button" class="btn btn-primary">تایید</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="payments-modal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">دریافت/ پرداخت های فاکتور</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12">
                <div class="table-responsive-lg">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>مبغ</th>
                        <th>کد دریافت/پرداخت</th>
                        <th>تاریخ</th>
                        <th>توضیحات</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(p,i) in factor.payments" :key="i">
                        <td>{{ i+1 }}</td>
                        <td>{{ p.value | toMoney }}</td>
                        <td>{{ p.transaction.code }}</td>
                        <td>{{ p.transaction.date }}</td>
                        <td>{{ p.transaction.explanation }}</td>
                        <td>
                          <a @click.prevent="openTransaction(p.transaction)" href="#/">مشاهده جزئیات</a>
                        </td>
                      </tr>
                      <tr>
                        <td>جمع:</td>
                        <td>{{ paymentsSum | toMoney }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button @click="addExpenses()" type="button" class="btn btn-primary">تایید</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="exports-modal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">خروجی</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-4">
                <div class="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="customCheck4"
                    v-model="exportOptions.summarized"
                  >
                  <label class="custom-control-label" for="customCheck4">خلاصه کردن فاکتور</label>
                </div>
              </div>
              <div class="col-4">
                <div class="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="customCheck2"
                    v-model="exportOptions.hide_expenses"
                  >
                  <label class="custom-control-label" for="customCheck2">مخفی کردن هزینه های فاکتور</label>
                </div>
              </div>
              <div class="col-4">
                <div class="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="customCheck3"
                    v-model="exportOptions.hide_remain"
                  >
                  <label class="custom-control-label" for="customCheck3">مخفی کردن مانده حساب</label>
                </div>
              </div>
              <div class="col-12 pt-3 text-center">
                <a
                  class="btn btn-info"
                  :href="exportLinks.factor.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >چاپ فاکتور</a>
                <a
                  class="btn btn-info"
                  :href="exportLinks.factor.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >PDF فاکتور</a>
                <a
                  class="btn btn-info"
                  :href="exportLinks.receipt.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >چاپ {{receiptLabel}}</a>
                <a
                  class="btn btn-info"
                  :href="exportLinks.receipt.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >PDF {{receiptLabel}}</a>
                <a
                  class="btn btn-info"
                  :href="exportLinks.preFactor.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >چاپ پیش فاکتور</a>
                <a
                  class="btn btn-info"
                  :href="exportLinks.preFactor.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >PDF پیش فاکتور</a>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">بستن</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountApi";
import factorApiMixin from "@/mixin/factorApi";
import wareApiMixin from "@/mixin/wareApi";
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import mtime from "@/components/mcomponents/cleave/Time";

import formComputed from "./formComputed.js";
import formMethods from "./formMethods.js";

export default {
  name: "Form",
  components: { money, date, mtime },
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
    factorApiMixin,
    formComputed,
    formMethods
  ],
  data() {
    return {
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
        is_editable: true,
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
  td {
    text-align: left;
  }
}

.table-responsive-lg {
  // overflow: visible;
  th,
  td,
  input {
    text-align: center;
  }
}
.custom-checkbox {
  padding-left: 0px;
  margin-left: 0px;
}
</style>

