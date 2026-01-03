import { api } from '../config';
import type {
  Team,
  Car,
  Part,
  CarPart,
  CarPartDetail,
  PaginatedResponse,
  PartFilters,
  CarPartFilters,
  CarFilters,
} from '../types/models';

const buildQueryString = (filters: Record<string, any>): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

export const fetchTeams = async (): Promise<PaginatedResponse<Team>> => {
  return api.get('/api/teams/');
};

export const fetchTeam = async (id: number): Promise<Team> => {
  return api.get(`/api/teams/${id}/`);
};

export const fetchCars = async (filters?: CarFilters): Promise<PaginatedResponse<Car>> => {
  const queryString = filters ? buildQueryString(filters) : '';
  return api.get(`/api/cars/${queryString}`);
};

export const fetchCar = async (id: number): Promise<Car> => {
  return api.get(`/api/cars/${id}/`);
};

export const fetchParts = async (filters?: PartFilters): Promise<PaginatedResponse<Part>> => {
  const queryString = filters ? buildQueryString(filters) : '';
  return api.get(`/api/parts/${queryString}`);
};

export const fetchPart = async (id: number): Promise<Part> => {
  return api.get(`/api/parts/${id}/`);
};

export const fetchLifecycleWarnings = async (): Promise<Part[]> => {
  return api.get('/api/parts/lifecycle_warnings/');
};

export const fetchCarParts = async (filters?: CarPartFilters): Promise<PaginatedResponse<CarPart>> => {
  const queryString = filters ? buildQueryString(filters) : '';
  return api.get(`/api/car-parts/${queryString}`);
};

export const fetchCarPart = async (id: number): Promise<CarPartDetail> => {
  return api.get(`/api/car-parts/${id}/`);
};

export const fetchActiveCarParts = async (): Promise<PaginatedResponse<CarPart>> => {
  return api.get('/api/car-parts/active/');
};

export const fetchCarPartHistory = async (carId: number): Promise<PaginatedResponse<CarPart>> => {
  return api.get(`/api/car-parts/by-car/${carId}/`);
};
