import { useState, useEffect } from "react";
const TABS = ["itinerary", "travel", "hotel", "experiences", "dining"];
const NAV_ICONS = {
  itinerary: "🌺",
  travel: "✈️",
  hotel: "🌴",
  experiences: "🤿",
  dining: "🍹",
};

// ---- known locations (lat/lng used for the map view & drive-time legs) ----
// Coordinates are approximate — good enough for pins & a keyless map embed,
// not survey-accurate. Swap in exact geocodes any time.
const LOCATIONS = {
  condo: {
    name: "Condo — Kapa'a",
    address: "4-856 Kuhio Hwy, Kapa'a, HI 96746",
    lat: 22.0617909,
    lng: -159.3214865,
  },
  lihueAirport: {
    name: "Lihue Airport (LIH)",
    address: "3901 Mokulele Loop, Lihue, HI 96766",
    lat: 21.976,
    lng: -159.339,
  },
  backcountryAdventures: {
    name: "Kauai Backcountry Adventures",
    address: "Lihue, HI",
    lat: 21.9975,
    lng: -159.3667,
  },
  beachHouse: {
    name: "Beach House Restaurant",
    address: "5022 Lawai Rd, Koloa, HI 96756",
    lat: 21.8836,
    lng: -159.4614,
  },
  makaiGolf: {
    name: "Makai Golf Club",
    address: "4080 Lei O Papa Rd, Princeville, HI 96722",
    lat: 22.2255,
    lng: -159.4823,
  },
  portAllen: {
    name: "Capt. Andy's — Port Allen",
    address: "Port Allen, Eleele, HI 96705",
    lat: 21.9021,
    lng: -159.5931,
  },
};

