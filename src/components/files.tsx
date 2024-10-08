
import { css } from "winzig";

export default () => {
	return <div>
		<nav className="breadcrumb">
			<ul>
				<template>
					<li>
						<a href="" data:id="" className="name"></a>
					</li>
				</template>
			</ul>
		</nav>

		<div className="main-area">
			<h2 className="icon:folder">Folders</h2>

			<ul className="items folders">
				<template>
					<li className="item">
						<a href="" draggable>
							<h3 className="name"></h3>
							<div className="placeholder"></div>
						</a>
						<div className="buttons">
							<button data:action="rename" className="icon:pencil" title="Rename"></button>
							<button data:action="delete" className="icon:trash" title="Delete"></button>
							<a data:action="permalink" className="icon:link" href="" title="Permalink"></a>
						</div>
					</li>
				</template>

				<li>
					<button data:action="new-folder" className="icon:folder-add">
						<h3>New folder</h3>
					</button>
				</li>
			</ul>

			<h2 className="icon:document-text">Files</h2>

			<ul className="items files">
				<template>
					<li className="item">
						<a href="" draggable>
							<h3 className="name"></h3>
							<div className="placeholder"></div>
						</a>
						<div className="buttons">
							<button data:action="rename" className="icon:pencil" title="Rename"></button>
							<button data:action="delete" className="icon:trash" title="Delete"></button>
							<button data:action="export" className="icon:file-export" title="Export"></button>
							<a data:action="permalink" className="icon:link" href="" title="Permalink"></a>
						</div>
					</li>
				</template>

				<li>
					<button data:action="new-browser-file" className="icon:desktop-computer">
						<h3>New file in browser</h3>
					</button>
				</li>

				<li>
					<button data:action="new-disk-file" className="icon:hard-drive">
						<h3>New file on disk</h3>
					</button>
				</li>
			</ul>
		</div>

		<dialog className="recently-opened">
			<form method="dialog">
				<div>
					<button className="close icon:x" title="Close"></button>
					<h2>Recently opened files</h2>
				</div>

				<ul>
					<template>
						<li data:storageType="">
							<a href="" className="name link icon:"></a>
							<div className="buttons">
								<a href="" className="permalink icon:link" title="Permalink"></a>
							</div>
						</li>
					</template>
				</ul>
			</form>
		</dialog>

		{css`
			@layer elements {
				& {
					--padding: .7rem;
					display: flex;
					flex-direction: column;
					flex-grow: 1;
					box-sizing: border-box;
					overflow: hidden;
					margin-block-end: var(--safe-area-block-end);
					margin-inline-start: var(--safe-area-inline-start);
					margin-inline-end: var(--safe-area-inline-end);
				}

				& .breadcrumb {
					padding-block: var(--padding);
					padding-inline: var(--padding);

					& > ul {
						border-radius: .4rem;
						display: flex;
						flex-wrap: wrap;
						inline-size: fit-content;
						box-shadow: 0 1px .3rem 0 var(--item-shadow-color);
						--gap: .4rem;
						--padding-inline: 1rem;
						--anchor-padding-inline: .5rem;
						gap: var(--gap) calc(var(--gap) + 2 * (var(--padding-inline) - var(--anchor-padding-inline)));
						position: relative;
						padding-inline: calc(var(--padding-inline) - var(--anchor-padding-inline));
						contain: paint;
						pointer-events: none;

						&::before {
							content: "";
							position: absolute;
							inset: 0;
							background-color: var(--item-shadow-color);
							opacity: 30%;
							border-radius: inherit;
						}

						&:not(:has(> :not(template)))::after {
							content: " ";
							white-space: pre;
							display: block;
							padding: .5rem .8rem;
						}

						& > li {
							position: relative;
							border-radius: inherit;

							& > a {
								display: block;
								padding-block: .5rem;
								padding-inline: var(--anchor-padding-inline);
								border-radius: inherit;
								--background-color: var(--gray-1);
								transition: background-color .2s;
								outline-offset: -2px;
								pointer-events: all;

								:root.can-hover &:hover, &:active {
									--background-color: var(--gray-2);
								}
				
								&::before {
									content: "";
									background-color: var(--background-color);
									position: absolute;
									inset-block: 0;
									inset-inline: calc(-1 * (var(--padding-inline) - var(--anchor-padding-inline)));
									transition: inherit;
									z-index: -1;
									transform: skewX(-15grad);
									--radius: .2rem;
									border-radius: var(--radius);
								}
							}

							&:first-of-type > a::before {
								inset-inline-start: calc(-6 * var(--padding-inline));
							}
			
							&:last-of-type > a::before {
								inset-inline-end: calc(-6 * var(--padding-inline));
							}
						}

					}
				}

				& .main-area {
					contain: layout;
					display: flex;
					flex-direction: column;
					gap: 1rem;
					overflow: auto;
					padding: var(--padding);
					padding-block-start: 0;
					flex-grow: 1;
					isolation: isolate;
					background-blend-mode: color;
					position: relative;

					& > h2 {
						font-weight: 400;
						display: flex;
						gap: .4rem;
						align-items: center;
						padding-inline: .3rem;
						font-size: 1.1rem;
						--icon-size: 1rem;
						--icon-size: 1.5rem;
						margin-block-start: .5rem;
			
						&::before {
							opacity: 80%;
						}
					}
				}

				:root[data-transition=changing-folder] & .main-area {
					view-transition-name: main-content;
				}

				& ul.items {
					display: grid;
					grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
					gap: 1rem;
				}

				& .items > li {
					position: relative;
					--padding: .5rem;
					--buttons-height: 2.25rem;
					min-block-size: 6rem;
					border-radius: .7em;
				}

				@layer {
					& .items > li > :is(a, button) {
						box-sizing: border-box;
						padding: var(--padding);
						background-color: var(--gray-1);
						box-shadow: 0 1px .3rem 0 var(--item-shadow-color);
						border-radius: inherit;
						text-align: center;
						inline-size: 100%;
						block-size: 100%;
						transition: background-color .2s, border-color .2s;
					}
				}

				& .item > a::before {
					content: "";
				}

				& .item > a {
					padding-block-start: 0;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					gap: var(--padding);
					-webkit-user-select: text;
					user-select: text;

					:root.can-hover &:hover, &:active {
						background-color: var(--gray-2);
					}
				}

				& .item > a > h3 {
					font-weight: normal;
				}

				& .items > li > button[data-action] {
					--modified-accent: oklch(calc(var(--accent-lightness) + 20%) calc(var(--accent-chroma) + 25%) calc(var(--accent-hue) - 3deg));
					--mix: 40%;
					background-color: color-mix(in srgb, var(--modified-accent) var(--mix), var(--gray-1));
					display: flex;
					flex-direction: column;
					gap: .4rem;
					align-items: center;
					justify-content: center;
					--icon-size: 1.5rem;
					transition: background-color .2s, border-color .2s;

					:root.can-hover &:hover, &:active {
						--mix: 60%;
					}
				}


				& .items > li > button[data-action] > h3 {
					font-weight: 400;
					font-size: 1.1rem;
				}

				& .item > .buttons {
					display: flex;
					gap: .5rem;
					justify-content: end;
					block-size: var(--buttons-height);
					position: absolute;
					inset-inline-end: 0;
					inset-block-end: 0;
					margin: var(--padding);
					pointer-events: none;
				}

				& .item > a > .placeholder {
					block-size: var(--buttons-height);
				}

				& .item > .buttons > :is(button, a) {
					background-color: var(--gray-2);
					--icon-size: 1.25rem;
					border-radius: .4rem;
					block-size: 100%;
					aspect-ratio: 11 / 10;
					display: grid;
					place-content: center;
					transition: background-color .2s, border-color .2s;
					pointer-events: auto;

					:root.can-hover &:hover, &:active {
						background-color: var(--gray-3);
					}
				}

				& .item:hover > .buttons:not(:hover) > :is(button, a) {
					background-color: var(--gray-3);
				}

				& dialog.recently-opened {
					/* --spring-easing: linear(
						0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017,
						1.077, 1.121, 1.149 24.3%, 1.159, 1.163, 1.161, 1.154 29.9%, 1.129 32.8%,
						1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%, 0.974 53.8%, 0.975 57.1%,
						0.997 69.8%, 1.003 76.9%, 1.004 83.8%, 1); */

					inline-size: min(100% - 6rem, 50rem);
					block-size: calc(100% - 12rem);
					border-radius: .8rem;
					background-color: var(--transparent-gray-2);
					--backdrop-filter: blur(2rem);
					-webkit-backdrop-filter: var(--backdrop-filter);
					backdrop-filter: var(--backdrop-filter);
					box-shadow: 0 0 4rem var(--shadow-color);
					/* inset: 0;
					margin: auto;
					position: fixed; */

					& > form {
						display: flex;
						flex-direction: column;
						gap: .6rem;
						padding: 1rem;
						box-sizing: border-box;
						block-size: 100%;
						
						& > ul {
							overflow: auto;
						}

						& > ul > li {
							transition: border-color .2s;
							position: relative;

							:root.can-hover &:hover, &:active {
								border-block-start-color: transparent;

								& + li {
									border-block-start-color: transparent;
								}

								& > a {
									background-color: var(--transparent-gray-2);
								}
							}
						}

						& > ul > li > a {
							box-sizing: border-box;
							display: flex;
							align-items: center;
							gap: .7rem;
							padding: .5rem .75rem;
							inline-size: 100%;
							outline-offset: -3px;
							border-radius: .5rem;
							transition: background-color .2s;
						}

						& > ul > li[data-storag-type=indexeddb] > a {
							--icon: var(--icon-desktop-computer)
						}

						& > ul > li[data-storag-type=file-system] > a {
							--icon: var(--icon-hard-drive)
						}

						& > ul > li:not(:first-of-type) {
							border-block-start: 1px solid var(--transparent-gray-3);
						}

						& > ul > li > .buttons {
							display: flex;
							gap: .3rem;
							justify-content: end;
							align-items: center;
							position: absolute;
							inset-inline-end: 0;
							inset-block: 0;
							margin: .25rem;

							& > .permalink {
								display: grid;
								place-content: center;
								block-size: 100%;
								aspect-ratio: 1;
								border-radius: .3rem;
								transition: background-color .2s;

								:root.can-hover &:hover, &:active {
									background-color: var(--transparent-gray-3);
								}
							}
						}
					}

					&::backdrop {
						background: none;
					}

					& button.close {
						display: grid;
						place-content: center;
						float: right;
						float: inline-end;
						inline-size: 2rem;
						block-size: 2rem;
						border-radius: .3rem;
						transition: background-color .2s;

						:root.can-hover &:hover, &:active {
							background-color: var(--transparent-gray-2);
						}
					}
				}

				&::-webkit-scrollbar-button:start:decrement {
					--margin-block-start: .2rem;
					block-size: calc(1rem + var(--margin-block-start));
					border-start-start-radius: .5rem calc(.5rem + var(--margin-block-start));
					border-start-end-radius: .5rem calc(.5rem + var(--margin-block-start));
					border-block-start-width: calc(.25rem + var(--margin-block-start));
				}
			}
		`}
	</div>;
};