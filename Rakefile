begin
  require File.join(File.dirname(__FILE__), '.bundle', 'environment')
rescue LoadError
  require 'bundler'
  Bundler.setup
end

Bundler.require :tools

task :dev do
  exec 'bundle exec shotgun --require init --server thin --host 127.0.0.1 --port 4567 poacher.rb'
end

task :page do
  print 'Name: '
  name = STDIN.gets.chomp

  filename = "pages/#{name.downcase.gsub(' ','-')}.haml"
  File.open(filename, 'w') do |f|
    f.puts <<-EOF
-# title: #{name}
-# published: #{Time.now.strftime("%Y-%m-%d %H:%M")}
    EOF
  end
  system "#{ENV['EDITOR']} #{filename}"
end

task :buildjs do
  require 'open-uri'
  compiler = YUI::JavaScriptCompressor.new
  js = [
    'http://github.com/jashkenas/coffee-script/raw/0.6.2/extras/coffee-script.js',
    'http://github.com/DmitryBaranovskiy/raphael/raw/master/raphael.js',
    'http://github.com/danwrong/code-highlighter/raw/master/code_highlighter.js',
    'http://github.com/danwrong/code-highlighter/raw/master/ruby.js',
    'http://github.com/danwrong/code-highlighter/raw/master/javascript.js',
    'lib/json.js'
  ].map {|lib|
    puts "Compiling #{lib}"
    compiler.compress open(lib).read
  }.join("\n")
  File.open('public/libs.js','w'){|f| f.write(js)}
end
