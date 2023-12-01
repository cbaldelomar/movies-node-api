import { ErrorTypes } from '../enums'
import {
  IResultError, IResultSuccess, IResultValidationError, IValidationError,
  ResultErrorType, ResultValidationErrorType
} from '../types'

export class ResultSuccess<T> implements IResultSuccess<T> {
  readonly success: true
  readonly data: T

  private constructor (data: T) {
    this.success = true
    this.data = data
  }

  static create = (data: any): ResultSuccess<any> => {
    return new ResultSuccess(data)
  }
}

export class ResultError implements IResultError {
  readonly success: false
  readonly errorType: ResultErrorType
  readonly message: string

  private constructor (message: string, errorType: ResultErrorType) {
    this.success = false
    this.errorType = errorType
    this.message = message
  }

  static create (message: string, errorType: ResultErrorType): ResultError {
    return new ResultError(message, errorType)
  }
}

export class ResultValidationError implements IResultValidationError {
  readonly success: false
  readonly errorType: ResultValidationErrorType
  readonly errors: IValidationError[]

  private constructor (errors: IValidationError[], errorType: ResultValidationErrorType) {
    this.success = false
    this.errors = errors
    this.errorType = errorType
  }

  static create (errors: IValidationError[] | IValidationError): ResultValidationError {
    let errors2: IValidationError[] = []

    if (Array.isArray(errors)) {
      errors2 = errors
    } else {
      errors2.push(errors)
    }

    return new ResultValidationError(errors2, ErrorTypes.VALIDATION)
  }
}

export class ValidationError implements IValidationError {
  readonly field: string
  readonly message: string

  private constructor (field: string, message: string) {
    this.field = field
    this.message = message
  }

  static create (field: string, message: string): ValidationError {
    return new ValidationError(field, message)
  }
}
