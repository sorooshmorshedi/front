<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="white--text red darken-2">هزینه</v-card-title>

          <v-card-text class="pt-4">
            <accounts-remain-chart
              label="هزینه"
              codeStartsWith="8"
              legendPossition="left"
              value="bed_remain"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="white--text green">درآمد</v-card-title>

          <v-card-text class="pt-4">
            <accounts-remain-chart
              label="درآمد"
              codeStartsWith="6"
              legendPossition="right"
              value="bes_remain"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <recent-cheques-widget type="c" :isPaid="true" />
      </v-col>
      <v-col cols="12" md="6">
        <recent-cheques-widget type="c" :isPaid="false" />
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
