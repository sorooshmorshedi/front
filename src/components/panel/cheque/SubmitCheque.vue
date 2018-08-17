<template>
  <div class="modal fade" id="submit-paid-cheque-modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            ثبت چک
            <span v-if="cheque.type == 'paid'">پرداختی</span>
            <span v-else>دریافتی</span>
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="form-group col-md-3">
                <label for="">سریال چک</label>
                <input type="number" class="form-control" v-model="cheque.serial" :disabled="cheque.type == 'paid'">
              </div>
              <div class="form-group col-12 col-md-9">
                <label v-if="cheque.type == 'paid'">دریافت کننده</label>
                <label v-else>پرداخت کننده</label>
                <multiselect dir="rtl" label="name" track-by="id" :options="accountsSelectValues.levels[3]" v-model="cheque.account" />
              </div>
              <div class="form-group col-12 col-md-9 offset-md-3" v-if="cheque.account && cheque.account.floatAccountGroup">
                <label for="">حساب شناور</label>
                <multiselect dir="rtl" label="name" track-by="id" :options="cheque.account.floatAccountGroup.floatAccounts" v-model="cheque.floatAccount" />
              </div>
              <div class="form-group col-12 col-md-6">
                <label for="">مبلغ</label>
                <money class="form-control" v-model="cheque.value" />
              </div>
              <div class="form-group col-12 col-md-3">
                <label for="">تاریخ سررسید</label>
                <date class="form-control" v-model="cheque.due" :default-date="true" />
              </div>
              <div class="form-group col-12 col-md-3">
                <label v-if="cheque.type == 'paid'">تاریخ پرداخت</label>
                <label v-else>تاریخ دریافت</label>
                <date class="form-control" v-model="cheque.date" :default-date="true" />
              </div>
              <div class="col-12 col-md-6">
                <div class="row">
                  <div class="form-group col-12" v-if="cheque.type == 'received'">
                    <label for="">نوع چک</label>
                    <multiselect dir="rtl" label="name" track-by="id" :options="[]" />
                  </div>
                </div>
              </div>
              <div class="form-group col-12 col-md-6">
                <label>شرح چک</label>
                <textarea class="form-control" v-model="cheque.explanation" style="height:126px;"></textarea>
              </div>
              <div class="col-12">
                <div class="row">
                  <div class="form-group col-12 col-md-4">
                    <label for="">نام بانک</label>
                    <input type="text" class="form-control" :value="cheque.bankName" :disabled="cheque.type == 'paid'">
                  </div>
                  <div class="form-group col-12 col-md-4">
                    <label for="">نام شعبه</label>
                    <input type="text" class="form-control" :value="cheque.branchName" :disabled="cheque.type == 'paid'">
                  </div>
                  <div class="form-group col-12 col-md-4">
                    <label for="">شماره حساب چک</label>
                    <input type="text" class="form-control" :value="cheque.accountNumber" :disabled="cheque.type == 'paid'">
                  </div>
                </div>
              </div>
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
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
export default {
  name: "SubmitCheque",
  props: ["inuseCheque", "inuseChequebook"],
  components: { money, date },
  mixins: [accountApiMixin, chequeApiMixin],
  data() {
    return {
      cheque: {},
      chequebook: {},
      statusChange: {}
    };
  },
  created() {
    this.getAccounts();
    this.cheque = this.inuseCheque;
  },
  watch: {
    inuseCheque() {
      if (this.inuseCheque) this.cheque = this.inuseCheque;
      if (this.inuseChequebook) {
        this.chequebook = this.inuseChequebook;
        if (this.chequebook.account) {
          this.cheque.bankName = this.chequebook.account.bank.name;
          this.cheque.branchName = this.chequebook.account.bank.branch;
          this.cheque.accountNumber = this.chequebook.account.bank.accountNumber;
        }
      }
    }
  },
  methods: {
    submitCheque() {
      if (!this.cheque.id) {
        this.storeCheque();
        return;
      }
      this.request({
        url: this.endpoint("cheques/cheques/changeStatus/" + this.cheque.id),
        data: {
          cheque: this.extractIds(this.cheque),
          statusChange: this.extractIds(this.statusChange)
        },
        method: "put",
        success: data => {
          $("#submit-paid-cheque-modal").modal("hide");
          if (this.cheque.type == "paid") this.getChequebooks(true);
          else this.getCheques(true);
          this.successNotify();
        }
      });
    },
    storeCheque() {
      this.request({
        url: this.endpoint("cheques/cheques/"),
        data: this.extractIds(this.cheque),
        method: "post",
        success: data => {
          this.cheque = data;
          this.submitCheque();
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>

