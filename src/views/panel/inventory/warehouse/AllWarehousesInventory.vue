<template>
  <v-card>
    <v-card-title>کاردکس انبار همه کالا ها</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="8">
          <v-autocomplete
            :return-object="false"
            label="انبار"
            :items="warehouses"
            v-model="filters.warehouse"
            item-text="title"
            item-value="id"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select :items="waresStatuses" v-model="filters.status" label="وضعیت کالا"></v-select>
        </v-col>
        <v-col cols="12">
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
import wareApiMixin from "@/mixin/wareApi";
import _ from "lodash";
export default {
  mixins: [wareApiMixin],
  props: ["warehouseId"],
  data() {
    return {
      url: "reports/inventory/warehouse/all",
      warehouse: null,
      filters: {
        warehouse: null,
      },
      headers: [
        {
          text: "کالا",
          value: "name",
        },
        {
          text: "وارده",
          value: "input",
          type: "numeric",
          filterable: false,
        },
        {
          text: "صادره",
          value: "output",
          type: "numeric",
          filterable: false,
        },
        {
          text: "مانده",
          value: "remain",
          type: "numeric",
          filterable: false,
        },
      ],

      waresStatuses: [
        { value: "all", text: "همه" },
        { value: "withRemain", text: "کالا های دارای مانده" },
        { value: "withoutRemain", text: "بدون مانده" },
        { value: "withTransaction", text: "کالا های دارای گردش" },
        { value: "withoutTransaction", text: "کالا های بدون گردش" },
      ],
    };
  },
  created() {
    this.getWarehouses();
  },
};
</script>

<style scoped lang="scss">
</style>
