
import { css } from "winzig";

export default () => {
	return <div className="header">
		<header>
			<img src="./assets/icon.svg" className="logo" alt="icon of PAMM" width={1} height={1} />
			<h1 className="title">PAMM</h1>
			<a href="https://github.com/BenjaminAster/PAMM" className="github icon:github" title="View on GitHub"></a>

			<input type="text" className="editor-only" title="File name" spellcheck={false} autocomplete="off" name="file-name" />
			<button data:action="recently-opened" className="files-only icon:clock" title="Recently opened"><span className="text">Recently opened</span></button>

			<button data:action="toggle-editor-layout" className="keep-focus editor-only icon:layout-columns" title="Toggle vertical / horizontal layout"></button>
			<button data:action="toggle-theme" className="keep-focus icon:moon" title="Toggle color theme"></button>

			<button data:action="save" className="keep-focus editor-only icon:save-fill" title="Save"><span className="text">Save<span className="saved-d">d</span></span></button>
			<button data:action="export" className="editor-only icon:file-export" title="Export"><span className="text">Export</span></button>
			<a data:action="my-files" href="?folder=home" className="editor-only icon:view-grid" draggable title="Your files"><span className="text">Files</span></a>

			<button data:action="open" className="files-only icon:folder-open" title="Open"><span className="text">Open</span></button>
			<button data:action="upload" className="files-only icon:upload" title="Upload"><span className="text">Upload</span></button>

			<button data:action="install" className="icon:install-desktop" title="Install app" hidden><span className="text">Install app</span></button>
		</header>

		{css`
			@layer elements {
				& {
					-webkit-app-region: drag;
					app-region: drag;
					--padding: .5rem;
					transition: padding-inline .5s;
					box-sizing: border-box;
					contain: paint;
					padding-inline-start: var(--safe-area-inline-start);
					padding-inline-end: var(--safe-area-inline-end);
					padding-block-start: var(--safe-area-block-start);
					background-color: var(--gray-1);
				}

				& header {
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					gap: .5rem;
					box-sizing: border-box;
					container: header / inline-size;
					padding: var(--padding);
					transition: padding-inline .5s;
				}

				& .title {
					font-size: 1rem;
					margin-inline-start: .3em;

					/* :root:active-view-transition-type(page-navigation) & {
						view-transition-name: pamm-title;
					} */
				}

				@container header (inline-size < 32rem) {
					& img.logo {
						display: none;
					}
				}

				@container header (inline-size < 43rem) {
					:root[data-view=editor] & :is(button, a)[data-action] .text {
						display: none;
					}
				}

				@container header (inline-size < 55rem) {
					& .title {
						display: none;
					}
				}

				@container header (inline-size < 38rem) {
					:root[data-view=files] & :is(button, a)[data-action] .text {
						display: none;
					}
				}

				@container header (inline-size < 47rem) {
					& a.github {
						display: none;
					}
				}

				:root[data-view=files] & .editor-only {
					display: none;
				}

				:root[data-view=editor] & .files-only {
					display: none;
				}

				@media (display-mode: standalone), (display-mode: window-controls-overlay) {
					& header {
						padding-block-start: 0;
					}
				}

				@media (display-mode: window-controls-overlay) {
					& {
						min-block-size: var(--titlebar-area-block-size);
						padding-block-start: calc(var(--titlebar-area-block-start) + var(--padding));
						padding-inline-start: var(--titlebar-area-inline-start);
						padding-inline-end: var(--titlebar-area-inline-end);
					}

					:root:not(.no-wco-animation) & {
						animation: collapse .5s;
					}

					& header {
						padding-inline-end: max(var(--padding) - var(--titlebar-area-inline-end), 0px);
					}
				}

				& img.logo {
					--size: 1.5rem;
					inline-size: var(--size);
					block-size: var(--size);
					margin-inline-start: .3rem;

					/* :root:active-view-transition-type(page-navigation) & {
						view-transition-name: pamm-icon;
					} */
				}

				& input[name=file-name] {
					background: none;
					border: 1px solid var(--gray-3);
					border-radius: .4rem;
					padding: .3rem .4rem;
					outline: none;
					-webkit-app-region: no-drag;
					app-region: no-drag;
					flex-grow: 1;
					flex-basis: 0;
					min-inline-size: 1rem;
					max-inline-size: 15rem;

					&:focus-visible {
						background-color: var(--background);
					}
				}

				& input[name=file-name], & [data-action=recently-opened] {
					margin-inline-end: auto;
				}

				:root[data-editor-layout="stacked"] & [data-action=toggle-editor-layout] {
					--icon: var(--icon-layout-rows);
				}

				@layer {
					& :is(button, a)[data-action] {
						padding: .3rem .8em;
						min-block-size: 2.2rem;
						border-radius: .4rem;
						background-color: var(--gray-2);
						display: flex;
						align-items: center;
						gap: .5rem;
						-webkit-app-region: no-drag;
						app-region: no-drag;
						--icon-size: 1.125rem;
						transition: background-color .1s;
						box-sizing: border-box;

						:root.can-hover &:hover, &:active {
							background-color: var(--gray-3);
						}
					}
				}

				:root.light-theme & [data-action=toggle-theme] {
					--icon: var(--icon-sun);
				}

				& button[data-action=print]::after {
					content: "";
					--icon: var(--icon-printer);
				}

				& :is([data-action=my-files], [data-action=recently-opened], [data-action=install]) {
					color-scheme: dark;
					--lightness: var(--accent-lightness);
					background-color: oklch(var(--lightness) var(--accent-chroma) var(--accent-hue));
					color: white;
					box-shadow: 0 1px .3rem #0002;

					:root.can-hover &:hover, &:active {
						--lightness: calc(var(--accent-lightness) + 5%);
					}
				}

				& a[data-action=my-files]:has(~ [data-action=install]:not([hidden])) {
					color-scheme: revert-layer;
					background-color: revert-layer;
					box-shadow: revert-layer;
					color: revert-layer;
				}

				:root.file-dirty & button[data-action=save] {
					--icon: var(--icon-save-outline);

					& .saved-d {
						display: none;
					}
				}

				& a.github {
					-webkit-app-region: no-drag;
					app-region: no-drag;
					--icon-size: 1.5rem;
					margin-inline: .2rem;
				}
			}
		`}
	</div>;
};