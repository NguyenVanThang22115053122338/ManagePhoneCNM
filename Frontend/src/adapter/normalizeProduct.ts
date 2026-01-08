import type { IProduct } from "../services/Interface";

export const normalizeProduct = (raw: any): IProduct => ({
    productId: Number(
        raw.productId ??
        raw.ProductID ??
        raw.id ??
        0
    ),
    name: String(raw.name ?? "Không tên"),
    price: Number(raw.price ?? 0),
    stockQuantity: Number(
        raw.stockQuantity ??
        raw.Stock_Quantity ??
        raw.stock_quantity ??
        0
    ),
    description: raw.description ?? "",
    brandId: Number(
        raw.brandId ??
        raw.BrandID ??
        0
    ),
    categoryId: Number(
        raw.categoryId ??
        raw.CategoryID ??
        0
    ),
    specification: raw.specification ?? null,
    productImages: Array.isArray(raw.productImages ?? raw.images)
        ? (raw.productImages ?? raw.images).map((img: any) => ({
            id: Number(img.id ?? img.ID ?? 0),
            url: String(img.url ?? ""),
            img_index: Number(img.img_index ?? img.imgIndex ?? 0),
        }))
        : [],
});
