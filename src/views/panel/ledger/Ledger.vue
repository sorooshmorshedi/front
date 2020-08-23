<template>
  <v-row>
    <v-col cols="12" class="ledger">
      <v-card>
        <v-card-title>دفتر کل، معین، تفضیلی</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="ledger.level"
                label="سطح حساب"
                :items="accountLevels"
                item-text="text"
                item-value="value"
                :return-object="false"
              />
            </v-col>
            <v-col cols="12" md="8">
              <account-select
                label="حساب"
                v-if="ledger.level != undefined"
                :deep-select="false"
                :items-type="'level' + ledger.level"
                v-model="ledger.account"
              />
            </v-col>
            <template v-if="ledger.account">
              <v-col cols="12" md="2">
                <date label="از تاریخ" v-model="filters.sanad__date__gte" clearable />
              </v-col>
              <v-col cols="12" md="2">
                <date label="تا تاریخ" v-model="filters.sanad__date__lte" clearable />
              </v-col>
              <v-col cols="12" md="2">
                <money label="از شماره" v-model="filters.sanad__code__gte" clearable />
              </v-col>
              <v-col cols="12" md="2">
                <money label="تا شماره" v-model="filters.sanad__code__lte" clearable />
              </v-col>
              <v-col cols="12" md="4">
                <v-radio-group v-model="filters.ordering" row>
                  <template #label>مرتب سازی بر اساس:</template>
                  <v-radio label="تاریخ سند" value="date" />
                  <v-radio label="شماره سند" value="code" />
                </v-radio-group>
              </v-col>
              <v-col cols="12">
                <m-datatable
                  :headers="headers"
                  api-url="reports/ledger"
                  :filters.sync="filters"
                  :searchable="false"
                  @update:api-data="setApiData"
                  :previousApiData.sync="previousApiData"
                  :currentApiData.sync="apiData"
                >
                  <template v-if="apiData.previous" v-slot:body.prepend="{ headers }">
                    <tr class="text-center">
                      <td colspan="4"></td>
                      <td>منقول از صفحه قبل</td>
                      <td v-if="showAccountInTable" colspan="2"></td>
                      <td>{{ previousLastItem.comulative_bed | toMoney }}</td>
                      <td>{{ previousLastItem.comulative_bes | toMoney }}</td>
                      <td>{{ previousLastItem.remain | toMoney }}</td>
                      <td>{{ previousLastItem.remain_type }}</td>
                    </tr>
                  </template>
                  <template v-else-if="lastItem" v-slot:body.prepend="{ headers }">
                    <tr class="text-center">
                      <td colspan="4"></td>
                      <td>مانده از قبل</td>
                      <td v-if="showAccountInTable" colspan="2"></td>
                      <td>{{ lastItem.previous_bed | toMoney }}</td>
                      <td>{{ lastItem.previous_bes | toMoney }}</td>
                      <td>{{ lastItem.previous_remain | toMoney }}</td>
                      <td>{{ lastItem.previous_remain_type }}</td>
                    </tr>
                  </template>

                  <template v-if="apiData.results.length" v-slot:body.append="{ headers }">
                    <tr class="text-center">
                      <td colspan="4"></td>
                      <td>جمع این صفحه</td>
                      <td v-if="showAccountInTable" colspan="2"></td>
                      <td>{{ pageSum['bed'] | toMoney }}</td>
                      <td>{{ pageSum['bes'] | toMoney }}</td>
                      <td>{{ lastItem.remain | toMoney }}</td>
                      <td>{{ lastItem.remain_type | toMoney }}</td>
                    </tr>
                    <tr v-if="apiData.previous" class="text-center">
                      <td colspan="4"></td>
                      <td>جمع تا این صفحه</td>
                      <td v-if="showAccountInTable" colspan="2"></td>
                      <td>{{ lastItem.comulative_bed | toMoney }}</td>
                      <td>{{ lastItem.comulative_bes | toMoney }}</td>
                      <td>{{ lastItem.remain | toMoney }}</td>
                      <td>{{ lastItem.remain_type | toMoney }}</td>
                    </tr>
                  </template>
                </m-datatable>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import MDatatable from "@/components/mcomponents/datatable/MDatatable";
