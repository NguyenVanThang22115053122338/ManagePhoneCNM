import type { IProduct } from "../services/Interface";

export const normalizeProduct = (raw: any): IProduct => ({
    productId: Number(raw.productId ?? raw.id ?? 0),
    name: String(raw.name ?? "Không tên"),
    price: Number(raw.price ?? 0),
    stockQuantity: Number(raw.stockQuantity ?? 0),
    description: raw.description ?? "",
    brandId: Number(raw.brandId ?? 0),
    categoryId: Number(raw.categoryId ?? 0),
    specification: raw.specification ?? null,
    productImages: Array.isArray(raw.productImages)
        ? raw.productImages.map((img: any) => ({
            id: Number(img.id ?? 0),
            url: img.url ?? "",
            img_index: Number(img.img_index ?? 0),
        }))
        : [],
});
