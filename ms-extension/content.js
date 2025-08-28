const krimmeTimer = () => {
  console.log("Initializing krimme timer");

  let originalTitle = document.title;

  function updateTitle() {
    const krimTidEl = document.querySelector("#krim_tid");
    if (krimTidEl) {
      const tid = krimTidEl.textContent.trim();
      if (tid) {
        document.title = `[${tid}] ${originalTitle}`;
      }
    }
  }

  // Kjør en gang ved load
  updateTitle();

  // Overvåk endringer på #krim_tid spesifikt (ikke hele body)
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

// const aasdad = () => {
//   console.log("Observing steal notifications...");

//   function triggerFlash() {
//     const overlay = document.createElement("div");
//     overlay.style.position = "fixed";
//     overlay.style.top = "0";
//     overlay.style.left = "0";
//     overlay.style.width = "100vw";
//     overlay.style.height = "100vh";
//     overlay.style.backgroundColor = "rgba(23, 210, 26, 0.55)";
//     overlay.style.zIndex = "9999";
//     overlay.style.pointerEvents = "none";
//     overlay.style.transition = "opacity 0.5s ease";

//     document.body.appendChild(overlay);

//     // Fjern etter 2 sekunder med fade ut
//     setTimeout(() => {
//       overlay.style.opacity = "0";
//       setTimeout(() => overlay.remove(), 500);
//     }, 2000);
//   }

//   const QUERY = "stjele penger";
//   const QUERY2 = "Du blir angrepet";

//   const q = QUERY.normalize("NFKC").toLowerCase();
//   const q2 = QUERY2.normalize("NFKC").toLowerCase();
//   const seen = new WeakSet();

//   const rootObserver = new MutationObserver(() => {
//     const root = document.querySelector("#notifications_table");
//     if (!root) return;
//     rootObserver.disconnect();

//     const checkRow = (row) => {
//       if (!(row instanceof Element)) return;
//       if (seen.has(row)) return;
//       const txt = (row.textContent || "").normalize("NFKC").toLowerCase();
//       if (txt.includes(q) || txt.includes(q2)) {
//         seen.add(row);
//         const button = document.querySelector("#drapsknapp");
//         button.click();
//         triggerFlash();
//       }
//     };

//     // sjekk eksisterende
//     root.querySelectorAll(".notific_row").forEach(checkRow);

//     // observer nye
//     const obs = new MutationObserver((muts) => {
//       muts.forEach((m) => {
//         m.addedNodes?.forEach((n) => {
//           if (n instanceof Element && n.matches?.(".notific_row")) {
//             checkRow(n);
//           }
//         });
//       });
//     });

//     obs.observe(root, { childList: true, subtree: true });
//   });

//   rootObserver.observe(document.body, { childList: true, subtree: true });
// };

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

function observeStealNotification2({ phrases, color }) {
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
        console.log("Query:", txt);
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

  // mulighet for å stoppe rootObserver også
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
  console.log("Observing reports..");
  const SELECTOR = "#rapportstream .forumtekst > span:first-child";

  const logNames = () => {
    document.querySelectorAll(SELECTOR).forEach((el) => {
      console.log("Spillernavn:", el.textContent.trim());
    });
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

observeReports();

// --- Boot: last config og start ---
let stopObs = null;

function startWithConfig(cfg) {
  if (typeof stopObs === "function") stopObs();
  stopObs = observeStealNotification2(cfg || {});
}

// init fra storage
chrome.storage.sync.get(
  {
    phrases: [],
    color: "rgba(16, 233, 45, 0.55)",
  },
  (cfg) => startWithConfig(cfg)
);

// Live-oppdater fra popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "KRIM_UPDATE_CONFIG") {
    startWithConfig({ phrases: msg.phrases, color: msg.color });
  }
});

//observeStealNotification2();
krimmeTimer();
