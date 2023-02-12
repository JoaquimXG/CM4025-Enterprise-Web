const request = require("supertest");
const app = require("../../../../../app");
const {
  getRetrieveTests,
  getListTests,
  deleteTests,
  patchTests,
} = require("../../../../../test/factories");

let API_ROOT = "/api/test/controllerOptions/read_only/partial/";

/**
 * notNullableDefault is read only, we will send false for both fields,
 * and expect true for notNullableDefault, and false for nullableDefault.
 */
const defaultTest = {
  id: expect.any(Number),
  nullableDefault: false,
  notNullableDefault: true,
};

const base = {
  nullableDefault: false,
  notNullableDefault: false,
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

describe(`GET ${API_ROOT}:id/`, () => {
  getRetrieveTests(API_ROOT, base, defaultTest);
});

describe(`PATCH ${API_ROOT}:id/`, () => {
  patchTests(API_ROOT, base, createUpdateTests);
});

describe(`DELETE ${API_ROOT}:id/`, () => {
  deleteTests(API_ROOT, base);
});
