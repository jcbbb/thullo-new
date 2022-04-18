import { createNode } from "./utils.js";

const icons = {
  success: `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  `,
  err: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  `,
  info: `
   <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  `,
};

function init() {
  const container = createNode("ul", { class: "toast-group" });
  document.firstElementChild.insertBefore(container, document.body);
  return container;
}

const Toaster = init();

function addToast(toast) {
  return Toaster.children.length ? flipToast(toast) : Toaster.appendChild(toast);
}

function createToast(text, type) {
  const toast = createNode("li", { class: `toast-item toast-item-${type}` });
  const span = createNode("span");

  span.innerText = text;

  toast.innerHTML = icons[type];
  toast.append(span);

  toast.addEventListener("mouseover", (e) => {
    const animations = e.target.getAnimations();
    animations.forEach((animation) => animation.pause());
  });

  toast.addEventListener("mouseleave", (e) => {
    const animations = e.target.getAnimations();
    animations.forEach((animation) => animation.play());
  });

  return toast;
}

export function toast(text, type = "info") {
  const t = createToast(text, type);
  addToast(t);

  return new Promise(async (resolve, reject) => {
    await Promise.allSettled(t.getAnimations().map((animation) => animation.finished));
    Toaster.removeChild(t);
    resolve();
  });
}

function flipToast(toast) {
  const prevHeight = Toaster.offsetHeight;

  Toaster.appendChild(toast);

  const currentHeight = Toaster.offsetHeight;
  const deltaHeight = currentHeight - prevHeight;

  const animation = Toaster.animate(
    [{ transform: `translateY(${deltaHeight}px)` }, { transform: `translateY(0)` }],
    {
      duration: 150,
      easing: "ease-out",
    }
  );

  animation.startTime = document.timeline.currentTime;
}
