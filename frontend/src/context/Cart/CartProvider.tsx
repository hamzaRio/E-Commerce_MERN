import { FC, PropsWithChildren, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import { CartItem } from "../../types/CartItem";
import { BASE_URL } from "../../constants/baseUrl";
import { useAuth } from "../Auth/AuthContext";

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchCart = async () => {
      try {
        const response = await fetch(`${BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          setError("Failed to fetch user cart. Please try again.");
          setCartItems([]); // Clear cart if fetch fails
          return;
        }

        const cart = await response.json();

        if (!cart || !cart.items) {
          setError("Cart data is invalid.");
          setCartItems([]);
          return;
        }

        const cartItemsMapped = cart.items.map(
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ({ product, quantity, unitPrice }: { product: any; quantity: number; unitPrice: number }) => ({
            productId: product._id,
            title: product.title,
            image: product.image,
            quantity,
            unitPrice,
          })
        );

        setCartItems(cartItemsMapped);
        setTotalAmount(cart.totalAmount);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("An error occurred while fetching the cart.");
        setCartItems([]);
      }
    };

    fetchCart();
  }, [token]);

  const addItemToCart = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        setError("Failed to add to cart.");
        return;
      }

      const cart = await response.json();

      if (!cart || !cart.items) {
        setError("Failed to parse cart data.");
        return;
      }

      const cartItemsMapped = cart.items.map(
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ product, quantity, unitPrice }: { product: any; quantity: number; unitPrice: number }) => ({
          productId: product._id,
          title: product.title,
          image: product.image,
          quantity,
          unitPrice,
        })
      );

      setCartItems(cartItemsMapped);
      setTotalAmount(cart.totalAmount);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      setError("An error occurred while adding to the cart.");
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, totalAmount, addItemToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
