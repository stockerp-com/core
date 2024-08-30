import React from 'react';
import { Input, InputProps } from '../ui/input.js';
import { Button } from '../ui/button.js';
import { PiEye, PiEyeSlash } from 'react-icons/pi';
import { cn } from '@core/ui/lib/utils';

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  InputProps & {
    t: (key: string) => string;
  }
>(({ className, type, t, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const disabled =
    props.value === '' || props.value === undefined || props.disabled;

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('hide-password-toggle pr-9', className)}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
      >
        {showPassword && !disabled ? (
          <PiEye className="h-4 w-4" aria-hidden="true" />
        ) : (
          <PiEyeSlash className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">
          {showPassword
            ? t('common:actions.hide_password')
            : t('common:actions.show_password')}
        </span>
      </Button>
      <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
