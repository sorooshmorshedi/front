<template>
  <v-dialog v-model="dialog" scrollable max-width="400px">
    <v-card>
      <v-card-title>
        تغییر وضعیت چک
        {{ chequeLabel }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              :return-object="true"
              label=" * تغییر وضعیت به"
              item-text="label"
              item-value="name"
              :items="statuses"
              v-model="newStatus"
              @change="clearForm"
            />
          </v-col>
          <template v-if="newStatus">
            <v-col cols="12">
              <v-text-field
                label="شماره سند"
                v-model="statusChange.sanad_code"
              />
            </v-col>
            <template v-if="newStatus.hasAccount">
              <v-col cols="12">
                <account-select
                  required
                  :label="' * ' + accountLabel(newStatus)"
                  :disabled="
                    cheque.is_paid
                      ? newStatus.paidAccountDisable
                      : newStatus.receivedAccountDisable
                  "
                  track-by="id"
                  :itemsType="newStatusAccountsType"
                  v-model="statusChange.account"
                  :floatAccount="statusChange.floatAccount"
                  @update:floatAccount="(v) => (statusChange.floatAccount = v)"
                  :costCenter="statusChange.costCenter"
                  @update:costCenter="(v) => (statusChange.costCenter = v)"
                />
              </v-col>
            </template>
            <v-col cols="12">
              <date
                placeholder=" * تاریخ"
                v-model="statusChange.date"
                :default="true"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea label="توضیحات" v-model="statusChange.explanation" />
            </v-col>
          </template>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="submitCheque()" class="green white--text w-100px"
          >ثبت</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import ChequeMixin from "./mixin.js";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
export default {
  name: "ChangeChequeStatus",
  props: {
    cheque: {
      required: true,
    },
  },
  components: { money, date },
  mixins: [accountApiMixin, ChequeMixin],
  data() {
    return {
      dialog: false,
      statusChange: {},
      newStatus: null,
    };
  },
  computed: {
    newStatusAccountsType() {
      let name = this.newStatus.name;
      if (name == "passed") {
        return "banks";
      }
      return "level3";
    },
    statuses() {
      let statuses = [
        {
          name: "passed",
          label: "پاس شده",
          hasAccount: true,
          paidAccountDisable: true,
          receivedAccountLabel: "حساب وصول چک",
          paidAccountLabel: "حساب پرداخت کننده چک",
        },
        {
          name: "transferred",
          label: "انتقالی",
          hasAccount: true,
          accountLabel: "حساب گیرنده چک",
        },
        { name: "bounced", label: "برگشتی", hasAccount: false },
        {
          name: "cashed",
          label: "نقدی",
          hasAccount: true,
          receivedAccountLabel: "حساب دریافت کننده وجه چک",
          paidAccountLabel: "حساب پرداخت کننده چک",
          defaultAccount: null,
        },
        { name: "revoked", label: "باطل شده", hasAccount: false },
        {
          name: "inFlow",
          label: "در جریان",
          hasAccount: true,
          accountLabel: "حساب در جریان",
          defaultAccount: null,
        },
        {
          name: "revertInFlow",
          label: "ابطال وضعیت  در جریان وصول",
          hasAccount: false,
        },

        {
          name: "extended",
          label: "تمدید شده",
          hasAccount: false,
        },

        {
          name: "guarantee",
          label: "ضمانتی",
          hasAccount: false,
        },
      ];
      let validStatuses = this.chequeStatusTree[
        this.cheque.is_paid == true ? "p" : "r"
      ][this.cheque.status];

      let result = []
      if (validStatuses) {
        result = statuses.filter((o) => validStatuses.includes(o.name));
        if(this.cheque.type != 'bg') {
          result = result.filter(o => o.name != 'extended');
        }
      } 
      return result;
    },
    chequebook() {
      return this.cheque.chequebook;
    },
    chequeLabel() {
      return this.cheque.is_paid ? "پرداختنی" : "دریافتنی";
    },
  },
  created() {
    this.getAccounts();
    this.getDefaultAccounts();
  },
  watch: {
    newStatus() {
      if (!this.newStatus) return;
      let name = this.newStatus.name;
      let acc = null;
      if (name == "inFlow") {
        acc = this.defaultAccounts.filter(
          (o) => o.codename == "inFlowDocuments"
        )[0];
      }
      if (name == "cashed") {
        acc = this.defaultAccounts.filter((o) => o.codename == "cash")[0];
      }
      if (name == "passed" && this.chequebook) {
        acc = { account: this.chequebook.account };
      }
      if (acc) this.statusChange.account = acc.account;
    },
  },
  methods: {
    clearForm() {
      this.statusChange = {};
    },
    submitCheque() {
      if (this.newStatus.name == "revertInFlow") {
        this.revertInFlow();
        return;
      }
      let payload = this.extractIds(this.copy(this.statusChange));
      payload.to_status = this.newStatus.name;
      payload.cheque = this.cheque.id;

      this.request({
        url: this.endpoint("cheques/cheques/changeStatus/" + this.cheque.id),
        data: payload,
        method: "post",
        success: (data) => {
          this.dialog = false;
          this.$emit("statusChange");
          this.successNotify();
          this.clearStatusChange();
        },
      });
    },
    revertInFlow() {
      this.request({
        url: this.endpoint(
          "cheques/cheques/revertInFlowStatus/" + this.cheque.id
        ),
        method: "post",
        data: {
          date: this.statusChange.date,
          explanation: this.statusChange.explanation,
        },
        success: (data) => {
          this.dialog = false;
          this.successNotify();
        },
      });
    },
    accountLabel(status) {
      if (status.accountLabel) return status.accountLabel;
      if (this.cheque.is_paid) return status.paidAccountLabel;
      else return status.receivedAccountLabel;
    },
    clearStatusChange() {
      this.statusChange = {};
    },
  },
};
</script>

<style scoped lang="scss"></style>
