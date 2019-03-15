<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <form-header
            formName="فاکتور"
            :title="'فاکتور ' + factorLabel"
            :ListRouteParams="{form: 'factor', type: factorType}"
            @clearForm="clearSanad()"
          >
            <template v-if="id">
              <div class="dropdown d-inline">
                <button
                  class="btn btn-info dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                >خروجی</button>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
                  <a
                    v-for="(el, i) in exportLinks"
                    :key="i"
                    class="dropdown-item"
                    :href="el.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >{{ el.name }}</a>
                  <!-- <div class="dropdown-divider"></div> -->
                </div>
              </div>

              <router-link
                v-if="canSubmitTransaction"
                class="btn btn-info"
                :to="{name: 'TransactionForm', params: {transactionType: transactionType.name}, query:{factorId: id}}"
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
                  <input
                    v-if="factor.id"
                    type="text"
                    class="form-control"
                    disabled
                    v-model="factor.code"
                  >
                  <input v-else type="text" class="form-control" disabled :value="factorCode">
                </div>
                <div class="col-lg-4 col-sm-2" v-if="factor.sanad">
                  <label>شماره سند</label>
                  <div class="input-group">
                    <input type="text" class="form-control" disabled :value="factor.sanad">
                    <div class="input-group-prepend d-print-none">
                      <button
                        @click="openSanad(factor.sanad)"
                        class="btn btn-outline-info"
                        type="button"
                        id="button-addon1"
                      >مشاهده سند</button>
                    </div>
                  </div>
                </div>
                <div class="form-group col-lg-2 col-sm-2">
                  <label>تاریخ فاکتور</label>
                  <date class="form-control" v-model="factor.date" :default="true"/>
                </div>
                <div class="form-group col-lg-2 col-sm-2">
                  <label>ساعت فاکتور</label>
                  <mtime class="form-control" v-model="factor.time" :default="true"/>
                </div>
                <div v-if="hasBijak" class="form-group col-lg-2 col-sm-2">
                  <label>بیجک</label>
                  <input type="number" class="form-control" v-model="factor.bijak">
                </div>
                <div class="w-100"></div>
                <div class="col-lg-2 d-print-none">
                  <label>
                    <br>
                  </label>
                  <div class="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      class="custom-control-input"
                      id="customCheck1"
                      v-model="hasTax"
                    >
                    <label class="custom-control-label" for="customCheck1">فاکتور مالیات دارد</label>
                  </div>
                </div>
                <div class="form-group col-lg-4 col-sm-4">
                  <label>{{ accountName }}</label>
                  <multiselect
                    v-tooltip="accountRemain(factor.account)"
                    dir="rtl"
                    :options="accountsSelectValues.persons"
                    v-model="factor.account"
                    track-by="id"
                    label="title"
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
              <label>توضیحات</label>
              <textarea class="form-control" rows="5" v-model="factor.exp"></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="table-responsive-lg">
                <table class="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>شرح</th>
                      <th>انبار</th>
                      <th>تعداد</th>
                      <th>واحد</th>
                      <th>قیمت واحد</th>
                      <th>جمع</th>
                      <th>تخفیف (مبلغ)</th>
                      <th>تخفیف (درصد)</th>
                      <th>جمع کل پس از تخفیف</th>

                      <th v-if="hasTax">مالیات</th>
                      <th v-if="hasTax">جمع مبلغ کل و مالیات</th>
                      <th>توضیحات</th>
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
                        <multiselect
                          :option-height="104"
                          dir="rtl"
                          :options="waresSelectValues.wares"
                          v-model="rows[i].ware"
                          track-by="id"
                          label="title"
                          @select="setDefaultValue"
                        />
                      </td>
                      <td>
                        <multiselect
                          v-if="rows[i].ware"
                          dir="rtl"
                          :allow-empty="false"
                          :options="waresSelectValues.warehouses"
                          v-model="rows[i].ware.warehouse"
                          track-by="id"
                          label="title"
                        />
                        <span v-else>-</span>
                      </td>
                      <td>
                        <money class="form-control form-control" v-model="rows[i].count"/>
                      </td>
                      <td>{{ rows[i].ware?rows[i].ware.unit.name:' - ' }}</td>
                      <td>
                        <money class="form-control form-control" v-model="rows[i].fee"/>
                      </td>
                      <td dir="ltr">
                        <money class="form-control form-control" :value="rowSum(row)" disabled/>
                      </td>
                      <td>
                        <money
                          :disabled="hasValue(rows[i].discountPercent)"
                          class="form-control form-control"
                          v-model="rows[i].discountValue"
                        />
                      </td>
                      <td>
                        <input
                          :disabled="hasValue(rows[i].discountValue)"
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
                          disabled
                        />
                      </td>
                      <td v-if="hasTax">
                        <money class="form-control form-control" :value="rowTax(row)" disabled/>
                      </td>
                      <td v-if="hasTax">
                        <money
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
                        >
                      </td>
                      <td class="d-print-none">
                        <button
                          v-if="i != rows.length-1"
                          @click="deleteItemRow(i)"
                          type="button"
                          class="btn btn-sm btn-warning"
                        >حذف ردیف</button>
                      </td>
                    </tr>
                    <tr class="bg-info text-white">
                      <td :colspan="hasTax?13:11"></td>
                      <td>
                        <button
                          @click="deleteItemRow(0)"
                          type="button"
                          class="btn btn-danger d-print-none"
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
                            :disabled="hasValue(factor.discountPercent)"
                            class="form-control"
                            v-model="factor.discountValue"
                            placeholder="مبلغ"
                          />
                        </td>
                        <td>
                          <input
                            :disabled="hasValue(factor.discountValue)"
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
                            :disabled="hasValue(factor.taxPercent)"
                            class="form-control"
                            v-model="factor.taxValue"
                            placeholder="مبلغ"
                          />
                        </td>
                        <td>
                          <input
                            :disabled="hasValue(factor.taxValue)"
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
            @goToForm="goToForm"
            @validate="validate"
          />
          <!-- <div class="row d-print-none">
            <div class="col-12 text-left">
              <button
                @click="validate(false)"
                type="button"
                class="btn submit btn-primary loat-left w-100px"
              >ثبت</button>
              <button
                @click="validate(true)"
                type="button"
                class="btn submit btn-primary foat-left"
              >ثبت و صدور فاکتور جدید</button>
            </div>
          </div>-->
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
            <div class="container-fluid">
              <div class="row">
                <div class="col-12">
                  <div class="table-responsive-lg">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>نام هزینه ثابت</th>
                          <th>مبلغ</th>
                          <th>پرداخت کننده</th>
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
                        <td>{{ p.value }}</td>
                        <td>{{ p.transaction.code }}</td>
                        <td>{{ p.transaction.date }}</td>
                        <td>{{ p.transaction.explanation }}</td>
                        <td>
                          <a @click.prevent="openTransaction(p.transaction)" href="#/">مشاهده جزئیات</a>
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
            <button @click="addExpenses()" type="button" class="btn btn-primary">تایید</button>
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
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import mtime from "@/components/mcomponents/cleave/Time";
import FormFooter from "@/components/panel/FormFooter";
import FormHeader from "@/components/panel/FormHeader";
export default {
  name: "Form",
  components: { money, date, mtime, FormFooter, FormHeader },
  props: ["factorType", "id"],
  mixins: [accountApiMixin, wareApiMixin, factorApiMixin],
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
        fee: ""
      },
      itemsToDelete: [],
      expensesToDelete: [],
      factorLabel: ""
    };
  },
  created() {
    this.initForm();
  },
  methods: {
    getData() {
      this.getAccounts();
      this.getFactorCodes();
      this.getWarehouses();
      this.getWares();
      this.getFactorExpenses();
      if (this.id) {
        this.getFactor(this.id);
      }
    },
    initForm() {
      this.log("Init Form");
      if (!this.id) {
        this.factor = {
          taxPercent: "",
          taxValue: "",
          discountPercent: "",
          discountValue: "",
          expenses: []
        };
        this.rows = [];
        this.rows.push(this.copy(this.rowTemplate));
      }
      this.setFactorLabel(this.factorType);
      this.getData();
    },
    setDefaultValue(ware) {
      let value = ware.price;
      console.log(value);
      this.$nextTick(() => {
        this.rows.forEach(row => {
          if (!row.ware) return;
          if (row.ware.id == ware.id) {
            row.fee = value;
            return;
          }
        });
      });
    },
    setFactorLabel(factorType) {
      switch (factorType) {
        case "sale":
          this.factorLabel = "فروش";
          break;
        case "backFromSale":
          this.factorLabel = "برگشت از فروش";
          break;
        case "buy":
          this.factorLabel = "خرید";
          break;
        case "backFromBuy":
          this.factorLabel = "برگشت از خرید";
          break;
      }
    },
    validate(clearFactor = false) {
      let isValid = true;
      if (this.rows.length == 1) {
        this.notify(`لطفا حداقل یک ردیف وارد کنید`, "danger");
        isValid = false;
      }
      this.rows.forEach((r, i) => {
        if (i == this.rows.length - 1) return;
        if (!r.count || r.count == 0) {
          this.notify(`لطفا تعداد ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
        if (r.fee == undefined) {
          this.notify(`لطفا قیمت واحد ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
      });
      if (!isValid) return;

      ["discountPercent", "discountValue", "taxPercent", "taxValue"].forEach(
        k => {
          if (this.factor[k] == "") this.factor[k] = 0;
        }
      );

      this.factor.type = this.factorType;
      this.checkInventories(clearFactor);
    },
    selectFactor(factor, changeRoute = false) {
      this.log("Selecting Factor : ", factor);
      this.factor = factor;
      this.itemsToDelete = [];
      this.rows = factor.items;
      this.rows.push(this.copy(this.rowTemplate));
      this.setFactorLabel(factor.type);

      if (changeRoute) {
        this.$router.push({
          name: "FactorForm",
          params: {
            id: factor.id,
            factorType: factor.type
          }
        });
      }
    },
    deleteItemRow(index) {
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
    deleteExpenseRow(index) {
      let row = this.factorExpensesCopy[index];
      if (row.id) this.expensesToDelete.push(row.id);
      this.factorExpensesCopy.splice(index, 1);
    },
    rowSum(row) {
      if (!this.hasValue(row.fee) || !this.hasValue(row.count)) return 0;
      return +row.fee * +row.count;
    },
    rowDiscount(row) {
      if (!this.rowSum(row)) return 0;
      if (
        !this.hasValue(row.discountValue) &&
        !this.hasValue(row.discountPercent)
      )
        return 0;
      if (this.hasValue(row.discountValue)) return +row.discountValue;
      else return +((this.rowSum(row) * +row.discountPercent) / 100).toFixed(2);
    },
    rowSumAfterDiscount(row) {
      return this.rowSum(row) - this.rowDiscount(row);
    },
    rowTax(row) {
      if (!this.rowSumAfterDiscount(row)) return 0;
      if (!this.factor.taxPercent) return 0;
      return +(
        (this.rowSumAfterDiscount(row) * +this.factor.taxPercent) /
        100
      ).toFixed(2);
    },
    rowSumAfterTax(row) {
      if (!this.rowTax(row)) return this.rowSumAfterDiscount(row);
      return this.rowSumAfterDiscount(row) + this.rowTax(row);
    },
    factorExpensesModal() {
      if (this.factor.expenses.length) {
        this.factorExpensesCopy = [];
        this.factor.expenses.forEach(e => {
          this.factorExpensesCopy.push(this.copy(e));
        });
      }
      $("#factor-expenses-modal").modal("show");
    },
    addExpenses() {
      let isValid = true;
      this.factorExpensesCopy.forEach((e, i) => {
        if (i == this.factorExpensesCopy.length - 1) return;
        if (!e.expense) {
          this.notify(`لطفا نام هزینه ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
        if (!e.value || e.value == 0) {
          this.notify(`لطفا مبلغ ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
        if (!e.account) {
          this.notify(
            `لطفا حساب پرداخت کننده ردیف ${i + 1} را وارد کنید`,
            "danger"
          );
          isValid = false;
        }
        if (e.account && e.account.floatAccountGroup && !e.floatAccount) {
          this.notify(`لطفا حساب شناور ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
      });

      if (!isValid) return;

      $("#factor-expenses-modal").modal("hide");

      this.factor.expenses = this.copy(this.factorExpensesCopy);
      this.factor.expenses.pop();
      this.factorExpensesCopy = [{}];
    },
    goToForm(pos) {
      let newCode = null;
      switch (pos) {
        case "next":
          newCode = this.factor.code + 1;
          break;
        case "prev":
          newCode = this.factor.code
            ? this.factor.code - 1
            : this.factorCode - 1;
          break;
        case "first":
          newCode = 1;
          break;
        case "last":
          newCode = this.factorCode - 1;
          break;
      }
      if (newCode) this.getFactorByCode(newCode);
    }
  },
  computed: {
    canSubmitTransaction() {
      if (!this.id) return false;
      return this.factor.paidValue < this.sum.total;
    },
    exportLinks() {
      let url =
        "reports/lists/factors/TEMP?form=factor&type=" +
        this.factorType +
        "&id=" +
        this.id;
      url = this.endpoint(url);
      let html = url.replace("TEMP", "html");
      let pdf = url.replace("TEMP", "pdf");
      return [
        {
          name: 'چاپ فاکتور',
          url: html,
        },
        {
          name: 'PDF فاکتور',
          url: pdf,
        },
        {
          name: 'چاپ فاکتور خلاصه',
          url: html + '&summarized=1',
        },
        {
          name: 'PDF فاکتور خلاصه',
          url: pdf + '&summarized=1',
        },
        {
          name: 'چاپ فاکتور به تنهایی',
          url: html + '&hide_expenses=1',
        },
        {
          name: 'PDF فاکتور به تنهایی',
          url: pdf + '&hide_expenses=1',
        },
        {
          name: 'چاپ هزینه های فاکتور',
          url: html + '&hide_factor=1',
        },
        {
          name: 'PDF هزینه های فاکتور',
          url: pdf + '&hide_factor=1',
        },
      ]
    },
    sum() {
      let res = {
        sum: 0,
        afterDiscount: 0,
        tax: 0,
        discount: 0,
        afterTax: 0,
        total: 0,
        expenses: 0
      };
      this.rows.forEach(r => {
        res.sum += this.rowSum(r);
        res.afterDiscount += this.rowSumAfterDiscount(r);
        res.tax += this.rowTax(r);
        res.afterTax += this.rowSumAfterTax(r);
        res.total += this.rowSumAfterTax(r); // + factorExpenses
      });
      this.factor.expenses.forEach(e => {
        res.expenses += +e.value;
      });

      if (this.hasValue(this.factor.discountValue)) {
        res.afterDiscount -= +this.factor.discountValue;
      } else {
        res.afterDiscount =
          (res.afterDiscount * (100 - +this.factor.discountPercent)) / 100;
      }

      if (this.hasValue(this.factor.taxValue)) {
        res.afterTax += +this.factor.taxValue;
        res.tax += +this.factor.taxValue;
        res.total += +this.factor.taxValue;
      }

      return res;
    },
    warehouseWares() {
      let res = [];
      this.rows.forEach((r, i) => {
        if (!r.warehouse) res.push([]);
        else {
          res.push(
            this.wares.filter(w => {
              return w.warehouse.id == r.warehouse.id;
            })
          );
        }
      });
      return res;
    },
    accountName() {
      if (["buy", "backFromSale"].includes(this.factorType)) {
        return "فروشنده";
      } else {
        return "مشتری";
      }
    },
    hasBijak() {
      return ["buy", "backFromBuy"].includes(this.factorType);
    },
    hasFirst() {
      if (this.factorCode == 1) return false;
      return true;
    },
    hasNext() {
      if (!this.factor.code) return false;
      if (this.factor.code == this.factorCode - 1) return false;
      if (!this.id) return false;
      return true;
    },
    hasPrev() {
      if (this.factorCode == 1) return false;
      if (this.factor.code == 1) return false;
      return true;
    },
    hasLast() {
      if (this.factorCode == 1) return false;
      return true;
    },
    transactionType() {
      let label;
      let name;
      if (["buy", "backFromSale"].includes(this.factorType)) {
        name = "payment";
        label = "پرداخت ";
      } else {
        name = "receive";
        label = "دریافت ";
      }
      return {
        label,
        name
      };
    }
  },
  watch: {
    $route() {
      // this.initForm();
    },
    rows: {
      handler(newRows, oldRows) {
        let row = this.rows[this.rows.length - 1];
        if (row && row.ware) {
          this.rows.push({
            discountValue: "",
            discountPercent: ""
          });
        }
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

