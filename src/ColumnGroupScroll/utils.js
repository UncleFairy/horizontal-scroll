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

export const formatColumns = (columns, pageCount) => {
  let formatArray = []

  for (let i = 0; i < pageCount; i++) {
    let copy = { ...columns }
    copy = {
      headerName: `Data ${i + 1}`,
      children: [
        ...columns.children.map(item => ({
          ...item,
          field: item.field + i,
          comparator: () => {},
        })),
      ],
    }
    formatArray = [...formatArray, copy]
  }

  return formatArray
}

export const formatData = (rows, rowsPerPage, pageCount) => {
  let formatData = []

  for (let i = 0; i < pageCount; i++) {
    let group = rows.slice(i * rowsPerPage, i * rowsPerPage + rowsPerPage)
    group = group.map(item =>
      renameProps(
        {
          make: `make${i}`,
          model: `model${i}`,
          price: `price${i}`,
        },
        item,
      ),
    )
    formatData = [...formatData, ...group]
  }

  return unionGroupData(formatData, rowsPerPage)
}

export const dataSort = (
  rowData,
  column,
  pageCount,
  rowsPerPage,
  setRowData,
  cof,
) => {
  switch (cof) {
    case 'desc':
      setRowData(
        formatData(
          rowData.sort((a, b) => (a[column] > b[column] ? -1 : 1)),
          rowsPerPage,
          pageCount,
        ),
      )
      break
    case 'asc':
      setRowData(
        formatData(
          rowData.sort((a, b) => (a[column] > b[column] ? 1 : -1)),
          rowsPerPage,
          pageCount,
        ),
      )
      break
    default:
      return 0
  }
}

export const sortModelGenerator = (column, sort, pageCount) => {
  const array = []

  for (let i = 0; i < pageCount; i++) {
    array.push({ colId: `${column}${i}`, sort })
  }

  return array
}
