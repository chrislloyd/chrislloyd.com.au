begin
  require File.join(File.dirname(__FILE__), '.bundle', 'environment')
rescue LoadError
  require 'bundler'
  Bundler.setup
end

Bundler.require :default
require 'rmagick'

configure do
  ENV['TZ'] = 'Australia/Sydney'

  set :app_file => 'poacher.rb'
  set :haml => {:format => :html5}
  set :sass => {:load_paths => [File.join(Sinatra::Application.public,'sass')]}
end
