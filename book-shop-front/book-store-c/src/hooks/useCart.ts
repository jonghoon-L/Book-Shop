import { useEffect, useState } from "react"
import { Cart } from "../models/cart.model"
import { fetchCart } from "../api/carts.api";

export const useCart = () => {
    const [carts, setCarts] = useState<Cart[]>([]);
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
        fetchCart().then((carts) => {
            setCarts(carts);
            setIsEmpty(carts.length === 0);
        })
    }, [])

    return {carts, isEmpty};
};