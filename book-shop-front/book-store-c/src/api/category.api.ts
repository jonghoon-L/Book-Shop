import { Category } from "../models/category.model";
import { httpClient } from "./http";

export const fetchCategory = async () => {
    try {
        const response = await httpClient.get('/category');
        const data = response.data.map((item: any) => ({
            id: item.category_id,
            name: item.category_name
        })) as Category[];

        console.log("Fetched categories:", data); // 데이터를 콘솔에 출력
        return data;
    } catch (error) {
        console.error("Error fetching category:", error);
        return [];
    }
};
