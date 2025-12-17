import * as React from "react";
import { cn } from "@/lib/utils";
import { useAmountInput } from "@/hooks/useAmountInput";

export interface AmountInputProps extends Omit<React.ComponentProps<"input">, 'onChange' | 'value'> {
  value: number | string;
  onChange: (value: number) => void;
  defaultValue?: number;
  step?: number;
}

const AmountInput = React.forwardRef<HTMLInputElement, AmountInputProps>(
  ({ className, value, onChange, defaultValue = 0, step = 0.01, ...props }, ref) => {
    const { displayValue, handleFocus, handleBlur, handleChange } = useAmountInput({
      value,
      onChange,
      defaultValue
    });

    return (
      <input
        type="number"
        step={step}
        min="0"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="0,00"
        ref={ref}
        {...props}
      />
    );
  }
);

AmountInput.displayName = "AmountInput";

export { AmountInput };
