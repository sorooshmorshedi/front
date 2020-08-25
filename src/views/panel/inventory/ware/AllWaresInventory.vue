<template>
  <v-card>
    <v-card-title>کاردکس همه کالا ها</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" class="all-wares-inventory">
          <m-datatable
            :api-url="url"
            :headers="headers"
            :filters.sync="filters"
            :searchable="false"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import MDatatable from "@/components/mcomponents/datatable/MDatatable";
import _ from "lodash";
export default {
  components: { MDatatable },
  data() {
    return {
      url: "reports/inventory/ware/all",
      headers: [
        {
          text: "کالا",
          value: "name",
          type: "text",
          sortable: false
        },
        {
          text: "مقدار وارده",
          value: "input.count",
          type: "number",
          sortable: false,
          filterable: false
        },
        {
          text: "فی وارده",
          value: "input.fee",
          type: "money",
          sortable: false,
          filters: [],
          filterable: false
        },
        {
          text: "مبلغ وارده",
          value: "input.value",
          type: "money",
          sortable: false,
          filterable: false,
          filters: []
        },
        {
          text: "مقدار صادره",
          value: "output.count",
          type: "number",
          sortable: false,
          filterable: false,
          filters: []
        },
        {
          text: "فی صادره",
          value: "output.fee",
          type: "money",
          sortable: false,
          filterable: false,
          filters: []
        },
        {
          text: "مبلغ صادره",
          value: "output.value",
          type: "money",
          sortable: false,
          filterable: false,
          filters: []
        },
        {
          text: "مقدار مانده",
          value: "remain.count",
          type: "number",
          sortable: false,
          filterable: false,
          filters: []
        },
        {
          text: "فی مانده",
          value: "remain.fee",
          type: "money",
          sortable: false,
          filterable: false,
          filters: []
        },
        {
          text: "مبلغ مانده",
          value: "remain.value",
          type: "money",
          sortable: false,
          filterable: false,
          filters: []
        }
      ],
      filters: {}
    };
  }
};
</script>

<style lang="scss">
.all-wares-inventory #datatable > div.v-data-table__wrapper > table tr {
  td,
  th {
    &:nth-child(7),
    &:nth-child(10),
    &:nth-child(13) {
      border-right: 1px solid #e0e0e0 !important;
    }
  }
}
</style>
