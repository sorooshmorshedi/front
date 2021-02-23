const Visitors = () => import( /* wepackChunkName: "distribution" */ "@/modules/distribution/Visitors")
const CommissionRanges = () => import( /* wepackChunkName: "distribution" */ "@/modules/distribution/commissionRanges")

export default [{
  name: 'Visitors',
  path: 'visitors/:level',
  component: Visitors,
  props: true,
}, {
  name: 'CommissionRanges',
  path: 'commissionRanges',
  component: CommissionRanges,
}]