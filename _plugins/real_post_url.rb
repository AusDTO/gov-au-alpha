# Jekyll URL Helper Filter Plugin with CDN Support
# Version: 1.0.0
# Release Date: 2013-05-24
# License: MIT
# (c) Copyright Jhaura Wachsman, http://jhaurawachsman.com
module Jekyll
  module Tags
    class RealPostUrl < PostUrl
      def render(context)
        url = super
        baseurl = context.registers[:site].config['baseurl']
        baseurl+url
      end
    end
  end
end

Liquid::Template.register_tag('real_post_url', Jekyll::Tags::RealPostUrl)