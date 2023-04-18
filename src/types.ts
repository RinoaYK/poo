// export type TMovieDB = {
//     id: string,
//     title: string,
//     duration: number,
//     created_at: string
// }

export interface TMovieDB {
    id: string,
    title: string,
    duration: number,
    created_at: string
}

export interface UpdateMovieInputDTO {
    title: string | undefined,
    duration: number | undefined
}
//dto = objeto transferencia de dados