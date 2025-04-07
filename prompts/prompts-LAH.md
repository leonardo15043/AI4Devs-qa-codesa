# 💎 Pruebas E2E con Cypress - Interfaz "Position" 🎲

> 😎 Leonardo

## Contexto

Estás trabajando en una aplicación de gestión de procesos de contratación que incluye una interfaz llamada "Position", donde se visualizan las fases de selección de candidatos y se pueden mover los perfiles entre ellas mediante "drag and drop". Esta interfaz ya fue desarrollada previamente, y ahora tu misión es asegurarte de que funciona correctamente a través de pruebas automatizadas de extremo a extremo (E2E) utilizando Cypress.


## Objetivo

Implementar una batería de pruebas E2E que verifique la correcta funcionalidad de la interfaz "Position", asegurando que:

- La vista se carga correctamente.

- La información de candidatos y fases se muestra adecuadamente.

- Las interacciones con la UI (como mover candidatos entre fases) actualizan correctamente tanto el frontend como el backend.

---

## Tareas a realizar

Verificación de carga de la página "Position":

- Asegúrate de que el título de la posición se muestra correctamente.

- Verifica que se muestran todas las columnas correspondientes a las fases del proceso de selección.

- Comprueba que las tarjetas de los candidatos aparecen en la columna correcta según su fase actual.

Cambio de fase de un candidato:

- Simula el arrastre de una tarjeta de candidato desde una columna a otra.

- Verifica que la tarjeta se mueve visualmente a la nueva columna.

Confirma que se realiza correctamente la actualización en el backend a través del endpoint PUT /candidate/:id.

> 👾 Cursor

Entiendo que necesitamos implementar pruebas E2E para la interfaz de "Position" usando Cypress. Primero, voy a verificar la estructura del proyecto para ver dónde debemos implementar estas pruebas.

Veo que tenemos una estructura típica de proyecto con frontend y backend separados. Primero, necesitamos verificar si ya existe una configuración de Cypress en el proyecto.

Primero, necesitamos instalar Cypress en el proyecto frontend. Voy a proponer el comando para instalar Cypress y sus dependencias necesarias.

```
cd frontend && npm install --save-dev cypress @types/cypress
____________________________________________________________

  run `npm fund` for details

23 vulnerabilities (3 low, 7 moderate, 13 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.

C:\Users\leonardo15043\Documents\LIDR Academy\Ejercicios\AI4Devs-qa-codesa\frontend>^C

C:\Users\leonardo15043\Documents\LIDR Academy\Ejercicios\AI4Devs-qa-codesa\frontend>
C:\Users\leonardo15043\Documents\LIDR Academy\Ejercicios\AI4Devs-qa-codesa\frontend>
```
Cypress se ha instalado correctamente. Ahora, vamos a crear la estructura de pruebas necesaria. Primero, necesitamos crear el directorio de pruebas y el archivo de configuración de Cypress.
Voy a crear el archivo de configuración de Cypress y la estructura de directorios para nuestras pruebas:
```
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
}) 
```
Ahora, vamos a crear el archivo de soporte para las pruebas:

```
// <reference types="cypress" />

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
```
Ahora, vamos a crear el archivo de pruebas para la interfaz de Position:
```
describe('Position Interface', () => {
  beforeEach(() => {
    cy.visit('/position/1') // Asumiendo que la ruta es /position/:id
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
      cy.get('[data-testid="candidate-status"]').should('be.visible')
    })
  })

  it('should allow dragging and dropping candidates between phases', () => {
    // Obtener la primera tarjeta de candidato y la primera columna de fase
    const sourceCard = '[data-testid="candidate-card"]:first'
    const targetColumn = '[data-testid="phase-column"]:last'
    
    // Realizar la operación de drag and drop
    cy.dragAndDrop(sourceCard, targetColumn)
    
    // Verificar que la tarjeta se movió a la nueva columna
    cy.get(targetColumn).find(sourceCard).should('exist')
    
    // Verificar que se realizó la actualización en el backend
    cy.wait('@updateCandidate').its('request.body').should('include', {
      phase: 'new-phase-id' // Reemplazar con el ID de la fase destino
    })
  })
}) 
```
Ahora necesitamos actualizar el package.json del frontend para incluir los scripts de Cypress:
```
"start": "react-scripts start",
    "build": "react-scripts build",
    "test": "jest --config jest.config.js",
    "eject": "react-scripts eject",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "test:e2e": "cypress run"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@types/cypress": "^0.1.6",
    "cypress": "^14.2.1"
  }
}
```
Para que las pruebas funcionen correctamente, necesitamos asegurarnos de que el frontend tenga los atributos data-testid en los componentes relevantes. Voy a buscar los componentes relacionados con la interfaz de Position:
Basado en la búsqueda, veo que necesitamos agregar los atributos data-testid a los componentes relevantes. Voy a modificar los componentes para incluir estos atributos:
Primero, modificaré el componente PositionDetails.js:

