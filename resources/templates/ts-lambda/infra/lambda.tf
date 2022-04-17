resource "aws_iam_role" "iam_for_lambda" {
  name = "${var.lambda_function_name}_iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "function" {
  function_name = var.lambda_function_name
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "dist/index.handler"
  s3_bucket     = var.s3_lambda_bucket
  s3_key        = var.s3_lambda_key

  runtime = "nodejs14.x"

  environment {
    variables = {
      NODE_ENV = "production"
      NODE_OPTIONS = "--enable-source-maps"
    }
  }
}


resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/${var.lambda_function_name}"
  retention_in_days = 14
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "${var.lambda_function_name}_lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}
