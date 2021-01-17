<template>
  <v-row>
    <v-col cols="12" class="ledger">
      <v-card>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <account-select
                label="حساب"
                items-type="level3"
                :horizontal="true"
                @input="(v) => setAccount(v)"
                @update:floatAccount="v => filters.floatAccount = v?v.id:null"
                @update:costCenter="v => filters.costCenter = v?v.id:null"
              />
            </v-col>
            <v-col cols="12" v-if="filters.account">
              <sanad-item-list-report
                :filters.sync="filters"
                :showAccountInTable="false"
                :showFinancialYear="true"
                :showLink="false"
                :sortable="false"
                :filterable="true"
                :showRemain="true"
                :showPreviousRemain="false"
                :considerFinancialYear="false"
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
      filters: {
        account: null,
        title: "صورت حساب تفصیلی",
        account_title: "",
        order_sanads_by: "date",
      },
    };
  },
  computed: {
    title() {
      return "صورت حساب تفصیلی";
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
