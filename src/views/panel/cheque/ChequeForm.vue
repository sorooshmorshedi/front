<template>
  <div>
    <daily-form
      formName="چک"
      :title="title"
      :ListRouteParams="{form: 'cheque', type: this.receivedOrPaid == 'p'?'paid':'received'}"
      @clearForm="clearCheque(true)"
      :formName="title"
      :showNavigationButtons="!modalMode"
      :showSubmitAndClearForm="!modalMode"
      :hasFirst="true"
      :hasLast="true"
      :hasPrev="true"
      :hasNext="true"
      :editable="true"
      :deletable="this.id"
      :canDelete="canDeleteCheque"
      :canSubmit="!id || canEditCheque"
      @goToForm="getChequeByPosition"
      @validate="validate"
      @delete="deleteCheque"
    >
      <template #header-btns>
        <v-btn
          v-if="id"
          class="blue white--text mr-1"
          :to="{ name: 'ChequeDetail', id: id, }"
        >مشاهده جزئیات چک</v-btn>
      </template>

      <template #inputs>
        <v-row>
          <v-col cols="12" md="6" v-if="!id && isPaidCheque">
            <label class="required"></label>
            <v-autocomplete
              required
              label="چک"
              :items="paidCheques"
              :is-loading="isLoading"
              :search-input.sync="searchPaidCheque"
              v-model="cheque"
            />
          </v-col>
          <v-col cols="12" md="6" v-else>
            <v-text-field
              required
              label="سریال چک"
              v-model="cheque.serial"
              :disabled="isPaidCheque"
            />
          </v-col>
          <v-col cols="12" md="6">
            <account-select
              :label="isPaidCheque?'دریافت کننده':'پرداخت کننده'"
              items-type="level3"
              v-model="cheque.account"
              :disabled="modalMode"
              :floatAccount="cheque.floatAccount"
              @update:floatAccount="v => cheque.floatAccount = v"
              :costCenter="cheque.costCenter"
              @update:costCenter="v => cheque.costCenter = v"
            />
          </v-col>
          <v-col cols="12" md="2">
            <money label="مبلغ" v-model="cheque.value" />
          </v-col>
          <v-col cols="12" md="2">
            <date label="تاریخ سررسید" v-model="cheque.due" :default="true" />
          </v-col>
          <v-col cols="12" md="2">
            <date
              :label="isPaidCheque?'تاریخ پرداخت':'تاریخ دریافت'"
              v-model="cheque.date"
              :default="true"
            />
          </v-col>
          <v-col cols="12" md="6" v-if="canSetSanadCode">
            <v-text-field label="شماره سند" v-model="cheque.sanad_code" />
          </v-col>
          <v-col cols="12">
            <v-textarea label="شرح چک" v-model="cheque.explanation"></v-textarea>
          </v-col>
          <v-col cols="12" md="12" v-if="!isPaidCheque">
            <v-select
              label="نوع چک"
              :items="chequeTypes"
              item-text="label"
              item-value="value"
              :return-object="false"
              v-model="cheque.type"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="نام بانک" v-model="cheque.bankName" :disabled="isPaidCheque" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="نام شعبه" v-model="cheque.branchName" :disabled="isPaidCheque" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="شماره حساب چک"
              v-model="cheque.accountNumber"
              :disabled="isPaidCheque"
            />
          </v-col>
        </v-row>
      </template>
    </daily-form>
    <form-list
      class="mt-3"
      v-if="id"
      form="cheque"
      :id="id"
      :type="isPaidCheque?'paid':'received'"
    />
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import getChequeApiMixin from "./getChequeApi.js";
import FormList from "@/views/panel/lists/List";

