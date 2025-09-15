import type { IModule } from "../../interfaces/project.interface";
import { movieForm } from "../components/forms/movie.form";
import { movieGenreForm } from "../components/forms/movieGenre.form";
import { movieList } from "../components/lists/movie.list";
import { movieGenreList } from "../components/lists/movieGenre.list";

export const movieModule: IModule = {
  id: "movieModule",
  title: "Filme",
  icon: "movie",
  components: [
    movieForm,
    movieList,
    movieGenreForm,
    movieGenreList,
  ]
}