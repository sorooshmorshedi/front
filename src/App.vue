<template>
  <v-app id="app" @click.native.ctrl.alt="developersDialog = true">
    <template v-if="isAppReady">
      <v-navigation-drawer
          v-if="user"
          v-show="!isPrinting"
          fixed
          app
          mini-variant-width="80"
          class="white--text pt-3"
          color="#002357"
          dark
          v-model="showDrawer"
          right
          :temporary="isXs"
          permanent
          :mini-variant.sync="mini"
          :expand-on-hover="rail"
          :mobile-breakpoint="0"
          location="right"
      >
        <span class="rounded" v-if="mini">
          <a href="https://sobhan.net">
            <v-img
                class="mt-3 mr-4"
                style="border-radius: 30%"
                contain
                max-height="45"
                max-width="45"
                src="/img/icons/fav.png"
            />
          </a>
        </span>
        <span class="rounded" v-if="!mini">
          <v-row>
            <a href="https://sobhan.net">
              <v-img
                  class="mt-6 mr-5"
                  contain
                  max-width="150"
                  src="/img/icons/logo.png"
              />
            </a>
            <v-btn
                icon
                class=" mt-9 mr-13"
                depressed
                height="35"
                width="35"
                @click="rail = !rail"
                v-if="!rail"
            >
              <v-icon color="white" > fa-angle-double-right</v-icon>
            </v-btn>
            <v-btn
                icon
                class=" mt-9 mr-13"
                depressed
                height="35"
                width="35"
                @click="rail = !rail"
                v-if="rail"
            >
              <v-icon color="white" > fa-angle-double-left</v-icon>
            </v-btn>
          </v-row>
        </span>
        <m-navbar class="mt-5" @logout="logout"/>
      </v-navigation-drawer>
      <v-navigation-drawer
          class="rounded-r-lg mt-12"
          clipped
          v-if="!drawer && user"
          color="#002357"
          location="left"
          app width="45"
          height="145">

        <v-list>
          <v-list-item
              class="white--text text-caption "
              @click="drawer = true"
              style="transform:rotate(270deg)">
            <v-btn text class="white--text">
              دسترسی  سریع
            </v-btn></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-navigation-drawer
          class="rounded-r-lg mt-10"
          v-if="drawer && user"
          color="#002357"
          location="left"
          app width="80"
          height="640">
        <v-list>
          <v-list-item class="white--text text-caption mr-3" @click="drawer = false" > بستن</v-list-item>
          <v-list-item class="mt-5">
            <v-btn
                v-if="hasPerm('create', 'sanad') && hasModule('sanads')"
                class=" white--text mr-2 app-bar-btn"
                :to="{ name: 'SanadForm' }"
                @click="routeClick('SanadForm')"
                icon
                large
                title="سند"
            >
              <v-icon large>$sanadIcon</v-icon>
            </v-btn>

          </v-list-item>
          <v-list-item>
            <v-btn
                v-if="
            hasPerm('create', 'receiveTransaction') && hasModule('transactions')
          "
                class=" white--text app-bar-btn"
                :to="{ name: 'TransactionForm', params: { type: 'receive' } }"
                @click="routeClick('TransactionForm')"
                icon
                title="دریافت"
            >
              <v-icon>$receiveTransactionIcon</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn
                v-if="
            hasPerm('create', 'paymentTransaction') && hasModule('transactions')
          "
                class=" white--text app-bar-btn"
                :to="{ name: 'TransactionForm', params: { type: 'payment' } }"
                @click="routeClick('TransactionForm')"
                icon
                title="پرداخت"
            >
              <v-icon>$paymentTransactionIcon</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn
                v-if="hasPerm('create', 'saleFactor') && hasModule('factors')"
                class=" white--text app-bar-btn"
                :to="{
            name: 'FactorForm',
            params: { isPreFactor: false, type: 'sale' },
          }"
                @click="routeClick('FactorForm')"
                icon
                title="فاکتور فروش"
            >
              <v-icon>$outputFactorIcon</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn
                v-if="hasPerm('create', 'buyFactor') && hasModule('factors')"
                class=" white--text app-bar-btn"
                :to="{
            name: 'FactorForm',
            params: { isPreFactor: false, type: 'buy' },
          }"
                @click="routeClick('FactorForm')"
                icon
                title="فاکتور خرید"
            >
              <v-icon>$inputFactorIcon</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn
                v-if="hasPerm('get', 'sanadItemsReport')"
                class=" white--text app-bar-btn"
                :to="{ name: 'LedgerReport', params: { level: 'level3' } }"
                icon
                title="گردش حساب"
            >
              <v-icon>$ledgerReportIcon</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn
                v-if="hasPerm('get', 'accountBalanceReport')"
                class=" white--text app-bar-btn"
                :to="{ name: 'AccountsBalanceReport' }"
                icon
                title="تراز حساب ها"
            >
              <v-icon>$balanceReportIcon</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn
                v-if="hasPerm('get', 'account')"
                class=" white--text app-bar-btn"
                :to="{ name: 'Accounts', params: { level: 3 } }"
                icon
                title="تعریف حساب"
            >
              <v-icon>$accountIcon</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn
                class=" white--text app-bar-btn"
                :to="{
            name: 'Accounts',
            params: { level: 3, accountType: 'p' },
            query: { showForm: true },}"
                title="تعریف حساب اشخاص"
                icon
            >
              <v-icon>fa-users</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn
                v-if="hasPerm('get', 'account')"
                class=" white--text app-bar-btn"
                :to="{ name: 'AccountsTree' }"
                title="نمودار درختی"
                icon
            >
              <v-icon>$accountsTreeIcon</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn
                v-if="hasPerm('get', 'wareInventoryReport')"
                class=" white--text app-bar-btn"
                :to="{ name: 'DetailedWareInventoryReport' }"
                title="کاردکس کالا"
                icon
            >
              <v-icon>fa-pallet</v-icon>
            </v-btn>
          </v-list-item>

        </v-list>
      </v-navigation-drawer>
      <v-app-bar
          app
          flat
          clipped-left
          class=" white bar"
          v-if="user"
          height="94"
          v-show="!isPrinting"
      >
        <v-hover v-slot="{ hover }">
          <v-btn
              id="company-activator"
              :to="{ name: 'Companies' }"
              depressed
              color="#F7F9FE"
              class=" mt-7 mr-10"
              large
              title=" شرکت "
              :style="{ 'color': hover ? '#019EF6' : '#697480' }"
          >
            <span v-if="company">{{ company.name }}</span>
            <span v-else>انتخاب شرکت</span>
          </v-btn>
        </v-hover>
        <v-menu activator="#company-activator" location="end" open-on-hover>
          <v-card width="300">
            <v-list>
              <v-list-item :to="{ name: 'Companies'}">
                <v-list-item-avatar
                    size="36"
                    rounded=""
                    color="#414A53"
                >
                  <v-icon color="white"> fa-building</v-icon>

                </v-list-item-avatar>
                <v-list-item-title v-if="company">
                  شرکت فعال
                </v-list-item-title>
                <v-list-item-subtitle :style="{'color': '#25D366'}" v-if="company">
                  {{ company.name }}
                </v-list-item-subtitle>
                <v-list-item-title v-if="!company" class="error--text">
                  انتخاب شرکت
                </v-list-item-title>
              </v-list-item>
              <v-divider class="border-opacity-50" color="primary" v-if="company" ></v-divider>
              <v-list-item-subtitle class="mt-3 mr-5" :style="{'color': '#019EF6'}" v-if="company">
                سایر شرکت های شما
              </v-list-item-subtitle>

              <v-list-item v-for="user_company in companies" v-if=" company && company.id != user_company.id ">
                <v-list-item-avatar
                    size="36"
                    rounded=""
                >
                  <v-icon color="#002357"> far fa-building</v-icon>
                </v-list-item-avatar>
                <v-list-item-title :style="{'color': '#414A53'}">
                  {{ user_company.name }}
                </v-list-item-title>
                <v-list-item-action>
                  <v-btn
                      class="ml-4"
                      title="فعال سازی"
                      @click="activeCompany(user_company)"
                      color='#002357'
                      icon
                      large
                  >
                    <v-icon>fas fa-power-off</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>

        <v-hover v-slot="{ hover }">
          <v-btn
              id="financial-year-activator"
              v-if="financialYear"
              :to="{ name: 'FinancialYears' }"
              depressed
              large
              color="#F7F9FE"
              class="text-right mr-2 mt-7"
              title=" سال مالی "
              :style="{ 'color': hover ? '#019EF6' : '#697480' }"
          >
            <span class="pl-1">سال مالی</span>
            {{ financialYear.name }}
          </v-btn>
        </v-hover>
        <v-menu activator="#financial-year-activator" location="end" open-on-hover>
          <v-card width="300">
            <v-list>
              <v-list-item :to="{ name: 'FinancialYears'}">
                <v-list-item-avatar
                    size="36"
                    rounded=""
                    color="#414A53"
                >
                  <v-icon color="white"> fas fa-business-time</v-icon>
                </v-list-item-avatar>
                <v-list-item-title>
                  سال مالی فعال
                </v-list-item-title>
                <v-list-item-subtitle :style="{'color': '#25D366'}">
                  {{ financialYear.name }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item >
                <v-list-item-title class="pr-5">
                  شروع
                </v-list-item-title>
                <v-list-item-subtitle :style="{'color': '#25D366'}">
                  {{ financialYear.start }}
                </v-list-item-subtitle>
                <v-list-item-title class="pr-5">
                  پایان
                </v-list-item-title>
                <v-list-item-subtitle :style="{'color': '#25D366'}">
                  {{ financialYear.end }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-divider class="border-opacity-50" color="primary"></v-divider>
              <v-list-item-subtitle  class="mt-3 mr-5" :style="{'color': '#019EF6'}" >
                سایر سال های مالی شما
              </v-list-item-subtitle>

              <v-list-item v-for="user_year in financialYears" v-if="user_year.id != financialYear.id ">
                <v-list-item-avatar
                    size="36"
                    rounded=""
                >
                  <v-icon color="#002357"> fa-business-time</v-icon>
                </v-list-item-avatar>
                <v-list-item-title :style="{'color': '#414A53'}">
                  {{ user_year.name }}
                </v-list-item-title>
                <v-list-item-action>
                  <v-btn
                      class="ml-4"
                      title="فعال سازی"
                      @click="changeFinancialYear(user_year)"
                      color='#002357'
                      icon
                      large
                  >
                    <v-icon>fas fa-power-off</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

            </v-list>
          </v-card>
        </v-menu>
        <v-dialog
            v-model="changeFinancialYearDialog"
            activator="parent"
            transition="dialog-top-transition"
            width="auto"
        >
          <v-card class="pa-5 rounded-lg">
            <v-card-title :style="{'color': '#F1416C'}">
              آیا اطمینان دارید؟
            </v-card-title>
            <v-card-text>
              با تغییر سال مالی سایر تب های سامانه بسته می شوند، میخواهید ادامه دهید؟
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn depressed color="error" @click="notChangeFinancialYear">خیر</v-btn>
              <v-btn depressed title="تغییر سال مالی" color="success" @click="activeFinancialYear">بله</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <v-spacer>
        </v-spacer>
        <v-badge dot floating color="error" v-if="user.unread_notifications_count != 0">
        </v-badge>
        <v-btn
            :to="{ name: 'NotificationsList' }"
            class="mt-7 ml-3"
            title="اعلان ها"
            rounded
            large
            color="#019EF6"
            depressed
            icon="mdi-check"

        >
          <v-hover v-slot="{ hover }">
            <v-icon :style="{ 'color': hover ? '#019EF6' : '#94A0AE' }" large> fa-bell</v-icon>
          </v-hover>
        </v-btn>

        <v-avatar
            id="menu-activator"
            size="36"
            class="mt-7 ml-12"
            rounded=""
            color="#414A53"
        >
          <v-icon color="white"> fa-user</v-icon>
        </v-avatar>


        <v-menu activator="#menu-activator" location="end" open-on-hover>
          <v-card max-width="300">
            <v-list>
              <v-list-item>
                <v-list-item-avatar
                    size="36"
                    rounded=""
                    color="#414A53"
                >
                  <v-icon color="white"> fa-user</v-icon>

                </v-list-item-avatar>
                <v-list-item-title>
                  {{ user.name || user.username }}
                </v-list-item-title>
              </v-list-item>
              <v-divider class="border-opacity-50" color="primary"></v-divider>
              <v-list-item :to="{ name: 'Profile' }">
                <v-list-item-avatar
                    size="36"
                    rounded=""
                >
                  <v-icon color="#94A0AE"> fa-user</v-icon>

                </v-list-item-avatar>
                <v-list-item-title>
                  صفحه پروفایل
                </v-list-item-title>
              </v-list-item>

              <v-list-item :to="{ name: 'Profile' }">
                <v-list-item-avatar
                    size="36"
                    rounded=""
                >
                  <v-icon color="#94A0AE"> fa-shopping-cart</v-icon>

                </v-list-item-avatar>
                <v-list-item-title>
                  خرید اشتراک
                </v-list-item-title>
              </v-list-item>

              <v-list-item @click="logout">
                <v-list-item-avatar
                    size="36"
                    rounded=""
                >
                  <v-icon color="#94A0AE"> logout</v-icon>

                </v-list-item-avatar>
                <v-list-item-title>
                  خروج
                </v-list-item-title>
              </v-list-item>

            </v-list>


          </v-card>
        </v-menu>
      </v-app-bar>
      <v-app-bar
          flat
          app
          height="28"
          color="#C2CEDB"
          clipped-left
          class="style:box-shadow;"
          v-if="user"
          v-show="!isPrinting"
      >
        <m-system-bar/>
      </v-app-bar>
      <v-main class="app-background-color">
        <v-container class="rounded-lg" fluid>
          <router-view></router-view>
        </v-container>
      </v-main>

      <v-snackbar
          :value="snackbar.show"
          @input="$store.commit('setSnackbar', { show: false })"
          :color="snackbar.color"
          :left="true"
          :outlined="false"
          top
      >
        <!-- <v-btn color="white" outlined @click="$store.commit('setSnackbar', {show:false})">بستن</v-btn> -->
        <v-btn
            color="white"
            icon
            @click="$store.commit('setSnackbar', { show: false })"
        >
          <v-icon>fa-times</v-icon>
        </v-btn>
        {{ snackbar.text }}
      </v-snackbar>
    </template>

    <v-dialog
        v-model="developersDialog"
        scrollable
        class="rounded-lg"
        max-width="500px"
        transition="dialog-transition"
    >
      <v-card class="ltr">
        <v-card-title class="text-center">Welcome Developer!</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  class="text-field-ltr"
                  label="Server Url"
                  v-model="serverUrl"
                  hint="http://localhost:7000/"
                  :hide-details="false"
                  persistent-hint
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <loader/>
  </v-app>
</template>

<script>
import mNavbar from "@/components/Navbar";
import mFooter from "@/components/Footer";
import mSystemBar from "@/components/SystemBar";
import Loader from "@/components/Loader";

import moment from "moment-jalaali";

import {mapState} from "vuex";

export default {
  name: "App",
  components: {
    mNavbar,
    mFooter,
    mSystemBar,
    Loader,
  },
  data() {
    return {
      isAppReady: false,
      showDrawer: false,
      developersDialog: false,
      timeInterval: null,
      mini: true,
      rail: true,
      dialog: false,
      fav: true,
      menu: false,
      message: false,
      drawer: false,
      hints: true,
      user_companies: [],
      get_company: false,
      get_financial_year: false,
      user_financial_years: [],
      next_year: null,
      changeFinancialYearDialog: false,


    };
  },
  computed: {
    serverUrl: {
      get() {
        return localStorage.getItem("serverUrl");
      },
      set(value) {
        localStorage.setItem("serverUrl", value);
      },
    },
    ...mapState({
      snackbar: (state) => state.snackbar,
    }),
  },
  created() {
    this.log(`server url is : ${this.getServerUrl()}`);
    this.getDateTime();
  },
  mounted() {
    console.log('ok ok ')
    this.getUserCompanies()
    this.getUserFinancialYears()
    this.tabOn("change:activeFinancialYear", () => {
      window.close();
    });
  },
  methods: {
    routeClick(routeName) {
      if (this.$route.name == routeName) {
        this.EventBus.$emit("sameRouteClick");
      }
    },
    getDateTime() {
      this.request({
        url: this.endpoint(`home/time`),
        method: "get",
        token: false,
        success: (data) => {
          let now = moment.unix(data.time);
          this.$store.commit("setTime", now);
          this.isAppReady = true;

          this.timeInterval = window.setInterval(() => {
            this.$store.commit("setTime", this.serverNow.add(1, "second"));
          }, 1000);
        },
      });
    },
    getUserCompanies() {
      this.request({
        url: this.endpoint(`companies/list`),
        method: "get",
        success: (data) => {
          let count = 0
          for (let user_company of data){
            if (count < 5){
              this.user_companies.push(user_company)
            }
            count += 1
          }
          this.company = true
        },
      });
    },
    getUserFinancialYears() {
      this.request({
        url: this.endpoint(`companies/financialYears/`),
        method: "get",
        success: (data) => {
          let count = 0
          for (let year of data){
            if (count < 5){
            this.user_financial_years.push(year)
            }
            count += 1
          }
          this.get_financial_year = true
        },
      });
    },
    logout() {
      this.setToken("");
      this.$store.commit("setUser", null);
      if (this.$route.name != "Login") {
        let url = this.$router.resolve({name: "Login"});
        window.location = url;
      }
    },
    activeCompany(item) {
      this.request({
        url: this.endpoint("users/setActiveCompany"),
        method: "post",
        data: {
          company: item.id,
        },
        success: (data) => {
          this.successNotify();
          window.location.reload();
          this.getUser();
        },
      });
    },
    activeFinancialYear() {
      this.request({
        url: this.endpoint("users/setActiveFinancialYear"),
        method: "post",
        data: {
          financial_year: this.next_year.id,
        },
        success: (data) => {
          this.tabEmit("change:activeFinancialYear");
          this.successNotify();
          window.location.reload();
        },
      });
    },
    changeFinancialYear(item) {
      this.next_year = item
      this.changeFinancialYearDialog = true
    },
    notChangeFinancialYear() {
      this.next_year = null
      this.changeFinancialYearDialog = false
    },
  },
};
</script>

<style lang="scss">
@import "./styles/main";

.app-bar {
  overflow-y: hidden;
  overflow-x: auto !important;

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
}

.bar {
  position: absolute;
  height: 94px;
  left: 0px;
  top: 0px;
  background: #FFFFFF;
  box-shadow: 0px 331px 133px rgba(10, 31, 83, 0.01), 0px 186px 112px rgba(10, 31, 83, 0.03), 0px 83px 83px rgba(10, 31, 83, 0.04), 0px 21px 46px rgba(10, 31, 83, 0.05), 0px 0px 0px rgba(10, 31, 83, 0.05);

}

.app-bar-btn {
  width: 40px !important;
  height: 40px !important;
  margin-right: 10px;

  .v-icon,
  .v-image {
    width: 20px !important;
    height: 20px !important;
  }
}
</style>