import formsMixin from "@/mixin/forms";
export default {
  name: "ChequeForm",
  props: {
    receivedOrPaid: {
      requried: true
    },
    id: {
      default: null
    },
    modalMode: {
      default: false
    },
    account: {
      default: null
    },
    floatAccount: {
      default: null
    },
    costCenter: {
      default: null
    }
  },
  components: { money, date, FormList },
  mixins: [getChequeApiMixin, accountApiMixin, formsMixin],
  data() {
    return {
      searchPaidCheque: "",
      isLoading: false,
      cheque: {
        received_or_paid: this.receivedOrPaid,
        account: this.account
      },
      paidCheques: [],
      chequeTypes: [
        {
          label: "شخصی",
          value: "p"
        },
        {
          label: "شخصی سایرین",
          value: "op"
        },
        {
          label: "شرکت",
          value: "c"
        },
        {
          label: "شرکت سایرین",
          value: "oc"
        }
      ]
    };
  },
  computed: {
    isPaidCheque() {
      return this.receivedOrPaid == "p";
    },
    title() {
      let title = "چک ";
      if (this.isPaidCheque) title += "پرداختی";
      else title += "دریافتی";
      return title;
    },
    canSetSanadCode() {
      let statusChange = this.cheque.statusChanges;
      if (statusChange) {
        return statusChange.length == 0;
      } else {
        return true;
      }
    },

    canDeleteCheque() {
      if (this.isPaidCheque) return false;
      if (this.cheque.id) {
        let statusChangesLength = this.cheque.statusChanges.length;
        if (this.isPaidCheque) {
          if (statusChangesLength == 0) return true;
        } else {
          if (statusChangesLength == 1) return true;
        }
        return false;
      }
      return false;
    },

    canEditCheque() {
      if (this.cheque.id) {
        if (!this.cheque.statusChanges) return false;
        let statusChangesLength = this.cheque.statusChanges.length;
        if (this.isPaidCheque) {
          if (statusChangesLength == 0) return true;
        } else {
          if (statusChangesLength == 1) return true;
        }
        return false;
      }
      return false;
    }
  },
  watch: {
    account() {
      this.setAccounts();
    },
    floatAccount() {
      this.setAccounts();
    },
    costCenter() {
      this.setAccounts();
    },
    cheque() {
      if (this.modalMode) {
        this.setAccounts();
      }
    },
    searchPaidCheque() {
      if (this.cheque.title != this.searchPaidCheque) {
        this.getPaidCheques(this.searchPaidCheque);
      } else {
        this.cheque.account = null;
      }
    }
  },
  created() {
    this.getAccounts();
    if (this.id) {
      this.getCheque(this.id);
    }

    if (this.isPaidCheque) {
      this.getPaidCheques("");
    }
  },
  methods: {
    setAccounts() {
      this.cheque.account = this.account;
      this.cheque.floatAccount = this.floatAccount;
      this.cheque.costCenter = this.costCenter;
    },
    validate(clearForm) {
      if (this.modalMode) {
        this.$emit("submit", this.extractIds(this.cheque));
      } else {
        this.submitCheque(clearForm);
      }
    },
    submitCheque(clearForm) {
      this.request({
        url: this.endpoint("cheques/cheques/submit/"),
        data: this.extractIds(this.cheque),
        method: "post",
        success: data => {
          if (clearForm) {
            this.clearCheque();
          } else {
            this.$router.push({
              name: "ChequeDetail",
              params: {
                id: data.id
              }
            });
          }
          this.successNotify();
        }
      });
    },
    updateCheque(clearForm) {
      this.request({
        url: this.endpoint(`cheques/cheques/${this.cheque.id}`),
        data: this.extractIds(this.cheque),
        method: "put",
        success: data => {
          if (clearForm) {
            this.clearCheque();
          }
          this.successNotify();
        }
      });
    },
    deleteCheque() {
      this.request({
        url: this.endpoint(`cheques/cheques/${this.cheque.id}`),
        method: "delete",
        success: data => {
          this.notify("چک با موفقیت حذف شد", "success");
          this.clearCheque();
        }
      });
    },
    clearCheque() {
      this.$router.push({
        name: "ChequeForm",
        params: {
          receivedOrPaid: this.receivedOrPaid
        }
      });
      this.cheque = {
        received_or_paid: this.receivedOrPaid
      };
    },
    getChequeByPosition(pos) {
      return this.request({
        url: this.endpoint("cheques/getChequeByPosition"),
        method: "get",
        params: {
          received_or_paid: this.receivedOrPaid,
          id: this.id,
          position: pos
        },
        success: data => {
          this.setCheque(data);
        },
        error: error => {
          if (error.response.status == 404) {
            this.notify("چک وجود ندارد", "warning");
          }
        }
      });
    },
    setCheque(cheque) {
      this.$router.push({
        name: "ChequeForm",
        params: {
          receivedOrPaid: cheque.received_or_paid,
          id: cheque.id
        }
      });
      this.cheque = cheque;
    },
    getPaidCheques(value) {
      this.paidCheques = [];

      if (this.isLoading) return;

      this.isLoading = true;
      this.request({
        url: this.endpoint("reports/lists/cheques"),
        method: "get",
        loading: false,
        params: {
          limit: 30,
          offset: 0,
          serial__icontains: value,
          account__icontains: value,
          chequebook__explanation__icontains: value,
          chequebook__account__name__icontains: value,
          status: "blank",
          received_or_paid: "p"
        },
        success: data => {
          this.isLoading = false;
          this.paidCheques = data.results;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>

