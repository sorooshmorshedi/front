<template>
  <m-form
    title="بارگیری شرکت نفت"
    :isEditing.sync="isEditing"
    :showList="false"
    :listRoute="{name:'OilCompanyLadingsList'}"
    exportBaseUrl="dashtbashi/export/oilCompanyLadings"
    :exportParams="{id: id}"
    :canDelete="canDelete"
    :canSubmit="canSubmit"
    :confirmBtnText="confirmBtnText"
    :cancelConfirmBtnText="cancelConfirmBtnText"
    :canConfirm="canConfirm"
    :canCancelConfirm="canCancelConfirm"
    @cancelConfirm="cancelConfirm"
    @confirm="confirm"
    @goToForm="getItemByPosition"
    @submit="submit"
    @delete="deleteItem"
    @clearForm="clearForm()"
  >
    <template #header-btns>
      <open-sanad-btn v-if="item.sanad" :sanad="item.sanad" />
    </template>

    <template>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field label="عطف" v-model="item.local_id" disabled />
        </v-col>
        <v-col cols="12" md="2">
          <v-autocomplete
            label="ماه"
            :items="months"
            v-model="item.month"
            :return-object="false"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="2">
          <date v-model="item.date" label="تاریخ ثبت" :default="true" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="3">
          <date
            v-model="item.list_date"
            label="تاریخ سیاهه"
            :default="true"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="3">
          <date v-model="item.export_date" label="خروجی" :default="true" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            :return-object="true"
            label="حمل کننده"
            v-model="item.driving"
            :items="$store.state.drivings"
            item-text="title"
            item-value="id"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="8">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing"></v-textarea>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-if="item.created_by"
            label="کاربر"
            disabled
            v-model="item.created_by.name"
          />
        </v-col>

        <v-col cols="12">
          <v-simple-table class="form-items">
            <thead>
              <tr>
                <th>#</th>
                <th>تاریخ بارگیری</th>
                <th>شماره بارنامه</th>
                <th>مبدا</th>
                <th>مقصد</th>
                <th>وزن</th>
                <th>مبلغ ناخالص</th>
                <th>حق بیمه تامین اجتماعی</th>
                <th>درصد مالیات بر ارزش افزوده</th>
                <th>مبلغ مالیات بر ارزش افزوده</th>
                <th>درصد عوارض بر ارزش افزوده</th>
                <th>مبلغ عوارض بر ارزش افزوده</th>
                <th>مبلغ کل با ارزش افزوده</th>
                <th>مبلغ خالص</th>
                <th>کمیسیون شرکت</th>
                <th>درآمد ماشین</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row,i) in rows" :key="i" :class="{'d-print-none': i == rows.length-1}">
                <td class="tr-counter">{{ i+1 }}</td>
                <td>
                  <date v-model="row.date" :default="true" :disabled="!isEditing" />
                </td>
                <td>
                  <v-text-field v-model="row.bill_number" :disabled="!isEditing" />
                </td>
                <td class="tr-city">
                  <city-select v-model="row.origin" :disabled="!isEditing" />
                </td>
                <td class="tr-city">
                  <city-select v-model="row.destination" :disabled="!isEditing" />
                </td>
                <td>
                  <money v-model="row.weight" :disabled="!isEditing" />
                </td>
                <td>
                  <money v-model="row.gross_price" :disabled="!isEditing" />
                </td>
                <td>
                  <money v-model="row.insurance_price" :disabled="!isEditing" />
                </td>
                <td>
                  <v-text-field type="number" v-model="row.tax_percent" :disabled="!isEditing" />
                </td>
                <td>
                  <money :value="taxPrice(row)" disabled :decimalScale="0" />
                </td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="row.complication_percent"
                    :disabled="!isEditing"
                  />
                </td>
                <td>
                  <money :value="complicationPrice(row)" disabled :decimalScale="0" />
                </td>
                <td>
                  <money :value="rowSum(row)" :disabled="true" :decimalScale="0" />
                </td>
                <td>
                  <money :value="netPrice(row)" :disabled="true" :decimalScale="0" />
                </td>
                <td>
                  <money :value="companyCommission(row)" :disabled="true" :decimalScale="0" />
                </td>
                <td>
                  <money :value="carIncome(row)" :disabled="true" :decimalScale="0" />
                </td>
                <td class="d-print-none">
                  <v-btn
                    v-if="i != rows.length-1"
                    @click="deleteRow(i)"
                    class="red--text"
                    icon
                    :disabled="!isEditing"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr class="grey lighten-3 text-white">
                <td colspan="4" class="text-right">مجموع:</td>
                <td>{{ rowsSum('weight') | toMoney(0) }}</td>
                <td>{{ rowsSum('gross_price') | toMoney(0) }}</td>
                <td>{{ rowsSum('insurance_price') | toMoney(0) }}</td>
                <td></td>
                <td>{{ rowsTaxPrice | toMoney(0) }}</td>
                <td></td>
                <td>{{ rowsComplicationPrice | toMoney(0) }}</td>
                <td>{{ rowsSum('sum') | toMoney(0) }}</td>
                <td>{{ rowsSum('net_price') | toMoney(0) }}</td>
                <td>{{ rowsSum('company_commission') | toMoney(0) }}</td>
                <td>{{ rowsSum('car_income') | toMoney(0) }}</td>
                <td class="d-print-none">
                  <v-btn @click="deleteRow(-1)" icon class="red--text" :disabled="!isEditing">
                    <v-icon>delete_sweep</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>

