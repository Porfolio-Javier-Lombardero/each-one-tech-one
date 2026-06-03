import createNewSub from '@/features/newsletter/services/createNewSub'
import { Subscriber } from '@/domain/Subscriber'
import { useMutation } from '@tanstack/react-query'

export const useSubscribeNL = () => {

    const { mutate: saveNewSub, isPending, isSuccess, isError } = useMutation({
        mutationFn: (newSub: Subscriber) => createNewSub(newSub),
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
 