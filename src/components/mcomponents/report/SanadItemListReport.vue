<template>
  <m-datatable
    :headers="headers"
    api-url="reports/sanadItems"
    :filters.sync="localFilters"
    :searchable="false"
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
        <template v-if="showRemain">
          <td>{{ previousLastItem.remain | toMoney }}</td>
          <td>{{ previousLastItem.remain_type }}</td>
        </template>
      </tr>
    </template>
    <template v-else-if="showPreviousRemain && lastItem" v-slot:body.prepend="{ headers }">
      <tr class="text-center">
        <td colspan="4"></td>
        <td>مانده از قبل</td>
        <td v-if="showAccountInTable" colspan="2"></td>
        <td>{{ lastItem.previous_bed | toMoney }}</td>
        <td>{{ lastItem.previous_bes | toMoney }}</td>
        <template v-if="showRemain">
          <td>{{ lastItem.previous_remain | toMoney }}</td>
          <td>{{ lastItem.previous_remain_type }}</td>
        </template>
      </tr>
    </template>

    <template v-if="apiData.results.length" v-slot:body.append="{ headers }">
      <tr class="text-center">
        <td colspan="4"></td>
        <td>جمع این صفحه</td>
        <td v-if="showAccountInTable" colspan="2"></td>
        <td>{{ pageSum['bed'] | toMoney }}</td>
        <td>{{ pageSum['bes'] | toMoney }}</td>
        <template v-if="showRemain">
          <td>{{ lastItem.remain | toMoney }}</td>
          <td>{{ lastItem.remain_type | toMoney }}</td>
        </template>
      </tr>
      <tr v-if="apiData.previous" class="text-center">
        <td colspan="4"></td>
        <td>جمع تا این صفحه</td>
        <td v-if="showAccountInTable" colspan="2"></td>
        <td>{{ lastItem.comulative_bed | toMoney }}</td>
        <td>{{ lastItem.comulative_bes | toMoney }}</td>
        <template v-if="showRemain">
          <td>{{ lastItem.remain | toMoney }}</td>
          <td>{{ lastItem.remain_type | toMoney }}</td>
        </template>
      </tr>
    </template>

    <template v-for="(index, name) in $slots" v-slot:[name]>
      <slot :name="name" />
    </template>
    <template v-for="(index, name) in $scopedSlots" v-slot:[name]="data">
      <slot :name="name" v-bind="data"></slot>
    </template>
  </m-datatable>
</template>

<script>
import MDatatable from "@/components/mcomponents/datatable/MDatatable";
import accountApiMixin from "@/mixin/accountMixin";
import _ from "lodash";
export default {
  name: "Ledger",
  components: { MDatatable },
  mixins: [accountApiMixin],
  props: {
    filters: {},
    showAccountInTable: {
      required: true
    },
    sortable: {
      required: true
    },
    filterable: {
      required: true
    },
    showRemain: {
      required: true
    },
    showPreviousRemain: {
      required: true
    }
  },
  data() {
    return {
      apiData: {
        results: []
      },
      localFilters: this.filters,
      previousApiData: null
    };
  },
  computed: {
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
    },
    headers() {
      let headers = [
        {
          text: "تاریخ",
          value: "sanad.date",
          type: "date",
          sortable: this.sortable,
          filterable: this.filterable
        },
        {
          text: "شماره سند",
          value: "sanad.code",
          type: "numeric",
          sortable: this.sortable,
          filterable: this.filterable
        },
        {
          text: "شرح",
          value: "explanation",
          sortable: this.sortable,
          filterable: this.filterable
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
          sortable: this.sortable,
          filterable: this.filterable
        },
        {
          text: "بستانکار",
          value: "bes",
          type: "money",
          sortable: this.sortable,
          filterable: this.filterable
        }
      ]);
      if (this.showRemain) {
        headers = headers.concat([
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
      }

      return headers;
    }
  },
  watch: {
    filters() {
      this.$emit("update:filters", this.localFilters);
    }
  },
  methods: {}
};
</script>

<style scoped lang="scss">
</style>
