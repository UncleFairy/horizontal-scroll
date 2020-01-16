export const formatColumns = (columns, pageCount) =>
  Array.from({ length: pageCount }, (_, i) =>
    columns.map(({ ...rest }) => ({
      ...rest,
      headerName: `Data ${i + 1}`,
      children: [
        ...columns[0].children.map(item => ({
          ...item,
          field: `${item.field}_${i}`,
        })),
      ],
    })),
  ).flat()

export const formatData = (rows, rowsPerPage, pageCount) => {
  const formatData = Array.from({ length: pageCount }, (_, i) =>
    rows.slice(i * rowsPerPage, i * rowsPerPage + rowsPerPage).map(item =>
      renameProps(
        {
          make: `make_${i}`,
          model: `model_${i}`,
          price: `price_${i}`,
        },
        item,
      ),
    ),
  ).flat()

  return unionGroupData(formatData, rowsPerPage)
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

const unionGroupData = (array, step) => {
  const array2 = []
  for (let i = 0; i < step; i++) {
    let x = {}
    let y = 0
    while (i + step * y <= array.length) {
      x = Object.assign(x, array[i + step * y])
      y++
    }
    array2.push(x)
  }

  return array2
}
