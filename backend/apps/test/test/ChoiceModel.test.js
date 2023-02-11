const request = require("supertest");
const app = require("../../../app");
const {
  getRetrieveTests,
  getListTests,
  deleteTests,
  patchTests,
} = require("../../../test/factories");

const API_ROOT = "/api/test/choice/";

const defaultTest = {
  id: expect.any(Number),
  bool: expect.any(Boolean),
  string: expect.any(String),
  int: expect.any(Number),
};

const base = {
  string: "a",
  int: 1,
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

  for (const value of ["a", "b", "c"]) {
    it(`string: '${value}' -> should return 200 OK`, () => {
      let test = { ...base, string: value };
      return f().send(test).expect(200);
    });
  }

  for (const value of ["d", "_", "", "aa", "bb"]) {
    it(`string: '${value}' -> should return 400`, () => {
      let test = { ...base, string: value };
      return f().send(test).expect(400);
    });
  }

  for (const value of [1, 2, 3, "1", "2", "3"]) {
    it(`int: '${value}' -> should return 200 OK`, () => {
      let test = { ...base, int: value };
      return f().send(test).expect(200);
    });
  }

  for (const value of [4, 5, -1, 0]) {
    it(`int: '${value}' -> should return 400`, () => {
      let test = { ...base, int: value };
      return f().send(test).expect(400);
    });
  }

  for (const value of [true, false, "true", "false"]) {
    it(`bool: '${value}' -> should return 200 OK`, () => {
      let test = { ...base, bool: value };
      return f().send(test).expect(200);
    });
  }

  for (const value of ["T", "F", 1, 0, "1", "0"]) {
    it(`bool: '${value}' -> should return 400`, () => {
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
