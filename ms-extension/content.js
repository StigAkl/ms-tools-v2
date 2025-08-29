const krimmeTimer = () => {
  console.log("Initializing krimme timer");

  let originalTitle = document.title;

  const updateTitle = () => {
    const krimTidEl = document.querySelector("#krim_tid");
    if (krimTidEl) {
      const tid = krimTidEl.textContent.trim();
      if (tid) {
        document.title = `[${tid}] ${originalTitle}`;
      }
    }
  };

  updateTitle();

  const targetNode = document.querySelector("#krim_tid");
  if (targetNode) {
    const observer = new MutationObserver(() => {
      updateTitle();
    });
    observer.observe(targetNode, {
      characterData: true,
      childList: true,
      subtree: true,
    });
  }
};

function triggerFlash(color) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = color || "rgba(23, 210, 26, 0.55)";
  overlay.style.zIndex = "9999";
  overlay.style.pointerEvents = "none";
  overlay.style.transition = "opacity 0.5s ease";
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 500);
  }, 2000);
}

function observeNotifications({ phrases, color }) {
  const qs = (phrases && phrases.length ? phrases : []).map((s) =>
    s.toLowerCase()
  );
  const seen = new WeakSet();

  const rootObserver = new MutationObserver(() => {
    const root = document.querySelector("#notifications_table");
    if (!root) return;
    rootObserver.disconnect();

    const checkRow = (row) => {
      if (!(row instanceof Element)) return;
      if (seen.has(row)) return;
      const txt = row.textContent.toLowerCase() || "";
      if (qs.some((q) => txt.includes(q))) {
        seen.add(row);
        triggerFlash(color);
      }
    };

    // sjekk eksisterende
    root.querySelectorAll(".notific_row").forEach(checkRow);

    // observer nye
    const obs = new MutationObserver((muts) => {
      muts.forEach((m) => {
        m.addedNodes?.forEach((n) => {
          if (n instanceof Element && n.matches?.(".notific_row")) {
            checkRow(n);
          }
          // hvis raden ligger dypere
          n.querySelectorAll?.(".notific_row").forEach(checkRow);
        });
      });
    });

    obs.observe(root, { childList: true, subtree: true, characterData: true });

    // Gi tilbake en stopper, så vi kan restarte ved ny config
    stopCurrent = () => obs.disconnect();
  });

  rootObserver.observe(document.body, { childList: true, subtree: true });

  // mulighet for å stoppe rootObserver
  let stopped = false;
  let stopCurrent = () => {};
  return () => {
    if (stopped) return;
    stopped = true;
    try {
      rootObserver.disconnect();
    } catch {}
    try {
      stopCurrent();
    } catch {}
  };
}

const observeReports = () => {
  const SELECTOR = "#rapportstream .forumtekst > span:first-child";
  const overlayColor = "rgba(79, 11, 174, 0.55)";
  const logNames = () => {
    const selectors = document.querySelectorAll(SELECTOR);
    if (selectors.length) {
      const lastPlayer = selectors[selectors.length - 1];
      console.log("Siste rapport:", lastPlayer.textContent.trim());

      if (lastPlayer.textContent.trim().toLowerCase() === "nacho") {
        triggerFlash(overlayColor);
        console.log("flash trigered for:", lastPLayer.textContent.trim());
      }
    }
  };

  const attach = (root) => {
    logNames();
    new MutationObserver(logNames).observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  };

  const root = document.getElementById("rapportstream");
  if (root) {
    attach(root);
  } else {
    console.log("No root element..");
    new MutationObserver((_, obs) => {
      const r = document.getElementById("rapportstream");
      if (r) {
        obs.disconnect();
        attach(r);
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
};

let stopNotifications = null;
let stopReports = null;

/*********** START / RESTART NOTIFICATIONS ***********/
function startNotificationsWithConfig(cfg = {}) {
  const merged = {
    phrases: [],
    color: "rgba(16, 233, 45, 0.55)",
    enableNotificationsBlink: true,
    ...cfg,
  };

  // Stopp gammel observer hvis den kjører
  if (typeof stopNotifications === "function") {
    try {
      stopNotifications();
    } catch {}
    stopNotifications = null;
  }

  // Hvis av – ikke start på nytt
  if (!merged.enableNotificationsBlink) return null;

  // Start på nytt med gjeldende config
  stopNotifications = observeNotifications({
    phrases: merged.phrases,
    color: merged.color,
  });
  return stopNotifications;
}

/*********** INIT FRA STORAGE ***********/
chrome.storage.sync.get(
  {
    phrases: [],
    color: "rgba(16, 233, 45, 0.55)",
    enableNotificationsBlink: true,
    enableReportBlink: true, // TODO - future me have to fix..
  },
  (cfg) => {
    if (cfg.enableNotificationsBlink) {
      startNotificationsWithConfig(cfg);
    }
  }
);

/*********** MELDINGER FRA POPUP ***********/
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "KRIM_UPDATE_CONFIG") {
    if (typeof stopNotifications === "function") {
      startNotificationsWithConfig({
        phrases: msg.phrases,
        color: msg.color,
        enableNotificationsBlink: true,
      });
    }
  }

  // Toggle fra popup
  if (msg?.type === "TOGGLE" && msg.feature === "notifications") {
    const { enabled } = msg;

    if (enabled) {
      // Les gjeldende config og start
      chrome.storage.sync.get(
        {
          phrases: [],
          color: "rgba(16, 233, 45, 0.55)",
        },
        (cfg) => {
          chrome.storage.sync.set({ enableNotificationsBlink: true });
          startNotificationsWithConfig({
            ...cfg,
            enableNotificationsBlink: true,
          });
        }
      );
    } else {
      if (typeof stopNotifications === "function") {
        try {
          stopNotifications();
        } catch {}
        stopNotifications = null;
      }
      chrome.storage.sync.set({ enableNotificationsBlink: false });
    }
  }

  // TODO: msg.feature === "reports"
});

//observeStealNotification2();
krimmeTimer();
observeReports();
