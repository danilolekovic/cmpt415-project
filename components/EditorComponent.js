import Editor from "@monaco-editor/react"

export default function EditorComponent(props) {
    const options = {
        fontSize: "14px",
        minimap: { enabled: false }
    }

    return (
        <Editor
            height="90vh"
            defaultLanguage="python"
            defaultValue="# Write your code here"
            options={options}
        />
    )
}