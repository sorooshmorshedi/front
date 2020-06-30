<template>
  <daily-form
    formName="ابطال شماره بارنامه"
    title="ابطال شماره بارنامه"
    :showNavigationButtons="false"
    :showSubmitAndClearForm="false"
    :hasList="false"
    :deletable="false"
    :editable="true"
    :hasClear="false"
    @validate="revokeLadingBillNumber"
  >
    <template #inputs>
      <v-row>
        <v-col cols="12" md="4">
          <v-autocomplete
            label="سری بارنامه"
            :items="ladingBillSeriesItems"
            v-model="ladingBillSeries"
            item-text="serial"
            no-filter
            :search-input.sync="ladingBillSearchInput"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            label="شماره بارنامه"
            :items="ladingBillSeries?ladingBillSeries.numbers:[]"
            v-model="billNumber"
            item-text="number"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="4" class="mt-2" v-if="billNumber">
          <p>
            وضعیت فعلی:
            <span v-if="billNumber.is_revoked">باطل شده</span>
            <span v-else>باطل نشده</span>
          </p>
        </v-col>
      </v-row>
    </template>
  </daily-form>
</template>

<script>
import GetApi from "./GetApi";
import DailyForm from "@/components/form/DailyForm";
export default {
  mixins: [GetApi],
  components: {
    DailyForm
  },
  data() {
    return {
      ladingBillSeries: null,
      ladingBillSeriesItems: [],
      ladingBillSearchInput: "",
      billNumber: null
    };
  },
  watch: {
    ladingBillSearchInput() {
      this.getLadingBillSeries(this.ladingBillSearchInput);
    }
  },
  methods: {
    getLadingBillSeries(search) {
      this.request({
        loading: false,
        url: this.endpoint("dashtbashi/ladingBillSeries/?limit=10&offset=0"),
        method: "get",
        params: {
          serial__icontains: search
        },
        success: data => {
          this.ladingBillSeriesItems = data["results"];
        }
      });
    },
    revokeLadingBillNumber(pos) {
      this.request({
        url: this.endpoint("dashtbashi/ladingBillNumbers/revoke"),
        method: "post",
        data: {
          id: this.billNumber.id,
          is_revoked: !this.billNumber.is_revoked
        },
        success: data => {
          this.successNotify();
          this.billNumber = null;
          this.ladingBillSeries = null;
          this.getLadingBillSeries(this.ladingBillSearchInput);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>

