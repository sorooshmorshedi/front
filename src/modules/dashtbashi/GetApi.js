export default {
  data() {
    return {
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
          title: "کمیسیون و کرایه به شرکت",
          id: "tc"
        },
        {
          title: "کمیسیون به شرکت و کرایه به راننده",
          id: "tcd"
        },
        {
          title: "کمیسیون و کرایه با شرکت",
          id: "cp"
        }
      ],
      receiveTypes: [{
          title: "نسیه",
          id: "cr"
        },
        {
          title: "نقدی",
          id: "cs"
        },
        {
          title: "کارت خوان",
          id: "p"
        },
      ]
    }
  },
  methods: {
    getDrivers(force) {
      if (!force && this.$store.state.drivers.length) return;
      return this.request({
        url: this.endpoint("dashtbashi/drivers/"),
        method: "get",
        success: data => {
          this.$store.commit("setDrivers", data);
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
    getDrivings(force) {
      if (!force && this.$store.state.drivings.length) return;
      return this.request({
        url: this.endpoint("dashtbashi/drivings/"),
        method: "get",
        success: data => {
          this.$store.commit("setDrivings", data);
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
          this.remittances = data["results"];
        }
      });
    }
  },
}