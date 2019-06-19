import 'cypress-file-upload';

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});


describe('SelfVerify', () => {


  it('should open webpage', () => {
    cy.visit('https://staging-selfverify.identt.pl/self-verify/?document_id=28671638-c33a-4a8b-accb-f0f200ae9faf&session_id=c75fe2ea-fb7c-4569-a406-b1643e9d6504&');
  });

  it('should assert that title is correct', () => {
    cy.title().should('include', 'Weryfikacja');
  });

  context('Verification', () => {

    it('should be able to open file upload option', () => {
      cy.get('.green').click()
    });

    it('should upload back document', () => {
      cy.get('input[type=file]').parent().should('be.visible');
      cy.fixture('newid', 'base64').then(fileContent => {
        cy.get('input[type=file]').parent().upload(
          { fileContent, fileName: 'newid.jpg', mimeType: 'image/jpeg' },
          { subjectType: 'drag-n-drop' },
        );
      });
    });
    
    it('should resize back image and continue', () => {
      cy.get('.cropper-drag-box').should('be.visible');
      // zoom out 3 times
      for(let i=0; i<3; i++) {
        cy.get(':nth-child(3) > .tr > .w2').click();
      }
      // continue
      cy.get('.tr > .w3').click();
      // await for results
      cy.get('.delayer').should('be.visible');
      cy.wait(5000)
    });

    it('should upload front document', () => {
      cy.get('.delayer', {timeout: 20000}).should('not.be.visible');
      cy.get('input[type=file]').parent().should('be.visible');
      cy.fixture('image_front', 'base64').then(fileContent => {
        cy.get('input[type=file]').parent().upload(
          { fileContent, fileName: 'image_front.jpg', mimeType: 'image/jpeg' },
          { subjectType: 'drag-n-drop' },
        );
      });
    });
        
    it('should resize front image and continue', () => {
      cy.get('.cropper-drag-box').should('be.visible');
      // zoom out 3 timesnpm 
      for(let i=0; i<3; i++) {
        cy.get(':nth-child(3) > .tr > .w2').click();
      }
      // continue
      cy.get('.tr > .w3').click();
      // await for results
      cy.get('.delayer').should('be.visible');
    });


    it('should be redirect to identt.pl', () => {
      cy.get('.delayer', {timeout: 20000}).should('not.be.visible');
      cy.url().should('include', 'https://identt.pl/');
    });

  });

});
