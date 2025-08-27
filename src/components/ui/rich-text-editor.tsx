import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from './button';
import { Bold, Italic, List, Heading1, Heading2, AlignLeft } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setHeading1 = () => {
    editor.chain().focus().clearNodes().setNode('heading', { level: 1 }).run();
  };

  const setHeading2 = () => {
    editor.chain().focus().clearNodes().setNode('heading', { level: 2 }).run();
  };

  const setParagraph = () => {
    editor.chain().focus().clearNodes().setParagraph().run();
  };

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();

  return (
    <div className="border border-gray-300 rounded-md bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-3 flex flex-wrap gap-2 bg-gray-50">
        {/* Format buttons */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
            size="sm"
            onClick={setHeading1}
            className="h-8 px-3"
          >
            <Heading1 className="h-4 w-4 mr-1" />
            Titre
          </Button>
          
          <Button
            type="button"
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
            size="sm"
            onClick={setHeading2}
            className="h-8 px-3"
          >
            <Heading2 className="h-4 w-4 mr-1" />
            Sous-titre
          </Button>
          
          <Button
            type="button"
            variant={editor.isActive('paragraph') ? 'default' : 'outline'}
            size="sm"
            onClick={setParagraph}
            className="h-8 px-3"
          >
            <AlignLeft className="h-4 w-4 mr-1" />
            Texte
          </Button>
        </div>

        <div className="w-px h-8 bg-gray-300" />
        
        {/* Text formatting */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant={editor.isActive('bold') ? 'default' : 'outline'}
            size="sm"
            onClick={toggleBold}
            className="h-8 w-8 p-0 font-bold"
          >
            B
          </Button>
          
          <Button
            type="button"
            variant={editor.isActive('italic') ? 'default' : 'outline'}
            size="sm"
            onClick={toggleItalic}
            className="h-8 w-8 p-0 italic"
          >
            I
          </Button>
          
          <Button
            type="button"
            variant={editor.isActive('bulletList') ? 'default' : 'outline'}
            size="sm"
            onClick={toggleBulletList}
            className="h-8 px-3"
          >
            <List className="h-4 w-4 mr-1" />
            Liste
          </Button>
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} className="rich-text-editor" />
        {placeholder && !editor.getText() && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
