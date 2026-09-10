// Attendre le chargement complet de la structure DOM
document.addEventListener('DOMContentLoaded', () => {

    // 1. Charger Lucide de manière totalement isolée (ne bloque pas si le CDN est bloqué)
    try {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (e) {
        console.warn("Icônes Lucide indisponibles :", e);
    }

    // 2. Initialiser les sous-composants
    if (typeof buildGeneticTable === 'function') buildGeneticTable();
    if (typeof buildPeriodicTable === 'function') buildPeriodicTable();

    // 3. ÉCOUTEUR GLOBAL DE CLICS (Infaillible pour tous les onglets)
    document.addEventListener('click', (e) => {
        // Clic sur un bouton de la barre latérale
        const navBtn = e.target.closest('.nav-btn');
        if (navBtn) {
            const attr = navBtn.getAttribute('onclick');
            if (attr && attr.includes('switchTab')) {
                const tabName = attr.match(/'([^']+)'/)[1];
                activateTab(tabName, navBtn);
            }
        }

        // Clic sur les sous-onglets
        const subBtn = e.target.closest('.sub-tab-btn, .pill-btn');
        if (subBtn) {
            const attr = subBtn.getAttribute('onclick');
            if (attr) {
                if (attr.includes('switchLabSub')) {
                    const subName = attr.match(/'([^']+)'/)[1];
                    activateSubPanel('#tab-labo', 'lab-', subName, subBtn);
                } else if (attr.includes('switchGenTab')) {
                    const subName = attr.match(/'([^']+)'/)[1];
                    activateSubPanel('#tab-general', 'gen-', subName, subBtn);
                } else if (attr.includes('switchBibSub')) {
                    const subName = attr.match(/'([^']+)'/)[1];
                    activateSubPanel('#tab-biblio', 'bib-', subName, subBtn);
                }
            }
        }
    });
});


/* ==========================================================================
   1. NAVIGATION ET DÉPLACEMENT DANS L'APPLICATION
   ========================================================================== */

function activateTab(tab, btnElement) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    const targetTab = document.getElementById(`tab-${tab}`);
    if (targetTab) targetTab.classList.add('active');
    if (btnElement) btnElement.classList.add('active');
}

function activateSubPanel(parentSelector, idPrefix, subName, btnElement) {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;

    parent.querySelectorAll('.sub-panel, .gen-panel').forEach(el => el.classList.add('hidden'));
    
    const target = document.getElementById(`${idPrefix}${subName}`);
    if (target) target.classList.remove('hidden');

    if (btnElement && btnElement.parentElement) {
        btnElement.parentElement.querySelectorAll('.sub-tab-btn, .pill-btn').forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
    }
}

// Fonctions déclenchées par l'attribut HTML
function switchTab(t) { activateTab(t, window.event?.currentTarget); }
function switchLabSub(s) { activateSubPanel('#tab-labo', 'lab-', s, window.event?.currentTarget); }
function switchGenTab(s) { activateSubPanel('#tab-general', 'gen-', s, window.event?.currentTarget); }
function switchBibSub(s) { activateSubPanel('#tab-biblio', 'bib-', s, window.event?.currentTarget); }


/* ==========================================================================
   2. ESPACE LABO (DILUTIONS, MOLARITÉ & GRAPHIQUE)
   ========================================================================== */

function switchDilutionMode(mode) {
    ['simple', 'serie', 'inverse', 'prep'].forEach(m => {
        const el = document.getElementById(`dilution-${m}`);
        if (el) el.classList.add('hidden');
    });

    const target = document.getElementById(`dilution-${mode}`);
    if (target) target.classList.remove('hidden');

    if (window.event && window.event.currentTarget) {
        const btns = window.event.currentTarget.parentElement.querySelectorAll('.pill-btn');
        btns.forEach(b => b.classList.remove('active'));
        window.event.currentTarget.classList.add('active');
    }
}

function calcDilutionSimple() {
    let c1 = parseFloat(document.getElementById('ds-c1')?.value);
    let c2 = parseFloat(document.getElementById('ds-c2')?.value);
    let v2 = parseFloat(document.getElementById('ds-v2')?.value);
    let res = document.getElementById('res-ds');

    if (c1 && c2 && v2 && res) {
        if (c2 >= c1) {
            res.innerHTML = `<span style="color:red;">Erreur: C2 doit être inférieure à C1.</span>`;
            return;
        }
        let v1 = (c2 * v2) / c1;
        let vSolvant = v2 - v1;
        res.innerHTML = `Volume stock (V1) : <b>${v1.toFixed(3)} mL</b><br>Volume solvant : <b>${vSolvant.toFixed(3)} mL</b>`;
    } else if (res) {
        res.innerHTML = `Veuillez remplir tous les champs.`;
    }
}

