const { getCurrentOptions } = require("../src/lib/utils");

test("two plus two is four", () => {
  expect(getCurrentOptions());
});

test("Test description", () => {
  const t = () => {
    throw new TypeError();
  };
  expect(t).toThrow(TypeError);
});
