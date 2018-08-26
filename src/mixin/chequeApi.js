import {
  mapState
} from "vuex";
import {
  maxBy
} from 'lodash';

export default {
  methods: {
    getChequebooks(force = false, init = true) {
      if (!force && this.chequebooks.length) return;
      return this.request({
        url: this.endpoint('cheques/chequebooks/'),
        method: 'get',
        success: data => {
          this.$store.commit('setCheques', {
            chequebooks: data
          });
          init && this.init();
        }
      })
    },
    storeChequebook() {
      let data = this.copy(this.chequebook);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      })
      data.code = this.chequebookCode;
      this.request({
        url: this.endpoint('cheques/chequebooks/'),
        method: 'post',
        data: data,
        success: data => {
          this.getChequebooks(true);
          $('#cb-modal').modal('hide');
          this.notify('دسته چک با موفقیت ساخته شد', 'success');
        }
      })
    },
    updateChequebook() {
      let data = this.copy(this.chequebook);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      })
      this.request({
        url: this.endpoint('cheques/chequebooks/' + data.id + '/'),
        method: 'put',
        data: data,
        success: data => {
          this.getChequebooks(true);
          $('#cb-modal').modal('hide');
          this.notify('دسته چک با موفقیت ویرایش شد', 'success');
        }
      })

    },
    deleteChequebook(chequebook) {
      this.request({
        url: this.endpoint('cheques/chequebooks/' + chequebook.id + '/'),
        method: 'delete',
        success: data => {
          this.getChequebooks(true);
          this.notify('دسته چک با موفقیت حذف شد', 'success');
        }
      })
    },
    getCheques(force = false, init = true) {
      if (!force && this.cheques.length) return;
      return this.request({
        url: this.endpoint('cheques/cheques/'),
        method: 'get',
        success: data => {
          this.$store.commit('setCheques', {
            cheques: data
          });
          init && this.init();
        }
      })
    },
    deleteCheque(cheque) {
      this.request({
        url: this.endpoint('cheques/cheques/' + cheque.id + '/'),
        method: 'delete',
        success: data => {
          this.getCheques(true);
          this.notify('چک با موفقیت حذف شد', 'success');
        }
      })
    },
  },
  computed: {
    ...mapState({
      chequebooks: state => state.cheques.chequebooks,
      cheques: state => state.cheques.cheques,
    }),
    chequesSelectValues() {
      this.log('Generate chequesSelectValues');
      let res = {
        chequebooks: [],
        cheques: [],
      };
      if (!this.chequebooks.length) return res;
      res.chequebooks = this.copy(this.chequebooks);
      this.chequebooks.forEach(cb => {
        res.cheques = [
          ...res.cheques,
          ...cb.cheques
        ];
      });
      return res;
    },
    chequebookCode() {
      let last = maxBy(this.chequebooks, o => o.code);
      if (last) {
        let code = +last.code + 1
        return code;
      }
      return 1;
    },
  },
  filters: {
    chequeStatuses(val) {
      switch (val) {
        case "blank":
          return "سفید";
        case "notPassed":
          return "پاس نشده";
        case "inFlow":
          return "در جریان";
        case "passed":
          return "پاس شده";
        case "bounced":
          return "برگشتی";
        case "cashed":
          return "نقدی";
        case "revoked":
          return "باطل شده";
        case "transferred":
          return "انتقالی";
      }
    }
  },
}
