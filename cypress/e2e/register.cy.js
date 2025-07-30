// describe("register functionality", () => {
//   beforeEach(() => {
//     cy.visit("/register")
//     cy.viewport(1280, 920)
//   })

//   it("should register with valid inputs", () => {
//     cy.getDataTest("register-first-name").as("firstNameInput")
//     cy.get("@firstNameInput")
//       .should("be.visible")
//       .type("John")

//     cy.getDataTest("register-last-name").as("lastNameInput")
//     cy.get("@lastNameInput")
//       .should("be.visible")
//       .type("Doe")

//     cy.getDataTest("register-email").as("emailInput")
//     cy.get("@emailInput")
//       .should("be.visible")
//       .should("have.attr", "type", "email")
//       .type("dkwanjiru057@gmail.com.com")

//     cy.getDataTest("register-password").as("passwordInput")
//     cy.get("@passwordInput")
//       .should("be.visible")
//       .should("have.attr", "type", "password")
//       .type("mypassword123")

//     cy.getDataTest("register-confirm-password").as("confirmPasswordInput")
//     cy.get("@confirmPasswordInput")
//       .should("be.visible")
//       .should("have.attr", "type", "password")
//       .type("12345678")

//     cy.getDataTest("register-submit-button").as("submitButton")
//     cy.get("@submitButton")
//       .should("contain.text", "Create Account")
//       .should("not.be.disabled")
//       .click()

//     cy.url().should("include", "/verify")
//   })

//   it("should not register if passwords do not match", () => {
//     cy.getDataTest("register-first-name").type("Jane")
//     cy.getDataTest("register-last-name").type("Smith")
//     cy.getDataTest("register-email").type("jane.smith@example.com")
//     cy.getDataTest("register-password").type("password123")
//     cy.getDataTest("register-confirm-password").type("differentPassword")

//     cy.getDataTest("register-submit-button").click()

//     // Expect browser alert
//     cy.on("window:alert", (str) => {
//       expect(str).to.equal("Passwords do not match")
//     })
//   })

//   it("should show error on duplicate email or invalid submission", () => {
//     // Simulate user with existing email or backend error
//     cy.getDataTest("register-first-name").type("User")
//     cy.getDataTest("register-last-name").type("Exists")
//     cy.getDataTest("register-email").type("existing@example.com")
//     cy.getDataTest("register-password").type("password123")
//     cy.getDataTest("register-confirm-password").type("password123")

//     cy.getDataTest("register-submit-button").click()

//     // Assuming your app sets an error message if email exists
//     cy.getDataTest("register-error")
//       .should("be.visible")
//       .should("contain.text", "already exists")
//   })

//   it("should navigate to login page", () => {
//     cy.getDataTest("register-login-link")
//       .should("be.visible")
//       .click()

//     cy.url().should("include", "/login")
//   })
// })
