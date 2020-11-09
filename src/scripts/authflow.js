export const stsResultToAccessData = (stsData) => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(stsData, 'text/xml')

  return {
    accessKey: xmlDoc.getElementsByTagName('AccessKeyId')[0].childNodes[0].nodeValue,
    secretAccessKey: xmlDoc.getElementsByTagName('SecretAccessKey')[0].childNodes[0].nodeValue,
    sessionToken: xmlDoc.getElementsByTagName('SessionToken')[0].childNodes[0].nodeValue,
    expiration: new Date(Date.parse(xmlDoc.getElementsByTagName('Expiration')[0].childNodes[0].nodeValue))
  }
}

export const storeData = (accessData) => {
  sessionStorage.setItem('expiration', accessData.expiration)
  sessionStorage.setItem('accessKey', accessData.accessKey)
  sessionStorage.setItem('secretAccessKey', accessData.secretAccessKey)
  sessionStorage.setItem('sessionToken', accessData.sessionToken)
}

export const fetchStsResultData = (idToken) => {
  const arn = 'arn:aws:iam::467672972146:role/auswertung-role'
  const getAWSAccessDataUrl = `https://sts.amazonaws.com/?Action=AssumeRoleWithWebIdentity&DurationSeconds=3600&RoleSessionName=auswertung-session&RoleArn=${arn}&WebIdentityToken=${idToken}&Version=2011-06-15`

  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  }
  return fetch(getAWSAccessDataUrl, requestOptions)
    .then(response => response.text())
}