function calcDilutionSerie() {
    let c1 = parseFloat(document.getElementById('dser-c1')?.value);
    let factor = parseFloat(document.getElementById('dser-factor')?.value);
    let steps = parseInt(document.getElementById('dser-steps')?.value);
    let res = document.getElementById('res-dser');

    if (c1 && factor && steps && res) {
        let text = "<b>Série calculée :</b><br>";
        let currentC = c1;
        for (let i = 1; i <= steps; i++) {
            text += `Tube ${i}: Conc = <b>${currentC.toFixed(3)}</b><br>`;
            currentC /= factor;
        }
        res.innerHTML = text;
    }
}

function calcDilutionInverse() {
    let c1 = parseFloat(document.getElementById('di-c1')?.value);
    let v1 = parseFloat(document.getElementById('di-v1')?.value);
    let v2 = parseFloat(document.getElementById('di-v2')?.value);
    let res = document.getElementById('res-di');

    if (c1 && v1 && v2 && res) {
        let c2 = (c1 * v1) / (v1 + v2);
        res.innerHTML = `Concentration finale (C2) = <b>${c2.toFixed(4)}</b>`;
    }
}

function calcPrepSolution() {
    let mw = parseFloat(document.getElementById('dp-mw')?.value);
    let c = parseFloat(document.getElementById('dp-c')?.value);
    let v_ml = parseFloat(document.getElementById('dp-v')?.value);
    let res = document.getElementById('res-dp');

    if (mw && c && v_ml && res) {
        let masse_g = (c / 1000) * (v_ml / 1000) * mw;
        res.innerHTML = `Masse à peser : <b>${masse_g.toFixed(4)} g</b>`;
    }
}

let currentMolMode = 'masse';
function switchMolMode(mode) {
    currentMolMode = mode;
    if (window.event && window.event.currentTarget) {
        const btns = window.event.currentTarget.parentElement.querySelectorAll('.pill-btn');
        btns.forEach(b => b.classList.remove('active'));
        window.event.currentTarget.classList.add('active');
    }

    const badge = document.getElementById('mol-formula-badge');
    const formulaText = document.getElementById('mol-formula-text');

    if (badge && formulaText) {
        if (mode === 'masse') {
            badge.innerText = "m"; formulaText.innerText = "C × V × MW";
        } else {
            badge.innerText = "M"; formulaText.innerText = "m / ( MW × V )";
        }
    }
}

function calcMolariteComplete() {
    let m = parseFloat(document.getElementById('mol-in-m')?.value);
    let mw = parseFloat(document.getElementById('mol-in-mw')?.value);
    let c = parseFloat(document.getElementById('mol-in-c')?.value);
    let v_ml = parseFloat(document.getElementById('mol-in-v')?.value);
    let resText = document.getElementById('mol-res-text');

    if (currentMolMode === 'masse' && c && v_ml && mw) {
        let res = (c / 1000) * (v_ml / 1000) * mw;
        if (resText) resText.innerText = `${res.toFixed(4)} g`;
    } else if (currentMolMode === 'molarite' && m && mw && v_ml) {
        let res = m / (mw * (v_ml / 1000));
        if (resText) resText.innerText = `${res.toFixed(4)} M`;
    }
}

let graphPoints = [];
let chartInstance = null;

function addGraphPoint() {
    let x = parseFloat(document.getElementById('pt-x')?.value);
    let y = parseFloat(document.getElementById('pt-y')?.value);

    if (!isNaN(x) && !isNaN(y)) {
        graphPoints.push({ x, y });
        document.getElementById('pt-x').value = '';
        document.getElementById('pt-y').value = '';
        updatePointsChips();
    }
}

function updatePointsChips() {
    let container = document.getElementById('points-list-container');
    if (!container) return;
    container.innerHTML = graphPoints.map((p, idx) => `
        <span style="display:inline-block; background:#f1f5f9; padding:4px 8px; border-radius:4px; margin:2px;">
            (${p.x}, ${p.y}) <b style="color:red; cursor:pointer;" onclick="removePoint(${idx})">×</b>
        </span>
    `).join('');
}

function removePoint(index) {
    graphPoints.splice(index, 1);
    updatePointsChips();
}

