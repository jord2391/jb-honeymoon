import { useState } from "react";

const TABS = ["itinerary", "travel", "hotels", "dining"];

const NAV_ICONS = {
  itinerary: "🗓️",
  travel: "✈️",
  hotels: "🏨",
  dining: "🍽️",
};

const sampleData = {
  tripName: "Joji & Momi's Maine Adventure",
  dates: "July 22 - 26, 2026",
  itinerary: [
    { day: 1, date: "July 22", location: "Portland", events: ["5 p.m. - Arrive at Portland Airport", "6 p.m. - Check in at Portland Harbor Hotel", "7:30 p.m. - Dinner at Central Provisions", "Hunt & Alpine for nightcap"] },
    { day: 2, date: "July 23", location: "Portland", events: ["Senso-ji Temple, Asakusa", "11 a.m. - Lunch at Eventide Oyster Co", "7 p.m. - Dinner at Scales."] },
    { day: 3, date: "July 24", location: "Portland/Ogunquit", events: ["Shibuya Crossing & shopping", "Harajuku & Meiji Shrine", "Dinner in Ginza"] },
    { day: 4, date: "July 25", location: "Ogunquit/Wells/Kennebunkport", events: ["9 a.m. - The Tree Spa", "Fushimi Inari Shrine", "Gion district stroll"] },
    { day: 5, date: "July 26", location: "Ogunquit/Kennebunkport/Portland", events: ["Arashiyama Bamboo Grove", "Kinkaku-ji Golden Pavilion", "Traditional kaiseki dinner"] },
  ],
  travel: [
    { type: "flight", from: "Dallas (DFW)", to: "Portland (PWM)", date: "July 22", time: "11:57 a.m. → 4:44 p.m.", duration: "3h 47m", operator: "American Airlines AA# 2353" },
    { type: "rental car", from: "Portland (PWM)", to: "", date: "July 22", time: "5 p.m. → ", duration: "5 days", operator: "Avis" },
    { type: "flight", from: "Portland (PWM)", to: "Dallas (DFW)", date: "July 26", time: "5:36 p.m. → 9 p.m.", duration: "4h 24m", operator: "American Airlines AA# 2353" },
  ],
  hotels: [
    { name: "Portland Harbor Hotel", location: "Portland", checkIn: "July 22", checkOut: "July 24", nights: 2, amenities: ["Free WiFi", "Gym", "Restaurant", "Concierge"] },
    { name: "Gorges Grant Hotel", location: "Ogunquit", checkIn: "July 24", checkOut: "July 26", nights: 2, amenities: ["Free WiFi", "Onsen", "Japanese Garden", "Tea Ceremony"] },
  ],
  dining: [
    { id: 1, name: "Central Provisions", location: "Portland", date: "July 22", meal: "Dinner", notes: "Small plates, reservations recommended", booked: true },
    { id: 2, name: "Hunt & Alpine Club", location: "Portland", date: "July 22", meal: "Drinks", notes: "Cocktail bar, walk-ins usually fine", booked: true },
    { id: 3, name: "Street & Co.", location: "Portland", date: "July 23", meal: "Dinner", notes: "Seafood pasta, very popular — book early", booked: false },
    { id: 4, name: "Eventide Oyster Co.", location: "Portland", date: "July 23", meal: "Lunch", notes: "Best oysters in town", booked: false },
    { id: 5, name: "Arrows Restaurant", location: "Ogunquit", date: "July 24", meal: "Dinner", notes: "Farm-to-table, upscale", booked: false },
    { id: 6, name: "Pier 77 Restaurant", location: "Kennebunkport", date: "July 25", meal: "Lunch", notes: "Waterfront views, casual", booked: true },
    { id: 7, name: "Earth at Hidden Pond", location: "Kennebunkport", date: "July 25", meal: "Dinner", notes: "Forest setting, seasonal menu", booked: false },
  ],
};

