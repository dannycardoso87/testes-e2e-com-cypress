
describe('Scenario2', () => {
  it('scenario2', () => {
    cy.guiLoginProposify()
    const nameDocument = 'Document2'
    cy.createDocument(nameDocument)

    //Click on content tab
    cy.get('div[data-node-key="content_tab"]')
      .click()

    //Click on Image Block
    cy.get('div[data-testid="image-block-button"] .ant-typography')
      .should('have.text', 'Image')
      .click()

    //Upload first image
    cy.get('[type="file"]')
      .selectFile('cypress/fixtures/Logo.png', {force:true})
    cy.get('.ant-notification-notice-message')
      .should('be.visible')
      .should('contain', 'Good news! Your upload worked! Check the image library to see for yourself.')

    //Upload second image
    cy.get('[type="file"]')
      .selectFile('cypress/fixtures/Proposify.png', {force:true})
    cy.get('.ant-notification-notice-message')
      .should('be.visible')
      .should('contain', 'Good news! Your upload worked! Check the image library to see for yourself.')

    //Check if the 2 images were uploaded
    cy.get('.MuiImageListItem-img')
      .its('length')
      .should('be.at.least', 2)
  })
})
