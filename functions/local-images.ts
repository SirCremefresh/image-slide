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
                        percentageHeight: 9.4370717321537,
                        percentageWidth: 10.352098437364607,
                        percentageX: 36.60206233211057,
                        percentageY: 39.13609159510799,
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
