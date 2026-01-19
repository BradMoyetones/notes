import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'
import { Button } from '../ui/button'

export type ActionButtonProps = ComponentProps<'button'>

export const ActionButton = ({ className, children, ...props }: ActionButtonProps) => {
  return (
    <Button
      variant={"outline"}
      size={"icon-sm"}
      className={cn(className)}
      {...props}
    >
      {children}
    </Button>
  )
}
