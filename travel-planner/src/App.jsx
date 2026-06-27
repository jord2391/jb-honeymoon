import { useState, useEffect } from "react";

const TABS = ["itinerary", "travel", "hotels", "dining"];

const NAV_ICONS = {
  itinerary: "🗓️",
  travel: "✈️",
  hotels: "🏨",
  dining: "🍽️",
};

const sampleData = {
  tripName: "Our Kaua'i Honeymoon",
  dates: "Sept 11 – 19, 2026",
  days: 8,
  places: 5,
  itinerary: [
    { day: 1, date: "Sept 11", location: "DFW → Seattle → Lihue", events: ["7:15 a.m. - Depart DFW on DL804, arrive Seattle 9:37 a.m.", "4:05 p.m. - Depart Seattle on DL345, arrive Lihue 7:10 p.m.", "Pick up the Avis rental car at Lihue Airport (7 p.m. pickup)", "Drive to Princeville, check in to the condo by 10 p.m."] },
    { day: 2, date: "Sept 12", location: "Princeville", events: ["Open day — no bookings yet, good day to explore the North Shore"] },
    { day: 3, date: "Sept 13", location: "Lihue", events: ["Arrive by 9:30 a.m. for the Mountain Tubing Adventure (10 a.m. – 1 p.m.) with Kauai Backcountry Adventures", "Lunch included on the tour"] },
    { day: 4, date: "Sept 14", location: "Princeville", events: ["Open day — no bookings yet"] },
    { day: 5, date: "Sept 15", location: "Princeville", events: ["Open day — no bookings yet"] },
    { day: 6, date: "Sept 16", location: "Lihue", events: ["Arrive by 7:30 a.m. for the Zipline Tour (8 a.m. – 11 a.m.) with Kauai Backcountry Adventures", "Lunch included on the tour"] },
    { day: 7, date: "Sept 17", location: "Princeville", events: ["Open day — no bookings yet"] },
    { day: 8, date: "Sept 18", location: "Departure", events: ["Check out of the condo by 10 a.m.", "Return the Avis rental car at Lihue Airport by 7 p.m.", "9:54 p.m. - Depart Lihue on DL375, arrive Seattle 6:45 a.m. (Sept 19)"] },
    { day: 9, date: "Sept 19", location: "Seattle → DFW", events: ["9:15 a.m. - Depart Seattle on DL803, arrive DFW 3:17 p.m."] },
  ],
  travel: [
    { type: "flight", from: "Dallas (DFW)", to: "Seattle (SEA)", date: "Sept 11", time: "7:15 a.m. → 9:37 a.m.", duration: "Delta DL804", operator: "Booking ref ESCKHN · Jordan Brauner, Chance Brauner" },
    { type: "flight", from: "Seattle (SEA)", to: "Lihue (LIH)", date: "Sept 11", time: "4:05 p.m. → 7:10 p.m.", duration: "Delta DL345", operator: "Booking ref DGUWP9 · Jordan Brauner, Chance Brauner" },
    { type: "rental car", from: "Lihue (LIH)", to: "", date: "Sept 11 – 18", time: "7:00 p.m. pickup → 7:00 p.m. return", duration: "7 days · Mazda CX-50 or similar, automatic, unlimited mileage", operator: "Avis · Reservation #18315319US1 · $324.41 total" },
    { type: "flight", from: "Lihue (LIH)", to: "Seattle (SEA)", date: "Sept 18", time: "9:54 p.m. → 6:45 a.m. (+1)", duration: "Delta DL375", operator: "Booking ref DGUWP9 · Jordan Brauner, Chance Brauner" },
    { type: "flight", from: "Seattle (SEA)", to: "Dallas (DFW)", date: "Sept 19", time: "9:15 a.m. → 3:17 p.m.", duration: "Delta DL803", operator: "Booking ref ESCKHN · Jordan Brauner, Chance Brauner" },
  ],
  hotels: [
    { name: "Kauai Kailani 2 Bedroom Condo (KK116)", location: "Princeville", checkIn: "Sept 11", checkOut: "Sept 18", nights: 7, rating: null, amenities: ["Check-in: 3 p.m.", "Check-out: 10 a.m.", "Confirmation #43117", "Managed by Princeville Vacation Rentals (Kauai Real Estate Group)", "Concierge: 1-855-On-Kauai / fun@kauaiva.com"] },
  ],
  dining: [
    { id: 1, name: "Mountain Tubing Adventure", location: "Kauai Backcountry Adventures, Lihue", date: "Sept 13", meal: "10 a.m. – 1 p.m., lunch included", notes: "Booking #356687203 · 2 riders (Jordan & Chance) · arrive by 9:30 a.m.", booked: true },
    { id: 2, name: "Zipline Tour", location: "Kauai Backcountry Adventures, Lihue", date: "Sept 16", meal: "8 a.m. – 11 a.m., lunch included", notes: "Booking #356687204 · 2 riders (Jordan & Chance) · arrive by 7:30 a.m.", booked: true },
  ],
};

