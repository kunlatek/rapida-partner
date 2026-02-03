import type { IDataChart } from "../../../interfaces/data-chart.interface";

export const movieGenreChart: IDataChart = {
  title: "Gêneros de Filmes",
  id: "movieGenreChart",
  componentType: "dataChart",
  icon: "movie",
  guards: "isAuthenticated",
  chartType: "bar",
  dataSource: {
    endpoint: "/movies",
    paramType: "query",
  },
  dimensions: {
    width: "100%",
    height: "400px",
  },
  data: {
    labels: {
      property: "movieGenre.name",
    },
    datasets: [
      {
        label: "Gêneros de filmes",
        property: "movieGenresId",
        backgroundColor: "#4F46E5",
        borderColor: "#4F46E5",
        borderWidth: 1,
        fill: true,
        aggregator: "count",
      },
    ],
  }
}