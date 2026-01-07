import axios, { isAxiosError } from 'axios';
import type { LoginResponse } from './Interface';
import axiosClient from './AxiosClient';
import type { IUser } from './Interface';
import type { IRegisterRequest, RegisterResponse, VerifyMailResponse, ResendMailResponse  } from './Interface';

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

export const loginWithGoogle=async(
  idToken: string
): Promise<LoginResponse>=>{
      try {
          const response = await axiosClient.post<LoginResponse>(
            'api/user/login-google',
            { 
                id_token:idToken
            }
          );
          return response.data;
      } catch (error: any) {
        if(axios.isAxiosError(error)&&error.response){
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
    const res = await axiosClient.post("/api/user/resend-code", {Email});
    return res.data;
  } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data?.message || "Gửi mã thất bại");
      }
      throw new Error("Gửi mã thất bại");
  }
};

export const getAllUsers = async (): Promise<LoginResponse[]> => {
  const token = localStorage.getItem("accessToken");

  const res = await axiosClient.get('/api/user', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};

export const userService = {
  updateUser: async (
    userId: number,
    data: {
      fullName?: string;
      email?: string;
      address?: string;
    },
    avatarFile?: File | null
  ): Promise<IUser> => {
    const formData = new FormData();

    // Tạo DTO chỉ chứa các field cần cập nhật
    // Nếu không thay đổi → gửi undefined → backend sẽ bỏ qua (giữ nguyên giá trị cũ)
    const dto: {
      fullName?: string | null;
      email?: string    | null;
      address?: string | null;
    } = {};

    if (data.fullName !== undefined) dto.fullName = data.fullName.trim() || null;
    if (data.email !== undefined) dto.email = data.email.trim() || null;
    if (data.address !== undefined) dto.address = data.address.trim() || null;

    // BẮT BUỘC append key "data" dưới dạng JSON string
    formData.append('data', JSON.stringify(dto));

    // Append avatar nếu có
    if (avatarFile) {
      formData.append('avatar', avatarFile, avatarFile.name);
    }

    const response = await axiosClient.put<IUser>(`/api/user/${userId}`, formData);

    return response.data;
  },
};
