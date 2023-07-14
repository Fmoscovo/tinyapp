const { assert } = require("chai");
const { getUserByEmail } = require("../helpers.js");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};
//test 1
describe("getUserByEmail", function () {
  it("should return a user object with valid email", function () {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedEmail = "user@example.com";
    assert.equal(user.email, expectedEmail);
  });

  it("should return null for non-existent email", function () {
    const user = getUserByEmail("nonexistent@example.com", testUsers);
    assert.isNull(user);
  });

  it("should return the correct user object when multiple users have the same email", function () {
    const user = getUserByEmail("user2@example.com", testUsers);
    const expectedID = "user2RandomID";
    assert.equal(user.id, expectedID);
  });

  it("returns user when email matches", () => {
    const database = {
      1: { id: "1", name: "Alice", email: "alice@example.com" },
      2: { id: "2", name: "Bob", email: "bob@example.com" },
    };

    it("should be case-insensitive when comparing email", function () {
      const user = getUserByEmail("USER@example.com", testUsers);
      const expectedID = "userRandomID";
      assert.equal(user.id, expectedID);
    });
  });

  it("should return null for non-existent email", function () {
    const user = getUserByEmail("nonexistent@example.com", testUsers);
    assert.isNull(user);
  });

  it("should return the correct user for a case-insensitive email", function () {
    const user = getUserByEmail("USER@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, expectedUserID);
  });
});
