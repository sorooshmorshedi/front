<template>
<div class="">
  <div class="form-group">
    <label>تصویر سند</label>
    <button @click="openUpload()" class="btn btn-sm btn-info" type="button" name="button" style="margin-right:20px;">آپلود فایل</button>
    <input @change="upload($event)" type="file" class="form-control" id="upload-input" placeholder="" style="display:none;" accept="application/pdf,image/*">
  </div>
  <div class="row docs">
    <div class="col-sm-3 pull-left doc-box" v-for="doc in documents">
      <div class="doc">
        <i @click="removeFile(doc)" class="remove-icon fa fa-remove"></i>
        <div class="name" dir="ltr">
          {{ doc.name }}
        </div>
        <i class="file-icon fa fa-file"></i>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'UploadFile',
  props: ['pdocuments'],
  data() {
    return {
      documents: [],
      removedpDocs: [],
    }
  },
  created() {
    this.pdocuments.forEach((doc) => {
      this.documents.push({
        name: doc.org_name,
        file: doc
      });
    })
  },
  watch: {
    documents: function() {
      this.$emit('change', this.documents, this.removedpDocs);
    },
  },
  methods: {
    upload(e) {
      let file = e.target.files[0];
      let type = file.type;
      this.documents.push({
        name: file.name,
        file: file,
      });
      e.target.value = null;
    },
    removeFile(file) {
      if (file.file.id) {
        this.removedpDocs.push(file.file.id);
        this.$emit('change', this.documents, this.removedpDocs);
      }
      this.documents.splice(this.documents.indexOf(file), 1);
    },
    openUpload() {
      $('#upload-input').click();
    },

  }
}
$(window).ready(function() {});
</script>

<style lang="scss" scoped>
@import './../../assets/styles/main';
.docs {
    .doc-box {
        padding: 10px;
        .doc {
            padding: 15px;
            padding-top: 20px;
            box-shadow: 0 2px 12px -5px black;
            // background-color: #fafafa;
            background-color: $primaryLighten1;
            border-radius: 5px;
            .file-icon {
                position: absolute;
                top: 25px;
                left: 20px;
                font-size: 1.8em;
                color: white;
            }
            .remove-icon {
                position: absolute;
                background-color: white;

                border-radius: 100%;
                top: 0px;
                right: 0px;
                padding: 10px 10px 5px 7px;
                font-size: 1.5em;
                cursor: pointer;
                color: $red;
            }
            .name {
                margin-right: 20px;
                margin-left: 25px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

                color: white;
            }

        }
    }
}
// desktop
@media only screen and (min-width: 765px) {}

// mobile
@media only screen and (max-width: 765px) {}
</style>
