<template>
  <div class="modal fade" id="change-cheque-status-modal" tabindex="-1" v-if="cheque && cheque.account">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            تغییر وضعیت چک
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="title-2">مشخصات چک</div>
            <div class="row jumbotron">
              <div class="col-md-6">
                <label> سریال چک: </label> {{ cheque.serial }}
              </div>
              <div class="col-md-6">
                <label>وضعیت: </label>
                <span class="status-box">
                  {{ cheque.status | chequeStatuses }}
                </span>
              </div>
              <div class="col-md-6">
                <label> دریافت کننده: </label> {{ cheque.account.title }}
              </div>
              <div class="col-md-6" v-if="cheque.floatAccount">
                <label> حساب شناور: </label> {{ cheque.floatAccount.name }}
              </div>
              <div class="col-md-6">
                <label> مبلغ: </label> {{ cheque.value | toMoney }}
              </div>
              <div class="col-md-6">
                <label> تاریخ سررسید: </label> {{ cheque.due }}
              </div>
              <div class="col-md-6">
                <label v-if="cheque.type == 'paid'">تاریخ پرداخت:</label>
                <label v-else>تاریخ دریافت:</label>
                {{ cheque.date }}
              </div>
              <div class="col-md-6" v-if="cheque.type == 'received'">
                <label>نوع چک:</label>
              </div>
              <div class="col-md-6">
                <label> شرح چک: </label> {{ cheque.explanation }}
              </div>
              <div class="col-md-6">
                <label>نام بانک: </label> {{ cheque.bankName }}
              </div>
              <div class="col-md-6">
                <label>نام شعبه: </label> {{ cheque.branchName }}
              </div>
              <div class="col-md-6">
                <label>شماره حساب چک: </label> {{ cheque.accountNumber }}
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-12 col-md-4">
                <label>تغییر وضعیت به</label>
                <multiselect dir="rtl" label="label" track-by="name" :options="statuses" v-model="newStatus" />
              </div>
              <template v-if="newStatus">
                <div class="form-group col-12 col-md-8" v-if="newStatus.accountLabel">
                  <label>{{ newStatus.accountLabel }}</label>
                  <multiselect dir="rtl" label="name" track-by="id" :options="newStatusAccounts" v-model="statusChange.account" />
                </div>
                <div class="form-group col-12 col-md-8 offset-md-4" v-if="statusChange.account && statusChange.account.floatAccountGroup">
                  <label>حساب شناور</label>
                  <multiselect dir="rtl" label="name" track-by="id" :options="statusChange.account.floatAccountGroup.floatAccounts" v-model="statusChange.floatAccount" />
                </div>
                <div class="w-100"></div>
                <div class="form-group col-12 col-md-4">
                  <label>تاریخ</label>
                  <date class="form-control" v-model="statusChange.date" :default-date="true" />
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
import chequeApiMixin from "@/mixin/chequeApi";
import sanadApiMixin from "@/mixin/sanadApi";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
export default {
  name: "ChangeChequeStatus",
  props: ["inuseCheque", "inuseChequebook"],
  components: { money, date },
  mixins: [accountApiMixin, chequeApiMixin, sanadApiMixin],
  data() {
    return {
      cheque: null,
      chequebook: null,
      statusChange: {},
      newStatus: null
    };
  },
  created() {
    this.getAccounts();
    this.getDefaultAccounts();
    this.cheque = this.inuseCheque;
  },
  mounted() {
    // $("#change-cheque-status-modal").modal("show");
  },
  watch: {
    inuseCheque() {
      if (this.inuseCheque) this.cheque = this.inuseCheque;
      if (this.inuseChequebook) {
        this.chequebook = this.inuseChequebook;
        if (this.chequebook.account) {
          this.statusChange.bankName = this.chequebook.account.bank.name;
          this.statusChange.branchName = this.chequebook.account.bank.branch;
          this.statusChange.chequeAccountNumber = this.chequebook.account.bank.accountNumber;
        }
      }
    },
    newStatus() {
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
      if (name == "passed") {
        acc = this.defaultAccounts.filter(o => o.programingName == "bank")[0];
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
      if (this.cheque.type == "received") {
        payload.bedAccount = payload.account;
        payload.bedFloatAccount = payload.floatAccount;
      } else {
        payload.besAccount = payload.account;
        payload.besFloatAccount = payload.floatAccount;
      }
      payload.toStatus = this.newStatus.name;
      payload.cheque = this.cheque.id;

      this.request({
        url: this.endpoint("cheques/cheques/changeStatus/" + this.cheque.id),
        data: payload,
        method: "post",
        success: data => {
          $("#change-cheque-status-modal").modal("hide");
          if (this.cheque.type == "paid") this.getChequebooks(true);
          else this.getCheques(true);
          this.successNotify();
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
          explanation: this.statusChange.explanation,
        },
        success: data => {
          $("#change-cheque-status-modal").modal("hide");
          if (this.cheque.type == "paid") this.getChequebooks(true);
          else this.getCheques(true);
          this.successNotify();
        }
      });
    }
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
        { name: "revertInFlow", label: "ابطال در جریان", accountLabel: "" },
        {
          name: "inFlow",
          label: "در جریان",
          accountLabel: "حساب در جریان",
          defaultAccount: null
        },
        { name: "passed", label: "پاس شده", accountLabel: "حساب وصول چک" },
        { name: "bounced", label: "برگشتی", accountLabel: "" },
        {
          name: "cashed",
          label: "نقدی",
          accountLabel: "حساب دریافت کننده وجه چک",
          defaultAccount: null
        },
        { name: "revoked", label: "باطل شده", accountLabel: "" },
        {
          name: "transferred",
          label: "انتقالی",
          accountLabel: "حساب گیرنده چک"
        }
      ];
      let res = [];
      statuses.forEach(s => {
        if (this.cheque.type == "paid") {
          if (["inFlow", "transferred"].includes(s.name)) return;
        }
        if (this.cheque.status == "inFlow") {
          if (!["passed", "bounced", "revertInFlow"].includes(s.name)) return;
        }
        if (this.cheque.status == "bounced") {
          if (!['revoked', 'transferred','inFlow', 'cashed', 'passed'].includes(s.name)) return;
        }
        if (this.cheque.status == s.name) return;
        res.push(s);
      });
      return res;
    }
  }
};
</script>

<style scoped lang="scss">
.jumbotron {
  padding: 15px 10px;
}
.status-box {
  background-color: white;
  padding: 4px 8px;
  border-radius: 5px;
}
</style>

