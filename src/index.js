import loadGoogleApi from 'google-api-load'
import switchableBar from './scripts/bar_sim'
import drawBar from './scripts/bar'
import bubblechart from './scripts/bubble'
import drawPie from './scripts/pie'
import { fetchStsResultData, stsResultToAccessData, storeData } from './scripts/authflow'
import auswertungsfetcher from './scripts/auswertungsfetcher'

import './styles/style.scss'

const loadCharts = () => {
  const fetcher = auswertungsfetcher()

  fetcher.get('lernmethoden_clean').then(data => switchableBar('#lernmethoden', data))
  fetcher.get('hindernisse_clean').then(data => switchableBar('#hindernisse', data))
  fetcher.get('otherskills_clean').then(data => drawBar('#otherskills', data))
  fetcher.get('copdevthemen_clean').then(data => drawBar('#copdev', data))
  fetcher.get('antrieb').then(data => drawBar('#antrieb', data))
  fetcher.get('technology2').then(data => bubblechart('#technologien', data))
  fetcher.get('sprachen').then(data => bubblechart('#sprachen', data))
  fetcher.get('frameworks').then(data => bubblechart('#frameworks', data))
  fetcher.get('domex').then(data => bubblechart('#domex', data))
  fetcher.get('paradigma').then(data => drawPie('#paradigma', data))

  document.querySelector('[data-google-login-button]').className += ' hide'
  document.querySelector('.auswertung-content').className += ' loaded'
}

const authFlow = (user) => {
  const expirationDate = new Date(Date.parse(sessionStorage.getItem('expiration')))
  if (sessionStorage.getItem('expiration') == null || expirationDate < new Date()) {
    const { id_token: idToken } = user.getAuthResponse()
    fetchStsResultData(idToken)
      .then(stsResultToAccessData)
      .then(storeData)
      .then(loadCharts)
      .catch(error => console.error('error', error))
  } else {
    loadCharts()
  }
}

const initGoogleSignIn = () => {
  const auth2 = window.gapi.auth2.init({
    client_id: '695081115381-ujiv8sur9h9fuk94og803j91t2n2mj1t.apps.googleusercontent.com'
  })
  auth2.currentUser.listen(authFlow)
  document.querySelector('[data-google-login-button]').addEventListener('click', auth2.signIn)
}

const createDownloadLink = async () => {
  const url = await auswertungsfetcher().getDownloadUrl()
  const downloadDiv = document.getElementsByClassName('download')[0]
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'copdev.pdf')
  link.innerText = 'Hier klicken zum Herunterladen'
  downloadDiv.appendChild(link)
  downloadDiv.removeChild(document.querySelector('[data-download]'))
}

(() => {
  loadGoogleApi().then((gapi) => {
    gapi.load('auth2', () => initGoogleSignIn())
    document.querySelector('[data-download]').addEventListener('click', () => createDownloadLink())
  })
})()
