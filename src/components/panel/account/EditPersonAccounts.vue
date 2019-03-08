<template>
  <div class="row">
    <div class="col-12 col-lg-7">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <a
            class="nav-item nav-link active"
            id="nav-buyer-tab"
            data-toggle="tab"
            href="#nav-buyer"
            role="tab"
          >خریدار</a>
          <a
            class="nav-item nav-link"
            id="nav-seller-tab"
            data-toggle="tab"
            href="#nav-seller"
            role="tab"
          >فروشنده</a>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-buyer" role="tabpanel">
          <div class="row">
            <div class="form-group col-md-12">
              <label>انتخاب حساب جهت ویرایش</label>
              <multiselect
                dir="rtl"
                :options="this.accountsSelectValues.buyers"
                v-model="account"
                track-by="id"
                label="title"
              />
            </div>
          </div>
          <hr>
          <vue-form-generator tag="div" :schema="editSchema.personAccount" :model="account"/>
          <hr>
          <br>
          <vue-form-generator
            tag="div"
            v-if="account && account.person"
            :schema="editSchema.person"
            :model="account.person"
          />
          <button @click="updatePerson()" class="btn btn-primary float-left submit-btn">ثبت</button>
        </div>
        <div class="tab-pane fade" id="nav-seller" role="tabpanel">
          <div class="row">
            <div class="form-group col-md-4">
              <label>انتخاب حساب جهت ویرایش</label>
              <multiselect
                dir="rtl"
                :options="this.accountsSelectValues.sellers"
                v-model="account"
                track-by="id"
                label="title"
              />
            </div>
          </div>
          <hr>
          <vue-form-generator tag="div" :schema="editSchema.personAccount" :model="account"/>
          <hr>
          <br>
          <vue-form-generator
            tag="div"
            v-if="account && account.person"
            :schema="editSchema.person"
            :model="account.person"
          />
          <button @click="updatePerson()" class="btn btn-primary float-left submit-btn">ثبت</button>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-5">
      <accounts-list :accounts="personAccounsForList"/>
    </div>
  </div>
</template>

<script>
import accountMixin from "@/mixin/account";
import AccountsList from "./AccountsList";

export default {
  name: "Edit",
  mixins: [accountMixin],
  components: { AccountsList },
  created() {
    this.mode = "edit";
  },
  mounted() {
    this.account.level = "buyer";
    $('a[data-toggle="tab"]').on("shown.bs.tab", e => {
      this.clearAccounts();
      this.account.level = e.target.id.split("-")[1];
    });
  },
  data() {
    return {};
  },
  watch: {
    accounts() {
      this.clearAccounts();
      this.account.level = "buyer";
    }
  },
  computed: {
    personAccounsForList() {
      if (this.account.level) {
        return this.accountsSelectValues[this.account.level + "s"];
      } else {
        return [];
      }
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

