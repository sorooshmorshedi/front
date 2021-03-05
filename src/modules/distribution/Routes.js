const Visitors = () => import( /* wepackChunkName: "distribution" */ "@/modules/distribution/Visitors")
// const CommissionRanges = () => import( /* wepackChunkName: "distribution" */ "@/modules/distribution/CommissionRanges")
const Paths = () => import( /* wepackChunkName: "distribution" */ "@/modules/distribution/Paths")
const Drivers = () => import( /* wepackChunkName: "distribution" */ "@/modules/distribution/Drivers")
const Distributors = () => import( /* wepackChunkName: "distribution" */ "@/modules/distribution/Distributors")
const Cars = () => import( /* wepackChunkName: "distribution" */ "@/modules/distribution/Cars")
const DistributionForm = () => import( /* wepackChunkName: "distribution" */ "@/modules/distribution/DistributionForm")

export default [{
  name: 'Visitors',
  path: 'visitors/:level',
  component: Visitors,
  props: true,
},
//  {
  // name: 'CommissionRanges',
  // path: 'commissionRanges',
  // component: CommissionRanges,
// }, 
{
  name: 'Paths',
  path: 'paths/:level',
  component: Paths,
  props: true,
}, {
  name: 'Drivers',
  path: 'drivers',
  component: Drivers,
}, {
  name: 'Distributors',
  path: 'distributors',
  component: Distributors
}, {
  name: 'Cars',
  path: 'cars',
  component: Cars,
}, {
  name: 'DistributionForm',
  path: 'distribution/:id?',
  component: DistributionForm,
  props: true
}, ]