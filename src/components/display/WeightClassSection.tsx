import { WeightClass, Record } from '@/hooks/useRecordsData'
import { RecordCard } from './RecordCard'

type WeightClassSectionProps = {
  weightClass: WeightClass
}

function groupRecordsByWeight(records: Record[]): Record[][] {
  // Sort records by weight (descending) and year
  const sortedRecords = [...records].sort((a, b) => {
    if (b.weight_achieved !== a.weight_achieved) {
      return b.weight_achieved - a.weight_achieved
    }
    return b.year - a.year
  })

  // Group records by weight
  const groups: Record[][] = []
  let currentGroup: Record[] = []
  let currentWeight: number | null = null

  sortedRecords.forEach(record => {
    if (currentWeight === null || currentWeight === record.weight_achieved) {
      currentGroup.push(record)
      currentWeight = record.weight_achieved
    } else {
      if (currentGroup.length > 0) {
        groups.push(currentGroup)
      }
      currentGroup = [record]
      currentWeight = record.weight_achieved
    }
  })

  if (currentGroup.length > 0) {
    groups.push(currentGroup)
  }

  return groups
}

export function WeightClassSection({ weightClass }: WeightClassSectionProps) {
  const squatRecords = weightClass.records.filter(r => r.lift_type === 'SQUAT')
  const benchRecords = weightClass.records.filter(r => r.lift_type === 'BENCH')
  const cleanRecords = weightClass.records.filter(r => r.lift_type === 'CLEAN')

  const groupedSquats = groupRecordsByWeight(squatRecords)
  const groupedBenches = groupRecordsByWeight(benchRecords)
  const groupedCleans = groupRecordsByWeight(cleanRecords)

  return (
    <div className="space-y-6">
      <h3 className="text-center font-sports text-4xl text-white">
        {weightClass.weight === 'PWR' ? 'PWR' : `${weightClass.weight} LBS`}
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <h4 className="text-center font-sports text-lg text-gray-400">SQUAT</h4>
          {groupedSquats.length > 0 ? (
            <RecordCard records={groupedSquats[0]} />
          ) : (
            <div className="rounded-lg bg-white/5 p-4 text-sm text-gray-500">
              No record
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h4 className="text-center font-sports text-lg text-gray-400">BENCH</h4>
          {groupedBenches.length > 0 ? (
            <RecordCard records={groupedBenches[0]} />
          ) : (
            <div className="rounded-lg bg-white/5 p-4 text-sm text-gray-500">
              No record
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h4 className="text-center font-sports text-lg text-gray-400">CLEAN</h4>
          {groupedCleans.length > 0 ? (
            <RecordCard records={groupedCleans[0]} />
          ) : (
            <div className="rounded-lg bg-white/5 p-4 text-sm text-gray-500">
              No record
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 