import accountApiMixin from "@/mixin/accountMixin";
import datatableCols from "./_datatableCols";
import _ from "lodash";
export default {
  name: "Ledger",
  components: { MDatatable },
  mixins: [accountApiMixin],
  props: {
    ledgerAccountIds: {
      default: () => []
    }
  },
  data() {
    return {
      datatableCols,
      apiData: {
        results: []
      },
      previousApiData: null,
      ledger: {
        // account: null,
        account: 1,
        level: null
      },
      filters: {
        account__code__startswith: ""
      },
      accountLevels: [
        { value: 0, text: "گروه" },
        { value: 1, text: "کل" },
        { value: 2, text: "معین" },
        { value: 3, text: "تفضیلی" }
      ]
    };
  },
  computed: {
    showAccountInTable() {
      return this.ledger.level != 3;
    },
    headers() {
      let headers = [
        {
          text: "تاریخ",
          value: "sanad.date",
          type: "date",
          sortable: false,
          filterable: false
        },
        {
          text: "شماره سند",
          value: "sanad.code",
          type: "numeric",
          sortable: false,
          filterable: false
        },
        {
          text: "شرح",
          value: "explanation",
          sortable: false,
          filterable: false
        }
      ];
      if (this.showAccountInTable) {
        headers = headers.concat([
          {
            text: "کد حساب",
            value: "account.code",
            showRangeFilter: true,
            sortable: false
          },
          {
            text: "نام حساب",
            value: "account.name",
            sortable: false
          }
        ]);
      }
      headers = headers.concat([
        {
          text: "بدهکار",
          value: "bed",
          type: "money",
          sortable: false,
          filterable: false
        },
        {
          text: "بستانکار",
          value: "bes",
          type: "money",
          sortable: false,
          filterable: false
        },
        {
          text: "مانده",
          value: "remain",
          sortable: false,
          filterable: false,
          align: "center"
        },
        {
          text: "تشخیص",
          value: "remain_type",
          sortable: false,
          filterable: false,
          align: "center"
        }
      ]);

      return headers;
    },
    lastItem() {
      return this.apiData.results[this.apiData.results.length - 1];
    },
    previousLastItem() {
      if (this.previousApiData) {
        return this.previousApiData.results[
          this.previousApiData.results.length - 1
        ];
      } else {
        return null;
      }
    },
    previousRemain() {
      if (this.apiData.results.length) {
        let item = this.apiData.results[0];
        return Math.abs(
          item.comulative_bed - +item.bed - (item.comulative_bes - +item.bes)
        );
      }
      return 0;
    },
    previousRemainType() {
      if (this.apiData.results.length) {
        let item = this.apiData.results[0];
        let bed_remain =
          item.comulative_bed - +item.bed - (item.comulative_bes - +item.bes);
        if (bed_remain > 0) return "بد";
        if (bed_remain < 0) return "بس";
      }
      return " - ";
    },
    pageSum() {
      let bed = 0;
      let bes = 0;
      this.apiData.results.forEach(item => {
        bed += +item.bed;
        bes += +item.bes;
      });
      return { bed, bes };
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (typeof this.ledgerAccountIds == "string") {
        let acc = this.findAccount("id", +this.ledgerAccountIds);
      } else {
        for (const id of this.ledgerAccountIds) {
          let acc = this.findAccount("id", id);
          if (!acc) {
            console.error("There is no code ");
            return;
          }
        }
      }
    }
  },
  watch: {
    "ledger.account"() {
      this.filters.account__code__startswith = this.ledger.account.code;
    }
  }
};
</script>

<style scoped lang="scss">
</style>