// ---- design tokens (Wanderlog-style: clean, card-based, map-app blue) ----
const C = {
  bg: "#F7F8FA",
  card: "#FFFFFF",
  border: "#E6E8EC",
  text: "#1F2430",
  textSoft: "#6B7280",
  textFaint: "#9CA3AF",
  primary: "#1A73E8",
  primarySoft: "#E8F0FE",
  primaryDeep: "#0F4FA3",
  green: "#1A9E6B",
  greenSoft: "#E5F7EE",
  amber: "#E0922D",
  amberSoft: "#FCF0DE",
  red: "#D93B3B",
  redSoft: "#FCE9E9",
  shadow: "0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)",
  shadowHover: "0 4px 12px rgba(16,24,40,0.08)",
};

const fontDisplay = "'Manrope', 'Inter', system-ui, sans-serif";
const fontBody = "'Inter', system-ui, sans-serif";

const FONT_IMPORT_ID = "trip-app-fonts";
if (typeof document !== "undefined" && !document.getElementById(FONT_IMPORT_ID)) {
  const link = document.createElement("link");
  link.id = FONT_IMPORT_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap";
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
          background: C.bg,
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
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: "2.2rem 2rem",
            maxWidth: 360,
            width: "100%",
            textAlign: "center",
            boxShadow: C.shadowHover,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: C.primarySoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
              fontSize: 20,
            }}
          >
            📍
          </div>
          <h1
            style={{
              margin: "0 0 6px",
              fontFamily: fontDisplay,
              fontWeight: 800,
              fontSize: 21,
              color: C.text,
              letterSpacing: "-0.01em",
            }}
          >
            Kaua'i Honeymoon
          </h1>
          <p style={{ margin: "0 0 22px", fontSize: 14, color: C.textSoft }}>
            Enter the passcode to view this trip
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
              borderRadius: 10,
              border: `1px solid ${error ? C.red : C.border}`,
              fontSize: 15,
              fontFamily: fontBody,
              outline: "none",
              marginBottom: 12,
              background: C.bg,
              color: C.text,
            }}
          />
          {error && (
            <p style={{ margin: "0 0 12px", fontSize: 13, color: C.red }}>
              Incorrect passcode, try again.
            </p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "11px 0",
              borderRadius: 10,
              border: "none",
              background: C.primary,
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: fontBody,
              cursor: "pointer",
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

function SectionLabel({ children, count }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.1rem" }}>
      <h2
        style={{
          fontFamily: fontDisplay,
          fontSize: 19,
          fontWeight: 800,
          color: C.text,
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </h2>
      {count != null && (
        <span style={{ fontSize: 13, color: C.textFaint, fontFamily: fontBody }}>{count} total</span>
      )}
    </div>
  );
}

function Pill({ children, bg, color }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontFamily: fontBody,
        fontWeight: 700,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        background: bg,
        color: color,
        padding: "3px 9px",
        borderRadius: 6,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

function ItineraryTab({ data }) {
  const [expanded, setExpanded] = useState(data[0]?.day ?? null);
  return (
    <div>
      <SectionLabel count={data.length}>Day-by-day itinerary</SectionLabel>

      <div style={{ position: "relative" }}>
        {/* vertical route line */}
        <div
          style={{
            position: "absolute",
            left: 19,
            top: 8,
            bottom: 8,
            width: 2,
            background: `repeating-linear-gradient(to bottom, ${C.border} 0, ${C.border} 4px, transparent 4px, transparent 8px)`,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.map((d) => {
            const isOpen = expanded === d.day;
            return (
              <div key={d.day} style={{ position: "relative", paddingLeft: 48 }}>
                {/* day marker */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 4,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: isOpen ? C.primary : "#fff",
                    border: `2px solid ${isOpen ? C.primary : C.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: fontDisplay,
                    fontWeight: 800,
                    fontSize: 15,
                    color: isOpen ? "#fff" : C.textSoft,
                    zIndex: 1,
                  }}
                >
                  {d.day}
                </div>

                <div
                  onClick={() => setExpanded(isOpen ? null : d.day)}
                  style={{
                    background: C.card,
                    border: `1px solid ${isOpen ? C.primary : C.border}`,
                    borderRadius: 12,
                    padding: "0.95rem 1.1rem",
                    cursor: "pointer",
                    boxShadow: isOpen ? C.shadowHover : C.shadow,
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontFamily: fontDisplay, fontWeight: 700, fontSize: 15.5, color: C.text }}>
                        {d.location}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 12.5, fontFamily: fontBody, color: C.textFaint }}>
                        {d.date} · {d.events.length} stops
                      </p>
                    </div>
                    <span
                      style={{
                        color: C.textFaint,
                        fontSize: 16,
                        transition: "transform 0.2s",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      ⌄
                    </span>
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                      {d.events.map((e, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < d.events.length - 1 ? 10 : 0 }}>
                          <span
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background: C.primarySoft,
                              color: C.primary,
                              fontSize: 10,
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              marginTop: 1,
                              fontFamily: fontBody,
                            }}
                          >
                            {i + 1}
                          </span>
                          <span style={{ fontSize: 13.5, fontFamily: fontBody, color: C.text, lineHeight: 1.45 }}>{e}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TravelTab({ data }) {
  return (
    <div>
      <SectionLabel count={data.length}>Flights &amp; rental car</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map((t, i) => (
          <div
            key={i}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "1rem 1.1rem",
              boxShadow: C.shadow,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Pill bg={t.type === "flight" ? C.primarySoft : C.greenSoft} color={t.type === "flight" ? C.primary : C.green}>
                {t.type === "flight" ? "✈ Flight" : "🚙 Rental car"}
              </Pill>
              <span style={{ fontSize: 12.5, fontFamily: fontBody, color: C.textFaint, marginLeft: "auto" }}>{t.date}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "left", minWidth: 64 }}>
                <p style={{ margin: 0, fontFamily: fontDisplay, fontWeight: 800, fontSize: 16, color: C.text }}>{t.from.split(" ")[0]}</p>
                <p style={{ margin: 0, fontSize: 12, fontFamily: fontBody, color: C.textFaint }}>{t.time.split(" → ")[0]}</p>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 11, fontFamily: fontBody, color: C.textFaint }}>{t.duration}</span>
                <div style={{ width: "100%", height: 1, background: C.border, position: "relative" }}>
                  <span style={{ position: "absolute", left: "50%", top: -6, transform: "translateX(-50%)", fontSize: 12, color: C.primary }}>
                    {t.type === "flight" ? "✈" : "→"}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right", minWidth: 64 }}>
                <p style={{ margin: 0, fontFamily: fontDisplay, fontWeight: 800, fontSize: 16, color: C.text }}>{t.to.split(" ")[0] || "—"}</p>
                <p style={{ margin: 0, fontSize: 12, fontFamily: fontBody, color: C.textFaint }}>{t.time.split(" → ")[1] || ""}</p>
              </div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}`, fontSize: 12.5, fontFamily: fontBody, color: C.textSoft }}>
              {t.operator}
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
      <SectionLabel count={data.length}>Where you're staying</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map((h, i) => (
          <div
            key={i}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "1rem 1.1rem",
              boxShadow: C.shadow,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
              <div>
                <p style={{ margin: 0, fontFamily: fontDisplay, fontWeight: 700, fontSize: 16, color: C.text }}>{h.name}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12.5, fontFamily: fontBody, color: C.textFaint }}>📍 {h.location}</p>
              </div>
              {h.rating && (
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: 12.5,
                    fontWeight: 700,
                    fontFamily: fontBody,
                    background: C.greenSoft,
                    color: C.green,
                    padding: "3px 8px",
                    borderRadius: 6,
                  }}
                >
                  ★ {h.rating}
                </span>
              )}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                margin: "10px 0",
                padding: "10px 0",
                borderTop: `1px solid ${C.border}`,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 10.5, fontFamily: fontBody, fontWeight: 700, letterSpacing: "0.04em", color: C.textFaint, textTransform: "uppercase" }}>Check-in</p>
                <p style={{ margin: 0, fontSize: 13, fontFamily: fontBody, color: C.text, fontWeight: 600 }}>{h.checkIn}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 10.5, fontFamily: fontBody, fontWeight: 700, letterSpacing: "0.04em", color: C.textFaint, textTransform: "uppercase" }}>Nights</p>
                <p style={{ margin: 0, fontSize: 17, fontFamily: fontDisplay, fontWeight: 800, color: C.primary }}>{h.nights}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 10.5, fontFamily: fontBody, fontWeight: 700, letterSpacing: "0.04em", color: C.textFaint, textTransform: "uppercase" }}>Check-out</p>
                <p style={{ margin: 0, fontSize: 13, fontFamily: fontBody, color: C.text, fontWeight: 600 }}>{h.checkOut}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {h.amenities.map((a) => (
                <span
                  key={a}
                  style={{
                    fontSize: 12,
                    fontFamily: fontBody,
                    padding: "4px 10px",
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 20,
                    color: C.textSoft,
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
      <SectionLabel count={restaurants.length}>Dining &amp; experiences</SectionLabel>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: C.greenSoft,
            borderRadius: 8,
            padding: "6px 11px",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, display: "inline-block" }} />
          <span style={{ fontSize: 12.5, fontFamily: fontBody, color: C.green, fontWeight: 700 }}>{booked} Booked</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: C.amberSoft,
            borderRadius: 8,
            padding: "6px 11px",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.amber, display: "inline-block" }} />
          <span style={{ fontSize: 12.5, fontFamily: fontBody, color: C.amber, fontWeight: 700 }}>{needToBook} Need to book</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {restaurants.map((r) => (
          <div
            key={r.id}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "1rem 1.1rem",
              boxShadow: C.shadow,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <p style={{ margin: 0, fontFamily: fontDisplay, fontWeight: 700, fontSize: 15, color: C.text }}>{r.name}</p>
                  <Pill bg={C.bg} color={C.textSoft}>{r.meal}</Pill>
                </div>
                <p style={{ margin: "0 0 4px", fontSize: 12.5, fontFamily: fontBody, color: C.textFaint }}>
                  📍 {r.location} · {r.date}
                </p>
                {r.notes && (
                  <p style={{ margin: 0, fontSize: 13, fontFamily: fontBody, color: C.textSoft }}>
                    {r.notes}
                  </p>
                )}
              </div>

              <button
                onClick={() => toggleBooked(r.id)}
                style={{
                  flexShrink: 0,
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: `1px solid ${r.booked ? C.green : C.amber}`,
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: fontBody,
                  fontWeight: 700,
                  transition: "background 0.15s",
                  background: r.booked ? C.greenSoft : C.amberSoft,
                  color: r.booked ? C.green : C.amber,
                  minWidth: 108,
                }}
              >
                {r.booked ? "✓ Booked" : "Need to book"}
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
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: fontBody, color: C.text }}>
      <header style={{ background: C.card, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ padding: "1.4rem 0 1rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 11.5,
                  fontFamily: fontBody,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: C.primary,
                }}
              >
                Trip plan
              </p>
              <h1 style={{ margin: 0, fontFamily: fontDisplay, fontSize: 25, fontWeight: 800, color: C.text, letterSpacing: "-0.01em" }}>
                {sampleData.tripName}
              </h1>
              <p style={{ margin: "5px 0 0", fontSize: 13.5, fontFamily: fontBody, color: C.textSoft }}>
                {sampleData.dates} · {sampleData.days} days · {sampleData.places} places
              </p>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: C.primarySoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              🏝️
            </div>
          </div>
          <nav style={{ display: "flex", gap: 4, marginTop: 4 }}>
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: tab === t ? `2px solid ${C.primary}` : "2px solid transparent",
                  padding: "9px 14px",
                  cursor: "pointer",
                  fontSize: 13.5,
                  fontFamily: fontBody,
                  fontWeight: tab === t ? 700 : 500,
                  color: tab === t ? C.primary : C.textSoft,
                  textTransform: "capitalize",
                  transition: "all 0.15s",
                }}
              >
                {NAV_ICONS[t]} {t}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "1.6rem 1.5rem 3rem" }}>
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
