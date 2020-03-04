<template>
  <div class="modal fade" id="change-cheque-status-modal" tabindex="-1" v-if="cheque">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            تغییر وضعیت چک
            {{ chequeLabel }}
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row">
              <div class="col-12 col-md-4">
                <label class="required">تغییر وضعیت به</label>
                <multiselect
                  dir="rtl"
                  label="label"
                  track-by="name"
                  :options="statuses"
                  v-model="newStatus"
                />
              </div>
              <template v-if="newStatus">
                <div class="form-group col-12 col-md-8" v-if="newStatus.hasAccount">
                  <label class="required">{{ accountLabel(newStatus) }}</label>
                  <multiselect
                    :disabled="isPaidCheque?newStatus.paidAccountDisable:newStatus.receivedAccountDisable"
                    dir="rtl"
                    label="name"
                    track-by="id"
                    :options="newStatusAccounts"
                    v-model="statusChange.account"
                  />
                </div>
                <div
                  class="form-group col-12 col-md-8 offset-md-4"
                  v-if="statusChange.account && statusChange.account.floatAccountGroup"
                >
                  <label class="required">حساب شناور</label>
                  <multiselect
                    dir="rtl"
                    label="name"
                    track-by="id"
                    :options="statusChange.account.floatAccountGroup.floatAccounts"
                    v-model="statusChange.floatAccount"
                  />
                </div>
                <div class="w-100"></div>
                <div class="form-group col-12 col-md-4">
                  <label class="required">تاریخ</label>
                  <date class="form-control" v-model="statusChange.date" :default="true"/>
                </div>
                <div class="form-group col-12 col-md-8">
                  <label>توضیحات</label>
                  <textarea class="form-control" rows="4" v-model="statusChange.explanation"></textarea>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
          <button @click="submitCheque()" type="button" class="btn btn-primary">ثبت</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountApi";
import getChequeApiMixin from "./getChequeApi.js";
import sanadApiMixin from "@/mixin/sanadApi";
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
  mixins: [accountApiMixin, getChequeApiMixin, sanadApiMixin],
  data() {
    return {
      statusChange: {},
      newStatus: null
    };
  },
  computed: {
    newStatusAccounts() {
      let name = this.newStatus.name;
      if (name == "passed") {
        return this.accountsSelectValues.banks;
      }
      return this.accountsSelectValues.levels[3];
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
          $("#change-cheque-status-modal").modal("hide");
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
          $("#change-cheque-status-modal").modal("hide");
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

