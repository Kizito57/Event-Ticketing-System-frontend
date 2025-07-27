describe("login functionality", () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.viewport(1280, 920)
  })

  it("should login with valid credentials", () => {
    cy.contains(/Welcome Back/i).should("be.visible")

    cy.getDataTest("login-email-input").as("login-emailInput")
    cy.get("@login-emailInput")
      .should("be.visible")
      .should("have.attr", "type", "email")
      .type("bkemboi590@gmail.com")

    cy.getDataTest("login-password-input").as("login-passwordInput")
    cy.get("@login-passwordInput")
      .should("be.visible")
      .should("have.attr", "type", "password")
      .type("mypassword123")

    cy.getDataTest("login-submit-button").as("login-submitButton")
    cy.get("@login-submitButton")
      .should("not.be.disabled")
      .should("contain.text", "Sign In")
      .click()

    cy.contains(/Login successful/i).should("be.visible")

    cy.url().should("match", /\/(admin-dashboard|user-dashboard)/)
  })

  it("should not login with invalid credentials", () => {
    cy.contains(/Welcome Back/i).should("be.visible")

    cy.getDataTest("login-email-input").as("login-emailInput")
    cy.get("@login-emailInput")
      .type("bkemboi590@gmail.com")

    cy.getDataTest("login-password-input").as("login-passwordInput")
    cy.get("@login-passwordInput")
      .type("wrongpassword123")

    cy.getDataTest("login-submit-button").as("login-submitButton")
    cy.get("@login-submitButton")
      .should("contain.text", "Sign In")
      .click()

    cy.getDataTest("login-error")
      .should("be.visible")
      .should("contain.text", "Login failed")
  })

  it("should navigate to register page", () => {
    cy.getDataTest("register-link")
      .should("be.visible")
      .click()

    cy.url().should("include", "/register")
  })

  it("should navigate to forgot password page", () => {
    cy.getDataTest("forgot-password-link")
      .should("be.visible")
      .click()

    cy.url().should("include", "/forgot-password")
  })

  it("should toggle password visibility", () => {
    cy.getDataTest("login-password-input")
      .should("have.attr", "type", "password")

    cy.getDataTest("toggle-password-visibility")
      .click()

    cy.getDataTest("login-password-input")
      .should("have.attr", "type", "text")
  })
})
