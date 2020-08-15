<template>
  <m-form
    title="ابطال شماره بارنامه"
    :showNavigationButtons="false"
    :showSubmitAndClearForm="false"
    :showList="false"
    :canDelete="canDelete"
    :isEditing="true"
    :hasClear="false"
    @submit="revokeLadingBillNumber"
  >
    <template>
      <v-row>
        <v-col cols="12" md="4">
          <v-autocomplete
            :return-object="true"
            label="سری بارنامه"
            :items="ladingBillSeriesItems"
            v-model="ladingBillSeries"
            item-text="serial"
            item-value="id"
            no-filter
            :search-input.sync="ladingBillSearchInput"
            clearable
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            :return-object="true"
            label="شماره بارنامه"
            :items="ladingBillSeries?ladingBillSeries.numbers:[]"
            v-model="billNumber"
            :item-text="(o) => o.number + ' : ' + (o.is_revoked?'باطل شده':'باطل نشده')"
            item-text="title"
            item-value="id"
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
  </m-form>
</template>

<script>
import GetApi from "./GetApi";
export default {
  mixins: [GetApi],
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
          this.billNumber.is_revoked = !this.billNumber.is_revoked;
          this.getLadingBillSeries(this.ladingBillSearchInput);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>

