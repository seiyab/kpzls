import { run } from "remix/component";
import { Board } from "./board";

const app = run({
	loadModule(_url, exportName) {
		if (exportName !== "Board")
			throw new Error(`Unknown client entry: ${exportName}`);
		return Promise.resolve(Board);
	},
});

void app.ready();
