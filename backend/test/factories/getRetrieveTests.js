const request = require("supertest");
const app = require("../../app");

module.exports = (API_ROOT, base, defaultTest) => {
  let id = null;
  beforeAll(() =>
    request(app)
      .post(API_ROOT)
      .send(base)
      .then((response) => {
        id = response.body.id;
      })
  );

  it(`should return 200 OK`, async () => {
    return request(app).get(`${API_ROOT}${id}/`).expect(200);
  });

  it(`should return a single object`, async () => {
    const response = await request(app).get(`${API_ROOT}${id}/`);
    expect(response.body).toEqual({ ...defaultTest, id: id });
  });

  it(`should return 404 Not Found`, async () => {
    return request(app).get(`${API_ROOT}999999/`).expect(404);
  });
};
