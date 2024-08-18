import { Button } from '../ui/button.js';
import { cn } from '@retailify/ui/lib/utils';
import { IconType } from 'react-icons';
import SpinnerIcon from '../ui/spinner-icon.js';

export default function SubmitButton(props: {
  disabled?: boolean;
  loading?: boolean;
  addMt?: boolean;
  text: string;
  icon: IconType;
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
      {props.loading ? <SpinnerIcon /> : <props.icon className="h-4 w-4" />}
      {props.text}
    </Button>
  );
}
