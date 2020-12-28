<template>
  <v-app id="app" @click.native.ctrl.alt="developersDialog = true">
    <template v-if="isAppReady">
      <v-system-bar app class="indigo lighten-5" v-show="!isPrinting">
        <m-system-bar />
      </v-system-bar>
      <v-navigation-drawer
        v-if="user"
        v-show="!isPrinting"
        app
        fixed
        clipped
        class="indigo lighten-1 white--text"
        dark
        v-model="showDrawer"
        right
        :temporary="isXs"
        :permanent="!isXs"
        :mini-variant="!isXs"
        :expand-on-hover="!isXs"
        :mobile-breakpoint="0"
      >
        <m-navbar @logout="logout" />
      </v-navigation-drawer>

      <v-app-bar app clipped-right class="indigo darken-1 app-bar" v-if="user" v-show="!isPrinting">
        <v-app-bar-nav-icon v-if="isXs" @click="showDrawer = !showDrawer" class="white--text ml-4" />

        <v-btn
          v-if="company"
          :to="{name: 'Companies'}"
          depressed
          class="white"
          :title="company.id"
        >{{ company.name }}</v-btn>
        <v-btn
          v-if="financialYear"
          :to="{name: 'FinancialYears'}"
          depressed
          class="text-right white mr-1"
          :title="financialYear.id"
        >
          <span class="pl-1">سال مالی</span>
          {{ financialYear.name }}
        </v-btn>

        <v-btn
          v-if="hasPerm('create.sanad') && hasModule('sanads')"
          class="blue white--text mr-3"
          :to="{name: 'SanadForm' }"
          @click="routeClick('SanadForm')"
        >سند</v-btn>
        <v-btn
          v-if="hasPerm('create.receiveTransaction') && hasModule('transactions')"
          class="blue white--text mr-1"
          :to="{ name: 'TransactionForm', params: { type: 'receive' } }"
          @click="routeClick('TransactionForm')"
        >دریافت</v-btn>
        <v-btn
          v-if="hasPerm('create.paymentTransaction') && hasModule('transactions')"
          class="blue white--text mr-1"
          :to="{ name: 'TransactionForm', params: { type: 'payment' } }"
          @click="routeClick('TransactionForm')"
        >پرداخت</v-btn>
        <v-btn
          v-if="hasPerm('create.buyFactor') && hasModule('factors')"
          class="blue white--text mr-1"
          :to="{name: 'FactorForm', params: { type: 'buy' } }"
          @click="routeClick('FactorForm')"
        >فاکتور خرید</v-btn>
        <v-btn
          v-if="hasPerm('create.saleFactor')  && hasModule('factors')"
          class="blue white--text mr-1"
          :to="{name: 'FactorForm', params: { type: 'sale' } }"
          @click="routeClick('FactorForm')"
        >فاکتور فروش</v-btn>
        <v-btn
          v-if="hasPerm('get.sanadItemsReport')"
          class="blue white--text mr-1"
          :to="{name: 'LedgerReport', params: { level: 'level3' }}"
        >گردش حساب</v-btn>
        <v-btn
          v-if="hasPerm('get.accountBalanceReport')"
          class="blue white--text mr-1"
          :to="{name: 'AccountsBalanceReport' }"
        >تراز حساب ها</v-btn>
        <v-btn
          v-if="hasPerm('get.account')"
          class="blue white--text mr-1"
          :to="{name: 'Accounts', params: {level: 3} }"
        >تعریف حساب</v-btn>
        <v-btn
          v-if="hasPerm('get.account')"
          class="blue white--text mr-1"
          :to="{name: 'AccountsTree' }"
        >نمودار درختی</v-btn>

        <v-spacer></v-spacer>

        <span class="white--text mr-3" :title="user.id">
          <span>{{ user.name }}</span>
        </span>
        <span class="ml-3">
          <v-btn text icon color="white" class="rotate-180" @click="logout">
            <v-icon>logout</v-icon>
          </v-btn>
        </span>
        <span class="white pa-1 rounded">
          <v-img
            style="border-radius: 30%"
            contain
            max-height="50"
            max-width="50"
            src="/img/SobhanAccountingLogo.png"
          />
        </span>
      </v-app-bar>

      <v-main class="app-background-color">
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>

      <v-footer class="indigo lighten-5">
        <m-footer />
      </v-footer>

      <v-snackbar
        :value="snackbar.show"
        @input="$store.commit('setSnackbar', {show:false})"
        :color="snackbar.color"
        :left="true"
        :outlined="false"
        top
      >
        <!-- <v-btn color="white" outlined @click="$store.commit('setSnackbar', {show:false})">بستن</v-btn> -->
        <v-btn color="white" icon @click="$store.commit('setSnackbar', {show:false})">
          <v-icon>fa-times</v-icon>
        </v-btn>
        {{ snackbar.text }}
      </v-snackbar>
    </template>

    <v-dialog
      v-model="developersDialog"
      scrollable
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card class="ltr">
        <v-card-title class="text-center">Welcome Developer!</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field class="ltr" label="Server Url" v-model="serverUrl" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <loader />
  </v-app>
</template>

<script>
import mNavbar from "@/components/Navbar";
import mFooter from "@/components/Footer";
import mSystemBar from "@/components/SystemBar";
import Loader from "@/components/Loader";

import moment from "moment-jalaali";

import { mapState } from "vuex";

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
    this.getDateTime();
    this.log(`server url is : ${this.getServerUrl()}`);
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
            this.$store.commit("setTime", this.now.add(1, "second"));
          }, 1000);
        },
      });
    },
    logout() {
      this.setToken("");
      this.$store.commit("setUser", null);
      if (this.$route.name != "Login") {
        this.$router.push({ name: "Login" });
      }
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
</style>

