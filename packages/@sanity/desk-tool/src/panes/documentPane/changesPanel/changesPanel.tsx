/* eslint-disable max-depth */
import React, {useCallback} from 'react'
import {
  ObjectDiff,
  ObjectSchemaType,
  DocumentChangeContext,
  DiffAnnotationTooltipContent,
  ChangeList,
  Chunk,
  DocumentChangeContextProps
} from '@sanity/field/diff'
import CloseIcon from 'part:@sanity/base/close-icon'
import {UserAvatar} from '@sanity/base/components'
import {Tooltip} from 'part:@sanity/components/tooltip'
import Button from 'part:@sanity/components/buttons/default'
import {AvatarStack} from 'part:@sanity/components/avatar'
import {useTimeAgo} from '@sanity/base/hooks'
import {formatTimelineEventLabel} from '../timeline'
import {useDocumentHistory} from '../documentHistory'
import {Reporter} from '@sanity/base/lib/change-indicators'
import * as PathUtils from '@sanity/util/paths'

import styles from './changesPanel.css'
import {collectLatestAuthorAnnotations} from './helpers'

const ChangeFieldWrapper = (props: {change: any; children: React.ReactNode}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const scrollTo = React.useCallback(() => {
    if (ref.current) {
      //@ts-ignore
      ref.current.scrollIntoView({scrollMode: 'if-needed', block: 'center', behavior: 'smooth'})
    }
  }, [])
  return (
    <Reporter id={`change-${PathUtils.toString(props.change.path)}`} data={{scrollTo}}>
      <div ref={ref}>{props.children}</div>
    </Reporter>
  )
}

interface ChangesPanelProps {
  changesSinceSelectRef: React.MutableRefObject<HTMLDivElement | null>
  documentId: string
  isTimelineOpen: boolean
  loading: boolean
  onTimelineOpen: () => void
  schemaType: ObjectSchemaType
  since: Chunk | null
  onScrollTopChange: (number) => void
  timelineMode: 'rev' | 'since' | 'closed'
}

export function ChangesPanel({
  changesSinceSelectRef,
  documentId,
  isTimelineOpen,
  loading,
  onTimelineOpen,
  since,
  onScrollTopChange,
  schemaType,
  timelineMode
}: ChangesPanelProps): React.ReactElement | null {
  const {close: closeHistory, historyController} = useDocumentHistory()
  const diff: ObjectDiff | null = historyController.currentObjectDiff() as any

  const documentContext: DocumentChangeContextProps = React.useMemo(
    () => ({
      documentId,
      schemaType,
      FieldWrapper: ChangeFieldWrapper
    }),
    [documentId, schemaType]
  )

  const changeAnnotations = React.useMemo(
    () => (diff ? collectLatestAuthorAnnotations(diff) : []),
    [diff]
  )

  const handleScroll = useCallback(
    (event: React.UIEvent) => {
      onScrollTopChange(event.currentTarget.scrollTop)
    },
    [onScrollTopChange]
  )

  // This is needed to stop the ClickOutside-handler (in the Popover) to treat the click
  // as an outside-click.
  const ignoreClickOutside = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation()
  }, [])

  const menuOpen = isTimelineOpen && timelineMode === 'since'

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.mainNav}>
          <h2 className={styles.title}>Changes</h2>
          <div className={styles.closeButtonContainer}>
            <Button
              icon={CloseIcon}
              kind="simple"
              onClick={closeHistory}
              padding="small"
              title="Hide changes panel"
              type="button"
            />
          </div>
        </div>
        <div className={styles.versionSelectContainer}>
          <div ref={changesSinceSelectRef} style={{display: 'inline-block'}}>
            <Button
              kind="simple"
              onMouseUp={ignoreClickOutside}
              onClick={onTimelineOpen}
              padding="small"
              selected={isTimelineOpen && timelineMode === 'since'}
              size="small"
            >
              {/* eslint-disable-next-line no-nested-ternary */}
              {menuOpen ? (
                <>Review changes since</>
              ) : since ? (
                <SinceText since={since} />
              ) : (
                <>Since unknown version</>
              )}{' '}
              &darr;
            </Button>
          </div>
          {changeAnnotations.length > 0 && (
            <Tooltip
              content={
                (
                  <DiffAnnotationTooltipContent
                    description="Changes by"
                    annotations={changeAnnotations}
                  />
                ) as any
              }
              placement="top"
            >
              <div className={styles.changeAuthorsContainer}>
                <AvatarStack className={styles.changeAuthorsAvatarStack} maxLength={4}>
                  {changeAnnotations.map(({author}) => (
                    <UserAvatar key={author} userId={author} />
                  ))}
                </AvatarStack>
              </div>
            </Tooltip>
          )}
        </div>
      </header>

      <Reporter id="changesPanel" component="div" className={styles.body} onScroll={handleScroll}>
        {loading || !diff ? (
          <div>Loading…</div>
        ) : (
          <DocumentChangeContext.Provider value={documentContext}>
            <div className={styles.changeList}>
              <ChangeList diff={diff} schemaType={schemaType} />
              <div style={{height: 2000}} />
            </div>
          </DocumentChangeContext.Provider>
        )}
      </Reporter>
    </div>
  )
}

function SinceText({since}: {since: Chunk}): React.ReactElement {
  const timeAgo = useTimeAgo(since.endTimestamp)

  return (
    <>
      Since {formatTimelineEventLabel(since.type)} {timeAgo}
    </>
  )
}
