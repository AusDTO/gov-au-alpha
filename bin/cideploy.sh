#!/bin/bash

# Exit immediately if any commands return non-zero
set -e

# cause a pipeline (for example, curl -s http://sipb.mit.edu/ | grep foo) to produce a failure return code of the command that fails, not just the last command of the pipeline.
set -o pipefail

# Output the commands we run
set -x

# Allow for extended file globbing
# needed for invalidating the cdn
shopt -s extglob


update_s3() {
  #FIXME create IAM user
  aws s3 sync _site s3://${s3bucket}/alpha --delete --acl public-read --cache-control "public, max-age=604800"
}

invalidate_cloudfront() {
  aws configure set preview.cloudfront true
  aws cloudfront create-invalidation --distribution-id ${cloudfrontid} --paths /\*
}

main() {
  update_s3
  invalidate_cloudfront
}

main $@
