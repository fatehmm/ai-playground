'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ChevronDown, X } from 'lucide-react';
import * as React from 'react';

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  emptyMessage?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select items',
  className,
  emptyMessage = 'No items found',
  icon: Icon,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  function handleToggle(value: string) {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  }

  function handleClearAll(e: React.MouseEvent) {
    e.stopPropagation();
    onChange([]);
  }

  const displayText = React.useMemo(() => {
    if (selected.length === 0) {
      return placeholder;
    }

    const count = selected.length;
    return `${placeholder} (${count})`;
  }, [selected, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <span className='truncate'>{displayText}</span>
          <div className='ml-2 flex items-center gap-1'>
            {selected.length > 0 && (
              <button
                type='button'
                onClick={handleClearAll}
                className='rounded-sm p-0.5 transition-colors hover:bg-accent'
              >
                <X className='h-3.5 w-3.5 opacity-50 hover:opacity-100' />
              </button>
            )}
            <ChevronDown className='h-4 w-4 shrink-0 opacity-50' />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0' align='start'>
        <div className='max-h-80 overflow-y-auto p-1'>
          {options.length === 0 ? (
            <div className='py-6 text-center text-muted-foreground text-sm'>{emptyMessage}</div>
          ) : (
            <div className='space-y-0.5' role='listbox'>
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <div
                    key={option.value}
                    role='option'
                    aria-selected={isSelected}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 transition-colors hover:bg-accent',
                      isSelected && 'bg-accent/50 font-medium'
                    )}
                    onClick={() => handleToggle(option.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggle(option.value);
                      }
                    }}
                    tabIndex={0}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(option.value)}
                      onClick={(e) => e.stopPropagation()}
                      tabIndex={-1}
                    />
                    <span className='flex-1 text-sm'>{option.label}</span>
                    {isSelected && Icon && <Icon className='h-4 w-4 text-primary' />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {selected.length > 0 && (
          <div className='border-t px-2 py-1.5'>
            <Button variant='ghost' size='sm' onClick={handleClearAll} className='w-full'>
              Clear all ({selected.length})
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
