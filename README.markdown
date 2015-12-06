# gov-au-alpha

## Important
PLEASE NOTE: The existence of this project is not yet public. Please do not alter the permissions or name of this repo without discussing with the group.

## About

### Tech

* Ruby 2.2.3
* Jekyll

## Setup
On OSX, you will need XCode Command Line tools (for Git and compilers, included in XCode or standalone), Homebrew and [rbenv](https://github.com/rbenv/rbenv) (to install ruby 2.2.3 safely):
``` bash
xcode-select --install
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install rbenv ruby-build
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
rbenv install 2.2.3
```

Once you have Git and Ruby:

``` bash
git clone git@github.com:AusDTO/gov-au-alpha.git
cd gov-au-alpha
bundle install
```

## Running + developing

Serve app locally:

``` bash
jekyll serve
```

## Website
open http://localhost:4000/

