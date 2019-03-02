<template>
  <div class="row rtl">
    <div class="col-12 col-lg-12">
      <div class="title">تایید کنندگان خروجی</div>
      <div class="row">
        <div class="form-group col-md-4">
          <label>انتخاب فرم</label>
          <multiselect dir="rtl" :options="forms" v-model="form" track-by="value" label="name"/>
        </div>
      </div>
      <template v-if="form">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>نام</th>
              <th>سمت</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ev, i) in exportVerifiers" :key="i">
              <td>{{ i+1 }}</td>
              <td>{{ ev.name }}</td>
              <td>{{ ev.post }}</td>
              <td>
                <i class="fas fa-pencil-alt text-warning" @click="editVerifier(ev)"/>
              </td>
              <td>
                <i class="fas fa-trash-alt text-danger" @click="deleteVerifier(ev)"/>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="createVerifier()" type="button" class="btn btn-info">افزودن</button>
      </template>
    </div>

    <div class="modal fade" id="factor-expense-modal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">تایید کنندگان {{ formName }}</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="form-group col-12">
                <label for>نام</label>
                <input type="text" class="form-control" v-model="exportVerifier.name">
              </div>
              <div class="form-group col-12">
                <label>سمت</label>
                <input type="text" class="form-control" v-model="exportVerifier.post">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button
              v-if="!exportVerifier.id"
              @click="storeVerifier()"
              type="button"
              class="btn btn-primary"
            >ثبت</button>
            <button v-else @click="updateVerifier()" type="button" class="btn btn-primary">ثبت</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allExportVerifiers: {},
      form: null,
      exportVerifier: {},
      form: null,
      forms: [
        { name: "سند", value: "S" },
        { name: "فاکتور خرید", value: "FB" },
        { name: "فاکتور فروش", value: "FS" },
        { name: "فاکتور برگشت از خرید", value: "FBFB" },
        { name: "فاکتور برگشت از فروش", value: "FBFS" },
        { name: "رسید", value: "RT" },
        { name: "حواله", value: "RC" },
        { name: "دریافت", value: "TR" },
        { name: "پرداخت", value: "TP" }
      ]
    };
  },
  created() {
    this.getVerifiers();
  },
  computed: {
    formName() {
      if (this.form) return this.form.name;
      return "";
    },
    exportVerifiers() {
      if (!this.form) return [];
      return this.allExportVerifiers.filter(o => o.form == this.form.value);
    }
  },
  methods: {
    getVerifiers() {
      this.request({
        url: this.endpoint("reports/exportVerifiers/"),
        method: "get",
        success: data => {
          this.allExportVerifiers = data;
        }
      });
    },
    editVerifier(exportVerifier) {
      this.exportVerifier = this.copy(exportVerifier);
      $("#factor-expense-modal").modal("show");
    },
    updateVerifier() {
      let data = this.exportVerifier;
      this.request({
        url: this.endpoint(
          "reports/exportVerifiers/" + this.exportVerifier.id + "/"
        ),
        method: "put",
        data: data,
        success: data => {
          this.successNotify();
          this.replaceNode(this.allExportVerifiers, data);
          $("#factor-expense-modal").modal("hide");
          this.exportVerifier = {};
        }
      });
    },
    createVerifier() {
      this.exportVerifier = {};
      $("#factor-expense-modal").modal("show");
    },
    storeVerifier() {
      let data = {
        ...this.exportVerifier,
        form: this.form.value
      };
      this.request({
        url: this.endpoint("reports/exportVerifiers/"),
        method: "post",
        data: data,
        success: data => {
          this.successNotify();
          this.allExportVerifiers.push(data);
          $("#factor-expense-modal").modal("hide");
          this.exportVerifier = {};
        }
      });
    },
    deleteVerifier(exportVerifier) {
      this.request({
        url: this.endpoint("reports/exportVerifiers/" + exportVerifier.id + "/"),
        method: "delete",
        success: data => {
          this.successNotify();
          this.removeNode(this.allExportVerifiers, data);
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

