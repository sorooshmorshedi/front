export default {
  methods: {
    getCarIncome(item) {
      return item.destination_amount * item.fare_price;
    },
    getLadingSum(item) {
      return +item.driver_tip_price + this.getCarIncome(item);
    },
    getCargoDebt(item) {
      return +item.association_price + +item.bill_price + +item.cargo_tip_price;
    },
  }
}