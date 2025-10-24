// Simple client-side logic for student dashboard interactions
function formatDateLocal(d) {
    if (!d) return '-';
    try {
        const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(d).toLocaleDateString(undefined, opts);
    } catch (e) { return d; }
}

function timeSince(date) {
    if (!date) return '-';
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return diff + ' δευτ.';
    if (diff < 3600) return Math.floor(diff/60) + ' λεπ.';
    if (diff < 86400) return Math.floor(diff/3600) + ' ώρ.';
    return Math.floor(diff/86400) + ' ημέρ.';
}

function switchSection(targetId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('section-active'));
    const el = document.getElementById(targetId);
    if (el) el.classList.add('section-active');
    document.querySelectorAll('.menu-link').forEach(a => a.classList.toggle('active', a.dataset.target === targetId));
    // sync top action buttons
    document.querySelectorAll('.action-btn').forEach(b => b.classList.toggle('active', b.dataset.target === targetId));
}

function saveProfile() {
    const profile = {
        address: document.getElementById('address').value,
        email: document.getElementById('email').value,
        mobile: document.getElementById('mobile').value,
        landline: document.getElementById('landline').value,
    };
    localStorage.setItem('studentProfile', JSON.stringify(profile));
    alert('Τα στοιχεία αποθηκεύτηκαν τοπικά.');
}

function loadProfile() {
    const raw = localStorage.getItem('studentProfile');
    if (!raw) return;
    const p = JSON.parse(raw);
    document.getElementById('address').value = p.address || '';
    document.getElementById('email').value = p.email || '';
    document.getElementById('mobile').value = p.mobile || '';
    document.getElementById('landline').value = p.landline || '';
}

// Mock data + management logic
const mockSupervisors = [
    { id: 1, name: 'Καθηγητής Α. Παπαδόπουλος', status: 'available' },
    { id: 2, name: 'Επίκουρος Β. Νικολάου', status: 'available' },
    { id: 3, name: 'Καθηγητής Γ. Κωνσταντίνου', status: 'available' }
];

function renderSupervisors() {
    const ul = document.getElementById('supervisors-list');
    ul.innerHTML = '';
    mockSupervisors.forEach((s, idx) => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = s.name;
        const btn = document.createElement('button');
        btn.textContent = s.status === 'accepted' ? 'Αποδεκτό' : (s.status === 'invited' ? 'Αναμονή' : 'Πρόσκληση');
        btn.disabled = s.status === 'accepted';
        btn.addEventListener('click', () => {
            if (s.status === 'available') { s.status = 'invited'; btn.textContent = 'Αναμονή'; }
            // Simulate a later acceptance (for demo): clicking again accepts
            else if (s.status === 'invited') { s.status = 'accepted'; btn.textContent = 'Αποδεκτό'; btn.disabled = true; checkAcceptedCount(); }
            renderSupervisors();
        });
        li.appendChild(span);
        li.appendChild(btn);
        ul.appendChild(li);
    });
}

function checkAcceptedCount() {
    const accepted = mockSupervisors.filter(s => s.status === 'accepted').length;
    if (accepted >= 2) {
        // set thesis status to active
        document.getElementById('thesis-state').value = 'active';
        document.getElementById('thesis-status').textContent = 'Ενεργή';
        alert('Δυο μέλη αποδέχτηκαν — η ΔΕ μεταβαίνει σε κατάσταση Ενεργή.');
    }
}

function handleStateChange() {
    const state = document.getElementById('thesis-state').value;
    document.getElementById('assignment-area').style.display = state === 'under_assignment' ? 'block' : 'none';
    document.getElementById('review-area').style.display = state === 'under_review' ? 'block' : 'none';
    document.getElementById('completed-area').style.display = state === 'completed' ? 'block' : 'none';
    const statusMap = {
        not_assigned: 'Μη ορισμένο',
        under_assignment: 'Υπό ανάθεση',
        under_review: 'Υπό εξέταση',
        completed: 'Περατωμένη',
        active: 'Ενεργή'
    };
    document.getElementById('thesis-status').textContent = statusMap[state] || state;
}

function loadThesisMock() {
    // Mock example - in real app data comes from server
    const mock = {
        title: 'Μελέτη Αλγορίθμων για ...',
        desc: 'Περιγραφή της διπλωματικής εργασίας...',
        file: '#',
        assigned: '2025-10-01T10:00:00Z',
        committee: ['Καθηγητής Α. Παπαδόπουλος', 'Επίκουρος Β. Νικολάου']
    };
    document.getElementById('thesis-title').textContent = mock.title;
    document.getElementById('thesis-desc').textContent = mock.desc;
    document.getElementById('thesis-file').href = mock.file;
    document.getElementById('assigned-date').textContent = formatDateLocal(mock.assigned);
    document.getElementById('time-since').textContent = timeSince(mock.assigned);
    const cl = document.getElementById('committee-list');
    cl.innerHTML = '';
    mock.committee.forEach(m => { const li = document.createElement('li'); li.textContent = m; cl.appendChild(li); });
}

