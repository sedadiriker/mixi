import { useTimescape } from 'timescape/react'

function ClockDate() {
  const { getRootProps, getInputProps } = useTimescape({
    date: new Date(),
    onChangeDate: (nextDate) => {
      console.log('Date changed to', nextDate)
    },
  })

  return (
    <div className=" text-primary_color timescape-root" {...getRootProps()}>
      <input className="timescape-input bg-black" {...getInputProps('days')} />
      <span className="separator">/</span>
      <input className="timescape-input bg-black" {...getInputProps('months')} />
      <span className="separator">/</span>
      <input className="timescape-input bg-black mr-2" {...getInputProps('years')} />
      <span className="separator"> </span>
      <input className="timescape-input bg-black" {...getInputProps('hours')} />
      <span className="separator">:</span>
      <input className="timescape-input bg-black" {...getInputProps('minutes')} />
    </div>
  )
}

export default ClockDate
