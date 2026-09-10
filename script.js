// Initialisation des icônes Lucide
lucide.createIcons();

/* ==========================================================================
   1. NAVIGATION PRINCIPALE ET SOUS-ONGLETS
   ========================================================================== */

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tab}`).classList.add('active');
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

function switchLabSub(sub) {
    document.querySelectorAll('#tab-labo .sub-panel').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('#tab-labo .sub-tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`lab-${sub}`).classList.remove('hidden');
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

function switchGenTab(sub) {
    document.querySelectorAll('#tab-general .gen-panel').forEach(el => el.classList.add('hidden'));
    document.getElementById(`gen-${sub}`).classList.remove('hidden');
    
    if (event && event.currentTarget) {
        const btns = event.currentTarget.parentElement.querySelectorAll('.pill-btn');
        btns.forEach(b => b.classList.remove('active'));
        event.currentTarget.classList.add('active');
    }
}

function switchBibSub(sub) {
    document.querySelectorAll('#tab-biblio .sub-panel').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('#tab-biblio .sub-tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`bib-${sub}`).classList.remove('hidden');
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}


/* ==========================================================================
   2. ESPACE LABORATOIRE : DILUTIONS
   ========================================================================== */

function switchDilutionMode(mode) {
    const modes = ['simple', 'serie', 'inverse', 'prep'];
    modes.forEach(m => document.getElementById(`dilution-${m}`).classList.add('hidden'));
    document.getElementById(`dilution-${mode}`).classList.remove('hidden');

    if (event && event.currentTarget) {
        const btns = event.currentTarget.parentElement.querySelectorAll('.pill-btn');
        btns.forEach(b => b.classList.remove('active'));
        event.currentTarget.classList.add('active');
    }
}

function calcDilutionSimple() {
    let c1 = parseFloat(document.getElementById('ds-c1').value);
    let c2 = parseFloat(document.getElementById('ds-c2').value);
    let v2 = parseFloat(document.getElementById('ds-v2').value);

    if (c1 && c2 && v2) {
        if (c2 >= c1) {
            document.getElementById('res-ds').innerHTML = `<span style="color:red;">Erreur: C2 doit être inférieure à C1.</span>`;
            return;
        }
        let v1 = (c2 * v2) / c1;
        let vSolvant = v2 - v1;
        document.getElementById('res-ds').innerHTML = `
            Volume stock à prélever (V1) : <b>${v1.toFixed(3)}</b><br>
            Volume de solvant à ajouter : <b>${vSolvant.toFixed(3)}</b>
        `;
    } else {
        document.getElementById('res-ds').innerHTML = `Veuillez remplir tous les champs.`;
    }
}

function calcDilutionSerie() {
    let c1 = parseFloat(document.getElementById('dser-c1').value);
    let factor = parseFloat(document.getElementById('dser-factor').value);
    let steps = parseInt(document.getElementById('dser-steps').value);
    
    if (c1 && factor && steps) {
        let text = "<b>Série calculée :</b><br>";
        let currentC = c1;
        graphPoints = []; // Réinitialise pour le graphique TP

        for (let i = 1; i <= steps; i++) {
            text += `Tube ${i}: Conc = <b>${currentC.toFixed(3)}</b><br>`;
            graphPoints.push({ x: i, y: parseFloat(currentC.toFixed(3)) });
            currentC /= factor;
        }
        document.getElementById('res-dser').innerHTML = text;
        updatePointsChips();
    } else {
        document.getElementById('res-dser').innerHTML = `Veuillez remplir tous les champs.`;
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
    } else {
        document.getElementById('res-di').innerHTML = `Veuillez remplir tous les champs.`;
    }
}

function calcPrepSolution() {
    let mw = parseFloat(document.getElementById('dp-mw').value);
    let c = parseFloat(document.getElementById('dp-c').value);
    let v_ml = parseFloat(document.getElementById('dp-v').value);

    if (mw && c && v_ml) {
        let masse_g = (c / 1000) * (v_ml / 1000) * mw;
        document.getElementById('res-dp').innerHTML = `Masse à peser : <b>${masse_g.toFixed(4)} g</b>`;
    } else {
        document.getElementById('res-dp').innerHTML = `Veuillez remplir tous les champs.`;
    }
}


/* ==========================================================================
   3. ESPACE LABORATOIRE : MOLARITÉ
   ========================================================================== */

let currentMolMode = 'masse';

function switchMolMode(mode) {
    currentMolMode = mode;
    if (event && event.currentTarget) {
        const btns = event.currentTarget.parentElement.querySelectorAll('.pill-btn');
        btns.forEach(b => b.classList.remove('active'));
        event.currentTarget.classList.add('active');
    }

    const badge = document.getElementById('mol-formula-badge');
    const formulaText = document.getElementById('mol-formula-text');

    if (mode === 'masse') {
        badge.innerText = "m";
        formulaText.innerText = "C × V × MW";
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

    let resText = document.getElementById('mol-res-text');

    if (currentMolMode === 'masse' && c && v_ml && mw) {
        let res = (c / 1000) * (v_ml / 1000) * mw;
        resText.innerText = `${res.toFixed(4)} g`;
    } else if (currentMolMode === 'molarite' && m && mw && v_ml) {
        let res = m / (mw * (v_ml / 1000));
        resText.innerText = `${res.toFixed(4)} M`;
    } else {
        resText.innerText = "Saisie incomplète";
    }
}


/* ==========================================================================
   4. ESPACE LABORATOIRE : GRAPHIQUE TP
   ========================================================================== */

let graphPoints = [];
let chartInstance = null;

function addGraphPoint() {
    let x = parseFloat(document.getElementById('pt-x').value);
    let y = parseFloat(document.getElementById('pt-y').value);

    if (!isNaN(x) && !isNaN(y)) {
        graphPoints.push({ x, y });
        document.getElementById('pt-x').value = '';
        document.getElementById('pt-y').value = '';
        updatePointsChips();
    }
}

function updatePointsChips() {
    let container = document.getElementById('points-list-container');
    container.innerHTML = graphPoints.map((p, idx) => `
        <span class="unit-tag" style="margin:2px; display:inline-flex; align-items:center; gap:6px;">
            (${p.x}, ${p.y}) 
            <button style="border:none; background:transparent; cursor:pointer; font-weight:bold; color:red;" onclick="removePoint(${idx})">×</button>
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

    graphPoints.sort((a, b) => a.x - b.x);

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Points TP',
                data: graphPoints,
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                tension: 0.2,
                showLine: true,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { type: 'linear', title: { display: true, text: 'Axe X' } },
                y: { title: { display: true, text: 'Axe Y' } }
            }
        }
    });
}


