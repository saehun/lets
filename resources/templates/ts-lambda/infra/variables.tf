# Input variable definitions

variable "aws_region" {
  description = "AWS region for all resources."
  type    = string
  default = "ap-northeast-2"
}

variable "lambda_function_name" {
  description = "Value of the Name for the lambda function"
  type        = string
  default     = "ExampleHandler"
}

variable "s3_lambda_bucket" {
  description = "Lambda bucket to store lambda archive"
  type        = string
  default     = "your-s3-bucket"
}

variable "s3_lambda_key" {
  description = "Lambda key to store lambda archive"
  type        = string
  default     = "path/to/lambda.zip"
}
