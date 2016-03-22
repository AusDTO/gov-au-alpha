#!/bin/bash

# Exit immediately if any commands return non-zero
set -e
# Output the commands we run
set -x

update_s3() {
  #FIXME create IAM user
  aws s3 sync _site s3://${s3bucket} --delete --acl public-read --cache-control "public, max-age=604800"
}

main() {
  update_s3
}

main $@
