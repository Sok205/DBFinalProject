export interface Team {
  team_id: number;
  name: string;
  country?: string;
  principal_name?: string;
}

export interface Car {
  car_id: number;
  car_number: number;
  chassis_number: string;
  status: string;
  team: number;
  team_name?: string;
}

export interface Part {
  part_id: number;
  part_type: string;
  serial_number: string;
  fia_lifecycle_limit?: number;
  manufacturer?: string;
  lifecycle_percentage?: number;
  needs_replacement?: boolean;
  current_mileage?: number;
  is_installed?: boolean;
}

export interface CarPart {
  car_part_id: number;
  car: number;
  part: number;
  car_number?: number;
  chassis_number?: string;
  part_type?: string;
  serial_number?: string;
  manufacturer?: string;
  fia_lifecycle_limit?: number;
  installed_at: string;
  removed_at?: string;
  mileage?: number;
  lifecycle_percentage?: number;
  is_active?: boolean;
}

export interface CarPartDetail extends CarPart {
  car_details?: Car;
  part_details?: Part;
}

export interface Person {
  person_id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  role: string;
  certification_level?: string;
  team: number;
  team_name?: string;
}

export interface GarageBay {
  bay_id: number;
  garage: number;
  garage_location?: string;
  bay_number: number;
  is_active: boolean;
}

export interface Garage {
  garage_id: number;
  team: number;
  team_name?: string;
  location: string;
  season_year: number;
  bays?: GarageBay[];
}

export interface Session {
  session_id: number;
  race_name: string;
  session_type: string;
  session_date: string;
}

export interface CarSession {
  car_session_id: number;
  car: number;
  session: number;
  bay?: number;
  status: string;
  car_number?: number;
  race_name?: string;
  session_type?: string;
  bay_number?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface PartFilters {
  part_type?: string;
  manufacturer?: string;
  serial_number?: string;
  search?: string;
  ordering?: string;
  page?: number;
}

export interface CarPartFilters {
  car?: number;
  part?: number;
  is_active?: boolean;
  part_type?: string;
  search?: string;
  ordering?: string;
  page?: number;
}

export interface CarFilters {
  team?: number;
  status?: string;
  search?: string;
  ordering?: string;
  page?: number;
}
