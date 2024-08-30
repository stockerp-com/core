import { Button } from '../ui/button.js';
import { cn } from '@core/ui/lib/utils';
import { IconType } from 'react-icons';
import SpinnerIcon from '../ui/spinner-icon.js';

export default function SubmitButton(props: {
  disabled?: boolean;
  pending?: boolean;
  loading?: boolean;
  addMt?: boolean;
  text: string;
  icon: IconType;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      onClick={props.onClick}
      className={cn(
        'flex items-center justify-center gap-2',
        props.addMt ? 'mt-8' : undefined,
        props.pending ? 'cursor-wait' : undefined,
        props.className,
      )}
      disabled={props.disabled || props.pending || props.loading}
    >
      {props.pending ? <SpinnerIcon /> : <props.icon className="h-4 w-4" />}
      {props.text}
    </Button>
  );
}
