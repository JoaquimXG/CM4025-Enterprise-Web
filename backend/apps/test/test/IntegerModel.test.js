const request = require("supertest");
const app = require("../../../app");
const {
  getRetrieveTests,
  getListTests,
  deleteTests,
  patchTests,
} = require("../../../test/factories/");

const API_ROOT = "/api/test/int/";

const defaultTest = {
  id: expect.any(Number),
  int: expect.any(Number),
  intMaxValue: expect.any(Number),
  intMinValue: expect.any(Number),
};

const base = {
  int: 1,
  intMaxValue: 1,
  intMinValue: 1,
};

const MIN_VALUE = -2147483648;
const MAX_VALUE = 2147483647;

const createUpdateTests = (f) => {
  it("base -> should return 200 OK", () => {
    return f().send(base).expect(200);
  });

  it("base -> should return object", async () => {
    const response = await f().send(base);
    expect(response.body).toEqual(defaultTest);
  });

  for (const value of [
    -1,
    0,
    1,
    100,
    -100,
    1000,
    -1000,
    MIN_VALUE,
    MAX_VALUE,
  ]) {
    it(`int: ${value} -> should return 200 OK`, () => {
      let test = { ...base, int: value };
      return f().send(test).expect(200);
    });
  }

  for (const value of [MIN_VALUE - 1, MAX_VALUE + 1]) {
    it(`int: ${value}, out of range -> should return 400`, () => {
      let test = { ...base, int: value };
      return f().send(test).expect(400);
    });
  }

  for (const key of Object.keys(base)) {
    it(`key: ${key} string instead of int -> should return 400`, () => {
      let test = { ...base };
      test[key] = "test";
      return f().send(test).expect(400);
    });
  }

  for (const value of [MIN_VALUE, 0, 50]) {
    it(`intMaxValue(50): ${value} -> should return 200 OK`, () => {
      let test = { ...base, intMaxValue: value };
      return f().send(test).expect(200);
    });
  }

  for (const value of [51, MAX_VALUE]) {
    it(`intMaxValue(50): ${value} -> should return 400`, () => {
      let test = { ...base, intMaxValue: value };
      return f().send(test).expect(400);
    });
  }

  for (const value of [MAX_VALUE, 0, -50]) {
    it(`intMinValue(-50): ${value} -> should return 200 OK`, () => {
      let test = { ...base, intMinValue: value };
      return f().send(test).expect(200);
    });
  }

  for (const value of [-51, MIN_VALUE]) {
    it(`intMinValue(-50): ${value} -> should return 400`, () => {
      let test = { ...base, intMinValue: value };
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