/* ==========================================================================
   5. OUTILS GÉNÉRAUX : CHRONOMÈTRE ET MINUTEURS
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
        document.getElementById('chrono-text').innerText = `${hrs}:${mins}:${secs}`;
    }, 1000);
}

function stopChrono() {
    clearInterval(chronoInterval);
    chronoInterval = null;
}

function resetChrono() {
    stopChrono();
    chronoSeconds = 0;
    document.getElementById('chrono-text').innerText = "00:00:00";
}

function createTimer() {
    let name = document.getElementById('tm-name').value || "Minuteur";
    let mins = parseInt(document.getElementById('tm-min').value) || 0;
    let secs = parseInt(document.getElementById('tm-sec').value) || 0;
    let totalSecs = (mins * 60) + secs;

    if (totalSecs <= 0) return;

    let container = document.getElementById('active-timers-grid');
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
        if (totalSecs <= 0) {
            clearInterval(interval);
            document.getElementById(`disp-${timerId}`).innerText = "TERMINÉ !";
            document.getElementById(`disp-${timerId}`).style.color = "red";
        } else {
            totalSecs--;
            let m = String(Math.floor(totalSecs / 60)).padStart(2, '0');
            let s = String(totalSecs % 60).padStart(2, '0');
            document.getElementById(`disp-${timerId}`).innerText = `${m}:${s}`;
        }
    }, 1000);
}


/* ==========================================================================
   6. OUTILS GÉNÉRAUX : COMPTEUR & CALCULATRICE
   ========================================================================== */

function addNewCounter() {
    let name = document.getElementById('counter-title-in').value || 'Cellule';
    let wrapper = document.getElementById('counters-wrapper');

    let card = document.createElement('div');
    card.className = 'counter-card';
    card.innerHTML = `
        <h4>${name}</h4>
        <div class="count-val">0</div>
        <button onclick="let v = this.previousElementSibling; v.innerText = parseInt(v.innerText)+1">+</button>
        <button style="background:#fee2e2; color:#b91c1c;" onclick="let v = this.parentElement.querySelector('.count-val'); if(parseInt(v.innerText)>0) v.innerText = parseInt(v.innerText)-1">-</button>
    `;
    wrapper.appendChild(card);
    document.getElementById('counter-title-in').value = '';
}

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


