<template>
  <div class="row rtl">
    <div class="col-12 col-lg-12">
      <div class="title">
        حساب های پیشفرض
        {{ title }}
      </div>
      <button @click="createdefaultAccount()" type="button" class="btn btn-info">افزودن</button>
      <br>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>نام</th>
            <th>حساب</th>
            <th>توضیحات</th>
            <th v-if="showUsage">دریافت</th>
            <th v-if="showUsage">پرداخت</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(defaultAccount, i) in items" :key="i">
            <td>{{ i+1 }}</td>
            <td>{{ defaultAccount.name }}</td>
            <td>{{ defaultAccount.account.title }}</td>
            <td>{{ defaultAccount.explanation }}</td>
            <td v-if="showUsage">
              <i
                v-if="['receiveAndPayment','receive'].includes(defaultAccount.usage)"
                class="fas fa-check"
              />
            </td>
            <td v-if="showUsage">
              <i
                v-if="['receiveAndPayment','payment'].includes(defaultAccount.usage)"
                class="fas fa-check"
              />
            </td>
            <td>
              <i
                class="fas fa-pencil-alt text-warning"
                @click="editdefaultAccount(defaultAccount)"
              />
            </td>
            <td>
              <i
                class="fas fa-trash-alt text-danger"
                @click="deletedefaultAccount(defaultAccount)"
              />
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
            <div class="container">
              <div class="row">
                <div class="form-group col-12">
                  <label for>نام</label>
                  <input type="text" class="form-control" v-model="defaultAccount.name">
                </div>
                <div class="form-group col-12">
                  <label>حساب</label>
                  <multiselect
                    dir="rtl"
                    :options="accountsSelectValues.levels[3]"
                    v-model="defaultAccount.account"
                    track-by="id"
                    label="title"
                  />
                </div>
                <div
                  class="form-group col-12"
                  v-if="defaultAccount.account && defaultAccount.account.floatAccountGroup"
                >
                  <label>حساب شناور</label>
                  <multiselect
                    dir="rtl"
                    v-if="defaultAccount.account && defaultAccount.account.floatAccountGroup"
                    :options="defaultAccount.account.floatAccountGroup.floatAccounts"
                    v-model="defaultAccount.floatAccount"
                    track-by="id"
                    label="name"
                  />
                </div>
                <div class="form-group col-12">
                  <label>توضیحات</label>
                  <textarea class="form-control" rows="3" v-model="defaultAccount.explanation"></textarea>
                </div>

                <div v-if="showUsage" class="col-12">
                  <div class="form-check col-12 col-lg-3">
                    <input
                      class="form-check-input"
                      id="u1"
                      type="radio"
                      value="receive"
                      v-model="defaultAccount.usage"
                    >
                    <label class="form-check-label" for="u1">دریافت</label>
                  </div>
                  <div class="form-check col-12 col-lg-3">
                    <input
                      class="form-check-input"
                      id="u2"
                      type="radio"
                      value="payment"
                      v-model="defaultAccount.usage"
                    >
                    <label class="form-check-label" for="u2">پرداخت</label>
                  </div>
                  <div class="form-check col-12 col-lg-3">
                    <input
                      class="form-check-input"
                      id="u3"
                      type="radio"
                      value="receiveAndPayment"
                      v-model="defaultAccount.usage"
                    >
                    <label class="form-check-label" for="u3">هر دو</label>
                  </div>
                  <div class="form-check col-12 col-lg-3">
                    <input
                      class="form-check-input"
                      id="u4"
                      type="radio"
                      value="none"
                      v-model="defaultAccount.usage"
                    >
                    <label class="form-check-label" for="u4">هیچ کدام</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button
              v-if="!defaultAccount.id"
              @click="storedefaultAccount()"
              type="button"
              class="btn btn-primary"
            >ثبت</button>
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
  props: {
    usage: {
      required: true
    }
  },
  data() {
    return {
      defaultAccount: {}
    };
  },
  computed: {
    title() {
      let title = "";
      if (this.usage == "transaction") title = "دریافت و پرداخت";
      else if (this.usage == "factor") title = "فاکتور";
      else if (this.usage == "closeAccounts") title = "بستن حساب ها";
      return title;
    },
    items() {
      let usages = [];
      if (this.usage == "transaction") usages = ["receive", "payment"];
      else usages = [this.usage];
      return this.defaultAccounts.filter(o => usages.includes(o.usage));
    },
    showUsage() {
      if (this.usage == "transaction") return true;
      else return false;
    }
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
    getSerialized() {
      let data = {
        ...this.defaultAccount,
        account: this.defaultAccount.account.id
      };
      let floatAccount = this.defaultAccount.floatAccount;
      if (floatAccount) data.floatAccount = floatAccount.id;

      if (!this.defaultAccount.usage) data.usage = this.usage;
      return data;
    },
    updatedefaultAccount() {
      let data = this.getSerialized();
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
      let data = this.getSerialized();
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
button {
  margin-bottom: 8px;
}
</style>

