const SECTION = CHEATSHEET.sections[0];

const app = document.querySelector("#app");

function findItem(hash) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return null;
  return SECTION.items.find((item) => item.id === id) || null;
}

function makeSig(name, tokens) {
  const line = document.createElement("div");
  line.className = "sigline";

  const fname = document.createElement("span");
  fname.className = "fname";
  fname.textContent = name;

  const args = document.createElement("span");
  args.className = "fargs";
  appendSyn(args, "(");
  const visible = tokens.filter((token) => token.kind !== "mark");
  visible.forEach((token, index) => {
    if (index > 0) appendSyn(args, ", ");
    const bit = document.createElement("span");
    if (token.kind === "def") {
      bit.className = "def";
      bit.textContent = `${displayName(token.name)}=${token.value}`;
    } else if (token.kind === "opt") {
      bit.className = "def";
      bit.textContent = displayName(token.name);
    } else {
      bit.className = "req";
      bit.textContent = displayName(token.name);
    }
    args.append(bit);
  });
  appendSyn(args, ")");
  line.append(fname, args);
  return line;
}

function displayName(name) {
  return name.replace(/^\*+/, "");
}

function appendSyn(parent, text) {
  const span = document.createElement("span");
  span.className = "syn";
  span.textContent = text;
  parent.append(span);
}

function paramNames(item) {
  const names = [];
  for (const form of item.forms) {
    for (const token of form) {
      if (token.name) names.push(token.name);
    }
  }
  return names;
}

function matches(item, query) {
  if (!query) return true;
  const haystack = [item.name, ...paramNames(item)].join(" ").toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((part) => haystack.includes(part));
}

function badgeList(tokens) {
  const badges = [];
  const seen = new Set();
  for (const token of tokens) {
    let key;
    let label;
    let cls;
    if (token.kind === "def") {
      key = `def:${token.value}`;
      label = `default ${token.value}`;
      cls = "def";
    } else if (token.kind === "opt") {
      key = "opt";
      label = "optional";
      cls = "def";
    } else if (token.kind === "req") {
      key = "req";
      label = "required";
      cls = "req";
    } else {
      continue;
    }
    if (seen.has(key)) continue;
    seen.add(key);
    badges.push({ label, cls });
  }
  return badges;
}

function orderedParams(item) {
  const order = [];
  const grouped = new Map();
  for (const form of item.forms) {
    for (const token of form) {
      if (!token.name) continue;
      if (!grouped.has(token.name)) {
        grouped.set(token.name, []);
        order.push(token.name);
      }
      grouped.get(token.name).push(token);
    }
  }
  return order.map((name) => ({ name, tokens: grouped.get(name) }));
}

function renderIndex() {
  const sheet = document.createElement("div");
  sheet.className = "sheet";

  const kicker = document.createElement("p");
  kicker.className = "kicker";
  kicker.textContent = `Python ${CHEATSHEET.version}`;

  const title = document.createElement("h1");
  title.textContent = "Python cheat sheet";

  const lede = document.createElement("p");
  lede.className = "lede";
  lede.textContent = SECTION.lede;

  const legend = document.createElement("ul");
  legend.className = "legend";
  legend.append(
    legendItem("req", "name", " required"),
    legendItem("def", "name=value", " has a default"),
  );

  const sentinel = document.createElement("div");
  sentinel.className = "stick-sentinel";

  const searchbar = document.createElement("div");
  searchbar.className = "searchbar";
  const input = document.createElement("input");
  input.type = "search";
  input.placeholder = "Filter by name or parameter";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.setAttribute("aria-label", "Filter built-in functions");
  const count = document.createElement("p");
  count.className = "count";
  count.setAttribute("aria-live", "polite");
  searchbar.append(input, count);

  const list = document.createElement("div");
  list.className = "list";

  function paint() {
    const query = input.value.trim();
    const items = SECTION.items.filter((item) => matches(item, query));
    list.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "No function matches.";
      list.append(empty);
    } else {
      for (const item of items) {
        const link = document.createElement("a");
        link.className = "fn";
        link.href = `#${encodeURIComponent(item.id)}`;
        for (const form of item.forms) link.append(makeSig(item.name, form));
        list.append(link);
      }
    }
    const noun = items.length === 1 ? "function" : "functions";
    count.textContent = query ? `${items.length} ${noun}` : `${items.length} ${noun}`;
  }

  input.addEventListener("input", paint);
  paint();

  const foot = document.createElement("p");
  foot.className = "foot";
  foot.textContent = "Built-in functions. Open one for the purpose, the arguments, and an example.";

  sheet.append(kicker, title, lede, legend, sentinel, searchbar, list, foot);
  app.replaceChildren(sheet);
  document.title = "Python cheat sheet";

  const observer = new IntersectionObserver(
    ([entry]) => searchbar.classList.toggle("is-stuck", !entry.isIntersecting),
    { threshold: 0 },
  );
  observer.observe(sentinel);
}

