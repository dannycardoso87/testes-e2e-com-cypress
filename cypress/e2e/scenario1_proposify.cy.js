
describe('Scenario1', () => {
  it('scenario1', () => {
    cy.guiLoginProposify()
    const nameDocument = 'Document1'
    cy.createDocument(nameDocument)

    //Return List Documents
    cy.get('li[title="Documents List"]')
      .click()

    //Assert there is a filter bar
    cy.get('div[data-testid="status-filter-bar"]')
      .should('be.visible')
      .should('contain.text', 'All')
      .should('contain.text', 'Draft')
      .should('contain.text', 'Approval')
      .should('contain.text', 'Sent')
      .should('contain.text', 'Unsigned')
      .should('contain.text', 'Lost')
      .should('contain.text', 'Won')

    //Clicking on the Draft filter shows the document that was created
    cy.get('button[value="Draft"]')
      .click()

    //The returned document contains the status Draft
    cy.contains('.ant-list-items', nameDocument)
      .should('be.visible')
      .find('.MuiChip-label')
      .should('contain.text', 'Draft')

    cy.deleteDocument(nameDocument)

    cy.emptyTrash()
  })
})
