<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body" @keyup.enter="validate(true)">
          <form-header
            v-if="!modalMode"
            formName="چک"
            :title="title"
            :ListRouteParams="{form: 'cheque', type: this.receivedOrPaid == 'p'?'paid':'received'}"
            @clearForm="clearCheque(true)"
          >
            <router-link
              v-if="id"
              class="btn btn-info"
              :to="{ name: 'ChequeDetail', id: id, }"
            >مشاهده جزئیات چک</router-link>
          </form-header>

          <div class="row">
            <div v-if="!id && isPaidCheque" class="form-group col-12 col-md-6">
              <label>چک</label>
              <multiselect
                dir="rtl"
                label="title"
                track-by="id"
                :options="paidCheques"
                :internalSearch="false"
                @search-change="getPaidCheques"
                v-model="cheque"
              />
            </div>
            <div v-else class="form-group col-md-6">
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

          <hr>

          <form-footer
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
          ></form-footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountApi";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import getChequeApiMixin from "./getChequeApi.js";

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
    }
  },
  components: { money, date },
  mixins: [getChequeApiMixin, accountApiMixin, formsMixin],
  data() {
    return {
      cheque: {
        received_or_paid: this.receivedOrPaid
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
    validate(clearForm) {
      if (this.cheque.id && this.cheque.statusChanges.length == 1) {
        this.updateCheque(clearForm);
      } else {
        this.submitCheque(clearForm);
      }
    },
    submitCheque(clearForm) {
      if (this.cheque.type) {
        this.cheque.type = this.cheque.type.value;
      }

      this.log("change cheque status", this.cheque);

      this.request({
        url: this.endpoint("cheques/cheques/submit"),
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
      this.request({
        url: this.endpoint("reports/lists/cheques"),
        method: "get",
        loading: false,
        params: {
          limit: 30,
          offset: 0,
          filters: {
            serial__icontains: value,
            account__icontains: value,
            chequebook__explanation__icontains: value,
            chequebook__account__name__icontains: value,
            status: "blank",
            received_or_paid: "p"
          }
        },
        success: data => {
          this.paidCheques = data.results;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>

