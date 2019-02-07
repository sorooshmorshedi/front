<template>
  <div>
    <button @click="createIA()" type="button" class="btn btn-info">افزودن حساب مستقل</button>
    <br>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>نام</th>
          <th>توضیحات</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ia, i) in independentAccounts" :key="i">
          <td>{{ i+1 }}</td>
          <td>{{ ia.name }}</td>
          <td>{{ ia.explanation }}</td>
          <td>
            <i class="fas fa-pencil-alt text-warning" @click="editIA(ia)"/>
          </td>
          <td>
            <i class="fas fa-trash-alt text-danger" @click="deleteIA(ia)"/>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="modal fade" id="ia" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">حساب مستقل</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="form-group col-12">
                  <label for>نام حساب مستقل</label>
                  <input type="text" class="form-control" v-model="independentAccount.name">
                </div>
                <div class="form-group col-12">
                  <label>توضیحات</label>
                  <textarea class="form-control" rows="3" v-model="independentAccount.explanation"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button
              v-if="!independentAccount.id"
              @click="storeIA()"
              type="button"
              class="btn btn-primary"
            >ثبت</button>
            <button v-else @click="updateIA()" type="button" class="btn btn-primary">ثبت</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountMixin from "@/mixin/account";
export default {
  mixins: [accountMixin],
  name: "IndependentAccount",
  data() {
    return {
      independentAccount: {}
    };
  },
  created() {},
  methods: {
    editIA(ia) {
      this.independentAccount = this.copy(ia);
      $("#ia").modal("show");
    },
    updateIA() {
      this.request({
        url: this.endpoint(
          "accounts/independentAccounts/" + this.independentAccount.id
        ),
        method: "put",
        data: this.independentAccount,
        success: data => {
          this.notify("حساب مستقل با موفقیت ویرایش شد", "success");
          this.getIndependentAccounts(true);
          $("#ia").modal("hide");
          this.independentAccount = {};
        }
      });
    },
    createIA() {
      $("#ia").modal("show");
    },
    storeIA() {
      this.request({
        url: this.endpoint("accounts/independentAccounts"),
        method: "post",
        data: this.independentAccount,
        success: data => {
          this.notify("حساب مستقل با موفقیت ساخته شد", "success");
          this.getIndependentAccounts(true);
          $("#ia").modal("hide");
          this.independentAccount = {};
        }
      });
    },
    deleteIA(ia) {
      this.request({
        url: this.endpoint("accounts/independentAccounts/" + ia.id),
        method: "delete",
        success: data => {
          this.notify("حساب مستقل با موفقیت حذف شد", "success");
          this.getIndependentAccounts(true);
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

