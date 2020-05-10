<template>
  <v-card
    flat
    class="pa-2 teal lighten-r white--text d-flex justify-space-between flex-column flex-md-row"
  >
    <div>
      <span class="title">{{ title }}</span>
    </div>
    <div style="line-height: 33px">
      <v-btn
        small
        v-if="hasClear"
        @click.prevent="emit('clearForm')"
        href="#/"
        class="light-blue white--text mr-1"
      >جدید</v-btn>
      <v-btn
        small
        v-if="hasList"
        class="light-blue white--text mr-1"
        :to="{name: ListRouteName, params: ListRouteParams}"
      >انتخاب {{ formName }}</v-btn>

      <template v-if="hasExport">
        <v-btn
          small
          class="export-btn mr-1"
          :href="printUrl"
          target="_blank"
          rel="noopener noreferrer"
        >چاپ</v-btn>
        <v-btn small class="export-btn mr-1" :href="pdfUrl" rel="noopener noreferrer">PDF</v-btn>
      </template>

      <slot></slot>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      required: true
    },
    formName: {
      required: true
    },
    ListRouteName: {
      default: "List"
    },
    hasClear: {
      default: true
    },
    ListRouteParams: {},
    exportParams: {}
  },
  data() {
    return {
      exportBaseUrl: "reports/lists/"
    };
  },
  created() {},
  methods: {
    emit(event) {
      this.$emit(event);
    },
    addParams(url) {
      Object.keys(this.ListRouteParams).forEach(k => {
        url += k + "=" + this.ListRouteParams[k] + "&";
      });
      Object.keys(this.exportParams).forEach(k => {
        url += k + "=" + this.exportParams[k] + "&";
      });
      url += "token=" + this.token;
      return url;
    }
  },
  computed: {
    hasExport() {
      if (
        this.ListRouteName &&
        this.ListRouteParams &&
        this.ListRouteParams.form &&
        this.exportParams &&
        this.exportParams.id
      )
        return true;
      return false;
    },
    hasList() {
      return this.ListRouteName;
    },
    printUrl() {
      if (!this.hasExport) return "";
      let path = this.exportBaseUrl + this.ListRouteParams.form + "s/html?";
      path = this.addParams(path);
      return this.endpoint(path);
    },
    pdfUrl() {
      if (!this.hasExport) return "";
      let path = this.exportBaseUrl + this.ListRouteParams.form + "s/pdf?";
      path = this.addParams(path);
      return this.endpoint(path);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
