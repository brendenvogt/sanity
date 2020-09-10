import React from 'react'
import {FieldContext} from './FieldContext'
import {Reporter} from './elementTracker'
import isEqual from 'react-fast-compare'

const isPrimitive = value =>
  typeof value === 'string' ||
  typeof value === 'boolean' ||
  typeof value === 'undefined' ||
  typeof value === 'number'

const isPrimitiveEqual = (value, otherValue) =>
  isPrimitive(value) && isPrimitive(otherValue) && value === otherValue

// todo: lazy compare debounced

function ChangeBar(props: {children?: React.ReactNode}) {
  return (
    <div
      style={{
        position: 'relative'
      }}
    >
      {props.children}
      <div
        style={{
          position: 'absolute',
          right: -4,
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: '#2276FC'
        }}
      />
    </div>
  )
}
interface Props {
  compareDeep: boolean
  children?: React.ReactNode
}

export function ChangeIndicator(props: Props) {
  const context = React.useContext(FieldContext)

  const ref = React.useRef<HTMLDivElement>(null)
  const scrollTo = React.useCallback(() => {
    // @ts-ignore
    ref.current.scrollIntoView({scrollMode: 'if-needed', block: 'center', behavior: 'smooth'})
  }, [])

  const {value, compareValue} = context

  const isChanged =
    (isPrimitive(value) && isPrimitive(compareValue) && value !== compareValue) ||
    (props.compareDeep && !isEqual(value, compareValue))
  // todo: need to know whether to show in overlay or not
  // return <ChangeBar>{props.children}</ChangeBar>

  return (
    <div ref={ref}>
      {isChanged && context.hasFocus ? (
        <Reporter
          id={`changed-field`}
          component="div"
          data={{path: context.path, children: props.children, scrollTo}}
        />
      ) : (
        props.children || null
      )}
    </div>
  )
}