function initMenuLinks() {
    document.querySelectorAll('.menu-link').forEach(a => {
        a.addEventListener('click', (e) => { e.preventDefault(); switchSection(a.dataset.target); });
    });
}

function initActionButtons() {
    document.querySelectorAll('.action-btn').forEach(b => {
        b.addEventListener('click', (e) => {
            e.preventDefault();
            const target = b.dataset.target;
            switchSection(target);
        });
    });
}

// Professor Dashboard Logic
function switchProfessorSection(targetId) {
    document.querySelectorAll('.panel').forEach(p => {
        p.classList.remove('section-active');
    });
    document.querySelectorAll('.action-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.target === targetId);
    });
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('section-active');
    }
}

function initProfessorUI() {
    // Action buttons click handlers
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            switchProfessorSection(targetId);
        });
    });

    // New topic form handler
    const newTopicForm = document.getElementById('new-topic-form');
    if (newTopicForm) {
        newTopicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('topic-title').value;
            const summary = document.getElementById('topic-summary').value;
            const pdf = document.getElementById('topic-pdf').files[0];
            
            // Demo: just show confirmation
            alert(`Το θέμα "${title}" καταχωρήθηκε επιτυχώς!`);
            newTopicForm.reset();
        });
    }

    // Status filter handler
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            // Demo: just log the change
            console.log('Φίλτρο κατάστασης:', statusFilter.value);
        });
    }

    // Role filter handler
    const roleFilter = document.getElementById('role-filter');
    if (roleFilter) {
        roleFilter.addEventListener('change', () => {
            // Demo: just log the change
            console.log('Φίλτρο ρόλου:', roleFilter.value);
        });
    }
}

// Export functions (demo)
function exportList(format) {
    const demoData = {
        theses: [
            {
                title: "Ανάπτυξη συστήματος...",
                student: "Παπαδόπουλος Γ.",
                status: "Ενεργή",
                role: "Επιβλέπων"
            }
        ]
    };

    let content;
    let filename;
    let mime;

    if (format === 'json') {
        content = JSON.stringify(demoData, null, 2);
        filename = 'theses.json';
        mime = 'application/json';
    } else {
        // Simple CSV format
        content = 'Τίτλος,Φοιτητής,Κατάσταση,Ρόλος\n';
        content += demoData.theses.map(t => 
            `"${t.title}","${t.student}","${t.status}","${t.role}"`
        ).join('\n');
        filename = 'theses.csv';
        mime = 'text/csv';
    }

    // Create and trigger download
    const blob = new Blob([content], { type: mime });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}

// Secretary: mock data and UI
const mockTheses = [
    {
        id: 1,
        title: 'Προχωρημένη Ανάλυση Δεδομένων',
        desc: 'Μελέτη αλγορίθμων και εφαρμογές σε μεγάλες κλίμακες.',
        status: 'active',
        assigned: '2025-06-15T09:00:00Z',
        committee: ['Καθηγητής Α. Παπαδόπουλος', 'Επίκουρος Β. Νικολάου'],
        grade: null,
        repoLink: null
    },
    {
        id: 2,
        title: 'Δίκτυα Νευρωνικών Δικτύων',
        desc: 'Εφαρμογές deep learning σε εικόνα και ήχο.',
        status: 'under_review',
        assigned: '2025-09-20T11:30:00Z',
        committee: ['Καθηγητής Γ. Κωνσταντίνου', 'Επίκουρος Δ. Σταύρου'],
        grade: 8.5,
        repoLink: 'https://nimertis.example/student123'
    },
    {
        id: 3,
        title: 'Ενεργειακά Συστήματα',
        desc: 'Μελέτη αποδοτικότητας ανανεώσιμων πηγών.',
        status: 'completed',
        assigned: '2024-11-05T10:00:00Z',
        committee: ['Καθηγητής Ε. Παπαϊωάννου'],
        grade: 9.0,
        repoLink: 'https://nimertis.example/student456'
    }
];

let selectedThesis = null;

function renderSecretaryTheses() {
    const ul = document.getElementById('secretary-theses');
    if (!ul) return;
    ul.innerHTML = '';
    // show only active and under_review
    mockTheses.filter(t => t.status === 'active' || t.status === 'under_review')
        .forEach(t => {
            const li = document.createElement('li');
            li.className = 'thesis-card';
            li.style.cursor = 'pointer';
            li.innerHTML = `<strong>${t.title}</strong> <div class="hint">${t.status === 'active' ? 'Ενεργή' : 'Υπό Εξέταση'}</div>`;
            li.addEventListener('click', () => { showThesisDetails(t.id); });
            ul.appendChild(li);
        });
}

