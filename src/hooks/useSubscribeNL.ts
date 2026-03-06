import createNewSub from '@/services/newsletter/createNewSub'
import { Newsub } from '@/services/newsletter/d.newsub.types'
import { useMutation } from '@tanstack/react-query'

export const useSubscribeNL = () => {

    const { mutate: saveNewSub, isPending, isSuccess, isError } = useMutation({
        mutationFn: (newSub: Newsub) => createNewSub(newSub),
        onSuccess: () => alert("Now you've been subscribed!"),
        onError: (error) => console.error('❌ Error al suscribir:', error)
    })

    return {
        saveNewSub,
        isPending,
        isSuccess,
        isError
    }
}
 