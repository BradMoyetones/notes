import { MDXEditor, headingsPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin } from '@mdxeditor/editor';

const initialValue = {
    root: {
        children: [
            {
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Hello World 🚀',
                        type: 'text',
                        version: 1,
                    },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
            },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
    },
} as unknown as SerializedEditorState;
import { useMarkdownEditor } from '@/hooks/useMarkdownEditor';
import { SerializedEditorState } from 'lexical';
import { useState } from 'react';
import { Editor } from './blocks/editor-x/editor';

export const MarkdownEditor = () => {
    const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue);

    return <Editor editorSerializedState={editorState} onSerializedChange={(value) => setEditorState(value)} />;
};
