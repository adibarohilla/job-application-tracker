import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CalendarDays, ExternalLink, MapPin, Pencil, Plus, Search, Trash2, X } from "lucide-react";

const storageKey = "career-compass-applications";
const statuses = ["Applied", "Interview", "Offer", "Rejected"];
const blank = { company: "", role: "", location: "", status: "Applied", date: new Date().toISOString().slice(0, 10), link: "", notes: "" };
const examples = [
  { id: "1", company: "Northstar Labs", role: "Frontend Developer", location: "Remote", status: "Interview", date: "2026-08-20", link: "", notes: "Technical interview on Tuesday." },
  { id: "2", company: "Pixel & Co.", role: "Junior React Developer", location: "Lahore, Pakistan", status: "Applied", date: "2026-08-26", link: "", notes: "Applied through company website." },
  { id: "3", company: "Brightline Studio", role: "UI Developer", location: "Remote", status: "Offer", date: "2026-08-12", link: "", notes: "Review offer details." },
];

function App() {
  const [applications, setApplications] = useState(() => JSON.parse(localStorage.getItem(storageKey) || "null") || examples);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null);

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(applications)), [applications]);
  const visible = useMemo(() => applications.filter((item) => `${item.company} ${item.role} ${item.location}`.toLowerCase().includes(query.toLowerCase()) && (filter === "All" || item.status === filter)), [applications, filter, query]);
  const count = (status) => applications.filter((item) => item.status === status).length;
  function save(item) { setApplications((items) => editing?.id ? items.map((entry) => entry.id === editing.id ? { ...item, id: entry.id } : entry) : [{ ...item, id: crypto.randomUUID() }, ...items]); setEditing(null); }
  function remove(id) { setApplications((items) => items.filter((item) => item.id !== id)); }

  return <div className="app-shell">
    <header><div className="brand"><span className="brand-icon"><BriefcaseBusiness size={22} /></span><div><h1>Career Compass</h1><p>Your personal application workspace</p></div></div><button className="primary" onClick={() => setEditing({ ...blank })}><Plus size={18} /> Add application</button></header>
    <main>
      <section className="hero"><div><span>APPLICATION DASHBOARD</span><h2>Keep your next opportunity in view.</h2><p>Track every application, follow-up, and interview from one calm workspace.</p></div><BriefcaseBusiness size={52} /></section>
      <section className="stats"><Stat label="Total applications" value={applications.length} color="blue" /><Stat label="In interviews" value={count("Interview")} color="purple" /><Stat label="Offers" value={count("Offer")} color="green" /><Stat label="Need follow-up" value={count("Applied")} color="amber" /></section>
      <section className="panel"><div className="panel-title"><div><h2>Applications</h2><p>{visible.length} {visible.length === 1 ? "result" : "results"}</p></div></div><div className="toolbar"><label className="search"><Search size={18} /><span className="sr-only">Search applications</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company, role, or location" /></label><label className="filter"><span className="sr-only">Filter by status</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label></div><div className="list">{visible.length ? visible.map((item) => <Row key={item.id} item={item} onEdit={() => setEditing(item)} onDelete={() => remove(item.id)} />) : <div className="empty"><BriefcaseBusiness size={32} /><h3>No applications found</h3><p>Try another search or add a new application.</p></div>}</div></section>
    </main>
    {editing && <Form item={editing} onClose={() => setEditing(null)} onSave={save} />}
  </div>;
}

function Stat({ label, value, color }) { return <article className={`stat ${color}`}><p>{label}</p><strong>{value}</strong></article>; }
function Badge({ status }) { return <span className={`badge ${status.toLowerCase()}`}>{status}</span>; }
function Row({ item, onEdit, onDelete }) { return <article className="row"><div className="avatar">{item.company[0].toUpperCase()}</div><div className="details"><div className="role"><h3>{item.role}</h3><Badge status={item.status} /></div><p className="company">{item.company}</p><div className="metadata"><span><MapPin size={15} /> {item.location || "Location not added"}</span><span><CalendarDays size={15} /> Applied {new Date(`${item.date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span></div>{item.notes && <p className="notes">{item.notes}</p>}</div><div className="actions">{item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label="Open job link"><ExternalLink size={18} /></a>}<button onClick={onEdit} aria-label="Edit application"><Pencil size={18} /></button><button onClick={onDelete} className="delete" aria-label="Delete application"><Trash2 size={18} /></button></div></article>; }
function Form({ item, onClose, onSave }) { const [form, setForm] = useState(item); const update = (event) => setForm((data) => ({ ...data, [event.target.name]: event.target.value })); return <div className="backdrop" onMouseDown={onClose}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><span>{item.id ? "UPDATE" : "NEW"} APPLICATION</span><h2 id="form-title">{item.id ? "Edit application" : "Add an application"}</h2></div><button onClick={onClose} aria-label="Close form"><X size={20} /></button></div><form onSubmit={(event) => { event.preventDefault(); onSave(form); }}><div className="grid"><Field label="Company" name="company" value={form.company} onChange={update} required /><Field label="Role" name="role" value={form.role} onChange={update} required /><Field label="Location" name="location" value={form.location} onChange={update} /><label>Status<select name="status" value={form.status} onChange={update}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><Field label="Application date" name="date" type="date" value={form.date} onChange={update} required /><Field label="Job link" name="link" type="url" value={form.link} onChange={update} placeholder="https://..." /></div><label>Notes<textarea name="notes" value={form.notes} onChange={update} rows="4" placeholder="Interview details, recruiter name, or follow-up reminder" /></label><div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary">Save application</button></div></form></section></div>; }
function Field({ label, ...props }) { return <label>{label}<input {...props} /></label>; }
export default App;
