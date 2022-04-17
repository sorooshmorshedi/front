import _ from 'lodash'
export default {
  data() {
    return {
      owners: [
        {
          text: "حاج رحمان",
          value: "rn",
        },
        {
          text: "حاج رحیم",
          value: "rm",
        },
        {
          text: "حاج ابراهیم",
          value: "e",
        },
        {
          text: "شراکتی",
          value: "p",
        },
        {
          text: "دیگر",
          value: "o",
        },
      ],

      months: [{
          text: "فروردین",
          value: "1",
        },
        {
          text: "اردیبهشت",
          value: "2",
        },
        {
          text: "خرداد",
          value: "3",
        },
        {
          text: "تیر",
          value: "4",
        },
        {
          text: "مرداد",
          value: "5",
        },
        {
          text: "شهریور",
          value: "6",
        },
        {
          text: "مهر",
          value: "7",
        },
        {
          text: "آبان",
          value: "8",
        },
        {
          text: "آذر",
          value: "9",
        },
        {
          text: "دی",
          value: "10",
        },
        {
          text: "بهمن",
          value: "11",
        },
        {
          text: "اسفند",
          value: "12",
        },
      ],

      tipPayers: [{
          title: "شرکت",
          id: "cmp"
        },
        {
          title: "پیمانکار",
          id: "cnt"
        }
      ],
      ladingBillDifferenceReceivers: [{
          title: "راننده",
          id: "drvr"
        },
        {
          title: "شرکت",
          id: "cmp"
        }
      ],
      remittancePaymentMethods: [{
          text: "کمیسیون و کرایه به شرکت",
          value: "tc"
        },
        {
          text: "کمیسیون به شرکت و کرایه به راننده",
          value: "tcd"
        },
        {
          text: "کمیسیون و کرایه با شرکت",
          value: "cp"
        }
      ],
      receiveTypes: [{
          text: "نسیه",
          value: "cr"
        },
        {
          text: "نقدی",
          value: "cs"
        },
        {
          text: "کارت خوان",
          value: "p"
        },
      ],
      d: {}
    }
  },
  created() {
    this.d.getRemittances = _.debounce(this.getRemittances, 300);
  },
  methods: {
    getDrivers(force, callback = null) {
      if (!force && this.$store.state.dashtbashiDrivers.length) return;
      return this.request({
        url: this.endpoint("dashtbashi/drivers/"),
        method: "get",
        success: data => {
          this.$store.commit("setDashtbashiDrivers", data);
          callback && callback(data);
        }
      });
    },
    getCars(force) {
      if (!force && this.$store.state.dashtbashiCars.length) return;
      return this.request({
        url: this.endpoint('dashtbashi/cars/'),
        method: 'get',
        success: data => {
          this.$store.commit('setDashtbashiCars', data);
        }
      })
    },
    getDrivings(force, callback = null) {
      if (!force && this.$store.state.drivings.length) {
        callback && callback(this.$store.state.drivings);
        return;
      };
      return this.request({
        url: this.endpoint("dashtbashi/drivings/"),
        method: "get",
        success: data => {
          this.$store.commit("setDrivings", data);
          callback && callback(data);
        }
      });
    },
    getAssociations(force) {
      if (!force && this.$store.state.associations.length) return;
      return this.request({
        url: this.endpoint("dashtbashi/associations/"),
        method: "get",
        success: data => {
          this.$store.commit("setAssociations", data);
        }
      });
    },
    getRemittances(code) {
      if (code) code = String(code).match(/\d+/)[0];
      this.request({
        url: this.endpoint("dashtbashi/remittances/?limit=50&offset=0"),
        method: "get",
        params: {
          code__icontains: code
        },
        success: data => {
          this.remittances = data["results"].map(o => {
            o.code = String(o.code)
            return o;
          });
        }
      });
    }
  },
}