/// <reference types="cypress" />

Cypress.Commands.add('getDataTest', (dataTestSelector) => {
    return cy.get(`[data-test="${dataTestSelector}"]`)
})


//login Admin user
Cypress.Commands.add('loginAsAdmin', (email = 'deity047@gmail.com', password = '12345678') => {
    cy.visit('/login')
    cy.getDataTest('login-email-input').type(email)
    cy.getDataTest('login-password-input').type(password)
    cy.getDataTest('login-submit-button').click()
    cy.url().should('include', '/admin/dashboard/todos').as('adminDashboardUrl').as('adminDashboardUrl')
    // Welcome to your Admin dashboard - contains
    cy.get('body').should('contain.text', 'Welcome to your Admin dashboard') //body is the root element of the page

})



/* eslint-disable @typescript-eslint/no-namespace */
export { } // means this file is a module, so we can augment the Cypress namespace
declare global { // adding new types to the global scope.
    namespace Cypress { //adding to the Cypress types
        interface Chainable { //means we are extending the Cypress namespace with our own custom commands
            getDataTest(value: string): Chainable<JQuery<HTMLElement>>;
            loginAsAdmin(email: string, password: string): Chainable<void>;
        }
    }
} 



















