<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top rtl" v-if="user.id">
    <a class="navbar-brand" href="#">حسابداری سبحان</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item active">
          <a class="nav-link" href="#">
            خانه
            <span class="sr-only">(current)</span>
          </a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">اطلاعات پایه</a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
            <div class="dropdown-submenu">
              <a class="dropdown-item dropdown-toggle" data-toggle="dropdown" href="#">شرکت</a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <router-link class="dropdown-item" :to="{name:'CompaniesList'}">لیست شرکت ها</router-link>
                <router-link
                  class="dropdown-item disabled"
                  :event="''"
                  :to="{name:'CreateCompany'}"
                >تعریف شرکت</router-link>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-submenu">
              <a class="dropdown-item dropdown-toggle" data-toggle="dropdown" href="#">حساب</a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <router-link class="dropdown-item" :to="{name:'CreateAccounts'}">تعریف حساب</router-link>
                <router-link
                  class="dropdown-item"
                  :to="{name:'CreatePersonAccounts'}"
                >تعریف خریدار/فروشنده</router-link>
                <router-link
                  class="dropdown-item"
                  :to="{name:'CreateFloatAccounts'}"
                >تعریف حساب شناور</router-link>
                <router-link class="dropdown-item" :to="{name:'CreateBankAccounts'}">تعریف بانک</router-link>
                <div class="dropdown-divider"></div>
                <router-link class="dropdown-item" :to="{name:'EditAccounts'}">ویرایش حساب</router-link>
                <router-link
                  class="dropdown-item"
                  :to="{name:'EditPersonAccounts'}"
                >ویرایش خریدار/فروشنده</router-link>
                <router-link
                  class="dropdown-item"
                  :to="{name:'EditFloatAccounts'}"
                >ویرایش حساب شناور</router-link>
                <router-link class="dropdown-item" :to="{name:'EditBankAccounts'}">ویرایش بانک</router-link>
                <div class="dropdown-divider"></div>
                <router-link class="dropdown-item" :to="{name:'AccountTree'}">نمودار درختی حساب ها</router-link>
                <div class="dropdown-divider"></div>
                <!-- <router-link class="dropdown-item" :to="{name:'IndependentAccount'}">حساب مستقل</router-link> -->
              </div>
            </div>
            <div class="dropdown-submenu">
              <a class="dropdown-item dropdown-toggle" data-toggle="dropdown" href="#">کالا</a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <router-link class="dropdown-item" :to="{name:'CreateWare'}">تعریف کالا</router-link>
                <router-link class="dropdown-item" :to="{name:'EditWare'}">ویرایش کالا</router-link>
                <div class="dropdown-divider"></div>
                <router-link class="dropdown-item" :to="{name:'Warehouse'}">انبار</router-link>
                <router-link class="dropdown-item" :to="{name:'Unit'}">واحد</router-link>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <router-link class="dropdown-item" :to="{name:'CostCenter'}">مرکز هزینه</router-link>
            <div class="dropdown-divider"></div>

            <div class="dropdown-submenu">
              <a class="dropdown-item dropdown-toggle" data-toggle="dropdown" href="#">پیشفرض ها</a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <div class="dropdown-submenu">
                  <a
                    class="dropdown-item dropdown-toggle"
                    data-toggle="dropdown"
                    href="#"
                  >حساب های پیشفرض</a>
                  <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <router-link
                      class="dropdown-item"
                      :to="{name:'TransactionDefaultAccounts'}"
                    >دریافت و پرداخت</router-link>
                    <router-link class="dropdown-item" :to="{name:'FactorDefaultAccounts'}">فاکتور</router-link>
                  </div>
                </div>

                <router-link
                  class="dropdown-item"
                  :to="{name:'FactorExpenses', params: { factorType: 'buy'}}"
                >هزینه های فاکتور خرید</router-link>
                <router-link
                  class="dropdown-item"
                  :to="{name:'FactorExpenses', params: { factorType: 'sale'}}"
                >هزینه های فاکتور فروش</router-link>
                <div class="dropdown-divider"></div>
                <router-link
                  class="dropdown-item"
                  :to="{name:'ExportVerifiers'}"
                >تایید کنندگان خروجی</router-link>
              </div>
            </div>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">عملیات های روزانه</a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
            <router-link class="dropdown-item" :to="{name:'CreateSanad'}">ثبت سند</router-link>
            <div class="dropdown-divider"></div>

            <div class="dropdown-submenu">
              <a class="dropdown-item dropdown-toggle" data-toggle="dropdown" href="#">فاکتور</a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <router-link
                  class="dropdown-item"
                  :to="{name:'FactorForm', params:{ factorType: 'buy'}}"
                >ثبت فاکتور خرید</router-link>
                <router-link
                  class="dropdown-item"
                  :to="{name:'FactorForm', params:{ factorType: 'backFromBuy'}}"
                >ثبت فاکتور برگشت از خرید</router-link>
                <router-link
                  class="dropdown-item"
                  :to="{name:'FactorForm', params:{ factorType: 'sale'}}"
                >ثبت فاکتور فروش</router-link>
                <router-link
                  class="dropdown-item"
                  :to="{name:'FactorForm', params:{ factorType: 'backFromSale'}}"
                >ثبت فاکتور برگشت از فروش</router-link>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <router-link
              class="dropdown-item"
              :to="{name:'ReceiptAndRemittance', params: {receiptType: 'receipt'}}"
            >ثبت رسید</router-link>
            <router-link
              class="dropdown-item"
              :to="{name:'ReceiptAndRemittance', params: {receiptType: 'remittance'}}"
            >ثبت حواله</router-link>
            <div class="dropdown-divider"></div>
            <router-link
              class="dropdown-item"
              :to="{name:'TransactionForm', params: {transactionType: 'receive'}}"
            >ثبت دریافت</router-link>
            <router-link
              class="dropdown-item"
              :to="{name:'TransactionForm', params: {transactionType: 'payment'}}"
            >ثبت پرداخت</router-link>
            <div class="dropdown-divider"></div>
            <div class="dropdown-submenu">
              <a class="dropdown-item dropdown-toggle" data-toggle="dropdown" href="#">دفتر چک</a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <router-link class="dropdown-item" :to="{name:'Chequebook'}">چک های پرداختنی</router-link>
                <router-link class="dropdown-item" :to="{name:'ReceivedCheques'}">چک های دریافتنی</router-link>
              </div>
            </div>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">فهرست فرم ها</a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
            <router-link class="dropdown-item" :to="{name:'List', params: {form: 'sanad'}}">اسناد</router-link>
            <router-link
              class="dropdown-item"
              :to="{name:'List', params: {form: 'sanadUnbalanced'}}"
            >اسناد نامتوازن</router-link>
            <router-link
              class="dropdown-item"
              :to="{name:'List', params: {form: 'sanadEmpty'}}"
            >اسناد خالی</router-link>
            <div class="dropdown-divider"></div>
            <router-link
              class="dropdown-item"
              :to="{name:'List', params:{ form: 'factor', type: 'buy'}}"
            >فاکتور خرید</router-link>
            <router-link
              class="dropdown-item"
              :to="{name:'List', params:{ form: 'factor', type: 'backFromBuy'}}"
            >فاکتور برگشت از خرید</router-link>
            <router-link
              class="dropdown-item"
              :to="{name:'List', params:{ form: 'factor', type: 'sale'}}"
            >فاکتور فروش</router-link>
            <router-link
              class="dropdown-item"
              :to="{name:'List', params:{ form: 'factor', type: 'backFromSale'}}"
            >فاکتور برگشت از فروش</router-link>
            <div class="dropdown-divider"></div>
            <router-link
              class="dropdown-item"
              :to="{name:'List', params: {form: 'receipt', type: 'receipt'}}"
            >رسید</router-link>
            <router-link
              class="dropdown-item"
              :to="{name:'List', params: {form: 'receipt', type: 'remittance'}}"
            >حواله</router-link>
            <div class="dropdown-divider"></div>
            <router-link
              class="dropdown-item"
              :to="{name:'List', params: {form:'transaction', type: 'receive'}}"
            >دریافت</router-link>
            <router-link
              class="dropdown-item"
              :to="{name:'List', params: {form:'transaction', type: 'payment'}}"
            >پرداخت</router-link>
            <div class="dropdown-divider"></div>
            <router-link
              class="dropdown-item"
              :to="{name:'List', params: {form:'chequebook'}}"
            >ثبت چک</router-link>
            <router-link
              class="dropdown-item"
              :to="{name:'List', params: {form:'cheque', type: 'received'}}"
            >چک های دریافتی</router-link>
            <router-link
              class="dropdown-item"
              :to="{name:'List', params: {form:'cheque', type: 'paid'}}"
            >چک های پرداختی</router-link>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">گزارش</a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
            <router-link class="dropdown-item" :to="{name:'LedgerReport'}">دفتر کل، معین، تفضیلی</router-link>
            <div class="dropdown-divider"></div>
            <router-link class="dropdown-item" :to="{name:'BalanceReport'}">تراز</router-link>
            <router-link class="dropdown-item" :to="{name:'FloatBalanceReport'}">تراز شناور</router-link>
            <div class="dropdown-divider"></div>
            <router-link class="dropdown-item" :to="{name:'JournalReport'}">دفتر روزنامه</router-link>
            <div class="dropdown-divider"></div>
            <router-link class="dropdown-item" :to="{name:'IncomeStatementReport'}">سود و زیان</router-link>
            <router-link
              class="dropdown-item"
              :to="{name:'IncomeStatementReport', params: {detailed: 'detailed'}}"
            >سود و زیان تفصیلی</router-link>
            <div class="dropdown-divider"></div>
            <router-link class="dropdown-item" :to="{name:'BalanceSheetReport'}">ترازنامه</router-link>
            <div class="dropdown-divider"></div>
            <router-link class="dropdown-item" :to="{name:'InventoryReport'}">کاردکس کالا</router-link>
          </div>
        </li>
        <li class="nav-item left">
          <a @click="logout()" class="exit-btn nav-link bg-danger text-white" href="#">خروج</a>
        </li>
      </ul>
    </div>

    <a class="navbar-left" href="#">
      <img class="logo img-fluid" src="/static/img/SobhanAccountingLogo.png" alt>
    </a>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {};
  },
  methods: {
    logout() {
      this.setToken("");
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style scoped lang="scss">
.logo {
  max-width: 40px;
  padding: -10px;
}

nav {
  margin-bottom: 15px;
}

.dropdown-submenu {
  position: relative;
}

.dropdown-submenu > .dropdown-menu {
  top: 0;
  right: 100%;
  margin-top: -6px;
  margin-left: -1px;
  -webkit-border-radius: 6px 0px 6px 6px;
  -moz-border-radius: 6px 0px 6px 6px;
  border-radius: 6px 0px 6px 6px;
  width: auto;
}

.dropdown-submenu:hover > .dropdown-menu {
  display: block;
  min-width: 200px;
}

.dropdown-submenu > a:after {
  display: block;
  content: " ";
  float: left;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px 5px 5px 0px;
  border-right-color: #c9c9c9;
  margin-top: 5px;
  margin-left: -10px;
}

.dropdown-submenu:hover > a:after {
  border-right-color: #212121;
}

.exit-btn {
  border-radius: 7px;
}

a.dropdown-item {
  width: 100%;
  display: block;
}
</style>
