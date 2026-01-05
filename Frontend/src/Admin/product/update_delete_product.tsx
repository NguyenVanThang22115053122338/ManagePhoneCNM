import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./update_delete_product.module.css";
import productService from "../../services/ProductService";
import type { ProductImage } from "../../services/Interface";

interface ProductForm {
  name: string;
  price: string;
  stockQuantity: string;
  description: string;
  images: File[];
}

const UpdateDeleteProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = Number(id);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [form, setForm] = useState<ProductForm>({
    name: "",
    price: "",
    stockQuantity: "",
    description: "",
    images: [],
  });

  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // ================= LOAD PRODUCT =================
  useEffect(() => {
    if (isNaN(productId)) return;

    const loadProduct = async () => {
      try {
        const product = await productService.getProductById(productId);

        setForm({
          name: product.name,
          price: String(product.price),
          stockQuantity: String(product.stockQuantity),
          description: product.description || "",
          images: [],
        });

        setExistingImages(product.productImages || []);
      } catch (err) {
        console.error("Load product failed", err);
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
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ================= HANDLE IMAGE =================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm(prev => ({ ...prev, images: files }));
    setPreviewImages(files.map(file => URL.createObjectURL(file)));
  };

  // ================= UPDATE =================
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await productService.updateProduct(productId, {
        name: form.name,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        description: form.description,
        brandId: 1,
        categoryId: 1,
        specification: null
        // ❌ KHÔNG gửi productImages
      });

      if (form.images.length > 0) {
        await productService.uploadProductImages(productId, form.images);
      }

      alert("✅ Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Update failed", err);
      alert("Cập nhật thất bại");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className={styles.loading}>Đang tải dữ liệu...</p>;

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
        <h1>Cập nhật sản phẩm</h1>
      </div>

      <form onSubmit={handleUpdate} className={styles.form}>
        <div className={styles.group}>
          <label>Tên sản phẩm</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label>Giá</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required />
          </div>

          <div className={styles.group}>
            <label>Số lượng</label>
            <input type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} required />
          </div>
        </div>

        <div className={styles.group}>
          <label>Mô tả</label>
          <textarea name="description" rows={4} value={form.description} onChange={handleChange} />
        </div>

        <div className={styles.group}>
          <label>Ảnh hiện tại</label>
          <div className={styles.imageList}>
            {existingImages.map(img => (
              <img key={img.id} src={img.url} alt="" />
            ))}
          </div>
        </div>

        <div className={styles.group}>
          <label>Upload ảnh mới</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          <div className={styles.imageList}>
            {previewImages.map((src, idx) => (
              <img key={idx} src={src} alt="" />
            ))}
          </div>
        </div>

        <button type="submit" className={styles.updateBtn} disabled={updating}>
          {updating ? "Đang cập nhật..." : "Cập nhật"}
        </button>
      </form>
    </main>
  );
};

export default UpdateDeleteProduct;
