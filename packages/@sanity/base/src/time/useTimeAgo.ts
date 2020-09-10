import {useEffect, useReducer} from 'react'
import {
  format,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears
} from 'date-fns'

interface TimeSpec {
  timestamp: string
  refreshInterval: number
}

const FIVE_SECONDS = 1000 * 5
const TWENTY_SECONDS = 1000 * 20
const ONE_MINUTE = 1000 * 60
const ONE_HOUR = ONE_MINUTE * 60

interface TimeAgoOpts {
  minimal?: boolean
}

export function useTimeAgo(time: Date | string, opts: TimeAgoOpts = {}): string {
  const [resolved, setResolved] = useReducer(reduceState, null, () =>
    formatRelativeTime(time, opts)
  )

  useEffect(() => {
    const id: number | undefined = Number.isFinite(resolved.refreshInterval)
      ? window.setInterval(
          () => setResolved(formatRelativeTime(time, opts)),
          resolved.refreshInterval
        )
      : undefined

    return () => clearInterval(id)
  }, [time, resolved.refreshInterval])

  return resolved.timestamp
}

function reduceState(prev: TimeSpec, next: TimeSpec) {
  return prev.timestamp === next.timestamp && prev.refreshInterval === next.refreshInterval
    ? prev
    : next
}

// eslint-disable-next-line complexity
function formatRelativeTime(date: Date | string, opts: TimeAgoOpts = {}): TimeSpec {
  const now = Date.now()

  const diffMonths = differenceInMonths(now, date)
  const diffYears = differenceInYears(now, date)

  if (diffMonths || diffYears) {
    return {
      timestamp: format(date, 'MMM D, YYYY, hh:mm A'),
      refreshInterval: +Infinity
    }
  }

  const relativeSuffix = opts.minimal ? '' : ' ago'

  const diffWeeks = differenceInWeeks(now, date)
  if (diffWeeks) {
    return {timestamp: `${diffWeeks}w${relativeSuffix}`, refreshInterval: ONE_HOUR}
  }

  const diffDays = differenceInDays(now, date)
  if (diffDays) {
    return {
      timestamp: diffDays === 1 ? 'yesterday' : `${diffDays}d${relativeSuffix}`,
      refreshInterval: ONE_HOUR
    }
  }

  const diffHours = differenceInHours(now, date)
  if (diffHours) {
    return {timestamp: `${diffHours}h${relativeSuffix}`, refreshInterval: ONE_MINUTE}
  }

  const diffMins = differenceInMinutes(now, date)
  if (diffMins) {
    return {timestamp: `${diffMins}m${relativeSuffix}`, refreshInterval: TWENTY_SECONDS}
  }

  const diffSeconds = differenceInSeconds(now, date)
  if (diffSeconds > 10) {
    return {timestamp: `${diffSeconds}s${relativeSuffix}`, refreshInterval: FIVE_SECONDS}
  }

  return {timestamp: 'just now', refreshInterval: FIVE_SECONDS}
}
