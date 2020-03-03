<template>
  <div class="row rtl">
    <div class="col-12" v-if="cheque">
      <div class="card right">
        <div class="card-body">
          <div class="title">
            جزئیات چک
            <span>
              <router-link
                v-if="isPaidCheque"
                class="btn btn-info"
                :to="{name: 'ChequebookForm', params: {id: cheque.chequebook.id}}"
              >مشاهده دسته چک</router-link>
            </span>
          </div>

          <div class="row">
            <div class="col-12 col-md-6">
              <div class="row jumbotron">
                <template v-if="isPaidCheque">
                  <div class="col-md-6">
                    <label>حساب چک:</label>
                    {{ cheque.chequebook.account.title }}
                  </div>
                  <div class="col-md-6">
                    <label>توضیحات:</label>
                    {{ cheque.chequebook.explanation }}
                  </div>
                </template>
                <div class="col-md-6">
                  <label>سریال چک:</label>
                  {{ cheque.serial }}
                </div>
                <div class="col-md-6">
                  <label>وضعیت:</label>
                  <span class="status-box">{{ cheque.status | chequeStatuses }}</span>
                </div>
                <div class="col-md-6">
                  <label>دریافت کننده:</label>
                  {{ cheque.account && cheque.account.title }}
                </div>
                <div class="col-md-6" v-if="cheque.floatAccount">
                  <label>حساب شناور:</label>
                  {{ cheque.floatAccount.name }}
                </div>
                <div class="col-md-6">
                  <label>مبلغ:</label>
                  {{ cheque.value | toMoney }}
                </div>
                <div class="col-md-6">
                  <label>تاریخ سررسید:</label>
                  {{ cheque.due }}
                </div>
                <div class="col-md-6">
                  <label v-if="isPaidCheque">تاریخ پرداخت:</label>
                  <label v-else>تاریخ دریافت:</label>
                  {{ cheque.date }}
                </div>
                <div class="col-md-6" v-if="!isPaidCheque">
                  <label>نوع چک:</label>
                </div>
                <div class="col-md-6">
                  <label>شرح چک:</label>
                  {{ cheque.explanation }}
                </div>
                <div class="col-md-6">
                  <label>نام بانک:</label>
                  {{ cheque.bankName }}
                </div>
                <div class="col-md-6">
                  <label>نام شعبه:</label>
                  {{ cheque.branchName }}
                </div>
                <div class="col-md-6">
                  <label>شماره حساب چک:</label>
                  {{ cheque.accountNumber }}
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>تغییر از وضعیت</th>
                      <th>به وضعیت</th>
                      <th>تاریخ</th>
                      <th>حساب بدهکار</th>
                      <th>حساب بستانکار</th>
                      <th>توضیحات</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(sc, i) in statusChanges" :key="i">
                      <td>{{ i+1 }}</td>
                      <td>{{ sc.fromStatus | chequeStatuses }}</td>
                      <td>{{ sc.toStatus | chequeStatuses }}</td>
                      <td>{{ sc.date }}</td>
                      <template v-if="sc.sanad && sc.sanad.items.length">
                        <td>{{ sc.sanad.items[0].account.name }}</td>
                        <td>{{ sc.sanad.items[1].account.name }}</td>
                      </template>
                      <template v-else>
                        <td>-</td>
                        <td>-</td>
                      </template>
                      <td>{{ sc.explanation }}</td>
                      <td>
                        <router-link
                          v-if="sc.sanad"
                          :to="{name: 'SanadForm',params:{id: sc.sanad.id }}"
                          target="_blank"
                        >مشاهده سند</router-link>
                      </td>
                      <td>
                        <i
                          v-if="i == statusChanges.length-1 && (isPaidCheque || i != 0)"
                          @click.prevent="deleteStatusChange(sc)"
                          class="fas fa-trash-alt text-danger"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="col-12 text-left">
              <router-link
                v-if="canEditCheque"
                class="btn btn btn-info w-100px"
                :to="{name: 'ChequeForm', params: {receivedOrPaid: cheque.received_or_paid, id: id} }"
              >ویرایش</router-link>
              <router-link
                v-if="canSubmitCheque"
                class="btn btn btn-info w-100px"
                :to="{name: 'ChequeForm', params: {receivedOrPaid: cheque.received_or_paid, id: id} }"
              >ثبت</router-link>
              <button
                @click="changeChequeStatusModal()"
                :disabled="!canChangeStatus"
                type="button"
                class="btn btn btn-info"
              >تغییر وضعیت چک</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <change-cheque-status :cheque="cheque" @statusChange="getCheque(id)"/>
  </div>
</template>

<script>
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import changeChequeStatus from "./ChangeChequeStatus";
import getChequeApiMixin from "./getChequeApi.js";
export default {
  components: { money, date, changeChequeStatus },
  mixins: [getChequeApiMixin],
  props: {
    id: {
      required: true
    }
  },
  data() {
    return {
      cheque: null
    };
  },
  computed: {
    isPaidCheque() {
      return this.cheque.received_or_paid == "p";
    },
    statusChanges() {
      if (this.cheque) return this.cheque.statusChanges;
      return [];
    },
    canSubmitCheque() {
      return this.statusChanges.length == 0;
    },
    canEditCheque() {
      return this.statusChanges.length <= 1;
    },
    canChangeStatus() {
      let s = this.cheque.status;
      if (["passed", "cashed", "revoked", "transferred", "blank"].includes(s))
        return false;
      return true;
    }
  },
  created() {
    this.getCheque(this.id);
  },
  methods: {
    changeChequeStatusModal() {
      $("#change-cheque-status-modal").modal("show");
    },
    payer(cheque) {
      let res = cheque.account.title;
      if (cheque.floatAccount) res += cheque.floatAccount.name;
      return res;
    },
    deleteStatusChange(sc) {
      this.request({
        url: this.endpoint(`cheques/statusChange/${sc.id}/`),
        method: "delete",
        success: data => {
          this.getCheque(this.id);
          this.successNotify();
        }
      });
    },
    setCheque(cheque) {
      this.$router.push({
        name: "ChequeDetail",
        params: {
          id: cheque.id
        }
      });
      this.cheque = cheque;
    }
  },
  filters: {
    chequeStatuses(val) {
      switch (val) {
        case "blank":
          return "سفید";
        case "notPassed":
          return "پاس نشده";
        case "inFlow":
          return "در جریان";
        case "passed":
          return "پاس شده";
        case "bounced":
          return "برگشتی";
        case "cashed":
          return "نقدی";
        case "revoked":
          return "باطل شده";
        case "transferred":
          return "انتقالی";
      }
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

