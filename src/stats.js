const asd = require('../payloads/stats.json')

const overview = asd.segments.find(s => s.type === 'overview')

console.log(overview)

const statsMapper = ([stat, values]) => {
  const displayStat = []
  displayStat.push(`${values.displayName}: ${values.value}`)
  
  if (values.rank) {
    displayStat.push(`rank #${values.rank}`)
  }
  if (values.percentile) {
    displayStat.push(`(top ${(100 - values.percentile).toFixed(2)}%)`)
  }

  return displayStat.join(' ')
}

const mappedStats = Object.entries(overview.stats).map(statsMapper)
console.log(mappedStats)