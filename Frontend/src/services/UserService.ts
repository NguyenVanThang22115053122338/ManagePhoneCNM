import axios, { isAxiosError } from 'axios';
import type { LoginResponse } from './Interface';
import axiosClient from './AxiosClient';
import type { IUser } from './Interface';
import type {
  IRegisterRequest, RegisterResponse, VerifyMailResponse,
  ResendMailResponse, UpdateUserResponse, DeleteUserResponse
  , ICreateUserRequest, ICreateUserResponse
} from './Interface';

export const login = async (
  sdt: string,
  passWord: string
): Promise<LoginResponse> => {
  try {
    const response = await axiosClient.post<LoginResponse>(
      '/api/user/login',
      {
        sdt,
        passWord,
      }
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Đăng nhập thất bại');
    }
    throw new Error('Đăng nhập thất bại');
  }
};

export const loginWithGoogle = async (
  idToken: string
): Promise<LoginResponse> => {
  try {
    const response = await axiosClient.post<LoginResponse>(
      'api/user/login-google',
      {
        id_token: idToken
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Đăng nhập thất bại');
    }
    throw new Error('Đăng nhập thất bại');
  }
}

export const register = async (
  userData: IRegisterRequest
): Promise<RegisterResponse> => {
  try {
    const res = await axiosClient.post("/api/user/register", userData);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
    throw new Error("Đăng ký thất bại");
  }
};

export const verifyMail = async (
  Email: string,
  code: string
): Promise<VerifyMailResponse> => {
  try {
    const res = await axiosClient.post("/api/user/verify-email",
      {
        Email,
        code
      });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Xác thực thất bại");
    }
    throw new Error("Xác thực  thất bại");
  }
};

export const ResendMail = async (
  Email: string
): Promise<ResendMailResponse> => {
  try {
    const res = await axiosClient.post("/api/user/resend-code", { Email });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Gửi mã thất bại");
    }
    throw new Error("Gửi mã thất bại");
  }
};

export const getAllUsers = async (): Promise<IUser[]> => {
  const token = localStorage.getItem("accessToken");

  const res = await axiosClient.get('/api/users', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data.data;
};

export const updateUser = async (
  sdt: string,
  data: {
    fullName?: string;
    email?: string;
    address?: string;
  },
  avatarFile?: File | null
): Promise<UpdateUserResponse> => {
  try {
    const formData = new FormData();

    if (data.fullName !== undefined) {
      formData.append('fullName', data.fullName.trim());
    }

    if (data.email !== undefined) {
      formData.append('email', data.email.trim());
    }

    if (data.address !== undefined) {
      formData.append('address', data.address.trim());
    }

    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    // debug
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // 🔥 ĐỔI put → post
    const res = await axiosClient.post<UpdateUserResponse>(
      `/api/user/update`,
      formData
    );


    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Cập nhật người dùng thất bại'
      );
    }
    throw new Error('Cập nhật người dùng thất bại');
  }
};


export const deleteUser = async (sdt: string): Promise<DeleteUserResponse> => {
  try {
    const res = await axiosClient.delete<DeleteUserResponse>(`/api/user/${sdt}`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Xóa người dùng thất bại');
    }
    throw new Error('Xóa người dùng thất bại');
  }
};
export const createUser = async (data: ICreateUserRequest): Promise<ICreateUserResponse> => {
  try {
    const response = await axiosClient.post<ICreateUserResponse>(
      `/api/users`,
      data,
    );

    return response.data;
  } catch (error: any) {
    console.error("❌ Create user error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Tạo tài khoản thất bại");
  }
};

export const updatePhone = async (sdt: string): Promise<{ sdt: string }> => {
  try {
    const res = await axiosClient.post('/api/user/update-phone', { sdt });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Cập nhật số điện thoại thất bại'
      );
    }
    throw new Error('Cập nhật số điện thoại thất bại');
  }
};


export const changePassword = async (
  newPassword: string,
  oldPassword?: string | null
): Promise<{ message: string }> => {
  try {
    const res = await axiosClient.post('/api/user/change-password', {
      newPassword,
      oldPassword,
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Đổi mật khẩu thất bại'
      );
    }
    throw new Error('Đổi mật khẩu thất bại');
  }
};

export const userService = {
  updateUser,
  updatePhone,
  changePassword,
};