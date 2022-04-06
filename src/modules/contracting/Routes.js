const Tender = () => import( /* wepackChunkName: "contracting" */ "@/modules/contracting/Tender/TenderForm.vue")
const Contract = () => import( /* wepackChunkName: "contracting" */ "@/modules/contracting/Contract/ContractForm.vue")
const Statement = () => import( /* wepackChunkName: "contracting" */ "@/modules/contracting/Statement/StatementForm.vue")
const Supplement = () => import( /* wepackChunkName: "contracting" */ "@/modules/contracting/Supplement/SupplementForm.vue")

export default [
    {
    name: 'Tender',
    path: 'tender',
    component: Tender,
    props: true,
  },
  {
    name: 'Contract',
    path: 'contract',
    component: Contract,
    props: true,
  },
  {
    name: 'Statement',
    path: 'statement',
    component: Statement,
    props: true,
  }, {
    name: 'Supplement',
    path: 'supplement',
    component: Supplement,
  },
]