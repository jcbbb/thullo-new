import api from "./api/index.js";
import { debounce, selectClosest } from "./utils.js";

class ElasticTextarea extends HTMLElement {
  connectedCallback() {
    this.querySelectorAll("textarea").forEach((textareaEl) => {
      textareaEl.dataset.minRows = textareaEl.rows || 2;
      this.update(textareaEl);
    });

    this.addEventListener("input", ({ target }) => {
      if (!(target instanceof HTMLTextAreaElement)) return;
      this.update(target);
      this.save(target);
    });
  }

  isScrolling(textareaEl) {
    return textareaEl.scrollHeight > textareaEl.clientHeight;
  }

  save = debounce(async (target) => {
    const form = selectClosest("description-form", target);
    const data = new FormData(form);
    await api.listItem.updateOne(data.get("list_item_id"), {
      description: data.get("description"),
    });
  });

  grow(textareaEl) {
    let prevHeight = textareaEl.clientHeight;
    let rows = this.rows(textareaEl);

    while (this.isScrolling(textareaEl)) {
      rows++;
      textareaEl.rows = rows;
      const newHeight = textareaEl.clientHeight;
      if (newHeight === prevHeight) break;

      prevHeight = newHeight;
    }
  }
  shrink(textareaEl) {
    let prevHeight = textareaEl.clientHeight;
    const minRows = parseInt(textareaEl.dataset.minRows);
    let rows = this.rows(textareaEl);

    while (!this.isScrolling(textareaEl) && rows > minRows) {
      rows--;
      textareaEl.rows = Math.max(rows, minRows);

      const newHeight = textareaEl.clientHeight;

      if (newHeight === prevHeight) break;

      if (this.isScrolling(textareaEl)) {
        this.grow(textareaEl);
        break;
      }
    }
  }
  update(textareaEl) {
    if (this.isScrolling(textareaEl)) {
      this.grow(textareaEl);
    } else {
      this.shrink(textareaEl);
    }
  }
  rows(textareaEl) {
    return textareaEl.rows || parseInt(textareaEl.dataset.minRows);
  }
}

customElements.define("elastic-textarea", ElasticTextarea);
