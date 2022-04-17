<template>
  <div v-show="show" class="context-menu" :style="contextMenuStyle" ref="menu">
    <slot>No Content!</slot>
  </div>
</template>

<script>
export default {
  name: "ContextMenu",
  data() {
    return {
      top: null,
      left: null,
      show: false
    };
  },
  computed: {
    contextMenuStyle() {
      return {
        top: this.top + "px",
        left: this.left + "px"
      };
    }
  },
  mounted() {
    window.addEventListener("scroll", this.close);
    window.addEventListener("click", this.close);
  },
  methods: {
    open(event) {
      this.show = true;
      this.$nextTick(() => {
        this.top = event.clientY;
        this.left = event.clientX - this.$refs.menu.offsetWidth;
      });
    },
    close() {
      this.show = false;
    }
  }
};
</script>

<style>
.context-menu {
  position: fixed;
  background-color: #fafafa;
  z-index: 1000;
}
</style>