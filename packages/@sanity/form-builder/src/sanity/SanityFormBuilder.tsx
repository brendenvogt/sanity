import React from 'react'
import {FormFieldPresence} from '@sanity/base/presence'
import {FormBuilderInput} from '../FormBuilderInput'
import {Marker, Type} from '../typedefs'
import {Path} from '../typedefs/path'
import SanityFormBuilderContext from './SanityFormBuilderContext'
import * as gradientPatchAdapter from './utils/gradientPatchAdapter'

type PatchChannel = {
  subscribe: () => () => {}
  receivePatches: (patches: Array<any>) => void
}

type Props = {
  value: any | null
  schema: any
  type: Type
  markers: Array<Marker>
  patchChannel: PatchChannel
  compareValue: any
  onFocus: (arg0: Path) => void
  readOnly: boolean
  onChange: (patches: any[]) => void
  filterField: (field: any) => boolean
  onBlur: () => void
  autoFocus: boolean
  focusPath: Path
  presence: FormFieldPresence[]
}

const EMPTY = []

export default class SanityFormBuilder extends React.Component<Props, {}> {
  static createPatchChannel = SanityFormBuilderContext.createPatchChannel

  _input: FormBuilderInput | null

  setInput = (input: FormBuilderInput | null) => {
    this._input = input
  }

  componentDidMount() {
    const {autoFocus} = this.props
    if (this._input && autoFocus) {
      this._input.focus()
    }
  }

  handleChange = patchEvent => {
    this.props.onChange(gradientPatchAdapter.toGradient(patchEvent.patches))
  }

  render() {
    const {
      value,
      schema,
      patchChannel,
      type,
      readOnly,
      markers,
      onFocus,
      onBlur,
      focusPath,
      filterField,
      compareValue,
      presence
    } = this.props
    return (
      <SanityFormBuilderContext value={value} schema={schema} patchChannel={patchChannel}>
        <FormBuilderInput
          type={type}
          onChange={this.handleChange}
          level={0}
          value={value}
          onFocus={onFocus}
          compareValue={compareValue}
          onBlur={onBlur}
          markers={markers}
          focusPath={focusPath}
          isRoot
          readOnly={readOnly}
          filterField={filterField}
          ref={this.setInput}
          path={EMPTY}
          presence={presence}
        />
      </SanityFormBuilderContext>
    )
  }
}
