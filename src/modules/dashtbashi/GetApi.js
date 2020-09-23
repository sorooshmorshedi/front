export default {
  data() {
    return {
      months: [{
          text: "فروردین",
          value: 1,
        },
        {
          text: "اردیبهشت",
          value: 2,
        },
        {
          text: "خرداد",
          value: 3,
        },
        {
          text: "تیر",
          value: 4,
        },
        {
          text: "مرداد",
          value: 5,
        },
        {
          text: "شهریور",
          value: 6,
        },
        {
          text: "مهر",
          value: 7,
        },
        {
          text: "آبان",
          value: 8,
        },
        {
          text: "آذر",
          value: 9,
        },
        {
          text: "دی",
          value: 10,
        },
        {
          text: "بهمن",
          value: 11,
        },
        {
          text: "اسفند",
          value: 12,
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
      ]
    }
  },
  methods: {
    getDrivers(force, callback = null) {
      if (!force && this.$store.state.drivers.length) return;
      return this.request({
        url: this.endpoint("dashtbashi/drivers/"),
        method: "get",
        success: data => {
          this.$store.commit("setDrivers", data);
          callback && callback(data);
        }
      });
    },
    getCars(force) {
      if (!force && this.$store.state.cars.length) return;
      return this.request({
        url: this.endpoint('dashtbashi/cars/'),
        method: 'get',
        success: data => {
          this.$store.commit('setCars', data);
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
      this.request({
        url: this.endpoint("dashtbashi/remittances/?limit=10&offset=0"),
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