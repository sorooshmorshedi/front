import OpenSanadBtn from "@/components/form/OpenSanadBtn";

export default {
  components: {
    OpenSanadBtn
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