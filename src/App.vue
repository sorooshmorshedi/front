<template>
  <v-app id="app">
    <template v-if="isAppReady">
      <v-system-bar app class="indigo lighten-5">
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

        <v-btn v-if="company" depressed class="white mr-4">{{ company.name }}</v-btn>
        <v-btn v-if="financialYear" depressed class="text-right white mr-1">
          <span class="pl-1">سال مالی</span>
          {{ financialYear.name }}
        </v-btn>

        <v-spacer></v-spacer>
        <span class="white--text">
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
    </template>
  </v-app>
</template>

<script>
import mNavbar from "@/components/Navbar";
import mFooter from "@/components/Footer";
import mSystemBar from "@/components/SystemBar";
import Loader from "@/components/Loader";

import moment from "moment-jalaali";

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
      showDrawer: true
    };
  },
  watch: {
    $route() {
      this.modal(".modal", "hide");
    }
  },
  created() {
    this.getDateTime();
  },
  methods: {
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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

