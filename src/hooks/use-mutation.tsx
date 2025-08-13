import { useState } from "react"

type UseMutationOptions<TInput, TOutput> = {
  mutationFn: (input: TInput) => Promise<TOutput>
  onSuccess?: (data: TOutput) => void
  onError?: (error: string | null) => void
}

export function useMutation<TInput = void, TOutput = void>(
  options: UseMutationOptions<TInput, TOutput>
) {
  const { mutationFn, onSuccess, onError } = options
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = async (input: TInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await mutationFn(input)
      onSuccess?.(result)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      onError?.(message);
    } finally {
      setIsLoading(false)
    }
  }

  return { mutate, isLoading, error }
}