const sampleData = {
  tripName: "Honeymoon in Kauai",
  dates: "September 11 – 19, 2026",
  itinerary: [
    {
      day: 1,
      date: "Friday, September 11",
      location: "DFW → Seattle → Lihue",
      events: [
        "7:15 a.m. - Depart DFW → arrive Seattle 9:37 a.m.",
        "4:05 p.m. - Depart Seattle → arrive Lihue 7:10 p.m.",
        "Pick up the Avis rental car at Lihue Airport",
        "Drive to condo",
        "Dinner at XX",
      ],
      // Structured stops power the drive-time legs & map view below.
      stops: [
        { name: "Lihue Airport — rental car pickup", time: "7:10 p.m.", locationKey: "lihueAirport" },
        { name: "Condo check-in", time: "~7:30 p.m.", locationKey: "condo", driveMinFromPrev: 15 },
      ],
    },
    {
      day: 2,
      date: "Saturday, September 12",
      location: "Lihue",
      events: ["Open day — no bookings yet, good day to explore the North Shore"],
      // No fixed stops yet — the map/drive-time section is skipped for this day.
    },
    {
      day: 3,
      date: "Sunday, September 13",
      location: "Lihue",
      events: ["9:30 a.m. - Mountain Tubing Adventure (10 a.m. – 1 p.m.)", "Lunch included on the tour"],
      stops: [
        { name: "Condo", time: "8:45 a.m. depart", locationKey: "condo" },
        { name: "Kauai Backcountry Adventures — Mountain Tubing", time: "9:30 a.m. arrive", locationKey: "backcountryAdventures", driveMinFromPrev: 20 },
      ],
    },
    {
      day: 4,
      date: "Monday, September 14",
      location: "Lihue",
      events: ["6:15 p.m. - Dinner at Beach House Restaurant"],
      stops: [
        { name: "Condo", time: "5:30 p.m. depart", locationKey: "condo" },
        { name: "Beach House Restaurant", time: "6:15 p.m. dinner", locationKey: "beachHouse", driveMinFromPrev: 40 },
      ],
    },
    {
      day: 5,
      date: "Tuesday, September 15",
      location: "Lihue",
      events: ["8:15 a.m. - Tee time at Makai Golf Club"],
      stops: [
        { name: "Condo", time: "7:45 a.m. depart", locationKey: "condo" },
        { name: "Makai Golf Club", time: "8:15 a.m. tee time", locationKey: "makaiGolf", driveMinFromPrev: 25 },
      ],
    },
    {
      day: 6,
      date: "Wednesday, September 16",
      location: "Lihue",
      events: ["7:30 a.m. - Zipline Tour (8 – 11 a.m.)", "Lunch included on the tour"],
      stops: [
        { name: "Condo", time: "7:00 a.m. depart", locationKey: "condo" },
        { name: "Kauai Backcountry Adventures — Zipline", time: "7:30 a.m. arrive", locationKey: "backcountryAdventures", driveMinFromPrev: 20 },
      ],
    },
    {
      day: 7,
      date: "Thursday, September 17",
      location: "Lihue",
      events: ["1:45 p.m. - Sunset Dinner Boat Cruise"],
      stops: [
        { name: "Condo", time: "12:45 p.m. depart", locationKey: "condo" },
        { name: "Capt. Andy's — Port Allen", time: "1:45 p.m. boarding", locationKey: "portAllen", driveMinFromPrev: 60 },
      ],
    },
    {
      day: 8,
      date: "Friday, September 18",
      location: "Lihue → Seattle",
      events: [
        "10 a.m. - Check out",
        "7 p.m. - Rental car return",
        "9:54 p.m. - Depart Lihue → arrive Seattle 6:45 a.m. (Sept 19)",
      ],
      stops: [
        { name: "Condo checkout", time: "10:00 a.m.", locationKey: "condo" },
        { name: "Lihue Airport — rental car return", time: "7:00 p.m.", locationKey: "lihueAirport", driveMinFromPrev: 20 },
      ],
    },
    {
      day: 9,
      date: "Saturday, September 19",
      location: "Seattle → DFW",
      events: ["9:15 a.m. - Depart Seattle → arrive DFW 3:17 p.m."],
    },
  ],
  travel: [
    { type: "flight", from: "Dallas (DFW)", to: "Seattle (SEA)", date: "September 11", time: "7:15 a.m. → 9:37 a.m.", duration: "Delta #804", operator: "Booking ref: ESCKHN · Jordan & Chance Brauner" },
    { type: "flight", from: "Seattle (SEA)", to: "Lihue (LIH)", date: "September 11", time: "4:05 p.m. → 7:10 p.m.", duration: "Delta #345", operator: "Booking ref: DGUWP9 · Jordan & Chance Brauner" },
    { type: "rental car", from: "Lihue (LIH)", to: "", date: "September 11 – 18", time: "7:00 p.m. pickup → 7:00 p.m. return", duration: "7 days", operator: "Avis · Reservation#: 18315319US1" },
    { type: "flight", from: "Lihue (LIH)", to: "Seattle (SEA)", date: "September 18", time: "9:54 p.m. → 6:45 a.m. (+1)", duration: "Delta #375", operator: "Booking ref: DGUWP9 · Jordan & Chance Brauner" },
    { type: "flight", from: "Seattle (SEA)", to: "Dallas (DFW)", date: "September 19", time: "9:15 a.m. → 3:17 p.m.", duration: "Delta #803", operator: "Booking ref: ESCKHN · Jordan & Chance Brauner" },
  ],
  hotel: [
    { name: "Kauai Kailani 2 Bedroom Condo (KK116)", location: "Kauai", checkIn: "September 11", checkOut: "September 18", nights: 7, amenities: ["Check-in: 3 p.m.", "Check-out: 10 a.m.", "Confirmation #43117"] },
  ],
  experiences: [
    { id: 1, name: "Mountain Tubing Adventure", location: "Kauai Backcountry Adventures, Lihue", date: "September 13", meal: "10 a.m. – 1 p.m., lunch included", notes: "Booking #356687203 · arrive by 9:30 a.m.", booked: true },
    { id: 2, name: "Makai Golf Club", location: "4080 Lei O Papa Rd, Kauai, Hawaii 96722", date: "September 15", meal: "8:15 a.m. tee time", notes: "Booking confirmation in email", booked: true },
    { id: 3, name: "Zipline Tour", location: "Kauai Backcountry Adventures, Lihue", date: "September 16", meal: "8 – 11 a.m., lunch included", notes: "Booking #356687204 · arrive by 7:30 a.m.", booked: true },
    { id: 4, name: "Sunset Dinner Boat Cruise", location: "Capt. Andys, Port Allen, Eleele", date: "September 17", meal: "1:45 – 7 p.m., dinner included", notes: "Booking #00359295 · no shoes allowed on board", booked: true },
  ],
  dining: [
    { id: 1, name: "Beach House Restaurant", location: "Koloa", date: "September 14", meal: "Dinner, 6:15 p.m.", notes: "Anniversary dinner", booked: true },
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
const SITE_PASSCODE = "JC2026";
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
            Kauai Honeymoon
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

// ---- drive-time / map helpers ----
function formatDriveTime(min) {
  if (min == null) return null;
  if (min < 60) return `~${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `~${h}h${m ? ` ${m}m` : ""}`;
}

// Builds a keyless Google Maps embed URL (the classic "output=embed" trick —
// no API key required, but also not officially supported/guaranteed by
// Google). If you have a Maps API key, swap this for the official Maps
// Embed API (`https://www.google.com/maps/embed/v1/directions?...&key=...`)
// for a guaranteed-stable embed.
function buildEmbedMapUrl(stops) {
  const withLoc = (stops || []).filter((s) => LOCATIONS[s.locationKey]);
  if (withLoc.length === 0) return null;
  if (withLoc.length === 1) {
    const { lat, lng, name } = LOCATIONS[withLoc[0].locationKey];
    return `https://maps.google.com/maps?q=${lat},${lng}(${encodeURIComponent(name)})&z=12&output=embed`;
  }
  const [first, ...rest] = withLoc;
  const start = LOCATIONS[first.locationKey];
  const daddrParts = rest
    .map((s) => `${LOCATIONS[s.locationKey].lat},${LOCATIONS[s.locationKey].lng}`)
    .join("+to:");
  return `https://maps.google.com/maps?saddr=${start.lat},${start.lng}&daddr=${daddrParts}&output=embed`;
}

// Real Google Maps deep link (no key needed) for accurate, live directions —
// use this as the source of truth over the hardcoded driveMinFromPrev estimates.
function buildDirectionsUrl(stops) {
  const withLoc = (stops || []).filter((s) => LOCATIONS[s.locationKey]);
  if (withLoc.length < 2) return null;
  const [first, ...rest] = withLoc;
  const last = rest[rest.length - 1];
  const waypoints = rest
    .slice(0, -1)
    .map((s) => `${LOCATIONS[s.locationKey].lat},${LOCATIONS[s.locationKey].lng}`)
    .join("|");
  const origin = `${LOCATIONS[first.locationKey].lat},${LOCATIONS[first.locationKey].lng}`;
  const destination = `${LOCATIONS[last.locationKey].lat},${LOCATIONS[last.locationKey].lng}`;
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  if (waypoints) url += `&waypoints=${waypoints}`;
  return url;
}

function totalDriveMinutes(stops) {
  return (stops || []).reduce((sum, s) => sum + (s.driveMinFromPrev || 0), 0);
}

function DriveTimeChip({ minutes }) {
  return (
    <span
      style={{
        fontSize: 12,
        fontFamily: fontMono,
        fontWeight: 600,
        color: C.seaglass,
        background: C.seaglassSoft,
        padding: "3px 10px",
        borderRadius: 20,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
      }}
    >
      🚗 {formatDriveTime(minutes)} drive
    </span>
  );
}

function StopsWithDriveTimes({ stops }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {stops.map((s, i) => (
        <div key={i}>
          {i > 0 && s.driveMinFromPrev != null && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0 5px 6px" }}>
              <span style={{ width: 1, height: 18, background: C.ropeLine, marginLeft: 6 }} />
              <DriveTimeChip minutes={s.driveMinFromPrev} />
            </div>
          )}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span
              style={{
                width: 13,
                height: 13,
                borderRadius: "50%",
                background: i === stops.length - 1 ? C.coral : C.ocean,
                marginTop: 3,
                flexShrink: 0,
                boxShadow: `0 0 0 3px ${C.card}, 0 0 0 4px ${C.ropeLine}`,
              }}
            />
            <div>
              <p style={{ margin: 0, fontSize: 14, fontFamily: fontBody, fontWeight: 600, color: C.ink }}>
                {s.name}
              </p>
              {s.time && (
                <p style={{ margin: 0, fontSize: 12, fontFamily: fontMono, color: C.inkSoft }}>{s.time}</p>
              )}
              {LOCATIONS[s.locationKey]?.address && (
                <p style={{ margin: 0, fontSize: 11, fontFamily: fontBody, color: C.inkSoft }}>
                  📍 {LOCATIONS[s.locationKey].address}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DayMap({ stops }) {
  const src = buildEmbedMapUrl(stops);
  const directionsUrl = buildDirectionsUrl(stops);
  if (!src) return null;
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${C.ropeLine}` }}>
        <iframe
          title="Route map"
          src={src}
          width="100%"
          height="220"
          style={{ border: 0, display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {directionsUrl && (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 8,
            fontSize: 12,
            fontFamily: fontBody,
            fontWeight: 600,
            color: C.ocean,
            textDecoration: "none",
          }}
        >
          Open in Google Maps ↗
        </a>
      )}
    </div>
  );
}

function ToggleButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 14px",
        borderRadius: 20,
        border: `1px solid ${active ? C.ocean : C.ropeLine}`,
        background: active ? C.ocean : C.card,
        color: active ? "#fff" : C.inkSoft,
        fontSize: 13,
        fontFamily: fontBody,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function DayPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: 20,
        border: `1px solid ${active ? C.hibiscus : C.ropeLine}`,
        background: active ? C.hibiscusSoft : C.card,
        color: active ? C.hibiscus : C.inkSoft,
        fontSize: 12,
        fontFamily: fontMono,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function RouteCard({ day }) {
  const totalDrive = totalDriveMinutes(day.stops);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.rope}`, borderRadius: 16, padding: "1.2rem 1.3rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div>
          <p style={{ margin: 0, fontFamily: fontDisplay, fontWeight: 600, fontSize: 17, color: C.ink }}>
            Day {day.day} · {day.location}
          </p>
          <p style={{ margin: 0, fontSize: 13, fontFamily: fontBody, color: C.inkSoft }}>{day.date}</p>
        </div>
        {totalDrive > 0 && (
          <span
            style={{
              fontSize: 12,
              fontFamily: fontMono,
              fontWeight: 600,
              color: C.seaglass,
              background: C.seaglassSoft,
              padding: "4px 10px",
              borderRadius: 20,
            }}
          >
            🚗 {formatDriveTime(totalDrive)} total driving
          </span>
        )}
      </div>
      <StopsWithDriveTimes stops={day.stops} />
      <DayMap stops={day.stops} />
    </div>
  );
}

function ItineraryTab({ data }) {
  const [expanded, setExpanded] = useState(data[0]?.day ?? null);
  const [view, setView] = useState("list"); // "list" | "map"
  const mappableDays = data.filter((d) => d.stops && d.stops.length > 0);
  const [mapDay, setMapDay] = useState(mappableDays[0]?.day ?? null);
  const activeMapDay = mappableDays.find((d) => d.day === mapDay) || mappableDays[0];

  return (
    <div>
      <SectionLabel>Day-by-day plan</SectionLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: "1.3rem" }}>
        <ToggleButton active={view === "list"} onClick={() => setView("list")}>
          📋 List
        </ToggleButton>
        <ToggleButton active={view === "map"} onClick={() => setView("map")}>
          🗺️ Map
        </ToggleButton>
      </div>

      {view === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {data.map((d) => {
            const dayTotalDrive = totalDriveMinutes(d.stops);
            return (
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
                    <p style={{ margin: 0, fontSize: 13, fontFamily: fontBody, color: C.inkSoft }}>
                      {d.date} · {d.events.length} {d.events.length === 1 ? "activity" : "activities"}
                      {dayTotalDrive > 0 ? ` · 🚗 ${formatDriveTime(dayTotalDrive)}` : ""}
                    </p>
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
                    {d.stops && d.stops.length > 0 && (
                      <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px dashed ${C.ropeLine}` }} onClick={(ev) => ev.stopPropagation()}>
                        <p
                          style={{
                            margin: "0 0 10px",
                            fontSize: 11,
                            fontFamily: fontBody,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: C.seaglass,
                          }}
                        >
                          Route &amp; drive times
                        </p>
                        <StopsWithDriveTimes stops={d.stops} />
                        <DayMap stops={d.stops} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {view === "map" && (
        <div>
          {mappableDays.length === 0 ? (
            <p style={{ fontSize: 14, fontFamily: fontBody, color: C.inkSoft }}>
              No fixed stops yet to map — add some bookings and they'll show up here.
            </p>
          ) : (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {mappableDays.map((d) => (
                  <DayPill key={d.day} active={activeMapDay && d.day === activeMapDay.day} onClick={() => setMapDay(d.day)}>
                    Day {d.day} · {d.date.replace("September ", "Sep ")}
                  </DayPill>
                ))}
              </div>
              {activeMapDay && <RouteCard day={activeMapDay} />}
            </>
          )}
        </div>
      )}
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
                <span style={{ fontSize: 11, fontFamily: fontMono, color: C.seaglass, textAlign: "center" }}>{t.duration}</span>
                <div style={{ width: "100%", height: 1, background: C.ropeLine, position: "relative" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.coral, position: "absolute", right: 0, top: -3 }} />
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontFamily: fontDisplay, fontWeight: 600, fontSize: 17, color: C.ink }}>{t.to ? t.to.split(" ")[0] : ""}</p>
                <p style={{ margin: 0, fontSize: 12, fontFamily: fontMono, color: C.inkSoft }}>{t.time.includes(" → ") ? t.time.split(" → ")[1] : ""}</p>
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
function HotelTab({ data }) {
  return (
    <div>
      <SectionLabel>Where we're staying</SectionLabel>
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
function ListTab({ initialData, title }) {
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
      <SectionLabel>{title}</SectionLabel>
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
              🌴 Jordan & Chance
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
        {tab === "hotel" && <HotelTab data={sampleData.hotel} />}
        {tab === "experiences" && <ListTab initialData={sampleData.experiences} title="Booked experiences" />}
        {tab === "dining" && <ListTab initialData={sampleData.dining} title="Dining" />}
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
