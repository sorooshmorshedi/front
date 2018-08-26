import {
  mapState
} from "vuex";
import {
  maxBy
} from 'lodash';

export default {
  methods: {
    storeReceipt() {
      let data = this.copy(this.receipt);
      data = this.extractIds(data);
      data.code = this.rarCode;
      data.type = this.type.name;
      this.request({
        url: this.endpoint('factors/receipts/'),
        method: 'post',
        data: data,
        success: data => {
          this.syncReceipt(data.id);
        }
      })
    },
    updateReceipt() {
      let data = this.copy(this.receipt);
      data = this.extractIds(data);
      this.request({
        url: this.endpoint('factors/receipts/' + data.id + '/'),
        method: 'put',
        data: data,
        success: data => {
          this.syncReceipt(data.id);
        }
      })

    },
    syncReceipt(receiptId) {
      let updatedItems = [];
      let newItems = [];
      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;
        let item = this.copy(row);
        item.warehouse = item.ware.warehouse;
        item = this.extractIds(item);
        if (item.id) {
          updatedItems.push(item);
        } else {
          item.receipt = receiptId;
          newItems.push(item);
        }
      });
      Promise.all([
        this.storeReceiptItems(newItems),
        this.updateReceiptItems(updatedItems),
        this.deleteReceiptItems(),
      ]).then(data => {
        this.getReceipts(true);
        this.successNotify();
        this.clearReceipt();
      });
    },
    storeReceiptItems(items) {
      if (!items.length) return;
      return this.request({
        url: this.endpoint("factors/receiptItems/mass"),
        method: "post",
        data: items,
        success: data => {
          this.log(items.length + " receipt items created");
        }
      });
    },
    updateReceiptItems(items) {
      if (!items.length) return;
      return this.request({
        url: this.endpoint("factors/receiptItems/mass"),
        method: "put",
        data: items,
        success: data => {
          this.log(items.length + " receipt items updated");
        }
      });
    },
    deleteReceiptItems() {
      if (!this.itemsToDelete.length) return;
      return this.request({
        url: this.endpoint("factors/receiptItems/mass"),
        method: "delete",
        data: this.itemsToDelete,
        success: data => {
          this.log(this.itemsToDelete.length + " receipt items deleted");
          this.itemsToDelete = [];
        }
      });
    },
    deleteReceipt(receipt) {
      this.request({
        url: this.endpoint('factors/receipts/' + receipt.id + '/'),
        method: 'delete',
        success: data => {
          this.getReceipts(true);
          this.successNotify();
          this.clearReceipt();
        }
      })
    },
    getReceipts(force = false, init = true) {
      if (!force && this.receipts.length) return;
      return this.request({
        url: this.endpoint('factors/receipts/'),
        method: 'get',
        success: data => {
          this.$store.commit('setFactors', {
            receipts: data
          });
          init && this.init();
        }
      })
    },
    clearReceipt() {
      this.receipt = {}
      this.rows = [{}];
    }
  },
  computed: {
    ...mapState({
      receipts: state => state.factors.receipts.filter(o => o.type == 'receipt'),
      remittances: state => state.factors.receipts.filter(o => o.type == 'remittance'),
    }),
    receiptsSelectValues() {
      if (!this.receipts) return [];
      let res = {
        receipts: [],
        remittance: [],
      };
      res.receipts = this.copy(this.receipts);
      res.remittance = this.copy(this.remittances);
      return res;
    },
    rarCode() {
      console.log('reCode');
      let localReceipts = [];
      if (this.type.name) {
        localReceipts = this.receipts.filter(o => o.type == this.type.name);
      } else {
        localReceipts = this.receipts;
      }
      let last = maxBy(localReceipts, o => o.code);
      if (last) {
        let code = +last.code + 1
        return code;
      }
      return 1;
    },
  },
}
