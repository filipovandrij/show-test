// import {getToken} from "../api/getToken";
//
// const sendParseData = async (data: any) => {
//   const token = await getToken();
//   if(token) {
//     await fetch('https://aide.ainsys.com/api/data-parsing/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: data
//     });
//   }
// }
// const textModifier = (text?: string ) => {
//   return text?.replace(/\s+/g, ' ').replace('\n', '').trim();
// }
// const renderButton = () => {
//   const button = document.createElement('button');
//   button.innerText = 'Clear localstorage';
//   button.type = 'button';
//   button.id = 'clearLocalStorageButton';
//   button.style.position = 'sticky';
//   button.style.padding = '8px 12px';
//   button.style.top = '20px';
//   button.style.right = '20px';
//   button.style.left = '100%'
//   button.style.backgroundColor = '#b55dc3';
//   button.style.border = 'none'
//   button.style.color = 'white';
//   button.style.zIndex = '10000';
//   button.style.cursor = 'pointer';
//   button.style.borderRadius = '8px';
//   button.addEventListener('click', ()=>{
//     Object.keys(localStorage).forEach((key) => {
//       if (key.includes('indeed.com')) {
//         localStorage.removeItem(key);
//
//       }
//     });
//     alert('Localstorage for indeed.com has been removed')
//   })
//   return button
// }
// const parseData = () => {
//   const jobTitle = document.querySelector('.jobsearch-JobInfoHeader-title')?.textContent?.replace(" - job post", "");
//   const jobDescription = document.querySelector('.jobsearch-JobComponent-description')?.textContent
//   const location = document.querySelector('[data-testid="job-location"]')?.textContent
//   const subLocation = document.querySelector('[data-testid="inlineHeader-companyLocation"]')?.textContent
//   const companyLink = document.querySelector('[data-testid="inlineHeader-companyName"]')?.querySelector('a')?.getAttribute('href');
//   const companyTitle = document.querySelector('[data-testid="inlineHeader-companyName"]')?.textContent
//   return {id_vacancy: window.location.href, jobTitle, jobDescription, location, subLocation, companyTitle, companyLink}
// }
// export const extractTitle = () => {
//   const existingButton = document.getElementById('clearLocalStorageButton');
//
//   if (!existingButton && window.location.href.includes('indeed.com/jobs?')) {
//     const main = document.getElementById('jobsearch-Main');
//
//     if (main) {
//       const button = renderButton()
//       document.body.insertBefore(button, document.body.firstChild);
//     }
//   }
//   const data = parseData()
//   const jsonData = textModifier(JSON.stringify(data));
//   const currentUrl = window.location.href
//   const isValid = Object.values(data).filter((f)=> f !== undefined)
//                                                                                           .length !== 1
//   if(localStorage.getItem(currentUrl) || !isValid) {
//     return
//   } else {
//     localStorage.setItem(currentUrl, currentUrl)
//     sendParseData(jsonData)
//   }
// };
//
// extractTitle();

import api from '../api'
import { metadataIndeed, parsejob } from '../utils/indeed/indeed'
;(() => {
  chrome.storage.local.get().then(async (storage) => {
    await chrome.storage.local.set({ indeedJobQuickParseInfo: null })
    if (storage?.indeedJobQuickParse === 'auto') {
      const url = window.location.href
      const info = parsejob(metadataIndeed, url)
      await chrome.storage.local.set({ indeedJobQuickParseInfo: JSON.stringify(info, null, 2) })
      const r = await api.savingData(info)

      if (!r.ok) throw Error()
    }
  })
})()
