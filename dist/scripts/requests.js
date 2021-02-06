let ReqFeatures = {
    average: {
        path: [
            'moyenneEleve',
            'moyenneEleveDansNotes',
            'moyenneEleveDansMoyenne',
            'affichageNote',
            'affichageMoyenne',
        ],
    },
    ranks: {
        path: ['moyenneRang'],
    },
    appreciation: {
        path: [
            'affichageMention',
            'affichageAppreciation',
            'affichageAppreciationCE',
            'affichageAppreciationVS',
            'affichageAppreciationCN',
            'affichageAppreciationClasse',
            'affichageAppreciationPeriodeCloturee',
            'appreciationsProf',
            'appreciationProfPrinc',
        ],
    },
    graphiques: {
        path: ['moyenneGraphique', 'moyennesSimulation'],
    },
    notes: {
        path: [
            'noteGrasSousMoyenne',
            'noteGrasAudessusMoyenne',
            'notePeriodeReleve',
            'notePeriodeAnnuelle',
            'notePeriodeHorsP',
        ],
        unset: ['noteUniquementPeriodeCloture'],
    },
    competences: {
        path: [
            'affichageCompetence',
            'affichageEvaluationsComposantes',
            'affichageGraphiquesComposantes',
        ],
    },
    coefficients: {
        path: ['coefficientNote', 'colonneCoefficientMatiere'],
    },
    devoirs: {
        path: ['libelleDevoir', 'dateDevoir', 'typeDevoir'],
    },
};

chrome.storage.sync.get('ecoledirecte_settings', function (data) {
    if (data.ecoledirecte_settings.active) load(data.ecoledirecte_settings);
});

function load(settings) {
    if (!settings) return;

    let meta1 = document.createElement('meta');
    meta1.name = 'requestFeatures';
    meta1.content = JSON.stringify(ReqFeatures);

    let meta2 = document.createElement('meta');
    meta2.name = 'EDE_Settings';
    meta2.content = JSON.stringify(settings);

    let s = document.createElement('script');
    s.src = chrome.extension.getURL('dist/scripts/features/requests_script.js');
    s.onload = function () {
        this.remove();
    };
    let head = document.head || document.documentElement;
    head.appendChild(meta1);
    head.appendChild(meta2);
    head.appendChild(s);
}
