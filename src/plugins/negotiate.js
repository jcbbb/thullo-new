import fp from "fastify-plugin";
import mime from "mime";

const getExt = (url) => {
  const match = url.match(/\.(?<format>.*)/);
  if (match && match.groups) {
    return match.groups.format;
  }
};

export const negotiate = fp(async function negotiate(fastify, opts) {
  fastify.decorateReply("format", function (obj) {
    const req = this.request;
    const { format } = req.query;
    const keys = Object.keys(obj);
    const accept = req.accepts();
    const key = keys.length > 0 ? accept.types([getExt(req.url) || format || keys].flat()) : false;

    if (key) {
      this.header("Content-Type", mime.getType(key) || "text/html");
      obj[key].bind(this);
    }
  });
});
