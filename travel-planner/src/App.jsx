import { useState } from "react";

const TABS = ["itinerary", "travel", "hotels", "dining"];

const NAV_ICONS = {
  itinerary: "🗓️",
  travel: "⛵",
  hotels: "🏖️",
  dining: "🦞",
};

const sampleData = {
  tripName: "Joji & Momi's Maine Adventure",
  dates: "July 22 – 26, 2026",
  itinerary: [
    { day: 1, date: "July 22", location: "Portland", events: ["5 p.m. - Arrive at Portland Airport", "6 p.m. - Check in at Portland Harbor Hotel", "7:30 p.m. - Dinner at Central Provisions", "Hunt & Alpine for nightcap"] },
    { day: 2, date: "July 23", location: "Portland", events: ["8 a.m. - Breakfast at Standard Baking Co", "9 a.m. - Stroll the Old Port", "11 a.m. - Lunch at Eventide Oyster Co", "7 p.m. - Dinner at Scales."] },
    { day: 3, date: "July 24", location: "Portland/Ogunquit", events: ["Shibuya Crossing & shopping", "Harajuku & Meiji Shrine", "Dinner in Ginza"] },
    { day: 4, date: "July 25", location: "Ogunquit/Wells/Kennebunkport", events: ["9 a.m. - The Tree Spa", "Fushimi Inari Shrine", "7 p.m. - Dinner at M.C. Perkins Cove"] },
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

// ---- design tokens (Maine coast summer) ----
const C = {
  sand: "#FAF6EE",
  card: "#FFFFFF",
  harbor: "#0E4D64",
  harborDeep: "#0A3A4D",
  coral: "#FF6B4A",
  coralSoft: "#FFE3D9",
  seaglass: "#2A8C82",
  seaglassSoft: "#E0F2EE",
  ink: "#1C2B33",
  inkSoft: "#5B6B72",
  rope: "#E8DEC8",
  ropeLine: "#DCD0B4",
  danger: "#D1483A",
  dangerSoft: "#FBE3DF",
};

const fontDisplay = "'Fraunces', Georgia, serif";
const fontBody = "'Inter', system-ui, sans-serif";
const fontMono = "'JetBrains Mono', monospace";

const FONT_IMPORT_ID = "trip-app-fonts";
if (typeof document !== "undefined" && !document.getElementById(FONT_IMPORT_ID)) {
  const link = document.createElement("link");
  link.id = FONT_IMPORT_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
  document.head.appendChild(link);
}

function WaveDivider() {
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      style={{ display: "block", width: "100%", height: 16 }}
    >
      <path
        d="M0 20 Q 50 0 100 20 T 200 20 T 300 20 T 400 20 T 500 20 T 600 20 T 700 20 T 800 20 T 900 20 T 1000 20 T 1100 20 T 1200 20 V40 H0 Z"
        fill={C.sand}
      />
    </svg>
  );
}

function SectionLabel({ children }) {
  return (
    <h2
      style={{
        fontFamily: fontDisplay,
        fontSize: 22,
        fontWeight: 600,
        color: C.harbor,
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {children}
      <span style={{ flex: 1, height: 1, background: C.ropeLine, marginLeft: 4 }} />
    </h2>
  );
}

function ItineraryTab({ data }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div>
      <SectionLabel>Day-by-day plan</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.map((d) => (
          <div
            key={d.day}
            onClick={() => setExpanded(expanded === d.day ? null : d.day)}
            style={{
              background: C.card,
              border: `1px solid ${C.rope}`,
              borderRadius: 16,
              padding: "1.1rem 1.3rem",
              cursor: "pointer",
              transition: "border-color 0.15s, box-shadow 0.15s",
              boxShadow: expanded === d.day ? `0 4px 16px ${C.seaglassSoft}` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  minWidth: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: C.harbor,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 9, fontFamily: fontBody, fontWeight: 600, color: C.coralSoft, letterSpacing: "0.08em", lineHeight: 1 }}>DAY</span>
                <span style={{ fontSize: 17, fontFamily: fontDisplay, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>{d.day}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontFamily: fontDisplay, fontWeight: 600, fontSize: 17, color: C.ink }}>{d.location}</p>
                <p style={{ margin: 0, fontSize: 13, fontFamily: fontBody, color: C.inkSoft }}>{d.date} · {d.events.length} activities</p>
              </div>
              <span
                style={{
                  color: C.seaglass,
                  fontSize: 20,
                  transition: "transform 0.2s",
                  transform: expanded === d.day ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ⌄
              </span>
            </div>
            {expanded === d.day && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px dashed ${C.ropeLine}` }}>
                {d.events.map((e, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < d.events.length - 1 ? 9 : 0 }}>
                    <span style={{ fontSize: 12, color: C.coral, marginTop: 2, flexShrink: 0 }}>⛱</span>
                    <span style={{ fontSize: 14, fontFamily: fontBody, color: C.ink }}>{e}</span>
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
      <SectionLabel>Flights &amp; rental car</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {data.map((t, i) => (
          <div
            key={i}
            style={{
              background: C.card,
              border: `1px solid ${C.rope}`,
              borderRadius: 16,
              padding: "1.1rem 1.3rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 18 }}>{t.type === "flight" ? "⛵" : "🚙"}</span>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: fontBody,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  background: t.type === "flight" ? C.seaglassSoft : C.coralSoft,
                  color: t.type === "flight" ? C.seaglass : C.coral,
                  padding: "3px 9px",
                  borderRadius: 20,
                }}
              >
                {t.type === "flight" ? "Flight" : "Rental car"}
              </span>
              <span style={{ fontSize: 12, fontFamily: fontMono, color: C.inkSoft, marginLeft: "auto" }}>{t.date}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontFamily: fontDisplay, fontWeight: 600, fontSize: 17, color: C.ink }}>{t.from.split(" ")[0]}</p>
                <p style={{ margin: 0, fontSize: 12, fontFamily: fontMono, color: C.inkSoft }}>{t.time.split(" → ")[0]}</p>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 11, fontFamily: fontMono, color: C.seaglass }}>{t.duration}</span>
                <div style={{ width: "100%", height: 1, background: C.ropeLine, position: "relative" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.coral, position: "absolute", right: 0, top: -3 }} />
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontFamily: fontDisplay, fontWeight: 600, fontSize: 17, color: C.ink }}>{t.to.split(" ")[0]}</p>
                <p style={{ margin: 0, fontSize: 12, fontFamily: fontMono, color: C.inkSoft }}>{t.time.split(" → ")[1]}</p>
              </div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${C.ropeLine}`, fontSize: 12, fontFamily: fontBody, color: C.inkSoft }}>
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
      <SectionLabel>Accommodation</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {data.map((h, i) => (
          <div
            key={i}
            style={{
              background: C.card,
              border: `1px solid ${C.rope}`,
              borderRadius: 16,
              padding: "1.1rem 1.3rem",
            }}
          >
            <div style={{ marginBottom: 10 }}>
              <p style={{ margin: 0, fontFamily: fontDisplay, fontWeight: 600, fontSize: 18, color: C.ink }}>{h.name}</p>
              <p style={{ margin: 0, fontSize: 13, fontFamily: fontBody, color: C.inkSoft }}>📍 {h.location}</p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                margin: "12px 0",
                padding: "10px 0",
                borderTop: `1px dashed ${C.ropeLine}`,
                borderBottom: `1px dashed ${C.ropeLine}`,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 10, fontFamily: fontBody, fontWeight: 600, letterSpacing: "0.06em", color: C.seaglass }}>CHECK-IN</p>
                <p style={{ margin: 0, fontSize: 13, fontFamily: fontMono, color: C.ink }}>{h.checkIn}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 10, fontFamily: fontBody, fontWeight: 600, letterSpacing: "0.06em", color: C.seaglass }}>NIGHTS</p>
                <p style={{ margin: 0, fontSize: 20, fontFamily: fontDisplay, fontWeight: 600, color: C.ink }}>{h.nights}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 10, fontFamily: fontBody, fontWeight: 600, letterSpacing: "0.06em", color: C.seaglass }}>CHECK-OUT</p>
                <p style={{ margin: 0, fontSize: 13, fontFamily: fontMono, color: C.ink }}>{h.checkOut}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {h.amenities.map((a) => (
                <span
                  key={a}
                  style={{
                    fontSize: 12,
                    fontFamily: fontBody,
                    padding: "4px 10px",
                    background: C.sand,
                    border: `1px solid ${C.ropeLine}`,
                    borderRadius: 20,
                    color: C.harbor,
                  }}
                >
                  {a}
                </span>
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
      <SectionLabel>Dining reservations</SectionLabel>

      <div style={{ display: "flex", gap: 10, marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: C.seaglassSoft,
            border: `1px solid ${C.seaglass}33`,
            borderRadius: 20,
            padding: "6px 12px",
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.seaglass, display: "inline-block" }} />
          <span style={{ fontSize: 13, fontFamily: fontBody, color: C.seaglass, fontWeight: 600 }}>{booked} Booked</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: C.coralSoft,
            border: `1px solid ${C.coral}33`,
            borderRadius: 20,
            padding: "6px 12px",
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.coral, display: "inline-block" }} />
          <span style={{ fontSize: 13, fontFamily: fontBody, color: C.coral, fontWeight: 600 }}>{needToBook} Need to book</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {restaurants.map((r) => (
          <div
            key={r.id}
            style={{
              background: C.card,
              border: `1px solid ${r.booked ? `${C.seaglass}55` : `${C.coral}55`}`,
              borderRadius: 16,
              padding: "1.1rem 1.3rem",
              transition: "border-color 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <p style={{ margin: 0, fontFamily: fontDisplay, fontWeight: 600, fontSize: 16, color: C.ink }}>{r.name}</p>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: fontBody,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      padding: "2px 8px",
                      borderRadius: 20,
                      background: C.sand,
                      color: C.harbor,
                    }}
                  >
                    {r.meal}
                  </span>
                </div>
                <p style={{ margin: "0 0 4px", fontSize: 13, fontFamily: fontBody, color: C.inkSoft }}>
                  📍 {r.location} · {r.date}
                </p>
                {r.notes && (
                  <p style={{ margin: 0, fontSize: 13, fontFamily: fontBody, color: C.inkSoft, fontStyle: "italic" }}>
                    {r.notes}
                  </p>
                )}
              </div>

              <button
                onClick={() => toggleBooked(r.id)}
                style={{
                  flexShrink: 0,
                  padding: "7px 16px",
                  borderRadius: 20,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: fontBody,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  transition: "background 0.2s, color 0.2s, transform 0.1s",
                  background: r.booked ? C.seaglass : C.coral,
                  color: "#ffffff",
                  minWidth: 116,
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
    <div style={{ minHeight: "100vh", background: C.sand, fontFamily: fontBody, color: C.ink }}>
      <header style={{ background: C.harbor }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ padding: "1.5rem 0 1.1rem" }}>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 12,
                fontFamily: fontBody,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.coral,
              }}
            >
              ⛵ Coastal getaway
            </p>
            <h1 style={{ margin: 0, fontFamily: fontDisplay, fontSize: 28, fontWeight: 700, color: "#fff" }}>
              {sampleData.tripName}
            </h1>
            <p style={{ margin: "4px 0 1.2rem", fontSize: 14, fontFamily: fontMono, color: "#BFD8DF" }}>
              {sampleData.dates}
            </p>
          </div>
          <nav style={{ display: "flex", gap: 6 }}>
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: tab === t ? "rgba(255,255,255,0.08)" : "none",
                  border: "none",
                  borderBottom: tab === t ? `3px solid ${C.coral}` : "3px solid transparent",
                  padding: "9px 16px",
                  cursor: "pointer",
                  fontSize: 14,
                  fontFamily: fontBody,
                  fontWeight: tab === t ? 600 : 500,
                  color: tab === t ? "#fff" : "#9FC0C9",
                  textTransform: "capitalize",
                  transition: "all 0.15s",
                  borderRadius: "8px 8px 0 0",
                }}
              >
                {NAV_ICONS[t]} {t}
              </button>
            ))}
          </nav>
        </div>
        <WaveDivider />
      </header>
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "1.8rem 1.5rem 3rem" }}>
        {tab === "itinerary" && <ItineraryTab data={sampleData.itinerary} />}
        {tab === "travel" && <TravelTab data={sampleData.travel} />}
        {tab === "hotels" && <HotelsTab data={sampleData.hotels} />}
        {tab === "dining" && <DiningTab initialData={sampleData.dining} />}
      </main>
    </div>
  );
}
