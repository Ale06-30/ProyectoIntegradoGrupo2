
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export default function CartProvider({ children }) {

    const [carrito, setCarrito] = useState([]);

    const agregarAlCarrito = (producto) => {
        setCarrito((carritoActual) => {
            const existe = carritoActual.find(
                (item) => item.id === producto.id
            );

            if (existe) {
                return carritoActual.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }

            return [
                ...carritoActual,
                {
                    ...producto,
                    cantidad: 1
                }
            ];
        });
    };

    const aumentarCantidad = (id) => {
        setCarrito((carritoActual) =>
            carritoActual.map((item) =>
                item.id === id
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            )
        );
    };

    const disminuirCantidad = (id) => {
        setCarrito((carritoActual) =>
            carritoActual
                .map((item) =>
                    item.id === id
                        ? { ...item, cantidad: item.cantidad - 1 }
                        : item
                )
                .filter((item) => item.cantidad > 0)
        );
    };

    const eliminarDelCarrito = (id) => {
        setCarrito((carritoActual) =>
            carritoActual.filter((item) => item.id !== id)
        );
    };

    const vaciarCarrito = () => {
        setCarrito([]);
    };

    return (
        <CartContext.Provider
            value={{
                carrito,
                agregarAlCarrito,
                aumentarCantidad,
                disminuirCantidad,
                eliminarDelCarrito,
                vaciarCarrito
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
