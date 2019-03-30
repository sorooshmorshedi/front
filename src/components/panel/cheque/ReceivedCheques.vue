<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <div class="title">چک های دریافتنی</div>
          <button
            @click="submitChequeModal('received')"
            type="button"
            class="btn btn-info"
          >ثبت چک دریافتی</button>
          <div class="row">
            <div class="col-12">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>شماره چک</th>
                      <th>پرداخت کننده</th>
                      <th>نام بانک</th>
                      <th>شرح چک</th>
                      <th>مبلغ</th>
                      <th>تاریخ سررسید</th>
                      <th>وضعیت</th>
                      <th>تاریخ آخرین تغییر وضعیت</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(c,i) in cheques" :key="i">
                      <td>{{ i+1 }}</td>
                      <td>{{ c.serial }}</td>
                      <td>{{ payer(c) }}</td>
                      <td>{{ cheque.bankName }}</td>
                      <td>{{ c.explanation }}</td>
                      <td>{{ c.value | toMoney }}</td>
                      <td>{{ c.due }}</td>
                      <td>{{ c.status | chequeStatuses }}</td>
                      <td>{{ lastStatusChangeDate(c) }}</td>
                      <td>
                        <button
                          @click="changeChequeStatusModal(c)"
                          :disabled="!canChangeStatus(c)"
                          type="button"
                          class="btn btn btn-info"
                        >تغییر وضعیت چک</button>
                        <button
                          @click="ChequeStatusChangesModal(c)"
                          type="button"
                          class="btn btn btn-info"
                        >مشاهده تغییرات وضعیت چک</button>
                        <button
                          @click="submitChequeModal('received',c)"
                          :disabled="c.statusChanges.length != 1"
                          type="button"
                          class="btn btn btn-warning"
                        >ویرایش چک</button>
                        <button
                          @click="deleteCheque(c)"
                          :disabled="c.statusChanges.length != 1"
                          type="button"
                          class="btn btn btn-danger"
                        >حذف چک</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <submit-cheque :inuse-cheque="cheque"/>

    <change-cheque-status :inuse-cheque="cheque"/>

    <cheque-status-changes :cheque="cheque"/>
  </div>
</template>

<script>
import chequeMixin from "@/mixin/cheque";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
export default {
  components: { money, date },
  mixins: [chequeMixin],
  data() {
    return {
      sanad: {},
      cheque: {}
    };
  },
  created() {
    this.getCheques();
  },
  methods: {
    payer(cheque) {
      let res = cheque.account.title;
      if(cheque.floatAccount) res += cheque.floatAccount.name;
      return res;
    }
  }
};
</script>

<style scoped lang="scss">
</style>

