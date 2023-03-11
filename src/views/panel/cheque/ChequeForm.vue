<template>
  <div>
    <m-form
        :title="title"
        :showListBtn="false"
        :showList="false"
        :listRoute="{ name: 'ChequesList', params: { type, isPaid } }"
        :showNavigationButtons="!modalMode"
        :showSubmitAndClearForm="!modalMode"
        :canDelete="canDelete"
        :canSubmit="canSubmit"
        :canEdit="canEdit"
        :isEditing.sync="isEditing"
        @clearForm="clearForm"
        @goToForm="getItemByPosition"
        @submit="validate"
        @delete="deleteItem"
    >
      <template #header-btns>
        <v-btn
            v-if="item.id"
            depressed
            class="secondary white--text mr-2 mt-1 rounded-lg"
            :to="{ name: 'ChequeDetail', id: id }"
        >مشاهده جزئیات {{ typeName }}
        </v-btn
        >
      </template>

      <template>
        <v-row>
          <template v-if="isPaid">
            <v-col cols="12" md="3">
              <account-select
                  itemsType="banks"
                  label="* بانک"
                  v-model="bank"
                  :disabled="!isEditing"
                  clearable
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-autocomplete
                  class="rounded-lg"
                  v-if="bank"
                  :return-object="true"
                  required
                  label=" * سری دسته چک"
                  :items="chequebooks.filter((o) => o.account.id == bank.id)"
                  item-text="serial"
                  item-value="id"
                  v-model="item.chequebook"
                  :disabled="id != null || !isEditing"
                  @change="getPaidCheques"
                  clearable
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-autocomplete
                  class="rounded-lg"
                  v-if="item.chequebook"
                  :return-object="true"
                  required
                  :disabled="!chequebook || !isEditing"
                  label=" * چک"
                  :items="paidCheques"
                  :search-input="paidChequeSearch"
                  v-model="item"
                  item-text="serial"
                  item-value="id"
                  :loading="loading.getPaidCheques"
              />
            </v-col>
          </template>
          <v-col cols="12" md="3" v-else>
            <v-text-field
                class="rounded-lg"
                required
                label=" * سریال"
                v-model="item.serial"
                :disabled="isPaid || !isEditing"
            />
          </v-col>
          <v-col cols="12" md="6">
            <account-select
                label="* کد و نام مشتری"
                items-type="level3"
                v-model="itemAccount"
                :disabled="modalMode || !isEditing"
                :floatAccount="itemFloatAccount"
                @update:floatAccount="(v) => (itemFloatAccount = v)"
                :costCenter="itemCostCenter"
                @update:costCenter="(v) => (itemCostCenter = v)"
            />
          </v-col>
          <v-col cols="12" md="2">
            <money
                label=" * مبلغ"
                v-model="item.value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3" v-if="type == 'bg'">
            <v-text-field
                class="rounded-lg"
                label="شماره سپام"
                v-model="item.accountNumber"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2" v-if="type == 'bg'">
            <date
                label=" * تاریخ اعتبار"
                v-model="item.due"
                :default="false"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2" v-else>
            <date
                label=" * تاریخ سررسید"
                v-model="item.due"
                :default="false"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <date
                label="* تاریخ ثبت"
                v-model="item.date"
                :default="true"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2" v-if="canSetSanadCode">
            <v-text-field
                class="rounded-lg"
                label="شماره سند"
                v-model="item.sanad_code"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-textarea
                class="rounded-lg"
                label="شرح "
                v-model="item.explanation"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="12" v-if="type == 'c' && !isPaid">
            <v-select
                class="rounded-lg"
                label=" * نوع چک"
                :items="chequeOwnerTypes"
                :return-object="false"
                v-model="item.owner_type"
                :disabled="!isEditing"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                class="rounded-lg"
                v-if="type != 'pn'"
                label="نام بانک"
                v-model="item.bankName"
                :disabled="isPaid || !isEditing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                class="rounded-lg"
                v-if="type != 'pn'"
                label="نام شعبه"
                v-model="item.branchName"
                :disabled="isPaid || !isEditing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                class="rounded-lg"
                v-if="type == 'c'"
                label="شماره حساب"
                v-model="item.accountNumber"
                :disabled="isPaid || !isEditing"
            />
          </v-col>
        </v-row>
      </template>
    </m-form>
    <cheques-list
        class="mt-3 rounded-lg"
        form="cheque"
        :type="type"
        :isPaid="isPaid"
        ref="formList"
    />
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import ChequeMixin from "./mixin.js";
import ChequesList from "@/views/panel/lists/ChequesList";
import formsMixin from "@/mixin/forms";
import GetChequebooksApi from "@/views/panel/chequebook/getChequebooksApi";
import {MFormMixin} from "@/components/m-form";

