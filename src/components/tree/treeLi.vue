<template>
  <li v-if="itemVisible" :class="liClass">
    <div class="tree-node-el">
      <span
        @click="expandNode(item)"
        v-if="showExpand"
        class="tree-expand"
        :class="item.expanded ? 'tree-open' : 'tree-close'"
      ></span>
      <span
        :title="item.nodeTitle"
        class="node-title"
        @mouseover="nodeMouseOver(item, index, parent)"
        @contextmenu.prevent="nodeContextMenu($event, item, index, parent)"
        @click="nodeClick(item, index, parent)"
        style="user-select: none"
        v-html="item.nodeTitle || item.title"
      ></span>
    </div>
    <template v-if="showNextUl">
      <collapse-transition>
        <TreeUl
          v-show="item.expanded"
          :data="item.children"
          :parent="item"
          :level="level"
          :maxLevel="maxLevel"
          :topMustExpand="topMustExpand"
        />
      </collapse-transition>
    </template>
  </li>
</template>
<script>
import CollapseTransition from "./collapse-transition";
export default {
  name: "TreeLi",
  components: {
    CollapseTransition
  },
  inject: ["emitEventToTree", "isLeaf"],
  beforeCreate() {
    this.$options.components.TreeUl = require("./treeUl.vue").default;
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    index: Number,
    dataLength: {
      type: Number,
      default: 0
    },
    parent: {
      type: Object,
      default: () => null
    },
    maxLevel: Number,
    level: Number,
    topMustExpand: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    itemVisible() {
      const { visible = true } = this.item;
      return visible;
    },
    hasExpanded() {
      let { hasExpanded = false, expanded = false } = this.item;
      return this.itemVisible && (expanded || hasExpanded);
    },
    liClass() {
      const index = this.index;
      let res;
      if (this.parent) {
        res = {
          leaf: this.isLeaf(this.item)
        };
      } else {
        // top node
        res = {
          "first-node": index === 0,
          "only-node": this.dataLength === 1,
          "second-node": index === 1
        };
      }
      return res;
    },
    hasChildren() {
      const item = this.item;
      return item.children && item.children.length > 0;
    },
    showExpand() {
      const item = this.item;
      const isShow = !this.parent ? this.topMustExpand : false;
      return isShow || this.hasChildren || item.async;
    },
    showNextUl() {
      return (
        !this.isLeaf(this.item) &&
        this.maxLevel > this.level &&
        this.hasExpanded
      );
    },
    position() {
      return { level: this.level, index: this.index };
    }
  },
  methods: {
    expandNode(node) {
      const expanded = !node.expanded;
      this.$set(node, "expanded", expanded);
      this.$set(node, "hasExpanded", true);

      let closeChilds = node => {
        this.$set(node, "expanded", false);
        node.children.forEach(child => {
          closeChilds(child);
        });
      };

      if (!expanded) {
        closeChilds(node);
      }
    },
    nodeMouseOver(node, index, parent) {
      this.emitEventToTree("node-mouse-over", node, index, parent);
    },
    nodeContextMenu(e, node, index, parent) {
      this.emitEventToTree("node-context-menu", node, index, parent, e);
    },
    nodeClick(node, index, parent) {
      this.emitEventToTree("node-click", node, index, parent);
    }
  }
};
</script>