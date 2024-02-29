describe('Login', () => {
  it('successfully logs in', () => {
    cy.guiLogin()
    cy.wait('@getNotes')
    cy.contains('a', 'Create a new note').should('be.visible')
  })
})
