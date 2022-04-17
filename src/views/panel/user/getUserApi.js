export default {
  data() {
    return {
      userPopUps: []
    }
  },
  methods: {
    getUser(callback = null) {
      this.request({
        url: this.endpoint("users/currentUser/"),
        method: "get",
        success: data => {
          this.$store.commit("setUser", data);

          this.userPopUps = this.user.pop_up_notifications;

          if (!this.company) {
            if (this.$route && !['Companies', 'Profile'].includes(this.$route.name)) {
              this.$router.push({
                name: 'Companies'
              });
            }
          } else if (!this.financialYear && this.$route && !['FinancialYears'].includes(this.$route.name)) {
            this.$router.push({
              name: 'FinancialYears'
            });
          }

          callback && callback();
        }
      });
    },
  },
}