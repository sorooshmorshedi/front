import {
  mapState
} from "vuex";
export default {
  methods: {
    getFinancialYears(callback) {
      this.request({
        url: this.endpoint("companies/financialYears/"),
        method: "get",
        success: (data) => {
          callback(data)
        },
      });
    },
    getCompanyUserInvitations(callback) {
      this.request({
        url: this.endpoint("companies/companyUserInvitations/"),
        method: "get",
        success: (data) => {
          callback(data)
        },
      });
    }
  }
}