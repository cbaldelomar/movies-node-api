export enum AssociationAlias {
  Genres = 'genres',
  Movies = 'movies'
}

export enum SqlFunction {
  LOWER = 'LOWER',
  UUID_TO_BIN = 'UUID_TO_BIN'
}

export enum ErrorMessage {
  MOVIE_NOT_EXISTS = 'Movie does not exists',
  MOVIE_EXISTS = 'Movie already exists',
  INVALID_MOVIE_GENRE = 'Invalid genre name',
  INVALID_MOVIE_ID = 'Invalid ID',
  CREATE_MOVIE_ERROR = 'Error registering movie.',
  UPDATE_MOVIE_ERROR = 'Error updating movie.',
  DELETE_MOVIE_ERROR = 'Error deleting movie.'
}

export enum ErrorType {
  NOT_FOUND = 404,
  AUTHORIZATION = 403,
  VALIDATION = 400
}
