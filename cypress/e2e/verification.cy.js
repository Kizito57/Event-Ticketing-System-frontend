// describe("verification functionality", () => {
//   beforeEach(() => {
//     // Visit the verification page (you might need to set this correctly)
//     cy.visit('/verify')
//     cy.viewport(1280, 920)
//   })

//   it("should show verification page elements correctly", () => {
//     // Check page heading and subheading
//     cy.getDataTest("verification-heading").should("be.visible").and("contain.text", "Check Your Email")
//     cy.getDataTest("verification-subheading").should("be.visible").and("contain.text", "We've sent a verification code to your inbox")

//     // Email info box
//     cy.getDataTest("email-info-box").should("be.visible")
//     cy.getDataTest("email-display").should("be.visible").and("contain.text", "@") // crude email check

//     // Verification code input
//     cy.getDataTest("verification-code-input")
//       .should("be.visible")
//       .and("have.attr", "maxLength", "6")
//       .and("have.attr", "placeholder", "000000")

//     // Submit button initially disabled because input empty
//     cy.getDataTest("submit-verification-button").should("be.disabled")
//   })

//   it("should enable submit button only when code length is 6", () => {
//     cy.getDataTest("verification-code-input")
//       .type("123") // less than 6 digits
//     cy.getDataTest("submit-verification-button").should("be.disabled")

//     cy.getDataTest("verification-code-input")
//       .clear()
//       .type("123456") // exactly 6 digits
//     cy.getDataTest("submit-verification-button").should("not.be.disabled")
//   })

//   it("should submit valid verification code and redirect", () => {
//     // Stub or set up server intercept here if needed for API response
    
//     cy.getDataTest("verification-code-input").type("123456")
//     cy.getDataTest("submit-verification-button").click()

//     // Expect redirect to login page (adjust if your actual redirect differs)
//     cy.url().should("include", "/login")

//     // Optionally check for success notification if any
//     // cy.contains(/verification successful/i).should('be.visible')
//   })

//   it("should show error message on invalid verification", () => {
//     // You may want to stub your backend API to return an error here

//     // Type invalid code and submit
//     cy.getDataTest("verification-code-input").type("000000")
//     cy.getDataTest("submit-verification-button").click()

//     // Check for error box visibility
//     cy.getDataTest("error-box").should("be.visible")
//     cy.getDataTest("error-message").should("contain.text", "error") // adjust to your actual error message
//   })

//   it("should navigate back to register page on back button click", () => {
//     cy.getDataTest("back-to-register-button").click()
//     cy.url().should("include", "/register")
//   })
// })
