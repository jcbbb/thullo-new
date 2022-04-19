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
      Accept: "application/json",
      ...customConfig.headers,
    },
  };

  return window.fetch(url, config).then(async (response) => {
    clearTimeout(timerId);
    const data = json ? await response.json().catch(() => {}) : response;
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
