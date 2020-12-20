export default {
  methods: {
    getUser() {
      this.request({
        url: this.endpoint("users/currentUser/"),
        method: "get",
        success: data => {
          this.$store.commit("setUser", data);

          if (!this.company) {
            if (this.hasPerm("", "company") && this.$route && !['Companies'].includes(this.$route.name)) {
              this.$router.push({
                name: 'Companies'
              });
            }
          } else if (this.hasPerm("", "financialYear") && !this.financialYear && this.$route && !['FinancialYears'].includes(this.$route.name)) {
            this.$router.push({
              name: 'FinancialYears'
            });
          }
        }
      });
    },
  },
}