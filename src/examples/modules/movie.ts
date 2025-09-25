import type { IModule } from "../../interfaces/project.interface";
import { movieForm } from "../components/forms/movie.form";
import { movieEpisodeForm } from "../components/forms/movieEpisode.form";
import { movieGenreForm } from "../components/forms/movieGenre.form";
import { movieList } from "../components/lists/movie.list";
import { movieEpisodeList } from "../components/lists/movieEpisode.list";
import { movieGenreList } from "../components/lists/movieGenre.list";

export const movieModule: IModule = {
  id: "movieModule",
  title: "Episódio",
  icon: "movie",
  components: [
    movieForm,
    movieList,
    movieGenreForm,
    movieGenreList,
    movieEpisodeForm,
    movieEpisodeList
  ]
}

