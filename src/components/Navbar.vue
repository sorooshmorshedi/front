<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top rtl">
    <a class="navbar-brand " href="#">سبحان حساب</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse " id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item active">
          <a class="nav-link" href="#">خانه
            <span class="sr-only">(current)</span>
          </a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">اطلاعات پایه</a>
          <div class="dropdown-menu dropdown-menu-right " aria-labelledby="navbarDropdown">
            <router-link class="dropdown-item" :to="{name:'UpdateCompany', params:{id: 1}}">مشخصات شرکت</router-link>
            <div class="dropdown-divider"></div>
            <div class="dropdown-submenu ">
              <a class="dropdown-item dropdown-toggle " data-toggle="dropdown" href="#">حساب</a>
              <div class="dropdown-menu " aria-labelledby="navbarDropdown">
                <router-link class="dropdown-item" :to="{name:'CreateAccount'}">تعریف حساب</router-link>
                <router-link class="dropdown-item" :to="{name:'EditAccount'}">ویرایش حساب</router-link>
                <router-link class="dropdown-item" :to="{name:'AccountTree'}">نمودار درختی حساب ها</router-link>
                <div class="dropdown-divider"></div>
                <router-link class="dropdown-item" :to="{name:'IndependentAccount'}">حساب مستقل</router-link>
              </div>
            </div>
            <div class="dropdown-submenu ">
              <a class="dropdown-item dropdown-toggle " data-toggle="dropdown" href="#">کالا</a>
              <div class="dropdown-menu " aria-labelledby="navbarDropdown">
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

            <div class="dropdown-submenu ">
              <a class="dropdown-item dropdown-toggle " data-toggle="dropdown" href="#">پیشفرض ها</a>
              <div class="dropdown-menu " aria-labelledby="navbarDropdown">
                <router-link class="dropdown-item" :to="{name:'DefaultAccounts'}">حساب های پیشفرض</router-link>
                <router-link class="dropdown-item" :to="{name:'FactorExpenses', params: { factorType: 'buy'}}">هزینه های فاکتور خرید</router-link>
                <router-link class="dropdown-item" :to="{name:'FactorExpenses', params: { factorType: 'sale'}}">هزینه های فاکتور فروش</router-link>
              </div>
            </div>

          </div>

        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">عملیات های روزانه</a>
          <div class="dropdown-menu dropdown-menu-right " aria-labelledby="navbarDropdown">
            <router-link class="dropdown-item" :to="{name:'CreateSanad'}">ثبت سند</router-link>
            <div class="dropdown-divider"></div>

            <div class="dropdown-submenu ">
              <a class="dropdown-item dropdown-toggle " data-toggle="dropdown" href="#">فاکتور</a>
              <div class="dropdown-menu " aria-labelledby="navbarDropdown">
                <router-link class="dropdown-item" :to="{name:'FactorForm', params:{ factorType: 'buy'}}">ثبت فاکتور خرید</router-link>
                <router-link class="dropdown-item" :to="{name:'FactorForm', params:{ factorType: 'backFromBuy'}}">ثبت فاکتور برگشت از خرید</router-link>
                <router-link class="dropdown-item" :to="{name:'FactorForm', params:{ factorType: 'sale'}}">ثبت فاکتور فروش</router-link>
                <router-link class="dropdown-item" :to="{name:'FactorForm', params:{ factorType: 'backFromSale'}}">ثبت فاکتور برگشت از فروش</router-link>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <router-link class="dropdown-item" :to="{name:'ReceiptAndRemittance', params: {receiptType: 'receipt'}}">ثبت رسید</router-link>
            <router-link class="dropdown-item" :to="{name:'ReceiptAndRemittance', params: {receiptType: 'remittance'}}">ثبت حواله</router-link>
            <div class="dropdown-divider"></div>
            <router-link class="dropdown-item" :to="{name:'TransactionForm', params: {transactionType: 'receive'}}">ثبت دریافت</router-link>
            <router-link class="dropdown-item" :to="{name:'TransactionForm', params: {transactionType: 'payment'}}">ثبت پرداخت</router-link>
            <div class="dropdown-divider"></div>
            <div class="dropdown-submenu ">
              <a class="dropdown-item dropdown-toggle " data-toggle="dropdown" href="#">دفتر چک</a>
              <div class="dropdown-menu " aria-labelledby="navbarDropdown">
                <router-link class="dropdown-item" :to="{name:'Chequebook'}">دسته چک</router-link>
                <router-link class="dropdown-item" :to="{name:'ReceivedCheques'}">چک های دریافتی</router-link>
              </div>
            </div>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">فهرست فرم ها</a>
          <div class="dropdown-menu dropdown-menu-right " aria-labelledby="navbarDropdown">
            <!-- <router-link class="dropdown-item" :to="{name:'SanadsList'}">سند</router-link> -->
            <div class="dropdown-divider"></div>
            <!-- <router-link class="dropdown-item" :to="{name:'FactorsList', params:{ factorType: 'buy'}}">فاکتور خرید</router-link>
            <router-link class="dropdown-item" :to="{name:'FactorsList', params:{ factorType: 'backFromBuy'}}">فاکتور برگشت از خرید</router-link>
            <router-link class="dropdown-item" :to="{name:'FactorsList', params:{ factorType: 'sale'}}">فاکتور فروش</router-link>
            <router-link class="dropdown-item" :to="{name:'FactorsList', params:{ factorType: 'backFromSale'}}">فاکتور برگشت از فروش</router-link> -->
            <div class="dropdown-divider"></div>
            <!-- <router-link class="dropdown-item" :to="{name:'ReceiptAndRemittance', params: {receiptType: 'receipt'}}">رسید</router-link>
            <router-link class="dropdown-item" :to="{name:'ReceiptAndRemittance', params: {receiptType: 'remittance'}}">حواله</router-link> -->
            <div class="dropdown-divider"></div>
            <router-link class="dropdown-item" :to="{name:'TransactionsList', params: {transactionType: 'receive'}}">دریافت</router-link>
            <router-link class="dropdown-item" :to="{name:'TransactionsList', params: {transactionType: 'payment'}}">پرداخت</router-link>
            <div class="dropdown-divider"></div>
            <!-- <router-link class="dropdown-item" :to="{name:'ChequesList', params: {chequeType: 'paid'} }">چک های پرداختی</router-link>
            <router-link class="dropdown-item" :to="{name:'ChequesList'}, params: {chequeType: 'received'} }">چک های دریافتی</router-link> -->
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped lang="scss">
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
  border-right-color: #fff;
}
</style>
