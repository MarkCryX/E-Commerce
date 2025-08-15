import { CartContext } from "@/context/CartContext";
import { useContext } from "react";

export const useCart = () => useContext(CartContext);