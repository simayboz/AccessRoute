import {
  renderAnalyzeScreen,
  renderGlobalAlerts,
  renderMapScreen,
  renderProfileScreen,
  renderResultScreen
} from "./components/screens.js";
import { createStore, DEFAULT_STATE } from "./state.js";
import {
  classifySlope,
  getProfileSlopeLimit,
  readSlopeFromDevice
} from "./services/sensor.js";

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

    store.updateNested("measurement", {
      ...measurement,
      status
    });
  } catch (error) {
    if (error?.code === "MOTION_PERMISSION_DENIED") {
      store.updateNested("permissions", { motion: "denied" });
    }
    store.setState({
      error: error instanceof Error ? error.message : "Bilinmeyen sensor hatasi."
    });
  } finally {
    store.setState({ loading: false });
  }
}

appRoot.addEventListener("click", (event) => {
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
    store.setState(structuredClone(DEFAULT_STATE));
  }
});

store.subscribe(render);
render();
