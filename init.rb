ENV['RACK_ENV'] ||= 'development'

require 'rubygems'
require 'bundler'
Bundler.setup

require 'sinatra'
require 'haml'
require 'sass'
require 'rdiscount'

configure do
  set :app_file => 'poacher.rb'
  set :haml => {:format => :html5}
  set :sass => {:load_paths => [File.join(Sinatra::Application.public,'sass')]}
end

configure :production do
  ENV['APP_ROOT'] ||= File.dirname(__FILE__)
end
