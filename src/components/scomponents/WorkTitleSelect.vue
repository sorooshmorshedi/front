<template>
  <v-autocomplete
      v-model="model"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      :return-object="false"
      :disabled="disabled"
      @change="change_func"
      item-text="display"
      item-value="id"
      label="عنوان شغلی (بیمه)"
      placeholder="ورود حداقل سه حرف از عنوان یا کد شغل برای پیدا کردن عناوین "
      append-icon="fa-search"
  ></v-autocomplete>
</template>
<script>
export default {
  name: "CleaveWorkTitle",
  props: {
    disabled: {
      default: false,
    },
    first_item: null,
    change_func: null
  },

  data: () => ({
    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    model: null,
    search: null,
  }),

  mounted() {
    if (this.first_item){
      this.request({
        url: this.endpoint("payroll/workTitle/" + this.first_item + '/'),
        method: "get",
        success: data => {
          this.search = data['code']
        }
      });
      this.model = this.first_item
    }
  },
  computed: {
    fields() {
      if (!this.model) return []

      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || 'n/a',
        }
      })
    },
    items() {
      return this.entries.map(entry => {
        const Description = entry.length > this.descriptionLimit
            ? entry.slice(0, this.descriptionLimit) + '...'
            : entry.Description

        return Object.assign({}, entry, {Description})
      })
    },
  },

  watch: {
    search(val) {
      if (val.length > 2) {
        // Items have already been loaded
        if (this.items.length > 0) return

        // Items have already been requested
        if (this.isLoading) return

        this.isLoading = true

        // Lazily load input items
        this.request({
          url: this.endpoint("payroll/workTitleSearch/" + val + '/'),
          method: "get",
          success: data => {
            this.count = data.length
            this.entries = data
            for (let entry of this.entries) {
              entry['display'] = entry['name'] + ' ' + entry['code']
            }
            this.isLoading = false
          }
        });
      } else if (val.length < 3) {
        this.entries  = []
      }

    },
    model() {
      this.$emit("input", this.model);
    }

  }
}
</script>
