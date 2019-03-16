import FormFooter from "@/components/panel/FormFooter";
import FormHeader from "@/components/panel/FormHeader";
export default {
  components: {
    FormFooter,
    FormHeader
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
