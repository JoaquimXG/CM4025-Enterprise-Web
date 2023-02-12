const request = require("supertest");
const app = require("../../../app");
const {
  getRetrieveTests,
  getListTests,
  deleteTests,
  patchTests,
} = require("../../../test/factories");

const API_ROOT = "/api/test/dateTime/";

const defaultTest = {
  id: expect.any(Number),
  dateTime: expect.any(String),
  dateTimeMaxValue: expect.any(String),
  dateTimeMinValue: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
};

const base = {
  dateTime: "2020-01-01T00:00:00.000Z",
  dateTimeMaxValue: "2000-01-01T00:00:00.000Z",
  dateTimeMinValue: "2025-01-01T00:00:00.000Z",
};

const createUpdateTests = (f, status) => {
  it(`base -> should return ${status} OK`, () => {
    return f().send(base).expect(status);
  });

  it("base -> should return object", async () => {
    const response = await f().send(base);
    expect(response.body).toEqual(defaultTest);
  });

  for (const value of [
    "1932-11-06T23:22:30.439Z",
    "2021-09-03T06:19:08.287Z",
    "1978-11-11T07:58:27.966Z",
    "1900-02-24T16:54:16.472Z",
    "2078-05-12T02:54:16.212Z",
    "1991-12-01T22:04:09.916Z",
    "1984-12-19T15:31:56.736Z",
    "1973-11-11T04:11:52.122Z",
    "2085-12-03T01:50:44.995Z",
    "1932-08-29T20:12:23.063Z",
    // There is really not much point in testing the min and max values for JavaScript
    // dates, as they are larger than the scope of dates acceptable by ISO 8601.
    // I am testing between 1900 and 2100.
    // SHORTEST_VALUE,
    // LONGEST_VALUE,
  ]) {
    it(`dateTime: '${value}' -> should return ${status} OK`, () => {
      let test = { ...base, dateTime: value };
      return f().send(test).expect(status);
    });
  }

  for (const value of [
    354802197427,
    "3/30/1981",
    "3/30/1981 12:00:00 AM",
    "3/30/1981 12:00:00 AM +00:00",
    "3/30/1981 12:00:00 AM +0000",
    "3/30/1981 12:00:00 AM UTC",
    "Mon, 30 Mar 1981 12:09:57 GMT",
    "Mon, 30 Mar 1981 12:09:57 +0000",
    "Mon, 30 Mar 1981 12:09:57 +00:00",
    "2023-02-12T10:46:22+0400",
  ]) {
    it(`dateTime: '${value}' -> should return 400`, () => {
      let test = { ...base, dateTime: value };
      return f().send(test).expect(400);
    });
  }

  for (const value of ["2024-12-31T23:59:59.999Z", "2025-01-01T00:00:00.000Z"]) {
    it(`dateTimeMaxValue(2025-01-01): ${value} -> should return ${status} OK`, () => {
      let test = { ...base, dateTimeMaxValue: value };
      return f().send(test).expect(status);
    });
  }

  for (const value of ["2025-01-01T00:00:00.001Z", "2025-01-02T00:00:00.000Z"]) {
    it(`dateTimeMaxValue(2025-01-01): ${value} -> should return 400`, () => {
      let test = { ...base, dateTimeMaxValue: value };
      return f().send(test).expect(400);
    });
  }

  for (const value of ["2020-01-01T00:00:00.001Z", "2020-01-01T00:00:00.000Z"]) {
    it(`dateTimeMinValue(2020-01-01): ${value} -> should return ${status} OK`, () => {
      let test = { ...base, dateTimeMinValue: value };
      return f().send(test).expect(status);
    });
  }

  for (const value of ["2019-12-31T23:59:59.999Z", "2019-12-31T00:00:00.000Z"]) {
    it(`dateTimeMinValue(2020-01-01): ${value} -> should return 400`, () => {
      let test = { ...base, dateTimeMinValue: value };
      return f().send(test).expect(400);
    });
  }
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
