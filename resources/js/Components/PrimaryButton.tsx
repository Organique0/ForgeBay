import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import { Button } from '@/Components/Shadcn/ui/button';

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function PrimaryButton({
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <Button
			variant={'default'}
      {...props}
      className={classNames(
        'cursor-pointer',
        props.className,
      )}
    >
      {children}
    </Button>
  );
}
