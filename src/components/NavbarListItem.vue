<template>
  <v-list-item v-if="!hasChild" :to="route.to" link>
    <v-list-item-content>
      <v-list-item-title class="list-item-title">{{ route.title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>

  <v-list-group v-else no-action :sub-group="subGroup">
    <template #activator>
      <v-list-item-content>
        <v-list-item-title class="list-item-title">{{ route.title }}</v-list-item-title>
      </v-list-item-content>
    </template>

    <navbar-list-item
      v-for="(child, i) in route.children"
      :key="i"
      :route="child"
      :sub-group="true"
    />
  </v-list-group>
</template>

<script>
export default {
  name: "NavbarListItem",
  props: ["route", "subGroup"],
  data() {
    return {};
  },
  computed: {
    hasChild() {
      return this.route.children && this.route.children.length;
    }
  },
  beforeCreate() {
    this.$options.components.NavbarListItem = require("./NavbarListItem.vue").default;
  }
};
</script>

<style lang="scss" >
</style>