```
 <Button variant="link" onClick={() => navigate('/positions')} className="mb-3">
                Volver a Posiciones
            </Button>
            <h2 data-testid="position-title" className="text-center mb-4">{positionName}</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <Row>
                    {stages.map((stage, index) => (
                        <StageColumn key={index} stage={stage} index={index} onCardClick={handleCardClick} />
                    ))}
                </Row>
            </DragDropContext>
            <CandidateDetails candidate={selectedCandidate} onClose={closeSlide} />
        </Container>
    );
};

export default PositionsDetails;
```
Ahora, modificaré el componente StageColumn.js:

```
<Col md={3}>
        <Droppable droppableId={`${index}`}>
            {(provided) => (
                <Card className="mb-4" ref={provided.innerRef} {...provided.droppableProps} data-testid="phase-column">
                    <Card.Header className="text-center">{stage.title}</Card.Header>
                    <Card.Body>
                        {stage.candidates.map((candidate, idx) => (
                            <CandidateCard key={candidate.id} candidate={candidate} index={idx} onClick={onCardClick} />
                        ))}
                        {provided.placeholder}
                    </Card.Body>
                </Card>
            )}
        </Droppable>
    </Col>
);

export default StageColumn;
```
Finalmente, modificaré el componente CandidateCard.js:

```
{...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={() => onClick(candidate)}
                data-testid="candidate-card"
            >
                <Card.Body>
                    <Card.Title data-testid="candidate-name">{candidate.name}</Card.Title>
                    <div data-testid="candidate-rating">
                        {Array.from({ length: candidate.rating }).map((_, i) => (
                            <span key={i} role="img" aria-label="rating">🟢</span>
                        ))}
```
Ahora que hemos agregado los atributos data-testid necesarios, vamos a actualizar el archivo de pruebas para incluir la intercepción de la llamada al backend:
```
cy.intercept('GET', 'http://localhost:3010/positions/*/interviewFlow').as('getInterviewFlow')
    cy.intercept('GET', 'http://localhost:3010/positions/*/candidates').as('getCandidates')
    cy.intercept('PUT', 'http://localhost:3010/candidates/*').as('updateCandidate')
    
    cy.visit('/positions/1')
    
    // Esperar a que se carguen los datos
    cy.wait('@getInterviewFlow')

...

 cy.get('[data-testid="candidate-rating"]').should('be.visible')

...

cy.get(sourceCard).trigger('mousedown', { which: 1 })
cy.get(targetColumn).trigger('mousemove').trigger('mouseup', { force: true })

...

currentInterviewStep: 1 // El ID de la fase destino
    
```

Ahora que hemos configurado todo lo necesario, aquí está un resumen de lo que hemos hecho:
1. Instalamos Cypress y sus dependencias en el proyecto frontend.
2. Creamos la configuración básica de Cypress.
3. Agregamos los atributos data-testid a los componentes relevantes:
 - PositionDetails.js: para el título de la posición
 - StageColumn.js: para las columnas de fases
 - CandidateCard.js: para las tarjetas de candidatos y su información
4. Implementamos las pruebas E2E que verifican:
 - La carga correcta de la página
 - La visualización de la información de los candidatos
 - La funcionalidad de drag and drop entre fases
 - La actualización correcta en el backend
Para ejecutar las pruebas, puedes usar los siguientes comandos:

1. Para abrir Cypress en modo interactivo
```
npm run cypress:open
```
2. Para ejecutar las pruebas en modo headless
 ```
npm run cypress:run
```
3. O usar el comando específico para pruebas E2E
```
npm run test:e2e
```
¿Necesitas que realice algún ajuste adicional en las pruebas o en la configuración?