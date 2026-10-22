import { useEffect, useMemo, useState } from "react";
import { portalApi } from "./api";
import type { PortalAppointment, PortalDemoCentre, PortalMe, PortalService, PortalUrgency } from "./types";

type View = "overview" | "appointments" | "services" | "urgencies";

const IconTooth = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3C9.5 3 7.5 5 7.5 7.5c0 1.5.5 2.7 1 4.2L10 18c.4 1.8 1.2 3 2 3s1.6-1.2 2-3l1.5-6.3c.5-1.5 1-2.7 1-4.2C16.5 5 14.5 3 12 3z"/>
  </svg>
);
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconClipboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);
const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 14, height: 14, flexShrink: 0 }}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const navItems = [
  { key: "overview" as View,      icon: <IconHome />,      label: "Overzicht"  },
  { key: "appointments" as View,  icon: <IconCalendar />,  label: "Afspraken"  },
  { key: "services" as View,      icon: <IconClipboard />, label: "Diensten"   },
  { key: "urgencies" as View,     icon: <IconAlert />,     label: "Urgenties"  },
];

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("nl-BE", { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(`${value}T12:00:00`));
}

function PortalLogin({ onLogin }: { onLogin: () => Promise<void> }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoCentres, setDemoCentres] = useState<PortalDemoCentre[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  useEffect(() => { portalApi.demoCentres().then(setDemoCentres).catch(() => setDemoCentres([])); }, []);

  const matches = demoCentres.filter((c) =>
    `${c.name} ${c.city} ${c.username}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="portal-login">
      <div className="portal-login-bg" aria-hidden="true" />
      <section className="portal-login-card">
        <div className="portal-login-brand">
          <span className="portal-mark"><IconTooth /></span>
          <span className="portal-login-brand-name">Global Smile Care</span>
        </div>

        <h1>Welkom terug</h1>
        <p className="portal-muted">Meld u aan om afspraken, diensten en urgenties te bekijken voor uw zorgcentrum.</p>

        <form onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setLoading(true);
          try { await portalApi.login(username, password); await onLogin(); }
          catch (err) { setError(err instanceof Error ? err.message : "Aanmelden mislukt."); }
          finally { setLoading(false); }
        }}>
          {demoCentres.length > 0 && (
            <div className="portal-demo-picker">
              <div className="portal-demo-heading">
                <strong>Democentrum kiezen</strong>
                <span>{demoCentres.length} centra</span>
              </div>
              <label>Zoeken
                <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Naam of gemeente…" />
              </label>
              <div className="portal-demo-options">
                {matches.slice(0, 6).map((c) => (
                  <button type="button" key={c.username} className={username === c.username ? "selected" : ""}
                    onClick={() => { setUsername(c.username); setSelected(c.name); setSearch(c.city); }}>
                    <span><strong>{c.name}</strong><small>{c.city}</small></span>
                    <IconChevron />
                  </button>
                ))}
                {matches.length === 0 && <p>Geen centrum gevonden.</p>}
                {matches.length > 6 && <p>Typ meer om te verfijnen.</p>}
              </div>
              {selected && <p className="portal-demo-selected">Gekozen: {selected}</p>}
            </div>
          )}

          <label>Gebruikersnaam
            <input autoComplete="username" value={username}
              onChange={(e) => { setUsername(e.target.value); setSelected(""); }} required />
          </label>
          <label>Wachtwoord
            <input type="password" autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p className="portal-error">{error}</p>}
          <button className="portal-primary" type="submit" disabled={loading}>
            {loading ? "Aanmelden…" : "Aanmelden"}
          </button>
        </form>
      </section>
    </main>
  );
}

export function PortalApp() {
  const [me, setMe] = useState<PortalMe | null>(null);
  const [view, setView] = useState<View>("overview");
  const [appointments, setAppointments] = useState<PortalAppointment[]>([]);
  const [services, setServices] = useState<PortalService[]>([]);
  const [urgencies, setUrgencies] = useState<PortalUrgency[]>([]);
  const [showUrgencyForm, setShowUrgencyForm] = useState(false);
  const [form, setForm] = useState({ reported_on: new Date().toISOString().slice(0, 10), patient_name: "", urgency_type: "Tandpijn", remark: "" });

  const load = async () => {
    const identity = await portalApi.me();
    setMe(identity);
    const [a, s, u] = await Promise.all([portalApi.appointments(), portalApi.services(), portalApi.urgencies()]);
    setAppointments(a); setServices(s); setUrgencies(u);
  };

  useEffect(() => { if (portalApi.token()) load().catch(() => portalApi.logout()); }, []);

  const today = new Date().toLocaleDateString("sv-SE");
  const openUrgencies = useMemo(() => urgencies.filter((u) => u.status.toLowerCase() === "open").length, [urgencies]);
  const upcomingAppointments = useMemo(() => appointments.filter((a) => a.date >= today && !["Geannuleerd", "Uitgevoerd"].includes(a.status)).sort((a, b) => `${a.date} ${a.start_time}`.localeCompare(`${b.date} ${b.start_time}`)), [appointments, today]);
  const pastAppointments = useMemo(() => appointments.filter((a) => a.date < today || a.status === "Uitgevoerd").sort((a, b) => `${b.date} ${b.start_time}`.localeCompare(`${a.date} ${a.start_time}`)), [appointments, today]);
  const upcomingServices = useMemo(() => services.filter((s) => s.date >= today && s.status !== "Uitgevoerd"), [services, today]);
  const pastServices = useMemo(() => services.filter((s) => s.date < today || s.status === "Uitgevoerd"), [services, today]);
  const upcoming = upcomingAppointments[0];
  const servicesThisMonth = useMemo(() => services.filter((s) => s.date.slice(0, 7) === today.slice(0, 7)).length, [services, today]);
  const switchCentre = () => { portalApi.logout(); setMe(null); setView("overview"); setAppointments([]); setServices([]); setUrgencies([]); };

  if (!me) return <PortalLogin onLogin={load} />;

  const title = navItems.find(({ key }) => key === view)?.label ?? "Overzicht";

  return (
    <main className="portal-shell">
      <aside className="portal-sidebar">
        <div className="portal-brand">
          <span className="portal-brand-mark"><IconTooth /></span>
          <span>Global Smile<br /><strong>Care</strong></span>
        </div>
        <nav aria-label="Portaalnavigatie">
          {navItems.map(({ key, icon, label }) => (
            <button key={key} className={view === key ? "active" : ""} onClick={() => setView(key)}>
              <span className="portal-nav-icon">{icon}</span>
              <span className="portal-nav-label">{label}</span>
            </button>
          ))}
        </nav>
        <div className="portal-sidebar-foot">
          <div className="portal-account">
            <div className="portal-avatar">{me.wzc_name.slice(0, 1)}</div>
            <div>
              <strong title={me.wzc_name}>{me.wzc_name}</strong>
              <small title={me.username}>{me.username}</small>
            </div>
          </div>
          <button className="portal-switch" onClick={switchCentre}>Afmelden</button>
        </div>
      </aside>

      <section className="portal-content">
        <header className="portal-topbar">
          <div className="portal-breadcrumb">Zorgcentrum <span>/</span> {title}</div>
          <div className="portal-top-actions">
            <button aria-label="Meldingen" className="portal-icon-btn"><IconBell /><i /></button>
            <button aria-label="Profiel" className="portal-user-button"><IconUser /></button>
          </div>
        </header>

        {view === "overview" && <>
          <section className="portal-hero">
            <div>
              <p className="portal-kicker">{me.wzc_name}</p>
              <h1>Welkom bij uw<br />zorgcentrum</h1>
              <p>Alles wat u nodig heeft voor een vlotte samenwerking met Global Smile Care.</p>
            </div>
            <div className="portal-building" aria-hidden="true">
              <div className="portal-cloud cloud-one" /><div className="portal-cloud cloud-two" />
              <div className="portal-trees" />
              <div className="portal-building-body"><span /><span /><span /><span /><span /><span /></div>
            </div>
          </section>

          <section className="portal-metrics">
            <button className="metric metric-mint" onClick={() => setView("appointments")}>
              <span className="metric-icon"><IconCalendar /></span>
              <span>
                <small>Volgende afspraak</small>
                <strong>{upcoming ? `${dateLabel(upcoming.date)} · ${upcoming.start_time}` : "Geen gepland"}</strong>
                <em>{upcoming?.type || "Nieuwe afspraken verschijnen hier"}</em>
              </span>
              <b><IconChevron /></b>
            </button>
            <button className="metric metric-gold" onClick={() => setView("urgencies")}>
              <span className="metric-icon"><IconAlert /></span>
              <span>
                <small>Open urgenties</small>
                <strong>{openUrgencies}</strong>
                <em>Bekijk de laatste meldingen</em>
              </span>
              <b><IconChevron /></b>
            </button>
            <button className="metric metric-blue" onClick={() => setView("services")}>
              <span className="metric-icon"><IconClipboard /></span>
              <span>
                <small>Diensten deze maand</small>
                <strong>{servicesThisMonth}</strong>
                <em>Geplande zorgactiviteiten</em>
              </span>
              <b><IconChevron /></b>
            </button>
          </section>

          <section className="portal-panels">
            <article className="portal-panel">
              <div className="panel-heading">
                <div><p className="portal-kicker">Planning</p><h2>Aankomende afspraken</h2></div>
                <button onClick={() => setView("appointments")}>Alle afspraken <IconChevron /></button>
              </div>
              <AppointmentList items={upcomingAppointments.slice(0, 5)} />
            </article>
            <article className="portal-panel">
              <div className="panel-heading">
                <div><p className="portal-kicker">Opvolging</p><h2>Urgenties</h2></div>
                <button className="portal-cta" onClick={() => { setView("urgencies"); setShowUrgencyForm(true); }}>+ Nieuwe urgentie</button>
              </div>
              <UrgencyList items={urgencies.slice(0, 4)} />
            </article>
          </section>
        </>}

        {view === "appointments" && <section className="portal-page-section">
          <p className="portal-kicker">Planning</p><h1>Afspraken</h1>
          <div className="portal-panel"><h2>Komende afspraken</h2><AppointmentList items={upcomingAppointments} /></div>
          <div className="portal-panel portal-history"><h2>Vorige afspraken</h2><AppointmentList items={pastAppointments} /></div>
        </section>}

        {view === "services" && <section className="portal-page-section">
          <p className="portal-kicker">Zorgactiviteiten</p><h1>Diensten</h1>
          <div className="portal-panel"><h2>Geplande diensten</h2><ServiceList items={upcomingServices} /></div>
          <div className="portal-panel portal-history"><h2>Uitgevoerde diensten</h2><ServiceList items={pastServices} /></div>
        </section>}

        {view === "urgencies" && <section className="portal-page-section">
          <div className="portal-page-title">
            <div><p className="portal-kicker">Opvolging</p><h1>Urgenties</h1></div>
            <button className="portal-cta" onClick={() => setShowUrgencyForm((v) => !v)}>+ Nieuwe urgentie melden</button>
          </div>
          {showUrgencyForm && <form className="portal-panel portal-urgency-form" onSubmit={async (e) => {
            e.preventDefault();
            await portalApi.createUrgency(form);
            setForm({ ...form, patient_name: "", remark: "" });
            setUrgencies(await portalApi.urgencies());
            setShowUrgencyForm(false);
          }}>
            <label>Datum<input type="date" value={form.reported_on} onChange={(e) => setForm({ ...form, reported_on: e.target.value })} required /></label>
            <label>Bewoner<input value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} required /></label>
            <label>Type<select value={form.urgency_type} onChange={(e) => setForm({ ...form, urgency_type: e.target.value })}><option>Tandpijn</option><option>Ontsteking</option><option>Prothese gebroken</option><option>Andere</option></select></label>
            <label>Opmerking<textarea value={form.remark} onChange={(e) => setForm({ ...form, remark: e.target.value })} /></label>
            <button className="portal-primary" type="submit">Urgentie versturen</button>
          </form>}
          <div className="portal-panel"><UrgencyList items={urgencies} /></div>
        </section>}
      </section>
    </main>
  );
}

function AppointmentList({ items }: { items: PortalAppointment[] }) {
  return <div className="portal-list">
    {items.length === 0 && <p className="portal-empty">Er zijn geen afspraken gepland.</p>}
    {items.map((item) => <div className="portal-list-row" key={item.id}>
      <strong>{dateLabel(item.date)}</strong>
      <span>{item.start_time}–{item.end_time}</span>
      <small>{item.type}</small>
      <em>{item.status}</em>
    </div>)}
  </div>;
}
function ServiceList({ items }: { items: PortalService[] }) {
  return <div className="portal-list">
    {items.length === 0 && <p className="portal-empty">Er zijn geen diensten in deze periode.</p>}
    {items.map((item) => <div className="portal-list-row" key={item.id}>
      <strong>{dateLabel(item.date)}</strong>
      <span>{item.type}</span>
      <small>{item.summary}</small>
      <em>{item.status}</em>
    </div>)}
  </div>;
}
function UrgencyList({ items }: { items: PortalUrgency[] }) {
  return <div className="portal-list">
    {items.length === 0 && <p className="portal-empty">Er zijn geen urgenties.</p>}
    {items.map((item) => <div className="portal-list-row urgency-row" key={item.id}>
      <span className={`status-pill ${item.status.toLowerCase() === "open" ? "status-open" : "status-progress"}`}>{item.status}</span>
      <strong>{item.urgency_type}</strong>
      <small>{item.remark || "Geen extra opmerking"}</small>
      <em>{dateLabel(item.reported_on)}</em>
    </div>)}
  </div>;
}
