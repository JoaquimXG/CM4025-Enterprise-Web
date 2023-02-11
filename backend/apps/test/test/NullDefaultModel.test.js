const request = require("supertest");
const app = require("../../../app");
const {
  getRetrieveTests,
  getListTests,
  deleteTests,
  patchTests,
} = require("../../../test/factories");

const API_ROOT = "/api/test/nullDefault/";

const defaultTest = {
  id: expect.any(Number),
  nullable: expect.any(Boolean), // Can't expect as could be null
  notNullable: expect.any(Boolean),
  nullableDefault: expect.any(Boolean),
  notNullableDefault: expect.any(Boolean),
};

const base = {
  nullable: true,
  notNullable: true,
  nullableDefault: true,
  notNullableDefault: true,
};

const createUpdateTests = (f) => {
  it("base -> should return 200 OK", () => {
    return f().send(base).expect(200);
  });

  it("base -> should return object", async () => {
    const response = await f().send(base);
    expect(response.body).toEqual(expect.objectContaining(defaultTest));
  });

  it("nullable: null -> should return 200 OK", () => {
    let test = { ...base, nullable: null };
    return f().send(test).expect(200);
  });

  it("nullable: null -> should return object", async () => {
    let test = { ...base, nullable: null };
    const response = await f().send(test);
    expect(response.body).toEqual(expect.objectContaining(defaultTest));
  });

  it("notNullable: null -> should return 400", () => {
    let test = { ...base, notNullable: null };
    return f().send(test).expect(400);
  });

  it("nullableDefault: null -> should return 200 OK", () => {
    let test = { ...base, nullableDefault: null };
    return f().send(test).expect(200);
  });

  it("nullableDefault: null -> should return object", async () => {
    let test = { ...base, nullableDefault: null };
    const response = await f().send(test);
    expect(response.body).toEqual(expect.objectContaining(defaultTest));
  });

  it("notNullableDefault: null -> should return 400", () => {
    let test = { ...base, notNullableDefault: null };
    return f().send(test).expect(400);
  });

  it("notNullableDefault: Empty -> should return 200 OK", () => {
    let test = { ...base };
    delete test.notNullableDefault;
    return f().send(test).expect(200);
  });
};

describe(`POST ${API_ROOT}`, () => {
  createUpdateTests(() => request(app).post(API_ROOT));

  it("notNullable: Empty -> should 400", () => {
    let test = { ...base };
    delete test.notNullable;
    return request(app).post(API_ROOT).send(test).expect(400);
  });
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
