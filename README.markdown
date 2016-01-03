# gov-au-alpha

## Important
PLEASE NOTE: The existence of this project is not yet public. Please do not alter the permissions or name of this repo without discussing with the group.

## About

### Tech

* Ruby 2.2.3
* Jekyll

## Setup
On OSX, you will need XCode Command Line tools (for Git and compilers, included in XCode or standalone), Homebrew and [rbenv](https://github.com/rbenv/rbenv) (to install ruby 2.2.3 safely):

(you might also like to try https://github.com/postmodern/chruby and https://github.com/postmodern/ruby-install)

``` bash
xcode-select --install
sudo xcodebuild -license
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install rbenv ruby-build
echo 'export PATH="$HOME/.rbenv/shims:$PATH"' >> ~/.bash_profile
echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
rbenv install 2.2.3
```
On ubuntu:
``` bash
sudo apt-get install ruby build-essential git
git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/shims:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
rbenv install 2.2.3
```

Once you have Git and Ruby:

``` bash
git clone git@github.com:AusDTO/gov-au-alpha.git
cd gov-au-alpha
gem install bundler
bundle install
```

## Running + developing

Serve app locally:

``` bash
jekyll serve
```

## Website
open http://localhost:4000/

