<template>
  <daily-form
    title="تسویه تنخواه"
    formName="تسویه تنخواه"
    @clearForm="clearForm(true)"
    :showNavigationButtons="true"
    :showSubmitAndClearForm="true"
    :hasList="false"
    :hasFirst="true"
    :hasLast="true"
    :hasPrev="true"
    :hasNext="true"
    :editable="editable"
    :deletable="id != undefined"
    @goToForm="getItemByPosition"
    @edit="makeFormEditable()"
    @validate="submit"
    @delete="deleteItem"
  >
    <template #header-btns>
      <open-item-btn v-if="item.item" :item="item.item" />
    </template>

    <template #inputs>
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
                :disabled="!editable"
                ref="date"
              />
            </v-col>
            <v-col cols="12" md="4">
              <account-select
                label="نام تنخواه گردان"
                items-type="imprests"
                v-model="item.account"
                :disabled="id != undefined || !editable"
                :floatAccount="item.floatAccount"
                @update:floatAccount="v => item.floatAccount = v"
                :costCenter="item.costCenter"
                @update:costCenter="v => item.costCenter = v"
                @change="getNotSettledImprests"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                v-model="imprest"
                label="شماره پرداخت تنخواه"
                :items="imprests"
                :disabled="id != undefined || !editable"
                item-text="code"
                @change="imprest.imprestSettlement.id && setItem(imprest.imprestSettlement)"
              />
            </v-col>
            <v-col cols="12" md="2">
              <money label="مبلغ" :disabled="true" :value="imprest.sum" />
            </v-col>
            <v-col cols="12" md="12">
              <v-textarea label="شرح سند" v-model="item.explanation" :disabled="!editable"></v-textarea>
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
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row,i) in rows" :key="i" :class="{'d-print-none': i == rows.length-1}">
                <td class="tr-counter">{{ i+1 }}</td>
                <td style="max-width: 80px">
                  <date v-model="rows[i].date" :disabled="!editable" />
                </td>
                <td>
                  <v-textarea v-model="rows[i].explanation" :disabled="!editable"></v-textarea>
                </td>
                <td v-tooltip="accountParentsName(row.account).join(' > ')">
                  <account-select
                    :horizontal="true"
                    items-type="level3"
                    v-model="rows[i].account"
                    :disabled="!editable"
                    :floatAccount="rows[i].floatAccount"
                    @update:floatAccount="v => rows[i].floatAccount = v"
                    :costCenter="rows[i].costCenter"
                    @update:costCenter="v => rows[i].costCenter = v"
                  />
                </td>
                <td style="width: 150px">
                  <money :disabled="!editable" v-model="rows[i].value" />
                </td>
                <td class="d-print-none">
                  <v-btn
                    v-if="i != rows.length-1"
                    @click="deleteRow(i)"
                    class="red--text"
                    icon
                    :disabled="!editable"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr class="grey lighten-3 text-white">
                <td colspan="3"></td>
                <td class="text-left">مجموع:</td>
                <td class>{{ rowsSum('value') | toMoney }}</td>
                <td class="d-print-none">
                  <v-btn @click="deleteRow(-1)" icon class="red--text" :disabled="!editable">
                    <v-icon>delete_sweep</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr class="grey lighten-3 text-white">
                <td colspan="3"></td>
                <td class="text-left">اختلاف:</td>
                <td>{{ imprest.sum?imprest.sum - rowsSum('value'):0 | toMoney}}</td>
                <td></td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </template>
  </daily-form>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";

import DailyForm from "@/components/form/DailyForm";

import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm";

export default {
  name: "Form",
  components: { money, date, DailyForm },
  mixins: [formsMixin, accountApiMixin, ListModalFormMixin],
  props: ["id"],
  data() {
    return {
      baseUrl: "imprests/imprestSettlement",
      leadingSlash: true,
      item: {},
      rows: [],
      itemsToDelete: [],
      imprests: [],
      imprest: {
        transaction: null,
        code: null,
        sum: 0
      },
      hasList: false
    };
  },
  watch: {
    rows: {
      handler() {
        let row = this.rows[this.rows.length - 1];
        if (row && row.account) {
          this.rows.push(this.getRowTemplate());
        }
      },
      deep: true
    }
  },
  methods: {
    getData() {
      this.getAccounts();
      if (this.id) {
        this.getItem();
      } else {
        this.rows.push(this.getRowTemplate());
      }
    },

    getNotSettledImprests(accountData) {
      if (this.id) return;
      this.request({
        url: this.endpoint("imprests/notSettledImprests"),
        params: this.extractIds(accountData),
        method: "get",
        success: data => {
          this.imprests = data;
          // if (this.id) {
          //   let imprest = this.imprests.filter(
          //     o => (o.transaction = this.item.transaction.id)
          //   )[0];
          //   if (imprest) this.imprest = imprest;
          // }
        }
      });
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
          position: position
        },
        success: data => {
          this.setItem(data);
        }
      });
    },

    clearForm() {
      this.item = {};
      this.imprests = [];
      this.imprest = {};
      this.rows = [this.getRowTemplate()];
      if (this.id) {
        this.$router.push({
          name: "ImprestSettlement"
        });
      }
    },
    setItem(item) {
      this.makeFormUneditable();
      if (this.id != item.id) {
        this.$router.push({
          name: "ImprestSettlement",
          params: { id: item.id }
        });
      }
      this.item = item;
      this.item.account = item.transaction.account;
      this.item.floatAccount = item.transaction.floatAccount;
      this.item.costCenter = item.transaction.costCenter;

      this.imprest.transaction = item.transaction.id;
      this.imprest.code = item.transaction.code;
      this.imprest.sum = item.transaction.items.reduce(
        (v, o) => v + +o.value,
        0
      );
      this.imprests.push(this.imprest);

      this.itemsToDelete = [];
      this.rows = [];
      item.items.forEach(item => {
        let row = { ...item };
        this.rows.push(row);
      });
      this.rows.push(this.getRowTemplate());
    },
    deleteRow(index) {
      if (index == -1) {
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
    getSerialized() {
      let data = {
        item: this.extractIds(this.item),
        items: {
          ids_to_delete: this.itemsToDelete,
          items: []
        }
      };

      data.item.transaction = this.imprest.transaction;

      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;

        let item = this.copy(row);
        item = this.extractIds(item);
        data.items.items.push(item);
      });

      return data;
    }
  }
};
</script>

<style scoped lang="scss"></style>

