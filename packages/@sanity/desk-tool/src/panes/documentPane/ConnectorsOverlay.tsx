import React from 'react'
import {Line} from '../../components/changeConnector/Line'
import styles from './ConnectorsOverlay.css'
import {connectorLinePath} from '../../components/changeConnector/svgHelpers'

interface Props {
  children?: React.ReactNode
  trackerRef: React.RefObject<HTMLDivElement>
  regions: any[]
  documentPanelScrollTop: number
  changePanelScrollTop: number
}

const DEBUG = false

export function ConnectorsOverlay(props: Props) {
  const {
    children,
    trackerRef,
    regions,
    documentPanelScrollTop,
    changePanelScrollTop,
    ...rest
  } = props

  const changesPanel = regions.find(region => region.id == 'changesPanel')
  const changedField = regions.find(
    region => region !== changesPanel && region.id.startsWith('changed-field')
  )

  const changedRegion =
    changedField &&
    regions.find(
      region => region !== changesPanel && region.id === `change-${changedField.data.path}`
    )

  // note: this assumes the changes panel header and the document panel always have the same height
  const topEdge = changesPanel?.rect?.top

  return (
    <div ref={trackerRef} {...rest}>
      {children}
      {changesPanel && changedField && changedRegion && (
        <svg
          onClick={() => {
            if (changedField?.data) changedField?.data.scrollTo()
            if (changedRegion?.data) changedRegion?.data.scrollTo()
          }}
          className={styles.svg}
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            ...(DEBUG ? {backgroundColor: 'rgba(0, 100, 100, 0.2)'} : {}),
            top: changesPanel.rect.top,
            left: 0,
            right: 0,
            bottom: 0,
            height: changesPanel.rect.height,
            width: '100%'
          }}
        >
          {[changedField].map(changedField => {
            const changeMarkerLeft = changedRegion?.rect?.left - 10
            const connectorFrom = {
              left: changesPanel.rect.left,
              top: changedField.rect.top - documentPanelScrollTop - topEdge + 8
            }
            const connectorTo = {
              left: changeMarkerLeft,
              top: changedRegion.rect.top - changePanelScrollTop - topEdge + 8
            }
            return (
              <React.Fragment key={`field-${changedField.id}`}>
                {changedRegion && (
                  <g className={styles.connectorLine}>
                    <path d={connectorLinePath(connectorFrom, connectorTo, 10)} fill="none" />
                    <rect
                      x={connectorFrom.left}
                      y={Math.min(connectorTo.top, connectorFrom.top)}
                      width={connectorTo.left - connectorFrom.left}
                      height={Math.abs(connectorTo.top - connectorFrom.top)}
                      fill="none"
                      stroke="none"
                    />
                  </g>
                )}
                {changedRegion && (
                  <g className={styles.connector}>
                    <Line
                      from={{
                        left: changeMarkerLeft,
                        top: Math.max(changedRegion.rect.top - changePanelScrollTop) - topEdge
                      }}
                      to={{
                        left: changeMarkerLeft,
                        top:
                          changedRegion.rect.top +
                          changedRegion.rect.height -
                          changePanelScrollTop -
                          topEdge
                      }}
                    />
                    <Line
                      from={{
                        left: changesPanel.rect.left,
                        top: Math.max(changedField.rect.top - documentPanelScrollTop) - topEdge
                      }}
                      to={{
                        left: changesPanel.rect.left,
                        top:
                          changedField.rect.top +
                          changedField.rect.height -
                          documentPanelScrollTop -
                          topEdge
                      }}
                    />
                  </g>
                )}
              </React.Fragment>
            )
          })}
        </svg>
      )}
    </div>
  )
}
