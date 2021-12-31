prepare:
	npm ci
build:
	npm run build
package:
	rm -r node_modules
	npm ci --only=production
	zip -rq9 lambda.zip node_modules dist
upload:
	aws s3 cp ./lambda.zip s3://$(AWS_LAMBDA_BUCKET)/$(AWS_LAMBDA_KEY)
deploy:
	aws lambda update-function-code \
		--region $(AWS_REGION) \
		--function-name $(AWS_LAMBDA_FUNCTION_NAME) \
		--s3-bucket $(AWS_LAMBDA_BUCKET) \
		--s3-key $(AWS_LAMBDA_KEY) --publish
clean:
	rm ./lambda.zip
	npm ci

all: prepare build package upload deploy clean
	@echo "Done"
