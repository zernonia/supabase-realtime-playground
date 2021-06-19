export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function randomColor() {
  const r = Math.floor(Math.random() * 4)
  switch (r) {
    case 0:
      return "#10B981"
    case 1:
      return "#3B82F6"
    case 2:
      return "#EF4444"
    case 3:
      return "#F59E0B"
    default:
      return "#10B981"
  }
}
