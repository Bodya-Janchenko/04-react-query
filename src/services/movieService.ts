//  import axios from "axios";
//  import type { Movie } from "../types/movie";

//  const url = "https:api.themoviedb.org/3/search/movie";
//  const token = import.meta.env.VITE_TMDB_TOKEN;

//  export interface MovieResponse {
//    results: Movie[];
//  }

//  export async function fetchMovies(
//    query: string,
//    page: number = 1
//  ): Promise<Movie[]> {
//    try {
//      const response = await axios.get<MovieResponse>(url, {
//        headers: {
//          accept: "application/json",
//          Authorization: `Bearer ${token}`,
//        },
//        params: {
//          query,
//          include_adult: false,
//          language: "en-US",
//          page,
//        },
//      });
//      console.log(response);
//      return response.data.results;
//    } catch (error) {
//      console.error("Помилка при запиті до TMDB API:", error);
//      return [];
//    }
//  }

import axios from "axios";
import type { Movie } from "../types/movie";

interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

const url: string = "https://api.themoviedb.org/3/search/movie";
const token = import.meta.env.VITE_TMDB_TOKEN as string;

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page,
    },
  });
  console.log(response);
  return response.data;
};
