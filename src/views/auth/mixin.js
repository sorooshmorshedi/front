export default {
  methods: {
    sendVerificationCode(phone, success = null) {
      this.request({
        url: this.endpoint("users/sendVerificationCodeForForgetPassword"),
        method: "post",
        data: {
          phone: phone
        },
        token: false,
        success: data => {
          success && success(data)
        }
      });
    },
  }

}