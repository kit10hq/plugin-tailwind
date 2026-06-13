import nodePath from "node:path";
import { compile } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";
//#region src/main.ts
const REGEXP = /@import\s+["']tailwindcss["']/u;
let candidates;
const tailwindPlugin = {
	filter: /\.css/u,
	async transform(artifact, options) {
		const content_css = await artifact.text();
		if (REGEXP.test(content_css)) {
			if (!candidates) candidates = new Scanner({ sources: [{
				base: options.source_path,
				pattern: "**/*",
				negated: false
			}] }).scan();
			const compiler = await compile(content_css, {
				base: nodePath.dirname(artifact.absolute_path),
				from: artifact.absolute_path,
				onDependency() {}
			});
			artifact.update(compiler.build(candidates));
		}
	}
};
//#endregion
export { tailwindPlugin };
