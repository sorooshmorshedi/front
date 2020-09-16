<template>
  <m-form
    title="سند حسابداری"
    :showList="false"
    :listRoute="{name:'List', params:{form: 'sanad'}}"
    :exportParams="{id: this.id}"
    :canEdit="canEdit"
    :canDelete="canDelete"
    :canSubmit="canSubmit"
    :isEditing.sync="isEditing"
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
      <v-btn
        small
        v-if="item.factor"
        class="light-blue white--text mr-1"
        :to="{name: 'FactorForm', params: {type: item.factor.type, id: item.factor.id }}"
      >مشاهده فاکتور این سند</v-btn>
      <v-btn
        small
        v-if="item.transaction"
        class="light-blue white--text mr-1"
        :to="{name: 'TransactionForm', params: {transactionType: item.transaction.type, id: item.transaction.id }}"
      >
        <span>مشاهده دریافت/پرداخت</span>
      </v-btn>

      <v-btn small @click="copySanadToNewSanad" class="teal white--text mr-1">کپی سند به سند جدید</v-btn>

      <v-btn
        small
        @click="reorderSanads"
        class="teal white--text mr-1"
      >مرتب کردن کد اسناد بر اساس تاریخ</v-btn>
    </template>

    <template>
      <v-row>
        <v-col cols="12" lg="6">
          <v-row>
            <v-col cols="12" lg="3">
              <v-text-field disabled label="عطف" v-model="item.id" background-color="white" />
            </v-col>
            <v-col cols="12" lg="3">
              <v-text-field disabled label="شماره سند" v-model="item.code" background-color="white"></v-text-field>
            </v-col>
            <v-col cols="12" lg="6">
              <date
                class="form-control"
                v-model="item.date"
                label=" * تاریخ سند"
                :default="true"
                :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" lg="12">
              <v-text-field
                v-if="item.created_by"
                label="صادر کننده سند"
                disabled
                v-model="item.created_by.name"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row>
            <v-col cols="12" lg="12">
              <v-textarea
                label="شرح سند"
                v-model="item.explanation"
                :disabled="!isEditing"
                height="105"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-simple-table class="form-items">
            <thead>
              <tr>
                <th>#</th>
                <th>* شماره - نام حساب</th>
                <th>توضیحات ردیف</th>
                <th>بدهکار</th>
                <th class="d-print-none">
                  <a @click.prevent="exchangeValue()" href>
                    <i class="fas fa-exchange-alt"></i>
                  </a>
                </th>
                <th>بستانکار</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row,i) in rows" :key="i" :class="{'d-print-none': i == rows.length-1}">
                <td class="tr-counter">{{ i+1 }}</td>
                <td v-tooltip="accountParentsName(row.account).join(' > ')">
                  <account-select
                    :horizontal="true"
                    items-type="level3"
                    v-model="rows[i].account"
                    :disabled="!isEditing"
                    :floatAccount="rows[i].floatAccount"
                    @update:floatAccount="v => rows[i].floatAccount = v"
                    :costCenter="rows[i].costCenter"
                    @update:costCenter="v => rows[i].costCenter = v"
                  />
                </td>
                <td>
                  <v-textarea
                    v-model="rows[i].explanation"
                    :disabled="!isEditing"
                    rows="1"
                    auto-grow
                  ></v-textarea>
                </td>
                <td style="width: 150px">
                  <money
                    :disabled="!isEditing || rows[i].bes != 0"
                    class="form-control"
                    v-model="rows[i].bed"
                  />
                </td>
                <td class="d-print-none">
                  <a @click.prevent="exchangeValue(rows[i])" href v-if="i != rows.length-1">
                    <i class="fas fa-exchange-alt"></i>
                  </a>
                </td>
                <td style="width: 150px">
                  <money
                    :disabled="!isEditing || rows[i].bed != 0"
                    class="form-control"
                    v-model="rows[i].bes"
                  />
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
                <td colspan="2">
                  <span
                    v-if="bedSum != besSum"
                  >اختلاف: {{ Math.abs(bedSum - besSum) | toMoney }} {{ (bedSum > besSum)?'بستانکار':'بدهکار' }}</span>
                </td>
                <td class="text-left">مجموع:</td>
                <td class>{{ bedSum | toMoney }}</td>
                <td class="d-print-none"></td>
                <td class>{{ besSum | toMoney }}</td>
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
import accountApiMixin from "@/mixin/accountMixin";
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";

import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";

export default {
  name: "Form",
  components: { money, date },
  mixins: [formsMixin, accountApiMixin, ListModalFormMixin],
  props: ["id"],
  data() {
    return {
      baseUrl: "sanads",
      permissionBasename: "sanad",
      leadingSlash: true,
      hasList: false,
      hasIdProp: true,
      rowKey: "account",
    };
  },
  computed: {
    canEdit() {
      if (!this.item.id) return true;
      return !this.item.is_auto_created;
    },
    bedSum() {
      let sum = 0;
      this.rows.forEach((r) => {
        if (r.bed) sum += +r.bed;
      });
      return sum;
    },
    besSum() {
      let sum = 0;
      this.rows.forEach((r) => {
        if (r.bes) sum += +r.bes;
      });
      return sum;
    },
  },
  methods: {
    getItemTemplate() {
      return {
        type: "temporary",
      };
    },
    getRowTemplate() {
      return {
        bed: 0,
        bes: 0,
      };
    },
    getSanadByCode(code) {
      this.log("Get sanad by code: ", code);
      return this.request({
        url: this.endpoint("sanads/getSanadByCode"),
        method: "get",
        params: {
          code,
        },
        success: (data) => {
          this.selectSanad(data);
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
      this.isEditing = false;
    },
    copySanadToNewSanad() {
      let rows = this.copy(this.rows);
      this.clearForm();
      this.$nextTick(() => {
        this.rows = [];
        for (const row of rows) {
          if (row.id) delete row.id;
          this.rows.push({
            ...row,
          });
        }
      });
    },
    exchangeValue(row) {
      if (row) {
        let tmp = row.bed;
        row.bed = row.bes;
        row.bes = tmp;
      } else {
        for (const row of this.rows) {
          let tmp = row.bed;
          row.bed = row.bes;
          row.bes = tmp;
        }
      }
    },
    getSerialized() {
      let data = {
        item: this.extractIds(this.item),
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
    reorderSanads() {
      this.request({
        url: this.endpoint("sanads/reorder"),
        method: "post",
        success: (data) => {
          this.successNotify();
        },
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>

