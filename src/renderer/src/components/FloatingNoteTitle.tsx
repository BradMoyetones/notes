import { cn } from '@/lib/utils'
import { selectedNoteAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { ComponentProps } from 'react'

export const FloatingNoteTitle = ({ className, ...props }: ComponentProps<'div'>) => {
  const selectedNote = useAtomValue(selectedNoteAtom)

  if (!selectedNote) return null

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <span className="text-muted-foreground">{selectedNote.title}</span>
    </div>
  )
}
