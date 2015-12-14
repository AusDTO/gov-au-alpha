#!/usr/bin/env ruby
# scuff remover, remove bad mark(down file)s

require 'digest/md5'

mdfiles = []
mdfilenames = []
emptymdfiles = []
hashedmdfiles = {}
for mdfile in Dir['**/*.md']
  print mdfile +"\n"
  mdfiles << mdfile
  mdfilenames << File.basename(mdfile)
  if File.open(mdfile).size < 2
    emptymdfiles << mdfile
  end
  hash = Digest::MD5.file(mdfile).hexdigest
  hashedmdfiles[hash] = []
  hashedmdfiles[hash] << mdfile
end
htmlfiles = []
htmlfilenames = []
usedmdfilenames = []
for htmlfile in Dir['{_layouts,_posts,_includes}/**/*.{html}']
  print htmlfile+"\n"
  htmlfiles << htmlfile
  htmlfilenames << File.basename(htmlfile)
  File.read(htmlfile).each_line do |li|
    result = /({% include.*)\/(.*.md)/.match(li)
    if result
      usedmdfilenames << result[2]
    end

  end
end

# duplicate markdown file name
#print "dupes: "+ (mdfilenames.detect { |e| mdfilenames.count(e) > 1 }).join(",")
# duplicate html file name
#print "dupes: "+ (htmlfilenames.detect { |e| htmlfilenames.count(e) > 1 }).join(",")
# unused markdown file
print "\n unused: "+ (mdfilenames - usedmdfilenames).join("\n")
# markdown file with identical content
#print "identical: "+ (hashedmdfiles.detect { |e| count(hashedmdfiles[e]) > 1 }).join(",")
# markdown file empty
print "\n empty: "+ (emptymdfiles).join("\n")
# html pointing to nonexistent markdown file
print "\n noexist: "+ (usedmdfilenames - mdfilenames).join("\n")