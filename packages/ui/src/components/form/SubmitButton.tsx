import React from 'react';
import { Button, ButtonProps } from '../ui/button';
import { cn } from '@retailify/ui/lib/utils';
import { Spinner } from 'phosphor-react';

export default function SubmitButton(props: {
  disabled?: boolean;
  loading?: boolean;
  addMt?: boolean;
  text: string;
  icon: React.ElementType;
}) {
  return (
    <Button
      className={cn(
        'flex items-center justify-center gap-2',
        props.addMt ? 'mt-8' : undefined,
        props.loading ? 'cursor-wait' : undefined,
      )}
      disabled={props.disabled || props.loading}
    >
      {props.loading ? (
        <Spinner className="h-4 w-4 animate-spin" />
      ) : (
        <props.icon className="h-4 w-4" />
      )}
      {props.text}
    </Button>
  );
}