function renderChart() {
    const canvas = document.getElementById('tpChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const ctx = canvas.getContext('2d');
    if (chartInstance) chartInstance.destroy();

    graphPoints.sort((a, b) => a.x - b.x);

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Points TP',
                data: graphPoints,
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                tension: 0.2,
                showLine: true
            }]
        },
        options: { responsive: true }
    });
}


/* ==========================================================================
   3. OUTILS GÉNÉRAUX (CHRONO, COMPTEUR, CALCULATRICE, CONVERTISSEUR)
   ========================================================================== */

let chronoInterval = null;
let chronoSeconds = 0;

function startChrono() {
    if (chronoInterval) return;
    chronoInterval = setInterval(() => {
        chronoSeconds++;
        let hrs = String(Math.floor(chronoSeconds / 3600)).padStart(2, '0');
        let mins = String(Math.floor((chronoSeconds % 3600) / 60)).padStart(2, '0');
        let secs = String(chronoSeconds % 60).padStart(2, '0');
        let disp = document.getElementById('chrono-text');
        if (disp) disp.innerText = `${hrs}:${mins}:${secs}`;
    }, 1000);
}

function stopChrono() {
    clearInterval(chronoInterval);
    chronoInterval = null;
}

function resetChrono() {
    stopChrono();
    chronoSeconds = 0;
    let disp = document.getElementById('chrono-text');
    if (disp) disp.innerText = "00:00:00";
}

function createTimer() {
    let name = document.getElementById('tm-name')?.value || "Minuteur";
    let mins = parseInt(document.getElementById('tm-min')?.value) || 0;
    let secs = parseInt(document.getElementById('tm-sec')?.value) || 0;
    let totalSecs = (mins * 60) + secs;

    if (totalSecs <= 0) return;

    let container = document.getElementById('active-timers-grid');
    if (!container) return;
    let timerId = "timer-" + Date.now();

    let timerCard = document.createElement('div');
    timerCard.className = 'dilution-card';
    timerCard.id = timerId;
    timerCard.innerHTML = `
        <h3>${name}</h3>
        <div class="chrono-display" id="disp-${timerId}">00:00</div>
        <button class="action-btn secondary" onclick="document.getElementById('${timerId}').remove()">Supprimer</button>
    `;
    container.appendChild(timerCard);

    let interval = setInterval(() => {
        let disp = document.getElementById(`disp-${timerId}`);
        if (!disp) { clearInterval(interval); return; }
        if (totalSecs <= 0) {
            clearInterval(interval);
            disp.innerText = "FIN !";
            disp.style.color = "red";
        } else {
            totalSecs--;
            let m = String(Math.floor(totalSecs / 60)).padStart(2, '0');
            let s = String(totalSecs % 60).padStart(2, '0');
            disp.innerText = `${m}:${s}`;
        }
    }, 1000);
}

function addNewCounter() {
    let name = document.getElementById('counter-title-in')?.value || 'Cellule';
    let wrapper = document.getElementById('counters-wrapper');
    if (!wrapper) return;

    let card = document.createElement('div');
    card.className = 'counter-card';
    card.innerHTML = `
        <h4>${name}</h4>
        <div class="count-val">0</div>
        <button class="action-btn" onclick="let v = this.previousElementSibling; v.innerText = parseInt(v.innerText)+1">+</button>
        <button class="action-btn secondary" onclick="let v = this.parentElement.querySelector('.count-val'); if(parseInt(v.innerText)>0) v.innerText = parseInt(v.innerText)-1">-</button>
    `;
    wrapper.appendChild(card);
    document.getElementById('counter-title-in').value = '';
}

function calcPress(val) {
    let screen = document.getElementById('calc-screen');
    if (!screen) return;
    if (screen.value === '0') screen.value = '';
    if (val === 'C') screen.value = '0';
    else screen.value += val;
}

function calcEval() {
    let screen = document.getElementById('calc-screen');
    if (!screen) return;
    try { screen.value = eval(screen.value); } catch(e) { screen.value = 'Erreur'; }
}

const unitOptions = {
    volume: ['mL', 'µL', 'L'],
    masse: ['g', 'mg', 'µg', 'kg'],
    conc: ['mM', 'µM', 'M', 'mg/mL']
};

