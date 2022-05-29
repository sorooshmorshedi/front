describe('sobhan test', () => {

    it('tender test', () => {
        cy.visit('http://localhost:8080/panel/tender');
        cy.intercept('POST', '/login').as('login')
        cy.intercept('POST', '/contracting/tender').as('tenderCreate')

        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)

        cy.contains('هزینه');
        cy.visit('http://localhost:8080/panel/tender');
        cy.contains('مناقصه')
        cy.get('#input-150').type(2345)
        cy.get('#input-151').type('test cypress')
        cy.get('#input-161').click()
        cy.get('#list-item-233-0 > div > div').click()
        cy.get('#input-164').type('cypress bidder')
        cy.get('#app > div.v-application--wrap > main > div > div > span > div > div > div > div > div.v-card__actions > div > div.d-flex.justify-center.justify-md-end.col-md-6.col-12 > div > button.w-100px.ml-1.green.white--text.mt-1.mt-md-0.v-btn.v-btn--is-elevated.v-btn--has-bg.theme--light.v-size--small > span').click()
        cy.visit('http://localhost:8080/panel/tender/list');
        cy.wait('@login').its('response.statusCode').should('eq', 200)
        cy.wait('@tenderCreate').its('response.statusCode').should('eq', 201)



    })


    it('contract test', () => {
        cy.intercept('POST', '/login').as('login')
        cy.intercept('POST', '/contracting/contract').as('contractCreate')

        cy.visit('http://localhost:8080/panel/contract');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');
        cy.visit('http://localhost:8080/panel/contract');
        cy.contains('قرارداد')

        cy.get('#input-150').click()
        cy.get('#list-item-233-0 > div > div').click()

        cy.get('#input-153').type('test cypress')
        cy.get('#input-154').type(123123)
        cy.get('#input-156').type(100)
        cy.get('#app > div.v-application--wrap > main > div > div > span > div > div > div > div > div.v-card__actions > div > div.d-flex.justify-center.justify-md-end.col-md-6.col-12 > div > button.w-100px.ml-1.green.white--text.mt-1.mt-md-0.v-btn.v-btn--is-elevated.v-btn--has-bg.theme--light.v-size--small > span').click()
        cy.visit('http://localhost:8080/panel/contract/list');

        cy.wait('@login').its('response.statusCode').should('eq', 200)
        cy.wait('@contractCreate').its('response.statusCode').should('eq', 201)


    })


    it('statement test', () => {
        cy.intercept('POST', '/login').as('login')
        cy.intercept('POST', '/contracting/statement').as('statementCreate')

        cy.visit('http://localhost:8080/panel/statement');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');
        cy.visit('http://localhost:8080/panel/statement');
        cy.contains('صورت وضعیت')
        cy.get('input[id="input-153"]').click()
        cy.contains('معمولی').click()
        cy.get('input[id="input-157"]').type('100')
        cy.get('input[id="input-160"]').type('123123')
        cy.get('#app > div.v-application--wrap > main > div > div > span > div > div > div > div > div.v-card__actions > div > div.d-flex.justify-center.justify-md-end.col-md-6.col-12 > div > button.w-100px.ml-1.green.white--text.mt-1.mt-md-0.v-btn.v-btn--is-elevated.v-btn--has-bg.theme--light.v-size--small').click()
        cy.visit('http://localhost:8080/panel/statement')
        cy.wait('@login').its('response.statusCode').should('eq', 200)
        cy.wait('@statementCreate').its('response.statusCode').should('eq', 201)
        cy.get('@statementCreate').should(({ request, response }) => {
            expect(response.body, 'response body').to.include({
                'present_statement_value': '100.000000',
                'previous_statement_value': '0.000000',
                'code': 1,
            })
        })



    })
    it('seccond statement test', () => {
        cy.intercept('POST', '/login').as('login')
        cy.intercept('POST', '/contracting/statement').as('statementCreate')

        cy.visit('http://localhost:8080/panel/statement');
        cy.get('input[id="input-24"]').type('soroosh')
        cy.get('input[id="input-25"]').type(`${'slowj504'}{enter}`)
        cy.contains('هزینه');
        cy.visit('http://localhost:8080/panel/statement');
        cy.contains('صورت وضعیت')
        cy.get('input[id="input-153"]').click()
        cy.contains('معمولی').click()
        cy.get('input[id="input-157"]').type('100')
        cy.get('input[id="input-160"]').type('123123')
        cy.get('#app > div.v-application--wrap > main > div > div > span > div > div > div > div > div.v-card__actions > div > div.d-flex.justify-center.justify-md-end.col-md-6.col-12 > div > button.w-100px.ml-1.green.white--text.mt-1.mt-md-0.v-btn.v-btn--is-elevated.v-btn--has-bg.theme--light.v-size--small').click()
        cy.visit('http://localhost:8080/panel/statement')
        cy.wait('@login').its('response.statusCode').should('eq', 200)
        cy.wait('@statementCreate').its('response.statusCode').should('eq', 201)
        cy.get('@statementCreate').should(({ request, response }) => {
            expect(response.body, 'response body').to.include({
                'present_statement_value': '200.000000',
                'previous_statement_value': '100.000000',
                'code': 2,
            })
        })

    })


});
