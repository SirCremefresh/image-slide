export function getLocalImages(collectionId = '') {
    return [
        {
            imageId: collectionId + '6b324990-7b9f-4bc3-80bd-ebc9278ef0de',
            title: 'Obwaldner Taal',
            src: '/Basis.jpg',
            links: [
                {
                    imageId: collectionId + '80e7eaea-30bf-41e2-ac2a-a60dd92a11d6',
                    rectangle: {
                        percentageWidth: 9.078014184397164,
                        percentageHeight: 7.0962319151599695,
                        percentageX: 21.134751773049647,
                        percentageY: 19.55577015934331
                    },
                },
            ],
        },
        {
            imageId: collectionId + '80e7eaea-30bf-41e2-ac2a-a60dd92a11d6',
            title: 'Giswilerstock',
            src: '/Bedeutung.jpg',
            links: [],
        },
    ];
}

export const localImageIds: Set<string> = new Set(
    getLocalImages().map(image => image.imageId)
)
