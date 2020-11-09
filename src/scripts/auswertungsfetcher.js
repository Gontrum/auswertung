import { AwsClient } from 'aws4fetch'

export default () => {
  const accessKey = sessionStorage.getItem('accessKey')
  const secretAccessKey = sessionStorage.getItem('secretAccessKey')
  const sessionToken = sessionStorage.getItem('sessionToken')
  const aws = new AwsClient({
    accessKeyId: accessKey, secretAccessKey, sessionToken, region: 'eu-central-1', service: 'execute-api'
  })

  return {
    get: fileName => aws.fetch(`https://auswertungapi.gontrum.dev/auswertung/${fileName}`)
      .then(response => response.text())
      .then(result => JSON.parse(result)),

    getDownloadUrl: () => aws.fetch('https://auswertungapi.gontrum.dev/downloadurl')
      .then(response => response.text())
  }
}
