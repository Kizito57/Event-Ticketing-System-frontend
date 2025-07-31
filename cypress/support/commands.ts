/// <reference types="cypress" />

// Custom command to select elements by data-test attribute
Cypress.Commands.add('getDataTest', (dataTestSelector) => {
  return cy.get(`[data-test="${dataTestSelector}"]`)
})

// Custom command to log in as an admin user
Cypress.Commands.add(
  'loginAsAdmin',
  (email = 'deity047@gmail.com', password = '12345678') => {
    cy.visit('/login')
    cy.getDataTest('login-email-input').type(email)
    cy.getDataTest('login-password-input').type(password)
    cy.getDataTest('login-submit-button').click()
        
    // Verify dashboard loaded
    cy.url().should('include', '/admin-dashboard').as('adminDashboardUrl')
    cy.get('body').should('contain.text', 'Admin Panel') // or 'Welcome back'
        
    // Wait for the dashboard to fully load
    cy.getDataTest('admin-dashboard').should('be.visible')
  }
)

// Custom command to log in as a regular user
Cypress.Commands.add(
  'loginAsUser',
  (email = 'dkwanjiru097@gmail.com', password = '12345678') => {
    cy.visit('/login')
    cy.getDataTest('login-email-input').type(email)
    cy.getDataTest('login-password-input').type(password)
    cy.getDataTest('login-submit-button').click()
        
    // Verify user dashboard loaded
    cy.url().should('include', '/user-dashboard').as('userDashboardUrl')
    cy.get('body').should('contain.text', 'Crystal Events') // or greeting message
        
    // Wait for the dashboard to fully load
    cy.getDataTest('user-dashboard').should('be.visible')
  }
)

// Custom command to navigate to a specific admin tab
Cypress.Commands.add('navigateToAdminTab', (tabName) => {
  cy.getDataTest(`sidebar-tab-${tabName}`).click()
  cy.getDataTest('admin-main-content').should('be.visible')
})

// Custom command to navigate to a specific user tab
Cypress.Commands.add('navigateToUserTab', (tabName) => {
  cy.getDataTest(`user-tab-${tabName}`).click()
  cy.wait(1000) // Allow for tab content to load
})

// TypeScript: extend Cypress chainable interface
export {} // Ensures this file is treated as a module

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select element by data-test attribute.
       * @example cy.getDataTest('login-submit-button')
       */
      getDataTest(value: string): Chainable<JQuery<HTMLElement>>
            
      /**
       * Custom command to login as admin.
       * @example cy.loginAsAdmin()
       */
      loginAsAdmin(email?: string, password?: string): Chainable<void>
      
      /**
       * Custom command to login as regular user.
       * @example cy.loginAsUser()
       */
      loginAsUser(email?: string, password?: string): Chainable<void>
            
      /**
       * Custom command to navigate to admin tab.
       * @example cy.navigateToAdminTab('events')
       */
      navigateToAdminTab(tabName: string): Chainable<void>
      
      /**
       * Custom command to navigate to user tab.
       * @example cy.navigateToUserTab('events')
       */
      navigateToUserTab(tabName: string): Chainable<void>
    }
  }
}