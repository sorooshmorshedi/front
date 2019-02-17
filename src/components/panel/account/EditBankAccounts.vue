<template>
  <div>
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
        <div class="row">
          <div class="form-group col-md-4">
            <label>انتخاب حساب جهت ویرایش</label>
            <multiselect
              dir="rtl"
              :options="this.accountsSelectValues.banks"
              v-model="account"
              track-by="id"
              label="title"
            />
          </div>
        </div>
        <hr>
        <vue-form-generator tag="div" :schema="editSchema.bankAccount" :model="account"/>
        <hr>
        <br>
        <vue-form-generator
          tag="div"
          v-if="account && account.bank"
          :schema="editSchema.bank"
          :model="account.bank"
        />
        <button @click="updateBank()" class="btn btn-primary float-left submit-btn">ثبت</button>
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
    this.account.level = "bank";
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

