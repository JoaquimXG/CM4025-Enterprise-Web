const request = require("supertest");
const app = require("../../app");

module.exports = (API_ROOT, defaultTest) => {
  it(`should return 200 OK`, () => {
    return request(app).get(API_ROOT).expect(200);
  });

  it(`should return a list`, async () => {
    const response = await request(app).get(API_ROOT);
    expect(response.body).toBeInstanceOf(Array);
  });

  it(`should return a list of base objects`, async () => {
    const response = await request(app).get(API_ROOT);
    expect(response.body).toEqual(expect.arrayContaining([defaultTest]));
  });
}