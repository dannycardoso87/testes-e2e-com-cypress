import '@4tw/cypress-drag-drop'
require('@4tw/cypress-drag-drop')

Cypress.Commands.add('fillSignupFormAndSubmit', (email, password) => {
  cy.intercept('GET', '**/notes').as('getNotes')
  cy.visit('/signup')
  cy.get('#email').type(email)
  cy.get('#password').type(password, { log: false })
  cy.get('#confirmPassword').type(password, { log: false }) //hide the password in tests
  cy.contains('button', 'Signup').click()
  cy.get('#confirmationCode').should('be.visible')
  cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVER_ID'), {
    sentTo: email
  }).then(message => {
    const confirmationCode = message.html.body.match(/\d{6}/)[0]
    cy.get('#confirmationCode').type(`${confirmationCode}{enter}`)
    cy.wait('@getNotes')
  })
})

Cypress.Commands.add('guiLogin', (
  username = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD')
) => {
  //interceptar requisicoes para tornar testes mais robustos
  //ou seja, "cypress: escuta requisicoes do tipo GET que termine com /notes e dar um nome de getNotes"
  cy.intercept('GET', '**/notes').as('getNotes')
  cy.visit('/login')
  cy.get('#email').type(username)
  cy.get('#password').type(password, { log: false })
  cy.contains('button', 'Login').click()
  cy.wait('@getNotes')
  cy.contains('h1', 'Your Notes').should('be.visible')
})

Cypress.Commands.add('sessionLogin', (
  username = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD')
) => {
  const login = () => cy.guiLogin(username, password)
  cy.session(username, login)
  //guarda a sessao com o mesmo login
})

const attachFileHandler = () => {
  cy.get('#file').selectFile('cypress/fixtures/example.json')
}

Cypress.Commands.add('createNote', (note, attachFile = false) => {
  cy.visit('/notes/new')
  cy.get('#content').type(note)
  if (attachFile) {
    attachFileHandler()
  }
  cy.contains('button', 'Create').click()
  cy.contains('.list-group-item', note).should('be.visible')
})

Cypress.Commands.add('editNote', (note, newNoteValue, attachFile = false) => {
  cy.intercept('GET', '**/notes/**').as('getNote')
  cy.contains('.list-group-item', note).click()
  cy.wait('@getNote')
  cy.get('#content')
    .as('contentField')
    .clear()
  cy.get('@contentField')
    .type(newNoteValue)
  if (attachFile) {
    attachFileHandler()
  }
  cy.contains('button', 'Save').click()
  cy.contains('.list-group-item', newNoteValue).should('be.visible')
  cy.contains('.list-group-item', note).should('not.exist')
})

Cypress.Commands.add('deleteNote', note => {
  cy.contains('.list-group-item', note).click()
  cy.contains('button', 'Delete').click()
  cy.get('.list-group-item')
    .its('length')
    .should('be.at.least', 1)
  cy.contains('.list-group-item', note)
    .should('not.exist')
})

Cypress.Commands.add('fillSettingsFormAndSubmit', () => {
  cy.visit('/settings')
  cy.get('#storage').type('1')
  cy.get('#name').type('Mary Doe')
  cy.iframe('.card-field iframe')
    .as('iframe')
    .find('[name="cardnumber"]')
    .type('4242424242424242')
  cy.get('@iframe')
    .find('[name="exp-date"]')
    .type('1271')
  cy.get('@iframe')
    .find('[name="cvc"]')
    .type('123')
  cy.get('@iframe')
    .find('[name="postal"]')
    .type('12345')
  cy.contains('button', 'Purchase').click()
})

//=======Proposify

// Login Proposify
// Cypress.Commands.add('loginProposify', (
//   username = Cypress.env('USER_EMAIL'),
//   password = Cypress.env('USER_PASSWORD')
// ) => {
//   cy.visit('/login')
//   cy.get('#pyLoginEmail').type(username)
//   cy.get('#pyLoginPassword').type(password, { log: false }) //hide the password in tests
//   cy.contains('button', 'Login').click()
//   cy.contains('h1', 'Welcome to Proposify, Danny!').should('be.visible')
// })

Cypress.Commands.add('guiLoginProposify', (
  username = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD')
) => {
  cy.visit('/login')
  cy.get('#pyLoginEmail').type(username)
  cy.get('#pyLoginPassword').type(password, { log: false })
  cy.contains('button', 'Login').click()
  cy.contains('h1', 'Welcome to Proposify, Danny!')
    .should('be.visible')
})

Cypress.Commands.add('sessionLoginProposify', (
  username = Cypress.env('USER_EMAIL'),
  password = Cypress.env('USER_PASSWORD')
) => {
  const login = () => cy.guiLoginProposify(username, password)
  cy.session(username, login)
  //save the session
})

Cypress.Commands.add('createDocument', (nameDocument) => {
  cy.get('span.svg-proposify-logo')
    .should('be.visible')
    .click()
  cy.get('[data-testid="create-document-button"]')
    .click()
  cy.get('div.ant-typography.proposify-typography.default-font.size-sm.timestamp-ml-xs')
    .should('be.visible')
    .should('include.text', 'Saved')
  cy.contains('div[aria-labelledby="rc-tabs-1-tab-document_tab"]', 'Coming soon...')
    .should('be.visible')
  cy.get('input.document-title')
    .clear()
  cy.get('input.document-title')
    .type(nameDocument)
})

Cypress.Commands.add('deleteDocument', (nameDocument) => {
  cy.get('button[data-testid="trash-area-'+nameDocument+'"]')
    .click()
  cy.contains('.ant-list-items', nameDocument)
    .should('not.exist')
})

Cypress.Commands.add('emptyTrash', () => {
  cy.get('div[data-node-key="trash"] .ant-tabs-tab-btn')
    .click()
  cy.get('button.snackbar-btn')
    .click()
  cy.get('button[data-testid="buttonBase"].primary')
    .click()
  cy.get('.ant-list-empty-text')
    .should('have.text', 'No items in Trash')
})
