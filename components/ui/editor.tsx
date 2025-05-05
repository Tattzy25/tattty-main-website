"use client"

import { useEffect, useRef } from "react"

// This is a simple wrapper for TinyMCE
// In a real app, you would use a proper editor like TinyMCE, CKEditor, or Quill
export default function Editor({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize the editor
    if (editorRef.current) {
      editorRef.current.innerHTML = value

      // Make it editable
      editorRef.current.contentEditable = "true"

      // Add event listener for content changes
      const handleInput = () => {
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML)
        }
      }

      editorRef.current.addEventListener("input", handleInput)

      // Clean up
      return () => {
        editorRef.current?.removeEventListener("input", handleInput)
      }
    }
  }, [value, onChange])

  return <div ref={editorRef} className="p-4 min-h-[300px] focus:outline-none prose prose-sm max-w-none" />
}
