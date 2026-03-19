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

export function renderProfileScreen() {
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

export function renderAnalyzeScreen(state) {
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

export function renderResultScreen(state) {
  const { slopePercent, slopeDegree, status } = state.measurement;
  return `
    <section class="space-y-4">
      <h2 class="text-xl font-bold">Sonuc</h2>
      <div class="rounded-2xl bg-white p-4 shadow-sm">
        <p class="text-sm text-slate-500">Olculen egim</p>
        <p class="mt-1 text-2xl font-bold">${slopePercent ?? "--"}%</p>
        <p class="text-sm text-slate-600">${slopeDegree ?? "--"} derece</p>
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

export function renderMapScreen() {
  return `
    <section class="space-y-4">
      <h2 class="text-xl font-bold">Canli Erişilebilirlik Haritasi</h2>
      <div class="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-center text-slate-500">
        Harita servisi baglandiginda burada topluluk engelleri canli gosterilecek.
      </div>
      <button data-action="restart" class="focus-ring rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:border-slate-500">
        Yeni olcum baslat
      </button>
    </section>
  `;
}

export function renderGlobalAlerts(state) {
  const deniedPermissions = Object.entries(state.permissions)
    .filter(([, value]) => value === "denied")
    .map(([key]) => key);

  if (!deniedPermissions.length) {
    return "";
  }

  return `
    <aside class="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
      Izin reddedildi: ${deniedPermissions.join(", ")}. Ayarlardan izin verip tekrar deneyin.
    </aside>
  `;
}
