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

// Initialize based on page type
function init() {
    // Common date element
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString('el-GR', opts);
    }

    // Detect page type and initialize appropriate UI
    if (document.querySelector('.teacher-nav')) {
        initProfessorUI();
    } else if (document.querySelector('.student-nav')) {
        // Student UI initialization
        loadProfile();
        initMenuLinks();
        initActionButtons();
        renderSupervisors();
        document.getElementById('save-profile').addEventListener('click', saveProfile);
        document.getElementById('thesis-state').addEventListener('change', handleStateChange);
        document.getElementById('save-review').addEventListener('click', () => { 
            alert('Πληροφορίες εξέτασης αποθηκεύτηκαν τοπικά (demo).'); 
        });
        document.getElementById('save-completed').addEventListener('click', () => { 
            alert('Σύνδεσμος αποθετηρίου αποθηκεύτηκε (demo).'); 
        });
        loadThesisMock();
        handleStateChange();
    }

    console.log('Dashboard initialized');
}

window.addEventListener('load', init);