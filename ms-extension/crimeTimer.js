export function initTitleTimer({ selector = "#krim_tid" } = {}) {
  const originalTitle = document.title;

  function updateTitle() {
    const el = document.querySelector(selector);
    if (!el) return;
    const tid = (el.textContent || "").trim();
    if (tid) document.title = `[${tid}] ${originalTitle}`;
  }

  updateTitle();

  const target = document.querySelector(selector);
  if (!target) return;

  const obs = new MutationObserver(updateTitle);
  obs.observe(target, { characterData: true, childList: true, subtree: true });

  return { dispose: () => obs.disconnect() };
}
