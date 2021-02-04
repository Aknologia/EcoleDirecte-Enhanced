let DIV_TABLE;
let TABLE;

setTimeout(() => {
    bindDOMChange();
}, 500);

class ClassAverage {
    constructor(gradesElement) {
        this.grades = this.parseGrades(gradesElement);
        this.average = this.calculateAverage(this.grades, gradesElement);
    }

    calculateAverage(grades, gradesElement) {
        let avrg = '';
        var allval = 0;
        var allcoef = 0;
        if (grades.length != 0) {
            grades.forEach((grade) => {
                allval += Number(grade.value);
                allcoef += Number(grade.coef);
            });
            avrg = round(allval / allcoef, 2);
        }

        var newtab = document.createElement('td');
        newtab.className = 'coef';
        var moy = document.createElement('span');

        moy.innerHTML = avrg.toString().replace('.', ',');

        newtab.appendChild(moy);

        gradesElement.insertBefore(newtab, gradesElement.lastChild);

        if (allcoef != 0)
            return {
                allval: allval,
                allcoef: allcoef,
                coef: Number(
                    gradesElement.children.item(1).firstElementChild.innerHTML
                ),
            };
        else return null;
    }

    parseGrades(element) {
        let gradesElement = null;
        let name = null;

        Array.from(element.childNodes).map((child) => {
            if (child.className == 'notes') {
                gradesElement = child;
                return;
            } else if (child.className == 'discipline') {
                name = child.firstElementChild.innerHTML;
            }
        });

        if (!gradesElement) {
            console.error(
                `[EcoleDirecte Enhanced] No 'notes' class detected, please reload the tab. ('${name}')`
            );
            return false;
        }

        let grades = [];
        Array.from(gradesElement.children).forEach((child) => {
            if (child.firstElementChild) {
                Array.from(child.children).forEach((childOf) => {
                    let grade = this.parseValue(childOf);
                    if (grade) grades.push(grade);
                });
            }
        });
        return grades;
    }

    parseValue(element) {
        if (
            !element.innerHTML
                .substr(0, element.innerHTML.indexOf(' '))
                .includes('(') &&
            !element.innerHTML
                .substr(0, element.innerHTML.indexOf(' '))
                .includes(')')
        ) {
            let value = element.innerHTML
                .substr(0, element.innerHTML.indexOf(' '))
                .replace(',', '.');
            if (!isNaN(value)) {
                let coef = 1;
                let quotien = 20;
                Array.from(element.children).forEach((child) => {
                    let inner = child.innerHTML
                        .replace('(', '')
                        .replace(')', '')
                        .replace('/', '');
                    if (child.className == 'quotien') quotien = Number(inner);
                    else if (child.className == 'coef') coef = Number(inner);
                });
                if (quotien != 20) value = (value * 20) / quotien;
                if (coef != 1 && coef != 1.0) value = value * coef;

                return {
                    value: value,
                    quotien: quotien,
                    coef: coef,
                };
            }
        }
        return null;
    }
}

class GlobalAverage {
    constructor(averages) {
        this.average = this.calculateAverage(averages);
        this.addRow(this.average);
    }

    calculateAverage(averages) {
        let allval = 0;
        let allcoef = 0;
        averages.forEach((avg) => {
            allval +=
                (Number(avg.allval) / Number(avg.allcoef)) * Number(avg.coef);
            allcoef += Number(avg.coef);
        });
        return round(allval / allcoef, 2);
    }

    addRow(average) {
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
        empties.forEach((emptEl, i) => {
            var empty = document.createElement('td');
            if (i === 0) empty.style = 'border-right: none;';
            else if (i === 1)
                empty.style = 'border-left: none;border-right: none;';
            empty.className = emptEl;
            var span = document.createElement('span');
            span.innerHTML = ' ';
            empty.appendChild(span);
            tr.appendChild(empty);
        });

        var moytd = document.createElement('td');
        moytd.style = 'border-right: none;';
        moytd.className = 'coef';

        var moyspan = document.createElement('span');
        moyspan.innerHTML = !isNaN(average)
            ? average.toString().replace('.', ',')
            : '';

        moytd.appendChild(moyspan);
        tr.insertBefore(moytd, tr.lastElementChild);
        tbody.appendChild(tr);
    }
}

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
        var g = new ClassAverage(grades[i]).average;
        if (g) moys.push(g);
    }
    console.log("[EcoleDirecte Enhanced] Added 'Moyennes' Tabs");
    // Generate Main average
    new GlobalAverage(moys);
    console.log("[EcoleDirecte Enhanced] Added 'Moyenne Générale' Tab");
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
