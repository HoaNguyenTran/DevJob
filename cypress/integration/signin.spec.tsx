/* eslint-disable jest/valid-expect */
/* eslint-disable cypress/no-async-tests */
/* eslint-disable jest/expect-expect */
import React from 'react'
import { storageConstant } from 'src/constants/storageConstant';
import { v4 as uuidv4 } from 'uuid';

it('Test login', () => {
  const phoneNumber = '0912345679';
  const password = '11111111';
  // expect(1).eq(200)

  cy.visit('https://dev.fjob.com.vn/signin')
  cy.get('#phoneNumber').type(phoneNumber)
  cy.get('#password').type(password);
  
  cy.request('POST', 'https://api.dev.fjob.com.vn/auth/v1.0/users/login', {
    deviceId: localStorage.getItem(storageConstant.localStorage.DeviceId) || uuidv4(),
    phoneNumber,
    password,
  }).should((response) => {
    expect(response.status).to.equal(201)
  });

  cy.get('.ant-btn').click()
  
})