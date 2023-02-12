const request = require("supertest");
const app = require("../../../app");
const {
  getRetrieveTests,
  getListTests,
  deleteTests,
  patchTests,
} = require("../../../test/factories");

const API_ROOT = "/api/test/string/";

const defaultTest = {
  id: expect.any(Number),
  string: expect.any(String),
  stringMaxLength: expect.any(String),
  stringMinLength: expect.any(String),
  stringBlank: expect.any(String),
};

const base = {
  string: "_",
  stringMaxLength: "_",
  stringMinLength: "_".repeat(10),
  stringBlank: "_",
};

const SHORTEST_VALUE = "_";
const LONGEST_VALUE = "_".repeat(255);

const createUpdateTests = (f, status) => {
  it(`base -> should return ${status} OK`, () => {
    return f().send(base).expect(status);
  });

  it("base -> should return object", async () => {
    const response = await f().send(base);
    expect(response.body).toEqual(defaultTest);
  });

  for (const value of [
    "test",
    "woo",
    "☮ ☯ ☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷ ☸ ☹ ☺ ☻ ☼ ☽ ☾ ☿ ♀ ♁ ♂ ♃ ♄ ♅ ♆",
    "㈤ ㈥ ㈦ ㈧ ㈨ ㈩ ㈪ ㈫ ㈬ ㈭ ㈮ ㈯ ㈰ ㈱ ㈲ ㈳ ㈴ ㈵ ㈶ ㈷ ㈸ ㈹ ㈺ ㈻",
    "જ ઝ ઞ ટ ઠ ડ ઢ ણ ત થ દ ધ ન પ ફ બ ભ મ ય ર",
    "«ταБЬℓσ»: 1<2 & 4+1>3, now 20% off!",
    SHORTEST_VALUE,
    LONGEST_VALUE,
  ]) {
    it(`string: '${value}' -> should return ${status} OK`, () => {
      let test = { ...base, string: value };
      return f().send(test).expect(status);
    });
  }

  for (const value of ["", LONGEST_VALUE + "_", null]) {
    it(`string: '${value}', out of range -> should return 400`, () => {
      let test = { ...base, string: value };
      return f().send(test).expect(400);
    });
  }

  for (const key of Object.keys(base)) {
    it(`key: ${key} int instead of string -> should return ${status} OK`, () => {
      let test = { ...base };
      test[key] = 1000000000; // Should be 10 characters long
      return f().send(test).expect(status);
    });
  }

  for (const value of [SHORTEST_VALUE, "_".repeat(50)]) {
    it(`stringMaxLength(50): '${value}' -> should return ${status} OK`, () => {
      let test = { ...base, stringMaxLength: value };
      return f().send(test).expect(status);
    });
  }

  for (const value of ["", "_".repeat(51)]) {
    it(`stringMaxLength(50): '${value}' -> should return 400`, () => {
      let test = { ...base, stringMaxLength: value };
      return f().send(test).expect(400);
    });
  }

  for (const value of ["_".repeat(10), LONGEST_VALUE]) {
    it(`stringMinLength(10): '${value}' -> should return ${status} OK`, () => {
      let test = { ...base, stringMinLength: value };
      return f().send(test).expect(status);
    });
  }

  for (const value of ["_".repeat(9), SHORTEST_VALUE]) {
    it(`stringMinLength(10): '${value}' -> should return 400`, () => {
      let test = { ...base, stringMinLength: value };
      return f().send(test).expect(400);
    });
  }

  for (const value of [SHORTEST_VALUE, LONGEST_VALUE]) {
    it(`stringBlank: '${value}' -> should return ${status} OK`, () => {
      let test = { ...base, stringBlank: value };
      return f().send(test).expect(status);
    });
  }

  it(`stringBlank: "" -> should return 400`, () => {
    let test = { ...base, stringBlank: "" };
    return f().send(test).expect(400);
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
