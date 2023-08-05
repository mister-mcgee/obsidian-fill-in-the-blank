import { Plugin } from 'obsidian';

export default class FillInTheBlankPlugin extends Plugin {

	async onload() {

		this.addCommand({
			id: "fill-in-the-blank",
			name: "Fill in the Blank",
			hotkeys: [{ modifiers: [ "Alt" ], key: "b" }],
			editorCallback: (editor, context) => {
				const 
					a = editor.getCursor("from"),
					b = editor.getCursor("to"  ),
					c = {...a, ch: Math.max(a.ch - 2,                             0)},
					d = {...b, ch: Math.min(b.ch + 2, editor.getLine(b.line).length)},
					slim = editor.getRange(a, b),
					wide = editor.getRange(c, d);
				
				if(slim.startsWith("||") && slim.endsWith("||"))
					return editor.replaceRange(slim.substring(2, slim.length - 2), a, b)
				if(wide.startsWith("||") && wide.endsWith("||"))
					return editor.replaceRange(slim, c, d)
				
				editor.replaceRange(`||${slim}||`, a, b)				
			}
		})

		this.registerMarkdownPostProcessor((element, context) => {
			const items = element.querySelectorAll("p, h1, h2, h3, h4, h5");
			items.forEach((item: HTMLElement) => {
				while(item.innerText.indexOf("||") >= 0) {
					const 
						a = item.innerText.indexOf("||"       ),
						b = item.innerText.indexOf("||", a + 1);
					if(b === -1) break;
					const
						fitb = context.frontmatter?.fitb ?? true,
						hide = item.innerText.substring(a, b + 2),
						show = hide.substring(2, hide.length - 2).split(/\s+/g).map((word) => {
							return fitb ? this.obscure(word) : word
						}).join("   ")

					item.innerText = item.innerText.replace(hide, show)
				}				
			})			
		})
	}

	obscure(word: string, pattern = "__") {
		return "".padStart(word.length * pattern.length, pattern)
	}

	onunload() {

	}
}
