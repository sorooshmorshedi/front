import WorkshopList from "@/modules/payroll/workshop/WorkshopList";
import PersonnelList from "@/modules/payroll/personnel/PersonnelList";
import WorkshopContractList from "@/modules/payroll/contract/ContractList";
import WorkshopPersonnelList from "@/modules/payroll/workshop_personnel/WorkshopPersonnelList";
import ContractRowList from "@/modules/payroll/contract_row/ContractRowList";
import PersonnelFamilyList from "@/modules/payroll/personnel_family/PersonnelFamilyList";
import AbsenceList from "@/modules/payroll/absence/AbsenceList";
import WorkshopForm from "@/modules/payroll/workshop/WorkshopForm";
import PersonnelForm from "@/modules/payroll/personnel/PersonnelForm";
import ContractRowForm from "@/modules/payroll/contract_row/ContractRowForm";
import PersonnelFamilyForm from "@/modules/payroll/personnel_family/PersonnelFamilyForm";
import WorkshopContractForm from "@/modules/payroll/contract/ContractForm";
import WorkshopPersonnelForm from "@/modules/payroll/workshop_personnel/WorkshopPersonnelForm";
import AbsenceForm from "@/modules/payroll/absence/AbsenceForm";
import HRLetterForm from "@/modules/payroll/hr_letter/HRLetterForm";

const Workshop = () => import( /* wepackChunkName: "workshop" */ "@/modules/payroll/workshop/WorkshopForm.vue")
const Personnel = () => import( /* wepackChunkName: "personnel" */ "@/modules/payroll/personnel/PersonnelForm.vue")
const PersonnelFamily = () => import( /* wepackChunkName: "personnel_family" */ "@/modules/payroll/personnel_family/PersonnelFamilyForm.vue")
const WorkshopPersonnel = () => import( /* wepackChunkName: "workshop_personnel" */ "@/modules/payroll/workshop_personnel/WorkshopPersonnelForm.vue")
const ContractRow = () => import( /* wepackChunkName: "contract_row" */ "@/modules/payroll/contract_row/ContractRowForm.vue")
const WorkshopContract = () => import( /* wepackChunkName: "contract" */ "@/modules/payroll/contract/ContractForm.vue")
const Absence = () => import( /* wepackChunkName: "contract" */ "@/modules/payroll/absence/AbsenceForm.vue")
const HRLetter = () => import( /* wepackChunkName: "hr_letter" */ "@/modules/payroll/hr_letter/HRLetterForm.vue")

export default [
    {
        name: 'Workshop',
        path: 'workshop',
        component: Workshop,
        props: true,
        children : [
            {
                name: 'WorkshopDetail',
                path: ':id',
                component: WorkshopForm,
            },
        ]

    },
    {
        name: 'WorkshopList',
        path: 'workshop/list',
        component: WorkshopList,
    },
    {
        name: 'Personnel',
        path: 'personnel',
        component: Personnel,
        props: true,
        children : [
            {
                name: 'PersonnelDetail',
                path: ':id',
                component: PersonnelForm,
            },
        ]

    },
    {
        name: 'PersonnelList',
        path: 'personnel/list',
        component: PersonnelList,
    },
    {
        name: 'ContractRow',
        path: 'contract_row',
        component: ContractRow,
        props: true,
        children : [
            {
                name: 'ContractRowDetail',
                path: ':id',
                component: ContractRowForm,
            },
        ]
    },
    {
        name: 'ContractRowList',
        path: 'contract_row/list',
        component: ContractRowList,
    },

    {
        name: 'PersonnelFamily',
        path: 'personnel_family',
        component: PersonnelFamily,
        props: true,
        children : [
            {
                name: 'PersonnelFamilyDetail',
                path: ':id',
                component: PersonnelFamilyForm,
            },
        ]
    },
    {
        name: 'PersonnelFamilyList',
        path: 'personnel_family/list',
        component: PersonnelFamilyList,
    },

    {
        name: 'WorkshopContract',
        path: 'workshop_contract',
        component: WorkshopContract,
        props: true,
        children : [
            {
                name: 'WorkshopContractDetail',
                path: ':id',
                component: WorkshopContractForm,
            },
        ]
    },
    {
        name: 'WorkshopContractList',
        path: 'workshop_contract/list',
        component: WorkshopContractList,
    },

    {
        name: 'WorkshopPersonnel',
        path: 'workshop_personnel',
        component: WorkshopPersonnel,
        props: true,
        children : [
            {
                name: 'WorkshopPersonnelDetail',
                path: ':id',
                component: WorkshopPersonnelForm,
            },
        ]
    },
    {
        name: 'WorkshopPersonnelList',
        path: 'workshop_personnel/list',
        component: WorkshopPersonnelList,
    },
    {
        name: 'Absence',
        path: 'absence',
        component: Absence,
        props: true,
        children : [
            {
                name: 'AbsenceDetail',
                path: ':id',
                component: AbsenceForm,
            },
        ]
    },
    {
        name: 'AbsenceList',
        path: 'absence/list',
        component: AbsenceList,
    },

    {
        name: 'HRLetter',
        path: 'hr_letter',
        component: HRLetter,
        props: true,
        children : [
            {
                name: 'HRLetterDetail',
                path: ':id',
                component: HRLetterForm,
            },
        ]

    },


]
