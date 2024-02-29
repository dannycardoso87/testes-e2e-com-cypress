/* eslint-disable cypress/unsafe-to-chain-command */
/* eslint-disable cypress/no-assigning-return-values */
import '@4tw/cypress-drag-drop'
require('@4tw/cypress-drag-drop')

describe('Scenario3', () => {
  it('scenario3', () => {
    cy.guiLoginProposify()
    const nameDocument = 'Document3'
    cy.createDocument(nameDocument)
    //Click on Signatures Tab
    cy.get('div[data-node-key="signatures_tab"]')
      .click()

    //Drag Signature block to the right edge of the document
    const dataTransfer = new DataTransfer
    cy.get('button.signature_button')
      .trigger('dragstart',{dataTransfer})
    cy.get('.editor__page').trigger('drop',{dataTransfer})

    //Gets the position of the signature block within the page editor
    cy.get('.unsigned_signature.react-draggable').then($el => {
      const position = $el.position()
      const x = position.left
      const y = position.top
      cy.log(`Element's position: x=${x}, y=${y}`)
    })

    //Missing....
    // cy.get('.unsigned_signature.react-draggable')
    //   .trigger('mousedown', { which: 1, clientX: 400, clientY: 600 })
    //   .trigger('mousemove', { which: 1, clientX: 410, clientY: 110 })
    //   .trigger('mouseup')
  })
})
