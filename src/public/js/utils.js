function singleSelector(prefix) {
  return function select(selector, where = document) {
    return where.querySelector(prefix + selector);
  };
}
function closestSelector(prefix) {
  return function select(selector, where = document) {
    return where.closest(prefix + selector);
  };
}

function multipleSelector(prefix) {
  return function select(selector, where = document) {
    return where.querySelectorAll(prefix + selector);
  };
}

export const selectOne = singleSelector(".js-");
export const selectAll = multipleSelector(".js-");
export const selectClosest = closestSelector(".js-");

export function createNode(tag, attributes) {
  const node = document.createElement(tag);
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      node.setAttribute(key, value);
    });
  }
  return node;
}

export async function request(
  url,
  { body, query, method, timeout = 60000, json = true, ...customConfig } = {}
) {
  const controller = new AbortController();
  const timerId = setTimeout(controller.abort, timeout);
  const config = {
    signal: controller.signal,
    method: method || (body ? "post" : "get"),
    body: body ? JSON.stringify(body) : undefined,
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Accept: "application/json",
      ...customConfig.headers,
    },
  };

  return window.fetch(url, config).then(async (response) => {
    clearTimeout(timerId);
    const accept = config.headers["Accept"];
    let data = response;

    switch (accept) {
      case "application/json": {
        data = await response.json().catch(() => {});
        break;
      }
      case "text/html": {
        data = await response.text();
        break;
      }
      default:
    }

    if (!response.ok) {
      return Promise.reject(data);
    }

    return data;
  });
}

export async function option(promise) {
  try {
    const result = await promise;
    return [result, null];
  } catch (err) {
    return [null, err];
  }
}

export async function redirect(path) {
  window.location.href = path;
}

export function disableForm(form) {
  const elements = Array.from(form.elements);
  elements.forEach((element) => element.setAttribute("disabled", true));
  return function enableForm() {
    elements.forEach((element) => element.removeAttribute("disabled"));
  };
}

export function htmlToNode(html) {
  const template = createNode("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

export function addListener(nodes, type, listener) {
  return Array.from(nodes)
    .flat()
    .filter(Boolean)
    .forEach((node) => node.addEventListener(type, listener));
}

export function addListeners(nodeOrNodes, obj) {
  const types = Object.keys(obj);
  if (nodeOrNodes instanceof NodeList) {
    nodeOrNodes.forEach((node) => types.forEach((type) => node.addEventListener(type, obj[type])));
    return;
  }

  if (nodeOrNodes instanceof Node) {
    types.forEach((type) => nodeOrNodes.addEventListener(type, obj[type]));
  }
}
