<template>
  <div class="row">
    <div class="col-12 col-lg-7">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <a
            class="nav-item nav-link active"
            id="nav-0-tab"
            data-toggle="tab"
            href="#nav-group"
            role="tab"
          >گروه</a>
          <a
            class="nav-item nav-link"
            id="nav-1-tab"
            data-toggle="tab"
            href="#nav-kol"
            role="tab"
          >کل</a>
          <a
            class="nav-item nav-link"
            id="nav-2-tab"
            data-toggle="tab"
            href="#nav-moein"
            role="tab"
          >معین</a>
          <a
            class="nav-item nav-link"
            id="nav-3-tab"
            data-toggle="tab"
            href="#nav-tafzili"
            role="tab"
          >تفضیلی</a>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-group" role="tabpanel">
          <div v-if="!hasValidCode" class="alert alert-warning" role="alert">
            <strong>خطا</strong> تعداد حساب های این سطح به حداکثر خود رسیده است
          </div>
          <template v-else>
            <vue-form-generator tag="div" :schema="createSchema[0]" :model="account"/>
            <button @click="storeAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
          </template>
        </div>
        <div class="tab-pane fade" id="nav-kol" role="tabpanel">
          <div v-if="!hasValidCode" class="alert alert-warning" role="alert">
            <strong>خطا</strong> تعداد حساب های این سطح به حداکثر خود رسیده است
          </div>
          <template v-else>
            <vue-form-generator tag="div" :schema="createSchema[1]" :model="account"/>
            <button @click="storeAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
          </template>
        </div>
        <div class="tab-pane fade" id="nav-moein" role="tabpanel">
          <div v-if="!hasValidCode" class="alert alert-warning" role="alert">
            <strong>خطا</strong> تعداد حساب های این سطح به حداکثر خود رسیده است
          </div>
          <template v-else>
            <vue-form-generator tag="div" :schema="createSchema[2]" :model="account"/>
            <button @click="storeAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
          </template>
        </div>
        <div class="tab-pane fade" id="nav-tafzili" role="tabpanel">
          <div v-if="!hasValidCode" class="alert alert-warning" role="alert">
            <strong>خطا</strong> تعداد حساب های این سطح به حداکثر خود رسیده است
          </div>
          <template v-else>
            <vue-form-generator tag="div" :schema="createSchema[3]" :model="account"/>
            <button @click="storeAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
          </template>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-5">
      <accounts-list :accounts="accountsSelectValues.levels[account.level]" />
    </div>
  </div>
</template>

<script>
import accountMixin from "@/mixin/account";
import AccountsList from "./AccountsList";

export default {
  name: "Create",
  mixins: [accountMixin],
  components: { AccountsList },
  data() {
    return {};
  },
  created() {
    this.mode = "create";
  },
  mounted() {
    this.setCodeAndType();
    $('a[data-toggle="tab"]').on("shown.bs.tab", e => {
      this.clearAccounts();
      this.account.level = e.target.id.split("-")[1];
    });
  },
  watch: {
    accounts() {
      if (!this.account.code) this.setCodeAndType();
    }
  },
  methods: {
    storeBuyer() {
      this.person.type = "buyer";
      this.storePerson();
    },
    storeSeller() {
      this.person.type = "seller";
      this.storePerson();
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

