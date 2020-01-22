export const formatColumns = (columns, pageCount) =>
  Array.from({ length: pageCount }, (_, i) => ({
    headerName: `Group ${i + 1}`,
    children: columns.map(item => ({
      ...item,
      colId: `${item.field}_${i}`,
      field: `${item.field}_${i}`,
    })),
  }))

export const formatData = (rows, rowsPerPage, pageCount) => {
  const formatRowData = Array.from({ length: pageCount }, (_, i) =>
    rows.slice(i * rowsPerPage, i * rowsPerPage + rowsPerPage).map(item => {
      const itemKeys = Object.keys(item)
      const formatItemKeys = Object.assign(
        ...itemKeys.map(field => ({ [field]: `${field}_${i}` })),
      )

      return renameProps(formatItemKeys, item)
    }),
  ).flat()

  return unionGroupData(formatRowData, rowsPerPage)
}

export const dataSort = (rowData, column, cof) => {
  switch (cof) {
    case 'desc':
      return rowData.sort((a, b) => (a[column] > b[column] ? -1 : 1))
    case 'asc':
      return rowData.sort((a, b) => (a[column] > b[column] ? 1 : -1))
    default:
      return 0
  }
}

export const sortModelGenerator = ({ columnToSort, sort }, pageCount) => {
  const array = []

  for (let i = 0; i < pageCount; i++) {
    array.push({ colId: `${columnToSort}_${i}`, sort })
  }

  return array
}

export const filterModelGenerator = (filterModel, pageCount) => {
  let filterState = {}

  filterModel.forEach(filter => {
    for (let i = 0; i < pageCount; i++) {
      filterState = {
        ...filterState,
        [`${filter.columnToFilter}_${i}`]: { ...filter },
      }
    }
  })

  return filterState
}

export const formatSortModel = sortState => {
  const columnToSort = sortState[0].colId.substr(
    0,
    sortState[0].colId.length - 2,
  )
  const { sort } = sortState[0]

  return { columnToSort, sort }
}

export const formatFilterModel = filterState => {
  const filterModel = []
  // @TODO filter one column function
  for (let i in filterState) {
    filterModel.push({
      ...filterState[i],
      columnToFilter: i.substr(0, i.length - 2),
    })
  }

  return filterModel
}

const fromEntries = entries =>
  entries.reduce((o, [key, value]) => ({ ...o, [key]: value }), {})

const renameProps = (replaces, obj) =>
  fromEntries(
    Object.entries(obj).map(([key, value]) => [
      replaces.hasOwnProperty(key) ? replaces[key] : key,
      value,
    ]),
  )

const unionGroupData = (formatRowData, step) => {
  let groupFormatRowData = []

  for (let i = 0; i < step; i++) {
    let group = {}
    let rowChooserCounter = 0

    while (i + step * rowChooserCounter <= formatRowData.length) {
      group = Object.assign(group, formatRowData[i + step * rowChooserCounter])
      rowChooserCounter += 1
    }
    groupFormatRowData = [...groupFormatRowData, group]
  }

  return groupFormatRowData
}
