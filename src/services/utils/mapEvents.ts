import React from 'react'

export const mapEvents = (data:string) => {
 
    const mappedEvents =  data?.substring(data.indexOf("<ul>"), data.indexOf("</ul>") + 5)
    const listItems = mappedEvents
        ?.split("</li>")
        .map(item => item.substring(item.indexOf("<li>") + 4).trim())
        .filter(item => item.length > 0);

    return listItems;

  
}
