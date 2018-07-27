<template>
  <div class="row rtl">
    <div class="col-12 col rtl">
      <div class="card right ">
        <div class="card-body">
          <div class="title">تعریف حساب</div>
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <a class="nav-item nav-link active" id="nav-0-tab" data-toggle="tab" href="#nav-group" role="tab">گروه</a>
              <a class="nav-item nav-link" id="nav-1-tab" data-toggle="tab" href="#nav-kol" role="tab">کل</a>
              <a class="nav-item nav-link" id="nav-2-tab" data-toggle="tab" href="#nav-moein" role="tab">معین</a>
              <a class="nav-item nav-link" id="nav-3-tab" data-toggle="tab" href="#nav-tafzili" role="tab">تفضیلی</a>
              <a class="nav-item nav-link" id="nav-buyer-tab" data-toggle="tab" href="#nav-buyer" role="tab">خریدار</a>
              <a class="nav-item nav-link" id="nav-seller-tab" data-toggle="tab" href="#nav-seller" role="tab">فروشنده</a>
              <a class="nav-item nav-link" id="nav-bank-tab" data-toggle="tab" href="#nav-bank" role="tab">بانک</a>
              <a class="nav-item nav-link" id="nav-float-account-group-tab" data-toggle="tab" href="#nav-float-account-group" role="tab">گروه حساب تفضیلی شناور</a>
              <a class="nav-item nav-link" id="nav-4-tab" data-toggle="tab" href="#nav-float" role="tab">تفضیلی شناور</a>
            </div>
          </nav>
          <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-group" role="tabpanel">
              <vue-form-generator tag="div" :schema="createSchema[0]" :model="account" />
              <button @click="storeAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade" id="nav-kol" role="tabpanel">
              <vue-form-generator tag="div" :schema="createSchema[1]" :model="account" />
              <button @click="storeAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade" id="nav-moein" role="tabpanel">
              <vue-form-generator tag="div" :schema="createSchema[2]" :model="account" />
              <button @click="storeAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade " id="nav-tafzili" role="tabpanel">
              <vue-form-generator tag="div" :schema="createSchema[3]" :model="account" />
              <button @click="storeAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade  " id="nav-buyer" role="tabpanel">
              <vue-form-generator tag="div" :schema="createSchema.personAccount" :model="account" />
              <hr> <br>
              <vue-form-generator tag="div" :schema="createSchema.person" :model="person" />
              <button @click="storeBuyer()" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade " id="nav-seller" role="tabpanel">
              <vue-form-generator tag="div" :schema="createSchema.personAccount" :model="account" />
              <hr> <br>
              <vue-form-generator tag="div" :schema="createSchema.person" :model="person" />
              <button @click="storeSeller()" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade " id="nav-bank" role="tabpanel">
              <vue-form-generator tag="div" :schema="createSchema.bankAccount" :model="account" />
              <hr> <br>
              <vue-form-generator tag="div" :schema="createSchema.bank" :model="bank" />
              <button @click="storeBank()" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade " id="nav-float-account-group" role="tabpanel">
              <vue-form-generator tag="div" :schema="createSchema.floatAccountGroup" :model="floatAccountGroup" />
              <button @click="storeFloatAccountGroup()" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade " id="nav-float" role="tabpanel">
              <vue-form-generator tag="div" :schema="createSchema.floatAccounts" :model="floatAccount" />
              <button @click="storeFloatAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
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
    this.mode = 'create';
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
    storeBuyer(){
      this.person.type = 'buyer';
      this.storePerson();
    },
    storeSeller(){
      this.person.type = 'seller';

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

