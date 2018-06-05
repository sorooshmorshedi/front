<template>
  <div class="row rtl">
    <div class="col-12 col rtl">
      <div class="card right ">
        <div class="card-body">
          <div class="title">تعریف حساب</div>
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <a class="nav-item nav-link active" id="nav-group-tab" data-toggle="tab" href="#nav-group" role="tab">گروه</a>
              <a class="nav-item nav-link" id="nav-kol-tab" data-toggle="tab" href="#nav-kol" role="tab">کل</a>
              <a class="nav-item nav-link" id="nav-moein-tab" data-toggle="tab" href="#nav-moein" role="tab">معین</a>
              <a class="nav-item nav-link" id="nav-tafzili-tab" data-toggle="tab" href="#nav-tafzili" role="tab">تفضیلی</a>
            </div>
          </nav>
          <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-group" role="tabpanel">
              <vue-form-generator tag="div" :schema="schema.group" :model="account" />
              <button @click="storeAccount('group', account)" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade" id="nav-kol" role="tabpanel">
              <vue-form-generator tag="div" :schema="schema.kol" :model="account" />
              <button @click="storeAccount('kol', account)" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade" id="nav-moein" role="tabpanel">
              <vue-form-generator tag="div" :schema="schema.moein" :model="account" />
              <button @click="storeAccount('moein', account)" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade " id="nav-tafzili" role="tabpanel">
              <vue-form-generator tag="div" :schema="schema.tafzili" :model="account" />
              <button @click="storeAccount('tafzili', account)" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountMixin from "@/mixin/api/account";
import schema from "./Schema";

export default {
  name: "Create",
  mixins: [accountMixin],
  props: ["value"],
  created() {},
  data() {
    return {
      account: {},
      schema: schema
    };
  },
  watch: {}
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

