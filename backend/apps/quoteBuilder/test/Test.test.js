const request = require('supertest');
const app = require('../../../app');

const API_ROOT = "/api/quote/test/"


describe('GET Test', () => {
  it('should return 200 OK', () => {
    return request(app)
      .get(API_ROOT)
      .expect(200);
  });
})
