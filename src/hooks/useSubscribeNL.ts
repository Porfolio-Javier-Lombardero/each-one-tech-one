import createNewSub from '@/services/newsletter/createNewSub'
import { Newsub } from '@/services/newsletter/interfaces'
import { useMutation } from '@tanstack/react-query'

export const useSubscribeNL = () => {

    const { mutate: saveNewSub, isPending, isSuccess, isError } = useMutation({
        mutationFn: (newSub: Newsub) => createNewSub(newSub),
        onSuccess: () => alert('Usuario dado de alta correctamente'),
        onError: (error) => console.error('❌ Error al suscribir:', error)
    })

    return {
        saveNewSub,
        isPending,
        isSuccess,
        isError
    }
}
 