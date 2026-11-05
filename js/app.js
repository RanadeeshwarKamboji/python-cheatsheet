const app = document.querySelector("#app");

function findItem(hash) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return null;
  for (const section of CHEATSHEET.sections) {
    const item = section.items.find((entry) => entry.id === id);
    if (item) return { section, item };
  }
  return null;
}

function callName(item) {
  return item.group ? `${item.group}.${item.name}` : item.name;
}

function sectionItems(section) {
  if (!section.order) return section.items;
  const byId = new Map(section.items.map((item) => [item.id, item]));
  const ordered = section.order.map((id) => byId.get(id)).filter(Boolean);
  for (const item of section.items) {
    if (!ordered.includes(item)) ordered.push(item);
  }
  return ordered;
}

function activeSection() {
  const id = decodeURIComponent(location.hash.replace(/^#/, ""));
  return CHEATSHEET.sections.find((section) => section.id === id) || CHEATSHEET.sections[0];
}

function makeSig(name, tokens, options = {}) {
  const line = document.createElement("div");
  line.className = "sigline";

  const fname = document.createElement("span");
  fname.className = "fname";
  fname.textContent = name;
  if (options.bare) {
    line.append(fname);
    return line;
  }

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
  const bare = name.replace(/^\*+/, "");
  if (bare === "args" || bare === "kwargs") return name;
  return bare;
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
  const haystack = [item.name, item.group || "", ...paramNames(item)].join(" ").toLowerCase();
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

function renderIndex(section) {
  const current = section || activeSection();
  const sheet = document.createElement("div");
  sheet.className = "sheet";

  const kicker = document.createElement("p");
  kicker.className = "kicker";
  kicker.textContent = `Python ${CHEATSHEET.version}`;

  const title = document.createElement("h1");
  title.textContent = "Python cheat sheet";

  const lede = document.createElement("p");
  lede.className = "lede";
  lede.textContent = CHEATSHEET.lede;

  const legend = document.createElement("ul");
  legend.className = "legend";
  for (const item of CHEATSHEET.legend) {
    legend.append(legendItem(item.kind, item.sample, ` ${item.text}`));
  }

  const sentinel = document.createElement("div");
  sentinel.className = "stick-sentinel";

  const searchbar = document.createElement("div");
  searchbar.className = "searchbar";

  const tabs = document.createElement("div");
  tabs.className = "tabs";
  tabs.setAttribute("role", "tablist");
  for (const entry of CHEATSHEET.sections) {
    const tab = document.createElement("a");
    tab.className = "tab";
    tab.href = `#${entry.id}`;
    tab.textContent = entry.title;
    tab.setAttribute("role", "tab");
    if (entry.id === current.id) tab.setAttribute("aria-current", "page");
    tabs.append(tab);
  }

  const input = document.createElement("input");
  input.type = "search";
  input.placeholder = "Filter by name";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.setAttribute("aria-label", "Filter the cheat sheet");
  const count = document.createElement("p");
  count.className = "count";
  count.setAttribute("aria-live", "polite");
  searchbar.append(tabs, input, count);

  const list = document.createElement("div");
  list.className = listClass(current);

  function paintList(list, items, query) {
    list.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("p");
      if (!query && current.note) {
        empty.className = "section-note";
        empty.textContent = current.note;
      } else {
        empty.className = "empty";
        empty.textContent = "No match.";
      }
      list.append(empty);
      return;
    }
    let group = null;
    for (const item of items) {
      if (item.group && item.group !== group) {
        group = item.group;
        const label = document.createElement("p");
        label.className = "group";
        label.textContent = group;
        list.append(label);
      }
      const link = document.createElement("a");
      link.className = "fn";
      link.href = `#${encodeURIComponent(item.id)}`;
      if (item.kind === "attr") link.append(makeSig(item.name, [], { bare: true }));
      else for (const form of item.forms) link.append(makeSig(item.name, form));
      list.append(link);
    }
  }

  function paint() {
    const query = input.value.trim();
    const items = sectionItems(current).filter((item) => matches(item, query));
    paintList(list, items, query);
    if (!query && current.note && sectionItems(current).length === 0) {
      count.textContent = "";
    } else {
      count.textContent = `${items.length} ${current.title.toLowerCase()}`;
    }
  }

  input.addEventListener("input", paint);
  paint();

  const foot = document.createElement("p");
  foot.className = "foot";
  foot.textContent = "Open a row when the name is not enough.";

  sheet.append(kicker, title, lede, legend, sentinel, searchbar, list);
  if (sectionItems(current).length) sheet.append(foot);
  app.replaceChildren(sheet);
  document.title = "Python cheat sheet";

  const observer = new IntersectionObserver(
    ([entry]) => searchbar.classList.toggle("is-stuck", !entry.isIntersecting),
    { threshold: 0 },
  );
  observer.observe(sentinel);
}

function listClass(section) {
  const widest = Math.max(0, ...sectionItems(section).map((item) => item.name.length));
  if (widest > 18) return "list wider-names";
  if (widest > 13) return "list wide-names";
  return "list";
}

function legendItem(cls, codeText, rest) {
  const li = document.createElement("li");
  const code = document.createElement("code");
  code.className = cls;
  code.textContent = codeText;
  li.append(code, document.createTextNode(rest));
  return li;
}

function renderDetail(item, section) {
  const sheet = document.createElement("div");
  sheet.className = "sheet detail";

  const back = document.createElement("a");
  back.className = "back";
  back.href = `#${section.id}`;
  back.textContent = `← ${section.title}`;

  const kicker = document.createElement("p");
  kicker.className = "kicker";
  kicker.textContent = section.title;

  const title = document.createElement("h1");
  title.textContent = callName(item);

  const purpose = document.createElement("p");
  purpose.className = "purpose";
  purpose.textContent = item.purpose;

  sheet.append(back, kicker, title, purpose);

  const shownName = callName(item);
  if (item.kind !== "attr") {
    const sigHeading = document.createElement("h2");
    sigHeading.textContent = item.forms.length > 1 ? "Forms" : "Signature";
    const sigs = document.createElement("div");
    sigs.className = "sigs";
    for (const form of item.forms) sigs.append(makeSig(shownName, form));
    sheet.append(sigHeading, sigs);
  }

  const params = orderedParams(item);
  if (item.kind !== "attr") {
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
  document.title = `${callName(item)} · Python cheat sheet`;
}

function render() {
  const found = findItem(location.hash);
  if (found) renderDetail(found.item, found.section);
  else renderIndex(activeSection());
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (document.activeElement && document.activeElement.tagName === "INPUT") return;
  if (!location.hash) return;
  const found = findItem(location.hash);
  location.hash = found ? found.section.id : "";
});

render();
