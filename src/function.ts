export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function randomColor() {
  const r = Math.floor(Math.random() * 5)
  switch (r) {
    case 0:
      return "-green-500"
    case 1:
      return "-blue-500"
    case 2:
      return "-red-500"
    case 3:
      return "-dark-500"
    case 4:
      return "-yellow-500"
    default:
      return "-green-500"
  }
}
