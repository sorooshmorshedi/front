<template>
  <div class="title">
    {{ title }}
    <span class="d-print-none">
      <a @click.prevent="emit('clearForm')" href="#/" class="btn btn-info">جدید</a>
      <router-link
        class="btn btn-info"
        :to="{name: ListRouteName, params: ListRouteParams}"
      >انتخاب {{ formName }}</router-link>

      <template v-if="hasExport">
        <a class="btn btn-info" :href="printUrl" target="_blank" rel="noopener noreferrer" >چاپ</a>
        
        <a class="btn btn-info" :href="pdfUrl" rel="noopener noreferrer">PDF</a>
        <!-- <a class="btn btn-info" :href="pdfUrl">PDF</a> -->
      </template>

      <slot></slot>
    </span>
  </div>
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
      return url;
    }
  },
  computed: {
    hasExport() {
      if (
        this.ListRouteName &&
        this.ListRouteParams.form &&
        this.exportParams &&
        this.exportParams.id
      )
        return true;
      return false;
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
