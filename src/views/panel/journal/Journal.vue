<template>
  <v-row>
    <v-col cols="12" class="journal">
      <v-card class="rounded-lg">
        <v-card-title>دفتر روزنامه</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                  class="rounded-lg"
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
                    :sortable="sortable"
                    :filterable="filterable"
                    :headers="headers"
                    :showRemain="false"
                    :showPreviousRemain="false"
                >
                  <!-- <template
                    #item.account.name="{ item }"
                  >{{ item.account[journal.level + '_name'] }}</template>
                  <template
                    #item.account.code="{ item }"
                  >{{ item.account[journal.level + '_code'] }}</template> -->
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
  components: {SanadItemListReport},
  data() {
    return {
      journal: {
        level: "",
      },
      filters: {
        financial_year: null,
        title: "دفتر روزنامه",
      },
      sortable: true,
      filterable: true,
      accountLevels: [
        {value: "level0", text: "گروه"},
        {value: "level1", text: "کل"},
        {value: "level2", text: "معین"},
        {value: "level3", text: "تفضیلی"},
      ],
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "سال مالی",
          value: "financial_year.name",
          sortable: this.sortable,
          filterable: this.filterable,
          show: this.showFinancialYear,
        },
        {
          text: "تاریخ",
          value: "sanad.date",
          type: "date",
          sortable: this.sortable,
          filterable: this.filterable,
        },
        {
          text: "شماره سند",
          value: "sanad.code",
          sortable: this.sortable,
          filterable: this.filterable,
          showRangeFilter: true
        },
        {
          text: "شرح",
          value: "explanation",
          sortable: this.sortable,
          filterable: this.filterable,
        },
        {
          text: "کد حساب",
          value: 'account.' + this.journal.level + '_code',
          showRangeFilter: true,
          sortable: false,
          show: this.showAccountInTable,
        },
        {
          text: "نام حساب",
          value: 'account.' + this.journal.level + '_name',
          sortable: false,
          show: this.showAccountInTable,
        },
        {
          text: "بدهکار",
          value: "bed",
          type: "numeric",
          sortable: this.sortable,
          filterable: this.filterable,
        },
        {
          text: "بستانکار",
          value: "bes",
          type: "numeric",
          sortable: this.sortable,
          filterable: this.filterable,
        },
        {
          text: "مانده",
          value: "remain",
          type: "numeric",
          sortable: false,
          filterable: false,
          align: "center",
          show: this.showRemain,
        },
        {
          text: "تشخیص",
          value: "remain_type",
          sortable: false,
          filterable: false,
          align: "center",
          show: this.showRemain,
        },
        {
          text: "سند سیستمی",
          value: "sanad.is_auto_created",
          type: "boolean",
          sortable: false,
          filterable: false,
          align: "center",
        },
        {
          text: "فرم",
          value: "sanad_form",
          sortable: false,
          filterable: false,
          align: "center",
        },
        {
          text: "مشاهده سند",
          value: "detail",
          sortable: false,
          filterable: false,
          align: "left",
          hideInExport: true,
          show: this.showLink,
        },
      ];
    }
  },
  created() {
    this.filters.financial_year = this.financialYear.id;
  },
};
</script>

<style scoped lang="scss">
</style>
