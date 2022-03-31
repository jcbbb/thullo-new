function singleSelector(prefix) {
  return function selector(selector, where = document) {
    return where.querySelector(prefix + selector);
  };
}

function multipleSelector(prefix) {
  return function selector(selector, where = document) {
    return where.querySelectorAll(prefix + selector);
  };
}

export const selectOne = singleSelector(".js-");
export const selectAll = multipleSelector(".js-");
