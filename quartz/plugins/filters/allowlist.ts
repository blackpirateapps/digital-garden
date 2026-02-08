import { QuartzFilterPlugin } from "../types"
import path from "path"

export interface FolderAllowlistOptions {
    allow: string[]
}

export const ExplicitOrFolderAllowlist: QuartzFilterPlugin<FolderAllowlistOptions> = (userOpts) => {
    const opts = { ...userOpts }
    return {
        name: "ExplicitOrFolderAllowlist",
        shouldPublish(_ctx, [_tree, vfile]) {
            // 1. Check for explicit publish: true in frontmatter
            const explicitPublish =
                vfile.data?.frontmatter?.publish === true || vfile.data?.frontmatter?.publish === "true"

            if (explicitPublish) {
                return true
            }

            // 2. Check if file is in an allowed folder
            const validFolders = opts.allow ?? []
            const relativePath = vfile.data.relativePath ?? ""

            // Normalize paths to ensure consistent comparison
            // We check if the relative path starts with "Folder/" or matches "Folder" exactly (for the folder itself potentially)
            for (const folder of validFolders) {
                if (relativePath.startsWith(folder + path.sep) || relativePath === folder) {
                    return true
                }
            }

            // 3. Otherwise, reject
            return false
        },
    }
}
