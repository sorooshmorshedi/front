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
          v-if="hasTransaction"
          @click="transactionsDialog = true"
          class="light-blue white--text mr-1 mt-1 mt-md-0"
        >مشاهده {{ transactionLink.label }} ها</v-btn>

        <v-btn
          v-if="preFactor != null"
          class="light-blue white--text mr-1 mt-1 mt-md-0"
          target="_blank"
          :to="{name: 'FactorForm', params: {type: preFactor.type, isPreFactor: preFactor.isPreFactor, id: preFactor.id}}"
        >مشاهده {{ preFactor.label }}</v-btn>

        <v-btn
          v-if="hasTransaction && canSubmitTransaction"
          class="teal white--text mr-1 mt-1 mt-md-0"
          :to="transactionLink.to"
        >ثبت {{ transactionLink.label }}</v-btn>

        <v-menu bottom offset-y v-if="hasTransaction">
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
          v-if="hasReverseFactor"
          class="teal white--text mr-1 mt-1 mt-md-0"
          @click="reverseFactor"
        >
          ثبت
          <span v-html="reverseLabel"></span>
        </v-btn>
        <v-btn
          v-if="!isFpi && !isCw"
          class="teal lue white--text mr-1 mt-1 mt-md-0"
          :to="{name: 'Accounts', params: {level: 3, accountType: 'p'}, query: {showForm: true}}"
        >تعریف حساب اشخاص</v-btn>
        <v-btn
          v-if="!isFpi && !isCw && id != false"
          @click="exportsDialog = true"
          class="export-btn mr-1 mt-1 mt-md-0"
        >خروجی</v-btn>
      </template>

      <template>
        <v-row>
          <template v-if="isPreFactor || isRoR">
            <v-col cols="12" md="4">
              <v-text-field label="شماره " disabled :value="item.temporary_code" />
            </v-col>
          </template>
          <template v-else>
            <v-col cols="12" md="2" v-if="!isFpi">
              <v-text-field label="شماره موقت" disabled :value="item.temporary_code" />
            </v-col>
            <v-col cols="12" md="2" v-if="!isFpi">
              <v-text-field label="شماره قطعی" disabled v-model="item.code" />
            </v-col>
          </template>

          <v-col cols="12" md="2">
            <date
              label=" * تاریخ"
              required
              v-model="item.date"
              :default="true"
              :disabled="!isEditing || isConverted"
            />
          </v-col>
          <v-col cols="12" md="2">
            <mtime
              label=" * ساعت"
              required
              v-model="item.time"
              :default="true"
              :disabled="!isEditing || isConverted"
            />
          </v-col>
          <v-col cols="12" md="2" v-if="hasBijak">
            <v-text-field label="بیجک" v-model="item.bijak" :disabled="!isEditing || isConverted" />
          </v-col>
          <v-col cols="12" md="2" v-if="!isFpi & !isPreFactor & !isRoR">
            <v-text-field label="نوع" disabled :value="item.is_definite?'قطعی':'موقت'" />
          </v-col>
          <v-col cols="12" md="2" v-if="(isSale || isBackFromSale) && hasModule('distribution')">
            <v-autocomplete
              label="ویزیتور"
              :items="factorVisitors"
              v-model="item.visitor"
              item-text="user.name"
              item-value="id"
              :disabled="!isEditing || backFrom != null || item.backFrom != null || isConverted"
            />
          </v-col>
          <v-col cols="12" md="4" v-if="!isProduction">
            <account-select
              :label="' * ' + accountName"
              :itemsType="accountType"
              :visitorId="item.visitor"
              v-model="item.account"
              :disabled="!isEditing  || backFrom != null || item.backFrom != null || isConverted"
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
              :disabled="!isEditing || isConverted"
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
            <v-switch
              label="فاکتور مالیات دارد"
              v-model="item.has_tax"
              :disabled="!isEditing || isConverted"
            ></v-switch>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <input-table v-model="rows" id="input-table">
              <template #thead>
                <tr>
                  <th v-if="hasSelect" style="width: 24px"></th>
                  <th style="width: 32px">#</th>
                  <th style="width: 200px">* نام کالا</th>
                  <th style="width: 32px"></th>
                  <th>واحد</th>
                  <th>* انبار</th>
                  <th>* تعداد</th>

                  <template v-if="!isCw && !isRoR">
                    <th>* قیمت واحد</th>
                    <th>مبلغ کل</th>
                  </template>

                  <th v-if="showDiscount">تخفیف (مبلغ)</th>
                  <th v-if="showDiscount">تخفیف (درصد)</th>
                  <th v-if="showDiscount">جمع کل پس از تخفیف</th>

                  <template v-if="showTax && item.has_tax">
                    <th>مالیات (مبلغ)</th>
                    <th>مالیات (درصد)</th>
                    <th>جمع مبلغ کل و مالیات</th>
                  </template>

                  <th>توضیحات</th>
                  <th style="width: 32px" class="d-print-none"></th>
                </tr>
              </template>
              <template #tbody>
                <tr
                  v-for="(row,i) in rows"
                  :key="i"
                  :class="{'d-print-none': i == rows.length-1,'draggable': i != rows.length-1 && isEditing}"
                >
                  <td v-if="hasSelect">
                    <v-btn
                      v-if="row.factorItem"
                      color="blue"
                      class="mx-1"
                      dir="ltr"
                      :title="getFactorItemLink(row).title"
                      icon
                      outlined
                      :to="getFactorItemLink(row).to"
                      target="_blank"
                    >{{ getFactorItemLink(row).text }}</v-btn>
                    <v-checkbox v-else v-model="row.is_selected" class="mr-1" :disabled="isEditing"></v-checkbox>
                  </td>
                  <td class="tr-counter">{{ i+1 }}</td>
                  <td style="width: 200px">
                    <ware-select
                      v-model="rows[i].ware"
                      :disabled="!isEditing || row.factorItem"
                      :factorType="type"
                      :show-main-unit="false"
                      @change="clearRow(i)"
                    />
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
                      :items="getWareUnits(rows[i].ware)"
                      v-model="rows[i].unit"
                      :title="rows[i].unit?rows[i].unit.title:''"
                      @change="updateRowFee(rows[i])"
                      item-text="name"
                      item-value="id"
                      :disabled="!isEditing || row.factorItem"
                      :return-object="true"
                      :suffix="getUnitSuffix(row.ware, row.unit)"
                    ></v-autocomplete>
                  </td>
                  <td class="tr-warehouse" :title="rows[i].warehouse && rows[i].warehouse.name">
                    <v-autocomplete
                      :return-object="true"
                      v-if="rows[i].ware && !rows[i].ware.isService"
                      v-model="rows[i].warehouse"
                      :disabled="!isEditing || row.factorItem"
                      :items="warehouses"
                      item-text="name"
                      item-value="id"
                    ></v-autocomplete>
                    <span v-else>-</span>
                  </td>
                  <td>
                    <money v-model="rows[i].unit_count" :disabled="!isEditing || row.factorItem" />
                  </td>
                  <template v-if="!isCw && !isRoR">
                    <td>
                      <v-menu
                        bottom
                        offset-y
                        left
                        v-if="isSale || isBackFromBuy"
                        v-model="priceMenus[i]"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <div class="d-flex flex-row">
                            <money
                              v-model="rows[i].fee"
                              :disabled="!isEditing || row.factorItem"
                              v-bind="attrs"
                              v-on="on"
                              @click:suffix="priceMenus[i] = true"
                            />
                            <span
                              class="mt-2 mr-1"
                              style="font-size: 10px; white-space: nowrap"
                            >{{ getFeeSuffix(row) }}</span>
                          </div>
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
                      <money v-else v-model="rows[i].fee" :disabled="!isEditing || row.factorItem" />
                    </td>
                    <td dir="ltr">
                      <money :value="rowSum(rows[i])" disabled :decimalScale="0" />
                    </td>
                  </template>

                  <template v-if="showDiscount">
                    <td>
                      <money
                        :disabled="!isEditing || hasValue(rows[i].discountPercent) || row.factorItem"
                        v-model="rows[i].discountValue"
                      />
                    </td>
                    <td>
                      <v-text-field
                        :disabled="!isEditing || (hasValue(rows[i].discountValue) && !hasValue(rows[i].discountPercent)) || row.factorItem"
                        type="number"
                        min="0"
                        max="100"
                        v-model="rows[i].discountPercent"
                      />
                    </td>
                    <td>
                      <money :value="rowSumAfterDiscount(row)" :decimalScale="0" disabled />
                    </td>
                  </template>

                  <template v-if="item.has_tax">
                    <td>
                      <money
                        :disabled="!isEditing || hasValue(rows[i].tax_percent) || row.factorItem"
                        v-model="rows[i].tax_value"
                      />
                    </td>
                    <td>
                      <v-text-field
                        :disabled="!isEditing || (hasValue(rows[i].tax_value) && !hasValue(rows[i].tax_percent)) || row.factorItem"
                        type="number"
                        min="0"
                        max="100"
                        v-model="rows[i].tax_percent"
                      />
                    </td>
                    <td>
                      <money :decimalScale="0" :value="rowSumAfterTax(row)" disabled />
                    </td>
                  </template>

                  <td>
                    <row-textarea
                      v-model="rows[i].explanation"
                      :disabled="!isEditing || row.factorItem"
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
                      :disabled="!isEditing || row.factorItem"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
                <tr class="grey lighten-3 text-white">
                  <td v-if="hasSelect"></td>
                  <td colspan="4"></td>

                  <td v-if="isFpi">{{ rowsSum('count') | toMoney(0) }}</td>
                  <td v-else></td>

                  <td v-if="!isCw && !isRoR"></td>

                  <td v-if="isFpi">{{ sum.sum | toMoney(0) }}</td>
                  <td v-else></td>

                  <td v-if="isProduction"></td>

                  <td></td>
                  <td v-if="showDiscount" colspan="4"></td>
                  <td v-if="showTax && item.has_tax" colspan="3"></td>
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

        <v-row v-if="!isCw && !isRoR">
          <v-col cols="12" md="8">
            <div v-if="showFactorExpenses" class="pa-3 ml-md-5" style="border: 1px dashed #9e9e9e">
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
                <tr v-if="showDiscount || showTax">
                  <td>جمع:</td>
                  <td colspan="2">{{ sum.sum | toMoney(0) }} ریال</td>
                </tr>
                <tr v-if="showDiscount">
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
                <tr v-if="showDiscount">
                  <td>مبلغ فاکتور پس از تخفیف:</td>
                  <td colspan="2">{{ sum.afterDiscount | toMoney(0) }} ریال</td>
                </tr>
                <tr v-if="item.has_tax">
                  <td>مالیات</td>
                  <td colspan="2">
                    <money :disabled="!isEditing" v-model="item.taxValue" placeholder="مبلغ" />
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
          v-if="id && !isFpi && !isPreFactor && !isRoR"
          @click="definiteFactor"
          :disabled="item.is_definite"
          class="blue white--text mr-1"
        >قطعی کردن فاکتور</v-btn>

        <v-btn
          v-if="isPreFactor && !isEditing"
          @click="convertPreFactorToFactor"
          class="blue white--text mr-1"
        >تبدیل به فاکتور</v-btn>

        <template v-if="isRoR && !isEditing">
          <v-btn
            @click="convertRoRToFactor(RoRFactorTypes[type].factor.type)"
            class="blue white--text mr-1"
          >تبدیل به فاکتور {{ RoRFactorTypes[type].factor.label }}</v-btn>
          <v-btn
            @click="convertRoRToFactor(RoRFactorTypes[type].backFactor.type)"
            class="blue white--text mr-1"
          >تبدیل به فاکتور {{ RoRFactorTypes[type].backFactor.label }}</v-btn>
        </template>
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
                :item-per-page="5"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FormLogic from "./FormLogic";

export default {
  name: "Form",
  mixins: [FormLogic],
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

<style lang="scss">
#input-table {
  table {
    table-layout: fixed;
    th {
      padding: 0;
    }
  }
}
</style>