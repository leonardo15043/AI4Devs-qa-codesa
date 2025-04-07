describe('Position Interface', () => {
  beforeEach(() => {
    // Interceptar las llamadas al backend
    cy.intercept('GET', 'http://localhost:3010/positions/*/interviewFlow').as('getInterviewFlow')
    cy.intercept('GET', 'http://localhost:3010/positions/*/candidates').as('getCandidates')
    cy.intercept('PUT', 'http://localhost:3010/candidates/*').as('updateCandidate')
    
    cy.visit('/positions/1')
    
    // Esperar a que se carguen los datos
    cy.wait('@getInterviewFlow')
    cy.wait('@getCandidates')
  })

  it('should load the position page correctly', () => {
    // Verificar que el título de la posición se muestra
    cy.get('[data-testid="position-title"]').should('be.visible')
    
    // Verificar que se muestran todas las columnas de fases
    cy.get('[data-testid="phase-column"]').should('have.length.at.least', 1)
    
    // Verificar que hay tarjetas de candidatos
    cy.get('[data-testid="candidate-card"]').should('have.length.at.least', 1)
  })

  it('should display candidate information correctly', () => {
    // Verificar que la información del candidato se muestra correctamente
    cy.get('[data-testid="candidate-card"]').first().within(() => {
      cy.get('[data-testid="candidate-name"]').should('be.visible')
      cy.get('[data-testid="candidate-rating"]').should('be.visible')
    })
  })

  it('should allow dragging and dropping candidates between phases', () => {
    // Obtener la primera tarjeta de candidato y la última columna de fase
    const sourceCard = '[data-testid="candidate-card"]:first'
    const targetColumn = '[data-testid="phase-column"]:last'
    
    // Realizar la operación de drag and drop
    cy.get(sourceCard).trigger('mousedown', { which: 1 })
    cy.get(targetColumn).trigger('mousemove').trigger('mouseup', { force: true })
    
    // Verificar que la tarjeta se movió a la nueva columna
    cy.get(targetColumn).find(sourceCard).should('exist')
    
    // Verificar que se realizó la actualización en el backend
    cy.wait('@updateCandidate').its('request.body').should('include', {
      currentInterviewStep: 1 // El ID de la fase destino
    })
  })
}) 