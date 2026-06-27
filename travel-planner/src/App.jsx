import { useState, useEffect } from "react";

const TABS = ["itinerary", "travel", "hotels", "dining"];

const NAV_ICONS = {
  itinerary: "🌺",
  travel: "✈️",
  hotels: "🌴",
  dining: "🍹",
};

const sampleData = {
  tripName: "Our Kaua'i Honeymoon",
  dates: "September 11 – 18, 2026",
  itinerary: [
    { day: 1, date: "Sept 11", location: "Lihue → Kapa'a", events: ["4:30 p.m. - Land at Lihue, pick up rental car", "Drive the coast to the villa, windows down", "7 p.m. - Welcome dinner at Lava Lava Beach Club, table in the sand"] },
    { day: 2, date: "Sept 12", location: "Secret Beach", events: ["Slow morning, coffee on the lanai", "Hike down to Kauapea (Secret) Beach", "Swim the calm lagoon end, bring a blanket", "Sunset picnic on the sand"] },
    { day: 3, date: "Sept 13", location: "Na Pali Coast", events: ["7 a.m. - Board the Na Pali catamaran (Capt Andy's)", "Snorkel a hidden cove, watch for turtles + dolphins", "Lunch onboard", "Quiet dinner in on the lanai"] },
    { day: 4, date: "Sept 14", location: "Waimea Canyon → Po'ipu", events: ["Morning drive up to Waimea Canyon lookouts", "Shave ice on the way back down", "7 p.m. - Sunset dinner at Beach House Restaurant, table on the rail"] },
    { day: 5, date: "Sept 15", location: "Resort, Po'ipu", events: ["No plans on purpose", "Pool, beach chairs, naps whenever they happen", "Evening couples massage + barefoot dinner"] },
    { day: 6, date: "Sept 16", location: "Hanalei / North Shore", events: ["Coffee + banana bread in Hanalei town", "Walk Lumaha'i Beach, swim the river mouth", "7:30 p.m. - Dinner at Hukilau Lanai, torches lit"] },
    { day: 7, date: "Sept 17", location: "Po'ipu / Koloa", events: ["One more swim at our favorite beach", "Souvenir hunting + plate lunch in Koloa", "7 p.m. - Farewell dinner at Hualani's"] },
    { day: 8, date: "Sept 18", location: "Departure", events: ["Pack slowly, one last walk on the sand", "Check out by 11 a.m.", "Drive to Lihue Airport"] },
  ],
  travel: [
    { type: "flight", from: "Dallas (DFW)", to: "Lihue (LIH)", date: "Sept 11", time: "8:10 a.m. → 4:35 p.m.", duration: "11h 25m (1 stop)", operator: "American Airlines AA# 1721" },
    { type: "rental car", from: "Lihue (LIH)", to: "", date: "Sept 11", time: "5:00 p.m. → ", duration: "7 days", operator: "Avis" },
    { type: "flight", from: "Lihue (LIH)", to: "Dallas (DFW)", date: "Sept 18", time: "1:15 p.m. → 11:50 p.m.", duration: "11h 35m (1 stop)", operator: "American Airlines AA# 1722" },
  ],
  hotels: [
    { name: "Hilton Garden Inn Kauai Wailua Bay", location: "Kapa'a", checkIn: "Sept 11", checkOut: "Sept 14", nights: 3, amenities: ["Check-in: 4 p.m.", "Check-out: 11 a.m.", "Oceanview lanai"] },
    { name: "Sheraton Kauai Resort", location: "Po'ipu", checkIn: "Sept 14", checkOut: "Sept 18", nights: 4, amenities: ["Check-in: 3 p.m.", "Check-out: 11 a.m.", "Adults' pool", "Spa on-site"] },
  ],
  dining: [
    { id: 1, name: "Lava Lava Beach Club", location: "Kapa'a", date: "Sept 11", meal: "Dinner", notes: "Sit outside, feet in the sand — book a sunset table", booked: false },
    { id: 2, name: "Capt Andy's Na Pali Cruise", location: "Eleele", date: "Sept 13", meal: "Full day", notes: "Morning sail, lunch onboard — take the seasickness tablet beforehand", booked: true },
    { id: 3, name: "Beach House Restaurant", location: "Po'ipu", date: "Sept 14", meal: "Dinner", notes: "Sunset seating books out weeks ahead — request the rail", booked: false },
    { id: 4, name: "Hukilau Lanai", location: "Kapa'a", date: "Sept 16", meal: "Dinner", notes: "Closed Sundays — courtyard torches at night", booked: true },
    { id: 5, name: "Hualani's", location: "Lihue", date: "Sept 17", meal: "Dinner", notes: "Farewell dinner — ask for an ocean-facing table", booked: false },
    { id: 6, name: "The Spa at Sheraton Kauai", location: "Po'ipu", date: "Sept 15", meal: "Couples massage", notes: "Booked for late afternoon, golden light after", booked: true },
  ],
};

