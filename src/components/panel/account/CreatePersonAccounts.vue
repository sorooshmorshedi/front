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
          <div v-if="!hasValidCode" class="alert alert-warning" role="alert">
            <strong>خطا</strong>تعداد حساب های این سطح به حداکثر خود رسیده است
          </div>
          <template v-else>
            <vue-form-generator tag="div" :schema="createSchema.personAccount" :model="account"/>
            <hr>
            <br>
            <vue-form-generator tag="div" :schema="createSchema.person" :model="person"/>
            <button @click="storeBuyer()" class="btn btn-primary float-left submit-btn">ثبت</button>
          </template>
        </div>
        <div class="tab-pane fade" id="nav-seller" role="tabpanel">
          <div v-if="!hasValidCode" class="alert alert-warning" role="alert">
            <strong>خطا</strong>تعداد حساب های این سطح به حداکثر خود رسیده است
          </div>
          <template v-else>
            <vue-form-generator tag="div" :schema="createSchema.personAccount" :model="account"/>
            <hr>
            <br>
            <vue-form-generator tag="div" :schema="createSchema.person" :model="person"/>
            <button @click="storeSeller()" class="btn btn-primary float-left submit-btn">ثبت</button>
          </template>
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
  name: "Create",
  mixins: [accountMixin],
  components: { AccountsList },
  created() {
    this.mode = "create";
    this.config.autoCodeAndType = false;
  },
  mounted() {
    $('a[data-toggle="tab"]').on("shown.bs.tab", e => {
      this.clearAccounts();
      let type = e.target.id.split("-")[1];
      this.account.level = 3;
      this.person.type = type;
      this.setPersonAccountCode();
    });
    this.clearAccounts();
    this.account.level = 3;
    this.person.type = "buyer";
    this.setPersonAccountCode();
  },
  data() {
    return {};
  },
  methods: {
    setPersonAccountCode() {
      if (!this.person.personType || !this.person.type) {
        return;
      }
      let parentCode;
      if (this.person.type == "buyer") {
        if (this.person.personType == "real") parentCode = "10301";
        else parentCode = "10302";
      } else {
        if (this.person.personType == "real") parentCode = "30101";
        else parentCode = "30102";
      }
      this.account.parent = this.findAccount("code", parentCode);
      this.setCodeAndType();
    },
    storeBuyer() {
      this.person.type = "buyer";
      this.storePerson();
    },
    storeSeller() {
      this.person.type = "seller";
      this.storePerson();
    },
    localAccountsInit() {
      this.person.type = "buyer";
    }
  },
  watch: {
    accounts() {
      this.log("watch: accounts");
      this.clearAccounts();
      this.account.level = 3;
      this.person.type = "buyer";
      this.setPersonAccountCode();
    },
    "person.personType": function() {
      this.setPersonAccountCode();
    }
  },
  computed: {
    personAccounsForList() {
      if (this.person.type) {
        return this.accountsSelectValues[this.person.type + "s"];
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

