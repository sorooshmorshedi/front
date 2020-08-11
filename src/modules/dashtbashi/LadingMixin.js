export default {
  methods: {
    getCarIncome(item) {
      let value = item.destination_amount * item.fare_price;
      item.car_income = value;
      return value
    },
    getLadingSum(item) {
      let value = +item.driver_tip_price + this.getCarIncome(item);
      item.lading_total_value = value;
      return value;
    },
    getCargoDebt(item) {
      let value = +item.association_price + +item.bill_price + +item.cargo_tip_price;
      item.cargo_debt = value;
      return value;
    },
  }
}