// ---- design tokens (Kaua'i sunset & sea) ----
const C = {
  sand: "#FBF3E7",
  card: "#FFFFFF",
  ocean: "#0F6E76",
  oceanDeep: "#0A4F56",
  coral: "#F4724B",
  coralSoft: "#FDE0D2",
  hibiscus: "#E0537A",
  hibiscusSoft: "#FBE1E9",
  seaglass: "#3A9C8E",
  seaglassSoft: "#E1F2EC",
  ink: "#2A2420",
  inkSoft: "#7A6F63",
  rope: "#EFE2C9",
  ropeLine: "#E4D3AC",
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

// ---- Password protection ----
const SITE_PASSCODE = "ALOHA26";
const AUTH_STORAGE_KEY = "trip-app-authed";

function PasswordGate({ children }) {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(AUTH_STORAGE_KEY) === "true") {
        setAuthed(true);
      }
    } catch (e) {
      // localStorage unavailable, just show the gate
    }
    setChecked(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === SITE_PASSCODE) {
      setAuthed(true);
      setError(false);
      try {
        window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
      } catch (e) {
        // ignore storage errors
      }
    } else {
      setError(true);
    }
  };

  if (!checked) return null;

  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: `linear-gradient(180deg, #FDE7D6 0%, ${C.sand} 100%)`,
          fontFamily: fontBody,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            background: C.card,
            border: `1px solid ${C.rope}`,
            borderRadius: 20,
            padding: "2.2rem 2rem",
            maxWidth: 360,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 8px 30px rgba(15,110,118,0.12)",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 6 }}>🌺</div>
          <h1
            style={{
              margin: "0 0 6px",
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 22,
              color: C.ocean,
            }}
          >
            Kaua'i Honeymoon
          </h1>
          <p style={{ margin: "0 0 22px", fontSize: 14, color: C.inkSoft }}>
            Enter the passcode to view the trip
          </p>
          <input
            type="password"
            autoFocus
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            placeholder="Passcode"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "11px 14px",
              borderRadius: 12,
              border: `1px solid ${error ? C.danger : C.ropeLine}`,
              fontSize: 15,
              fontFamily: fontMono,
              outline: "none",
              marginBottom: 12,
              background: C.sand,
              color: C.ink,
            }}
          />
          {error && (
            <p style={{ margin: "0 0 12px", fontSize: 13, color: C.danger }}>
              Incorrect passcode, try again.
            </p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "11px 0",
              borderRadius: 12,
              border: "none",
              background: C.ocean,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: fontBody,
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            Unlock trip
          </button>
        </form>
      </div>
    );
  }

  return children;
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
        color: C.ocean,
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
                  background: `linear-gradient(135deg, ${C.ocean}, ${C.hibiscus})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 9, fontFamily: fontBody, fontWeight: 600, color: "#FDE0D2", letterSpacing: "0.08em", lineHeight: 1 }}>DAY</span>
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
                    <span style={{ fontSize: 12, color: C.coral, marginTop: 2, flexShrink: 0 }}>🌺</span>
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
              <span style={{ fontSize: 18 }}>{t.type === "flight" ? "✈️" : "🚙"}</span>
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
                    color: C.ocean,
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
      <SectionLabel>Dining &amp; experiences</SectionLabel>

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
                      color: C.ocean,
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

function TripApp() {
  const [tab, setTab] = useState("itinerary");

  return (
    <div style={{ minHeight: "100vh", background: C.sand, fontFamily: fontBody, color: C.ink }}>
      <header style={{ background: `linear-gradient(135deg, ${C.oceanDeep}, ${C.ocean})` }}>
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
                color: "#F4A98A",
              }}
            >
              🌴 Two become one
            </p>
            <h1 style={{ margin: 0, fontFamily: fontDisplay, fontSize: 28, fontWeight: 700, color: "#fff" }}>
              {sampleData.tripName}
            </h1>
            <p style={{ margin: "4px 0 1.2rem", fontSize: 14, fontFamily: fontMono, color: "#BFE3DD" }}>
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
                  color: tab === t ? "#fff" : "#9FD3C9",
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

export default function App() {
  return (
    <PasswordGate>
      <TripApp />
    </PasswordGate>
  );
}
