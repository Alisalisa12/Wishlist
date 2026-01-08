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
        // Создаем асинхронную функцию внутри useEffect
        const fetchAll = async () => {
            try {
                const all = await getAllWishlists(); // Добавлен await
                setWishlists(all);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const create = useCallback(async (wishlist: Wishlist) => {
        // Теперь создание тоже асинхронное
        const created = await storageCreateWishlist(wishlist);
        if (created) {
            setWishlists(prev => [...prev, created]);
        }
    }, []);

    return {
        wishlists,
        createWishlist: create,
        loading,
    };
};