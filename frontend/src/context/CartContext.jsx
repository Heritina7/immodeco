import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.selectedColor === action.payload.selectedColor
      )
      let newItems
      if (existing) {
        newItems = state.items.map((item) =>
          item.id === action.payload.id &&
          item.selectedColor === action.payload.selectedColor
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        )
      } else {
        newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
      }
      return { ...state, items: newItems }
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(item.id === action.payload.id && item.selectedColor === action.payload.selectedColor)
        ),
      }
    }
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id &&
          item.selectedColor === action.payload.selectedColor
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      }
    }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addToCart = (product, selectedColor, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        selectedColor,
        quantity,
      },
    })
  }

  const removeFromCart = (id, selectedColor) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, selectedColor } })
  }

  const updateQuantity = (id, selectedColor, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, selectedColor, quantity } })
  }

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
