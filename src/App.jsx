import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, Plus, Search, ShieldCheck, Trash2, MessageSquareText, GraduationCap } from "lucide-react";

const starterComplaints = [
  { id: 1001, title: "Wi-Fi is not working in the library", category: "Wi-Fi / Internet", location: "Central Library", description: "The campus Wi-Fi disconnects frequently on the second floor.", status: "In Progress", date: "2026-10-28" },
  { id: 1002, title: "Broken light in classroom", category: "Classroom", location: "Block B, Room 204", description: "One of the lights needs to be repaired.", status: "Pending", date: "2026-10-29" },
  { id: 1003, title: "Water cooler needs cleaning", category: "Water / Sanitation", location: "Academic Block", description: "Please arrange cleaning and maintenance.", status: "Resolved", date: "2026-10-25" },
];

function loadComplaints() {
  try {
    const saved = localStorage.getItem("campuscare-complaints");
    return saved ? JSON.parse(saved) : starterComplaints;
  } catch {
    return starterComplaints;
  }
}

const statusClass = (status) => status.toLowerCase().replaceAll(" ", "-");

export default function App() {
  const [complaints, setComplaints] = useState(loadComplaints);
  const [activeTab, setActiveTab] = useState("All complaints");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ title: "", category: "Wi-Fi / Internet", location: "", description: "" });

  useEffect(() => {
    localStorage.setItem("campuscare-complaints", JSON.stringify(complaints));
  }, [complaints]);

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    progress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  const filtered = useMemo(() => complaints.filter((c) => {
    const matchesTab = activeTab === "All complaints" || c.status === activeTab;
    const text = `${c.title} ${c.category} ${c.location} ${c.description}`.toLowerCase();
    return matchesTab && text.includes(search.toLowerCase());
  }), [complaints, activeTab, search]);

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submitComplaint(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.location.trim() || !form.description.trim()) {
      setMessage("Please complete all fields before submitting.");
      return;
    }
    const newComplaint = {
      ...form,
      title: form.title.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      id: Date.now(),
      status: "Pending",
      date: new Date().toISOString().slice(0, 10),
    };
    setComplaints((current) => [newComplaint, ...current]);
    setForm({ title: "", category: "Wi-Fi / Internet", location: "", description: "" });
    setMessage("Complaint submitted successfully.");
    setShowForm(false);
  }

  function changeStatus(id, status) {
    setComplaints((current) => current.map((c) => c.id === id ? { ...c, status } : c));
  }

  function deleteComplaint(id) {
    if (window.confirm("Delete this complaint from this browser?")) {
      setComplaints((current) => current.filter((c) => c.id !== id));
    }
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="logo"><span className="logo-icon"><GraduationCap size={23} /></span><div><strong>CampusCare</strong><small>STUDENT SERVICES</small></div></div>
        <p className="side-label">WORKSPACE</p>
        <button className="nav-item selected"><MessageSquareText size={18} /> Complaints <span>{stats.total}</span></button>
        <div className="sidebar-note"><ShieldCheck size={21} /><strong>Your voice matters.</strong><p>Report campus issues and follow their progress from one place.</p></div>
        <div className="sidebar-bottom"><div className="avatar">ST</div><div><strong>Student Portal</strong><small>Frontend demo</small></div></div>
      </aside>

      <main className="main-content">
        <header className="page-header"><div><p className="eyebrow">STUDENT SERVICES / OVERVIEW</p><h1>Complaint dashboard</h1><p className="header-sub">Report an issue. Track progress. Improve campus life.</p></div><button className="new-button" onClick={() => { setShowForm(!showForm); setMessage(""); }}><Plus size={18} /> New complaint</button></header>

        {message && <div className={`notice ${message.startsWith("Please") ? "notice-error" : ""}`} role="status">{message}</div>}

        <section className="stats-grid">
          <article className="metric-card"><span className="metric-icon purple"><MessageSquareText size={20} /></span><p>Total complaints</p><strong>{stats.total}</strong><small>All reports submitted</small></article>
          <article className="metric-card"><span className="metric-icon amber"><Clock3 size={20} /></span><p>Pending</p><strong>{stats.pending}</strong><small>Awaiting attention</small></article>
          <article className="metric-card"><span className="metric-icon blue"><AlertCircle size={20} /></span><p>In progress</p><strong>{stats.progress}</strong><small>Being worked on</small></article>
          <article className="metric-card"><span className="metric-icon green"><CheckCircle2 size={20} /></span><p>Resolved</p><strong>{stats.resolved}</strong><small>Issues completed</small></article>
        </section>

        {showForm && <section className="form-card">
          <div className="form-title"><div><p className="eyebrow">CAMPUS SUPPORT</p><h2>Submit a complaint</h2></div><button className="close-button" onClick={() => setShowForm(false)} aria-label="Close form">×</button></div>
          <form onSubmit={submitComplaint} className="complaint-form">
            <div className="form-field"><label htmlFor="title">Complaint title *</label><input id="title" name="title" value={form.title} onChange={updateForm} placeholder="Briefly describe the issue" /></div>
            <div className="form-field"><label htmlFor="category">Category *</label><select id="category" name="category" value={form.category} onChange={updateForm}><option>Wi-Fi / Internet</option><option>Classroom</option><option>Hostel</option><option>Water / Sanitation</option><option>Library</option><option>Transport</option><option>Other</option></select></div>
            <div className="form-field full"><label htmlFor="location">Location *</label><input id="location" name="location" value={form.location} onChange={updateForm} placeholder="e.g. Block A, Room 105" /></div>
            <div className="form-field full"><label htmlFor="description">Description *</label><textarea id="description" name="description" value={form.description} onChange={updateForm} rows="3" placeholder="Add details that will help the campus team resolve the issue." /></div>
            <div className="form-actions"><span>* Required fields</span><button type="button" className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button><button className="new-button" type="submit"><Plus size={16} /> Submit complaint</button></div>
          </form>
        </section>}

        <section className="complaints-card">
          <div className="table-heading"><div><p className="eyebrow">ISSUE TRACKER</p><h2>Recent complaints</h2></div><div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search complaints..." aria-label="Search complaints" /></div></div>
          <div className="tabs">{["All complaints", "Pending", "In Progress", "Resolved"].map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? "active-tab" : ""}>{tab}</button>)}</div>
          <div className="complaint-list">
            {filtered.length === 0 ? <div className="empty-state"><MessageSquareText size={30} /><strong>No complaints found</strong><p>Try another search or submit a new complaint.</p></div> : filtered.map((complaint) => (
              <article className="complaint-row" key={complaint.id}>
                <div className="complaint-symbol"><MessageSquareText size={19} /></div>
                <div className="complaint-main"><div className="title-line"><h3>{complaint.title}</h3><span className={`status-badge ${statusClass(complaint.status)}`}>{complaint.status}</span></div><p className="complaint-desc">{complaint.description}</p><div className="complaint-meta"><span>{complaint.category}</span><span>•</span><span>{complaint.location}</span><span>•</span><span>{complaint.date}</span></div>
                  <div className="row-actions"><label htmlFor={`status-${complaint.id}`}>Demo status:</label><select id={`status-${complaint.id}`} value={complaint.status} onChange={(e) => changeStatus(complaint.id, e.target.value)}><option>Pending</option><option>In Progress</option><option>Resolved</option></select><button className="delete-button" onClick={() => deleteComplaint(complaint.id)} aria-label={`Delete ${complaint.title}`}><Trash2 size={15} /> Delete</button></div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <footer>CampusCare · React frontend demo · Data saved in your browser</footer>
      </main>
    </div>
  );
}