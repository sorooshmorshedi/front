<template>
  <m-form
    title="تسویه تنخواه"
    formName="تسویه تنخواه"
    exportBaseUrl="reports/lists/imprestSettlements"
    :exportParams="{id: imprest.id}"
    :showList="false"
    :isEditing.sync="isEditing"
    :canDelete="false"
    :confirmBtnText="confirmBtnText"
    :cancelConfirmBtnText="cancelConfirmBtnText"
    :canConfirm="canConfirm"
    :canCancelConfirm="canCancelConfirm"
    :canEdit="!item.is_auto_created"
    :showClearBtn="false"
    :showListBtn="false"
    @cancelConfirm="cancelConfirm"
    @confirm="confirm"
    @goToForm="getItemByPosition"
    @submit="submit"
    @delete="deleteItem"
  >
    <template #header-btns>
      <open-sanad-btn v-if="item.sanad" :sanad="item.sanad" />

      <v-btn
        v-if="imprest.id != undefined"
        class="blue white--text mr-1 mt-1 mt-md-0"
        :to="{name: 'TransactionForm', params: {id: imprest.id, type: 'imprest'}}"
      >مشاهده پرداخت</v-btn>
    </template>

    <template>
      <v-row>
        <v-col cols="12">
          <v-row>
            <v-col cols="12" md="2">
              <v-text-field label="شماره" :value="item.code" disabled />
            </v-col>
            <v-col cols="12" md="2">
              <date
                v-model="item.date"
                label=" * تاریخ "
                :default="true"
                :disabled="!isEditing"
                ref="date"
              />
            </v-col>
            <v-col cols="12" md="4">
              <account-select
                label="نام تنخواه گردان"
                items-type="imprests"
                v-model="imprest.account"
                :floatAccount="imprest.floatAccount"
                :costCenter="imprest.costCenter"
                :disabled="true"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field label="شماره پرداخت تنخواه" :value="imprest && imprest.code" disabled />
            </v-col>
            <v-col cols="12" md="2">
              <money label="مبلغ تنخواه" :disabled="true" :value="imprestSum" />
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
          </v-row>
        </v-col>

        <v-col cols="12">
          <input-table class="form-items" v-model="rows">
            <template #thead>
              <tr>
                <th>#</th>
                <th>* تاریخ</th>
                <th>شرح تنخواه</th>
                <th>* نام حساب</th>
                <th>مبلغ</th>
                <th></th>
                <th></th>
              </tr>
            </template>
            <template #tbody>
              <tr v-for="(row,i) in rows" :key="i" :class="{'d-print-none': i == rows.length-1}">
                <td class="tr-counter">{{ i+1 }}</td>
                <td class="tr-date">
                  <date v-model="rows[i].date" :disabled="!isEditing" />
                </td>
                <td class="tr-textarea">
                  <row-textarea
                    v-model="rows[i].explanation"
                    :disabled="!isEditing"
                    :i="i"
                    @updateRowsExplanation="updateRowsExplanation"
                  />
                </td>
                <td class="tr-account" v-tooltip="accountParentsName(row.account).join(' > ')">
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
                <td style="width: 120px">
                  <money :disabled="!isEditing" v-model="rows[i].value" />
                </td>
                <td style="max-width: 80px">
                  <m-file-input
                    :disabled="!isEditing"
                    v-model="rows[i].attachment"
                    :delete-attachment.sync="rows[i].delete_attachment"
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
                <td colspan="3"></td>
                <td class="text-left">مجموع:</td>
                <td class>{{ rowsSum('value') | toMoney }}</td>
                <td></td>
                <td class="d-print-none">
                  <v-btn @click="deleteRow(-1)" icon class="red--text" :disabled="!isEditing">
                    <v-icon>delete_sweep</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr class="grey lighten-3 text-white">
                <td colspan="3"></td>
                <td class="text-left">اختلاف:</td>
                <td>{{ imprestSum - rowsSum('value') | toMoney}}</td>
                <td colspan="2"></td>
              </tr>
            </template>
          </input-table>
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

import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";

export default {
  name: "Form",
  components: { money, date },
  mixins: [formsMixin, accountApiMixin, MFormMixin],
  props: ["id"],
  data() {
    return {
      baseUrl: "transactions",
      appendSlash: true,
      rowKey: "account",
      hasList: false,
      hasIdProp: true,
      imprests: [],
      imprest: {},
    };
  },
  computed: {
    imprestSum() {
      if (this.imprest && this.imprest.sanad) return this.imprest.sanad.bed;
      return 0;
    },
    createUrl() {
      return "imprests/imprestSettlement/";
    },
    retrieveUrl() {
      return `transactions/${this.id}/`;
    },
    updateUrl() {
      return `imprests/imprestSettlement/${this.item.id}/`;
    },
  },
  methods: {
    getItemTemplate() {
      return {
        items: [],
      };
    },
    getRowTemplate() {
      return {
        account: null,
      };
    },
    clearForm() {
      this.item = {};
      this.imprests = [];
      this.imprest = {};
      this.rows = [this.getRowTemplate()];
      if (this.id) {
        this.$router.push({
          name: "ImprestSettlement",
        });
      }
    },
    setItem(imprest) {
      this.changeRouteTo(imprest.id);

      this.imprest = imprest;

      let item = imprest.imprestSettlement;
      if (!item) {
        item = this.getItemTemplate();
      }

      this.item = item;

      this.itemsToDelete = [];
      this.rows = [];
      item.items
        .sort((a, b) => a.order - b.order)
        .forEach((item) => {
          let row = { ...item };
          this.rows.push(row);
        });
      this.rows.push(this.getRowTemplate());
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
        item: this.extractIds(this.item),
        items: {
          ids_to_delete: this.itemsToDelete,
          items: [],
        },
      };

      data.item.transaction = this.imprest.id;
      delete data.item.items;

      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;

        let item = this.copy(row);
        item = this.extractIds(item);
        this.removeAttachmentUrls(item);
        data.items.items.push(item);
      });

      return this.jsonToFormData(data);
    },
  },
};
</script>

<style scoped lang="scss"></style>

