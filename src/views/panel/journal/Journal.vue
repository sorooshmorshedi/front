<template>
  <v-row>
    <v-col cols="12" class="journal">
      <v-card>
        <v-card-title>دفتر روزنامه</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="journal.level"
                label="سطح حساب"
                :items="accountLevels"
                item-text="text"
                item-value="value"
                :return-object="false"
              />
            </v-col>
            <template v-if="journal.level">
              <v-col cols="12">
                <sanad-item-list-report
                  :filters.sync="filters"
                  :showAccountInTable="true"
                  :sortable="true"
                  :filterable="true"
                  :showRemain="false"
                  :showPreviousRemain="false"
                >
                  <template
                    #item.account.name="{ item }"
                  >{{ item.account[journal.level + '_name'] }}</template>
                  <template
                    #item.account.code="{ item }"
                  >{{ item.account[journal.level + '_code'] }}</template>
                </sanad-item-list-report>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import SanadItemListReport from "@/components/mcomponents/report/SanadItemListReport";
export default {
  name: "Journal",
  components: { SanadItemListReport },
  data() {
    return {
      journal: {
        level: ""
      },
      filters: {
        financial_year: null
      },
      accountLevels: [
        { value: "level0", text: "گروه" },
        { value: "level1", text: "کل" },
        { value: "level2", text: "معین" },
        { value: "level3", text: "تفضیلی" }
      ]
    };
  },
  created() {
    this.filters.financial_year = this.financialYear.id;
  }
};
</script>

<style scoped lang="scss">
</style>
