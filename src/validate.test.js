import validate from "./validate.js";

describe("Validate.email", () => {
  test("Empty string returns false", () => {
    expect(validate.email("")).toBe(false);
  });

  test("Non string values returns false", () => {
    expect(validate.email(null)).toBe(false);
    expect(validate.email(undefined)).toBe(false);
    expect(validate.email({})).toBe(false);
  });

  test("Email must be atleast 6 chars in length", () => {
    expect(validate.email("s@s.c")).toBe(false);
    expect(validate.email("s@s.co")).toBe(true);
  });

  test("Email length must not exceed 254 chars", () => {
    // 254 char length email
    expect(
      validate.email(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123@example.com"
      )
    ).toBe(true);

    // 255 character length email
    expect(
      validate.email(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123@example1.com"
      )
    ).toBe(false);
  });

  test("Email with invalid chars return false", () => {
    [
      "<sam>@example.com",
      "sam.(dos)@example.com",
      '"sam.dos@example.com',
      "sam@example.c0",
      "sam@example.c",
    ].forEach((email) => expect(validate.email(email)).toBe(false));
  });

  test("Valid emails return true", () => {
    [
      "john@example.com",
      "john.doe@example.com",
      '"<sam>"@example.com',
      "foo.bar.baz@example.com",
      "foo.bar@[192.168.122.113]",
      "foo.bar@example01.az",
    ].forEach((email) => expect(validate.email(email)).toBe(true));
  });
});

describe("Validate.mobile", () => {
  test("Empty string returns false", () => {
    expect(validate.mobile("")).toBe(false);
  });

  test("Non string values returns false", () => {
    expect(validate.mobile(null)).toBe(false);
    expect(validate.mobile(undefined)).toBe(false);
    expect(validate.mobile({})).toBe(false);
  });

  test("Space characters return false", () => {
    expect(validate.mobile("9924 248 236")).toBe(false);
  });

  test("Non numeric characters return false", () => {
    expect(validate.mobile("+992424823")).toBe(false);
  });

  test("Must be 10 characters long, else return false", () => {
    expect(validate.mobile("919924248232")).toBe(false);
    expect(validate.mobile("992424823")).toBe(false);
  });

  test("Valid Numbers return true", () => {
    expect(validate.mobile("9924248232")).toBe(true);
  });
});

describe("Validate.password", () => {
  // test("", () => {});

  test("Empty string returns false", () => {
    expect(validate.password("", 5)).toBe(false);
  });

  test("Non string values returns false", () => {
    expect(validate.password(null, 5)).toBe(false);
    expect(validate.password(undefined, 5)).toBe(false);
    expect(validate.password({}, 5)).toBe(false);
  });

  test("Password must be atleast 10 chars in length", () => {
    expect(validate.password("abcdefghi", 5)).toBe(false);
    expect(validate.password("abcdefghia", 5)).toBe(true);
  });

  test("Password strength must be atleast 3", () => {
    expect(validate.password("abcdefghia", 2)).toBe(false);
    expect(validate.password("abcdefghia", 5)).toBe(true);
  });
});

describe("validate.string", () => {
  test("Empty string returns false", () => {
    expect(validate.string("", {})).toBe(false);
  });

  test("Non string values returns false", () => {
    expect(validate.string(null, {})).toBe(false);
    expect(validate.string(undefined, {})).toBe(false);
    expect(validate.string({}, {})).toBe(false);
  });

  test("Option.fixedLength", () => {
    expect(validate.string("abcd", { fixedLength: 5 })).toBe(false);
    expect(validate.string("abcd", { fixedLength: 4 })).toBe(true);
  });

  test("Option.min", () => {
    const min = 5;
    expect(validate.string("abcd", { min })).toBe(false);
    expect(validate.string("abcde", { min })).toBe(true);
    expect(validate.string("abcdef", { min })).toBe(true);
  });

  test("Option.max", () => {
    const max = 5;
    expect(validate.string("abcdef", { max })).toBe(false);
    expect(validate.string("abcde", { max })).toBe(true);
    expect(validate.string("abcd", { max })).toBe(true);
  });

  test("Option.noRepetition", () => {
    const noRepetition = true;
    expect(validate.string("ababab", { noRepetition })).toBe(false);
    expect(validate.string("abcde", { noRepetition })).toBe(true);
    expect(validate.string("yoloyolo", { noRepetition })).toBe(false);
  });

  describe("Option.matchName", () => {
    const matchName = true;
    test("Only upper and lower case alphabets, - and ' chars", () => {
      expect(validate.string("!Tom", { matchName })).toBe(false);
      expect(validate.string("Tom", { matchName })).toBe(true);
      expect(validate.string("D'souza", { matchName })).toBe(true);
      expect(validate.string("Sam-co", { matchName })).toBe(true);
    });
  });

  describe("Option.matchFullname", () => {
    const matchFullname = true;
    test("Only upper and lower case alphabets, spaces, - and ' chars", () => {
      expect(validate.string("<Tom Brady", { matchFullname })).toBe(false);
      expect(validate.string("Tom Brady", { matchFullname })).toBe(true);
      expect(validate.string("Samco D'souza", { matchFullname })).toBe(true);
      expect(validate.string("Samco", { matchFullname })).toBe(true);
      expect(validate.string("Sam-co", { matchFullname })).toBe(true);
    });
  });

  describe("Option.matchPostalCode", () => {
    test("Must be 6 digits in length, starting with digit 1-9. Other digits can be 0-9", () => {
      const matchPostalCode = true;
      expect(validate.string("010080", { matchPostalCode })).toBe(false);
      expect(validate.string("40008", { matchPostalCode })).toBe(false);
      expect(validate.string("4000801", { matchPostalCode })).toBe(false);
      expect(validate.string("400080", { matchPostalCode })).toBe(true);
    });
  });

  describe("validate.clear", () => {
    test("Must clear all logs", () => {
      expect(Object.keys(validate.log).length).toBeGreaterThan(0);
      validate.clear();
      expect(validate.log).toStrictEqual({});
    });
  });
});
