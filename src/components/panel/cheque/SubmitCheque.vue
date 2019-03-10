<template>
  <div class="modal fade" id="submit-paid-cheque-modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            ثبت چک
            <span v-if="isPaidCheque">پرداختی</span>
            <span v-else>دریافتی</span>
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="">
            <div class="row">
              <div class="form-group col-md-6">
                <label for>سریال چک</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="cheque.serial"
                  :disabled="isPaidCheque"
                >
              </div>
              <div class="form-group col-12 col-md-6">
                <label v-if="isPaidCheque">دریافت کننده</label>
                <label v-else>پرداخت کننده</label>
                <multiselect
                  dir="rtl"
                  label="name"
                  track-by="id"
                  :options="accountsSelectValues.levels[3]"
                  v-model="cheque.account"
                />
              </div>
              <div
                class="form-group col-12 col-md-9 offset-md-3"
                v-if="cheque.account && cheque.account.floatAccountGroup"
              >
                <label for>حساب شناور</label>
                <multiselect
                  dir="rtl"
                  label="name"
                  track-by="id"
                  :options="cheque.account.floatAccountGroup.floatAccounts"
                  v-model="cheque.floatAccount"
                />
              </div>
              <div class="form-group col-12 col-md-6">
                <label for>مبلغ</label>
                <money class="form-control" v-model="cheque.value"/>
              </div>
              <div class="form-group col-12 col-md-3">
                <label for>تاریخ سررسید</label>
                <date class="form-control" v-model="cheque.due" :default="true"/>
              </div>
              <div class="form-group col-12 col-md-3">
                <label v-if="isPaidCheque">تاریخ پرداخت</label>
                <label v-else>تاریخ دریافت</label>
                <date class="form-control" v-model="cheque.date" :default="true"/>
              </div>
              <div class="col-12 col-md-6">
                <div class="row">
                  <div class="form-group col-12" v-if="!isPaidCheque">
                    <label for>نوع چک</label>
                    <select class="custom-select" v-model="cheque.type">
                      <option
                        v-for="type in chequeTypes"
                        :key="type.value"
                        :value="type.value"
                      >{{ type.label }}</option>
                    </select>
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
                    <label for>نام بانک</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="cheque.bankName"
                      :disabled="isPaidCheque"
                    >
                  </div>
                  <div class="form-group col-12 col-md-4">
                    <label for>نام شعبه</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="cheque.branchName"
                      :disabled="isPaidCheque"
                    >
                  </div>
                  <div class="form-group col-12 col-md-4">
                    <label for>شماره حساب چک</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="cheque.accountNumber"
                      :disabled="isPaidCheque"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
          <button @click="submitCheque()" type="button" class="btn btn-primary w-100px">ثبت</button>
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
  props: ["inuseCheque", "inuseChequebook", "selectCheque"],
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
    if (!this.selectCheque) {
      this.cheque = this.inuseCheque;
    }
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
      if (this.cheque.type) {
        this.cheque.type = this.cheque.type.value;
      }
      if (!this.cheque.id) {
        this.storeCheque();
        this.log("create cheque");
        return;
      }
      let update = false;
      if (this.cheque.statusChanges && this.cheque.statusChanges.length == 1)
        update = true;

      this.log("change cheque status", this.cheque, update);
      this.request({
        url: this.endpoint("cheques/cheques/changeStatus/" + this.cheque.id),
        data: {
          cheque: this.extractIds(this.cheque),
          statusChange: this.extractIds(this.statusChange),
          update: update
        },
        method: "put",
        success: data => {
          $("#submit-paid-cheque-modal").modal("hide");
          if (this.isPaidCheque) this.getChequebooks(true);
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
          this.cheque.id = data.id;
          this.submitCheque();
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>

