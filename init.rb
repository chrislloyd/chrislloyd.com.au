begin
  require File.join(File.dirname(__FILE__), '.bundle', 'environment')
rescue LoadError
  require 'bundler'
  Bundler.setup
end

Bundler.require :default

configure do
  ENV['TZ'] = 'Australia/Sydney'

  set :app_file => 'poacher.rb'
  set :sass => {:load_paths => [File.join(Sinatra::Application.public,'sass')]}
end
