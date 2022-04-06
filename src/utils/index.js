export function normalizeBody(body) {
  return Object.fromEntries(Object.keys(body).map((key) => [key, body[key].value || body[key]]));
}

export async function* asyncPool(concurrency, iterable, iteratorFn) {
  const executing = new Set();
  for (const item of iterable) {
    const promise = Promise.resolve().then(() => iteratorFn(item, iterable));
    executing.add(promise);
    const clean = () => executing.delete(promise);
    promise.then(clean).catch(clean);
    if (executing.size >= concurrency) {
      yield await Promise.race(executing);
    }
  }
  while (executing.size) {
    yield await Promise.race(executing);
  }
}
