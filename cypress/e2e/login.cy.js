describe('Login Component', () => {
  const validUser = {
    email: 'test@example.com',
    password: 'password123'
  }

  const invalidUser = {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  }

  beforeEach(() => {
    cy.visit('/login')
  })

  it('should display login page correctly', () => {
    cy.get('[data-test="login-page"]').should('be.visible')
    cy.get('[data-test="login-title"]').should('contain.text', 'Welcome Back')
    cy.get('[data-test="login-subtitle"]').should('contain.text', 'Sign in to access your Crystal Events account')
    cy.get('[data-test="login-form"]').should('be.visible')
  })

  it('should show validation errors for empty form', () => {
    cy.get('[data-test="login-submit-button"]').click()
    cy.get('[data-test="email-error"]').should('contain.text', 'Email is required')
    cy.get('[data-test="password-error"]').should('contain.text', 'Password is required')
  })

  it('should show validation error for invalid email', () => {
    cy.get('[data-test="login-email-input"]').type('invalid-email')
    cy.get('[data-test="login-submit-button"]').click()
    cy.get('[data-test="email-error"]').should('contain.text', 'Invalid email')
  })

  it('should show validation error for short password', () => {
    cy.get('[data-test="login-password-input"]').type('123')
    cy.get('[data-test="login-submit-button"]').click()
    cy.get('[data-test="password-error"]').should('contain.text', 'password must be at least 6 characters')
  })

  it('should toggle password visibility', () => {
    cy.get('[data-test="login-password-input"]').type('password123')
    cy.get('[data-test="login-password-input"]').should('have.attr', 'type', 'password')
    
    cy.get('[data-test="toggle-password-visibility"]').click()
    cy.get('[data-test="login-password-input"]').should('have.attr', 'type', 'text')
    
    cy.get('[data-test="toggle-password-visibility"]').click()
    cy.get('[data-test="login-password-input"]').should('have.attr', 'type', 'password')
  })

  it('should handle login failure', () => {
    cy.intercept('POST', '**/login', { statusCode: 401, body: { message: 'Invalid credentials' } }).as('loginFail')
    
    cy.get('[data-test="login-email-input"]').type(invalidUser.email)
    cy.get('[data-test="login-password-input"]').type(invalidUser.password)
    cy.get('[data-test="login-submit-button"]').click()
    
    cy.wait('@loginFail')
    cy.get('[data-test="login-error"]').should('be.visible')
  })

  it('should handle successful login and redirect to user dashboard', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: { user: { id: 1, email: validUser.email, role: 'user' }, token: 'fake-token' }
    }).as('loginSuccess')
    
    cy.get('[data-test="login-email-input"]').type(validUser.email)
    cy.get('[data-test="login-password-input"]').type(validUser.password)
    cy.get('[data-test="login-submit-button"]').click()
    
    cy.wait('@loginSuccess')
    cy.url().should('include', '/user-dashboard')
  })

  it('should handle successful admin login and redirect to admin dashboard', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: { user: { id: 1, email: validUser.email, role: 'admin' }, token: 'fake-token' }
    }).as('adminLoginSuccess')
    
    cy.get('[data-test="login-email-input"]').type(validUser.email)
    cy.get('[data-test="login-password-input"]').type(validUser.password)
    cy.get('[data-test="login-submit-button"]').click()
    
    cy.wait('@adminLoginSuccess')
    cy.url().should('include', '/admin-dashboard')
  })

  it('should show loading state during login', () => {
    cy.intercept('POST', '**/login', { delay: 1000, statusCode: 200, body: {} }).as('slowLogin')
    
    cy.get('[data-test="login-email-input"]').type(validUser.email)
    cy.get('[data-test="login-password-input"]').type(validUser.password)
    cy.get('[data-test="login-submit-button"]').click()
    
    cy.get('[data-test="loading-state"]').should('be.visible')
    cy.get('[data-test="login-submit-button"]').should('be.disabled')
  })

  it('should navigate to register page', () => {
    cy.get('[data-test="register-link"]').click()
    cy.url().should('include', '/register')
  })

  it('should navigate to forgot password page', () => {
    cy.get('[data-test="forgot-password-link"]').click()
    cy.url().should('include', '/forgot-password')
  })

  it('should navigate back to home', () => {
    cy.get('[data-test="back-home-link"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should check remember me checkbox', () => {
    cy.get('[data-test="remember-me-checkbox"]').check()
    cy.get('[data-test="remember-me-checkbox"]').should('be.checked')
  })
})