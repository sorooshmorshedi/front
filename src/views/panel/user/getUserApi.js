export default {
  methods: {
    getUser() {
      this.request({
        url: this.endpoint("users/currentUser/"),
        method: "get",
        success: data => {
          this.$store.commit("setUser", data);

          if (!this.company && this.$route && !['Companies'].includes(this.$route.name)) {
            this.$router.push({
              name: 'Companies'
            });
          }
        }
      });
    },
  },
}