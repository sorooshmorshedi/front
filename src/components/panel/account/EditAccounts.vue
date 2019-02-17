<template>
  <div>
    <nav>
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a
          class="nav-item nav-link active"
          id="nav-0-tab"
          data-toggle="tab"
          href="#nav-group"
          role="tab"
        >گروه</a>
        <a class="nav-item nav-link" id="nav-1-tab" data-toggle="tab" href="#nav-kol" role="tab">کل</a>
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
        <div class="row">
          <div class="form-group col-md-4">
            <label>نام و شماره حساب</label>
            <multiselect
              dir="rtl"
              :options="this.accountsSelectValues.levels[0]"
              v-model="account"
              track-by="id"
              label="title"
            />
          </div>
        </div>
        <hr>
        <template v-if="account.id">
          <vue-form-generator tag="div" :schema="editSchema[0]" :model="account"/>
          <button @click="updateAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
          <button
            v-if="account.id"
            @click="deleteAccount(account)"
            class="btn btn-danger float-left submit-btn"
            style="margin-left: 15px;"
          >حذف</button>
        </template>
      </div>
      <div class="tab-pane fade" id="nav-kol" role="tabpanel">
        <div class="row">
          <div class="form-group col-md-4">
            <label>نام و شماره حساب</label>
            <multiselect
              dir="rtl"
              :options="this.accountsSelectValues.levels[1]"
              v-model="account"
              track-by="id"
              label="title"
            />
          </div>

          <div class="col-md-8">
            <account-parent-breadcrumb :account="account"/>
          </div>
        </div>
        <hr>
        <template v-if="account.id">
          <vue-form-generator tag="div" :schema="editSchema[1]" :model="account"/>
          <button @click="updateAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
          <button
            v-if="account.id"
            @click="deleteAccount(account)"
            class="btn btn-danger float-left submit-btn"
            style="margin-left: 15px;"
          >حذف</button>
        </template>
      </div>
      <div class="tab-pane fade" id="nav-moein" role="tabpanel">
        <div class="row">
          <div class="form-group col-md-4">
            <label>نام و شماره حساب</label>
            <multiselect
              dir="rtl"
              :options="this.accountsSelectValues.levels[2]"
              v-model="account"
              track-by="id"
              label="title"
            />
          </div>
          <div class="col-md-8">
            <account-parent-breadcrumb :account="account"/>
          </div>
        </div>
        <hr>
        <template v-if="account.id">
          <vue-form-generator tag="div" :schema="editSchema[2]" :model="account"/>
          <button @click="updateAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
          <button
            v-if="account.id"
            @click="deleteAccount(account)"
            class="btn btn-danger float-left submit-btn"
            style="margin-left: 15px;"
          >حذف</button>
        </template>
      </div>
      <div class="tab-pane fade" id="nav-tafzili" role="tabpanel">
        <div class="row">
          <div class="form-group col-md-4">
            <label>نام و شماره حساب</label>
            <multiselect
              dir="rtl"
              :options="this.accountsSelectValues.levels[3]"
              v-model="account"
              track-by="id"
              label="title"
            />
          </div>
          <div class="col-md-8">
            <account-parent-breadcrumb :account="account"/>
          </div>
        </div>
        <hr>
        <template v-if="account.id">
          <vue-form-generator tag="div" :schema="editSchema[3]" :model="account"/>
          <button @click="updateAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
          <button
            v-if="account.id"
            @click="deleteAccount(account)"
            class="btn btn-danger float-left submit-btn"
            style="margin-left: 15px;"
          >حذف</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import accountMixin from "@/mixin/account";
import AccountParentBreadcrumb from "@/components/panel/account/AccountParentBreadcrumb";

export default {
  name: "Edit",
  mixins: [accountMixin],
  components: { AccountParentBreadcrumb },
  created() {
    this.mode = "edit";
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

