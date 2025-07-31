describe('Support Ticket Management Page', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('http://localhost:5173/admin-dashboard');
    cy.get('body').should('contain.text', 'Admin Panel');
    cy.getDataTest('admin-dashboard').should('be.visible');
    cy.getDataTest('admin-sidebar', { timeout: 10000 }).should('be.visible');
    cy.getDataTest('sidebar-tab-support').click();
    cy.getDataTest('support-ticket-page', { timeout: 10000 }).should('be.visible');
  });

  // it('displays loading spinner and ticket stats', () => {
  //   cy.intercept('GET', '**/support-tickets', {
  //     statusCode: 200,
  //     body: [
  //       {
  //         ticket_id: 1,
  //         subject: 'Test Ticket 1',
  //         description: 'This is a test ticket',
  //         status: 'Open',
  //         created_at: '2025-07-30T12:00:00Z',
  //         user: { first_name: 'Test', last_name: 'User', email: 'test@example.com' }
  //       },
  //       {
  //         ticket_id: 2,
  //         subject: 'Test Ticket 2',
  //         description: 'This is another test ticket',
  //         status: 'In Progress',
  //         created_at: '2025-07-30T12:00:00Z',
  //         user: { first_name: 'Test', last_name: 'User2', email: 'test2@example.com' }
  //       }
  //     ]
  //   }).as('getTickets');
  //   cy.wait('@getTickets');

  //   cy.get('body').then(($body) => {
  //     if ($body.find('[data-test="messages-loading"]').length > 0) {
  //       cy.getDataTest('loading-spinner').should('exist');
  //     }
  //   });
  //   cy.getDataTest('ticket-stats', { timeout: 6000 }).should('exist');
  //   cy.getDataTest('stat-card-total').should('contain.text', 'Total');
  //   cy.getDataTest('stat-card-open').should('contain.text', 'Open');
  //   cy.getDataTest('stat-card-in-progress').should('contain.text', 'In Progress');
  //   cy.getDataTest('stat-card-closed').should('contain.text', 'Closed');
  // });

  it('allows searching and filtering tickets', () => {
    cy.intercept('GET', '**/support-tickets', {
      statusCode: 200,
      body: []
    }).as('getTickets');
    cy.wait('@getTickets');

    cy.getDataTest('search-input').should('be.visible').type('Test Ticket');
    cy.getDataTest('status-filter').should('be.visible').select('Open');
    cy.getDataTest('table-body').children().should('have.length', 0);
  });

  it('updates a ticket status', () => {
    cy.intercept('GET', '**/support-tickets', {
      statusCode: 200,
      body: [{
        ticket_id: 1,
        subject: 'Test Cypress Ticket',
        description: 'This is a test ticket',
        status: 'Open',
        created_at: '2025-07-30T12:00:00Z',
        user: { first_name: 'Test', last_name: 'User', email: 'test@example.com' }
      }]
    }).as('getTickets');
    cy.wait('@getTickets');
    cy.getDataTest('ticket-table').should('contain', 'Test Cypress Ticket');

    cy.intercept('PUT', '**/support-tickets/*', { statusCode: 200 }).as('updateTicket');
    cy.intercept('GET', '**/support-tickets', {
      statusCode: 200,
      body: [{
        ticket_id: 1,
        subject: 'Test Cypress Ticket',
        description: 'This is a test ticket',
        status: 'In Progress',
        created_at: '2025-07-30T12:00:00Z',
        user: { first_name: 'Test', last_name: 'User', email: 'test@example.com' }
      }]
    }).as('getUpdatedTickets');

    cy.getDataTest('ticket-row', { timeout: 10000 }).first().within(() => {
      cy.getDataTest('status-select').should('be.visible').select('In Progress');
    });

    cy.wait('@updateTicket', { timeout: 10000 });
    cy.wait('@getUpdatedTickets', { timeout: 10000 });

    cy.contains('Ticket status updated to In Progress', { timeout: 10000 }).should('exist');
    cy.getDataTest('ticket-row').first().within(() => {
      cy.getDataTest('status-select').should('have.value', 'In Progress');
      cy.getDataTest('status-select').should('have.class', 'bg-yellow-100'); // Verify color change
    });
  });

  // it('views ticket details and sends a message', () => {
  //   cy.intercept('GET', '**/support-tickets', {
  //     statusCode: 200,
  //     body: [{
  //       ticket_id: 1,
  //       subject: 'Test Cypress Ticket',
  //       description: 'This is a test ticket',
  //       status: 'Open',
  //       created_at: '2025-07-30T12:00:00Z',
  //       user: { first_name: 'Test', last_name: 'User', email: 'test@example.com' }
  //     }]
  //   }).as('getTickets');
  //   cy.wait('@getTickets');
  //   cy.getDataTest('ticket-table').should('contain', 'Test Cypress Ticket');

  //   cy.intercept('GET', '**/ticket-messages/*', {
  //     statusCode: 200,
  //     body: []
  //   }).as('getMessages');

  //   cy.getDataTest('ticket-row', { timeout: 10000 }).first().should('be.visible');
  //   cy.getDataTest('ticket-actions').should('be.visible');
  //   cy.getDataTest('view-ticket-button', { timeout: 10000 }).should('be.visible').click();

  //   cy.wait('@getMessages', { timeout: 10000 });

  //   cy.getDataTest('ticket-modal').should('be.visible');
  //   cy.getDataTest('ticket-details').should('contain', 'Test Cypress Ticket');
  //   cy.getDataTest('customer-name').should('contain', 'Test User');
  //   cy.getDataTest('status-text').should('contain', 'Open');

  //   cy.intercept('POST', '**/messages', { statusCode: 200 }).as('sendMessage');
  //   cy.getDataTest('message-input-field').should('be.visible').type('This is a test response');
  //   cy.getDataTest('send-message-button').should('be.visible').click();
  //   cy.wait('@sendMessage', { timeout: 10000 });

  //   cy.contains('Message sent successfully', { timeout: 10000 }).should('exist');
  //   cy.getDataTest('messages-list').should('contain', 'This is a test response');

  //   cy.getDataTest('modal-close').click();
  //   cy.getDataTest('ticket-modal').should('not.exist');
  // });
});