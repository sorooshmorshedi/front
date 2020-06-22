export default {
  methods: {
    getCities() {
      this.request({
        url: this.endpoint("users/cities"),
        method: "get",
        success: data => {
          this.$store.commit("setCities", data);
        }
      });
    },
  },
}