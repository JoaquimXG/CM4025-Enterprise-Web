const request = require("supertest");
const app = require("../../app");

module.exports = (API_ROOT, base, createUpdateTests) => {
  let id = null;
  beforeAll(() =>
    request(app)
      .post(API_ROOT)
      .send(base)
      .then((response) => {
        id = response.body.id;
      })
  );

  createUpdateTests(() => request(app).patch(`${API_ROOT}${id}/`));

  it(`should return 404 Not Found`, async () => {
    return request(app).patch(`${API_ROOT}999999/`).expect(404);
  });
}