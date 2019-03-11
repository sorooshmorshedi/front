<template>
  <div class="row rtl">
    <div class="col-12 col-lg-12">
      <div class="title">حساب های پیشفرض</div>
      <button @click="createdefaultAccount()" type="button" class="btn btn-info">افزودن</button>
      <br>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>نام</th>
            <th>حساب</th>
            <th>توضیحات</th>
            <th>دریافت</th>
            <th>پرداخت</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(defaultAccount, i) in defaultAccounts.filter(o =>['receiveAndPayment','receive','payment','none'].includes(o.usage))" :key="i">
            <td>{{ i+1 }}</td>
            <td>{{ defaultAccount.name }}</td>
            <td>{{ defaultAccount.account.title }}</td>
            <td>{{ defaultAccount.explanation }}</td>
            <td>
              <i v-if="['receiveAndPayment','receive'].includes(defaultAccount.usage)" class="fas fa-check" />
            </td>
            <td>
              <i v-if="['receiveAndPayment','payment'].includes(defaultAccount.usage)" class="fas fa-check" />
            </td>
            <td>
              <i class="fas fa-pencil-alt text-warning" @click="editdefaultAccount(defaultAccount)" />
            </td>
            <td>
              <i class="fas fa-trash-alt text-danger" @click="deletedefaultAccount(defaultAccount)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade" id="defaultAccount" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">جزئیات حساب پیشفرض</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span ardefaultAccount-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="form-group col-12">
                  <label for="">نام</label>
                  <input type="text" class="form-control" v-model="defaultAccount.name">
                </div>
                <div class="form-group col-12">
                  <label>حساب</label>
                  <multiselect dir="rtl" :options="this.accountsSelectValues.levels[3].filter(o => !o.floatAccountGroup)" v-model="defaultAccount.account" track-by="id" label="title" />
                </div>
                <div class="form-group col-12">
                  <label>توضیحات</label>
                  <textarea class="form-control" rows="3" v-model="defaultAccount.explanation"></textarea>
                </div>

                <div class="col-12">
                  <div class="form-check col-12 col-lg-3">
                    <input class="form-check-input" id="u1" type="radio" value="receive" v-model="defaultAccount.usage">
                    <label class="form-check-label" for="u1">
                      دریافت
                    </label>
                  </div>
                  <div class="form-check col-12 col-lg-3">
                    <input class="form-check-input" id="u2" type="radio" value="payment" v-model="defaultAccount.usage">
                    <label class="form-check-label" for="u2">
                      پرداخت
                    </label>
                  </div>
                  <div class="form-check col-12 col-lg-3">
                    <input class="form-check-input" id="u3" type="radio" value="receiveAndPayment" v-model="defaultAccount.usage">
                    <label class="form-check-label" for="u3">
                      هر دو
                    </label>
                  </div>
                  <div class="form-check col-12 col-lg-3">
                    <input class="form-check-input" id="u4" type="radio" value="none" v-model="defaultAccount.usage">
                    <label class="form-check-label" for="u4">
                      هیچ کدام
                    </label>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button v-if="!defaultAccount.id" @click="storedefaultAccount()" type="button" class="btn btn-primary">ثبت</button>
            <button v-else @click="updatedefaultAccount()" type="button" class="btn btn-primary">ثبت</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountApi";
import sanadtApiMixin from "@/mixin/sanadApi";

export default {
  mixins: [accountApiMixin],
  name: "TransactionDefaultAccount",
  data() {
    return {
      defaultAccount: {}
    };
  },
  created() {
    this.getDefaultAccounts();
    this.getAccounts();
  },
  methods: {
    editdefaultAccount(defaultAccount) {
      this.defaultAccount = this.copy(defaultAccount);
      $("#defaultAccount").modal("show");
    },
    updatedefaultAccount() {
      let data = {
        ...this.defaultAccount,
        account: this.defaultAccount.account.id
      };
      this.request({
        url: this.endpoint(
          "accounts/defaultAccounts/" + this.defaultAccount.id
        ),
        method: "put",
        data: data,
        success: data => {
          this.successNotify();
          this.getDefaultAccounts(true);
          $("#defaultAccount").modal("hide");
          this.defaultAccount = {};
        }
      });
    },
    createdefaultAccount() {
      $("#defaultAccount").modal("show");
    },
    storedefaultAccount() {
      let data = {
        ...this.defaultAccount,
        account: this.defaultAccount.account.id
      };
      this.request({
        url: this.endpoint("accounts/defaultAccounts"),
        method: "post",
        data: data,
        success: data => {
          this.successNotify();
          this.getDefaultAccounts(true);
          $("#defaultAccount").modal("hide");
          this.defaultAccount = {};
        }
      });
    },
    deletedefaultAccount(defaultAccount) {
      this.request({
        url: this.endpoint("accounts/defaultAccounts/" + defaultAccount.id),
        method: "delete",
        success: data => {
          this.successNotify();
          this.getDefaultAccounts(true);
        }
      });
    }
  },
  computed: {}
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
button {
  margin-bottom: 8px;
}
</style>

