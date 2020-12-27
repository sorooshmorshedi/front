<template>
  <v-simple-table>
    <thead>
      <slot name="thead" />
    </thead>
    <draggable
      :value="value"
      @input="emit"
      @start="drag=true"
      @end="drag=false"
      tag="tbody"
      :draggable="!isXs?'.draggable':''"
    >
      <slot name="tbody" />
    </draggable>
  </v-simple-table>
</template>

<script>
import Draggable from "vuedraggable";

export default {
  components: { Draggable },
  props: {
    value: {
      required: true,
    },
  },
  methods: {
    emit(value) {
      this.$emit("input", value);
    },
    getDraggableData() {
      return {
        on: { sort: this.emit },
      };
    },
  },
};
</script>

<style>
</style>