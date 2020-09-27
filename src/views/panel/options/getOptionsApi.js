export default {
  methods: {
    getOptions(force = false) {
      if (!force && this.systemOptions) return;
      return this.request({
        url: this.endpoint("home/options"),
        method: "get",
        success: data => {
          this.$store.commit("setOptions", data);
        }
      });
    }
  },
}