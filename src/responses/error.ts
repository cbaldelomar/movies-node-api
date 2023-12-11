import { ZodError } from 'zod'
import { ErrorType } from '../enums'
import {
  IErrorResponse, ResultFailure,
  IValidationError, IValidationErrorResponse
} from '../types'

export class ErrorResponse {
  readonly status: number
  readonly body: IErrorResponse | IValidationErrorResponse
  readonly error: Error

  constructor (error: Error) {
    this.error = error
    this.body = this.getBody()
    this.status = this.getStatus()
  }

  private readonly isZodError = (): boolean => this.error instanceof ZodError

  private readonly getStatus = (): number => {
    if (this.isZodError()) return ErrorType.VALIDATION

    return (this.error as ResultFailure).errorType
  }

  private readonly getBody = (): IErrorResponse | IValidationErrorResponse => {
    let validationErrors: IValidationError[] = []

    if (this.isZodError()) {
      const error = this.error as ZodError

      validationErrors = error.issues.map(issue => {
        const field = issue.path.join('.')
        return { field, message: issue.message }
      })
    } else {
      const error = this.error as ResultFailure
      if (error.errorType !== ErrorType.VALIDATION) {
        return { error: error.message }
      }

      validationErrors = error.errors
    }

    const errors: string[] = []
    const fields: any = {}

    validationErrors.forEach(error => {
      if (error.field.length === 0) {
        errors.push(error.message)
      } else {
        const field = error.field
        const arr = fields[field]
        fields[field] = Array.isArray(arr) ? arr : []
        fields[field].push(error.message)
      }
    })

    return { errors, fields }
  }
}

type Error = ResultFailure | ZodError

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
