import React, { createContext, useCallback, useRef } from 'react'

export function createRefContext<Store>(initialValue: Store) {
  function useStoreData(): {
    get: () => Store
    set: (value: Partial<Store>) => void
    subscribe: (cb: () => void) => () => void
  } {
    const store = useRef<Store>(initialValue)
    const subscribers = useRef(new Set<() => void>())

    const subscribe = useCallback((cb: () => void) => {
      subscribers.current.add(cb)
      return () => subscribers.current.delete(cb)
    }, [])

    const get = useCallback(() => store.current, [])

    const set = useCallback((value: Partial<Store>) => {
      store.current = { ...store.current, ...value }
      subscribers.current.forEach((cb) => cb())
    }, [])

    return {
      get,
      set,
      subscribe,
    }
  }

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>

  const StoreContext = createContext<UseStoreDataReturnType>(
    {} as UseStoreDataReturnType
  )

  function Provider({ children }: { children?: React.ReactNode }) {
    return (
      <StoreContext.Provider value={useStoreData()}>
        {children}
      </StoreContext.Provider>
    )
  }

  function useRefContext<T>(
    selector: (store: Store) => T
  ): [T, (value: Partial<Store>) => void] {
    const store = React.useContext(StoreContext)

    const state = React.useSyncExternalStore(store.subscribe, () =>
      selector(store.get())
    )

    return [state, store.set]
  }

  return {
    Provider,
    useRefContext,
  }
}
