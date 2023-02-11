const request = require("supertest");
const app = require("../../app");

module.exports = (API_ROOT, base) => {
  let id = null;
  beforeAll(() =>
    request(app)
      .post(API_ROOT)
      .send(base)
      .then((response) => {
        id = response.body.id;
      })
  );

  it(`should return 204 No Content`, async () => {
    return request(app).delete(`${API_ROOT}${id}/`).expect(204);
  });

  it(`should return 404 Not Found`, async () => {
    return request(app).delete(`${API_ROOT}${id}/`).expect(404);
  });
}