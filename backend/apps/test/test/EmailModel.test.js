const request = require("supertest");
const app = require("../../../app");
const {
  getRetrieveTests,
  getListTests,
  deleteTests,
  patchTests,
} = require("../../../test/factories");

const API_ROOT = "/api/test/email/";

const defaultTest = {
  id: expect.any(Number),
  email: expect.any(String),
};

const base = {
  email: "t@t.com",
};

const createUpdateTests = (f) => {
  it("base -> should return 200 OK", () => {
    return f().send(base).expect(200);
  });

  it("base -> should return object", async () => {
    const response = await f().send(base);
    expect(response.body).toEqual(defaultTest);
  });

  // Valid and invalid emails taken from https://gist.github.com/cjaoude/fd9910626629b53c4d25
  for (const value of [
    "email@example.com",
    "firstname.lastname@example.com",
    "email@subdomain.example.com",
    "firstname+lastname@example.com",
    '"email"@example.com',
    "1234567890@example.com",
    "email@example-one.com",
    "_______@example.com",
    "email@example.name",
    "email@example.museum",
    "email@example.co.jp",
    "firstname-lastname@example.com",
    "あいうえお@example.com",
  ]) {
    it(`email: '${value}' -> should return 200 OK`, () => {
      let test = { ...base, email: value };
      return f().send(test).expect(200);
    });
  }

  for (const value of [
    "plainaddress",
    "#@%^%#$@#$@#.com",
    "@example.com",
    "Joe Smith <email@example.com>",
    "email.example.com",
    "email@example@example.com",
    ".email@example.com",
    "email.@example.com",
    "email..email@example.com",
    "email@example.com (Joe Smith)",
    "email@example",
    "email@-example.com",
    "email@111.222.333.44444",
    "email@example..com",
    "Abc..123@example.com",
  ]) {
    it(`email: '${value}', invalid -> should return 400`, () => {
      let test = { ...base, email: value };
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
