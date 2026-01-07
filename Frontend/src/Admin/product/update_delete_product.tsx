import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productService from "../../services/ProductService";
import type { IProduct } from "../../services/Interface";
import styles from "./update_delete_product.module.css";

const UpdateDeleteProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = Number(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [product, setProduct] = useState<IProduct | null>(null);

  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // ================= LOAD PRODUCT =================
  useEffect(() => {
    if (isNaN(productId)) return;

    const loadProduct = async () => {
      try {
        const data = await productService.getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error(err);
        alert("Không tải được sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // ================= HANDLE CHANGE =================
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

  // ================= IMAGE UPLOAD =================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(files);
    setPreviewImages(files.map(file => URL.createObjectURL(file)));
  };

  // ================= UPDATE =================
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSaving(true);
    try {
      await productService.updateProduct(productId, product);

      if (newImages.length > 0) {
        await productService.uploadProductImages(productId, newImages);
      }

      alert("✅ Cập nhật sản phẩm thành công");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!window.confirm("Xóa sản phẩm này vĩnh viễn?")) return;

    try {
      await productService.deleteProduct(productId);
      alert("Đã xóa sản phẩm");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

  if (loading || !product) {
    return <p className={styles.loading}>Đang tải dữ liệu…</p>;
  }

  return (
    <main className={styles.main}>
      <h1>Cập nhật sản phẩm</h1>

      <form onSubmit={handleUpdate} className={styles.form}>
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

        <label>Mô tả</label>
        <textarea
          name="description"
          value={product.description || ""}
          onChange={handleChange}
        />

        {/* Ảnh hiện tại – chỉ hiển thị */}
        <label>Ảnh hiện tại</label>
        <div className={styles.imageList}>
          {product.productImages?.map(img => (
            <img key={img.id} src={img.url} alt="" />
          ))}
        </div>

        {/* Ảnh mới */}
        <label>Upload ảnh mới</label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />

        <div className={styles.imageList}>
          {previewImages.map((src, i) => (
            <img key={i} src={src} alt="" />
          ))}
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Đang cập nhật…" : "Cập nhật"}
        </button>

        <button
          type="button"
          className={styles.deleteBtn}
          onClick={handleDelete}
        >
          Xóa sản phẩm
        </button>
      </form>
    </main>
  );
};

export default UpdateDeleteProduct;