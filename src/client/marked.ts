import { marked } from 'marked'
import markedCodePreview from 'marked-code-preview'
import markedFootnote from 'marked-footnote'
import markedKatex from 'marked-katex-extension'

marked.use(markedCodePreview(), markedFootnote(), markedKatex())
export default marked