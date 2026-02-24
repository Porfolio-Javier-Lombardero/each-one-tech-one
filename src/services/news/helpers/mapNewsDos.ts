import { GuardianArticle, GuardianArticleArray } from '@/services/news/interfaces/d.news.types'
import { formatDate } from '@/services/news/helpers/formatDates'

export const mapNewsDos = (newsArrayDos: GuardianArticleArray) => {

  return newsArrayDos.map((item: GuardianArticle) => ({
    id: crypto.randomUUID(),
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