function legendItem(cls, codeText, rest) {
  const li = document.createElement("li");
  const code = document.createElement("code");
  code.className = cls;
  code.textContent = codeText;
  li.append(code, document.createTextNode(rest));
  return li;
}

function renderDetail(item) {
  const sheet = document.createElement("div");
  sheet.className = "sheet detail";

  const back = document.createElement("a");
  back.className = "back";
  back.href = "#";
  back.textContent = "← All functions";

  const kicker = document.createElement("p");
  kicker.className = "kicker";
  kicker.textContent = "Built-in function";

  const title = document.createElement("h1");
  title.textContent = item.name;

  const purpose = document.createElement("p");
  purpose.className = "purpose";
  purpose.textContent = item.purpose;

  const sigHeading = document.createElement("h2");
  sigHeading.textContent = item.forms.length > 1 ? "Forms" : "Signature";
  const sigs = document.createElement("div");
  sigs.className = "sigs";
  for (const form of item.forms) sigs.append(makeSig(item.name, form));

  sheet.append(back, kicker, title, purpose, sigHeading, sigs);

  const params = orderedParams(item);
  const paramHeading = document.createElement("h2");
  paramHeading.textContent = "Parameters";
  sheet.append(paramHeading);
  if (!params.length) {
    const none = document.createElement("p");
    none.className = "none";
    none.textContent = "Takes no arguments.";
    sheet.append(none);
  } else {
    for (const param of params) {
      const block = document.createElement("div");
      block.className = "param";
      const head = document.createElement("div");
      head.className = "param-head";
      const name = document.createElement("span");
      name.className = "param-name";
      const badges = badgeList(param.tokens);
      const uniform = badges.length === 1 ? badges[0].cls : "";
      if (uniform) name.classList.add(uniform);
      name.textContent = displayName(param.name);
      head.append(name);
      for (const badge of badges) {
        const tag = document.createElement("span");
        tag.className = `badge ${badge.cls}`;
        tag.textContent = badge.label;
        head.append(tag);
      }
      const desc = document.createElement("p");
      desc.textContent = item.params[param.name] || "";
      block.append(head, desc);
      sheet.append(block);
    }
  }

  const exampleHeading = document.createElement("h2");
  exampleHeading.textContent = "Example";
  const code = document.createElement("pre");
  code.className = "code";
  code.textContent = item.example.code;
  const resultLabel = document.createElement("h2");
  resultLabel.textContent = "Result";
  const result = document.createElement("pre");
  result.className = "out";
  result.textContent = item.example.result;
  sheet.append(exampleHeading, code, resultLabel, result);
  if (item.example.note) {
    const note = document.createElement("p");
    note.className = "note";
    note.textContent = item.example.note;
    sheet.append(note);
  }

  app.replaceChildren(sheet);
  document.title = `${item.name} · Python cheat sheet`;
}

function render() {
  const item = findItem(location.hash);
  if (item) renderDetail(item);
  else renderIndex();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (document.activeElement && document.activeElement.tagName === "INPUT") return;
  if (location.hash) location.hash = "";
});

render();
