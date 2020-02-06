const cheerio = require("cheerio");

const HTMLString = `<div class="sample" id="sample">
                        <div class="inner">
                            <div class="inner-of-inner"></div>
                        </div>
                        <div class="inner">
                            <div class="inner-of-inner"></div>
                        </div>
                    </div>`

const $ = cheerio.load(HTMLString, {
    normalizeWhitespace: true,
    xmlMode: true
});

const allElements = $("*");

let output = ''

for (let i = 0; i < allElements.length; i++) {
    let name = allElements[i].name;
    output += `let ${name}elem${i} = document.createElement("${allElements[0].name}");\n`;
    setAttributes(`${name}elem${i}`, allElements[i].attribs)
}

console.log(output)



function setAttributes(el, attrs) {
    for (var key in attrs) {
        output += `${el}.setAttribute("${key}", "${attrs[key]}");\n`
    }
}