export default {
  methods: {
    getUser() {
      this.request({
        url: this.endpoint("users/currentUser/"),
        method: "get",
        success: data => {
          this.$store.commit("setUser", data);
        }
      });
    },
  },
}