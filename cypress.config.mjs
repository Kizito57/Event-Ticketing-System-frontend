import { defineConfig } from "cypress";
// import { ClientDomain } from "./src/utils/ApiDomain.ts";

export default defineConfig({
  projectId: 'o5pstg',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:5173", // This is the base URL for your application, where Cypress will start its tests.
  },
});