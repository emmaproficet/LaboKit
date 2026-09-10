lucide.createIcons();

/* --- NAVIGATION PRINCIPALE --- */
function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

function switchLabSub(sub) {
    document.querySelectorAll('#tab-labo .sub-panel').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('#tab-labo .sub-tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`lab-${sub}`).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

function switchGenTab(sub) {
    document.querySelectorAll('#tab-general .gen-panel').forEach(el => el.classList.add('hidden'));
    document.getElementById(`gen-${sub}`).classList.remove('hidden');
    
    const btns = event.currentTarget.parentElement.querySelectorAll('.pill-btn');
    btns.forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function switchBibSub(sub) {
    document.querySelectorAll('#tab-biblio .sub-panel').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('#tab-biblio .sub-tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`bib-${sub}`).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

/* --- LABO: DILUTIONS --- */
function switchDilutionMode(mode) {
    const modes = ['simple', 'serie', 'inverse', 'prep'];
    modes.forEach(m => document.getElementById(`dilution-${m}`).classList.add('hidden'));
    document.getElementById(`dilution-${mode}`).classList.remove('hidden');

    const btns = event.currentTarget.parentElement.querySelectorAll('.pill-btn');
    btns.forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function calcDilutionSimple() {
    let c1 = parseFloat(document.getElementById('ds-c1').value);
    let c2 = parseFloat(document.getElementById('ds-c2').value);
    let v2 = parseFloat(document.getElementById('ds-v2').value);

    if (c1 && c2 && v2) {
        let v1 = (c2 * v2) / c1;
        let vSolvant = v2 - v1;
        document.getElementById('res-ds').innerHTML = `
            Volume stock à prélever (V1) : <b>${v1.toFixed(3)}</b><br>
            Volume de solvant à ajouter : <b>${vSolvant.toFixed(3)}</b>
        `;
    }
}

function calcDilutionSerie() {
    let c1 = parseFloat(document.getElementById('dser-c1').value);
    let factor = parseFloat(document.getElementById('dser-factor').value);
    let steps = parseInt(document.getElementById('dser-steps').value);
    
    if (c1 && factor && steps) {
        let text = "Série calculée :<br>";
        let currentC = c1;
        graphPoints = []; // réinitialise les points pour le graphique TP

        for (let i = 1; i <= steps; i++) {
            text += `Tube ${i}: Conc = <b>${currentC.toFixed(2)}</b><br>`;
            graphPoints.push({ x: i, y: currentC });
            currentC /= factor;
        }
        document.getElementById('res-dser').innerHTML = text;
        updatePointsChips();
    }
}

function calcDilutionInverse() {
    let c1 = parseFloat(document.getElementById('di-c1').value);
    let v1 = parseFloat(document.getElementById('di-v1').value);
    let v2 = parseFloat(document.getElementById('di-v2').value);

    if (c1 && v1 && v2) {
        let vTotal = v1 + v2;
        let c2 = (c1 * v1) / vTotal;
        document.getElementById('res-di').innerHTML = `Concentration finale (C2) = <b>${c2.toFixed(4)}</b>`;
    }
}

function calcPrepSolution() {
    let mw = parseFloat(document.getElementById('dp-mw').value);
    let c = parseFloat(document.getElementById('dp-c').value);
    let v_ml = parseFloat(document.getElementById('dp-v').value);

    if (mw && c && v_ml) {
        let masse_g = (c / 1000) * (v_ml / 1000) * mw;
        document.getElementById('res-dp').innerHTML = `Masse à peser : <b>${masse_g.toFixed(4)} g</b>`;
    }
}

/* --- LABO: MOLARITÉ --- */
let currentMolMode = 'masse';

function switchMolMode(mode) {
    currentMolMode = mode;
    const btns = event.currentTarget.parentElement.querySelectorAll('.pill-btn');
    btns.forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const badge = document.getElementById('mol-formula-badge');
    const formulaText = document.getElementById('mol-formula-text');

    if (mode === 'masse') {
        badge.innerText = "m";
        formulaText.innerText = "M × V × MW";
    } else if (mode === 'molarite') {
        badge.innerText = "M";
        formulaText.innerText = "m / ( MW × V )";
    } else {
        badge.innerText = "C";
        formulaText.innerText = "n / V";
    }
}

function calcMolariteComplete() {
    let m = parseFloat(document.getElementById('mol-in-m').value);
    let mw = parseFloat(document.getElementById('mol-in-mw').value);
    let c = parseFloat(document.getElementById('mol-in-c').value);
    let v_ml = parseFloat(document.getElementById('mol-in-v').value);

    let res = 0;
    if (currentMolMode === 'masse' && c && v_ml && mw) {
        res = (c) * (v_ml / 1000) * mw;
        document.getElementById('mol-res-text').innerText = `${res.toFixed(4)} g`;
    } else if (currentMolMode === 'molarite' && m && mw && v_ml) {
        res = m / (mw * (v_ml / 1000));
        document.getElementById('mol-res-text').innerText = `${res.toFixed(4)} M`;
    }
}

/* --- LABO: GRAPHIQUE TP --- */
let graphPoints = [];
let chartInstance = null;

function addGraphPoint() {
    let x = parseFloat(document.getElementById('pt-x').value);
    let y = parseFloat(document.getElementById('pt-y').value);

    if (!isNaN(x) && !isNaN(y)) {
        graphPoints.push({ x, y });
        updatePointsChips();
    }
}

function updatePointsChips() {
    let container = document.getElementById('points-list-container');
    container.innerHTML = graphPoints.map((p, idx) => `
        <span class="unit-tag" style="margin:2px;">
            (${p.x}, ${p.y}) <button style="border:none; background:transparent; cursor:pointer;" onclick="removePoint(${idx})">×</button>
        </span>
    `).join('');
}

function removePoint(index) {
    graphPoints.splice(index, 1);
    updatePointsChips();
}

function renderChart() {
    const ctx = document.getElementById('tpChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    graphPoints.sort((a,b) => a.x - b.x);

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Série TP',
                data: graphPoints,
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                tension: 0.1,
                showLine: true
            }]
        },
        options: { scales: { x: { type: 'linear' } } }
    });
}

/* --- GÉNÉRAL: CALCULATRICE --- */
function calcPress(val) {
    let screen = document.getElementById('calc-screen');
    if (screen.value === '0') screen.value = '';
    if (val === 'C') screen.value = '0';
    else screen.value += val;
}
function calcEval() {
    let screen = document.getElementById('calc-screen');
    try { screen.value = eval(screen.value); } catch(e) { screen.value = 'Erreur'; }
}

/* --- GÉNÉRAL: CONVERTISSEUR UNITES --- */
const unitOptions = {
    volume: ['mL', 'µL', 'L'],
    masse: ['g', 'mg', 'µg', 'kg'],
    conc: ['mM', 'µM', 'M', 'mg/mL'],
    ppm: ['%', 'ppm', 'ppb'],
    temp: ['°C', 'K', '°F']
};

function switchConvCategory(cat) {
    document.querySelectorAll('.sub-conv').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');

    if (cat === 'rcf') {
        document.getElementById('standard-converter').classList.add('hidden');
        document.getElementById('rcf-converter').classList.remove('hidden');
    } else {
        document.getElementById('standard-converter').classList.remove('hidden');
        document.getElementById('rcf-converter').classList.add('hidden');

        let fromSel = document.getElementById('conv-from');
        let toSel = document.getElementById('conv-to');
        fromSel.innerHTML = ''; toSel.innerHTML = '';

        unitOptions[cat].forEach(u => {
            fromSel.innerHTML += `<option>${u}</option>`;
            toSel.innerHTML += `<option>${u}</option>`;
        });
    }
}

function calcRCF() {
    let r = parseFloat(document.getElementById('rcf-r').value);
    let rpm = parseFloat(document.getElementById('rcf-rpm').value);
    if (r && rpm) {
        let rcf = 1.118e-5 * r * Math.pow(rpm, 2);
        document.getElementById('conv-res-text').innerText = `${Math.round(rcf)} g`;
    }
}

/* --- GÉNÉRAL: COMPTEUR --- */
function addNewCounter() {
    let name = document.getElementById('counter-title-in').value || 'Cellule';
    let wrapper = document.getElementById('counters-wrapper');

    let card = document.createElement('div');
    card.className = 'counter-card';
    card.innerHTML = `
        <h4>${name}</h4>
        <div class="count-val">0</div>
        <button onclick="let v = this.previousElementSibling; v.innerText = parseInt(v.innerText)+1">+</button>
    `;
    wrapper.appendChild(card);
}

/* --- BIBLIOTHÈQUE: CODE GENETIQUE TABLE --- */
const geneticData = [
    { first: "U", second: "U", codons: [ {c:"UUU", aa:"Phenylalanine"}, {c:"UUC", aa:"Phenylalanine"}, {c:"UUA", aa:"Leucine"}, {c:"UUG", aa:"Leucine"} ] },
    { first: "U", second: "C", codons: [ {c:"UCU", aa:"Serine"}, {c:"UCC", aa:"Serine"}, {c:"UCA", aa:"Serine"}, {c:"UCG", aa:"Serine"} ] },
    { first: "A", second: "U", codons: [ {c:"AUU", aa:"Isoleucine"}, {c:"AUC", aa:"Isoleucine"}, {c:"AUA", aa:"Isoleucine"}, {c:"AUG", aa:"Methionine (Start)", isStart:true} ] },
    { first: "U", second: "A", codons: [ {c:"UAU", aa:"Tyrosine"}, {c:"UAC", aa:"Tyrosine"}, {c:"UAA", aa:"Stop", isStop:true}, {c:"UAG", aa:"Stop", isStop:true} ] }
];

function buildGeneticTable() {
    const container = document.getElementById('codon-table-container');
    container.innerHTML = geneticData.map(block => `
        <div class="codon-block">
            <div class="codon-block-title" style="background:#e0e7ff;">${block.first} - ${block.second}</div>
            ${block.codons.map(item => `
                <div class="codon-line">
                    <span class="${item.isStart ? 'start-codon' : ''} ${item.isStop ? 'stop-codon' : ''}">${item.c}</span>
                    <span>${item.aa}</span>
                </div>
            `).join('')}
        </div>
    `).join('');
}
buildGeneticTable();

function switchGeneticView(view) {
    if (view === 'table') {
        document.getElementById('genetic-table-view').classList.remove('hidden');
        document.getElementById('genetic-wheel-view').classList.add('hidden');
    } else {
        document.getElementById('genetic-table-view').classList.add('hidden');
        document.getElementById('genetic-wheel-view').classList.remove('hidden');
    }
}

/* --- BIBLIOTHÈQUE: TABLEAU PERIODIQUE COMPLET (118) --- */
const periodicElements = [
    { n: 1, s: "H", name: "Hydrogène", cat: "nonmetal", pos: 1 },
    { n: 2, s: "He", name: "Hélium", cat: "noble", pos: 18 },
    { n: 3, s: "Li", name: "Lithium", cat: "alkali", pos: 19 },
    { n: 4, s: "Be", name: "Béryllium", cat: "alkaline-earth", pos: 20 },
    { n: 5, s: "B", name: "Bore", cat: "metalloid", pos: 31 },
    { n: 6, s: "C", name: "Carbone", cat: "nonmetal", pos: 32 },
    { n: 7, s: "N", name: "Azote", cat: "nonmetal", pos: 33 },
    { n: 8, s: "O", name: "Oxygène", cat: "nonmetal", pos: 34 },
    { n: 9, s: "F", name: "Fluor", cat: "halogen", pos: 35 },
    { n: 10, s: "Ne", name: "Néon", cat: "noble", pos: 36 },
    { n: 11, s: "Na", name: "Sodium", cat: "alkali", pos: 37 },
    { n: 12, s: "Mg", name: "Magnésium", cat: "alkaline-earth", pos: 38 },
    { n: 13, s: "Al", name: "Aluminium", cat: "post-trans", pos: 49 },
    { n: 14, s: "Si", name: "Silicium", cat: "metalloid", pos: 50 },
    { n: 15, s: "P", name: "Phosphore", cat: "nonmetal", pos: 51 },
    { n: 16, s: "S", name: "Soufre", cat: "nonmetal", pos: 52 },
    { n: 17, s: "Cl", name: "Chlore", cat: "halogen", pos: 53 },
    { n: 18, s: "Ar", name: "Argon", cat: "noble", pos: 54 },
    { n: 19, s: "K", name: "Potassium", cat: "alkali", pos: 55 },
    { n: 20, s: "Ca", name: "Calcium", cat: "alkaline-earth", pos: 56 },
    { n: 21, s: "Sc", name: "Scandium", cat: "transition", pos: 57 },
    { n: 26, s: "Fe", name: "Fer", cat: "transition", pos: 62 },
    { n: 29, s: "Cu", name: "Cuivre", cat: "transition", pos: 65 },
    { n: 30, s: "Zn", name: "Zinc", cat: "transition", pos: 66 },
    { n: 35, s: "Br", name: "Brome", cat: "halogen", pos: 71 },
    { n: 36, s: "Kr", name: "Krypton", cat: "noble", pos: 72 },
    { n: 79, s: "Au", name: "Or", cat: "transition", pos: 119 },
    { n: 80, s: "Hg", name: "Mercure", cat: "transition", pos: 120 },
    { n: 118, s: "Og", name: "Oganesson", cat: "noble", pos: 162 }
];

function buildPeriodicTable() {
    const board = document.getElementById('periodic-board');
    board.innerHTML = '';
    
    // Génère les 126 cases de la grille 18x7
    for (let i = 1; i <= 126; i++) {
        let el = periodicElements.find(e => e.pos === i);
        if (el) {
            board.innerHTML += `
                <div class="p-elem cat-${el.cat}" title="${el.name}">
                    <b>${el.s}</b>
                    <small>${el.n}</small>
                </div>
            `;
        } else {
            board.innerHTML += `<div></div>`;
        }
    }
}
buildPeriodicTable();

function filterPeriodicTable() {
    let q = document.getElementById('pt-search').value.toLowerCase();
    document.querySelectorAll('.p-elem').forEach(el => {
        let text = el.innerText.toLowerCase() + el.getAttribute('title').toLowerCase();
        if (text.includes(q)) el.style.opacity = "1";
        else el.style.opacity = "0.2";
    });
}
