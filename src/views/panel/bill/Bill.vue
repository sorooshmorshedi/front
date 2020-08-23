<template>
  <v-card>
    <v-card-title>صورت حساب</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <account-select
            label="حساب"
            :deep-select="false"
            items-type="level3"
            v-model="account"
            @input="getBill"
          />
        </v-col>
        <v-col cols="12">
          <datatable v-if="account" :cols="datatableCols.cols" :data="rows" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import datatable from "@/components/mcomponents/datatable/Client";
import accountApiMixin from "@/mixin/accountMixin";
import datatableCols from "./_datatableCols";
import _ from "lodash";
export default {
  components: { datatable },
  mixins: [accountApiMixin],
  props: ["accountId"],
  data() {
    return {
      account: null,
      rows: [],
      datatableCols
    };
  },
  created() {
    this.getData();
    this.init();
  },
  methods: {
    getData() {
      this.getAccounts();
    },
    getBill(account) {
      this.request({
        url: this.endpoint("reports/bill"),
        params: {
          account_id: account.id
        },
        success: data => {
          this.rows = data;
        }
      });
    },
    init() {}
  }
};
</script>

<style scoped lang="scss">
#acc-select {
  margin-bottom: 30px;
}
.print-header {
  margin-top: 30px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  h2 {
    text-align: center;
  }
}
</style>
