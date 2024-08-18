import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PiTrash, PiUpload } from 'react-icons/pi';
import { Button } from './button.js';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4'];

export function DropzoneFileInput(props: {
  multiple?: boolean;
  contentType: 'image' | 'video' | 'mixed';
  placeholder: string;
  placeholderDragging: string;
  maxSize: number;
  callback: (files: File[]) => void;
  labelHtmlFor: string;
  uploadedFiles?: ({
    name: string;
    key: string;
    size: number;
    type: string;
  } | null)[];
  cdnUrl: string;
  removeFile: (key: string) => void;
}) {
  const accept =
    props.contentType === 'image'
      ? ALLOWED_IMAGE_TYPES.reduce((acc, type) => ({ ...acc, [type]: [] }), {})
      : props.contentType === 'video'
        ? ALLOWED_VIDEO_TYPES.reduce(
            (acc, type) => ({ ...acc, [type]: [] }),
            {},
          )
        : [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].reduce(
            (acc, type) => ({ ...acc, [type]: [] }),
            {},
          );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) =>
        validateFile(file, Object.keys(accept), props.maxSize),
      );
      props.callback(validFiles);
    },
    [accept, props.callback, props.maxSize],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: props.multiple,
    accept,
  });

  return (
    <div className="flex flex-col gap-4 w-full p-3 border border-input rounded-md shadow-sm">
      <div
        {...getRootProps()}
        className="flex items-center justify-center w-full p-3 border border-dashed border-input rounded-md cursor-pointer hover:text-primary transition-colors text-muted-foreground"
      >
        <input
          {...getInputProps({ accept: Object.keys(accept).join(',') })}
          multiple={props.multiple}
          id={props.labelHtmlFor}
        />
        <div className="flex flex-col gap-1 items-center justify-center text-xs">
          <PiUpload className="h-6 w-6" />
          {isDragActive ? (
            <p>{props.placeholderDragging}</p>
          ) : (
            <p>{props.placeholder}</p>
          )}
        </div>
      </div>
      {props.uploadedFiles?.map(
        (file) =>
          file && (
            <div key={file.key} className="flex items-center w-full gap-2">
              <img
                alt={file.name}
                src={`${props.cdnUrl}/${file.key}`}
                className="h-9 w-9 rounded-md border border-input object-cover"
              />
              <div className="flex flex-col">
                <p className="text-sm">{file.name}</p>
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="ml-auto"
                onClick={() => props.removeFile(file.key)}
              >
                <PiTrash className="h-4 w-4" />
              </Button>
            </div>
          ),
      )}
    </div>
  );
}

function validateFile(file: File, allowedTypes: string[], maxSize: number) {
  if (!allowedTypes.includes(file.type)) return false;
  if (file.size > maxSize) return false;

  return true;
}
