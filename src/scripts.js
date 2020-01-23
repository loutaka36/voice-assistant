export const getTime = () => {
  const now = new Date()
  let hour = now.getHours()
  let minutes = now.getMinutes()
  let timeOfDay
  if (hour === 0) {
    hour = 12
    timeOfDay = 'AM'
  } else if (hour < 12) {
    timeOfDay = "AM"
  } else if (hour === 12) {
    timeOfDay = 'PM'
  } else {
    hour -= 12
    timeOfDay = 'PM'
  }

  if (minutes < 10) {
    minutes= '0' + minutes
  }

  return `It's currently ${hour}:${minutes} ${timeOfDay}`
}
