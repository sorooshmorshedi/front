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
              label="تغییر وضعیت به"
              item-text="label"
              item-value="name"
              :items="statuses"
              v-model="newStatus"
              @change="clearForm"
            />
          </v-col>
          <template v-if="newStatus">
            <v-col cols="12">
              <v-text-field label="شماره سند" v-model="statusChange.sanad_code" />
            </v-col>
            <template v-if="newStatus.hasAccount">
              <v-col cols="12">
                <account-select
                  required
                  :label=" accountLabel(newStatus) "
                  :disabled="isPaidCheque?newStatus.paidAccountDisable:newStatus.receivedAccountDisable"
                  label="name"
                  track-by="id"
                  :itemsType="newStatusAccountsType"
                  v-model="statusChange.account"
                  :floatAccount="statusChange.floatAccount"
                  @update:floatAccount="v => statusChange.floatAccount = v"
                  :costCenter="statusChange.costCenter"
                  @update:costCenter="v => statusChange.costCenter = v"
                />
              </v-col>
            </template>
            <v-col cols="12">
              <date required label="تاریخ" v-model="statusChange.date" :default="true" />
            </v-col>
            <v-col cols="12">
              <v-textarea label="توضیحات" v-model="statusChange.explanation" />
            </v-col>
          </template>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="submitCheque()" class="green white--text w-100px">ثبت</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import getChequeApiMixin from "./getChequeApi.js";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
export default {
  name: "ChangeChequeStatus",
  props: {
    cheque: {
      required: true
    }
  },
  components: { money, date },
  mixins: [accountApiMixin, getChequeApiMixin],
  data() {
    return {
      dialog: false,
      statusChange: {},
      newStatus: null
    };
  },
  computed: {
    isPaidCheque() {
      return this.cheque.received_or_paid == "p";
    },
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
          paidAccountLabel: "حساب پرداخت کننده چک"
        },
        {
          name: "transferred",
          label: "انتقالی",
          hasAccount: true,
          accountLabel: "حساب گیرنده چک"
        },
        { name: "bounced", label: "برگشتی", hasAccount: false },
        {
          name: "cashed",
          label: "نقدی",
          hasAccount: true,
          receivedAccountLabel: "حساب دریافت کننده وجه چک",
          paidAccountLabel: "حساب پرداخت کننده چک",
          defaultAccount: null
        },
        { name: "revoked", label: "باطل شده", hasAccount: false },
        {
          name: "inFlow",
          label: "در جریان",
          hasAccount: true,
          accountLabel: "حساب در جریان",
          defaultAccount: null
        },
        {
          name: "revertInFlow",
          label: "ابطال وضعیت  در جریان وصول",
          hasAccount: false
        }
      ];
      let res = [];
      statuses.forEach(s => {
        if (this.isPaidCheque) {
          if (["inFlow", "revertInFlow", "transferred"].includes(s.name)) {
            return;
          }
        }
        if (this.cheque.status == "inFlow") {
          if (!["passed", "bounced", "revertInFlow"].includes(s.name)) return;
        }
        if (this.cheque.status == "bounced") {
          if (!["transferred", "inFlow", "cashed", "passed"].includes(s.name))
            return;
        }
        if (this.cheque.status == "notPassed") {
          if (["revertInFlow"].includes(s.name)) return;
        }
        if (this.cheque.status == s.name) return;
        res.push(s);
      });
      return res;
    },
    chequebook() {
      return this.cheque.chequebook;
    },
    chequeLabel() {
      return this.isPaidCheque ? "پرداختنی" : "دریافتنی";
    }
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
          o => o.programingName == "inFlowDocuments"
        )[0];
      }
      if (name == "cashed") {
        acc = this.defaultAccounts.filter(o => o.programingName == "cash")[0];
      }
      if (name == "passed" && this.chequebook) {
        acc = { account: this.chequebook.account };
      }
      if (acc) this.statusChange.account = acc.account;
    }
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
        success: data => {
          this.dialog = false;
          this.$emit("statusChange");
          this.successNotify();
          this.clearStatusChange();
        }
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
          explanation: this.statusChange.explanation
        },
        success: data => {
          this.dialog = false;
          this.successNotify();
        }
      });
    },
    accountLabel(status) {
      if (status.accountLabel) return status.accountLabel;
      if (this.isPaidCheque) return status.paidAccountLabel;
      else return status.receivedAccountLabel;
    },
    clearStatusChange() {
      this.statusChange = {};
    }
  }
};
</script>

<style scoped lang="scss">
</style>

