<template>
  <div class="row rtl">
    <div class="col-12 col-lg-12">
      <div class="title">نوع های دریافت و پرداخت</div>
      <button @click="createRPType()" type="button" class="btn btn-info">افزودن</button>
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
          <tr v-for="(rptype, i) in RPTypes" :key="i">
            <td>{{ i+1 }}</td>
            <td>{{ rptype.name }}</td>
            <td>{{ rptype.account.title }}</td>
            <td>{{ rptype.explanation }}</td>
            <td>
              <i v-if="['both','receive'].includes(rptype.usage)" class="fas fa-check" />
            </td>
            <td>
              <i v-if="['both','payment'].includes(rptype.usage)" class="fas fa-check" />
            </td>
            <td>
              <i class="fas fa-pencil-alt text-warning" @click="editRPType(rptype)" />
            </td>
            <td>
              <i class="fas fa-trash-alt text-danger" @click="deleteRPType(rptype)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade" id="rptype" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">واحد</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span arrptype-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="form-group col-12">
                  <label for="">نام</label>
                  <input type="text" class="form-control" v-model="rptype.name">
                </div>
                <div class="form-group col-12">
                  <label>حساب</label>
                  <multiselect :options="this.accountsSelectValues.levels[3]" v-model="rptype.account" track-by="id" label="title" />
                </div>
                <div class="form-group col-12">
                  <label>توضیحات</label>
                  <textarea class="form-control" rows="3" v-model="rptype.explanation"></textarea>
                </div>

                <div class="col-12">
                  <div class="form-check col-12 col-lg-4">
                    <input class="form-check-input" id="u1" type="radio" value="receive" v-model="rptype.usage">
                    <label class="form-check-label" for="u1">
                      دریافت
                    </label>
                  </div>
                  <div class="form-check col-12 col-lg-4">
                    <input class="form-check-input" id="u2" type="radio" value="payment" v-model="rptype.usage">
                    <label class="form-check-label" for="u2">
                      پرداخت
                    </label>
                  </div>
                  <div class="form-check col-12 col-lg-4">
                    <input class="form-check-input" id="u3" type="radio" value="both" v-model="rptype.usage">
                    <label class="form-check-label" for="u3">
                      هر دو
                    </label>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button v-if="!rptype.id" @click="storeRPType()" type="button" class="btn btn-primary">ثبت</button>
            <button v-else @click="updateRPType()" type="button" class="btn btn-primary">ثبت</button>
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
  mixins: [accountApiMixin, sanadtApiMixin],
  name: "RPType",
  data() {
    return {
      rptype: {}
    };
  },
  created() {
    this.getRPTypes();
    this.getAccounts();
  },
  methods: {
    editRPType(rptype) {
      this.rptype = this.copy(rptype);
      $("#rptype").modal("show");
    },
    updateRPType() {
      let data = {
        ...this.rptype,
        account: this.rptype.account.id
      };
      this.request({
        url: this.endpoint("sanads/RPTypes/" + this.rptype.id),
        method: "put",
        data: data,
        success: data => {
          this.notify("واحد با موفقیت ویرایش شد", "success");
          this.getRPTypes(true);
          $("#rptype").modal("hide");
          this.rptype = {};
        }
      });
    },
    createRPType() {
      $("#rptype").modal("show");
    },
    storeRPType() {
      let data = {
        ...this.rptype,
        account: this.rptype.account.id
      };
      this.request({
        url: this.endpoint("sanads/RPTypes"),
        method: "post",
        data: data,
        success: data => {
          this.notify("واحد با موفقیت ساخته شد", "success");
          this.getRPTypes(true);
          $("#rptype").modal("hide");
          this.rptype = {};
        }
      });
    },
    deleteRPType(rptype) {
      this.request({
        url: this.endpoint("sanads/RPTypes/" + rptype.id),
        method: "delete",
        success: data => {
          this.notify("واحد با موفقیت حذف شد", "success");
          this.getRPTypes(true);
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

