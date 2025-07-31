describe('Register Component', () => {
  const validUser = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    confirmPassword: 'password123'
  }

  const invalidUser = {
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    confirmPassword: 'differentpassword'
  }

  beforeEach(() => {
    cy.visit('/register')
  })

  it('should display register page correctly', () => {
    cy.get('[data-test="register-page"]').should('be.visible')
    cy.get('[data-test="register-title"]').should('contain.text', 'Create Account')
    cy.get('[data-test="register-subtitle"]').should('contain.text', 'Join us and start your journey')
    cy.get('[data-test="register-form"]').should('be.visible')
  })

  it('should display all form fields', () => {
    cy.get('[data-test="register-first-name"]').should('be.visible')
    cy.get('[data-test="register-last-name"]').should('be.visible')
    cy.get('[data-test="register-email"]').should('be.visible')
    cy.get('[data-test="register-password"]').should('be.visible')
    cy.get('[data-test="register-confirm-password"]').should('be.visible')
    cy.get('[data-test="register-submit-button"]').should('be.visible')
  })

  it('should validate required fields', () => {
    cy.get('[data-test="register-submit-button"]').click()
    
    // HTML5 validation will prevent form submission for required fields
    cy.get('[data-test="register-first-name"]:invalid').should('exist')
  })

  it('should fill out form fields correctly', () => {
    cy.get('[data-test="register-first-name"]').type(validUser.first_name)
    cy.get('[data-test="register-last-name"]').type(validUser.last_name)
    cy.get('[data-test="register-email"]').type(validUser.email)
    cy.get('[data-test="register-password"]').type(validUser.password)
    cy.get('[data-test="register-confirm-password"]').type(validUser.confirmPassword)

    cy.get('[data-test="register-first-name"]').should('have.value', validUser.first_name)
    cy.get('[data-test="register-last-name"]').should('have.value', validUser.last_name)
    cy.get('[data-test="register-email"]').should('have.value', validUser.email)
    cy.get('[data-test="register-password"]').should('have.value', validUser.password)
    cy.get('[data-test="register-confirm-password"]').should('have.value', validUser.confirmPassword)
  })

  it('should show alert when passwords do not match', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('windowAlert')
    })

    cy.get('[data-test="register-first-name"]').type(invalidUser.first_name)
    cy.get('[data-test="register-last-name"]').type(invalidUser.last_name)
    cy.get('[data-test="register-email"]').type(invalidUser.email)
    cy.get('[data-test="register-password"]').type(invalidUser.password)
    cy.get('[data-test="register-confirm-password"]').type(invalidUser.confirmPassword)
    cy.get('[data-test="register-submit-button"]').click()

    cy.get('@windowAlert').should('have.been.calledWith', 'Passwords do not match')
  })

  it('should handle registration failure', () => {
    cy.intercept('POST', '**/register', { 
      statusCode: 400, 
      body: { message: 'Email already exists' } 
    }).as('registerFail')

    cy.get('[data-test="register-first-name"]').type(validUser.first_name)
    cy.get('[data-test="register-last-name"]').type(validUser.last_name)
    cy.get('[data-test="register-email"]').type(validUser.email)
    cy.get('[data-test="register-password"]').type(validUser.password)
    cy.get('[data-test="register-confirm-password"]').type(validUser.confirmPassword)
    cy.get('[data-test="register-submit-button"]').click()

    cy.wait('@registerFail')
    cy.get('[data-test="register-error"]').should('be.visible')
    cy.get('[data-test="register-error"]').should('contain.text', 'Email already exists')
  })

  it('should handle successful registration and redirect to verify', () => {
    cy.intercept('POST', '**/register', {
      statusCode: 201,
      body: { message: 'Registration successful', user: { id: 1, email: validUser.email } }
    }).as('registerSuccess')

    cy.get('[data-test="register-first-name"]').type(validUser.first_name)
    cy.get('[data-test="register-last-name"]').type(validUser.last_name)
    cy.get('[data-test="register-email"]').type(validUser.email)
    cy.get('[data-test="register-password"]').type(validUser.password)
    cy.get('[data-test="register-confirm-password"]').type(validUser.confirmPassword)
    cy.get('[data-test="register-submit-button"]').click()

    cy.wait('@registerSuccess')
    cy.url().should('include', '/verify')
  })

  it('should show loading state during registration', () => {
    cy.intercept('POST', '**/register', { 
      delay: 1000, 
      statusCode: 201, 
      body: {} 
    }).as('slowRegister')

    cy.get('[data-test="register-first-name"]').type(validUser.first_name)
    cy.get('[data-test="register-last-name"]').type(validUser.last_name)
    cy.get('[data-test="register-email"]').type(validUser.email)
    cy.get('[data-test="register-password"]').type(validUser.password)
    cy.get('[data-test="register-confirm-password"]').type(validUser.confirmPassword)
    cy.get('[data-test="register-submit-button"]').click()

    cy.get('[data-test="register-loading-state"]').should('be.visible')
    cy.get('[data-test="register-submit-button"]').should('be.disabled')
  })

  it('should navigate to login page', () => {
    cy.get('[data-test="register-login-link"]').click()
    cy.url().should('include', '/login')
  })

  it('should validate email format', () => {
    cy.get('[data-test="register-email"]').type('invalid-email')
    cy.get('[data-test="register-submit-button"]').click()
    
    // HTML5 validation will show invalid state for invalid email
    cy.get('[data-test="register-email"]:invalid').should('exist')
  })

  it('should clear error when component mounts', () => {
    // Simulate having an error in state
    cy.intercept('POST', '**/register', { 
      statusCode: 400, 
      body: { message: 'Test error' } 
    }).as('registerError')

    cy.get('[data-test="register-first-name"]').type(validUser.first_name)
    cy.get('[data-test="register-last-name"]').type(validUser.last_name)
    cy.get('[data-test="register-email"]').type('test@test.com')
    cy.get('[data-test="register-password"]').type(validUser.password)
    cy.get('[data-test="register-confirm-password"]').type(validUser.confirmPassword)
    cy.get('[data-test="register-submit-button"]').click()

    cy.wait('@registerError')
    cy.get('[data-test="register-error"]').should('be.visible')

    // Navigate away and back to trigger useEffect
    cy.visit('/login')
    cy.visit('/register')
    
    cy.get('[data-test="register-error"]').should('not.exist')
  })

  it('should display footer text', () => {
    cy.get('[data-test="register-footer"]')
      .should('be.visible')
      .should('contain.text', 'By creating an account, you agree to our Terms of Service and Privacy Policy')
  })

  it('should have proper form structure', () => {
    cy.get('[data-test="register-header"]').should('be.visible')
    cy.get('[data-test="register-card"]').should('be.visible')
    cy.get('[data-test="name-fields"]').should('be.visible')
    cy.get('[data-test="email-field"]').should('be.visible')
    cy.get('[data-test="password-field"]').should('be.visible')
    cy.get('[data-test="confirm-password-field"]').should('be.visible')
    cy.get('[data-test="register-divider"]').should('be.visible')
    cy.get('[data-test="login-link-section"]').should('be.visible')
  })

  it('should handle form submission without password mismatch', () => {
    cy.intercept('POST', '**/register', {
      statusCode: 201,
      body: { message: 'Success' }
    }).as('registerSuccess')

    cy.get('[data-test="register-first-name"]').type(validUser.first_name)
    cy.get('[data-test="register-last-name"]').type(validUser.last_name)
    cy.get('[data-test="register-email"]').type(validUser.email)
    cy.get('[data-test="register-password"]').type(validUser.password)
    cy.get('[data-test="register-confirm-password"]').type(validUser.confirmPassword)
    
    cy.get('[data-test="register-submit-button"]').click()
    
    cy.wait('@registerSuccess')
    // Should not show alert for matching passwords
    cy.window().its('alert').should('not.exist')
  })
})