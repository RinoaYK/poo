import express, { Request, Response } from "express";
import cors from "cors";
import { TMovieDB, UpdateMovieInputDTO } from "./types";
// import { db } from "./database/BaseDatabase";
import { Movie } from "./models/Movie";
import { MovieDatabase } from "./database/MovieDatabase";

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

//get All Movies
app.get("/movies", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as  string | undefined;

    const movieDatabase = new MovieDatabase()
    const moviesDB = await movieDatabase.findMovies(q)


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

// create Movie
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

    // const [movieDBExists]: TMovieDB[] | undefined[] = await db("movies").where({
    //   id,
    // });

    const movieDatabase = new MovieDatabase()
    const movieDBExists = await movieDatabase.findMovieById(id)

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

    // await db("movies").insert(newMovieDB);
    await movieDatabase.insertMovie(newMovieDB)

    res.status(201).send({ message:"Video adicionado com sucesso!",newMovie})

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
    // const id = req.params.id;
    
    const {id} = req.params;

    // const newTitle = req.body.title as string | undefined;
    // const newDuration = req.body.duration as number | undefined;

    const {title, duration} = req.body as UpdateMovieInputDTO;

    // const [movieDBExists]: TMovieDB[] | undefined[] = await db("movies").where({
    //   id,
    // });
    
    const movieDatabase = new MovieDatabase()
    const movieDBExists = await movieDatabase.findMovieById(id)

    if (!movieDBExists) {
      res.status(400);
      throw new Error("'id' não encontrado!");
    }
    
    // if (typeof newTitle !== "string") {
    //   res.status(400);
    //   throw new Error("'title' deve ser string");
    // }

    // if (typeof newDuration !== "number") {
    //   res.status(400);
    //   throw new Error("'duration' deve ser number");
    // }
    if(title){
    if (typeof title !== "string") {
      res.status(400);
      throw new Error("'title' deve ser string");
    }}
if(duration){
    if (typeof duration !== "number") {
      res.status(400);
      throw new Error("'duration' deve ser number");
    }}
  //   const newMovie = new Movie(
  //     id,
  //     newTitle || movieDBExists.title,
  //     newDuration || movieDBExists.duration,
  //     movieDBExists.created_at
  //   );   

  // const newMovieDB: TMovieDB ={
  //     id: movieDBExists.id,
  //     title: newMovie.getTitle(),
  //     duration: newMovie.getDuration(),        
  //     created_at: movieDBExists.created_at
  // }

  const updateMovie = new Movie (
    movieDBExists.id,
    movieDBExists.title,  
    movieDBExists.duration,
    movieDBExists.created_at
  )

  title && (updateMovie._title = title)
  duration && (updateMovie._duration = duration)
  
  const newMovieDB: TMovieDB = {
    id: updateMovie._id,
    title: updateMovie._title,
    duration: updateMovie._duration,
    created_at: updateMovie._createdAt
  }

//   const newMovieDB: TMovieDB ={
//     id: movieDBExists.id,
//     title: newMovie._title,
//     duration: newMovie._duration,        
//     created_at: movieDBExists.created_at
// }

  // await db("movies").update(newMovieDB).where({ id });
  await movieDatabase.updateMovie(newMovieDB)

  // res.status(201).send({ message:"Video atualizado com sucesso!",newMovie});
  
    res.status(201).send({ message:"Video atualizado com sucesso!",updateMovie});
  

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

    // const [movieDBExists]: TMovieDB[] | undefined[] = await db("movies").where({
    //   id: idToDelete,
    // });

    const movieDatabase = new MovieDatabase()
    const movieDBExists = await movieDatabase.findMovieById(idToDelete)

    if (!movieDBExists) {
      res.status(400);
      throw new Error("Filme não encontrado");
    }

    // await db("movies").del().where({ id: idToDelete });

    await movieDatabase.deleteMovie(idToDelete)

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