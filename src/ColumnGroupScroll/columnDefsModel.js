export const defaultColDef = {
  filterParams: { newRowsAction: 'keep' },
  comparator: () => {},
  lockPosition: true,
}

export const columnDefsModel = cof => [
  {
    headerName: 'Make',
    field: 'make',
    sortable: true,
    filter: 'ContainFilter',
  },
  {
    headerName: 'Model',
    field: 'model',
    sortable: true,
    filter: 'ContainFilter',
  },
  {
    headerName: 'Country',
    field: 'model',
    cellRenderer: 'flagRenderer',
    colId: 'country',
  },
  {
    headerName: 'Price',
    field: 'price',
    sortable: true,
    filter: 'ContainFilter',
  },
  {
    headerName: 'Time to work',
    field: 'price',
    cellRenderer: cof ? 'workTimeCubRenderer' : 'workTimeSquareRenderer',
    colId: 'timeToWork_0',
  },
]
