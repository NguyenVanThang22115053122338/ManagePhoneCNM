import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryService from "../../services/CategoryService";
import { brandService } from "../../services/BrandService";
import productService from "../../services/ProductService";
import type { ICategory, IProduct } from "../../services/Interface";
import type { Brand } from "../../services/Interface";
import styles from "./add_product.module.css";

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [product, setProduct] = useState<IProduct>({
    name: "",
    price: 0,
    stockQuantity: 0,
    description: "",
    brandId: 0,
    categoryId: 0,
    specification: null
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // ================= LOAD CATEGORY + BRAND =================
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [categoryData, brandData] = await Promise.all([
          CategoryService.getCategories(),
          brandService.getAll()
        ]);

        setCategories(categoryData);
        setBrands(brandData);
      } catch (err) {
        console.error(err);
        alert("Không thể tải danh mục hoặc thương hiệu");
      }
    };

    loadMeta();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]:
        name === "price" || name === "stockQuantity"
          ? Number(value)
          : value
    }));
  };

  // ================= HANDLE SELECT =================
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  // ================= IMAGE =================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setPreviewImages(files.map(file => URL.createObjectURL(file)));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product.brandId || !product.categoryId) {
      alert("Vui lòng chọn thương hiệu và danh mục");
      return;
    }

    setSaving(true);
    try {
      const created = await productService.createProduct(product);

      if (images.length > 0 && created.productId) {
        await productService.uploadProductImages(
          created.productId,
          images
        );
      }

      alert("✅ Thêm sản phẩm thành công");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Thêm sản phẩm thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={styles.main}>
      <h1>Thêm sản phẩm</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Tên sản phẩm</label>
        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          required
        />

        <div className={styles.row}>
          <div>
            <label>Giá</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Số lượng</label>
            <input
              type="number"
              name="stockQuantity"
              value={product.stockQuantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label>Thương hiệu</label>
        <select
          name="brandId"
          value={product.brandId}
          onChange={handleSelectChange}
          required
        >
          <option value={0}>-- Chọn thương hiệu --</option>
          {brands.map(b => (
            <option key={b.brandId} value={b.brandId}>
              {b.name}
            </option>
          ))}
        </select>

        <label>Danh mục</label>
        <select
          name="categoryId"
          value={product.categoryId}
          onChange={handleSelectChange}
          required
        >
          <option value={0}>-- Chọn danh mục --</option>
          {categories.map(c => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>

        <label>Mô tả</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
        />

        <label>Ảnh sản phẩm</label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />

        <div className={styles.imageList}>
          {previewImages.map((src, i) => (
            <img key={i} src={src} alt="" />
          ))}
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Đang lưu..." : "Thêm sản phẩm"}
        </button>
      </form>
    </main>
  );
};

export default AddProduct;