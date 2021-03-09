<template>
  <v-row>
    <v-col v-for="(n, i) in 5" :key="i">
      <v-autocomplete
        v-if="i == 0 || pathLevels[i-1] != undefined"
        :label="getPathTitle(i)"
        :items="getPathItems(i)"
        v-model="pathLevels[i]"
        :item-text="itemText"
        item-value="id"
        :multiple="true"
        :clearable="true"
        :small-chips="true"
        :deletable-chips="true"
        :return-object="true"
        @input="emit(i)"
      />
    </v-col>
  </v-row>
</template>

<script>
import DistributionApiMixin from "@/modules/distribution/api";
import { PathLevels, getText } from "@/variables";

export default {
  name: "PathSelect",
  mixins: [DistributionApiMixin],
  props: {
    pathIn: {},
  },
  data() {
    return {
      pathLevels: [null, null, null, null, null],
      multiple: true,
    };
  },
  computed: {
    nodes() {
      return this.buildTree(this.paths);
    },
    itemText() {
      if (this.multiple) {
        return "title";
      } else {
        return "name";
      }
    },
  },
  mounted() {
    this.getPaths();
  },
  methods: {
    buildTree(items) {
      let nodes = this.copy(items);

      nodes = nodes.map((o) => {
        return { children: [], title: o.name, ...o };
      });

      for (let node of nodes) {
        let parent = nodes.find((o) => o.id == node.parent);
        if (parent) {
          node.title = `${parent.name} > ${node.name}`;
          parent.children.push(node);
        }
      }

      let roots = nodes.filter((o) => !o.parent);
      return roots;
    },
    getPathTitle(level) {
      this.buildTree(this.paths);
      return getText(PathLevels, level);
    },
    getPathItems(level) {
      if (level == 0) {
        return this.nodes;
      }

      let paths = [];
      if (this.multiple) {
        let parents = this.pathLevels[level - 1];
        if (parents) {
          for (let parent of this.pathLevels[level - 1]) {
            paths.push(...parent.children);
          }
        }
      }

      return paths;

      // let paths = this.paths.filter((o) => o.level == level);
      // if (level != 0) {
      //   let parent = this.path[level - 1];
      //   paths = paths.filter((o) => {
      //     if (this.multiple) {
      //       return parent.includes(o.parent);
      //     } else {
      //       return parent == o.parent;
      //     }
      //   });
      // }
      // return paths;
    },
    clearPathLevels(i) {
      for (let j = i + 1; j < 5; j++) {
        this.pathLevels[j] = null;
      }
    },
    emit(level) {
      this.clearPathLevels(level);

      let selected_paths = [];
      if (level == 4) {
        selected_paths = this.pathLevels[4];
      } else {
        let parents = this.pathLevels[level];
        selected_paths = this.paths
          .filter((o) => o.level == 4)
          .filter((o) => {
            for (let parent of parents) {
              if (o.code.startsWith(parent.code)) {
                return true;
              }
            }
            return false;
          });
      }
      this.$emit(
        "update:pathIn",
        selected_paths.map((o) => o.id).join(',')
      );
    },
  },
};
</script>
