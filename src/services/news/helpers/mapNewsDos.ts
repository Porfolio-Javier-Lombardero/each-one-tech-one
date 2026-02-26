import { GuardianArticle, GuardianArticleArray, News, SingleNew } from '@/services/news/interfaces/d.news.types'
import { formatDate } from '@/services/news/helpers/formatDates'

export const mapNewsDos = (newsArrayDos: GuardianArticleArray): News => {

  return newsArrayDos.map((item: GuardianArticle): SingleNew => ({
    id_hash: crypto.randomUUID(),
    titulo: item.webTitle,
    description: item.fields.trailText, // Cambiado de desc a description
    cont: item.fields.bodyText,
    categories: [], // The Guardian no usa categorías numéricas como TechCrunch
    fechaIso: item.webPublicationDate,
    fecha: formatDate(item.webPublicationDate),
    url: item.webUrl,
    img: item.fields.thumbnail

  }))
}
