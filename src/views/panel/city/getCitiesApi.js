export default {
  methods: {
    getCities(force = false) {
      if (!force && this.$store.state.cities.length) return;
      if (!this.canGet('cities')) return;

      this.request({
        url: this.endpoint("users/cities"),
        method: "get",
        success: data => {
          this.$store.commit("setCities", data);
          this.toggleIsGetting('cities')
        }
      });
    },
  },
}