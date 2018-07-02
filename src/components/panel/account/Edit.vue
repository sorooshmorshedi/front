<template>
  <div class="row rtl">
    <div class="col-12 col rtl">
      <div class="card right ">
        <div class="card-body">
          <div class="title">ویرایش حساب</div>
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <a class="nav-item nav-link active" id="nav-0-tab" data-toggle="tab" href="#nav-group" role="tab">گروه</a>
              <a class="nav-item nav-link" id="nav-1-tab" data-toggle="tab" href="#nav-kol" role="tab">کل</a>
              <a class="nav-item nav-link" id="nav-2-tab" data-toggle="tab" href="#nav-moein" role="tab">معین</a>
              <a class="nav-item nav-link" id="nav-3-tab" data-toggle="tab" href="#nav-tafzili" role="tab">تفضیلی</a>
              <a class="nav-item nav-link" id="nav-float-account-group-tab" data-toggle="tab" href="#nav-float-account-group" role="tab">گروه حساب تفضیلی شناور</a>
              <a class="nav-item nav-link" id="nav-4-tab" data-toggle="tab" href="#nav-float" role="tab">تفضیلی شناور</a>
            </div>
          </nav>
          <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-group" role="tabpanel">
              <div class="row">
                <div class="form-group col-md-4">
                  <label for="">کد</label>
                  <multiselect :options="this.accountsSelectValues.levels[0]" v-model="account" track-by="pk" label="title" />
                </div>
              </div>
              <vue-form-generator tag="div" :schema="editSchema[0]" :model="account" />
              <button @click="updateAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
              <button v-if="account.pk" @click="deleteAccount(account)" class="btn btn-danger float-left submit-btn" style="margin-left: 15px;" >حذف</button>
            </div>
            <div class="tab-pane fade" id="nav-kol" role="tabpanel">
              <div class="row">
                <div class="form-group col-md-4">
                  <label for="">کد</label>
                  <multiselect :options="this.accountsSelectValues.levels[1]" v-model="account" track-by="pk" label="title" />
                </div>
              </div>
              <vue-form-generator tag="div" :schema="editSchema[1]" :model="account" />
              <button @click="updateAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
              <button v-if="account.pk" @click="deleteAccount(account)" class="btn btn-danger float-left submit-btn" style="margin-left: 15px;" >حذف</button>
            </div>
            <div class="tab-pane fade" id="nav-moein" role="tabpanel">
              <div class="row">
                <div class="form-group col-md-4">
                  <label for="">کد</label>
                  <multiselect :options="this.accountsSelectValues.levels[2]" v-model="account" track-by="pk" label="title" />
                </div>
              </div>
              <vue-form-generator tag="div" :schema="editSchema[2]" :model="account" />
              <button @click="updateAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
              <button v-if="account.pk" @click="deleteAccount(account)" class="btn btn-danger float-left submit-btn" style="margin-left: 15px;" >حذف</button>
            </div>
            <div class="tab-pane fade " id="nav-tafzili" role="tabpanel">
              <div class="row">
                <div class="form-group col-md-4">
                  <label for="">کد</label>
                  <multiselect :options="this.accountsSelectValues.levels[3]" v-model="account" track-by="pk" label="title" />
                </div>
              </div>
              <vue-form-generator tag="div" :schema="editSchema[3]" :model="account" />
              <button @click="updateAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
              <button v-if="account.pk" @click="deleteAccount(account)" class="btn btn-danger float-left submit-btn" style="margin-left: 15px;" >حذف</button>
            </div>
            <div class="tab-pane fade " id="nav-float-account-group" role="tabpanel">
              <div class="row">
                <div class="form-group col-md-4">
                  <label for="">گروه حساب تفضیلی شناور</label>
                  <multiselect :options="this.accountsSelectValues.floatAccountGroups" v-model="floatAccountGroup" track-by="pk" label="name" />
                </div>
              </div>
              <vue-form-generator tag="div" :schema="editSchema.floatAccountGroup" :model="floatAccountGroup" />
              <button @click="updateFloatAccountGroup()" class="btn btn-primary float-left submit-btn">ثبت</button>
              <button v-if="floatAccountGroup.pk" @click="deleteFloatAccountGroup(floatAccountGroup.pk)" class="btn btn-danger float-left submit-btn" style="margin-left: 15px;" >حذف</button>
            </div>
            <div class="tab-pane fade " id="nav-float" role="tabpanel">
              <div class="row">
                <div class="form-group col-md-4">
                  <label for="">حساب تفضیلی شناور</label>
                  <multiselect :options="this.accountsSelectValues.floatAccounts" v-model="floatAccount" track-by="pk" label="name" />
                </div>
              </div>
              <vue-form-generator tag="div" :schema="editSchema.floatAccounts" :model="floatAccount" />
              <button @click="updateFloatAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
              <button v-if="floatAccount.pk" @click="deleteFloatAccount(floatAccount.pk)" class="btn btn-danger float-left submit-btn" style="margin-left: 15px;" >حذف</button>
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
  name: "Edit",
  mixins: [accountMixin],
  created() {
    this.mode = 'edit';
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
  watch: {
    account(){
      console.log(this.account);
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

