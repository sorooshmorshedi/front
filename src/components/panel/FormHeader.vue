<template>
  <div class="title">
    {{ title }}
    <span class="d-print-none">
      <a @click.prevent="emit('clearForm')" href="#/" class="btn btn-info">جدید</a>
      <router-link
        class="btn btn-info"
        :to="{name: ListRouteName, params: ListRouteParams}"
      >انتخاب {{ formName }}</router-link>

      <button class="btn btn-info" @click="print()">چاپ</button>

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
    ListRouteParams: {}
  },
  data() {
    return {};
  },
  methods: {
    emit(event) {
      this.$emit(event);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
