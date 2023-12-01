import { ErrorTypes } from '../enums'
import { IErrorResponse, IResultFailure, IValidationErrorResponse } from '../types'

export class ErrorResponse {
  readonly status: number
  readonly body: IErrorResponse | IValidationErrorResponse<any>
  readonly error: IResultFailure

  private constructor (status: number, error: IResultFailure) {
    this.status = status
    this.error = error
    this.body = this.getBody()
  }

  private readonly getBody = (): IErrorResponse | IValidationErrorResponse<any> => {
    if (this.error.errorType !== ErrorTypes.VALIDATION) {
      return { error: this.error.message }
    }

    const errors: string[] = []
    const fields: any = {}

    this.error.errors.forEach(error => {
      if (error.field.length === 0) {
        errors.push(error.message)
      } else {
        const arr = fields[error.field]
        fields[error.field] = Array.isArray(arr) ? arr : []
        fields[error.field].push(error.message)
      }
    })

    return { errors, fields }
  }

  static create = (error: IResultFailure): ErrorResponse => {
    let status: number = 400
    switch (error.errorType) {
      case ErrorTypes.NOT_FOUND:
        status = 404
        break
      case ErrorTypes.AUTHORIZATION:
        status = 403
        break
      default:
        break
    }

    return new ErrorResponse(status, error)
  }
}

// export function errorResponse<T> (error: IResultFailure): IErrorResponse | IValidationErrorResponse<T> {
//   if (error.errorType !== ErrorTypes.VALIDATION) {
//     return { error: error.message }
//   }

//   const errors: string[] = []
//   const fields: any = {}

//   error.errors.forEach(error => {
//     if (error.field.length === 0) {
//       errors.push(error.message)
//     } else {
//       const arr = fields[error.field]
//       fields[error.field] = Array.isArray(arr) ? arr : []
//       fields[error.field].push(error.message)
//     }
//   })

//   return { errors, fields }
// }
