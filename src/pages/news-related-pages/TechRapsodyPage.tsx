// import React, { useEffect } from 'react'

// import useSearchStore from '@/features/news/store/useSearchStore'
// import { TopicCard } from '@/features/news/components/TopicCard'

export const TechRapsodyPage = () => {

//  const {rapshody,  SearchRapsodhy } =  useSearchStore()
  
//  useEffect(() => {
//   SearchRapsodhy()
//  }, [])
 
 return (
    <>
    <div className="container-fluid" id="hero">
      <div className="row" >
        <div className="col-12">
          <h1 className='h1 display-1'>Reviews & Releases</h1>
        </div>
        <div className="row g-5 px-5">
        {/* { rapshody && rapshody.map((noticia)=>{
          return(
            <div className="col-12 col-md-6" key={noticia.id}>
            <TopicCard noticia={noticia}/>
            </div>
          )
        })
        
        } */}
        </div>
      </div>
    </div>
    </>
  )
}
