import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [sveltekit({ preprocess: vitePreprocess(), alias: { $lib: "src/lib" } })],
	test: {
		include: ["src/**/*.{test,test.svelte,spec}.{js,ts}"],
		environment: "jsdom"
	}
});
