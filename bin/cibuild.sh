# Setup Ruby
curl -s -o use-ruby https://repository-cloudbees.forge.cloudbees.com/distributions/ci-addons/ruby/use-ruby
RUBY_VERSION=$(cat .ruby-version) . ./use-ruby
gem install --conservative bundler
bundle install

# Run jekyll build
bundle exec jekyll build

