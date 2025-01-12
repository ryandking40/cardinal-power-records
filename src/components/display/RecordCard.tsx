import { Record } from '@/hooks/useRecordsData'
import { cn } from '@/lib/utils'

type RecordCardProps = {
  records: Record[]
  className?: string
}

export function RecordCard({ records, className }: RecordCardProps) {
  if (!records || records.length === 0) return null

  const weight = records[0].weight_achieved

  return (
    <div className={cn('flex flex-col space-y-1 rounded-lg bg-white/5 p-4', className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-white">
          {weight} LBS
        </span>
      </div>
      {records.map((record, index) => (
        <div key={record.id} className={cn(index > 0 && 'mt-2 border-t border-white/10 pt-2')}>
          <div className="flex items-baseline justify-between">
            <div className="text-sm text-gray-300">{record.athlete_name}</div>
            <div className="text-sm text-gray-400">{record.year}</div>
          </div>
          <div className="text-xs text-gray-400">{record.school}</div>
        </div>
      ))}
    </div>
  )
} 