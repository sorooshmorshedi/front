<template>
  <div class="modal fade" id="cheque-status-changes-modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            تغییر وضعیت های چک
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-12">
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
                        <td>{{ sc.sanad.items[0].account.name }}</td>
                        <td>{{ sc.sanad.items[1].account.name }}</td>
                        <td>{{ sc.explanation }}</td>
                        <td>
                          <router-link :to="{name: 'CreateSanad',params:{id: sc.sanad.id }}" target="_blank">مشاهده سند</router-link>
                        </td>
                        <td>
                          <i v-if="i == statusChanges.length-1 && i != 0" @click.prevent="deleteStatusChange(sc)" class="fas fa-trash-alt text-danger" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">بازگشت</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chequeApiMixin from "@/mixin/chequeApi";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
export default {
  name: "ChequeStatusChanges",
  props: ["cheque"],
  components: { money, date },
  mixins: [chequeApiMixin],
  data() {
    return {
      statusChanges: []
    };
  },
  created() {
    this.statusChanges = this.cheque.statusChanges;
  },
  watch: {
    cheque() {
      this.statusChanges = this.cheque.statusChanges;
    }
  },
  methods: {
    deleteStatusChange(sc) {
      this.request({
        url: this.endpoint("cheques/statusChange/" + sc.id),
        method: "delete",
        success: data => {
          if (this.cheque.type == "paid") this.getChequebooks(true);
          else this.getCheques(true);
          this.statusChanges.splice(this.statusChanges.length - 1, 1);
          this.successNotify();
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
* {
}
</style>

