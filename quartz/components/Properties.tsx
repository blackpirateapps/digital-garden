import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { JSX } from "preact"
import style from "./styles/properties.scss"

function Properties({ fileData, displayClass }: QuartzComponentProps) {
    const frontmatter = fileData.frontmatter
    if (!frontmatter) return null

    const ignoreProperties = ["title", "slug", "filePath", "relativePath", "description", "publish"]
    const entries = Object.entries(frontmatter).filter(([key]) => !ignoreProperties.includes(key))

    if (entries.length === 0) return null

    return (
        <div class={classNames(displayClass, "properties")}>
            <table>
                <tbody>
                    {entries.map(([key, value]) => {
                        let displayValue: any = value
                        if (Array.isArray(value)) {
                            displayValue = value.join(", ")
                        } else if (value instanceof Date) {
                            displayValue = value.toLocaleDateString()
                        } else if (typeof value === "boolean") {
                            displayValue = value ? "Yes" : "No"
                        }

                        return (
                            <tr key={key}>
                                <td class="property-key">{key}</td>
                                <td class="property-value">{String(displayValue)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

Properties.css = style

export default (() => Properties) satisfies QuartzComponentConstructor
