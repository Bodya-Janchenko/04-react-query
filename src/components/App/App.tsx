import { useState } from "react";
import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";

import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

import type { Movie, MovieResponse } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);

  const handleSearch = (topic: string) => {
    setQuery(topic);
  };

  const { data, isLoading, isError, isSuccess } = useQuery<
    MovieResponse,
    Error,
    MovieResponse
  >({
    queryKey: ["fetchMovies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (query !== "" && !isLoading && !isError && data?.results.length === 0) {
      toast.error("No movies found for your request");
    }
  }, [data, isLoading, isError, query]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const totalPages = data?.total_pages ?? 0;

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <MovieGrid movies={data?.results ?? []} onSelect={handleMovieClick} />

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}
