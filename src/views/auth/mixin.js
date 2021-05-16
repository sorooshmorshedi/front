export default {
  data() {
    return {}
  },
  computed: {
    UserInvitationStatuses() {
      return [{
          text: "در انتظار بررسی",
          value: "p",
        },
        {
          text: "پذیرفته شده",
          value: "a",
        },
        {
          text: "رد شده",
          value: "r",
        }
      ]
    },
    passwordRules() {
      return [
        (value) =>
        /(?=.{8,})/.test(value) ||
        "طول کلمه عبور باید بیشتر از 8 کاراکتر باشد",
        (value) => /(?=.*[0-9])/.test(value) || "حداقل از یک عدد استفاده کنید",
        (value) =>
        /(?=.*[!@#$%^&*])/.test(value) ||
        "حداقل از یکی از کاراکتر های ! @ # $ % ^ & * استفاده کنید",
        (value) => /[A-Z]/.test(value) || "حداقل از یک حرف بزرگ استفاده کنید",
      ];
    },
  },
  methods: {
    sendVerificationCode(phone, callback = null) {
      this.request({
        url: this.endpoint("users/sendVerificationCode"),
        method: "post",
        data: {
          phone: phone
        },
        token: false,
        success: data => {
          callback && callback(data)
        }
      });
    },
  }

}