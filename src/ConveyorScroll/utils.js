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
    let copy = columns.slice(0)

    formatArray = [
      ...formatArray,
      ...copy.map(item => ({ ...item, field: item.field + i })),
    ]
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
