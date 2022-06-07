export function parseModuleJson(file) {
    const moduleJson = file

    // Parse the module's body
    const moduleBody = moduleJson['body']
    let html = "";

    // loop through each element in the module body
    for (let i = 0; i < moduleBody.length; i++) {
        const element = moduleBody[i]

        // If the element is a header element, add it to the html
        if (element['type'] === 'header') {
            html += `<h${element['level']}>${element['value']}</h${element['level']}>`
        }

        // If the element is a html element, add it to the html
        if (element['type'] === 'html') {
            html += element['value']
        }

        // If the element is a code element, add it to the html
        if (element['type'] === 'code') {
            html += "<pre><code>" + element['value'] + "</code></pre>"
        }

        // If the element is a image element, add it to the html
        if (element['type'] === 'image') {
            html += "<img src='" + element['image'] + "' />"
        }

        html += "<br />"
    }

    return html
}