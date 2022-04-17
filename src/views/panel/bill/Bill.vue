<template>
  <v-row>
    <v-col cols="12" class="ledger">
      <v-card>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="8">
              <account-select
                label="حساب"
                items-type="level3"
                :horizontal="true"
                v-model="bill.account"
                :floatAccount.sync="bill.floatAccount"
                :costCenter.sync="bill.costCenter"
                @input="setAccount"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-switch label="احتساب مانده از قبل" v-model="filters.consider_previous_remain"></v-switch>
            </v-col>
            <v-col cols="12" v-if="filters.account">
              <sanad-item-list-report
                :filters.sync="filters"
                :showAccountInTable="false"
                :showFinancialYear="true"
                :showLink="false"
                :sortable="true"
                :filterable="true"
                :showRemain="true"
                :showPreviousRemain="filters.consider_previous_remain"
                :considerFinancialYear="false"
                :colspan="3"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import SanadItemListReport from "@/components/mcomponents/report/SanadItemListReport";
export default {
  name: "Bill",
  components: { SanadItemListReport },
  mixins: [accountApiMixin],
  props: {
    ledgerAccountIds: {
      default: () => [],
    },
  },
  data() {
    return {
      bill: {},
      filters: {
        account: null,
        floatAccount: null,
        costCenter: null,
        title: "صورت حساب تفصیلی",
        account_title: "",
        consider_previous_remain: "true",
        report_type: "bill",
      },
    };
  },
  computed: {
    title() {
      return "صورت حساب تفصیلی";
    },
  },
  watch: {
    bill: {
      deep: true,
      handler() {
        if (this.bill.account) this.filters.account = this.bill.account.id;
        if (this.bill.floatAccount)
          this.filters.floatAccount = this.bill.floatAccount.id;
        if (this.bill.costCenter)
          this.filters.costCenter = this.bill.costCenter.id;
      },
    },
  },
  methods: {
    setAccount(account) {
      if (account) {
        this.filters.account = account.id;
        this.filters.account_title = account.title;
      }
    },
  },
};
</script>

<style scoped lang="scss">
</style>
