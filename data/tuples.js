// Tuple methods.
// Required arguments and defaults are marked with arg.req and arg.def from js/constants.js.
// `order` is the page order, most-used first. The items below follow it.

CHEATSHEET.sections.push({
  id: "tuples",
  title: "Tuple",
  order: [
    "tuple-count",
    "tuple-index",
  ],
  items: [
    {
      id: "tuple-count",
      name: "count",
      purpose: "How many times value appears. A tuple cannot be changed, so count and index are the only methods.",
      forms: [[arg.req("value")]],
      params: {
        value: "The value to count. You have to pass it.",
      },
      example: { code: "('a', 'b', 'a').count('a')", result: "2" },
    },
    {
      id: "tuple-index",
      name: "index",
      purpose: "Index of the first matching value. A missing value raises ValueError. start and stop limit the search, the same way a slice does.",
      forms: [[
        arg.req("value"),
        arg.def("start", "0"),
        arg.def("stop", "sys.maxsize"),
      ]],
      params: {
        value: "The value to find. You have to pass it.",
        start: "Index to begin at. Default 0.",
        stop: "Index to stop before. Default sys.maxsize, which means the end.",
      },
      example: { code: "('a', 'b', 'a').index('b')", result: "1" },
    },
  ],
});
