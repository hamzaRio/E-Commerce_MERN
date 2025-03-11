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

        // Debug: Log the API response to verify the image field is included
        console.log("Cart API Response:", cart);

        if (!cart || !cart.items) {
          setError("Cart data is invalid.");
          setCartItems([]);
          return;
        }

        const cartItemsMapped = cart.items.map(
        
          ({ product, quantity, unitPrice }: { product: { _id: string; title: string; image?: string }; quantity: number; unitPrice: number }) => ({
            productId: product._id,
            title: product.title,
            // Use the product.image or fallback to a placeholder image if missing
            image: product.image || "https://via.placeholder.com/100",
            quantity,
            unitPrice,
          })
        );

        // Debug: Log the mapped cart items to verify the image field
        console.log("Mapped Cart Items:", cartItemsMapped);

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

        // Debugging the API response
        console.log("Cart after adding item:", cart);

        if (!cart || !cart.items) {
            setError("Failed to parse cart data.");
            return;
        }

        // Ensure we update the UI correctly
        const cartItemsMapped = cart.items.map(
          ({ product, quantity, unitPrice }: { product: { _id: string; title: string; image?: string }; quantity: number; unitPrice: number }) => ({
            productId: product._id,
            title: product.title,
            image: product.image || "https://via.placeholder.com/100",
            quantity,
            unitPrice,
          })
        );

        console.log("Updated Cart Items:", cartItemsMapped);

        setCartItems(cartItemsMapped);
        setTotalAmount(cart.totalAmount);
    } catch (error) {
        console.error("Error adding item to cart:", error);
        setError("An error occurred while adding to the cart.");
    }
};

  
  const updateItemToCart = async (productId: string, quantity: number) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (!response.ok) {
        setError("Failed to update to cart");
      }

      const cart = await response.json();

      if (!cart) {
        setError("Failed to parse cart data");
      }

      const cartItemsMapped = cart.items.map(
        
        ({
          product,
          quantity,
          unitPrice,
        }: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          product: any;
          quantity: number;
          unitPrice: number;
        }) => ({
          productId: product._id,
          title: product.title,
          image: product.image,
          quantity,
          unitPrice,
        })
      );

      setCartItems([...cartItemsMapped]);
      setTotalAmount(cart.totalAmount);
    } catch (error) {
      console.error(error);
    }
  };
  
  const deleteItemInCart = async (productId: string) => {
    try {
        const response = await fetch(`${BASE_URL}/cart/items/${productId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to delete item");
        }

        const updatedCart = await response.json();
        setCartItems(updatedCart.items); // ✅ Update the cart state
    } catch (error) {
        console.error("Error deleting item:", error);
    }
};


// ✅ Ensure deleteItemInCart is included in the provider
return (
    <CartContext.Provider value={{ cartItems, totalAmount, addItemToCart, updateItemToCart, deleteItemInCart }}>
        {children}
    </CartContext.Provider>
);

};

export default CartProvider;