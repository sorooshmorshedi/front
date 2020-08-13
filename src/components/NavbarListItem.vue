<template>
  <v-list-item
    v-if="!hasChild"
    :to="route.to"
    link
    :class="'level-' + level"
    flat
    @click="routeClick(route)"
  >
    <v-list-item-content>
      <v-list-item-title :class="'level-' + level">{{ route.title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>

  <v-list-group v-else no-action :sub-group="subGroup">
    <template #activator>
      <v-list-item flat>
        <v-list-item-content>
          <v-list-item-title class :class="'level-' + level">{{ route.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <navbar-list-item
      v-for="(child, i) in route.children"
      :key="i"
      :route="child"
      :sub-group="true"
      :level="level+1"
    />
  </v-list-group>
</template>

<script>
export default {
  name: "NavbarListItem",
  props: ["route", "subGroup", "level"],
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
  },
  methods: {
    routeClick(route) {
      if (this.$route.name == route.to.name) {
        this.EventBus.$emit("sameRouteClick");
      }
    }
  }
};
</script>

<style lang="scss" >
.level-1 {
  font-weight: 700 !important;
}
.level-2 {
  font-weight: 500 !important;
}
.level-3 {
  font-weight: 300 !important;
}
</style>