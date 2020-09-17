<template>
  <m-form
    title="بارگیری شرکت نفت"
    :isEditing.sync="isEditing"
    :showList="false"
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
    <template>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field label="عطف" v-model="item.id" disabled />
        </v-col>
        <v-col cols="12" md="2">
          <date v-model="item.date" label="تاریخ سیاهه" :default="true" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="2">
          <date
            v-model="item.export_date"
            label="تاریخ گرفتن خروجی"
            :default="true"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete
            :return-object="true"
            label="ماشین"
            v-model="item.car"
            :items="$store.state.cars"
            item-text="car_number_str"
            item-value="id"
          />
        </v-col>
        <v-col cols="12" md="9">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing"></v-textarea>
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-if="item.created_by"
            label="ثبت کننده"
            disabled
            v-model="item.created_by.name"
          />
        </v-col>

        <v-col cols="12">
          <v-simple-table class="form-items">
            <thead>
              <tr>
                <th>#</th>
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
                  <money v-model="row.gross_price" :disabled="!isEditing" />
                </td>
                <td>
                  <money v-model="row.insurance_price" :disabled="!isEditing" />
                </td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="row.tax_percent"
                    :disabled="!isEditing || hasValue(row.tax_price)"
                  />
                </td>
                <td>
                  <money
                    v-if="!hasValue(row.tax_percent)"
                    v-model="row.tax_price"
                    :disabled="!isEditing"
                  />
                  <money v-else :value="taxPrice(row)" disabled />
                </td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="row.complication_percent"
                    :disabled="!isEditing || hasValue(row.complication_price)"
                  />
                </td>
                <td>
                  <money
                    v-if="!hasValue(row.complication_percent)"
                    v-model="row.complication_price"
                    :disabled="!isEditing"
                  />
                  <money v-else :value="complicationPrice(row)" disabled />
                </td>
                <td>
                  <money :value="rowSum(row)" :disabled="true" />
                </td>
                <td>
                  <money :value="netPrice(row)" :disabled="true" />
                </td>
                <td>
                  <money :value="companyCommission(row)" :disabled="true" />
                </td>
                <td>
                  <money :value="carIncome(row)" :disabled="true" />
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
                <td class="text-left">مجموع:</td>
                <td>{{ rowsSum('gross_price') | toMoney }}</td>
                <td>{{ rowsSum('insurance_price') | toMoney }}</td>
                <td></td>
                <td>{{ rowsTaxPrice | toMoney }}</td>
                <td></td>
                <td>{{ rowsComplicationPrice | toMoney }}</td>
                <td>{{ rowsSum('sum') | toMoney }}</td>
                <td>{{ rowsSum('net_price') | toMoney }}</td>
                <td>{{ rowsSum('company_commission') | toMoney }}</td>
                <td>{{ rowsSum('car_income') | toMoney }}</td>
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
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm";

export default {
  name: "Form",
  components: { money, date },
  mixins: [formsMixin, GetApi, ListModalFormMixin],
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
      for (const row of this.rows) {
        sum += this.taxPrice(row);
      }
      return sum;
    },
    rowsComplicationPrice() {
      let sum = 0;
      for (const row of this.rows) {
        sum += this.complicationPrice(row);
      }
      return sum;
    },
  },
  created() {
    this.getData();
    if (this.id) {
      this.getItem();
    }
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
      return {
        company_commission: +this.getOptionValue(
          "companyCommissionFromOilCompanyLading"
        ),
      };
    },
    getData() {
      this.getCars();
    },
    getRowTemplate() {
      return {
        net_price: 0,
        gross_price: 0,
        insurance_price: 0,
        tax_percent: this.getOptionValue("taxPercent"),
        complication_percent: this.getOptionValue(
          "addedValuePercentOfOilCompanyLading"
        ),
      };
    },
    taxPrice(row) {
      return +row.tax_price || (+row.tax_percent * +row.gross_price) / 100 || 0;
    },
    complicationPrice(row) {
      return (
        +row.complication_price ||
        (+row.complication_percent * +row.gross_price) / 100 ||
        0
      );
    },
    rowSum(row) {
      let sum =
        (+row.gross_price || 0) +
        this.taxPrice(row) +
        this.complicationPrice(row) -
        (+row.insurance_price || 0);
      row.sum = sum;
      return sum;
    },
    netPrice(row) {
      let value = +row.gross_price - +row.insurance_price;
      row.net_price = value;
      return value;
    },
    companyCommission(row) {
      let value =
        (this.netPrice(row) * +this.item.company_commission) / 100 || 0;
      row.company_commission = value;
      return value;
    },
    carIncome(row) {
      let value = this.netPrice(row) - this.companyCommission(row) || 0;
      row.car_income = value;
      return value;
    },
    rowsSum(key) {
      let sum = 0;
      for (const row of this.rows) {
        let value = row[key];
        if (this.hasValue(value)) {
          sum += +value;
        }
      }
      return sum;
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
        item.bed = +item.bed;
        item.bes = +item.bes;

        data.items.items.push(item);
      });

      return data;
    },
  },
};
</script>

<style scoped lang="scss"></style>

