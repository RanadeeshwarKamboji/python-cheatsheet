// Set methods.
// Required arguments and defaults are marked with arg.req and arg.def from js/constants.js.
// `order` is the page order, most-used first. The items below follow it.

CHEATSHEET.sections.push({
  id: "sets",
  title: "Set",
  order: [
    "set-add",
    "set-remove",
    "set-discard",
    "set-update",
    "set-union",
    "set-intersection",
    "set-difference",
    "set-pop",
    "set-clear",
    "set-copy",
    "set-issubset",
    "set-issuperset",
    "set-isdisjoint",
    "set-symmetric_difference",
    "set-difference_update",
    "set-intersection_update",
    "set-symmetric_difference_update",
  ],
  items: [
    {
      id: "set-add",
      name: "add",
      purpose: "Put one item in the set. Adding it again changes nothing. Returns None.",
      forms: [[arg.req("object")]],
      params: {
        object: "The item to add. You have to pass it. It must be hashable, so a list will not work.",
      },
      example: { code: "s = {1}\ns.add(2)\ns", result: "{1, 2}" },
    },
    {
      id: "set-remove",
      name: "remove",
      purpose: "Remove one item. A missing item raises KeyError. Use discard when a missing item should be ignored. Returns None.",
      forms: [[arg.req("object")]],
      params: {
        object: "The item to remove. You have to pass it.",
      },
      example: { code: "s = {1, 2}\ns.remove(1)\ns", result: "{2}" },
    },
    {
      id: "set-discard",
      name: "discard",
      purpose: "Remove one item if it is there. A missing item is not an error. Returns None.",
      forms: [[arg.req("object")]],
      params: {
        object: "The item to remove. You have to pass it.",
      },
      example: { code: "s = {1, 2}\ns.discard(9)\ns", result: "{1, 2}" },
    },
    {
      id: "set-update",
      name: "update",
      purpose: "Add items from one or more iterables into this set. Leave others out and nothing changes. Returns None. union is the version that returns a new set.",
      forms: [[arg.opt("*others")]],
      params: {
        "*others": "Iterables whose items are added. Leave them out to change nothing.",
      },
      example: { code: "s = {1, 2}\ns.update([2, 3])\ns", result: "{1, 2, 3}" },
    },
    {
      id: "set-union",
      name: "union",
      purpose: "A new set with the items from this set and from others. This set stays as it was.",
      forms: [[arg.opt("*others")]],
      params: {
        "*others": "Iterables to include. Leave them out and you get a copy of this set.",
      },
      example: { code: "{1, 2}.union([2, 3])", result: "{1, 2, 3}" },
    },
    {
      id: "set-intersection",
      name: "intersection",
      purpose: "A new set with only the items that are also in every other iterable. This set stays as it was.",
      forms: [[arg.opt("*others")]],
      params: {
        "*others": "Iterables to keep items from. An item has to be in all of them.",
      },
      example: { code: "{1, 2, 3}.intersection([2, 4])", result: "{2}" },
    },
    {
      id: "set-difference",
      name: "difference",
      purpose: "A new set with the items that are not in the others. This set stays as it was. difference_update changes this set instead.",
      forms: [[arg.opt("*others")]],
      params: {
        "*others": "Iterables whose items are dropped from the result.",
      },
      example: { code: "{1, 2, 3}.difference([2])", result: "{1, 3}" },
    },
    {
      id: "set-pop",
      name: "pop",
      purpose: "Remove and return an arbitrary item. An empty set raises KeyError.",
      forms: [[]],
      params: {},
      example: { code: "s = {1}\ns.pop()", result: "1" },
    },
    {
      id: "set-clear",
      name: "clear",
      purpose: "Remove every item. Returns None.",
      forms: [[]],
      params: {},
      example: { code: "s = {1, 2}\ns.clear()\ns", result: "set()" },
    },
    {
      id: "set-copy",
      name: "copy",
      purpose: "A new set with the same items. Shallow.",
      forms: [[]],
      params: {},
      example: { code: "{1, 2}.copy()", result: "{1, 2}" },
    },
    {
      id: "set-issubset",
      name: "issubset",
      purpose: "True when every item in this set is also in other.",
      forms: [[arg.req("other")]],
      params: {
        other: "A set or any iterable to test against. You have to pass it.",
      },
      example: { code: "{1, 2}.issubset({1, 2, 3})", result: "True" },
    },
    {
      id: "set-issuperset",
      name: "issuperset",
      purpose: "True when this set contains every item in other.",
      forms: [[arg.req("other")]],
      params: {
        other: "A set or any iterable to test against. You have to pass it.",
      },
      example: { code: "{1, 2, 3}.issuperset({1})", result: "True" },
    },
    {
      id: "set-isdisjoint",
      name: "isdisjoint",
      purpose: "True when this set and other share no items.",
      forms: [[arg.req("other")]],
      params: {
        other: "A set or any iterable to test against. You have to pass it.",
      },
      example: { code: "{1, 2}.isdisjoint({3})", result: "True" },
    },
    {
      id: "set-symmetric_difference",
      name: "symmetric_difference",
      purpose: "A new set with the items that are in one set or the other, but not both.",
      forms: [[arg.req("other")]],
      params: {
        other: "A set or any iterable. You have to pass it.",
      },
      example: { code: "{1, 2}.symmetric_difference([2, 3])", result: "{1, 3}" },
    },
    {
      id: "set-difference_update",
      name: "difference_update",
      purpose: "Drop items that are in any of the others. Changes this set. Returns None.",
      forms: [[arg.opt("*others")]],
      params: {
        "*others": "Iterables whose items are removed from this set.",
      },
      example: { code: "s = {1, 2, 3}\ns.difference_update([2])\ns", result: "{1, 3}" },
    },
    {
      id: "set-intersection_update",
      name: "intersection_update",
      purpose: "Keep only items that are also in every other iterable. Changes this set. Returns None.",
      forms: [[arg.opt("*others")]],
      params: {
        "*others": "Iterables an item must also belong to.",
      },
      example: { code: "s = {1, 2, 3}\ns.intersection_update([2, 3])\ns", result: "{2, 3}" },
    },
    {
      id: "set-symmetric_difference_update",
      name: "symmetric_difference_update",
      purpose: "Keep items that are in this set or in other, but not in both. Changes this set. Returns None.",
      forms: [[arg.req("other")]],
      params: {
        other: "A set or any iterable. You have to pass it.",
      },
      example: { code: "s = {1, 2}\ns.symmetric_difference_update([2, 3])\ns", result: "{1, 3}" },
    },
  ],
});
