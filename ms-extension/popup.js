const toLines = (s) =>
  (s || "")
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);

function rgbaFromPicker(hex, alphaPct) {
  hex = (hex || "#17d21a").replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const a = Math.max(0, Math.min(1, (alphaPct ?? 55) / 100));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Last lagret config
chrome.storage.sync.get(
  {
    phrases: ["stjele penger", "du blir angrepet"],
    color: "rgba(23,210,26,0.55)",
  },
  ({ phrases, color }) => {
    // sett fraser
    document.getElementById("phrases").value = phrases.join("\n");

    // parse simple rgba -> (hex, alpha)
    const m = color.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/i
    );
    let hex = "#17d21a",
      alpha = 55;
    if (m) {
      const [_, r, g, b, a] = m;
      hex =
        "#" + [r, g, b].map((n) => (+n).toString(16).padStart(2, "0")).join("");
      alpha = Math.round((a !== undefined ? +a : 1) * 100);
    }
    document.getElementById("color").value = hex;
    document.getElementById("alpha").value = alpha;
    document.getElementById("alphaVal").textContent = `${alpha}%`;
  }
);

// UI bindings
document.getElementById("alpha").addEventListener("input", (e) => {
  document.getElementById("alphaVal").textContent = `${e.target.value}%`;
});

document.getElementById("apply").addEventListener("click", async () => {
  console.log("applying..");
  const phrases = toLines(document.getElementById("phrases").value);
  const hex = document.getElementById("color").value;
  const alpha = +document.getElementById("alpha").value;
  const color = rgbaFromPicker(hex, alpha);

  await chrome.storage.sync.set({ phrases, color });

  // Send live-oppdatering til aktiv fane (så content-scriptet endrer seg uten reload)
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      type: "KRIM_UPDATE_CONFIG",
      phrases,
      color,
    });
  }
});
