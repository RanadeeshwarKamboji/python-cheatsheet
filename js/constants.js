// Shared cheat sheet shell.
// Group files only add sections. They do not repeat this.
//
// An argument is one of:
//   arg.req(name)           red. You have to pass it.
//   arg.def(name, value)    green, drawn as name=value. It has a default.
//   arg.opt(name)           green. You can leave it out, and there is no single default to show.
//   arg.mark(text)          kept in the data, not shown.
//
// Item shape:
//   id, name, purpose, forms, params, example { code, result, note? }
//   group   type heading, such as "int" or "str"
//   kind    "attr" when the name is read, not called

const CHEATSHEET = {
  version: "3.13",
  lede: "Pick a group. The most used names are first.",
  legend: [
    { kind: "req", sample: "name", text: "required" },
    { kind: "def", sample: "name=value", text: "has a default" },
  ],
  sections: [],
};

const arg = {
  req(name) {
    return { kind: "req", name };
  },
  def(name, value) {
    return { kind: "def", name, value };
  },
  opt(name) {
    return { kind: "opt", name };
  },
  mark(text) {
    return { kind: "mark", text };
  },
};
