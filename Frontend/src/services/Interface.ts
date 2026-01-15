export interface LoginResponse {
    userId: number;
    sdt: string;
    fullName: string;
    email: string;
    address: string;
    avatar: string | null;
    role: number;
    token: string;
    cartId: number;
}


export interface ResendMailResponse {
    message: string
}

export interface RegisterResponse {
    userId: number;
    is_verified: boolean;
    need_verify: boolean;
    message: string;
}
export interface IRegisterRequest {
    sdt: string;
    hoVaTen: string;
    email: string;
    diaChi: string;
    matKhau: string;
    role?: number;
}
export interface VerifyMailResponse {
    message: string
}

export interface IRole {
    roleId: number;
    roleName: string;
}

export interface ICreateUserRequest {
    sdt: string;
    hoVaTen: string;
    email: string;
    diaChi?: string;
    roleId?: number;
}

export interface ICreateUserResponse {
    user: IUser;
    message: string;
}
export interface IUser {
    userId: number;
    sdt: string;
    fullName?: string;
    email?: string;
    address?: string;
    avatar?: string | null;
    role?: number;
    googleId?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateUserResponse {
    user: IUser;
    message: string;
}
export interface DeleteUserResponse {
    success: boolean;
    message: string;
}
export interface ICategory {
    categoryId: number;
    categoryName: string;
    description: string;
}

export interface CreateCategoryRequest {
    categoryName: string;
    description: string;
}

export interface ISpecification {
    specID: number;
    screen?: string;
    cpu?: string;
    ram?: string;
    storage?: string;
    camera?: string;
    battery?: string;
    os?: string;
}


export interface IOrder {
    orderID: number;
    order_date: string;
    status: string;
    userID?: number;
}

export interface IOrderDetail {
    orderDetailID: number;
    orderID: number;
    productID: number;
    quantity: number;
}


export interface ProductImage {
    id: number;
    url: string;
    img_index: number;
}

export interface Specification {
    specId?: number;
    screen: string;
    cpu: string;
    ram: string;
    storage: string;
    camera: string;
    battery: string;
    os: string;
}

export interface IProduct {
    productId?: number;
    name: string;
    price: number;
    stockQuantity: number;
    description?: string;
    brandId: number;

    supplierId: number;
    categoryId: number;
    specification: Specification;
    productImages?: ProductImage[];
}

export interface CartDetailRequestDTO {
    cartId: number;
    ProductID: number;
}

export interface CartDetailResponse {
    cartDetailsId: number;
    cartId: number;
    product: IProduct;
}

export interface CartDTO {
    cartId: number;
    userId: number;
    status: string;
}

export interface ResourceResponse<T> {
    data: T;
}

export type AddToCartRequest = CartDetailRequestDTO;


export interface CreateOrderDetailRequest {
    orderID: number;
    productID: number;
    quantity: number;
}

export interface OrderDetailResponse {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
}

export interface OrderDetailItem {
    product: IProduct;
    quantity: number;
}

export interface PayPalPaymentRequest {
    localOrderId: string;
    amount: number;
    currency: string;
    description: string;
}

export interface PayPalCreateResponse {
    approvalUrl: string;
}

export interface Notification {
    notificationId: number;
    title: string;
    notificationType: 'PERSONAL' | 'PROMOTION' | 'SYSTEM' | 'ORDER'; // thêm type nếu backend mở rộng
    content: string;           // message thực tế
    isRead: boolean;
    // createdAt có thể có hoặc không, tùy backend trả về
    // createdAt?: string;
}
export interface OrderProduct {
    productID: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string | null;
}

export interface OrderRequest {
    userID: number;
    status: string;
    paymentStatus: string;
    orderDate?: string;
    deliveryPhone?: string;
    deliveryAddress?: string;
}



export interface OrderFullResponse {
    orderId: number;
    orderDate: string;
    status: string;
    paymentStatus: string;
    deliveryPhone?: string | null;
    deliveryAddress?: string | null;
    userId: number;
    userName: string;
    userEmail: string;
    subTotal: number;
    discountAmount: number;
    totalAmount: number;
    products: {
        productID: number;
        name: string;
        price: number;
        quantity: number;
        imageUrl?: string | null;
    }[];
}




export interface IReview {
    ReviewID: number;
    ProductID: number;
    OrderID?: number;
    UserID: number;
    Avatar: string;
    FullName: string;
    Rating: number;
    Comment: string;
    Photo?: string;
    Video?: string;
    CreatedAt: string | Date;
}

export interface Brand {
    brandId: number;
    name: string;
    country: string;
    description?: string;
}

export interface BrandCreateRequest {
    name: string;
    country: string;
    description?: string;
}

export interface OrderResponse {
    orderID: number;
    orderDate: string;
    status: string;
    paymentMethod?: string;
    userID?: number;
    note?: string;
}

export interface ISupplier {
    supplierId: number;
    supplierName: string;
}

export interface IBatch {
    batchID: number;
    productID: number;
    productionDate: string;
    quantity: number;
    priceIn: number;
    expiry: string;
}

export interface IStockIn {
    stockInID: number;
    batchID: number;
    name: string;
    quantity: number;
    userName: string;
    date: string;
    note: string;
}

export interface IStockOut {
    stockOutID: number;
    batchID: number;
    name: string;
    quantity: number;
    userName: string;
    date: string;
    note: string;
}

export interface IStockInRequest {
    productId: number;
    productionDate: string;
    quantity: number;
    priceIn: number;
    expiry: string;
    note: string;
}

export interface IStockOutRequest {
    BatchID: number;
    quantity: number;
    note: string;
}

export interface ApiResponse<T> {
    data: T;
}

export interface LaravelPaginationResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export interface MonthlyOrderStatistic {
    thang: number;
    soLuong: number;
    doanhThu: number;
}

export interface SalesAndQuantityResponse {
    data: MonthlyOrderStatistic[];
    tongDoanhThu: number;
    tongDonHang: number;
    years: number[];
}

export interface OrderStatusStatistic {
    availableYears: number[];
    selectedYear?: number | null;
    selectedMonth?: number | null;
    selectedDay?: number | null;
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
}

export interface InventoryStatisticResponse {
    availableYears: number[];
    selectedYear: number | null;
    selectedMonth: number | null;
    selectedDay: number | null;
    items: InventoryStatisticItem[];
}

export interface InventoryStatisticItem {
    product: {
        productId: number;
        productName: string;
        imageUrl?: string;
        quantity: number;
    };
    supplier: {
        supplierName?: string | null;
    };
    batch: {
        batchId: number;
        expiryDate?: string | null;
    };
}

export interface Discount {
    id?: number;

    code: string;
    type: "PERCENT" | "FIXED";
    value: number;

    maxDiscountAmount?: number | null;
    minOrderValue?: number | null;

    startDate?: string | null;
    endDate?: string | null;

    usageLimit?: number | null;
    usedCount?: number;

    active: boolean;

    created_at?: string;
    updated_at?: string;
}

export interface CreateOrderResponse {
    orderID: number;
    orderDate: string;
    status: string;
    userID?: number;
}

export interface OrderSummaryResponse {
    orderId: number;
    status: string;
    paymentStatus: string;
    subTotal: number;
    discountAmount: number;
    totalAmount: number;
}

export interface CategoryDropdownProps {
    categories: ICategory[];
    onClose: () => void;
}