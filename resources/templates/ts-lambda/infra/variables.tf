# Input variable definitions

variable "aws_region" {
  description = "AWS region for all resources."
  type        = string
}

variable "lambda_function_name" {
  description = "Value of the Name for the lambda function"
  type        = string
}

variable "s3_lambda_bucket" {
  description = "Lambda bucket to store lambda archive"
  type        = string
}

variable "s3_lambda_key" {
  description = "Lambda key to store lambda archive"
  type        = string
}
