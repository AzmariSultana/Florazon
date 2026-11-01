import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { optionPrice } from "../utils/productOptions";

// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    // 'loading' until the catalogue arrives, then 'ready' or 'error'
    const [productsStatus, setProductsStatus] = useState('loading');
    const [token, setToken] = useState(() => localStorage.getItem('token') || '')
    const navigate = useNavigate();

    const logout = useCallback(() => {
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }, [])

    // Shared handler for failed API calls: an expired/invalid session logs the user out
    const handleApiError = useCallback((error) => {
        console.log(error)
        if (error.response?.status === 401) {
            logout()
            toast.error('Your session has expired. Please log in again.', { toastId: 'session-expired' })
            navigate('/login')
        } else {
            toast.error(error.response?.data?.message || error.message)
        }
    }, [logout, navigate])

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Please choose an option first');
            return;
        }
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
        toast.success('Added to cart');

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

            } catch (error) {
                handleApiError(error)
            }
        }
    }
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    totalCount += cartItems[items][item];
                }
            }
        }

        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
            } catch (error) {
                handleApiError(error)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            const itemInfo = products.find((product) => product._id === items);
            if (!itemInfo) continue;
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    totalAmount += optionPrice(itemInfo, item) * cartItems[items][item];
                }
            }
        }
        return totalAmount;
    }

    useEffect(() => {
        const getProductsData = async () => {
            if (!backendUrl) {
                console.error('VITE_BACKEND_URL is not set, so products cannot be loaded.')
                setProductsStatus('error')
                return
            }
            try {
                const response = await axios.get(backendUrl + '/api/product/list')
                if (response.data.success) {
                    setProducts(response.data.products)
                    setProductsStatus('ready')
                } else {
                    setProductsStatus('error')
                    toast.error(response.data.message)
                }
            } catch (error) {
                console.log(error)
                // Pages show an inline message with a retry button for this state
                setProductsStatus('error')
            }
        }
        getProductsData()
    }, [backendUrl])

    // Latest cart, readable from the session effect below without re-running it on every cart change
    const cartRef = useRef(cartItems)
    useEffect(() => {
        cartRef.current = cartItems
    }, [cartItems])

    // navigate (and so handleApiError) changes on every route change; keep it out of the effect deps
    const handleApiErrorRef = useRef(handleApiError)
    useEffect(() => {
        handleApiErrorRef.current = handleApiError
    }, [handleApiError])

    // Load the saved cart whenever a user session starts, merging in anything added as a guest
    useEffect(() => {
        if (!token) return;
        const getUserCart = async () => {
            try {
                const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
                if (!response.data.success) return;

                const merged = structuredClone(response.data.cartData || {})
                const guestUpdates = []
                for (const itemId in cartRef.current) {
                    for (const size in cartRef.current[itemId]) {
                        const guestQty = cartRef.current[itemId][size]
                        if (guestQty > 0) {
                            merged[itemId] = merged[itemId] || {}
                            merged[itemId][size] = (merged[itemId][size] || 0) + guestQty
                            guestUpdates.push({ itemId, size, quantity: merged[itemId][size] })
                        }
                    }
                }
                setCartItems(merged)

                await Promise.all(guestUpdates.map((update) =>
                    axios.post(backendUrl + '/api/cart/update', update, { headers: { token } })
                ))
            } catch (error) {
                handleApiErrorRef.current(error)
            }
        }
        getUserCart()
    }, [token, backendUrl])

    const value = {
        products, productsStatus, search, setSearch, showSearch, setShowSearch, cartItems, addToCart, setCartItems, getCartCount, updateQuantity, getCartAmount, navigate, backendUrl, setToken, token, logout, handleApiError
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;
