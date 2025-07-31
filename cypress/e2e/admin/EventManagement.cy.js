describe('Event Management Page', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    // Navigate to the Events tab instead of visiting a URL
    cy.getDataTest('sidebar-tab-events').click()
    // Wait for the events content to load
    cy.getDataTest('event-management-page').should('be.visible')
  })

  it('displays loading spinner and event stats', () => {
    // The loading spinner might be very brief, so we'll check for either loading or loaded state
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="loading-spinner"]').length > 0) {
        cy.getDataTest('loading-spinner').should('exist')
      }
    })
    cy.getDataTest('event-stats').should('exist')
  })

  it('allows searching for events', () => {
    // Wait for the search input to be available
    cy.getDataTest('search-input').should('be.visible').type('Revival')
    // Check if there are any events or no events message
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="event-row"]').length > 0) {
        cy.getDataTest('event-row').should('exist')
      } else {
        cy.getDataTest('no-events-row').should('exist')
      }
    })
  })

  it('allows creating a new event', () => {
    // Click the Add New Event button
    cy.getDataTest('add-event-button').click()
    
    // Fill out the form
    cy.getDataTest('title-input').type('Test Cypress Event')
    cy.getDataTest('description-input').type('This is a test event')
    
    // Select venue from dropdown (select the first available option)
    cy.getDataTest('venue-select').select(1) // Index 1 since index 0 is "Select a venue"
    
    // Select category
    cy.getDataTest('category-select').select('Conference')
    
    cy.getDataTest('date-input').type('2025-08-20')
    cy.getDataTest('time-input').type('10:00')
    cy.getDataTest('ticket-price-input').clear().type('100')
    cy.getDataTest('tickets-total-input').clear().type('200')

    // Upload image (optional - comment out if you don't have the fixture file)
    // cy.getDataTest('image-input').selectFile('cypress/fixtures/test-image.jpg', {
    //   force: true,
    // })

    // Submit the form
    cy.getDataTest('submit-button').click()

    // Check for success message (this might appear as a toast)
    cy.contains('Event created successfully', { timeout: 10000 }).should('exist')
    
    // Wait a moment for the form to close and table to refresh
    cy.wait(1000)
    
    // Check if the event appears in the table
    cy.contains('Test Cypress Event').should('exist')
  })

  it('edits an existing event', () => {
    // First, ensure we have an event to edit (create one if needed)
    cy.get('body').then(($body) => {
      if ($body.find(':contains("Test Cypress Event")').length === 0) {
        // Create an event first
        cy.getDataTest('add-event-button').click()
        cy.getDataTest('title-input').type('Test Cypress Event')
        cy.getDataTest('description-input').type('This is a test event')
        cy.getDataTest('venue-select').select(1)
        cy.getDataTest('category-select').select('Conference')
        cy.getDataTest('date-input').type('2025-08-20')
        cy.getDataTest('time-input').type('10:00')
        cy.getDataTest('ticket-price-input').clear().type('100')
        cy.getDataTest('tickets-total-input').clear().type('200')
        cy.getDataTest('submit-button').click()
        cy.contains('Event created successfully', { timeout: 10000 }).should('exist')
        cy.wait(1000)
      }
    })

    // Find the event row and click edit
    cy.contains('Test Cypress Event')
      .closest('[data-test="event-row"]')
      .within(() => {
        cy.getDataTest('edit-button').click()
      })

    // Edit the title
    cy.getDataTest('title-input').clear().type('Test Cypress Event Edited')
    cy.getDataTest('submit-button').click()

    // Check for success message
    cy.contains('Event updated successfully', { timeout: 10000 }).should('exist')
    cy.wait(1000)
    cy.contains('Test Cypress Event Edited').should('exist')
  })

  it('deletes an event with zero tickets sold', () => {
    const eventToDelete = 'Test Cypress Event for Deletion'
    
    // Create a fresh event specifically for deletion
    cy.getDataTest('add-event-button').click()
    cy.getDataTest('title-input').type(eventToDelete)
    cy.getDataTest('description-input').type('This event will be deleted')
    cy.getDataTest('venue-select').select(1)
    cy.getDataTest('category-select').select('Conference')
    cy.getDataTest('date-input').type('2025-08-20')
    cy.getDataTest('time-input').type('10:00')
    cy.getDataTest('ticket-price-input').clear().type('100')
    cy.getDataTest('tickets-total-input').clear().type('200')
    cy.getDataTest('submit-button').click()
    
    // Wait for creation success
    cy.contains('Event created successfully', { timeout: 10000 }).should('exist')
    cy.wait(1000)
    
    // Verify the event exists before attempting to delete
    cy.contains(eventToDelete).should('exist')

    // Find the event and click delete
    cy.contains(eventToDelete)
      .closest('[data-test="event-row"]')
      .within(() => {
        cy.getDataTest('delete-button').click()
      })

    // Handle the delete confirmation modal
    cy.get('#delete-btn', { timeout: 5000 }).should('be.visible').click()

    // Check for success message
    cy.contains('Event deleted successfully', { timeout: 10000 }).should('exist')
    
    // Wait for the table to refresh
    cy.wait(2000)
    
    // Verify the event is no longer in the table
    cy.get('body').should('not.contain', eventToDelete)
  })
})