(function () {
  const DEFAULT_STATE = {
    step: "profile",
    profile: null,
    loading: false,
    error: null,
    permissions: {
      motion: "unknown",
      camera: "unknown",
      microphone: "unknown",
      geolocation: "unknown"
    },
    measurement: {
      slopePercent: null,
      slopeDegree: null,
      status: null
    }
  };

  const profileCopy = {
    bedensel: {
      title: "Bedensel profil",
      description:
        "Rampa egimlerine odaklanir. Manuel sandalye icin daha dusuk esiklerle guvenli rota verir."
    },
    gorme: {
      title: "Gorme profili",
      description:
        "Sesli yonlendirme odaklidir. Cevresel engellerin betimlenmesi ve az dokunusla kullanim hedeflenir."
    }
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function createStore(initialState) {
    let state = deepClone(initialState);
    const listeners = new Set();

    function emit() {
      listeners.forEach((listener) => listener(state));
    }

    return {
      getState: function () {
        return state;
      },
      setState: function (partial) {
        state = Object.assign({}, state, partial);
        emit();
      },
      updateNested: function (key, partial) {
        state = Object.assign({}, state, {
          [key]: Object.assign({}, state[key], partial)
        });
        emit();
      },
      subscribe: function (listener) {
        listeners.add(listener);
        return function () {
          listeners.delete(listener);
        };
      }
    };
  }

  function degreeToSlopePercent(degree) {
    const radian = (degree * Math.PI) / 180;
    return Math.round(Math.tan(radian) * 100);
  }

  function classifySlope(slopePercent, limitPercent) {
    if (slopePercent == null || Number.isNaN(slopePercent)) {
      return "bilinmiyor";
    }
    return slopePercent > limitPercent ? "riskli" : "guvenli";
  }

  function getProfileSlopeLimit(profile) {
    if (profile === "bedensel") {
      return 8;
    }
    if (profile === "gorme") {
      return 10;
    }
    return 8;
  }

  async function readSlopeFromDevice() {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      throw new Error("Cihaz bu sensori desteklemiyor.");
    }

    const iOSNeedsPermission =
      typeof DeviceOrientationEvent.requestPermission === "function";

    if (iOSNeedsPermission) {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission !== "granted") {
        const error = new Error("Hareket sensori izni reddedildi.");
        error.code = "MOTION_PERMISSION_DENIED";
        throw error;
      }
    }

    return new Promise(function (resolve, reject) {
      const timeout = setTimeout(function () {
        window.removeEventListener("deviceorientation", onOrientation);
        reject(new Error("Sensor verisi zaman asimina ugradi."));
      }, 4000);

      function onOrientation(event) {
        const beta = event.beta;
        if (beta == null) {
          return;
        }

        window.removeEventListener("deviceorientation", onOrientation);
        clearTimeout(timeout);

        const slopeDegree = Number(Math.abs(beta).toFixed(1));
        const slopePercent = Number(degreeToSlopePercent(slopeDegree).toFixed(1));

        resolve({
          slopeDegree: slopeDegree,
          slopePercent: slopePercent
        });
      }

      window.addEventListener("deviceorientation", onOrientation, { once: true });
    });
  }

  function renderProfileScreen() {
    return `
      <section class="space-y-5">
        <header class="space-y-2">
          <p class="text-sm font-semibold uppercase tracking-wide text-brand-700">AccessRoute</p>
          <h1 class="text-2xl font-bold">Profilini sec</h1>
          <p class="text-slate-600">Kullanim tipine gore deneyim ve guvenlik esikleri ayarlanir.</p>
        </header>
        <div class="space-y-3">
          <button data-action="select-profile" data-profile="bedensel" class="focus-ring w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-brand-500 hover:shadow">
            <p class="text-lg font-semibold">${profileCopy.bedensel.title}</p>
            <p class="mt-1 text-sm text-slate-600">${profileCopy.bedensel.description}</p>
          </button>
          <button data-action="select-profile" data-profile="gorme" class="focus-ring w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-brand-500 hover:shadow">
            <p class="text-lg font-semibold">${profileCopy.gorme.title}</p>
            <p class="mt-1 text-sm text-slate-600">${profileCopy.gorme.description}</p>
          </button>
        </div>
      </section>
    `;
  }

  function renderAnalyzeScreen(state) {
    const profileLabel = state.profile ? profileCopy[state.profile].title : "Profil secilmedi";
    return `
      <section class="space-y-4">
        <header class="space-y-2">
          <p class="text-sm text-slate-500">Secili profil: <strong>${profileLabel}</strong></p>
          <h2 class="text-xl font-bold">Olcum / Analiz</h2>
          <p class="text-slate-600">Sensorden egim oku veya kamera analizi icin sonraki adima gec.</p>
        </header>
        <div class="grid gap-3">
          <button data-action="start-sensor" class="focus-ring rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-700">
            Egim olcumunu baslat
          </button>
          <button data-action="go-result" class="focus-ring rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:border-slate-500">
            Sonuc ekranina gec
          </button>
        </div>
        <p class="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">
          Durum: ${state.loading ? "olcum aliniyor..." : "beklemede"}
        </p>
        ${
          state.error
            ? `<p class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">${state.error}</p>`
            : ""
        }
      </section>
    `;
  }

  function renderResultScreen(state) {
    const measurement = state.measurement;
    const status = measurement.status;
    return `
      <section class="space-y-4">
        <h2 class="text-xl font-bold">Sonuc</h2>
        <div class="rounded-2xl bg-white p-4 shadow-sm">
          <p class="text-sm text-slate-500">Olculen egim</p>
          <p class="mt-1 text-2xl font-bold">${measurement.slopePercent ?? "--"}%</p>
          <p class="text-sm text-slate-600">${measurement.slopeDegree ?? "--"} derece</p>
        </div>
        <p class="rounded-xl p-3 text-sm font-semibold ${
          status === "riskli"
            ? "bg-amber-100 text-amber-900"
            : status === "guvenli"
              ? "bg-emerald-100 text-emerald-900"
              : "bg-slate-100 text-slate-700"
        }">
          Durum: ${status ?? "hesaplanmadi"}
        </p>
        <div class="grid gap-3">
          <button data-action="go-map" class="focus-ring rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-700">
            Haritaya gec
          </button>
          <button data-action="restart" class="focus-ring rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:border-slate-500">
            Basa don
          </button>
        </div>
      </section>
    `;
  }

  function renderMapScreen() {
    return `
      <section class="space-y-4">
        <h2 class="text-xl font-bold">Canli Erisilebilirlik Haritasi</h2>
        <div class="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-center text-slate-500">
          Harita servisi baglandiginda burada topluluk engelleri canli gosterilecek.
        </div>
        <button data-action="restart" class="focus-ring rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:border-slate-500">
          Yeni olcum baslat
        </button>
      </section>
    `;
  }

  function renderGlobalAlerts(state) {
    const deniedPermissions = Object.entries(state.permissions)
      .filter(function (entry) {
        return entry[1] === "denied";
      })
      .map(function (entry) {
        return entry[0];
      });

    if (!deniedPermissions.length) {
      return "";
    }

    return `
      <aside class="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        Izin reddedildi: ${deniedPermissions.join(", ")}. Ayarlardan izin verip tekrar deneyin.
      </aside>
    `;
  }

  const appRoot = document.querySelector("#app");
  const store = createStore(DEFAULT_STATE);

  function render() {
    const state = store.getState();
    let html = renderGlobalAlerts(state);

    if (state.step === "profile") {
      html += renderProfileScreen();
    } else if (state.step === "analyze") {
      html += renderAnalyzeScreen(state);
    } else if (state.step === "result") {
      html += renderResultScreen(state);
    } else if (state.step === "map") {
      html += renderMapScreen();
    }

    appRoot.innerHTML = html;
  }

  async function startSensorFlow() {
    const state = store.getState();
    const limitPercent = getProfileSlopeLimit(state.profile);
    store.setState({ loading: true, error: null });

    try {
      const measurement = await readSlopeFromDevice();
      const status = classifySlope(measurement.slopePercent, limitPercent);

      store.updateNested("measurement", Object.assign({}, measurement, { status: status }));
    } catch (error) {
      if (error && error.code === "MOTION_PERMISSION_DENIED") {
        store.updateNested("permissions", { motion: "denied" });
      }
      store.setState({
        error: error instanceof Error ? error.message : "Bilinmeyen sensor hatasi."
      });
    } finally {
      store.setState({ loading: false });
    }
  }

  appRoot.addEventListener("click", function (event) {
    const target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }

    const action = target.dataset.action;

    if (action === "select-profile") {
      store.setState({
        profile: target.dataset.profile,
        step: "analyze",
        error: null
      });
    }

    if (action === "start-sensor") {
      startSensorFlow();
    }

    if (action === "go-result") {
      store.setState({ step: "result" });
    }

    if (action === "go-map") {
      store.setState({ step: "map" });
    }

    if (action === "restart") {
      store.setState(deepClone(DEFAULT_STATE));
    }
  });

  store.subscribe(render);
  render();
})();
