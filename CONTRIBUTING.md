
## TODO:

 - [x] replace native dialogs with custom ones
 - [ ] prevent folders from being dropped into containing or contained folder
 - [ ] don't re-render all breadcrumb elements every time
 - [ ] make breadcrumb elements draggable
 - [ ] keyboard shortcuts for navigating, rename, delete, permalink, cut, paste
 - [ ] recently opened file system files & ids in history.state
 - [ ] make "My files" an anchor
 - [ ] File name textbox: renaming and showing file name
 - [ ] "Export" menu instead of separate download and print/PDF buttons
 - [ ] export HTML option in export menu
 - [ ] update title for files
 - [ ] choose custom font with Local Font Access API
 - [ ] horizontal/vertical layout switching
 - [ ] refresh all file lists after drag-&-drop & file create/rename/delete (including other tabs)
 - [ ] warn user before closing an unsaved file (beforeunload event)
 - [ ] new display-mode: window-controls-overlay
 - [ ] custom print dialog before native dialog with info & size option
 - [ ] color theme toggler
 - [ ] make header responsive using container queries
 - [ ] implement shared element transitions
 - [ ] renaming files from recently opened (including file system files (with .move()))
 - [ ] open file location for browser files in recently opened
 - [ ] sort files by name / last modified / ...


## VSCode settings:

```jsonc
	// JavaScript:
	"js/ts.implicitProjectConfig.checkJs": true,
	"js/ts.implicitProjectConfig.target": "ESNext",
	"js/ts.implicitProjectConfig.strictNullChecks": false,
	"js/ts.implicitProjectConfig.strictFunctionTypes": false,

	// CSS:
	"css.lint.unknownProperties": "ignore",
	"css.lint.unknownAtRules": "ignore",
	"css.validate": false,
	"html.validate.styles": false,

	// Other:
	"files.eol": "\n",
	"editor.insertSpaces": false,
```

```jsonc
	// Personal recommendations:
	"editor.cursorSmoothCaretAnimation": true,
	"editor.cursorBlinking": "smooth",
	"editor.smoothScrolling": true,
	"editor.renderWhitespace": "all",
	"editor.unicodeHighlight.ambiguousCharacters": false,
```
