<template>
  <div>
    <v-card v-if="cheque">
      <v-card-title>
        {{ title }}
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-simple-table dense class="detail-table">
              <tbody>
              <tr>
                <th>سریال :</th>
                <td>{{ cheque.serial }}</td>
              </tr>
              <tr>
                <th>نام بانک:</th>
                <td>{{ cheque.bankName }}</td>
              </tr>
              <tr>
                <th>نام شعبه:</th>
                <td>{{ cheque.branchName }}</td>
              </tr>
              <tr>
                <th>شماره حساب :</th>
                <td>{{ cheque.accountNumber }}</td>
              </tr>
              </tbody>
            </v-simple-table>
          </v-col>
          <v-col cols="12" md="4">
            <v-simple-table dense class="detail-table">
              <tbody>
              <tr>
                <th>مبلغ:</th>
                <td>{{ cheque.value | toMoney }}</td>
              </tr>
              <tr>
                <th>تاریخ سررسید:</th>
                <td>{{ cheque.due }}</td>
              </tr>
              <tr>
                <th>شرح :</th>
                <td>{{ cheque.explanation }}</td>
              </tr>
              <tr>
                <th>وضعیت:</th>
                <td>{{ cheque.status | chequeStatuses }}</td>
              </tr>
              </tbody>
            </v-simple-table>
          </v-col>
          <v-col cols="12" md="4">
            <v-simple-table dense class="detail-table">
              <tbody>
              <tr>
                <th v-if="isPaidCheque">تاریخ پرداخت:</th>
                <th v-else>تاریخ دریافت:</th>
                <td>{{ cheque.date }}</td>
              </tr>
              <tr>
                <th>کد و نام مشتری:</th>
                <td>{{ cheque.account && cheque.account.title }}</td>
              </tr>
              <tr v-if="cheque.floatAccount">
                <th>حساب شناور:</th>
                <td>{{ cheque.floatAccount.name }}</td>
              </tr>
              <tr v-if="isPaidCheque">
                <th>حساب :</th>
                <td>{{ cheque.chequebook.account.title }}</td>
              </tr>
              <tr v-if="!isPaidCheque">
                <th>نوع :</th>
                <td></td>
              </tr>

              <tr v-if="isPaidCheque">
                <th>شرح:</th>
                <td>{{ cheque.chequebook.explanation }}</td>
              </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            v-if="canSubmitCheque && isPaidCheque && cheque.status == 'blank'"
            class="red white--text"
            @click="showRevokeDialog = true"
        >باطل کردن
        </v-btn
        >
        <v-btn
            v-if="canSubmitCheque"
            class="green white--text w-100px"
            :to="{
            name: 'ChequeForm',
            params: { type: 'c', isPaid: cheque.is_paid, id: id },
          }"
        >ثبت
        </v-btn
        >
        <v-btn
            v-else-if="canEditCheque"
            class="amber w-100px"
            :to="{
            name: 'ChequeForm',
            params: { type: cheque.type, isPaid: cheque.is_paid, id: id },
          }"
        >ویرایش
        </v-btn
        >
      </v-card-actions>
    </v-card>

    <v-card v-if="cheque" class="mt-3">
      <v-card-title>
        تغییر وضعیت ها
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-text>
        <v-simple-table class="status-changes-table">
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
            <td>{{ i + 1 }}</td>
            <td>{{ sc.fromStatus | chequeStatuses }}</td>
            <td>{{ sc.toStatus | chequeStatuses }}</td>
            <td>{{ sc.date }}</td>
            <td>{{ sc.bedAccount.name | '-' }}</td>
            <td>{{ sc.besAccount.name | '-' }}</td>
            <td>{{ sc.explanation }}</td>
            <td>
              <open-sanad-btn
                  v-if="sc.sanad"
                  :sanad="sc.sanad"
              />
            </td>
            <td>
              <v-btn
                  v-if="
                    i == statusChanges.length - 1 &&
                      (isPaidCheque || i != 0) &&
                      !financialYear.is_closed
                  "
                  @click.prevent="deleteStatusChange(sc)"
                  class="red--text"
                  icon
              >
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            @click="showChangeChequeStatusDialog"
            :disabled="!canChangeStatus"
            class="blue white--text mr-1"
        >تغییر وضعیت
        </v-btn>
      </v-card-actions>

      <change-cheque-status
          :cheque="cheque"
          @statusChange="getCheque(id)"
          ref="changeChequeStatusComponent"
      />
    </v-card>

    <v-dialog
        v-model="showRevokeDialog"
        max-width="300px"
        transition="dialog-transition"
    >
      <v-card>
        <v-card-title>باطل کردن</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <date
                  label=" * تاریخ"
                  v-model="revokeData.date"
                  :default="true"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea label="* توضیحات" v-model="revokeData.explanation"/>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="revokeCheque" class="red white--text w-100px"
          >ابطال
          </v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import changeChequeStatus from "./ChangeChequeStatus";
import ChequeMixin from "./mixin.js";
import OpenSanadBtn from "@/components/btns/OpenSanadBtn";

export default {
  components: {money, date, changeChequeStatus, OpenSanadBtn},
  mixins: [ChequeMixin],
  props: {
    id: {
      required: true,
    },
  },
  data() {
    return {
      cheque: null,
      showRevokeDialog: false,
      revokeData: {},
    };
  },
  computed: {
    title() {
      if (this.cheque) {
        return "جزئیات " + this.getTypeName(this.cheque.type);
      } else {
        return "";
      }
    },
    isPaidCheque() {
      return this.cheque && this.cheque.is_paid;
    },
    statusChanges() {
      if (this.cheque) return this.cheque.statusChanges;
      return [];
    },
    canSubmitCheque() {
      return this.statusChanges.length == 0 && !this.financialYear.is_closed;
    },
    canEditCheque() {
      return (
          this.statusChanges.length <= 1 &&
          !this.financialYear.is_closed &&
          this.cheque.status != "revoked"
      );
    },
    canChangeStatus() {
      if (this.financialYear.is_closed) return false;

      let s = this.cheque.status;
      if (["passed", "cashed", "revoked", "transferred", "blank"].includes(s))
        return false;
      return true;
    },
  },
  created() {
    this.getChequeMeta();
    this.getCheque(this.id);
  },
  methods: {
    revokeCheque() {
      this.request({
        url: this.endpoint(`cheques/changeStatus/revokeBlankPaidCheque/`),
        method: "post",
        data: {
          ...this.revokeData,
          cheque: this.id,
        },
        success: (data) => {
          this.getCheque(this.id);
          this.successNotify();
          this.showRevokeDialog = false;
        },
      });
    },
    showChangeChequeStatusDialog() {
      this.$refs.changeChequeStatusComponent.dialog = true;
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
        success: (data) => {
          this.getCheque(this.id);
          this.successNotify();
        },
      });
    },
    setItem(cheque) {
      this.$router.push({
        name: "ChequeDetail",
        params: {
          id: cheque.id,
        },
      });
      this.cheque = cheque;
    },
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
        case "guarantee":
          return "ضمانتی";
        case "extended":
          return "تمدید شده";
      }
    },
  },
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

.detail-table {
  th,
  td {
    padding: 0px 8px;
  }

  tr {
    th {
      width: 110px;
    }
  }
}

.status-changes-table {
  th {
    background-color: #eeeeee !important;
  }
}
</style>
