<template>
  <div class="row rtl">
    <div class="col-12 col rtl">
      <div class="card right ">
        <div class="card-body">
          <div class="title">تعریف حساب شناور</div>
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <a class="nav-item nav-link active" id="nav-float-account-group-tab" data-toggle="tab" href="#nav-float-account-group" role="tab">گروه حساب تفضیلی شناور</a>
              <a class="nav-item nav-link" id="nav-4-tab" data-toggle="tab" href="#nav-float" role="tab">تفضیلی شناور</a>
            </div>
          </nav>
          <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-float-account-group" role="tabpanel">
              <div v-if="!hasValidCode" class="alert alert-warning" role="alert">
                <strong>خطا </strong> تعداد حساب های این سطح به حداکثر خود رسیده است
              </div>
              <template v-else>
                <vue-form-generator tag="div" :schema="createSchema.floatAccountGroup" :model="floatAccountGroup" />
                <button @click="storeFloatAccountGroup()" class="btn btn-primary float-left submit-btn">ثبت</button>
              </template>
            </div>
            <div class="tab-pane fade " id="nav-float" role="tabpanel">
              <div v-if="!hasValidCode" class="alert alert-warning" role="alert">
                <strong>خطا </strong> تعداد حساب های این سطح به حداکثر خود رسیده است
              </div>
              <template v-else>
                <vue-form-generator tag="div" :schema="createSchema.floatAccounts" :model="floatAccount" />
                <button @click="storeFloatAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountMixin from "@/mixin/account";

export default {
  name: "Create",
  mixins: [accountMixin],
  created() {
    this.mode = "create";
  },
  mounted() {
    this.account.level = "float-account-group";
    $('a[data-toggle="tab"]').on("shown.bs.tab", e => {
      this.clearAccounts();
      this.account.level = e.target.id.split("-")[1];
    });
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.tab-content {
  padding-top: 15px;
}
.submit-btn {
  width: 100px;
}
</style>

