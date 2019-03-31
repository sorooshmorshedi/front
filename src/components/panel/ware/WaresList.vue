<template>
  <div>
    <datatable :cols="cols" :data="wares" @rowClick="rowClick"/>
  </div>
</template>
<script>
import datatable from "@/components/mcomponents/datatable/Client";

export default {
  props: {
    wares: {
      required: true
    }
  },
  components: { datatable },
  data() {
    return {
      cols: [
        {
          th: "کد کالا",
          td: "code",
          type: "number",
          filters: [
            {
              label: "از کد",
              model: "code__from"
            },
            {
              label: "تا کد",
              model: "code__to"
            }
          ]
        },
        {
          th: "نام کالا",
          td: "name",
          type: "text",
          filters: ["name"]
        }
      ]
    };
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    rowClick(item) {
      this.$emit("rowClick", item);
    }
  }
};
</script>

<style scoped lang="scss">
</style>

