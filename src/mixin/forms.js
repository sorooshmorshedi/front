import FormFooter from "@/components/form/FormFooter";
import FormHeader from "@/components/form/FormHeader";
import DailyForm from "@/components/form/DailyForm";

export default {
  components: {
    FormFooter,
    FormHeader,
    DailyForm
  },
  data() {
    return {
      editable: false,
    }
  },
  created() {
    this.setEditable();
  },
  watch: {
    id() {
      this.setEditable();
    }
  },
  methods: {
    setEditable() {
      if (this.id) this.editable = false;
      else this.editable = true;
    },
    makeFormEditable() {
      this.editable = true;
    },
    makeFormUneditable() {
      this.editable = false;
    }
  }
}
