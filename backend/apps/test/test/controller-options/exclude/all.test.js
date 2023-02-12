const request = require("supertest");
const app = require("../../../../../app");
const {
  // getRetrieveTests,
  getListTests,
  // deleteTests,
  // patchTests,
} = require("../../../../../test/factories");

let API_ROOT = "/api/test/controllerOptions/exclude/all/";

const defaultTest = {};

const base = {
  nullableDefault: true,
  notNullableDefault: true,
};

const createUpdateTests = (f) => {
  it("base -> should return 200 OK", () => {
    return f().send(base).expect(200);
  });

  it("base -> should return object", async () => {
    const response = await f().send(base);
    expect(response.body).toEqual(defaultTest);
  });

};

describe(`POST ${API_ROOT}`, () => {
  createUpdateTests(() => request(app).post(API_ROOT));
});

describe(`GET ${API_ROOT}`, () => {
  getListTests(API_ROOT, defaultTest);
});


// Can't run tests with ID as the API doesn't return an ID to use
// describe(`GET ${API_ROOT}:id/`, () => {
//   getRetrieveTests(API_ROOT, base, defaultTest);
// });

// describe(`PATCH ${API_ROOT}:id/`, () => {
//   patchTests(API_ROOT, base, createUpdateTests);
// });

// describe(`DELETE ${API_ROOT}:id/`, () => {
//   deleteTests(API_ROOT, base);
// });
