import chequeApiMixin from "@/mixin/chequeApi";
import accountApiMixin from "@/mixin/accountApi";
import submitCheque from "@/components/panel/cheque/SubmitCheque";
import changeChequeStatus from "@/components/panel/cheque/ChangeChequeStatus";
import chequeStatusChanges from "@/components/panel/cheque/ChequeStatusChanges";
export default {
  mixins: [accountApiMixin, chequeApiMixin],
  components: {
    submitCheque,
    changeChequeStatus,
    chequeStatusChanges,
  },
  methods: {
    submitChequeModal(received_or_paid, cheque, chequebook) {
      this.clearCheques();
      cheque && (this.cheque = this.copy(cheque));
      chequebook && (this.chequebook = this.copy(chequebook));
      this.cheque.received_or_paid = (received_or_paid == 'received') ? 'r' : 'p';
      console.log(received_or_paid,this.cheque);
      $("#submit-paid-cheque-modal").modal("show");
    },
    changeChequeStatusModal(cheque, chequebook) {
      this.cheque = this.copy(cheque);
      this.chequebook = this.copy(chequebook);
      $("#change-cheque-status-modal").modal("show");
    },
    ChequeStatusChangesModal(cheque, chequebook) {
      this.cheque = this.copy(cheque);
      this.chequebook = this.copy(chequebook);
      $("#cheque-status-changes-modal").modal("show");
    },
    clearCheques() {
      this.cheque = {};
      this.chequebook = {};
      this.statusChange = {};
    },
    canChangeStatus(cheque) {
      let s = cheque.status;
      if (['passed', 'cashed', 'revoked', 'transferred'].includes(s)) return false;
      return true;
    }
  },
  computed: {},
}
