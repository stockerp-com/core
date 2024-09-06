import * as React from 'react';

import { cn } from '../../lib/utils.js';
import { Button } from './button.js';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './command.js';
import { Popover, PopoverContent, PopoverTrigger } from './popover.js';
import {
  PiCheck,
  PiListMagnifyingGlass,
  PiPlus,
  PiWarning,
} from 'react-icons/pi';
import { Skeleton } from './skeleton.js';
import { useDebounceValue } from './use-debounce.js';
import { IconType } from 'react-icons';

export function Combobox(props: {
  data?: ({ label: string; value: string } | undefined)[] | null;
  isDataLoading: boolean;
  dataErrorMessage?: string;
  onSearch?: (search: string) => void;
  value?: string | null;
  label?: string | null;
  isLabelLoading?: boolean;
  labelErrorMessage?: string;
  onChange: (value: string | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyPlaceholder?: string;
  addButtonText?: string;
  addButtonOnClick?: () => void;
}) {
  const [isOpened, setIsOpened] = React.useState(false);
  const { value: searchValue, handleValueChange } = useDebounceValue(
    props.onSearch || (() => {}),
  );

  let Label = null;
  if (props.labelErrorMessage) {
    Label = <span className="text-destructive">{props.labelErrorMessage}</span>;
  } else if (props.label) {
    Label = <span>{props.label}</span>;
  } else if (props.placeholder) {
    Label = <span className="text-muted-foreground">{props.placeholder}</span>;
  }

  return (
    <Popover open={isOpened} onOpenChange={setIsOpened}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpened}
          className="flex w-full items-center gap-2 justify-between"
        >
          {props.isLabelLoading ? <Skeleton className="h-4 w-36" /> : Label}
          <PiListMagnifyingGlass className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={props.searchPlaceholder || 'Search...'}
            value={searchValue}
            onValueChange={handleValueChange}
          />
          <CommandList>
            <div className="max-h-40 md:max-h-56 lg:max-h-72 overflow-auto">
              <CommandGroup>
                {props.isDataLoading ? (
                  <div className="flex flex-col p-1 gap-1">
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : props.dataErrorMessage ? (
                  <div className="flex flex-col gap-1 h-24 items-center justify-center text-destructive">
                    <PiWarning className="h-6 w-6 shrink-0" />
                    <p className="text-center text-sm">
                      {props.dataErrorMessage}
                    </p>
                  </div>
                ) : !props.data || props.data.length === 0 ? (
                  <div className="flex flex-col gap-1 p-1 h-24 items-center justify-center text-center">
                    <p>{props.emptyPlaceholder}</p>
                  </div>
                ) : (
                  props.data.map((item) => {
                    if (!item) {
                      return null;
                    }

                    const isSelected = item.value === props.value;

                    return (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={(currentValue) => {
                          props.onChange(
                            currentValue === props.value ? null : currentValue,
                          );
                          setIsOpened(false);
                        }}
                      >
                        {item.label}
                        <PiCheck
                          className={cn(
                            'ml-auto h-4 w-4',
                            isSelected ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    );
                  })
                )}
              </CommandGroup>
            </div>
            <CommandGroup className="border-t p-1">
              <Button
                className="w-full rounded-md"
                size="sm"
                variant="ghost"
                onClick={props.addButtonOnClick}
              >
                <PiPlus className="h-4 w-4 mr-2" />
                {props.addButtonText}
              </Button>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
