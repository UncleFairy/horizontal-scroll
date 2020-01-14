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

export const dataSort = (
  rowData,
  column,
  pageCount,
  rowsPerPage,
  cof,
  setRowData,
) => {
  switch (cof) {
    case 'desc':
      setRowData(rowData.sort((a, b) => (a[column] > b[column] ? -1 : 1)))
      break
    case 'asc':
      setRowData(rowData.sort((a, b) => (a[column] > b[column] ? 1 : -1)))
      break
    default:
      return 0
  }
}

export const sortModelGenerator = (column, sort, pageCount) => {
  const array = []

  for (let i = 0; i < pageCount; i++) {
    array.push({ colId: `${column}_${i}`, sort })
  }

  return array
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
