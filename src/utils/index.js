import crypto from "crypto";

export function normalizeBody(body) {
  return Object.fromEntries(Object.keys(body).map((key) => [key, body[key]?.value || body[key]]));
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

const key = "21895c46b2bc14d49bdb0e08359f7a967228fc25e9c6ce33b01760ab286b0e0b";

const IV_LENGTH = 16;

export function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key, "hex"), iv);

  const encrypted = Buffer.concat([iv, cipher.update(text), cipher.final()]);

  return encrypted.toString("hex");
}

export function decrypt(hash) {
  const iv = Buffer.from(hash, "hex").slice(0, IV_LENGTH);
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key, "hex"), iv);

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash, "hex").slice(IV_LENGTH)),
    decipher.final(),
  ]);

  return decrypted.toString();
}

export async function option(promise) {
  try {
    const result = await promise;
    return [result, null];
  } catch (err) {
    return [null, err];
  }
}

export const formatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "numeric",
  hourCycle: "h24",
  minute: "numeric",
});

export function formatRelations(relations = []) {
  const str = relations.toString();
  const newRelations = str ? `[${str}]` : str;
  return newRelations;
}

export function initials(name) {
  const parts = name.split(" ");
  return `${parts[0][0]} ${parts[parts.length - 1][0]}`;
}

export function asyncPipe(...fns) {
  return (...args) => fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(...args));
}

export function pipe(...fns) {
  return (...args) => fns.reduce((previousOutput, currentFn) => currentFn(previousOutput), ...args);
}

export function prop(key) {
  return (obj) => obj[key];
}

export function isValidUUID(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}
