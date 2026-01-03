import { useState, useEffect, useCallback } from 'react';
import {
    getAllWishlists,
    createWishlist as storageCreateWishlist,
    Wishlist,
} from '../services/wishlistStorage';

export const useWishlists = () => {
    const [wishlists, setWishlists] = useState<Wishlist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const all = getAllWishlists();
            setWishlists(all);
        } finally {
            setLoading(false);
        }
    }, []);

    const create = useCallback((wishlist: Wishlist) => {
        // Синхронизируем с localStorage через сервис и обновляем локальный стейт
        storageCreateWishlist(wishlist);
        setWishlists(prev => [...prev, wishlist]);
    }, []);

    return {
        wishlists,
        createWishlist: create,
        loading,
    };
};