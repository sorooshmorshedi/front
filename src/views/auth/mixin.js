import VueRecaptcha from "vue-recaptcha";
export default {
  components: {
    VueRecaptcha
  },
  data() {
    return {
      recaptchaResponse: "",
    }
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
    sendVerificationCode(data, callback = null) {
      this.request({
        url: this.endpoint("users/sendVerificationCode"),
        method: "post",
        data: data,
        token: false,
        success: data => {
          this.$refs.recaptcha.reset();
          callback && callback(data)
        },
        error: (error) => {
          this.$refs.recaptcha.reset();
          this.handleError(error, {});
        }
      });
    },
  }

}