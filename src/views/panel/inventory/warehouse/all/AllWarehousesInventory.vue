<template>
  <v-card>
    <v-card-title>کاردکس انبار همه کالا ها</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-autocomplete label="انبار" :items="warehouses" v-model="warehouse" />
        </v-col>
        <v-col cols="12">
          <datatable :url="url" :cols="datatableCols.cols" :defaultFilters="defaultFilters" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import datatable from "@/components/mcomponents/datatable/Server";
import wareApiMixin from "@/mixin/wareApi";
import datatableCols from "./_datatableCols";
import _ from "lodash";
export default {
  components: { datatable },
  mixins: [wareApiMixin],
  props: ["warehouseId"],
  data() {
    return {
      url: "reports/inventory/warehouse/all",
      warehouse: null,
      datatableCols
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      Promise.all([this.getWarehouses()]).then(data => {
        this.init();
      });
    },
    init() {
      if (this.warehouseId) {
        this.warehouse = this.warehouses.filter(
          o => o.id == this.warehouseId
        )[0];
      }
    }
  },
  watch: {},
  computed: {
    defaultFilters() {
      let res = {};
      if (this.warehouse) res.warehouse = this.warehouse.id;
      else res.warehouse = null;
      return res;
    }
  }
};
</script>

<style scoped lang="scss">
</style>
