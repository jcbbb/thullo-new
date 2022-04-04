export function normalizeBody(body) {
  return Object.fromEntries(Object.keys(body).map((key) => [key, body[key].value || body[key]]));
}
