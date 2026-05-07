import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('inline-flex items-center justify-center whitespace-nowrap text-white shadow-md text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]', {
    variants: {
        variant: {
            default: 'bg-[var(--color02)]  hover:bg-[var(--color03)] ',
            blue: `bg-[var(--color05)] hover:bg-[var(--color04)] `,
            close: 'bg-[#ddd] hover:bg-[#eee]/10',
        },
        size: {
            default: 'h-10 px-4 py-2 rounded-lg',
            sm: 'h-8 px-3 text-sm rounded-md',
            lg: 'h-12 px-6 text-base rounded-xl',
            icon: 'h-10 w-10',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});

type ButtonProps = React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
        isLoading?: boolean;
    };

function Button({ className, variant, size, asChild = false, isLoading = false, type = 'button', children, ...props }: ButtonProps) {
    const Comp: React.ElementType = asChild ? Slot : 'button';

    return (
        <Comp type={type} data-slot="button" className={cn(buttonVariants({ variant, size }), className)} disabled={isLoading || props.disabled} {...props}>
            {isLoading ? '로딩중...' : children}
        </Comp>
    );
}

export { Button, buttonVariants };
