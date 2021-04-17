import {
  mapState
} from "vuex";
export default {
  methods: {
    getFactorTransactionLink(factor) {
      let transactionLabel, transactionType;
      if (["buy", "backFromSale"].includes(factor.type)) {
        transactionType = "payment";
        transactionLabel = "پرداخت";
      } else {
        transactionType = "receive";
        transactionLabel = "دریافت";
      }

      let to = {
        name: 'TransactionForm',
        params: {
          type: transactionType,
        },
        query: {
          'item.account': factor.account && factor.account.id,
          'item.floatAccount': factor.floatAccount && factor.floatAccount.id,
          'item.costCenter': factor.costCenter && factor.costCenter.id,
          'factorIds': String(factor.id)
        }
      }
      return {
        label: transactionLabel,
        to
      };

    },

    getReverseType(type) {
      let factorReverseTypes = {
        sale: "backFromSale",
        buy: "backFromBuy"
      }
      return factorReverseTypes[type]
    },
    getReverseFactorLink(factor) {
      let query = {};
      if (!factor.backFactor) {
        query = {
          backFrom: factor.id
        }
      }
      let to = {
        name: 'FactorForm',
        params: {
          isPreFactor: factor.is_pre_factor,
          type: this.getReverseType(factor.type),
          id: factor.backFactor ? factor.backFactor.id : null
        },
        query: query
      }

      return {
        to
      }
    },
    getFactorPayableValue(factor) {

      let backTotalSum = 0
      if (factor.backFactor) backTotalSum = factor.backFactor.total_sum
      let payableValue = factor.total_sum - backTotalSum - factor.paidValue;
      return payableValue

    }
  },
  computed: {}
}