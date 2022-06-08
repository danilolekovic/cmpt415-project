import { useEffect, useState } from 'react'

function OpenModuleComponent(props) {
    const moduleJson = props.file.json
    const [elements, setElements] = useState([])

    const handleModuleStart = (e) => {
        // Parse the module's body
        const moduleBody = moduleJson['body']
        let divs = []

        // loop through each element in the module body
        for (let i = 0; i < moduleBody.length; i++) {
            const element = moduleBody[i]

            // If the element is a header element, add it to the html
            if (element['type'] === 'header') {
                divs.push(
                    <h2>{element['value']}</h2>
                )
            }

            // If the element is a html element, add it to the html
            if (element['type'] === 'html') {
                divs.push((
                    <span>{element['value']}</span>
                ))
            }

            // If the element is a code element, add it to the html
            if (element['type'] === 'code') {
                const value = element['value']
                const name = element['name']

                divs.push(
                    <div id="code-editor-box">
                        <textarea>
                            {value}
                        </textarea>
                    </div>
                )
            }

            // If the element is a image element, add it to the html
            if (element['type'] === 'image') {
                divs.push(
                    <img src={element['value']} />
                )
            }

            divs.push(
                <br />
            )

            setElements(divs)
        }
    }

    useEffect(() => {
        handleModuleStart()
    }, [])

    return (
        elements
    )
}

export default OpenModuleComponent