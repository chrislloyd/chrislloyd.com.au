begin
  require File.join(File.dirname(__FILE__), '.bundle', 'environment')
rescue LoadError
  require 'bundler'
  Bundler.setup
end

Bundler.require :tools

task :dev do
  exec 'bundle exec shotgun --require ./init --server thin --host 127.0.0.1 --port 4567'
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

task 'public/libs.js' do |t|
  require 'open-uri'
  compiler = YUI::JavaScriptCompressor.new
  js = [
    'http://github.com/jashkenas/coffee-script/raw/0.7.2/extras/coffee-script.js',
    'http://github.com/DmitryBaranovskiy/raphael/raw/v1.4.7/raphael.js',
    'http://github.com/danwrong/code-highlighter/raw/master/code_highlighter.js',
    'http://github.com/danwrong/code-highlighter/raw/master/ruby.js',
    'http://github.com/danwrong/code-highlighter/raw/master/javascript.js',
    'lib/json.js'
  ].map {|lib|
    puts "Compiling #{lib}"
    open(lib).read
    # compiler.compress open(lib).read
  }.join("\n")
  File.open(t.name,'w'){|f| f.write(js)}
end
