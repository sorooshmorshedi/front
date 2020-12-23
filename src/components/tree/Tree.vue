<template>
  <div>
    <v-text-field label="جستوجو" class="my-2" id="tree-search" v-model="searchValue" />
    <TreeUl v-bind="childBind" class="rtl p-0 m-0" />
  </div>
</template>
<script>
import TreeUl from "./treeUl";
export default {
  name: "Tree",
  inheritAttrs: false,
  components: { TreeUl },
  provide() {
    return {
      isLeaf: this.isLeaf,
      emitEventToTree: this.emitEventToParent,
    };
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    canDeleteRoot: {
      type: Boolean,
      default: false,
    },
    nodeText: {
      default: "title",
    },
    maxLevel: {
      type: Number,
      default: 1024,
    },
    allowGetParentNode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchValue: "",
      filteredData: this.data,
    };
  },
  computed: {
    childBind() {
      return Object.assign({}, this.$attrs, {
        ...this.$props,
        data: this.filteredData,
      });
    },
  },
  mounted() {
    this.filteredData = this.performSearch(this.data, this.searchValue);
  },
  watch: {
    searchValue() {
      this.filteredData = this.performSearch(this.data, this.searchValue);
    },
    data() {
      this.filteredData = this.performSearch(this.data, this.searchValue);
    },
  },
  methods: {
    performSearch(data, searchValue) {
      let expand = false;
      data = data.map((node) => {
        if (node.children) {
          node.children = this.performSearch(node.children, searchValue);
        }

        if (!node.originalTitle) {
          node.originalTitle = node[this.nodeText];
        }

        let title = node.originalTitle;

        let hasExpandedChild = node.children.filter((o) => o.expanded == true)
          .length;

        if (
          searchValue &&
          (hasExpandedChild || node.originalTitle.includes(searchValue))
        ) {
          title = node.originalTitle.replaceAll(
            searchValue,
            `<span class='search-result'>${searchValue}</span>`
          );

          expand = true;
        } else {
          expand = false;
        }

        this.$set(node, "nodeTitle", title);
        this.$set(node, "expanded", expand);

        if (searchValue == "") {
          this.$set(node, "show", true);
        } else {
          this.$set(node, "show", expand);
        }

        expand && this.$set(node, "hasExpanded", true);

        return node;
      });

      return data;
    },
    isLeaf(node) {
      return !(node.children && node.children.length);
    },
    emitEventToParent(eventName, ...args) {
      if (!eventName) return;

      if ("node-mouse-over" != eventName)
        switch (eventName) {
          case "node-mouse-over":
          case "node-check":
          case "drag-node-end":
          case "del-node":
          case "node-click":
          case "node-select":
          case "async-load-nodes":
          case "node-context-menu":
          case "node-expand":
            this.$emit(eventName, ...args);
            break;
          default:
            throw new ReferenceError(
              `the event of ${eventName} is not effective`
            );
        }
    },

    /* @method adding child node
     * @param node parent node
     * @param newnode  new node
     */
    addNode(parent, newNode) {
      if (!parent) return;
      let addnode = null;
      this.$set(parent, "expanded", true);
      const newNodeType = typeof newNode;
      if (newNodeType === "undefined") {
        throw new ReferenceError("newNode is required but undefined");
      } else if (newNodeType === "string") {
        addnode = { title: newNode };
      } else if (newNodeType === "object") {
        if (!newNode.hasOwnProperty("title")) {
          throw new ReferenceError("the title property is missed");
        } else {
          addnode = newNode;
        }
      } else {
        throw new ReferenceError(
          `newNode type error, not allowed ${newNodeType}`
        );
      }
      const { halfcheck, checked } = parent;
      addnode = Object.assign(
        {
          checked: !halfcheck && checked,
        },
        addnode
      );
      if (this.isLeaf(parent)) {
        this.$set(parent, "children", []);
        parent.children.push(addnode);
      } else {
        parent.children.push(addnode);
      }
    },

    /* @method adding childlren nodes
     * @param node parent node
     * @param newnode  new node
     */
    addNodes(parent, children) {
      if (!parent) return;
      for (let n of children) {
        this.addNode(parent, n);
      }
    },

    /* @method delete a node
     * @param  parent parent node
     * @param  node current node
     */
    delNode(node, parent, index) {
      if (parent === null || typeof parent === "undefined") {
        if (this.canDeleteRoot) {
          this.data.splice(index, 1);
        } else {
          throw new ReferenceError("the root element can't deleted!");
        }
      } else {
        parent.children.splice(index, 1);
      }
      // this.$emit('delNode', { parentNode: parent, delNode: node })
      this.emitEventToParent("del-node", { parentNode: parent, delNode: node });
    },
  },
};
</script>
<style lang="scss">
.halo-tree li span:hover {
  background-color: transparent;
  /* padding: 6px 0; */
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  opacity: 0;
}
.halo-tree .expand-enter-active {
  transition: all 3s ease;
  height: 50px;
  overflow: hidden;
}
.halo-tree .expand-leave-active {
  transition: all 3s ease;
  height: 0px;
  overflow: hidden;
}
.halo-tree .expand-enter,
.halo-tree .expand-leave {
  height: 0;
  opacity: 0;
}
.halo-tree {
  font-size: 14px;
  -webkit-transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out,
    0.3s padding-bottom ease-in-out;
  transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out,
    0.3s padding-bottom ease-in-out;
  padding-left: 0px !important;

  li {
    padding-left: 0px !important;
  }
}
.halo-tree ul {
  box-sizing: border-box;
}
.halo-tree ul,
.halo-tree li {
  list-style-type: none;
  text-align: left;
}
.halo-tree .inputCheck {
  display: inline-block;
  position: relative;
  width: 14px;
  height: 14px;
  border: 1px solid #888888;
  border-radius: 2px;
  top: 4px;
  text-align: center;
  font-size: 14px;
  line-height: 14px;
}
.halo-tree .inputCheck.notAllNodes:before {
  content: "\2713";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #888888;
  z-index: 1;
  color: #ffffff;
}
.halo-tree .inputCheck.box-checked:after {
  content: "\2713";
  display: block;
  position: absolute;
  z-index: 1;
  width: 100%;
  text-align: center;
}
.halo-tree .box-halfchecked {
  background-color: #888888;
}
.halo-tree .box-halfchecked:after {
  content: "\2713";
  display: block;
  position: absolute;
  z-index: 1;
  width: 100%;
  text-align: center;
  color: #ffffff;
}
.halo-tree .check {
  display: block;
  position: absolute;
  font-size: 14px;
  width: 16px;
  height: 16px;
  left: -5px;
  top: -4px;
  border: 1px solid #000000;
  opacity: 0;
  cursor: pointer;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
  filter: alpha(opacity=0);
  z-index: 2;
}
.halo-tree .chkDisabled {
  background-color: #f5f5f5;
  opacity: 1;
  cursor: not-allowed;
}
.halo-tree li {
  margin: 0;
  padding: 5px 5px 5px 15px;
  position: relative;
  list-style: none;
}
.halo-tree li:after,
.halo-tree li:before {
  content: "";
  left: -8px;
  position: absolute;
  right: auto;
  border-width: 1px;
}
.halo-tree li:before {
  border-left: 1px dashed #999;
  bottom: 50px;
  height: 100%;
  top: -8px;
  width: 1px;
}
.halo-tree li:after {
  border-top: 1px dashed #999;
  height: 20px;
  top: 17px;
  width: 28px;
}
.halo-tree li:last-child::before {
  height: 26px;
}
.halo-tree > li.first-node:before {
  top: 17px;
}
.halo-tree > li.second-node:before {
  top: 4px;
}
.halo-tree > li.first-node.only-node::before {
  border-left: none;
}
.halo-tree > li.only-node:after {
  border-top: none;
}
.halo-tree > ul {
  padding-left: 0;
}
.halo-tree ul {
  padding-left: 0px;
  padding-top: 10px;
}
.halo-tree .tree-expand {
  display: inline-block;
  width: 14px;
  height: 14px;
  text-align: center;
  line-height: 13px;
  border: 1px solid #888888;
  border-radius: 2px;
  background: #ffffff;
  font-style: normal;
}
.halo-tree .tree-open {
  line-height: 13px;
}
.halo-tree .tree-close:after {
  content: "+";
}
.halo-tree .tree-open:after {
  content: "\2013";
}
.halo-tree .tree-empty:after {
  content: "";
}
.halo-tree .tree-node-el {
  background-color: #ffffff;
  padding-left: 2px;
  position: relative;
  z-index: 3;
}
.halo-tree li.leaf {
  padding-left: 0px;
}
.halo-tree li.leaf:after {
  content: "";
  left: -7px;
  position: absolute;
  right: auto;
  border-width: 1px;
  border-top: 1px dashed #999;
  height: 20px;
  top: 17px;
  width: 25px;
}
/*Dynamic style part*/
.halo-tree-search-box {
  height: 18px;
  line-height: 18px;
  outline: none;
  border: 1px solid #888888;
  border-radius: 3px;
}
.halo-tree-search-box:focus {
  border: 1px solid rgb(16, 142, 233);
  -webkit-box-shadow: 0 2px 2px rgba(16, 142, 233, 0.2);
  box-shadow: 0 2px 2px rgba(16, 142, 233, 0.2);
  -webkit-transition: border-color ease-in-out 0.15s,
    -webkit-box-shadow ease-in-out 0.15s;
  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}
.halo-tree .node-title {
  padding: 3px 3px;
  border-radius: 3px;
  cursor: pointer;
  margin: 0 2px;
}
.halo-tree .node-title:hover {
  background-color: #ccc;
}
.halo-tree .node-title-disabled {
  padding: 3px 3px;
  border-radius: 3px;
  background-color: #f5f5f5;
  opacity: 1;
  cursor: not-allowed;
  margin: 0 2px;
}
.halo-tree .node-title-disabled:hover {
  background-color: #f5f5f5;
}
.halo-tree .node-selected {
  border: 1px solid #dddddd;
  background-color: #dddddd;
}
.halo-tree .node-title.node-searched {
  border: 1px solid #ff8247;
}

.search-result {
  background-color: #ffeb3b;
}

.tree-expand {
  cursor: pointer;
}
</style>