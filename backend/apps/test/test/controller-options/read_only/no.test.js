const request = require("supertest");
const app = require("../../../../../app");
const {
  getRetrieveTests,
  getListTests,
  deleteTests,
  patchTests,
} = require("../../../../../test/factories");

let API_ROOT = "/api/test/controllerOptions/read_only/no/";

/**
 * No fields are read only, we will send false for both fields,
 * and expect false for both fields in return.
 */
const defaultTest = {
  id: expect.any(Number),
  nullableDefault: false,
  notNullableDefault: false,
};

const base = {
  nullableDefault: false,
  notNullableDefault: false,
};

const createUpdateTests = (f, status) => {
  it(`base -> should return ${status} OK`, () => {
    return f().send(base).expect(status);
  });

  it("base -> should return object", async () => {
    const response = await f().send(base);
    expect(response.body).toEqual(defaultTest);
  });

};

describe(`POST ${API_ROOT}`, () => {
  createUpdateTests(() => request(app).post(API_ROOT), 201);
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
