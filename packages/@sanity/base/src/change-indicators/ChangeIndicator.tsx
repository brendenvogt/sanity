import React from 'react'
import {FieldContext} from './FieldContext'
import {Reporter} from './elementTracker'

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
          right: -10,
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: '#2276FC'
        }}
      />
    </div>
  )
}

export function ChangeIndicator(props: {children?: React.ReactNode}) {
  const context = React.useContext(FieldContext)
  const ref = React.useRef<HTMLDivElement>(null)
  const scrollTo = React.useCallback(() => {
    // @ts-ignore
    ref.current.scrollIntoView({scrollMode: 'if-needed', block: 'center', behavior: 'smooth'})
  }, [])

  return (
    <div ref={ref}>
      {context.isChanged && context.hasFocus ? (
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
