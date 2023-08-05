# Fill in the Blank (FITB) Plugin for Obsidian

Great for educators and students alike who use [Obsidian.md](https://obsidian.md) to write and print notes. Use `--magic--` to render inline text as blank line(s) instead.

### Usage
Simply wrap text in double dashes (e.g. `Fill in the --Blank--?`). When the text is rendered it will now appear as blank line(s) (e.g. `Fill in the __________?`). The FITB markdown post-processor will transform headings, paragraphs, and even code blocks inline.

To enable or disable FITB while still allowing the post-processor to consume the syntax, add the following snippet to your document's frontmatter.
```yml
---
fitb: false
---
```

To quickly toggle FITB inline using a command (similar to `**Bold**` or `*Italics*`), highlight the target text and select the FITB icon in the ribbon. OR bind the `fill-in-the-blank:toggle` command to a hotkey in `Settings -> Hotkeys`.

### Installation
1. Download and unzip the current release into your vault's `.obsidian/plugins` directory, creating one if it does not exist already.
2. Inside of Obsidian select `Settings -> Community Plugins` and turn off Restricted Mode if you haven't already done so.
3. Enable the `Fill in the Blank (FITB)` plugin.


