<template>
  <div class="row rtl">
    <div class="col-12 col rtl">
      <div class="card right">
        <div class="card-body">
          <div class="title">
            تعریف حساب
            <button
              type="button"
              class="btn btn-info btn-sm"
              data-toggle="modal"
              data-target="#accounts"
            >جستوجوی حساب</button>
          </div>
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
      </div>
    </div>

    <div class="modal fade" id="accounts" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">جستوجوی حساب</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <tree no-context=1 />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">بستن</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountMixin from "@/mixin/account";
import Tree from "@/components/panel/account/Tree";

export default {
  name: "Create",
  mixins: [accountMixin],
  components: { Tree },
  created() {
    this.mode = "create";
  },
  mounted() {
    $('a[data-toggle="tab"]').on("shown.bs.tab", e => {
      this.clearAccounts();
      this.account.level = e.target.id.split("-")[1];
    });
  },
  data() {
    return {};
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

