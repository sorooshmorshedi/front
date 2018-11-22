<template>
  <div class="row rtl">
    <div class="col-12 col rtl">
      <div class="card right">
        <div class="card-body">
          <div class="title">تعریف حساب</div>
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <a
                class="nav-item nav-link active"
                id="nav-bank-tab"
                data-toggle="tab"
                href="#nav-bank"
                role="tab"
              >بانک</a>
            </div>
          </nav>
          <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-bank" role="tabpanel">
              <div v-if="!hasValidCode" class="alert alert-warning" role="alert">
                <strong>خطا</strong>تعداد حساب های این سطح به حداکثر خود رسیده است
              </div>
              <template v-else>
                <vue-form-generator tag="div" :schema="createSchema.bankAccount" :model="account"/>
                <hr>
                <br>
                <vue-form-generator tag="div" :schema="createSchema.bank" :model="bank"/>
                <button @click="storeBank()" class="btn btn-primary float-left submit-btn">ثبت</button>
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
    this.account.level = 3;
    this.account.type = "bank";
  },
  data() {
    return {};
  },
  watch: {},
  methods: {
    localAccountsInit() {
      this.account.parent = this.findAccount("code", "10101");
    }
  }
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

