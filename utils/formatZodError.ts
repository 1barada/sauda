import { ZodIssue, ZodError } from "zod"

const formatZodIssue = (issue: ZodIssue): string => {
  const { path, message } = issue
  const pathString = path.join('.')

  return `${pathString}: ${message}`
}

export const formatZodError = (error: ZodError): string => {
  const { issues } = error

  return issues.map(issue => formatZodIssue(issue)).join(' | ');
}