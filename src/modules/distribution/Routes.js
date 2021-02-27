const Visitors = () => import( /* wepackChunkName: "distribution" */ "@/modules/distribution/Visitors")
const CommissionRanges = () => import( /* wepackChunkName: "distribution" */ "@/modules/distribution/commissionRanges")
const Paths = () => import( /* wepackChunkName: "distribution" */ "@/modules/distribution/Paths")

export default [{
    name: 'Visitors',
    path: 'visitors/:level',
    component: Visitors,
    props: true,
  }, {
    name: 'CommissionRanges',
    path: 'commissionRanges',
    component: CommissionRanges,
  }, {
    name: 'Paths',
    path: 'paths/:level',
    component: Paths,
    props: true,

  }
]