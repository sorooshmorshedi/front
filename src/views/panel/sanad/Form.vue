<template>
  <daily-form
    title="سند حسابداری"
    formName="سند"
    :ListRouteParams="{form: 'sanad'}"
    :exportParams="{id: this.id}"
    @clearForm="clearSanad()"
    :hasFirst="hasFirst"
    :hasLast="hasLast"
    :hasPrev="hasPrev"
    :hasNext="hasNext"
    :canSubmit="canSubmit"
    :editable="editable"
    :deletable="deletable"
    @goToForm="goToForm"
    @validate="validate"
    @edit="makeFormEditable()"
    @delete="deleteSanad"
  >
    <template #header-btns>
      <v-btn
        small
        v-if="sanad.factor"
        class="blue white--text mr-1"
        :to="{name: 'FactorForm', params: {factorType: sanad.factor.type, id: sanad.factor.id }}"
      >مشاهده فاکتور این سند</v-btn>
      <v-btn
        small
        v-if="sanad.transaction"
        class="blue white--text mr-1"
        :to="{name: 'TransactionForm', params: {transactionType: sanad.transaction.type, id: sanad.transaction.id }}"
      >
        <span>مشاهده دریافت/پرداخت</span>
      </v-btn>

      <v-btn
        small
        @click.prevent="copySanadToNewSanad()"
        class="blue white--text mr-1"
      >کپی سند به سند جدید</v-btn>

      <v-btn
        small
        @click="reorderSanads"
        class="blue white--text mr-1"
      >مرتب کردن کد اسناد بر اساس تاریخ</v-btn>
    </template>

    <template #inputs>
      <v-row>
        <v-col cols="12" lg="6">
          <v-row>
            <v-col cols="12" lg="6">
              <v-text-field
                required
                label="شماره سند"
                v-model="sanad.code"
                v-if="sanad.id"
                background-color="white"
              ></v-text-field>
              <v-text-field required label="شماره سند" disabled :value="sanadCode" v-else></v-text-field>
            </v-col>
            <v-col cols="12" lg="6">
              <date
                class="form-control"
                v-model="sanad.date"
                label="تاریخ سند"
                :default="true"
                :disabled="!editable"
              />
            </v-col>
            <v-col cols="12" lg="12">
              <v-text-field label="صادر کننده سند" disabled></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row>
            <v-col cols="12" lg="12">
              <v-textarea
                label="شرح سند"
                v-model="sanad.explanation"
                :disabled="!editable"
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
                <th class="required">شماره - نام حساب</th>
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
                <td style="width: 10px">{{ i+1 }}</td>
                <td v-tooltip="accountParentsName(row.account).join(' > ')">
                  <account-select
                    items-type="level3"
                    v-model="rows[i].account"
                    :disabled="!editable"
                    :floatAccount="rows[i].floatAccount"
                    @update:floatAccount="v => rows[i].floatAccount = v"
                    :costCenter="rows[i].costCenter"
                    @update:costCenter="v => rows[i].costCenter = v"
                  />
                </td>
                <td>
                  <v-textarea
                    style="width: 300px"
                    v-model="rows[i].explanation"
                    :disabled="!editable"
                    rows="1"
                    auto-grow
                  ></v-textarea>
                </td>
                <td style="width: 150px">
                  <money
                    :disabled="!editable || rows[i].bes != 0"
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
                    :disabled="!editable || rows[i].bed != 0"
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
                    :disabled="!editable"
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
                  <v-btn @click="deleteRow(-1)" icon class="red--text" :disabled="!editable">
                    <v-icon>delete_sweep</v-icon>
                  </v-btn>
                </td>
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

