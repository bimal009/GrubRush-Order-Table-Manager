import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type OrderItem = {
  menuItem: string
  name: string
  price: number
  quantity: number
  estimatedServeTime?: number
}

type State = {
  orders: OrderItem[]
}

type Actions = {
  addItem: (item: OrderItem) => void
  removeItem: (menuItem: string) => void
  clearOrder: () => void
}

export const useOrderStore = create<State & Actions>()(
  immer((set) => ({
    orders: [],
    addItem: (item) =>
      set((state) => {
        console.log("Adding item to store:", item);
        const existingItem = state.orders.find((i) => i.menuItem === item.menuItem)
        if (existingItem) {
          existingItem.quantity += item.quantity
          console.log("Updated existing item:", existingItem);
        } else {
          state.orders.push(item)
          console.log("Added new item to store. Current orders:", state.orders);
        }
      }),
    removeItem: (menuItem) =>
      set((state) => {
        state.orders = state.orders.filter((item) => item.menuItem !== menuItem)
      }),
    clearOrder: () =>
      set((state) => {
        state.orders = []
      })
  }))
)


