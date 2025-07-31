describe('Booking Management Page', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    // Navigate to the Bookings tab
    cy.getDataTest('sidebar-tab-bookings').click()
    // Wait for the booking content to load
    cy.getDataTest('booking-management-page').should('be.visible')
    // Wait for initial data load
    cy.wait(2000)
  })

  it('displays loading spinner and booking stats', () => {
    // Check for either loading state or loaded content
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="bookings-loading"]').length > 0) {
        cy.getDataTest('loading-spinner').should('exist')
      }
    })
    
    // Stats should always be visible
    cy.getDataTest('booking-stats').should('exist')
    cy.getDataTest('stat-card-total').should('be.visible')
    cy.getDataTest('stat-card-confirmed').should('be.visible')
    cy.getDataTest('stat-card-pending').should('be.visible')
  })

  it('allows searching for bookings', () => {
    // Wait for search input to be available
    cy.getDataTest('search-input').should('be.visible')
    
    // Try searching for a user ID
    cy.getDataTest('search-input').type('1')
    
    // Check if there are bookings or no bookings message
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="booking-row"]').length > 0) {
        cy.getDataTest('booking-row').should('exist')
      } else {
        cy.getDataTest('no-bookings').should('exist')
      }
    })
    
    // Clear search
    cy.getDataTest('search-input').clear()
  })

  // it('allows editing a booking status', () => {
  //   // Wait for table to load
  //   cy.getDataTest('booking-table').should('be.visible')
    
  //   // Check if we have any bookings to edit
  //   cy.get('body').then(($body) => {
  //     if ($body.find('[data-test="booking-row"]').length > 0) {
  //       // Get the first booking row and edit it
  //       cy.getDataTest('booking-row').first().within(() => {
  //         // Click edit button
  //         cy.getDataTest('edit-button').click()
  //       })
        
  //       // Should see edit form
  //       cy.getDataTest('edit-status').should('be.visible')
        
  //       // Change status
  //       cy.getDataTest('edit-status').select('Confirmed')
        
  //       // Save changes
  //       cy.getDataTest('save-button').click()
        
  //       // Wait for update to complete
  //       cy.wait(1000)
        
  //       // Should return to view mode
  //       cy.getDataTest('status-text').should('contain', 'Confirmed')
  //     } else {
  //       cy.log('No bookings available to edit')
  //     }
  //   })
  // })

  it('handles booking deletion with confirmation', () => {
    // Wait for table to load
    cy.getDataTest('booking-table').should('be.visible')
    
    // Check if we have any bookings to delete
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="booking-row"]').length > 0) {
        // Store initial booking count
        let initialCount = $body.find('[data-test="booking-row"]').length
        
        // Get the first booking row
        cy.getDataTest('booking-row').first().within(() => {
          // Click delete button
          cy.getDataTest('delete-button').click()
        })
        
        // Handle the delete confirmation modal
        cy.getDataTest('delete-modal').should('be.visible')
        cy.getDataTest('delete-modal-title').should('contain', 'Delete Booking')
        
        // Click cancel first to test cancellation
        cy.getDataTest('delete-cancel-button').click()
        
        // Modal should close and booking should still exist
        cy.getDataTest('booking-row').should('have.length', initialCount)
        
        // Now actually delete
        cy.getDataTest('booking-row').first().within(() => {
          cy.getDataTest('delete-button').click()
        })
        
        // Confirm deletion
        cy.getDataTest('delete-modal').should('be.visible')
        cy.getDataTest('delete-confirm-button').click()
        
        // Wait for deletion to complete
        cy.wait(2000)
        
        // Check if booking count decreased (if there were bookings)
        if (initialCount > 1) {
          cy.getDataTest('booking-row').should('have.length', initialCount - 1)
        } else {
          // If it was the last booking, should see no bookings message
          cy.getDataTest('no-bookings').should('exist')
        }
      } else {
        cy.log('No bookings available to delete')
      }
    })
  })

  it('displays booking table with correct columns', () => {
    cy.getDataTest('booking-table').should('be.visible')
    
    // Check table headers
    cy.getDataTest('table-header').should('exist')
    cy.getDataTest('table-header-id').should('contain', 'ID')
    cy.getDataTest('table-header-user').should('contain', 'User')
    cy.getDataTest('table-header-event').should('contain', 'Event')
    cy.getDataTest('table-header-qty').should('contain', 'Qty')
    cy.getDataTest('table-header-total').should('contain', 'Total')
    cy.getDataTest('table-header-status').should('contain', 'Status')
    cy.getDataTest('table-header-created').should('contain', 'Created')
    cy.getDataTest('table-header-actions').should('contain', 'Actions')
  })

  it('validates search functionality with different filters', () => {
    cy.getDataTest('search-input').should('be.visible')
    
    // Test searching by status
    cy.getDataTest('search-input').type('confirmed')
    cy.wait(500) // Allow filter to apply
    
    // Check results
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="booking-row"]').length > 0) {
        // All visible bookings should contain "confirmed" in status
        cy.getDataTest('booking-row').each(($row) => {
          cy.wrap($row).find('[data-test="booking-status"]').should('contain.text', 'Confirmed')
        })
      }
    })
    
    // Clear and test with different search
    cy.getDataTest('search-input').clear().type('pending')
    cy.wait(500)
    
    // Test clearing search
    cy.getDataTest('search-input').clear()
    cy.wait(500)
  })
})