<script>
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";

import GetApi from "./GetApi";
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";

export default {
  name: "Form",
  components: { money, date },
  mixins: [formsMixin, GetApi, MFormMixin],
  props: ["id"],
  data() {
    return {
      hasList: false,
      hasIdProp: true,
      baseUrl: "dashtbashi/oilCompanyLadings",
      leadingSlash: true,
      permissionBasename: "oilCompanyLading",
    };
  },
  computed: {
    rowsTaxPrice() {
      let sum = 0;
      for (let row of this.rows) {
        sum += +this.taxPrice(row);
      }
      return +sum.toFixed(6);
    },
    rowsComplicationPrice() {
      let sum = 0;
      for (const row of this.rows) {
        sum += +this.complicationPrice(row);
      }
      return +sum.toFixed(6);
    },
  },
  watch: {
    rows: {
      handler() {
        let row = this.rows[this.rows.length - 1];
        if (row && row.gross_price) {
          this.rows.push(this.getRowTemplate());
        }
      },
      deep: true,
    },
  },
  methods: {
    getItemTemplate() {
      return {};
    },
    getData() {
      this.getDrivings();
    },
    getRowTemplate() {
      return {
        sum: 0,
        net_price: 0,
        gross_price: 0,
        insurance_price: 0,
        tax_percent: this.getOptionValue("taxPercent"),
        company_commission_percent: +this.getOptionValue(
          "companyCommissionFromOilCompanyLading"
        ),
        complication_percent: this.getOptionValue(
          "addedValuePercentOfOilCompanyLading"
        ),
      };
    },
    taxPrice(row) {
      row.tax_value = (+row.tax_percent * +row.gross_price) / 100 || 0;
      return row.tax_value;
    },
    complicationPrice(row) {
      row.complication_price = +(
        (+row.complication_percent * +row.gross_price) / 100 || 0
      ).toFixed(6);
      return row.complication_price;
    },
    rowSum(row) {
      let sum =
        (+row.gross_price || 0) +
        this.taxPrice(row) +
        this.complicationPrice(row) -
        (+row.insurance_price || 0);
      row.total_value = sum;
      return sum;
    },
    netPrice(row) {
      let value = +row.gross_price - +row.insurance_price;
      row.net_price = value;
      return value;
    },
    companyCommission(row) {
      let value =
        (this.netPrice(row) * +row.company_commission_percent) / 100 || 0;
      row.company_commission = +value.toFixed(6);
      return value;
    },
    carIncome(row) {
      let value = this.netPrice(row) - this.companyCommission(row) || 0;
      row.car_income = +value.toFixed(6);
      return value;
    },
    getItemByPosition(position) {
      return this.request({
        url: this.endpoint("dashtbashi/oilCompanyLadings/byPosition"),
        method: "get",
        params: {
          id: this.id,
          position: position,
        },
        success: (data) => {
          this.setItem(data);
        },
      });
    },
    setItem(item) {
      this.item = item;
      this.itemsToDelete = [];
      this.rows = [];
      item.items.forEach((item) => {
        let row = { ...item };
        this.rows.push(row);
      });
      this.rows.push(this.getRowTemplate());
      this.changeRouteTo(item.id);
    },
    deleteRow(index) {
      if (index == -1) {
        this.rows.forEach((row) => {
          if (row.id) this.itemsToDelete.push(row.id);
        });
        this.rows.splice(0, this.rows.length - 1);
      } else {
        let row = this.rows[index];
        if (row.id) this.itemsToDelete.push(row.id);
        this.rows.splice(index, 1);
      }
    },
    getSerialized() {
      let data = {
        form: this.extractIds(this.item),
        items: {
          ids_to_delete: this.itemsToDelete,
          items: [],
        },
      };

      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;

        let item = this.copy(row);
        item = this.extractIds(item);
        let decimalKeys = [
          "gross_price",
          "insurance_price",
          "tax_value",
          "complication_value",
          "total_value",
          "complication_pricde",
          "company_commission",
          "car_income",
          "net_price",
        ];
        for (const key of decimalKeys) {
          if (item[key]) item[key] = Number(item[key]).toFixed(6);
        }
        data.items.items.push(item);
      });

      data.form.car_income = this.rowsSum("car_income");
      data.form.company_commission = this.rowsSum("company_commission");
      data.form.total_value = this.rowsSum("total_value");
      data.form.gross_price = this.rowsSum("gross_price");
      data.form.insurance_price = this.rowsTaxPrice;
      data.form.tax_price = this.rowsTaxPrice;
      data.form.complication_price = this.rowsComplicationPrice;
      data.form.weight = this.rowsSum("weight");

      return data;
    },
  },
};
</script>

<style scoped lang="scss"></style>

