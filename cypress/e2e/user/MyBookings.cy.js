describe('My Bookings Page', () => {
  beforeEach(() => {
    // Simulate user login
    cy.loginAsUser()

    // Navigate to the Bookings tab and wait for page to load
    cy.getDataTest('nav-button-bookings').click()
    cy.getDataTest('my-bookings-page', { timeout: 10000 }).should('be.visible')
  })

  it('displays cancel confirmation modal when cancel button is clicked', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="booking-row"]').length > 0) {
        // Find a pending booking and click its cancel button
        cy.getDataTest('booking-row').then(($rows) => {
          let pendingRowFound = false;
          
          for (let i = 0; i < $rows.length; i++) {
            const $row = $rows.eq(i);
            const statusText = $row.find('[data-test="booking-status"]').text();
            
            if (statusText.includes('Pending')) {
              // Click the cancel button for this pending booking
              cy.wrap($row).within(() => {
                cy.getDataTest('cancel-button').click()
              })
              
              pendingRowFound = true;
              break;
            }
          }
          
          if (pendingRowFound) {
            // Wait for modal to appear and verify its contents
            cy.getDataTest('cancel-modal', { timeout: 10000 })
              .should('exist')
              .and('be.visible')

            cy.getDataTest('cancel-modal-title').should('contain', 'Cancel Booking')
            cy.getDataTest('cancel-modal-text').should('contain', 'Are you sure you want to cancel this booking?')

            cy.getDataTest('cancel-modal-actions').within(() => {
              cy.getDataTest('confirm-cancel-button').should('contain', 'Yes, Cancel')
              cy.getDataTest('keep-button').should('contain', 'No, Keep').click()
            })

            cy.getDataTest('cancel-modal').should('not.exist')
          } else {
            // If no pending bookings found, just verify the page structure
            cy.getDataTest('booking-row').should('exist')
          }
        })
      } else {
        cy.getDataTest('no-bookings').should('exist')
        cy.getDataTest('no-bookings-title').should('contain', 'No bookings yet')
        cy.getDataTest('no-bookings-text').should('exist')
      }
    })
  })

  it('displays payment modal when pay now button is clicked', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="booking-row"]').length > 0) {
        // Find a pending booking and click its pay now button
        cy.getDataTest('booking-row').then(($rows) => {
          let pendingRowFound = false;
          
          for (let i = 0; i < $rows.length; i++) {
            const $row = $rows.eq(i);
            const statusText = $row.find('[data-test="booking-status"]').text();
            
            if (statusText.includes('Pending')) {
              // Click the pay now button for this pending booking
              cy.wrap($row).within(() => {
                cy.getDataTest('pay-now-button').click()
              })
              
              pendingRowFound = true;
              break;
            }
          }
          
          if (pendingRowFound) {
            cy.getDataTest('payment-modal', { timeout: 10000 })
              .should('exist')
              .and('be.visible')

            cy.getDataTest('payment-modal-title').should('contain', 'Complete Payment')

            cy.getDataTest('payment-modal-header').within(() => {
              cy.getDataTest('payment-modal-close').should('exist')
              cy.getDataTest('close-icon').should('exist')
            })

            cy.getDataTest('payment-details').within(() => {
              cy.getDataTest('booking-id-info').should('exist')
              cy.getDataTest('booking-id-text').should('contain', '#')

              cy.getDataTest('quantity-info').within(() => {
                cy.getDataTest('quantity-icon').should('exist')
                cy.getDataTest('quantity-text').should('contain', 'tickets')
              })

              cy.getDataTest('amount-info').within(() => {
                cy.getDataTest('amount-icon').should('exist')
                cy.getDataTest('amount-text').should('contain', 'KES')
              })
            })

            cy.getDataTest('payment-methods-title').should('contain', 'Choose Payment Method')

            cy.getDataTest('payment-methods').within(() => {
              cy.getDataTest('payment-method-card').within(() => {
                cy.getDataTest('card-icon').should('exist')
                cy.getDataTest('method-text').should('contain', 'Visa')
                cy.getDataTest('default-badge').should('contain', 'Default')
                cy.getDataTest('default-icon').should('exist')
              })

              cy.getDataTest('payment-method-mpesa').within(() => {
                cy.getDataTest('mpesa-icon').should('exist')
                cy.getDataTest('method-text').should('contain', 'M-Pesa')
              })
            })

            cy.getDataTest('payment-modal-close').click()
            cy.getDataTest('payment-modal').should('not.exist')
          } else {
            // If no pending bookings found, just verify the page structure
            cy.getDataTest('booking-row').should('exist')
          }
        })
      } else {
        cy.getDataTest('no-bookings').should('exist')
      }
    })
  })

//   it('displays M-Pesa modal when M-Pesa payment method is selected', () => {
//     cy.get('body').then(($body) => {
//       if ($body.find('[data-test="booking-row"]').length > 0) {
//         // Find a pending booking and click its pay now button
//         cy.getDataTest('booking-row').then(($rows) => {
//           let pendingRowFound = false;
          
//           for (let i = 0; i < $rows.length; i++) {
//             const $row = $rows.eq(i);
//             const statusText = $row.find('[data-test="booking-status"]').text();
            
//             if (statusText.includes('Pending')) {
//               // Click the pay now button for this pending booking
//               cy.wrap($row).within(() => {
//                 cy.getDataTest('pay-now-button').click()
//               })
              
//               pendingRowFound = true;
//               break;
//             }
//           }
          
//           if (pendingRowFound) {
//             cy.getDataTest('payment-modal', { timeout: 10000 })
//               .should('exist')
//               .and('be.visible')

//             cy.getDataTest('payment-method-mpesa').click()

//             cy.getDataTest('mpesa-modal', { timeout: 10000 })
//               .should('exist')
//               .and('be.visible')

//             cy.getDataTest('mpesa-modal').find('[data-test="mpesa-modal-close"]').click({ force: true })
//             cy.getDataTest('mpesa-modal').should('not.exist')

//             cy.getDataTest('payment-modal-close').click()
//             cy.getDataTest('payment-modal').should('not.exist')
//           } else {
//             // If no pending bookings found, just verify the page structure
//             cy.getDataTest('booking-row').should('exist')
//           }
//         })
//       } else {
//         cy.getDataTest('no-bookings').should('exist')
//       }
//     })
//   })
})