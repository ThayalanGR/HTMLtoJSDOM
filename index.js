const cheerio = require("cheerio");
const fs = require("fs");

let HTMLString = fs.readFileSync("./pastehere.html").toString();

const $ = cheerio.load(HTMLString, {
    normalizeWhitespace: true,
    xmlMode: true
});

const allElements = $("*");

let nameCache = [];

for (let i = 0; i < allElements.length; i++) {
    let name = allElements[i].name;
    let cls = "";
    if (allElements[i].attribs.class)
        cls = allElements[i].attribs.class.replace(/[- ]/g, '');
    nameCache.push(`${cls + name}`)
}

console.log(nameCache);

let output = '';
let appendArr = [];
for (let i = 0; i < allElements.length; i++) {
    let name = allElements[i].name + i.toString();
    let cls = "";
    if (allElements[i].attribs.class)
        cls = allElements[i].attribs.class.replace(/[- ]/g, '');
    output += `let ${cls + name}Elem = document.createElement("${allElements[i].name}");\n`;
    setAttributes(`${cls + name}Elem`, allElements[i].attribs)
    if (allElements[i].children.length && allElements[i].children[0].type === 'text' && allElements[i].children[0].data.trim() !== "") {
        if (allElements[i].children[0].data.trim().includes("$")) {
            output += `${cls + name}Elem.append(document.createTextNode(${allElements[i].children[0].data.replace(/[${}]/g, "")}));\n`
        } else {
            output += `${cls + name}Elem.append(document.createTextNode("${allElements[i].children[0].data}"));\n`
        }
    }

    if (allElements[i].parent) {
        let pName = allElements[i].parent.name;
        let pCls = "";
        console.log(nameCache.indexOf(cls + pName))
        if (allElements[i].parent.attribs.class)
            pCls = allElements[i].parent.attribs.class.replace(/[- ]/g, '');
        let temp = `${pCls + pName}Elem.append(${cls + name}Elem);\n`;
        appendArr.unshift(temp)
    }
}

appendArr.forEach(item => {
    output += item;
})

console.log(output)

function setAttributes(el, attrs) {
    for (var key in attrs) {
        if (attrs[key].includes("$"))
            output += `${el}.setAttribute("${key}", ${attrs[key].replace(/[${}]/gi, "")});\n`
        else
            output += `${el}.setAttribute("${key}", "${attrs[key].replace(/[${}]/gi, "")}");\n`
    }
}