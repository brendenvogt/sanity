import React from 'react'
import {Point} from './Connector'
import {lineTo, moveTo} from './svgHelpers'

export function Line({from, to}: {from: Point; to: Point}) {
  return <path d={[moveTo(from.left, from.top), lineTo(to.left, to.top)].join('')} fill="none" />
}
