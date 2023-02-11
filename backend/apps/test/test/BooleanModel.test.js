const request = require("supertest");
const { boolean } = require("yargs");
const app = require("../../../app");
const {
  getRetrieveTests,
  getListTests,
  deleteTests,
  patchTests,
} = require("../../../test/factories");

const API_ROOT = "/api/test/bool/";

const defaultTest = {
  id: expect.any(Number),
  bool: expect.any(Boolean),
};

const base = {
  bool: true,
};

const createUpdateTests = (f) => {
  it("base -> should return 200 OK", () => {
    return f().send(base).expect(200);
  });

  it("base -> should return object", async () => {
    const response = await f().send(base);
    expect(response.body).toEqual(defaultTest);
  });

  for (const value of [true, false, "true", "false", 1, 0]) {
    it(`bool: '${value}' -> should return 200 OK`, () => {
      let test = { ...base, bool: value };
      return f().send(test).expect(200);
    });
  }

  for (const value of [null, "test", 2, -1]) {
    it(`bool: '${value}', not allowed -> should return 400`, () => {
      let test = { ...base, bool: value };
      return f().send(test).expect(400);
    });
  }
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
