import { Plugin } from 'obsidian';

const FITB_HEAD = "--"
const FITB_TAIL = "--"

export default class FillInTheBlankPlugin extends Plugin {

	async onload() {

		this.addCommand({
			id: "toggle",
			name: "Toggle",
      icon: "highlight-glyph",
			editorCallback: (editor, context) => {
				let 
					a = editor.getCursor("from"),
					b = editor.getCursor("to"  );
        if(a.line > b.line || (a.line == b.line && a.ch > b.ch)) {
          const c = a
          a = b
          b = c
        }
        const
					c = {...a, ch: Math.max(a.ch - FITB_HEAD.length,                             0)},
					d = {...b, ch: Math.min(b.ch + FITB_TAIL.length, editor.getLine(b.line).length)},
					slim = editor.getRange(a, b),
					wide = editor.getRange(c, d);
				
				if(slim.startsWith(FITB_HEAD) && slim.endsWith(FITB_TAIL)) {
					editor.replaceRange(slim.substring(FITB_HEAD.length, slim.length - FITB_TAIL.length), a, b)
          editor.setSelection(a, {...b, ch: b.ch - FITB_HEAD.length - FITB_TAIL.length})
          return
        }
				if(wide.startsWith(FITB_HEAD) && wide.endsWith(FITB_TAIL)) {
          editor.replaceRange(slim, c, d)
          editor.setSelection(c, {...d, ch: d.ch - FITB_HEAD.length - FITB_TAIL.length})
          return
        }

				editor.replaceRange(`${FITB_HEAD}${slim}${FITB_TAIL}`, a, b)
        editor.setSelection(
          { ...a, ch: a.ch + FITB_HEAD.length },
          { ...b, ch: b.ch + FITB_HEAD.length }
        )
			}
		})

    this.addRibbonIcon("highlight-glyph", "Fill in the Blank", (evt: MouseEvent) => {
      (this.app as any).commands.executeCommandById('fill-in-the-blank:toggle');
    })

		this.registerMarkdownPostProcessor((element, context) => {
			const items = element.querySelectorAll("p, h1, h2, h3, h4, h5, code");
			items.forEach((item: HTMLElement) => {
				while(item.innerText.indexOf(FITB_HEAD) >= 0 && item.innerText.indexOf(FITB_TAIL) >= 0) {
					const 
						a = item.innerText.indexOf(FITB_HEAD       ),
						b = item.innerText.indexOf(FITB_TAIL, a + 1);
					if(b === -1) break;
					const
						fitb = context.frontmatter?.fitb ?? true,
						hide = item.innerText.substring(a, b + FITB_HEAD.length),
						show = hide.substring(2, hide.length - FITB_TAIL.length).split(/\s+/g).map((word) => {
							return fitb ? this.blankify(word) : word
						}).join("  ")

					item.innerText = item.innerText.replace(hide, show)
				}
			})
		})
	}

	blankify(word: string, pattern = "__") {
		return "".padStart(word.length * pattern.length, pattern)
	}

	onunload() {

	}
}
