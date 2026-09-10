// Initialisation des icônes Lucide
lucide.createIcons();

// Navigation entre Onglets Principaux
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tabId}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Navigation entre Sous-Onglets
function switchSubTab(parent, subId) {
    const parentEl = document.getElementById(`tab-${parent}`);
    parentEl.querySelectorAll('.sub-content').forEach(el => el.classList.remove('active'));
    parentEl.querySelectorAll('.sub-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`sub-${subId}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

/* --- LOGIQUE LABO --- */

// Calcul Dilution
function calculerDilution() {
    let c1 = parseFloat(document.getElementById('c1').value);
    let v1 = parseFloat(document.getElementById('v1').value);
    let c2 = parseFloat(document.getElementById('c2').value);
    let v2 = parseFloat(document.getElementById('v2').value);

    let res = document.getElementById('res-dilution');

    if (!v1 && c1 && c2 && v2) {
        res.innerHTML = `V1 à prélever = <b>${(c2 * v2) / c1}</b> (unités selon V2)`;
    } else if (!c2 && c1 && v1 && v2) {
        res.innerHTML = `C2 finale = <b>${(c1 * v1) / v2}</b>`;
    } else {
        res.innerText = "Remplissez 3 valeurs pour calculer la 4ème.";
    }
}

// Calcul Préparation Solution
function calculerPreparation() {
    let c = parseFloat(document.getElementById('prep-c').value);
    let v_ml = parseFloat(document.getElementById('prep-v').value);
    let m_mol = parseFloat(document.getElementById('prep-m').value);

    if (c && v_ml && m_mol) {
        let masse = c * (v_ml / 1000) * m_mol;
        document.getElementById('res-prep').innerHTML = `Masse à peser : <b>${masse.toFixed(4)} g</b>`;
    }
}

// Molarité
function calculerMolarite() {
    let m = parseFloat(document.getElementById('mol-mass').value);
    let mm = parseFloat(document.getElementById('mol-mm').value);
    let v = parseFloat(document.getElementById('mol-vol').value);
    let unit = document.getElementById('mol-unit').value;

    if (unit === 'mL') v /= 1000;
    if (unit === 'uL') v /= 1000000;

    if (m && mm && v) {
        let n = m / mm;
        let c = n / v;
        document.getElementById('res-molarite').innerHTML = `
            Moles $n$ = ${n.toFixed(4)} mol <br>
            Concentration $C$ = <b>${c.toFixed(4)} mol/L</b>
        `;
    }
}

/* --- GRAPHIQUE TP --- */
let pointsData = [];
let chartInstance = null;

function ajouterPoint() {
    let x = parseFloat(document.getElementById('graph-x').value);
    let y = parseFloat(document.getElementById('graph-y').value);

    if (!isNaN(x) && !isNaN(y)) {
        pointsData.push({x, y});
        document.getElementById('points-list').innerHTML += `<li>Point: X=${x}, Y=${y}</li>`;
    }
}

function tracerGraphique() {
    const ctx = document.getElementById('tpChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    pointsData.sort((a,b) => a.x - b.x);

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Données TP',
                data: pointsData,
                borderColor: '#9d4edf',
                backgroundColor: 'rgba(157, 78, 223, 0.2)',
                showLine: true
            }]
        },
        options: {
            scales: {
                x: { type: 'linear', position: 'bottom' }
            }
        }
    });
}

/* --- OUTILS GÉNÉRAUX --- */

// Minuteurs
function ajouterMinuteur() {
    let sec = parseInt(document.getElementById('timer-sec').value);
    if (!sec) return;

    let container = document.getElementById('timers-container');
    let timerDiv = document.createElement('div');
    timerDiv.className = 'result';
    
    let interval = setInterval(() => {
        sec--;
        timerDiv.innerText = `Temps restant : ${sec}s`;
        if (sec <= 0) {
            clearInterval(interval);
            timerDiv.innerText = "🚨 TEMPS ÉCOULÉ !";
        }
    }, 1000);

    container.appendChild(timerDiv);
}

// Compteurs de Cellules
function ajouterCompteur() {
    let name = document.getElementById('counter-name').value || "Cellule";
    let container = document.getElementById('counters-container');

    let box = document.createElement('div');
    box.className = 'counter-box';
    let count = 0;

    box.innerHTML = `
        <div><b>${name}</b></div>
        <div id="cnt-${name}">${count}</div>
        <button class="counter-btn" onclick="this.previousElementSibling.innerText = ++count">+</button>
    `;
    container.appendChild(box);
}

// Convertisseur RPM / RCF
function convertirRCF() {
    let r = parseFloat(document.getElementById('conv-radius').value);
    let rpm = parseFloat(document.getElementById('conv-rpm').value);

    if (r && rpm) {
        let rcf = 1.118e-5 * r * Math.pow(rpm, 2);
        document.getElementById('res-rcf').innerHTML = `Force Centrifuge Relative (RCF) : <b>${Math.round(rcf)} g</b>`;
    }
}

/* --- BIBLIOTHÈQUE --- */

// Acides Animés Démos
const aminoAcids = [
    { name: "Alanine (Ala/A)", type: "Apolaire" },
    { name: "Glycine (Gly/G)", type: "Apolaire" },
    { name: "Lysine (Lys/K)", type: "Basique" },
    { name: "Acide Glutamique (Glu/E)", type: "Acide" }
];

const aaContainer = document.getElementById('aa-cards');
aminoAcids.forEach(aa => {
    aaContainer.innerHTML += `
        <div class="aa-card">
            <h4>${aa.name}</h4>
            <small>${aa.type}</small>
        </div>
    `;
});

// Tableau Périodique (Démo réduite)
const elements = [
    { sym: "H", name: "Hydrogène", type: "nonmetal" },
    { sym: "He", name: "Hélium", type: "noble" },
    { sym: "Li", name: "Lithium", type: "alkali" }
];

const pTable = document.getElementById('periodic-table');
elements.forEach(e => {
    pTable.innerHTML += `<div class="elem elem-${e.type}"><b>${e.sym}</b><small>${e.name}</small></div>`;
});
