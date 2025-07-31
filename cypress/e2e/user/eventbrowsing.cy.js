describe('Event Browsing Page', () => {
  beforeEach(() => {
    // Simulate user login
    cy.loginAsUser()
    // Navigate to the Events tab
    cy.getDataTest('nav-button-events').click()
    // Wait for events content to load
    cy.wait(3000)
  })

  it('displays booking modal when book now button is clicked', () => {
    // Ensure the events page is visible
    cy.getDataTest('events-page').should('be.visible')

    // Check if there are events
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="event-card"]').length > 0) {
        // Select the first event card and verify the book now button exists
        cy.getDataTest('event-card').first().within(() => {
          cy.getDataTest('book-event-button').should('exist').click()
        })

        // Wait for modal to exist and use alternative visibility check
        cy.getDataTest('booking-modal', { timeout: 10000 })
          .should('exist')
          .and('not.have.css', 'display', 'none')

        cy.getDataTest('booking-modal-content').should('exist')
        cy.getDataTest('booking-modal-header').within(() => {
          cy.getDataTest('booking-modal-title').should('contain', 'Book Tickets')
          cy.getDataTest('booking-event-title').should('exist')
          cy.getDataTest('booking-modal-close').should('exist')
        })

        // Verify the booking form elements
        cy.getDataTest('booking-form').within(() => {
          cy.getDataTest('booking-quantity-field').within(() => {
            cy.getDataTest('booking-quantity-label').should('contain', 'Number of tickets')
            cy.getDataTest('booking-quantity-input').should('exist')
            cy.getDataTest('booking-quantity-input').should('have.attr', 'type', 'number')
            cy.getDataTest('booking-quantity-input').should('have.attr', 'placeholder', 'Enter quantity')
            cy.getDataTest('booking-quantity-input').should('have.attr', 'required')
            cy.getDataTest('booking-max-tickets').should('contain', 'Max:')
            cy.getDataTest('booking-max-tickets').should('contain', 'tickets')
          })
          cy.getDataTest('booking-actions').within(() => {
            cy.getDataTest('booking-cancel-button').should('contain', 'Cancel')
            cy.getDataTest('booking-confirm-button').should('contain', 'Confirm Booking')
          })
        })

        // Close the modal to clean up
        cy.getDataTest('booking-modal-close').click({ force: true })
        cy.getDataTest('booking-modal', { timeout: 6000 }).should('not.exist')
      } else {
        // If no events, verify empty state
        cy.getDataTest('no-events-message').should('exist')
        cy.getDataTest('no-events-icon').should('exist')
        cy.getDataTest('no-events-title').should('contain', 'No events available')
        cy.getDataTest('no-events-subtitle').should('contain', 'Check back later for new events!')
      }
    })
  })

  it('displays venue modal when venue button is clicked', () => {
    // Ensure the events page is visible
    cy.getDataTest('events-page').should('be.visible')

    // Check if there are events
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="event-card"]').length > 0) {
        // Select the first event card and verify the venue button exists  
        cy.getDataTest('event-card').first().within(() => {
          cy.getDataTest('venue-button').should('exist').click()
        })

        // Wait for modal to exist and use alternative visibility check
        cy.getDataTest('venue-modal', { timeout: 10000 })
          .should('exist')
          .and('not.have.css', 'display', 'none')

        cy.getDataTest('venue-modal-content').should('exist')
        cy.getDataTest('venue-modal-header').within(() => {
          cy.getDataTest('venue-modal-title').should('contain', 'Venue Details')
          cy.getDataTest('venue-modal-close').should('exist')
        })

        // Check image container
        cy.getDataTest('venue-modal-body').within(() => {
          cy.getDataTest('venue-image-container').should('exist')
        })

        // ✅ Check for venue image or placeholder OUTSIDE within
        cy.get('body').then(($venueBody) => {
          if ($venueBody.find('[data-test="venue-image"]').length > 0) {
            cy.getDataTest('venue-image').should('exist')
          } else {
            cy.getDataTest('venue-placeholder-image').should('exist')
          }
        })

        // Continue with venue details and upcoming events
        cy.getDataTest('venue-modal-body').within(() => {
          cy.getDataTest('venue-details').within(() => {
            cy.getDataTest('venue-info').within(() => {
              cy.getDataTest('venue-name').should('exist')
              cy.getDataTest('venue-address-info').within(() => {
                cy.getDataTest('venue-address').should('exist')
              })
              cy.getDataTest('venue-capacity-info').within(() => {
                cy.getDataTest('venue-capacity').should('contain', 'Capacity:')
              })
            })
          })
        })

        // ✅ Check upcoming events outside of `.within()` to access `body`
        cy.get('body').then(($venueBody) => {
          if ($venueBody.find('[data-test="venue-no-events"]').length > 0) {
            cy.getDataTest('venue-no-events').should('contain', 'No events scheduled at this venue.')
          } else {
            cy.getDataTest('venue-events-list').should('exist')
            cy.getDataTest('venue-event-item').first().within(() => {
              cy.getDataTest('venue-event-name').should('exist')
              cy.getDataTest('venue-event-date').should('exist')
            })
          }
        })

        // Close the modal
        cy.getDataTest('venue-modal-close').click({ force: true })
        cy.getDataTest('venue-modal', { timeout: 6000 }).should('not.exist')
      } else {
        // If no events, verify empty state
        cy.getDataTest('no-events-message').should('exist')
        cy.getDataTest('no-events-icon').should('exist')
        cy.getDataTest('no-events-title').should('contain', 'No events available')
        cy.getDataTest('no-events-subtitle').should('contain', 'Check back later for new events!')
      }
    })
  })
})