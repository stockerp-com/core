import { cn } from '../../lib/utils.js';
import { PiSpinnerGap } from 'react-icons/pi';

export default function SpinnerIcon(props: { className?: string }) {
  return (
    <PiSpinnerGap className={cn('h-4 w-4 animate-spin', props.className)} />
  );
}