function showThesisDetails(id) {
    const t = mockTheses.find(x => x.id === id);
    if (!t) return;
    selectedThesis = t;
    document.getElementById('thesis-details').style.display = 'block';
    document.getElementById('detail-title').textContent = t.title;
    document.getElementById('detail-desc').textContent = t.desc;
    document.getElementById('detail-status').textContent = t.status === 'active' ? 'Ενεργή' : (t.status === 'under_review' ? 'Υπό Εξέταση' : t.status);
    document.getElementById('detail-assigned').textContent = formatDateLocal(t.assigned);
    document.getElementById('detail-timesince').textContent = timeSince(t.assigned);
    const cl = document.getElementById('detail-committee');
    cl.innerHTML = '';
    (t.committee || []).forEach(m => { const li = document.createElement('li'); li.textContent = m; cl.appendChild(li); });

    // show appropriate manage area
    document.getElementById('manage-active').style.display = t.status === 'active' ? 'block' : 'none';
    document.getElementById('manage-review').style.display = t.status === 'under_review' ? 'block' : 'none';
}

function initSecretaryUI() {
    // wire menu links and action buttons (reuse student handlers for consistent behavior)
    initMenuLinks();
    initActionButtons();

    // initial render
    renderSecretaryTheses();

    // JSON import
    const jsonInput = document.getElementById('json-import');
    if (jsonInput) {
        jsonInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const obj = JSON.parse(reader.result);
                    // basic validation and stats
                    const students = obj.students || [];
                    const teachers = obj.teachers || [];
                    localStorage.setItem('importedData', JSON.stringify(obj));
                    document.getElementById('import-result').innerHTML = `Εισήχθησαν ${students.length} φοιτητές και ${teachers.length} διδάσκοντες.`;
                } catch (err) {
                    document.getElementById('import-result').textContent = 'Σφάλμα ανάγνωσης JSON: ' + err.message;
                }
            };
            reader.readAsText(file, 'utf-8');
        });
    }

    // Manage actions
    const saveGsBtn = document.getElementById('save-gs');
    if (saveGsBtn) {
        saveGsBtn.addEventListener('click', () => {
            if (!selectedThesis) { alert('Επιλέξτε πρώτα μια ΔΕ.'); return; }
            const gs = document.getElementById('gs-number').value;
            const exam = document.getElementById('exam-number').value;
            selectedThesis.gsNumber = gs;
            selectedThesis.examNumber = exam;
            alert('Καταχωρήθηκε ο ΑΠ/ΓΣ.');
            renderSecretaryTheses();
        });
    }

    const cancelBtn = document.getElementById('cancel-assignment');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            const area = document.getElementById('cancel-area');
            area.style.display = area.style.display === 'none' ? 'block' : 'none';
        });
    }

    const confirmCancel = document.getElementById('confirm-cancel');
    if (confirmCancel) {
        confirmCancel.addEventListener('click', () => {
            if (!selectedThesis) { alert('Επιλέξτε πρώτα μια ΔΕ.'); return; }
            const cancelGs = document.getElementById('cancel-gs').value;
            const reason = document.getElementById('cancel-reason').value;
            selectedThesis.status = 'cancelled';
            selectedThesis.cancelGs = cancelGs;
            selectedThesis.cancelReason = reason;
            alert('Η ανάθεση ακυρώθηκε και καταχωρήθηκε ο λόγος.');
            document.getElementById('thesis-details').style.display = 'none';
            renderSecretaryTheses();
        });
    }

    const markCompletedBtn = document.getElementById('mark-completed');
    if (markCompletedBtn) {
        markCompletedBtn.addEventListener('click', () => {
            if (!selectedThesis) { alert('Επιλέξτε πρώτα μια ΔΕ.'); return; }
            // require grade and repoLink for completion
            if (!selectedThesis.grade || !selectedThesis.repoLink) {
                alert('Δεν υπάρχει καταχωρημένος βαθμός ή σύνδεσμος αποθετηρίου.');
                return;
            }
            selectedThesis.status = 'completed';
            alert('Η ΔΕ σημειώθηκε ως Περατωμένη.');
            document.getElementById('thesis-details').style.display = 'none';
            renderSecretaryTheses();
        });
    }
}

// Initialize based on page type
function init() {
    // Common date element
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString('el-GR', opts);
    }

    // Detect page type and initialize appropriate UI
    if (document.querySelector('.secretary-nav')) {
        initSecretaryUI();
    } else if (document.querySelector('.teacher-nav')) {
        initProfessorUI();
    } else if (document.querySelector('.student-nav')) {
        // Student UI initialization
        loadProfile();
        initMenuLinks();
        initActionButtons();
        renderSupervisors();
        const sp = document.getElementById('save-profile'); if (sp) sp.addEventListener('click', saveProfile);
        const ts = document.getElementById('thesis-state'); if (ts) ts.addEventListener('change', handleStateChange);
        const sr = document.getElementById('save-review'); if (sr) sr.addEventListener('click', () => { alert('Πληροφορίες εξέτασης αποθηκεύτηκαν τοπικά (demo).'); });
        const sc = document.getElementById('save-completed'); if (sc) sc.addEventListener('click', () => { alert('Σύνδεσμος αποθετηρίου αποθηκεύτηκε (demo).'); });
        loadThesisMock();
        handleStateChange();
    }

    console.log('Dashboard initialized');
}

window.addEventListener('load', init);