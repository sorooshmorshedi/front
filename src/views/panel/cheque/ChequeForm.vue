<template>
  <div>
    <m-form
      :title="title"
      :showListBtn="false"
      :showList="false"
      :listRoute="{name: 'List', params:{form: 'cheque', type: this.receivedOrPaid == 'p'?'paid':'received'}}"
      :showNavigationButtons="!modalMode"
      :showSubmitAndClearForm="!modalMode"
      :canEdit="canEdit"
      :canDelete="canDelete"
      :canSubmit="canSubmit"
      :isEditing.sync="isEditing"
      @clearForm="clearForm"
      @goToForm="getItemByPosition"
      @submit="validate"
      @delete="deleteItem"
    >
      <template #header-btns>
        <v-btn
          v-if="id"
          class="blue white--text mr-1"
          :to="{ name: 'ChequeDetail', id: id, }"
        >مشاهده جزئیات چک</v-btn>
      </template>

      <template>
        <v-row>
          <template v-if="isPaidCheque">
            <v-col cols="12" md="3">
              <v-autocomplete
                required
                label=" * دسته چک"
                :items="chequebooks"
                item-text="account.name"
                v-model="item.chequebook"
                :disabled="id != null || !isEditing"
                @change="getPaidCheques"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-autocomplete
                required
                :disabled="!chequebook || !isEditing"
                label=" * چک"
                :items="paidCheques"
                v-model="item"
              />
            </v-col>
          </template>
          <v-col cols="12" md="3" v-else>
            <v-text-field
              required
              label=" * سریال چک"
              v-model="item.serial"
              :disabled="isPaidCheque || !isEditing"
            />
          </v-col>
          <v-col cols="12" md="6">
            <account-select
              :label="' * ' + (isPaidCheque?'دریافت کننده':'پرداخت کننده')"
              items-type="level3"
              v-model="item.account"
              :disabled="!isEditing"
              :floatAccount="item.floatAccount"
              @update:floatAccount="v => item.floatAccount = v"
              :costCenter="item.costCenter"
              @update:costCenter="v => item.costCenter = v"
            />
          </v-col>
          <v-col cols="12" md="3">
            <money label=" * مبلغ" v-model="item.value" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="3">
            <date
              label=" * تاریخ سررسید"
              v-model="item.due"
              :default="true"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <date
              :label="' * ' + (isPaidCheque?'تاریخ پرداخت':'تاریخ دریافت')"
              v-model="item.date"
              :default="true"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3" v-if="canSetSanadCode">
            <v-text-field label="شماره سند" v-model="item.sanad_code" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="12">
            <v-textarea label="شرح چک" v-model="item.explanation" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="12" v-if="!isPaidCheque">
            <v-select
              label=" * نوع چک"
              :items="chequeTypes"
              item-text="label"
              item-value="value"
              :return-object="false"
              v-model="item.type"
              :disabled="!isEditing"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="نام بانک"
              v-model="item.bankName"
              :disabled="isPaidCheque || !isEditing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="نام شعبه"
              v-model="item.branchName"
              :disabled="isPaidCheque || !isEditing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="شماره حساب چک"
              v-model="item.accountNumber"
              :disabled="isPaidCheque || !isEditing"
            />
          </v-col>
        </v-row>
      </template>
    </m-form>
    <form-list class="mt-3" form="cheque" :type="isPaidCheque?'paid':'received'" ref="formList" />
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import getChequeApiMixin from "./getChequeApi.js";
import FormList from "@/views/panel/lists/List";
import formsMixin from "@/mixin/forms";
import GetChequebooksApi from "@/views/panel/chequebook/getChequebooksApi";
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";

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
  mixins: [
    getChequeApiMixin,
    accountApiMixin,
    formsMixin,
    GetChequebooksApi,
    ListModalFormMixin
  ],
  data() {
    return {
      baseUrl: "cheques/cheques",
      hasList: false,
      hasIdProp: true,
      chequebook: {},
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
    createUrl() {
      return "cheques/cheques/submit/";
    },
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
      let statusChange = this.item.statusChanges;
      if (statusChange) {
        return statusChange.length == 0;
      } else {
        return true;
      }
    },

    canDelete() {
      if (this.isPaidCheque) return false;
      if (this.item.id) {
        let statusChangesLength = this.item.statusChanges.length;
        if (this.isPaidCheque) {
          if (statusChangesLength == 0) return true;
        } else {
          if (statusChangesLength == 1) return true;
        }
        return false;
      }
      return false;
    },

    canEdit() {
      if (this.item.id) {
        if (!this.item.statusChanges) return false;
        let statusChangesLength = this.item.statusChanges.length;
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
    }
  },
  created() {
    this.getAccounts();
    if (this.id) {
      this.getCheque(this.id);
    }

    if (this.isPaidCheque) {
      this.getChequebooks();
    }
  },
  methods: {
    getData() {
      if (this.$refs.formList) {
        this.$refs.formList.$refs.datatable.getData();
      }
    },
    setAccounts() {
      this.item.account = this.account;
      this.item.floatAccount = this.floatAccount;
      this.item.costCenter = this.costCenter;
    },

    // changeRouteTo(id) {
    //   if (id) {
    //     this.$router.push({
    //       name: "ChequeDetail",
    //       params: {
    //         id: id
    //       }
    //     });
    //   } else {
    //     this.$router.push({
    //       name: "ChequeForm",
    //       params: {
    //         receivedOrPaid: this.receivedOrPaid
    //       }
    //     });
    //   }
    //   let params = {
    //     ...this.$route.params,
    //     id: id
    //   };

    //   let isDuplicate = true;
    //   Object.keys(params).forEach(key => {
    //     if (params[key] != this.$route.params[key]) {
    //       isDuplicate = false;
    //     }
    //   });

    //   if (!isDuplicate) {
    //     this.$router.push({
    //       name: this.$route.name,
    //       params: params
    //     });
    //   }

    //   if (!id) {
    //     this.isEditing = true;
    //   } else {
    //     this.isEditing = false;
    //   }
    // },
    validate(clearForm) {
      if (this.modalMode) {
        this.$emit("submit", this.extractIds(this.item));
      } else {
        this.submit(clearForm);
      }
    },
    getItemTemplate() {
      return {
        received_or_paid: this.receivedOrPaid
      };
    },
    getItemByPosition(pos) {
      return this.request({
        url: this.endpoint("cheques/getChequeByPosition"),
        method: "get",
        params: {
          received_or_paid: this.receivedOrPaid,
          id: this.id,
          position: pos
        },
        success: data => {
          this.setItem(data);
        },
        error: error => {
          if (error.response.status == 404) {
            this.notify("چک وجود ندارد", "warning");
          }
        }
      });
    },
    getPaidCheques() {
      this.paidCheques = [];

      this.request({
        url: this.endpoint("reports/lists/cheques"),
        method: "get",
        loading: false,
        params: {
          chequebook__id: this.chequebook.id,
          status: "blank"
        },
        success: data => {
          this.paidCheques = data;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>

