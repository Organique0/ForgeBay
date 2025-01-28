import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import { Button } from '@/Components/Shadcn/ui/button';

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function SecondaryButton({
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <Button
			variant={'secondary'}
      {...props}
      className={classNames(
        props.className,
      )}
    >
      {children}
    </Button>
  );
}
