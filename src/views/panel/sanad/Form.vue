<template>
  <m-form
    title="سند حسابداری"
    :showList="false"
    :listRoute="{name:'SanadsList'}"
    exportBaseUrl="reports/lists/sanads"
    :exportParams="{id: this.id}"
    :canEdit="canEdit"
    :canDelete="false"
    :canSubmit="canSubmit"
    :isEditing.sync="isEditing"
    @goToForm="getItemByPosition"
    @submit="submit"
    @delete="deleteItem"
    @clearForm="clearForm()"
  >
    <template #header-btns>
      <v-btn
        v-if="relatedForm"
        class="light-blue white--text mr-1 mt-1 mt-md-0"
        :to="relatedForm.to"
        rounded
      >
        <v-icon class="ml-1">fa-external-link-square-alt</v-icon>
        {{ relatedForm.title }}
      </v-btn>

      <v-btn
        small
        @click="copySanadToNewSanad"
        class="teal white--text mr-1 mt-1 mt-md-0"
        title="کپی سند به سند جدید"
        icon
        outlined
      >
        <v-icon>fa-clone</v-icon>
      </v-btn>
    </template>

    <template>
      <v-row>
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field disabled label="عطف" v-model="item.local_id" background-color="white" />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field disabled label="شماره سند" v-model="item.code" background-color="white"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <date
                class="form-control"
                v-model="item.date"
                label=" * تاریخ سند"
                :default="true"
                :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                :disabled="!isEditing"
                :items="sanadTypes"
                v-model="item.type"
                label="نوع سند"
                :return-object="false"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-if="item.created_by"
                disabled
                :items="[{text: 'دستی', value: false}, {text: 'سیستمی', value: true}]"
                v-model="item.is_auto_created"
                label="نوع ثبت"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-if="item.created_by"
                label="کاربر"
                disabled
                v-model="item.created_by.name"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="12" md="12">
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
          <m-datatable
            :headers="headers"
            :items="rows"
            :showExportBtns="false"
            :showAppliedFilters="false"
            :showClearFiltersBtn="true"
            :showSelect="false"
            :filters.sync="filters"
          >
            <template
              #item.account.title="{ item }"
              v-tooltip="accountParentsName(item.account).join(' > ')"
            >
              <account-select
                :horizontal="true"
                items-type="level3"
                v-model="item.account"
                :disabled="!isEditing"
                :floatAccount="item.floatAccount"
                @update:floatAccount="v => item.floatAccount = v"
                :costCenter="item.costCenter"
                @update:costCenter="v => item.costCenter = v"
              />
            </template>
            <template #item.explanation="{ item }">
              <row-textarea
                v-model="item.explanation"
                :disabled="!isEditing"
                :i="rows.indexOf(item)"
                @updateRowsExplanation="updateRowsExplanation"
              />
            </template>
            <template style="width: 150px" #item.bed="{ item }">
              <money :disabled="!isEditing || item.bes != 0" v-model="item.bed" />
            </template>
            <template #item.swap="{ item }">
              <a
                @click.prevent="exchangeValue(item)"
                href
                v-if="rows.indexOf(item) != rows.length-1"
              >
                <i class="fas fa-exchange-alt"></i>
              </a>
            </template>
            <template style="width: 150px" #item.bes="{ item }">
              <money
                :disabled="!isEditing || item.bed != 0"
                class="form-control"
                v-model="item.bes"
              />
            </template>
            <template #item.deleteRow="{ item }">
              <v-btn
                v-if="rows.indexOf(item) != rows.length-1"
                @click="deleteRow(rows.indexOf(item))"
                class="red--text"
                icon
                :disabled="!isEditing"
              >
                <v-icon>delete</v-icon>
              </v-btn>
            </template>

            <template #body.append="{ headers }">
              <tr class="grey lighten-3 text-white" key="last-row">
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
            </template>
          </m-datatable>
        </v-col>

        <v-col cols="12" v-if="false">
          <input-table v-model="rows">
            <template #thead>
              <tr>
                <th>#</th>
                <th class="tr-account">* کد و نام حساب</th>
                <th>شرح ردیف</th>
                <th>بدهکار</th>
                <th>
                  <a @click.prevent="exchangeValue()" href>
                    <i class="fas fa-exchange-alt"></i>
                  </a>
                </th>
                <th>بستانکار</th>
              </tr>
            </template>
            <template #tbody>
              <tr
                v-for="(row,i) in rows"
                :key="i"
                :class="{'draggable': i != rows.length-1 && isEditing}"
              >
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
                  <row-textarea
                    v-model="rows[i].explanation"
                    :disabled="!isEditing"
                    :i="i"
                    @updateRowsExplanation="updateRowsExplanation"
                  />
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

              <tr class="grey lighten-3 text-white" key="last-row">
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

import { MFormMixin } from "@/components/m-form";

export default {
  name: "Form",
  components: { money, date },
  mixins: [formsMixin, accountApiMixin, MFormMixin],
  props: ["id"],
  data() {
    return {
      baseUrl: "sanads",
      permissionBasename: "sanad",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      rowKey: "account",
      filters: {},
      sanadTypes: [
        {
          text: "افتتاحیه",
          value: "o",
        },
        {
          text: "اختتامیه",
          value: "c",
        },
        {
          text: "عادی",
          value: "n",
        },
      ],
      headers: [
        {
          text: "* کد و نام حساب",
          value: "account.title",
          align: "center",
          sortable: false,
          filterable: true,
        },
        {
          text: "شرح ردیف",
          value: "explanation",
          align: "center",
          sortable: false,
          filterable: false,
        },
        {
          text: "بدهکار",
          value: "bed",
          align: "center",
          sortable: false,
          filterable: false,
          width: "150px",
        },
        {
          text: "",
          value: "swap",
          align: "center",
          sortable: false,
          filterable: false,
          width: "40px",
        },
        {
          text: "بستانکار",
          value: "bes",
          align: "center",
          sortable: false,
          filterable: false,
          width: "150px",
        },
        {
          text: "",
          value: "deleteRow",
          align: "center",
          sortable: false,
          filterable: false,
          width: "40px",
        },
      ],
    };
  },
  computed: {
    relatedForm() {
      // not working for chequeStatusChange
      let forms = [
        {
          name: "factor",
          title: "فاکتور",
          routeName: "FactorForm",
          params: { isPreFactor: true },
        },
        { name: "adjustment", title: "تعدیل", routeName: "AdjustmentForm" },
        { name: "lading", title: "بارگیری", routeName: "Lading" },
        {
          name: "oilCompanyLading",
          title: "بارگیری شرکت نفت",
          routeName: "OilCompanyLading",
        },
        {
          name: "statusChange",
          title: "چک",
          routeName: "ChequeDetail",
        },
        {
          name: "transaction",
          title: "دریافت/پرداخت",
          routeName: "TransactionForm",
        },
        {
          name: "imprestSettlement",
          title: "تسویه تنخواه",
          routeName: "ImprestSettlement",
        },
      ];
      for (let form of forms) {
        let formObj = this.item[form["name"]];
        if (formObj) {
          let params = form.params ? form.params : {};
          return {
            title: form.title,
            to: {
              name: form.routeName,
              params: {
                id: formObj.id,
                type: formObj.type,
                ...params,
              },
            },
          };
        }
      }
      return null;
    },
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
        type: "n",
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
      item.items
        .sort((a, b) => a.order - b.order)
        .forEach((item) => {
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
  },
};
</script>

<style scoped lang="scss"></style>

