import express, { Request, Response } from "express";
import cors from "cors";
import { TMovieDB } from "./types";
import { db } from "./database/knex";
import { Movie } from "./models/Movie";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!Pong!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

//get Movies
app.get("/movies", async (req: Request, res: Response) => {
  try {
    const q = req.query.q;

    let moviesDB;

    if (q) {
      const result: TMovieDB[] = await db("movies").where(
        "title",
        "LIKE",
        `%${q}%`
      );
      moviesDB = result;
    } else {
      const result: TMovieDB[] = await db("movies");
      moviesDB = result;
    }

    const movies: Movie[] = moviesDB.map(
      (movieDB) =>
        new Movie(
          movieDB.id,
          movieDB.title,
          movieDB.duration,
          movieDB.created_at
        )
    );
    res.status(200).send(movies);
    
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

//create Movie
app.post("/movies", async (req: Request, res: Response) => {
  try {
    const { id, title, duration } = req.body;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser string");
    }

    if (typeof title !== "string") {
      res.status(400);
      throw new Error("'title' deve ser string");
    }

    if (typeof duration !== "number") {
      res.status(400);
      throw new Error("'duration' deve ser number");
    }

    const [movieDBExists]: TMovieDB[] | undefined[] = await db("movies").where({
      id,
    });

    if (movieDBExists) {
      res.status(400);
      throw new Error("'id' já existe");
    }

    // const currentDate = new Date();
    // const options = { timeZone: 'America/Sao_Paulo' };
    // const currentDateTime = currentDate.toLocaleString('pt-BR', options);

    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    
    
    const newMovie = new Movie(
        id,
        title,
        duration,        
        formattedDate
    )

    const newMovieDB: TMovieDB ={
        id: newMovie.getId(),
        title: newMovie.getTitle(),
        duration: newMovie.getDuration(),        
        created_at: newMovie.getCreatedAt()
    }

    await db("movies").insert(newMovieDB);
    const [movieDB]: TMovieDB[] = await db("movies").where({ id });

    res.status(201).send({message:"Video adicionado com sucesso!", movieDB});

  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

//edit movie
app.put("/movies/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    const newTitle = req.body.title as string | undefined;
    const newDuration = req.body.duration as number | undefined;

    const [movieDBExists]: TMovieDB[] | undefined[] = await db("movies").where({
      id,
    });

    if (!movieDBExists) {
      res.status(400);
      throw new Error("'id' não encontrado!");
    }
    
    if (typeof newTitle !== "string") {
      res.status(400);
      throw new Error("'title' deve ser string");
    }

    if (typeof newDuration !== "number") {
      res.status(400);
      throw new Error("'duration' deve ser number");
    }

    const newMovie = new Movie(
      id,
      newTitle || movieDBExists.title,
      newDuration || movieDBExists.duration,
      movieDBExists.created_at
    );   

  const newMovieDB: TMovieDB ={
      id: movieDBExists.id,
      title: newMovie.getTitle(),
      duration: newMovie.getDuration(),        
      created_at: movieDBExists.created_at
  }

  await db("movies").update(newMovieDB).where({ id });
  const [movieDB]: TMovieDB[] = await db("movies").where({ id });

  res.status(201).send(movieDB);

  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

//delete Movie
app.delete("/movies/:id", async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;

    const [movieDBExists]: TMovieDB[] | undefined[] = await db("movies").where({
      id: idToDelete,
    });

    if (!movieDBExists) {
      res.status(400);
      throw new Error("Filme não encontrado");
    }

    await db("movies").del().where({ id: idToDelete });

    res.status(200).send("Filme deletado com sucesso!");

  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado!");
    }
  }
});