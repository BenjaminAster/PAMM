
import { css } from "winzig";

export default () => {
	return <div>
		<div className="text-input">
			<pre className="textarea" contentEditable="true" spellcheck={false} ariaLabel="math formula input"></pre>
		</div>

		<div className="dragger"></div>

		<div id="paper-size-measurement"></div>

		<div className="print-header-placeholder">&nbsp;</div>

		<div id="headers-and-footers">
			<template>
				<div>
					<div className="header">
						<div className="author"></div>
						<div className="title"></div>
						<div className="date"></div>
					</div>
					<div className="footer"></div>
				</div>
			</template>
		</div>

		<section className="html-output" ariaLabel="live preview of mathematical document" tabIndex={0}>
			<div id="content-end-element"></div>
		</section>

		<div className="print-footer-placeholder">&nbsp;</div>

		{css`
			@layer elements {
				& {
					block-size: 100%;
					display: flex;
					box-sizing: border-box;
					/* background-color: var(--gray-1); */
					--dragger-width: 12px;
					--full-length: 100cqi;
					--dragger-cursor: ew-resize;
					container-type: size;

					--page-inline-margin: 5rem;
					--page-top-margin: 7rem;
					--page-bottom-margin: 5rem;
					--page-header-top-offset: 4.5rem;
					--page-footer-bottom-offset: 2.5rem;

					@media (hover: none) {
						--dragger-width: 18px;
					}
				}

				:root[data-editor-layout="stacked"] & {
					flex-direction: column;
					--dragger-cursor: ns-resize;
					--full-length: 100cqb;
				}

				&.dragging {
					cursor: var(--dragger-cursor);
					-webkit-user-select: none;
					user-select: none;
				}

				:root[data-transition="toggling-layout"] & .text-input {
					view-transition-name: text-input;
				}
				
				:root[data-transition="toggling-layout"] & .html-output {
					view-transition-name: html-output;
				}

				& .text-input {
					flex-grow: 0;
					flex-shrink: 0;
					--clamped-split-proportion: clamp(0, var(--split-proportion), 1);
					flex-basis: calc(var(--clamped-split-proportion) * (var(--full-length) - var(--dragger-width)));
					font-size: 1.1rem;
					background-color: var(--background);
					/* overflow: hidden; */
					contain: layout;
					overflow: auto;
					padding-inline-start: var(--safe-area-inline-start);
					box-sizing: border-box;

					:root[data-editor-layout="aside"] & {
						margin-block-end: var(--safe-area-block-end);
					}

					:root[data-editor-layout="stacked"] & {
						padding-inline-end: var(--safe-area-inline-end);
					}
				
					& .textarea {
						--zoom: 1;
						padding: .8rem 1rem;
						resize: none;
						/* inline-size: 100%; */
						/* block-size: 100%; */
						box-sizing: border-box;
						outline: none;
						/* overflow: auto; */
						min-block-size: 100%;
						white-space: pre-wrap;
						margin: 0;
						font-family: ui-monospace, monospace;
						font-size: calc(.95rem * var(--zoom));
					}

					& ::highlight(heading) {
						color: var(--highlight-heading);
					}

					& ::highlight(code) {
						/* color: var(--highlight-code-color); */
						background-color: var(--highlight-code-background);
						font-style: italic;
					}

					& ::highlight(math) {
						color: var(--highlight-math);
					}
				}

				& .dragger {
					flex-shrink: 0;
					flex-basis: var(--dragger-width);
					cursor: var(--dragger-cursor);
					display: flex;
					gap: 2px;
					align-items: center;
					justify-content: center;
					transition: background-color .2s;
					background-color: var(--gray-1);
				}

				:root[data-editor-layout="stacked"] & .dragger {
					flex-direction: column;
				}

				& .dragger {
					touch-action: none;
					--grabbers-length: 18px;

					:root.can-hover &:hover, &:active {
						background-color: var(--gray-2);
					}

					&:active {
						--grabbers-length: 12px;
					}

					&::before, &::after {
						content: "";
						--width: 2px;
						--length: var(--grabbers-length);
						inline-size: var(--width);
						block-size: var(--length);
						transition: inline-size, block-size;
						transition-duration: .15s;
						border-radius: 1px;
						background-color: var(--color);
						opacity: 50%;
					}
				}

				:root[data-editor-layout="stacked"] & .dragger {
					&::before, &::after {
						inline-size: var(--length);
						block-size: var(--width);
					}
				}

				:root[data-editor-layout="aside"] & .dragger {
					/* border-start-start-radius: .15rem; */
					/* border-start-end-radius: .15rem; */
				}

				& .html-output {
					flex-grow: 1;
					flex-shrink: 1;
					flex-basis: 0;
					font-family: var(--document-font);
					line-height: 1.4;
					--zoom: 1;
					font-size: 1rem;
					box-sizing: border-box;
					margin-block-end: var(--safe-area-block-end);
					margin-inline-end: var(--safe-area-inline-end);

					:root[data-editor-layout="stacked"] & {
						margin-inline-start: var(--safe-area-inline-start);
					}
				
					@media not print {
						:root:not(.print-simulation) & {
							font-size: calc(1rem * var(--zoom));
							contain: layout;
							overflow: auto;
							background-color: var(--background);
							padding: 1rem;
							padding-block-start: 2rem;

							& .section {
								content-visibility: auto;
								contain-intrinsic-block-size: auto 10em;
							}
						}
					}
			
					& code {
						white-space: pre-wrap;
						font-family: "FreeMono", "Courier New", ui-monospace, monospace;
						padding-inline: .2em;
						background-color: var(--gray-1);
						font-size: .75em;
					}

					& h1 {
						margin-block-start: 0;
						text-align: center;
					}
				}

				:root[data-engine=blink] & .html-output :is(msqrt > *, mroot > :first-child) {
					padding-block-start: calc(3 * 1em / 16);
					padding-inline: calc(2 * 1em / 16);
				}

				& math[display=block] {
					/* margin-block: .5em; */
					padding-block: .5em;
					overflow-y: auto;
				}

				:is(h1, h2, h3, h4, h5, h6) {
					margin-block: .8em .5em;
				}

				& p.bottom-margin {
					margin-block-end: .7em;
				}

				:is(p, h1, h2, h3, h4, h5, h6) {
					white-space: pre-wrap;
				}

				@media not print {
					& .print-header-placeholder, & .print-footer-placeholder, & #headers-and-footers {
						display: none;
					}
				}

				/* :root[data-state=estimating-page-count] & .html-output { */
				:root.print-simulation & {
					& .html-output {
						position: absolute;
						inline-size: var(--page-width);
						block-size: var(--page-height);
						column-width: var(--page-width);
						column-fill: auto;
						column-count: auto;
						padding: 0;
						padding-block-start: var(--page-top-margin);
						padding-block-end: var(--page-bottom-margin);

						& > .section {
							margin-inline: var(--page-inline-margin);
						}
					}
				}

				& #paper-size-measurement {
					position: absolute;
					inline-size: var(--page-width);
					block-size: var(--page-height);

					:root:not(.print-simulation) & {
						display: none;
					}
				}

				@media print {
					& {
						box-sizing: border-box;
						display: table;
						container-type: normal;
						background: none;
					}

					& .dragger, & .text-input {
						display: none;
					}

					& .print-header-placeholder, & .print-footer-placeholder {
						break-inside: avoid-page;
						box-sizing: border-box;
						/* background-color: #00f3; */
					}

					& .print-header-placeholder {
						/* outline: 1px solid blue;
						outline-offset: -2px; */
						display: table-header-group;
						block-size: var(--page-top-margin);
					}

					& .print-footer-placeholder {
						/* outline: 1px solid cyan;
						outline-offset: -2px; */
						display: table-footer-group;
						block-size: var(--page-bottom-margin);
					}

					& .html-output {
						display: table-row-group;
						/* outline: 1px solid lime;
						outline-offset: -6px; */

						& > .section {
							margin-inline: var(--page-inline-margin);
						}

						/* & > * {
							outline: 1px dotted fuchsia;
							outline-offest: 0px;
						} */

						& code {
							background: none;
							padding-inline: .1em;
						}
					}

					& #headers-and-footers {
						pointer-events: none;
						z-index: -1;
						position: absolute;
						inset-block-start: 0;
						inset-inline: 0;
						box-sizing: border-box;
						font-family: var(--document-font);

						& > div {
							/* outline: 1px solid red;
							outline-offset: -4px; */

							box-sizing: border-box;
							block-size: calc(var(--page-height) - var(--page-footer-bottom-offset));
							/* display: flex; */
							/* flex-direction: column; */
							/* justify-content: space-between; */
							break-after: page;
							break-inside: avoid-page;
							/* padding-block-start: var(--page-top-margin); */
							/* padding-inline: var(--page-inline-margin); */
							position: relative;

							& > * {
								pointer-events: all;
								position: absolute;
								inset-inline: 0;
							}

							& > .footer {
								text-align: center;
								inset-block-end: 0;
							}

							& > .header {
								text-align: start;
								inset-block-start: var(--page-header-top-offset);
								margin-inline: var(--page-inline-margin);
								display: flex;
								/* justify-content: space-between; */
								& > * {
									flex-basis: 0;
									flex-grow: 1;
									flex-shrink: 1;

									&:nth-child(2) {
										flex-shrink: 0;
										text-align: center;
									}

									&:nth-child(3) {
										text-align: end;
									}
								}
								border-block-end: 1px solid #555;
								/* font-style: italic; */
							}
						}
					}
				}
			}
		`}
	</div>;
};