export interface Starship {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  mglt: string;
  starship_class: string;
  pilots: string[];
  films: string[];
}

export interface StarshipsListResult {
  starships: Starship[];
  page: number;
  limit: number;
  total_records: number;
  total_pages: number;
}
