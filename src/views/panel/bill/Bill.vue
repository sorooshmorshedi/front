<template>
  <v-row>
    <v-col cols="12" class="ledger">
      <v-card>
        <v-card-title>صورت حساب تفصیلی</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <account-select
                label="حساب"
                :deep-select="false"
                items-type="level3"
                @input="(v) => filters.account = v.id"
              />
            </v-col>
            <v-col cols="12" v-if="filters.account">
              <sanad-item-list-report
                :filters.sync="filters"
                :showAccountInTable="false"
                :sortable="true"
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
      },
    };
  },
  methods: {},
  watch: {},
};
</script>

<style scoped lang="scss">
</style>
