const { tracker: { token }} = require('../config.json');
const axios = require('axios');

console.log('token', token)

const statsClient = axios.create({
  headers: {
    get: {
      'TRN-Api-Key': token
    }
  }
})

const asd = async () => {
  const { data } = await statsClient.get('https://public-api.tracker.gg/v2/apex/standard/profile/origin/constfusion')
  console.log(JSON.stringify(data))
}

asd().catch(console.log)