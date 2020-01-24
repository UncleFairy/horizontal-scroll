export const dataCreator = n => {
  const array = []
  const makeArray = [
    'VW',
    'Alfa Romeo',
    'Mercedes',
    'Москвич',
    'Lada',
    'Renault',
    'BMW',
    'Hyundai',
    'Seat',
    'Honda',
    'Toyota',
    'Nissan',
  ]

  const modelArray = [
    'Golf',
    'Golf GTI',
    'Sharan',
    'RX-5',
    'Mark II',
    'Cedric',
    'Megan',
    'Civic',
    'E34',
    'E46',
    'W201',
    'S600',
    '2102',
    '2103',
    'Getz',
    'Ibiza',
    'Giulia',
    '2141',
    'Celica',
    'Mondeo',
  ]

  for (let i = 0; i < n; i++) {
    array.push({
      make: makeArray[Math.floor(Math.random() * makeArray.length)],
      model: modelArray[Math.floor(Math.random() * modelArray.length)],
      price: +(35000 * Math.random() * 100).toFixed(0),
    })
  }

  return array
}
