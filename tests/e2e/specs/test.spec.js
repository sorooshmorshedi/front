
describe('sobhan test', () => {
    it('login & register page visit', () => {
        cy.visit('/');
        cy.server({force404: true});
        cy.contains('حسابداری آنلاین سبحان');
        cy.contains('ثبت نام').click()
        cy.url().should('include', '/register')
        cy.contains('ثبت نام در سامانه حسابداری سبحان');


    })


    it('Login test', () => {
        cy.visit('/');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.url().should('include', '/panel/home')
        cy.contains('هزینه');
        cy.contains('درآمد');
        cy.server({force404: true});
    })


    it('tender test', () => {
        cy.visit('/panel/tender');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');

        cy.visit('/panel/tender');
        cy.url().should('include', '/panel/tender')
        cy.contains('مناقصه');
        cy.server({force404: true});
        cy.get('input[id="input-270"]').type(2345)
        cy.get('input[id="input-271"]').type('test cypress')
        cy.get('input[id="input-281"]').click()
        cy.find('#list-item-330-0 > div:nth-child(1) > div:nth-child(1)').click()

    })

    it('contract test', () => {
        cy.visit('/panel/contract');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');

        cy.visit('/panel/contract');
        cy.url().should('include', '/panel/contract')
        cy.contains('قرارداد');
        cy.server({force404: true});
    })
    it('statement test', () => {
        cy.visit('/panel/statement');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');

        cy.visit('/panel/statement');
        cy.url().should('include', '/panel/statement')
        cy.contains('صورت وضعیت');
        cy.server({force404: true});
    })

    it('supplement test', () => {
        cy.visit('/panel/supplement');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');

        cy.visit('/panel/supplement');
        cy.url().should('include', '/panel/supplement')
        cy.contains('الحاقیه');
        cy.server({force404: true});
    })


    it('sanad form test', () => {
        cy.visit('/panel/sanad/form');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');

        cy.visit('/panel/sanad/form');
        cy.url().should('include', '/panel/sanad/form')
        cy.contains('سند حسابداری');
        cy.server({force404: true});
    })


    it('transaction receive test', () => {
        cy.visit('/panel/transaction/receive');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');

        cy.visit('/panel/transaction/receive');
        cy.url().should('include', '/panel/transaction/receive')
        cy.contains('دریافت');
        cy.server({force404: true});
    })


    it('transaction payment test', () => {
        cy.visit('/panel/transaction/payment');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');

        cy.visit('/panel/transaction/payment');
        cy.url().should('include', '/panel/transaction/payment')
        cy.contains('پرداخت');
        cy.server({force404: true});
    })


    it('factor sale test', () => {
        cy.visit('/panel/factor/form/false/sale');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');

        cy.visit('/panel/factor/form/false/sale');
        cy.url().should('include', '/panel/factor/form/false/sale')
        cy.contains('فاکتور فروش');
        cy.server({force404: true});
    })


    it('factor buy test', () => {
        cy.visit('/panel/factor/form/false/buy');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');

        cy.visit('/panel/factor/form/false/buy');
        cy.url().should('include', '/panel/factor/form/false/buy')
        cy.contains('فاکتور خرید');
        cy.server({force404: true});
    })


    it('report ledger test', () => {
        cy.visit('/report/ledger/level3');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');

        cy.visit('/report/ledger/level3');
        cy.url().should('include', '/report/ledger/level3')
        cy.contains('دفتر کل، معین، تفضیلی');
        cy.server({force404: true});
    })


    it('report balance accounts test', () => {
        cy.visit('/report/balance/accounts');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');

        cy.visit('/report/balance/accounts');
        cy.url().should('include', '/report/balance/accounts')
        cy.contains('تراز حساب ها');
        cy.server({force404: true});
    })


    it(' account level3 test', () => {
        cy.visit('/panel/accounts/3');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');

        cy.visit('/panel/accounts/3');
        cy.url().should('include', '/panel/accounts/3')
        cy.contains('تفصیلی');
        cy.server({force404: true});
    })


    it(' account  test', () => {
        cy.visit('/panel/accounts/3/p?showForm=true');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');

        cy.visit('/panel/accounts/3/p?showForm=true');
        cy.url().should('include', '/panel/accounts/3/p?showForm=true')
        cy.contains('حساب اشخاص');
        cy.server({force404: true});
    })


    it(' account tree test', () => {
        cy.visit('/panel/accounts/tree');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');

        cy.visit('/panel/accounts/tree');
        cy.url().should('include', '/panel/accounts/tree')
        cy.contains('نمودار درختی حساب ها');
        cy.server({force404: true});
    })


    it(' inventory ware tree test', () => {
        cy.visit('/report/inventory/ware/detailed');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');

        cy.visit('/report/inventory/ware/detailed');
        cy.url().should('include', '/report/inventory/ware/detailed')
        cy.contains('کاردکس کالا');
        cy.server({force404: true});
    })


})
;