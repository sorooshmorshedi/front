import Cars from './Cars';
import Drivers from './Drivers';
import Drivings from './Drivings';
import AssociationCommissions from "./AssociationCommissions"

export default [{
    name: 'Cars',
    path: '/cars',
    component: Cars,
  },
  {
    name: 'Drivers',
    path: '/drivers',
    component: Drivers,
  },
  {
    name: 'Drivings',
    path: '/drivings',
    component: Drivings,
  },
  {
    name: 'AssociationCommissions',
    path: '/associationCommissions',
    component: AssociationCommissions,
  }

]