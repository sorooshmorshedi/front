<template>
  <div class="row rtl">
    <div class="col-12 col">
      <div class="card right">
        <div class="card-body">
          <div class="title">چک های پرداختنی</div>
          <div id="accordion">
            <button @click="createCB()" type="button" class="btn btn-info">افزودن دسته چک</button>
            <div class="card" v-for="(cb, i) in chequebooks" :key="i">
              <div class="card-header">
                <h5 class="mb-0">
                  <button
                    class="btn btn-link"
                    data-toggle="collapse"
                    :data-target="'#collapse' + i"
                  >{{ cb.account.title }}</button>
                  <i class="fas fa-pencil-alt text-warning" @click="editCB(cb)"/>
                  <i class="fas fa-trash-alt text-danger" @click="deleteChequebook(cb)"/>
                </h5>
              </div>
              <div :id="'collapse' + i" class="collapse">
                <div class="card-body">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>شماره چک</th>
                        <th>دریافت کننده</th>
                        <th>شرح چک</th>
                        <th>مبلغ</th>
                        <th>وضعیت</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(c,j) in cb.cheques" :key="j">
                        <td>{{ j+1 }}</td>
                        <td>{{ c.serial }}</td>
                        <td>{{ receiver(c) }}</td>
                        <td>{{ c.explanation }}</td>
                        <td>{{ c.value | toMoney }}</td>
                        <td>{{ c.status | chequeStatuses }}</td>
                        <td class="float-left">
                          <button
                            :disabled="c.status != 'blank'"
                            @click="submitChequeModal('paid', c, cb)"
                            type="button"
                            class="btn btn-info"
                          >ثبت چک</button>
                          <button
                            :disabled="!canChangeStatus(c)"
                            @click="changeChequeStatusModal(c, cb)"
                            type="button"
                            class="btn btn-info"
                          >تغییر وضعیت چک</button>
                          <button
                            @click="ChequeStatusChangesModal(c)"
                            type="button"
                            class="btn btn btn-info"
                          >مشاهده تغییرات وضعیت چک</button>
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
    </div>

    <div class="modal fade" id="cb-modal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">دسته چک</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="form-group col-12 col-md-3">
                  <label for>سری دسته چک</label>
                  <input
                    v-if="chequebook.id"
                    type="text"
                    class="form-control"
                    disabled
                    v-model="chequebook.code"
                  >
                  <input v-else type="text" class="form-control" disabled :value="chequebookCode">
                </div>
                <div class="form-group col-12 col-md-9">
                  <label for>حساب بانک</label>
                  <multiselect
                    dir="rtl"
                    label="name"
                    track-by="id"
                    :options="accountsSelectValues.banks"
                    v-model="chequebook.account"
                  />
                </div>

                <div
                  class="form-group col-12 col-md-9 offset-md-3"
                  v-if="chequebook.account && chequebook.account.floatAccountGroup"
                >
                  <label for>حساب شناور</label>
                  <multiselect
                    dir="rtl"
                    label="name"
                    track-by="id"
                    :options="chequebook.account.floatAccountGroup.floatAccounts"
                    v-model="chequebook.floatAccount"
                  />
                </div>
                <div class="form-group col-12">
                  <label for>از شماره سریال</label>
                  <input type="number" class="form-control" v-model="chequebook.serial_from">
                </div>
                <div class="form-group col-12">
                  <label for>تا شماره سریال</label>
                  <input type="number" class="form-control" v-model="chequebook.serial_to">
                </div>
                <div class="form-group col-12">
                  <label>توضیحات</label>
                  <textarea class="form-control" rows="3" v-model="chequebook.explanation"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button
              v-if="chequebook.id"
              @click="updateChequebook()"
              type="button"
              class="btn btn-primary"
            >ثبت</button>
            <button v-else @click="storeChequebook()" type="button" class="btn btn-primary">ثبت</button>
          </div>
        </div>
      </div>
    </div>

    <submit-cheque :inuse-cheque="cheque" :inuse-chequebook="chequebook"/>

    <change-cheque-status :inuse-cheque="cheque" :inuse-chequebook="chequebook"/>

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
      cheque: {},
      chequebook: {},
      statusChange: {}
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    // $("#submit-paid-cheque-modal").modal("show");
  },
  computed: {},
  watch: {},
  methods: {
    getData() {
      this.getAccounts();
      this.getChequebooks();
    },
    createCB() {
      this.clearCheques();
      $("#cb-modal").modal("show");
    },
    editCB(cb) {
      this.clearCheques();
      this.chequebook = this.copy(cb);
      $("#cb-modal").modal("show");
    },
    receiver(cheque) {
      if (!cheque.account) return "-";
      let res = cheque.account.title;
      if (cheque.floatAccount) res += " > " + cheque.floatAccount.name;
      return res;
    },
    canChangeStatus(cheque) {
      let res = ["blank", "cashed", "passed", "revoked"].includes(cheque.status);
      return res;
    }
  }
};
</script>

<style scoped lang="scss">
i {
  margin: 0px;
  cursor: pointer !important;
  padding: 5px;
  border-radius: 3px;
  &:hover {
    background-color: #eee;
  }
}
</style>

