import {Images} from "./models/image.ts";

export const images: Images = {
    Basis: {
        id: 'Basis',
        title: 'Basis',
        src: './Basis.jpg',
        links: [
            {
                targetId: 'Bedeutung',
                rectangle: {
                    percentageWidth: 9.078014184397164,
                    percentageHeight: 7.0962319151599695,
                    percentageX: 21.134751773049647,
                    percentageY: 19.55577015934331
                },
            },
        ],
    },
    Bedeutung: {
        id: 'Bedeutung',
        title: 'Bedeutung',
        src: './Bedeutung.jpg',
        links: [],
    },
};