export default {
  name: "Form",
  components: { money, date, DailyForm },
  mixins: [formsMixin, accountApiMixin],
  props: ["id"],
  data() {
    return {
      sanadCode: null,
      sanad: {
        type: "temporary"
      },
      rows: [
        {
          bed: 0,
          bes: 0
        }
      ],
      itemsToDelete: []
    };
  },
  created() {
    this.getData();
  },
  mounted() {},
  computed: {
    bedSum() {
      let sum = 0;
      this.rows.forEach(r => {
        if (r.bed) sum += +r.bed;
      });
      return sum;
    },
    besSum() {
      let sum = 0;
      this.rows.forEach(r => {
        if (r.bes) sum += +r.bes;
      });
      return sum;
    },
    hasFirst() {
      if (this.sanadCode == 1) return false;
      return true;
    },
    hasNext() {
      if (this.sanad.code == this.sanadCode - 1) return false;
      if (!this.id) return false;
      return true;
    },
    hasPrev() {
      if (this.sanad.code == 1) return false;
      return true;
    },
    hasLast() {
      if (this.sanadCode == 1) return false;
      return true;
    },
    deletable() {
      if (!this.id) return false;
      if (!this.hasNext) return true;
      return false;
    }
  },
  watch: {
    rows: {
      handler() {
        let row = this.rows[this.rows.length - 1];
        if (row && row.account) {
          this.rows.push({
            bed: 0,
            bes: 0
          });
        }
      },
      deep: true
    }
  },
  methods: {
    getData() {
      this.getAccounts();
      this.getSanadCode();

      if (this.id) this.getSanad(this.id);
    },

    getSanad(sanadId) {
      return this.request({
        url: this.endpoint("sanads/" + sanadId),
        method: "get",
        success: data => {
          this.selectSanad(data);
        }
      });
    },
    getSanadByCode(code) {
      this.log("Get sanad by code: ", code);
      return this.request({
        url: this.endpoint("sanads/getSanadByCode"),
        method: "get",
        params: {
          code
        },
        success: data => {
          this.selectSanad(data);
        }
      });
    },
    clearSanad() {
      this.$router.push({
        name: "SanadForm"
      });
      this.sanad = {
        type: "temporary"
      };
      this.rows = [
        {
          bed: "",
          bes: ""
        }
      ];
    },
    getSanadCode() {
      return this.request({
        url: this.endpoint("sanads/newCode"),
        method: "get",
        success: data => {
          this.sanadCode = data;
        }
      });
    },
    canSubmit() {
      if (!this.sanad.createType) return true;
      return this.sanad.createType == "auto";
    },
    goToForm(pos) {
      let newCode = null;
      switch (pos) {
        case "next":
          newCode = this.sanad.code + 1;
          break;
        case "prev":
          newCode = this.sanad.code ? this.sanad.code - 1 : this.sanadCode - 1;
          break;
        case "first":
          newCode = 1;
          break;
        case "last":
          newCode = this.sanadCode - 1;
          break;
      }
      if (newCode) this.getSanadByCode(newCode);
    },
    selectSanad(sanad) {
      this.makeFormUneditable();
      this.$router.push({
        name: "SanadForm",
        params: { id: sanad.id }
      });
      this.sanad = sanad;
      this.itemsToDelete = [];
      this.rows = [];
      sanad.items.forEach(item => {
        let row = { ...item };
        this.rows.push(row);
      });
      this.rows.push({ bed: 0, bes: 0 });
      $("#sanad-selection-modal").modal("hide");
    },
    copySanadToNewSanad() {
      let rows = this.copy(this.rows);
      this.clearSanad();
      this.rows = [];
      for (const row of rows) {
        if (row.id) delete row.id;
        this.rows.push({
          ...row
        });
      }
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
    validate(clearSanad = false) {
      if (this.sanad.id) this.updateSanad(clearSanad);
      else this.storeSanad(clearSanad);
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
        sanad: this.extractIds(this.sanad),
        items: {
          ids_to_delete: this.itemsToDelete,
          items: []
        }
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
    setSanad(sanad) {
      this.makeFormUneditable();
    },
    deleteSanad() {
      this.request({
        url: this.endpoint("sanads/" + this.sanad.id),
        method: "delete",
        success: data => {
          this.clearSanad();
          this.getSanadCode();
          this.successNotify();
        }
      });
    },
    storeSanad(clearSanad) {
      let data = this.getSerialized();
      this.request({
        url: this.endpoint("sanads/"),
        method: "post",
        data: data,
        success: data => {
          if (clearSanad) {
            this.clearSanad();
          } else {
            this.setSanad(data);
          }
          this.getSanadCode();
          this.successNotify();
        }
      });
    },
    updateSanad(clearSanad) {
      let data = this.getSerialized();
      this.request({
        url: this.endpoint("sanads/" + this.sanad.id),
        method: "put",
        data: data,
        success: data => {
          if (clearSanad) {
            this.clearSanad();
          } else {
            this.setSanad(data);
          }
          this.getSanadCode();
          this.successNotify();
        }
      });
    },
    getFloatAccounts(row) {
      if (row.account && row.account.floatAccountGroup) {
        return row.account.floatAccountGroup.floatAccounts;
      } else {
        return [];
      }
    },
    getCostCenters(row) {
      if (row.account && row.account.costCenterGroup) {
        return row.account.costCenterGroup.floatAccounts;
      } else {
        return [];
      }
    },

    reorderSanads() {
      this.request({
        url: this.endpoint("sanads/reorder"),
        method: "post",
        success: data => {
          this.getSanadCode();
          this.successNotify();
        }
      });
    }
  }
};
</script>

<style scoped lang="scss"></style>