export default {
  name: "ChequeForm",
  props: {
    isPaid: {
      requried: true,
    },
    type: {
      requried: true,
    },
    id: {
      default: null,
    },
    modalMode: {
      default: false,
    },
    selectedAccount: {
      default: null,
    },
  },
  components: {money, date, ChequesList},
  mixins: [
    ChequeMixin,
    accountApiMixin,
    formsMixin,
    GetChequebooksApi,
    MFormMixin,
  ],
  data() {
    return {
      baseUrl: "cheques/cheques",
      hasList: false,
      hasIdProp: true,
      chequebook: {},
      cheque: {
        is_paid: this.isPaid,
        account: null,
      },
      itemAccount: null,
      itemFloatAccount: null,
      itemCostCenter: null,
      d: {},
      loading: {},
      paidCheques: [],
      paidChequeSearch: "",
      bank: null,
    };
  },
  computed: {
    createUrl() {
      return "cheques/cheques/submit/";
    },
    permissionBasename() {
      if (this.isPaid) {
        return "paidCheque";
      } else {
        return "receivedCheque";
      }
    },
    canSubmit() {
      return this.hasPerm("submit", this.permissionBasename, this.item);
    },
    canEdit() {
      return this.item.status != "revoked";
    },
    typeName() {
      return this.getTypeName(this.type);
    },
    title() {
      let title = this.typeName;
      if (this.isPaid) title += " پرداختنی";
      else title += " دریافتنی";
      return title;
    },
    canSetSanadCode() {
      let statusChange = this.item.statusChanges;
      if (statusChange) {
        return statusChange.length == 0;
      } else {
        return true;
      }
    },

    canDelete() {
      if (this.isPaid) return false;
      if (this.item.id) {
        let statusChangesLength = this.item.statusChanges.length;
        if (this.isPaid) {
          if (statusChangesLength == 0) return true;
        } else {
          if (statusChangesLength == 1) return true;
        }
        return false;
      }
      return false;
    },
  },
  created() {
    this.d.getPaidCheques = _.debounce(this.getPaidCheques, 1000);
    this.getAccounts();
    if (this.id) {
      this.getCheque(this.id);
    }

    if (this.isPaid) {
      this.getChequebooks();
    }
  },
  watch: {
    paidChequeSearch(o, n) {
      this.loading.getPaidCheques = true;
      this.d.getPaidCheques();
    },
  },
  methods: {
    clearForm() {
      this.isEditing = true;
      this.item = this.getItemTemplate();
      if (!this.modalMode) {
        this.changeRouteTo(null);
      }
    },
    getData() {
      if (this.$refs.formList) {
        this.$refs.formList.$refs.datatable.getData();
      }
    },
    validate(clearForm) {
      if (this.modalMode) {
        this.$emit("submit", this.getSerialized());
      } else {
        this.submit(clearForm);
      }
    },
    getItemTemplate() {
      let template = {
        type: this.type,
        account: null,
        floatAccount: null,
        costCenter: null,
        is_paid: this.isPaid,
        due: null,
        date: null,
      };

      if (this.selectedAccount) {
        this.itemAccount = this.selectedAccount.account;
        this.itemFloatAccount = this.selectedAccount.floatAccount;
        this.itemCostCenter = this.selectedAccount.costCenter;
      }

      return template;
    },
    getSerialized() {
      this.item.account = this.itemAccount;
      this.item.floatAccount = this.itemFloatAccount;
      this.item.costCenter = this.itemCostCenter;

      let data = this.extractIds(this.item);

      this.removeAttachmentUrls(data);
      if (this.formData) {
        data = this.jsonToFormData(data);
      }
      return data;
    },
    getItemByPosition(pos) {
      return this.request({
        url: this.endpoint("cheques/getChequeByPosition"),
        method: "get",
        params: {
          is_paid: this.isPaid,
          type: this.type,
          id: this.id,
          position: pos,
        },
        success: (data) => {
          this.setItem(data);
        },
        error: (error) => {
          if (error.response.status == 404) {
            this.notify("مورد وجود ندارد", "warning");
          }
        },
      });
    },
    setItem(item) {
      if (this.id != item.id) {
        this.changeRouteTo(item.id);
      }
      this.item = item;
      if (this.isPaid) {
        this.bank = item.chequebook.account;
      }
      this.getPaidCheques();
      this.isEditing = false;

      if (this.$refs.formList) {
        this.$refs.formList.$refs.datatable.getDataFromApi();
      }
    },
    getPaidCheques() {
      this.loading.getPaidCheques = true;
      this.paidCheques = [];

      let params = {
        limit: 50,
        chequebook__id: this.chequebook.id,
        isPaid: true,
        type: "c",
        serial__icontains: this.paidChequeSearch,
      };
      if (this.id == undefined) {
        params["status"] = "blank";
      }

      this.request({
        url: this.endpoint("reports/lists/cheques"),
        method: "get",
        loading: false,
        params: params,
        success: (data) => {
          this.paidCheques = data.results.map((o) => {
            o.serial = String(o.serial);
            return o;
          });
          this.loading.getPaidCheques = false;
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>

