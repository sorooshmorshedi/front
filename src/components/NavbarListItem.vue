<template>
  <v-list-item
    v-if="!hasChild"
    class="navbar-list-item"
    :to="route.to"
    exact
    link
    :class="'level-' + level"
    flat
    @click="routeClick(route)"
  >
    <v-list-item-icon v-if="route.icon">
      <v-icon class="navbar-icon white--text">{{ route.icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content class="pr-3 white--text">
      <v-list-item-title :class="'level-' + level">{{ route.title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>

  <v-list-group
    v-else-if="route.show"
    no-action
    :sub-group="subGroup"
    class="navbar-list-item"
    :class="'level-' + level"
  >
    <template #activator>
      <v-list-item flat class="pr-0 my-0" :class="'level-' + level" :input-value="true" exact>
        <v-list-item-icon v-if="route.icon">
          <v-icon class="navbar-icon white--text">{{ route.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content class="pr-3 white--text">
          <v-list-item-title class :class="'level-' + level">{{ route.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <navbar-list-item
      v-for="(child, i) in route.children"
      v-if="child.show"
      :key="`${level}-${i}`"
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
    },
  },
  beforeCreate() {
    this.$options.components.NavbarListItem = require("./NavbarListItem.vue").default;
  },
  methods: {
    routeClick(route) {
      if (this.$route.name == route.to.name) {
        this.EventBus.$emit("sameRouteClick");
      }
    },
  },
};
</script>

<style lang="scss" >
.navbar-list-item {
  border-radius: 0 !important;
  margin-bottom: 0px !important;
  &:not(:last-child) {
    border-bottom: 1px dashed #212121 !important;
  }

  .level-1 {
    font-weight: 700 !important;
  }
  .level-2 {
    font-weight: 500 !important;
  }
  .level-3 {
    font-weight: 300 !important;
  }
  .v-list-item__title,
  .v-list-item__subtitle {
    white-space: normal !important;
    line-height: 1.2rem !important;
  }

  .v-list-group__items > .v-list-item {
    padding-right: 0px !important;
    margin-right: 24px !important;
  }

  .v-list-group__header {
    margin-bottom: 0px !important;
  }

  .v-list-group--sub-group {
    margin-right: 24px;
    .v-list-group__header {
      padding-right: 0px !important;
    }

    .v-list-group__items .v-list-item {
      padding-right: 0px !important;
      margin-right: 36px !important;
    }
  }

  .navbar-icon {
    font-size: 24px !important;
    width: 24px !important;
    height: 24px !important;
    svg {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>