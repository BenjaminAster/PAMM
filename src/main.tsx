
{
	// Promise.withResolvers() polyfill until browser support is better
	Promise.withResolvers ??= function () {
		let resolve, reject;
		let promise = new Promise((res, rej) => (resolve = res, reject = rej));
		return { promise, resolve, reject };
	} as any;
}

import "./files.tsx";
import { elements, $$, storage, transition } from "./app.tsx";

{
	// horizontal / vertical layout
	const button = elements.toggleLayoutButton;
	let /** @type {EditorLayout} */ currentLayout = storage.get("editor-layout") ?? "aside";
	// console.error("current layout:", currentLayout);
	document.documentElement.dataset.editorLayout = currentLayout;
	button.addEventListener("click", async () => {
		currentLayout = currentLayout === "aside" ? "stacked" : "aside";
		await transition(async () => {
			document.documentElement.dataset.editorLayout = currentLayout;
		}, { name: "toggling-layout" });
		storage.set("editor-layout", currentLayout);
	});

	const editor = elements.editor;
	const dragger = editor.querySelector(".dragger");

	let dragging = false;
	let /** @type {number} */ relativeDraggerCoordinate;
	let /** @type {number} */ draggerSize;
	let /** @type {number} */ containerCoordinate;
	let /** @type {number} */ containerSize;

	dragger.addEventListener("pointerdown", ({ clientX, clientY }) => {
		editor.classList.add("dragging");
		dragging = true;
		const stacked = currentLayout === "stacked";
		let /** @type {number} */ draggerCoordinate;
		({ [stacked ? "y" : "x"]: draggerCoordinate, [stacked ? "height" : "width"]: draggerSize } = dragger.getBoundingClientRect());
		relativeDraggerCoordinate = (stacked ? clientY : clientX) - draggerCoordinate;
		({ [stacked ? "y" : "x"]: containerCoordinate, [stacked ? "height" : "width"]: containerSize } = editor.getBoundingClientRect());
	});

	window.addEventListener("pointerup", () => {
		if (!dragging) return;
		editor.classList.remove("dragging");
		dragging = false;
	});

	window.addEventListener("pointermove", ({ clientX, clientY }) => {
		if (!dragging) return;
		const stacked = currentLayout === "stacked";
		const splitProportion = ((stacked ? clientY : clientX) - relativeDraggerCoordinate - containerCoordinate) / (containerSize - draggerSize);
		editor.style.setProperty("--split-proportion", splitProportion);
	});
}

