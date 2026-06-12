import { compile } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';
import type { Plugin } from 'kit10';

const REGEXP = /@import\s+["']tailwindcss["']/u;
let candidates: string[] | undefined;

export const tailwindPlugin: Plugin = {
	filter: /\.css/u,
	async transform(artifact, options) {
		const content_css = await artifact.text();

		if (REGEXP.test(content_css)) {
			if (!candidates) {
				const scanner = new Scanner({
					sources: [
						{
							base: options.source_path,
							pattern: '**/*',
							negated: false,
						},
					],
				});

				candidates = scanner.scan();
			}

			const compiler = await compile(content_css, {
				base: options.source_path,
				from: artifact.absolute_path,
				onDependency() {
					// do nothing
				},
			});

			artifact.update(compiler.build(candidates));
		}
	},
};