function ItineraryTab({ data }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div>
      <h2 style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>Day-by-day plan</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map((d) => (
          <div key={d.day} onClick={() => setExpanded(expanded === d.day ? null : d.day)}
            style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem", cursor: "pointer", transition: "border-color 0.15s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ minWidth: 40, height: 40, borderRadius: "var(--border-radius-md)", background: "var(--color-background-info)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-info)", lineHeight: 1 }}>DAY</span>
                <span style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text-info)", lineHeight: 1.2 }}>{d.day}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 500, fontSize: 15 }}>{d.location}</p>
                <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>{d.date} · {d.events.length} activities</p>
              </div>
              <span style={{ color: "var(--color-text-secondary)", fontSize: 18, transition: "transform 0.2s", transform: expanded === d.day ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
            </div>
            {expanded === d.day && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
                {d.events.map((e, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < d.events.length - 1 ? 8 : 0 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-border-info)", marginTop: 7, flexShrink: 0 }} />
                    <span style={{ fontSize: 14 }}>{e}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TravelTab({ data }) {
  return (
    <div>
      <h2 style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>Flights & rental car</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.map((t, i) => (
          <div key={i} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>{t.type === "flight" ? "✈️" : "🚗"}</span>
              <span style={{ fontSize: 12, fontWeight: 500, background: t.type === "flight" ? "var(--color-background-info)" : "var(--color-background-success)", color: t.type === "flight" ? "var(--color-text-info)" : "var(--color-text-success)", padding: "2px 8px", borderRadius: "var(--border-radius-md)" }}>{t.type === "flight" ? "Flight" : "Rental car"}</span>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)", marginLeft: "auto" }}>{t.date}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>{t.from.split(" ")[0]}</p>
                <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{t.time.split(" → ")[0]}</p>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{t.duration}</span>
                <div style={{ width: "100%", height: 1, background: "var(--color-border-secondary)", position: "relative" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-border-secondary)", position: "absolute", right: 0, top: -2.5 }} />
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>{t.to.split(" ")[0]}</p>
                <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{t.time.split(" → ")[1]}</p>
              </div>
            </div>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "0.5px solid var(--color-border-tertiary)", fontSize: 12, color: "var(--color-text-secondary)" }}>
              <span>{t.operator}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HotelsTab({ data }) {
  return (
    <div>
      <h2 style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>Accommodation</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.map((h, i) => (
          <div key={i} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem" }}>
            <div style={{ marginBottom: 8 }}>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>{h.name}</p>
              <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>📍 {h.location}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "12px 0", padding: "10px 0", borderTop: "0.5px solid var(--color-border-tertiary)", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>CHECK-IN</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{h.checkIn}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>NIGHTS</p>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>{h.nights}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>CHECK-OUT</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{h.checkOut}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {h.amenities.map((a) => (
                <span key={a} style={{ fontSize: 12, padding: "3px 8px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", color: "var(--color-text-secondary)" }}>{a}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiningTab({ initialData }) {
  const [restaurants, setRestaurants] = useState(initialData);

  const toggleBooked = (id) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, booked: !r.booked } : r))
    );
  };

  const booked = restaurants.filter((r) => r.booked).length;
  const needToBook = restaurants.filter((r) => !r.booked).length;

  return (
    <div>
      <h2 style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
        Dining reservations
      </h2>

      <div style={{ display: "flex", gap: 10, marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "0.5px solid #bbf7d0", borderRadius: "var(--border-radius-md)", padding: "6px 12px" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
          <span style={{ fontSize: 13, color: "#15803d", fontWeight: 500 }}>{booked} Booked</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff1f2", border: "0.5px solid #fecdd3", borderRadius: "var(--border-radius-md)", padding: "6px 12px" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626", display: "inline-block" }} />
          <span style={{ fontSize: 13, color: "#b91c1c", fontWeight: 500 }}>{needToBook} Need to book</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {restaurants.map((r) => (
          <div
            key={r.id}
            style={{
              background: "var(--color-background-primary)",
              border: `0.5px solid ${r.booked ? "#bbf7d0" : "#fecdd3"}`,
              borderRadius: "var(--border-radius-lg)",
              padding: "1rem 1.25rem",
              transition: "border-color 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: 15 }}>{r.name}</p>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "2px 7px",
                    borderRadius: "var(--border-radius-md)",
                    background: "var(--color-background-secondary)",
                    color: "var(--color-text-secondary)",
                  }}>
                    {r.meal}
                  </span>
                </div>
                <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--color-text-secondary)" }}>
                  📍 {r.location} · {r.date}
                </p>
                {r.notes && (
                  <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)", fontStyle: "italic" }}>
                    {r.notes}
                  </p>
                )}
              </div>

              <button
                onClick={() => toggleBooked(r.id)}
                style={{
                  flexShrink: 0,
                  padding: "6px 14px",
                  borderRadius: "var(--border-radius-md)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  transition: "background 0.2s, color 0.2s",
                  background: r.booked ? "#16a34a" : "#dc2626",
                  color: "#ffffff",
                  minWidth: 110,
                }}
              >
                {r.booked ? "✓ Booked" : "Need to Book"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("itinerary");

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary, #f5f4f0)", fontFamily: "var(--font-sans, system-ui)" }}>
      <header style={{ background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "0 1.5rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ padding: "1.25rem 0 0" }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500 }}>✈️ {sampleData.tripName}</h1>
            <p style={{ margin: "2px 0 1rem", fontSize: 13, color: "var(--color-text-secondary)" }}>{sampleData.dates}</p>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", borderBottom: tab === t ? "2px solid var(--color-text-primary)" : "2px solid transparent", padding: "8px 14px", cursor: "pointer", fontSize: 14, fontWeight: tab === t ? 500 : 400, color: tab === t ? "var(--color-text-primary)" : "var(--color-text-secondary)", textTransform: "capitalize", transition: "all 0.15s", borderRadius: 0 }}>
                {NAV_ICONS[t]} {t}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "1.5rem" }}>
        {tab === "itinerary" && <ItineraryTab data={sampleData.itinerary} />}
        {tab === "travel" && <TravelTab data={sampleData.travel} />}
        {tab === "hotels" && <HotelsTab data={sampleData.hotels} />}
        {tab === "dining" && <DiningTab initialData={sampleData.dining} />}
      </main>
    </div>
  );
}
