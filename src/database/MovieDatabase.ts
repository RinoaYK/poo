import { TMovieDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class MovieDatabase extends BaseDatabase {
  public static TABLE_MOVIES = "movies";

  public async findMovies(q: string | undefined): Promise<TMovieDB[]> {
    let moviesDB;

    if (q) {
      const result: TMovieDB[] = await BaseDatabase.connection(
        MovieDatabase.TABLE_MOVIES
      ).where("title", "LIKE", `%${q}%`);
      moviesDB = result;
    } else {
      const result: TMovieDB[] = await BaseDatabase.connection(
        MovieDatabase.TABLE_MOVIES
      );
      moviesDB = result;
    }
    return moviesDB;
  }

  public async findMovieById(id: string): Promise<TMovieDB | undefined> {
    const [movieDB]: TMovieDB[] | undefined[] = await BaseDatabase.connection(
      MovieDatabase.TABLE_MOVIES
    ).where({ id });
    return movieDB;
  }

  public async insertMovie(newMovieDB: TMovieDB): Promise<void> {
    await BaseDatabase.connection(MovieDatabase.TABLE_MOVIES).insert(
      newMovieDB
    );
  }

  public async updateMovie(newMovieDB: TMovieDB): Promise<void> {
    await BaseDatabase.connection(MovieDatabase.TABLE_MOVIES)
      .update(newMovieDB)
      .where({ id: newMovieDB.id });
  }

  public async deleteMovie(id: string): Promise<void> {
    await BaseDatabase.connection(MovieDatabase.TABLE_MOVIES)
      .del()
      .where({ id });
  }
}
