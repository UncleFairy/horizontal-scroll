export const dataCreator = n => {
  const array = []

  for (let i = 0; i < n; i++) {
    array.push({
      make: `Toyota${i}`,
      model: `Celica`,
      price: 35000 * Math.random() * 100,
    })
  }

  return array
}
