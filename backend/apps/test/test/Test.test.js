const request = require("supertest");
const app = require("../../../app");

const API_ROOT = "/api/quote/test/";

const defaultTestModel = {
  id: expect.any(Number),
  testInt: null,
  testIntWithDefaultValueAllowNullFalse: 100,
  testIntWithDefaultValueAllowNullTrue: 100,
  testIntWithMax: null,
  testString: null,
  testStringWithDefaultValueAllowNullFalse: "test",
  testStringWithDefaultValueAllowNullTrue: "test",
  testStringWithLength: null,
  testIntAllowNullFalse: expect.any(Number),
};



id = 0;


describe("POST Test", () => {
  it("should return 200 OK", () => {
    return request(app).post(API_ROOT).send({ testInt: "test" }).expect(200);
  });
});


  request(app)
    .post(API_ROOT)
    .send({ testIntAllowNullFalse: 50 })
    .then((response) => {
      id = response.body.id;
    });


describe("GET Test", () => {
  id = 0;

  it("should return 200 OK", async () => {
    return request(app).get(API_ROOT).expect(200);
  });

  it("should return a list", async () => {
    return request(app)
      .get(API_ROOT)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
      });
  });

  it("should return a single object", async () => {
    return request(app)
      .get(`${API_ROOT}${id}/`)
      .then((response) => {
        expect(response.body).toEqual({
          ...defaultTestModel,
          id: id,
          testIntAllowNullFalse: 50,
        });
      });
  });
});