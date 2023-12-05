export const getBigIntJson = (_json: any) => {
  const jsonString = JSON.stringify(_json)
  return JSON.parse(jsonString, (key, value) => {
    if (key === 'blockNumber')
      return BigInt(value)
    return value
  })
}