<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <m-datatable :headers="headers" :apiUrl="url" :filters.sync="filters" ref="datatable">
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>
      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
import FactorMixin from "@/views/panel/factor/mixin";
export default {
  name: "FactorsList",
  mixins: [FactorMixin],
  props: {
    type: {},
  },
  data() {
    return {
      filters: {},
      url: "reports/lists/factorsAggregatedSanads",
    };
  },
  computed: {
    title() {
      return "لیست اسناد تجمیعی " + this.getFactorTitle(this.type, false);
    },
    headers() {
      let headers = [
        {
          text: "شماره",
          value: "code",
        },
        {
          text: "تاریخ",
          value: "date",
          type: "date",
        },
        {
          text: "توضیحات",
          value: "explanation",
        },
      ];

      headers.push({
        text: "جزئیات",
        value: "detail",
        sortable: false,
        filterable: false,
      });

      return headers;
    },
  },
  created() {
    this.filters.type = this.type;
  },
  watch: {
    $route() {
      this.filters.type = this.type;
      this.$refs.datatable.getDataFromApi();
    },
  },
  methods: {
    to(item) {
      return {
        name: "FactorsAggregatedSanadForm",
        params: {
          type: this.type,
          id: item.id,
        },
      };
    },
  },
};
</script>

<style scoped lang="scss">
</style>