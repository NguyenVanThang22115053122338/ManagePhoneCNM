import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productService from "../../services/ProductService";
import CategoryService from "../../services/CategoryService";
import { brandService } from "../../services/BrandService";
import type { IProduct, ICategory, Brand } from "../../services/Interface";
import SupplierService from "../../services/supplierService";
import type { ISupplier } from "../../services/Interface";
import styles from "./update_delete_product.module.css";

const UpdateDeleteProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = Number(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);

  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    if (isNaN(productId)) return;

    Promise.all([
      SupplierService.getAllSuppliers(),
      productService.getProductById(productId),
      CategoryService.getCategories(),
      brandService.getAll()
    ])
      .then(([s, p, c, b]) => {
        setSuppliers(s);
        setProduct({
          ...p,
          specification: p.specification ?? {
            screen: "",
            os: "",
            cpu: "",
            ram: "",
            storage: "",
            battery: "",
            camera: ""
          }
        });
        setCategories(c);
        setBrands(b);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!product) return;
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]:
        name === "price" || name === "stockQuantity"
          ? Number(value)
          : value
    });
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!product) return;
    setProduct({ ...product, [e.target.name]: Number(e.target.value) });
  };

  const handleSpec = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product) return;
    setProduct({
      ...product,
      specification: {
        ...product.specification,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(files);
    setPreviewImages(files.map(f => URL.createObjectURL(f)));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSaving(true);
    try {
      await productService.updateProduct(productId, product);
      if (newImages.length) {
        await productService.uploadProductImages(productId, newImages);
      }
      navigate("/admin/products");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Xóa sản phẩm này?")) return;
    await productService.deleteProduct(productId);
    navigate("/admin/products");
  };

  if (loading || !product) {
    return <div className={styles.pdEdit__loading}>Đang tải…</div>;
  }

  return (
    <main className={styles.pdEdit__page}>
      <section className={styles.pdEdit__card}>
        <h1 className={styles.pdEdit__title}>Cập nhật sản phẩm</h1>

        <form onSubmit={handleUpdate} className={styles.pdEdit__form}>
          {/* BASIC */}
          <div className={styles.pdEdit__field}>
            <label>Tên sản phẩm</label>
            <input name="name" value={product.name} onChange={handleChange} />
          </div>

          <div className={styles.pdEdit__row}>
            <div className={styles.pdEdit__field}>
              <label>Giá</label>
              <input type="number" name="price" value={product.price} onChange={handleChange} />
            </div>
            <div className={styles.pdEdit__field}>
              <label>Số lượng</label>
              <input type="number" name="stockQuantity" value={product.stockQuantity} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.pdEdit__row}>
            <div className={styles.pdEdit__field}>
              <label>Thương hiệu</label>
              <select name="brandId" value={product.brandId} onChange={handleSelect}>
                {brands.map(b => (
                  <option key={b.brandId} value={b.brandId}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.pdEdit__field}>
              <label>Danh mục</label>
              <select name="categoryId" value={product.categoryId} onChange={handleSelect}>
                {categories.map(c => (
                  <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.pdEdit__field}>
            <label>Nhà cung cấp</label>
            <select name="supplierId" value={product.supplierId} onChange={handleSelect}>
              {suppliers.map(s => (
                <option key={s.supplierId} value={s.supplierId}>{s.supplierName}</option>
              ))}
            </select>
          </div>x 
          <div className={styles.pdEdit__field}>
            <label>Mô tả</label>
            <textarea name="description" value={product.description ?? ""} onChange={handleChange} />
          </div>

          {/* SPEC */}
          <h3 className={styles.pdEdit__section}>Thông số kỹ thuật</h3>
          <div className={styles.pdEdit__specGrid}>
            {Object.entries(product.specification).map(([k, v]) => (
              <input key={k} name={k} placeholder={k.toUpperCase()} value={v} onChange={handleSpec} />
            ))}
          </div>

          {/* IMAGES */}
          <label>Ảnh hiện tại</label>
          <div className={styles.pdEdit__imageList}>
            {product.productImages?.map(img => (
              <img key={img.id} src={img.url} alt="" />
            ))}
          </div>

          <label>Upload ảnh mới</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />

          <div className={styles.pdEdit__imageList}>
            {previewImages.map((src, i) => (
              <img key={i} src={src} alt="" />
            ))}
          </div>

          {/* ACTION */}
          <div className={styles.pdEdit__actions}>
            <button className={styles.pdEdit__submit} disabled={saving}>
              {saving ? "Đang lưu…" : "Cập nhật"}
            </button>
            <button
              type="button"
              className={styles.pdEdit__delete}
              onClick={handleDelete}
            >
              Xóa sản phẩm
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default UpdateDeleteProduct;
