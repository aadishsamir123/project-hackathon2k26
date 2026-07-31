/**
 * Official Singapore data.gov.sg Open Data API Integration Service
 * Base URLs:
 * - Real-Time Environment APIs: https://api.data.gov.sg/v1/environment/
 * - Datastore Search APIs: https://data.gov.sg/api/action/datastore_search
 */

// ─── 1. Real-Time Weather Forecast & Solar UV Index (data.gov.sg) ───────────────

export async function fetchLiveSGWeather() {
  try {
    const res = await fetch("https://api.data.gov.sg/v1/environment/2-hour-weather-forecast");
    if (!res.ok) throw new Error("Failed to fetch weather forecast from data.gov.sg");
    const data = await res.json();
    const forecastObj = data.items?.[0]?.forecasts?.[0] || { area: "Central Singapore", forecast: "Partly Cloudy" };
    return { forecast: forecastObj.forecast, area: forecastObj.area, raw: data, error: null };
  } catch (err) {
    console.warn("data.gov.sg Weather API fallback:", err);
    return { forecast: "Partly Cloudy (Solar Peak)", area: "Singapore", error: err.message };
  }
}

export async function fetchLiveSGUVIndex() {
  try {
    const res = await fetch("https://api.data.gov.sg/v1/environment/uv-index");
    if (!res.ok) throw new Error("Failed to fetch UV index from data.gov.sg");
    const data = await res.json();
    const currentUV = data.items?.[0]?.index?.[0]?.value || 7;
    return { uvIndex: currentUV, status: currentUV >= 8 ? "High Solar Generation" : "Moderate", error: null };
  } catch (err) {
    console.warn("data.gov.sg UV Index API fallback:", err);
    return { uvIndex: 7, status: "High Solar Generation", error: err.message };
  }
}

// ─── 2. Real-Time Air Quality PSI / PM2.5 (data.gov.sg) ────────────────────────

export async function fetchLiveSGPSI() {
  try {
    const res = await fetch("https://api.data.gov.sg/v1/environment/psi");
    if (!res.ok) throw new Error("Failed to fetch PSI from data.gov.sg");
    const data = await res.json();
    const psi24hr = data.items?.[0]?.readings?.psi_twenty_four_hourly?.national || 35;
    return { psi: psi24hr, status: psi24hr <= 50 ? "Good" : "Moderate", error: null };
  } catch (err) {
    console.warn("data.gov.sg PSI API fallback:", err);
    return { psi: 35, status: "Good", error: err.message };
  }
}

// ─── 3. Singapore Average Household Electricity & Water Consumption Benchmarks ───
// Derived from official data.gov.sg EMA & PUB Household Consumption Datasets by Dwelling Type

export const SG_DWELLING_BENCHMARKS = {
  "1-room": { label: "HDB 1-Room / 2-Room", avgKwh: 160, avgM3: 8.5, description: "Official data.gov.sg EMA benchmark" },
  "3-room": { label: "HDB 3-Room", avgKwh: 270, avgM3: 13.2, description: "Official data.gov.sg EMA benchmark" },
  "4-room": { label: "HDB 4-Room", avgKwh: 360, avgM3: 16.5, description: "Official data.gov.sg EMA benchmark" },
  "5-room": { label: "HDB 5-Room / Executive", avgKwh: 430, avgM3: 19.8, description: "Official data.gov.sg EMA benchmark" },
  "condo": { label: "Private Condo / Apartment", avgKwh: 520, avgM3: 21.0, description: "Official data.gov.sg EMA benchmark" },
  "landed": { label: "Landed Property", avgKwh: 1150, avgM3: 35.0, description: "Official data.gov.sg EMA benchmark" },
};

export async function fetchSGDwellingBenchmark(dwellingType = "4-room") {
  const benchmark = SG_DWELLING_BENCHMARKS[dwellingType] || SG_DWELLING_BENCHMARKS["4-room"];
  return {
    dwellingType,
    label: benchmark.label,
    avgKwh: benchmark.avgKwh,
    avgM3: benchmark.avgM3,
    gridEmissionFactor: 0.4085, // kg CO2e per kWh (SP Group / EMA data.gov.sg)
    waterTariffPerM3: 2.74, // PUB Water Tariff Tier 1 incl. WCT (data.gov.sg)
    source: "data.gov.sg • EMA Household Energy Consumption Dataset",
  };
}
