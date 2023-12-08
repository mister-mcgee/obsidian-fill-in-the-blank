import { Plugin } from 'obsidian';

const FITB_START = "--"
const FITB_STOP  = "--"
const FITB_START_SIZE = FITB_START.length
const FITB_STOP_SIZE  = FITB_STOP.length

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
          c = {...a, ch: Math.max(a.ch - FITB_START_SIZE,                            0)},
          d = {...b, ch: Math.min(b.ch + FITB_STOP_SIZE, editor.getLine(b.line).length)},
          slim = editor.getRange(a, b),
          wide = editor.getRange(c, d);
        
        if(slim.startsWith(FITB_START) && slim.endsWith(FITB_STOP)) {
          editor.replaceRange(slim.substring(FITB_START_SIZE, slim.length - FITB_STOP_SIZE), a, b)
          editor.setSelection(a, {...b, ch: b.ch - FITB_START_SIZE - FITB_STOP_SIZE})
          return
        }
        if(wide.startsWith(FITB_START) && wide.endsWith(FITB_STOP)) {
          editor.replaceRange(slim, c, d)
          editor.setSelection(c, {...d, ch: d.ch - FITB_START_SIZE - FITB_STOP_SIZE})
          return
        }

        editor.replaceRange(`${FITB_START}${slim}${FITB_STOP}`, a, b)
        editor.setSelection(
          { ...a, ch: a.ch + FITB_START_SIZE },
          { ...b, ch: b.ch + FITB_START_SIZE }
        )
      }
    })

    this.addRibbonIcon("highlight-glyph", "Fill in the Blank", (evt: MouseEvent) => {
      (this.app as any).commands.executeCommandById('fill-in-the-blank:toggle');
    })

    this.registerMarkdownPostProcessor((element, context) => {
      const items = element.querySelectorAll("p, h1, h2, h3, h4, h5, li, td, th, code");
      items.forEach((item: HTMLElement) => {
        while(item.innerHTML.indexOf(FITB_START) >= 0 && item.innerHTML.indexOf(FITB_STOP) >= 0) {
          const 
            a = item.innerHTML.indexOf(FITB_START       ),
            b = item.innerHTML.indexOf(FITB_STOP , a + 1);
          if(b === -1) break;
          const
            fitb = context.frontmatter?.fitb ?? true,
            hide = item.innerHTML.substring(a, b + FITB_START_SIZE),
            show = hide.substring(FITB_START_SIZE, hide.length - FITB_STOP_SIZE).split(/\s+/g).map((word) => {
              return fitb ? this.blankify(word) : word
            }).join("  ")

          item.innerHTML = item.innerHTML.replace(hide, show)
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
