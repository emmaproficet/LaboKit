lucide.createIcons();

// NAVIGATION
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

function switchSubTab(parent, subId) {
    const p = document.getElementById(`tab-${parent}`);
    p.querySelectorAll('.sub-content').forEach(el => el.classList.remove('active'));
    p.querySelectorAll('.pill-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`sub-${subId}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

// LABO - MODES DILUTION
function setDilutionMode(mode) {
    document.querySelectorAll('.dil-mode').forEach(e => e.classList.add('hidden'));
    document.querySelectorAll('#sub-dilution .sub-pill-btn').forEach(e => e.classList.remove('active'));
    document.getElementById(`dil-mode-${mode}`).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

function calcDilutionSimple() {
    let c1 = parseFloat(document.getElementById('dil-c1').value);
    let c2 = parseFloat(document.getElementById('dil-c2').value);
    let v2 = parseFloat(document.getElementById('dil-v2').value);

    if (c1 && c2 && v2) {
        let v1 = (c2 * v2) / c1;
        document.getElementById('dil-res').innerText = `Volume V1 à prélever : ${v1.toFixed(3)} ${document.getElementById('u-v2').value}`;
    }
}

function calcDilutionPrep() {
    let mw = parseFloat(document.getElementById('dp-mw').value);
    let c = parseFloat(document.getElementById('dp-c').value);
    let v = parseFloat(document.getElementById('dp-v').value);

    if (document.getElementById('dp-uc').value === 'mM') c /= 1000;
    if (document.getElementById('dp-uv').value === 'mL') v /= 1000;

    if (mw && c && v) {
        let m = c * v * mw;
        document.getElementById('dil-res').innerText = `Masse à peser : ${m.toFixed(4)} g`;
    }
}

// TABLEAU PÉRIODIQUE 118 ÉLÉMENTS (Génération dynamique)
const rawElements = [
    {n:1, s:'H', name:'Hydrogène', r:1, c:1, t:'nonm'},
    {n:2, s:'He', name:'Hélium', r:1, c:18, t:'noble'},
    {n:3, s:'Li', name:'Lithium', r:2, c:1, t:'alk-m'},
    {n:4, s:'Be', name:'Béryllium', r:2, c:2, t:'alk-e'},
    {n:5, s:'B', name:'Bore', r:2, c:13, t:'nonm'},
    {n:6, s:'C', name:'Carbone', r:2, c:14, t:'nonm'},
    {n:7, s:'N', name:'Azote', r:2, c:15, t:'nonm'},
    {n:8, s:'O', name:'Oxygène', r:2, c:16, t:'nonm'},
    {n:9, s:'F', name:'Fluor', r:2, c:17, t:'nonm'},
    {n:10, s:'Ne', name:'Néon', r:2, c:18, t:'noble'},
    {n:11, s:'Na', name:'Sodium', r:3, c:1, t:'alk-m'},
    {n:12, s:'Mg', name:'Magnésium', r:3, c:2, t:'alk-e'},
    {n:13, s:'Al', name:'Aluminium', r:3, c:13, t:'trans'},
    {n:14, s:'Si', name:'Silicium', r:3, c:14, t:'nonm'},
    {n:15, s:'P', name:'Phosphore', r:3, c:15, t:'nonm'},
    {n:16, s:'S', name:'Soufre', r:3, c:16, t:'nonm'},
    {n:17, s:'Cl', name:'Chlore', r:3, c:17, t:'nonm'},
    {n:18, s:'Ar', name:'Argon', r:3, c:18, t:'noble'}
];

function buildPeriodicTable() {
    const grid = document.getElementById('periodic-grid');
    grid.innerHTML = '';
    rawElements.forEach(e => {
        let div = document.createElement('div');
        div.className = `pt-elem ${e.t}`;
        div.style.gridRow = e.r;
        div.style.gridColumn = e.c;
        div.innerHTML = `<span>${e.n}</span><b>${e.s}</b>`;
        grid.appendChild(div);
    });
}
buildPeriodicTable();

// TABLEAU CODE GÉNÉTIQUE (Codons)
const codonData = {
    U: { U: "Phe / Leu", C: "Serine", A: "Tyr / STOP", G: "Cys / STOP / Trp" },
    C: { U: "Leucine", C: "Proline", A: "His / Gln", G: "Arginine" },
    A: { U: "Ile / Met", C: "Threonine", A: "Asn / Lys", G: "Ser / Arg" },
    G: { U: "Valine", C: "Alanine", A: "Asp / Glu", G: "Glycine" }
};

function buildCodonTable() {
    const tbody = document.getElementById('codon-table-body');
    Object.keys(codonData).forEach(first => {
        let tr = document.createElement('tr');
        tr.innerHTML = `<b>${first}</b>`;
        ['U', 'C', 'A', 'G'].forEach(second => {
            tr.innerHTML += `<td>${codonData[first][second]}</td>`;
        });
        tbody.appendChild(tr);
    });
}
buildCodonTable();
