import { GuardianArticle, GuardianArticleArray } from '@/lib/types/d.news.types'
import { formatDate } from '@/utils/formatDates'
import React from 'react'

export const mapNewsDos = (newsArrayDos :GuardianArticleArray) => {

  return newsArrayDos.map((item : GuardianArticle)=>({
          id: crypto.randomUUID(),
          titulo: item.webTitle,
          desc: item.fields.trailText,
          cont: item.fields.bodyText,
          fechaIso: item.webPublicationDate,
          tags:item.tags,
          fecha: formatDate(item.webPublicationDate),
          url: item.webUrl,
          img: item.fields.thumbnail
     
    }))
}
