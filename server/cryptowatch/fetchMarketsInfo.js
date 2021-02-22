const https = require('https')

async function fetchMarketsInfo() {
  return new Promise(function (resolve, reject) {
    https.get('https://api.cryptowat.ch/markets', (res) => {
      const {
        statusCode
      } = res;
      const contentType = res.headers['content-type'];

      let error;
      // Any 2xx status code signals a successful response but
      // here we're only checking for 200.
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
          `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
          `Expected application/json but received ${contentType}`);
      }

      if (error) {
        console.error(error.message);
        // Consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          console.log(parsedData);
          resolve(parsedData);
        } catch (e) {
          console.error(e.message);
          reject(e)
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
      reject(e)
    });
  })
}

module.exports = fetchMarketsInfo