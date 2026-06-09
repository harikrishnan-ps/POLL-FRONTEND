export interface LoginDto {
  username: string;
  password?: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password?: string;
}

export interface AuthResponseDto {
  token: string;
  refreshToken: string;
  username: string;
  role: string;
}

export interface UserState {
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
}
