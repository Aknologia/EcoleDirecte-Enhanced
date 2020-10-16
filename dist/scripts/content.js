chrome.storage.sync.get('ecoledirecte_active', function(data) {if(data.ecoledirecte_active) document.addEventListener('DOMContentLoaded', first());})
function first(){
    var intval = setInterval(function() {
        if(document.getElementById('encart-notes')){
            init();
            clearInterval(intval);
        }
    }, 100)
}

let divtable;
let table;

function init(){
    chrome.storage.sync.get('ecoledirecte_moy', function(data) {if(data.ecoledirecte_moy) moypers()});
}

function moypers(){
    //Add 'Moyennes' Category
    divtable = document.getElementById('encart-notes');
    table = divtable.firstElementChild;
    let thead = table.firstElementChild;
    let tr = thead.firstElementChild;
    var category = document.createElement('th')
    category.className = 'notes';
    category.innerHTML = 'Moyennes';
    tr.insertBefore(category, tr.lastChild);
    console.log("[EcoleDirecte Moyennes] Added 'Moyennes' Category");

    //Add 'Moyennes' Tabs
    let tbody = table.children.item(1);
    let grades = [];
    for(var i = 0; i < tbody.children.length; i++) grades.push(tbody.children.item(i));
    let moys = [];
    for(var i = 0; i < grades.length; i++) {
        var g = mat(grades[i]);
        if(g) moys.push(g);
    }
    console.log("[EcoleDirecte Moyennes] Added 'Moyennes' Tabs");
    moygen(moys);
    console.log("[EcoleDirecte Moyennes] Added 'Moyenne Générale' Tab");
}

function mat(grade){
    let notes = grade.children.item(2);
    let grades = [];
    for(var i = 0; i < notes.children.length; i++){
        if(notes.children.item(i).firstElementChild){
            var all = notes.children.item(i)
            for(var v = 0; v < all.children.length; v++){
                var note = all.children.item(v);
                var value = note.innerHTML.substr(0, note.innerHTML.indexOf(' ')).replace(',','.')
                var coef = 1;
                var quotien = 20;
                for(var w = 0; w < note.children.length; w++){
                    var element = note.children.item(w);
                    var inner = element.innerHTML.replace('(','').replace(')','').replace('/','')
                    if(element.className == 'quotien') quotien = Number(inner);
                    else if(element.className == 'coef') coef = Number(inner);
                }
                if(quotien != 20) value = value*20/quotien;
                if(coef != 1 && coef != 1.0) value = value*coef;
                grades.push({value: value, quotien: quotien, coef: coef});
            }
        }
    }
    let moyenne = '';
    var allval = 0;
    var allcoef = 0;
    if(grades.length != 0){
        for(var i = 0; i < grades.length; i++){
            allval += Number(grades[i].value);
            allcoef += Number(grades[i].coef);
        }
        moyenne = round(allval/allcoef, 1);
    }
    var newtab = document.createElement('td');
    newtab.className = 'coef';
    var moy = document.createElement('span');
    moy.innerHTML = moyenne.toString().replace('.',',');
    newtab.appendChild(moy);
    grade.insertBefore(newtab, grade.lastChild);
    if(allcoef != 0)
        return {allval: allval, allcoef: allcoef, coef: Number(grade.children.item(1).firstElementChild.innerHTML)};
    else
        return null;
}

function moygen(moys){
    let allval = 0;
    let allcoef = 0;
    for(var i = 0; i < moys.length; i++){
        var e = moys[i];
        allval += Number(e.allval)/Number(e.allcoef)*Number(e.coef);
        allcoef += Number(e.coef);
    }
    let moy = round(allval/allcoef, 1);
    let tbody = table.children.item(1);
    var tr = document.createElement('tr');
    var name = document.createElement('td');
    name.className = 'discipline';
    var subname = document.createElement('span');
    subname.innerHTML = 'Moyenne Générale';
    subname.className = 'text-italic';
    name.appendChild(subname);
    tr.appendChild(name);

    let empties = ['coef', 'notes', 'graph text-center'];
    for(var i = 0; i < empties.length; i++){
        var empty = document.createElement('td');
        empty.className = empties[i];
        var span = document.createElement('span');
        span.innerHTML = ' ';
        empty.appendChild(span);
        tr.appendChild(empty);
    }
    var moytd = document.createElement('td');
    moytd.className = 'coef';
    var moyspan = document.createElement('span');
    moyspan.innerHTML = moy;
    moytd.appendChild(moyspan);
    tr.insertBefore(moytd, tr.lastElementChild);
    tbody.appendChild(tr);
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}