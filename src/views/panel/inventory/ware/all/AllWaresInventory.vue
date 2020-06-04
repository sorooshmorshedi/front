<template>
  <v-card>
    <v-card-title>کاردکس همه کالا ها</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <datatable :url="url" :cols="datatableCols.cols" :colHeaders="datatableCols.colHeaders" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import datatable from "@/components/mcomponents/datatable/Server";
import datatableCols from "./_datatableCols";
import _ from "lodash";
export default {
  components: { datatable },
  data() {
    return {
      url: "reports/inventory/ware/all",
      datatableCols
    };
  },
  created() {},
  methods: {},
  watch: {},
  computed: {}
};
</script>

<style scoped lang="scss">
</style>
