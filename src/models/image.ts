import {PercentageRectangle} from "./graphic.ts";

export type Link = {
    targetId: string,
    rectangle: PercentageRectangle,
};
export type Image = {
    id: string,
    title: string,
    src: string,
    links: Array<Link>,
}
export type Images = {
    [key: string]: Image,
}

export type Collection = {
    id: string,
    title: string,
    images: Images,
}
