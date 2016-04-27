# GOV.AU alpha - a prototype

This GOV.AU prototype shows how 'joined-up' government services could look and work for users.

We're designing government information so that people don’t have to understand the structure of government to get things done.

## Technology

The technology for the alpha was chosen to make iterations of the prototype quick and easy. This allowed
us to make changes to the prototype, test the prototype on users and learn from that as quickly
as possible.

The GOV.AU alpha was built using static HTML and CSS. We used the static site generator [Jekyll](https://jekyllrb.com/).

## No future development of this alpha code

There will be no continued development of this code as it is a "throwaway" prototype which was built
to demonstrate the idea and test out on users, not as a sustainable base for future development. The
development of the GOV.AU beta will be using technology intended for production use.

### Setup
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

### Running + developing

Serve app locally:

``` bash
jekyll serve
```

### Website
open http://localhost:4000/

### Hosting in subpath
Change in config.yml baseurl: "/_site" (no trailing slash)
Clear cached versions: "rm -rfv _site/* .asset-cache/*"

## Copyright & License

Copyright Digital Transformation Office. Licensed under the MIT license. See LICENSE file for more details.
