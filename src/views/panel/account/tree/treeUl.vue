<template>
  <ul class="halo-tree">
    <treeLi
      v-for="(item, index) in data"
      :key="item.id ? item.id : index"
      :item="item"
      :index="index"
      v-bind="childBind"
    />
  </ul>
</template>
<script>
import TreeLi from "./treeLi";
export default {
  name: "TreeUl",
  inheritAttrs: false,
  components: { TreeLi },
  inject: ["emitEventToTree", "isLeaf"],
  props: {
    data: {
      type: Array,
      default: () => []
    },
    parent: {
      type: Object,
      default: () => null
    },
    level: {
      type: Number,
      default: 0
    },
    allowGetParentNode: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    childBind() {
      const { data, ...otherObj } = this.$props;
      const dataLength = data.filter(node => node.visible !== false).length;
      return Object.assign({}, this.$attrs, otherObj, {
        dataLength,
        level: this.treeLevel
      });
    },
    treeLevel() {
      return this.level + 1;
    }
  },
  methods: {},
  created() {
    if (this.allowGetParentNode === true) {
      const data = this.data;
      const hasParent = data[0] && typeof data[0].parent === "function";
      if (!hasParent) {
        const parent = this.parent;
        this.data.forEach(item => {
          item.parent = () => parent;
        });
      }
    }
  }
};
</script>
