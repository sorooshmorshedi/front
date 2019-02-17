<template>
  <div>
    <nav>
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a
          class="nav-item nav-link active"
          id="nav-float-account-group-tab"
          data-toggle="tab"
          href="#nav-float-account-group"
          role="tab"
        >گروه حساب تفضیلی شناور</a>
        <a
          class="nav-item nav-link"
          id="nav-4-tab"
          data-toggle="tab"
          href="#nav-float"
          role="tab"
        >تفضیلی شناور</a>
      </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
      <div class="tab-pane fade show active" id="nav-float-account-group" role="tabpanel">
        <div class="row">
          <div class="form-group col-md-4">
            <label>انتخاب گروه جهت ویرایش</label>
            <multiselect
              dir="rtl"
              :options="this.accountsSelectValues.floatAccountGroups"
              v-model="floatAccountGroup"
              track-by="id"
              label="name"
            />
          </div>
        </div>
        <hr>
        <vue-form-generator
          tag="div"
          :schema="editSchema.floatAccountGroup"
          :model="floatAccountGroup"
        />
        <button @click="updateFloatAccountGroup()" class="btn btn-primary float-left submit-btn">ثبت</button>
        <button
          v-if="floatAccountGroup.id"
          @click="deleteFloatAccountGroup(floatAccountGroup.id)"
          class="btn btn-danger float-left submit-btn"
          style="margin-left: 15px;"
        >حذف</button>
      </div>
      <div class="tab-pane fade" id="nav-float" role="tabpanel">
        <div class="row">
          <div class="form-group col-md-4">
            <label>انتخاب حساب جهت ویرایش</label>
            <multiselect
              dir="rtl"
              :options="this.accountsSelectValues.floatAccounts"
              v-model="floatAccount"
              track-by="id"
              label="name"
            />
          </div>
          <div class="col-md-8">
            <nav style="margin-top: 20px;" v-if="floatAccount.id">
              <ol class="breadcrumb">
                <li style="padding-left: 15px;">
                  <b>گروه حساب تفضیلی شناور:</b>
                </li>
                <li class="breadcrumb-item">{{ floatAccount.floatAccountGroup.name }}</li>
              </ol>
            </nav>
          </div>
        </div>
        <hr>
        <vue-form-generator tag="div" :schema="editSchema.floatAccounts" :model="floatAccount"/>
        <button @click="updateFloatAccount()" class="btn btn-primary float-left submit-btn">ثبت</button>
        <button
          v-if="floatAccount.id"
          @click="deleteFloatAccount(floatAccount.id)"
          class="btn btn-danger float-left submit-btn"
          style="margin-left: 15px;"
        >حذف</button>
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
    this.mode = "edit";
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
  watch: {
    account() {
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

