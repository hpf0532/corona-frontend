import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Corona Ansible System'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
