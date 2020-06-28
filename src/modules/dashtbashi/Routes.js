import Cars from './Cars';
import Drivers from './Drivers';
import Drivings from './Drivings';
import AssociationCommissions from "./AssociationCommissions"

import Remittance from "./Remittance"
import Lading from "./Lading"

export default [{
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
    name: 'AssociationCommissions',
    path: 'associationCommissions',
    component: AssociationCommissions,
  },

  {
    name: 'Remittance',
    path: 'remittance/:id?',
    component: Remittance,
    props: true,
  },{
    name: 'Lading',
    path: 'Lading/:id?',
    component: Lading,
    props: true,
  },

]