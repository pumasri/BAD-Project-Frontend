import { useRef, useState, type DragEvent } from 'react';
import { Upload } from 'lucide-react';

export function FileUpload({
  name,
  accept = 'image/*',
  disabled = false,
  selectedFileName = '',
  onFileSelected,
}: {
  name?: string;
  accept?: string;
  disabled?: boolean;
  selectedFileName?: string;
  onFileSelected: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragActive(false);
    if (disabled) return;

    const file = event.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    if (inputRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      inputRef.current.files = transfer.files;
    }
    onFileSelected(file);
  }

  return (
    <label
      className={`file-upload-zone${dragActive ? ' is-dragging' : ''}${disabled ? ' is-disabled' : ''}`}
      onDragEnter={(event) => { event.preventDefault(); if (!disabled) setDragActive(true); }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        disabled={disabled}
        onChange={(event) => onFileSelected(event.target.files?.[0] || null)}
      />
      <Upload size={34} strokeWidth={1.8} aria-hidden="true" />
      <span className="file-upload-browse">Browse</span>
      <strong>{selectedFileName || 'Drop an image here'}</strong>
      <small><b>*</b> Supported: PNG, JPG and WEBP</small>
    </label>
  );
}
