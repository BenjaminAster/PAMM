
import { type Config as WinzigConfig } from "winzig";

winzigConfig: ({
	output: "../",
	appfiles: "appfiles",
	css: "./css/main.css",
}) satisfies WinzigConfig;

import "./main.tsx";

const Asdf = () => <div>asdf</div>;
console.log((<Asdf />).textContent);

;
<html lang="en" className="no-transitions can-hover no-wco-animation" data:view="files" data:editorLayout="aside">
	<head>
		{/* <meta charset="UTF-8" /> */}
		{/* <meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content, viewport-fit=cover" /> */}
		<meta name="robots" content="all" />
		<meta name="author" content="Benjamin Aster" />
		<meta name="description" content="Pretty Awesome Math Markup – A user-friendly LaTeX alternative with a live editor" />
		<link rel="code-repository" href="https://github.com/BenjaminAster/PAMM" />
		<meta attr:property="og:image" content="https://benjaminaster.com/pamm/assets/screenshot-editor-desktop.png" />
		<meta name="twitter:card" content="summary_large_image" />

		<title>PAMM</title>
		<meta attr:property="og:title" content="PAMM" />

		<base href="./" />
		<link rel="icon" href="./assets/icon.svg" type="image/svg+xml" sizes={["any"] as any} />
		<link rel="icon" href="./assets/icon.png" type="image/png" sizes={["512x512"] as any} />
		<link rel="manifest" href="./app.webmanifest" />
		<link rel="canonical" href="https://benjaminaster.com/pamm/" />

		<link rel="preload" as="fetch" crossOrigin="" href="./assets/introduction.pamm" />
		<link rel="preload" as="font" crossOrigin="" href="./assets/latinmodern-math/normal.otf" />
		<link rel="preload" as="font" crossOrigin="" href="./assets/computer-modern/normal.otf" />
		<link rel="preload" as="font" crossOrigin="" href="./assets/computer-modern/bold.otf" />

		{/* <script type="module">
			if (!CSS.supports("(color: color-mix(in srgb, oklch(1% 1% 1deg), red))") && localStorage.getItem(`${location.pathname}:force`) !== "true") {
				location.assign("/update-your-browser/?source=" + location.pathname);
			}
		</script> */}

		<style id="paper-size-style">
			{`@page { size: A4 portrait; }`}
		</style>
	</head>

	<body>
	</body>

</html>;

// import "./main.tsx";

// // import "./main.js";
// {
// await import("./main.tsx");
// }
