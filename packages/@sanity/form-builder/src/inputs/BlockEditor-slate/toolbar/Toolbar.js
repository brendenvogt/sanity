import React, {PropTypes} from 'react'
import styles from './styles/Toolbar.css'
import InsertItems, {insertItemShape} from './InsertItems'
import Marks, {mark} from './Marks'
import ListItems, {listItem} from './ListItems'
import BlockStyle, {blockStyleShape} from './BlockStyle'
import Button from 'part:@sanity/components/buttons/default'
import FullscreenIcon from 'part:@sanity/base/fullscreen-icon'
import CloseIcon from 'part:@sanity/base/close-icon'
import LinkButton from './LinkButton'

export default class Toolbar extends React.Component {

  static propTypes = {
    onInsertItem: PropTypes.func,
    onFullscreenEnable: PropTypes.func,
    className: PropTypes.string,
    fullscreen: PropTypes.bool,
    onMarkButtonClick: PropTypes.func,
    onListButtonClick: PropTypes.func,
    onBlockStyleChange: PropTypes.func,
    insertItems: PropTypes.arrayOf(insertItemShape),
    marks: PropTypes.arrayOf(
      mark
    ),
    listItems: PropTypes.arrayOf(
      listItem
    ),
    blockStyles: PropTypes.shape({
      value: PropTypes.arrayOf(blockStyleShape),
      items: PropTypes.arrayOf(blockStyleShape),
      onSelect: PropTypes.func
    }),
    onLinkButtonClick: PropTypes.func,
    activeLink: PropTypes.object,
    showLinkButton: PropTypes.bool
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.marks !== nextProps.marks
      || this.props.blockStyles !== nextProps.blockStyles
      || this.props.fullscreen !== nextProps.fullscreen
      || this.props.activeLink !== nextProps.activeLink
    )
  }

  render() {
    const {
      className,
      fullscreen,
      marks,
      onInsertItem,
      onMarkButtonClick,
      onListButtonClick,
      onBlockStyleChange,
      listItems,
      blockStyles,
      insertItems,
      onLinkButtonClick,
      activeLink,
      showLinkButton
    } = this.props

    return (
      <div className={`${styles.root} ${className}`}>
        <div className={styles.blockFormatContainer}>
          <BlockStyle value={blockStyles.value} items={blockStyles.items} onSelect={onBlockStyleChange} />
        </div>

        <div className={styles.formatButtons}>
          {marks && marks.length > 0 && (
            <div className={styles.textFormatContainer}>
              <Marks marks={marks} onClick={onMarkButtonClick} />
            </div>
          )}

          {listItems && listItems.length > 0 && (
            <div className={styles.listFormatContainer}>
              <ListItems listItems={listItems} onClick={onListButtonClick} />
            </div>
          )}
        </div>

        {
          showLinkButton && (
            <div className={styles.linkContainer}>
              <LinkButton activeLink={activeLink} onClick={onLinkButtonClick} />
            </div>
          )
        }

        <div className={styles.fullscreenButtonContainer}>
          <Button
            kind="simple"
            onClick={this.props.onFullscreenEnable}
            icon={fullscreen ? CloseIcon : FullscreenIcon}
          />
        </div>
        <div className={styles.insertContainer}>
          <InsertItems items={insertItems} onInsertItem={onInsertItem} />
        </div>
      </div>
    )
  }
}
