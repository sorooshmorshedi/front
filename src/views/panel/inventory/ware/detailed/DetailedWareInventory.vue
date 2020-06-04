<template>
  <v-card>
    <v-card-title>کاردکس کالا</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <ware-select label="کالا" v-model="ware" />
        </v-col>

        <v-col cols="12">
          <datatable
            v-if="ware"
            :url="url"
            :cols="datatableCols.cols"
            :colHeaders="datatableCols.colHeaders"
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
      url: "reports/inventory/ware",
      datatableCols,
      ware: null,
      defaultFilters: {
        ware: null
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      Promise.all([this.getWares()]).then(data => {
        this.init();
      });
    },
    getInventoryReport() {
      if (!this.ware) return;
      this.defaultFilters.ware = this.ware.id;
    },
    init() {
      if (this.wareId) {
        this.ware = this.waresSelectValues.wares.filter(
          o => o.id == this.wareId
        )[0];
      }
    }
  },
  watch: {
    ware: {
      handler() {
        this.getInventoryReport();
      },
      deep: true
    }
  },
  computed: {}
};
</script>

<style scoped lang="scss">
</style>
