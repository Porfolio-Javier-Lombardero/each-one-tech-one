

export const formatDate = (param)=>{
   
const newDate = new Date(param).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })

    return newDate
}

export const today = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;

};

export const yesterday = (params)=>{
  const ayer = new Date(params);
  ayer.setDate(params.getDate() - 1)
  ayer.setHours(0,0,0,0)
  return ayer
}