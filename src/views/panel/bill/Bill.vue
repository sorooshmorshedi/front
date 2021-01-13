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
                @input="(v) => filters.account = v.id"
                @update:floatAccount="v => filters.floatAccount = v.id"
                @update:costCenter="v => filters.costCenter = v.id"
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
        title: "صورت حساب تفصیلی",
      },
    };
  },
  computed: {
    title() {
      return "صورت حساب تفصیلی";
    },
  },
  methods: {},
  watch: {},
};
</script>

<style scoped lang="scss">
</style>
