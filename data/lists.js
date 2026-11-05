// List methods.
// Required arguments and defaults are marked with arg.req and arg.def from js/constants.js.
// `order` is the page order, most-used first. The items below follow it.

CHEATSHEET.sections.push({
  id: "lists",
  title: "List",
  order: [
    "list-append",
    "list-extend",
    "list-pop",
    "list-insert",
    "list-remove",
    "list-sort",
    "list-reverse",
    "list-index",
    "list-count",
    "list-copy",
    "list-clear",
  ],
  items: [
    {
      id: "list-append",
      name: "append",
      purpose: "Add one item to the end. The item can be anything, including another list. Returns None.",
      forms: [[arg.req("object")]],
      params: {
        object: "The item to add. You have to pass it. It is stored as one element, not unpacked.",
      },
      example: { code: "xs = [1]\nxs.append(2)\nxs", result: "[1, 2]" },
    },
    {
      id: "list-extend",
      name: "extend",
      purpose: "Add every item from an iterable. extend([2, 3]) adds 2 and 3. append([2, 3]) would add the list as one item. Returns None.",
      forms: [[arg.req("iterable")]],
      params: {
        iterable: "Items to add, one by one. You have to pass it. A string adds each character.",
      },
      example: { code: "xs = [1]\nxs.extend([2, 3])\nxs", result: "[1, 2, 3]" },
    },
    {
      id: "list-pop",
      name: "pop",
      purpose: "Remove an item and return it. Default index -1 is the last item. An empty list raises IndexError.",
      forms: [[arg.def("index", "-1")]],
      params: {
        index: "Which item to remove. Default -1 is the last. Pass 0 for the first.",
      },
      example: { code: "[1, 2, 3].pop()", result: "3" },
    },
    {
      id: "list-insert",
      name: "insert",
      purpose: "Put one item at index, and shift the rest right. An index past the end appends. Returns None.",
      forms: [[arg.req("index"), arg.req("object")]],
      params: {
        index: "Where to put the item. 0 is the front. You have to pass it.",
        object: "The item to insert. You have to pass it.",
      },
      example: { code: "xs = [1, 2, 3]\nxs.insert(1, 9)\nxs", result: "[1, 9, 2, 3]" },
    },
    {
      id: "list-remove",
      name: "remove",
      purpose: "Remove the first matching value. A missing value raises ValueError. Returns None.",
      forms: [[arg.req("value")]],
      params: {
        value: "The value to remove. You have to pass it. Later matches stay.",
      },
      example: { code: "xs = [1, 2, 1]\nxs.remove(1)\nxs", result: "[2, 1]" },
    },
    {
      id: "list-sort",
      name: "sort",
      purpose: "Sort this list in place and return None. Write key and reverse by name: sort(key=str.lower) or sort(reverse=True).",
      forms: [[arg.def("key", "None"), arg.def("reverse", "False")]],
      params: {
        key: "A function of one item, used for the ordering. Default None compares the items themselves. Write it by name.",
        reverse: "Default False sorts ascending. True sorts descending. Write it by name.",
      },
      example: { code: "xs = ['b', 'A']\nxs.sort(key=str.lower)\nxs", result: "['A', 'b']" },
    },
    {
      id: "list-reverse",
      name: "reverse",
      purpose: "Reverse this list in place and return None.",
      forms: [[]],
      params: {},
      example: { code: "xs = [1, 2, 3]\nxs.reverse()\nxs", result: "[3, 2, 1]" },
    },
    {
      id: "list-index",
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
      example: { code: "['a', 'b', 'a'].index('a')", result: "0" },
    },
    {
      id: "list-count",
      name: "count",
      purpose: "How many times value appears. A missing value counts as 0.",
      forms: [[arg.req("value")]],
      params: {
        value: "The value to count. You have to pass it.",
      },
      example: { code: "['a', 'b', 'a'].count('a')", result: "2" },
    },
    {
      id: "list-copy",
      name: "copy",
      purpose: "A new list with the same items. Shallow: nested lists are still shared.",
      forms: [[]],
      params: {},
      example: {
        code: "xs = [1, 2]\nys = xs.copy()\nys.append(3)\n(xs, ys)",
        result: "([1, 2], [1, 2, 3])",
      },
    },
    {
      id: "list-clear",
      name: "clear",
      purpose: "Remove every item. Returns None.",
      forms: [[]],
      params: {},
      example: { code: "xs = [1]\nxs.clear()\nxs", result: "[]" },
    },
  ],
});
