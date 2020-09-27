<template>
  <m-form
    title="تسویه تنخواه"
    formName="تسویه تنخواه"
    @clearForm="clearForm(true)"
    :showList="false"
    :isEditing.sync="isEditing"
    :canDelete="canDelete"
    :confirmBtnText="confirmBtnText"
    :cancelConfirmBtnText="cancelConfirmBtnText"
    :canConfirm="canConfirm"
    :canCancelConfirm="canCancelConfirm"
    @cancelConfirm="cancelConfirm"
    @confirm="confirm"
    @goToForm="getItemByPosition"
    @submit="submit"
    @delete="deleteItem"
  >
    <template #header-btns>
      <open-item-btn v-if="item.item" :item="item.item" />

      <v-btn
        v-if="imprest.id != undefined"
        class="blue white--text mr-1"
        :to="{name: 'TransactionForm', params: {id: imprest.id, transactionType: 'imprest'}}"
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
                v-model="item.account"
                :disabled="id != undefined || !isEditing"
                :floatAccount="item.floatAccount"
                @update:floatAccount="v => item.floatAccount = v"
                :costCenter="item.costCenter"
                @update:costCenter="v => item.costCenter = v"
                @change="getNotSettledImprests"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                :return-object="true"
                v-model="imprest"
                label="شماره پرداخت تنخواه"
                :items="imprests"
                :disabled="id != undefined || !isEditing"
                item-text="code"
                item-value="id"
                @change="imprest.imprestSettlements.length && setItem(imprest.imprestSettlements[0])"
              />
            </v-col>
            <v-col cols="12" md="2">
              <money label="مبلغ" :disabled="true" :value="imprestSum" />
            </v-col>
            <v-col cols="12" md="8">
              <v-textarea label="شرح سند" v-model="item.explanation" :disabled="!isEditing"></v-textarea>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-if="item.created_by"
                label="ثبت کننده"
                disabled
                v-model="item.created_by.name"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-simple-table class="form-items">
            <thead>
              <tr>
                <th>#</th>
                <th>* تاریخ</th>
                <th>شرح تنخواه</th>
                <th>* نام حساب</th>
                <th>مبلغ</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row,i) in rows" :key="i" :class="{'d-print-none': i == rows.length-1}">
                <td class="tr-counter">{{ i+1 }}</td>
                <td style="max-width: 80px">
                  <date v-model="rows[i].date" :disabled="!isEditing" />
                </td>
                <td>
                  <v-textarea v-model="rows[i].explanation" :disabled="!isEditing"></v-textarea>
                </td>
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
                <td style="width: 150px">
                  <money :disabled="!isEditing" v-model="rows[i].value" />
                </td>
                <td style="max-width: 100px">
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

import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm";

export default {
  name: "Form",
  components: { money, date },
  mixins: [formsMixin, accountApiMixin, ListModalFormMixin],
  props: ["id"],
  data() {
    return {
      baseUrl: "imprests/imprestSettlement",
      leadingSlash: true,
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
  },
  methods: {
    getNotSettledImprests(accountData) {
      if (this.id) return;
      this.request({
        url: this.endpoint("imprests/notSettledImprests"),
        params: this.extractIds(accountData),
        method: "get",
        success: (data) => {
          this.imprests = data;
          let imprestId = this.urlQuery.imprest;
          let imprests = data.filter((o) => o.id == imprestId);
          if (imprests.length) {
            this.imprest = imprests[0];
            this.isEditing = true;
          }
        },
      });
    },
    getItemTemplate() {
      return {
        account: null,
      };
    },
    getRowTemplate() {
      return {};
    },
    getItemByPosition(position) {
      return this.request({
        url: this.endpoint("imprests/imprestSettlement/byPosition"),
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
    setItem(item) {
      this.changeRouteTo(item.id);
      this.item = item;
      this.item.account = item.transaction.account;
      this.item.floatAccount = item.transaction.floatAccount;
      this.item.costCenter = item.transaction.costCenter;

      this.imprest = item.transaction;
      this.imprests.push(this.imprest);

      this.itemsToDelete = [];
      this.rows = [];
      item.items.forEach((item) => {
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

