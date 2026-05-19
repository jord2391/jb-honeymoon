import { useState } from "react";

const TABS = ["itinerary", "travel", "hotels", "costs"];

const NAV_ICONS = {
  itinerary: "🗓️",
  travel: "✈️",
  hotels: "🏨",
  costs: "💰",
};

const sampleData = {
  tripName: "Joji & Momi's Maine Adventure",
  dates: "July 22 - 26, 2026",
  itinerary: [
    { day: 1, date: "July 22", location: "Portland", events: ["Arrive at Portland Airport", "Check in at Portland Harbor Hotel", "Dinner at XX", "Explore Portland at night"] },
    { day: 2, date: "July 23", location: "Portland", events: ["Senso-ji Temple, Asakusa", "Tsukiji Outer Market lunch", "TeamLab Planets evening"] },
    { day: 3, date: "July 24", location: "Portland/Ogunquit", events: ["Shibuya Crossing & shopping", "Harajuku & Meiji Shrine", "Dinner in Ginza"] },
    { day: 4, date: "July 25", location: "Ogunquit/Wells/Kennebunkport", events: ["Bullet train Tokyo → Kyoto", "Fushimi Inari Shrine", "Gion district stroll"] },
    { day: 5, date: "July 26", location: "Ogunquit/Kennebunkport/Portland", events: ["Arashiyama Bamboo Grove", "Kinkaku-ji Golden Pavilion", "Traditional kaiseki dinner"] },
  ],
  travel: [
    { type: "flight", from: "Dallas (DFW)", to: "Portland (PWM)", date: "July 22", time: "11:57 a.m. → 4:44 p.m.", duration: "3h 47m", operator: "American Airlines AA# 2353" },
    { type: "rental car", from: "Portland (PWM)", to: "", date: "Oct 15", time: "9:03 AM → 11:33 AM", duration: "2h 30m", operator: "Shinkansen Nozomi 7", },
    { type: "flight", from: "Portland (PWM)", to: "Dallas (DFW)", date: "July 26", time: "5:36 p.m. → 9 p.m.", duration: "4h 24m", operator: "American Airlines AA# 2353", },
  
  ],
  hotels: [
    { name: "Hyatt Regency Shinjuku", location: "Tokyo", checkIn: "Oct 12", checkOut: "Oct 15", nights: 3, pricePerNight: 180, rating: 4.5, amenities: ["Free WiFi", "Gym", "Restaurant", "Concierge"] },
    { name: "The Thousand Kyoto", location: "Kyoto", checkIn: "Oct 15", checkOut: "Oct 17", nights: 2, pricePerNight: 220, rating: 4.8, amenities: ["Free WiFi", "Onsen", "Japanese Garden", "Tea Ceremony"] },
    { name: "Cross Hotel Osaka", location: "Osaka", checkIn: "Oct 17", checkOut: "Oct 25", nights: 8, pricePerNight: 130, rating: 4.2, amenities: ["Free WiFi", "Rooftop Bar", "Gym"] },
  ],
};

const defaultCosts = [
  { id: 1, category: "Flights", item: "Round-trip flights (x2)", amount: 2400 },
  { id: 2, category: "Hotels", item: "Tokyo – 3 nights", amount: 1080 },
  { id: 3, category: "Hotels", item: "Kyoto – 2 nights", amount: 880 },
  { id: 4, category: "Hotels", item: "Osaka – 8 nights", amount: 2080 },
  { id: 5, category: "Travel", item: "Shinkansen passes", amount: 340 },
  { id: 6, category: "Food", item: "Dining budget (est.)", amount: 600 },
  { id: 7, category: "Activities", item: "Attractions & tours", amount: 300 },
  { id: 8, category: "Misc", item: "Shopping & misc", amount: 400 },
];

function Stars({ rating }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: 13 }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
      <span style={{ color: "var(--color-text-secondary)", marginLeft: 4, fontSize: 12 }}>{rating}</span>
    </span>
  );
}

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
              <span style={{ fontSize: 18 }}>{t.type === "flight" ? "✈️" : "🚅"}</span>
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
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: 16, fontSize: 12, color: "var(--color-text-secondary)" }}>
              <span>{t.operator}</span>
              <span>· {t.class}</span>
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
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>{h.name}</p>
                <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>📍 {h.location}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>${h.pricePerNight}<span style={{ fontSize: 12, fontWeight: 400, color: "var(--color-text-secondary)" }}>/night</span></p>
                <Stars rating={h.rating} />
              </div>
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
            <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--color-text-secondary)" }}>Subtotal: <strong style={{ color: "var(--color-text-primary)" }}>${(h.nights * h.pricePerNight).toLocaleString()}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CostsTab() {
  const [costs, setCosts] = useState(defaultCosts);
  const [people, setPeople] = useState(2);
  const [newItem, setNewItem] = useState({ category: "Food", item: "", amount: "" });
  const [nextId, setNextId] = useState(defaultCosts.length + 1);

  const total = costs.reduce((s, c) => s + Number(c.amount), 0);
  const perPerson = total / people;

  const categories = [...new Set(costs.map((c) => c.category))];

  function addItem() {
    if (!newItem.item || !newItem.amount) return;
    setCosts([...costs, { ...newItem, id: nextId, amount: Number(newItem.amount) }]);
    setNextId(nextId + 1);
    setNewItem({ category: "Food", item: "", amount: "" });
  }

  function removeItem(id) {
    setCosts(costs.filter((c) => c.id !== id));
  }

  return (
    <div>
      <h2 style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>Cost breakdown</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, marginBottom: "1.5rem" }}>
        {[
          { label: "Total cost", value: `$${total.toLocaleString()}` },
          { label: "Travellers", value: people },
          { label: "Per person", value: `$${Math.round(perPerson).toLocaleString()}` },
        ].map((m) => (
          <div key={m.label} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "1rem", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{m.label}</p>
            <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 500 }}>{m.value}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
        <label style={{ fontSize: 14, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>Number of travellers:</label>
        <input type="range" min="1" max="12" value={people} step="1" onChange={(e) => setPeople(Number(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontSize: 16, fontWeight: 500, minWidth: 24 }}>{people}</span>
      </div>

      {categories.map((cat) => (
        <div key={cat} style={{ marginBottom: "1.25rem" }}>
          <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-secondary)" }}>{cat}</p>
          <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
            {costs.filter((c) => c.category === cat).map((c, i, arr) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: i < arr.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
                <span style={{ flex: 1, fontSize: 14 }}>{c.item}</span>
                <span style={{ fontWeight: 500, fontSize: 14, marginRight: 12 }}>${Number(c.amount).toLocaleString()}</span>
                <button onClick={() => removeItem(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-danger)", fontSize: 16, padding: "0 2px", lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem", marginTop: "1.5rem" }}>
        <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 500 }}>Add expense</p>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 90px auto", gap: 8, alignItems: "center" }}>
          <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} style={{ fontSize: 13 }}>
            {["Flights", "Hotels", "Travel", "Food", "Activities", "Misc"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input placeholder="Description" value={newItem.item} onChange={(e) => setNewItem({ ...newItem, item: e.target.value })} style={{ fontSize: 13 }} />
          <input placeholder="Amount $" type="number" value={newItem.amount} onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })} style={{ fontSize: 13 }} />
          <button onClick={addItem} style={{ whiteSpace: "nowrap", fontSize: 13 }}>+ Add</button>
        </div>
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
        {tab === "costs" && <CostsTab />}
      </main>
    </div>
  );
}
