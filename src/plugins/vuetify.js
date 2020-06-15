import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import fa from 'vuetify/es5/locale/fa';


Vue.use(Vuetify);

import {
  VTextField,
  VAutocomplete,
  VBtn,
  VCard,
  VSelect,
  VTextarea
} from 'vuetify/lib'

VTextField.options.props.outlined.default = true
VTextField.options.props.hideDetails.default = true
VTextField.options.props.dense.default = true
VTextField.options.props.backgroundColor.default = 'white'

VAutocomplete.options.props.itemValue.default = 'id'
VAutocomplete.options.props.itemText.default = 'title'
VAutocomplete.options.props.returnObject.default = true

VBtn.options.props.small.default = true

VCard.options.props.outlined.default = true

VSelect.options.props.outlined.default = true

VTextarea.options.props.rows.default = 1
VTextarea.options.props.autoGrow.default = true



export default new Vuetify({
  rtl: true,
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#ee44aa',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
    },
  },
  lang: {
    locales: {
      fa
    },
    current: 'fa',
  },
  icons: {
    iconfont: 'md',
  },
});