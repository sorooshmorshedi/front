<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right ">
        <div class="card-body">
          <div class="title">چک های دریافتی</div>
          <button @click="submitChequeModal('received')" type="button" class="btn btn-info">ثبت چک دریافتی</button>
          <div class="row">
            <div class="col-12">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>شماره چک</th>
                      <th>شرح چک</th>
                      <th>مبلغ</th>
                      <th>وضعیت</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(c,i) in cheques" :key="i">
                      <td>{{ i+1 }}</td>
                      <td>{{ c.serial }}</td>
                      <td>{{ c.explanation }}</td>
                      <td>{{ c.value }}</td>
                      <td>{{ c.status | chequeStatuses }}</td>
                      <td>
                        <button :disabled="!canChangeStatus(c)" @click="changeChequeStatusModal(c)" type="button" class="btn btn-sm btn-info">تغییر وضعیت چک</button>
                        <button @click="ChequeStatusChangesModal(c)" type="button" class="btn btn-sm btn-info">مشاهده تغییرات وضعیت چک</button>
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

    <submit-cheque :inuse-cheque="cheque" />

    <change-cheque-status :inuse-cheque="cheque" />

    <cheque-status-changes :cheque="cheque" />

  </div>
</template>

<script>
import chequeMixin from "@/mixin/cheque";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
export default {
  name: "Create",
  components: { money, date },
  mixins: [chequeMixin],
  data() {
    return {
      sanad: {},
      rows: [{}],
      cheque: {},
    };
  },
  created() {
    this.getCheques();
  },
  mounted() {},
  computed: {
    bedSum() {
      let sum = 0;
      this.rows.forEach(r => {
        if (r.bed) sum += +r.bed;
      });
      return sum;
    },
    besSum() {
      let sum = 0;
      this.rows.forEach(r => {
        if (r.bes) sum += +r.bes;
      });
      return sum;
    }
  },
  watch: {
    rows: {
      handler() {
        if (this.rows[this.rows.length - 1].account) {
          this.rows.push({});
        }
      },
      deep: true
    }
  },
  methods: {
    floatAccounts(row) {
      if (row.account && row.account.floatAccountGroup) {
        return row.account.floatAccountGroup.floatAccounts;
      } else {
        return [];
      }
    },
    costCenters(row) {
      if (row.account && row.account.costCenterGroup) {
        return row.account.costCenterGroup.costCenters;
      } else {
        return [];
      }
    }
  }
};
</script>

<style scoped lang="scss">
.table-responsive {
  th,
  td,
  input {
    text-align: center;
  }
}

</style>