function switchConvCategory(cat) {
    if (window.event && window.event.currentTarget) {
        document.querySelectorAll('.sub-conv').forEach(b => b.classList.remove('active'));
        window.event.currentTarget.classList.add('active');
    }

    if (cat === 'rcf') {
        document.getElementById('standard-converter')?.classList.add('hidden');
        document.getElementById('rcf-converter')?.classList.remove('hidden');
    } else {
        document.getElementById('standard-converter')?.classList.remove('hidden');
        document.getElementById('rcf-converter')?.classList.add('hidden');

        let fromSel = document.getElementById('conv-from');
        let toSel = document.getElementById('conv-to');
        if (fromSel && toSel && unitOptions[cat]) {
            fromSel.innerHTML = ''; toSel.innerHTML = '';
            unitOptions[cat].forEach(u => {
                fromSel.innerHTML += `<option>${u}</option>`;
                toSel.innerHTML += `<option>${u}</option>`;
            });
        }
    }
}

function runUnitConversion() {
    let val = parseFloat(document.getElementById('conv-val')?.value);
    let from = document.getElementById('conv-from')?.value;
    let to = document.getElementById('conv-to')?.value;
    let res = document.getElementById('conv-res-text');

    if (isNaN(val)) {
        if (res) res.innerText = "0";
        return;
    }
    if (res) res.innerText = `${val} [${from} → ${to}]`;
}

function calcRCF() {
    let r = parseFloat(document.getElementById('rcf-r')?.value);
    let rpm = parseFloat(document.getElementById('rcf-rpm')?.value);
    let res = document.getElementById('conv-res-text');
    if (r && rpm && res) {
        let rcf = 1.118e-5 * r * Math.pow(rpm, 2);
        res.innerText = `${Math.round(rcf)} g`;
    }
}


/* ==========================================================================
   4. BIBLIOTHÈQUE (CODE GÉNÉTIQUE & TABLEAU PÉRIODIQUE)
   ========================================================================== */

const geneticData = [
    { first: "U", second: "U", codons: [ {c:"UUU", aa:"Phenylalanine"}, {c:"UUC", aa:"Phenylalanine"}, {c:"UUA", aa:"Leucine"}, {c:"UUG", aa:"Leucine"} ] },
    { first: "A", second: "U", codons: [ {c:"AUU", aa:"Isoleucine"}, {c:"AUC", aa:"Isoleucine"}, {c:"AUG", aa:"Methionine (Start)", isStart:true} ] }
];

function buildGeneticTable() {
    const container = document.getElementById('codon-table-container');
    if (!container) return;
    container.innerHTML = geneticData.map(block => `
        <div class="codon-block">
            <div class="codon-block-title" style="background:#f3e8ff;">${block.first} - ${block.second}</div>
            ${block.codons.map(item => `<div class="codon-line"><span>${item.c}</span><span>${item.aa}</span></div>`).join('')}
        </div>
    `).join('');
}

function switchGeneticView(view) {
    if (window.event && window.event.currentTarget) {
        const btns = window.event.currentTarget.parentElement.querySelectorAll('.pill-btn');
        btns.forEach(b => b.classList.remove('active'));
        window.event.currentTarget.classList.add('active');
    }

    if (view === 'table') {
        document.getElementById('genetic-table-view')?.classList.remove('hidden');
        document.getElementById('genetic-wheel-view')?.classList.add('hidden');
    } else {
        document.getElementById('genetic-table-view')?.classList.add('hidden');
        document.getElementById('genetic-wheel-view')?.classList.remove('hidden');
    }
}

const periodicElements = [
    { n: 1, s: "H", name: "Hydrogène", cat: "nonmetal", pos: 1 },
    { n: 2, s: "He", name: "Hélium", cat: "noble", pos: 18 },
    { n: 3, s: "Li", name: "Lithium", cat: "alkali", pos: 19 },
    { n: 4, s: "Be", name: "Béryllium", cat: "alkaline-earth", pos: 20 },
    { n: 5, s: "B", name: "Bore", cat: "metalloid", pos: 31 },
    { n: 6, s: "C", name: "Carbone", cat: "nonmetal", pos: 32 }
];

function buildPeriodicTable() {
    const board = document.getElementById('periodic-board');
    if (!board) return;
    board.innerHTML = '';
    
    for (let i = 1; i <= 36; i++) {
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

function filterPeriodicTable() {
    let q = document.getElementById('pt-search')?.value.toLowerCase();
    document.querySelectorAll('.p-elem').forEach(el => {
        let text = el.innerText.toLowerCase() + (el.getAttribute('title') || '').toLowerCase();
        if (text.includes(q)) el.style.opacity = "1";
        else el.style.opacity = "0.2";
    });
}
