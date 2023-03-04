<template>
  <div>
    <v-row>
      <v-col cols="12" md="12">
        <v-card class="pa-3 rounded-lg">
          <v-img
              class="rounded-lg"
              max-height="500"
              src="/img/home.png"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import GetUserApi from "@/views/panel/user/getUserApi.js";
import AccountsRemainChart from "@/components/widgets/AccountsRemainChart";
import RecentChequesWidget from "@/components/widgets/RecentCheques";
export default {
  name: "Panel",
  mixins: [GetUserApi],
  components: { AccountsRemainChart, RecentChequesWidget },
  data() {
    return {};
  },
  created() {
    this.getUser();
  },
  methods: {
    closeAccounts() {
      this.request({
        url: this.endpoint("companies/closeAccounts"),
        method: "post",
        success: (data) => {
          this.successNotify();
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
