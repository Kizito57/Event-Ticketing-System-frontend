describe('Support Center Page', () => {
  beforeEach(() => {
    // Simulate user login
    cy.loginAsUser()
    // Navigate to the Support tab
    cy.getDataTest('nav-button-support').click()
    // Wait for support center content to load
    cy.wait(3000)
  })

  it('displays create ticket modal when new ticket button is clicked', () => {
    // Ensure the support center page is visible
    cy.getDataTest('support-center-page').should('be.visible')

    // Click the new ticket button
    cy.getDataTest('new-ticket-button').click()

    // Verify the create ticket modal appears
    cy.getDataTest('create-ticket-modal').should('be.visible')
    cy.getDataTest('create-ticket-modal-content').should('exist')
    cy.getDataTest('create-ticket-title').should('contain', 'Create Support Ticket')

    // Verify the form elements
    cy.getDataTest('create-ticket-form').within(() => {
      // Subject field
      cy.getDataTest('subject-label').should('contain', 'Subject')
      cy.getDataTest('subject-input').should('have.attr', 'placeholder', 'Brief description of your issue')
      cy.getDataTest('subject-input').should('have.attr', 'required')

      // Description field
      cy.getDataTest('description-label').should('contain', 'Description')
      cy.getDataTest('description-input').should('have.attr', 'placeholder', 'Please provide detailed information...')
      cy.getDataTest('description-input').should('have.attr', 'required')

      // Action buttons
      cy.getDataTest('create-ticket-actions').within(() => {
        cy.getDataTest('cancel-create-button').should('contain', 'Cancel')
        cy.getDataTest('submit-ticket-button').should('contain', 'Create Ticket')
      })
    })

    // Close the modal to clean up
    cy.getDataTest('cancel-create-button').click()
    cy.getDataTest('create-ticket-modal').should('not.exist')
  })

  it('displays messages modal when view messages button is clicked', () => {
    // Ensure the support center page is visible
    cy.getDataTest('support-center-page').should('be.visible')

    // Check if there are tickets
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="ticket-card"]').length > 0) {
        // Click the view messages button on the first ticket
        cy.getDataTest('ticket-card').first().within(() => {
          cy.getDataTest('view-messages-button').click()
        })

        // Verify the messages modal appears
        cy.getDataTest('messages-modal').should('be.visible')
        cy.getDataTest('messages-modal-content').should('exist')
        cy.getDataTest('messages-modal-header').within(() => {
          cy.getDataTest('messages-modal-title').should('contain', 'Ticket #')
          cy.getDataTest('messages-modal-subject').should('exist')
          cy.getDataTest('messages-modal-close').should('exist')
        })

        // Verify the messages list area
        cy.getDataTest('messages-list').should('exist')
        cy.get('body').then(($messagesBody) => {
          if ($messagesBody.find('[data-test="messages-loading"]').length > 0) {
            // If loading, verify spinner
            cy.getDataTest('loading-spinner').should('exist')
          } else if ($messagesBody.find('[data-test="no-messages"]').length > 0) {
            // If no messages, verify empty state
            cy.getDataTest('no-messages').should('exist')
            cy.getDataTest('no-messages-icon').should('exist')
            cy.getDataTest('no-messages-text').should('contain', 'No messages yet. Start the conversation!')
          } else {
            // If messages exist, verify message structure
            cy.getDataTest('message-item').first().within(() => {
              cy.getDataTest('user-message').or('[data-test="support-message"]').should('exist')
              cy.getDataTest('message-sender').within(() => {
                cy.getDataTest('user-icon').or('[data-test="support-icon"]').should('exist')
                cy.getDataTest('sender-label').should('match', /You|Support/)
              })
              cy.getDataTest('message-content').should('exist')
              cy.getDataTest('message-time').should('exist')
            })
          }
        })

        // Verify the message input form
        cy.getDataTest('message-form').within(() => {
          cy.getDataTest('message-input').should('have.attr', 'placeholder', 'Type your message...')
          cy.getDataTest('send-message-button').should('exist')
          cy.getDataTest('send-icon').should('exist')
        })

        // Close the modal to clean up
        cy.getDataTest('messages-modal-close').click()
        cy.getDataTest('messages-modal').should('not.exist')
      } else {
        // If no tickets, verify empty state
        cy.getDataTest('no-tickets').should('exist')
        cy.getDataTest('no-tickets-icon').should('exist')
        cy.getDataTest('no-tickets-title').should('contain', 'No tickets found')
        cy.getDataTest('create-first-ticket-button').should('contain', 'Create Your First Ticket')
      }
    })
  })

  it('displays message input form in messages modal', () => {
    // Ensure the support center page is visible
    cy.getDataTest('support-center-page').should('be.visible')

    // Check if there are tickets
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="ticket-card"]').length > 0) {
        // Click the view messages button on the first ticket
        cy.getDataTest('ticket-card').first().within(() => {
          cy.getDataTest('view-messages-button').click()
        })

        // Verify the messages modal appears
        cy.getDataTest('messages-modal').should('be.visible')

        // Verify the message input form specifically
        cy.getDataTest('message-form').should('be.visible')
        cy.getDataTest('message-form').within(() => {
          cy.getDataTest('message-input').should('exist')
          cy.getDataTest('message-input').should('have.attr', 'placeholder', 'Type your message...')
          cy.getDataTest('message-input').should('have.attr', 'type', 'text')
          cy.getDataTest('send-message-button').should('exist')
          cy.getDataTest('send-message-button').should('have.attr', 'title', 'Send Message')
          cy.getDataTest('send-icon').should('exist')
        })

        // Close the modal to clean up
        cy.getDataTest('messages-modal-close').click()
        cy.getDataTest('messages-modal').should('not.exist')
      } else {
        // If no tickets, verify empty state
        cy.getDataTest('no-tickets').should('exist')
      }
    })
  })
})