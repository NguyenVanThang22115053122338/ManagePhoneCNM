import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryService from "../../services/CategoryService";
import { brandService } from "../../services/BrandService";
import productService from "../../services/ProductService";
import type { ICategory, IProduct, Brand } from "../../services/Interface";
import styles from "./add_product.module.css";
import SupplierService from "../../services/supplierService";
import type { ISupplier } from "../../services/Interface";
import { message } from "antd";


const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);

  const [product, setProduct] = useState<IProduct>({
    name: "",
    price: 0,
    stockQuantity: 0,
    description: "",
    brandId: 0,
    supplierId: 0,
    categoryId: 0,
    specification: {
      screen: "",
      os: "",
      cpu: "",
      ram: "",
      storage: "",
      battery: "",
      camera: ""
    }
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  /* LOAD META */
  useEffect(() => {
    Promise.all([
      CategoryService.getCategories(),
      brandService.getAll(),
      SupplierService.getAllSuppliers()
    ]).then(([c, b, s]) => {
      setCategories(c);
      setBrands(b);
      setSuppliers(s);
    });
  }, []);


  /* INPUT */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct(p => ({
      ...p,
      [name]:
        name === "price" || name === "stockQuantity"
          ? Number(value)
          : value
    }));
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(p => ({ ...p, [name]: Number(value) }));
  };

  const handleSpec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(p => ({
      ...p,
      specification: { ...p.specification, [name]: value }
    }));
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setPreviewImages(files.map(f => URL.createObjectURL(f)));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product.brandId || !product.categoryId || !product.supplierId) {
      message.warning("Vui lòng chọn đầy đủ thương hiệu, danh mục và nhà cung cấp");
      return;
    }

    setSaving(true);

    try {
      const created = await productService.createProduct(product);

      if (!created?.productId) {
        throw new Error("Create product failed");
      }

      // upload ảnh KHÔNG chặn flow chính
      if (images.length > 0) {
        productService
          .uploadProductImages(created.productId, images)
          .catch(err => {
            console.error("Upload image failed", err);
            message.warning("⚠️ Upload ảnh thất bại (sản phẩm vẫn được tạo)");
          });
      }

      message.success("🎉 Thêm sản phẩm thành công!");
      navigate("/admin/products");

    } catch (err) {
      console.error(err);
      message.error("❌ Thêm sản phẩm thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={styles.pAdd__page}>
      <section className={styles.pAdd__card}>
        <h1 className={styles.pAdd__title}>Thêm sản phẩm</h1>

        <form onSubmit={submit} className={styles.pAdd__form}>
          {/* BASIC */}
          <div className={styles.pAdd__field}>
            <label>Tên sản phẩm</label>
            <input name="name" value={product.name} onChange={handleChange} required />
          </div>

          <div className={styles.pAdd__row}>
            <div className={styles.pAdd__field}>
              <label>Giá</label>
              <input type="number" name="price" value={product.price} onChange={handleChange} />
            </div>
            <div className={styles.pAdd__field}>
              <label>Số lượng</label>
              <input type="number" name="stockQuantity" value={product.stockQuantity} onChange={handleChange} />
            </div>
          </div>

          {/* BRAND + CATEGORY */}
          <div className={styles.pAdd__row}>
            <div className={styles.pAdd__field}>
              <label>Thương hiệu</label>
              <select name="brandId" value={product.brandId} onChange={handleSelect}>
                <option value={0}>-- Chọn thương hiệu --</option>
                {brands.map(b => (
                  <option key={b.brandId} value={b.brandId}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.pAdd__field}>
              <label>Danh mục</label>
              <select name="categoryId" value={product.categoryId} onChange={handleSelect}>
                <option value={0}>-- Chọn danh mục --</option>
                {categories.map(c => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SUPPLIER */}
          <div className={styles.pAdd__field}>
            <label>Nhà cung cấp</label>
            <select
              name="supplierId"
              value={product.supplierId}
              onChange={handleSelect}
              required
            >
              <option value={0}>-- Chọn nhà cung cấp --</option>
              {suppliers.map(s => (
                <option key={s.supplierId} value={s.supplierId}>
                  {s.supplierName}
                </option>
              ))}
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className={styles.pAdd__field}>
            <label>Mô tả</label>
            <textarea name="description" value={product.description} onChange={handleChange} />
          </div>

          {/* SPEC */}
          <h3 className={styles.pAdd__section}>Thông số kỹ thuật</h3>
          <div className={styles.pAdd__specGrid}>
            {Object.entries(product.specification).map(([k, v]) => (
              <input
                key={k}
                name={k}
                placeholder={k.toUpperCase()}
                value={v}
                onChange={handleSpec}
              />
            ))}
          </div>

          {/* IMAGES */}
          <div className={styles.pAdd__field}>
            <label>Ảnh sản phẩm</label>
            <input type="file" multiple accept="image/*" onChange={handleImages} />
            <div className={styles.pAdd__imageList}>
              {previewImages.map((src, i) => (
                <img key={i} src={src} alt="" />
              ))}
            </div>
          </div>

          {/* ACTION */}
          <div className={styles.pAdd__actions}>
            <button className={styles.pAdd__submit} disabled={saving}>
              {saving ? "Đang lưu..." : "Thêm sản phẩm"}
            </button>
            <button
              type="button"
              className={styles.pAdd__cancel}
              onClick={() => navigate(-1)}
            >
              Hủy
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AddProduct;