/* ==========================================================================
   7. OUTILS GÉNÉRAUX : CONVERTISSEUR D'UNITÉS
   ========================================================================== */

const unitOptions = {
    volume: ['mL', 'µL', 'L'],
    masse: ['g', 'mg', 'µg', 'kg'],
    conc: ['mM', 'µM', 'M', 'mg/mL'],
    ppm: ['%', 'ppm', 'ppb'],
    temp: ['°C', 'K', '°F']
};

function switchConvCategory(cat) {
    if (event && event.currentTarget) {
        document.querySelectorAll('.sub-conv').forEach(b => b.classList.remove('active'));
        event.currentTarget.classList.add('active');
    }

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

function runUnitConversion() {
    let val = parseFloat(document.getElementById('conv-val').value);
    let from = document.getElementById('conv-from').value;
    let to = document.getElementById('conv-to').value;

    if (isNaN(val)) {
        document.getElementById('conv-res-text').innerText = "0";
        return;
    }

    // Calcul simplifié de conversion générique
    document.getElementById('conv-res-text').innerText = `${val} [${from} → ${to}]`;
}

function calcRCF() {
    let r = parseFloat(document.getElementById('rcf-r').value);
    let rpm = parseFloat(document.getElementById('rcf-rpm').value);
    if (r && rpm) {
        let rcf = 1.118e-5 * r * Math.pow(rpm, 2);
        document.getElementById('conv-res-text').innerText = `${Math.round(rcf)} g`;
    }
}


/* ==========================================================================
   8. BIBLIOTHÈQUE : CODE GÉNÉTIQUE & TABLEAU PÉRIODIQUE
   ========================================================================== */

const geneticData = [
    { first: "U", second: "U", codons: [ {c:"UUU", aa:"Phenylalanine"}, {c:"UUC", aa:"Phenylalanine"}, {c:"UUA", aa:"Leucine"}, {c:"UUG", aa:"Leucine"} ] },
    { first: "U", second: "C", codons: [ {c:"UCU", aa:"Serine"}, {c:"UCC", aa:"Serine"}, {c:"UCA", aa:"Serine"}, {c:"UCG", aa:"Serine"} ] },
    { first: "A", second: "U", codons: [ {c:"AUU", aa:"Isoleucine"}, {c:"AUC", aa:"Isoleucine"}, {c:"AUA", aa:"Isoleucine"}, {c:"AUG", aa:"Methionine (Start)", isStart:true} ] },
    { first: "U", second: "A", codons: [ {c:"UAU", aa:"Tyrosine"}, {c:"UAC", aa:"Tyrosine"}, {c:"UAA", aa:"Stop", isStop:true}, {c:"UAG", aa:"Stop", isStop:true} ] }
];

function buildGeneticTable() {
    const container = document.getElementById('codon-table-container');
    if (!container) return;
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

function switchGeneticView(view) {
    if (event && event.currentTarget) {
        const btns = event.currentTarget.parentElement.querySelectorAll('.pill-btn');
        btns.forEach(b => b.classList.remove('active'));
        event.currentTarget.classList.add('active');
    }

    if (view === 'table') {
        document.getElementById('genetic-table-view').classList.remove('hidden');
        document.getElementById('genetic-wheel-view').classList.add('hidden');
    } else {
        document.getElementById('genetic-table-view').classList.add('hidden');
        document.getElementById('genetic-wheel-view').classList.remove('hidden');
    }
}

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
    { n: 18, s: "Ar", name: "Argon", cat: "noble", pos: 54 }
];

function buildPeriodicTable() {
    const board = document.getElementById('periodic-board');
    if (!board) return;
    board.innerHTML = '';
    
    for (let i = 1; i <= 54; i++) {
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
    let q = document.getElementById('pt-search').value.toLowerCase();
    document.querySelectorAll('.p-elem').forEach(el => {
        let text = el.innerText.toLowerCase() + (el.getAttribute('title') || '').toLowerCase();
        if (text.includes(q)) el.style.opacity = "1";
        else el.style.opacity = "0.2";
    });
}

// Initialisations automatiques au chargement de la page
buildGeneticTable();
buildPeriodicTable();
