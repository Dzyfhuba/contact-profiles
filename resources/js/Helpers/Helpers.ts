const slugify = (raw: string) => {
  return raw.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
}

const getFirstPath = () => {
  const url = window.location.pathname
  const urlArray = url.split('/')
  // console.log(urlArray[1])
  return urlArray[1]
}

const getFullPath = () => {
  return window.location.pathname
}

// remove last path and second last path if same
const removeLastPathAndSecondLastPathIfSame = (path: string = '') => {
  const url = window.location.pathname
  const urlArray = url.split('/')
  if (urlArray.slice(-1)[0] === urlArray.slice(-2)[0]) {
    urlArray.pop()
  }
  console.log(urlArray)
  return window.location.origin + urlArray.join('/') + path
}

const getURLWithoutQuery = (path: string = '') => {
  return window.location.origin + window.location.pathname + path
}

function removeObjectEmptyValues(obj: { [key: string]: string | number | boolean }) {
  const newObj: { [key: string]: string | number | boolean } = {}
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

const getURLWithQuery = (path: string = '', query: { [key: string]: string | number | boolean }) => {
  // Convert the query parameters object to a URL-encoded string
  const queryString = Object.keys(query)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&')

  // Check if the path already contains a query string
  const separator = path.includes('?') ? '&' : '?'
  console.log(queryString)

  // Combine the path and the query string to form the final URL
  const urlWithquery = `${getFullPath()}${path}${separator}${queryString}`

  return urlWithquery
}

const getURLWithoutQueryAndLastPath = (path: string = '') => {
  const url = window.location.pathname
  const urlArray = url.split('/')
  urlArray.pop()
  return window.location.origin + urlArray.join('/') + path
}

const getHost = (path: string = '') => {
  return window.location.host + path
}

const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  // capitalize all words
  return s.replace(/\b\w/g, (l) => l.toUpperCase())
}

// remove duplicates from array by key
const removeDuplicates = <T>(array: T[], key: keyof T) => {
  return array.filter((obj, index, self) =>
    index === self.findIndex((el) => (
      el[key] === obj[key]
    ))
  )
}

// storage path
const assetUrl = (path: string) => {
  return `${import.meta.env.VITE_APP_URL}${path}`
}

function isValidDate(dateString: string) {
  return !isNaN(Date.parse(dateString))
}

// setQueryParams
const setQueryParams = (params: {
  [key: string]: string | number | boolean | null | undefined
}) => {
  const url = new URL(window.location.href)
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.set(key, params[key] as string)
    }
  })

  return url.toString()
}

function findArrayDifferences(arr1: string[], arr2: string[]) {
  const differences = []

  // Check elements in arr1 that are not in arr2
  for (const element of arr1) {
    if (!arr2.includes(element)) {
      differences.push(element)
    }
  }

  // Check elements in arr2 that are not in arr1
  for (const element of arr2) {
    if (!arr1.includes(element)) {
      differences.push(element)
    }
  }

  return differences
}

const getTheme = () => {
  let theme: 'light'|'dark' = 'light'
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme = 'dark'
  }

  return theme
}

const getBgColorByTheme = () => {
  if (getTheme() === 'dark') 
    return `#1d232a`
  else
    return `#FFFFFF`
}

const getTextColorByTheme = () => {
  if (getTheme() === 'dark') 
    return `#ffffff`
  else
    return `#1f2937`
}

export {
  assetUrl, capitalize, getFirstPath,
  getFullPath, getHost, getURLWithoutQuery,
  getURLWithoutQueryAndLastPath, isValidDate, removeDuplicates, slugify,
  removeLastPathAndSecondLastPathIfSame, setQueryParams, findArrayDifferences,
  getURLWithQuery, getTheme, getBgColorByTheme, getTextColorByTheme
}
