export enum AssociationAlias {
  Genres = 'genres',
  Movies = 'movies'
}

export enum SqlFunctions {
  LOWER = 'LOWER',
  UUID_TO_BIN = 'UUID_TO_BIN'
}

export enum ErrorMessages {
  MOVIE_NOT_EXISTS = 'Movie does not exists',
  MOVIE_EXISTS = 'Movie already exists',
  INVALID_MOVIE_GENRE = 'Invalid genre name',
  INVALID_MOVIE_ID = 'Invalid ID',
  CREATE_MOVIE_ERROR = 'Error registering movie.',
  UPDATE_MOVIE_ERROR = 'Error updating movie.',
  DELETE_MOVIE_ERROR = 'Error deleting movie.'
}

export enum ErrorTypes {
  NOT_FOUND,
  AUTHORIZATION,
  VALIDATION
}
