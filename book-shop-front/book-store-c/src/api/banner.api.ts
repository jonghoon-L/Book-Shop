import { Banner } from "@/models/banner.model";
import { requestHandler } from "./http";

export const fetchBanners = async () => {
    const response = await requestHandler<Banner[]>('get', '/banners');
    return response.data;
};