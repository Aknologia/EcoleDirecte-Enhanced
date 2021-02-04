let DIV_TABLE;
let TABLE;

setTimeout(() => {
    bindDOMChange();
}, 500);

function average() {
    /* Add 'Moyennes' Category */
    // Get table's parent
    // Get table
    let thead = TABLE.firstElementChild;
    let tr = thead.firstElementChild;
    // Create 'Moyenne' tab
    var category = document.createElement('th');
    category.className = 'notes';
    category.id = 'enhanced-moy';
    category.innerHTML = 'Moyennes';

    tr.insertBefore(category, tr.lastChild);
    console.log("[EcoleDirecte Enhanced] Added 'Moyennes' Category");

    /* Loop through grades and add them to table */
    let tbody = TABLE.children.item(1);
    let grades = [];
    for (var i = 0; i < tbody.children.length; i++)
        grades.push(tbody.children.item(i));
    let moys = [];
    for (var i = 0; i < grades.length; i++) {
        var g = gradeByTheme(grades[i]);
        if (g) moys.push(g);
    }
    console.log("[EcoleDirecte Enhanced] Added 'Moyennes' Tabs");
    // Generate Main average
    GlobalAverage(moys);
    console.log("[EcoleDirecte Enhanced] Added 'Moyenne Générale' Tab");
}

function gradeByTheme(grade) {
    var notes = false;
    var name = false;
    for (var i = 0; i < grade.childNodes.length; i++) {
        if (grade.childNodes[i].className == 'notes') {
            notes = grade.childNodes[i];
            break;
        } else if (grade.childNodes[i].className == 'discipline') {
            name = grade.childNodes[i].firstElementChild.innerHTML;
        }
    }
    if (!notes) {
        console.error(
            `[EcoleDirecte Enhanced] No 'notes' class detected, please reload the tab. ('${name}')`
        );
        return;
    }
    let grades = [];
    for (var i = 0; i < notes.children.length; i++) {
        if (notes.children.item(i).firstElementChild) {
            var all = notes.children.item(i);
            for (var v = 0; v < all.children.length; v++) {
                var note = all.children.item(v);
                if (
                    !note.innerHTML
                        .substr(0, note.innerHTML.indexOf(' '))
                        .includes('(') &&
                    !note.innerHTML
                        .substr(0, note.innerHTML.indexOf(' '))
                        .includes(')')
                ) {
                    var value = note.innerHTML
                        .substr(0, note.innerHTML.indexOf(' '))
                        .replace(',', '.');
                    if (!isNaN(value)) {
                        var coef = 1;
                        var quotien = 20;
                        for (var w = 0; w < note.children.length; w++) {
                            var element = note.children.item(w);
                            var inner = element.innerHTML
                                .replace('(', '')
                                .replace(')', '')
                                .replace('/', '');
                            if (element.className == 'quotien')
                                quotien = Number(inner);
                            else if (element.className == 'coef')
                                coef = Number(inner);
                        }
                        if (quotien != 20) value = (value * 20) / quotien;
                        if (coef != 1 && coef != 1.0) value = value * coef;
                        grades.push({
                            value: value,
                            quotien: quotien,
                            coef: coef,
                        });
                    }
                }
            }
        }
    }
    let moyenne = '';
    var allval = 0;
    var allcoef = 0;
    if (grades.length != 0) {
        for (var i = 0; i < grades.length; i++) {
            allval += Number(grades[i].value);
            allcoef += Number(grades[i].coef);
        }
        moyenne = round(allval / allcoef, 2);
    }

    var newtab = document.createElement('td');
    newtab.className = 'coef';
    var moy = document.createElement('span');
    moy.innerHTML = moyenne.toString().replace('.', ',');
    newtab.appendChild(moy);
    grade.insertBefore(newtab, grade.lastChild);
    if (allcoef != 0)
        return {
            allval: allval,
            allcoef: allcoef,
            coef: Number(grade.children.item(1).firstElementChild.innerHTML),
        };
    else return null;
}

function GlobalAverage(moys) {
    let allval = 0;
    let allcoef = 0;
    for (var i = 0; i < moys.length; i++) {
        var e = moys[i];
        allval += (Number(e.allval) / Number(e.allcoef)) * Number(e.coef);
        allcoef += Number(e.coef);
    }
    let moy = round(allval / allcoef, 2);
    //Get table body & create main TR
    let tbody = TABLE.children.item(1);
    var tr = document.createElement('tr');
    tr.style = 'background-color: #ebebeb;';
    var name = document.createElement('td');
    name.className = 'discipline';
    var subname = document.createElement('span');
    subname.innerHTML = '<b><i>MOYENNE GÉNÉRALE</i></b>';
    subname.className = 'text-black text-bold';
    name.appendChild(subname);
    tr.appendChild(name);

    let empties = ['notes', 'notes', 'graph text-center'];
    for (var i = 0; i < empties.length; i++) {
        var empty = document.createElement('td');
        if (i === 0) empty.style = 'border-right: none;';
        else if (i === 1) empty.style = 'border-left: none;border-right: none;';
        empty.className = empties[i];
        var span = document.createElement('span');
        span.innerHTML = ' ';
        empty.appendChild(span);
        tr.appendChild(empty);
    }
    var moytd = document.createElement('td');
    moytd.style = 'border-right: none;';
    moytd.className = 'coef';
    var moyspan = document.createElement('span');
    moyspan.innerHTML = !isNaN(moy) ? moy.toString().replace('.', ',') : '';
    moytd.appendChild(moyspan);
    tr.insertBefore(moytd, tr.lastElementChild);
    tbody.appendChild(tr);
}

function bindDOMChange() {
    var interval = setInterval(() => {
        if (
            document.getElementById('encart-notes') &&
            !document.getElementById('enhanced-moy')
        ) {
            clearInterval(interval);
            DIV_TABLE = document.getElementById('encart-notes');
            TABLE = DIV_TABLE.firstElementChild;
            average();
            setTimeout(bindDOMChange, 800);
        }
    }, 500);
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
