import Options from './Options';
import Cars from './Cars';
import Drivers from './Drivers';
import Drivings from './Drivings';
import Associations from "./Associations"

import LadingBillSeries from "./LadingBillSeries"
import RevokeLadingBillNumber from "./RevokeLadingBillNumber"
import Remittance from "./Remittance"
import Lading from "./Lading"
import OilCompanyLading from "./OilCompanyLading"

export default [{
    name: 'Options',
    path: 'options',
    component: Options,
  }, {
    name: 'Cars',
    path: 'cars',
    component: Cars,
  },
  {
    name: 'Drivers',
    path: 'drivers',
    component: Drivers,
  },
  {
    name: 'Drivings',
    path: 'drivings',
    component: Drivings,
  },
  {
    name: 'Associations',
    path: 'associations',
    component: Associations,
  },

  {
    name: 'RevokeLadingBillNumber',
    path: 'revokeLadingBillNumber',
    component: RevokeLadingBillNumber,
  }, {
    name: 'LadingBillSeries',
    path: 'ladingBillSeries/:id?',
    component: LadingBillSeries,
    props: true,
  }, {
    name: 'Remittance',
    path: 'remittance/:id?',
    component: Remittance,
    props: true,
  }, {
    name: 'Lading',
    path: 'Lading/:id?',
    component: Lading,
    props: true,
  }, {
    name: 'OilCompanyLading',
    path: 'OilCompanyLading/:id?',
    component: OilCompanyLading,
    props: true,
  },

]