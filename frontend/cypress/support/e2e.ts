/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      dragAndDrop(sourceSelector: string, targetSelector: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('dragAndDrop', (sourceSelector, targetSelector) => {
  cy.get(sourceSelector).trigger('mousedown', { which: 1 })
  cy.get(targetSelector).trigger('mousemove').trigger('mouseup', { force: true })
}) 