'use strict'

// TODO: optimize this. now it is too big
const elementTypes = {
  a: 'Anchor',
  area: 'Area',
  audio: 'Audio',
  br: 'BR',
  base: 'Base',
  body: 'Body',
  button: 'Button',
  canvas: 'Canvas',
  content: 'Content',
  dl: 'DList',
  data: 'Data',
  datalist: 'DataList',
  dialog: 'Dialog',
  div: 'Div',
  embed: 'Embed',
  fieldset: 'FieldSet',
  form: 'Form',
  hr: 'HR',
  head: 'Head',
  h1: 'Heading',
  // same
  h2: 'Heading',
  h3: 'Heading',
  h4: 'Heading',
  h5: 'Heading',
  h6: 'Heading',
  html: 'Html',
  iframe: 'IFrame',
  img: 'Image',
  input: 'Input',
  li: 'LI',
  label: 'Label',
  legend: 'Legend',
  link: 'Link',
  map: 'Map',
  meta: 'Meta',
  meter: 'Meter',
  ins: 'Mod',
  // same
  del: 'Mod',
  ol: 'OList',
  object: 'Object',
  optgroup: 'OptGroup',
  option: 'Option',
  output: 'Output',
  p: 'Paragraph',
  param: 'Param',
  picture: 'Picture',
  pre: 'Pre',
  progress: 'Progress',
  q: 'Quote',
  // same
  blockquote: 'Quote',
  script: 'Script',
  select: 'Select',
  shadow: 'Shadow',
  source: 'Source',
  span: 'Span',
  style: 'Style',
  caption: 'TableCaption',
  col: 'TableCol',
  colgroup: 'TableCol',
  td: 'TableDataCell',
  table: 'Table',
  th: 'TableHeaderCell',
  tr: 'TableRow',
  tfoot: 'TableSection',
  // same
  thead: 'TableSection',
  tbody: 'TableSection',
  template: 'Template',
  textarea: 'TextArea',
  time: 'Time',
  title: 'Title',
  track: 'Track',
  ul: 'UList',
  video: 'Video'
}

export default function (kind) {
  return Object.create(window['HTML' + elementTypes[kind] + 'Element'].prototype)
}

