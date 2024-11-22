import styled from "styled-components"
import Title from "../Components/Common/Title"
import CartItem from "../Components/cart/CartItem";
import { useCart } from "../hooks/useCart";
import { useState } from "react";

function Cart() {
    const {carts} = useCart();
    const [checkedItems, setCheckedItems] = useState<number[]>([]);

    return(
        <>
            <Title size="large"> 장바구니 </Title>
            <CartStyle>
                <div className="content">
                    {carts.map((item) => (
                        <CartItem key={item.id} cart={item}
                        checkedItems={checkedItems} />
                    ))}
                </div>
                <div className="summary">

                </div>
            </CartStyle>
        </>
    )
}

const CartStyle = styled.div`

`;

export default Cart;