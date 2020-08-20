<template>
  <v-app id="app">
    <template v-if="isAppReady">
      <v-system-bar app class="indigo lighten-5" v-show="!isPrinting">
        <m-system-bar />
      </v-system-bar>
      <v-navigation-drawer
        app
        right
        clipped
        class="indigo lighten-5"
        :value="showDrawer"
        v-if="user"
      >
        <m-navbar />
      </v-navigation-drawer>

      <v-app-bar app clipped-right class="indigo darken-1" v-if="user">
        <v-app-bar-nav-icon @click="showDrawer = !showDrawer" class="white--text" />

        <v-btn
          v-if="company"
          :to="{name: 'Companies'}"
          depressed
          class="white mr-4"
        >{{ company.name }}</v-btn>
        <v-btn
          v-if="financialYear"
          :to="{name: 'FinancialYears'}"
          depressed
          class="text-right white mr-1"
        >
          <span class="pl-1">سال مالی</span>
          {{ financialYear.name }}
        </v-btn>

        <v-btn
          class="blue white--text mr-3"
          :to="{name: 'SanadForm' }"
          @click="routeClick('SanadForm')"
        >سند</v-btn>
        <v-btn
          class="blue white--text mr-1"
          :to="{name: 'FactorForm', params: { factorType: 'sale' } }"
          @click="routeClick('FactorForm')"
        >فاکتور فروش</v-btn>
        <v-btn
          class="blue white--text mr-1"
          :to="{name: 'FactorForm', params: { factorType: 'buy' } }"
          @click="routeClick('FactorForm')"
        >فاکتور خرید</v-btn>
        <v-btn class="blue white--text mr-1" :to="{name: 'AccountTree' }">نمودار درختی</v-btn>
        <v-btn class="blue white--text mr-1" :to="{name: 'AccountsBalanceReport' }">تراز حساب ها</v-btn>
        <v-btn
          class="blue white--text mr-1"
          :to="{ name: 'TransactionForm', params: { transactionType: 'receive' } }"
          @click="routeClick('TransactionForm')"
        >دریافت</v-btn>
        <v-btn
          class="blue white--text mr-1"
          :to="{ name: 'TransactionForm', params: { transactionType: 'payment' } }"
          @click="routeClick('TransactionForm')"
        >پرداخت</v-btn>

        <v-spacer></v-spacer>

        <span class="white--text mr-3">
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
          ></v-img>
        </span>
      </v-app-bar>

      <loader />

      <v-content class="app-background-color">
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-content>

      <v-footer class="indigo lighten-5">
        <m-footer />
      </v-footer>

      <v-snackbar
        :value="snackbar.show"
        @input="$store.commit('setSnackbar', {show:false})"
        :color="snackbar.color"
        right
      >
        {{ snackbar.text }}
        <!-- <v-btn color="white" outlined @click="$store.commit('setSnackbar', {show:false})">بستن</v-btn> -->
        <v-btn color="white" icon @click="$store.commit('setSnackbar', {show:false})">
          <v-icon>fa-times</v-icon>
        </v-btn>
      </v-snackbar>
    </template>
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
    Loader
  },
  data() {
    return {
      isAppReady: false,
      showDrawer: false
    };
  },
  computed: {
    ...mapState({
      snackbar: state => state.snackbar
    })
  },
  created() {
    this.getDateTime();
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
        success: data => {
          let now = moment(data.time);
          this.$store.commit("setTime", now);
          this.isAppReady = true;
        }
      });
    },
    logout() {
      this.setToken("");
      this.$store.commit("setUser", null);
      if (this.$route.name != "Login") {
        this.$router.push({ name: "Login" });
      }
    }
  }
};
</script>

<style lang="scss">
@import "./styles/main";
</style>

