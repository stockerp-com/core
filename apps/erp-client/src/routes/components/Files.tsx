import { Button } from '@core/ui/components/ui/button';
import { Skeleton } from '@core/ui/components/ui/skeleton';
import { cn } from '@core/ui/lib/utils';
import { fileField } from '@core/validation/utils/common';
import { useEffect, useRef, useState } from 'react';
import { PiFile, PiTrash, PiUpload } from 'react-icons/pi';
import { z } from 'zod';

type SingleFile = z.infer<typeof fileField>;

export function SingleFile(props: {
  placeholder: string;
  file: SingleFile | null;
  onChange: (file: File) => void;
  onRemove: () => void;
  isUploading?: boolean;
  getObjectUrl: (props: {
    key: string;
  }) => string | Promise<string | undefined>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        hidden
        type="file"
        ref={inputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            props.onChange(file);
          }
        }}
      />
      <div
        className={cn(
          'flex h-20 rounded-md border border-input transition-all',
          !props.file &&
            'border-dashed border-2 hover:border-primary hover:text-primary group',
        )}
      >
        {props.file ? (
          <div className="flex w-full h-full p-4 items-center gap-4">
            <ImageWithFallback
              url={props.getObjectUrl({ key: props.file.key })}
            />
            <div className="flex flex-col gap-2 text-sm">
              <span>{props.file?.name}</span>
            </div>
            <Button
              onClick={props.onRemove}
              type="button"
              variant="ghost"
              className="ml-auto"
              size="icon"
            >
              <PiTrash className="h-4 w-4" />
            </Button>
          </div>
        ) : props.isUploading ? (
          <div className="flex w-full h-full p-4 items-center gap-4">
            <Skeleton className="h-full aspect-square" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-10 ml-auto" />
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="flex hover:cursor-pointer group-hover:text-primary transition-all w-full h-full items-center justify-center text-center gap-4 text-muted-foreground"
          >
            <PiUpload className="h-4 w-4" />
            <p>{props.placeholder}</p>
          </div>
        )}
      </div>
    </>
  );
}

export function ImageWithFallback(props: {
  url: string | Promise<string | undefined> | undefined;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    console.log('url', props.url);
  }, [props.url]);

  if (error) {
    return (
      <div
        className={cn(
          'h-12 aspect-square flex items-center justify-center rounded-md bg-muted text-muted-foreground',
          props.className,
        )}
      >
        <PiFile className="h-6 w-6" />
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={props.url}
      className={cn(
        'h-12 aspect-square rounded-md bg-muted text-muted-foreground',
        props.className,
      )}
      onError={() => setError(true)}
    />
  );
}
