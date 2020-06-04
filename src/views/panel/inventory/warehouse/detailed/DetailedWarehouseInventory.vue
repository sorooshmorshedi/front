<template>
  <v-card>
    <v-card-title>کاردکس انبار</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="8">
          <ware-select label="کالا" v-model="ware" />
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete label="انبار" :items="waresSelectValues.warehouses" v-model="warehouse" />
        </v-col>
        <v-col cols="12">
          <datatable
            v-if="this.ware"
            :url="url"
            :cols="datatableCols.cols"
            :defaultFilters="defaultFilters"
            hasSum="1"
          />
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
  props: ["wareId"],
  data() {
    return {
      url: "reports/inventory/warehouse",
      datatableCols,
      ware: null,
      warehouse: null
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      Promise.all([this.getWares(), this.getWarehouses()]).then(data => {
        this.init();
      });
    },
    init() {
      if (this.wareId) {
        this.ware = this.waresSelectValues.wares.filter(
          o => o.id == this.wareId
        )[0];
      }
    }
  },
  computed: {
    defaultFilters() {
      let res = {};
      if (this.ware) res.ware = this.ware.id;
      else res.ware = null;
      if (this.warehouse) res.warehouse = this.warehouse.id;
      else res.warehouse = null;
      return res;
    }
  }
};
</script>

<style scoped lang="scss">
</style>
