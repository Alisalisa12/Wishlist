import { useState, useEffect } from 'react';

export interface Wishlist {
    id: number;
    title: string;
    date: string;
}

const MOCK_WISHLISTS: Wishlist[] = [
    { id: 1, title: 'День Рождения', date: '21.01.2026' },
    { id: 2, title: 'Свадьба', date: '26.06.2026' },
];

export const useWishlists = () => {
    const [wishlists, setWishlists] = useState<Wishlist[]>([]);

    useEffect(() => {
        const load = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        setWishlists(MOCK_WISHLISTS);
        };
        load();
    }, []);

    const createWishlist = (wishlist: Wishlist) => {
        setWishlists(prev => [...prev, wishlist]);
    };

    return {
        wishlists,
        createWishlist,
        loading: wishlists.length === 0,
    };
};